ServerSocket.on("ChatRoomMessage", function (data) { ChatRoomMessageAdd(data); });
//该脚本不需要加载CommonBotAssets
if (typeof ChatRoomMessageAdditionDict === 'undefined') {
    ChatRoomMessageAdditionDict = {}
}

function ChatRoomMessageAdd(data) {

    // Make sure the message is valid (needs a Sender and Content)
    if ((data != null) && (typeof data === "object") && (data.Content != null) && (typeof data.Content === "string") && (data.Content != "") && (data.Sender != null) && (typeof data.Sender === "number")) {

        // Make sure the sender is in the room
        var SenderCharacter = null;
        for (var C = 0; C < ChatRoomCharacter.length; C++)
            if (ChatRoomCharacter[C].MemberNumber == data.Sender) {
                SenderCharacter = ChatRoomCharacter[C]
                break;
            }

        // If we found the sender
        if (SenderCharacter != null) {

            // Replace < and > characters to prevent HTML injections
            var msg = data.Content;
            while (msg.indexOf("<") > -1) msg = msg.replace("<", "&lt;");
            while (msg.indexOf(">") > -1) msg = msg.replace(">", "&gt;");


            // This part is to append code react to certain message
            for (var key in ChatRoomMessageAdditionDict) {
                ChatRoomMessageAdditionDict[key](SenderCharacter, msg, data)
            }
        }
    }
}

ChatRoomMessageAdditionDict["LDH"] = function (sender, msg, data) { ChatRoomMessageLeashDroneHelper(sender, msg, data) };

function ChatRoomMessageLeashDroneHelper(sender, msg, data) {
    if ((data.Type === "Action") && (msg.startsWith("ServerEnter"))) {
        setTimeout(PlayerEnter(sender), 300, sender)
    }
}

function PlayerEnter(sender) {
    ServerSend("ChatRoomChat", { Content: "*该bot现已发布至 https://github.com/zajucd/BC_BotGame ", Type: "Emote", Target: sender.MemberNumber });
    ServerSend("ChatRoomChat", { Content: "*游玩该游戏需要需要插件:https://openuserjs.org/scripts/zajucd/LeashDrone 且不需要本bot，加载插件后即可游玩", Type: "Emote", Target: sender.MemberNumber });
    ServerSend("ChatRoomChat", { Content: "*若进入bot右侧砖块地板后瞬移至小房间内，即代表插件加载成功", Type: "Emote", Target: sender.MemberNumber });
    ServerSend("ChatRoomChat", { Content: "*查看bot的bio以获取更多指令", Type: "Emote", Target: sender.MemberNumber });

}
const Equips =
    [
        {
            "AssetGroup": "ItemHood",
            "Item": "DroneMask",
            "Name": "无人机面具",
            "Description": "抹去无人机的个性，确保统一性。",
            "Color": "#222222,#CCCCCC,#CC33CC,#00F4FD,#E700CA",
            "Property": "Normal",
            "Lock": "",
            "Private": false,
            "ItemProperty": {
                "OverridePriority": 12,
                "Text": "DRONE"
            },
            "Type": null,
            "TypeRecord": {
                "m": 0,
                "e": 0,
                "p": 5,
                "g": 0,
                "s": 1,
                "h": 0,
                "j": 2
            },
            "DifficultyFactor": 4
        },
        {
            "AssetGroup": "ItemEars",
            "Item": "FuturisticEarphones",
            "Name": "无人机接收器",
            "Description": "抹去无人机的听觉，确保指令传达。",
            "Color": "Default,#50913C,Default",
            "Property": "Normal",
            "Lock": "",
            "Private": false,
            "ItemProperty": {},
            "Type": null,
            "TypeRecord": {
                "typed": 0
            }
        },
        {
            "AssetGroup": "ItemMouth",
            "Item": "LatexRespirator",
            "Name": "无人机管道",
            "Description": "供应氧气、营养、催情药物，确保生命体征。",
            "Color": "#333333,#222222,#CCCCCC,#222222,#CCCCCC,#CC33CC",
            "Property": "Normal",
            "Lock": "",
            "Private": false,
            "ItemProperty": {
                "OverridePriority": {
                    "Filter": 55,
                    "FilterFixing": 55,
                    "FilterGlow": 55,
                    "SmallTube": 55,
                    "SmallTubeGlow": 55,
                    "Tube": 55,
                    "TubeGlow": 55
                }
            },
            "Type": null,
            "TypeRecord": {
                "f": 2,
                "g": 1,
                "s": 0,
                "m": 2,
                "l": 1
            }
        },
        {
            "AssetGroup": "ItemMouth3",
            "Item": "FuturisticPanelGag",
            "Name": "无人机口塞",
            "Description": "抹去无人机表达能力，确保安静。",
            "Color": "#CC33CC,Default,Default,Default",
            "Property": "Normal",
            "Lock": "",
            "Private": false,
            "ItemProperty": {
                "ShowText": true,
                "OriginalSetting": 0
            },
            "Type": null,
            "TypeRecord": {
                "g": 0,
                "p": 0,
                "t": 0
            }
        },
        {
            "AssetGroup": "ItemArms",
            "Item": "ShinyArmbinder",
            "Property": "Normal",
            "Lock": "",
            "Name": "无人机束缚",
            "Description": "抹去无人机活动能力，确保秩序。",
            "Color": "#202020,Default,Default,Default",
            "Private": false,
            "TypeRecord": {
                "typed": 3
            },
            "ItemProperty": {
                "OverridePriority": {
                    "Band_Xcross": 7
                }
            }
        },
        {
            "AssetGroup": "ItemNeck",
            "Item": "FuturisticCollar",
            "Name": "无人机项圈",
            "Description": "识别无人机信息，确保可管理性",
            "Color": "#CC33CC,Default,Default,Default",
            "Property": "Normal",
            "Lock": "",
            "Private": false,
            "ItemProperty": {
                "OpenPermission": false,
                "OpenPermissionChastity": false,
                "OpenPermissionArm": false,
                "OpenPermissionLeg": false,
                "BlockRemotes": false
            },
            "Type": null,
            "TypeRecord": null
        },
        {
            "AssetGroup": "ItemBreast",
            "Item": "FuturisticBra",
            "Name": "无人机显示器",
            "Description": "显示无人机生命体征，确保易管理性",
            "Color": "#CC33CC,#FFFFFF,#889FA7,Default,Default",
            "Property": "Normal",
            "Lock": "",
            "Private": false,
            "ItemProperty": {},
            "Type": null,
            "TypeRecord": {
                "typed": 2
            }
        },
        {
            "AssetGroup": "ItemPelvis",
            "Item": "FuturisticChastityBelt",
            "Name": "无人机贞操带",
            "Description": "管理无人机的性欲，确保正常工作。",
            "Color": "#CC33CC,#CC33CC,Default,Default,Default,Default,#222222,#CC33CC,Default",
            "Property": "Normal",
            "Lock": "",
            "Private": false,
            "ItemProperty": {},
            "Type": null,
            "TypeRecord": {
                "m": 1,
                "f": 1,
                "b": 1,
                "t": 2,
                "o": 0
            }
        },
        {
            "AssetGroup": "Suit",
            "Item": "LatexCatsuit",
            "Color": "#202020,Default,#FFFFFF,#CC33CC",
            "TypeRecord": {
                "typed": 0,
                "Text": "SLAVE",
                "Text2": "#7092",
                "Text3": ""
            },

        },
        {
            "AssetGroup": "SuitLower",
            "Item": "LatexCatsuit",
            "Color": "#202020,Default,#FFFFFF",
            "TypeRecord": {
                "typed": 0
            }
        },
        {
            "AssetGroup": "Necklace",
            "Item": "CatsuitCollar",
            "Color": "#202020",
        },
        {
            "AssetGroup": "Socks",
            "Item": "LeatherSocks1",
            "Color": "#000000",
        }
    ];
const EquipsHang = [
    {
        "AssetGroup": "ItemBoots",
        "Item": "FuturisticHeels2",
        "Property": "Normal",
        "Lock": "",
        "Name": "无人机鞋",
        "Description": "抹去无人机自主移动能力",
        "Color": "Default,#CC33CC,Default,Default,Default,#aaaaaa,Default",
        "Private": false,
        "TypeRecord": {
            "typed": 0
        },
        "ItemProperty": {}
    },
    {
        "AssetGroup": "ItemLegs",
        "Item": "FuturisticLegCuffs",
        "Property": "Normal",
        "Lock": "",
        "Name": "无人机铐",
        "Description": "抹去无人机自主移动能力",
        "Color": "Default,#CC33CC,#707070,Default",
        "Private": false,
        "TypeRecord": {
            "typed": 1
        },
        "ItemProperty": {}
    },
    {
        "AssetGroup": "ItemFeet",
        "Item": "FuturisticAnkleCuffs",
        "Property": "Normal",
        "Lock": "",
        "Name": "无人机铐",
        "Description": "抹去无人机自主移动能力",
        "Color": "Default,#CC33CC,#707070,Default",
        "Private": false,
        "TypeRecord": {
            "typed": 1
        },
        "ItemProperty": {}
    },
    {
        "AssetGroup": "ItemDevices",
        "Item": "TheHangingFrame",
        "Property": "Normal",
        "Lock": "",
        "Name": "无人机运输装置",
        "Description": "运输无人机至指定地点，确保工作效率。",
        "Color": "Default,Default,Default,Default",
        "Private": false,
        "TypeRecord": {
            "typed": 0
        },
        "ItemProperty": {}
    },
    {
        "AssetGroup": "ItemAddon",
        "Item": "CeilingChain",
        "Property": "Normal",
        "Lock": "",
        "Name": "无人机运输装置",
        "Description": "运输无人机至指定地点，确保工作效率。",
        "Color": "Default",
        "Private": false,
        "TypeRecord": {
            "typed": 2
        },
        "ItemProperty": {}
    }
]
function WearEquips(target, equips, refresh = true) {
    for (let i = 0; i < equips.length; i++)
    {
        WearEquip(target, equips[i], this.lockCode, false);
    }
    if (refresh)
    {
        CharacterLoadEffect(target);
        ChatRoomCharacterUpdate(target);
    }
}
function WearEquip(Target, Equip, lockCode, refresh = true) {
    InventoryWear(
        Target,
        Equip?.Item,
        Equip?.AssetGroup,
        "Default",
        1000,
        7092,
        Equip
    );
    InventoryCraft(Player, Target, Equip.AssetGroup, Object.assign({}, Equip), false);
    InventoryLock(Target, Equip.AssetGroup, { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, 7092);
    let inv = InventoryGet(Target, Equip.AssetGroup);
    if (inv != null && inv.hasOwnProperty("Property")) {
        inv.Property.CombinationNumber = lockCode;
    }

    if (refresh == true) {
        CharacterLoadEffect(sender);
        ChatRoomCharacterUpdate(sender);
    }
}

function InitRoom() {
    const mapData = {
        "Type": "Always",
        "Tiles": "иЮиЮЮЮЮЮЮиЮиЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮиЮЮЮЮЮЮЮЮЮЮиЮЮииЮЮsxxЮииииЮxxЮЮииЮЮsиЮxЮЮxЮиЮЮииЮЮsxxЮЮЮЮЮЮxxЮиииииииииЮииЮЮsиЮxЮxxxxЮxЮиЮиЮииЮЮsxxЮxxxxЮxxЮиЮииЮЮsЮЮxЮЮnnЮЮxЮЮЮиЮииЮЮdnnnnnssnnnnnЮиЮииЮЮdnnnnnnnnnnnnЮиииииииииЮииЮЮdnnnnnnnnnnnnϨЮииЮЮdnnnnnnnnnnnnЮЮииЮЮdnnnnnnnnnnnnЮЮииЮЮdииииииииииииЮииииииииииииЮККККККККККККЮdииЮиииииииЮККККëëëКЮdиииииЮиииииииииЮߐëëКëëߐКëëëКЮdииЮииииЮߐКëКëКߐКëëëКЮdиииииЮииииииииииЮߐëëКëëߐКëëëКЮdииЮииииииииииЮߐКëКëКߐКëëëКЮdиииииЮииииииииииииЮߐëëКëëߐКëëëКЮdииЮииииииииЮߐКëКëКߐКëëëКЮdиииииЮииииииииКККЮߐëëКëëߐКëëëКЮdииЮииииëëЮߐКëКëКߐКëëëКЮdиииииЮииииииëëЮߐëëКëëߐКëëëКЮdииЮиииииииЮߐКëКëКߐКëëëКЮdиииииииииЮииииииииииииЮëКëКëëëКЮdККККККККККККЮККККККККККККЮККККККККККККЮdëëëККëëëëëЮККëКëКëКëКЮККëëëëëëëëЮdëëëëëККëëëëëЮëКëКëКëКëКëКЮëëëКëëëëëëëëЮdëëëëКëКëККëëЮККККККККККККЮëëëКëëëëëëëëЮdКККߐߐߐߐߐߐКëëЮëëëëëëëëëëëëЮëëëКëëëëëëëëЮdКККߐߐߐߐߐߐëëëЮëëëëëëëëëëëëЮëëëКëëëëëëëëЮdКККߐߐߐߐߐߐКККЮëëëëëëëëëëëëЮëëëКëëëëëëëëЮdКККߐߐߐߐߐߐКККЮëëëëëëëëëëëëЮëëëКëëëëëëëëЮdëëëߐߐߐКߐߐКëëЮëëëëëëëëëëëëЮðëðКëëëëëëëëЮdëëКߐߐߐКߐߐКëëЮëëëëëëëëëëëëЮКëëëëëëëëЮdëëКëКККëККëëЮККККККККККККЮКëëëëëëëëЮdëëëëëККëëëëëЮКëКëКëКëКëКëЮКëëëëëëëëЮdëëëëëККëëëЮКëКëКëКëККЮЮЮЮЮЮЮЮЮЮКККЮdККККККККККККЮККККККККККККЮККККККККККККЮК",
        "Objects": "ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd߮dddddddʨdࠖddddddddࠖddࠖࠖࠖࠖࠖࠖࠖࠖࠖࠖࠖddddddd߮dddddddʨdddddࠖࠖddddddddddddddddࠖddʔdʔdd߮dddddddʨdࠖddྴddྴddࠖddddddddddddࠖddddddd߮dddddddʨdddddddddddddddddddddddࠖddʔdʔdd߮dddddddʨdࠖddddddddࠖddddddddddddࠖddddddd߮dddddddʨdddddࠖࠖddddddddddddddddࠖddʔdʔdd߮dddddddddddddddddddddddddddddddࠖddddddd߮dddddddddddddddddddddddddddddddࠖddʔdʔdd߮dddddddddddddddddddddddddddddddࠖddddddd߮dddddddddddddnsddddddࠖࠖࠖࠖࠖࠖࠖࠖࠖࠖࠖddʔdʔdd߮ddddddddddddddddddddddddddddddddddddddd߮dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddྶdddྵddd߮dddddddddddddddddddddddddddddddࠖdddࠖddd߮dddddddddddddddddddྴdddddྵdddddྶdddྵddd߮dddddddddddddddddddddddddddddddࠖdddࠖddd߮dddddddddddddddddddddddddddddddྶdddྵddd߮dddddddddddddddddddddddddddddddࠖdddࠖddd߮ddddddddddddddddd dddddddddddddྶdddྵddd߮dddddddddddddddddddddྵdddddddddࠖdddࠖddd߮dddddddddddddddddddddddddddddddྶdddྵddd߮dddddddddddddddddྴdྭdྵdddddddddࠖdddࠖddd߮dddddddddddddddddddddddddddddddྶdddྵddd߮dddddddddddddddddddddddddddddddࠖdddࠖddd߮dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddЮdЮdЮdЮdddddddddddddddddddddྵddddddd¢dddddddddddddࠖdddddddddddddddddddddddddྶdྶdྭdྮdྴdྭdddࠖdddddddddddddddddddddddddddddddddddddddࠖdddddddddddddddddddddddddddddddddddddddࠖdddddddddddddddddddddddddddddddddddddddࠖdddddddddddddddddddddddddddddddddddddddࠖdddddddddddddddddddddddddddddddddddddddࠖdddddddddddddddddddddddddddddddddddddd߮ࠖ߮dddddddddddddddddddddddddྮdྴdྭdྮdྴdྴddࠖddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddЮdЮdЮdЮddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
    }
    ChatRoomData.MapData = mapData;
    ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: ChatRoomData, Action: "Update" });
    //传送至入口处
    TPSelf({ X: 4, Y: 8 })
}
function TPSelf(Pos, DoEnterTile = true) {
    Player.MapData.Pos = { X: Pos.X, Y: Pos.Y };
    ServerSend("ChatRoomCharacterMapDataUpdate", Pos);
}
function InitBot() {
    RemoveClothes(Player, false);
    RemoveRestrains(Player, false)
    WearEquips(Player, Equips,false);
    WearEquips(Player, EquipsHang);

    Player.Description = `
BOT game：LeashDrone
作者: zajucd(7092)
原型: https://github.com/keykey5/BC-BOT-repository
发布地址: https://github.com/zajucd/BC_BotGame

游玩需要插件:https://openuserjs.org/scripts/zajucd/LeashDrone
不建议与其他插件共同使用

可通过两位玩家进入入口上方玻璃门后的小房间的门内开始游戏,
也可通过使用invite与accept指令开始游戏

可用指令(仅在插件生效时可用)
邀请 : (/d invite 玩家名称)可向房间内对应玩家发出邀请(玩家名称可用编号或昵称代替)
接受邀请 : (/d accept)接受收到的邀请并开始游戏
初始化房间 : (/d initRoom) 初始化房间，需要房间管理员权限
放弃游戏 : (/d giveUp) 放弃游戏，判定为失败


`
    // end of description
    ServerSend("AccountUpdate", { Description: Player.Description });
    ChatRoomCharacterUpdate(Player);

    InitRoom();
}

InitBot();
