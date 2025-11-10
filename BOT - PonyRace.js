let waitingPlayer = [];
let playingPlayer = [];
let readybolckList = [];
let failbolckList = [];
let warpExitLv1List = [];
let warpExitLv2List = [];
let warpExitListLists = [warpExitLv1List, warpExitLv2List];
let startList = [];
let checkCountList = [[], [], []];
let resultList = [];
let failPonyList = [];
let finishPonyList = [];
let checkPointList = [];
let tpCount = 0;
let retryCount = 0;
let canTeleport;
let checkCount;
//可添加新地图，添加进mapList后用useMapIndex指示要使用的地图
const lineMap = {
    "Type": "Always",
    "Tiles": "ÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒАААААААААААААААААААААААААААААААААААÒÒÒÒÒАð×××××АߤߤАë××××Аð×××××××АА×××ðАë×АÒÒÒÒÒА××××××А××××А×ߤ×××××××АА××××ААААА×АÒÒÒÒÒА××××××××А××ߤ×А××××××××××АА×××××А×АÒÒÒÒÒА×××ААААААААААААААААААААААААААА×××АÒÒÒÒÒА×××АÒÒÒÒÒÒÒÒÒÒÒÒА×××АÒÒÒÒÒÒÒÒА×××АÒÒÒÒÒА×××ААААААААААÒÒÒААА×АÒАААААААА×××АÒÒÒÒÒА××××××××××АëАÒÒÒА×××АÒА××××××××АААÒÒÒÒÒА××××××ААААА×АÒÒÒА×АААÒА×ߤߤ×××××АААÒÒÒÒÒА××××××××××××АÒÒÒА×××АÒА×ߤߤ×××××ААААААÒÒААА×АААААА×××АÒÒÒААА×АÒА×××АААА×××××ðАÒÒА×××А××××А×××АÒÒÒА×××АÒА×ߤߤАÒÒА××××××АÒÒА×××А×АА×А×××АÒÒÒА×АААÒА×ߤ×АÒÒА××××××АÒÒА×××А×АА×А×××АÒÒÒА×××АÒАߤߤ×АÒÒААААААААÒÒА×××А××А×А×××АÒÒÒААА×АÒА×××АÒÒÒÒÒÒÒÒÒÒÒÒА×××АА×А×А×××АААÒА×××АÒА×××АААААААААÒÒÒÒАААААА×А×А××××ðАÒАААААÒА×ߤߤߤ×××ߤ×××АÒÒÒÒА××××××ААА×××××АÒÒÒÒÒÒÒА×××ߤߤߤߤ××ߤ×АÒÒÒÒА××××××А×А×××××АÒÒÒÒÒÒÒА×××××××××ߤ×АÒÒÒÒА××××××АðААА×××ААААААААААААААААА×××АÒÒÒÒАААААААААААА×××АА×××××××ë××××××АА×ААÒÒÒÒА×××А××××××××××АА×АААААААААААА×АА×ААÒÒÒÒА××××××××××××××АА××××××АÒА×××××АА×ААÒÒÒÒА×××А××××××××××ААААААА×АÒА×АААААА×ААÒÒÒÒА×ߤߤАААААААААААААААААА×ААА×ААÒÒАА×ААÒÒÒÒА×ߤߤАААА×××××××ААААА××××××××АÒÒАА×ААÒÒÒÒА××××××××××××××ААААА××××××××АÒÒАА×ААÒÒÒÒА×ߤߤАААА×××××××ААААА××××××××АÒÒАА×ААÒÒÒÒА×ߤߤАААА×××АААААААААААААА×××АÒÒА×××АÒÒÒÒА××××××××××АААААААААААААА×××АÒÒА×××АÒÒÒÒА×ߤߤАААА×××АААААААААААААА×××АÒÒА×××АÒÒÒÒА×ߤߤАААА×××ААААААААААА×××АÒÒА×××АÒÒÒÒА××××××××××ААААААæАæАæААА×××АААА×××АÒÒÒÒА×ߤߤАААА×××АААААæææææææАА××××××××А×АÒÒÒÒА×ߤߤАААА×××АААААæææææææАА×××АААААА×АÒÒÒÒА××××××××××АААААæææææææАА×××××××××ëАÒÒÒÒА××××××××××АААААæææææææАААААААААААААÒÒÒÒА××××××××××АААААæææææææАÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒААААААААААААААААæææææææАÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒ",
    "Objects": "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddʞdddddddddddddddddddddddddddddddddddddddddddddȉddddddddddddddddʔdddȉddddddddddddʞdddddddddddddddddddddʔddddddddddddddddྴdddddddddddddddddddddʔddddddddddddddddddddddddddddddddddddddddʔdddddddddddddddddʔddddddddddddddddddddddʔddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddʔʞʨdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddʔddddddddddddʔddddddddddddddddddddddddddddddddddddddddʔdɶdddddddddddddddddddddddddddddddddddʔdddʔdddddddddddddddddddddddddddddddddddddddddddddddddddʔdddddddddddʔdddddddddddddddddddddddddddddddddddddȈdddddddddddddddddddddddྴdddddddddddddddddddddddddddddddddddddddddddddྴdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddʞddddddddddddddddddddddddddddddddddddddddddddddddddddddddddʨddddddddddddddddddddddddddddddddȉdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddФdddddϲdddʔddddddddddddddddddddddʨddddddФdddddϲdddʔdʞdddddddddddddddddddddddddddФdddddϲdddʔddddddddȉdddddddddddddddddddddddddddddddddddddddddddddddddddddʞdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddʔddddddddddddddddddddddddʔdddddddddddddddddddddddиdddddиdddddddddddddddddddddddddddddddddиdddddиdddddddddddddddddddddddddddddddddиdddddиdddddddddddddddddddddddddddddddddиdddddиdddddddddddddddddddddddddddddddddиddnddиdddddddddddddddddddddddddddddddddиddsddиdddddddddddddddd"
}
const wildMap = {
    "Type": "Always",
    "Tiles": "АААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААА×А×А×АðА×××××××××А×А×××××××А××××××××АААААААААААА×××××××××ААА×××××××А×АААААА×АААА×А×А×А×А×××××××××А×А×××××××А×А××××А×АААА×А×А×А×А×××××××××ААА×××××××А×А×АА×А×АААА×А×А×А×А×××××××××А×А×××××××А×А××А×А×АААА×А×А×А×А×××××××××ААА×××××××А×А××А×А×АААА×А×А×А×А×××××××××××××××××××А×АААА×А×АААААААААААА××××××××××ð××××××××А××××××А×АААА×××××××××××××××××××××××××××ААААААААААААА××××××××××××××××××ð×××××××××××××××××АААА××××××××××××××××××××××××××××××××××××АААА××××××××××××××ð×××××ð×ð×××××××××××××АААА××××××××××××××××××××××××××××××××××××АААА××××××××××××××××××ð×××××××××××××××××АААА×××АААААА××××××××××××××××××ААААА××××АААА×××АААААА×××××××××ð××××××××ААААА××××АААА×××АААААА××××××××××××××××××ААААА××××АААА×××ААА××××××××××××××××××××××××АА××××АААА×××ААА××××××××××××××××××××××××АА××××АААА×××ААА××××××××××××××××××××××××АА××××АААА×××АААААА××××××××××××××××××ААААА××××АААА×××АААААА××××××××××××××××××ААААА××××АААА×××АААААА××××××××××××××××××ААААА××××АААА××××××××××××××××××××××××××××××××××××АААА××××××××××××××××АА×АА×××××××××××××××АААА××××××××××××××××ААААА×××××××××××××××АААА××××××××××××××××АА×АА×××××××××××××××АААА×××××××××××××ААААААААААА××××××××××××АААА×××××××××××××ААААААААААА××××××××××××ААААߤߤߤߤߤߤߤ××××××ААААААААААА××××××××××××ААААߤߤߤߤߤߤߤ××××××АААААААА××××××××××××ААААߤߤߤߤߤߤߤ××××××АААæАæАæААА××××××××××××ААААߤߤߤ×ߤߤߤ××××××××æææææææ××××××××××××××ААААߤߤߤߤߤߤߤ××××××××æææææææ××××××××ë×××ë×ААААߤߤߤߤߤߤߤ××××××ААæææææææАА××××××××××××ААААߤߤߤߤߤߤߤ××××××ААæææææææАА××××××××××××АААААААААААААААААААæææææææАААААААААААААААААААААААААААААААААæææææææАААААААААААААААА",
    "Objects": "ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddɶdʞdȉdddddddddddddȉdddddddddddddddddddddྴdྴdྴdྴdddddddddddྯdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddྮdddddddddʔddddʔdʔdddddddddddddddddddddddddddddddddddȉddddddddddddddddddddddddddྭddddddddddddȈddddddddddddddddddddddddddddddddddddddddddddddddྴdྴdྴdྴdddddddddddddddddddddddddddddddddddddddddddddddd߮߮߮߮߮߮߮dddddddddddddྴddddddddddddddddddd߮ddddd߮ddddddddddddddddddddddddddddddddd߮ddddd߮dddddddddddddddddddddddddddddddȈd߮Ȉd¤dd߮ddddddddddddddddddddddddddddddddd߮ddddd߮ddddddddddddddddddddddddddddddddd߮ddddd߮dddddddddddddddddddddddddddʔdddʔd߮߮߮߮߮߮߮ʔd dʔddddddddddddddddddddddʔdddʔddddddddʔdddʔddddddddddddddddddddddʔdddʔʔʔʔʔʔʔʔʔʔdddʔdddddddddddddddddddϲddddddddddddddddddddddФddddddddddddddddϲdddddddddddȉddddddddddФddddddddddddddddϲddddddddddddddddddddddФdddddddddddddddddddʔʔʔʔʔʔʔʔdddʔʔʔʔʔʔʔdddddddddddddddddddddddddddddʔdddʔdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddྴddddddddddddddddddddddddddddddddddddddd¢dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd߮߮߮߮߮dddddddȉddddddddddddddddddddddddddd߮ȉʔʔʔddddddddddddddddddddddddddddddddddd߮ʞʔdʔdddddddddddddddddddиdddddиddddddddɶ߮ɶʔʔʔdddddddddddddddddddиdddddиddddddddd߮dddddddddddddddddddddddиddnddиdddddddddddddddddddddddddddddddddиddsddиdddddddddddddddd"
}
let useMapIndex = 0;
const mapList = [{ Map: lineMap, TimeLimit: 400, CheckReq: 4 }, { Map: wildMap, TimeLimit: 800, CheckReq: 4 }];
let raceId;
//#region 马奴主体装备
const ponyItemVulva = {
    "Item": "VibratingDildo",
    "AssetGroup": "ItemVulva",
    "Name": "马奴按摩棒",
    "Description": "兼顾了奖励与惩罚马奴的功能",
    "Color": "#ED4BEE,#ED4BEE",
    "Property": "Arousing",
    "Lock": "",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": {
        "vibrating": 0
    },
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const ponyItemVulvaPiercings = {
    "Item": "VibeHeartClitPiercing",
    "AssetGroup": "ItemVulvaPiercings",
    "Name": "马奴震动环",
    "Description": "兼顾了奖励与惩罚马奴的功能",
    "Color": "Default,Default",
    "Property": "Arousing",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": {
        "vibrating": 0
    },
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const ponyItemButt = {
    "Item": "HorsetailPlug",
    "AssetGroup": "ItemButt",
    "Name": "马奴尾巴",
    "Description": "没有这个东西就不是马而是人了",
    "Color": "Default",
    "Property": "Normal",
    "Lock": "",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": null,
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const ponyItemArms = {
    "Item": "ShinyArmbinder",
    "AssetGroup": "ItemArms",
    "Name": "马奴束手器",
    "Description": "收起马奴无用的手臂",
    "Color": "Default,Default,Default,Default",
    "Property": "Rigid",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": {
        "typed": 2
    },
    "MemberName": "zajucd",
    "MemberNumber": 7092,
    "Disabled": true
}

const ponyItemNeck = {
    "Item": "PostureCollar",
    "AssetGroup": "ItemNeck",
    "Name": "马奴项圈",
    "Description": "让马奴卑贱的头颅时刻高昂",
    "Color": "#000000,Default,Default,Default",
    "Property": "Rigid",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": null,
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const ponyItemNeckAccessories = {
    "Item": "CustomCollarTag",
    "AssetGroup": "ItemNeckAccessories",
    "Name": "马奴名牌",
    "Description": "没有这个东西的话，就真的识别不出来你是哪个马奴了",
    "Color": "#aaa366,#000000",
    "Property": "Normal",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {
        "Text": "Slave"
    },
    "Text": "PONY",
    "Type": null,
    "TypeRecord": {
        "t": 0,
        "x": 0
    },
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const ponyItemMouth = {
    "Item": "PonyGag",
    "AssetGroup": "ItemMouth",
    "Name": "马奴口塞",
    "Description": "缰绳，口衔，眼罩一体化的马奴头部装备",
    "Color": "Default,Default,#383838,Default,Default,#B24031,Default,Default,#B24031,#EAEAEA,Default,#FF95DB,#383838,Default,#383838,#956B1C,#8A7055,#8A7055",
    "Property": "Large",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": {
        "g": 2,
        "p": 7,
        "r": 1,
        "t": 0,
        "e": 2,
        "h": 0,
        "b": 1
    },
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const ponyItemBreast = {
    "Item": "MetalChastityBra",
    "AssetGroup": "ItemBreast",
    "Name": "马奴贞操文胸",
    "Description": "马奴的工作只有比赛和下锅，种马这么轻松的工作是不会存在的",
    "Color": "Default",
    "Property": "Rigid",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": null,
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const ponyItemLegs = {
    "Item": "LeatherLegCuffs",
    "AssetGroup": "ItemLegs",
    "Name": "马奴腿铐",
    "Description": "有效防止马奴不优雅的动作",
    "Color": "Default,#2E2E2E,Default",
    "Property": "Normal",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": {
        "typed": 2
    },
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const ponyItemFeet = {
    "Item": "LeatherAnkleCuffs",
    "AssetGroup": "ItemFeet",
    "Name": "马奴脚铐",
    "Description": "有效防止马奴不优雅的动作",
    "Color": "Default,#2E2E2E,Default",
    "Property": "Normal",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": {
        "typed": 2
    },
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const ponyItemBoots = {
    "Item": "PonyBoots",
    "AssetGroup": "ItemBoots",
    "Name": "马奴靴",
    "Description": "马奴的蹄子，时刻保持优雅的姿态",
    "Color": "Default",
    "Property": "Rigid",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": null,
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const ponyItemNipplesPiercings = {
    "Item": "VibeHeartPiercings",
    "AssetGroup": "ItemNipplesPiercings",
    "Name": "马奴震动环",
    "Description": "兼顾了奖励与惩罚马奴的功能",
    "Color": "Default,Default",
    "Property": "Arousing",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": null,
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const ponyItemPelvis = {
    "Item": "PolishedChastityBelt",
    "AssetGroup": "ItemPelvis",
    "Name": "马奴贞操带",
    "Description": "马奴的工作只有比赛和下锅，种马这么轻松的工作是不会存在的",
    "Color": "Default",
    "Property": "Rigid",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": {
        "typed": 1
    },
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const ponyItemHead = {
    "Item": "InteractiveVisor",
    "AssetGroup": "ItemHead",
    "Name": "马奴导航仪",
    "Description": "高智能的AI会为马奴指示方向，看不见指引的马奴说明没有智能",
    "Color": "#AAAAAA",
    "Property": "Thick",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": {
        "typed": 0
    },
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const ponySuit = {
    "Item": "LatexCatsuit",
    "AssetGroup": "Suit",
    "TypeRecord": {
        "typed": 2
    },
    "Text": "PONY",
    "Text2": "#7092",
    "Text3": ""
}

const ponySuitLower = {
    "Item": "LatexCatsuit",
    "AssetGroup": "SuitLower",
    "TypeRecord": {
        "typed": 2
    },
    "Text": "PONY",
    "Text2": "#7092",
    "Text3": ""
}
//#endregion
//#region 马奴失败装备
const failItemHood_1 = {
    "Item": "LatexHoodOpenHair",
    "AssetGroup": "ItemHood",
    "Name": "败马头罩",
    "Description": "失败过的马奴不配露出脸庞",
    "Color": "Default,#555555",
    "Property": "Rigid",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": null,
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const failItemHood_2 = {
    "Item": "LeatherHoodOpenMouth",
    "AssetGroup": "ItemHood",
    "Name": "废马头罩",
    "Description": "连败的马奴没有任何权利",
    "Color": "#404040",
    "Property": "Rigid",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": null,
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const failItemDevices_1 = {
    "Item": "TheDisplayFrame",
    "AssetGroup": "ItemDevices",
    "Name": "败马展示架",
    "Description": "输掉比赛的马奴会被关在这里，其中不信邪的几个会挣扎出来再次参加比赛",
    "Color": "Default",
    "Property": "Decoy",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": null,
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const failItemDevices_2 = {
    "Item": "WoodenBox",
    "AssetGroup": "ItemDevices",
    "Name": "废马盒",
    "Description": "连败的马奴只能在这里面等待某人再给她一次机会",
    "Color": "Default,#600",
    "Property": "Secure",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {
        "Opacity": 0.75,
        "Text": "SALE"
    },
    "Type": null,
    "TypeRecord": {
        "typed": 0
    },
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const failItemDevices_3 = {
    "Item": "BrickWall",
    "AssetGroup": "ItemDevices",
    "Property": "Puzzling",
    "Lock": "OwnerPadlock",
    "Name": "马奴的坟墓",
    "Description": "一败再败的马奴只能永远的在这里后悔自己的无能",
    "Color": "#5A3F26,#707070,#7E5332,#6E472A,#707070,Default",
    "Private": false,
    "TypeRecord": {
        "typed": 6
    },
    "ItemProperty": {},
    "MemberNumber": 7092,
    "MemberName": "zajucd"
}


//#endregion
//#region 马奴胜利装备
const winItemHands = {
    "Item": "PonyMittensBinder",
    "AssetGroup": "ItemHands",
    "Property": "Normal",
    "Lock": "ExclusivePadlock",
    "Name": "冠军马蹄",
    "Description": "连胜的冠军有权增加一对马蹄",
    "Color": "#212121,Default,#111111,Default,#9A862D,#212121,Default,Default",
    "Private": false,
    "TypeRecord": {
        "typed": 1
    },
    "ItemProperty": {},
    "MemberNumber": 7092,
    "MemberName": "zajucd"
}

const winItemBoots = {
    "Item": "StrictPonyBoots",
    "AssetGroup": "ItemBoots",
    "Property": "Normal",
    "Lock": "ExclusivePadlock",
    "Name": "胜者马蹄",
    "Description": "赢得比赛的马奴有权获得更华丽的马蹄",
    "Color": "#0B0B0B,#0B0B0B,Default,#760000,#0B0B0B,Default,Default,#000000",
    "Private": false,
    "TypeRecord": null,
    "ItemProperty": {},
    "MemberNumber": 7092,
    "MemberName": "zajucd"
}

const winItemDevices = {
    "Item": "DisplayCase",
    "AssetGroup": "ItemDevices",
    "Property": "Normal",
    "Lock": "OwnerPadlock",
    "Name": "传奇墙",
    "Description": "以连胜书写传说的马奴有权成为装饰供众马奴敬仰",
    "Color": "Default",
    "Private": false,
    "TypeRecord": null,
    "ItemProperty": {},
    "MemberNumber": 7092,
    "MemberName": "zajucd"
}
//#endregion
//#region 地图陷阱装备
const trap1 = {
    "Item": "InflatableBodyBag",
    "AssetGroup": "ItemDevices",
    "Name": "陷阱袋",
    "Description": "被包住了，快挣脱吧",
    "ChatText": "被全包袋包了起来,她能够抵抗这安心的包裹感吗?",
    "Color": "Default",
    "Property": "Decoy",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": {
        "typed": 0
    },
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const trap2 = {
    "Item": "Post",
    "AssetGroup": "ItemNeckRestraints",
    "Name": "陷阱桩",
    "Description": "被栓住了，快挣脱吧",
    "ChatText": "被拴在了马桩上,现在可不是待命的时候啊！",
    "Color": "Default,Default,Default,Default",
    "Property": "Decoy",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": null,
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const trap3 = {
    "Item": "CeilingChain",
    "AssetGroup": "ItemAddon",
    "Name": "陷阱链",
    "Description": "被吊起来了，快挣脱吧",
    "ChatText": "被吊在了天花板上,两个马蹄扑棱的样子十分滑稽！",
    "Color": "Default",
    "Property": "Decoy",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": {
        "typed": 2
    },
    "MemberName": "zajucd",
    "MemberNumber": 7092
}

const trap4 = {
    "Item": "GlueFloor",
    "AssetGroup": "ItemDevices",
    "Name": "陷阱坑",
    "Description": "被黏住了，快挣脱吧",
    "ChatText": "的蹄子被胶水粘住了，这可是502强力胶！",
    "Color": "Default",
    "Property": "Decoy",
    "Lock": "",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": null,
    "MemberName": "zajucd",
    "MemberNumber": 7092,
    "Disabled": true
}
//#endregion
//#region 地图地板编号 T为Tile，O为Obj
const emptyO = 100;
const readyT = 140;
const readyBolckO = 2070;
const startedBolckO = 2030;
const failO = 1080;
const startLineO = 1010;
const finishLineO = 1060;
const trapLv1O = 660;
const trapLv2O = 670;
const trapLv3O = 680;
const waterT = 2020;
const checkPointO = 521;
const warpEnterLv1O = 630;
const warpExitLv1T = 235;
const warpEnterLv2O = 520;
const warpExitLv2T = 240;
const cheatT = 210;
//#endregion
//#region 装备集
const ponyMainList = [ponyItemArms, ponyItemBoots, ponyItemBreast, ponyItemButt, ponyItemFeet, ponyItemHead, ponyItemLegs, ponyItemMouth, ponyItemNeck, ponyItemNeckAccessories, ponyItemNipplesPiercings, ponyItemPelvis, ponyItemVulva, ponyItemVulvaPiercings, ponySuit, ponySuitLower]
//const ponyFailList1 = [failItemHood_1, failItemDevices_1];
//const ponyFailList2 = [failItemHood_2, failItemDevices_2];
const ponyFailList1 = [failItemHood_1];
const ponyFailList2 = [failItemHood_2];
const ponyFailList3 = [failItemDevices_3];
const ponyWinList1 = [winItemBoots];
const ponyWinList2 = [winItemHands];
const ponyWinList3 = [winItemDevices];
const ponyFailLists = [ponyFailList1, ponyFailList2, ponyFailList3];
const ponyWinLists = [ponyWinList1, ponyWinList2, ponyWinList3];
const ponyTrapList = [trap1, trap2, trap3, trap4];
//#endregion


const finishItemDevices = {
    "Item": "LowCage",
    "AssetGroup": "ItemDevices",
    "Name": "终点",
    "Description": "到达终点的马奴短暂休息的地方",
    "Color": "Default",
    "Property": "Normal",
    "Lock": "ExclusivePadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "TypeRecord": null,
    "MemberName": "BOT",
    "MemberNumber": 7092
}
resetRoom();
InitBot();

async function InitBot() {
    await WearFullRestrains(Player);
    ServerSend("ChatRoomCharacterMapDataUpdate", {Pos:{ X: 20, Y: 36 }} );
    Player.MapData.Pos = { X: 20, Y: 36 };
    InventoryWear(Player, "TheDisplayFrame", "ItemDevices", "Default", 80);
    InventoryLock(Player, "ItemDevices", { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
    InventoryGet(Player, "ItemDevices").Property.CombinationNumber = "7092";

    Player.Description = `
BOT game：PonyRace
作者: zajucd(7092)
原型: https://github.com/keykey5/BC-BOT-repository
发布地址: https://github.com/zajucd/BC_BotGame



请确保\"设置->束缚\"中\"离开房间不会被减速\"选项未选中,以保证移动速度正常.
请确保\"设置->沉浸\"中\"感觉剥夺设置\"选项设置为重度或完全,以保证视觉正常.

人不满时可发送 *startrace 直接开始比赛,如果准备区前有栏杆表示正在比赛
有需要时可发送 *giveuprace 放弃比赛重置位置


详细规则：
0.比赛中要是不能动了可能是因为被装了吊顶链，挣扎掉就好
1.三位玩家进入软垫地面后开始比赛;
2.经过所有拱门检查点到达终点，到达终点时未经过全部检查点则判负;
3.水池地板会减速;
4.栏杆为陷阱，可能触发玩具震动，腿铐收紧，眼罩致盲，陷阱装备;
5.陷阱装备部位随机，需要手动挣扎逃出;
6.帐篷与蛋糕为传送点，会传送至随机的黑色或白色地板上;
7.赢了有奖励(惩罚)，输了有惩罚(奖励);
8.胜利或失败三次后有惊喜;
9.比赛有时间限制，超时后未达到终点的玩家视作失败;

高额无偿悬赏不靠牵绳移动其它玩家位置的方法
以及查看其它玩家设置的方法

`
    // end of description
    ServerSend("AccountUpdate", { Description: Player.Description });
    ChatRoomCharacterUpdate(Player);
}


ChatRoomMessageAdditionDict["PonyRace"] = function (SenderCharacter, msg, data) { ChatRoomMessagePonyRace(SenderCharacter, msg, data) }
ChatRoomSyncMapDataeAdditionDict["PonyRace"] = function (SenderCharacter) { PlayerMoved(SenderCharacter) }
async function ChatRoomMessagePonyRace(SenderCharacter, msg, data) {
    if (SenderCharacter.MemberNumber == Player.MemberNumber) {
        return;
    }
    if ((data.Type == "Action") && (msg.startsWith("ServerEnter"))) {
        setTimeout(PlayerEnter(SenderCharacter), 1000, SenderCharacter);
    }
    else if ((msg.startsWith("ServerLeave")) || (msg.startsWith("ServerDisconnect")) || (msg.startsWith("ServerBan")) || (msg.startsWith("ServerKick"))) {

        let index;
        index = waitingPlayer.indexOf(SenderCharacter);
        if (index >= 0) {
            waitingPlayer = [];
            ServerSend("ChatRoomCharacterMapDataUpdate", { Pos:{ X: 20, Y: 36 }});
            ServerSend("ChatRoomChat", { Content: "*等待中玩家离开，请重新进入准备区.", Type: "Emote" });
            await resetRoom();
        }

        index = playingPlayer.indexOf(SenderCharacter);
        if (index >= 0) {
            playingPlayer.splice(index, 1);
            checkCountList.splice(index, 1);
            if (finishPonyList.length + failPonyList.length === playingPlayer.length) {
                await RaceOver();
            }
        }
        index = failPonyList.indexOf(SenderCharacter);
        if (index >= 0) failPonyList.splice(index, 1);

        index = finishPonyList.indexOf(SenderCharacter);
        if (index >= 0) finishPonyList.splice(index, 1);
        
        
    }
    else if ((data.Type == "Emote") || (data.Type == "Action") || (data.Type == "Hidden" && msg.startsWith("ChatRoomBot"))) {
        if (msg.toLowerCase().includes("exit")) {
            setTimeout(function (SenderCharacter) {
                ChatRoomAdminChatAction("Kick", SenderCharacter.MemberNumber.toString())
            }, 3 * 1000, SenderCharacter);
        }
        else {
            commandHandler(SenderCharacter, msg);
        }

    }
}

async function commandHandler(sender, msg) {
    if (msg.toLowerCase().includes("startrace")) {
        if (waitingPlayer.includes(sender)) {
            StartRace();
        }
    }
    else if (msg.toLowerCase().includes("giveuprace")) {
        let index = playingPlayer.indexOf(sender);
        if (index >= 0 && !failPonyList.includes(sender) && !finishPonyList.includes(sender)) {
            playingPlayer.splice(index, 1);
            FailedPlayer(sender);
        }
        else {
            await sleep(1000);
            let pos = FindFreeFailPoint();
            await Teleport(sender, pos.X, pos.Y)
        }
        if (finishPonyList.length + failPonyList.length === playingPlayer.length) {
            await RaceOver();
        }
    }
    //if (msgincludes("leash seems to be cursed and slips out of")) {
    //    ServerSend("ChatRoomCharacterMapDataUpdate", sender.MapData.Pos);
    //    await sleep(1000)
    //    ServerSend("ChatRoomChat", { Content: "*因你以禁用牵绳故无法使用牵绳传送功能，10秒后踢出", Type: "Emote", Target: sender.MemberNumber });
    //    setTimeout(function (sender) {
    //        console.log("? kick");
    //        ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
    //    }, 10 * 1000, sender);
    //}
}
async function PlayerEnter(sender) {
    var playable = true;
    await Teleport(sender, 20, 38);
    await sleep(1000);
    ServerSend("ChatRoomCharacterMapDataUpdate", { Pos:{ X: 20, Y: 36 }});
    ServerSend("ChatRoomChat", { Content: "*该bot现已发布至 https://github.com/zajucd/BC_BotGame ", Type: "Emote", Target: sender.MemberNumber });
    ServerSend("ChatRoomChat", { Content: "*正在测试R118版本更新的传送功能，可能会出现各种情况.", Type: "Emote", Target: sender.MemberNumber });
    if (sender.AllowedInteractions > 2) {
        ServerSend("ChatRoomChat", {
            Content: "*[需要调低 玩家权限 才能游玩.]",
            Type: "Emote",
            Target: sender.MemberNumber
        });
        playable = false;
    }
    //resetRoom();
    ServerSend("ChatRoomChat", {
        Content: "*This is a Chinese room,make sure you can read Chinese before start.",
        Type: "Emote",
        Target: sender.MemberNumber
    });
    ServerSend("ChatRoomChat", {
        Content: "*马奴大奖赛开幕了，现在参加即有机会(黑洞自然变回恒星的概率)赢得高达114514$大奖，你还在等什么，快进入前方软垫地板参赛吧.",
        Type: "Emote",
        Target: sender.MemberNumber
    });
    ServerSend("ChatRoomChat", {
        Content: "*因规则较为复杂，查看BIO以获取详细信息.",
        Type: "Emote",
        Target: sender.MemberNumber
    });
    let diff = 0;
    try {
        diff = sender.GetDifficulty();
    }
    catch {
        diff = sender.Difficulty;
    }
    if (diff <= 0) {
        ServerSend("ChatRoomChat", { Content: "*请在\"设置->束缚\"中取消\"离开房间不会被减速\"选项,以保证移动速度正常.", Type: "Emote", Target: sender.MemberNumber });
    }
    if (diff <= 2) {
        ServerSend("ChatRoomChat", { Content: "*请在\"设置->沉浸\"中将\"感觉剥夺设置\"选项设置为重度或完全,以保证视觉正常.", Type: "Emote", Target: sender.MemberNumber });
    }
     //ServerSend("ChatRoomChat", {
    //    Content: "*[NOTE:通过发送 *单词 来行动（例：*think）,游戏中可以使用 (think)来显示当前状态，使用(check)来观察当前的房间.且一切在括号内的单词均可用于行动]",
    //    Type: "Emote"
    //});
    //ServerSend("ChatRoomChat", {
    //    Content: "*[NOTE:如果被bot卡住，发送任意行动来重置bot位置]",
    //    Type: "Emote"
    //});
}
//全套马奴主体装备
async function WearFullRestrains(sender) {
    let item = InventoryGet(sender, "ItemHood");
    let failLv = 0
    if (item === undefined || item === null) {
        failLv = 0
    }
    else if (item.Asset.Name === failItemHood_1.Item) {
        failLv = 1
    }
    else if (item.Asset.Name === failItemHood_2.Item) {
        failLv = 2
    }
    else {
        failLv = 0
    }
    let item1 = InventoryGet(sender, "ItemBoots");
    let item2 = InventoryGet(sender, "ItemHands");
    let winLv = 0
    if (item2 != undefined && item2 != null && item2.Asset.Name === "PonyMittensBinder") {
        winLv = 2;
    }
    else if (item1 != undefined && item1 != null && item1.Asset.Name === "StrictPonyBoots") {
        winLv = 1
    }
    else {
        winLv = 0
    }
    RemoveRestrains(sender, false);
    RemoveClothes(sender, false);
    try {
        ponyItemNeckAccessories.ItemProperty.Text = sender.MemberNumber.toString();
    }
    catch {
        ponyItemNeckAccessories.ItemProperty.Text = "Slave";
    }
    await WearEquips(sender, ponyMainList, false);
    switch (winLv) {
        case 1: {
            InventoryRemove(sender, "ItemBoots");
            await WearEquips(sender, ponyWinList1, false);
        }
            break;
        case 2: {
            InventoryRemove(sender, "ItemArms");
            await WearEquips(sender, ponyWinList2, false);
        }
            break;
    }
    switch (failLv) {
        case 1: {
            await WearEquips(sender, ponyFailList1, false);
        }
            break;
        case 2: {
            await WearEquips(sender, ponyFailList2, false);
        }
            break;
    }
    InventoryRemove(sender, "ItemDevices");
    
    CharacterLoadEffect(sender);
    ChatRoomCharacterUpdate(sender);
}

//async function WearEquips(sender, List, refresh = true) {
//    for (let i = 0; i < List.length; i++) {
//        let res = List[i];
//        InventoryWear(sender, res.Item, res.AssetGroup, null, res.Property === "Decoy" ? -50 : 1000, 7092, Object.assign({}, res), false);
//        InventoryCraft(sender, sender, res.AssetGroup, Object.assign({}, res), false);
//        await sleep(100);
//    }
//    if (refresh) {
//        CharacterLoadEffect(sender);
//        ChatRoomCharacterUpdate(sender);
//    }
    
//}
//移除所有衣服


function CheckInventory(sender,item) {
    itemGetted = InventoryGet(sender, item.AssetGroup);
    if (itemGetted === undefined || itemGetted === null || itemGetted.Asset.Name != item.Item) {
        console.log(sender.Name + "缺失装备" + item.AssetGroup);
        InventoryWear(sender, item.Item, item.AssetGroup, null, 1000, 7092, Object.assign({}, item), false);
        InventoryCraft(sender, sender, item.AssetGroup, Object.assign({}, item), false);
        CharacterLoadEffect(sender);
        ChatRoomCharacterUpdate(sender);
        itemGetted = InventoryGet(Player, item.AssetGroup);
    };
    return itemGetted;
}

function PlayerMoved(sender) {
    let posIndex = sender.MapData.Pos.Y * ChatRoomMapViewWidth + sender.MapData.Pos.X;
    switch (ChatRoomData.MapData.Tiles[posIndex].charCodeAt()) {
        case readyT: {
            PlayerReady(sender);
        }
            break;
        case waterT: {

        }
            break;
        case cheatT: {
            PlayerCheated(sender);
        }
            break;
    }
    switch (ChatRoomData.MapData.Objects[posIndex].charCodeAt()) {
        case finishLineO: {
            PonyFinsh(sender);
        }
            break;
        case checkPointO: {
            PonyCheck(sender);
        }
            break;
        case trapLv1O: {
            PonyTrap(sender, 1);
        }
            break;
        case trapLv2O: {
            PonyTrap(sender, 2);
        }
            break;
        case trapLv3O: {
            PonyTrap(sender, 3);
        }
            break;
        case warpEnterLv1O: {
            PonyWarp(sender, 1)
        }
            break;    
        case warpEnterLv2O: {
            PonyWarp(sender, 2)
        }
            break;
        
    }
}



//玩家进入等待区
async function PlayerReady(sender) {
    ServerSend("ChatRoomCharacterMapDataUpdate", { Pos:{ X: 20, Y: 36 }});
    if (playingPlayer.length != 0) return;
    if (waitingPlayer.indexOf(sender) >= 0) return;
    if (sender.AllowedInteractions > 2) {
        ServerSend("ChatRoomChat", {
            Content: "*[需要调低 玩家权限 才能游玩.]",
            Type: "Emote",
            Target: sender.MemberNumber
        });
        return;
    }
    waitingPlayer.push(sender);
    let playerPos = Player.MapData.Pos;

    ServerSend("ChatRoomCharacterMapDataUpdate", { Pos:{ X: sender + 2, Y: sender + 2 }});
    let objStr = ChatRoomData.MapData.Objects;
    objStr = SetCharIn40x40String(objStr, sender.MapData.Pos.X, sender.MapData.Pos.Y + 1, readyBolckO);
    ChatRoomData.MapData.Objects = objStr;
    UpdateRoom(ChatRoomData);
    await sleep(100);
    let diff = 0;
    try {
        diff = sender.GetDifficulty();
    }
    catch {
        diff = sender.Difficulty;
    }
    if (diff <= 0) {
        ServerSend("ChatRoomChat", { Content: "*请在\"设置->束缚\"中取消\"离开房间不会被减速\"选项,以保证移动速度正常.", Type: "Emote", Target: sender.MemberNumber });
    }
    if (diff <= 2) {
        ServerSend("ChatRoomChat", { Content: "*请在\"设置->沉浸\"中将\"感觉剥夺设置\"选项设置为重度或完全,以保证视觉正常.", Type: "Emote", Target: sender.MemberNumber });
    }
    
    await sleep(1000);
    await WearFullRestrains(sender);
    ServerSend("ChatRoomCharacterMapDataUpdate", { Pos:playerPos} );
    if (waitingPlayer.length === 3) {
        StartRace();
    }
}
async function StartRace() {
    ServerSend("ChatRoomCharacterMapDataUpdate", { Pos:{ X: 20, Y: 36 }});
    ServerSend("ChatRoomChat", { Content: "*马奴已到齐，比赛即将开始.", Type: "Emote" });
    waitingPlayer.forEach((sender) => {
        ServerSend("ChatRoomChat", { Content: "(马奴已到齐，比赛即将开始.)", Type: "Whisper", Target: sender.MemberNumber });
    })
    let str = "";
    for (let i = 0; i < waitingPlayer.length; i++) {
        str += waitingPlayer[i].Name + ",";
    }
    ServerSend("ChatRoomChat", { Content: "*参赛马奴分别为" + str + ".", Type: "Emote" });
    waitingPlayer.forEach((sender) => {
        ServerSend("ChatRoomChat", { Content: "(参赛马奴分别为" + str + ".)", Type: "Whisper", Target: sender.MemberNumber });
    })
    ServerSend("ChatRoomChat", { Content: "*场地中共有" + checkPointList.length + "个检查点，马奴需经过" + mapList[useMapIndex].CheckReq + "个拱门检查点后到达终点，若达到终点时未经过" + mapList[useMapIndex].CheckReq + "个检查点即判负.", Type: "Emote" });
    waitingPlayer.forEach((sender) => {
        ServerSend("ChatRoomChat", { Content: "(场地中共有" + checkPointList.length + "个检查点，马奴需经过" + mapList[useMapIndex].CheckReq + "个拱门检查点后到达终点，若达到终点时未经过" + mapList[useMapIndex].CheckReq + "个检查点即判负.)", Type: "Whisper", Target: sender.MemberNumber });
    })
    ServerSend("ChatRoomChat", { Content: "*起点前挡板栏杆撤下后即为开始.比赛限时" + mapList[useMapIndex].TimeLimit + "秒.", Type: "Emote" });
    waitingPlayer.forEach((sender) => {
        ServerSend("ChatRoomChat", { Content: "(起点前挡板栏杆撤下后即为开始.比赛限时" + mapList[useMapIndex].TimeLimit + "秒)", Type: "Whisper", Target: sender.MemberNumber });
    })
    waitingPlayer.forEach((sender) => {
        ServerSend("ChatRoomChat", { Content: "(若比赛开始时视觉即受限，可尝试点击自身角色->左上清除面部表情)", Type: "Whisper", Target: sender.MemberNumber });
    })
    playingPlayer = waitingPlayer;
    waitingPlayer = [];

    //布置起点前挡板
    let objStr = ChatRoomData.MapData.Objects;
    startList.forEach(function (pos) {
        objStr = SetCharIn40x40String(objStr, pos.X + 2, pos.Y, startedBolckO);
    });
    readybolckList.forEach(function (pos) {
        objStr = SetCharIn40x40String(objStr, pos.X, pos.Y + 1, startedBolckO);
    });
    ChatRoomData.MapData.Objects = objStr;
    UpdateRoom(ChatRoomData);
    await sleep(2000);
    ScanMap();
    for (let index = 0; index < playingPlayer.length; index++) {
        let sender = playingPlayer[index];
        let result = await Teleport(sender, startList[index].X, startList[index].Y);
        await sleep(2000);
        if (result === false) {
            ServerSend("ChatRoomChat", { Content: "*传送失败.", Type: "Emote", Target: sender.MemberNumber });
            playingPlayer.splice(index, 1);
            if (failPonyList.length + finishPonyList.length === playingPlayer.length) {
                RaceOver();
            }
        }
    }
    await sleep(2000);
    ServerSend("ChatRoomChat", { Content: "*3.", Type: "Emote" });
    playingPlayer.forEach((sender) => {
        ServerSend("ChatRoomChat", { Content: "(3.)", Type: "Whisper", Target: sender.MemberNumber });
    })
    await sleep(2000);
    ServerSend("ChatRoomChat", { Content: "*2.", Type: "Emote" });
    playingPlayer.forEach((sender) => {
        ServerSend("ChatRoomChat", { Content: "(2.)", Type: "Whisper", Target: sender.MemberNumber });
    })
    await sleep(2000);
    ServerSend("ChatRoomChat", { Content: "*1.", Type: "Emote" });
    playingPlayer.forEach((sender) => {
        ServerSend("ChatRoomChat", { Content: "(1.)", Type: "Whisper", Target: sender.MemberNumber });
    })
    await sleep(2000);
    ServerSend("ChatRoomChat", { Content: "*开始！", Type: "Emote" });
    playingPlayer.forEach((sender) => {
        ServerSend("ChatRoomChat", { Content: "(开始！)", Type: "Whisper", Target: sender.MemberNumber });
    })
    objStr = ChatRoomData.MapData.Objects;
    startList.forEach(function (pos) {
        objStr = SetCharIn40x40String(objStr, pos.X + 2, pos.Y, emptyO);
    });
    ChatRoomData.MapData.Objects = objStr;
    UpdateRoom(ChatRoomData);

    setTimeout(function (id) {
        if (raceId === id) {
            console.log("超时结束" + id);
            RaceOver();
        }
        else {
            console.log("取消超时结束" + id);
        }
    }, mapList[useMapIndex].TimeLimit * 1000, raceId)

}
//玩家进入墙外浅色草地
async function PlayerCheated(sender) {
    let index = playingPlayer.indexOf(sender)
    if (index >= 0) {
        playingPlayer.splice(index, 1);
        checkCountList.splice(index, 1);
        if (failPonyList.length + finishPonyList.length === playingPlayer.length) {
            RaceOver();
        }
    }
    FailedPlayer(sender);
}
//游戏内玩家进入检查点
async function PonyCheck(sender) {
    if (playingPlayer.indexOf(sender) < 0) {
        await Teleport(sender, 20, 38);
        return;
    }
    ServerSend("ChatRoomCharacterMapDataUpdate", { Pos:{ X: 20, Y: 36 }});
    let index = playingPlayer.indexOf(sender);
    if (index === -1) return;
    let isFound = false; {
        for (let i = 0; i < checkCountList[index].length; i++) {
            if (checkCountList[index][i].X === sender.MapData.Pos.X && checkCountList[index][i].Y === sender.MapData.Pos.Y) {
                isFound = true;
            }
        }
    }
    if (isFound === false) {
        checkCountList[index].push(sender.MapData.Pos);
        ServerSend("ChatRoomChat", { Content: "*" + sender.Name + "到达了第" + checkCountList[index].length.toString() + "检查点.", Type: "Emote" });
        if (checkCountList[index].length === mapList[useMapIndex].CheckReq) {
            ServerSend("ChatRoomChat", { Content: "*" + sender.Name + "到达了足够的检查点.", Type: "Emote" });
        }
    }
    else {
        ServerSend("ChatRoomChat", { Content: "*" + sender.Name + "到达了重复的检查点，即使这样也不会发生什么的.", Type: "Emote" });
    }
}
//游戏内玩家进入陷阱执行陷阱事件12震动，34脚踝锁链，56关闭眼罩，78910陷阱装备
async function PonyTrap(sender, count, ran = -1) {
    if (playingPlayer.indexOf(sender) < 0) {
        await Teleport(sender, 20, 38);
        return;
    }
    ServerSend("ChatRoomCharacterMapDataUpdate", { Pos:{ X: 20, Y: 36 }});
    let ramdomMax = 10
    for (i = 0; i < count; i++) {
        let random = 0;
        if (ran === -1) {
            random = Math.floor(Math.random() * ramdomMax) + 1;
        }
        else {
            random = ran;
        }
        switch (random) {
            case 1:
            case 2: {
                let itemGetted = null;
                let items = [ponyItemVulva, ponyItemVulvaPiercings, ponyItemNipplesPiercings];
                items.forEach(function (item,) {

                    try {
                        itemGetted = CheckInventory(sender, item);

                        if (itemGetted.Property.TypeRecord.vibrating != 4) {
                            itemGetted.Property.TypeRecord.vibrating += 1;
                        }
                        if (itemGetted.Property.Effect.includes("Vibrating") === false) {
                            itemGetted.Property.Effect.push("Vibrating");
                        }
                    }
                    catch (e) {
                        console.log(sender.Name + "操作失败" + item.AssetGroup);
                        return;
                    }
                });
                ServerSend("ChatRoomChat", { Content: "*" + sender.Name + "体内的玩具的震动更强了，她能够撑住更加强烈的快感吗？", Type: "Emote" });
                break;
            }
            case 3:
            case 4: {
                let itemGetted = null;
                let items = [ponyItemFeet, ponyItemLegs];
                items.forEach(function (item) {

                    try {
                        itemGetted = CheckInventory(sender, item);

                        itemGetted.Property.TypeRecord.typed = 1;
                        itemGetted.Property.Effect = ["Slow"];
                    }
                    catch (e) {
                        console.log(sender.Name + "操作失败" + item.AssetGroup);
                        return;
                    }
                });
                ServerSend("ChatRoomChat", { Content: "*" + sender.Name + "的腿环和脚环的锁链缩成了最短，她能靠如此小的步幅继续奔跑吗？", Type: "Emote" });
                setTimeout(function () {
                    items.forEach(function (item) {
                        try {
                            itemGetted = CheckInventory(sender, item);
                            itemGetted.Property.TypeRecord.typed = 2;
                            itemGetted.Property.Effect = [];
                            itemGetted.Property.SetPose = [];
                            CharacterLoadEffect(sender);
                            ChatRoomCharacterUpdate(sender);
                        }
                        catch (e) {
                            console.log(sender.Name + "操作失败" + item.AssetGroup);
                            return;
                        }
                    });
                    ServerSend("ChatRoomChat", { Content: "*" + sender.Name + "的腿环和脚环的锁链松开了，但已经被其他马奴拉开了距离.", Type: "Emote" });
                }, 15 * 1000);

                break;
            }
            case 5:
            case 6: {
                let itemGetted = null;
                let items = [ponyItemHead];
                items.forEach(function (item) {

                    try {
                        itemGetted = CheckInventory(sender, item);

                        itemGetted.Property.TypeRecord.typed = 2;
                        itemGetted.Property.Effect = ["BlockWardrobe"];
                    }
                    catch (e) {
                        console.log(sender.Name + "操作失败" + item.AssetGroup);
                        return;
                    }
                });
                ServerSend("ChatRoomChat", { Content: "*" + sender.Name + "眼前导航仪的摄像头竟然故障了，不过不用担心，高智能的AI会为她指引方向，看不见AI?说明她没有智能！", Type: "Emote" });
                setTimeout(function () {
                    items.forEach(function (item) {
                        try {
                            itemGetted = CheckInventory(sender, item);
                            itemGetted.Property.TypeRecord.typed = 0;
                            itemGetted.Property.Effect = [];
                            CharacterLoadEffect(sender);
                            ChatRoomCharacterUpdate(sender);
                        }
                        catch (e) {
                            console.log(sender.Name + "操作失败" + item.AssetGroup);
                            return;
                        }
                    });
                    ServerSend("ChatRoomChat", { Content: "*" + sender.Name + "眼前导航仪的摄像头恢复了，但是她为什么落后了这么多？难道她智能低到看不见高智能的引导AI吗？.", Type: "Emote" });
                }, 15 * 1000);
                break;
            }
            case 7:
            case 8:
            case 9:
            case 10: {
                let res = ponyTrapList[random - 7];
                InventoryWear(sender, res.Item, res.AssetGroup, null, -50, 7092, Object.assign({}, res), false);
                InventoryCraft(sender, sender, res.AssetGroup, Object.assign({}, res), false);
                ServerSend("ChatRoomChat", { Content: "*" + sender.Name + res.ChatText, Type: "Emote" });

            }
        }
    }
    CharacterLoadEffect(sender);
    ChatRoomCharacterUpdate(sender);
}
//游戏内玩家进入传送点
async function PonyWarp(sender, lv) {
    if (playingPlayer.indexOf(sender) < 0) {
        await Teleport(sender, 20, 38);
        return;
    }
    ServerSend("ChatRoomCharacterMapDataUpdate", { Pos:{ X: 20, Y: 36 }});
    let random = Math.floor(Math.random() * warpExitListLists[lv - 1].length) + 1;
    let x = warpExitListLists[lv - 1][random - 1].X;
    let y = warpExitListLists[lv - 1][random - 1].Y;
    await Teleport(sender, x, y);
    ServerSend("ChatRoomChat", { Content: "*" + sender.Name + "使用了传送点，但真的走了捷径吗?", Type: "Emote" });
    
}

async function PonyFinsh(sender) {
    let index = playingPlayer.indexOf(sender);
    if (index === -1) {
        await Teleport(sender, 20, 38);
        return;
    }
    ServerSend("ChatRoomCharacterMapDataUpdate", { Pos:{ X: 20, Y: 36 }});
    index = failPonyList.indexOf(sender);
    if (index != -1) return;
    index = finishPonyList.indexOf(sender);
    if (index != -1) return;
    let res = finishItemDevices;
    index = playingPlayer.indexOf(sender);
    InventoryWear(sender, res.Item, res.AssetGroup, null, 1000, 7092, Object.assign({}, res), false);
    InventoryCraft(sender, sender, res.AssetGroup, Object.assign({}, res), false);
    CharacterLoadEffect(sender);
    ChatRoomCharacterUpdate(sender);
    if (checkCountList[index].length < mapList[useMapIndex].CheckReq) {
        ServerSend("ChatRoomChat", { Content: "*愚蠢的" + sender.Name + "达到终点时未经过全部个检查点，直接判负！", Type: "Emote" });
        failPonyList.push(sender);
    }
    else {
        ServerSend("ChatRoomChat", { Content: "*" + sender.Name + "达到了终点！", Type: "Emote" });
        finishPonyList.push(sender);
    }
    if (failPonyList.length + finishPonyList.length === playingPlayer.length) {
        RaceOver();
    }
}

async function RaceOver() {
    //if (playingPlayer.length === 1) {
    //    if (finishPonyList.length === 1) {
    //        ServerSend("ChatRoomChat", { Content: "*因为整场比赛只要一只马奴，所以" + finishPonyList[0].Name + "将会判负！", Type: "Emote" });
    //        let move = finishPonyList[0];
    //        failPonyList.push(move);
    //        finishPonyList.splice(0, 1);
    //    }
    //}
    
    try {
        ServerSend("ChatRoomCharacterMapDataUpdate", { Pos:{ X: 20, Y: 36 }});
        let sender;
        let winner = null;
        for (let j = 0; j < playingPlayer.length; j++) {
            sender = playingPlayer[j];
            if (finishPonyList.indexOf(sender) < 0 && failPonyList.indexOf(sender) < 0) {
                failPonyList.push(sender);
            }
        }
        if (finishPonyList.length > 0) {
            winner = finishPonyList[0];
            await WonPlayer(winner);
            finishPonyList.splice(0, 1);
        }
        await sleep(2000);
        failPonyList = failPonyList.concat(finishPonyList);
        for (let i = 0; i < failPonyList.length; i++) {
            sender = failPonyList[i];
            await FailedPlayer(sender);
            await sleep(2000);
        }
        if (winner !== null) {
            ServerSend("ChatRoomChat", { Content: "*恭喜马奴" + winner.Name + "获得了胜利！", Type: "Emote" });
        }
        if (failPonyList.length > 0) {
            let str = "";
            for (let i = 0; i < failPonyList.length; i++) {
                str += failPonyList[i].Name + ",";
            }
            ServerSend("ChatRoomChat", { Content: "*输掉比赛的马奴" + str + "将接受惩罚！", Type: "Emote" });
        }
        
       
    }
    catch (e) {
        console.log(e);
    }

    await resetRoom();
}
async function WonPlayer(sender) {
    InventoryRemove(sender, "ItemDevices");
    CharacterLoadEffect(sender);
    ChatRoomCharacterUpdate(sender);
    await sleep(1000);
    
    let item1 = InventoryGet(sender, "ItemBoots");
    let item2 = InventoryGet(sender, "ItemHands");
    let winLv = 0
    if (item2 != undefined && item2 != null && item2.Asset.Name === "PonyMittensBinder") {
        winLv = 2;
        let point = FindFreeFailPoint()
        await Teleport(sender, point.X, point.Y);
    }
    else if (item1 != undefined && item1 != null && item1.Asset.Name === "StrictPonyBoots") {
        InventoryRemove(sender, "ItemArms");
        winLv = 1
        await Teleport(sender, 20, 38);
    }
    else {
        InventoryRemove(sender, "ItemBoots");
        winLv = 0
        await Teleport(sender, 20, 38);
    }
    await sleep(1000);
    
    await WearEquips(sender, ponyWinLists[winLv]);
}
async function FailedPlayer(sender) {
    InventoryRemove(sender, "ItemDevices");
    CharacterLoadEffect(sender);
    ChatRoomCharacterUpdate(sender);
    await sleep(1000);
    let pos = FindFreeFailPoint();
    await Teleport(sender, pos.X, pos.Y);
    let item = InventoryGet(sender, "ItemHood");
    let failLv = 0
    if (item === undefined || item === null) {
        failLv = 0
    }
    else if (item.Asset.Name === failItemHood_1.Item) {
        failLv = 1
    }
    else if (item.Asset.Name === failItemHood_2.Item) {
        failLv = 2
    }
    else {
        failLv = 0
    }
    await WearEquips(sender, ponyFailLists[failLv]);
}
function FindFreeFailPoint() {
    let result = { X: 20, Y: 38 };
    failbolckList.forEach((point) => {
        let used = false;
        ChatRoomCharacter.forEach((player) => {
            if (player.MapData.Pos.X === point.X && player.MapData.Pos.Y === point.Y) {
                used = true;
                return;
            }
        });
        if (used === false) {
            result = point;
            return;
        }
    });
    return result;
}


function ScanMap() {
    readybolckList = [];
    warpExitLv1List = [];
    warpExitLv2List = [];
    failbolckList = [];
    startList = [];
    checkPointList = [];
    const tiles = ChatRoomData.MapData.Tiles;
    const objs = ChatRoomData.MapData.Objects;
    for (let index = 0; index < tiles.length; index++) {
        tile = tiles[index];
        switch (tile.charCodeAt()) {
            case readyT: {
                readybolckList.push({ X: (index % ChatRoomMapViewWidth), Y: (Math.floor(index / ChatRoomMapViewWidth)) });
            }
                break;
            case warpExitLv1T: {
                warpExitLv1List.push({ X: (index % ChatRoomMapViewWidth), Y: (Math.floor(index / ChatRoomMapViewWidth)) });
            }
                break;
            case warpExitLv2T: {
                warpExitLv2List.push({ X: (index % ChatRoomMapViewWidth), Y: (Math.floor(index / ChatRoomMapViewWidth)) });
            }
                break;
        }
    }
    warpExitListLists = [warpExitLv1List, warpExitLv2List];
    for (let index = 0; index < objs.length; index++) {
        obj = objs[index];
        switch (obj.charCodeAt()) {
            
            case startLineO: {
                startList.push({ X: (index % ChatRoomMapViewWidth), Y: (Math.floor(index / ChatRoomMapViewWidth)) });
            }
                break;
            case failO: {
                failbolckList.push({ X: (index % ChatRoomMapViewWidth), Y: (Math.floor(index / ChatRoomMapViewWidth)) });
            }
                break;
            case checkPointO: {
                checkPointList.push({ X: (index % ChatRoomMapViewWidth), Y: (Math.floor(index / ChatRoomMapViewWidth)) });
            }
                break;

        }
    }
}
function GetCharIn40x40String(string, x, y) {
    return string.charCodeAt(y * ChatRoomMapViewWidth + x);
}
function SetCharIn40x40String(string, x, y, char) {
    const strAry = string.split('');
    strAry[y * ChatRoomMapViewWidth + x] = String.fromCharCode(char);
    string = strAry.join('');
    return string;
}
//显示当前位置的tile与obj
function GetMapTileAndObjHere() {
    const tiles = ChatRoomData.MapData.Tiles;
    const objs = ChatRoomData.MapData.Objects;
    const pos = Player.MapData.Pos;
    console.log("tile:" + tiles[pos.Y * ChatRoomMapViewWidth + pos.X].charCodeAt());
    console.log("obj:" + objs[pos.Y * ChatRoomMapViewWidth + pos.X].charCodeAt());
}
async function UpdateRoom() {
    try {
        ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: ChatRoomGetSettings(ChatRoomData), Action: "Update" });
    }
    catch(e) {
        console.log(retryCount);
        console.log(e);
        await sleep(500);
        ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: ChatRoomGetSettings(ChatRoomData), Action: "Update" });

    }
}

async function resetRoom() {

    //重置游戏
    waitingPlayer = [];
    playingPlayer = [];
    readybolckList = [];
    warpExitLv1List = [];
    warpExitLv2List = [];
    startList = [];
    checkCountList = [[], [], []];
    resultList = [];
    failPonyList = [];
    finishPonyList = [];
    failbolckList = [];
    checkPointList = [];
    raceId = Math.floor(Math.random() * 90000 + 10000);
    canTeleport = true;
    
    //重置房间
    ChatRoomData.MapData = mapList[useMapIndex].Map;
    ChatRoomData.Description = "[BOT]密室逃生第五部 赛马奴";
    await UpdateRoom();
    ScanMap();
    await sleep(1000);
    //for (let i = 0; i < ChatRoomCharacter.length; i++) {
    //    if (ChatRoomCharacter.MemberNumber === Player.MemberNumber) continue;
    //    await sleep(1000);
    //    await Teleport(ChatRoomCharacter[i], 20, 38);
    //}

}

async function resetPos() {
    for (let i = 0; i < ChatRoomCharacter.length; i++) {
        await Teleport(ChatRoomCharacter[i], 20, 38);
        await sleep(1000);
    }
}
