//该脚本不需要加载CommonBotAssets
//使用该脚本时不要加载DTS插件
ServerSocket.on("ChatRoomMessage", function (data) { ChatRoomMessageAdd(data); });

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

ChatRoomMessageAdditionDict["DTSFaci"] = function (sender, msg, data) { ChatRoomMessageDTSFaci(sender, msg, data) };

function ChatRoomMessageDTSFaci(sender, msg, data) {
    if ((data.Type === "Action") && (msg.startsWith("ServerEnter"))) {
        setTimeout(PlayerEnter(sender), 300, sender)
    }
}

function PlayerEnter(sender) {
    ServerSend("ChatRoomChat", { Content: "*该bot现已发布至 https://github.com/zajucd/BC_BotGame ", Type: "Emote", Target: sender.MemberNumber });
    ServerSend("ChatRoomChat", { Content: "*游玩该游戏需要需要插件:https://greasyfork.org/zh-CN/scripts/574984-dronetrainingsystem 且不需要本bot，加载插件后刷新页面即可游玩", Type: "Emote", Target: sender.MemberNumber });
    ServerSend("ChatRoomChat", { Content: "*若触摸自身或任意玩家的脖子后弹出状态界面，即代表插件加载成功，启动电梯则需要通过插件内功能成为无人机或操作员", Type: "Emote", Target: sender.MemberNumber });
    ServerSend("ChatRoomChat", { Content: "*查看bot的bio以获取更多信息，如遇到疑似bug的情况可以通过私聊bot反馈", Type: "Emote", Target: sender.MemberNumber });

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
var map = {
    "Type": "Always",
    "Tiles": "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҲҲҲҴҴҲҲҲҴҴҴҴҴҴҴ¬yyyyyҴҴҴҳҳҳҴҴҴyyyyтyyyҴҴªªªҴҴªªªтyyyyyyyyyyyyҴҴҳ«««ҳҴтyyyyтyyyҴҴªªªҴҴªªªтyyyyyyyyyyyyҴҴ«ҳ«ҳ«ҴКyyyyтyyyҴҴҴҴҴҴҴҴҴҴтyyyyyyyyyyyyҴҴ«««««ҴҴyyyyтyyyyyyyyyyyyyтyyyyyyyyyyyyҴҴ«ҳ«ҳ«ÇÇyyyyтyyyyyyyyyyyyyтyyyyyyyyyyyyҴҴҳ«««ҴҴтyyyyтyyyyyyyyyyyyyтyyyyyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҳ«ҳyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyҳ«ҳ«¬«yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy«¬«ҲҲҴҴҴҲҲҴyyyҴААААҴААААҴААААААҴyyyҴҳҳҳҴҳҳҳªªҴҴҴªªҴyyyҴҴҴҴyyyҴ«««Ҵ«««ªªҴҴҴªªҴyyyҴҴҴҴyyyҴ«¬«Ҵ«¬«¬¬¬¬¬¬¬ҴyyyҴҴҴҴyyyҴ«««Ҵ«««ҲҲҴ¬ҴҴҴҴyyyҴҴҴҴyyyҴҴҴҴҴҴҴҴªªҴ¬¬¬¬ҴyyyҴҴҴҴyyyҴyyyyyyyªªҴ¬¬¬¬ҴyyyҴҴҴЮЮЮЮЮҴҴҴҴҴҳҳҳҳҴyyyҴyyyyyyy¬¬¬¬¬¬¬ÇyyyҴxЮ¬¬¬Юxxxҳ«««ҴyyyÇyyyyyyyҲҲҴ¬ҴҲҲҴyyyҴxЮЮxxxҳ««ҳҳҴyyyҴҳ¬ҳ¬ҳ¬ҳªªҴ¬ҴªªҴyyyҴxxxxxxxxxxxҳ«««ҴyyyҴҴҳҴҳҴҳҴªªҴ¬ҴªªҴyyyҴxxxxxxxxxxxҳ««ҳҳҴyyyҴҴ«Ҵ«Ҵ«Ҵ¬¬¬¬¬¬¬ҴyyyҴxxxxxxxxxxxҳ«««ҴyyyҴҴ«Ҵ«Ҵ«ҴҴҴҴҴҴҴҴҴyyyҴxxxxxxxxxxxҳ««ҳҳҴyyyҴҴҴҴҴҴҴҴҳ«ҳyyyyyyyyҴxxxxxxxxxxxҳ«««Ҵyyyyyyyyҳ«ҳ«¬«yyyyyyyyҴxxxxxxxxxxxҳ««ҳҳҴyyyyyyyy«¬«ҴҴҴҴҴҴҴyyyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴyyyyҴҴҴҴҴҴҴyyyyyyҴyyyyyyyyyyyyyyyyyyyyyyyyyyҴyyyyyyyyyyyyҴyyyyyyyyyyyyyyyyyyyyyyyyyyҴyyyyyyyyyyyyҴҳ«ҳyyyyyyyҳ«ҳyyyyyyyyyҳҳҳҳҴyyyyyyyyyyyyҴ«¬«yyyyyyy«¬«yyyyyyyyyҳ«««ҴyyyyyyyyyyyyҴҳ«ҳyyyyyyyҳ«ҳyyyyyyyyyҳ«««ҴyyyyyyyyyyyyҴyyyyyyyyyyyyyyyyyyyyyyÇ«««ҴyyyyyyҴҴҴҴҴҴҴҴҴҴҴҴЮЮЮЮЮҴҴҴҴҴҴҴҴҴҴyҴҴҴҴҴҴҳҳҳҳҳҳææëëëðëëëææҴxxxxxҴҲҲҲҲҳҳҳҳҴҴҴҴҲҲҲҴ««««««ææëëëðëëëææҴxxxxxҴªªªҲ«««ҳ¬¬¬ҴªªªҴ««««««ææëëëëëëëææҴxxxxxҴªªªҲ«««ҳ¬¬¬ҲªªªҴ««««««ææëëëðëëëææÇxxxxxÇªªªҲ«««ҳ¬¬¬ÇªªªҴ««««««ææëëëðëëëææҴxxxxxҴҲҲҲҳҳҳҳҳҳҳҳҴҲҲҲҴ««««««ææëëëëëëëææҴЮЮЮЮЮҴyyұ«ҳ«ҳ«ҳ«ҳyyyyҴ««««««",
    "Objects": "ҴӄӃҶұҳҹddddddddddddddddddddddddddddddddddddddddddddddddddd೥ddddddd೦೧ddd೦೧dddddddƂƂƂƂƂұdddddddddшшшddŀddddшddddшdddҴƂƂƂƂƂdddddddddddddddddddddиddddddddddddddddddƂƂƂƂƂҲdddddddddžſddddƀƁddd೥ྴddd೥ྴdҵƂƂƂƂƂddddddddddшddྴྴdddddddddddddddddddddddddƂƂƂƂƂҳddddddddddddddddddddddddddddҶƂƂƂƂƂdddddddddddddddŀdddddddddddddddddddddddddddddྴdddddddddddྴdddྴddddddddddddྴddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd೦೧ddd೦೧dddddd௪ddddd௪ddddd௪dddddddd೥ddd೥džſdddžſdddddшżdddddżшdшd࠲żdddddddиdшdиdшddddddddddddddːːdːːdddddddːːdddddddddddddddddddddddddddϼdϼdddddddddϼdddddddddddd೦೧ddd೥ddddddࠖࠖdddddࠖࠖdࠖࠖdd˚˚ddddddྴdddྴdžſdddddddddddddŀdŀdddddddddŀdddddddddddddddddddྴddddྶdddddddྶdྶdddddddddྴdddddddddddddddddddїdтdтdтdјdљddїdddddddddddddd೦೧ddd೦೧dddddddࠖࠖࠖࠖࠖdddddddddddddddddddddžſdddžſddddddшdddddŀdddddјddddddddྴdྴdྴddddddddddddddddˤˤˤdżdddddddddddddddddddddddddddddddddddˆˆˆdddddddљddddddddшdшdшdddddddddddddddddddddddddddddddddddddddddddddddddddddƂƂddddd̪dddddњddddddddddddddddddddddddddžſdddddddddddddddddddddddddddddddྴdddddddddddddddྶྐྵdྸdddddddddྴdddddƂƂƂƂƂҷddddddddddddddddddddddddddddҺƂƂƂƂƂddddddddddddddddddddddddddddddddddddddddƂƂƂƂƂҸddddddddddddddddddddddddddddһƂƂƂƂƂddddddddddddddddddddddddddddddddddddddddƂƂƂƂƂҹdddddddddddddddddddddddྸddddҼƂƂƂƂƂddddddddddddddddddddddddddddddddddddddddೋdddddddddೋdddddddddddddddddddddddddddddnsdddddddddddиdddddddddddddྴddddddшшшшшшddddddddddddƀƁddddddddddddddddddddшшшшшшdddddddddddྴdddddྷdddddddddddྐྵddddшшшшшшddddddddddddddddddddddddddddddddddшшшшшшdddddddddddd࠲d࠲d࠲dddddddddddddddddшшшшшшddddddddddddddddddddddddddddddddddшшшшшш"
}
async function InitMapFaci() {
    ChatRoomData.Name = "DroneFacility";
    ChatRoomData.Description = "[Script]无人机训练设施   需要加载插件，地址：https://greasyfork.org/zh-CN/scripts/574984-dronetrainingsystem"
    ChatRoomData.Limit = 20;
    ChatRoomData.Access = ['All'];
    ChatRoomData.Visibility = ['All'];
    ChatRoomData.MapData = Object.assign({}, map);
    ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: ChatRoomGetSettings(ChatRoomData), Action: "Update" });
    //for (var char of ChatRoomCharacter) {
    //    ChatRoomMapViewTeleport(char.MemberNumber, { X: 1, Y: 37 });
    //    await sleep(200);
    //}
    //await sleep(200);
    //MovePlayer({ X: 13, Y: 34 })
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

function RemoveRestrains(sender, refresh = true) {
    RemoveRestrainsWithAssetGroup(sender, AssetGroup, refresh);
    }
function RemoveClothes(sender, refresh = true, removeUnderwear = true, removeCosplay = false) {
    CharacterNaked(sender)
    //InventoryRemove(sender, "Cloth")
    //InventoryRemove(sender, "ClothAccessory")
    //InventoryRemove(sender, "Necklace")
    //InventoryRemove(sender, "Suit")
    //InventoryRemove(sender, "ClothLower")
    //InventoryRemove(sender, "SuitLower")
    //InventoryRemove(sender, "AnkletRight")
    //InventoryRemove(sender, "AnkletLeft")
    //InventoryRemove(sender, "Shoes")
    //InventoryRemove(sender, "Hat")
    //InventoryRemove(sender, "Gloves")
    //InventoryRemove(sender, "HandAccessoryLeft")
    //InventoryRemove(sender, "HandAccessoryRight")
    //InventoryRemove(sender, "Bracelet")
    //InventoryRemove(sender, "Glasses")
    //InventoryRemove(sender, "Jewelry")
    //InventoryRemove(sender, "Mask")
    //if (removeUnderwear) {
    //    InventoryRemove(sender, "Bra")
    //    InventoryRemove(sender, "Corset")
    //    InventoryRemove(sender, "Panties")
    //    InventoryRemove(sender, "Socks")
    //    InventoryRemove(sender, "SocksRight")
    //    InventoryRemove(sender, "SocksLeft")
    //    InventoryRemove(sender, "Garters")
    //}
    //if (removeCosplay) {
    //    InventoryRemove(sender, "HairAccessory1")
    //    InventoryRemove(sender, "HairAccessory2")
    //    InventoryRemove(sender, "HairAccessory3")
    //    InventoryRemove(sender, "TailStraps")
    //    InventoryRemove(sender, "Wings")

    //}
    if (refresh == true) {
        CharacterLoadEffect(sender);
        ChatRoomCharacterUpdate(sender);
    }

}
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
function InitBot() {
    RemoveClothes(Player, false);
    RemoveRestrains(Player, false)
    WearEquips(Player, BasicDroneBinds, true, true, 1000);

    Player.Description = `
BOT game：DroneFacility
作者: zajucd(7092)
原型: https://github.com/keykey5/BC-BOT-repository
发布地址: https://github.com/zajucd/BC_BotGame

游玩需要插件: https://greasyfork.org/zh-CN/scripts/574984-dronetrainingsystem加载插件后刷新页面即可游玩
触摸自身或任意玩家的脖子后弹出状态界面则为成功加载

已知该插件会与LSCG插件的诅咒功能产生冲突，若已加载了LSCG插件则需谨慎使用

设施内功能介绍:
电梯（地图入口或设施南侧）: 需要注册成为无人机或操作员后可进入
仓库区域（设施四角）：可拿起或放下货物，用于任务
工作区域（设施西侧）：可接取任务或处理杂物获取配额点数
改造区域（设施北侧偏西）：无人机可在此消耗配额点数进行改造，解锁更多功能
商店区域（设施北侧偏东）：可在此消耗配额点数购买可使用道具
训练/教育区域（设施东侧）：无人机可接收训练或教育，解锁更多功能
操作员休息室（设施南侧）：仅操作员可进入，内有哈基米，在内部可呼叫无人机表演（开发中）
私人房间（操作员休息室内）：仅操作员可进入，在内部可呼叫无人机侍寝
无人机待机区域（设施南侧偏东）：开发中
充电桩（设施内角落）：无人机可在此充电，若电量耗尽则无法进行任何活动只能等待救援

改造说明:
完成五个身体部位改造与当前等级的训练和教育后可解锁升级，升级后可以解锁更多改造、训练和教育

`
    // end of description
    ServerSend("AccountUpdate", { Description: Player.Description });
    ChatRoomCharacterUpdate(Player);

    InitMapFaci();
}

InitBot();
