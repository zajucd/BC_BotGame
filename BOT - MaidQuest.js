activateStoryRoom();

//这部分是给bot穿的装备，不需要可以注释掉
WearMiadCloth(Player,null);
WearMiadSuit(Player,null);
InventoryWear(Player, "DroneMask", "ItemHead", "Default",80);
InventoryGet(Player, "ItemHead").Property = {
	"Text": "",
	"Type": "m0e0p0g0s1h0j0",
	"Difficulty": 0,
	"Block": [
		"ItemNose",
		"ItemMouth",
		"ItemMouth2",
		"ItemMouth3"
	],
	"Effect": [
		"BlockMouth",
		"BlindLight",
		""
	],
	"Hide": [
		"Glasses",
		"Blush",
		"ItemMouth",
		"ItemMouth2",
		"ItemMouth3"
	],
	"HideItem": [
		"HatFacePaint",
		"MaskFacePaint",
		"ClothAccessoryFacePaint"
	],
	"AllowActivity": [],
	"Attribute": []
};
InventoryWear(Player, "TheDisplayFrame", "ItemDevices", "Default",80);

Player.Description = `
BOT game：MaidQuest
作者: zajucd(7092)
原型: https://github.com/keykey5/BC-BOT-repository
发布地址: https://github.com/zajucd/BC_BotGame

关于某个地方密码的提示：
某种安全性奇低的密码




下面是各结局的提示：










A，B：在女仆长下班后问问她蓝宝石的事
女仆长下班后在游戏室，再提示就不礼貌了

A：羔羊是不是指那个长羊角的
B：羔羊是不是指那个泡在水里的

C：按部就班完成任务
D：到九点 或是没有任何防护去某个地方
E：润
F：闯了祸
G：自缚


`; // end of description
ServerSend("AccountUpdate", { Description: Player.Description });
ChatRoomCharacterUpdate(Player);

ChatRoomMessageAdditionDict["CursedRoom"] = function(sender, msg, data) {ChatRoomMessageCursedRoom(sender, msg, data)}

function activateStoryRoom() {
	resetRoom();
	storyActive = true
}

function deactivateStoryRoom() {
	resetRoom();
	storyActive = false
}




function ChatRoomMessageCursedRoom(sender, msg, data) {
	if (storyActive) {
		if ((data.Type === "Action") && (msg.startsWith("ServerEnter"))) {
			setTimeout(storyStart(sender), 300, sender)
		} else if ((msg.startsWith("ServerLeave")) || (msg.startsWith("ServerDisconnect")) || (msg.startsWith("ServerBan")) || (msg.startsWith("ServerKick"))) {
			resetRoom()
		}
		if (data.Type != null) {
			if ((data.Type === "Emote") || (data.Type === "Action") || (data.Type === "Hidden" && msg.startsWith("ChatRoomBot"))) {
					commandHandler(sender,msg);
			}

		}
	}
}

function resetRoom() {
	// check if all imprisoned people are in room. Sometimes they are not. Don't know why.
	isGameOver = false;

	timePast = 0;
	playerPosition = "maid room";
	PlayerEquip = [];
	ItemInPlayer = [];
	ItemInBox = [];
	WorkListText = ["工作1：打扫会客厅", "工作2：打扫10~19号客房", "工作3：打扫屋顶", "工作4：清点库房货物" , "工作5：服侍主人"];
	SleepEquipText = ["侍寝项圈","侍寝腿铐","侍寝贞操带","侍寝手铐"];
	isWorkFinish = [false, false, false, false, false];
	work2Pros = 0;

	isNightStart = false;
	positonWent = [];
	timepastmult = 1;

	//大厅
	isVaseActived = false;
	isVaseWeaned = false;

	//女仆宿舍
	isEatlunch = false;

	//客房
	gemCharge = 0;

	//游戏室
	removeCount = 0;

	isFindPrison = false;



	// Update room 在这里修改房间信息
	var UpdatedRoom = {
		Name: "Escape Game Vol2",
		Description: "[BOT]密室逃生第二部 恶灵洋馆",
		Background: "Pandora/Second/Entrance",
		Limit: (2).toString(),
		Admin: ChatRoomData.Admin,
		Ban: ChatRoomData.Ban,
		Private: false,
		Locked: false
	};
	ServerSend("ChatRoomAdmin", {MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update"});
	ChatAdminMessage = "UpdatingRoom";

}

function storyStart(sender) {
	resetRoom();

	ServerSend("ChatRoomChat", { Content: "*该bot现已发布至 https://github.com/zajucd/BC_BotGame ", Type: "Emote", Target: sender.MemberNumber} );
	// check if all imprisoned people are in room. Sometimes they are not. Don't know why.
	if (isExposed(sender) || sender.IsRestrained() || sender.IsChaste() || sender.IsShackled() || sender.IsBlind() || !sender.CanTalk() || sender.IsEnclose() || sender.IsMounted() || sender.IsEgged() || sender.IsDeaf()) {
		ServerSend("ChatRoomChat", {
			Content: "*[需要 穿着衣服且不被束缚 才能游玩. 二十秒后踢出房间. 想玩的话脱掉装备后再来哦.]",
			Type: "Emote",
			Target: sender.MemberNumber
		});
		ServerSend("ChatRoomChat", {
			Content: "*对了，因为踢出操作是根据玩家编号来的，所以如果快速退出再进入的话BOT是会还记得踢出操作的.",
			Type: "Emote",
			Target: sender.MemberNumber
		});
		setTimeout(function (sender) {
			ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
		}, 20 * 1000, sender)
		//imprisonedList.push(sender.MemberNumber)
	} else if (sender.ItemPermission > 2) {
		ServerSend("ChatRoomChat", {
			Content: "*[需要调低 玩家权限 才能游玩. 二十秒后踢出房间. 想玩的话修改权限后再来哦.设置位置在角色档案内选择第三项后选择第一项.]",
			Type: "Emote",
			Target: sender.MemberNumber
		});
		ServerSend("ChatRoomChat", {
			Content: "*对了，因为踢出操作是根据玩家编号来的，所以如果快速退出再进入的话BOT是会还记得踢出操作的.",
			Type: "Emote",
			Target: sender.MemberNumber
		});
		setTimeout(function (sender) {
			ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
		}, 20 * 1000, sender)
		// setTimeout(resetRoom(), 20*1000, sender)

		//imprisonedList.push(sender.MemberNumber)
	}  else {
		ServerSend("ChatRoomChat", {
			Content: "*This is a Chinese room,make sure you can read Chinese before start.",
			Type: "Emote",
			Target: sender.MemberNumber
		});
		ServerSend("ChatRoomChat", {
			Content: "*你打算在假期挣点外快，于是找到了一个在郊区的别墅正在招募临时女仆的公告，你决定去(accept)应聘.[NOTE:通过发送 *单词 来行动（例：*accept）,游戏中可以使用 *think 来显示可以进行的行动.]",
			Type: "Emote",
			Target: sender.MemberNumber
		});

	}
}

function commandHandler(sender, msg) {
	if (msg.toLowerCase().includes("exit")){
		setTimeout(function (sender) {
			ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
		}, 2 * 1000, sender)
	}
	if(sender.MemberNumber !== Player.MemberNumber){
		ServerSend("ChatRoomChat", { Content: "* ", Type: "Emote", Target: sender.MemberNumber} );
		if(!isGameOver){
			if (msg.toLowerCase().includes("accept")) {
				//ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 探索房间.", Type: "Emote"} );
				GameStart(sender, msg);
			}
			else if (msg.toLowerCase().includes("think")){
				Think(sender, msg);
			}
			else if (msg.toLowerCase().includes("work")){
				WorkList(sender, msg);
			}
			else if (msg.toLowerCase().includes("map")){
				OpenMap(sender, msg);
			}
			else if (msg.toLowerCase().includes("time")){
				Time(sender, msg);
			}
			else if (msg.toLowerCase().includes("check")){
				Check(sender, msg);
			}
			else if (msg.toLowerCase().includes("goto")){
				Goto(sender, msg);
			}
			else{
				Movement(sender, msg);
			}
		}
	}



}

function TimeGo(sender, msg, time) {
	timePast += time * timepastmult;
	TimeEvent(sender, msg);
}
//随时间进行
function TimeEvent(sender, msg) {
	if(isNightStart === false && timePast >=540){

		var UpdatedRoom = {
			Name: ChatRoomData.Name,
			Description: ChatRoomData.Description,
			Background: "Pandora/Underground/Cell0",
			Limit: (2).toString(),
			Admin: ChatRoomData.Admin,
			Ban: ChatRoomData.Ban,
			Private: false,
			Locked: true
		};


		ServerSend("ChatRoomAdmin", {MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update"});
		ChatAdminMessage = "UpdatingRoom";

		isNightStart = true;
		ServerSend("ChatRoomChat", { Content: "*入夜了，工作比你预想的还要耗时.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*一阵寒意从脚底窜到头顶，馆内刹那间变得阴森起来.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*地下室发出一声巨响，随着从那里传来脚步声.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*直觉告诉你那个声音是冲你来的.", Type: "Emote", Target: sender.MemberNumber} );

		ServerSend("ChatRoomChat", { Content: "*[馆内的时间流逝变得扭曲，从现在起前，移动至进入过的会导致时间加速].", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*[若是不能在21点前摆脱祂的话].", Type: "Emote", Target: sender.MemberNumber} );

		if (removeCount >0){
			ServerSend("ChatRoomChat", { Content: "*是时候付出后悔的代价了.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*[时间流速增加了].", Type: "Emote", Target: sender.MemberNumber} );
			timepastmult += removeCount;
		}
	}
	else if (timePast >=540 && timePast<720 ){
		ServerSend("ChatRoomChat", { Content: "*现在是" + (9 + (timePast-timePast%60)/60) +"点" + timePast%60 +"分", Type: "Emote", Target: sender.MemberNumber} );
	}
	else if (timePast>=720){
		ToEnd(sender, msg,4);
	}

}

//脱掉所有衣服
function RemoveCloth(sender, msg) {
	InventoryRemove(sender,"Cloth");
	InventoryRemove(sender,"ClothLower");
	InventoryRemove(sender,"ClothAccessory");
	InventoryRemove(sender,"Suit");
	InventoryRemove(sender,"SuitLower");
	InventoryRemove(sender,"Gloves");
	InventoryRemove(sender,"Shoes");
	InventoryRemove(sender,"Hat");
	InventoryRemove(sender,"Necklace");
	InventoryRemove(sender,"RightAnklet");
	InventoryRemove(sender,"LeftAnklet");
	InventoryRemove(sender,"Mask");
	InventoryRemove(sender,"Socks");
	InventoryRemove(sender,"Bra");
	InventoryRemove(sender,"Panties");
	InventoryRemove(sender,"Corset");
	InventoryRemove(sender,"HairAccessory1")
	InventoryRemove(sender,"HairAccessory2")
	InventoryRemove(sender,"HairAccessory3")
	InventoryRemove(sender,"TailStraps")
	InventoryRemove(sender,"Wings")
	ChatRoomCharacterUpdate(sender);
}

//脱掉所有装备
function RemoveRestrains(sender, msg){

	InventoryRemove(sender,"ItemVulva")
	InventoryRemove(sender,"ItemVulvaPiercings")
	InventoryRemove(sender,"ItemButt")
	InventoryRemove(sender,"ItemArms")
	InventoryRemove(sender,"ItemHands")
	InventoryRemove(sender,"ItemNeck")
	InventoryRemove(sender,"ItemMouth")
	InventoryRemove(sender,"ItemMouth2")
	InventoryRemove(sender,"ItemMouth3")
	InventoryRemove(sender,"ItemTorso")
	InventoryRemove(sender,"ItemBreast")
	InventoryRemove(sender,"ItemLegs")
	InventoryRemove(sender,"ItemFeet")
	InventoryRemove(sender,"ItemBoots")
	InventoryRemove(sender,"ItemNipples")
	InventoryRemove(sender,"ItemNipplesPiercings")
	InventoryRemove(sender,"ItemPelvis")
	InventoryRemove(sender,"ItemHead")
	InventoryRemove(sender,"ItemDevices")
	InventoryRemove(sender,"ItemEars")
	ChatRoomCharacterUpdate(sender);
}

//游戏开始，穿上女仆装
function GameStart(sender, msg){
	ServerSend("ChatRoomChat", { Content: "*你来到了那栋别墅，女仆长似乎是预料到了你来一般在大门外等着.", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*女仆长：您就是今天来应聘的女仆吧，十分感谢您在我们人手不足的情况下给予援手，那么请随我来.", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*女仆长把你带到了别墅内的女仆宿舍，帮你换好了女仆装，只不过与女仆长带胶衣的女仆装不同，你身上的只是很普通的女仆装.", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*女仆长：这是您的（work）工作清单与馆内（map）地图，想必能帮到您,请务必在18点前完成所有工作.", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*她似乎注意到了你在盯着她身上的胶衣，轻轻笑了一声.", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*女仆长：您在意这个吗？这是正式女仆的制服，如果您能完美的完成今天的工作从而转正的话您也能穿哦.或者您能找到什么办法提前穿上.", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*女仆长：我在午餐前都会在厨房准备午餐，等十二点员工餐会送到你的房间，有什么不懂的可以来问我哦.那么失礼了.", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*女仆长优雅地离开了.", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*[游戏中可以使用 *think 来显示可以进行的行动.].", Type: "Emote", Target: sender.MemberNumber} );
	RemoveRestrains(sender, msg);
	WearMiadCloth(sender, msg);
}

//穿上女仆装
function WearMiadCloth(sender, msg){
	RemoveCloth(sender,msg);
	PlayerEquip.push("女仆装");
	InventoryWear(sender, "MaidOutfit1", "Cloth", null,80);
	InventoryWear(sender, "FrillyApron", "ClothAccessory", null,80);
	InventoryWear(sender, "Gloves1", "Gloves", null,80);
	InventoryGet(sender,"Gloves").Color = ["AAAAAA"];
	InventoryWear(sender, "AnkleStrapShoes", "Shoes", null,80);
	InventoryWear(sender, "MaidHairband1", "Hat", null,80);
	InventoryWear(sender, "Stockings2", "Socks", null,80);
	InventoryWear(sender, "MaidBra1", "Bra", null,80);
	InventoryWear(sender, "MaidPanties2", "Panties", null,80);
	ChatRoomCharacterUpdate(sender);
}
//床上弹子口塞
function WearDusterGag(sender, msg) {
	PlayerEquip.push("掸子口塞");
	InventoryWear(sender, "DusterGag", "ItemMouth", null,80,0,{
		"Item": "DusterGag",
		"Property": "Comfy",
		"Lock": "",
		"Name": "女仆小帮手",
		"Description": "原理不明但是确实可以加速工作，但该马的时候还是得马",
		"Color": "Default",
		"Private": false,
		"Type": null,
		"OverridePriority": null,
		"MemberName": "侍奉者",
		"MemberNumber": 0
	});
	ChatRoomCharacterUpdate(sender);
}

function WearHandcuffs(sender, msg) {
	if (PlayerEquip.includes("侍寝手铐")){
		PlayerEquip.splice(PlayerEquip.indexOf("侍寝手铐"),1);
	}

	if (PlayerEquip.includes("拘束衣")){
		PlayerEquip.splice(PlayerEquip.indexOf("拘束衣"),1);
	}

	PlayerEquip.push("手铐");
	InventoryRemove(sender,"ItemArms");
	InventoryWear(sender, "WristShackles", "ItemArms", null,80);
	InventoryGet(sender, "ItemArms").Property = {
		"Type": "Behind",
		"SetPose": [
			"BackCuffs"
		],
		"Effect": [
			"Block",
			"Prone"
		],
		"Difficulty": 3
	};
	ChatRoomCharacterUpdate(sender);
}

function WearStraitjacket(sender, msg) {
	if (PlayerEquip.includes("侍寝手铐")){
		PlayerEquip.splice(PlayerEquip.indexOf("侍寝手铐"),1);
	}

	if (PlayerEquip.includes("手铐")){
		PlayerEquip.splice(PlayerEquip.indexOf("手铐"),1);
	}

	PlayerEquip.push("拘束衣");
	InventoryRemove(sender,"ItemArms");
	InventoryWear(sender, "Bolero", "ItemArms", null,80,0,{
		"Item": "Bolero",
		"Property": "Comfy",
		"Lock": "",
		"Name": "女仆拘束衣",
		"Description": "让不乖的女仆服服帖帖",
		"Color": "#202020,Default,Default",
		"Private": false,
		"Type": null,
		"OverridePriority": null,
		"MemberName": "侍奉者",
		"MemberNumber": 0
	});
	ChatRoomCharacterUpdate(sender);

}

function WearBlindford(sender, msg) {
	PlayerEquip.push("眼罩");
	InventoryWear(sender, "FullBlindfold", "ItemHead", null,80,0,{
		"Item": "FullBlindfold",
		"Property": "Comfy",
		"Lock": "",
		"Name": "谜之眼罩",
		"Description": "“且寻救赎之道”",
		"Color": "Default",
		"Private": false,
		"Type": null,
		"OverridePriority": null,
		"MemberName": "未知",
		"MemberNumber": 0
	});
	ChatRoomCharacterUpdate(sender);
}

function wearRings(sender, msg) {
	PlayerEquip.push("穿环");
	InventoryWear(sender, "VibeHeartClitPiercing", "ItemVulvaPiercings", "Default",80,0,{
		"Item": "VibeHeartClitPiercing",
		"Property": "Comfy",
		"Lock": "",
		"Name": "调教环",
		"Description": "求而不得，拒而反迎",
		"Color": "Default",
		"Private": false,
		"Type": "Tease",
		"OverridePriority": null,
		"MemberName": "未知",
		"MemberNumber": 0
	});

	InventoryWear(sender, "VibeHeartPiercings", "ItemNipplesPiercings", "Default",80,0,{
		"Item": "VibeHeartPiercings",
		"Property": "Comfy",
		"Lock": "",
		"Name": "调教环",
		"Description": "求而不得，拒而反迎",
		"Color": "Default",
		"Private": false,
		"Type": "Tease",
		"OverridePriority": null,
		"MemberName": "未知",
		"MemberNumber": 0
	});

	ChatRoomCharacterUpdate(sender);
}

function WearSleepCloth(sender, msg) {
	RemoveCloth(sender,msg);
	PlayerEquip.push("侍寝套装");
	if (PlayerEquip.includes("女仆装")){
		PlayerEquip.splice(PlayerEquip.indexOf("女仆装"),1);
	}

	if (PlayerEquip.includes("正式女仆胶衣")){
		InventoryWear(sender, "Catsuit", "Suit", [
			"#202020",
			"#202020",
			"#202020"
		],80,0,null,true);
		InventoryGet(sender, "Suit").Property ={
			"Type": "Gloves",
			"Hide": [
				"Hands"
			]
		};


		InventoryWear(sender, "Catsuit", "SuitLower", [
			"#202020",
			"#202020"
		],80,0,null,true);
		ChatRoomCharacterUpdate(sender);
	}

	InventoryWear(sender, "HaremPants2", "ClothLower", "Default",80);
	InventoryWear(sender, "HaremGlove", "Gloves", "Default",80);
	InventoryWear(sender, "HaremBra", "Bra", "Default",80);
	InventoryWear(sender, "Sandals", "Shoes", "Default",80);
	InventoryWear(sender, "HaremStockings", "Socks", "Default",80);

	ChatRoomCharacterUpdate(sender);
}

function WearSleepEquip(sender, msg, pos) {
	switch (pos) {
		case 1:{
			PlayerEquip.push("侍寝项圈");
			InventoryWear(sender, "OrnateCollar", "ItemNeck", null,80,0,{
				"Item": "OrnateCollar",
				"Property": "Comfy",
				"Lock": "",
				"Name": "侍寝项圈",
				"Description": "“戴此具者当谦卑”",
				"Color": "#808080,#aa80aa",
				"Private": false,
				"Type": null,
				"OverridePriority": null,
				"MemberName": "侍奉者",
				"MemberNumber": 0
			});
		}
		break;

		case 2:{
			PlayerEquip.push("侍寝腿铐");
			InventoryWear(sender, "OrnateLegCuffs", "ItemLegs", null,80,0,{
				"Item": "OrnateLegCuffs",
				"Property": "Comfy",
				"Lock": "",
				"Name": "侍寝腿铐",
				"Description": "“戴此具者当优雅”",
				"Color": "Default,#808080,#aa80aa",
				"Private": false,
				"Type": "Chained",
				"OverridePriority": null,
				"MemberName": "侍奉者",
				"MemberNumber": 0
			});

			InventoryWear(sender, "OrnateAnkleCuffs", "ItemFeet", null,80,0,{
				"Item": "OrnateAnkleCuffs",
				"Property": "Comfy",
				"Lock": "",
				"Name": "侍寝脚铐",
				"Description": "“戴此具者当优雅”",
				"Color": "Default,#808080,#aa80aa",
				"Private": false,
				"Type": "Chained",
				"OverridePriority": null,
				"MemberName": "侍奉者",
				"MemberNumber": 0
			});

		}
			break;

		case 3:{
			PlayerEquip.push("侍寝贞操带");
			InventoryWear(sender, "OrnateChastityBra", "ItemBreast", null,80,0,{
				"Item": "OrnateChastityBra",
				"Property": "Comfy",
				"Lock": "",
				"Name": "侍寝贞操文胸",
				"Description": "“戴此具者当纯洁”",
				"Color": "#808080,#aa80aa",
				"Private": false,
				"Type": null,
				"OverridePriority": null,
				"MemberName": "侍奉者",
				"MemberNumber": 0
			});

			InventoryWear(sender, "OrnateChastityBelt", "ItemPelvis", null,80,0,{
				"Item": "OrnateChastityBelt",
				"Property": "Comfy",
				"Lock": "",
				"Name": "侍寝贞操带",
				"Description": "“戴此具者当纯洁”",
				"Color": "#808080,#aa80aa",
				"Private": false,
				"Type": "ClosedBack",
				"OverridePriority": null,
				"MemberName": "侍奉者",
				"MemberNumber": 0
			});
		}
			break;

		case 4:{
			if (PlayerEquip.includes("拘束衣")){
				PlayerEquip.splice(PlayerEquip.indexOf("拘束衣"),1);
			}

			if (PlayerEquip.includes("手铐")){
				PlayerEquip.splice(PlayerEquip.indexOf("手铐"),1);
			}
			InventoryRemove(sender,"ItemArms");
			PlayerEquip.push("侍寝手铐");
			InventoryWear(sender, "OrnateCuffs", "ItemArms", null,80,0,{
				"Item": "OrnateCuffs",
				"Property": "Comfy",
				"Lock": "",
				"Name": "侍寝手铐",
				"Description": "“戴此具者当端正”",
				"Color": "#808080,#aa80aa",
				"Private": false,
				"Type": "Wrist",
				"OverridePriority": null,
				"MemberName": "侍奉者",
				"MemberNumber": 0
			});
		}
			break;

	}
	ChatRoomCharacterUpdate(sender);
}


function WearMiadSuit(sender, msg) {

	PlayerEquip.push("正式女仆胶衣");

	if(PlayerEquip.includes("女仆装")){
		InventoryRemove(sender,"Gloves");
		InventoryRemove(sender,"Socks");
	}



	InventoryWear(sender, "Catsuit", "Suit", [
		"#202020",
		"#202020",
		"#202020"
	],80,0,null,true);
	InventoryGet(sender, "Suit").Property ={
		"Type": "Gloves",
			"Hide": [
			"Hands"
		]
	};


	InventoryWear(sender, "Catsuit", "SuitLower", [
		"#202020",
		"#202020"
	],80,0,null,true);
	ChatRoomCharacterUpdate(sender);

}

function isEquipFit() {
	if (PlayerEquip.includes("侍寝套装")&&PlayerEquip.includes("侍寝项圈")&&PlayerEquip.includes("侍寝腿铐")&&PlayerEquip.includes("侍寝贞操带")&&PlayerEquip.includes("侍寝手铐")){
		return true;
	}
	else {
		return false;
	}

}

function RemoveOneRestrain(sender, msg) {

}

//提示操作
function Think(sender, msg) {
	ServerSend("ChatRoomChat", { Content: "*你可以检查（work）工作清单，查看（map）地图.", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*发送  *check  来观察周围.", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*发送  *time  来确认时间.", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*发送  *goto 地点 （例：*goto main hall）  来改变地点（注意会消耗时间）.", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*身上的道具：", Type: "Emote", Target: sender.MemberNumber} );
	for(i = 0; i<ItemInPlayer.length; i++){
		ServerSend("ChatRoomChat", { Content: "*"+ItemInPlayer[i], Type: "Emote", Target: sender.MemberNumber} );

	}
	ServerSend("ChatRoomChat", { Content: "*身上的拘束：", Type: "Emote", Target: sender.MemberNumber} );
	for(i = 0; i<PlayerEquip.length; i++){
		ServerSend("ChatRoomChat", { Content: "*"+PlayerEquip[i], Type: "Emote", Target: sender.MemberNumber} );

	}
}

//显示工作清单
function WorkList(sender, msg) {
	for(i = 0;i<WorkListText.length; i++){
		ServerSend("ChatRoomChat", { Content: "*"+WorkListText[i], Type: "Emote", Target: sender.MemberNumber} );
		if(isWorkFinish[i] === true){
			ServerSend("ChatRoomChat", { Content: "*已完成.", Type: "Emote", Target: sender.MemberNumber} );
		}
		else {
			ServerSend("ChatRoomChat", { Content: "*未完成.", Type: "Emote", Target: sender.MemberNumber} );
		}
		ServerSend("ChatRoomChat", { Content: "* ", Type: "Emote", Target: sender.MemberNumber} );
	}

}

//显示地图
function OpenMap(sender, msg) {
	ServerSend("ChatRoomChat", { Content: "*------------------------3F-----------------------------", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*（game hall）游戏室 （roof）屋顶", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*------------------------2F-----------------------------", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*（guest room）客房（master room）主人房（library）图书室", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*------------------------1F-----------------------------", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*（maid room）女仆宿舍（main hall）大厅", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*（reception room）会客厅（kitchen）厨房", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*------------------------G1-----------------------------", Type: "Emote", Target: sender.MemberNumber} );
	if (isFindPrison === true){
	ServerSend("ChatRoomChat", { Content: "*（storehouse）库房（basement）地下室（prison）牢房", Type: "Emote", Target: sender.MemberNumber} );
	}
	else {
	ServerSend("ChatRoomChat", { Content: "*（storehouse）库房（basement）地下室", Type: "Emote", Target: sender.MemberNumber} );
	}
	ServerSend("ChatRoomChat", { Content: "*-------------------------------------------------------", Type: "Emote", Target: sender.MemberNumber} );

}

//观察当前地点
function Check(sender, msg) {
	switch (playerPosition) {
		case "main hall":{
			ServerSend("ChatRoomChat", { Content: "*只有有钱人家才能拥有的大厅，四处都是你叫不上来名字的装饰品。所幸你不需要打扫这些装饰品，不然要是不小心留下个划痕怕是把你卖了都赔不起.", Type: "Emote", Target: sender.MemberNumber} );
			//18点前
			if (timePast <540){
				ServerSend("ChatRoomChat", { Content: "*以及（gate）大门就在你身后.", Type: "Emote", Target: sender.MemberNumber} );
			}
			//花瓶未取
			if (isVaseActived === false){
				ServerSend("ChatRoomChat", { Content: "*虽然但是，有个花瓶（vase）里面似乎有什么东西反着光.", Type: "Emote", Target: sender.MemberNumber} );
			}

		}
			break;

		case "reception room":{
			ServerSend("ChatRoomChat", { Content: "*有着足以让十几个人同时用餐的巨大长桌，上面还装饰着传统的烛台（candlestick）.", Type: "Emote", Target: sender.MemberNumber} );
			if (isWorkFinish[0] === false){
				ServerSend("ChatRoomChat", { Content: "*一想到要打扫（clean）如此宽广的会客厅，你的腰隐约开始疼了起来.", Type: "Emote", Target: sender.MemberNumber} );
			}
		}
			break;

		case "maid room":{
			ServerSend("ChatRoomChat", { Content: "*这里的一排房间是女仆宿舍，从0到5号依次排开，你的房间是2号[发送  *编号 来检视房间 （例：*2）].", Type: "Emote", Target: sender.MemberNumber} );

		}
			break;

		case "kitchen":{
			ServerSend("ChatRoomChat", { Content: "*这个厨房比你家都大，五花八门的厨具与餐具整齐的被摆放它们应在的地方。有些（snack）小零食摆在桌子上.", Type: "Emote", Target: sender.MemberNumber} );
			if(timePast <180){
				ServerSend("ChatRoomChat", { Content: "*（head maid）女仆长正在这里准备午餐.", Type: "Emote", Target: sender.MemberNumber} );
			}
		}
			break;


		case "2F corridor":{
			ServerSend("ChatRoomChat", { Content: "*这里是2层的走廊，没什么特别的.", Type: "Emote", Target: sender.MemberNumber} );

		}
			break;

		case "guest room":{
			ServerSend("ChatRoomChat", { Content: "*这里是客房，门牌号从01排到19，光是从门上的花纹你就能看出但凡能住在这里的必定是贵宾[发送  *door 编号 来检视房间 （例：*door 09）注意发送两位数].", Type: "Emote", Target: sender.MemberNumber} );

		}
			break;

		case "master room":{
			ServerSend("ChatRoomChat", { Content: "*里是主人房，生人莫近的气场甚至隔着门都能感受得到。应该（knock）敲门吗？.", Type: "Emote", Target: sender.MemberNumber} );
			if(timePast >=180 && timePast<540){
				ServerSend("ChatRoomChat", { Content: "*（head maid）女仆长在门外站得笔直.", Type: "Emote", Target: sender.MemberNumber} );
			}
			else if(timePast>=540){
				ServerSend("ChatRoomChat", { Content: "*现在得直接进去(enter).", Type: "Emote", Target: sender.MemberNumber} );
			}
		}
			break;

		case "library":{
			ServerSend("ChatRoomChat", { Content: "*（这里是图书室，十几个书架上分门别类的摆了上千本书，有空的话可以随便（search）翻翻.", Type: "Emote", Target: sender.MemberNumber} );
		}
			break;

		case "3F corridor":{
			ServerSend("ChatRoomChat", { Content: "*这里是3层的走廊，没什么特别的.", Type: "Emote", Target: sender.MemberNumber} );

		}
			break;

		case "game hall":{
			ServerSend("ChatRoomChat", { Content: "*这里是游戏室，恐怕古今中外的游戏机与游戏卡带都被收藏在这里了。房间的角落里堆着传统洋馆游戏室里该有的台球、飞镖、象棋之类的古典娱乐。不过最显眼的应该是有着羊头雕塑的奇怪（machine）机器，上面写着“反悔机”.", Type: "Emote", Target: sender.MemberNumber} );
			if(timePast >=540){
				ServerSend("ChatRoomChat", { Content: "*（head maid）女仆长竟然在这里打游戏.", Type: "Emote", Target: sender.MemberNumber} );
			}

		}
			break;


		case "roof":{
			ServerSend("ChatRoomChat", { Content: "*这里是屋顶，室外的空气分外清新，甚至有个小花园，远处的景色也十分怡人。前提是不去注意那个煞风景的（water tower）水塔.", Type: "Emote", Target: sender.MemberNumber} );
			if (isWorkFinish[2] === false){
				ServerSend("ChatRoomChat", { Content: "*和满地需要你（clean）清理的落叶.", Type: "Emote", Target: sender.MemberNumber} );
			}
		}
			break;

		case "basement":{
			ServerSend("ChatRoomChat", { Content: "*这里是地下室，但是却不似对地下室的刻板印象般阴沉.", Type: "Emote", Target: sender.MemberNumber} );
			if (isFindPrison === true){
				ServerSend("ChatRoomChat", { Content: "*不过通往牢房的走廊倒是让这里添了几分阴沉.", Type: "Emote", Target: sender.MemberNumber} );
			}
			else {
				ServerSend("ChatRoomChat", { Content: "*就是不知道为什么（wall）墙边有个键盘，甚至是全新的，甚至RGB.", Type: "Emote", Target: sender.MemberNumber} );
			}
		}
			break;

		case "storehouse":{
			ServerSend("ChatRoomChat", { Content: "*这里是库房，一摞摞小山般的货物堆在这里.", Type: "Emote", Target: sender.MemberNumber} );
			if (isWorkFinish[3] === false){
				ServerSend("ChatRoomChat", { Content: "*而你得（clean）清点这些小山.", Type: "Emote", Target: sender.MemberNumber} );
			}
			else {
				ServerSend("ChatRoomChat", { Content: "*货物全部清点完了，值得注意的有 （wear 1）侍寝套装， （wear 2）全套拘束具，（wear 3）正式女仆胶衣,（case）小盒子.", Type: "Emote", Target: sender.MemberNumber} );
			}
		}
			break;

		case "prison":{
			ServerSend("ChatRoomChat", { Content: "*这里是牢房，正常洋馆怎么可能会有牢房，（deep）深处的牢房似乎关着谁.", Type: "Emote", Target: sender.MemberNumber} );
		}
			break;

	}
}

function Time(sender, msg) {
	ServerSend("ChatRoomChat", { Content: "*现在是" + (9 + (timePast-timePast%60)/60) +"点" + timePast%60 +"分", Type: "Emote", Target: sender.MemberNumber} );
}
//移动地点
function Goto(sender, msg) {
	if (msg.toLowerCase().includes("main hall")) {
		playerPosition = "main hall";
	}
	else if (msg.toLowerCase().includes("reception room")){
		playerPosition = "reception room";
	}
	else if (msg.toLowerCase().includes("maid room")){
		playerPosition = "maid room";
	}
	else if (msg.toLowerCase().includes("kitchen")){
		playerPosition = "kitchen";
	}
	else if (msg.toLowerCase().includes("2F corridor")){
		playerPosition = "2F corridor";
	}
	else if (msg.toLowerCase().includes("guest room")){
		playerPosition = "guest room";
	}
	else if (msg.toLowerCase().includes("master room")){
		playerPosition = "master room";
	}
	else if (msg.toLowerCase().includes("library")){
		playerPosition = "library";
	}
	else if (msg.toLowerCase().includes("game hall")){
		playerPosition = "game hall";
	}
	else if (msg.toLowerCase().includes("roof")){
		playerPosition = "roof";
	}
	else if (msg.toLowerCase().includes("basement")){
		playerPosition = "basement";
	}
	else if (msg.toLowerCase().includes("storehouse")){
		playerPosition = "storehouse";
	}
	else if (msg.toLowerCase().includes("prison")){
		playerPosition = "prison";
	}
	if (PlayerEquip.includes("正式女仆胶衣")){
		ServerSend("ChatRoomChat", { Content: "*胶衣里的触手让你寸步难行，你花了更长的时间移动.", Type: "Emote", Target: sender.MemberNumber} );
		TimeGo(sender, msg, 10);
	}
	else {
		TimeGo(sender, msg, 5);
	}
	if(isNightStart){
		if (positonWent.includes(playerPosition)){
			timepastmult +=1;
			ServerSend("ChatRoomChat", { Content: "*因为踏入了去过的地方，时间流逝更快了.", Type: "Emote", Target: sender.MemberNumber} );
		}
		else {
			positonWent.push(playerPosition);
		}

	}

	ServerSend("ChatRoomChat", { Content: "*你现在在"+playerPosition, Type: "Emote", Target: sender.MemberNumber} );

}

//地点行动
function Movement(sender, msg) {


	switch (playerPosition) {
		case "main hall":{
			//与花瓶互动
			if (msg.toLowerCase().includes("vase")) {
				if(PlayerEquip.indexOf("手铐") < 0 && PlayerEquip.indexOf("拘束衣") < 0 &&PlayerEquip.indexOf("侍寝手铐")<0){
					if (isVaseWeaned === false){
						ServerSend("ChatRoomChat", { Content: "*你尝试把手伸进去，但是花瓶开始摇晃，似乎就要倒下.似乎这个东西只要手还利索就拿不到.", Type: "Emote", Target: sender.MemberNumber} );
						isVaseWeaned = true;
					}
					else {
						ServerSend("ChatRoomChat", { Content: "*花瓶掉在地上摔倒粉碎，回过头去女仆长竟然站在身后.", Type: "Emote", Target: sender.MemberNumber} );
						ServerSend("ChatRoomChat", { Content: "*女仆长：您应该清楚您已经对我们造成了重大损失，请您负起责任赔偿损失.如果您资金不足的话请跟我来，我来为您介绍补偿的方法.", Type: "Emote", Target: sender.MemberNumber} );
						ToEnd(sender, msg, 6);
					}
				}
				else {
					if (ItemInPlayer.indexOf("女仆宿舍一号钥匙") <0){
						ServerSend("ChatRoomChat", { Content: "*你也不知道你是怎么拿到里面的东西的，但那似乎是一把钥匙.", Type: "Emote", Target: sender.MemberNumber} );
						ServerSend("ChatRoomChat", { Content: "*获得 女仆宿舍一号钥匙.", Type: "Emote", Target: sender.MemberNumber} );
						ItemInPlayer.push("女仆宿舍一号钥匙");
					}
				}
			}
			//与大门互动
			else if(msg.toLowerCase().includes("gate")){
				if(timePast < 540){
					ServerSend("ChatRoomChat", { Content: "*大门没锁，倒是可以直接（leave）走人.", Type: "Emote", Target: sender.MemberNumber} );
				}
			}
			//离开
			else if(msg.toLowerCase().includes("leave")){
				if(timePast < 540){
					ToEnd(sender, msg, 5);
				}
			}
		}
			break;

		case "reception room":{
			//拿烛台
			if(msg.toLowerCase().includes("candlestick")){
				ServerSend("ChatRoomChat", { Content: "*获得 烛台.", Type: "Emote", Target: sender.MemberNumber} );
				ItemInPlayer.push("烛台");
			}
			else if (msg.toLowerCase().includes("clean")){
				if (isWorkFinish[0] === false){
					time = GetWorkTime(sender, msg,60);
					if (time < 0){
						ServerSend("ChatRoomChat", { Content: "*穿着拘束衣根本没法工作，除非有什么工具.", Type: "Emote", Target: sender.MemberNumber} );
					}
					else {
						TimeGo(sender, msg, time);
						ServerSend("ChatRoomChat", { Content: "*你完成了工作.", Type: "Emote", Target: sender.MemberNumber} );
						isWorkFinish[0] = true;
					}
				}

			}
		}
			break;

		case "maid room":{
			if (msg.toLowerCase().includes("0")){
				ServerSend("ChatRoomChat", { Content: "*这是女仆长的宿舍.", Type: "Emote", Target: sender.MemberNumber} );
			}
			else if (msg.toLowerCase().includes("1")){
				ServerSend("ChatRoomChat", { Content: "*这是其他女仆的宿舍，你需要钥匙来（unlock）解开门锁.", Type: "Emote", Target: sender.MemberNumber} );
			}
			else if (msg.toLowerCase().includes("2")){
				ServerSend("ChatRoomChat", { Content: "*这里是你的宿舍，里面设施齐全，有（bed）床铺，（box）储物箱，以及书桌，衣柜等.", Type: "Emote", Target: sender.MemberNumber} );
				if(timePast >=180 && isEatlunch === false){
					ServerSend("ChatRoomChat", { Content: "*你的（lunch）午饭摆在一个可爱的便当盒里，看起来营养均衡而且美味.", Type: "Emote", Target: sender.MemberNumber} );
				}
			}


			else if (msg.toLowerCase().includes("unlock")){
				if (ItemInPlayer.indexOf("女仆宿舍一号钥匙") > 0){
					//ItemInPlayer.pop("女仆宿舍一号钥匙");
					ServerSend("ChatRoomChat", { Content: "*你在女仆宿舍的一号房间内翻找.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*桌上摆着女仆一号的日记.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*X月X日", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*虽然工资确实可观，但是我还是无法抑制住好奇心去思考地下室里倒底有什么，我亲眼看见女仆长下到地下室后却无论地下室还是库房都找不到她。那里肯定有什么暗门，那扇空着的墙旁边的键盘实际可疑。且不论那里为什么有键盘，键盘上第一行的字母全部都磨损掉了，说不定这就是密码。女仆长每天在中午前都会待在厨房可能会察觉到地下室的声音。所以我得等到下午在去看看.", Type: "Emote", Target: sender.MemberNumber} );
					if (ItemInPlayer.indexOf("后悔券") <0){
						ServerSend("ChatRoomChat", { Content: "*获得 后悔券.", Type: "Emote", Target: sender.MemberNumber} );
						ItemInPlayer.push("后悔券");
					}
				}
			}
			else if (msg.toLowerCase().includes("bed")){
				ServerSend("ChatRoomChat", { Content: "*可以在这里（sleep）打个盹.", Type: "Emote", Target: sender.MemberNumber} );
			}
			else if (msg.toLowerCase().includes("box")){
				ServerSend("ChatRoomChat", { Content: "*箱子里有一个掸子口塞，原理不明但是可以辅助你打扫，你可以（wear）穿上它.", Type: "Emote", Target: sender.MemberNumber} );
			}
			else if (msg.toLowerCase().includes("wear")){
				WearDusterGag(sender, msg);
			}
			else if (msg.toLowerCase().includes("sleep")){
				if(timePast <180){
					timePast = 180;
					ServerSend("ChatRoomChat", { Content: "*你睡到了正午.", Type: "Emote", Target: sender.MemberNumber} );
				}
				else if(timePast <540){
					timePast = 540;
					ServerSend("ChatRoomChat", { Content: "*你睡到了黄昏.", Type: "Emote", Target: sender.MemberNumber} );
				}
				else {
					ServerSend("ChatRoomChat", { Content: "*你躺下试图骗过那个事物，但祂其实不傻.", Type: "Emote", Target: sender.MemberNumber} );
					ToEnd(sender, msg,4);
				}
			}
			else if (msg.toLowerCase().includes("lunch") && isEatlunch === false){
				isEatlunch =true;
				TimeGo(sender, msg,15);
				ServerSend("ChatRoomChat", { Content: "*确实如表面般美味，你在吃完后发现饭盒重心不对，仔细检查后你在暗格里发现了一把小钥匙.", Type: "Emote", Target: sender.MemberNumber} );
				ServerSend("ChatRoomChat", { Content: "*获得 小钥匙.", Type: "Emote", Target: sender.MemberNumber} );
				ItemInPlayer.push("小钥匙");
			}




		}
			break;

		case "kitchen":{
			if (msg.toLowerCase().includes("snack")){
				if(PlayerEquip.includes("handcuffs") || PlayerEquip.includes("straitjacket") || PlayerEquip.includes("sleep handcuffs")<0){
					ServerSend("ChatRoomChat", { Content: "*你只能幽怨地盯着零食.", Type: "Emote", Target: sender.MemberNumber} );

				}
				else if(timePast < 180){
					ServerSend("ChatRoomChat", { Content: "*当你把手伸向零食时，你发现到手不知何时已经被铐在了背后.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*女仆长：饭前吃零食会变胖的哦.", Type: "Emote", Target: sender.MemberNumber} );
					WearHandcuffs(sender, msg);
				}
				else {
					ServerSend("ChatRoomChat", { Content: "*好吃.", Type: "Emote", Target: sender.MemberNumber} );

				}
			}
			else if(msg.toLowerCase().includes("head maid")){
				TalkWithHeadMaid(sender, msg);
			}
		}
			break;

		case "2F corridor":{

		}
			break;

		case "guest room":{
			if (msg.toLowerCase().includes("0") && !msg.toLowerCase().includes("10")){
				ServerSend("ChatRoomChat", { Content: "*这不是你需要清理的房间，但是里面隐约能听见嗡嗡声。好奇心命令你（open）打开门，但求生本能命令你不要打开.", Type: "Emote", Target: sender.MemberNumber} );
			}
			else if(msg.toLowerCase().includes("1")){
				ServerSend("ChatRoomChat", { Content: "*这是你需要清理的房间，确实得好好（clean）打扫一下.", Type: "Emote", Target: sender.MemberNumber} );
			}
			else if (msg.toLowerCase().includes("clean")){
				time = GetWorkTime(sender, msg,20);
				if (time < 0){
					ServerSend("ChatRoomChat", { Content: "*穿着拘束衣根本没法工作，除非有什么工具.", Type: "Emote", Target: sender.MemberNumber} );
				}
				else {
					TimeGo(sender, msg, time);
					work2Pros += 1;
					ServerSend("ChatRoomChat", { Content: "*你打扫了这个房间，还有"+ (10-work2Pros) +"个房间需要打扫", Type: "Emote", Target: sender.MemberNumber} );

				}
				if(work2Pros >= 10){
					isWorkFinish[1] = true;
					ServerSend("ChatRoomChat", { Content: "*打扫完成了", Type: "Emote", Target: sender.MemberNumber} );
				}
			}
			else if (msg.toLowerCase().includes("open")){
				if(timePast >=540){
					ServerSend("ChatRoomChat", { Content: "*房间里是被装在真空床里的人.跳蛋贴在她的敏感部位上猛烈的震动，她不断挣扎，但毫无作用.", Type: "Emote", Target: sender.MemberNumber} );
					if(ItemInPlayer.indexOf("驱魔蓝宝石") >= 0){
						ServerSend("ChatRoomChat", { Content: "*你把蓝宝石举到她跟前，她慢慢地平静了下来.", Type: "Emote", Target: sender.MemberNumber} );
						gemCharge +=1;
						ServerSend("ChatRoomChat", { Content: "*蓝宝石又亮了一点", Type: "Emote", Target: sender.MemberNumber} );
						if (gemCharge >=10 && ItemInPlayer.indexOf("充能驱魔蓝宝石") <0){
							ServerSend("ChatRoomChat", { Content: "*蓝宝石现在闪耀着光辉", Type: "Emote", Target: sender.MemberNumber} );
							ItemInPlayer.push("充能驱魔蓝宝石");
						}
					}

				}
				else if(PlayerEquip.indexOf("拘束衣") <0){
					ServerSend("ChatRoomChat", { Content: "*在把手伸向门板手前你发现胳膊动不了了，低头一看发现身上被穿上了拘束衣，女仆长的声音从身后响起.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*女仆长：不乖的孩子就要把手绑住哦，不过你的工作还得照做就是了.", Type: "Emote", Target: sender.MemberNumber} );
					WearStraitjacket(sender, msg);
				}
				else {
					ServerSend("ChatRoomChat", { Content: "*你够不着门把手.", Type: "Emote", Target: sender.MemberNumber} );
				}
			}
			else if (msg.toLowerCase().includes("search")){
				ServerSend("ChatRoomChat", { Content: "*你在床底发现了一个袋子，打开后里面装着一个眼罩，和一张纸条.上面写着“希望女仆长小姐不会怪罪我把书掏空了”.你可以（wear）戴上眼罩.", Type: "Emote", Target: sender.MemberNumber} );
			}
			else if(msg.toLowerCase().includes("wear")){
				WearBlindford(sender, msg);
			}
		}
			break;

		case "master room":{
			if (msg.toLowerCase().includes("knock")){
				ServerSend("ChatRoomChat", { Content: "*门自己打开了，房间内光线十分昏暗，女主人坐在书桌前的办公椅上.她的头发随意地拖在地上，与长发不相称的较小身材却无法让她的脚够着地面.房间感觉上许久没有通风过了.她没有注意到你，继续窝在书桌上写着无法理解的文字与符号.", Type: "Emote", Target: sender.MemberNumber} );
				ServerSend("ChatRoomChat", { Content: "*过了一会，她才注意到你.", Type: "Emote", Target: sender.MemberNumber} );
				ServerSend("ChatRoomChat", { Content: "*女主人：哈？已经这个点了？你，扭过来让我看看.", Type: "Emote", Target: sender.MemberNumber} );
				ServerSend("ChatRoomChat", { Content: "*她打量着你，你感觉像是被毒蛇盯着一般.", Type: "Emote", Target: sender.MemberNumber} );
				if (isEquipFit()){
					ServerSend("ChatRoomChat", { Content: "*女主人：哈啊~，行吧.既然是你主动来的可别反悔.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*你先是感到身体无法动弹，才意识全身已经被布条包住了.", Type: "Emote", Target: sender.MemberNumber} );
					ToEnd(sender, msg, 3);
				}
				else {
					ServerSend("ChatRoomChat", { Content: "*女主人：啧，别没准备好就进来啊，出去问门口那个笨蛋去.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*一股无形的力把你扔了出去，门砰的一声关上了，而你的乳头和阴蒂上出现了有着淫靡装饰的穿环，穿环时有时无的震动让你感到十分苦闷.", Type: "Emote", Target: sender.MemberNumber} );
					wearRings(sender, msg);
				}
			}
			else if (msg.toLowerCase().includes("enter")){
				if (ItemInPlayer.indexOf("女仆一号")>=0 && isEquipFit()){
					ToEnd(sender, msg, 2);
				}
				else {
					ServerSend("ChatRoomChat", { Content: "*看见你进来，女主人的眼神从期待迅速转变为失望.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*女主人：唉，我就不该期待什么的，不过之少我能从祂手上把你保下.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*你先是感到身体无法动弹，才意识全身已经被布条包住了.", Type: "Emote", Target: sender.MemberNumber} );
					ToEnd(sender, msg, 3);
				}
			}
			else if(msg.toLowerCase().includes("head maid") && timePast >=180 && timePast <540){
				TalkWithHeadMaid(sender, msg);
			}
		}
			break;

		case "library":{
			if (msg.toLowerCase().includes("search")){
				if (PlayerEquip.indexOf("眼罩")>=0 && ItemInPlayer.indexOf("水塔钥匙")<0){
					ServerSend("ChatRoomChat", { Content: "*蒙着眼找东西确实不易，但是你随手拿起的一本书里竟想藏锤子一样藏了一把钥匙.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*获得 水塔钥匙.", Type: "Emote", Target: sender.MemberNumber} );
					ItemInPlayer.push("水塔钥匙");
				}
				else if (ItemInPlayer.indexOf("后悔券")<0){
					ServerSend("ChatRoomChat", { Content: "*你从书页中找到一张纸片.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*获得 后悔券.", Type: "Emote", Target: sender.MemberNumber} );
					ItemInPlayer.push("后悔券");
				}
				else {
					ServerSend("ChatRoomChat", { Content: "*没什么值得在意的.", Type: "Emote", Target: sender.MemberNumber} );
				}
			}
		}
			break;

		case "3F corridor":{

		}
			break;

		case "game hall":{
			if (msg.toLowerCase().includes("machine")){
				ServerSend("ChatRoomChat", { Content: "*可以在这里（remove）解除一件束缚，你猜有没有代价[该功能开发中].", Type: "Emote", Target: sender.MemberNumber} );
			}
			else if(msg.toLowerCase().includes("remove")){
				if (ItemInPlayer.indexOf("后悔券")>0){
					ServerSend("ChatRoomChat", { Content: "*机器伸出机械手解开了一件束缚，但其中几条机械手明显在性骚扰.", Type: "Emote", Target: sender.MemberNumber} );
					removeCount +=1;
					RemoveOneRestrain(sender, msg);
				}
				else {
					ServerSend("ChatRoomChat", { Content: "*没有票票还想白嫖？", Type: "Emote", Target: sender.MemberNumber} );
				}
			}
			else if(msg.toLowerCase().includes("head maid") && timePast >= 540){
				TalkWithHeadMaid(sender, msg);
			}
		}
			break;

		case "roof":{
			if (msg.toLowerCase().includes("clean") ){
				time = GetWorkTime(sender, msg,20);
				if (time < 0){
					ServerSend("ChatRoomChat", { Content: "*穿着拘束衣根本没法工作，除非有什么工具.", Type: "Emote", Target: sender.MemberNumber} );
				}
				else {
					isWorkFinish[2] = true;
					TimeGo(sender, msg,time);
					ServerSend("ChatRoomChat", { Content: "*打扫完成了.", Type: "Emote", Target: sender.MemberNumber} );
				}




			}
			else if (msg.toLowerCase().includes("water tower") ){
				ServerSend("ChatRoomChat", { Content: "*你很确定里面有着断断续续的呜咽声。要（unlock）打开吗？", Type: "Emote", Target: sender.MemberNumber} );
			}
			else if (msg.toLowerCase().includes("unlock")){
				if(ItemInPlayer.indexOf("水塔钥匙") >=0){
					ServerSend("ChatRoomChat", { Content: "*你看到了呜咽声的来源，从头饰来看的话应该是一直没见过的女仆一号，她手脚上的铐具被焊在水塔内壁上，没有一丝逃脱的可能，你仔细看了看水塔里的液体，首先正常的水是不可能是粉色的，从被浸泡在里面的女仆一号眼神恍惚，面色潮红，不断扭动身体的样子来看，这液体还是不要接触为好.", Type: "Emote", Target: sender.MemberNumber} );
					if (ItemInPlayer.indexOf("充能驱魔蓝宝石") >=0){
						ServerSend("ChatRoomChat", { Content: "*要把蓝宝石（drop）丢进去吗？", Type: "Emote", Target: sender.MemberNumber} );
					}
				}
				else {
					ServerSend("ChatRoomChat", { Content: "*锁上了.", Type: "Emote", Target: sender.MemberNumber} );

				}

			}
			else if (msg.toLowerCase().includes("drop") && ItemInPlayer.indexOf("女仆一号") <0){
				ServerSend("ChatRoomChat", { Content: "*水塔里的液体霎那间变成了清水，女仆一号上的铐具从水塔内壁上脱落下来，你鼓起勇气跳进去把她捞了出来，同时尽量无视只是因为皮肤被接触空气就高潮了的女仆一号.", Type: "Emote", Target: sender.MemberNumber} );
				ServerSend("ChatRoomChat", { Content: "*获得 女仆一号.", Type: "Emote", Target: sender.MemberNumber} );
				ItemInPlayer.push("女仆一号");
			}
		}
			break;

		case "basement":{
			if (msg.toLowerCase().includes("wall")){
				ServerSend("ChatRoomChat", { Content: "*可以通过键盘输入些什么[发送 *wall 密码 （例 *wall abcdefg）].", Type: "Emote", Target: sender.MemberNumber} );
				if (msg.toLowerCase().includes("qwertyuiop")){
					ServerSend("ChatRoomChat", { Content: "*墙开始轰隆隆的响.", Type: "Emote", Target: sender.MemberNumber} );
					if (timePast <180){
						ServerSend("ChatRoomChat", { Content: "*不知何时出现的女仆长一把把你把住了.", Type: "Emote", Target: sender.MemberNumber} );
						ServerSend("ChatRoomChat", { Content: "*女仆长：还...太早了哦.", Type: "Emote", Target: sender.MemberNumber} );
						ToEnd(sender, msg, 6);
					}
					else {
						ServerSend("ChatRoomChat", { Content: "*（goto prison）通向牢房的门出现了.", Type: "Emote", Target: sender.MemberNumber} );
						isFindPrison = true;
					}
				}
			}

		}
			break;

		case "storehouse":{
			if (msg.toLowerCase().includes("clean") && !isWorkFinish[3]){
				time = GetWorkTime(sender, msg,40);
				if (time < 0){
					ServerSend("ChatRoomChat", { Content: "*穿着拘束衣根本没法工作，除非有什么工具.", Type: "Emote", Target: sender.MemberNumber} );
				}
				else {
					isWorkFinish[3] = true;
					TimeGo(sender, msg,time);
					ServerSend("ChatRoomChat", { Content: "*打扫完成了.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*货物全部清点完了，值得注意的有 （wear 1）侍寝套装， （wear 2）全套拘束具，（wear 3）正式女仆胶衣， （case）小盒子.", Type: "Emote", Target: sender.MemberNumber} );

				}



				}
			else if(msg.toLowerCase().includes("wear")){
				if (msg.toLowerCase().includes("1")){
					ServerSend("ChatRoomChat", { Content: "*你感觉肚子凉凉的.", Type: "Emote", Target: sender.MemberNumber} );
					WearSleepCloth(sender, msg);
				}
				else if (msg.toLowerCase().includes("2")){
					ServerSend("ChatRoomChat", { Content: "*你不知道你为什么要把自己绑起来.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*现在你完全动弹不得.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*试图挣扎无果又过了一段时间后，有什么东西靠近了.", Type: "Emote", Target: sender.MemberNumber} );
					ToEnd(sender, msg, 7);
				}
				else if (msg.toLowerCase().includes("3")){
					ServerSend("ChatRoomChat", { Content: "*你穿上后就后悔了，胶衣里面都是细密的触手，现在哪怕你做出最细微的动作都会刺激触手挑逗你.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*但是这个胶衣似乎有某种防护作用？", Type: "Emote", Target: sender.MemberNumber} );
					WearMiadSuit(sender, msg);
				}
			}
			if (msg.toLowerCase().includes("case")){
				if(ItemInPlayer.indexOf("小钥匙") >=0 && ItemInPlayer.indexOf("蓝宝石") <0){
					ServerSend("ChatRoomChat", { Content: "*获得 蓝宝石.", Type: "Emote", Target: sender.MemberNumber} );
					ItemInPlayer.push("蓝宝石");
				}
				else {
					ServerSend("ChatRoomChat", { Content: "*打不开.", Type: "Emote", Target: sender.MemberNumber} );

				}
			}
		}
			break;

		case "prison":{
			if (msg.toLowerCase().includes("deep")){
				if (PlayerEquip.indexOf("正式女仆胶衣") >=0){
					ServerSend("ChatRoomChat", { Content: "*有一个女孩子被束缚在这里，眼罩，开口口塞，项圈，贞操带，拘束衣，束腿套，甚至连脚都要被固定在底座里，天花板上，墙上，地板上接着的铁链连在她的束缚上，迫使她站在固定的位置。即使这样，她也隔着口塞哼着不知名但十分收悉的歌谣。但最奇怪的，是她头上的羊角和背后的蝠翼，还有又细又长末端还是爱心的尾巴.", Type: "Emote", Target: sender.MemberNumber} );
					if (ItemInPlayer.indexOf("充能驱魔蓝宝石") >=0){
						ServerSend("ChatRoomChat", { Content: "*要把蓝宝石（drop）丢进去吗？", Type: "Emote", Target: sender.MemberNumber} );
					}
				}
				else {
					ServerSend("ChatRoomChat", { Content: "*你踩在一个水坑上，水溅起来沾到你的腿上.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*你迅速意识到身体的异样，在反应过来前你高潮了.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*你失去平衡跌倒了，如果只是一滴这种液体沾到身上就会导致高潮的话，倒在那个水坑上会发生什么你甚至不敢想象.", Type: "Emote", Target: sender.MemberNumber} );
					ServerSend("ChatRoomChat", { Content: "*不过还好你已经失去了意识.", Type: "Emote", Target: sender.MemberNumber} );
					ToEnd(sender, msg,4);
				}
			}
			else if (msg.toLowerCase().includes("drop")){
				ToEnd(sender, msg, 1);
			}
		}
			break;

	}
}

function TalkWithHeadMaid(sender, msg) {
	isTalk = false;
	if(timePast<180 && playerPosition === "kitchen"){
		isTalk = true;
		ServerSend("ChatRoomChat", { Content: "*女仆长：午饭就快做好了，不要因为嘴馋就吃小零食哦.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女仆长：对了，任务里要打扫的客房之前住的客人匆匆离开了，可以在那里（search）翻找一下看看客人有没有落下东西.", Type: "Emote", Target: sender.MemberNumber} );
	}
	else if (timePast>=180 && timePast <540 && playerPosition === "master room"){
		isTalk = true;
		ServerSend("ChatRoomChat", { Content: "*女仆长：要服侍主人的话，记得穿上侍寝套装和侍寝束具，者一身装备是具有仪式性的意义的.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女仆长：侍寝套装的话，我记得在库房.侍寝束具的话，每完成一项工作可以来我这里装备一件.", Type: "Emote", Target: sender.MemberNumber} );
	}
	else if(timePast >= 540 && playerPosition === "game hall"){
		isTalk = true;
		ServerSend("ChatRoomChat", { Content: "*女仆长：现在我处于下班时间，打游戏也是我的自由.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*她突然压低了声音.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女仆长：我知道现在有东西正在追逐您，但是像我这样的局内人是无法干涉祂的，若是能找来苍蓝圣物的话，我能为您提供破局之法.", Type: "Emote", Target: sender.MemberNumber} );
		if(ItemInPlayer.includes("蓝宝石") && !ItemInPlayer.includes("驱魔蓝宝石")){
			ItemInPlayer.push("驱魔蓝宝石");
			ServerSend("ChatRoomChat", { Content: "*女仆长：您拿来了啊，请稍等.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*获得 驱魔蓝宝石.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*女仆长：“于此前不可到达处寻求十之侵蚀，于受难者处寻求一之羔羊，于未竟之事处寻求超越”.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*女仆长：愿您，武运昌隆.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*然后她又拿起手柄继续打游戏.", Type: "Emote", Target: sender.MemberNumber} );
		}
	}

	if(isTalk){
		ServerSend("ChatRoomChat", { Content: "*.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女仆长：我来检查一下工作的完成情况.", Type: "Emote", Target: sender.MemberNumber} );

		for (i=0;i<isWorkFinish.length-1;i++){
			if (isWorkFinish[i]){
				ServerSend("ChatRoomChat", { Content: "*女仆长：工作"+ (i+1) +" 完成了" + "可以（head maid wear "+ (i+1) +"）在我这穿戴" + SleepEquipText[i], Type: "Emote", Target: sender.MemberNumber} );
			}
		}
	}

	if (msg.toLowerCase().includes("wear")){
		if (msg.toLowerCase().includes("1")){
			WearSleepEquip(sender, msg, 1);
		}
		else if (msg.toLowerCase().includes("2")){
			WearSleepEquip(sender, msg, 2);
		}
		else if (msg.toLowerCase().includes("3")){
			WearSleepEquip(sender, msg, 3);
		}
		else if (msg.toLowerCase().includes("4")){
			WearSleepEquip(sender, msg, 4);
		}
	}
}

/**
 * @return {number}
 */
function GetWorkTime(sender, msg, time) {
	restrainCount = 0;
	for(i in PlayerEquip){
		if (i !=="女仆装" && i !=="正式女仆胶衣" && i !=="侍寝套装" ){
			restrainCount +=1;
		}
	}
	if(PlayerEquip.includes("拘束衣") && !PlayerEquip.includes("掸子口塞")){
		return -1
	}
	if (restrainCount >= 2)
		if(PlayerEquip.indexOf("掸子口塞") >=0){
			ServerSend("ChatRoomChat", { Content: "*虽然浑身的束缚让你很难展开工作，但万能的掸子口塞还是帮你节省了一点时间.", Type: "Emote", Target: sender.MemberNumber} );
			return time * 1.5;
		}
		else {
			ServerSend("ChatRoomChat", { Content: "*浑身的束缚让你很难展开工作，累死累活下你还是干完了活.", Type: "Emote", Target: sender.MemberNumber} );
			return time * 2;
		}
	else if(PlayerEquip.indexOf("掸子口塞") >=0){
		ServerSend("ChatRoomChat", { Content: "*万能的掸子口塞帮你节省了一点时间.", Type: "Emote", Target: sender.MemberNumber} );

		return time * 0.5;
	}
	else {
		ServerSend("ChatRoomChat", { Content: "*你花了一些时间干完了活.", Type: "Emote", Target: sender.MemberNumber} );

		return time;
	}
}

function ToEnd(sender, msg, endType) {
	isGameOver = true;
	setTimeout(function (sender) {
		end(sender, msg,endType);
	}, 5 * 1000, sender);
}

function end(sender, msg, endType) {


	console.log("end "+endType);
	if(endType === 1){
			WearEndA(sender, msg);
			ServerSend("ChatRoomChat", { Content: "*她的眼罩脱落下来.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*你于祂四目相对.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*。。。。。。.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*。。。。。。.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*。。。。。。.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*你问祂你们要前往何处.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*祂：去色色.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*你问祂你们要到达何处.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*祂：去色色.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*你理解了一切.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*。。。。。。.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*。。。。。。.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*。。。。。。.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*在一声惊叫中你回过神来.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*四肢折叠束缚起来被你当作凳子的女仆长因为高潮而失去了平衡，你差点坐到地上.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*你用尾巴拍了下她的屁股，她又高潮了.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*你起身，向女主人挪去女主人.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*她被自己的长发五花大绑，在地上蠕动着试图挤出体内的震动棒，她就快成功了.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*好心的你用尾巴帮她把震动棒塞了回去.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*拉开窗帘，阳光一下便布满了房间.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*虽然四肢仍然被对魔拘束具绑着，但你还是伸展伸展蝠翼.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*今天也是色色的一天.", Type: "Emote", Target: sender.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*A结局：同化", Type: "Chat"} );

	}
	else if (endType === 2){
		WearEndB(sender, msg);
		ServerSend("ChatRoomChat", { Content: "*你抱着女仆一号把门撞开.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*。。。。。。.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*。。。。。。.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*。。。。。。.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*你不理解这个别墅哪来的这么大的浴池，你更不理解你从推开主人房的门到在这里泡澡之间发生的事", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*好像是推开房门后，女仆一号直接飞到了女主人身上把她撞倒，然后你也被一股力拖拽着压在女主人身上.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*你爬起身后发现身上的侍寝装备穿在了女主人身上，女仆一号也不像刚才那样不停高潮了.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*但是女主人却面色潮红，在地上扭动着尝试自慰，手指却被挡在了贞操带外边.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*然后女仆长过来让你帮忙从地下室把扭曲的山羊尸体搬出去扔掉，然后你们四人就在这里泡澡了，虽然女仆一号一直没有下水.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女仆长：一号酱，不来泡会吗？", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女仆一号：不要！我这辈子都不要泡在水里了，最后还不是靠圣物我才吸收了拿来反击淫魔的淫魔精华，我白在里面泡那么久了啊！现在身体还残留着感觉啊！", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女仆一号匆匆洗完身子后就跑掉了。", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女仆长又看向在她身边，一刻不停尝试自慰的女主人.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女仆长：太好了呢主人，终于把盘踞在这里的淫魔驱除掉了呢.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女主人：哪有通过让身为宿主的我快感过载而直接把淫魔冲走的驱魔方式啊？作为固定淫魔锚点的拘束具应该已经完成功能失效了啊。怎么脱不下来啊？好像高潮好像高潮好像高潮.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女仆长：毕竟我做了点手脚，自服侍您第一天起我就想让您做我的奴隶了，不过有一个让您高潮的办法哦.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女主人：你这二五仔！啊？为什么要揉我的肚子？", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*根据你充分的理论知识，这是体外宫颈按摩.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*在洗澡水的成分改变前你离开了浴池.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女主人的叫声传遍了整栋别墅.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*B结局：驱魔顺带下克上", Type: "Chat"} );
	}
	else if (endType === 3){
		WearEndC(sender, msg);
		ServerSend("ChatRoomChat", { Content: "*女主人一把把你推到了床上，力气大得不像是者较小身躯能有的.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女主人：结果还是变成这样了啊，我尽力让你活着.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*她也坐到床上，开始隔着布条揉搓你的敏感部位.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*你的身体现在远比平时敏感，你本能性的开始激烈挣扎.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女主人：不要乱动啊，要是被祂侵蚀了我可没有再救你的手段了.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*你开始一刻不停地高潮，感觉大脑都要烧坏了.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*不知是不是幻觉，你看见一个头顶羊角的女孩子一脸烦躁得盯着你和女主人.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女主人：忘了这里吧，我们总会有办法的.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*随之你失去了意识，再次醒来时，你正躺在自家的床上，像是什么都没有发生，除了下腹部的燥热.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*C结局：侍寝？", Type: "Chat"} );
	}
	else if (endType === 4){
		WearEndD(sender, msg);
		ServerSend("ChatRoomChat", { Content: "*钟鸣完21下后，一直手搭在了你的肩膀上.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*？？？：欢迎成为我的子嗣哦.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*等你回复意识，正发现自己躺在客房的床上，但是身体却不停使唤.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*似乎是预料到了你会醒来，女仆长推开门进来了.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女仆长：对于您被祂侵蚀的事，我也感到十分遗憾，请在时机到来之前，现在这里稍作等候.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女仆长把你装进真空床里，然后抽气，巨大的压迫感遍布了全身.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*在接下来很长一段时间里，你能感到的刺激只有顶在私处的跳蛋.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*D结局：侵蚀", Type: "Chat"} );}
	else if (endType === 5){
		WearEndE(sender, msg);
		ServerSend("ChatRoomChat", { Content: "*这地方怎么想怎么不对，于是你直接润了.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*于是你去跟朋友打麻将去了，点一次炮多一条绳子那种.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*那天你的朋友们见识到了传奇炮手，你见识到了极限驷马.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*E结局：又入虎口", Type: "Chat"} );}
	else if (endType === 6){
		WearEndF(sender, msg);
		ServerSend("ChatRoomChat", { Content: "*女仆长把你带到了很深的地下，又把你拘束起来，像只小马一样.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女仆长：那么请在这里劳动，直到得以补偿您造成的损失.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*她无视你的惨叫，给你的乳头穿上环，然后用铁链把穿环和不断运动的横杆连起来.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*女仆长离开了，只留下你跟着横杆不断踮着脚小跑，稍慢一点乳头都被拽的生疼.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*她没有说明你得跑多长时间，至少在你的乳头被拽只能感到快感前，你一直被迫跑着.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*F结局：闪耀优骏奴隶", Type: "Chat"} );}
	else if (endType === 7){
		WearEndG(sender, msg);
		ServerSend("ChatRoomChat", { Content: "*？？？：老实说，就算是我都没见过这么白给的情况.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*？？？：不敢既然你这么渴求，人家也不介意多个室友就是了.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*你被不知什么人抱了起来，往不知什么方向走去.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*你被铁链拴着强制站在某个地方，一根舌头伸进了你被开口口塞强制张开的嘴里，舌头比常人的要细要长.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*你试图把祂顶回去，但是祂的舌头始终缠在你的舌头上.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*过了段时间后，你无法抵抗祂的舌头带来的快感，高潮了.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*你突然觉得你的人生的一切都不重要了，你只想和这根舌头的主人缠绵.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*你回应了祂的吻，你得到了幸福.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*G结局：法式湿吻", Type: "Chat"} );
	}




	ServerSend("ChatRoomChat", { Content: "*[本游戏共有六个A到G七个结局，欢迎下次再来挑战别的结局，两分钟后送走哦，(exit)可以快速退出].", Type: "Emote", Target: sender.MemberNumber} );
	setTimeout(function (sender) {
		ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
	}, 120 * 1000, sender)


}

function WearEndA(sender, msg) {
	RemoveRestrains(sender, msg);
	RemoveCloth(sender, msg);

	InventoryWear(sender, "HighSecurityCollar", "ItemNeck", "Default",80,0,{
		"Item": "HighSecurityCollar",
		"Property": "Painful",
		"Lock": "",
		"Name": "对魔项圈",
		"Description": "本来能够使淫魔服从，但是却有一部分丢失了。",
		"Color": "#B9B9B9",
		"Private": false,
		"Type": null,
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});

	InventoryWear(sender, "LegBinder", "ItemLegs", "Default",80,0,{
		"Item": "LegBinder",
		"Property": "Painful",
		"Lock": "",
		"Name": "对魔绑腿器",
		"Description": "本来能够使淫魔蹒跚，但是却有一部分丢失了。",
		"Color": "#808080,#808080",
		"Private": false,
		"Type": null,
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});

	InventoryWear(sender, "MonoHeel", "ItemBoots", "Default",80,0,{
		"Item": "MonoHeel",
		"Property": "Painful",
		"Lock": "",
		"Name": "对魔单跟靴",
		"Description": "本来能够使淫魔固定，但是却有一部分丢失了。",
		"Color": "Default",
		"Private": false,
		"Type": "Half",
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});

	InventoryWear(sender, "ObedienceBelt", "ItemPelvis", "Default",80,0,{
		"Item": "ObedienceBelt",
		"Property": "Painful",
		"Lock": "",
		"Name": "对魔贞操带",
		"Description": "本来能够使淫魔痛苦，但是却有一部分丢失了。",
		"Color": "Default",
		"Private": false,
		"Type": "c3s1e0",
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});

	InventoryWear(sender, "OTNPlugGag", "ItemMouth", "Default",80,0,{
		"Item": "OTNPlugGag",
		"Property": "Painful",
		"Lock": "",
		"Name": "对魔口塞",
		"Description": "本来能够使淫魔沉默，但是却有一部分丢失了。",
		"Color": "#808080,#808080,#808080",
		"Private": false,
		"Type": null,
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});

	InventoryWear(sender, "HighSecurityStraitJacket", "ItemArms", "Default",80,0,{
		"Item": "HighSecurityStraitJacket",
		"Property": "Painful",
		"Lock": "",
		"Name": "对魔拘束衣",
		"Description": "本来能够使淫魔无力，但是却有一部分丢失了。",
		"Color": "#808080,#808080,#808080,#808080",
		"Private": false,
		"Type": "c0a1s2",
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});

	InventoryWear(sender, "SuccubusHorns", "HairAccessory1", "Default",80);
	InventoryWear(sender, "SuccubusHeartTailStrap", "TailStraps", "Default",80);
	InventoryWear(sender, "SuccubusWings", "Wings", "Default",80);
	ChatRoomCharacterUpdate(sender);


}

function WearEndB(sender, msg) {
	RemoveRestrains(sender, msg);
	RemoveCloth(sender, msg);

	InventoryWear(sender, "BodyTowel1", "Cloth", "Default",80);
	ChatRoomCharacterUpdate(sender);
}

function WearEndC(sender, msg) {
	RemoveRestrains(sender, msg);
	RemoveCloth(sender, msg);

	InventoryWear(sender, "DuctTape", "ItemLegs", "Default",80,0,{
		"Item": "DuctTape",
		"Property": "Comfy",
		"Lock": "",
		"Name": "圣骸布",
		"Description": "能一定程度上隔绝淫魔的影响",
		"Color": "#BFBFBF",
		"Private": false,
		"Type": null,
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});
	InventoryGet(sender, "ItemLegs").Property = {
		"Type": "CompleteLegs",
		"Hide": [
			"ClothLower",
			"Garters"
		],
		"Block": [
			"ItemVulva",
			"ItemVulvaPiercings",
			"ItemButt"
		],
		"Difficulty": 6,
		"HideItem": [
			"PantiesPoofyDiaper",
			"PantiesBulkyDiaper",
			"ItemPelvisPoofyDiaper",
			"ItemPelvisBulkyDiaper"
		]
	};


	InventoryWear(sender, "DuctTape", "ItemFeet", "Default",80,0,{
		"Item": "DuctTape",
		"Property": "Comfy",
		"Lock": "",
		"Name": "圣骸布",
		"Description": "能一定程度上隔绝淫魔的影响",
		"Color": "#BFBFBF",
		"Private": false,
		"Type": null,
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});
	InventoryGet(sender, "ItemFeet").Property = {
		"Type": "CompleteFeet",
		"Difficulty": 6,
		"Hide": [
			"ClothLower",
			"Shoes"
		],
		"SetPose": [
			"LegsClosed"
		]
	};


	InventoryWear(sender, "ToeTape", "ItemBoots", "Default",80,0,{
		"Item": "DuctTape",
		"Property": "Comfy",
		"Lock": "",
		"Name": "圣骸布",
		"Description": "能一定程度上隔绝淫魔的影响",
		"Color": "#BFBFBF",
		"Private": false,
		"Type": null,
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});
	InventoryGet(sender, "ItemBoots").Property = {
		"Type": "Full",
		"Difficulty": 2
	};

	InventoryWear(sender, "DuctTape", "ItemHead", "Default",80,0,{
		"Item": "DuctTape",
		"Property": "Comfy",
		"Lock": "",
		"Name": "圣骸布",
		"Description": "能一定程度上隔绝淫魔的影响",
		"Color": "#BFBFBF",
		"Private": false,
		"Type": null,
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});
	InventoryGet(sender, "ItemHead").Property = {
		"Type": "Wrap",
		"Block": [
			"ItemNose"
		],
		"Effect": [
			"BlindNormal",
			"Prone"
		]
	};

	InventoryWear(sender, "DuctTape", "ItemMouth", "Default",80,0,{
		"Item": "DuctTape",
		"Property": "Comfy",
		"Lock": "",
		"Name": "圣骸布",
		"Description": "能一定程度上隔绝淫魔的影响",
		"Color": "#BFBFBF",
		"Private": false,
		"Type": null,
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});
	InventoryGet(sender, "ItemMouth").Property = {
		"Type": "Cover",
		"Effect": [
			"BlockMouth",
			"GagMedium"
		]
	};

	InventoryWear(sender, "DuctTape", "ItemArms", "Default",80,0,{
		"Item": "DuctTape",
		"Property": "Comfy",
		"Lock": "",
		"Name": "圣骸布",
		"Description": "能一定程度上隔绝淫魔的影响",
		"Color": "#BFBFBF",
		"Private": false,
		"Type": null,
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});
	InventoryGet(sender, "ItemArms").Property ={
		"Type": "Complete",
		"SetPose": [
			"BackElbowTouch"
		],
		"Block": [
			"ItemVulva",
			"ItemButt",
			"ItemPelvis",
			"ItemTorso",
			"ItemBreast",
			"ItemNipples",
			"ItemVulvaPiercings",
			"ItemNipplesPiercings"
		],
		"HideItem": [
			"PantiesPoofyDiaper",
			"PantiesBulkyDiaper",
			"ItemPelvisPoofyDiaper",
			"ItemPelvisBulkyDiaper"
		],
		"Difficulty": 7
	};
	ChatRoomCharacterUpdate(sender);
}

function WearEndD(sender, msg) {
	RemoveRestrains(sender, msg);
	RemoveCloth(sender, msg);

	InventoryWear(sender, "DroneMask", "ItemHead", "Default",80,0,{
		"Item": "DroneMask",
		"Property": "Painful",
		"Lock": "",
		"Name": "封印面具",
		"Description": "被侵蚀者的末路",
		"Color": "Default,#202020,Default,Default,Default",
		"Private": false,
		"Type": "m0e0p0g0s0h0j0",
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});


	InventoryWear(sender, "Vacbed", "ItemDevices", "Default",80,0,{
		"Item": "Vacbed",
		"Property": "Painful",
		"Lock": "",
		"Name": "封印真空床",
		"Description": "被侵蚀者的末路",
		"Color": "Default",
		"Private": false,
		"Type": "Nohair",
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});
	ChatRoomCharacterUpdate(sender);


}

function WearEndE(sender, msg) {
	RemoveRestrains(sender, msg);
	RemoveCloth(sender, msg);

	InventoryWear(sender, "HempRope", "ItemArms", "Default",80);
	InventoryGet(sender, "ItemArms").Property = {
		"Type": "SuspensionHogtied",
		"Effect": [
			"Block",
			"Freeze",
			"Prone",
			"Suspended"
		],
		"Block": [
			"ItemHands",
			"ItemLegs",
			"ItemFeet",
			"ItemBoots"
		],
		"AllowActivityOn": [
			"ItemHands",
			"ItemLegs",
			"ItemFeet",
			"ItemBoots"
		],
		"SetPose": [
			"Hogtied"
		],
		"Difficulty": 6,
		"OverrideHeight": {
			"Height": -6,
			"Priority": 51,
			"HeightRatioProportion": 0.010000000000000009
		}
	};

}

function WearEndF(sender, msg) {
	RemoveRestrains(sender, msg);
	RemoveCloth(sender, msg);

	InventoryWear(sender, "SteelPostureCollar", "ItemNeck", "Default",80);

	InventoryWear(sender, "PonyBoots", "ItemBoots", "Default",80);

	InventoryWear(sender, "LeatherHarness", "ItemTorso", "Default",80);

	InventoryWear(sender, "PonyGag", "ItemMouth", "Default",80);
	InventoryGet(sender, "ItemMouth").Property = {
		"Type": "g2p0r0t0e1h0b1",
		"Difficulty": 7,
		"Block": [],
		"Effect": [
			"BlockMouth",
			"GagMedium"
		],
		"Hide": [],
		"HideItem": [],
		"AllowActivity": [],
		"Attribute": []
	};

	InventoryWear(sender, "LeatherArmbinder", "ItemArms", "Default",80);
	InventoryGet(sender, "ItemArms").Property = {
		"Type": "Strap",
		"Difficulty": 3
	};

	InventoryWear(sender, "RoundPiercing", "ItemNipplesPiercings", "Default",80);
	InventoryGet(sender, "ItemNipplesPiercings").Property = {
		"Type": "Weighted",
		"Difficulty": 0,
		"Effect": [
			"Wiggling"
		]
	};

	InventoryWear(sender, "HorsetailPlug", "ItemButt", "Default",80);

	ChatRoomCharacterUpdate(sender);
}

function WearEndG(sender, msg) {
	RemoveRestrains(sender, msg);
	RemoveCloth(sender, msg);

	InventoryWear(sender, "PaddedBlindfold", "ItemHead", "Default",80,0,{
		"Item": "PaddedBlindfold",
		"Property": "Painful",
		"Lock": "",
		"Name": "对魔眼罩",
		"Description": "封印淫魔的核心道具，若少了这个整个封印都无法成立",
		"Color": "Default",
		"Private": false,
		"Type": null,
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});

	InventoryWear(sender, "HighSecurityCollar", "ItemNeck", "Default",80,0,{
		"Item": "HighSecurityCollar",
		"Property": "Painful",
		"Lock": "",
		"Name": "对魔项圈",
		"Description": "本来能够使淫魔服从，但是却有一部分丢失了。",
		"Color": "#B9B9B9",
		"Private": false,
		"Type": null,
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});

	InventoryWear(sender, "LegBinder", "ItemLegs", "Default",80,0,{
		"Item": "LegBinder",
		"Property": "Painful",
		"Lock": "",
		"Name": "对魔绑腿器",
		"Description": "本来能够使淫魔蹒跚，但是却有一部分丢失了。",
		"Color": "#808080,#808080",
		"Private": false,
		"Type": null,
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});

	InventoryWear(sender, "MonoHeel", "ItemBoots", "Default",80,0,{
		"Item": "MonoHeel",
		"Property": "Painful",
		"Lock": "",
		"Name": "对魔单跟靴",
		"Description": "本来能够使淫魔固定，但是却有一部分丢失了。",
		"Color": "Default",
		"Private": false,
		"Type": "Half",
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});

	InventoryWear(sender, "ObedienceBelt", "ItemPelvis", "Default",80,0,{
		"Item": "ObedienceBelt",
		"Property": "Painful",
		"Lock": "",
		"Name": "对魔贞操带",
		"Description": "本来能够使淫魔痛苦，但是却有一部分丢失了。",
		"Color": "Default",
		"Private": false,
		"Type": "c3s1e0",
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});

	InventoryWear(sender, "OTNPlugGag", "ItemMouth", "Default",80,0,{
		"Item": "OTNPlugGag",
		"Property": "Painful",
		"Lock": "",
		"Name": "对魔口塞",
		"Description": "本来能够使淫魔沉默，但是却有一部分丢失了。",
		"Color": "#808080,#808080,#808080",
		"Private": false,
		"Type": null,
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});

	InventoryWear(sender, "HighSecurityStraitJacket", "ItemArms", "Default",80,0,{
		"Item": "HighSecurityStraitJacket",
		"Property": "Painful",
		"Lock": "",
		"Name": "对魔拘束衣",
		"Description": "本来能够使淫魔无力，但是却有一部分丢失了。",
		"Color": "#808080,#808080,#808080,#808080",
		"Private": false,
		"Type": "c0a1s2",
		"OverridePriority": null,
		"MemberName": "驱魔人",
		"MemberNumber": 0
	});
	ChatRoomCharacterUpdate(sender);

}



