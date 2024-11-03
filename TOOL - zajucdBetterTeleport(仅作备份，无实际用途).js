
ChatRoomMessageAdditionDict["BetterTeleportC"] = function (SenderCharacter, msg, data) { ChatRoomMessageBetterTeleportC(SenderCharacter, msg, data) };
function ChatRoomMessageBetterTeleportC(SenderCharacter, msg, data) {
    if (data.Type === "Hidden" && msg.includes("zajucdtpcheck")) {
        setTimeout(function () { ServerSend("ChatRoomChat", { Content: "zajucdtpok", Type: "Hidden", Target: SenderCharacter.MemberNumber }); }, 200);
    }
    else if (data.Type === "Hidden" && msg.includes("zajucdtpreq")) {
        if (data.Dictionary.MemberNumber === Player.MemberNumber) {
            ChatRoomMapViewMovement = null;
            Player.MapData.Pos = data.Dictionary.Pos;
            ServerSend("ChatRoomCharacterMapDataUpdate", data.Dictionary.Pos);
        }
    }
}

function ServerDisconnect(data, close = false) {
    if (data == "ErrorRateLimited") {
        alert("快速传送插件可能与其他插件冲突，建议暂时关闭其他插件.")
    }
    if (!ServerIsConnected) return;
    console.warn("Server connection lost");
    const ShouldRelog = Player.Name != "";
    let msg = ShouldRelog ? "Disconnected" : "ErrorDisconnectedFromServer";
    if (data) {
        console.warn(data);
        msg = data;
    }
    ServerSetConnected(false, msg);
    if (close) {
        ServerSocket.disconnect();
        // If the error was duplicated login, we want to reconnect
        if (data === "ErrorDuplicatedLogin") {
            ServerInit();
        }
    }

    if (ShouldRelog) {
        if (CurrentScreen != "Relog") {

            // Exits out of the chat room or a sub screen of the chatroom, so we'll be able to get in again when we log back
            if (ServerPlayerIsInChatRoom()) {
                ChatRoomHideElements();
                CurrentScreen = "ChatSearch";
                CurrentModule = "Online";
                CurrentCharacter = null;
            }

            // Keeps the relog data
            RelogData = { Screen: CurrentScreen, Module: CurrentModule, Character: CurrentCharacter };
            CurrentCharacter = null;
            CommonSetScreen("Character", "Relog");

        }
    }

    // Raise a notification to alert the user
    if (!document.hasFocus()) {
        NotificationRaise(NotificationEventType.DISCONNECT);
    }
}

ChatRoomMessageAdditionDict["BetterTeleportS"] = function (SenderCharacter, msg, data) { ChatRoomMessageBetterTeleportS(SenderCharacter, msg, data) };

function ChatRoomMessageBetterTeleportS(SenderCharacter, msg, data) {
    if ((data.Type == "Action") && (msg.startsWith("ServerEnter"))) {
        ServerSend("ChatRoomChat", { Content: "zajucdtpcheck", Type: "Hidden", Target: SenderCharacter.MemberNumber });
    }
    else if (data.Type === "Hidden" && msg.includes("zajucdtpok")) {
        if (typeof betterTpCharacters === 'undefined') {
            betterTpCharacters = [];
        }
        if (betterTpCharacters.indexOf(SenderCharacter.MemberNumber) < 0) {
            ServerSend("ChatRoomChat", { Content: "*传送优化脚本已生效.", Type: "Emote", Target: SenderCharacter.MemberNumber });
            betterTpCharacters.push(SenderCharacter.MemberNumber);
        }

    }
}

ServerSend("ChatRoomChat", { Content: "zajucdtpcheck", Type: "Hidden" });

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
function HoldLeash(sender) {
    const Dictionary = new DictionaryBuilder()
        .sourceCharacter(Player)
        .targetCharacter(sender)
        .build();
    ServerSend("ChatRoomChat", { Content: "HoldLeash", Type: "Hidden", Target: sender.MemberNumber });
    if (ChatRoomLeashList.indexOf(sender.MemberNumber) < 0)
        ChatRoomLeashList.push(sender.MemberNumber);
}
function StopHoldLeash(sender) {
    const Dictionary = new DictionaryBuilder()
        .sourceCharacter(Player)
        .targetCharacter(sender)
        .build();
    ServerSend("ChatRoomChat", { Content: "StopHoldLeash", Type: "Hidden", Target: sender.MemberNumber });
    if (ChatRoomLeashList.indexOf(sender.MemberNumber) >= 0)
        ChatRoomLeashList.splice(ChatRoomLeashList.indexOf(sender.MemberNumber), 1);
}

function wearLeash(sender) {
    InventoryWear(sender, "CollarLeash", "ItemNeckRestraints", "Default", 80);
    var inv = InventoryGet(sender, "ItemNeckRestraints").Property;
    if (inv === undefined || inv === null) {
        InventoryGet(sender, "ItemNeckRestraints").Property = { OverridePriority: 1 }
    }
    else {
        InventoryGet(sender, "ItemNeckRestraints").Property.OverridePriority = 1;
    }
    ChatRoomCharacterUpdate(sender);
}
async function Teleport(sender, x, y) {
    try {
        if (sender.MemberNumber === Player.MemberNumber)
            return true;
        if (typeof tpCount === 'undefined') {
            tpCount = 0;
        }
        tpCount++;

        if (typeof betterTpCharacters === 'undefined') {
            betterTpCharacters = [];
        }
        //若目标装有betterTeleport则使用指令传送，反之使用牵绳传送
        if (betterTpCharacters.indexOf(sender.MemberNumber) >= 0) {
            console.log("BTP" + sender.MemberNumber);
            ServerSend("ChatRoomChat", { Content: "zajucdtpreq", Type: "Hidden", Dictionary: { MemberNumber: sender.MemberNumber, Pos: { X: x, Y: y } }, Target: sender.MemberNumber });
            await sleep(1000);
        }
        else {
            canTeleport = false;
            if (sender.IsEnclose() || sender.IsSuspended() || sender.IsMounted() || sender.HasEffect("MapImmobile")) {
                InventoryRemove(sender, "ItemDevices");
                InventoryRemove(sender, "ItemAddon");
                InventoryRemove(sender, "ItemNeckRestraints");
                CharacterLoadEffect(sender);
                ChatRoomCharacterUpdate(sender);
                await sleep(100);
            }

            var loc = Player.MapData.Pos;
            var sleepTime = 250
            wearLeash(sender);
            await sleep(sleepTime);
            HoldLeash(sender);
            await sleep(sleepTime);
            ServerSend("ChatRoomCharacterMapDataUpdate", { X: x + 2, Y: y + 2 });
            await sleep(sleepTime);
            ServerSend("ChatRoomCharacterMapDataUpdate", { X: x + 2, Y: y - 2 });
            await sleep(sleepTime);
            ServerSend("ChatRoomCharacterMapDataUpdate", { X: x - 2, Y: y + 2 });
            await sleep(sleepTime);
            ServerSend("ChatRoomCharacterMapDataUpdate", { X: x - 2, Y: y - 2 });
            await sleep(sleepTime);
            ServerSend("ChatRoomCharacterMapDataUpdate", { X: x + 2, Y: y + 2 });
            await sleep(sleepTime);
            ServerSend("ChatRoomCharacterMapDataUpdate", { X: x + 2, Y: y - 2 });
            await sleep(sleepTime);
            ServerSend("ChatRoomCharacterMapDataUpdate", { X: x - 2, Y: y + 2 });
            await sleep(sleepTime);
            ServerSend("ChatRoomCharacterMapDataUpdate", { X: x - 2, Y: y - 2 });
            await sleep(sleepTime);
            StopHoldLeash(sender)
            await sleep(sleepTime);
            InventoryRemove(sender, "ItemNeckRestraints");
            await sleep(sleepTime);
            ChatRoomCharacterUpdate(sender);
            await sleep(sleepTime);
            ServerSend("ChatRoomCharacterMapDataUpdate", { X: loc.X, Y: loc.Y });

            canTeleport = true;
        }


        if (sender.MapData.Pos.X != x && sender.MapData.Pos.Y != y) {
            if (tpCount >= 5) {
                tpCount = 0;
                console.log("TPfail");
                return false;
            }
            console.log("retryTP" + tpCount);
            await sleep(100);
            return await Teleport(sender, x, y);
        }
        else {
            tpCount = 0;
        }
    }
    catch (e) {
        console.log(e);
    }
    return true;



}

async function loop(sender) {
    while (true) {
        await sleep(1000);
        await Teleport(sender, 20, 38);
    }
}

