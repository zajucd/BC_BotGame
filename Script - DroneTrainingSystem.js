//DTS基础插件
var secAfterStart = 0;
var timeEventInterval = -1;
var charaterInstalledScript_isDrone = new Map();
var showedEnterHelp = false;
var showChangeLog = false;
var changeLog =
    `更新日志
——————V1.0——————
1.增加了任务系统，道具系统
2.增加了训练设施地图
——————V0.2——————
1.增加了语音指令功能，便于无插件的玩家互动
2.增加了注册成为无人机时的流程
3.修复了若干bug
4.乳胶平滑面具的物品分层会竟然在修改物品设置时重置，ben987你赢了
——————V0.1——————
1.完成基础功能`


//{
//    "Item": "",
//        "AssetGroup": "",
//            "Color": ,
//    "Lock": "HighSecurityPadlock",
//        "Private": false,
//            "ItemProperty": { },
//    "Type": null,
//        "Property": "Normal",
//            "TypeRecord": ,
//    "MemberName": "zajucd",
//        "MemberNumber": 7092
//},
var Crate = {
    "Item": "FuturisticCrate",
    "AssetGroup": "ItemDevices",
    "Color": [
        "#222222",
        "Default",
        "#444444",
        "Default",
        "Default",
        "#FF1199",
        "Default",
        "#444444",
        "#555555",
        "#3B7F2C",
        "Default",
        "Default",
        "#BBBBFF",
        "Default"
    ],
    "Lock": "HighSecurityPadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "Property": "Normal",
    "TypeRecord": {
        "w": 1,
        "l": 0,
        "a": 0,
        "d": 0,
        "t": 0,
        "h": 0
    },
    "MemberName": "zajucd",
    "MemberNumber": 7092
}
var CrateBind = {
    "Item": "FuturisticCrate",
    "AssetGroup": "ItemDevices",
    "Color": [
        "#222222",
        "Default",
        "#444444",
        "Default",
        "Default",
        "#FF1199",
        "Default",
        "#444444",
        "#555555",
        "#3B7F2C",
        "Default",
        "Default",
        "#BBBBFF",
        "Default"
    ],
    "Lock": "HighSecurityPadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "Property": "Normal",
    "TypeRecord": {
        "w": 1,
        "l": 3,
        "a": 3,
        "d": 0,
        "t": 0,
        "h": 0
    },
    "MemberName": "zajucd",
    "MemberNumber": 7092
}
var OneBar = {
    "Item": "OneBarPrison",
    "AssetGroup": "ItemDevices",
    "Color": [
        "Default"
    ],
    "Lock": "HighSecurityPadlock",
    "Private": false,
    "ItemProperty": {},
    "Type": null,
    "Property": "Normal",
    "MemberName": "zajucd",
    "MemberNumber": 7092
}
var BasicDroneBinds = [
    //0
    {
        "Item": "LatexCatsuit",
        "AssetGroup": "Suit",
        "TypeRecord": {
            "typed": 0
        },
        "Color": [
            "#202020",
            "Default",
            "Default",
            "Default"
        ],
        "Text": "",
        "Text2": "",
        "Text3": ""
    },
    {
        "Item": "LatexCatsuit",
        "AssetGroup": "SuitLower",
        "TypeRecord": {
            "typed": 0
        },
        "Color": [
            "#202020",
            "Default",
            "Default",
            "Default"
        ],
        "Text": "",
        "Text2": "",
        "Text3": ""
    },

    //2
    {
        "Item": "FuturisticHarness",
        "AssetGroup": "ItemTorso",
        "Color": [
            "#666666",
            "#7A7A7A",
            "#393939",
            "#FFFFFF"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {
            "typed": 0
        },
        "Name": "无人机体态控制装置",
        "Description": "植入素体的肩部、背部、腹部，通过高扭力舵机控制无人机的体态，以防出现动作失误",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },
    {
        "Item": "HighSecurityHarness",
        "AssetGroup": "ItemTorso2",
        "Color": [
            "#444444",
            "Default"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {
            "typed": 0
        },
        "Name": "无人机体态控制装置",
        "Description": "植入素体的肩部、背部、腹部，通过高扭力舵机控制无人机的体态，以防出现动作失误",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },

    //4
    {
        "Item": "FuturisticVibrator",
        "AssetGroup": "ItemVulva",
        "Color": [
            "#454545",
            "#555555",
            "Default"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {
            "vibrating": 0
        },
        "Name": "无人机总电源与无人机电源接口",
        "Description": "无人机总电源植入素体子宫内，供应无人机的基础活动，无人机电源接口从阴道伸至体外，可以接受来自外部充电也可通过高潮充电",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },

    //5
    {
        "Item": "VibeHeartClitPiercing",
        "AssetGroup": "ItemVulvaPiercings",
        "Color": [
            "#595959",
            "Default"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {
            "vibrating": 0
        },
        "Name": "无人机内循环系统控制装置",
        "Description": "植入素体的乳头内，通过物理震动引发性唤起以进行激素调节",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },
    {
        "Item": "LockingVibePlug",
        "AssetGroup": "ItemButt",
        "Color": ["Default"],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {
            "vibrating": 0
        },
        "Name": "无人机内循环系统控制装置",
        "Description": "植入素体的肛门内，通过物理震动引发性唤起以进行激素调节",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },
    {
        "Item": "VibeHeartPiercings",
        "AssetGroup": "ItemNipplesPiercings",
        "Color": [
            "#6C6C6C",
            "Default"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {
            "vibrating": 0
        },
        "Name": "无人机内循环系统控制装置",
        "Description": "植入素体的阴蒂内，通过物理震动引发性唤起以进行激素调节",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },
    {
        "Item": "ShockClamps",
        "AssetGroup": "ItemNipples",
        "Color": [
            "#Default"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {
            "typed": 0
        },
        "Name": "无人机惩罚装置",
        "Description": "植入素体的乳头内，通过电流对无人机的失误行为进行惩罚",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },

    //9
    {
        "Item": "SciFiPleasurePanties",
        "AssetGroup": "ItemPelvis",
        "Color": [
            "#454545",
            "#202020",
            "#878787",
            "#202020",
            "#878787",
            "#878787",
            "Default"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {
            "c": 3,
            "i": 0,
            "o": 0,
            "s": 0
        },
        "Name": "无人机内循环系统控制装置中枢",
        "Description": "植入素体的小腹，对所有内循环系统控制装置进行控制调节，同时搭载对素体的高潮机能进行限制的功能",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },
    {
        "Item": "FuturisticBra",
        "AssetGroup": "ItemBreast",
        "Color": [
            "#4A4A4A",
            "#FFFFFF",
            "#FFFFFF",
            "#4B4B4B",
            "#363636"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {
            "typed": 0
        },
        "Name": "无人机生理信息监控装置",
        "Description": "植入素体的胸口，检测体温、心率、性唤起程度以进行生理状态调节",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },

    //11
    {
        "Item": "FuturisticAnkleCuffs",
        "AssetGroup": "ItemFeet",
        "Color": [
            "Default",
            "#494949",
            "#303030",
            "#FFFFFF"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { typed: 2 },
        "Name": "无人机运动控制装置",
        "Description": "接入素体的脚踝，使其无法进行未授权的运动，同时也能在必要时进行运动辅助",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },
    {
        "Item": "FuturisticLegCuffs",
        "AssetGroup": "ItemLegs",
        "Color": [
            "#Default",
            "#4A4A4A",
            "#383838",
            "#FFFFFF"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { typed: 2 },
        "Name": "无人机运动控制装置",
        "Description": "接入素体的腿部，使其无法进行未授权的运动，同时也能在必要时进行运动辅助",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },
    {
        "Item": "FuturisticMittens",
        "AssetGroup": "ItemHands",
        "Color": [
            "#777777",
            "#6E6E6E",
            "#3D3D3D",
            "Default"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {
            "typed": 1
        },
        "Name": "无人机运动控制装置",
        "Description": "接入素体的手部，使其无法进行未授权的运动，同时也能在必要时进行运动辅助",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },
    {
        "Item": "FuturisticHeels2",
        "AssetGroup": "ItemBoots",
        "Color": [
            "#212121",
            "#4A4A4A",
            "#383838",
            "#3D3D3D",
            "#404040",
            "#3D3D3D",
            "Default"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {
            "typed": 0
        },
        "Name": "无人机运动控制装置",
        "Description": "接入素体的足部，使其无法进行未授权的运动，同时也能在必要时进行运动辅助",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },
    {
        "Item": "FuturisticCuffs",
        "AssetGroup": "ItemArms",
        "Color": [
            "#4F4F4F",
            "#353535",
            "#FFFFFF"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {
            "typed": 0
        },
        "Name": "无人机运动控制装置",
        "Description": "接入素体的臂部，使其无法进行未授权的运动，同时也能在必要时进行运动辅助",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },

    //16
    {
        "Item": "DroneMask",
        "AssetGroup": "ItemHood",
        "Color": [
            "#222222",
            "#CCCCCC",
            "#7F7F7F",
            "#00F4FD",
            "#E700CA"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {
            "m": 0,
            "e": 0,
            "p": 1,
            "g": 2,
            "s": 1,
            "h": 0,
            "j": 5,
            "b": 0
        },
        "OverridePriority": {
            "EyeSmile": 0,
            "EyeSmileShine": 0,
            "Base": 12,
            "Shine": 12,
            "Barcode": 12,
            "Text": 12,
            "EyeSpiral": 0,
            "EyeSculpted": 0,
            "EyeRegular": 0,
            "EyeHoles": 0,
            "EyeRegularGlow": 0,
            "EyeSculptedGlow": 0,
            "EyeSmileGlow": 0,
            "EyeSpiralGlow": 0,
            "EyeConcaveShine": 0,
            "EyeRegularShine": 0,
            "EyeHolesShine": 0,
            "EyeSculptedShine": 0,
            "EyeSpiralShine": 0
        },
        "Name": "无人机个体识别装置",
        "Description": "植入素体的面部，禁用了素体原有的面部个体识别机能，转为通过条形码进行个体识别",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },

    //17
    {
        "Item": "OTNPlugGag",
        "AssetGroup": "ItemMouth",
        "Color": [
            "#665D5D",
            "#514D57",
            "Default",
            "#979595"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {
            "OverridePriority": {
                "Base": 0,
                "Straps": 0,
                "StrapsLong": 0
            }
        },
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { typed: 1 },
        "Name": "无人机消化系统外部接口",
        "Description": "接入素体的口腔，联通消化系统，使其可以接受无人机用营养块，同时也可作为性器使用",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },
    {
        "Item": "InteractiveVisor",
        "AssetGroup": "ItemHead",
        "Color": [
            "#333333",
            "#222222",
            "#CCCCCC",
            "#222222",
            "#CCCCCC",
            "#FF5AC8"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {
            "typed": 0
        },
        "Name": "无人机视觉系统外部接口",
        "Description": "接入素体的面部，链接视觉系统，使其可以直接接收来自系统的指令，同时也可屏蔽多余的视觉信息",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },
    {
        "Item": "LatexRespirator",
        "AssetGroup": "ItemMouth2",
        "Color": [
            "#333333",
            "#222222",
            "#CCCCCC",
            "#222222",
            "#CCCCCC",
            "#FF5AC8"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {
            "f": 2,
            "g": 1,
            "s": 0,
            "m": 2,
            "l": 1
        },
        "Name": "无人机呼吸系统外部接口",
        "Description": "接入素体的鼻腔，链接呼吸系统，使其仅可呼吸无人机用含药物气体，同时也封闭会厌软骨防止口部呼吸",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },
    {
        "Item": "FuturisticEarphones",
        "AssetGroup": "ItemEars",
        "Color": [
            "#898989",
            "#2A2A2A",
            "Default"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {
            "typed": 0
        },
        "Name": "无人机听觉系统外部接口",
        "Description": "接入素体的耳部，链接听觉系统，使其时刻聆听系统的训练课程，同时也可屏蔽多余的听觉信息",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },

    //21
    {
        "Item": "ShockCollar",
        "AssetGroup": "ItemNeck",
        "Color": [
            "Default",
            "Default"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "Name": "无人机惩罚装置",
        "Description": "植入素体的颈部，通过电流对无人机的失误行为进行惩罚",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },
    {
        "Item": "ElectronicTag",
        "AssetGroup": "ItemNeckAccessories",
        "Color": [
            "#595959",
            "Default",
            "#000000"
        ],
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "Name": "无人机显示器",
        "Description": "植入素体的颈部，显示无人机的输出信息，未使用时显示剩余电量",
        "MemberName": "无人机总控核心",
        "MemberNumber": 7092
    },

    //23
    {
        "Item": "Antenna",
        "AssetGroup": "HairAccessory1",
        "TypeRecord": {
            "typed": 5
        },
        "Color": [
            "#8F8F8F",
            "#000000",
            "#131313",
            "#FF5AC8",
            "#FF5AC8",
            "#8F8F8F",
            "#000000",
            "#131313",
            "#FF5AC8",
            "#FF5AC8"
        ],
    },
]
var BasicDroneeyes = [
    [
        {

            "Item": "InteractiveVisor",
            "AssetGroup": "ItemHead",
            "TypeRecord": {
                "typed": 0
            },
        },
    ],
    [
        {

            "Item": "InteractiveVisor",
            "AssetGroup": "ItemHead",
            "TypeRecord": {
                "typed": 1
            },
            "OverridePriority": {
                "Base": 12,
                "EyeRegularShine": 0,
                "Shine": 12,
                "Text": 12,
                "EyeRegular": 0
            },
        },
    ],
    [
        {

            "Item": "InteractiveVisor",
            "AssetGroup": "ItemHead",
            "TypeRecord": {
                "typed": 3
            },
        },
    ],
]
var BasicDroneears = [
    [
        {
            "Item": "FuturisticEarphones",
            "AssetGroup": "ItemEars",
            "TypeRecord": {
                "typed": 0
            },
        }
    ],
    [
        {
            "Item": "FuturisticEarphones",
            "AssetGroup": "ItemEars",
            "TypeRecord": {
                "typed": 1
            },
        }
    ],
    [
        {
            "Item": "FuturisticEarphones",
            "AssetGroup": "ItemEars",
            "TypeRecord": {
                "typed": 3
            },
        }
    ],
]
var BasicDronemouth = [
    [
        {
            "Item": "OTNPlugGag",
            "AssetGroup": "ItemMouth",
            "TypeRecord": { typed: 0 },
        }
    ],
    [
        {
            "Item": "OTNPlugGag",
            "AssetGroup": "ItemMouth",
            "TypeRecord": { typed: 1 },
        }
    ],
    [
        {
            "Item": "OTNPlugGag",
            "AssetGroup": "ItemMouth",
            "TypeRecord": { typed: 1 },
        }
    ]
]
var BasicDronebody = [
    [
        {
            "Item": "SciFiPleasurePanties",
            "AssetGroup": "ItemPelvis",
            "TypeRecord": {
                "o": 0,
            },
        }
    ],
    [
        {
            "Item": "SciFiPleasurePanties",
            "AssetGroup": "ItemPelvis",
            "TypeRecord": {
                "o": 2,
            },
        }
    ],
    [
        {
            "Item": "SciFiPleasurePanties",
            "AssetGroup": "ItemPelvis",
            "TypeRecord": {
                "o": 1,
            },
        }
    ],
]
var BasicDronehands = [
    [
        {
            "Item": "FuturisticCuffs",
            "AssetGroup": "ItemArms",
            "TypeRecord": {
                "typed": 0
            },
        },
        {
            "Item": "FuturisticMittens",
            "AssetGroup": "ItemHands",
            "TypeRecord": {
                "typed": 1
            },
        }
    ],
    [
        {
            "Item": "FuturisticCuffs",
            "AssetGroup": "ItemArms",
            "TypeRecord": {
                "typed": 1
            },
        },
        {
            "Item": "FuturisticMittens",
            "AssetGroup": "ItemHands",
            "TypeRecord": {
                "typed": 0
            },
        }
    ],
    [
        {
            "Item": "FuturisticCuffs",
            "AssetGroup": "ItemArms",
            "TypeRecord": {
                "typed": 3
            },
        },
        {
            "Item": "FuturisticMittens",
            "AssetGroup": "ItemHands",
            "TypeRecord": {
                "typed": 0
            },
        }
    ]
]
var BasicDronelegs = [
    [
        {
            "Item": "FuturisticAnkleCuffs",
            "AssetGroup": "ItemFeet",
            "TypeRecord": {
                "typed": 0
            },
        },
        {
            "Item": "FuturisticLegCuffs",
            "AssetGroup": "ItemLegs",
            "TypeRecord": {
                "typed": 0
            },
        }
    ],
    [
        {
            "Item": "FuturisticAnkleCuffs",
            "AssetGroup": "ItemFeet",
            "TypeRecord": {
                "typed": 2
            },
        },
        {
            "Item": "FuturisticLegCuffs",
            "AssetGroup": "ItemLegs",
            "TypeRecord": {
                "typed": 2
            },
        }
    ],
    [
        {
            "Item": "FuturisticAnkleCuffs",
            "AssetGroup": "ItemFeet",
            "TypeRecord": {
                "typed": 1
            },
        },
        {
            "Item": "FuturisticLegCuffs",
            "AssetGroup": "ItemLegs",
            "TypeRecord": {
                "typed": 1
            },
        }
    ],
]
var BasicDroneSet = {
    Binds: BasicDroneBinds,
    eyes: BasicDroneeyes,
    ears: BasicDroneears,
    mouth: BasicDronemouth,
    body: BasicDronebody,
    hands: BasicDronehands,
    legs: BasicDronelegs,

}
var AllEquipSets = {
    BasicDrone: BasicDroneSet,
}
const shockItems = [
    {
        "Item": "SciFiPleasurePanties",
        "AssetGroup": "ItemPelvis",
    },
    {
        "Item": "ShockClamps",
        "AssetGroup": "ItemNipples",
    },
    {
        "Item": "ShockCollar",
        "AssetGroup": "ItemNeck",
    }
]
const vibeItem = [
    {
        "Item": "SciFiPleasurePanties",
        "AssetGroup": "ItemPelvis",
    },
    {
        "Item": "FuturisticVibrator",
        "AssetGroup": "ItemVulva",
    },
    {
        "Item": "VibeHeartClitPiercing",
        "AssetGroup": "ItemVulvaPiercings",
    },
    {
        "Item": "LockingVibePlug",
        "AssetGroup": "ItemButt",
    },
    {
        "Item": "VibeHeartPiercings",
        "AssetGroup": "ItemNipplesPiercings",
    }
]



var bindLevelStrings = ["关闭", "激活", "最大"]
var bodyLevelStrings = ["可用", "限制", "离线"]
var levelStrings = [bindLevelStrings, bodyLevelStrings];
var typeStrings = ["bindStatus", "bodyStatus"];
var typeDisplayStrings = ["拘束", "机能"]
var bodyPartStrings = ["eyes", "ears", "mouth", "body", "hands", "legs"];
var bodyPartDisplayStrings = ["眼部", "耳部", "口腔", "快感", "手臂", "腿脚"];
var bodyPartAssetGroups = [
    ["ItemHead", "ItemHood"],
    ["ItemEars", "ItemHood"],
    ["ItemMouth", "ItemMouth2", "ItemMouth3"],
    ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemNipples", "ItemNipplesPiercings","ItemBreast"],
    ["ItemArms", "ItemHands"],
    ["ItemBoots", "ItemFeet","ItemLegs"],
]
var ArousalDisplayStrings = ["高潮限制", "快感装置"];
var vibeModeStrings = {
    "-1": "Off",
    "0": "Low",
    "1": "Medium",
    "2": "High",
    "3": "Maximum",
}
const MsgCmds = {
    HeartBeatPack: {
        Command: (sender, param) => {
            if (sender.MemberNumber == Player.MemberNumber) return;
            if (param.isDrone != undefined) {
                charaterInstalledScript_isDrone[sender.MemberNumber] = param.isDrone;
            }
            if (param.recive) {
                SendDTSMsg(sender, new MsgInfo("HeartBeatPack", { recive: false, isDrone : PlayerDroneInfo().isDrone }));
            }
        }
    },
    SetStatus: {
        Command: (sender, param) => {
            if (param.length < 3) return;
            var type = param[0];
            var part = param[1];
            var level = param[2];
            DoSetBodyOrBindStatus(type, part, level, sender);

        }
    },
    BatteryHelp: {
        Command: (sender, param) => {
            if (ChatRoomMapViewIsActive() == false) {
                SendMessageToSelf(`收到来自无人机${sender.MemberNumber}的充电求助信号`)
            }
            else {
                var xDiff = sender.MapData.Pos.X - Player.MapData.Pos.X;
                var yDiff = sender.MapData.Pos.Y - Player.MapData.Pos.Y;
                SendMessageToSelf(`收到来自无人机${sender.MemberNumber}的充电求助信号,位于${(xDiff > 0 ? "右方" : "左方") + Math.abs(xDiff)}格,${(yDiff > 0 ? "下方" : "上方") + Math.abs(yDiff)}格处`)
            }
        }
    },
    DoPunishment: {
        Command: (sender, param) => {
            if (param == null || param.length < 2) {
                var pdi = PlayerDroneInfo();
                DoPunishment(pdi.shockLevel, pdi.shoclCount);
            }
            else {
                var power = param[0];
                var count = param[1];
                SendMessageToSelf(`收到来自${sender.Name}的惩罚指令`);
                DoPunishment(power, count);
            }
        }
    },
    DoVibe: {
        Command: (sender, param) => {
            if (param.length < 1) return;
            var power = param[0];
            SendMessageToSelf(`收到来自${sender.Name}的震动装置指令`);
            DoVibe(power);
        }
    },
    DoOrgasm: {
        Command: (sender, param) => {
            SendMessageToSelf(`收到来自${sender.Name}的强制高潮指令`);
            DoOrgasm();
        }
    },
    RequestStatus: {
        Command: (sender, param) => {
            ResponseRequestStatus(sender, param);
        }
    },
    RecivedStatus: {
        Command: (sender, param) => {
            ShowStatus(param);
        }
    },
    RecivedStatusModify: {
        Command: (sender, param) => {
            if (ShowAvailableModify != undefined) {
                ShowAvailableModify(param);
            }
        }
    },
    DoModifyByOwner: {
        Command: (sender, param) => {
            if (DoModifyByOwner != undefined) {
                DoModifyByOwner(param);
            }
        }
    },
    BatteryCharge: {
        Command: (sender, param) => {
            ResponseBatteryCharge(param);
        }
    },
    AddArousal: {
        Command: (sender, param) => {
            ActivityTimerProgress(Player, param);
        }
    },
    ReqOwnerRight: {
        Command: (sender, param) => {
            if (param) {
                PlayerDroneInfo().ownerId = -1;
                SendMessageToSelf(`操作员${sender.MemberNumber}解除了对本机的控制权限`);
                SendDTSMsg(sender, new MsgInfo("RespOwnerRight", param));
            }
            else {
                SendMessageToSelf(`操作员${sender.MemberNumber}要求对本机的控制权限，点击按钮以${styleButton("同意", SetToDroneAccept, sender)}`);
            }
        }
    },
    RespOwnerRight: {
        Command: (sender, param) => {
            SendMessageToSelf(`已${param ? "解除" : "获取"}对无人机${sender.MemberNumber}的控制权限`);
        }
    },
    SetDisplayTalk: {
        Command: (sender, param) => {
            ResponseSetDisplayTalk(sender, param);
        }
    },
    SendMissionHelp: {
        Command: (sender, param) => {
            ShowMissionsString(param, `收到来自无人机${sender.MemberNumber}的任务协助请求：`);
        }
    },
    PutMission: {
        Command: (sender, param) => {
            SendMessageToSelf(`收到来自操作员${sender.MemberNumber}的任务`);
            TakeMission();
        }
    },
    CallToPos: {
        Command: (sender, param) => {
            var pdi = PlayerDroneInfo();
            if (pdi.isDrone) {
                SendMessageToSelf(`收到来自操作员${sender.MemberNumber}的呼叫请求，即将移动至指定位置`);
                ClearTagMessage("CallToPos");
                MovePlayer(param, true);
            }
            else {
                SendMessageToSelf(`收到来自操作员${sender.MemberNumber}的呼叫请求，${styleButton("移动至指定位置", () => {
                    ClearTagMessage("CallToPos");
                    MovePlayer(param, true);
                })}`, "CallToPos");
                setTimeout(() => { ClearTagMessage("CallToPos") }, 30000);
            }
        }
    }

}

const CommandsAction = {
    findtarget: {
        Command: (param) => {
            var mn = parseInt(param[0]);
            if (isNaN(mn) == false) {
                var char = ChatRoomCharacter.find(c => c.MemberNumber === mn);
                if (char) {
                    DoFindTatget(char);
                }
                else {
                    SendMessageToSelf("未找到目标");
                }
            }
            else {
                SendMessageToSelf("参数错误");
            }
        }
    },
    findtargetmodify: {
        Command: (param) => {
            var mn = parseInt(param[0]);
            if (isNaN(mn) == false) {
                var char = ChatRoomCharacter.find(c => c.MemberNumber === mn);
                if (char) {
                    DoFindTatget(char, "RecivedStatusModify");
                }
                else {
                    SendMessageToSelf("未找到目标");
                }
            }
            else {
                SendMessageToSelf("参数错误");
            }
        }
    },
    findtargetoprivate: {
        Command: (param) => {
            var mn = parseInt(param[0]);
            if (isNaN(mn) == false) {
                var char = ChatRoomCharacter.find(c => c.MemberNumber === mn);
                if (char) {
                    var index = -1;
                    if (PrivateRoom != undefined && PrivateRoomCrate != undefined) {
                        for (var i in PrivateRoom.Areas) {
                            if (IsInArea(Player.MapData.Pos, PrivateRoom.Areas[i])) {
                                index = i;
                                break;
                            }
                        }
                    }
                    var pos = Object.assign({}, Player.MapData.Pos);
                    if (index != -1) {
                        pos = PrivateRoomCrate.Areas[index];
                    }
                    SendDTSMsg(char, new MsgInfo("CallToPos", pos));
                }
                else {
                    SendMessageToSelf("未找到目标");
                }
            }
            else {
                SendMessageToSelf("参数错误");
            }
        }
    }

}

const BeepCmds = {
    cometoroom: {
        Command: async (senderMn, param, options) => {
            if (options.chatRoomName == undefined || options.chatRoomName == null) return;
            var pdi = PlayerDroneInfo();
            var moveToRoom = async () => {
                ClearTagMessage("CallToPos")
                if (ChatRoomData.Name.toLowerCase() !== options.chatRoomName.toLowerCase()) {
                    try {
                        await JoinRoom(options.chatRoomName);
                    }
                    catch {
                        return;
                    }
                }
                if (ChatRoomIsViewActive("Map") == false) return;
                try {
                    var pos = ChatRoomGetCharacter(senderMn).MapData.Pos;
                    MovePlayer(pos);
                }
                catch {
                    return;
                }
            }
            if (pdi.isDrone && pdi.ownerId == senderMn) {
                SendMessageToSelf(`收到来自操作员${senderMn}的远程呼叫请求，即将移动至其所在房间`);
                moveToRoom();
            }
            else {
                SendMessageToSelf(`收到来自操作员${senderMn}的远程呼叫请求，${styleButton("移动至其所在房间", () => {
                    moveToRoom();
                })}`, "CallToPos");
                setTimeout(() => { ClearTagMessage("CallToPos") }, 30000);
            }
        }
    }
}

//#region 基础装备穿脱函数
function RemoveClothes(sender, refresh = true, removeUnderwear = true, removeCosplay = false) {
    CharacterNaked(sender)
    if (refresh == true) {
        CharacterLoadEffect(sender);
        ChatRoomCharacterUpdate(sender);
    }

}
//移除所有拘束
function RemoveRestrains(sender, refresh = true) {
    RemoveRestrainsWithAssetGroup(sender, AssetGroup, refresh);
}

function RemoveRestrainByOneAssetGroup(sender, assetGroup, refresh = true) {
    RemoveRestrainsWithAssetGroup(sender, [assetGroup], refresh)
}

function RemoveRestrainsWithAssetGroup(sender, group, refresh = true) {
    if (sender == null) return;
    for (var ag of group) {
        if ((ag.Name ?? false) == false) {
            if (ag.startsWith("Item")) {
                InventoryRemove(sender, ag)
            }
        }
        else {
            if (ag.Name.startsWith("Item")) {
                InventoryRemove(sender, ag.Name)
            }
        }
    }
    if (refresh == true) {
        CharacterLoadEffect(sender);
        ChatRoomCharacterUpdate(sender);
    }
}

function AllAssetGroupName() {
    let result = []
    for (let obj of AssetGroup) {
        result.push(obj.Name);
    }
    return result;
}
function GetAllInventory(sender) {
    for (let ag of AssetGroup) {
        if (ag.Name.startsWith("Item")) {
            let geted = InventoryGet(sender, ag.Name);
            if (geted ?? false) {
                console.log(geted);
                if ((geted.Property ?? false) && (geted.Property.TypeRecord ?? false)) {
                    console.log(geted.Property.TypeRecord)
                }
                console.log(geted.Asset.Name);
                console.log(ag.Name);
            }

        }
    }
}


async function WearEquips(target, EquipList, refresh = true, craft = true, difficulty = 1000) {
    var sender = ChatRoomGetCharacter(target.MemberNumber);
    if (sender == undefined) return;
    var pushList = [];
    for (let i = 0; i < EquipList.length; i++) {
        let res = Object.assign({}, EquipList[i]);
        const ID = CharacterAppearanceGetCurrentValue(sender, res.AssetGroup, "ID");
        if (ID != "None") {
            sender.Appearance.splice(ID, 1);
        }
        let colors = [];
        if (res.Color != undefined) {
            //color是数组
            if (Array.isArray(res.Color)) {
                colors = Object.assign([], res.Color);
            }
            //color是字符串
            else {
                colors = res.Color.replace(/\s*/g, "").split(",");
            }
        }
        else {
            colors = CharacterAppearanceGetCurrentValue(sender, res.AssetGroup, "Color");
        }

        const A = AssetGet(sender.AssetFamily, res.AssetGroup, res.Item)
        if (A != null) {
            let item = {
                Asset: A,
                Color: colors,
                Difficulty: difficulty,
            }
            ExtendedItemInit(sender, item, false, false);
            pushList.push(item);
        }

    }
    sender.Appearance.push(...pushList);
    if (craft) {
        for (let i of EquipList) {
            let res = Object.assign({}, i)
            let AssetGroup = res["AssetGroup"];
            delete res.AssetGroup;
            if (Array.isArray(res.Color)) {
                var str = "";
                for (let c of res.Color) {
                    str += c;
                    str += ",";
                }
                res.Color = str;
            }
            InventoryCraft(sender, sender, AssetGroup, res, false, true, false);
            await sleep(100);
        }
    }

    if (refresh) {
        CharacterLoadEffect(sender);
        ChatRoomCharacterUpdate(sender);
    }

}
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
//#endregion

var hookMap = new Map();
/**
 * 原地 Hook 指定函数，支持 beforeFn 取消原函数执行并返回结果
 * @param {string} funcName - 函数名称
 * @param {Object|null} context - 函数所在的对象；若为 null 则使用全局对象
 * @param {Function} beforeFn - 前置钩子：参数 (...args)
 *       若返回非 undefined 值，则跳过原函数，该返回值作为 result 传给 afterFn
 * @param {Function} afterFn - 后置钩子：参数 (currentResult, ...args)，需返回最终结果
 * @returns {Function} 替换后的新函数
 */

function InstallHook(funcName, context, beforeFn, afterFn, tag = "") {
    // 确定上下文对象
    const ctx = context != null ? context : (typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : global));

    const originalFn = ctx[funcName];
    if (typeof originalFn !== 'function') {
        throw new Error(`[installHook] ${funcName} 不是一个函数，无法 Hook。`);
    }
    if (!hookMap[funcName]) {
        hookMap[funcName] = {
            beforeFnList :{},
            originalFn: ctx[funcName],
            afterFnList: {},
        }
    }
    if (typeof beforeFn === 'function') {
        var name = ""
        if (beforeFn.name) {
            name = beforeFn.name;
        }
        hookMap[funcName].beforeFnList[name + tag] = beforeFn;
    }
    if (typeof afterFn === 'function') {
        var name = ""
        if (afterFn.name) {
            name = afterFn.name;
        }
        hookMap[funcName].afterFnList[afterFn.name + tag] = afterFn;
    }
    // 创建包装函数
    const hookedFn = function (...args) {
        let result;
        let skipOriginal = false;
        
        // 执行前置钩子
        var beforeResult = undefined;
        for (var [key, before] of Object.entries(hookMap[funcName].beforeFnList) ) {
            beforeResult = before.apply(this, args);
            if (beforeResult !== undefined) {
                result = beforeResult;
                skipOriginal = true;
            }
        }

        // 如果没有被跳过，执行原函数
        if (!skipOriginal) {
            result = hookMap[funcName].originalFn.apply(this, args);
        }
        // 执行后置钩子，允许修改最终结果
        for (var [key, after] of Object.entries(hookMap[funcName].afterFnList)) {
            result = after.call(this, result, ...args);
        }
        return result;


        //// 执行前置钩子
        //if (typeof beforeFn === 'function') {
        //    const beforeResult = beforeFn.apply(this, args);
        //    // 如果 beforeFn 返回非 undefined，则跳过原函数，使用该返回值
        //    if (beforeResult !== undefined) {
        //        result = beforeResult;
        //        skipOriginal = true;
        //    }
        //}

        

        //// 执行后置钩子，允许修改最终结果
        //if (typeof afterFn === 'function') {
        //    result = afterFn.call(this, result, ...args);
        //}

        return result;
    };

    // 原地替换
    ctx[funcName] = hookedFn;
    return hookedFn;
}

function DoHook(arg, next, funcBefore, funcAfter) {
    let result;
    let skipOriginal = false;
    if (typeof func === 'function') {
        const beforeResult = funcBefore(args);
        // 如果 beforeFn 返回非 undefined，则跳过原函数，使用该返回值
        if (beforeResult !== undefined) {
            result = beforeResult;
            skipOriginal = true;
        }
    }
    if (!skipOriginal) {
        result = next(args);
    }
    if (typeof funcAfter === 'function') {
        result = funcAfter(result, args);
    }

    return result;
}

function Init() {
    InstallHook("ChatRoomMessage", null, null, ChatRoomMessageRecived)
    InstallHook("ChatRoomMapViewUpdatePlayerFlag", null, null, ChatRoomMapViewUpdatePlayerFlagAfter)
    InstallHook("CanWalk", Player, null, CanWalkAfter)
    InstallHook("IsMounted", Player, null, IsMountedAfter)
    InstallHook("GetBlindLevel", Player, null, GetBlindLevelAfter)
    InstallHook("GetDeafLevel", Player, null, GetDeafLevelAfter)
    InstallHook("CanInteract", Player, null, CanInteractAfter)
    InstallHook("DialogCanUnlock", null, DialogCanUnlockBefore, null)
    InstallHook("SpeechTransformDeafenIntensity", null, SpeechTransformDeafenIntensityBefore, null)
    InstallHook("ChatRoomSendChatMessage", null, ChatRoomSendChatMessageBefore, null)
    InstallHook("ChatRoomPlayerIsAdmin", null, ChatRoomPlayerIsAdminBefore, null)
    InstallHook("ServerShowBeep", null, ServerShowBeepBefore, null)
    InstallHook("ChatRoomFirstTimeHelp", null, ChatRoomFirstTimeHelpBefore, null)
    InstallHook("SelfOrgasmed", null, null, function MissionInfoProgressAddOrgasm() { MissionInfo.ProgressAdd("Orgasm");  })

    CommandCombine([
        {
            Tag: "DTS",
            Description: "DroneTrainingSystem",
            Action: function (text) {
                const command = text.split(" ")[0];
                const commandText = text.replace('[', "").replace(']', "").split(" ").slice(1);

                CommandInfo.DoCmd(new CommandInfo(command, commandText));
            },
        },
    ]);
    timeEventInterval = setInterval(() => {
        try {
            if (ChatRoomData) {
                TimeEvent();
            }
        }
        catch {

        }
    }, 1000);
    PlayerDroneInfo();
}
function ChatRoomMessageRecived(result, data) {
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

            var pdi = PlayerDroneInfo();
            // Replace < and > characters to prevent HTML injections
            var msg = data.Content;
            while (msg.indexOf("<") > -1) msg = msg.replace("<", "&lt;");
            while (msg.indexOf(">") > -1) msg = msg.replace(">", "&gt;");
            if (data.Content == "DTS" && data.Type == 'Hidden') {
                DoHiddenMessage(SenderCharacter, msg, data.Dictionary);
                return result;
            }
            else if (data.Type == 'Activity') {
                //收到动作时执行
                if (data.Dictionary.length >= 4) {
                    if (typeof data.Dictionary[0].SourceCharacter == 'number' &&
                        typeof data.Dictionary[1].TargetCharacter == 'number' &&
                        data.Dictionary[2].FocusGroupName &&
                        data.Dictionary[3].ActivityName
                    ) {
                        GroupActivityRecvied(data.Dictionary[0].SourceCharacter, data.Dictionary[1].TargetCharacter, data.Dictionary[2].FocusGroupName, data.Dictionary[3].ActivityName)
                    }
                    //if (typeof data.Dictionary[0].SourceCharacter == 'number' &&
                    //    data.Dictionary[1].TargetCharacter == Player.MemberNumber &&
                    //    data.Dictionary[2].FocusGroupName == 'ItemNeck') {
                    //    if (data.Dictionary[0].SourceCharacter == Player.MemberNumber) {
                    //        ShowStatus(pdi);
                    //    }
                    //    else {
                    //        ResponseRequestStatus(SenderCharacter);
                    //    }
                    //}
                }
                //高潮充电
                if (data.Content.startsWith("Orgasm") && data.Dictionary.length >= 1 && typeof data.Dictionary[0].SourceCharacter == 'number') {
                    if (CheckPlayerDroneInfoExistAndIsDrone()) {
                        if (data.Dictionary[0].SourceCharacter == Player.MemberNumber) {
                            SendMessageToSelf("通过本机的高潮为电源补充了一定能量");
                            MsgCmds["BatteryCharge"].Command(null, pdi.orgasmBatteryGet)
                        }
                        else {
                            SendMessageToSelf("通过附近个体的高潮为电源补充了少许能量");
                            MsgCmds["BatteryCharge"].Command(null, pdi.orgasmBatteryGet * 0.5)
                        }
                    }
                    if (data.Dictionary[0].SourceCharacter == Player.MemberNumber) {
                        SelfOrgasmed();
                    }

                }


            }
            else if (data.Type == 'Action' && msg == "ServerEnter" && SenderCharacter.MemberNumber == Player.MemberNumber) {
                PlayerEnterRoom();
            }
            else if ((msg.startsWith("ServerLeave")) || (msg.startsWith("ServerDisconnect")) || (msg.startsWith("ServerBan")) || (msg.startsWith("ServerKick"))) {
                if (charaterInstalledScript_isDrone[SenderCharacter.MemberNumber] != undefined) {
                    delete charaterInstalledScript_isDrone[SenderCharacter.MemberNumber];
                }
            }
            var lowerContent = msg.toLowerCase();
            var MemberNumberStr = Player.MemberNumber.toString();
            var reg = new RegExp("(无人机|drone|编号|id) ?" + MemberNumberStr);
            var res = reg.exec(lowerContent);
            if (res != null && CheckPlayerDroneInfoExistAndIsDrone()) {
                DoVoiceCommand(SenderCharacter, msg);
                return result;
            }
        }
    }
}
//param 0:自己->自己 1:别人->自己 2:自己->别人 3:别人->别人
var ActivityFunc = {
    ItemButtSpank: (param, SourceCharacter, TargetCharacter, FocusGroupName, ActivityName) => {
        if (param == 1) {
            if (charaterInstalledScript_isDrone[SourceCharacter] == false) {
                MissionInfo.ProgressAdd("Spank");
            }
        }
        if (param == 2) {
            if (charaterInstalledScript_isDrone[TargetCharacter] == true) {
                MissionInfo.ProgressAdd("OwnerSpank");
            }
        }
    },
    ItemHeadPet: (param, SourceCharacter, TargetCharacter, FocusGroupName, ActivityName) => {
        if (param == 1) {
            if (charaterInstalledScript_isDrone[SourceCharacter] == undefined || charaterInstalledScript_isDrone[SourceCharacter] == false) {
                MissionInfo.ProgressAdd("PetHead");
                var pdi = new PlayerDroneInfo();
                if (pdi.isDrone && pdi.modifys["training1"] == true) {
                    RequirePoseinfo.RequireDronePose(["Kneel"], 20000);
                }
                if (pdi.isDrone && pdi.modifys["education1"] == true) {
                    if (Math.random() < 0.1) {
                        DoOrgasm(false);
                    }
                }
            }
            
        }
        if (param == 2) {
            if (charaterInstalledScript_isDrone[TargetCharacter] == true) {
                MissionInfo.ProgressAdd("OwnerPetHead");
            }
        }
    },
    ItemPelvisCaress: (param, SourceCharacter, TargetCharacter, FocusGroupName, ActivityName) => {
        if (param == 1) {
            if (charaterInstalledScript_isDrone[SourceCharacter] == undefined || charaterInstalledScript_isDrone[SourceCharacter] == false) {
                var pdi = new PlayerDroneInfo();
                if (pdi.isDrone && pdi.modifys["training1"] == true) {
                    RequireActivityinfo.RequireDroneActivity([], ["Caress"], 0, 20000, 3);
                }
            }
            
        }
    },
    ItemMouthPinch: (param, SourceCharacter, TargetCharacter, FocusGroupName, ActivityName) => {
        if (param == 1) {
            if (charaterInstalledScript_isDrone[SourceCharacter] == undefined || charaterInstalledScript_isDrone[SourceCharacter] == false) {
                var pdi = new PlayerDroneInfo();
                if (pdi.isDrone && pdi.modifys["training1"] == true) {
                    RequirePoseinfo.RequireDronePose(["BaseLower", "LegsClosed"], 20000);
                    RequirePoseinfo.RequireDronePose(["BaseUpper"], 20000);
                }
            }

        }
    },
    ItemPelvisPinch: (param, SourceCharacter, TargetCharacter, FocusGroupName, ActivityName) => {
        if (param == 1) {
            if (charaterInstalledScript_isDrone[SourceCharacter] == undefined || charaterInstalledScript_isDrone[SourceCharacter] == false) {
                var pdi = new PlayerDroneInfo();
                if (pdi.isDrone && pdi.modifys["training2"] == true) {
                    RequirePoseinfo.RequireDronePose(["LegsClosed"], 20000);
                    RequirePoseinfo.RequireDronePose(["BackBoxTie", "BackElbowTouch"], 20000);
                }
            }

        }
    },
    Wiggle: (param, SourceCharacter, TargetCharacter, FocusGroupName, ActivityName) => {
        if (param == 3) {
            var pdi = new PlayerDroneInfo();
            if (pdi.isDrone && pdi.modifys["training2"] == true) {
                if (SourceCharacter == TargetCharacter) {
                    var character = ChatRoomGetCharacter(SourceCharacter);
                    if (character != undefined) {
                        if (ChatRoomIsViewActive("Map") && !ChatRoomMapViewCharacterOnInteractionRange(character)) {
                            return;
                        }
                        RequireActivityinfo.RequireDroneActivity([FocusGroupName], ["GaggedKiss"], 2, 20000, 1);

                    }
                }
            }
            
        }
    },
    ItemNeck: (param, SourceCharacter, TargetCharacter, FocusGroupName, ActivityName) => {
        if (param == 0) {
            ShowStatus(PlayerDroneInfo());
        }
        else if (param == 1){
            ResponseRequestStatus({ MemberNumber: SourceCharacter });
        }
    }
}

function GroupActivityRecvied(SourceCharacter, TargetCharacter, FocusGroupName, ActivityName) {
    var param = (SourceCharacter == Player.MemberNumber ? 0 : 1) + (TargetCharacter == Player.MemberNumber ? 0 : 2)
    if (ActivityFunc[FocusGroupName]) {
        ActivityFunc[FocusGroupName](param, SourceCharacter, TargetCharacter, FocusGroupName, ActivityName);
    }
    if (ActivityFunc[ActivityName]) {
        ActivityFunc[ActivityName](param, SourceCharacter, TargetCharacter, FocusGroupName, ActivityName);
    }
    if (ActivityFunc[FocusGroupName + ActivityName]) {
        ActivityFunc[FocusGroupName + ActivityName](param, SourceCharacter, TargetCharacter, FocusGroupName, ActivityName);
    }
    RequireActivityinfo.CheckAllActivityComplete(SourceCharacter, TargetCharacter, param, FocusGroupName, ActivityName);

}

//var RequireActivity = [
//]

function SelfOrgasmed() {
    //MissionInfo.ProgressAdd("Orgasm");
}
function PlayerEnterRoom() {
    showedEnterHelp = false;
    charaterInstalledScript_isDrone = new Map();
    ShowPlayerEnterHelp();
}

function DoHiddenMessage(ChatRoomCharacter, msg, dict) {
    if (charaterInstalledScript_isDrone[ChatRoomCharacter.MemberNumber] == undefined) {
        charaterInstalledScript_isDrone[ChatRoomCharacter.MemberNumber] = false;
    }
    MsgInfo.DoCmd(ChatRoomCharacter, dict);
}

function DoVoiceCommand(ChatRoomCharacter, msg) {
    var pdi = PlayerDroneInfo();
    var cmd = findIndices(msg, ["显示状态", "弹出充电曲柄", "高潮奖励", "电击惩罚", "设为", "显示屏发言"]);
    //设为与显示屏发言需要操作员权限
    if (cmd >= 4 && pdi.ownerId != -1 && pdi.ownerId != ChatRoomCharacter.MemberNumber) {
        SendActionText(`不具有对该无人机的操作权限，请联系操作员${pdi.ownerId}以进行操作权限交接`, ChatRoomCharacter);
        return;
    }
    switch (cmd[0]) {
        //显示状态
        case 0: {
            ResponseRequestStatus(ChatRoomCharacter);
        }
            break;
        //弹出充电曲柄
        case 1: {
            if (pdi.battery >= pdi.batteryMax * 0.3) {
                SendActionText(`${ChatRoomCharacter.Name}弹出无人机${pdi.MemberNumber}下体的电源接口内藏的手摇曲柄，由于无人机${target.MemberNumber}已有一定电量，所以曲柄反而自行旋转消耗了大量电量`);
            }
            else {
                SendActionText(`${ChatRoomCharacter.Name}弹出无人机${pdi.MemberNumber}下体的电源接口内藏的手摇曲柄并猛烈转动，动能转化为电能经由阴道流至子宫内的电源，动能与电能让她的机体猛烈颤抖`);
            }
            diff = Math.floor(pdi.batteryMax * 0.3) - pdi.battery;
            SendDTSMsg(pdi, new MsgInfo("BatteryCharge", diff));
            SendDTSMsg(pdi, new MsgInfo("AddArousal", 50));
        }
            break;
        //高潮奖励
        case 2: {
            DoOrgasm();
        }
            break;
        //电击惩罚
        case 3: {
            DoPunishment(pdi.shockLevel, pdi.shoclCount);
        }
            break;
        //设为
        case 4: {
            var params = findIndices(msg, typeDisplayStrings, bodyPartDisplayStrings, bindLevelStrings, bodyLevelStrings, ArousalDisplayStrings)
            switch (params[0]) {
                case 0: {
                    DoSetBodyOrBindStatus(0, params[1], params[2], ChatRoomCharacter);
                    return;
                }
                    break;
                case 1: {
                    DoSetBodyOrBindStatus(1, params[1], params[3], ChatRoomCharacter);
                    return;
                }
                    break;
            }
            switch (params[4]) {
                case 0: {
                    DoSetBodyOrBindStatus(0, 3, params[2], ChatRoomCharacter);
                    return;
                }
                    break;
                case 1: {
                    DoSetBodyOrBindStatus(1, 3, params[2], ChatRoomCharacter);
                    return;
                }
                    break;
            }
        }
            break;
        //显示屏发言
        case 5: {
            var params = findIndices(msg, ["打开", "关闭"]);
            if (params[0] != -1) {
                ResponseSetDisplayTalk(ChatRoomCharacter, params[0] == 0)
            }
        }
            break;
    }

}

function findIndices(str, ...strArrays) {
    var map = strArrays.map(arr =>
        arr.map(s => str.indexOf(s))
    );
    var result = [];
    for (var i = 0; i < map.length; i++) {
        var found = false;
        for (var j = 0; j < map[i].length; j++) {
            if (map[i][j] != -1) {
                found = true;
                result.push(j);
                break;
            }
        }
        if (found == false) {
            result.push(-1);
        }
    }
    return result;
}

function DoSetBodyOrBindStatus(type, part, level, sender) {
    if (type == -1 || part == -1 || level == -1) return
    var drone = PlayerDroneInfo();
    if (drone[typeStrings[type]] != undefined && drone[typeStrings[type]][bodyPartStrings[part]] != undefined) {
        drone[typeStrings[type]][bodyPartStrings[part]] = level;
        if (part == 3) {
            SendMessageToSelf(`${ArousalDisplayStrings[type]}被${sender.Name}设置为${levelStrings[0][level]}`);
            if (type == 1) {
                DoVibe(level * 2,true);
            }
        }
        else {
            SendMessageToSelf(`${bodyPartDisplayStrings[part] + typeDisplayStrings[type]}被${sender.Name}设置为${levelStrings[type][level]}`);
        }
        RefreshBinds(true);
    }
}

function ChatRoomMapViewUpdatePlayerFlagAfter(result, UpdateTimeOffset) {
    if (PlayerMoved) {
        PlayerMoved();
    }
}
/**
 * 移动后消耗电量
 */
function PlayerMoved() {
    if (CheckPlayerDroneInfoExistAndIsDrone() == false) return;
    var pdi = PlayerDroneInfo();
    pdi.battery -= pdi.moveBatteryCost;
}

function CanWalkAfter(result) {
    if (CheckPlayerDroneInfoExistAndIsDrone() == false) return result;
    var pdi = PlayerDroneInfo();
    var droneResult = !(pdi.battery <= pdi.batteryMax * 0.2 || pdi.bodyStatus.legs >= 1);
    return (result && droneResult)
}

function IsMountedAfter(result) {
    if (CheckPlayerDroneInfoExistAndIsDrone() == false) return result;
    var pdi = PlayerDroneInfo();
    var droneResult = (pdi.battery <= 0 || pdi.bodyStatus.legs >= 2);
    return (result || droneResult);
}

function GetBlindLevelAfter(result) {
    if (CheckPlayerDroneInfoExistAndIsDrone() == false) return result;
    var droneResult = 0;
    var pdi = PlayerDroneInfo();
    if (pdi.battery <= 0 || pdi.bodyStatus.eyes == 2) {
        droneResult = 3.5;
    }
    if (pdi.battery <= pdi.batteryMax * 0.2 || pdi.bodyStatus.eyes == 1) {
        droneResult = 2;
    }
    return Math.max(result, droneResult);
}

function GetDeafLevelAfter(result) {
    if (CheckPlayerDroneInfoExistAndIsDrone() == false) return result;
    var droneResult = 0;
    var pdi = PlayerDroneInfo();
    if (pdi.battery <= 0 || pdi.bodyStatus.ears == 2) {
        droneResult = 7;
    }
    if (pdi.battery <= pdi.batteryMax * 0.2 || pdi.bodyStatus.ears == 1) {
        droneResult = 3;
    }
    return Math.max(result, droneResult);
}

function CanInteractAfter(result) {
    if (isRefreshBinding) {
        return true;
    }
    if (CheckPlayerDroneInfoExistAndIsDrone() == false) return result;
    var pdi = PlayerDroneInfo();
    var droneResult = !(pdi.battery <= pdi.batteryMax * 0.2 || pdi.bodyStatus.hands >= 1);
    return (result && droneResult)
}
function DialogCanUnlockBefore() {
    if (isRefreshBinding) {
        return true;
    }
}

function SpeechTransformDeafenIntensityBefore(C) {
    if (CheckPlayerDroneInfoExistAndIsDrone() == false) return;
    if (C.MemberNumber != Player.MemberNumber) return;
    var pdi = PlayerDroneInfo();
    if (pdi.battery <= 0 || pdi.bodyStatus.mouth == 2) {
        return 20;
    }
    if (pdi.battery <= pdi.batteryMax * 0.2 || pdi.bodyStatus.mouth == 1) {
        return 8;
    }
}

function ChatRoomSendChatMessageBefore(msg) {
    if (CheckPlayerDroneInfoExistAndIsDrone() == false) return;
    var pdi = PlayerDroneInfo();
    if (pdi.battery <= 0) {
        HintBatteryHelp();
        return true;
    }
    if (pdi.disPlayTalk) {
        if (pdi.battery <= 0 || pdi.bodyStatus.mouth == 2) {
            SendActionText("无人机" + Player.MemberNumber + "的指示灯闪烁，尝试发言但失败了");
        }
        else {
            SendActionText("无人机" + Player.MemberNumber + "的显示器显示：" + msg);
            //ChatRoomSendEmote("无人机" + Player.MemberNumber + "的显示器显示：" + msg);
            pdi.battery -= pdi.chatBatteryCost;
            return true;
        }
    }
}

//在训练设施中失效
function ChatRoomPlayerIsAdminBefore() {
    if (CheckPlayerDroneInfoExistAndIsDrone() == false) return;
    if (ChatRoomData?.MapData?.Objects?.startsWith("ҴӄӃҶұҳҹ") && ChatRoomData?.Name?.startsWith("DroneFacility")) return false;
    

}

function ServerShowBeepBefore(message, duration, options, title) {
    if (PlayerDroneInfo() === undefined) return;
    if (message.startsWith("DTSBeep")) {
        var memberNumber = -1;
        memberNumber = options.memberNumber;
        var params = message.split(' ');
        if (params.length > 2) {
            MsgInfo.DoBeepCmd(memberNumber, new MsgInfo(params[1], params.slice(2)), options);
        }
        else {
            MsgInfo.DoBeepCmd(memberNumber, new MsgInfo(params[1], null), options);
        }
        return 0;
    }
}

function ChatRoomFirstTimeHelpBefore() {
    if (!ChatRoomHelpSeen) {
        ShowPlayerEnterHelp();
    }
}
function ShowPlayerEnterHelp() {
    if (showedEnterHelp) return;
    if (showChangeLog) {
        SendMessageToSelf(changeLog);
    }
    SendMessageToSelf(`与无人机训练系统的链接已建立，${styleButton("显示状态", ShowStatus)} ${styleButton("可用功能", ShowActionButtons)}`, "", true)
    SendDTSMsg(null, new MsgInfo("HeartBeatPack", { recive: true, isDrone : PlayerDroneInfo().isDrone }));
    showedEnterHelp = true;
}
/**
 * 显示电量求助提示
 */
function HintBatteryHelp() {
    SendMessageToSelf("电量不足，可向附近玩家" + styleButton("求助", SendBatteryHelp) + "充电");
}

function SendBatteryHelp() {

    SendDTSMsg(null, new MsgInfo("BatteryHelp", null));
}
/**
 * 判断是否为可用无人机
 * @returns
 */
function CheckPlayerDroneInfoExistAndIsDrone() {
    var pdi = PlayerDroneInfo();
    if (pdi === undefined) return false;
    return pdi.isDrone;

}

async function DoPunishment(power, count) {
    if (CheckPlayerDroneInfoExistAndIsDrone() == false) return;
    var pdi = PlayerDroneInfo();
    var itemsCanShock = [];
    for (var bind of shockItems) {
        var geted = InventoryGet(Player, bind.AssetGroup);
        if (geted == null || geted.Asset.Name == bind.Item) {
            geted.Property.ShockLevel = power;
            itemsCanShock.push(geted);
        }
    }
    if (itemsCanShock.length > 0) {
        SendMessageToSelf(`执行惩罚:${power + 1}级电击${count}次`);
        for (var i = 0; i < count; i++) {
            var index = Math.floor((Math.random() * itemsCanShock.length));
            PropertyShockPublishAction(Player, itemsCanShock[index]);
            sleep(300);
        }
        pdi.battery -= pdi.punishBatteryCost;
    }
    else {
        SendMessageToSelf(`未找到可用电击设备，惩罚失败`);
    }
}

function ReqDoPunishment(target) {

    SendDTSMsg(target, new MsgInfo("DoPunishment", null));
}
async function DoVibe(power, skipCheck = false) {
    if (CheckPlayerDroneInfoExistAndIsDrone() == false && !skipCheck) return;
    var itemsCanVibe = [];
    for (var bind of vibeItem) {
        var geted = InventoryGet(Player, bind.AssetGroup);
        var tr = Object.assign({}, geted.Property.TypeRecord)
        if (geted == null || geted.Asset.Name == bind.Item) {
            if (tr.vibrating != undefined) {
                tr.vibrating = power;
            }
            else if (tr.i != undefined) {
                tr.i = power;
            }
            itemsCanVibe.push(geted);
            ExtendedItemSetOptionByRecord(Player, geted, tr);
        }
    }
    if (itemsCanVibe.length > 0) {
        SendMessageToSelf(`震动装置强度设为${power}`);
        RefershPlayerEffect();
    }
    else {
        SendMessageToSelf(`未找到可用震动设备，设置失败`);
    }
}
async function DoOrgasm(showText = true) {
    if (showText) {
        SendMessageToSelf(`执行强制高潮`);
    }
    ActivityOrgasmPrepare(Player);
}
function ReqDoOrgasm(target) {
    SendDTSMsg(target, new MsgInfo("DoOrgasm", null));
}

/**
 * 定时执行函数
 */
function TimeEvent() {
    secAfterStart += 1;
    //每秒钟执行
    {
        DoPerSec();
    }
    //每10秒钟执行
    if (secAfterStart % 10 == 0) {
        DoPer10Sec();
    }
    //每分钟执行
    if (secAfterStart % 60 == 0) {
        DoPerMin();
    }
    //每10分钟执行
    if (secAfterStart % 600 == 0) {
        DoPer10Min();
    }
    //每小时执行
    if (secAfterStart % 3600 == 0) {
        DoPerHour();
        secAfterStart = 0;
    }
}
var lastBattery = null;
function DoPerSec() {
    RefreshBatteryTag();
    SendBatteryWarning();
    RequireActivityinfo.CheckAllActivityIncomplete();
    RequirePoseinfo.CheckPose();

}
function DoPer10Sec() {

    RefreshBinds();
    if (CheckPlayerDroneInfoExistAndIsDrone()) {
        RefershPlayerEffect();
    }
    ServerPlayerExtensionSettingsSync("DTSbyZajucd");
    SendDTSMsg(null, new MsgInfo("HeartBeatPack", { recive: true, isDrone : PlayerDroneInfo().isDrone }));

}
function DoPerMin() {
    var pdi = PlayerDroneInfo();
    pdi.battery -= pdi.miniteBatteryCost;
    ClearOldMessage();
}
function DoPer10Min() {

}
function DoPerHour() {

}
function RefreshBatteryTag() {
    if (CheckPlayerDroneInfoExistAndIsDrone() == false) return;
    var pdi = PlayerDroneInfo();
    var tag = InventoryGet(Player, "ItemNeckAccessories");
    if (tag?.Property?.Text != undefined) {
        var percent = Math.floor((pdi.battery * 100 / pdi.batteryMax));
        tag.Property.Text = percent.toString();
        if (percent > 50) {
            tag.Color[0] = '#40812c';
        }
        else if (percent > 20) {
            tag.Color[0] = '#cccc33';
        }
        else {
            tag.Color[0] = '#cc3333';
        }
    }
}

function SendBatteryWarning() {
    var pdi = PlayerDroneInfo();
    if (lastBattery == null) {
        lastBattery = pdi.battery;
    }
    if (lastBattery > pdi.batteryMax * 0.2 && pdi.battery <= pdi.batteryMax * 0.2) {
        SendMessageToSelf("无人机当前电量低于20%，进入节电模式");
    }
    if (lastBattery < pdi.batteryMax * 0.2 && pdi.battery >= pdi.batteryMax * 0.2) {
        SendMessageToSelf("无人机当前电量高于20%，解除节电模式");
    }
    if (lastBattery > 0 && pdi.battery <= 0) {
        SendMessageToSelf("无人机当前电量低于0%，停用维生机能外所有机能");
    }
    if (lastBattery < pdi.batteryMax * 0.2 && pdi.battery >= pdi.batteryMax) {
        SendMessageToSelf("无人机当前电量高于0%，启用因电量耗尽停用的机能");
    }
    lastBattery = pdi.battery;
}

var isRefreshBinding = false;
var lastRefreshBindsTime = new Date();
async function RefreshBinds(canRefresh = false) {
    var nowDate = new Date();
    if (nowDate - lastRefreshBindsTime <= 1000) return;
    lastRefreshBindsTime = nowDate;
    if (CheckPlayerDroneInfoExistAndIsDrone() == false) return;
    isRefreshBinding = true;
    try {
        var pdi = PlayerDroneInfo();
        var type = pdi.type;
        if (!type) var type = "BasicDrone";
        var refresh = false;
        var binds = Object.assign([], AllEquipSets[type].Binds);
        var toWear = [];
        if (!binds) var binds = Object.assign([], AllEquipSets["BasicDrone"].Binds);
        for (var bind of binds) {
            var geted = InventoryGet(Player, bind.AssetGroup);
            if (geted == null || geted.Asset.Name != bind.Item || geted.Craft == undefined) {
                toWear.push(bind);
                refresh = true;
            }
        }
        if (refresh) {
            WearEquips(Player, toWear, false);
        }
        for (var part of bodyPartStrings) {
            var settings = Object.assign({}, AllEquipSets[type][part]);
            if (!settings) continue;
            var level = pdi.bindStatus[part];
            var usingSeeting = Object.assign([], settings[level]);;
            for (var bind of usingSeeting) {
                var geted = InventoryGet(Player, bind.AssetGroup);
                var tr = Object.assign({}, geted.Property.TypeRecord)
                for (var typed in bind.TypeRecord) {
                    tr[typed] = bind.TypeRecord[typed];
                }
                ExtendedItemSetOptionByRecord(Player, geted, tr);
                await sleep(100);
            }
        }
        if (refresh || canRefresh) {
            RefershPlayerEffect();
        }
    }
    catch {

    }
    isRefreshBinding = false;
}

function ClearOldMessage() {
    ClearMessageByFunc((child) => {
        var diff = new Date().getTime() - parseInt(child.children[1].dataset.timestamp);
        return diff > 120 * 1000
    });

    //var elements = document.getElementById('TextAreaChatLog').children;

    //for (let i = elements.length - 1; i >= 0; i--) {
    //    var remove = false;
    //    var child = elements[i];
    //    if (child?.children[1]?.dataset?.timestamp) {
    //        var diff = new Date().getTime() - parseInt(child.children[1].dataset.timestamp);
    //        if (diff > 120 * 1000) {
    //            remove = true;
    //        }
    //        else {
    //            remove = false;
    //        }
    //    }
    //    else {
    //        remove = false;
    //    }
    //    if (remove) {
    //        elements[i].remove();
    //    }
    //}
}

function ClearLastMessage() {
    ClearMessageByFunc((child) => {
        return child?.children[1]?.dataset?.clearatnext == "true"
    });

    //var elements = document.getElementById('TextAreaChatLog').children;

    //for (let i = elements.length - 1; i >= 0; i--) {
    //    var remove = false;
    //    var child = elements[i];
    //    if (child?.children[1]?.dataset?.timestamp && child?.children[1]?.dataset?.timestamp != false) {
    //        if (child?.children[1]?.dataset?.clearatnext == "true") {
    //            remove = true;
    //        }
    //        else {
    //            remove = false;
    //        }
    //    }
        
    //    else {
    //        remove = false;
    //    }
    //    if (remove) {
    //        elements[i].remove();
    //    }
    //}
}

function ClearTagMessage(tag) {
    ClearMessageByFunc((child) => {
        return child?.children[1]?.dataset?.cleartag == tag
    });
    //var elements = document.getElementById('TextAreaChatLog').children;

    //for (let i = elements.length - 1; i >= 0; i--) {
    //    var remove = false;
    //    var child = elements[i];
    //    if (child?.children[1]?.dataset?.timestamp && child?.children[1]?.dataset?.timestamp != false) {
    //        if (child?.children[1]?.dataset?.cleartag == tag) {
    //            remove = true;
    //        }
    //        else {
    //            remove = false;
    //        }
    //    }

    //    else {
    //        remove = false;
    //    }
    //    if (remove) {
    //        elements[i].remove();
    //    }
    //}
}

function ClearAllMessage() {
    ClearMessageByFunc((child) => {return true });
    //var elements = document.getElementById('TextAreaChatLog').children;

    //for (let i = elements.length - 1; i >= 0; i--) {
    //    var remove = false;
    //    var child = elements[i];
    //    if (child?.children[1]?.dataset?.timestamp && child?.children[1]?.dataset?.timestamp != false) {
    //        remove = true;
    //    }

    //    else {
    //        remove = false;
    //    }
    //    if (remove) {
    //        elements[i].remove();
    //    }
    //}
}
function ClearMessageByFunc(func) {
    var elements = document.getElementById('TextAreaChatLog').children;

    for (let i = elements.length - 1; i >= 0; i--) {
        var remove = false;
        var child = elements[i];
        if (child?.children[1]?.dataset?.timestamp && child?.children[1]?.dataset?.timestamp != false) {
            if (func(child) == true) {
                remove = true;
            }
            else {
                remove = false;
            }
        }

        else {
            remove = false;
        }
        if (remove) {
            elements[i].remove();
        }
    }
}
function ResponseRequestStatus(sender, param = null) {
    var handle = "RecivedStatus";
    if (param != null) {
        handle = param;
    }
    if (charaterInstalledScript_isDrone[sender.MemberNumber] != undefined) {
        SendDTSMsg(sender, new MsgInfo(handle, PlayerDroneInfo()));
    }
    else if (CheckPlayerDroneInfoExistAndIsDrone()) {
        SendActionText(GetStatusAndVoiceCmdString(), sender);
    }
}


function ResponseBatteryCharge(param) {
    var pdi = PlayerDroneInfo();
    pdi.battery += param;
    if (pdi.battery > pdi.batteryMax) {
        pdi.battery = pdi.batteryMax;
    }
    RefreshBatteryTag();
    RefershPlayerEffect();
}

function ResponseSetDisplayTalk(sender, param) {
    PlayerDroneInfo().disPlayTalk = param;
    SendMessageToSelf(`显示屏发言被${sender.Name}设置为${param ? "开启" : "关闭"}`);
}

function ShowStatus(info = null) {
    if (!info) {
        info = PlayerDroneInfo();
    }
    var playerIsOwner = ((info.ownerId == -1 && info.MemberNumber != Player.MemberNumber) || info.ownerId == Player.MemberNumber)
    var char = ChatRoomCharacter.find(c => c.MemberNumber === info.MemberNumber);
    var { bpm, breathing, temp } = InventoryItemBreastFuturisticBraUpdate(char);
    var progress = 0
    var temp = 37;
    if (char.ArousalSettings && char.ArousalSettings.Progress > 0) {
        temp += (char.ArousalSettings.Progress / 100) * 3;
        progress = char.ArousalSettings.Progress
    }
    var ShowString = ""
    if (info.isDrone) {
        ShowString =
            `——————基础信息——————
无人机ID:${info.MemberNumber}
无人机型号:${info.type}V${info.level}
配额点数:${info.coin}
剩余电量:${info.battery}/${info.batteryMax}
操作员ID:${info.ownerId == -1 ? '无操作员' : info.ownerId}
——————生理信息——————
心率:${bpm}BPM
体温:${temp}℃
发情状态:${(breathing === "Action" || breathing === "High") ? "发情中" : "未发情"}
当前快感:${progress}%
快感装置:${bindLevelStrings[info.bodyStatus.body]} ${playerIsOwner ? styleButton("调整", SetStatusHint, info, 1, 3) : ""}  
高潮限制:${bindLevelStrings[info.bindStatus.body]} ${playerIsOwner ? styleButton("调整", SetStatusHint, info, 0, 3) : ""}  
——————装置信息——————
眼部拘束:${bindLevelStrings[info.bindStatus.eyes]} ${playerIsOwner ? styleButton("调整", SetStatusHint, info, 0, 0) : ""}
耳部拘束:${bindLevelStrings[info.bindStatus.ears]} ${playerIsOwner ? styleButton("调整", SetStatusHint, info, 0, 1) : ""}
口腔拘束:${bindLevelStrings[info.bindStatus.mouth]} ${playerIsOwner ? styleButton("调整", SetStatusHint, info, 0, 2) : ""}
手臂拘束:${bindLevelStrings[info.bindStatus.hands]} ${playerIsOwner ? styleButton("调整", SetStatusHint, info, 0, 4) : ""}
腿脚拘束:${bindLevelStrings[info.bindStatus.legs]} ${playerIsOwner ? styleButton("调整", SetStatusHint, info, 0, 5) : ""} 
——————机能信息——————
眼部机能:${bodyLevelStrings[info.bodyStatus.eyes]} ${playerIsOwner ? styleButton("调整", SetStatusHint, info, 1, 0) : ""}
耳部机能:${bodyLevelStrings[info.bodyStatus.ears]} ${playerIsOwner ? styleButton("调整", SetStatusHint, info, 1, 1) : ""}
口腔机能:${bodyLevelStrings[info.bodyStatus.mouth]} ${playerIsOwner ? styleButton("调整", SetStatusHint, info, 1, 2) : ""}
手臂机能:${bodyLevelStrings[info.bodyStatus.hands]} ${playerIsOwner ? styleButton("调整", SetStatusHint, info, 1, 4) : ""}
腿脚机能:${bodyLevelStrings[info.bodyStatus.legs]} ${playerIsOwner ? styleButton("调整", SetStatusHint, info, 1, 5) : ""}
————————————————
${styleButton("可用功能", ShowActionButtons, info)}`
    }
    else if (info.isOwner) {
        ShowString =
            `——————基础信息——————
操作员ID:${info.MemberNumber}
操作员权限等级:${info.level}
配额点数:${info.coin}
——————生理信息——————
心率:${bpm}BPM
体温:${temp}℃
————————————————
${styleButton("可用功能", ShowActionButtons, info)}`
    }
    else {
        ShowString =
            `——————基础信息——————
游客ID:${info.MemberNumber}
配额点数:${info.coin}
——————生理信息——————
心率:${bpm}BPM
体温:${temp}℃
————————————————
${styleButton("可用功能", ShowActionButtons, info)}`
    }
    SendMessageToSelf(ShowString,"status");
}

function GetStatusAndVoiceCmdString() {
    info = PlayerDroneInfo();
    var playerIsOwner = ((info.ownerId == -1 && info.MemberNumber != Player.MemberNumber) || info.ownerId == Player.MemberNumber)
    var char = ChatRoomCharacter.find(c => c.MemberNumber === info.MemberNumber);
    var { bpm, breathing, temp } = InventoryItemBreastFuturisticBraUpdate(char);
    var progress = 0
    var temp = 37;
    if (char.ArousalSettings && char.ArousalSettings.Progress > 0) {
        temp += (char.ArousalSettings.Progress / 100) * 3;
        progress = char.ArousalSettings.Progress
    }
    return `——————基础信息——————
无人机ID:${info.MemberNumber}
无人机型号:${info.type}V${info.level}
配额点数:${info.coin}
剩余电量:${info.battery}/${info.batteryMax}
操作员ID:${info.ownerId == -1 ? '无操作员' : info.ownerId}
——————生理信息——————
心率:${bpm}BPM
体温:${temp}℃
发情状态:${(breathing === "Action" || breathing === "High") ? "发情中" : "未发情"}
当前快感:${progress}%
快感装置:${bindLevelStrings[info.bodyStatus.body]}
高潮限制:${bodyLevelStrings[info.bindStatus.body]}
——————装置信息——————
眼部拘束:${bindLevelStrings[info.bindStatus.eyes]}
耳部拘束:${bindLevelStrings[info.bindStatus.ears]}
口腔拘束:${bindLevelStrings[info.bindStatus.mouth]}
手臂拘束:${bindLevelStrings[info.bindStatus.hands]}
腿脚拘束:${bindLevelStrings[info.bindStatus.legs]}
——————机能信息——————
眼部机能:${bodyLevelStrings[info.bodyStatus.eyes]}
耳部机能:${bodyLevelStrings[info.bodyStatus.ears]}
口腔机能:${bodyLevelStrings[info.bodyStatus.mouth]}
手臂机能:${bodyLevelStrings[info.bodyStatus.hands]}
腿脚机能:${bodyLevelStrings[info.bodyStatus.legs]}
——————语音指令——————
无人机${info.MemberNumber} 显示状态
无人机${info.MemberNumber} (眼部|耳部|口腔|手臂|腿脚)拘束设为(关闭|激活|最大)
无人机${info.MemberNumber} (眼部|耳部|口腔|手臂|腿脚)机能设为(可用|限制|离线)
无人机${info.MemberNumber} (打开|关闭)显示屏发言
无人机${info.MemberNumber} 快感装置设为(关闭|激活|最大)
无人机${info.MemberNumber} 高潮限制设为(关闭|激活|最大)
无人机${info.MemberNumber} 高潮奖励
无人机${info.MemberNumber} 电击惩罚
无人机${info.MemberNumber} 弹出充电曲柄
注意:如果无人机不具备听力(如耳部机能限制或电量低于20的情况)的话无法正常使用语音指令，可尝试发送 *指令内容 或 (指令内容) 来绕过听力限制
`

}
function ShowActionButtons(info = null) {
    var string = "";
    if (!info) {
        info = PlayerDroneInfo();
    }
    //对自己
    if (info.MemberNumber == Player.MemberNumber) {
        if (info.isDrone) string = ShowStringsToSelf(0, info);
        else if (info.isOwner) string =  ShowStringsToSelf(1, info);
        else string = ShowStringsToSelf(2, info);
    }
    //对其它人
    else {
        var pdi = PlayerDroneInfo();
        if (pdi.isDrone) {
            if (info.isDrone) string = ShowStringsToOther(0, info);
            else if (info.MemberNumber == pdi.ownerId) string = ShowStringsToOther(1, info);
            else string = ShowStringsToOther(2, info);
        }
        else if (pdi.isOwner) {
            if (info.isDrone) string = ShowStringsToOther(3, info);
            else string = ShowStringsToOther(5, info);
        }
        else {
            if (info.isDrone) string = ShowStringsToOther(4, info);
            else string = ShowStringsToOther(5, info);
        }
    }
    SendMessageToSelf(string, "actions");
}

function ShowStringsToSelf(index, info) {
    var pdi = PlayerDroneInfo();
    switch (index) {
        case 0:
            return `本机可用功能:
显示本机状态:${styleButton("执行", ShowStatus)}
查找单位状态:${styleButton("执行", FindPlayerHint)}
显示携带道具:${styleButton("执行", ShowItemsList)}
显示任务进度:${styleButton("执行", ShowMissionProcess)}
发送充电求助:${styleButton("执行", SendBatteryHelp)}
移动至训练设施:${styleButton("执行", GoToFacility)}
再次显示该界面:${styleButton("执行", ShowActionButtons)}`;
        case 1:
            return `操作员可用功能:
显示操作员状态:${styleButton("执行", ShowStatus)}
查找单位状态:${styleButton("执行", FindPlayerHint)}
显示携带道具:${styleButton("执行", ShowItemsList)}
显示任务进度:${styleButton("执行", ShowMissionProcess)}
注销操作员身份:${styleButton("执行", SetIdentityHint, info, false, true)}
移动至训练设施:${styleButton("执行", GoToFacility)}
再次显示该界面:${styleButton("执行", ShowActionButtons)}`;
        case 2:
            return `游客可用功能:
显示自身状态:${styleButton("执行", ShowStatus)}
查找单位状态:${styleButton("执行", FindPlayerHint)}
注册成为无人机:${styleButton("执行", SetIdentityHint, info, true, false)}
注册成为操作员:${styleButton("执行", SetIdentityHint, info, false, false)}
移动至训练设施:${styleButton("执行", GoToFacility)}
再次显示该界面:${styleButton("执行", ShowActionButtons)}`;
        default:
            return "";
    }
}

function ShowStringsToOther(index, info) {
    switch (index) {
        case 0: // 无人机对无人机
            return `对该单位可用功能:
显示单位状态:${styleButton("执行", DoFindTatget, info)}
发送任务求助:${styleButton("执行", SendMissionHelp, info)}
分享电量:${styleButton("执行", DoBatteryHelp, info, 0)}
再次显示该界面:${styleButton("执行", ShowActionButtons, info)}`;
        case 1: // 无人机对自身操作员
            return `对该单位可用功能:
显示单位状态:${styleButton("执行", DoFindTatget, info)}
发送任务求助:${styleButton("执行", SendMissionHelp, info)}
再次显示该界面:${styleButton("执行", ShowActionButtons, info)}`;
        case 2: // 无人机对非自身操作员或游客
            return `对该单位可用功能:
显示单位状态:${styleButton("执行", DoFindTatget, info)}
发送任务求助:${styleButton("执行", SendMissionHelp, info)}
再次显示该界面:${styleButton("执行", ShowActionButtons, info)}`;
        case 3: // 操作员对无人机
            return `对该单位可用功能:
显示单位状态:${styleButton("执行", DoFindTatget, info)}
显示语音指令:${styleButton("执行", ShowVoiceCommand, info)}
电击惩罚:${styleButton("执行", ReqDoPunishment, info)}
高潮奖励:${styleButton("执行", ReqDoOrgasm, info)}
设置任务:${styleButton("执行", SetMissionToDrone, info)}
接入充电装置:${styleButton("执行", DoBatteryHelp, info, 1)}
手摇曲柄充电:${styleButton("执行", DoBatteryHelp, info, 2)}
设置显示屏发言:${styleButton("执行", SetDisplayTalk, info)}
要求控制权限:${styleButton("执行", SetIdentityHint, info, true, false)}
清除控制权限:${styleButton("执行", SetIdentityHint, info, true, true)}
废弃该无人机:${styleButton("执行")}
再次显示该界面:${styleButton("执行", ShowActionButtons, info)}`;
        case 4: // 游客对无人机
            return `对该单位可用功能:
显示单位状态:${styleButton("执行", DoFindTatget, info)}
显示语音指令:${styleButton("执行", ShowVoiceCommand, info)}
电击惩罚:${styleButton("执行", ReqDoPunishment, info)}
高潮奖励:${styleButton("执行", ReqDoOrgasm, info)}
设置任务:${styleButton("执行", SetMissionToDrone, info)}
手摇曲柄充电:${styleButton("执行", DoBatteryHelp, info, 2)}
设置显示屏发言:${styleButton("执行", SetDisplayTalk, info)}
再次显示该界面:${styleButton("执行", ShowActionButtons, info)}`;
        case 5: // 操作员或游客对操作员或游客
            return `对该单位可用功能:
显示单位状态:${styleButton("执行", DoFindTatget, info)}
再次显示该界面:${styleButton("执行", ShowActionButtons, info)}`;
        default:
            return "";
    }
}

function ShowItemsList() {
    var pdi = PlayerDroneInfo();
    var string = "道具列表："
    for (var item of pdi.items) {
        string += "\n";
        string += item.text;
        if (item.use != null) {
            if (item.param.length == 0) {
                string += styleButton("使用", () => {
                    ItemInfo[item.use](item);
                    ShowItemsList();
                });
            }
            else {
                string += "\n";
                for (var p of item.param) {
                    string += styleButton(p.name, (id) => {
                        ItemInfo[item.use](item, id);
                        ShowItemsList();
                    }, p.id);
                }
            }
        }
        string += styleButton("丢弃", (item) => { ItemInfo.RemoveThis(item);; ShowItemsList(); }, item);
    }
    SendMessageToSelf(string,"items", false);
}


function ShowMissionProcess() {
    var pdi = PlayerDroneInfo();
    ShowMissionsString(pdi.missions,"任务列表：");
}

function ShowMissionsString(missions,head) {
    var string = head;
    for (var mission of missions) {
        string += "\n";
        string += mission.text + ":" + mission.desc;
        if (mission.target != undefined && mission.progress != undefined) {
            string += `(${mission.progress}/${mission.target})`;
        }
    }
    SendMessageToSelf(string, "missions", false);

}

function FindPlayerHint() {
    var input = (document.getElementById("InputChat"));
    input.value = '/DTS findtarget []'
    SendMessageToSelf("请在方括号内输入目标ID并发送指令，或触摸目标项圈(包括自身)");
}
function DoFindTatget(target, param = null) {
    SendDTSMsg(target, new MsgInfo("RequestStatus", param));
}

function SendMissionHelp(info) {
    SendDTSMsg(info, new MsgInfo("SendMissionHelp", Object.assign([], PlayerDroneInfo().missions)))
    SendMessageToSelf("已发送任务协助请求");
}

//WIP
function SetMissionToDrone(info) {
    SendDTSMsg(info, new MsgInfo("PutMission", null));
}

async function GoToFacility() {
    if (ChatRoomData?.MapData?.Objects?.startsWith("ҴӄӃҶұҳҹ") && ChatRoomData?.Name?.startsWith("DroneFacility")) {
        SendMessageToSelf(`位于训练设施中，无需移动`);
        return;
    }
    const SearchData = {
        Query: "DroneFacility".toUpperCase().trim(),
        Language: ChatSearchLanguage,
        Space: ChatSearchGetSpace() ?? "",
        Game: ChatSearchGame,
        FullRooms: Player.ChatSearchSettings.FullRooms,
        ShowLocked: Player.ChatSearchSettings.ShowLocked,
        MapTypes: Player.ChatSearchSettings.MapTypes ? [Player.ChatSearchSettings.MapTypes] : [],
        SearchDescs: Player.ChatSearchSettings.SearchDescriptions,
    };
    var result = await ServerRoomSearch("DroneFacility", SearchData)
    if (result.error == null && result.value.length > 0) {
        for (var room of result.value) {
            var result = ChatSearchGridRoomCanJoin(room);
            if (result) {
                await JoinRoom(room.Name);
                SendMessageToSelf(`已到达训练设施`);
                return;
            }
        }
    }
    else if (ChatRoomData.Admin.indexOf(Player.MemberNumber) != -1) {
        SendMessageToSelf(`未找到可用房间，是否将当前房间更新为训练设施（当前房间所有设置会丢失）${styleButton("是", () => {
            ClearAllMessage();
            InitMapFaci();
        })}${styleButton("否", () => {
            ClearTagMessage("GoToFacilityClear");
        })}`, "GoToFacilityClear");
        return
    }
    SendMessageToSelf(`未找到可用房间`);
    
    
}
async function JoinRoom(RoomName) {
    await ChatRoomAttemptLeave();
    await sleep(1000);
    await ServerRoomJoin(RoomName);
    await sleep(1000);
    await waitFor(() => { return ChatRoomData != null })
}
var missionLists = [
    ["StockRoomMission", "OrgasmMission", "SpankMission", "PetHeadMission", "ChargeMission"],
    ["StockRoomMission", "OwnerSpankMission", "OwnerPetHeadMission"],
]

function GetMission(pdi, missionStr = null) {
    var index = -1;
    if (missionStr != null) {
        index = missionLists[pdi.isDrone ? 0 : 1].findIndex(missionStr);
    }
    if (index == -1) {
        index = Math.floor(Math.random() * missionLists[pdi.isDrone ? 0 : 1].length);
    }
    var mission = MissionInfo[missionLists[pdi.isDrone ? 0 : 1][index]]();
    return mission;
}

function TakeMission(missionStr = null) {
    var pdi = PlayerDroneInfo();
    if (pdi.todaysMission >= pdi.missionsMax) {
        SendMessageToSelf("每日接取任务次数已满，无法接取", "WorkRoom")
        return;
    }
    if (pdi.missions.length >= pdi.missionsMax) {
        SendMessageToSelf("已接取任务已满，无法接取", "WorkRoom")
        return;
    }
    var mission = GetMission(pdi, missionStr);
    pdi.missions.push(mission);
    pdi.todaysMission++;
    SendMessageToSelf(`已接取任务：${mission.text}`, "WorkRoom")
}

function SetDisplayTalk(info) {
    SendDTSMsg(info, new MsgInfo("SetDisplayTalk", !info.disPlayTalk));
    SendMessageToSelf("已发送指令将目标无人机显示屏发言设为" + (info.disPlayTalk ? "关闭" : "开启"));
}

function ShowVoiceCommand(info = null) {
    if (!info) {
        info = { MemberNumber: "(目标ID)" }
    }
    SendMessageToSelf(`
——————语音指令——————
无人机${info.MemberNumber} 显示状态
无人机${info.MemberNumber} (眼部|耳部|口腔|手臂|腿脚)拘束设为(关闭|激活|最大)
无人机${info.MemberNumber} (眼部|耳部|口腔|手臂|腿脚)机能设为(可用|限制|离线)
无人机${info.MemberNumber} (打开|关闭)显示屏发言
无人机${info.MemberNumber} 快感装置设为(关闭|激活|最大)
无人机${info.MemberNumber} 高潮限制设为(关闭|激活|最大)
无人机${info.MemberNumber} 高潮奖励
无人机${info.MemberNumber} 电击惩罚
无人机${info.MemberNumber} 弹出充电曲柄
注意:如果无人机不具备听力(如耳部限制或电量低于20)的话无法正常接收语音指令，可尝试发送 *指令内容 或 (指令内容) 来绕过听力限制`)
}

/**
 * type:0为平均电量,1为充满电,2为充20%电
 * @param {any} target
 * @param {any} type
 * @returns
 */
function DoBatteryHelp(target, type) {
    var char = ChatRoomCharacter.find(c => c.MemberNumber === target.MemberNumber);
    if (!char) {
        SendMessageToSelf("目标已丢失");
        return;
    }
    if (ChatRoomIsViewActive("Map") && ChatRoomMapViewCharacterOnInteractionRange(char)) {
        SendMessageToSelf("与目标距离过远");
        return;
    }
    var diff = 0;
    var pdi = PlayerDroneInfo();
    switch (type) {
        case 0: {
            SendActionText(`无人机${Player.MemberNumber}与无人机${target.MemberNumber}的小腹贴在一起，子宫内的电源开始传输充电，微弱的电流让她们的机体轻微颤抖`);

            SendMessageToSelf("已完成电量分享");
            diff = (Math.floor((target.battery + pdi.battery) / 2)) - target.battery;
            pdi.battery -= diff;
            SendDTSMsg(target, new MsgInfo("BatteryCharge", diff));
            SendDTSMsg(target, new MsgInfo("AddArousal", 10));

            RefreshBatteryTag();
            RefershPlayerEffect();
        }
            break;
        case 1: {
            SendActionText(`${Player.Name}将电源线接入无人机${target.MemberNumber}下体的电源接口，电流经由阴道流至子宫内的电源，电流让她的机体颤抖`);
            SendMessageToSelf("已完成充电");
            diff = target.batteryMax - target.battery;
            SendDTSMsg(target, new MsgInfo("BatteryCharge", diff));
            SendDTSMsg(target, new MsgInfo("AddArousal", 30));
        }
            break;
        case 2: {
            if (pdi.battery >= pdi.batteryMax * 0.3) {
                SendActionText(`${Player.Name}弹出无人机${target.MemberNumber}下体的电源接口内藏的手摇曲柄，由于无人机${target.MemberNumber}已有一定电量，所以曲柄反而自行旋转消耗了大量电量`);

            }
            else {
                SendActionText(`${Player.Name}弹出无人机${target.MemberNumber}下体的电源接口内藏的手摇曲柄并猛烈转动，动能转化为电能经由阴道流至子宫内的电源，动能与电能让她的机体猛烈颤抖`);
            }
            SendMessageToSelf("已完成充电");
            diff = Math.floor(target.batteryMax * 0.3) - target.battery;
            SendDTSMsg(target, new MsgInfo("BatteryCharge", diff));
            SendDTSMsg(target, new MsgInfo("AddArousal", 50));
        }
            break;
    }
}
function GetDistance(Pos, Pos2) {
    return Math.abs(Pos.X - Pos2.X) + Math.abs(Pos.Y - Pos2.Y);
}

function SetIdentityHint(target, isSetDrone, isUndo) {
    var pdi = PlayerDroneInfo();
    if (target.MemberNumber == Player.MemberNumber && isSetDrone && isUndo && pdi.isDrone) {
        SendMessageToSelf("无人机无权注销自身身份，执行惩罚");
        DoPunishment(3, 3);
        return;
    }
    if (pdi.ownerId != -1 && pdi.ownerId != target.MemberNumber) {
        SendMessageToSelf("无人机无权自主更改操作员，执行惩罚");
        DoPunishment(3, 3);
        return;
    }
    if (target.MemberNumber == Player.MemberNumber) {
        if (isSetDrone && !isUndo && !target.isDrone) {
            SendMessageToSelf(`即将接受无人机化改造，点击按钮以${styleButton("确认", SetToDrone, target, isUndo)}`);
            return;
        }
        if (!isSetDrone && !isUndo && !target.isOwner) {
            SendMessageToSelf(`即将注册为操作员，点击按钮以${styleButton("确认", SetToOwner, target, isUndo)}`);
            return;
        }
        if (!isSetDrone && isUndo && target.isOwner) {
            SendMessageToSelf(`即将注销操作员身份，点击按钮以${styleButton("确认", SetToOwner, target, isUndo)}`);
            return;
        }
    }
    else {
        if (target.ownerId == -1 && target.ownerId != Player.MemberNumber) {
            if (isSetDrone && !isUndo && target.isDrone) {
                SendMessageToSelf(`即将向其要求控制权限，点击按钮以${styleButton("确认", SetToDrone, target, isUndo)}`);
                return;
            }
            if (isSetDrone && isUndo && target.isDrone) {
                SendMessageToSelf(`即将清除对其的控制权限，点击按钮以${styleButton("确认", SetToDrone, target, isUndo)}`);
                return;
            }
        }
        else {
            SendMessageToSelf(`不具有对该无人机的操作权限，请联系操作员${target.ownerId}以进行操作权限交接`);
        }

    }
}

function SetToDrone(target, isUndo) {
    if (target.MemberNumber == Player.MemberNumber) {
        if (!isUndo) {
            StartDrone();
        }
    }
    else {
        SendDTSMsg(target, new MsgInfo("ReqOwnerRight", isUndo));
        SendMessageToSelf(`已发送指令`);
    }
}

function SetToDroneAccept(targetChar) {
    PlayerDroneInfo().ownerId = targetChar.MemberNumber;
    SendDTSMsg(targetChar, new MsgInfo("RespOwnerRight", false));
}

//WIP
async function StartDrone() {
    var waitTime = 2000;
    SendMessageToSelf(`接收来自素体到无人机注册请求，开始无人机化改造流程`);
    await sleep(waitTime);
    SendMessageToSelf(`开始部署改造单元\n${styleProgressBar("正在部署", "部署完成", waitTime)}`);
    await sleep(waitTime);
    WearEquips(Player, [Crate]);
    SendMessageToSelf(`改造单元部署完成，素体收容完成`);
    await sleep(waitTime);
    SendMessageToSelf(`开始喷射溶解液\n${styleProgressBar("正在喷射", "喷射完成", waitTime)}`);
    await sleep(waitTime);
    RemoveClothes(Player, false);
    var group = Object.assign([], AssetGroup);
    group = group.filter(item => item.Name !== "ItemDevices");
    RemoveRestrainsWithAssetGroup(Player, group);
    RefershPlayerEffect();
    SendMessageToSelf(`素体服装与拘束溶解完成`);
    await sleep(waitTime);
    SendMessageToSelf(`开始拘束素体\n${styleProgressBar("正在拘束", "拘束完成", waitTime)}`);
    await sleep(waitTime);
    ExtendedItemSetOptionByRecord(Player, InventoryGet(Player, Crate.AssetGroup), {
        "w": 1,
        "l": 3,
        "a": 3,
        "d": 0,
        "t": 0,
        "h": 0
    });
    await sleep(waitTime);
    SendMessageToSelf(`素体拘束完成`);
    await sleep(waitTime);
    SendMessageToSelf(`开始喷涂乳胶涂层\n${styleProgressBar("正在喷涂", "喷涂完成", waitTime)}`);
    await sleep(waitTime);
    WearEquips(Player, BasicDroneBinds.slice(0, 2));
    SendMessageToSelf(`乳胶涂层喷涂完成`);
    await sleep(waitTime);
    SendMessageToSelf(`开始安装总电源\n${styleProgressBar("正在安装", "安装失败", waitTime)}`);
    await sleep(waitTime);
    SendMessageToSelf(`无法顺利安装总电源，推测原因:紧张情绪导致的素体骨骼肌异常震颤与阴道不通畅`);
    await sleep(waitTime);
    SendMessageToSelf(`开始安装体态控制装置\n${styleProgressBar("正在安装", "安装完成", waitTime)}`);
    await sleep(waitTime);
    WearEquips(Player, BasicDroneBinds.slice(2, 4));
    SendMessageToSelf(`体态控制装置已植入素体肩部、背部、腹部，安装完成`);
    await sleep(waitTime);
    SendMessageToSelf(`体态控制装置通过外接电源启动，主动抑制素体骨骼肌震颤\n${styleProgressBar("正在启动", "启动完成", waitTime)}`);
    await sleep(waitTime);
    SendMessageToSelf(`开始安装总电源,向阴道内插入总电源安装管`);
    ExtendedItemSetOptionByRecord(Player, InventoryGet(Player, Crate.AssetGroup), {
        "w": 1,
        "l": 3,
        "a": 3,
        "d": 1,
        "t": 0,
        "h": 0,
        "d1": 0
    });
    await sleep(waitTime);
    ActivityTimerProgress(Player, 10);
    SendMessageToSelf(`阴道扩张顺畅，进一步插入总电源安装管`);
    await sleep(waitTime)
    ActivityTimerProgress(Player, 10);
    SendMessageToSelf(`总电源安装管已到达子宫口，开始向子宫内置入总电源\n${styleProgressBar("正在置入", "置入完成", waitTime)}`);
    await sleep(waitTime)
    ActivityTimerProgress(Player, 10);
    SendMessageToSelf(`总电源置入成功，开始向总电源内注入电池液\n${styleProgressBar("正在注入", "正在注入", waitTime)}`);
    await sleep(waitTime)
    ActivityTimerProgress(Player, 10);
    SendMessageToSelf(`注入顺畅，总电源膨胀率增长良好\n${styleProgressBar("正在注入", "注入异常", waitTime)}`);
    await sleep(waitTime)
    ActivityTimerProgress(Player, 10);
    SendMessageToSelf(`检测到总电源膨胀受阻，推测原因:总电源已膨胀至填满子宫`);
    await sleep(waitTime)
    ActivityTimerProgress(Player, 10);
    SendMessageToSelf(`加大电池液注入压强，总电源膨胀率增长缓慢\n${styleProgressBar("正在注入", "注入完成", waitTime)}`);
    await sleep(waitTime)
    ActivityTimerProgress(Player, 10);
    SendMessageToSelf(`电池液注入完毕，总电源已达到最大膨胀，封闭总电源注入口，接入电源接口`);
    await sleep(waitTime)
    ActivityTimerProgress(Player, 10);
    WearEquips(Player, BasicDroneBinds.slice(4, 5));
    ExtendedItemSetOptionByRecord(Player, InventoryGet(Player, Crate.AssetGroup), {
        "w": 1,
        "l": 3,
        "a": 3,
        "d": 0,
        "t": 0,
        "h": 0
    });
    SendMessageToSelf(`总电源安装管退出，电源接口已膨胀至填充全部阴道，总电源安装完成，进行高潮充能测试`);
    await sleep(waitTime);
    DoOrgasm();
    await sleep(waitTime * 3);
    SendMessageToSelf(`总电源电量填充成功，高潮充能测试完成`);

    await sleep(waitTime);
    SendMessageToSelf(`开始安装内循环系统控制装置\n${styleProgressBar("正在安装", "安装完成", waitTime)}`);
    await sleep(waitTime);
    WearEquips(Player, BasicDroneBinds.slice(5, 9));
    SendMessageToSelf(`内循环系统控制装置已植入素体乳头、阴蒂、肛门，安装完成`);


    await sleep(waitTime);
    SendMessageToSelf(`开始安装内循环系统控制装置总控系统与生理信息监控装置\n${styleProgressBar("正在安装", "安装完成", waitTime)}`);
    await sleep(waitTime);
    WearEquips(Player, BasicDroneBinds.slice(9, 11));
    SendMessageToSelf(`总控系统已植入素体小腹，安装完成，生理信息监控装置已植入素体胸口，安装完成，进行功能测试`);
    await sleep(waitTime);
    DoVibe(2, true);
    SendMessageToSelf(`内循环系统控制装置启动，震动功能良好，生理信息监控装置已检测到体温与心率的上升，监测功能良好`);


    await sleep(waitTime);
    SendMessageToSelf(`开始安装运动控制装置\n${styleProgressBar("正在安装", "安装完成", waitTime)}`);
    await sleep(waitTime);
    WearEquips(Player, BasicDroneBinds.slice(11, 16));
    SendMessageToSelf(`运动控制装置已植入素体手部、臂部、腿部、脚踝、足部，安装完成`);

    await sleep(waitTime);
    SendMessageToSelf(`开始个体识别装置\n${styleProgressBar("正在安装", "安装完成", waitTime)}`);
    await sleep(waitTime);
    WearEquips(Player, BasicDroneBinds.slice(16, 17));
    SendMessageToSelf(`个体识别装置已植入面部，安装完成，开始在个体识别装置上印刷无人机ID`);


    await sleep(waitTime);
    SendMessageToSelf(`检测到素体异常动作，推测原因:素体缺氧导致的恐慌`);
    await sleep(waitTime);
    SendMessageToSelf(`启动运动控制装置，主动抑制素体异常动作\n${styleProgressBar("正在启动", "启动完成", waitTime)}`);


    await sleep(waitTime);
    SendMessageToSelf(`开始在个体识别装置上安装视觉、听觉、消化、呼吸系统外部接口\n${styleProgressBar("正在安装", "安装完成", waitTime)}`);
    await sleep(waitTime);
    WearEquips(Player, BasicDroneBinds.slice(17, 21));
    SendMessageToSelf(`外部接口安装完成，素体异常动作缓和`);


    await sleep(waitTime);
    SendMessageToSelf(`开始安装显示器与信号接收器\n${styleProgressBar("正在安装", "安装完成", waitTime)}`);
    await sleep(waitTime);
    WearEquips(Player, BasicDroneBinds.slice(21, 24));
    SendMessageToSelf(`显示器安装完成，信号接收器安装完成`);

    await sleep(waitTime);
    SendMessageToSelf(`所有装置安装完成，无人机注册完成，开始无人机教育程序`);
    await sleep(waitTime);
    SendMessageToSelf(`@$@##$%$%$\n${styleProgressBar("@$@##", "$%$%$", waitTime)}`);
    await sleep(waitTime);
    SendMessageToSelf(`#@#%$##$%%\n${styleProgressBar("#@#%", "##$%%", waitTime)}`);
    await sleep(waitTime);
    SendMessageToSelf(`#@$%#@$%#@\n${styleProgressBar("#@$%#", "@$%#@", waitTime)}`);
    await sleep(waitTime);
    SendMessageToSelf(`@#$$$%%%$$\n${styleProgressBar("@#$$$", "%%%$$", waitTime)}`);
    await sleep(waitTime);
    SendMessageToSelf(`#$%%%$%$$@\n${styleProgressBar("#$%%%", "$%$$@", waitTime)}`);
    await sleep(waitTime);
    SendMessageToSelf(`@@@#%$#@@%\n${styleProgressBar("@@@#%", "$#@@%", waitTime)}`);
    await sleep(waitTime);
    SendMessageToSelf(`无人机教育程序完成，无人机化改造流程已全部完成，放出无人机`);
    InventoryRemove(Player, Crate.AssetGroup);
    RefershPlayerEffect();

    PlayerDroneInfo().isDrone = true;
    SendDTSMsg(sender, new MsgInfo("HeartBeatPack", { recive: false, isDrone: PlayerDroneInfo().isDrone }));

}
function SetToOwner(target, isUndo) {
    if (target.MemberNumber == Player.MemberNumber) {
        PlayerDroneInfo().isOwner = !isUndo;
        SendMessageToSelf(`已${isUndo ? "注销" : "注册为"}操作员身份`);
    }
}
function SetStatusHint(info, type, part) {
    var buttons = []
    var textType = type;
    if (part == 3) {
        textType = 0;
    }
    for (var i = 0; i < 3; i++) {
        buttons.push(styleButton(levelStrings[textType][i], SetStatusSend, info, type, part, i));
    }
    SendMessageToSelf("设为" + buttons[0] + buttons[1] + buttons[2])

}

function SetStatusSend(info, type, part, level) {
    if ((type == 1 && info.bodyStatusMax[bodyPartStrings[part]] < level) && part != 3) {
        SendMessageToSelf("当前无人机该部位未接受改造，无法设置为指定状态");
        return;
    }
    SendDTSMsg(info, new MsgInfo("SetStatus", [type, part, level]));
    SendMessageToSelf("已发送设置指令");

}

class MsgInfo {

    constructor(type, param) {
        this.type = type;
        this.param = param;
    }
    static DoCmd(sender, msgInfo) {
        MsgCmds[msgInfo.type].Command(sender, msgInfo.param)
    }
    static DoBeepCmd(MemberNumber, msgInfo, options) {
        BeepCmds[msgInfo.type].Command(MemberNumber, msgInfo.param, options)
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
function SendDTSMsg(targetPlayer, Dict) {
    if (targetPlayer) {
        ServerSend("ChatRoomChat", { Content: "DTS", Type: "Hidden", Dictionary: Dict, Target: targetPlayer.MemberNumber });
    }
    else {
        ServerSend("ChatRoomChat", { Content: "DTS", Type: "Hidden", Dictionary: Dict });
    }
}

function IsInZone(Pos, Zone) {
    var isIn = false;
    for (let areaKey in Zone.Areas) {
        if (IsInArea(Pos, Zone.Areas[areaKey])) {
            isIn = areaKey;
            break;
        }
    }
    if (isIn) {
        for (let areaKey in Zone.Exclude) {
            if (IsInArea(Pos, Zone.Exclude[areaKey])) {
                isIn = false;
                break;
            }
        }
    }
    return isIn;
}
function IsInArea(Pos, Area) {
    var isIn = false;
    if (Area.X != undefined) {
        isIn = IsAtTile(Pos, Area);
    }
    else if (Area.leftUp != undefined) {
        isIn = IsInLURD(Pos, Area);
    }
    else if (Area instanceof Array) {
        isIn = IsAtTileArray(Pos, Area);
    }
    return isIn;
}

function IsAtTile(Pos, Tile) {
    return (Pos.X == Tile.X && Pos.Y == Tile.Y)
}
function IsInLURD(Pos, LURD) {
    return (Pos.X >= LURD.leftUp.X && Pos.Y >= LURD.leftUp.Y && Pos.X <= LURD.rightDown.X && Pos.Y <= LURD.rightDown.Y)

}
function IsAtTileArray(Pos, Tiles) {
    for (var tile of Tiles) {
        if (IsAtTile(Pos, tile)) {
            return true;
        }
    }
    return false;
}
//

function RandomPosOfArea(Area) {
    if (Area.X != undefined) {
        return Object.assign({}, Area);
    }
    else if (Area.leftUp != undefined) {
        return {
            X: Math.floor(Math.random() * (Area.rightDown.X - Area.leftUp.X + 1)) + Area.leftUp.X,
            Y: Math.floor(Math.random() * (Area.rightDown.Y - Area.leftUp.Y + 1)) + Area.leftUp.Y,
        }
    }
    else if (Area instanceof Array) {
        return Object.assign({}, Area[Math.floor(Math.random() * Area.length)]);
    }
}
function MovePlayer(Pos, triggerPlayerMoved = false) {
    if (Pos.X == undefined || Pos.Y == undefined) return;
    Player.MapData.Pos = Object.assign({}, Pos);
    ServerSend("ChatRoomCharacterMapDataUpdate", { Pos: Object.assign({}, Pos) });
    if (triggerPlayerMoved) {
        if (PlayerMoved) {
            PlayerMoved();
        }
    }
    else {
        pverPos = Object.assign({}, Player.MapData.Pos);
    }
}
class DroneInfo {
    constructor() {
        this.scriptVersion = 1.0;
        this.MemberNumber = Player.MemberNumber;
        this.isDrone = false;
        this.isOwner = false;
        this.level = 0;
        this.type = "BasicDrone";

        this.battery = 1000;
        this.batteryMax = 1000;

        this.moveBatteryCost = 1;
        this.chatBatteryCost = 50;
        this.miniteBatteryCost = 10;
        this.punishBatteryCost = 100;
        this.orgasmBatteryGet = 100;

        this.shockLevel = 1;
        this.shoclCount = 3;

        this.coin = 0;
        this.ownerId = -1;

        //0无限制 1限制 2禁用
        this.bodyStatus = {
            eyes: 0,
            ears: 0,
            mouth: 0,
            body: 0,
            hands: 0,
            legs: 0,
        };
        this.bodyStatusMax = {
            eyes: 0,
            ears: 0,
            mouth: 0,
            body: 0,
            hands: 0,
            legs: 0,
        };
        this.bindStatus = {
            eyes: 0,
            ears: 0,
            mouth: 0,
            body: 0,
            hands: 0,
            legs: 0,
        };
        this.disPlayTalk = false;

        this.facilityMapEntered = false;

        this.items = [];
        this.itemsMax = 3;

        this.missions = [];
        this.missionsMax = 3;

        this.modifys = new Map()

        this.lastLoginDate = 0;
        this.todaysMission = 0;
        this.todaysWork = 0
        this.workMax = 30;
    }
    FromPlayerSetting() {
        if (Player.ExtensionSettings["DTSbyZajucd"] != undefined) {
            return Player.ExtensionSettings["DTSbyZajucd"];
        }
        return new DroneInfo();
    }
    SaveToPlayerSetting() {
        Player.ExtensionSettings["DTSbyZajucd"] = this;
        ServerPlayerExtensionSettingsSync("DTSbyZajucd");
    }
}
class MissionInfo {
    constructor(name, text, reward) {
        this.name = name;
        this.text = text;
        this.desc = "";
        this.reward = reward;
        this.id = Date.now() + Math.floor(Math.random() * 10000);
        this.complete = null;
    }

    static ProgressAdd(name) {
        var pdi = PlayerDroneInfo();
        for (var mission of pdi.missions) {
            if (mission.name == name) {
                mission.progress += 1;
                if (mission.progress >= mission.target) {
                    MissionInfo.MissionComplete(mission);
                }
            }
        }
    }

    static MissionComplete(mission, ...parmas) {
        var pdi = PlayerDroneInfo();
        SendMessageToSelf(`任务:${mission.text} 完成，奖励${mission.reward}配额点数`)
        pdi.coin += mission.reward;
        if (mission.complete != null) {
            MissionInfo[mission.complete](mission, ...parmas)
        }
        pdi.missions = pdi.missions.filter(mi => mission.id != mi.id);

    }

    static StockRoomMission() {
        var from = Math.floor(Math.random() * 60)
        var to = Math.floor(Math.random() * 60)
        var mission = new MissionInfo("StockRoom", "运送货物", 10);
        mission.from = from;
        mission.to = to;
        mission.complete = "StockRoomMissionComplete"
        mission.desc = `将${String.fromCharCode(65 + Math.floor(from / 5))}${from % 5 + 1}的货物运送至${String.fromCharCode(65 + Math.floor(to / 5))}${to % 5 + 1}`
        return mission;
    }

    static StockRoomMissionComplete(mission) {
        var pdi = PlayerDroneInfo();
        pdi.items = pdi.items.filter(item => !(item.name == "StockRoom" && item.index == mission.from));
    }

    static OrgasmMission() {
        var mission = new MissionInfo("Orgasm", "高潮任务", 10);
        mission.target = 5;
        mission.progress = 0;
        mission.desc = `高潮五次`;
        return mission;
    }
    static SpankMission() {
        var mission = new MissionInfo("Spank", "被打屁股任务", 10);
        mission.target = 3;
        mission.progress = 0;
        mission.desc = `被打屁股三次`;
        return mission;
    }
    static OwnerSpankMission() {
        var mission = new MissionInfo("OwnerSpank", "打屁股任务", 10);
        mission.target = 3;
        mission.progress = 0;
        mission.desc = `打无人机的屁股三次`;
        return mission;
    }
    static PetHeadMission() {
        var mission = new MissionInfo("PetHead", "被摸头任务", 10);
        mission.target = 3;
        mission.progress = 0;
        mission.desc = `被摸头三次`;
        return mission;
    }
    static OwnerPetHeadMission() {
        var mission = new MissionInfo("OwnerPetHead", "摸头任务", 10);
        mission.target = 3;
        mission.progress = 0;
        mission.desc = `摸无人机的头三次`;
        return mission;
    }
    static ChargeMission() {
        var mission = new MissionInfo("Charge", "充电桩任务", 10);
        mission.target = 1;
        mission.progress = 0;
        mission.desc = `使用充电桩一次`;
        return mission;
    }
    static TrainMission() {

    }
    static Education() {

    }
}
class ItemInfo {
    constructor(name) {
        this.name = name;
        this.id = Date.now() + Math.floor(Math.random() * 10000);
        this.text = "";
        this.canUse = () => { return true }
        this.use = null;
        this.param = [];
    }
    static RemoveThis(item) {
        var pdi = PlayerDroneInfo();
        pdi.items = pdi.items.filter((i) => { return i.id != item.id })
    }
    static StockRoomItem(index) {
        var item = new ItemInfo("StockRoom");
        item.index = index;
        item.text = `货物${String.fromCharCode(65 + Math.floor(index / 5))}${index % 5 + 1}`
        
        return item;
    }
    static BatteryItem() {
        var item = new ItemInfo("BatteryItem");
        item.text = "一次性充电宝，补充无人机50%的电量，记得在电量耗尽前使用";
        item.use = "BatteryItemUse"
        return item;
    }
    static BatteryItemUse(item) {
        var pdi = PlayerDroneInfo();
        if (pdi.isDrone) {
            SendActionText(`无人机${pdi.MemberNumber}将充电宝的电源线接入下体的电源接口，开始充电`)
            SendMessageToSelf(`${styleProgressBar("正在充电", "充电完成", 15000, () => {
                var pdi = PlayerDroneInfo();
                ResponseBatteryCharge(pdi.batteryMax / 2);
                SendMessageToSelf("充电完成");
            })}`)
        }
        else {
            ResponseBatteryCharge(pdi.batteryMax / 2);
            SendMessageToSelf("个人信息终端无需充电，但已将充电宝内电量作为备用能源补充");
        }
        ItemInfo.RemoveThis(item);
    }
    static BindStatusDownItem() {
        var item = new ItemInfo("BindStatusDownItem");
        item.text = "拘束减缓芯片，将一个部位的拘束等级下调一级";
        item.param = [
            {
                id: 0,
                name: bodyPartDisplayStrings[0]
            },
            {
                id: 1,
                name: bodyPartDisplayStrings[1]
            },
            {
                id: 2,
                name: bodyPartDisplayStrings[2]
            },
            {
                id: 4,
                name: bodyPartDisplayStrings[4]
            },
            {
                id: 5,
                name: bodyPartDisplayStrings[5]
            },
        ]
        item.use = "BindStatusDownItemUse";
        return item;
    }

    static BindStatusDownItemUse(item, part) {
        var pdi = PlayerDroneInfo();
        if (pdi.isDrone) {
            SendActionText(`无人机${pdi.MemberNumber}用拘束减缓芯片在项圈上扫了一下，${bodyPartDisplayStrings[part]}的拘束松开了`)
            DoSetBodyOrBindStatus(
                0,
                part,
                pdi.bindStatus[bodyPartStrings[part]] == 0 ? 0 : pdi.bindStatus[bodyPartStrings[part]] - 1,
                { Name: "拘束减缓芯片" }
            );
        }
        else {
            SendActionText(`${Player.Name}用拘束减缓芯片在身上的拘束上扫了一下，${bodyPartDisplayStrings[part]}的拘束松开了`)
            RemoveRestrainsWithAssetGroup(Player, bodyPartAssetGroups[part])
        }
        ItemInfo.RemoveThis(item);
    }
    static BindStatusUpItem() {
        var item = new ItemInfo("BindStatusUpItem");
        item.text = "拘束收紧芯片，将一个部位的拘束等级上调一级";
        item.param = [
            {
                id: 0,
                name: bodyPartDisplayStrings[0]
            },
            {
                id: 1,
                name: bodyPartDisplayStrings[1]
            },
            {
                id: 2,
                name: bodyPartDisplayStrings[2]
            },
            {
                id: 4,
                name: bodyPartDisplayStrings[4]
            },
            {
                id: 5,
                name: bodyPartDisplayStrings[5]
            },
        ]
        item.use = "BindStatusUpItemUse";
        return item;
    }
    static BindStatusUpItemUse(item,part) {

        var pdi = PlayerDroneInfo();
        if (pdi.isDrone) {
            SendActionText(`无人机${pdi.MemberNumber}用拘束收紧芯片在项圈上扫了一下，${bodyPartDisplayStrings[part]}的拘束收紧了`)
            DoSetBodyOrBindStatus(
                0,
                part,
                pdi.bindStatus[bodyPartStrings[part]] == 2 ? 2 : pdi.bindStatus[bodyPartStrings[part]] + 1,
                { Name: "拘束收紧芯片" }
            );
        }
        else {
            pdi.coin += 10;
            SendActionText(`${Player.Name}使用了拘束收紧芯片，但无法对非无人机使用，所以被回收为了10配额点数`)
        }
        ItemInfo.RemoveThis(item);
    }
    static BodyStatusDownItem() {
        var item = new ItemInfo("BodyStatusDownItem");
        item.text = "机能恢复芯片，将一个部位的机能限制下调一级";
        item.param = [
            {
                id: 0,
                name: bodyPartDisplayStrings[0]
            },
            {
                id: 1,
                name: bodyPartDisplayStrings[1]
            },
            {
                id: 2,
                name: bodyPartDisplayStrings[2]
            },
            {
                id: 4,
                name: bodyPartDisplayStrings[4]
            },
            {
                id: 5,
                name: bodyPartDisplayStrings[5]
            },
        ]
        item.use = "BodyStatusDownItemUse";
        return item;
    }
    static BodyStatusDownItemUse(item, part) {
        var pdi = PlayerDroneInfo();
        if (pdi.isDrone) {
            var pdi = PlayerDroneInfo();
            SendActionText(`无人机${pdi.MemberNumber}用机能恢复芯片在项圈上扫了一下，${bodyPartDisplayStrings[part]}的机能恢复了`)
            DoSetBodyOrBindStatus(
                1,
                part,
                pdi.bodyStatus[bodyPartStrings[part]] == 0 ? 0 : pdi.bodyStatus[bodyPartStrings[part]] - 1,
                { Name: "机能恢复芯片" }
            );
        }
        else {
            SendActionText(`${Player.Name}用机能恢复芯片在身上的拘束上扫了一下，${bodyPartDisplayStrings[part]}的拘束松开了`)
            RemoveRestrainsWithAssetGroup(Player, bodyPartAssetGroups[part])
        }
        ItemInfo.RemoveThis(item);
    }
    static BodyStatusUpItem() {
        var item = new ItemInfo("BodyStatusUpItem");
        item.text = "机能限制芯片，将一个部位的机能限制提升一级";
        item.param = [
            {
                id: 0,
                name: bodyPartDisplayStrings[0]
            },
            {
                id: 1,
                name: bodyPartDisplayStrings[1]
            },
            {
                id: 2,
                name: bodyPartDisplayStrings[2]
            },
            {
                id: 4,
                name: bodyPartDisplayStrings[4]
            },
            {
                id: 5,
                name: bodyPartDisplayStrings[5]
            },
        ]
        item.use = "BodyStatusUpItemUse";
        return item;
    }
    static BodyStatusUpItemUse(item, part) {
        var pdi = PlayerDroneInfo();
        if (pdi.isDrone) {
            var pdi = PlayerDroneInfo();
            if (pdi.bodyStatus[bodyPartStrings[part]] == 2 ? 2 : pdi.bodyStatus[bodyPartStrings[part]] + 1 > pdi.bodyStatusMax[bodyPartStrings[part]]) {
                pdi.coin += 10;
                SendActionText(`无人机${pdi.MemberNumber}用机能限制芯片在项圈上扫了一下，但该部位未接受改造手术机能无法被限制，所以芯片被回收为了5配额点数`)
                return;
            }
            SendActionText(`无人机${pdi.MemberNumber}用机能限制芯片在项圈上扫了一下，${bodyPartDisplayStrings[part]}的机能被限制了`)
            DoSetBodyOrBindStatus(
                1,
                part,
                pdi.bindStatus[bodyPartStrings[part]] == 2 ? 2 : pdi.bindStatus[bodyPartStrings[part]] + 1,
                { Name: "机能限制芯片" }
            );
        }
        else {
            pdi.coin += 10;
            SendActionText(`${Player.Name}使用了机能限制芯片，但无法对非无人机使用，所以被回收为了10配额点数`)
        }
        ItemInfo.RemoveThis(item);
    }
    static VibeItem() {
        var item = new ItemInfo("VibeItem");
        item.text = "震动控制器，可以调整震动玩具的强度";
        item.param = [
            {
                id: 0,
                name: "关"
            },
            {
                id: 1,
                name: "弱"
            },
            {
                id: 2,
                name: "强"
            },
        ]
        item.use = "VibeItemUse";
        return item;
    }
    static VibeItemUse(item, level) {
        var pdi = PlayerDroneInfo();
        if (pdi.isDrone) {
            var pdi = PlayerDroneInfo();
            SendActionText(`无人机${pdi.MemberNumber}使用了震动控制器`)
            DoSetBodyOrBindStatus(
                1,
                3,
                level,
                { Name: "震动控制器" }
            );
        }
        else {
            DoVibe(level * 2, true);
            SendActionText(`${Player.Name}使用了震动控制器`)
        }
        ItemInfo.RemoveThis(item);
    }
    static OrgasmLimitItem() {
        var item = new ItemInfo("OrgasmLimitItem");
        item.text = "高潮限制器，可以调整高潮限制的等级";
        item.param = [
            {
                id: 0,
                name: "关"
            },
            {
                id: 1,
                name: "寸止"
            },
            {
                id: 2,
                name: "禁止"
            },
        ]
        item.use = "OrgasmLimitItemUse";
        return item;
    }
    static OrgasmLimitItemUse(item, level) {
        var pdi = PlayerDroneInfo();
        if (pdi.isDrone) {
            var pdi = PlayerDroneInfo();
            SendActionText(`无人机${pdi.MemberNumber}使用了高潮限制器`)
            DoSetBodyOrBindStatus(
                1,
                3,
                level,
                { Name: "高潮限制器" }
            );
        }
        else {
            pdi.coin += 10;
            SendActionText(`${Player.Name}使用了高潮限制器，但无法对非无人机使用，所以被回收为了10配额点数`)
        }
        ItemInfo.RemoveThis(item);

    }
    static DisplayTalkItem() {
        var item = new ItemInfo("OrgasmLimitItem");
        item.text = "显示器开关，可以调整是否使用显示器发言";
        item.param = [
            {
                id: 0,
                name: "关"
            },
            {
                id: 1,
                name: "开"
            },
        ]
        item.use = "DisplayTalkItemUse";
        return item;
    }
    static DisplayTalkItemUse(item, level) {
        var pdi = PlayerDroneInfo();
        if (pdi.isDrone) {
            var pdi = PlayerDroneInfo();
            SendActionText(`无人机${pdi.MemberNumber}使用了显示器开关`)
            pdi.disPlayTalk = level == 1;
        }
        else {
            pdi.coin += 10;
            SendActionText(`${Player.Name}使用了显示器开关，但无法对非无人机使用，所以被回收为了10配额点数`)
        }
        ItemInfo.RemoveThis(item);
    }
    static PrivateRoomItem() {
        var item = new ItemInfo("PrivateRoomItem");
        item.text = "私人房间房卡，可以传送至私人房间内，可在房间内呼叫无人机侍寝（记得提前记住无人机的id）";
        item.param = [
            {
                id: 0,
                name: "一号房"
            },
            {
                id: 1,
                name: "二号房"
            },
            {
                id: 2,
                name: "三号房"
            },
        ]
        item.use = "PrivateRoomItemUse";
        return item;

    }
    static PrivateRoomItemUse(item, level) {
        var pdi = PlayerDroneInfo();
        if (pdi.isDrone) {
            SendMessageToSelf("无人机不允许使用该道具，执行惩罚并没收道具");
            DoPunishment(2, 3);
            ItemInfo.RemoveThis(item);
            return;
        }
        for (var charater of ChatRoomCharacter) {
            if (IsInArea(charater.MapData.Pos, PrivateRoom.Areas[level])){
                SendMessageToSelf("房间内有人，无法使用");
                return;
            }
        }
        MovePlayer(RandomPosOfArea(PrivateRoom.Areas[level]), true);
        ItemInfo.RemoveThis(item);
    }

    
}

var trainingProcess = 0;
class RequireActivityinfo {
    constructor(FocusGroupNames, ActivityNames, param, timeLimit, count, calltrainingProcess) {
        this.FocusGroupNames = FocusGroupNames;
        this.ActivityNames = ActivityNames;
        this.param = param;
        this.timeLimitUnitl = Date.now() + timeLimit;
        this.target = count;
        this.progress = 0;
        this.completed = false;
        this.calltrainingProcess = calltrainingProcess;
    }
    static RequireActivity = [];
    static CheckAllActivityComplete(SourceCharacter, TargetCharacter, param, FocusGroupName, ActivityName) {
        for (var info of RequireActivityinfo.RequireActivity) {
            if (info.complete == true) continue;
            if (param != info.param) continue;
            if (info.FocusGroupNames.length > 0 && info.FocusGroupNames.findIndex((i) => { return i == FocusGroupName }) == -1) continue;
            if (info.ActivityNames.length > 0 && info.ActivityNames.findIndex((i) => { return i == ActivityName }) == -1) continue;
            info.progress++;
            if (info.progress >= info.target) {
                info.completed = true;
                if (info.calltrainingProcess) {
                    trainingProcess += 1;
                    info.calltrainingProcess = false;
                }
            }
        }
        RequireActivityinfo.ClearAllPoseCompleted();
    }
    static CheckAllActivityIncomplete() {
        for (var info of RequireActivityinfo.RequireActivity) {
            if (Date.now() > info.timeLimitUnitl && info.progress < info.target) {
                SendMessageToSelf("未在指定时间内完成动作，执行惩罚");
                DoPunishment(2, 3);
                info.completed = true;
            }
        }
        RequireActivityinfo.ClearAllPoseCompleted();
    }
    static ClearAllPoseCompleted() {
        RequireActivityinfo.RequireActivity = RequireActivityinfo.RequireActivity.filter((i) => { return (i.completed == false) })
    }

    static RequireDroneActivity(FocusGroupNameArray, ActivityNameArray, param, timeLimit, count, calltrainingProcess = false) {
        RequireActivityinfo.RequireActivity.push(new RequireActivityinfo(FocusGroupNameArray, ActivityNameArray, param, timeLimit, count, calltrainingProcess));
    }

}
class RequirePoseinfo {
    constructor(poseNameArray,timeLimit, calltrainingProcess) {
        this.poseNameArray = poseNameArray;
        this.timeLimitUnitl = Date.now() + timeLimit;
        this.completed = false;
        this.calltrainingProcess = calltrainingProcess;
    }
    static RequirePose = [];
    static RequireDronePose(poseNameArray, timeLimit, calltrainingProcess = false) {
        RequirePoseinfo.RequirePose.push(new RequirePoseinfo(poseNameArray, timeLimit, calltrainingProcess))
    }
            
    static CheckPose() {
        for (var reqPose of RequirePoseinfo.RequirePose) {
            if (reqPose.complete == true) continue;
            var isPose = false;
            for (var pose of reqPose.poseNameArray) {
                if (Player.Pose.findIndex((i) => { return i == pose }) != -1) {
                    isPose = true;
                    break;
                }
            }
            if (isPose) {
                reqPose.completed = true;
                if (reqPose.calltrainingProcess) {
                    trainingProcess += 1;
                }
            }
            else if (Date.now() > reqPose.timeLimitUnitl) {
                SendMessageToSelf("未在指定时间内完成动作，执行惩罚");
                DoPunishment(2, 3);
                reqPose.completed = true;
            }
        }
        RequirePoseinfo.ClearAllPoseCompleted();
    }
    static ClearAllPoseCompleted() {
        RequirePoseinfo.RequirePose = RequirePoseinfo.RequirePose.filter((i) => { return (i.completed == false) })
    }

}
var _PlayerDroneInfo = null;
function PlayerDroneInfo() {
    if (!Player.ExtensionSettings["DTSbyZajucd"]) {
        Player.ExtensionSettings["DTSbyZajucd"] = new DroneInfo();
        _PlayerDroneInfo = Player.ExtensionSettings["DTSbyZajucd"];
        ServerPlayerExtensionSettingsSync("DTSbyZajucd");
    }
    else if (Player.ExtensionSettings["DTSbyZajucd"].scriptVersion < new DroneInfo().scriptVersion) {
        addMissingProperties(Player.ExtensionSettings["DTSbyZajucd"], new DroneInfo());
        showChangeLog = true;
        Player.ExtensionSettings["DTSbyZajucd"].scriptVersion = new DroneInfo().scriptVersion;
        _PlayerDroneInfo = Player.ExtensionSettings["DTSbyZajucd"];
        ServerPlayerExtensionSettingsSync("DTSbyZajucd");
    }
    return Player.ExtensionSettings["DTSbyZajucd"];

}

function addMissingProperties(target, source) {
    for (let key in source) {
        if (source.hasOwnProperty(key) && !target.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
    return target;
}

function RefershPlayerEffect(sender = Player) {

    CharacterLoadEffect(sender);
    ChatRoomCharacterUpdate(sender);
}


function SendMessageToSelf(message, tag = "", cantClear = false, clearAtNext = false) {
    ChatRoomSendLocal(styleMessage(message, tag, cantClear, clearAtNext));
}
function SendActionText(message, target = null) {
    if (target) {
        ServerSend("ChatRoomChat", {
            Content: "DTS_ACTION_TAG", Type: "Action",
            Dictionary: [
                {
                    Tag: "MISSING TEXT IN \"Interface.csv\": DTS_ACTION_TAG",
                    Text: message
                }
            ],
            Target: target.MemberNumber
        });
    }
    else {
        ServerSend("ChatRoomChat", {
            Content: "DTS_ACTION_TAG", Type: "Action",
            Dictionary: [
                {
                    Tag: "MISSING TEXT IN \"Interface.csv\": DTS_ACTION_TAG",
                    Text: message
                }
            ]
        });
    }
}
var clearLastTag = ["status","items","actions","missions"]
function styleMessage(message, tag = "", cantClear = false, clearAtNext = false) {
    var timestamp = new Date().getTime(); // 函数调用时的时间
    if (cantClear) timestamp = false
    const hiddenString = "styleMessage";
    ClearLastMessage();
    if (clearLastTag.findIndex((t) => { return t == tag }) > -1) {
        ClearTagMessage(tag);
    }

    return `<div 
    data-timestamp="${timestamp}" 
    data-style-message="${hiddenString}" 
    data-clearatnext="${clearAtNext}" 
    data-cleartag="${tag}" 
    style='
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
  line-height: 1.5;
'><span style="font-size: 1.2vw;">■</span><span style="
  font-size: 1.6vw;
  white-space: pre-wrap;
  flex: 1;
  line-height: inherit;
  margin: 0;
">${message}_</span></div>`;
}

// 全局回调注册表
const _buttonCallbacks = new Map();
let _globalListenerAttached = false;
/**
 * 生成可嵌入终端文本的内联按钮（无尺寸样式版本）
 * @param {string} buttonText - 按钮显示的文本
 * @param {Function|string} clickHandler - 点击时执行的函数或代码字符串
 * @returns {string} 内联按钮的 HTML 字符串
 */
function styleButton(buttonText, clickHandler, ...extraArgs) {
    // 防止 XSS 攻击（仍保留原有转义逻辑，用于文本内容）
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    const safeText = escapeHtml(buttonText);

    // 生成唯一标识符（简单自增，也可使用 uuid）
    const clickId = 'btn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);

    // 存储回调及额外参数
    if (typeof clickHandler === 'function') {
        _buttonCallbacks.set(clickId, { handler: clickHandler, args: extraArgs });
    } else if (clickHandler !== undefined) {
        console.warn('styleButton: clickHandler 必须是函数，已忽略点击绑定');
    }

    // 全局只绑定一次事件委托
    if (!_globalListenerAttached) {
        document.addEventListener('click', (event) => {
            // 查找被点击的元素或其父级中带有 data-click-id 的按钮
            const targetButton = event.target.closest('[data-click-id]');
            if (targetButton) {
                const id = targetButton.getAttribute('data-click-id');
                const callbackInfo = _buttonCallbacks.get(id);
                if (callbackInfo) {
                    const { handler, args } = callbackInfo;
                    // 调用回调，this 指向按钮，传递 event 和额外参数
                    handler.call(targetButton, ...args);
                }
            }
        });
        _globalListenerAttached = true;
    }

    // 核心样式（与原样式完全一致，无任何尺寸相关属性）
    return `<button 
        data-click-id="${clickId}"
        style="
            display: inline-flex;
            align-items: baseline;
            cursor: pointer;
            background: transparent;
            border: solid;
            border-color: #33CC33;
            border-width: 1px;
            color: #00FF00;
            transition: all 0.1s ease;
            white-space: nowrap;
            font-family: inherit;
        "
        onmouseover="this.style.background='rgba(0, 255, 0, 0.1)'; this.style.borderColor='#00FF00';" 
        onmouseout="this.style.background='transparent'; this.style.borderColor='#33CC33';" 
        onmousedown="this.style.background='rgba(0, 255, 0, 0.2)';" 
        onmouseup="this.style.background='rgba(0, 255, 0, 0.1)'; this.style.borderColor='#00FF00';"
    >
        <span>▸</span>${safeText}
    </button>`;
}


// ==================== 全局文本进度条管理器（支持回调参数） ====================
const _textProgressManager = {
    items: new Map(),
    intervalMs: 30,

    register(id, duration, onComplete, onCompleteParams, textSpan, messageSpan, container, completionMessage) {
        const startTime = performance.now();
        const intervalId = setInterval(() => {
            if (!container.isConnected) {
                this.unregister(id);
                return;
            }
            const elapsed = performance.now() - startTime;
            let progress = Math.min(1, elapsed / duration);
            this.updateText(textSpan, progress);
            if (progress >= 1) {
                // 进度满，如果有完成消息则替换左侧消息
                if (completionMessage && messageSpan) {
                    const escapeHtml = (text) => {
                        const div = document.createElement('div');
                        div.textContent = text;
                        return div.innerHTML;
                    };
                    messageSpan.innerHTML = escapeHtml(completionMessage);
                }
                // 调用回调并传递额外参数
                if (typeof onComplete === 'function') {
                    onComplete(...onCompleteParams);
                }
                this.unregister(id);
            }
        }, this.intervalMs);
        this.items.set(id, { intervalId, onComplete, textSpan, container });
    },

    updateText(spanElement, progress) {
        const barWidth = 20;
        const filled = Math.floor(progress * barWidth);
        const empty = barWidth - filled;
        const bar = '#'.repeat(filled) + '_'.repeat(empty);
        const percent = Math.floor(progress * 100);
        spanElement.textContent = `[${bar}] ${percent}%`;
    },

    unregister(id) {
        const item = this.items.get(id);
        if (item) {
            clearInterval(item.intervalId);
            this.items.delete(id);
        }
    },

    clearAll() {
        for (const [id, item] of this.items) {
            clearInterval(item.intervalId);
        }
        this.items.clear();
    }
};

window.addEventListener('beforeunload', () => _textProgressManager.clearAll());

/**
 * 生成控制台风格的字符串进度条
 * @param {string} message               左侧显示的消息（加载中文本）
 * @param {string|null} completionMessage 进度满后将左侧消息替换为此文本（传 null 或不替换）
 * @param {number} duration              总时长（毫秒），默认 3000
 * @param {Function} onComplete          进度满时执行的回调函数（可选）
 * @param {...any} onCompleteParams      回调函数的额外参数
 * @returns {string}                     可插入 DOM 的 HTML 字符串
 */
function styleProgressBar(message, completionMessage, duration = 3000, onComplete = null, ...onCompleteParams) {
    const progressId = 'txtpb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);

    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    const safeMessage = escapeHtml(message);
    const safeCompletionMessage = completionMessage ? escapeHtml(completionMessage) : null;

    // 样式完全与提供的 html 同步，只在消息 span 增加一个类名以便后续更新内容
    const html = `<div data-text-progress-id="${progressId}" style="
            background: #000000;
            padding: 8px;
            border: 1px solid #3C3C3C;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);
            font-family: Consolas, 'Courier New', monospace;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            border-radius: 2px;
            color: #00FF00;
            display: inline-flex;
            align-items: baseline;
            gap: 0.8em;
            line-height: 1.5;
        ">
            <span class="text-progress-message-${progressId}" style="font-size: 1.6vw; white-space: pre-wrap; flex-shrink: 0;">${safeMessage}</span>
            <span class="text-progress-${progressId}" style="
                font-family: inherit;
                font-size: 1.6vw;
                letter-spacing: 1px;
                white-space: pre;
            ">[${'#'.repeat(20)}] 0%</span>
        </div>`;

    setTimeout(() => {
        const container = document.querySelector(`[data-text-progress-id="${progressId}"]`);
        if (!container) return;
        const textSpan = container.querySelector(`.text-progress-${progressId}`);
        const messageSpan = container.querySelector(`.text-progress-message-${progressId}`);
        if (textSpan && messageSpan) {
            _textProgressManager.register(
                progressId, duration, onComplete, onCompleteParams,
                textSpan, messageSpan, container, safeCompletionMessage
            );
        }
    }, 0);

    return html;
}
async function WaitEnable() {
    if (!window.DTSbyZajucd) {
        console.log(`加载完成`);
        window.DTSbyZajucd = true;
        await waitFor(() => typeof window.Player?.MemberNumber === "number");
        Init();
        const src = `https://raw.githack.com/zajucd/BC_BotGame/refs/heads/main/Script%20-%20DroneTrainingSystem%20-%20FacilityMapExpend.js?v=${Date.now()}`;
        const script = document.createElement("script");
        script.src = src;
        script.type = "text/javascript";
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
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
WaitEnable();