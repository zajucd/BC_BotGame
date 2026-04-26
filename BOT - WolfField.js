//通讯兵
//无视野限制，低移速，
//技能：查找可用道具方位与任务目标方位 20电，向队友发送消息 5电
//侦察兵
//视野限制，高移速
//技能：设置传送信标，使用耗10电，部署耗20电
//搬运兵
//视野限制，低移速，最多可拿3个物品
//技能：60s内高移速，且可拿5个物品 耗30电
//护卫兵
//视野限制，低移速，代替5*5内队友受伤，10电代替一次受伤
//技能：破门 耗20电


//护送
//每送回一定数量能量基地车向前移动一阶段，定时刷新地雷，一定时间基地车不移动高频刷新陷阱，地图道具刷新能量
//守卫
//守卫基地车一段时间，定时刷新移动地雷，移动陷阱移动至基地车损伤耐久度，地图道具刷新护盾
//突破
//送回能量至基地车生成炸弹，搬运炸弹至破坏目标，重复数次，定时刷新地雷，每次爆破刷新大量地雷并击退玩家回基地车，地图道具刷新能量
const cloth = [

    {
        "Item": "CustomizableFluffyEars1",
        "AssetGroup": "HairAccessory2",
        "Color": [
            "#FAFAFA",
            "#cccccc",
            "#cccccc",
            "#AFAFAF",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default",
            "Default"
        ],
        "Property": {
            "TypeRecord": {
                "s1": 0,
                "s2": 0,
                "s3": 0,
                "s4": 0,
                "b1": 0,
                "b2": 0,
                "r1": 0,
                "r2": 0,
                "r3": 0,
                "r4": 0,
                "br1": 0,
                "br2": 0,
                "t1": 0
            },
        }
    },
    {
        "Item": "WolfTailStrap2",
        "AssetGroup": "TailStraps",
        "Color": [
            "#Default"
        ],
    },
    {
        "Item": "LatexCatsuit",
        "AssetGroup": "Suit",
        "Color": [
            "#52536E",
            "Default",
            "Default",
            "Default"
        ],
        "TypeRecord": {
            "typed": 0
        },
        "Text": "WOLF",
        "Text2": "#0000",
        "Text3": ""
    },
    {
        "Item": "LatexCatsuit",
        "AssetGroup": "SuitLower",
        "Color": [
            "#52536E",
            "Default",
            "Default"
        ],
        "TypeRecord": {
            "typed": 0
        }
    },
    {
        "Item": "FootlessSocks1",
        "AssetGroup": "Socks",
        "Color": [
            "#06008A"
        ]
    },
    {
        "Item": "SportSwimsuit",
        "AssetGroup": "Bra",
        "Color": [
            "#011e54",
            "#0067AD",
            "#FFFFFF"
        ],
        "TypeRecord": {
            "s": 0
        },
        "OverridePriority": 16
    },
    {
        "Item": "CombatBoots",
        "AssetGroup": "Shoes",
        "Color": [
            "#202020",
            "#202020",
            "#6E693D",
            "#092D69"
        ]
    },
    
]
const tailOption = [
    "WolfTailStrap3",
    "WolfTailStrap2",
    "PuppyTailStrap",
    "LargeBushyTail",
    "PuppyTailStrap1"
]

const equip = [
    {
        "Item": "FuturisticMuzzle",
        "AssetGroup": "ItemMouth",
        "Color": [
            "Default",
            "Default",
            "Default",
            "Default"
        ],
        "TypeRecord": {
            "n": 1,
            "h": 1,
            "s": 0
        }
    },
    {
        "Item": "LatexMuzzleMask",
        "AssetGroup": "ItemMouth2",
        "Color": [
            "#141414",
            "Default",
            "#141414",
            "Default",
            "#262626",
            "#8B8B8B"
        ],
        "TypeRecord": {
            "typed": 2
        }
    },
    {
        "Item": "ShinyArmbinder",
        "AssetGroup": "ItemArms",
        "Color": [
            "Default",
            "Default",
            "Default",
            "Default"
        ],
        "TypeRecord": {
            "typed": 1
        } 
    },
    {
        "Item": "LeatherLegCuffs",
        "AssetGroup": "ItemLegs",
        "Color": [
            "Default",
            "#2E2E2E",
            "Default"
        ],
        "TypeRecord": {
            "typed": 2
        } 
    },
    {
        "Item": "InteractiveVisor",
        "AssetGroup": "ItemHead",
        "Color":
            "Default",
        "TypeRecord": {
            "typed": 2
        } 
    },
    {
        "Item": "PostureCollar",
        "AssetGroup": "ItemNeck",
        "Color": [
            "#000000",
            "Default",
            "Default",
            "Default"
        ],
    },
    {
        "Item": "ElectronicTag",
        "AssetGroup": "ItemNeckAccessories",
        "Color": [
            "#FFFFFF",
            "Default",
            "#000000"
        ],
        "Text": ""
    },
    {
        "Item": "LeatherStrapBra1",
        "AssetGroup": "ItemTorso",
        "Color": [
            "Default"
        ],
    },
    {
        "Item": "BallChain",
        "AssetGroup": "ItemFeet",
        "Color": [
            "Default"
        ],
    }
]
function GetClothWithPlayer(sender) {
    let result = Object.assign([], cloth);
    let hair = InventoryGet(sender, "HairFront");
    if (hair != null) {
        let hairColor = "";
        if (Array.isArray(hair.Color)) {
            hairColor = hair.Color[0];
        }
        else {
            hairColor = hair.Color;
        }
        result[0].Color[1] = hairColor;
        result[0].Color[2] = hairColor;
        result[1].Item = tailOption[Math.floor(Math.random() * tailOption.length)]
        result[1].Color[0] = hairColor;
    }
    return result;
}

const maps = [
    //雪地
    {
        "Type": "Always",
        "Tiles": "ðððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððАААААААëëëëëëëëëëëëëëëëëëëëëëëëëëëððððððАðððððАëëëëëëëëëëëëëëëëëëëëëëëëëëëððððððАðððððАëëëðððëëëðððëëëðððëëëëðððëëððððððАðððððАëëëëëëëëëëëëëëëëëëëëëëëëðëëððððððАААААААëëëëëëëëëëëëëëëëëëëëëëëëðëëðððððððððððððððððððððððððððððððððððëëëëëðððððððððððððððððððððððððððððððððððëëëëëðððððððððððððððððððððððððððððððððððëëëëëðððððððððððððððððððððððððððððððððððëëðëëððððððððððððððððАААААААððððððððððððëëðëëððððððððððððððððАðððððАððððððððððððëëðëëððððððððððððððððАðððððАððððððððАðððëëëëëððððððððððððððððАðððððАððððððððððððëëëëëððððððððððððððððАААААААððððððððððððëëëëëðððððððððððððððððððððððððððððððððððëëðëëðððððððððððððððððððððððððððððððððððëëðëëðððððððððððððððððððððððððððððððððððëëðëëðððððððððððððððððððððððððððððððððððëëëëëðððððððððððððððððððððððððððððððððððëëëëëðððððððððððððððððððððððððððððððððððëëëëëðððððððððððððððððððððððððððððððððððëëðëëëëëëëëëëëëëëëððððððððððððððððððððððëëðëëëëëëëëëëëëëëëðððððððððАААððððððððððëëðððëëëðððëëëðððëðððððððððАððððððððððððëëëëëëëëëëëëëëëëëëðððððððððАððððððððððððëëëëëëëëëëëëëëëëëëðððððððððАððððАððððððððððððððððððððððððððððððððððААААААðððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððААААААððððððððððððððððððððððððððððððððððАððððАððððððððððððððððððððððððððððððððððАððððАððððððððððððððððððððððððððððððððððАððððАððððððððððððððððððððððððððððððððððААААААðððððððððððððАðððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððððð",
        "Objects": "ddddddddddddddߕdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddߕd߯ddddddddddddddddddddddddddddddddddddddd߯dddྯddddddddddddddddddddddddddddddddddd߯ddddddddddddddddddddddddddddddddddddddd߯ddddddddddddddddddddddddddddddddddddddd߯ߕddddddddddddddddࠠdddd߯߯߯߯߯߯ddddddddddd߯dddddddddddddddddddddd߯dddd߯ddddddddddd߯dddddddddddddddddddddd߯dddd߯ddddddddddd߯dddߕdddddddddddddddddd߯dddddddddddddddd߯dddddddddddddddddddddd߯߯߯ྯ߯߯ddddddddddd߯ddddddddddddddddddddddddddddddddddddddd߯dddddddddddddྯddddddddddddddddddddddddd߯ddddddddddddddddddddddddddddddddddddddd߯dddddddddddddddddddddddddddddddddddddddddddddddddddd߯߯߯߯߯߯߯߯߯߯߯߯߯߯߯߯߯dddddddddddddddddddߕddddddddddddddddddddddddddddddߕdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddߕddddddddddddddddddddddddddddddddddddddddddddddࠠddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddྯdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddߕddddddddddddddddddddddddddddddddddddddddddddddddddddߕdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd߯߯߯߯߯߯߯dddddddddddddddߕddddddddddࠌdࠌdddd߯ddddd߯dddߕdddddddddddddddddddddddࠌddddd߯ddddd߯ddddddddddddddddddddddddddࠌdࠌdddd߯ddddd߯dddddddddߕddddddddddྯdddddddddddd߯߯߯ྯ߯߯߯dddddddddddddߕddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
    },
    //城市
    {
        "Type": "Always",
        "Tiles": "nnnnnnnЮxxЮxxxЮxxxxxxxxЮxxxЮ    ЮnnnnnnnnnnnЮxxЮxxxЮxxxxxxxxЮxxxЮ    ЮnnnnnnnnnnnЮxxЮxxxЮxxxxxxxxЮxxxЮ    ЮnnnnnnnnnnnЮиииxxЮxxxЮxxxxxxxxЮxxxЮ    ЮnnnnnnnnnnnЮxxЮxxxЮЮЮxxxxЮЮЮxxxЮ   ЮЮnnnnnnnnnnnЮxxЮxxxxxxxxxxxxxxxxЮxxxxЮnnnnnnnnnnnЮxxЮxxxxxxxxxxxxxxxxЮxxxxЮnnnnnnnnnnnЮиииxxЮxxxxxxxxxxxxxxxxЮxxxxЮnnnnnnnnnnnЮxxЮxxxxxxxxxxxxxxxxЮxxxxЮnnnnnnnnnnnЮxxЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮxxxxЮnnnnnnnnnnnЮxxxxxxЮxxxxxxxxЮxxxxxxxxЮnnnnnnnnnnnЮиииxxxxxxЮxxxxxxxxЮxxxxxxxxЮnnnnnnnnnnnЮxxxxxxЮxxxxxxxxЮxxxxxxxxЮnnnnnnnnnnnЮxxЮЮЮЮЮxxxxxxxxЮЮЮЮЮxxxЮnnnnnnnnnnnЮxxЮxxxxxxxxxxxxxxxxЮxxЮnnnnnnnnnnnЮиииxxЮxxxxxxxxxxxxxxxxЮxЮnnnnnnnnnnnЮxxЮxxxxxxxxxxxxxxxxЮЮnnnnnnnnnnnЮxxЮxxxxxxxxxxxxxxxxЮЮnnnnnnnnnnnЮxxЮxxxxxxxxxxxxxxxxЮЮnnnnnnnnnnnЮиииxxЮxxxxxxxxxxxxxxxxЮxЮnnnnnnnnnnnЮxxЮxxxxxxxxxxxxxxxxЮxxЮnnnnnnnnnnnЮxxЮxxxxxxxxxxxxxxxxЮxxxЮnnnnnnnnnnnЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëðððëëëðððëëëðððëëëðððëëëðððëëëðððëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëënnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnАААААnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnАnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
        "Objects": "ddddddddddd߮ddߚdߚdߚddddddߚdߚdddddĎddddddddddddddddddddddddddddddddddddddчĎddddddddddddddddd߮ddddddddddddddddddddddddddddddddddddddd߮ddddddddddddddddddddddddddddddddddddddd߮dddddddddddddddddddࠖࠖࠖྯdddddddddddddddddddddddddddddddddddddddddddddddddddddddd߮ddddddddddddddddddddddddddddddddddddddd߮ddddddddddddddddddddddddddddddddddddddd߮dddddddddddddddddddddddddddddddddddddddddddddddddྴྴdddddddddddddddddddddddddddd߮ddddddddddddddddddddddddddddddddddddddd߮ddddddddddddddddddddddddddddddddddddddd߮ddddddddddddddddddddddddddddddddddddddd߮dddྯddddddddddddྴdddddddddddddddddddddd߮dddddddddÒÒddddddddddddddddddddddddddྯd߮ddddddddÒddÒddddddddddddddddddddddddddd߮ddddddddÒddÒdddddddddddddddddddddddddddddddddddddÒÒddddddddddЮddddddddddddddddd߮ddŀddddddddddddddŀddddddddddddddddddddd߮ddddddddddddddddddddddddddddddddddddddd߮ddddddddddddddddddddddddddddddddddddddd߮dddddddddddddddddddddddddddddddddddddddddddddddddྴྴddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd߯߯߯߯߯߯߯߯߯߯߯߯߯߯dddddddddddddddddddddddddddࠠࠠddࠠd߯ddddddddddddddddddddddddɄɄɄdddddddddddd߯dddddddddddddddddddddddddddddddddࠠdࠠdddྯddddddddddddddddddddddddddddddddddddddd߯dddddddddddddddddddddddddddddddddddࠠࠠdd߯ddddddddddddddddddddddd¥¥¥¥¥dddddࠠddddd߯dddddddddddddddddddddddddddddddd"
    },
    //草地
    {
        "Type": "Always",
        "Tiles": "ÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëÒÒÒÒÒëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëÒÒÒÒÒëëðððëëëðððëëëðððëëëðððëëëðððëëððëëÒÒÒÒÒëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëðëëÒÒÒÒÒëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚÒÒÒÒÒÒÒÒÒÒëëëëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚÒÒÒÒÒÒÒÒÒÒëëðëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚϲϲϲϲϲϲϲϲÒÒëëðëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚϲÒÒÒÒÒÒϲÒÒëëðëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚϲÒϲϲϲϲÒϲÒÒëëëëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚϲÒϲÒÒÒÒϲÒÒëëëëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚϲÒϲÒÒÒÒϲÒÒëëëëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚϲÒϲÒÒÒÒϲÒÒëëðëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚߚϲÒϲϲϲϲϲϲÒÒëëðëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚߚϲÒÒÒÒÒÒÒÒÒëëðëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚÒϲϲϲϲϲϲϲϲÒÒëëëëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚߚÒÒÒÒÒÒÒÒÒÒÒëëëëëÒÒÒÒÒÒÒÒÒÒÒϨÒÒÒÒÒÒÒÒߚߚߚߚÒÒÒÒÒÒÒÒÒÒÒëëëëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚߚÒÒÒÒÒÒÒÒÒÒÒëëðëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚߚÒÒÒÒÒÒÒÒÒÒÒëëðëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚߚÒÒÒÒÒÒÒÒÒÒÒëëðëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚߚÒÒÒÒÒÒÒÒÒÒÒëëëëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒߚߚߚߚÒÒÒÒÒÒÒÒÒÒÒÒëëëëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒϲϲϲϲϲϲϲߚߚÒÒÒÒÒÒÒÒÒÒÒÒëëëëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒϲÒÒÒÒߚϲߚߚÒÒÒÒÒÒÒÒÒÒÒÒëëðëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒϲÒÒÒߚߚϲߚߚÒÒÒÒÒÒÒÒÒÒÒÒëëðëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒϲÒÒÒߚߚϲߚߚÒÒÒÒÒÒÒÒÒÒÒÒëëðëëÒÒÒÒÒÒÒÒÒÒÒÒÒÒϲÒÒÒߚߚϲߚߚÒÒÒÒÒÒÒÒÒÒÒÒëëëëëÒÒÒÒÒϲϲߚߚߚߚߚߚÒϲϲϲϲϲϲϲߚߚÒÒÒÒÒÒÒÒÒÒÒÒëëëëëÒÒÒÒÒÒϲߚߚߚߚߚߚÒÒÒÒÒߚߚߚߚÒÒÒߚߚߚߚߚߚÒëëëëëÒÒÒÒÒÒϲߚߚߚߚߚߚÒÒÒÒÒߚߚߚߚÒÒÒߚÒÒÒÒÒÒÒߚÒëëðëëÒÒÒÒÒϲϲߚߚߚߚߚߚÒÒÒÒߚߚߚߚÒÒÒÒߚÒÒÒÒÒÒÒߚÒëëðëëÒÒÒÒÒ××××ߚߚߚߚÒÒÒÒߚߚߚߚÒÒÒÒߚÒÒÒÒÒÒÒߚÒëëðëëÒÒÒÒÒ××××ߚߚߚߚÒÒÒÒߚߚߚߚÒÒÒÒߚÒÒÒÒÒÒÒߚÒëëëëëÒÒÒÒÒ××××ߚߚߚߚÒÒÒÒߚߚߚߚÒÒÒÒߚÒÒÒÒÒÒÒߚÒëëëëëÒÒÒÒÒ××××ߚߚߚߚÒÒÒÒߚߚߚߚÒÒÒÒߚÒÒÒÒÒÒÒߚÒëëëëëÒÒÒÒÒ",
        "Objects": "ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddɶɶddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddʊɢʊddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddࠂࠂࠂࠂࠂࠂddddddddddddddddddddddddddddddddddࠂddddࠂdddddddddddddddddྯddddddddddddddddࠂddddࠂddddddddddddddddddddddddddddddddddࠂddddࠂddddddddddddddddddddddddddddddddddࠂddddࠂddddddddddddddddddddddddddddddddddࠂࠂࠂྯࠂࠂddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddȰdddddddddddddddddddddddddddddddddddddȺddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddྯdddddddddddྯdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddྴddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
    }
]

class PlayerInfo {
    constructor(sender) {
        this.MemberNumber = sender.MemberNumber;
        this.class = "";
        this.hp = 3;
        this.mp = 100;
        this.items = [];
    }
    get Pos() {
        var result = this.Character();
        if (result != undefined) {
            return ChatRoomGetCharacter(this.MemberNumber).MapData.Pos;
        }
        return { X: 0, Y: 0 };
    }
    get Character() {
        return ChatRoomGetCharacter(this.MemberNumber);
    }
    WearBase() {
        let Character = this.Character();
        RemoveClothes(Character, false);
        RemoveRestrains(Character, false);
        WearEquips(Character, cloth, false);
        WearEquips(Character, GetClothWithPlayer(Character), false);
        CharacterLoadEffect(Character);
        ChatRoomCharacterUpdate(Character);
    }
    WearClass() {

    }
}

{
    "Type": "Always",
        "Tiles": "ииииииииииddddЮЮЮЮЮЮЮЮЮЮddЮЮЮЮЮЮЮЮЮЮddddииииddddЮ        ЮddЮ Ю ЮЮ Ю ЮddddииииddddЮ        ЮddЮ Ю ЮЮ т ЮddddиииииииииdЮт        ЮddЮ    ЮddddииddЮ        ЮddЮЮ Ю  Ю ЮЮddddииddЮ        ЮddЮЮ Ю  Ю ЮЮddddиииииииииddЮ        ЮddЮ    ЮddddииииddddЮ        ЮddЮ Ю ЮЮ Ю ЮddddииииddddЮ        ЮddЮ Ю ЮЮ Ю ЮddddииииииииииddddтЮЮЮЮЮЮЮЮЮddЮЮЮЮЮЮЮЮЮЮddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddЮЮЮЮЮЮЮЮЮЮddddККККККККККККККККККККККddddЮ    ЮddddКúúúúúúúúúúúúúúúúúúúúКddddЮ    ЮddddКúКККККúККККúККККúККúКddddЮ    ЮddddКúúККККúККККúККККúККúКddddЮ    ЮddddКúККККККККККККККККККúКddddЮ    ЮddddКúККККККККККККККККККúКddddЮ    ЮddddКúККúККККúККККúККККúúКddddЮ    ЮddddКúККúККККúККККúКККККúКddddЮ    ЮddddКúúúúúúúúúúúúúúúúúúúúКddddЮЮЮЮЮЮЮЮЮЮddddККККККККККККККККККККККdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddтттттттттттттттdddddddddddddddddddddddddт     ЮЮЮЮЮЮЮЮтdddddddddddddddddddddddddт     ЮЮ    ЮЮтdddddddddddddddddddddddddт    ЮЮЮ ЮЮ ЮЮтdddddddddddddddddddddddddтЮЮЮ      Ю ЮЮтdddddddddddddddddddddddddтЮЮЮ        ЮЮтdddddddddddddddddddddddddтЮЮЮ  ЮЮ  ЮЮЮЮтdddddddddddddddddddddddddтЮЮЮ   Ю  ЮтdddddddddddddddddddddddddтЮ     Ю  ЮтdddddddddddddddddddddddddтЮ Ю   Ю  Ю   тЮЮЮЮЮЮЮтЮЮЮЮЮЮЮЮЮЮЮЮЮddddтЮ Ю Ю Ю  Ю   тЮЮЮ ЮтЮЮ    ЮЮddddтЮ     Ю ЮЮЮ  тЮЮЮ Ю ЮЮЮЮ Ю Ю Ю Ю ЮЮddddтЮЮЮЮЮЮЮ      тЮ       Ю           ЮddddтЮЮЮЮЮЮЮЮЮЮЮЮЮтЮ       Ю           Юddddт     ddd     тЮ       ЮЮЮ         ЮddddтттттттттттттттЮ         Ю         Юddddddddddddddddddd",
            "Objects": "ddddddddddddddddddddddddddddddddddddddddddЮddЮddЮddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddྵࠖdྵࠖdྵࠖddddddddࠖࠖࠖࠖddddddddddddddddddddїddјddљdddddddddࠖddࠖdddddddࠖdࠖࠖdࠖdddddddddddddddddddddddࠖddࠖdddddddࠖdࠖࠖdࠖdddddddྶࠖdྶࠖdྶࠖddddddddࠖࠖࠖࠖdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddЮddЮddЮddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd߮dddd߮dddd߮dddd߮ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd߮dddddddddddddddddd߮dddddddddddddddddddd߮dddddddddddddddddd߮ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd߮dddd߮dddd߮dddd߮ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddࠖdddddиࠖиࠖиࠖиࠖиdddddddddddddddddddddddddddddddࠖdࠖdࠖdࠖdࠖdddddddddddddddddddddddddddddd¤dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddndsdddྯdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
}

