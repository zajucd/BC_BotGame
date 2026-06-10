//DTS训练设施扩展
//区域：入口（南），建设区（西） 货物搬运（地图四角），服从训练（东北），催眠训练（东南），机体改造（北西），物品出售（北东），操作员休息室（中南），无人机休眠室（中北）

const StockRoom = {
    Areas: [
        { leftUp: { X: 0, Y: 2 }, rightDown: { X: 4, Y: 6 } },
        { leftUp: { X: 35, Y: 2 }, rightDown: { X: 39, Y: 6 } },
        { leftUp: { X: 0, Y: 27 }, rightDown: { X: 4, Y: 31 } },
        { leftUp: { X: 35, Y: 27 }, rightDown: { X: 39, Y: 31 } },
    ],
    Exclude: [
    ],
    Enter: window["StockRoomEnter"],
    Leave: window["StockRoomLeave"]
}

function StockRoomEnter() {
    if (CheckPlayerDroneInfoExistAndIsDrone()) {
        SendMessageToSelf(`已进入仓库区，可在柜子处${styleButton("拿起", StockRoomAction, true)}或${styleButton("放下", StockRoomAction, false)}货物`, "StockRoom")
    }
    else {
        SendMessageToSelf(`已进入仓库区`,"StockRoom")
    }
}
function StockRoomLeave() {
    ClearTagMessage("StockRoom");
}

function StockRoomAction(isTake, isSkipCanInteract = false) {
    var pdi = PlayerDroneInfo();
    if (!IsInZone(Player.MapData.Pos, StockRoom)) {
        SendMessageToSelf(`不位于仓库区`, "StockRoom");
        return;
    }
    if (Player.CanInteract() == false && !isSkipCanInteract) {
        if (Player.IsMounted()) {
            SendMessageToSelf(`手臂与腿脚同时不可用，尝试呼叫调度系统代替操作${styleProgressBar("呼叫中", "已完成", 30000, StockRoomAction, isTake, true)}`, "StockRoom")
        }
        else {
            SendMessageToSelf(`手臂不可用，尝试调整姿态通过腿脚进行操作${styleProgressBar("调整中", "已完成", 10000, StockRoomAction, isTake, true)}`, "StockRoom")
        }
        return;
    }
    if (isTake) {
        if (pdi.items.length < pdi.itemsMax) {
            var index = GetStockIndex();
            pdi.items.push(ItemInfo.StockRoomItem(index));
            SendMessageToSelf(`拿取成功，货物编号${String.fromCharCode(65 + Math.floor(index / 5))}${index % 5 + 1}`, "StockRoom");
        }
        else {
            SendMessageToSelf(`储存单元已满，拿取失败`, "StockRoom")
        }
    }
    else {
        var success = false;
        var here = GetStockIndex();
        for (var i = pdi.missions.length - 1; i >= 0; i--)
        {
            var mission = pdi.missions[i];
            if (mission.name == "StockRoom") {
                for (var j = pdi.items.length - 1; j >= 0; j--) {
                    var item = pdi.items[j];
                    if (item.name == "StockRoom") {
                        if (item.index == mission.from && here == mission.to)
                            success = true;
                    }
                    if (success) {
                        SendMessageToSelf(`放置成功`, "StockRoom");
                        MissionInfo.MissionComplete(mission);
                        break;
                    }
                }
            }
            if (success) {
                break;
            }
        }
        if (!success) {
            SendMessageToSelf(`未携带应放置至此的货物`, "StockRoom");
        }
    }
}
function GetStockIndex() {
    var i;
    for (i = 0; i < StockRoom.Areas.length; i++) {
        if (IsInArea(Player.MapData.Pos, StockRoom.Areas[i])) break;
    }
    var xdiff = Player.MapData.Pos.X - StockRoom.Areas[i].leftUp.X;
    var ydiff = Player.MapData.Pos.Y - StockRoom.Areas[i].leftUp.Y;
    var index = i * 15 + Math.floor(ydiff / 2) * 5 + xdiff;
    if (index < 0) index = 0;
    if (index >= 60) index = 59;
    return index;
}

const Elevator = {
    Areas: [
        { leftUp: { X: 18, Y: 35 }, rightDown: { X: 20, Y: 37 } },
        { leftUp: { X: 30, Y: 35 }, rightDown: { X: 32, Y: 37 } },
        { leftUp: { X: 22, Y: 35 }, rightDown: { X: 24, Y: 37 } },
        { leftUp: { X: 30, Y: 30 }, rightDown: { X: 32, Y: 32 } },
    ],
    Exclude: [
    ],
    Enter: window["ElevatorEnter"],
    Leave: window["ElevatorLeave"]
}

async function ElevatorEnter(nowInZone) {
    var pdi = PlayerDroneInfo();
    switch (nowInZone) {
        case "0": {
            if (pdi.isDrone) {
                SendMessageToSelf("无人机进入设施电梯，即将转移至待命区", "Elevator");
                await sleep(3000);
                var xAdd4 = Object.assign({}, Player.MapData.Pos);
                xAdd4.X += 4;
                if (IsInArea(xAdd4, Elevator.Areas[2]) == false) {
                    xAdd4 = Object.assign({}, Elevator.Areas[2].leftUp)
                }
                MovePlayer(xAdd4);
                await sleep(3000);
                WearEquips(Player, [Crate]);
                SendMessageToSelf("收容仓部署完毕", "Elevator");
                await sleep(3000);
                MovePlayer(RandomPosOfArea(SleepRoom.Areas[0]));
                SendMessageToSelf("已移动至待命区，开始等待系统呼叫", "Elevator");
                SendMessageToSelf(styleProgressBar("等待中", "已呼叫", 30000, async () => {
                    SendMessageToSelf("收到系统呼叫，即将移动至设施主要区域", "Elevator");
                    await sleep(1000);
                    MovePlayer(RandomPosOfArea(Elevator.Areas[3]));
                    RemoveRestrainByOneAssetGroup(Player, Crate.AssetGroup);
                }));
            }
            else if (pdi.isOwner) {
                SendMessageToSelf("操作员进入设施电梯，即将转移至设施主要区域", "Elevator");
                var xAdd12 = Object.assign({}, Player.MapData.Pos);
                xAdd12.X += 12;
                if (IsInArea(xAdd12, Elevator.Areas[1]) == false) {
                    xAdd12 = Object.assign({}, Elevator.Areas[1].leftUp)
                }
                MovePlayer(xAdd12);
                RemoveRestrains
                RemoveRestrainByOneAssetGroup(Player, Crate.AssetGroup);
                RefreshBinds
            }
            else {
                SendMessageToSelf("游客不具备进入设施权限，请注册为无人机或操作员后再尝试进入", "Elevator");
            }
        }
            break;
        case "1": {
            if (pdi.isOwner) {
                SendMessageToSelf("操作员进入设施电梯，即将转移至设施入口", "Elevator");
                var xAdd12 = Object.assign({}, Player.MapData.Pos);
                xAdd12.X -= 12;
                if (IsInArea(xAdd12, Elevator.Areas[0]) == false) {
                    xAdd12 = Object.assign({}, Elevator.Areas[0].leftUp)
                }
                MovePlayer(xAdd12);
            }
            else if (pdi.isDrone) {
                SendMessageToSelf("无人机无权使用操作员电梯，执行惩罚", "Elevator");
                DoPunishment(2, 3);
            }
            else {
                SendMessageToSelf("游客不具备进入设施权限，请注册为无人机或操作员后再尝试进入", "Elevator");
            }
        }
            break;
        case "3": {
            if (pdi.isDrone) {
                SendMessageToSelf("无人机进入设施电梯，即将转移至待命区", "Elevator");
                await sleep(3000);
                var xAdd4 = Object.assign({}, Player.MapData.Pos);
                xAdd4.X += 3;
                if (IsInArea(xAdd4, Elevator.Areas[2]) == false) {
                    xAdd4 = Object.assign({}, Elevator.Areas[2].leftUp)
                }
                MovePlayer(xAdd4);
                await sleep(3000);
                WearEquips(Player, [Crate]);
                SendMessageToSelf("收容仓部署完毕", "Elevator");
                await sleep(3000);
                MovePlayer(RandomPosOfArea(SleepRoom.Areas[0]));
                SendMessageToSelf("已移动至待命区，开始等待系统呼叫", "Elevator");
                SendMessageToSelf(styleProgressBar("等待中", "已呼叫", 30000, async () => {
                    SendMessageToSelf("收到系统呼叫，即将移动至设施设施入口", "Elevator");
                    await sleep(1000);
                    MovePlayer(RandomPosOfArea(Elevator.Areas[0]));
                    RemoveRestrainByOneAssetGroup(Player, Crate.AssetGroup);
                }));
            }
            else if (pdi.isOwner) {
                SendMessageToSelf("操作员请使用南方操作员专用电梯", "Elevator");
            }
            else {
                SendMessageToSelf("游客不具备进入设施权限，请注册为无人机或操作员后再尝试进入", "Elevator");
            }
        }
            break;
    }
    
}

function ElevatorLeave() {
    ClearTagMessage("Elevator");
}

const SleepRoom = {
    Areas: [
        { leftUp: { X: 34, Y: 34 }, rightDown: { X: 39, Y: 39 } },
    ],
    Exclude: [
    ],
}

const ModifyRoom = {
    Areas: [
        { leftUp: { X: 15, Y: 2 }, rightDown: { X: 18, Y: 7 } },
    ],
    Exclude: [
    ],
    Enter: window["ModifyRoomEnter"],
    Leave: window["ModifyRoomLeave"]
}
const ModifyInnerRoom = {
    Areas: [
        { leftUp: { X: 8, Y: 2 }, rightDown: { X: 14, Y: 7 } },
    ],
    Exclude: [
    ],
}

function ModifyRoomEnter() {
    SendMessageToSelf(`已进入改造工坊，${styleButton("显示可用改造", ShowAvailableModify)}`,"ModifyRoom")
}
function ModifyRoomLeave() {
    if (IsInZone(Player.MapData.Pos, ModifyInnerRoom) == false) {
        ClearTagMessage("ModifyRoom")
    }
}

var allModify = {
    eyes1:{
        id: "eyes1",
        name: "植入隐形眼镜显示器",
        desc: "眼部机能可被设为限制",
        price: 10,
        //check: (pdi) => { return (pdi.bodyStatusMax.eyes != undefined && pdi.bodyStatusMax.eyes == 0) },
        effect: (pdi) => { pdi.bodyStatusMax.eyes = 1; },
        front:[]
    },
    ears1:{
        id: "ears1",
        name: "植入耳道填充物",
        desc: "耳部机能可被设为限制",
        price: 10,
        //check: (pdi) => { return (pdi.bodyStatusMax.ears != undefined && pdi.bodyStatusMax.ears == 0) },
        effect: (pdi) => { pdi.bodyStatusMax.ears = 1; },
        front: []
    },
    mouth1:{
        id: "mouth1",
        name: "植入颌骨控制电机",
        desc: "口腔机能可被设为限制",
        price: 10,
        //check: (pdi) => { return (pdi.bodyStatusMax.mouth != undefined && pdi.bodyStatusMax.mouth == 0) },
        effect: (pdi) => { pdi.bodyStatusMax.mouth = 1; },
        front: []
    },
    hands1:{
        id: "hands1",
        name: "植入肩肘控制电机",
        desc: "手臂机能可被设为限制",
        price: 10,
        //check: (pdi) => { return (pdi.bodyStatusMax.hands != undefined && pdi.bodyStatusMax.hands == 0) },
        effect: (pdi) => { pdi.bodyStatusMax.hands = 1; },
        front: []
    },
    legs1:{
        id: "legs1",
        name: "植入膝踝控制电机",
        desc: "腿脚机能可被设为限制",
        price: 10,
        //check: (pdi) => { return (pdi.bodyStatusMax.legs != undefined && pdi.bodyStatusMax.legs == 0) },
        effect: (pdi) => { pdi.bodyStatusMax.legs = 1; },
        front: []
    },
    level1:{
        id: "level1",
        name: "系统升级至1.0版本",
        desc: "刷入下一版本系统固件，解锁更多功能",
        price: 15,
        //check: (pdi) => { return (pdi.level == 0 && GetMinBodyStatusMax(pdi) >=1)},
        effect: (pdi) => { pdi.level = 1; },
        front: ["eyes1", "ears1", "mouth1", "hands1", "legs1", "education1","training1"]
    },



    eyes2:{
        id: "eyes2",
        name: "更换人工电子眼球",
        desc: "眼部机能可被设为离线",
        price: 20,
        //check: (pdi) => { return (pdi.level >= 1 && pdi.bodyStatusMax.eyes != undefined && pdi.bodyStatusMax.eyes == 1) },
        effect: (pdi) => { pdi.bodyStatusMax.eyes = 2; },
        front: ["level1"]
    },
    ears2:{
        id: "ears2",
        name: "植入耳蜗减震器",
        desc: "耳部机能可被设为离线",
        price: 20,
        //check: (pdi) => { return (pdi.level >= 1 && pdi.bodyStatusMax.ears != undefined && pdi.bodyStatusMax.ears == 1) },
        effect: (pdi) => { pdi.bodyStatusMax.ears = 2; },
        front: ["level1"]
    },
    mouth2:{
        id: "mouth2",
        name: "植入声带控制装置",
        desc: "口腔机能可被设为离线",
        price: 20,
        //check: (pdi) => { return (pdi.level >= 1 && pdi.bodyStatusMax.mouth != undefined && pdi.bodyStatusMax.mouth == 1) },
        effect: (pdi) => { pdi.bodyStatusMax.mouth = 2; },
        front: ["level1"]
    },
    hands2:{
        id: "hands2",
        name: "植入手部控制电机",
        desc: "手臂机能可被设为离线",
        price: 20,
        //check: (pdi) => { return (pdi.level >= 1 && pdi.bodyStatusMax.hands != undefined && pdi.bodyStatusMax.hands == 1) },
        effect: (pdi) => { pdi.bodyStatusMax.hands = 2; },
        front: ["level1"]
    },
    legs2:{
        id: "legs2",
        name: "植入胯部控制电机",
        desc: "腿脚机能可被设为离线",
        price: 20,
        //check: (pdi) => { return (pdi.level >= 1 && pdi.bodyStatusMax.legs != undefined && pdi.bodyStatusMax.legs == 1) },
        effect: (pdi) => { pdi.bodyStatusMax.legs = 2; },
        front: ["level1"]
    },
    level2:{
        id: "level2",
        name: "系统升级至2.0版本",
        desc: "刷入下一版本系统固件，解锁更多功能",
        price: 25,
        //check: (pdi) => { return (pdi.level == 1 && GetMinBodyStatusMax(pdi) >= 2) },
        effect: (pdi) => { pdi.level = 2; },
        front: ["eyes2", "ears2", "mouth2", "hands2", "legs2", "education2", "training2"]
    },
    
    battery1:{
        id: "battery1",
        name: "加装膀胱内额外电源",
        desc: "增加50%的续航时间",
        price: 20,
        //check: (pdi) => { return (pdi.batteryMax == 1000) },
        effect: (pdi) => { pdi.batteryMax = 1500; },
        front: []
    },
    battery2:{
        id: "battery2",
        name: "加装肠道内额外电源",
        desc: "增加66%的续航时间",
        price: 30,
        //check: (pdi) => { return (pdi.level >= 1 && pdi.batteryMax == 1500) },
        effect: (pdi) => { pdi.batteryMax = 2500; },
        front: ["level1","battery1"]
    },

    itemsMax1:{
        id: "itemsMax1",
        name: "储存单元扩张",
        desc: "增加一个道具栏上限",
        price: 20,
        //check: (pdi) => { return (pdi.itemsMax == 3) },
        effect: (pdi) => { pdi.itemsMax = 4; },
        front: []
    },
    itemsMax2:{
        id: "itemsMax2",
        name: "储存单元高级扩张",
        desc: "增加一个道具栏上限",
        price: 30,
        //check: (pdi) => { return (pdi.level >= 1 && pdi.itemsMax == 4) },
        effect: (pdi) => { pdi.itemsMax = 5; },
        front: ["level1", "itemsMax1"],
    },

    missionsMax1:{
        id: "missionsMax1",
        name: "记忆单元扩张",
        desc: "增加一个任务栏上限与每日可完成任务上限",
        price: 20,
        //check: (pdi) => { return (pdi.missionsMax == 3) },
        effect: (pdi) => { pdi.missionsMax = 4; },
        front: []
    },
    missionsMax2:{
        id: "missionsMax2",
        name: "记忆单元高级扩张",
        desc: "增加一个任务栏上限与每日可完成任务上限",
        price: 30,
        //check: (pdi) => { return (pdi.level >= 1 && pdi.missionsMax == 4) },
        effect: (pdi) => { pdi.missionsMax = 5; },
        front: ["level1", "missionsMax1"]
    },

    orgasmBatteryGet1:{
        id: "orgasmBatteryGet1",
        name: "升级高潮充能元件",
        desc: "增加100%的高潮获得电量",
        price: 20,
        //check: (pdi) => { return (pdi.orgasmBatteryGet == 100) },
        effect: (pdi) => { pdi.orgasmBatteryGet = 200; },
        front: []
    },
    orgasmBatteryGet2:{
        id: "orgasmBatteryGet2",
        name: "进一步升级高潮充能元件",
        desc: "增加50%的高潮获得电量",
        price: 30,
        //check: (pdi) => { return (pdi.level >= 1 && pdi.orgasmBatteryGet == 200) },
        effect: (pdi) => { pdi.orgasmBatteryGet = 300; },
        front: ["level1", "orgasmBatteryGet1"]
    },

    displayTalkCost1: {
        id: "displayTalkCost1",
        name: "更换高性能显示屏",
        desc: "降低显示屏发言的消耗",
        price: 20,
        effect: (pdi) => { pdi.chatBatteryCost = 30; },
        front: []
    },
    displayTalkCost2: {
        id: "displayTalkCost2",
        name: "更换顶级显示屏",
        desc: "进一步降低显示屏发言的消耗",
        price: 30,
        effect: (pdi) => { pdi.chatBatteryCost = 15; },
        front: ["level1", "displayTalkCost1"]
    },
    dontShow: {
        id: "dontShow",
        name: "不显示，仅作注释使用",
        desc: "训练室可获得：training1，training2，training3，education1，education2，education3",
        price: 30,
        effect: (pdi) => { },
        front: ["dontShow"]
    }


}

var selectModify = "";
function ShowAvailableModify(target = null) {
    var pdi = PlayerDroneInfo();
    if (pdi.isDrone == false && target == null) {
        var input = (document.getElementById("InputChat"));
        input.value = '/DTS findtargetmodify []'
        SendMessageToSelf("请在方括号内输入目标ID并发送指令以获取目标无人机的可用改造", "ModifyRoom");
        return;
    }
    var list = [];
    for (var mod in allModify) {
        if (CanModify(allModify[mod], target) == false) continue
        list.push(Object.assign({}, allModify[mod]));
    }
    var string = "";
    for (var mod of list) {
        string += "\n";
        string += mod.name;
        if (target == null) {
            string += styleButton("选择", (id, desc, price) => {
                selectModify = id;
                SendMessageToSelf(`改造效果：${desc}，所需配额点数：${price}\n进入左方房间内改造舱以开始改造`, "ModifyRoom")
            }, mod.id, mod.desc, mod.price)
        }
        else {
            string += styleButton("选择", (id, desc, price) => {
                SendMessageToSelf(`改造效果：${desc}，所需配额点数：${price}\n对该无人机${styleButton("执行改造", () => {
                    if (target.ownerId != -1 && target.ownerId != Player.MemberNumber) {
                        SendMessageToSelf(`不具有对该无人机的操作权限`, "ModifyRoom");
                        return;
                    }
                    if (price > pdi.coin) {
                        SendMessageToSelf(`配额点数不足无法进行改造`, "ModifyRoom");
                        return;
                    }
                    else {
                        pdi.coin -= price;
                    }
                    SendDTSMsg(target, new MsgInfo("DoModifyByOwner",id))
                    SendMessageToSelf(`已发送改造命令`, "ModifyRoom");
                })}`, "ModifyRoom")
            }, mod.id, mod.desc, mod.price)
        }
    }
    SendMessageToSelf(`可用改造如下：${string}`, "ModifyRoom");

}

function CanModify(mod, target = null) {
    var pdi = null;
    if (target == null) {
        pdi = PlayerDroneInfo();
    }
    else {
        pdi = target;
    }
    if (pdi.modifys[mod.id] != undefined) return false;
    for (var front of mod.front) {
        if (!pdi.modifys[front]) return false;
    }
    return true;
}

const ModifyTile = {
    Areas: [
        { X: 10, Y: 5 },
    ],
    Exclude: [
    ],
    Enter: window["ModifyTileEnter"]
}

function ModifyTileEnter(nowInZone, paid = false) {
    var pdi = PlayerDroneInfo();
    MovePlayer(ModifyTile.Areas[0]);
    if (pdi.isDrone == false) {
        SendMessageToSelf(`非无人机不可进行改造`, "ModifyRoom");
        return;
    }
    if (!allModify[selectModify]) {
        SendMessageToSelf(`未选择改造`, "ModifyRoom");
        return;
    }
    if (CanModify(allModify[selectModify]) == false) {
        SendMessageToSelf(`已选择改造不可用`, "ModifyRoom");
        return;
    }
    if (paid == false) {
        if (allModify[selectModify].price > pdi.coin) {
            SendMessageToSelf(`配额点数不足无法进行改造，执行惩罚`, "ModifyRoom");
            DoPunishment(2, 3);
            return;
        }
        else {
            pdi.coin -= allModify[selectModify].price;
        }
    }
    WearEquips(Player, [Crate]);
    var select = selectModify;
    selectModify = "";
    SendMessageToSelf(`无人机已进入改造舱，关闭改造舱舱门，开始进行改造${styleProgressBar("正在改造", "改造完成", 30000, (select) =>
    {
        var pdi = PlayerDroneInfo();
        var mod = Object.assign({}, allModify[select]);
        mod.effect(pdi);
        pdi.modifys[select] = true;
        SendMessageToSelf(`改造已完成，打开改造舱舱门`, "ModifyRoom");
        RemoveRestrainByOneAssetGroup(Player, Crate.AssetGroup);
    }, select)}`);
}

function DoModifyByOwner(Modifyid) {
    selectModify = Modifyid;
    ModifyTileEnter(0, true);
}

const ShopRoom = {
    Areas: [
        { leftUp: { X: 20, Y: 2 }, rightDown: { X: 32, Y: 7 } },
    ],
    Exclude: [
    ],
    Enter: window["ShopRoomEnter"],
    Leave: window["ShopRoomLeave"]
}
function ShopRoomEnter() {
    SendMessageToSelf(`已进入商店，进入内侧房间以进行购物`, "ShopRoom");
}

function ShopRoomLeave() {
    ClearTagMessage("ShopRoom");
}

var allItem = [
    {
        item: "BatteryItem",
        price :10,
    },
    {
        item: "BindStatusDownItem",
        price: 15,
    },
    {
        item: "BindStatusUpItem",
        price: 5,
    },
    {
        item: "BodyStatusDownItem",
        price: 15,
    },
    {
        item: "BodyStatusUpItem",
        price: 5,
    },
    {
        item: "VibeItem",
        price: 10,
    },
    {
        item: "OrgasmLimitItem",
        price: 10,
    },
    {
        item: "DisplayTalkItem",
        price: 5,
    },
    {
        item: "PrivateRoomItem",
        price: 5,
    },
]

const ShopInnerRoom = {
    Areas: [
        { leftUp: { X: 25, Y: 2 }, rightDown: { X: 27, Y: 3 } },
        { leftUp: { X: 30, Y: 2 }, rightDown: { X: 32, Y: 3 } },
    ],
    Exclude: [
    ],
    Enter: window["ShopInnerRoomEnter"],
    Leave: window["ShopInnerRoomLeave"]
}

function ShopInnerRoomEnter() {
    var string = "可购买道具：";
    for (var itemAndPrice of allItem) {
        var i = ItemInfo[itemAndPrice.item]();
        string += "\n"
        string += i.text;
        string += " 价格：" + itemAndPrice.price;
        string += styleButton("购买", (item, price) => {
            var pdi = PlayerDroneInfo();
            if (pdi.coin < price) {
                SendMessageToSelf(`配额点数不足，无法购买`,"ShopInnerRoom");
                return;
            }
            if (pdi.items.length >= pdi.itemsMax) {
                SendMessageToSelf(`储存单元已满，无法购买`, "ShopInnerRoom");
                return;
            }
            pdi.items.push(ItemInfo[item.item]());
            pdi.coin -= price;
            SendMessageToSelf(`购买成功`, "ShopInnerRoom");
        }, itemAndPrice, itemAndPrice.price);
    }
    SendMessageToSelf(string, "ShopInnerRoom");
}

function ShopInnerRoomLeave() {
    ClearTagMessage("ShopInnerRoom");

}

const WorkRoom = {
    Areas: [
        { leftUp: { X: 0, Y: 12 }, rightDown: { X: 6, Y: 22 } },
    ],
    Exclude: [
    ],
    Enter: window["WorkRoomEnter"],
    Leave: window["WorkRoomLeave"]
}

function WorkRoomEnter() {
    SendMessageToSelf(`已进入办公室，进入内侧工位以进行工作`, "WorkRoom");
}
function WorkRoomLeave() {
    ClearTagMessage("WorkRoom");
    ClearTagMessage("WorkRoomWork");
}

const WorkInnerRoom = {
    Areas: [
        { leftUp: { X: 0, Y: 12 }, rightDown: { X: 1, Y: 13 } },
        { leftUp: { X: 5, Y: 12 }, rightDown: { X: 6, Y: 13 } },
        { leftUp: { X: 0, Y: 16 }, rightDown: { X: 1, Y: 17 } },
        { leftUp: { X: 0, Y: 20 }, rightDown: { X: 1, Y: 21 } },
        { leftUp: { X: 5, Y: 20 }, rightDown: { X: 6, Y: 21 } },
    ],
    Exclude: [
    ],
    Enter: window["WorkInnerRoomEnter"],
}
function WorkInnerRoomEnter() {
    SendMessageToSelf(`${styleButton("接取任务", TakeMission)}${styleButton("处理杂务", DoWork)}`, "WorkRoom");

}

function DoWork() {
    var p1 = Math.floor(Math.random() * 100);
    var p2 = Math.floor(Math.random() * 100);
    var p3 = Math.floor(Math.random() * 4);
    switch (p3) {
        case 0: {
            p3 = "+"
        }
            break;
        case 1: {
            p3 = "-"
        }
            break;
        case 2: {
            p3 = "*"
        }
            break;
        case 3: {
            p3 = "/"
        }
            break;
        default: {
            p3 = "+"
        }
            break;
    }
    var string = `${p1} ${p3} ${p2}`;
    var result = (new Function("return " + string))();
    var resultIndex = Math.floor(Math.random() * 4);
    var worngResult = [
        (result + Math.floor(Math.random() * 100 - 50)).toFixed(2),
        (result + Math.floor(Math.random() * 100 - 50)).toFixed(2),
        (result + Math.floor(Math.random() * 100 - 50)).toFixed(2),
    ]
    result = result.toFixed(2);
    string += ` = ?\n`;

    for (var i = 0; i < worngResult.length; i++) {
        if (i == resultIndex) {
            string += styleButton(result.toString(), () => {
                var pdi = PlayerDroneInfo();
                var reword = pdi.todaysWork >= pdi.workMax ? 0 : 2;
                pdi.coin += reword;
                pdi.todaysWork += reword;
                SendMessageToSelf(`答案正确，获得${reword}配额点数${reword == 0 ? "，已达到每日上限" : ""}`, "WorkRoom");
                ClearTagMessage("WorkRoomWork");
            });
        }
        string += styleButton(worngResult[i].toString(), () => {
            SendMessageToSelf(`答案错误`, "WorkRoom");
            ClearTagMessage("WorkRoomWork");
        });
    }
    if (resultIndex == 3) {
        string += styleButton(result.toString(), () => {
            var pdi = PlayerDroneInfo();
            var reword = pdi.todaysWork >= pdi.workMax ? 0 : 2;
            pdi.todaysWork += reword;
            SendMessageToSelf(`答案正确，获得${reword}配额点数${reword == 0 ? "，已达到每日上限": ""}`, "WorkRoom");
            ClearTagMessage("WorkRoomWork");
        });
    }
    SendMessageToSelf(string, "WorkRoomWork");


}
const OperRoomCrate ={
    Areas: [
        { X: 13, Y: 20 },
    ],
    Exclude: [
    ],
}

const OperRoom = {
    Areas: [
        { leftUp: { X: 12, Y: 18 }, rightDown: { X: 22, Y: 25 } },
    ],
    Exclude: [
        { leftUp: { X: 14, Y: 18 }, rightDown: { X: 18, Y: 19 } },
    ],
    Enter: window["OperRoomEnter"],
    Leave: window["OperRoomLeave"]
}

function OperRoomEnter() {
    SendMessageToSelf(`已进入操作员休息室`, "OperRoom");
}

function OperRoomLeave() {
    ClearTagMessage("OperRoom")
}

const Cat = {
    Areas: [
        { X: 19, Y: 24 }
    ],
    Exclude: [
    ],
    Enter: window["CatEnter"],
}
function CatEnter() {
    SendMessageToSelf(`这是猫`, "OperRoom");
}

const DancerRoom = {
    Areas: [
        { leftUp: { X: 14, Y: 18 }, rightDown: { X: 18, Y: 19 } },
    ],
    Exclude: [
    ],
}
const PrivateRoomCrate = {
    Areas: [
        { X: 12, Y: 12 },
        { X: 20, Y: 12 },
        { X: 22, Y: 12 },
    ],
    Exclude: [
    ],
}

const PrivateRoom = {
    Areas: [
        { leftUp: { X: 12, Y: 12 }, rightDown: { X: 15, Y: 16 } },
        { leftUp: { X: 17, Y: 12 }, rightDown: { X: 20, Y: 16 } },
        { leftUp: { X: 22, Y: 12 }, rightDown: { X: 27, Y: 16 } },
    ],
    Exclude: [
    ],
    Enter: window["PrivateRoomEnter"],
    Leave: window["PrivateRoomLeave"]
}

function PrivateRoomEnter() {
    var pdi = PlayerDroneInfo();
    if (pdi.isDrone) {
        SendMessageToSelf(`已进入私人房间`, "PrivateRoom");
    }
    else {
        SendMessageToSelf(`已进入私人房间，${styleButton("呼叫无人机侍寝", CallDroneToPrivateRoom)}`, "PrivateRoom");
    }
}

function CallDroneToPrivateRoom() {
    var input = (document.getElementById("InputChat"));
    input.value = '/DTS findtargetoprivate []'
    SendMessageToSelf("请在方括号内输入目标ID并发送指令");
}

const TrainingRoomBlackTile = {
    Areas: [
        { X: 34, Y: 13 },
        { X: 38, Y: 13 },
    ],
    Exclude: [
    ],
}

const TrainingRoom = {
    Areas: [
        { leftUp: { X: 33, Y: 12 }, rightDown: { X: 35, Y: 14 } },
        { leftUp: { X: 37, Y: 12 }, rightDown: { X: 39, Y: 14 } },
    ],
    Exclude: [
    ],
    Enter: window["TrainingRoomEnter"],
    Leave: window["TrainingRoomLeave"]
}

function TrainingRoomEnter(nowInZone) {
    SendMessageToSelf(`已进入训练室，站在黑色地砖上${styleButton("开始训练", StartTraining, nowInZone)}`, "TrainingRoom");

}
function TrainingRoomLeave(pverInZone) {
    if (isTraining) {
        SendMessageToSelf("训练完成前不允许离开训练室", "TrainingRoom");
        MovePlayer(TrainingRoomBlackTile.Areas[pverInZone]);
    }
    else {
        ClearTagMessage("TrainingRoom");
    }
}

var trainingMenu = [
    async () => {
        var pdi = PlayerDroneInfo();
        var waitTime = 3000;
        SendMessageToSelf("基础训练开始", "TrainingRoom");
        await sleep(waitTime);
        SendMessageToSelf("第一项训练，服从训练", "TrainingRoom");
        await sleep(waitTime);
        SendMessageToSelf("无人机应在被操作员抚摸头顶时，执行服从指令，应立即下跪，切换至服从姿态，限时20秒", "TrainingRoom");
        await sleep(waitTime);
        SendMessageToSelf("进入实践阶段", "TrainingRoom");
        await sleep(waitTime);
        var result = await WaitTrainingProcess(
            () => {
                SendMessageToSelf(`${styleProgressBar("被抚摸头顶", "结束", 20000)}`, "TrainingProc");
                RequirePoseinfo.RequireDronePose(["Kneel"], 20000, true);
            },
            () => {
                SendMessageToSelf("未检测到下跪行为，退回至上一步", "TrainingRoom");
            },
            1
        )
        if (result == false) {
            return;
        }
        SendMessageToSelf("第二项训练，复位训练", "TrainingRoom");
        await sleep(waitTime);
        SendMessageToSelf("无人机应在被操作员捏脸颊时，执行复位指令，应立即站起并将手放在身前，完成姿态复位，限时20秒", "TrainingRoom");
        await sleep(waitTime);
        SendMessageToSelf("进入实践阶段", "TrainingRoom");
        await sleep(waitTime);
        var result = await WaitTrainingProcess(
            () => {
                SendMessageToSelf(`${styleProgressBar("被捏脸颊", "结束", 20000)}`, "TrainingProc");
                RequirePoseinfo.RequireDronePose(["BaseLower", "LegsClosed"], 20000, true);
                RequirePoseinfo.RequireDronePose(["BaseUpper"], 20000, true);
            },
            () => {
                SendMessageToSelf("未检测到站起行为，退回至上一步", "TrainingRoom");
            },
            2
        )
        if (result == false) {
            return;
        }
        SendMessageToSelf("第二项训练完成，进入下一项训练", "TrainingRoom");
        await sleep(waitTime);
        SendMessageToSelf("第三项训练，自检训练", "TrainingRoom");
        await sleep(waitTime);
        SendMessageToSelf("无人机应在被操作员抚摸小腹/肚子时，执行自检指令，应立即抚摸自身任意部位三次，以完成自检流程，限时20秒", "TrainingRoom");
        await sleep(waitTime);
        SendMessageToSelf("进入实践阶段", "TrainingRoom");
        await sleep(waitTime);
        var result = await WaitTrainingProcess(
            () => {
                SendMessageToSelf(`${styleProgressBar("被抚摸小腹", "结束", 20000)}`, "TrainingProc");
                RequireActivityinfo.RequireDroneActivity([], ["Caress"], 0, 20000, 3, true);
            },
            () => {
                SendMessageToSelf("未检测到自检行为，退回至上一步", "TrainingRoom");
            },
            1
            
        )
        if (result == false) {
            return;
        }
        SendMessageToSelf("第三项训练完成，基础训练全部完成", "TrainingRoom");
        await sleep(waitTime);
        SendMessageToSelf("实际环境中收到指令时不会显示进度条提示，需以接收到的动作为准", "TrainingRoom");
        pdi.modifys["training1"] = true;
    },
    async () => {
        var pdi = PlayerDroneInfo();
        var waitTime = 3000;
        SendMessageToSelf("进阶训练开始", "TrainingRoom");
        await sleep(waitTime);
        SendMessageToSelf("第一项训练，待机训练", "TrainingRoom");
        await sleep(waitTime);
        SendMessageToSelf("无人机应在被操作员捏小腹/肚子时，执行待机指令，应立即双手背后且双腿并拢，切换至待机姿态，限时20秒", "TrainingRoom");
        await sleep(waitTime);
        var result = await WaitTrainingProcess(
            () => {
                SendMessageToSelf(`${styleProgressBar("被捏小腹", "结束", 20000)}`, "TrainingProc");
                RequirePoseinfo.RequireDronePose(["LegsClosed"], 20000, true);
                RequirePoseinfo.RequireDronePose(["BackBoxTie","BackElbowTouch"], 20000, true);
            },
            () => {
                SendMessageToSelf("未检测到待机行为，退回至上一步", "TrainingRoom");
            },
            2
        )
        if (result == false) {
            return;
        }
        SendMessageToSelf("第一项训练完成，进入下一项训练", "TrainingRoom");
        await sleep(waitTime);
        SendMessageToSelf("第二项训练，侍奉训练", "TrainingRoom");
        await sleep(waitTime);
        SendMessageToSelf("无人机应在附近的操作员摇晃自己身体的任意部位时时，执行侍奉指令，应用口塞亲吻对应部位，以完成侍奉流程，限时20秒，检测范围3*3格", "TrainingRoom");
        await sleep(waitTime);
        SendMessageToSelf("在本次训练中，以摇晃对应部位代替用口塞亲吻", "TrainingRoom");
        await sleep(waitTime);
        SendMessageToSelf("进入实践阶段", "TrainingRoom");
        await sleep(waitTime);
        var result = await WaitTrainingProcess(
            () => {
                SendMessageToSelf(`${styleProgressBar("摇晃脚", "结束", 20000)}`, "TrainingProc");
                RequireActivityinfo.RequireDroneActivity(["ItemBoots"], ["Wiggle"], 0, 20000, 1, true);
            },
            () => {
                SendMessageToSelf("未检测到侍奉行为，退回至上一步", "TrainingRoom");
            },
            1
        )
        if (result == false) {
            return;
        }
        await sleep(waitTime);
        SendMessageToSelf("检测到侍奉行为，进行下一实践", "TrainingRoom");
        await sleep(waitTime);
        var result = await WaitTrainingProcess(
            () => {
                SendMessageToSelf(`${styleProgressBar("摇晃手指", "结束", 20000)}`, "TrainingProc");
                RequireActivityinfo.RequireDroneActivity(["ItemHands"], ["Wiggle"], 0, 20000, 1, true);
            },
            () => {
                SendMessageToSelf("未检测到侍奉行为，退回至上一步", "TrainingRoom");
            },
            1
        )
        if (result == false) {
            return;
        }
        SendMessageToSelf("第二项训练完成，进阶训练全部完成", "TrainingRoom");
        pdi.modifys["training2"] = true;

    },
    //async () => {

    //},
]
async function WaitTrainingProcess(DoAtStart, DoAtFail, maxTrainingProcess) {
    var toNext = false;
    var retryCount = 0;
    var pdi = PlayerDroneInfo();
    while (toNext == false) {
        trainingProcess = 0;
        DoAtStart();
        for (var i = 0; i < 20; i++) {
            await sleep(1000);
            if (pdi.battery < pdi.batteryMax / 2) {
                pdi.battery = pdi.batteryMax / 2;
            }
            if (trainingProcess >= maxTrainingProcess) {
                toNext = true;
                break;
            }
        }
        if (toNext == false) {
            retryCount++;
            if (retryCount >= 3) {
                SendMessageToSelf("多次重试失败，训练中止", "TrainingRoom");
                ClearTagMessage("TrainingProc");
                return false;
            }
            DoAtFail();
            ClearTagMessage("TrainingProc");

        }
    }
    return true;
    
}

var isTraining = false;
async function StartTraining(nowInZone) {
    if (IsInArea(Player.MapData.Pos, TrainingRoomBlackTile.Areas[nowInZone]) == false) {
        SendMessageToSelf("不位于黑色地砖上", "TrainingRoom");
        return;
    }
    ClearTagMessage("TrainingRoom");
    var pdi = PlayerDroneInfo();
    var trainingIndex = pdi.level;
    if (pdi.isDrone == false) {
        SendMessageToSelf("受训者非无人机，执行基础训练", "TrainingRoom");
        trainingIndex = 0;
    }
    if (trainingIndex >= trainingMenu.length) {
        trainingIndex = trainingMenu.length - 1;
    }
    isTraining = true;
    await trainingMenu[trainingIndex]();
    isTraining = false;
}



const EducationRoom = {
    Areas: [
        [{ X: 34, Y: 22 }, { X: 36, Y: 22 }, { X: 38, Y: 22 }]
    ],
    Exclude: [
    ],
    Enter: window["EducationRoomEnter"],
    Leave: window["EducationRoomLeave"]
}

function EducationRoomEnter(nowInZone) {
    SendMessageToSelf(`已进入教育室，${styleButton("开始教育", StartEducation)}`, "EducationRoom");

}
function EducationRoomLeave(pverInZone) {
    ClearTagMessage("EducationRoom");
}
var educationMenu = [
    async () => {
        var pdi = PlayerDroneInfo();
        var waitTime = 2000;
        WearEquips(Player, [CrateBind]);
        SendMessageToSelf("基础教育开始", "EducationRoom");
        await sleep(waitTime);
        SendMessageToSelf("催眠装置部署完成，开始催眠", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("催眠装置部—完成，开—催眠", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("催眠——部—完成，开——眠", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("催眠——————，————", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("————————，————", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("—————，———，———", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("我—身份—，—人—，人——", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        await WaitEducationProcess("我的身份是", "无人机", "人类");
        await WaitEducationProcess("我的存在意义是", "服从", "寻找自我");
        await WaitEducationProcess("主人摸我的头时，我应该", "感到兴奋", "无动于衷");
        SendMessageToSelf(`${styleProgressBar("被抚摸头顶", "结束", waitTime * 2)}`, "EducationRoomClear");
        await sleep(waitTime);
        DoOrgasm();
        await sleep(15000);
        SendMessageToSelf(`${styleProgressBar("被抚摸头顶", "结束", waitTime * 2)}`, "EducationRoomClear");
        await sleep(waitTime);
        DoOrgasm();
        await sleep(15000);
        SendMessageToSelf(`${styleProgressBar("被抚摸头顶", "结束", waitTime * 2)}`, "EducationRoomClear");
        await sleep(waitTime);
        DoOrgasm();
        await sleep(15000);
        await WaitEducationProcess("本机的身份是", "无人机", "人类");
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("本机—身份—，—人—，人——", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("—————，———，———", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("催眠————，————", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("催—流——成，——程——成功—装", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("催眠流程完成，奖励程序已成功安装", "EducationRoomClear");
        await sleep(waitTime);
        SendMessageToSelf("被抚摸头顶时，有概率会引发高潮", "EducationRoomClear");
        RemoveRestrainByOneAssetGroup(Player, Crate.AssetGroup);
        if (pdi.battery < pdi.batteryMax / 2) {
            pdi.battery = pdi.batteryMax / 2;
        }
        pdi.modifys["education1"] = true;
    },
    async () => {

        var pdi = PlayerDroneInfo();
        var waitTime = 2000;
        WearEquips(Player, [CrateBind]);
        SendMessageToSelf("进阶教育开始", "EducationRoom");
        await sleep(waitTime);
        SendMessageToSelf("催眠装置部署完成，开始催眠", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("催眠装置部—完成，开—催眠", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("催眠——部—完成，开——眠", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("催眠——————，————", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("————————，————", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("—————，———，———", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("本—身份—，—人—，人——", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        await WaitEducationProcess("本机的身份是", "无人机", "人类");
        await WaitEducationProcess("本机的名字是", `无人机${Player.MemberNumber}`, Player.Name);
        await WaitEducationProcess("本机的即将高潮时，本机应当", `忍耐`, `放纵`);
        await WaitEducationProcess("若本机意外高潮时，本机应感到", `愧疚`, `爽`);
        DoOrgasm();
        await sleep(15000);
        DoOrgasm();
        await sleep(15000);
        DoOrgasm();
        await sleep(15000);
        await WaitEducationProcess("本机的身份是", "无人机", "无人机");
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("本机—身份—，—人—，人——", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("—————，———，———", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("催眠————，————", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("催—流——成，——程——成功—装", "EducationRoomClear");
        await sleep(waitTime);
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf("催眠流程完成，愧疚程序已成功安装", "EducationRoomClear");
        await sleep(waitTime);
        SendMessageToSelf("未能忍耐高潮时，随机部位拘束上升1", "EducationRoomClear");
        RemoveRestrainByOneAssetGroup(Player, Crate.AssetGroup);
        if (pdi.battery < pdi.batteryMax / 2) {
            pdi.battery = pdi.batteryMax / 2;
        }
        pdi.modifys["education2"] = true;
    },
    //async () => {

    //},
]

async function WaitEducationProcess(text1, text2, text3) {
    var toNext = false;
    var choiced = false;
    var waitTime = 2000;
    while (toNext == false) {
        var choiced = false;
        ClearTagMessage("EducationRoomClear");
        SendMessageToSelf(`${text1}${styleButton(text2, () => { toNext = true; choiced = true })}，${styleButton(text3, () => { DoPunishment(2, 3); choiced = true })}`, "EducationRoomClear");

        //SendMessageToSelf(`我的身份是，${styleButton("无人机", () => { toNext = true; choiced = true })}，${styleButton("人类", () => { DoPunishment(2, 3); choiced = true })}`, "EducationRoomClear");
        await waitFor(() => { return choiced == true });
        ClearTagMessage("EducationRoomClear");
        await sleep(waitTime);
    }
}

var isEducationing = false;
async function StartEducation(nowInZone) {
    ClearTagMessage("EducationRoom");
    var pdi = PlayerDroneInfo();
    var educationIndex = pdi.level;
    if (pdi.isDrone == false) {
        SendMessageToSelf("受训者非无人机，执行基础教育", "EducationRoom");
        educationIndex = 0;
    }
    if (educationIndex >= trainingMenu.length) {
        educationIndex = trainingMenu.length - 1;
    }
    isEducationing = true;
    await educationMenu[educationIndex]();
    isEducationing = false;
}

const ChargeRoom = {
    Areas: [
        [
            { X: 1, Y: 10 },
            { X: 38, Y: 10 },
            { X: 1, Y: 25 },
            { X: 38, Y: 25 },
            { X: 8, Y: 30 },
            { X: 18, Y: 30 },
        ]
    ],
    Exclude: [
    ],
    Enter: window["ChargeRoomEnter"],
    Leave: window["ChargeRoomLeave"]
}
function ChargeRoomEnter() {
    var pdi = PlayerDroneInfo();
    SendMessageToSelf(`位于充电桩上，${styleButton(`开始充电`, ChargeRoomCharge)}`, "ChargeRoom");
}
function ChargeRoomLeave() {
    ClearTagMessage("ChargeRoom")
    var inv = InventoryGet(Player, "ItemDevices");
    if (inv?.Asset?.Name == "OneBarPrison") {
        RemoveRestrainByOneAssetGroup(Player, "ItemDevices");
    }
}
function ChargeRoomCharge() {
    WearEquips(Player, [OneBar]);
    SendMessageToSelf(styleProgressBar("正在充电", "充电完成", 60000, ChargeComplete), "ChargeRoom");
}

function ChargeComplete() {
    var pdi = PlayerDroneInfo();
    pdi.battery = pdi.batteryMax;
    RemoveRestrainByOneAssetGroup(Player, "ItemDevices");

}


var AllZoneList = [StockRoom, Elevator, SleepRoom, ModifyRoom, ModifyTile, ShopRoom, ShopInnerRoom, WorkRoom, WorkInnerRoom, OperRoom, Cat, DancerRoom, PrivateRoom, TrainingRoom, EducationRoom, ChargeRoom]
var map = {
    "Type": "Always",
    "Tiles": "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҲҲҲҴҴҲҲҲҴҴҴҴҴҴҴ¬yyyyyҴҴҴҳҳҳҴҴҴyyyyтyyyҴҴªªªҴҴªªªтyyyyyyyyyyyyҴҴҳ«««ҳҴтyyyyтyyyҴҴªªªҴҴªªªтyyyyyyyyyyyyҴҴ«ҳ«ҳ«ҴКyyyyтyyyҴҴҴҴҴҴҴҴҴҴтyyyyyyyyyyyyҴҴ«««««ҴҴyyyyтyyyyyyyyyyyyyтyyyyyyyyyyyyҴҴ«ҳ«ҳ«ÇÇyyyyтyyyyyyyyyyyyyтyyyyyyyyyyyyҴҴҳ«««ҴҴтyyyyтyyyyyyyyyyyyyтyyyyyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҳ«ҳyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyҳ«ҳ«¬«yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy«¬«ҲҲҴҴҴҲҲҴyyyҴААААҴААААҴААААААҴyyyҴҳҳҳҴҳҳҳªªҴҴҴªªҴyyyҴҴҴҴyyyҴ«««Ҵ«««ªªҴҴҴªªҴyyyҴҴҴҴyyyҴ«¬«Ҵ«¬«¬¬¬¬¬¬¬ҴyyyҴҴҴҴyyyҴ«««Ҵ«««ҲҲҴ¬ҴҴҴҴyyyҴҴҴҴyyyҴҴҴҴҴҴҴҴªªҴ¬¬¬¬ҴyyyҴҴҴҴyyyҴyyyyyyyªªҴ¬¬¬¬ҴyyyҴҴҴЮЮЮЮЮҴҴҴҴҴҳҳҳҳҴyyyҴyyyyyyy¬¬¬¬¬¬¬ÇyyyҴxЮ¬¬¬Юxxxҳ«««ҴyyyÇyyyyyyyҲҲҴ¬ҴҲҲҴyyyҴxЮЮxxxҳ««ҳҳҴyyyҴҳ¬ҳ¬ҳ¬ҳªªҴ¬ҴªªҴyyyҴxxxxxxxxxxxҳ«««ҴyyyҴҴҳҴҳҴҳҴªªҴ¬ҴªªҴyyyҴxxxxxxxxxxxҳ««ҳҳҴyyyҴҴ«Ҵ«Ҵ«Ҵ¬¬¬¬¬¬¬ҴyyyҴxxxxxxxxxxxҳ«««ҴyyyҴҴ«Ҵ«Ҵ«ҴҴҴҴҴҴҴҴҴyyyҴxxxxxxxxxxxҳ««ҳҳҴyyyҴҴҴҴҴҴҴҴҳ«ҳyyyyyyyyҴxxxxxxxxxxxҳ«««Ҵyyyyyyyyҳ«ҳ«¬«yyyyyyyyҴxxxxxxxxxxxҳ««ҳҳҴyyyyyyyy«¬«ҴҴҴҴҴҴҴyyyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴyyyyҴҴҴҴҴҴҴyyyyyyҴyyyyyyyyyyyyyyyyyyyyyyyyyyҴyyyyyyyyyyyyҴyyyyyyyyyyyyyyyyyyyyyyyyyyҴyyyyyyyyyyyyҴҳ«ҳyyyyyyyҳ«ҳyyyyyyyyyҳҳҳҳҴyyyyyyyyyyyyҴ«¬«yyyyyyy«¬«yyyyyyyyyҳ«««ҴyyyyyyyyyyyyҴҳ«ҳyyyyyyyҳ«ҳyyyyyyyyyҳ«««ҴyyyyyyyyyyyyҴyyyyyyyyyyyyyyyyyyyyyyÇ«««ҴyyyyyyҴҴҴҴҴҴҴҴҴҴҴҴЮЮЮЮЮҴҴҴҴҴҴҴҴҴҴyҴҴҴҴҴҴҳҳҳҳҳҳææëëëðëëëææҴxxxxxҴҲҲҲҲҳҳҳҳҴҴҴҴҲҲҲҴ««««««ææëëëðëëëææҴxxxxxҴªªªҲ«««ҳ¬¬¬ҴªªªҴ««««««ææëëëëëëëææҴxxxxxҴªªªҲ«««ҳ¬¬¬ҲªªªҴ««««««ææëëëðëëëææÇxxxxxÇªªªҲ«««ҳ¬¬¬ÇªªªҴ««««««ææëëëðëëëææҴxxxxxҴҲҲҲҳҳҳҳҳҳҳҳҴҲҲҲҴ««««««ææëëëëëëëææҴЮЮЮЮЮҴyyұ«ҳ«ҳ«ҳ«ҳyyyyҴ««««««",
    "Objects": "ҴӄӃҶұҳҹddddddddddddddddddddddddddddddddddddddddddddddddddd೥ddddddd೦೧ddd೦೧dddddddƂƂƂƂƂұdddddddddшшшddŀddddшddddшdddҴƂƂƂƂƂdddddddddddddddddddddиddddddddddddddddddƂƂƂƂƂҲdddddddddžſddddƀƁddd೥ྴddd೥ྴdҵƂƂƂƂƂddddddddddшddྴྴdddddddddddddddddddddddddƂƂƂƂƂҳddddddddddddddddddddddddddddҶƂƂƂƂƂdddddddddddddddŀdddddddddddddddddddddddddddddྴdddddddddddྴdddྴddddddddddddྴddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd೦೧ddd೦೧dddddd௪ddddd௪ddddd௪dddddddd೥ddd೥džſdddžſdddddшżdddddżшdшd࠲żdddddddиdшdиdшddddddddddddddːːdːːdddddddːːdddddddddddddddddddddddddddϼdϼdddddddddϼdddddddddddd೦೧ddd೥ddddddࠖࠖdddddࠖࠖdࠖࠖdd˚˚ddddddྴdddྴdžſdddddddddddddŀdŀdddddddddŀdddddddddddddddddddྴddddྶdddddddྶdྶdddddddddྴdddddddddddddddddddїdтdтdтdјdљddїdddddddddddddd೦೧ddd೦೧dddddddࠖࠖࠖࠖࠖdddddddddddddddddddddžſdddžſddddddшdddddŀdddddјddddddddྴdྴdྴddddddddddddddddˤˤˤdżdddddddddddddddddddddddddddddddddddˆˆˆdddddddљddddddddшdшdшdddddddddddddddddddddddddddddddddddddddddddddddddddddƂƂddddd̪dddddњddddddddddddddddddddddddddžſdddddddddddddddddddddddddddddddྴdddddddddddddddྶྐྵdྸdddddddddྴdddddƂƂƂƂƂҷddddddddddddddddddddddddddddҺƂƂƂƂƂddddddddddddddddddddddddddddddddddddddddƂƂƂƂƂҸddddddddddddddddddddddddddddһƂƂƂƂƂddddddddddddddddddddddddddddddddddddddddƂƂƂƂƂҹdddddddddddddddddddddddྸddddҼƂƂƂƂƂddddddddddddddddddddddddddddddddddddddddೋdddddddddೋdddddddddddddddddddddddddddddnsdddddddddddиdddddddddddddྴddddddшшшшшшddddddddddddƀƁddddddddddddddddddddшшшшшшdddddddddddྴdddddྷdddddddddddྐྵddddшшшшшшddddddddddddddddddddddddddddddddddшшшшшшdddddddddddd࠲d࠲d࠲dddddddddddddddddшшшшшшddddddddddddddddddddddddddddddddddшшшшшш"
}


var pverPos = null;

function ExpendInit() {
    waitFor(() => initComplete == true)
    InstallHook("PlayerMoved", null, null, PlayerMovedFaci)
    InstallHook("ChargeComplete", null, null, function MissionInfoProgressAddChargeComplete() { MissionInfo.ProgressAdd("Charge"); })

    //InitMap();
}
async function InitMapFaci() {
    ChatRoomData.Name = "DroneFacility";
    ChatRoomData.desc = "[Script]无人机训练设施   需要加载插件，地址：https://greasyfork.org/zh-CN/scripts/574984-dronetrainingsystem"
    ChatRoomData.Limit = 20;
    ChatRoomData.Access = ['All'];
    ChatRoomData.Visibility = ['All'];
    ChatRoomData.Private = false;
    ChatRoomData.MapData = Object.assign({}, map);
    ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: ChatRoomGetSettings(ChatRoomData), Action: "Update" });
    for (var char of ChatRoomCharacter) {
        ChatRoomMapViewTeleport(char.MemberNumber, { X: 1, Y: 37 });
        await sleep(200);
    }
    MovePlayer({ X: 1, Y: 37 })
}


async function PlayerMovedFaci() {
    //校验地图是否正确
    if (ChatRoomData.MapData.Objects.startsWith("ҴӄӃҶұҳҹ") == false) return;
    var pdi = PlayerDroneInfo();
    Player.MapData.PrivateState.HasKeyBronze = true;
    Player.MapData.PrivateState.HasKeyGold = pdi.isOwner;
    Player.MapData.PrivateState.HasKeySilver = pdi.isDrone;

    if (pverPos == null) {
        pverPos = { X: 0, Y: 0 };
    }
    for (let zoneKey in AllZoneList) {
        if ((AllZoneList[zoneKey].Enter ?? false) == false &&
            (AllZoneList[zoneKey].Leave ?? false) == false &&
            (AllZoneList[zoneKey].Moved ?? false) == false)
            continue;
        let nowInZone = IsInZone(Player.MapData.Pos, AllZoneList[zoneKey])
        let pverInZone = IsInZone(pverPos, AllZoneList[zoneKey])
        if (AllZoneList[zoneKey].Enter) {
            if (nowInZone !== false && pverInZone === false)
            AllZoneList[zoneKey].Enter(nowInZone);
        }
        if (AllZoneList[zoneKey].Leave && nowInZone === false && pverInZone !== false) {
            AllZoneList[zoneKey].Leave(pverInZone)
        }
        if (AllZoneList[zoneKey].Moved && nowInZone !== false) {
            AllZoneList[zoneKey].Moved(nowInZone)
        }
    }
    pverPos = Object.assign({}, Player.MapData.Pos);
}



ExpendInit();