
activateStoryRoom();
RemoveCloth(Player, null);
RemoveRestrains(Player, null);

InventoryWear(Player, "NurseUniform", "Cloth", null, 80);
InventoryWear(Player, "NurseCap", "Hat", null, 80);
InventoryWear(Player, "AnkleStrapShoes", "Shoes", null, 80);
InventoryWear(Player, "Stockings2", "Socks", null, 80);


InventoryWear(Player, "LatexRespirator", "ItemMouth3", null, 80);
InventoryGet(Player, "ItemMouth3").Color = ['#FFFFFF', '#FFFFFF', '#CCCCCC', '#FFFFFF', '#CCCCCC', '#FB01FF'];
InventoryGet(Player, "ItemMouth3").Property.TypeRecord = { f: 3, g: 1, s: 1, m: 0, l: 1 };

InventoryWear(Player, "DroneMask", "ItemHead", null, 80);
InventoryGet(Player, "ItemHead").Color = ['#FFFFFF', '#CCCCCC', '#7F7F7F', '#00F4FD', '#E700CA'];
InventoryGet(Player, "ItemHead").Property.TypeRecord = { "m": 0, "e": 0, "p": 5, "g": 0, "s": 1, "h": 0, "j": 2 };
InventoryGet(Player, "ItemHead").Property.Text = "Nurse";
InventoryGet(Player, "ItemHead").Property.Hide = ['Blush'];
InventoryGet(Player, "ItemHead").Property.OverridePriority = 12;


InventoryWear(Player, "TheDisplayFrame", "ItemDevices", "Default", 80);
InventoryLock(Player, "ItemDevices", { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
InventoryGet(Player, "ItemDevices").Property.CombinationNumber = "7092";

ChatRoomCharacterUpdate(Player);

Player.Description = `

BOT game：HypnosisHospital
作者: zajucd(7092)
原型: https://github.com/keykey5/BC-BOT-repository
发布地址: https://github.com/zajucd/BC_BotGame

是的，我小时候被自己的替身拽着四处飞，所以设计出来了这个沟槽的飞来飞去的bot
高额无偿悬赏不靠牵绳移动其它玩家位置的方法
` // end of description
ServerSend("AccountUpdate", { Description: Player.Description });
ChatRoomCharacterUpdate(Player)

function activateStoryRoom() {
	StartSet();
	resetRoom();
	storyActive = true
}

function deactivateStoryRoom() {
	resetRoom();
	storyActive = false
}

function RemoveCloth(sender, msg) {
	InventoryRemove(sender, "Cloth");
	InventoryRemove(sender, "ClothLower");
	InventoryRemove(sender, "ClothAccessory");
	InventoryRemove(sender, "Suit");
	InventoryRemove(sender, "SuitLower");
	InventoryRemove(sender, "Gloves");
	InventoryRemove(sender, "Shoes");
	InventoryRemove(sender, "Hat");
	InventoryRemove(sender, "Necklace");
	InventoryRemove(sender, "RightAnklet");
	InventoryRemove(sender, "LeftAnklet");
	InventoryRemove(sender, "Mask");
	InventoryRemove(sender, "Socks");
	InventoryRemove(sender, "Bra");
	InventoryRemove(sender, "Panties");
	InventoryRemove(sender, "Corset");
	InventoryRemove(sender, "HairAccessory1")
	InventoryRemove(sender, "HairAccessory2")
	InventoryRemove(sender, "HairAccessory3")
	InventoryRemove(sender, "TailStraps")
	InventoryRemove(sender, "Wings")
	ChatRoomCharacterUpdate(sender);
}

//脱掉所有装备
function RemoveRestrains(sender, msg) {

	InventoryRemove(sender, "ItemVulva")
	InventoryRemove(sender, "ItemVulvaPiercings")
	InventoryRemove(sender, "ItemButt")
	InventoryRemove(sender, "ItemArms")
	InventoryRemove(sender, "ItemHands")
	InventoryRemove(sender, "ItemNeck")
	InventoryRemove(sender, "ItemMouth")
	InventoryRemove(sender, "ItemMouth2")
	InventoryRemove(sender, "ItemMouth3")
	InventoryRemove(sender, "ItemTorso")
	InventoryRemove(sender, "ItemBreast")
	InventoryRemove(sender, "ItemLegs")
	InventoryRemove(sender, "ItemFeet")
	InventoryRemove(sender, "ItemBoots")
	InventoryRemove(sender, "ItemNipples")
	InventoryRemove(sender, "ItemNipplesPiercings")
	InventoryRemove(sender, "ItemPelvis")
	InventoryRemove(sender, "ItemHead")
	InventoryRemove(sender, "ItemDevices")
	InventoryRemove(sender, "ItemEars")
	ChatRoomCharacterUpdate(sender);
}

ChatRoomMessageAdditionDict["HypnosisHospital"] = function (SenderCharacter, msg, data) {ChatRoomMessageHypnosisHospital(SenderCharacter, msg, data)}

function ChatRoomMessageHypnosisHospital(SenderCharacter, msg, data) {
	if (SenderCharacter.MemberNumber == Player.MemberNumber) {
		return;
	}
	if (storyActive) {
		let index = playersFailed.indexOf(SenderCharacter);
		if ((data.Type == "Action") && (msg.startsWith("ServerEnter"))) {
			setTimeout(PlayerEnter(SenderCharacter), 300, SenderCharacter);
		}
		else if ((msg.startsWith("ServerLeave")) || (msg.startsWith("ServerDisconnect")) || (msg.startsWith("ServerBan")) || (msg.startsWith("ServerKick"))) {
			
			if (index >= 0) {
				playersFailed.splice(index, 1);
			}
			resetRoom();
		}
		else if ((data.Type == "Emote") || (data.Type == "Action") || (data.Type == "Hidden" && msg.startsWith("ChatRoomBot"))) {
			if (msg.toLowerCase().includes("exit")) {
				setTimeout(function (SenderCharacter) {
					ChatRoomAdminChatAction("Kick", SenderCharacter.MemberNumber.toString())
				}, 3 * 1000, SenderCharacter);
			}
			if (index < 0) {
				commandHandler(SenderCharacter, msg);
			}
			
		}
	}
}

async function PlayerEnter(sender) {
	var playable = true;
	await Teleport(sender, 20, 38);
	ServerSend("ChatRoomCharacterMapDataUpdate", { X: sender.MapData.Pos.X - 1, Y: sender.MapData.Pos.Y - 1 });
	ServerSend("ChatRoomChat", { Content: "*该bot现已发布至 https://github.com/zajucd/BC_BotGame ", Type: "Emote" });
	if (isExposed(sender) || sender.IsRestrained() || sender.IsChaste() || sender.IsShackled() || sender.IsBlind() || !sender.CanTalk() || sender.IsEnclose() || sender.IsMounted() || sender.IsEgged() || sender.IsDeaf()) {
		ServerSend("ChatRoomChat", {
			Content: "*[需要 穿着衣服且不被束缚 才能游玩.]",
			Type: "Emote"
		});
		playable = false;
	}
	if (sender.ItemPermission > 2) {
		ServerSend("ChatRoomChat", {
			Content: "*[需要调低 玩家权限 才能游玩.]",
			Type: "Emote"
		});
		playable = false;
	}
	if (InventoryBlockedOrLimitedCustomized(sender, AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock"))) {
		ServerSend("ChatRoomChat", {
			Content: "*[需要 组合密码锁（COMBINATION PADLOCK）的权限 才能游玩.]",
			Type: "Emote"
		});
		playable = false;
	}
	resetRoom();
	ServerSend("ChatRoomChat", {
		Content: "*This is a Chinese room,make sure you can read Chinese before start.",
		Type: "Emote"
	});
	ServerSend("ChatRoomChat", {
		Content: "*你本来想无视这个招聘医疗实验体的广告的，可是他实在是给的太多了，回过神来后你已经站在医院的大门前了.总之先进去看看吧.",
		Type: "Emote"
	});
	ServerSend("ChatRoomChat", {
		Content: "*[NOTE:通过发送 *单词 来行动（例：*think）,游戏中可以使用 (think)来显示当前状态，使用(check)来观察当前的房间.且一切在括号内的单词均可用于行动]",
		Type: "Emote"
	});
	ServerSend("ChatRoomChat", {
		Content: "*[NOTE:如果被bot卡住，发送任意行动来重置bot位置]",
		Type: "Emote"
	});
}


async function Teleport(sender, x, y) {
	playerCanAction = false; 

	var loc = Player.MapData.Pos;
	var sleepTime = 150
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
	InventoryRemove(sender, "CollarLeash");
	ChatRoomCharacterUpdate(sender);
	await sleep(sleepTime);
	ServerSend("ChatRoomCharacterMapDataUpdate", { X: 39, Y: 39 });

	playerCanAction = true;
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

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function ChatRoomMapViewSyncMapData(data) {

	// Exits if the packet is invalid
	if (!CommonIsObject(data) || (data.MemberNumber == null) || (typeof data.MemberNumber != "number")) return;
	if (!CommonIsObject(data.MapData) || (data.MapData.X == null) || (typeof data.MapData.X != "number") || (data.MapData.Y == null) || (typeof data.MapData.Y != "number")) return;

	// Assigns the MapData to the chatroom character
	for (let C of ChatRoomCharacter)
		if ((C.MemberNumber == data.MemberNumber) && !C.IsPlayer()) {
			C.MapData = ChatRoomMapViewInitializeCharacter(C);
			C.MapData.Pos = { X: data.MapData.X, Y: data.MapData.Y };
			if (playerCanAction) {
				PlayerMoved(C);
			}
			break;
		}



}
function commandHandler(sender, msg) {
	if (playerCanAction === true) {
		if (msg.toLowerCase().includes("think")) {
			ServerSend("ChatRoomCharacterMapDataUpdate", { X: sender.MapData.Pos.X - 1, Y: sender.MapData.Pos.Y - 1 });
			Think(sender);
			return;
		}
		let isFound = false;
		areasList.forEach((area, index) => {
			if (IsInsideArea(area, sender)) {
				isFound = true;
				if (msg.toLowerCase().includes("check")) {
					ServerSend("ChatRoomCharacterMapDataUpdate", { X: sender.MapData.Pos.X - 1, Y: sender.MapData.Pos.Y - 1 });
					ShowAreaCheckText(area, sender);
					return;
				}
				area.movements.forEach((movement) => {
					if (msg.toLowerCase().includes(movement.name)) {
						ServerSend("ChatRoomCharacterMapDataUpdate", { X: sender.MapData.Pos.X - 1, Y: sender.MapData.Pos.Y - 1 });
						movement.func(sender);
					}
				})
				return
			}
		});
		if (isFound === false) {
			ServerSend("ChatRoomChat", {
				Content: "*换个地方检查吧",
				Type: "Emote"
			});
		}
	}
	
}

function PlayerMoved(sender) {
	let index = playersFailed.indexOf(sender);
	if (index >= 0) {
		return;
	}
	areasList.forEach((area,index) => {
		if (IsInsideArea(area, sender)) {
			//第一次进入区域时显示检查文本
			if (areasEntered[index] != true) {
				areasEntered[index] = true;
				ServerSend("ChatRoomCharacterMapDataUpdate", { X: sender.MapData.Pos.X - 1, Y: sender.MapData.Pos.Y - 1 });
				ShowAreaCheckText(area, sender);
			}
			//位于事件点上时触发事件
			area.eventPoints.forEach((point) => {
				if (sender.MapData.Pos.X === point.Pos.X && sender.MapData.Pos.Y === point.Pos.Y) {
					if (sender.MapData.Pos.X - 1 <= 0) {
						ServerSend("ChatRoomCharacterMapDataUpdate", { X: sender.MapData.Pos.X + 1, Y: sender.MapData.Pos.Y - 1 });
					}
					else {
						ServerSend("ChatRoomCharacterMapDataUpdate", { X: sender.MapData.Pos.X - 1, Y: sender.MapData.Pos.Y - 1 });
					}
					point.func(sender);
				}
			});
			return;
		}
	});
}

/**
 * 判断玩家是否在区域内
 * @param {any} area
 * @param {any} sender
 * @returns
 */
function IsInsideArea(area, sender) {
	var x = sender.MapData.Pos.X;
	var y = sender.MapData.Pos.Y;
	if (x >= area.left && x <= area.right && y >= area.up && y <= area.down) {
		return true;
	}
	return false;
}
/**
 * 显示区域检查文本
 * @param {any} area
 * @param {any} sender
 */
function ShowAreaCheckText(area,sender) {
	ServerSend("ChatRoomChat", {
		Content: "*" + area.checkTextList[0],
		Type: "Emote"
	});
	if (area.textCondition === null) {
		if (hypnosisTime >= 1) {
			ServerSend("ChatRoomChat", {
				Content: "*" + area.checkTextList[1],
				Type: "Emote"
			});
		}
	}
	else {
		if (area.textCondition) {
			ServerSend("ChatRoomChat", {
				Content: "*" + area.checkTextList[1],
				Type: "Emote"
			});
		}
		else {
			ServerSend("ChatRoomChat", {
				Content: "*" + area.checkTextList[2],
				Type: "Emote"
			});
		}
		
	}
}

function Think(sender) {
	let isFound = false;
	areasList.forEach((area) => {
		if (IsInsideArea(area, sender)) {
			isFound = true;
			ServerSend("ChatRoomChat", {
				Content: "*当前位置：" + area.areaName,
				Type: "Emote"
			});
			ServerSend("ChatRoomChat", {
				Content: "*经过天数：" + dayPassed,
				Type: "Emote"
			});
			ServerSend("ChatRoomChat", {
				Content: "*手术次数：" + treatmentTime,
				Type: "Emote"
			});
			ServerSend("ChatRoomChat", {
				Content: "*催眠次数：" + hypnosisTime,
				Type: "Emote"
			});
			if (sender.MapData.PrivateState.HasKeyBronze === true) {
				ServerSend("ChatRoomChat", {
					Content: "*已获得本我之钥",
					Type: "Emote"
				});
			}
			if (sender.MapData.PrivateState.HasKeySilver === true) {
				ServerSend("ChatRoomChat", {
					Content: "*已获得自我之钥",
					Type: "Emote"
				});
			}
			if (sender.MapData.PrivateState.HasKeyGold === true) {
				ServerSend("ChatRoomChat", {
					Content: "*已获得超我之钥",
					Type: "Emote"
				});
			}
			return;
		}
		
	});
	if (isFound === false) {
		ServerSend("ChatRoomChat", {
			Content: "*换个地方思考吧",
			Type: "Emote"
		});
	}
	
}

/**
 * 日期结束送至病房或处理结局
 * @param {any} sender
 */
async function DayEnd(sender) {
	playerCanAction = false;
	if (dayPassed === 10) {
		await Teleport(sender, 38, 15);
		InventoryWear(sender, "InteractiveVRHeadset", "ItemHead", "Default", 80);
		InventoryLock(sender, InventoryGet(sender, "ItemHead"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
		InventoryGet(sender, "ItemHead").Property.CombinationNumber = lockCode;

		InventoryWear(sender, "FuturisticHelmet", "ItemHood", "Default", 80);
		InventoryLock(sender, InventoryGet(sender, "ItemHood"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
		InventoryGet(sender, "ItemHood").Property.CombinationNumber = lockCode;

		InventoryWear(sender, "BondageBench", "ItemDevices", "Default", 80);
		InventoryLock(sender, InventoryGet(sender, "ItemDevices"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
		InventoryGet(sender, "ItemDevices").Property.CombinationNumber = lockCode;
		InventoryGet(sender, "ItemDevices").Property.TypeRecord = { typed: 3 };

		ChatRoomCharacterUpdate(sender);

		ServerSend("ChatRoomCharacterMapDataUpdate", { X: sender.MapData.Pos.X - 1, Y: sender.MapData.Pos.Y - 1 });

		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*你在醒来发现自己被绑在手术室的手术台上.",
			Type: "Emote"
		});

		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*医生:实验结束了，现在要反向对你进行改造以回归正常状态.",
			Type: "Emote"
		});

		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*医生按了下手中的遥控器，你突然开始猛烈的高潮.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*高潮持续的时间异常的长，你在这一过程中反复失去意识又醒来.",
			Type: "Emote"
		});
		await sleep(8000);
		ServerSend("ChatRoomChat", {
			Content: "*待你回复清醒时，已经站在了医院门口.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*接待员:要走了吗?下次再来哦.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*要再来吗?.",
			Type: "Emote"
		});
		ToEnd(sender, 7);
	}
	else {
		await sleep(100);
		await Teleport(sender, 23, 26);
		await sleep(100);
		ServerSend("ChatRoomCharacterMapDataUpdate", { X: sender.MapData.Pos.X - 1, Y: sender.MapData.Pos.Y - 1 });
		WearRestrainsByDay(sender);
		if (hypnosisTime === 1) {
			ChatRoomData.MapData.Tiles = SetCharIn40x40String(ChatRoomData.MapData.Tiles, 13, 21, 110);
			UpdateRoom(ChatRoomData);
			areasEntered[2] = false;
		}
	}

	playerCanAction = true;
}

async function WearRestrainsByDay(sender) {
	removeRestrains(sender);
	removeClothes(sender);
	InventoryWear(sender, "FuturisticCollar", "ItemNeck", "Default", 80);
	InventoryLock(sender, InventoryGet(sender, "ItemNeck"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
	InventoryGet(sender, "ItemNeck").Property.CombinationNumber = lockCode;

	InventoryWear(sender, "ElectronicTag", "ItemNeckAccessories", "Default", 80);
	InventoryGet(sender, "ItemNeckAccessories").Property = { Effect: Array(0), Text: "____" };
	InventoryLock(sender, InventoryGet(sender, "ItemNeckAccessories"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
	InventoryGet(sender, "ItemNeckAccessories").Property.CombinationNumber = lockCode;
	if (dayPassed >= 1) {
		InventoryWear(sender, "FuturisticChastityBelt", "ItemPelvis", "Default", 80);
		ChatRoomCharacterUpdate(sender);
		await sleep(100);
		InventoryLock(sender, InventoryGet(sender, "ItemPelvis"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
		InventoryGet(sender, "ItemPelvis").Property.CombinationNumber = lockCode;
		InventoryGet(sender, "ItemPelvis").Property.TypeRecord = { m: 3, f: 1, b: 1, t: 2, o: 1 };
		InventoryGet(sender, "ItemPelvis").Color = ['#FFFFFF', '#242424', 'Default', 'Default', 'Default', 'Default', '#222222', 'Default', 'Default'];
		
	}
	if (dayPassed >= 2) {
		InventoryWear(sender, "HighSecurityStraitJacket", "ItemArms", "Default", 80);
		InventoryLock(sender, InventoryGet(sender, "ItemArms"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
		InventoryGet(sender, "ItemArms").Property.CombinationNumber = lockCode;
		InventoryGet(sender, "ItemArms").Property.TypeRecord = { c: 0, a: 1, s: 2 };
		InventoryGet(sender, "ItemArms").Color = ["#bbbbbb", "#bbbbbb", "#bbbbbb", "#bbbbbb", "#bbbbbb"];
	}
	if (dayPassed >= 3) {
		InventoryWear(sender, "OTNPlugGag", "ItemMouth3", "Default", 80);
		InventoryLock(sender, InventoryGet(sender, "ItemMouth3"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
		InventoryGet(sender, "ItemMouth3").Property.CombinationNumber = lockCode;
		InventoryGet(sender, "ItemMouth3").Property.TypeRecord = { typed: 0 };
		InventoryGet(sender, "ItemMouth3").Color = ["#FFFFFF", "#FFFFFF", "#FFFFFF"];
	}
	if (dayPassed >= 4) {
		InventoryWear(sender, "StrictPonyBoots", "ItemBoots", "Default", 80);
		InventoryLock(sender, InventoryGet(sender, "ItemBoots"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
		InventoryGet(sender, "ItemBoots").Property.CombinationNumber = lockCode;
		InventoryGet(sender, "ItemBoots").Property.TypeRecord = { typed: 0 };
		InventoryGet(sender, "ItemBoots").Color = ['#FFFFFF', '#FFFFFF', 'Default', '#aa80aa', '#FFFFFF', 'Default', 'Default', '#FFFFFF'];
	}
	ServerSend("ChatRoomChat", {
		Content: "*你在自己的病房上醒来.",
		Type: "Emote"
	});
	if (treatmentTime >= 1) {
		ServerSend("ChatRoomChat", {
			Content: "*改造过程中的快感依旧残留在你的身体里，使你一直处于发情状态.",
			Type: "Emote"
		});
		if (treatmentTime >= 3) {
			ServerSend("ChatRoomChat", {
				Content: "*好舒服好舒服好舒服，还想改造还想改造还想改造.",
				Type: "Emote"
			});
		}
		if (hypnosisTime >= 3) {
			ServerSend("ChatRoomChat", {
				Content: "*还想做，那个梦，催眠，想要催眠.",
				Type: "Emote"
			});
		}
	}
	ChatRoomCharacterUpdate(sender);
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
async function ToEnd(sender, type) {

	resetRoom();
	switch (type) {
		case 1: {

			InventoryRemove(sender, "ItemDevices");
			ChatRoomCharacterUpdate(sender);
			await sleep(300);

			let point = FindFreeFailPoint();
			playersFailed.push(sender);
			await Teleport(sender, point.X, point.Y);
			
			InventoryWear(sender, "TheDisplayFrame", "ItemDevices", "Default", 80);
			InventoryLock(sender, "ItemDevices", { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
			InventoryGet(sender, "ItemDevices").Property.CombinationNumber = lockCode;
			ChatRoomCharacterUpdate(sender);
			ServerSend("ChatRoomCharacterMapDataUpdate", { X: sender.MapData.Pos.X - 1, Y: sender.MapData.Pos.Y - 1 });
			ServerSend("ChatRoomChat", {
				Content: "*结局:朝闻道  得到了情报但付出了代价，必可活用于下一次.",
				Type: "Chat"
			});
		}
			break;
		case 2: {

			InventoryRemove(sender, "ItemDevices");
			ChatRoomCharacterUpdate(sender);
			await sleep(300);

			let point = FindFreeFailPoint();
			playersFailed.push(sender);
			await Teleport(sender, point.X, point.Y);
			

			InventoryWear(sender, "FuturisticCrate", "ItemDevices", "Default", 80);
			ChatRoomCharacterUpdate(sender);
			await sleep(100);
			try {
				InventoryLock(sender, "ItemDevices", { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
				InventoryGet(sender, "ItemDevices").Property.CombinationNumber = lockCode;
				InventoryGet(sender, "ItemDevices").Property.TypeRecord = { "w": 2, "l": 3, "a": 3, "d": 0, "t": 1, "h": 4 };
			}
			catch {

			}
			ChatRoomCharacterUpdate(sender);

			ServerSend("ChatRoomCharacterMapDataUpdate", { X: sender.MapData.Pos.X - 1, Y: sender.MapData.Pos.Y - 1 });
			ServerSend("ChatRoomChat", {
				Content: "*结局:残缺  说不定需要潜得更深才能更进一步.",
				Type: "Chat"
			});
		}
			break;
		case 3: {

			InventoryRemove(sender, "ItemDevices");
			ChatRoomCharacterUpdate(sender);
			await sleep(300);

			let point = FindFreeFailPoint();
			playersFailed.push(sender);
			await Teleport(sender, point.X, point.Y);

			InventoryWear(sender, "FuturisticCrate", "ItemDevices", "Default", 80);
			ChatRoomCharacterUpdate(sender);
			await sleep(100);
			try {
				InventoryLock(sender, "ItemDevices", { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
				InventoryGet(sender, "ItemDevices").Property.CombinationNumber = lockCode;
				InventoryGet(sender, "ItemDevices").Property.TypeRecord = { "w": 2, "l": 3, "a": 3, "d": 0, "t": 1, "h": 4 };
			}
			catch {

			}
			ChatRoomCharacterUpdate(sender);

			ServerSend("ChatRoomCharacterMapDataUpdate", { X: sender.MapData.Pos.X - 1, Y: sender.MapData.Pos.Y - 1 });
			ServerSend("ChatRoomChat", {
				Content: "*结局:盈满  你到达了盈满，但这并非真正的结局.",
				Type: "Chat"
			});
		}
			break;
		case 4: {
			InventoryRemove(sender, "ItemDevices");
			ChatRoomCharacterUpdate(sender);
			await sleep(300);

			let point = FindFreeFailPoint();
			playersFailed.push(sender);
			await Teleport(sender, point.X, point.Y);

			InventoryWear(sender, "FuturisticCrate", "ItemDevices", "Default", 80);
			ChatRoomCharacterUpdate(sender);
			await sleep(100);
			try {
				InventoryLock(sender, "ItemDevices", { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
				InventoryGet(sender, "ItemDevices").Property.CombinationNumber = lockCode;
				InventoryGet(sender, "ItemDevices").Property.TypeRecord = { "w": 2, "l": 3, "a": 3, "d": 0, "t": 1, "h": 4 };
			}
			catch {

			}
			ChatRoomCharacterUpdate(sender);

			ServerSend("ChatRoomCharacterMapDataUpdate", { X: sender.MapData.Pos.X - 1, Y: sender.MapData.Pos.Y - 1 });
			ServerSend("ChatRoomChat", {
				Content: "*结局:样本 时间太紧了? 去那个地方找更多的情报吧.",
				Type: "Chat"
			});
		}
			break;
		case 5: {
			await Teleport(sender, 20, 37);
			ServerSend("ChatRoomCharacterMapDataUpdate", { X: sender.MapData.Pos.X - 1, Y: sender.MapData.Pos.Y - 1 });
			ServerSend("ChatRoomChat", {
				Content: "*结局:逃出升天 神秘的组织怎么看都不靠谱吧.",
				Type: "Chat"
			});
		}
			break;
		case 6: {
			let point = FindFreeFailPoint();
			playersFailed.push(sender);
			await Teleport(sender, point.X, point.Y);
			ServerSend("ChatRoomCharacterMapDataUpdate", { X: sender.MapData.Pos.X - 1, Y: sender.MapData.Pos.Y - 1 });
			ServerSend("ChatRoomChat", {
				Content: "*结局:回归  潜得太深也不是什么好事呢.",
				Type: "Chat"
			});
		}
			break;
		case 7: {
			InventoryRemove(sender, "ItemDevices");
			ChatRoomCharacterUpdate(sender);
			await sleep(300);

			await Teleport(sender, 20, 37);
			ServerSend("ChatRoomCharacterMapDataUpdate", { X: sender.MapData.Pos.X - 1, Y: sender.MapData.Pos.Y - 1 });
			ServerSend("ChatRoomChat", {
				Content: "*结局:完成 嗯,结束了,但是还留有很多疑点.",
				Type: "Chat"
			});
		}
			break;
	}
	ServerSend("ChatRoomChat", {
		Content: "*如果有需要,可以使用退出(exit).",
		Type: "Chat"
	});
}
function FindFreeFailPoint() {
	let result;
	FailedAreas.forEach((point) => {
		let used = false;
		playersFailed.forEach((player) => {
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

const areaEntranceRoom = {
	"up": 32, "left": 16, "down": 34, "right": 22,
	"areaName" : "前台",
	"checkTextList": ["这里是前台，空间并不算宽广，但是很整洁.接待员就在桌子后看着你，或许你可以和她谈谈(talk),话说回来，真的有接待员会被装在金属框架里面吗?"],
	"textCondition": null,
	"movements": [{ "name": "talk", "func": window["EntranceRoomTalk"] }, { "name": "sign", "func": window["EntranceRoomSign"] }],
	"eventPoints" :[],
};
/**
 * 与接待员对话 指示sign行动
 * @param {any} sender
 */
function EntranceRoomTalk(sender) {
	if (dayPassed === 0) {
		ServerSend("ChatRoomChat", {
			Content: "*虽然接待员被装在金属框架里一动不动，但是从框架上挂着的讲话器中传出的声音却很有精神.",
			Type: "Emote"
		});
		ServerSend("ChatRoomChat", {
			Content: "*接待员:您好呀，您就是来应聘医疗实验体的新人吧！太好了，医生因为实验体不够眉毛皱的一天比一天紧了呢.只要在这个合同上签字(sign)并戴上旁边的项圈就可以了.这个实验又安全又轻松的,基本躺着过十天就好了.",
			Type: "Emote"
		});
	}
	else {
		ServerSend("ChatRoomChat", {
			Content: "*接待员:诶？专门来找我聊天吗？好高兴！话说你有没有听说过这家医院的传闻啊，说是突然有一天患者全都变成植物人了呢.",
			Type: "Emote"
		});
		ServerSend("ChatRoomChat", {
			Content: "*接待员:还有还有，这家医院在被收购之前前一任院长一直在拿患者做不可描述的事呢.",
			Type: "Emote"
		});
		ServerSend("ChatRoomChat", {
			Content: "*接待员:医生姐姐一直摆着一副臭脸呢，明明每天都能拿可爱的孩子做实验.",
			Type: "Emote"
		});

	}
}
/**
 * 打开向内的门
 * @param {any} sender
 */
function EntranceRoomSign(sender) {
	let playable = true;
	if (isExposed(sender) || sender.IsRestrained() || sender.IsChaste() || sender.IsShackled() || sender.IsBlind() || !sender.CanTalk() || sender.IsEnclose() || sender.IsMounted() || sender.IsEgged() || sender.IsDeaf()) {
		ServerSend("ChatRoomChat", {
			Content: "*[需要 穿着衣服且不被束缚 才能游玩.]",
			Type: "Emote"
		});
		playable = false;
	}
	if (sender.ItemPermission > 2) {
		ServerSend("ChatRoomChat", {
			Content: "*[需要调低 玩家权限 才能游玩.]",
			Type: "Emote"
		});
		playable = false;
	}
	if (InventoryBlockedOrLimitedCustomized(sender, AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock"))) {
		ServerSend("ChatRoomChat", {
			Content: "*[需要 组合密码锁（COMBINATION PADLOCK）的权限 才能游玩.]",
			Type: "Emote"
		});
		playable = false;
	}
	if (playable === false) {
		ServerSend("ChatRoomChat", {
			Content: "*接待员:不不不不可以这么不像样子啦！快去把衣服穿好！.",
			Type: "Emote"
		});
		return;
	}

	//穿戴项圈
	InventoryWear(sender, "FuturisticCollar", "ItemNeck", "Default", 80);
	InventoryLock(sender, InventoryGet(sender, "ItemNeck"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
	InventoryGet(sender, "ItemNeck").Property.CombinationNumber = lockCode;

	InventoryWear(sender, "ElectronicTag", "ItemNeckAccessories", "Default", 80);
	InventoryGet(sender, "ItemNeckAccessories").Property = { Effect: Array(0), Text: "____" };
	InventoryLock(sender, InventoryGet(sender, "ItemNeckAccessories"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
	InventoryGet(sender, "ItemNeckAccessories").Property.CombinationNumber = lockCode;
	ChatRoomCharacterUpdate(sender);

	ServerSend("ChatRoomChat", {
		Content: "*光是看完合同的前两页你的眼皮就开始打架了，所以你直接翻到最后一页签了字，然后戴上了那个项圈.",
		Type: "Emote"
	});
	ServerSend("ChatRoomChat", {
		Content: "*接待员:谢谢谢谢欢迎欢迎！那么请从内侧的门进去，经过候诊大厅进入走廊，到北方向的手术室去找医生，对了我这个角度看不到门有没有打开，要是没有的话就重新签一下字(sign)吧.",
		Type: "Emote"
	});
	//出现门，并更新房间
	ChatRoomData.MapData.Objects = SetCharIn40x40String(ChatRoomData.MapData.Objects, 18, 31, 4020);
	UpdateRoom(ChatRoomData);
	ServerSend("ChatRoomChat", {
		Content: "*咔哒一声，一扇门出现在了北面的墙上.",
		Type: "Emote"
	});

	
}


const areaWaitingRoom = {
	"up": 24, "left": 26, "down": 34, "right": 33,
	"areaName": "候诊大厅",
	"checkTextList": ["这里是候诊大厅，大约可以容纳20余人，只是现在空无一人. 北侧通向走廊.", "你意识到有些奇怪，为什么你在这家医院里哪怕一个患者也没有见到过."],
	"textCondition": null,
	"movements": [],
	"eventPoints": [],
};


const areaHallWay = {
	"up": 20, "left": 14, "down": 22, "right": 39,
	"areaName": "走廊",
	"checkTextList": ["这里是走廊，白色的墙壁，白色的天花版，白色的地板，白色的灯光，白色的医护人员，白色. 西北侧通向花园，北侧通向手术室，西南侧通向病房，东南侧通向心理治疗室.", "西侧通往......什么地方?"],
	"textCondition": null,
	"movements": [],
	"eventPoints": [],
};


const areaTreatmentRoom = {
	"up": 12, "left": 26, "down": 18, "right": 39,
	"areaName": "手术室",
	"checkTextList": ["这里是手术室，压抑的环境让你喘不过气来，玻璃后是手术台，摆满了各种叫不出名字但令人发毛的手术工具.", "医生坐在办公桌后翻看着卷宗，她没有注意到你，或许你可以和她谈谈(talk).", "医生离开了，但估计很快就会回来，要做什么的话最好抓紧时间."],
	"textCondition": doctorExist,
	"movements": [{ "name": "talk", "func": window["TreatmentRoomTalk"] }, { "name": "liedown", "func": window["TreatmentRoomLiedown"] }, { "name": "potting", "func": window["TreatmentRoomPotting"] }, { "name": "distract", "func": window["TreatmentRoomDistract"] }, { "name": "accident", "func": window["TreatmentRoomAccident"] }],
	"eventPoints": [{ "Pos": { "X": 38, "Y": 15 }, "func": window["TreatmentRoomBed"] }],
};
/**
 * 与医生对话 指示liedown行动
 * @param {any} sender
 */
function TreatmentRoomTalk(sender) {
	if (dayPassed === 0) {
		ServerSend("ChatRoomChat", {
			Content: "*在你叫了她第三声后，医生终于抬头看向你.",
			Type: "Emote"
		});
		ServerSend("ChatRoomChat", {
			Content: "*医生:新来的实验体?总算来了.",
			Type: "Emote"
		});
		ServerSend("ChatRoomChat", {
			Content: "*医生:总之我给你说明一下实验的流程.实验共为期十天，在这十天中我们将对你进行一定程度的身体改造与催眠并观察你的反应，实验期间可能会有幻觉、幻听之类的症状。如果出现的话记得跟我反馈.",
			Type: "Emote"
		});
		ServerSend("ChatRoomChat", {
			Content: "*医生:身体改造或催眠每天进行一次，不过也可以不进行，在你的病床上睡大觉就行了.",
			Type: "Emote"
		});
	}
	if (hypnosisTime >= 1) {
		ServerSend("ChatRoomChat", {
			Content: "*医生:走廊的深处有没见过的房间?这大概是我提到的实验期间的幻觉，既然如此你去尝试调查一下那个房间，这也是实验的一部分.",
			Type: "Emote"
		});
	}
	ServerSend("ChatRoomChat", {
		Content: "*医生:要进行身体改造的话就到里面的手术床上躺下(liedown),催眠的话去走廊东南的房间找治疗师.",
		Type: "Emote"
	});
}
/**
 * 检查盆栽 不在盆栽间或医生未被支开则无法执行 打开前方隐藏房间的门
 * @param {any} sender
 */
async function TreatmentRoomPotting(sender) {
	if (doctorExist) {
		ServerSend("ChatRoomChat", {
			Content: "*医生:别动我的盆栽.",
			Type: "Emote"
		});
	}
	else {
		ServerSend("ChatRoomChat", {
			Content: "*你发现盆栽之间的墙上有个隐蔽的按钮，你按了一下后一扇门出现了.",
			Type: "Emote"
		});
		ChatRoomData.MapData.Objects = SetCharIn40x40String(ChatRoomData.MapData.Objects, 30, 11, 4020);
		UpdateRoom(ChatRoomData)
	}
}
/**
 * 在床上躺下 不在床上无法执行 进行一次手术
 * @param {any} sender
 */
function TreatmentRoomLiedown(sender) {
	if (sender.MapData.Pos.X === 38 && sender.MapData.Pos.Y === 15) {
		if (doctorExist) {
			
			DoTreatment(sender);
		}
		else {
			ServerSend("ChatRoomChat", {
				Content: "*医生不在，你只能干躺着.",
				Type: "Emote"
			});
		}
	}
	else {
		if (doctorExist) {
			ServerSend("ChatRoomChat", {
				Content: "*医生:要做改造到里面的手术台上躺着，躺地板上是要干啥?",
				Type: "Emote"
			});
		}
		else {
			ServerSend("ChatRoomChat", {
				Content: "*你觉得有点尴尬，于是又起来了.",
				Type: "Emote"
			});
		}
		
	}
}
/**
 * 执行手术
 * @param {any} sender
 */
async function DoTreatment(sender) {
	playerCanAction = false;

	ServerSend("ChatRoomChat", {
		Content: "*医生:那么开始执行改造.",
		Type: "Emote"
	});

	await sleep(3000);

	InventoryWear(sender, "InteractiveVRHeadset", "ItemHead", "Default", 80);
	InventoryLock(sender, InventoryGet(sender, "ItemHead"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
	InventoryGet(sender, "ItemHead").Property.CombinationNumber = lockCode;

	InventoryWear(sender, "FuturisticHelmet", "ItemHood", "Default", 80);
	InventoryLock(sender, InventoryGet(sender, "ItemHood"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
	InventoryGet(sender, "ItemHood").Property.CombinationNumber = lockCode;

	InventoryWear(sender, "BondageBench", "ItemDevices", "Default", 80);
	InventoryLock(sender, InventoryGet(sender, "ItemDevices"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
	InventoryGet(sender, "ItemDevices").Property.CombinationNumber = lockCode;
	InventoryGet(sender, "ItemDevices").Property.TypeRecord = { typed: 3 };

	ChatRoomCharacterUpdate(sender);

	

	if (treatmentTime === 0) {
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*医生用绑带把你束缚在手术台上.并带上了一个头盔.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*头盔的眼罩部分开始发光，这光让你浑身发热.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*有数个冰凉的细棒伸进了你的下体，似乎是某种机械臂.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*机械臂有的在抽插，有的在震动，有的顶住你的敏感处不断旋转.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*机械臂不断刺激着你，在你感觉将要高潮时，你意识到了异样,快感仍然在积累.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*无法通过高潮来释放的快感逐渐积累到了你无法承受的程度，你的意识开始模糊.",
			Type: "Emote"
		});
	}
	else if (treatmentTime <= 3) {
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*医生依旧按照流程对你进行改造.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*快感仍然在不断积累，但高潮却无法到来，你的意识开始模糊.",
			Type: "Emote"
		});
	}
	else if (treatmentTime <= 5) {
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*医生依旧按照流程对你进行改造.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*你开始享受快感的指数级膨胀，高潮似乎并不那么重要，你的意识开始模糊.",
			Type: "Emote"
		});
	}
	else {
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*医生依旧按照流程对你进行改造.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*你已经不需要高潮了，只要更加舒服就好了，你的意识开始模糊.",
			Type: "Emote"
		});
	}
	await sleep(3000);
	let hintText = "";
	hintText += treatmentTime >= 1 ? "下右" : "辦覜";
	hintText += treatmentTime >= 2 ? "上左" : "辦覜"
	hintText += treatmentTime >= 3 ? "左下" : "辦覜"
	ServerSend("ChatRoomChat", {
		Content: "* " + hintText,
		Type: "Emote"
	});
	await sleep(8000);
	InventoryRemove(sender, "ItemHead");
	InventoryRemove(sender, "ItemDevices");
	InventoryRemove(sender, "ItemHood");
	ChatRoomCharacterUpdate(sender);
	treatmentTime += 1;
	dayPassed += 1;
	DayEnd(sender);
	playerCanAction = true;

}
/**
 * 位于床的位置时执行 显示可进行liedown行动
 * @param {any} sender
 */
function TreatmentRoomBed(sender) {
	ServerSend("ChatRoomChat", {
		Content: "*这是手术台，旁边的各种手术器具宣称着其恐怖的用途，要做改造的话得在这里躺下(liedown).",
		Type: "Emote"
	});
}
/**
 * 较短时间引开医生
 * @param {any} sender
 */
async function TreatmentRoomDistract(sender) {
	if (doctorExist) {
		ServerSend("ChatRoomChat", {
			Content: "*你告诉医生治理师找她，她咂了下嘴后离开了.",
			Type: "Emote"
		});
		let random = randomValue;
		doctorExist = false;
		await sleep(60000);
		if (randomValue === random) 
		{
			await DoctorReturn(sender);
		}
		
	}
}
/**
 * 较长时间引开医生
 * @param {any} sender
 */
async function TreatmentRoomAccident(sender) {
	if (doctorExist) {
		ServerSend("ChatRoomChat", {
			Content: "*为了引开医生更长的时间所以你在花园里放了把火，在你告诉医生着火了后她骂着脏话冲了出去.",
			Type: "Emote"
		});
		let random = randomValue;
		doctorExist = false;
		await sleep(120000);
		if (randomValue === random) {
			await DoctorReturn(sender);
		}
	}
}
/**
 * 处理医生被引开和回来
 * @param {any} sender
 * @param {any} time
 */
function DoctorDistracted(sender, time) {
	
}
/**
 * 医生回来
 * @param {any} sender
 */
async function DoctorReturn(sender) {
	playerCanAction = false;
	if (doctorExist === false) {
		ServerSend("ChatRoomChat", {
			Content: "*医生回来了.",
			Type: "Emote"
		});
	}
	doctorExist = true;
	if (IsInsideArea(areaSecretRoom, sender)) {

		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*医生:这里可不是你该来的地方.",
			Type: "Emote"
		});
		if (treatmentTime >= 1) {
			await sleep(3000);
			ServerSend("ChatRoomChat", {
				Content: "*她按了下手中遥控器的按钮，你突然意识的身体的异样.",
				Type: "Emote"
			});
			await sleep(3000);
			ServerSend("ChatRoomChat", {
				Content: "*积攒在体内一直没能施放的快感化为高潮猛地爆发出来，其强烈程度足以将大脑烧坏.",
				Type: "Emote"
			});
			await sleep(3000);
			ServerSend("ChatRoomChat", {
				Content: "*你摊在地上不断抽搐着.",
				Type: "Emote"
			});
			await sleep(3000);
			ServerSend("ChatRoomChat", {
				Content: "*医生:这下可没法让你离开了，你就做为终身实验体待在这里吧.",
				Type: "Emote"
			});
			await sleep(3000);
			ServerSend("ChatRoomChat", {
				Content: "*她把你扛起来放进其中一个空着的棺材，随着气阀声响起，你被永远地关在了里面.",
				Type: "Emote"
			});

			InventoryWear(sender, "InteractiveVRHeadset", "ItemHead", "Default", 80);
			InventoryLock(sender, InventoryGet(sender, "ItemHead"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
			InventoryGet(sender, "ItemHead").Property.CombinationNumber = lockCode;

			InventoryWear(sender, "FuturisticHelmet", "ItemHood", "Default", 80);
			InventoryLock(sender, InventoryGet(sender, "ItemHood"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
			InventoryGet(sender, "ItemHood").Property.CombinationNumber = lockCode;

			InventoryWear(sender, "FuturisticCrate", "ItemDevices", "Default", 80);
			InventoryLock(sender, "ItemDevices", { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
			InventoryGet(sender, "ItemDevices").Property.CombinationNumber = lockCode;
			InventoryGet(sender, "ItemDevices").Property.TypeRecord = { "w": 2, "l": 3, "a": 3, "d": 0, "t": 1, "h": 4 };
			ChatRoomCharacterUpdate(sender);

			await sleep(10000);
			ToEnd(sender, 4);
		}
		else {
			await sleep(3000);
			ServerSend("ChatRoomChat", {
				Content: "*医生试图制服你，你和她扭打在一起.",
				Type: "Emote"
			});
			await sleep(3000);
			ServerSend("ChatRoomChat", {
				Content: "*但是她的战斗力意外的弱，即使你处于各种不利因素但仍把她按在了身下.",
				Type: "Emote"
			});
			await sleep(3000);
			ServerSend("ChatRoomChat", {
				Content: "*正当你以为自己安全了，后颈突然传来一阵刺痛,你的意识随之开始模糊.",
				Type: "Emote"
			});
			await sleep(3000);
			ServerSend("ChatRoomChat", {
				Content: "*治疗师:还好姐姐我赶过来了呢，不然你就要被抓做X奴隶了呢，果然还是多锻炼锻炼比较好吧.",
				Type: "Emote"
			});
			await sleep(3000);
			ServerSend("ChatRoomChat", {
				Content: "*医生:烦死了，跟锻炼有什么关系，我都不知道她是怎么发现这个密室的，难不成和被催眠过的实验体看到的走廊深处的房间有关......",
				Type: "Emote"
			});
			await sleep(3000);
			ServerSend("ChatRoomChat", {
				Content: "*治疗师把你扛起来放进其中一个空着的棺材，随着气阀声响起，你被永远地关在了里面.",
				Type: "Emote"
			});
			InventoryWear(sender, "InteractiveVRHeadset", "ItemHead", "Default", 80);
			InventoryLock(sender, InventoryGet(sender, "ItemHead"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
			InventoryGet(sender, "ItemHead").Property.CombinationNumber = lockCode;

			InventoryWear(sender, "FuturisticHelmet", "ItemHood", "Default", 80);
			InventoryLock(sender, InventoryGet(sender, "ItemHood"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
			InventoryGet(sender, "ItemHood").Property.CombinationNumber = lockCode;

			InventoryWear(sender, "FuturisticCrate", "ItemDevices", "Default", 80);
			InventoryLock(sender, "ItemDevices", { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
			InventoryGet(sender, "ItemDevices").Property.CombinationNumber = lockCode;
			InventoryGet(sender, "ItemDevices").Property.TypeRecord = { "w": 2, "l": 3, "a": 3, "d": 0, "t": 1, "h": 4 };
			ChatRoomCharacterUpdate(sender);

			await sleep(10000);
			ToEnd(sender, 4);
		}
	}
	else if (GetCharIn40x40String(ChatRoomData.MapData.Objects, 30, 11) === 4020) {
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*你突然意识到身体的异样.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*积攒在体内一直没能施放的快感化为高潮猛地爆发出来，其强烈程度足以将大脑烧坏.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*你摊在地上不断抽搐着，医生慢慢走了过来.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*医生:难道你觉得跑开我就找不到你吗，你就做为终身实验体待在这里吧.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*医生把你拖回密室扛起来放进其中一个空着的棺材，随着气阀声响起，你被永远地关在了里面.",
			Type: "Emote"
		});
		InventoryWear(sender, "InteractiveVRHeadset", "ItemHead", "Default", 80);
		InventoryLock(sender, InventoryGet(sender, "ItemHead"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
		InventoryGet(sender, "ItemHead").Property.CombinationNumber = lockCode;

		InventoryWear(sender, "FuturisticHelmet", "ItemHood", "Default", 80);
		InventoryLock(sender, InventoryGet(sender, "ItemHood"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
		InventoryGet(sender, "ItemHood").Property.CombinationNumber = lockCode;

		InventoryWear(sender, "FuturisticCrate", "ItemDevices", "Default", 80);
		InventoryLock(sender, "ItemDevices", { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
		InventoryGet(sender, "ItemDevices").Property.CombinationNumber = lockCode;
		InventoryGet(sender, "ItemDevices").Property.TypeRecord = { "w": 2, "l": 3, "a": 3, "d": 0, "t": 1, "h": 4 };
		ChatRoomCharacterUpdate(sender);

		await sleep(10000);
		ToEnd(sender, 4);
	}
	playerCanAction = true;
}


const areaSecretRoom = {
	"up": 1, "left": 32, "down": 10, "right": 39,
	"areaName": "密室",
	"checkTextList": ["这里是手术室背后的密室，许多像是棺材一样的容器堆满了房间，向棺材里望去，里面大多都装着沉睡着的人.最好在医生回来前找到(find)你要找的东西."],
	"textCondition": null,
	"movements": [{ "name": "find", "func": window["SecretRoomFind"] },],
	"eventPoints": [],
};
/**
 * 在隐藏房间内寻找，根据距离返回结果
 * @param {any} sender
 */
async function SecretRoomFind(sender) {
	let distance = (Math.abs(sender.MapData.Pos.X - 38) + Math.abs(sender.MapData.Pos.Y - 8));
	if (distance <= 0) {
		randomValue = -1;
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*你在其中一个棺材旁发现了一根形状奇特的笔，这时医生突然回来了.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*医生:这里可不是你该来的地方.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*情急之下你把那支笔指向医生，笔突然发出来强光.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*医生:这里是哪? 嗯！这里可不是你该来的地方.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*你发现了笔上有一个按钮，你按了下按钮，笔又发出强光.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*医生:这里是哪? 嗯！这里可不是你该来的地方.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*你似乎搞清楚这支笔的用途了，同时治疗师进来了.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*治疗师:发生什么事了? 等等那只笔是!......发生什么事了? 等等那只笔是!.......",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*医生:这里是哪? 嗯！这里可不是你该来的地方......这里是哪? 嗯！这里可不是你该来的地方......",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*......",
			Type: "Emote"
		});

		await sleep(8000);
		ServerSend("ChatRoomChat", {
			Content: "*一段时间后，医生和治疗师穿着拘束衣跪坐在你面前，她们交代，她们所属的组织发现这座医院的病人发生了大规模植物人化事件，于是便买下了这座医院后让她们乔装进来调查.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*医生:目前的调查结果是，当患者处于高度性唤起且精神模糊的状态下，就能认知到走廊深处存在本不存在的房间，而进入这个房间的患者，大多都化作了植物人.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*治疗师:话说你的调查能力很强呢，要不要加入我们组织一起来......",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*你想都没想就拒绝了，然后把她们两个绑在手术台上启动装置后就离开了，把娇声与悲鸣声留在身后.",
			Type: "Emote"
		});
		ServerSend("ChatRoomChat", {
			Content: "*接待员;诶?要提前结束实验吗?但是这样是拿不到工资的哦.好吧.再见咯，下次再来哦.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*谁家医院让人下次再来啊.",
			Type: "Emote"
		});
		ToEnd(sender,5);
	}
	else if(distance <= 1){
		ServerSend("ChatRoomChat", {
			Content: "*就在附近了.",
			Type: "Emote"
		});
	}
	else if (distance <= 3) {
		ServerSend("ChatRoomChat", {
			Content: "*距离不远了.",
			Type: "Emote"
		});
	}
	else if (distance <= 5) {
		ServerSend("ChatRoomChat", {
			Content: "*距离有些远.",
			Type: "Emote"
		});
	}
	else {
		ServerSend("ChatRoomChat", {
			Content: "*距离很远.",
			Type: "Emote"
		});
	}
}


const areaHypnosisRoom = {
	"up": 24, "left": 35, "down": 28, "right": 39,
	"areaName": "心理治疗室",
	"checkTextList": ["这里是心理治疗室，中间是一张躺椅，旁边则是办公桌和椅子.治疗师坐在椅子上，看到你进来后对你笑了笑，或许你可以和她谈谈(talk)"],
	"textCondition": null,
	"movements": [{ "name": "talk", "func": window["HypnosisRoomTalk"] }, { "name": "liedown", "func": window["HypnosisRoomLieDown"] }],
	"eventPoints": [{ "Pos": { "X": 37, "Y": 26 }, "func": window["HypnosisRoomBed"] }],
};
/**
 * 与治疗师对话 指示liedown行动
 * @param {any} sender
 */
function HypnosisRoomTalk(sender) {
	if (hypnosisTime === 0) {
		ServerSend("ChatRoomChat", {
			Content: "*治疗师:阿啦.是新来的孩子呢，姐姐我是这里的治疗师哦.负责催眠的工作.",
			Type: "Emote"
		});
	}
	if (hypnosisTime >= 1) {
		ServerSend("ChatRoomChat", {
			Content: "*治疗师:走廊深处的房间，虽然有其他孩子反映过这件事，但确实是幻觉呢，不过你去调查一下怎么样，这也是实验的一部分哦.",
			Type: "Emote"
		});
	}
	
	ServerSend("ChatRoomChat", {
		Content: "*治疗师:在床上躺下(liedown)然后放轻松把身心都交给姐姐我就好了哦.",
		Type: "Emote"
	});
}
/**
 * 在床上躺下 不在床上无法执行 进行一次催眠
 * @param {any} sender
 */
function HypnosisRoomLieDown(sender) {
	if (sender.MapData.Pos.X === 37 && sender.MapData.Pos.Y === 26) {
		DoHypnosis(sender)
	}
	else {
		ServerSend("ChatRoomChat", {
			Content: "*治疗师:阿啦.躺在地上会感冒的哦.快躺(liedown)到床上来吧.",
			Type: "Emote"
		});
	}
	
}
async function DoHypnosis(sender) {
	playerCanAction = false;
	ServerSend("ChatRoomChat", {
		Content: "*治疗师:那么催眠要开始了哦，来，看着我的眼睛.",
		Type: "Emote"
	});
	ServerSend("ChatRoomChat", {
		Content: "*你躺在床上，凝望着她的眼睛，她低语着什么，你听不清，你得意识越来越模糊.",
		Type: "Emote"
	});
	ServerSend("ChatRoomChat", {
		Content: "*治疗师:如果不知道方向的话，那就按照 上下左右上下 的顺序走吧，做个好梦.",
		Type: "Emote"
	});
	await sleep(8000);
	InventoryGet(sender, "ItemNeckAccessories").Property = { Effect: Array(0), Text: direToText[order2[0]] };
	ChatRoomCharacterUpdate(sender);
	await Teleport(sender, 4, 4);
	playerCanAction = true;
}
/**
 * 位于床的位置时执行 显示可进行liedown行动
 * @param {any} sender
 */
function HypnosisRoomBed(sender) {
	ServerSend("ChatRoomChat", {
		Content: "*这是床，十分松软，感觉一躺上去(liedown)就会睡着.",
		Type: "Emote"
	});
}


const areaGardenRoom = {
	"up": 4, "left": 14, "down": 18, "right": 24,
	"areaName": "花园",
	"checkTextList": ["这里是花园，虽然有着绿树草地和水池，但仍然在室内，天花板上的人造灯光强调着这一点.", "仔细看看，这些植物全都是塑料制品，这间医院依旧没有人类以外的生物"],
	"textCondition": null,
	"movements": [{ "name": "dig", "func": window["GardenRoomDig"] },],
	"eventPoints": [{ "Pos": { "X": 16, "Y": 9 }, "func": window["GardenRoomFloor"] }],
};
/**
 * 挖掘地板 显示催眠路线提示 不在特殊地板无法执行
 * @param {any} sender
 */
function GardenRoomDig(sender) {
	ServerSend("ChatRoomChat", {
		Content: "*咔哒，你似乎挖到了一个小盒子，里面装着一张纸条.",
		Type: "Emote"
	});
	ServerSend("ChatRoomChat", {
		Content: "*纸条写着 0：上，1：下，2：左3：右.",
		Type: "Emote"
	});

	let objStr = ChatRoomData.MapData.Objects;
	objStr = SetCharIn40x40String(objStr, 15, 17, 680);
	objStr = SetCharIn40x40String(objStr, 16, 17, 660);
	objStr = SetCharIn40x40String(objStr, 17, 17, 680);
	objStr = SetCharIn40x40String(objStr, 20, 17, 670);
	ChatRoomData.MapData.Objects = objStr;
	UpdateRoom(ChatRoomData);

}
/**
 * 位于特殊地板执行 显示存在异常
 * @param {any} sender
 */
function GardenRoomFloor(sender) {
	ServerSend("ChatRoomChat", {
		Content: "*这块草地似乎有点不一样，应该能做些什么.",
		Type: "Emote"
	});
}


const areaInnerHallWay = {
	"up": 20, "left": 8, "down": 22, "right": 12,
	"areaName": "走廊深处",
	"checkTextList": ["这里是走廊深处，墙皮脱落了，天花板在滴水，地砖上生着青苔，年久失修的灯泡不时地闪烁着，北面的门上写着'再盈之间'，南面的门上写着'闻道之间'."],
	"textCondition": null,
	"movements": [],
	"eventPoints": [],
};


const areaCoffinRoom = {
	"up": 5, "left": 8, "down": 18, "right": 12,
	"areaName": "再盈之间",
	"checkTextList": ["这里是再盈之间，前方的门一旦通过就无法回头，若未能清晰认识内心，还是折返为好."],
	"textCondition": null,
	"movements": [{ "name": "enter", "func": window["CoffinRoomEnter"] }],
	"eventPoints": [{ "Pos": { "X": 10, "Y": 5 }, "func": window["CoffinRoomCoffin"] }, { "Pos": { "X": 12, "Y": 9 }, "func": window["CoffinRoomCoffin"] }, { "Pos": { "X": 8, "Y": 13 }, "func": window["CoffinRoomCoffin"] }],
};
/**
 * 根据位置进入棺材 进入结局
 * @param {any} sender
 */
async function CoffinRoomEnter(sender) {
	playerCanAction = false;
	if (sender.MapData.Pos.X === 8 && sender.MapData.Pos.Y === 13) {
		WearCoffin(sender);

		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*纵然你拥有强烈的欲望，但却未能在梦中找回.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*你未能达成盈满，你成为了纵欲的野兽.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*???:啊啊,不行啊,催眠深度太浅就会变成这样呢.",
			Type: "Emote"
		});
		ServerSend("ChatRoomChat", {
			Content: "*??:根据仅存的脑电波来看似乎只剩下了生物的本能，应该还有其他结果，还需要更多实验体.",
			Type: "Emote"
		});
		ToEnd(sender, 2);
	}
	else if (sender.MapData.Pos.X === 12 && sender.MapData.Pos.Y === 9) {
		WearCoffin(sender);

		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*纵然你拥有思考与决策的能力，但却未能在梦中找回目标与道德.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*你未能达成盈满，你成为了麻木的奴隶.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*??:根据仅存的脑电波来看在留有本能的同时还具有一定的思考能力，看来咱们的实验还是有进展的.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*???:感觉已经很接近了，如果我再多催眠几次的话.",
			Type: "Emote"
		});
		ToEnd(sender, 2);
	}
	else if (sender.MapData.Pos.X === 10 && sender.MapData.Pos.Y === 5) {
		WearCoffin(sender);

		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*你有了保持动力的欲望，保证前行的思考，确保方向的目标.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*你达成了盈满，你成为了完整的人.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*??:这个个体与其他个体相比，思维活动竟然没有消灭，看来根据催眠深度的不同，结果也不同，总算验证了实验方向是正确的.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*???:接下来就是确保可复现性呢，实验这么久总算有决定性的进展真是太好了呢.",
			Type: "Emote"
		});
		ToEnd(sender, 3);
	}

	playerCanAction = true;
}

async function WearCoffin(sender) {
	InventoryWear(sender, "InteractiveVRHeadset", "ItemHead", "Default", 80);
	InventoryLock(sender, InventoryGet(sender, "ItemHead"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
	InventoryGet(sender, "ItemHead").Property.CombinationNumber = lockCode;

	InventoryWear(sender, "FuturisticHelmet", "ItemHood", "Default", 80);
	InventoryLock(sender, InventoryGet(sender, "ItemHood"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
	InventoryGet(sender, "ItemHood").Property.CombinationNumber = lockCode;

	InventoryWear(sender, "FuturisticCrate", "ItemDevices", "Default", 80);
	InventoryLock(sender, "ItemDevices", { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
	InventoryGet(sender, "ItemDevices").Property.CombinationNumber = lockCode;
	InventoryGet(sender, "ItemDevices").Property.TypeRecord = { "w": 2, "l": 3, "a": 3, "d": 0, "t": 1, "h": 4 };
	ChatRoomCharacterUpdate(sender);

	await sleep(3000);
	ServerSend("ChatRoomChat", {
		Content: "*你踏入了棺材，棺材开始自动操作将你固定住，并给你戴上了头盔.",
		Type: "Emote"
	});
	await sleep(3000);
	ServerSend("ChatRoomChat", {
		Content: "*头盔的眼罩发出强烈的光，你感觉头痛欲裂.",
		Type: "Emote"
	});
}
/**
 * 位于棺材的位置时执行 指示enter行动
 * @param {any} sender
 */
function CoffinRoomCoffin(sender) {
	ServerSend("ChatRoomChat", {
		Content: "*你面前是一具形似棺材的装置，似乎可以进入(enter)，但一旦进去恐怕就出不来了.",
		Type: "Emote"
	});
}


const areaFrameRoom = {
	"up": 24, "left": 8, "down": 30, "right": 12,
	"areaName": "闻道之间",
	"checkTextList": ["这里是闻道之间，前方的门一旦通过就无法回头，若无舍生求道的决心，还是折返为好."],
	"textCondition": null,
	"movements": [{ "name": "enter", "func": window["FrameRoomEnter"] }],
	"eventPoints": [{ "Pos": { "X": 8, "Y": 30 }, "func": window["FrameRoomFrame"] }, { "Pos": { "X": 10, "Y": 30 }, "func": window["FrameRoomFrame"] }, { "Pos": { "X": 12, "Y": 30 }, "func": window["FrameRoomFrame"] }],
};
/**
 * 根据位置进入框架 进入结局
 * @param {any} sender
 */
async function FrameRoomEnter(sender) {
	if (sender.MapData.Pos.Y === 30) {
		playerCanAction = false;
		InventoryWear(sender, "TheDisplayFrame", "ItemDevices", "Default", 80);
		InventoryLock(sender, "ItemDevices", { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber);
		InventoryGet(sender, "ItemDevices").Property.CombinationNumber = lockCode;
		ChatRoomCharacterUpdate(sender);

		ServerSend("ChatRoomChat", {
			Content: "*在你踏进这个框架后，它自己合上了，你现在没有哪怕一丝活动空间.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*突然间大量信息流入你的脑神经，几乎要将大脑撑爆.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*将卡片放入微波炉后开至大大小大中特别大火加热负二百九十3的一百1次幂光年后就能让卡片啊啊啊啊啊啊.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*人死后不会死也不会活也不会去电影院更不会死也更不会活更更不会去电影院而是去电影院后就不用死也不用活其实想去的话还是能去电影院的只要人去电影院.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*1111515164589613216545649816132488791321654919132968498.",
			Type: "Emote"
		});
		switch (sender.MapData.Pos.X) {
			case 12: {
				await sleep(3000);
				ServerSend("ChatRoomChat", {
					Content: "*我找来了一把铲子可以去挖(dig)想挖(dig)的地方无论是可疑的地面还是人的脑子还是不可疑的地面又或是脑子的人都可以挖(dig)挖(dig)挖(dig)挖(dig)挖(dig)挖(dig).",
					Type: "Emote"
				});
			}
				break;
			case 10 :{
				await sleep(3000);
				ServerSend("ChatRoomChat", {
					Content: "*其实我很喜欢盆栽(potting)但是我不能让人知道我喜欢盆栽所以只要周围有人我就得将她们支开(distract),只要碍事的人被支开(distract)我就能进入盆栽(potting)那里有我最喜欢的.",
					Type: "Emote"
				});
			}
				break;
			case 8: {
				await sleep(3000);
				ServerSend("ChatRoomChat", {
					Content: "*时间太短了时间太短了时间太短了为什么时间只有这么短对了我可以在时间上制造一起事故(accident)就能让每分钟有2147483647秒，如果再制造一起事故(accident)就能让每分钟有9223372036854775807秒时间太多了时间太多了时间太多了.",
					Type: "Emote"
				});
			}
		}
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*哈哈哈哈哈哈哈合口合口合口合口合口合可口合可口可合口可合口阝可口阝可口阝可啊啊啊啊啊！！！！！！！！！！！！！！.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*啪唧.",
			Type: "Emote"
		});
		await sleep(8000);

		ServerSend("ChatRoomChat", {
			Content: "*??:啧，又是一个脑子烧坏的，还又是在这个走廊的这个位置.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*???:而且这孩子同样和我反应过，走廊的再深处共有两个房间,并不只有咱们了解到的那一个之间.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*??:如果只是一例两例还能算是偶然，如此多的案例只能证明确实有什么...我还需要更多的实验体来验证.",
			Type: "Emote"
		});
		ToEnd(sender, 1);
		playerCanAction = true;
	}
	
}
/**
 * 位于框架的位置时执行 指示enter行动
 * @param {any} sender
 */
function FrameRoomFrame(sender) {
	ServerSend("ChatRoomChat", {
		Content: "*你面前是一个人形的金属框架，似乎可以进入(enter)，但一旦进去恐怕就出不来了.",
		Type: "Emote"
	});
}


const areaDreamRoom = {
	"up": 0, "left": 0, "down": 13, "right": 7,
	"areaName": "梦",
	"checkTextList": ["你从未做过这样清晰的梦，你刚才到底是睡着了，还是醒来了?"],
	"textCondition": null,
	"movements": [],
	"eventPoints": [
		{ "Pos": { "X": 4, "Y": 1 }, "func": window["DreamRoomUp"] },
		{ "Pos": { "X": 1, "Y": 4 }, "func": window["DreamRoomLeft"] },
		{ "Pos": { "X": 4, "Y": 7 }, "func": window["DreamRoomDown"] },
		{ "Pos": { "X": 7, "Y": 4 }, "func": window["DreamRoomRight"] },

		{ "Pos": { "X": 0, "Y": 12 }, "func": window["DreamRoomKey1"] },
		{ "Pos": { "X": 2, "Y": 12 }, "func": window["DreamRoomKey2"] },
		{ "Pos": { "X": 4, "Y": 12 }, "func": window["DreamRoomKey3"] },
		{ "Pos": { "X": 6, "Y": 12 }, "func": window["DreamRoomEnd"] },
	],
};
/**
 * 返回中心 记录一次移动 对比结果
 * @param {any} sender
 * @param {any} direction
 */
async function DreamRoomMove(sender, direction) {

	orderPlayer += direction.toString();
	orderIndex++;
	let isFinish = false;
	if (orderIndex >= 5) {
		await orders.forEach((order, index) => {
			let result = true;

			if (orderPlayer.toLowerCase().includes(order)) {

				orderPlayer = "";
				orderIndex = 0;
				isFinish = true;
				if (ordersUsed[index] === false) {
					ordersUsed[index] = true;
					InventoryGet(sender, "ItemNeckAccessories").Property = { Effect: Array(0), Text: "____" };
					ChatRoomCharacterUpdate(sender);
					Teleport(sender, orderUsedCount * 2, 13);
					orderUsedCount++;
				}
				else {
					hypnosisTime += 1;
					dayPassed += 1;
					DayEnd(sender);
					return;
				}
				
			}
			});
	}
	if (isFinish === false) {
		Teleport(sender, 4, 4);
		InventoryGet(sender, "ItemNeckAccessories").Property = { Effect: Array(0), Text: direToText[order2[orderIndex % 6]] };
		ChatRoomCharacterUpdate(sender);
	}
	
}
function DreamRoomUp(sender) {
	DreamRoomMove(sender, 0);
}
function DreamRoomLeft(sender) {
	DreamRoomMove(sender, 2);
}
function DreamRoomDown(sender) {
	DreamRoomMove(sender, 1);
}
function DreamRoomRight(sender) {
	DreamRoomMove(sender, 3);
}
/**
 * 获得钥匙 穿送到床上
 * @param {any} sender
 */
async function DreamRoomKey1(sender) {
	if (keyfound <= 0) {

		hypnosisTime += 1;
		dayPassed += 1;
		keyfound += 1;
		ServerSend("ChatRoomChat", {
			Content: "*凡有命者，皆有二欲，其为生欲，其为死欲.",
			Type: "Emote"
		});
		await sleep(5000);
		DayEnd(sender);
	}
	
	
}
/**
 * 获得钥匙 穿送到床上
 * @param {any} sender
 */
async function DreamRoomKey2(sender) {
	if (keyfound <= 1) {
		hypnosisTime += 1;
		dayPassed += 1;
		keyfound += 1;
		ServerSend("ChatRoomChat", {
			Content: "*凡有智者，皆有二思，其为远虑，其为近忧.",
			Type: "Emote"
		});
		await sleep(5000);
		DayEnd(sender);
	}
}
/**
 * 获得钥匙 穿送到床上
 * @param {any} sender
 */
async function DreamRoomKey3(sender) {
	if (keyfound <= 2) {
		hypnosisTime += 1;
		dayPassed += 1;
		keyfound += 1;
		ServerSend("ChatRoomChat", {
			Content: "*凡为人者，皆有二望，其为梦想，其为道德.",
			Type: "Emote"
		});
		await sleep(5000);
		DayEnd(sender);
	}
}
/**
 * 播放结局
 * @param {any} sender
 */
async function DreamRoomEnd(sender) {
	if (orderUsedCount === 4) {
		ServerSend("ChatRoomChat", {
			Content: "*善思芦苇之丛，无边根系之结.",
			Type: "Emote"
		});
		ServerSend("ChatRoomChat", {
			Content: "*汝将沉入海中，沉入人之海，人心之海.",
			Type: "Emote"
		});
		ServerSend("ChatRoomChat", {
			Content: "*汝将归于故乡，归于思之根，思维之根.",
			Type: "Emote"
		});
		ServerSend("ChatRoomChat", {
			Content: "*其为阿赖耶识.",
			Type: "Emote"
		});
		await sleep(8000);
		ServerSend("ChatRoomChat", {
			Content: "*??:你让她沉得太深了,她现在已经溶解进集体无意识了.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*???:唔~.果然还是变成这样了吗?我本来还觉得这孩子能在这之前达到盈满呢.",
			Type: "Emote"
		});
		await sleep(3000);
		ServerSend("ChatRoomChat", {
			Content: "*??:算了,把她搬到密室吧，至少她的神经还有些作用.",
			Type: "Emote"
		});
		await sleep(3000);
		ToEnd(sender, 6);
	}
}



const areaSleepRoom = {
	"up": 24, "left": 14, "down": 27, "right": 24,
	"areaName": "病房",
	"checkTextList": ["这里是病房，只有一张床和一个拘束架，究竟是什么病人需要拘束架?"],
	"textCondition": null,
	"movements": [{ "name": "sleep", "func": window["SleepRoomSleep"] }, { "name": "dig", "func": window["SleepRoomDig"] }],
	"eventPoints": [{ "Pos": { "X": 15, "Y": 26 }, "func": window["SleepRoomFloor"] }, { "Pos": { "X": 24, "Y": 26 }, "func": window["SleepRoomBed"] },],
};
/**
 * 位于床上才能执行 跳过一天
 * @param {any} sender
 */
function SleepRoomSleep(sender) {
	ServerSend("ChatRoomChat", {
		Content: "*就这样睡一天也不错.",
		Type: "Emote"
	});
	dayPassed += 1;
	DayEnd(sender);
}
/**
 * 位于特殊地板才能执行 显示催眠路线提示 
 * @param {any} sender
 */
function SleepRoomDig(sender) {
	ServerSend("ChatRoomChat", {
		Content: "*咔哒，你似乎挖到了一个小盒子，里面装着一张纸条.",
		Type: "Emote"
	});
	ServerSend("ChatRoomChat", {
		Content: "*纸条写着 人是不能在不借助外物的情况下看到自己的，但是在梦中可以，只要看着自己就能找到道路.",
		Type: "Emote"
	});
}
/**
 * 位于特殊地板执行 显示存在异常
 * @param {any} sender
 */
function SleepRoomFloor(sender) {
	ServerSend("ChatRoomChat", {
		Content: "*这块地板似乎有点不一样，应该能做些什么.",
		Type: "Emote"
	});
}
/**
 * 位于床上才能执行 指示sleep行动
 * @param {any} sender
 */
function SleepRoomBed(sender) {
	ServerSend("ChatRoomChat", {
		Content: "*还算舒适的病床，直接躺下睡觉(sleep)也是一个选项，不过这样就太可惜了.",
		Type: "Emote"
	});
}
var playerCanAction = true;

var areasList = [areaEntranceRoom, areaWaitingRoom, areaHallWay, areaTreatmentRoom, areaSecretRoom, areaHypnosisRoom, areaGardenRoom, areaInnerHallWay, areaCoffinRoom, areaFrameRoom, areaDreamRoom, areaSleepRoom];

//var areasEntered = [false, false, false, false, false, false, false, false, false, false, false, false];
//var treatmentTime = 0;
//var hypnosisTime = 0;
//var dayPassed = 0;

//var doctorExist = true;
//var orderIndex = 0;
//var orderPlayer = "";
//const order1 = "012301";
//const order2 = "230210";
//const order3 = "313002"
//const order4 = "130221";
//const orders = [order1, order2, order3, order4];
//var ordersUsed = [false, false, false, false];
//var orderUsedCount = 0;
//const direToText = ["Up", "Down", "Left", "Right"];
//const FailedAreas = [{ "X": 24, "Y": 36 }, { "X": 16, "Y": 36 }, { "X": 26, "Y": 36 }, { "X": 14, "Y": 36 }, { "X": 28, "Y": 36 }, { "X": 12, "Y": 36 }, { "X": 30, "Y": 36 }, { "X": 10, "Y": 36 },]
//var playersFailed = [];
//var doctorTimeOutID = null;


function StartSet() {
	areasEntered = [false, false, false, false, false, false, false, false, false, false, false, false];
	treatmentTime = 0;
	hypnosisTime = 0;
	dayPassed = 0;

	doctorExist = true;
	orderIndex = 0;
	orderPlayer = "";
	order1 = "012301";
	order2 = "230210";
	order3 = "313002"
	order4 = "130221";
	orders = [order1, order2, order3, order4];
	ordersUsed = [false, false, false, false];
	orderUsedCount = 0;
	direToText = ["Up", "Down", "Left", "Right"];
	FailedAreas = [{ "X": 24, "Y": 36 }, { "X": 16, "Y": 36 }, { "X": 26, "Y": 36 }, { "X": 14, "Y": 36 }, { "X": 28, "Y": 36 }, { "X": 12, "Y": 36 }, { "X": 30, "Y": 36 }, { "X": 10, "Y": 36 }]
	playersFailed = [];
	doctorTimeOutID = null;
	keyfound = 0;
}

function resetRoom() {
	//重置游戏
	playerCanAction = true;
	areasEntered = [false, false, false, false, false, false, false, false, false, false, false, false];
	treatmentTime = 0;
	hypnosisTime = 0;
	dayPassed = 0;
	doctorExist = true;
	lockCode = Math.floor(Math.random() * 9000 + 1000).toString();
	orderIndex = 0;
	orderPlayer = "";
	ordersUsed = [false, false, false, false];
	orderUsedCount = 0;
	randomValue = Math.floor(Math.random() * 900000 + 100000).toString();
	keyfound = 0;
	if (doctorTimeOutID != null) {
		clearTimeout(doctorTimeOutID);
	}
	//重置房间
	let map = {
		"Type": "Always",
		"Tiles": "ЮЮЮЮиЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮxxxxxxxxxxЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮxxxxxxxxЮииииииЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮxЮxxxxxxxxЮЮЮКЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮxЮxxxxxxxxЮЮЮЮЮЮЮЮЮnЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮϨxxxxxxxxЮЮЮЮЮЮЮЮЮnЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮxЮxxxxxxxxЮЮЮЮЮЮЮЮЮКЮКЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮxЮxxxxxxxxЮЮЮЮЮЮЮЮККnККЮÒÒÒÒssssssÒЮЮЮЮЮЮЮxxxxxxxxЮЮЮЮЮЮЮЮККККnЮÒÒ×ÒsߐߐߐߐsÒЮЮЮЮЮxЮxxxxxxxxϨиϨиϨиϨКККnnnЮÒÒÒÒsߐߐߐߐsÒЮЮЮЮЮxЮxxxxxxxxϩиІиКиЮККККККЮÒÒÒÒssssssÒЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮdиnиsиߐКККnККЮÒÒÒÒÒÒÒÒÒÒÒЮxxxxxxxxxxЮdиnиsиߐКnККККЮÒÒÒÒÒÒÒÒÒÒÒЮxxxxxxxxxxЮЮЮЮЮЮЮЮnnnККЮÒÒÒÒÒÒÒÒÒÒÒЮxxxxxxxxxxЮЮЮЮЮЮЮЮКККККЮÒÒÒÒÒÒÒÒÒÒÒЮxxxxxxxxxxЮЮЮЮЮЮЮЮККnККЮÒÒÒÒÒÒÒÒÒÒÒЮxxxxxxxxxxЮЮЮЮЮЮЮЮКККККЮÒÒÒÒÒÒÒÒÒÒÒЮxxxxxxxxxxЮЮЮЮЮЮЮЮККnККЮÒÒÒÒÒÒÒÒÒÒÒЮxxxxxxxxxxЮЮЮЮЮЮЮЮЮКККККЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮnnnnnЮxxxxxxxxxxxxxxxxxxxxxxxxxxЮЮЮЮЮЮЮЮnnnnnЮxxxxxxxxxxxxxxxxxxxxxxxxxxЮЮЮЮЮЮЮЮnnnnnЮxxxxxxxxxxxxxxxxxxxxxxxxxxЮЮЮЮЮЮЮЮКККККЮиииЮиЮиЮиЮиЮЮЮЮЮЮЮЮЮЮиЮиииЮЮЮЮЮЮЮЮnnnnnЮЮЮЮxxxxxxxxЮЮЮЮЮЮЮЮЮnnnnnЮЮЮЮxxxxxxxxЮЮЮЮЮЮЮЮЮКККККЮxЮЮЮxxxxxxxxЮЮЮЮЮЮЮЮЮnКnКnЮЮЮЮxxxxxxxxЮЮЮЮЮЮЮЮЮКЮКЮКЮЮЮЮЮЮЮЮЮЮЮЮЮxxxxxxxxЮЮЮЮЮЮЮЮЮnЮnЮnЮЮЮxxxxxxxxxЮxxxxxxxxЮиииииЮЮЮЮЮЮЮЮnЮnЮnЮЮЮxxxxxxxxxxxxxxxxxxЮЮЮЮЮЮЮЮЮЮЮЮЮЮКЮКЮКЮЮЮЮЮЮЮЮЮЮЮЮЮxxxxxxxxЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮxxxxxxxxxЮxxxxxxxxЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮxxxxxxxxxЮxxxxxxxxЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮxxxxxxxxxЮxxxxxxxxЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮxxxЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮxЮxЮxЮxЮÒÒÒÒÒЮxЮxЮxЮxЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮxЮxЮxЮxЮÒÒÒÒÒЮxЮxЮxЮxЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮxxxxxxxЮÒÒÒÒÒЮxxxxxxxЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮxxxxxxxxÒÒÒÒÒxxxxxxxxЮЮЮЮЮЮЮЮЮ",
		"Objects": "ddddூdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddྴdЮdЮЮЮЮЮЮdூூூdூூூddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddЮdЮЮЮЮЮЮddddddddddЮdddddddddddddddddddྴdddddddddddddddddddddddddddddddddddddddddЮdЮЮЮЮЮЮddddddddddྵddddddddddddddddddddddddddddddddddddddddddddߕddddddddddddddྴdЮdЮЮЮЮЮЮddddddddddྯdЮddddddddddddddddddddddddddddddddddddddddddࠂddddddddddddddddЮdЮЮЮЮЮЮదdಀdௌdூdddྵddddddddddddddddddddddddddddd d¢d¤ddddddddddd߸dddddddddКККŀdŀddddྴdddddddddddЮdྮddddߕddddddd߸ddddddddddddࠖdddddddddddddddddddddddࠂdddddиdddddddddࠖŞdĶddddddddddྵdddddddߕdddddddиdddddddddࠖŞІĶddddddddddddddddddddddddddиdddddÒÒÒÒࠖdĎdddddddddddྭddddddddddddddddddddÒddࠖddddddddddddddddddɬɬɬɬɬɬdddddddddddddddddddddddddddddྴdddddddddddྴྴdddྴྴdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddྴddddྴdddྴdddྴdddྴྴdಀಀಀdddྴdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddྯdྮdྭdϼdxdϼdxdϼdxddddddddddиdxÒddddddddddddddddddddddddddddddddddddddddddddྶdྶdྶddddಲddூdௌdூddddddddddddddddddddddddddddddddddddddddྴddddddddddddddddddиdиdиddddddddddddࠖdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddࠖdddddddddddddddddddddddddddddddddddddddÒdddddddddddddddddddddddddddddddddddࠖdddddddddddddddddddddddddddddddddddࠖdࠖddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddࠖdࠖdࠖdࠖdddddddࠖdࠖdࠖdࠖddddddddddddddddddddddddddྴddnddྴdddddddddddddddddddddddddddddddddࠖdddddࠖdddddddddddddddd"
	}
	ChatRoomData.Description = "[BOT]密室逃生第四部 可疑的医院 使用了地图技术",
	ChatRoomData.Limit = (2 + playersFailed.length).toString()
	ChatRoomData.MapData = map;
	ChatRoomData.Locked = false;
	UpdateRoom(ChatRoomData);
	
}

async function UpdateRoom(ChatRoomData) {
	try {
		ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: ChatRoomData, Action: "Update" });
	}
	catch {
		await sleep(200);
		UpdateRoom(ChatRoomData)
	}
}

///催眠时直接告知 获得顺序
///室友地下 看自己
///庭院编码 0123 - 上下左右
///连续手术	分5次获得顺序
///每以不同的方式完成一次顺序，获得一个钥匙

///获得钥匙进入框架 结局1 朝闻道 信息：调查特殊地板，打开手术室隐藏门，延长支开时间
///进入棺材1，2 结局2 残缺
///进入棺材3 结局3 完整
///进入收藏间 结局4 样本/逃出生天
///进入集体潜意识 结局6 归乡
///进行十次手术或催眠 结局7 结束

//一次催眠后打开框架与棺材的区域