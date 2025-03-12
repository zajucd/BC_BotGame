
class level {
    /**
     * 
     * @param {string} levelName 关卡名称
     * @param {string?} levelText 关卡描述
     * @param {{X:int,Y:int}} basePoint 左上点mapdata中的位置
     * @param {playerPoint[]} player1PointList 玩家1所需经过的点
     * @param {playerPoint[]} player2PointList 玩家2所需经过的点
     * @param {int} timeLimit 时间限制
     * @param {boolean} forceLeash 强制牵绳
     * @param {int} leashBreakTime 牵绳断开限制时间
     */
    constructor(levelName,levelText, basePoint, player1PointList, player2PointList, timeLimit, forceLeash, leashBreakTime) {
        this.levelName = levelName;
        this.levelText = levelText;
        this.basePoint = basePoint;
        this.player1PointList = player1PointList;
        this.player2PointList = player2PointList;
        this.timeLimit = timeLimit;
        this.forceLeash = forceLeash;
        this.leashBreakTime = leashBreakTime;
    }
    PointListForThisPlayer() {
        return LeashDronePlayer.isPlayer1 ? this.player1PointList : this.player2PointList;
    }
}
class playerPoint {
    /**
     * 
     * @param {int} Xp 相对basePoint点x轴上偏移
     * @param {int} Yp 相对basePoint点y轴上偏移
     * @param {boolean} forceWait 是否强制等待至被解放
     * @param {boolean} releaseAnother 是否施放正在等待玩家
     * @param {boolean} TPNext 是否传送至下一个点
     */
    constructor(Xp, Yp, forceWait = false, releaseAnother = false, TPNext = false) {
        this.Xp = Xp;
        this.Yp = Yp;
        this.forceWait = forceWait;
        this.releaseAnother = releaseAnother;
        this.TPNext = TPNext;
    }
    IsThisPoint(Pos, basePoint) {
        if (Pos.X == this.Xp + basePoint.X && Pos.Y == this.Yp + basePoint.Y) {
            return true;
        }
        else {
            return false;
        }
    }
    ToPos(basePoint) {
        return { X: (this.Xp + basePoint.X), Y: (this.Yp + basePoint.Y) };
    }
}
class playerInfo {
    constructor(BCPlayer) {
        this.MemberNumber = BCPlayer.MemberNumber;
        this.BCPlayer = BCPlayer;
        this.lockCode = Math.floor(Math.random() * 9000 + 1000).toString();

        this.inGame = false;
        this.inLevel = false;
        this.anotherPlayer = null;
        this.isPlayer1 = false;

        this.isForceWait = false;
        this.isLeashing = false;
        this.currentLevel = 0;
        this.levelProcess = 0;
        this.levelFinish = false;
        this.onIce = false;

        this.levelTimer = -1;
        this.leashTimer = -1;
        this.lastDire = null;

        this.MoveSpeed = 200;
    }
    GetPos() {
        return this.BCPlayer.MapData.Pos;
    }
    LeashAnother(isLeash = true) {

        this.isLeashing = isLeash;
        if (isLeash) {
            ChatRoomLeashPlayer = this.anotherPlayer.MemberNumber;
        }
        else {
            ChatRoomLeashPlayer = null;
        }
    }
    WearEquips(equips, refresh = true) {
        for (let i = 0; i < equips.length; i++) {
            WearEquip(this.BCPlayer, equips[i], this.lockCode, false);
        }
        if (refresh) {
            CharacterLoadEffect(this.BCPlayer);
            ChatRoomCharacterUpdate(this.BCPlayer);
        }
    }
    RemoveEquips(equips, refresh = true) {
        for (let i = 0; i < equips.length; i++) {
            InventoryRemove(this.BCPlayer, equips[i].AssetGroup)
        }
        if (refresh) {
            CharacterLoadEffect(this.BCPlayer);
            ChatRoomCharacterUpdate(this.BCPlayer);
        }
    }
    GameStart(isPlayer1) {
        this.isPlayer1 = isPlayer1;
        this.inGame = true;

        this.isForceWait = false;
        this.isLeashing = false;
        this.currentLevel = 0;
        this.levelProcess = 0;
        this.levelFinish = false;

        this.levelTimer = -1;
        this.leashTimer = -1;

        removeRestrains(this.BCPlayer, false);
        removeClothes(this.BCPlayer, false);


        this.WearEquips(Equips);
        ServerSend("AccountUpdate", { Nickname: `无人机${this.MemberNumber}` });
        

        SendMessageToSelf(`无人机${this.MemberNumber},无人机${this.anotherPlayer.MemberNumber}已激活\n` +
        `移动装置已部署, 装置链接已生效, 距离限制已生效\n` +
        `无人机已被指派任务:前往故障区域回收遗失数据\n` +
        `无人机已获得授权使用测试区域训练使用移动装置`);
        
        setTimeout(() => { this.GotoLevel(0); }, 5000);
        

    }
    GotoLevel(level) {
        clearTimeout(iceTimer);
        this.inLevel = false;
        this.leashTimer = -1;
        this.levelTimer = -1;
        this.LeashAnother(false);
        this.currentLevel = level;
        this.levelProcess = 0;
        this.levelFinish = false;
        this.isLeashing = false;
        this.ForceWait(true);

        let currentLevelInfo = levelsInfo[level];

        this.RemoveEquips(EquipsMove, false);
        this.WearEquips(EquipsHang);

        let timeDelay = 0;

        let point = HangPoints[this.isPlayer1 ? 0 : 1];
        for (let i = 0; i < 11; i++) {
            setTimeout(
                () => {
                    TPSelf({ X: point.X, Y: point.Y + i }, false);
                },600 * i + 1000)
        }
        
        setTimeout(
            () => {
                TPSelf(currentLevelInfo.PointListForThisPlayer()[0].ToPos(levelsInfo[level].basePoint), false);
                this.RemoveEquips(EquipsHang, false);
                this.WearEquips(EquipsMove);
                let index = this.BCPlayer.Appearance.findIndex((a) => a.Asset.Name === 'ExclusiveWaitress');
                if (index != -1) {
                    this.BCPlayer.Appearance[index].Property.TypeRecord.f = 1;
                }
        }, 600 * 11 + 3000)
        
        

        setTimeout(() => {
            this.LeashAnother(currentLevelInfo.forceLeash);
            SendMessageToSelf(`区域${this.currentLevel + 1}:${currentLevelInfo.levelName}\n` +
                `${currentLevelInfo.levelText}\n` +
                `区域时限${currentLevelInfo.timeLimit}秒,强制距离限制已${currentLevelInfo.forceLeash ? `启用` : `关闭,但分离${currentLevelInfo.leashBreakTime}秒会重新启动区域`}`);

            EnterTile(this.GetPos());

            this.levelTimer = CurrentTime + currentLevelInfo.timeLimit * 1000;
            this.leashTimer = -1;

            this.inLevel = true;
            this.ForceWait(false);
        }, 600 * 11 + 6000);

        
    }
    ForceWait(isWait) {
        let index = this.BCPlayer.Appearance.findIndex((a) => a.Asset.Name === 'ExclusiveWaitress');
        if (index != -1) {
            this.BCPlayer.Appearance[index].Property.TypeRecord.f = isWait ? 1:4;
        }
        this.MoveSpeed = isWait? 0: 600;
        CharacterLoadEffect(this.anotherPlayer.BCPlayer);
        ChatRoomCharacterUpdate(this.anotherPlayer.BCPlayer);
    }

}
class MsgInfo {
    
    constructor(type, param) {
        this.type = type;
        this.param = param;
    }
    static DoCmd(msgInfo) {
        MsgCmds[msgInfo.type].Command(msgInfo.param)
    }
    
}

class CommandInfo {
    constructor(command, commandText) {
        this.command = command;
        this.commandText = commandText;
    }
    static DoCmd(commandInfo) {
        CommandsAction[commandInfo.command].Command(commandInfo.commandText);
    }
}
const levelsInfo = [
    new level(
        "移动性能测试",
        "无人机已被授权移动功能，已与搭档机进行链接。无人机与搭档机不可离开对方5*5范围外",
        { X: 13, Y: 1 },
        [new playerPoint(0, 0), new playerPoint(11, 0), new playerPoint(11, 11), new playerPoint(0, 11)],
        [new playerPoint(0, 2), new playerPoint(9, 2), new playerPoint(9, 9), new playerPoint(0, 9)],
        200, true, 0
    ),
    new level(
        "同步性能测试",
        "本区域暂时关闭距离限制功能，可暂时分离一定距离,移动至标线上会提示搭档机",
        { X: 26, Y: 1 },
        [new playerPoint(2, 0), new playerPoint(2, 11)],
        [new playerPoint(0, 0), new playerPoint(0, 11)],
        60, false, 3
    ),
    new level(
        "协调性测试",
        "",
        { X: 13, Y: 14 },
        [new playerPoint(0, 2, true, true), new playerPoint(4, 2, true, true), new playerPoint(0, 2, true, true)],
        [new playerPoint(2, 0, false, false), new playerPoint(2, 4, true, true), new playerPoint(2, 0, true, true)],
        60, true, 0
    ),
    new level(
        "复杂路线测试",
        "",
        { X: 2, Y: 14 },
        [new playerPoint(2, 0, false), new playerPoint(6, 0), new playerPoint(6, 4), new playerPoint(2, 4, true, true), new playerPoint(6, 4), new playerPoint(6, 8), new playerPoint(2, 8, true, true)],
        [new playerPoint(4, 2, true), new playerPoint(0, 2), new playerPoint(0, 6), new playerPoint(4, 6, true, true), new playerPoint(0, 6), new playerPoint(0, 10), new playerPoint(4, 10, true, true)],
        120, true, 0
    ),
    new level(
        "判断能力测试",
        "",
        { X: 19, Y: 14 },
        [new playerPoint(2, 3), new playerPoint(2, 0)],
        [new playerPoint(2, 4), new playerPoint(4, 0)],
        90, true, 0
    ),
    new level(
        "位置调整测试",
        "",
        { X: 13, Y: 20 },
        [new playerPoint(0, 2), new playerPoint(4, 2)],
        [new playerPoint(0, 1), new playerPoint(2, 0)],
        60, true, 0
    ),
    new level(
        "移动至故障区域",
        "无人机已被授权离开测试区域，无人机已收到命令前往回收故障区域的遗失数据",
        { X: 19, Y: 22 },
        [new playerPoint(0, 0), new playerPoint(5, 0)],
        [new playerPoint(0, 1), new playerPoint(5, 1)],
        60, true, 0
    ),
    new level(
        "移动装置干扰区域",
        "检测到干扰物质，干扰物质会干扰无人机移动功能，使其无法控制方向。无人机已被授权暂时离开搭档机一定距离",
        { X: 26, Y: 14 },
        [new playerPoint(0, 0), new playerPoint(0, 11, false, false, true), new playerPoint(4, 11), new playerPoint(4, 0),],
        [new playerPoint(2, 0), new playerPoint(2, 11, false, false, true), new playerPoint(6, 11), new playerPoint(6, 0),],
        60, false, 3
    ),
    new level(
        "弹坑",
        "检测到大量干扰物质。无人机收到命令明智规划移动路线",
        { X: 0, Y: 27 },
        [new playerPoint(0, 0), new playerPoint(10, 11)],
        [new playerPoint(1, 0), new playerPoint(11, 11)],
        450, false, 60
    ),
    new level(
        "数据仓库",
        "无人机已到达遗失数据所在数据仓库，无人机收到命令回收并记忆内部数据",
        { X: 13, Y: 27 },
        [new playerPoint(0, 0), new playerPoint(9, 11)],
        [new playerPoint(2, 0), new playerPoint(11, 11)],
        300, false, 300
    ),
    new level(
        "提交数据",
        "无人机收到命令提交已记忆数据，后完成提交的无人机将被转移至能源生产区域\n无人机应在白色地块上提交自身的记忆数据，若提交搭档机数据将视为搭档机完成提交\n使用 /d submit **** 提交",
        { X: 26, Y: 27 },
        [new playerPoint(0, 0), new playerPoint(10, 1)],
        [new playerPoint(2, 0), new playerPoint(10, 1)],
        300, false, 300
    ),
];
const MsgCmds = {
    invite: {
        Command: (param) => {

            LeashDronePlayer = new playerInfo(Player);
            let target = ChatRoomCharacter.find((obj) => obj.MemberNumber === param);
            LeashDronePlayer.anotherPlayer = new playerInfo(target);
            SendMessageToSelf(`收到来自${LeashDronePlayer.anotherPlayer.BCPlayer.Name}的邀请,发送 /d accept 以接受邀请`);
        }
    },
    accept: {
        Command: (param) => {
            let target = ChatRoomCharacter.find((obj) => obj.MemberNumber === param);
            LeashDronePlayer.anotherPlayer = new playerInfo(target);
            SendMsg(LeashDronePlayer.anotherPlayer, new MsgInfo("acceptRec",true))
            SendMessageToSelf(`${LeashDronePlayer.anotherPlayer.BCPlayer.Name}已接受邀请,即将开始`);
            LeashDronePlayer.GameStart(true);
        }
    },
    acceptRec:{
        Command: (param) => {
            SendMessageToSelf(`即将开始`);
            LeashDronePlayer.GameStart(false);
        }
    },
    //接受队友牵绳
    leash: {
        Command: (param) => {
            LeashDronePlayer.LeashAnother(param);
        }
    },
    //接受队友移动
    tp: {
        Command: (param) => {
            TPSelf(param);
        }
    },
    //接受队友
    release: {
        Command: (param) => {
            LeashDronePlayer.ForceWait(false);
            SendMessageToSelf("移动机能已重启");
        }
    },
    //提示队友被停止
    waited: {
        Command: (param) => {
            LeashDronePlayer.ForceWait(false);
            SendMessageToSelf("搭档机移动机能已关闭，前往指定目标点以重启");
        }
    },
    levelRestart: {
        Command: (param) => {
            if (LeashDronePlayer.inLevel) {
                SendMsg(LeashDronePlayer.anotherPlayer, new MsgInfo("levelRestartRec", param));
                if (LeashDronePlayer.currentLevel == levelsInfo.length - 1) {
                    MsgInfo.DoCmd(new MsgInfo("gameFinish", false));
                }
                else {
                    LeashDronePlayer.GotoLevel(param);
                }
            }
            
        }
    },
    levelRestartRec: {
        Command: (param) => {
            if (LeashDronePlayer.currentLevel == levelsInfo.length - 1) {
                setTimeout(() => { MsgInfo.DoCmd(new MsgInfo("gameFinish", false)); }, 1000);
            }
            else {
                LeashDronePlayer.GotoLevel(param);
            }
        }
    },
    //接收队友关卡完成
    levelFinish: {
        Command: (param) => {
            LeashDronePlayer.anotherPlayer.levelFinish = true;
            SendMessageToSelf("搭档机已到达目标点");
            if (LeashDronePlayer.levelFinish === true) {
                SendMsg(LeashDronePlayer.anotherPlayer, new MsgInfo("toNextLevel", true));
                LeashDronePlayer.currentLevel += 1;
                LeashDronePlayer.GotoLevel(LeashDronePlayer.currentLevel);
            }
        }
    },
    //接收队友移动至下关
    toNextLevel: {
        Command: (param) => {
            LeashDronePlayer.currentLevel += 1;
            LeashDronePlayer.GotoLevel(LeashDronePlayer.currentLevel);
        }
    },
    //队友进入标志提示
    HurdleBeep: {
        Command: (param) => {
            SendMessageToSelf("搭档机已移动至标志");
        }
    },
    gameFinish: {
        Command: (param) => {
            LeashDronePlayer = new playerInfo(Player);
            if (param) {
                SendMessageToSelf("无人机已完成任务，即将返回待命区");
                LeashDronePlayer.RemoveEquips(EquipsHang, false);
                LeashDronePlayer.RemoveEquips(EquipsMove);
                TPSelf({ X: 5, Y: 11 });
            }
            else {
                SendMessageToSelf("无人机任务失败，即将移动至能源生产区域");
                LeashDronePlayer.RemoveEquips(EquipsHang, false);
                LeashDronePlayer.RemoveEquips(EquipsMove, false);
                LeashDronePlayer.WearEquips(EquipsFall);
                let result = EndPoints.find((a) => CanEnterTile(a.X, a.Y) != 0);
                if (result != null) {
                    TPSelf(result);
                }
                else {
                    TPSelf({ X: 5, Y: 11 });
                }
            }
        }
    }
};
const CommandsAction = {
    help: {
        Command: (param) => {

        }
    },
    invite: {
        Command: (param) => {

            LeashDronePlayer = new playerInfo(Player);
            let target = ChatRoomCharacter.find((obj) => obj.MemberNumber === parseInt(param));
            if (target === undefined) {
                target = ChatRoomCharacter.find((obj) => obj.Name === param);
            }
            if (target === undefined) {
                target = ChatRoomCharacter.find((obj) => obj.Nickname === param);
            }
            if (target === undefined) {
                SendMessageToSelf("未找到玩家");
            }
            else {
                SendMessageToSelf("邀请已发送");
                SendMsg(target, new MsgInfo("invite", LeashDronePlayer.MemberNumber));
            }
        }
    },
    accept: {
        Command: (param) => {
            if (LeashDronePlayer.anotherPlayer != null) {
                SendMsg(LeashDronePlayer.anotherPlayer.BCPlayer, new MsgInfo("accept", LeashDronePlayer.MemberNumber));
            }
            else {
                SendMessageToSelf("未收到邀请");
            }
        }
    },
    submit: {
        Command: (param) => {
            if (ChatRoomMapViewGetTileAtPos(Player.MapData.Pos.X, Player.MapData.Pos.Y).ID === 240) {
                if (param === LeashDronePlayer.lockCode.toString()) {
                    SendMessageToSelf("提交成功");
                    TPSelf({ X: LeashDronePlayer.BCPlayer.MapData.Pos.X, Y: LeashDronePlayer.BCPlayer.MapData.Pos.Y + 2 });
                    return;
                }
                if (param === LeashDronePlayer.lockCode.toString()) {
                    SendMessageToSelf("提交成功");
                    SendMsg(target, new MsgInfo("tp", { X: LeashDronePlayer.BCPlayer.MapData.Pos.X, Y: LeashDronePlayer.BCPlayer.MapData.Pos.Y + 2 }));
                    return;
                }
                SendMessageToSelf("无效数据");
            }
            
        }
    }
}
const Equips =
    [
        {
            "AssetGroup":"ItemHood",
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
            "AssetGroup":"ItemEars",
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
                "typed": 3
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
                "OriginalSetting": 3
            },
            "Type": null,
            "TypeRecord": {
                "g": 3,
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
const EquipsMove = [
    {
        "AssetGroup": "ItemLegs",
        "Item": "Slime",
        "Name": "活体媚药凝胶",
        "Description": "用于惩罚工作不利的无人机",
        "Color": "#CC33CC,#CC33CC,#CC33CC",
        "Property": "Normal",
        "Lock": "",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "TypeRecord": null
    },
    {
        "AssetGroup": "ItemFeet",
        "Item": "Slime",
        "Name": "活体媚药凝胶",
        "Description": "用于惩罚工作不利的无人机",
        "Color": "#CC33CC,#CC33CC,#CC33CC",
        "Property": "Normal",
        "Lock": "",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "TypeRecord": null
    },
    {
        "AssetGroup": "ItemDevices",
        "Item": "ExclusiveWaitress",
        "Name": "无人机移动装置",
        "Description": "辅助无人机移动，确保工作效率。",
        "Color": "#7A808F,#CC33CC,#CC33CC,#9A8F79,#D6CBC1,Default,Default,Default",
        "Property": "Normal",
        "Lock": "",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "TypeRecord": {
            "c": 1,
            "b": 0,
            "f": 1,
            "l": 0,
            "m": 0,
            "r": 0
        }
    },
]
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
const EquipsFall = [
    {
        "AssetGroup": "ItemDevices",
        "Item": "FuturisticCrate",
        "Property": "Normal",
        "Lock": "",
        "Name": "能源生产单元",
        "Description": "通过无人机的高潮来产生能量",
        "Color": "#222222,Default,#444444,Default,Default,#FF1199,Default,#444444,#555555,#CC33CC,Default,Default,#BBBBFF,Default",
        "Private": false,
        "TypeRecord": {
            "d1": 4,
            "w": 2,
            "l": 2,
            "a": 0,
            "d": 1,
            "t": 0,
            "h": 4
        },
        "ItemProperty": {}
    }
];

const HangPoints = [
    { X: 30, Y: 1 },
    { X: 32, Y: 1 },
]
const CoffinPoints = [
    { X: 17, Y: 27 },
    { X: 19, Y: 27 },
    { X: 21, Y: 27 },
    { X: 23, Y: 27 },
    { X: 14, Y: 38 },
    { X: 16, Y: 38 },
    { X: 18, Y: 38 },
    { X: 20, Y: 38 }
    ];
const EndPoints = [
    { X: 0, Y: 2 },
    { X: 0, Y: 4 },
    { X: 0, Y: 6 },
    { X: 11, Y: 2 },
    { X: 11, Y: 4 },
    { X: 11, Y: 6 }
];


var iceTimer = -1;
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
function removeClothes(sender, refresh = true, removeUnderwear = true, removeCosplay = false) {
    InventoryRemove(sender, "Cloth")
    InventoryRemove(sender, "ClothAccessory")
    InventoryRemove(sender, "Necklace")
    InventoryRemove(sender, "Suit")
    InventoryRemove(sender, "ClothLower")
    InventoryRemove(sender, "SuitLower")
    InventoryRemove(sender, "AnkletRight")
    InventoryRemove(sender, "AnkletLeft")
    InventoryRemove(sender, "Shoes")
    InventoryRemove(sender, "Hat")
    InventoryRemove(sender, "Gloves")
    InventoryRemove(sender, "HandAccessoryLeft")
    InventoryRemove(sender, "HandAccessoryRight")
    InventoryRemove(sender, "Bracelet")
    InventoryRemove(sender, "Glasses")
    InventoryRemove(sender, "Jewelry")
    InventoryRemove(sender, "Mask")
    if (removeUnderwear) {
        InventoryRemove(sender, "Bra")
        InventoryRemove(sender, "Corset")
        InventoryRemove(sender, "Panties")
        InventoryRemove(sender, "Socks")
        InventoryRemove(sender, "SocksRight")
        InventoryRemove(sender, "SocksLeft")
        InventoryRemove(sender, "Garters")
    }
    if (removeCosplay) {
        InventoryRemove(sender, "HairAccessory1")
        InventoryRemove(sender, "HairAccessory2")
        InventoryRemove(sender, "HairAccessory3")
        InventoryRemove(sender, "TailStraps")
        InventoryRemove(sender, "Wings")

    }
    if (refresh == true) {
        CharacterLoadEffect(sender);
        ChatRoomCharacterUpdate(sender);
    }

}
//移除所有拘束
function removeRestrains(sender, refresh = true) {

    InventoryRemove(sender, "ItemFeet")
    InventoryRemove(sender, "ItemLegs")
    InventoryRemove(sender, "ItemVulva")
    InventoryRemove(sender, "ItemVulvaPiercings")
    InventoryRemove(sender, "ItemButt")
    InventoryRemove(sender, "ItemPelvis")
    InventoryRemove(sender, "ItemTorso")
    InventoryRemove(sender, "ItemTorso2")
    InventoryRemove(sender, "ItemNipples")
    InventoryRemove(sender, "ItemNipplesPiercings")
    InventoryRemove(sender, "ItemBreast")
    InventoryRemove(sender, "ItemArms")
    InventoryRemove(sender, "ItemHands")
    InventoryRemove(sender, "ItemNeck")
    InventoryRemove(sender, "ItemMouth")
    InventoryRemove(sender, "ItemMouth2")
    InventoryRemove(sender, "ItemMouth3")
    InventoryRemove(sender, "ItemHead")
    InventoryRemove(sender, "ItemNose")
    InventoryRemove(sender, "ItemHood")
    InventoryRemove(sender, "ItemEars")
    InventoryRemove(sender, "ItemDevices")
    InventoryRemove(sender, "ItemBoots")
    InventoryRemove(sender, "ItemAddon")
    if (refresh == true) {
        CharacterLoadEffect(sender);
        ChatRoomCharacterUpdate(sender);
    }
}
//检查当前房间是否可用，原理为检查最右侧一列六个格子的地砖与物体
function CheckRoom() {
    for (let i = 1; i < 7; i++) {
        let tile = GetCharIn40x40String(ChatRoomData.MapData.Tiles, 39, i);
        let obj = GetCharIn40x40String(ChatRoomData.MapData.Objects,39, i);
        if (tile != 115 || obj != 680) {
            return false;
        }
    }
    return true;
}
//初始化房间并传送至初始位置
function InitRoom() {
    const mapData = {
        "Type": "Always",
        "Tiles": "иЮиЮЮЮЮЮЮиЮиЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮиЮЮЮЮЮЮЮЮЮЮиЮЮииЮЮsxxЮииииЮxxЮЮииЮЮsиЮxЮЮxЮиЮЮииЮЮsxxЮЮЮЮЮЮxxЮиииииииииЮииЮЮsиЮxЮxxxxЮxЮиЮиЮииЮЮsxxЮxxxxЮxxЮиЮииЮЮsЮЮxЮЮnnЮЮxЮЮЮиЮииЮЮdnnnnnssnnnnnЮиЮииЮЮdnnnnnnnnnnnnЮиииииииииЮииЮЮdnnnnnnnnnnnnϨЮииЮЮdnnnnnnnnnnnnЮЮииЮЮdnnnnnnnnnnnnЮЮииЮЮdииииииииииииЮииииииииииииЮККККККККККККЮdииЮиииииииЮККККëëëКЮdиииииЮиииииииииЮߐëëКëëߐКëëëКЮdииЮииииЮߐКëКëКߐКëëëКЮdиииииЮииииииииииЮߐëëКëëߐКëëëКЮdииЮииииииииииЮߐКëКëКߐКëëëКЮdиииииЮииииииииииииЮߐëëКëëߐКëëëКЮdииЮииииииииЮߐКëКëКߐКëëëКЮdиииииЮииииииииКККЮߐëëКëëߐКëëëКЮdииЮииииëëЮߐКëКëКߐКëëëКЮdиииииЮииииииëëЮߐëëКëëߐКëëëКЮdииЮиииииииЮߐКëКëКߐКëëëКЮdиииииииииЮииииииииииииЮëКëКëëëКЮdККККККККККККЮККККККККККККЮККККККККККККЮdëëëККëëëëëЮККëКëКëКëКЮККëëëëëëëëЮdëëëëëККëëëëëЮëКëКëКëКëКëКЮëëëКëëëëëëëëЮdëëëëКëКëККëëЮККККККККККККЮëëëКëëëëëëëëЮdКККߐߐߐߐߐߐКëëЮëëëëëëëëëëëëЮëëëКëëëëëëëëЮdКККߐߐߐߐߐߐëëëЮëëëëëëëëëëëëЮëëëКëëëëëëëëЮdКККߐߐߐߐߐߐКККЮëëëëëëëëëëëëЮëëëКëëëëëëëëЮdКККߐߐߐߐߐߐКККЮëëëëëëëëëëëëЮëëëКëëëëëëëëЮdëëëߐߐߐКߐߐКëëЮëëëëëëëëëëëëЮðëðКëëëëëëëëЮdëëКߐߐߐКߐߐКëëЮëëëëëëëëëëëëЮКëëëëëëëëЮdëëКëКККëККëëЮККККККККККККЮКëëëëëëëëЮdëëëëëККëëëëëЮКëКëКëКëКëКëЮКëëëëëëëëЮdëëëëëККëëëЮКëКëКëКëККЮЮЮЮЮЮЮЮЮЮКККЮdККККККККККККЮККККККККККККЮККККККККККККЮК",
        "Objects": "ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd߮dddddddʨdࠖddddddddࠖddࠖࠖࠖࠖࠖࠖࠖࠖࠖࠖࠖddddddd߮dddddddʨdddddࠖࠖddddddddddddddddࠖddʔdʔdd߮dddddddʨdࠖddྴddྴddࠖddddddddddddࠖddddddd߮dddddddʨdddddddddddddddddddddddࠖddʔdʔdd߮dddddddʨdࠖddddddddࠖddddddddddddࠖddddddd߮dddddddʨdddddࠖࠖddddddddddddddddࠖddʔdʔdd߮dddddddddddddddddddddddddddddddࠖddddddd߮dddddddddddddddddddddddddddddddࠖddʔdʔdd߮dddddddddddddddddddddddddddddddࠖddddddd߮dddddddddddddnsddddddࠖࠖࠖࠖࠖࠖࠖࠖࠖࠖࠖddʔdʔdd߮ddddddddddddddddddddddddddddddddddddddd߮dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddྶdddྵddd߮dddddddddddddddddddddddddddddddࠖdddࠖddd߮dddddddddddddddddddྴdddddྵdddddྶdddྵddd߮dddddddddddddddddddddddddddddddࠖdddࠖddd߮dddddddddddddddddddddddddddddddྶdddྵddd߮dddddddddddddddddddddddddddddddࠖdddࠖddd߮ddddddddddddddddd dddddddddddddྶdddྵddd߮dddddddddddddddddddddྵdddddddddࠖdddࠖddd߮dddddddddddddddddddddddddddddddྶdddྵddd߮dddddddddddddddddྴdྭdྵdddddddddࠖdddࠖddd߮dddddddddddddddddddddddddddddddྶdddྵddd߮dddddddddddddddddddddddddddddddࠖdddࠖddd߮dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddЮdЮdЮdЮdddddddddddddddddddddྵddddddd¢dddddddddddddࠖdddddddddddddddddddddddddྶdྶdྭdྮdྫdྭdddࠖdddddddddddddddddddddddddddddddddddddddࠖdddddddddddddddddddddddddddddddddddddddࠖdddddddddddddddddddddddddddddddddddddddࠖdddddddddddddddddddddddddddddddddddddddࠖdddddddddddddddddddddddddddddddddddddddࠖdddddddddddddddddddddddddddddddddddddd߮ࠖ߮dddddddddddddddddddddddddྮdྫdྭdྮdྴdྴddࠖddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddЮdЮdЮdЮddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
    }
    ChatRoomData.MapData = mapData;
    ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: ChatRoomData, Action: "Update" });
    //传送至入口处
    TPSelf({ X: 5, Y: 11 })
}

function TPSelf(Pos, DoEnterTile = true) {
    Player.MapData.Pos = {X:Pos.X, Y:Pos.Y};
    ServerSend("ChatRoomCharacterMapDataUpdate", Pos);
    if (DoEnterTile) {
        EnterTile(Pos);
    }
}

function EnterTile(Pos) {

    if (LeashDronePlayer.inGame) {
        
        //进入标线提示
        if (ChatRoomMapViewGetObjectAtPos(Player.MapData.Pos.X, Player.MapData.Pos.Y).ID === 660) {
            SendMsg(LeashDronePlayer.anotherPlayer, new MsgInfo("HurdleBeep", true));
        }
        //进入冰面处理滑动
        if (ChatRoomMapViewGetTileAtPos(Player.MapData.Pos.X, Player.MapData.Pos.Y).ID === 2000) {
            LeashDronePlayer.onIce = true;
            let D = LeashDronePlayer.lastDire;
            let X = Player.MapData.Pos.X + ((D == "West") ? -1 : 0) + ((D == "East") ? 1 : 0);
            let Y = Player.MapData.Pos.Y + ((D == "North") ? -1 : 0) + ((D == "South") ? 1 : 0);
            let target = { X: X, Y: Y };
            
            iceTimer = setTimeout(() => {
                if (CanEnterTile(target.X, target.Y) == 0) {
                    LeashDronePlayer.onIce = false;
                }
                else {
                    TPSelf(target);
                }
            }, 1600);
        }
        else {
            LeashDronePlayer.onIce = false;
        }
        //进入棺材处理获得信息
        if (ChatRoomMapViewGetObjectAtPos(Player.MapData.Pos.X, Player.MapData.Pos.Y).ID === 1070) {
            let index = CoffinPoints.findIndex((a) => a.X == Player.MapData.Pos.X && a.Y == Player.MapData.Pos.Y);
            if (index != -1) {
                let returnStr = ""
                let isThisPlayer = (index < 4 == LeashDronePlayer.isPlayer1);
                let ind = (index < 4 ? index : index - 4)
                returnStr += isThisPlayer ? "该无人机" : "搭档机";
                returnStr += "的第" + (ind + 1) + "位数据为:" + (isThisPlayer ? LeashDronePlayer : LeashDronePlayer.anotherPlayer).lockCode.toString()[ind];
                SendMessageToSelf(returnStr);
            }
        }
        //进入红色地毯处理结局
        if (ChatRoomMapViewGetTileAtPos(Player.MapData.Pos.X, Player.MapData.Pos.Y).ID === 132) {
            if (LeashDronePlayer.currentLevel == levelsInfo.length - 1) {
                SendMsg(LeashDronePlayer.anotherPlayer, new MsgInfo("gameFinish", false));
                MsgInfo.DoCmd(new MsgInfo("gameFinish", true));
                return;
            }
        }
        
        let basePoint = levelsInfo[LeashDronePlayer.currentLevel].basePoint;
        let nextPoint = levelsInfo[LeashDronePlayer.currentLevel].PointListForThisPlayer()[LeashDronePlayer.levelProcess]
        //进入下一个目标点处理
        if (nextPoint.IsThisPoint(Pos, basePoint)) {
            if (levelsInfo[LeashDronePlayer.currentLevel].PointListForThisPlayer().length == LeashDronePlayer.levelProcess + 1) {
                //处理关卡完成
                LeashDronePlayer.levelFinish = true;
                LeashDronePlayer.ForceWait(true);
                SendMessageToSelf("达到指定目标点前，暂时关闭移动机能");
                SendMsg(LeashDronePlayer.anotherPlayer, new MsgInfo("levelFinish", true));
                //处理施放搭档
                if (nextPoint.releaseAnother) {
                    SendMessageToSelf("已重启搭档机移动机能");
                    SendMsg(LeashDronePlayer.anotherPlayer, new MsgInfo("release", true));
                }
            }
            else{
                //处理传送
                if (nextPoint.TPNext) {
                    LeashDronePlayer.levelProcess++;
                    nextPoint = levelsInfo[LeashDronePlayer.currentLevel].PointListForThisPlayer()[LeashDronePlayer.levelProcess]
                    TPSelf(nextPoint.ToPos(basePoint));
                }
                else {
                    //处理强制等待
                    if (nextPoint.forceWait) {
                        LeashDronePlayer.ForceWait(true);
                        SendMessageToSelf("搭档机达到指定目标点前，暂时关闭移动机能");
                        SendMsg(LeashDronePlayer.anotherPlayer, new MsgInfo("waited", true));
                    }
                    //处理施放搭档
                    if (nextPoint.releaseAnother) {
                        SendMessageToSelf("已重启搭档机移动机能");
                        SendMsg(LeashDronePlayer.anotherPlayer, new MsgInfo("release", true));
                    }
                    nextPoint = levelsInfo[LeashDronePlayer.currentLevel].PointListForThisPlayer()[LeashDronePlayer.levelProcess + 1];
                    //显示下一点位置
                    let npPos = nextPoint.ToPos(basePoint);
                    let distInfo = ``;
                    if (npPos.X !== Pos.X) {
                        if (npPos.X > Pos.X) {

                            distInfo += `东`;
                        }
                        else {
                            distInfo += `西`;
                        }
                        distInfo += Math.abs(npPos.X - Pos.X) + "格";
                    }
                    if (npPos.Y !== Pos.Y) {
                        if (npPos.Y > Pos.Y) {

                            distInfo += `南`;
                        }
                        else {
                            distInfo += `北`;
                        }
                        distInfo += Math.abs(npPos.Y - Pos.Y) + "格";
                    }
                    LeashDronePlayer.levelProcess++;
                    SendMessageToSelf(`当前进度${LeashDronePlayer.levelProcess},下一点位于${distInfo}处`);
                }
            }
        }
        
    }
    else {
        //大门向上传送两格
        if (ChatRoomMapViewGetTileAtPos(Player.MapData.Pos.X, Player.MapData.Pos.Y).ID === 115 && CheckRoom()) {
            TPSelf({ X: Player.MapData.Pos.X, Y: Player.MapData.Pos.Y - 2 })
        }
    }
}

//定时执行事件
function IntervalTimer() {
    if (LeashDronePlayer.inGame && LeashDronePlayer.inLevel) {
        //处理队友离开两格以外
        if (LeashDronePlayer.anotherPlayer !== undefined && LeashDronePlayer.anotherPlayer !== null) {
            let antoherPlayer = ChatRoomCharacter.find((a) => a.MemberNumber == LeashDronePlayer.anotherPlayer.MemberNumber);
            if (antoherPlayer === undefined || antoherPlayer === null) {
                SendMessageToSelf(`搭档机已掉线，任务失败`);
                MsgInfo.DoCmd(new MsgInfo("gameFinish", false));
                return;
            }
            let aPPos = antoherPlayer.MapData.Pos;
            let Distance = Math.max(Math.abs(Player.MapData.Pos.X - aPPos.X), Math.abs(Player.MapData.Pos.Y - aPPos.Y));
            if (LeashDronePlayer.leashTimer == -1 && Distance > 2) {
                let breakTime = levelsInfo[LeashDronePlayer.currentLevel].leashBreakTime;
                SendMessageToSelf(`据离搭档机过远,立即返回,超出${breakTime}秒后未返回将重新启动区域`);
                LeashDronePlayer.leashTimer = CurrentTime + breakTime * 1000;
            }
            if (LeashDronePlayer.leashTimer != -1) {
                if (Distance <= 2) {
                    LeashDronePlayer.leashTimer = -1;
                }
                if (CurrentTime > LeashDronePlayer.leashTimer && Distance > 2) {
                    SendMessageToSelf(`超出限制时间为返回至搭档机,重新启动区域`);
                    SendMsg(LeashDronePlayer.anotherPlayer, new MsgInfo("levelRestart", LeashDronePlayer.currentLevel));
                    LeashDronePlayer.leashTimer = -1;
                    LeashDronePlayer.levelTimer = -1;
                }
            }
        }
        //处理关卡超时
        if (LeashDronePlayer.levelTimer != -1 && CurrentTime > LeashDronePlayer.levelTimer) {
            LeashDronePlayer.leashTimer = -1;
            LeashDronePlayer.levelTimer = -1;
            SendMessageToSelf(`超出区域限制时间,重新启动区域`);
            SendMsg(LeashDronePlayer.anotherPlayer, new MsgInfo("levelRestart", LeashDronePlayer.currentLevel));
        }
        
    }
    
}
function SendMessageToSelf(message) {

    ChatRoomSendLocal(styleMessage(message));
}
function styleMessage(message) {
    return `<div style='
  background: #000000;
  padding: 8px;
  border: 1px solid #3C3C3C;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);
  font-family: Consolas, "Courier New", monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  border-radius: 2px;
  color: #00FF00;
  display: flex;
  align-items: baseline;
  gap: 0.4em;
  line-height: 1.5;      /* 控制整体行高 */
'><span style="font-size: 1.2vw;">■</span><span style="
  font-size: 1.6vw;
  white-space: pre-wrap;
  flex: 1;
  line-height: inherit;  /* 继承父级行高 */
  margin: 0;             /* 移除默认外边距 */
">${message}_</span></div>`;
}

function GetCharIn40x40String(string, x, y) {
    return string.charCodeAt(y * 40 + x);
}
function SetCharIn40x40String(string, x, y, char) {
    const strAry = string.split('');
    strAry[y * 40 + x] = String.fromCharCode(char);
    string = strAry.join('');
    return string;
}

function CanEnterTile(X, Y) {
    if ((X < 0) || (Y < 0) || (X >= ChatRoomMapViewWidth) || (Y >= ChatRoomMapViewHeight)) return 0;
    if (ChatRoomMapViewHasSuperPowers()) return ChatRoomMapViewBaseMovementSpeed / 10;
    if (ChatRoomMapViewIsWall(X, Y) && !ChatRoomMapViewCanEnterWall(X, Y)) return 0;

    // Floor obstacles from 2000 to 3000 cannot be crossed
    let ObjectID = ChatRoomData.MapData.Objects.charCodeAt(X + Y * ChatRoomMapViewWidth);
    if ((ObjectID >= 2000) && (ObjectID < 3000)) return 0;
    // Hurdle 2 cannot be crossed if the Player is Freeze
    if ((ObjectID == 670) && Player.HasEffect("Freeze")) return 0;
    // Hurdle 3 cannot be crossed if the Player is Freeze or slow
    if ((ObjectID == 680) && (Player.HasEffect("Freeze") || Player.HasEffect("Slow"))) return 0;

    // Cannot enter a tile occupied by another player
    for (let C of ChatRoomCharacter)
        if (!C.IsPlayer() && (C.MapData?.Pos != null) && (C.MapData.Pos.X === X) && (C.MapData.Pos.Y === Y))
            return 0;

    return 1;
}
var fog = "\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00";




//发送msg信息
function SendMsg(targetPlayer, Dict) {
    ServerSend("ChatRoomChat", { Content: "LeashDroneGame", Type: "Hidden", Dictionary :Dict, Target: targetPlayer.MemberNumber });
}

function SetTilesObjsEnterEvent() {
    //ChatRoomMapViewTileList[ChatRoomMapViewTileList.findIndex((obj) => obj.ID === 115)] =
    //{
    //     ID: 115, Type: "Floor", Style: "Pavement" , OnEnter: () => { Player.MapData.Pos = { X: 5, Y: 5 } }
    //};
    //ChatRoomMapViewObjectList[ChatRoomMapViewObjectList.findIndex((obj) => obj.ID === 660)] =
    //{
    //    ID: 660, Type: "FloorDecorationCamping", Style: "Hurdle1", OnEnter: () => { EnterHurdle1() }
    //};

}
//处理收到的信息
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
                //处理聊天信息
                ChatRoomMessageAdditionDict[key](SenderCharacter, msg, data)
            }
            for (var key in ChatRoomScriptDict) {
                if (data.Content === key && data.Type === "Hidden") {
                    //处理msg信息
                    ChatRoomScriptDict[key](SenderCharacter, data.Dictionary)
                }
            }
        }
    }
}

//启用脚本
function ScriptEnable() {
    if (typeof ChatRoomMessageAdditionDict === 'undefined') {
        ChatRoomMessageAdditionDict = {}
    }
    if (typeof ChatRoomScriptDict === 'undefined') {
        ChatRoomScriptDict = {}
    }
    //#region 重写地图函数

    //检测玩家是否可以移动至该位置,并在游戏过程中统一速度并忽略部分效果
    ChatRoomMapViewCanEnterTile = function (X, Y) {
        if (typeof LeashDronePlayer !== 'undefined' && LeashDronePlayer !== undefined && LeashDronePlayer !== null) {
            if (LeashDronePlayer.inGame) {
                //刷新迷雾
                ChatRoomMapViewTileFog = fog;
                ChatRoomMapViewObjectFog = fog;
            }
        }
        // Out of map bound or walls cannot enter, super powers skip everything
        if ((X < 0) || (Y < 0) || (X >= ChatRoomMapViewWidth) || (Y >= ChatRoomMapViewHeight)) return 0;
        if (ChatRoomMapViewHasSuperPowers()) return ChatRoomMapViewBaseMovementSpeed / 10;
        if (ChatRoomMapViewIsWall(X, Y) && !ChatRoomMapViewCanEnterWall(X, Y)) return 0;

        // Floor obstacles from 2000 to 3000 cannot be crossed
        let ObjectID = ChatRoomData.MapData.Objects.charCodeAt(X + Y * ChatRoomMapViewWidth);
        if ((ObjectID >= 2000) && (ObjectID < 3000)) return 0;
        // Hurdle 2 cannot be crossed if the Player is Freeze
        if ((ObjectID == 670) && Player.HasEffect("Freeze")) return 0;
        // Hurdle 3 cannot be crossed if the Player is Freeze or slow
        if ((ObjectID == 680) && (Player.HasEffect("Freeze") || Player.HasEffect("Slow"))) return 0;

        // Cannot enter a tile occupied by another player
        for (let C of ChatRoomCharacter)
            if (!C.IsPlayer() && (C.MapData?.Pos != null) && (C.MapData.Pos.X === X) && (C.MapData.Pos.Y === Y))
                return 0;





        //若在游戏过程中，统一速度和无视部分效果
        if (typeof LeashDronePlayer !== 'undefined' && LeashDronePlayer !== undefined && LeashDronePlayer !== null) {
            if (LeashDronePlayer.inGame) {
                //牵绳状态下禁止离开5*5外
                if (LeashDronePlayer.isLeashing && LeashDronePlayer.anotherPlayer != null) {
                    let pos = ChatRoomCharacter.find((a) => a.MemberNumber === LeashDronePlayer.anotherPlayer.MemberNumber).MapData.Pos;
                    let Distance = Math.max(Math.abs(X - pos.X), Math.abs(Y - pos.Y));
                    if (Distance > 2) {
                        return 0;
                    }
                }
                //在冰上禁止移动
                if (LeashDronePlayer.onIce) {
                    return 0;
                }
                return LeashDronePlayer.MoveSpeed;
            }
        }


        // Enclosed or suspended players cannot change tiles
        if (Player.IsEnclose() || Player.IsSuspended() || Player.IsMounted()) return 0;

        // The MapImmobile effect prevents players from moving
        if (Player.HasEffect("MapImmobile")) return 0;



        // Always full speed in water if wearing mermaid tail
        let TileID = ChatRoomData.MapData.Tiles.charCodeAt(X + Y * ChatRoomMapViewWidth);
        if ((TileID >= 2000) && (TileID < 3000) && InventoryIsWorn(Player, "MermaidTail", "ItemLegs")) return ChatRoomMapViewBaseMovementSpeed;

        // Base movement speed first, water tiles are slower
        let Speed = ChatRoomMapViewBaseMovementSpeed;
        if ((TileID >= 2000) && (TileID < 3000)) Speed = Speed * 2.5;

        // The hogtied/bound/slow/plugged modificator
        if ((Player.Pose != null) && (Player.Pose.indexOf("Hogtied") >= 0)) Speed = Speed * 12;
        else if (!Player.CanWalk()) Speed = Speed * 6;
        else if (Player.GetSlowLevel() > 0) Speed = Speed * Player.GetSlowLevel() * 2;
        else if (!Player.CanKneel()) Speed = Speed * 1.5;
        else if (Player.IsPlugged()) Speed = Speed * 1.2;
        undefined
        // Returns the final calculated speed
        return Speed;

    }

    //执行玩家移动，并在移动完成后调用进入格子的函数
    ChatRoomMapViewMovementProcess = function () {
        if ((ChatRoomMapViewMovement == null) || (ChatRoomMapViewMovement.TimeEnd > CommonTime())) return;
        LeashDronePlayer.lastDire = ChatRoomMapViewMovement.Direction;
        Player.MapData.Pos.X = ChatRoomMapViewMovement.X;
        Player.MapData.Pos.Y = ChatRoomMapViewMovement.Y;
        // Set the update flag and reduce the wait time by the time the player already waited
        ChatRoomMapViewUpdatePlayerFlag(ChatRoomMapViewMovement.TimeStart - ChatRoomMapViewMovement.TimeEnd);
        ChatRoomMapViewMovement = null;
        // After we moved, calculate the new perception masks
        ChatRoomMapViewCalculatePerceptionMasks();
        // Get the tile and object we entered
        const newTile = ChatRoomMapViewGetTileAtPos(Player.MapData.Pos.X, Player.MapData.Pos.Y);
        const newObject = ChatRoomMapViewGetObjectAtPos(Player.MapData.Pos.X, Player.MapData.Pos.Y);
        // If the current tile or object have OnEnter functions, execute them
        if (newTile && newTile.OnEnter) newTile.OnEnter();
        if (newObject && newObject.OnEnter) newObject.OnEnter();


        //执行移动后事件
        EnterTile(Player.MapData.Pos);

    }

    //执行牵绳移动，并时刻刷新牵绳对象
    ChatRoomMapViewLeash = function () {

        //刷新牵绳
        if (LeashDronePlayer.isLeashing.inGame && LeashDronePlayer.isLeashing && LeashDronePlayer.anotherPlayer != null) {
            ChatRoomLeashPlayer = this.anotherPlayer.MemberNumber
        }

        // Finds the leash holder character
        if (ChatRoomLeashPlayer == null) return;
        for (let C of ChatRoomCharacter)
            if ((C.MemberNumber == ChatRoomLeashPlayer) && !C.IsPlayer()) {

                // Validates the data first
                if ((Player.MapData == null) || (Player.MapData.Pos.X == null) || (Player.MapData.Pos.Y == null)) return;
                if ((C.MapData?.Pos == null) || (C.MapData.Pos.X == null) || (C.MapData.Pos.Y == null)) return;

                // Leash range is 2 tiles
                let Distance = Math.max(Math.abs(Player.MapData.Pos.X - C.MapData.Pos.X), Math.abs(Player.MapData.Pos.Y - C.MapData.Pos.Y));
                if (Distance <= 2) return;

                // The X and Y variance tells us where to pull the character
                let VarX = Player.MapData.Pos.X - C.MapData.Pos.X;
                let VarY = Player.MapData.Pos.Y - C.MapData.Pos.Y;
                let TargetX = Player.MapData.Pos.X;
                let TargetY = Player.MapData.Pos.Y;
                if (VarX > 2) TargetX = C.MapData.Pos.X + 2;
                if (VarX < -2) TargetX = C.MapData.Pos.X - 2;
                if (VarY > 2) TargetY = C.MapData.Pos.Y + 2;
                if (VarY < -2) TargetY = C.MapData.Pos.Y - 2;

                // If the new target tile cannot be entered, we try another one nearby
                if (ChatRoomMapViewCanEnterTile(TargetX, TargetY) <= 0) {

                    // Tries to bring the character one extra tile toward the leash holder on the invert axis (X instead of Y or vice versa)
                    if ((Math.abs(VarX) > 2) && (Math.abs(VarX) > Math.abs(VarY)) && (VarY > 0)) TargetY--;
                    if ((Math.abs(VarX) > 2) && (Math.abs(VarX) > Math.abs(VarY)) && (VarY < 0)) TargetY++;
                    if ((Math.abs(VarY) > 2) && (Math.abs(VarX) < Math.abs(VarY)) && (VarX > 0)) TargetX--;
                    if ((Math.abs(VarY) > 2) && (Math.abs(VarX) < Math.abs(VarY)) && (VarX < 0)) TargetX++;

                    // If we still cannot move there
                    if (ChatRoomMapViewCanEnterTile(TargetX, TargetY) <= 0) {

                        // Bring the character 1 tile near the leash holder
                        if (VarX > 1) TargetX = C.MapData.Pos.X + 1;
                        if (VarX < -1) TargetX = C.MapData.Pos.X - 1;
                        if (VarY > 1) TargetY = C.MapData.Pos.Y + 1;
                        if (VarY < -1) TargetY = C.MapData.Pos.Y - 1;

                        // If it still doesn't work, we give up
                        if (ChatRoomMapViewCanEnterTile(TargetX, TargetY) <= 0) return;

                    }

                }

                // Sends the movement packet
                Player.MapData.Pos.X = TargetX;
                Player.MapData.Pos.Y = TargetY;
                ChatRoomMapViewUpdatePlayerFlag();
                return;

            }

    }
    //#endregion



    ServerSocket.on("ChatRoomMessage", function (data) { ChatRoomMessageAdd(data); });
    ChatRoomScriptDict["LeashDroneGame"] = function (SenderCharacter, dict) { MsgInfo.DoCmd(dict) };
    CommandCombine([
        {
            Tag: "d",
            Description: "LeashDroneGame",
            Action: function (text) {
                const command = text.split(" ")[0];
                const commandText = text.split(" ").slice(1).join(" ");

                CommandInfo.DoCmd(new CommandInfo(command, commandText));
            },
        },
    ]);
    SetTilesObjsEnterEvent();

    setInterval(() => { IntervalTimer() }, 100);
    LeashDronePlayer = new playerInfo(Player);
    console.log(`启动完成`);
}

async function WaitEnable() {
    if (!window.LeashDrone) {
        console.log(`加载完成`);
        window.LeashDrone = true;
        await waitFor(() => typeof window.Player?.MemberNumber === "number");
        ScriptEnable();
    }
}
async function waitFor(func, cancelFunc = () => false) {
    while (!func()) {
        if (cancelFunc()) {
            return false;
        }
        // eslint-disable-next-line no-await-in-loop
        await sleep(10);
    }
    return true;
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
WaitEnable();

