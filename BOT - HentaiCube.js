activateStoryRoom();
//这里是简单模式的开关，设置成true就能不需要悄悄话提交金币,游戏进行中可以在控制台内修改
IsEasyMode = false;


//这部分是给bot穿的装备，不需要可以注释掉
RemoveCloth(Player,null);
RemoveRestrains(Player,null);
WearFullRestrains(Player,null);
InventoryWear(Player, "TheDisplayFrame", "ItemDevices", "Default",80);

function WearFullRestrains (sender, msg) {
	InventoryWear(sender, "InteractiveVRHeadset", "ItemHead", null,80);
	InventoryWear(sender, "FuturisticHarnessPanelGag", "ItemMouth", null,80);

	InventoryWear(sender, "FuturisticBra", "ItemBreast", null,80);
	InventoryWear(sender, "FuturisticHarness", "ItemTorso", null,80);
	InventoryWear(sender, "FuturisticTrainingBelt", "ItemPelvis", null,80);

	InventoryWear(sender, "FuturisticLegCuffs", "ItemLegs", null,80);
	InventoryWear(sender, "FuturisticAnkleCuffs", "ItemFeet", null,80);

	InventoryWear(sender, "PilotSuit", "Suit", null,80);
	InventoryWear(sender, "PilotSuit", "SuitLower", null,80);
}

Player.Description = `
BOT game：HentaiCube
作者: zajucd(7092)
原型: https://github.com/keykey5/BC-BOT-repository
发布地址: https://github.com/zajucd/BC_BotGame

加入了跳过开场的功能，使用(快速进入)。
加入了方便达成真结局的功能，在第三区域可以尝试触发。


`; // end of description
ServerSend("AccountUpdate", { Description: Player.Description });
ChatRoomCharacterUpdate(Player);

ChatRoomMessageAdditionDict["CursedRoom"] = function(sender, msg, data) {ChatRoomMessageCursedRoom(sender, msg, data)};

// 延时函数 通过 await sleep(毫秒) 来调用
function sleep(time){
	return new Promise((resolve) => setTimeout(resolve, time));
}

//部署bot时执行的函数
function activateStoryRoom() {
	playerInWaiting = [];
	playerInGame = [];
	playerInpunish = [];
	storyActive = true;
	isGameInProcess = false;

	ResetGame();
	resetRoom(0);
}

function deactivateStoryRoom() {
	resetRoom();
	storyActive = false
}



//玩家所有包括进出消息在这里调用。
function ChatRoomMessageCursedRoom(sender, msg, data) {
	if (storyActive) {
		if ((data.Type === "Action") && (msg.startsWith("ServerEnter"))) {
			setTimeout(PlayerEnter(sender), 300, sender)
		}
		else if ((msg.startsWith("ServerLeave")) || (msg.startsWith("ServerDisconnect")) || (msg.startsWith("ServerBan")) || (msg.startsWith("ServerKick"))) {
			var pl = "null";
			pl = GetPlayerFromCharacter(playerInGame,sender);
			if (pl !== "null"){
				resetRoom(1);
			}
			else {
				pl = "null";
				pl = GetPlayerFromCharacter(playerInpunish,sender);
				if(pl !== "null"){
					playerInpunish.splice(playerInpunish.indexOf(pl),1);
					resetRoom(0);
				}
				else {
					pl = "null";
					pl = GetPlayerFromCharacter(playerInWaiting,sender);
					if(pl !== "null"){
						playerInWaiting.splice(playerInWaiting.indexOf(pl),1);
					}
				}
			}
		}
		if (data.Type != null) {
			if ((data.Type === "Emote") || (data.Type === "Whisper") || (data.Type === "Action") || (data.Type === "Hidden" && msg.startsWith("ChatRoomBot"))) {
				commandHandler(sender,msg, data);
			}

		}
	}
}

//玩家进入时执行的函数
function PlayerEnter(sender) {
	resetRoom(0);

	ShowWelcomeMessage(sender);
}
//
function ShowWelcomeMessage(sender) {
	ServerSend("ChatRoomChat", { Content: "*该bot现已发布至 https://github.com/zajucd/BC_BotGame ", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", {
		Content: "*This is a Chinese room,make sure you can read Chinese before start.",
		Type: "Emote",
		Target: sender.MemberNumber
	});
	ServerSend("ChatRoomChat", {
		Content: "*[如果开启沉浸设置中感觉剥夺和堵嘴禁用私聊的话可能会导致游戏无法正常进行].",
		Type: "Emote",
		Target: sender.MemberNumber
	});
	ServerSend("ChatRoomChat", {
		Content: "*你进入了一个标着“游戏室”的房间， 已进来就能看见两个足以装人的大箱子.在箱子的中间有一个标牌.",
		Type: "Emote",
		Target: sender.MemberNumber
	});
	ServerSend("ChatRoomChat", {
		Content: "*标牌上写着：欲参加游戏，请(进入)运输舱中,待有两人位于运输舱中时即可开始游戏.",
		Type: "Emote",
		Target: sender.MemberNumber
	});
	ServerSend("ChatRoomChat", {
		Content: "*[所有带有圆括号的词语均可作为指令 例：输入 *进入 并发送. 可根据需要选择公屏发言或悄悄话BOT].",
		Type: "Emote",
		Target: sender.MemberNumber
	});
	ServerSend("ChatRoomChat", {
		Content: "*[当前版本bug较多，请一定不要通过刷新页面的方式来离开房间， 且游戏要求使用悄悄话功能，请确保个人设置中允许堵嘴悄悄话，以及戴着奴隶项圈开始游戏会狂暴报错，至于会再出什么bug确实不好说].",
		Type: "Emote",
		Target: sender.MemberNumber
	});
	ServerSend("ChatRoomChat", {
		Content: "*[加入了一个在第三区域帮助达成真结局的功能，以及可以(快速进入)来跳过开场].",
		Type: "Emote",
		Target: sender.MemberNumber
	});

	if(playerInWaiting.length === 0){
		ServerSend("ChatRoomChat", {
			Content: "*两个运输舱都敞开着，看来进入之后得等一会.",
			Type: "Emote",
			Target: sender.MemberNumber
		});
	}
	else if(playerInWaiting.length === 1){
		ServerSend("ChatRoomChat", {
			Content: "*其中一个运输舱里似乎有人，里面断断续续地传出一些人声，看来进入之后能立即开始.",
			Type: "Emote",
			Target: sender.MemberNumber
		});
	}
	else {
		ServerSend("ChatRoomChat", { Content: "*很明显现在出bug了,所以正在等待的玩家需要重新(进入)，还在箱子里是视效不用在意", Type: "Chat"} );
		playerInWaiting = [];
	}

}

//检测玩家是否可游玩的函数 0 符合，非0 不符合
/**
 * @return {number}
 */
function IsPlayerPlayable(sender) {
	if (isExposed(sender) || sender.IsRestrained() || sender.IsChaste() || sender.IsShackled() || sender.IsBlind() || !sender.CanTalk() || sender.IsEnclose() || sender.IsMounted() || sender.IsEgged() || sender.IsDeaf()) {
		return 0;
	}
	else if (sender.ItemPermission > 2) {
		return 2;
	}
	else if (InventoryBlockedOrLimitedCustomized(sender, AssetGet("Female3DCG","ItemMisc","CombinationPadlock")))  {
		return 3;
	}
	else {
		return 0;
	}
}

//不可游玩时输出提示
function ShowUnplayableMessage(sender ,msg, isPlayable) {
	switch (isPlayable) {
		case 1:{
			ServerSend("ChatRoomChat", {
				Content: "*[需要 穿着衣服且不被束缚 才能游玩，请调整后再输入该指令.]",
				Type: "Emote",
				Target: sender.MemberNumber
			});
		}
		break;

		case 2:{
			ServerSend("ChatRoomChat", {
				Content: "*[需要调低 玩家权限 才能游玩. 请调整后再输入该指令.设置位置在角色档案内选择第三项后选择第一项.]",
				Type: "Emote",
				Target: sender.MemberNumber
			});
		}
		break;

		case 3:{
			ServerSend("ChatRoomChat", { Content: "*[需要 组合密码锁“COMBINATION PADLOCK”的权限. 请调整后再输入该指令.]", Type: "Emote", Target: sender.MemberNumber} );

		}
		break;

	}
}
//玩家进出时重置房间信息
function resetRoom(type) {

	if (type === 1){
		ServerSend("ChatRoomChat", { Content: "*玩家意外退出，游戏将重置.", Type: "Chat"} );
		ResetGame();

		// Update room 在这里修改房间信息
		var UpdatedRoom = {
			Name: ChatRoomData.Name,
			Description: "[BOT]密室逃生第三部 异次元色色阵 需双人游玩",
			Background: "VaultCorridor",
			Limit: (3 + playerInpunish.length).toString(),
			Admin: ChatRoomData.Admin,
			Ban: ChatRoomData.Ban,
			Private: false,
			Locked: false
		};
		ServerSend("ChatRoomAdmin", {MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update"});
		ChatAdminMessage = "UpdatingRoom";
	}
	else if(type === 2){
		ResetGame();
		var UpdatedRoom = {
			Name: ChatRoomData.Name,
			Description: "[BOT]密室逃生第三部 异次元色色阵 需双人游玩",
			Background: "VaultCorridor",
			Limit: (3 + playerInpunish.length).toString(),
			Admin: ChatRoomData.Admin,
			Ban: ChatRoomData.Ban,
			Private: false,
			Locked: false
		};
		ServerSend("ChatRoomAdmin", {MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update"});
		ChatAdminMessage = "UpdatingRoom";
	}
	else if (type === 3){
		var UpdatedRoom = {
			Name: ChatRoomData.Name,
			Description: "[BOT]密室逃生第三部 异次元色色阵 需双人游玩",
			Background: "VaultCorridor",
			Limit: (3 + playerInpunish.length).toString(),
			Admin: ChatRoomData.Admin,
			Ban: ChatRoomData.Ban,
			Private: ChatRoomData.Private,
			Locked: ChatRoomData.Locked
		};
		ServerSend("ChatRoomAdmin", {MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update"});
		ChatAdminMessage = "UpdatingRoom";
	}
	else {
		ResetGame();
		// Update room 在这里修改房间信息
		var UpdatedRoom = {
			Name: ChatRoomData.Name,
			Description: "[BOT]密室逃生第三部 异次元色色阵 需双人游玩",
			Background: "VaultCorridor",
			Limit: (3 + playerInpunish.length).toString(),
			Admin: ChatRoomData.Admin,
			Ban: ChatRoomData.Ban,
			Private: ChatRoomData.Private,
			Locked: ChatRoomData.Locked
		};
		ServerSend("ChatRoomAdmin", {MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update"});
		ChatAdminMessage = "UpdatingRoom";
	}



}

function ResetGame() {
	IsGameStart = false;
	gameProcess = 0;
	gamePhase = 0;

	playerInGame = [];

	maxFloorOfEachProcess = [0,3,4,5,0];
	maxMovementCountOfEachProcess = [0,5,6,8,0];
	coinRequireOfEachProcess = [0,200,500,1000,0];
	remainedCoinOfEachFloor = [100,100,100,100,0,0];

	coinSubmited = 0;
	submitTimes = 0;

	shopMenu = [];

	isControlable = true;

}

//处理玩家输入的信息并转化为行动
function commandHandler(sender, msg, data) {
	// if (msg.toLowerCase().includes("exit")){
	// 	setTimeout(function (sender) {
	// 		ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
	// 	}, 2 * 1000, sender)
	// }

	if(sender.MemberNumber !== Player.MemberNumber && isControlable){
		ServerSend("ChatRoomChat", { Content: "* ", Type: "Emote", Target: sender.MemberNumber} );
			if (msg.includes("快速进入")){
				isPlayable = IsPlayerPlayable(sender);
				if (isPlayable === 0){
					EnterWaitingStack(sender,null ,msg, true);
				}
				else {
					ShowUnplayableMessage(sender ,msg, isPlayable)
				}
			}
			else if (msg.includes("进入")) {
				isPlayable = IsPlayerPlayable(sender);
				if (isPlayable === 0){
					EnterWaitingStack(sender,null ,msg, false);
				}
				else {
					ShowUnplayableMessage(sender ,msg, isPlayable)
				}

			}
			else  if(msg.includes("排出")){
				setTimeout(function (sender) {
							ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString());
							resetRoom(3);

						}, 2 * 1000, sender);
			}
			//游戏中行动
			else if(IsGameStart) {
				commandPlayer = null;
				commandPlayer = GetPlayerFromCharacter(playerInGame, sender);
				anotherPlayer = GetAnotherPlayerFromCharacter(playerInGame, sender);
				if (msg.includes("思考")){
					if(commandPlayer !== null){
						Think(commandPlayer);
					}
				}
				else if (msg.includes("检查")){
					CheckAround(commandPlayer);
				}
				//探索阶段
				else if (gamePhase === 0){
					if (msg.includes("移动至")){
						if(commandPlayer !== null){
							commandPlayer.currentQuest = null;
							commandPlayer.isCurrentQuestSuccess =false;
							floor = parseInt(msg.replace(/[^\d]/g, " "));//删除数字外字符
							MoveTo(commandPlayer, floor);
						}
					}
					else if (msg.includes("打开门")){
						if(commandPlayer !== null){
							commandPlayer.currentQuest = null;
							commandPlayer.isCurrentQuestSuccess =false;
							OpenDoor(commandPlayer);
						}
					}
					else if (msg.includes("不执行")){
						if (commandPlayer !== null){
							if (commandPlayer.currentQuest !== null){
								commandPlayer.currentQuest = null;
								commandPlayer.isCurrentQuestSuccess = false;
								ServerSend("ChatRoomChat", { Content: "*你离开了房间.", Type: "Emote", Target: sender.MemberNumber} );
							}
							else {
								ServerSend("ChatRoomChat", { Content: "*没有对应的任务.", Type: "Emote", Target: sender.MemberNumber} );
							}
						}
					}
					else if (msg.includes("执行")){
						if (commandPlayer !== null){
							if (commandPlayer.currentQuest !== null && commandPlayer.movementCount < maxMovementCountOfEachProcess[gameProcess]){
								commandPlayer.currentQuest.DoQuest(commandPlayer);
								commandPlayer.movementCount +=1;
								PlayerMovementCountAdded(commandPlayer);
							}
							else {
								ServerSend("ChatRoomChat", { Content: "*没有对应的任务.", Type: "Emote", Target: sender.MemberNumber} );
							}
						}
					}
					else if (msg.includes("穿戴")){
						if (commandPlayer !== null){
							if (commandPlayer.currentQuest !== null){
								commandPlayer.currentQuest.WearSuccessEquip(commandPlayer);
								commandPlayer.currentQuest = null;
								commandPlayer.isCurrentQuestSuccess =false;
							}
							else {
								ServerSend("ChatRoomChat", { Content: "*没有对应的任务.", Type: "Emote", Target: sender.MemberNumber} );
							}
						}
					}
					else  if(msg.includes("提取金币")){
						if (commandPlayer !== null){
							if(commandPlayer.EndingEquipCount === 6){
								if (commandPlayer.currentQuest !== null && commandPlayer.movementCount < maxMovementCountOfEachProcess[gameProcess]){
									//commandPlayer.currentQuest.DoQuest(commandPlayer);
									ServerSend("ChatRoomChat", { Content: "*面板下方伸出一条机械触手，连接在了你的贞操带上", Type: "Emote", Target: player.character.MemberNumber} );
									ServerSend("ChatRoomChat", { Content: "*随着获得金币时清脆的 ‘叮’ 的一声，你毫无征兆的高潮了", Type: "Emote", Target: player.character.MemberNumber} );
									ServerSend("ChatRoomChat", { Content: "*每 ‘叮’ 一声，你都高潮了一次，无论时挣扎还是求饶，高潮仍旧机械般的冲击着你", Type: "Emote", Target: player.character.MemberNumber} );
									if(remainedCoinOfEachFloor[parseInt(player.location.replace(/[^\d]/g, " "))] >= 200){
										ServerSend("ChatRoomChat", { Content: "*获得" + 200 + "金币", Type: "Emote", Target: player.character.MemberNumber} );
										commandPlayer.coin += 200;
										remainedCoinOfEachFloor[parseInt(player.location.replace(/[^\d]/g, " "))] -= 200;
									}
									else {
										ServerSend("ChatRoomChat", { Content: "*获得" + remainedCoinOfEachFloor[parseInt(player.location.replace(/[^\d]/g, " "))] + "金币", Type: "Emote", Target: player.character.MemberNumber} );
										commandPlayer.coin += remainedCoinOfEachFloor[parseInt(player.location.replace(/[^\d]/g, " "))];
										remainedCoinOfEachFloor[parseInt(player.location.replace(/[^\d]/g, " "))] = 0;
									}
									commandPlayer.movementCount +=1;
									PlayerMovementCountAdded(commandPlayer);
								}
								else {
									ServerSend("ChatRoomChat", { Content: "*没有对应的任务.", Type: "Emote", Target: sender.MemberNumber} );
								}
							}
							ServerSend("ChatRoomChat", { Content: "*面板显示：未检测到全套管理员拘束器，启动防卫模式", Type: "Emote", Target: player.character.MemberNumber} );
							QuestList(14).QuestFail(commandPlayer);
							ServerSend("ChatRoomChat", { Content: "*你失去了意识，再次醒来时，发现自己被完全拘束住了", Type: "Emote", Target: player.character.MemberNumber} );
							commandPlayer.movementCount = maxMovementCountOfEachProcess[gameProcess];
							PlayerMovementCountAdded(commandPlayer);
						}
					}
				}
				//提交阶段
				else if (gamePhase === 1){
					if(msg.includes("提交")){
						if(IsEasyMode === true){
							coin = parseInt(msg.replace(/[^\d]/g, " "));//删除数字外字符
							SubmitCoin(commandPlayer, coin);
						}
						else{
							if(data.Type === "Whisper"){
								coin = parseInt(msg.replace(/[^\d]/g, " "));//删除数字外字符
								SubmitCoin(commandPlayer, coin);
							}
							else {
								ServerSend("ChatRoomChat", { Content: "*安宝：检测到违规行为，进行惩罚.", Type: "Emote", Target: commandPlayer.character.MemberNumber} );
								ServerSend("ChatRoomChat", { Content: "*[强制装备：电子口套{口部，mnd+@}]", Type: "Emote", Target: commandPlayer.character.MemberNumber} );
								EquipList("电子口套").ForceWearEquip(commandPlayer);
								ServerSend("ChatRoomChat", { Content: "*安宝：请私聊 BOT 来进行提交[若无法通过点击来指定BOT，可以通过(/w "+Player.MemberNumber+" 内容)来发送私聊，内容前不要带星号].", Type: "Emote", Target: commandPlayer.character.MemberNumber} );
							}
						}

					}
				}
				//购物阶段
				else if (gamePhase === 2){
					if(msg.includes("列表")){
						showShopMenu(commandPlayer);
					}
					else if(msg.includes("购买")){
						index = parseInt(msg.replace(/[^\d]/g, " "));
						if (index >= shopMenu.length) index = shopMenu.length-1;
						if (index < 0) index = 0;
						shopMenu[index].SellGoods(commandPlayer, commandPlayer);
					}
					else if(msg.includes("赠送")){
						index = parseInt(msg.replace(/[^\d]/g, " "));
						if (index >= shopMenu.length) index = shopMenu.length-1;
						if (index < 0) index = 0;
						shopMenu[index].SellGoods(commandPlayer, anotherPlayer);
					}
					else if(msg.includes("完成")){
						commandPlayer.movementCount = 0;
						ServerSend("ChatRoomChat", { Content: "*安宝：您已完成准备.", Type: "Emote", Target: commandPlayer.character.MemberNumber} );
						if (anotherPlayer.movementCount === 0){
							ServerSend("ChatRoomChat", { Content: "*安宝：两位玩家已完成准备，结束商店阶段.", Type: "Emote", Target: commandPlayer.character.MemberNumber} );
							ServerSend("ChatRoomChat", { Content: "*安宝：两位玩家已完成准备，结束商店阶段.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
							GotoPhase1(commandPlayer);
						}
					}
				}

			}


	}



}


//脱掉所有衣服
function RemoveCloth(sender, msg) {
	CharacterNaked(sender);
	ChatRoomCharacterUpdate(sender);
}

//脱掉所有拘束
function RemoveRestrains(sender, msg){
	InventoryRemove(sender,"ItemVulva");
	InventoryRemove(sender,"ItemVulvaPiercings");
	InventoryRemove(sender,"ItemButt");
	InventoryRemove(sender,"ItemArms");
	InventoryRemove(sender,"ItemHands");
	InventoryRemove(sender,"ItemNeck");
	InventoryRemove(sender,"ItemMouth");
	InventoryRemove(sender,"ItemMouth2");
	InventoryRemove(sender,"ItemMouth3");
	InventoryRemove(sender,"ItemTorso");
	InventoryRemove(sender,"ItemBreast");
	InventoryRemove(sender,"ItemLegs");
	InventoryRemove(sender,"ItemFeet");
	InventoryRemove(sender,"ItemBoots");
	InventoryRemove(sender,"ItemNipples");
	InventoryRemove(sender,"ItemNipplesPiercings");
	InventoryRemove(sender,"ItemPelvis");
	InventoryRemove(sender,"ItemHead");
	InventoryRemove(sender,"ItemDevices");
	InventoryRemove(sender,"ItemEars");
	ChatRoomCharacterUpdate(sender);
}

//玩家准备后调用
function EnterWaitingStack(sender, anotherSender, msg, isfast) {
	if(GetPlayerFromCharacter(playerInpunish, sender) !== "null"){
		ServerSend("ChatRoomChat", { Content: "*提示音：正在接受惩罚，无法进入.", Type: "Emote", Target: sender.MemberNumber} );
		return;
	}
	player = new PlayerStruct().NewPlayer(sender);
	playerInWaiting.push(player);
	RemoveRestrains(sender);
	RemoveCloth(sender);

	//装备运输舱
	EquipList("运输舱").WearEquip(player);
	ServerSend("ChatRoomChat", { Content: "*在你走进运输舱后，舱门在背后关上了.", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*仓顶和舱底伸出机械臂抓住你的手腕脚腕并往回缩，直至把你的手脚固定住.", Type: "Emote", Target: sender.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*现在你被拘束在了运输舱里，然后舱内传出了声音.", Type: "Emote", Target: sender.MemberNumber} );
	if(playerInWaiting.length === 1){
		ServerSend("ChatRoomChat", { Content: "*提示音：在等待期间，您可以享受按摩服务.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*两个刷头顶在了你的乳头上，开始无规律地旋转与摩擦，令人焦躁的快感从胸部传遍了全身.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*[等待至另一个玩家加入]", Type: "Emote", Target: sender.MemberNumber} );
	}
	else if (playerInWaiting.length === 2){
		ServerSend("ChatRoomChat", { Content: "*提示音：已有两位玩家准备，游戏即将开始.", Type: "Emote", Target: sender.MemberNumber} );
		if (anotherSender == null ){
			anotherSender = GetAnotherPlayerFromCharacter(playerInWaiting, sender).character;
		}
		ServerSend("ChatRoomChat", { Content: "*就在你即将被刷头玩弄到高潮前，刷头停了下来.", Type: "Emote", Target: anotherSender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*提示音：已有两位玩家准备，游戏即将开始.", Type: "Emote", Target: anotherSender.MemberNumber} );
		GameStart(sender, anotherSender, msg, isfast);
	}

}

//游戏开始时调用
async function GameStart(sender, anotherSender, msg, isFast) {
	isControlable = false;

	var UpdatedRoom = {
		Name: ChatRoomData.Name,
		Description: ChatRoomData.description,
		Background: ChatRoomData.Background,
		Limit: ChatRoomData.Limit,
		Admin: ChatRoomData.Admin,
		Ban: ChatRoomData.Ban,
		Private: ChatRoomData.Private,
		Locked: true
	};
	ServerSend("ChatRoomAdmin", {MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update"});
	ChatAdminMessage = "UpdatingRoom";

	if (anotherSender == null){
		anotherSender = GetAnotherPlayerFromCharacter(playerInWaiting, sender).character;
	}
	if (isFast === false){
		timeSleep = 3000;
		await sleep(timeSleep);
		ServerSend("ChatRoomChat", { Content: "*运输仓晃动起来，似乎在往下移动.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*运输仓晃动起来，似乎在往下移动.", Type: "Emote", Target: anotherSender.MemberNumber} );
		await sleep(timeSleep);
		ServerSend("ChatRoomChat", { Content: "*有什么细长的东西伸进了你的耳朵深处，然后开始播放声音，声音像是在脑袋里发出来的一样.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*有什么细长的东西伸进了你的耳朵深处，然后开始播放声音，声音像是在脑袋里发出来的一样.", Type: "Emote", Target: anotherSender.MemberNumber} );
		await sleep(timeSleep);
		ServerSend("ChatRoomChat", { Content: "*脑袋里的声音：内耳道耳机部署已完成，开始在运输过程中说明游戏规则.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*脑袋里的声音：内耳道耳机部署已完成，开始在运输过程中说明游戏规则.", Type: "Emote", Target: anotherSender.MemberNumber} );
		await sleep(timeSleep);
		ServerSend("ChatRoomChat", { Content: "*细长的东西拔了出去，但你依旧能听到声音.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*细长的东西拔了出去，但你依旧能听到声音.", Type: "Emote", Target: anotherSender.MemberNumber} );
		await sleep(timeSleep);
		ServerSend("ChatRoomChat", { Content: "*耳朵里的声音：欢迎来到游戏《异次元色色阵》，本机是游戏执行AI 安洁莉卡，您可以称呼本机为安宝.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*耳朵里的声音：欢迎来到游戏《异次元色色阵》，本机是游戏执行AI 安洁莉卡，您可以称呼本机为安宝.", Type: "Emote", Target: anotherSender.MemberNumber} );
		await sleep(timeSleep);
		ServerSend("ChatRoomChat", { Content: "*安宝：本游戏为冒险类游戏，需要您与您的搭档在接下来区域中执行行动，完成任务，收集金币，并使用金币打开下一个区域的大门，在完成三个区域后您便完成了游戏.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：本游戏为冒险类游戏，需要您与您的搭档在接下来区域中执行行动，完成任务，收集金币，并使用金币打开下一个区域的大门，在完成三个区域后您便完成了游戏.", Type: "Emote", Target: anotherSender.MemberNumber} );
		await sleep(timeSleep);
		ServerSend("ChatRoomChat", { Content: "*安宝：您将拥有 力量[str] 敏捷[agi] 智力[int] 意志[mnd] 幸运[luk] 五个属性，这五个属性将会成为您完成任务的主要依靠.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：您将拥有 力量[str] 敏捷[agi] 智力[int] 意志[mnd] 幸运[luk] 五个属性，这五个属性将会成为您完成任务的主要依靠.", Type: "Emote", Target: anotherSender.MemberNumber} );
		await sleep(timeSleep);
		ServerSend("ChatRoomChat", { Content: "*安宝：您在游戏过程中可能会找到并装备各种拘束具，这些拘束具可以为您提供属性上的增减或是额外效果.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：您在游戏过程中可能会找到并装备各种拘束具，这些拘束具可以为您提供属性上的增减或是额外效果.", Type: "Emote", Target: anotherSender.MemberNumber} );
		await sleep(timeSleep);
		ServerSend("ChatRoomChat", { Content: "*安宝：每位玩家在每个区域各执行固定次数行动后，本机会提示您前往下一个区域的大门，在大门前提交足够开门的金币以前往下一个区域.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：每位玩家在每个区域各执行固定次数行动后，本机会提示您前往下一个区域的大门，在大门前提交足够开门的金币以前往下一个区域.", Type: "Emote", Target: anotherSender.MemberNumber} );
		await sleep(timeSleep);
		ServerSend("ChatRoomChat", { Content: "*安宝：两位玩家可以分三次提交金币，在三次提交后若是金币总和无法打倒开门的指标，视为游戏失败，本机会为二位提供精心准备的惩罚.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：两位玩家可以分三次提交金币，在三次提交后若是金币总和无法打倒开门的指标，视为游戏失败，本机会为二位提供精心准备的惩罚.", Type: "Emote", Target: anotherSender.MemberNumber} );
		await sleep(timeSleep);
		ServerSend("ChatRoomChat", { Content: "*安宝：提交完溢出的金币不会退还，同时区域间拥有购买拘束具与道具的商店，或许留有一些金币也是不错的选择.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：提交完溢出的金币不会退还，同时区域间拥有购买拘束具与道具的商店，或许留有一些金币也是不错的选择.", Type: "Emote", Target: anotherSender.MemberNumber} );
		await sleep(timeSleep);
		ServerSend("ChatRoomChat", { Content: "*安宝：此外，您在游戏过程中随时可以(思考)自身的状态与(检查)当前的环境，后续的游戏机制请在游戏过程中自行摸索，那么说明到此结束.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：此外，您在游戏过程中随时可以(思考)自身的状态与(检查)当前的环境，后续的游戏机制请在游戏过程中自行摸索，那么说明到此结束.", Type: "Emote", Target: anotherSender.MemberNumber} );
		await sleep(timeSleep);
		ServerSend("ChatRoomChat", { Content: "*安宝：在运输仓到达之前，本机会为您提供ASMR与按摩服务.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：在运输仓到达之前，本机会为您提供ASMR与按摩服务.", Type: "Emote", Target: anotherSender.MemberNumber} );
		await sleep(timeSleep);
		ServerSend("ChatRoomChat", { Content: "*你的耳中出现了像是舔食耳道一般的声音，同时一对刷头开始摩擦你的乳头，可能在游戏开始前你的神志就要被消耗殆尽了.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*你的耳中出现了像是舔食耳道一般的声音，同时刚才的刷头又开始摩擦你的乳头，可能在游戏开始前你的神志就要被消耗殆尽了.", Type: "Emote", Target: anotherSender.MemberNumber} );
		await sleep(timeSleep*2);
		ServerSend("ChatRoomChat", { Content: "*一会后，运输舱似乎到达了底部，你感觉到脖子上被锁上了一个项圈.运输舱把你手脚的束缚松开后又打开了舱门.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*一会后，运输舱似乎到达了底部，你感觉到脖子上被锁上了一个项圈.运输舱把你手脚的束缚松开后又打开了舱门.", Type: "Emote", Target: anotherSender.MemberNumber} );

		await sleep(timeSleep);
		ServerSend("ChatRoomChat", { Content: "*安宝：已到达区域一，本区域共有四层，可行动五次，进入下一区域需要200金币，注意每层金币余量，请开始探索.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：已到达区域一，本区域共有四层，可行动五次，进入下一区域需要200金币，注意每层金币余量，请开始探索.", Type: "Emote", Target: anotherSender.MemberNumber} );

		EquipList("电子项圈").WearEquip(playerInWaiting[0]);
		EquipList("电子项圈").WearEquip(playerInWaiting[1]);
		playerInWaiting[0].slots[6].RemoveEquip(playerInWaiting[0]);
		playerInWaiting[1].slots[6].RemoveEquip(playerInWaiting[1]);
		ChatRoomCharacterUpdate(playerInWaiting[0].character);
		ChatRoomCharacterUpdate(playerInWaiting[1].character);
		playerInWaiting[0].location = "0";
		playerInWaiting[1].location = "0";
		playerInGame = playerInWaiting;
		playerInWaiting = [];

		await sleep(timeSleep);
		ServerSend("ChatRoomChat", { Content: "*眼前的空间是一条十分长的走廊，走廊两侧每个5米左右就各有一扇门，在走廊的末端有向上的扶梯，似乎还有更高的地方.", Type: "Emote", Target: sender.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*眼前的空间是一条十分长的走廊，走廊两侧每个5米左右就各有一扇门，在走廊的末端有向上的扶梯，似乎还有更高的地方.", Type: "Emote", Target: anotherSender.MemberNumber} );

	}
	else {
		timeSleep = 3000;
		await sleep(timeSleep);
		EquipList("电子项圈").WearEquip(playerInWaiting[0]);
		EquipList("电子项圈").WearEquip(playerInWaiting[1]);
		playerInWaiting[0].slots[6].RemoveEquip(playerInWaiting[0]);
		playerInWaiting[1].slots[6].RemoveEquip(playerInWaiting[1]);
		ChatRoomCharacterUpdate(playerInWaiting[0].character);
		ChatRoomCharacterUpdate(playerInWaiting[1].character);
		playerInWaiting[0].location = "0";
		playerInWaiting[1].location = "0";
		playerInGame = playerInWaiting;
		playerInWaiting = [];
	}


	//穿上项圈并移除运输舱


	IsGameStart = true;
	gameProcess = 1;

	isControlable = true;
}

//使用思考是调用
function Think(player) {
	ServerSend("ChatRoomChat", { Content: "*当前状态:", Type: "Emote", Target: player.character.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*位于：" + gameProcess + "区域" + player.location + "层", Type: "Emote", Target: player.character.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*金币：" + player.coin, Type: "Emote", Target: player.character.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*基础属性：str:"+player.state.GetState(0)+" agi:"+player.state.GetState(1)+" int:"+player.state.GetState(2)+" mnd:"+player.state.GetState(3)+" luk:"+player.state.GetState(4), Type: "Emote", Target: player.character.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*当前区域已行动次数：" + player.movementCount, Type: "Emote",Target: player.character.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*装备：", Type: "Emote",Target: player.character.MemberNumber} );
	slotnames = ["头部","口部","身体","手臂","腿脚","衣服","额外","项圈"];
	nameText = "";
	desText = "*{}";
	for(var i = 0; i< slotnames.length; i++){
		nameText = slotnames[i];
		desText = "*{}";
		if(player.slots[i] === null){
			nameText += ": 无装备.";
		}
		else if (typeof player.slots[i] === "number"){
			nameText += ": 被" + slotnames[player.slots[i]] + "的装备占用.";
		}
		else {
			nameText += ": " + player.slots[i].name;
			desText = player.slots[i].description;
		}
		ServerSend("ChatRoomChat", { Content: "*" + nameText, Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*" + desText, Type: "Emote", Target: player.character.MemberNumber} );
	}
	ServerSend("ChatRoomChat", { Content: "*可用指令:", Type: "Emote", Target: player.character.MemberNumber} );
	if(gamePhase === 0){
		ServerSend("ChatRoomChat", { Content: "*(打开门)来探索随机一个房间以获取任务", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*(检查)来触发一些随机事件", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*(移动至 X) [X 应为 0~"+ maxFloorOfEachProcess[gameProcess]+"间整数] 来改变楼层", Type: "Emote", Target: player.character.MemberNumber} );
	}
	else if(gamePhase === 1){
		SServerSend("ChatRoomChat", { Content: "*(提交 X) [X 应为整数] 来提交金币", Type: "Emote", Target: player.character.MemberNumber} );
	}
	else if(gamePhase === 2){
		ServerSend("ChatRoomChat", { Content: "*(列表)显示可购买的商品", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*(购买 X) [X 应为商品编号] 购买商品为自己使用", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*(赠送 X) [X 应为商品编号] 购买商品为另一位玩家使用", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*(完成) 结束购买，等待进入下一阶段", Type: "Emote", Target: player.character.MemberNumber} );

	}


}

//使用检查是调用
function CheckAround(player) {
	if (player.slots[6] !== null){
		if (player.slots[6].name === "运输舱"){
			ServerSend("ChatRoomChat", { Content: "*这个舱室狭小且不透光，但是隐约能在舱壁上看到一行字：“齐集全套”", Type: "Emote", Target: player.character.MemberNumber} );
		}
	}
	rand =  Math.floor(Math.random() * 10);//0~9
	switch (gameProcess) {
		case 1:{
			if (rand < 4){
				ServerSend("ChatRoomChat", { Content: "*你意识到这个空间十分奇妙，哪怕是同一扇门打开两次，里面的布置都不一样", Type: "Emote", Target: player.character.MemberNumber} );
			}
			else if (rand < 6){
				ServerSend("ChatRoomChat", { Content: "*你在角落里发现了一行字写着：“你还在以为她是你的搭档吗？”", Type: "Emote", Target: player.character.MemberNumber} );
			}
			else if (rand < 8){
				ServerSend("ChatRoomChat", { Content: "*你捡到了一个金币", Type: "Emote", Target: player.character.MemberNumber} );
				player.coin += 1;
			}
			else{
				ServerSend("ChatRoomChat", { Content: "*你找到了一个带着电子面板的口罩，当你再次回过神时，你已经戴上了那个口罩", Type: "Emote", Target: player.character.MemberNumber} );
				ServerSend("ChatRoomChat", { Content: "*[强制装备：电子口套{口部，mnd+@}]", Type: "Emote", Target: player.character.MemberNumber} );
				EquipList("电子口套").ForceWearEquip(player);
			}
		}
		break;

		case 2:{
			if (rand < 4){
				ServerSend("ChatRoomChat", { Content: "*你有点怀疑这里是否时现实了，你绕一根柱子走了一圈后眼前的景色甚至不是你刚才见过的", Type: "Emote", Target: player.character.MemberNumber} );
			}
			else if (rand < 6){
				ServerSend("ChatRoomChat", { Content: "*你在角落里发现了一行歪歪扭扭的字：“我哪知道还要500金币才能换到自————”", Type: "Emote", Target: player.character.MemberNumber} );
			}
			else if (rand < 8){
				ServerSend("ChatRoomChat", { Content: "*你捡到了几个金币", Type: "Emote", Target: player.character.MemberNumber} );
				player.coin += 3;
			}
			else{
				ServerSend("ChatRoomChat", { Content: "*你找到了一个带着奇怪的眼罩，然后你的脖子感到麻麻的.当你再次回过神时，你已经戴上了那个眼罩", Type: "Emote", Target: player.character.MemberNumber} );
				ServerSend("ChatRoomChat", { Content: "*[强制装备：电子眼罩{头部，int+@}]", Type: "Emote", Target: player.character.MemberNumber} );
				EquipList("电子眼罩").ForceWearEquip(player);
			}
		}
		break;

		case 3:{
			if (rand < 4){
				ServerSend("ChatRoomChat", { Content: "*刚才走过去的那个人影肯定不是你所知道的另一位玩家，而且那个人影从体型到发型甚至是身上的束缚和你一模一样", Type: "Emote", Target: player.character.MemberNumber} );
			}
			else if (rand < 6){
				ServerSend("ChatRoomChat", { Content: "*眼前的这堵墙写满了“我要回家”，让你很不舒服.你鬼使神差地捡起掉在地上的笔在空位也写了一个“我要回家”", Type: "Emote", Target: player.character.MemberNumber} );
				ServerSend("ChatRoomChat", { Content: "*你才意识到包括刚写上的在内，墙上所有的字都是你的笔迹.你十分确定你只写过一次“我要回家”.", Type: "Emote", Target: player.character.MemberNumber} );
			}
			else if (rand < 8){
				ServerSend("ChatRoomChat", { Content: "*你捡到了几个金币", Type: "Emote", Target: player.character.MemberNumber} );
				player.coin += 5;
			}
			else{
				ServerSend("ChatRoomChat", { Content: "*你找到了一个带着奇怪的单手套，你感到你的项圈刺了你一下.随即你的身体变得不受自己控制，你绝望地看着自己穿上了单手套", Type: "Emote", Target: player.character.MemberNumber} );
				ServerSend("ChatRoomChat", { Content: "*[强制装备：电子单手套{头部，str+@}]", Type: "Emote", Target: player.character.MemberNumber} );
				EquipList("电子单手套").ForceWearEquip(player);
			}
			if (player.EndingEquipCount === 6){
				ServerSend("ChatRoomChat", { Content: "*你发现了一个电子面板，上面显示着：已检测到全套管理员拘束器，(提取金币)功能已启用[消耗行动]", Type: "Emote", Target: player.character.MemberNumber} );
			}
		}
			break;
	}


}

//使用移动时调用
function MoveTo(player , floor) {
	if (floor <= maxFloorOfEachProcess[gameProcess] ){
		player.location = floor.toString();
	}
	else {
		player.location = maxFloorOfEachProcess[gameProcess];
	}
	ServerSend("ChatRoomChat", { Content: "*你移动到了"+player.location+"层", Type: "Emote", Target: player.character.MemberNumber} );
}

//使用开门时调用
function OpenDoor(player) {
	player.currentQuest = QuestListIndexByArea(gameProcess);
	player.isCurrentQuestSuccess = false;
	player.currentQuest.ShowText(player);
}

//使用执行后调用
function PlayerMovementCountAdded(player) {
	if(player.movementCount >= maxMovementCountOfEachProcess[gameProcess]){
		ServerSend("ChatRoomChat", { Content: "*安宝：您已打倒本区域行动次数上限，请在另一位玩家完成前稍作等待.", Type: "Emote", Target: player.character.MemberNumber} );
		EquipList("运输舱").ForceWearEquip(player);
		ServerSend("ChatRoomChat", { Content: "*运输舱突然从地下出现把你关了起来，那个烦人的刷头又开始挑逗你的乳头.", Type: "Emote", Target: player.character.MemberNumber} );
		anotherPlayer =  GetAnotherPlayerFromCharacter(playerInGame, player.character);
		if(anotherPlayer.movementCount >= maxMovementCountOfEachProcess[gameProcess]){
			ServerSend("ChatRoomChat", { Content: "*安宝：两位玩家均已完成行动，移动至下一个区域前.", Type: "Emote", Target: player.character.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*安宝：两位玩家均已完成行动，移动至下一个区域前.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
			GotoPhase2(player);
		}
	}

}

//移动至阶段2
async function GotoPhase2(player) {
	isControlable = false;

	anotherPlayer =  GetAnotherPlayerFromCharacter(playerInGame, player.character);
	await sleep(1000);
	ServerSend("ChatRoomChat", { Content: "*运输仓在移动了一会后停了下来.", Type: "Emote", Target: player.character.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*运输仓在移动了一会后停了下来.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
	await sleep(1000);
	ServerSend("ChatRoomChat", { Content: "*安宝：以达到下一区域入口，现在开始提交金币.", Type: "Emote", Target: player.character.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*安宝：以达到下一区域入口，现在开始提交金币.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
	await sleep(1000);
	ServerSend("ChatRoomChat", { Content: "*安宝：解锁该入口需要" +coinRequireOfEachProcess[gameProcess] +"金币，一次最多提交需求量的30%，最少为1.", Type: "Emote", Target: player.character.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*安宝：解锁该入口需要" +coinRequireOfEachProcess[gameProcess] +"金币，一次最多提交需求量的30%，最少为1.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
	await sleep(1000);
	ServerSend("ChatRoomChat", { Content: "*安宝：每位玩家各提交一次后本机会告知您另一位玩家的提交量是否少于您.", Type: "Emote", Target: player.character.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*安宝：每位玩家各提交一次后本机会告知您另一位玩家的提交量是否少于您.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
	await sleep(1000);
	ServerSend("ChatRoomChat", { Content: "*安宝：请私聊 BOT 来提交，提交阶段期间使用非私聊会受到惩罚.[若无法通过点击来指定BOT，可以通过(/w "+Player.MemberNumber+" 内容)来发送私聊，内容前不要带星号]", Type: "Emote", Target: player.character.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*安宝：请私聊 BOT 来提交，提交阶段期间使用非私聊会受到惩罚.[若无法通过点击来指定BOT，可以通过(/w "+Player.MemberNumber+" 内容)来发送私聊，内容前不要带星号]", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
	await sleep(1000);
	ServerSend("ChatRoomChat", { Content: "*安宝：那么请开始 (提交 X)[X 应为整数，输入范围外的值视为输入最近范围对应的值].", Type: "Emote", Target: player.character.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*安宝：那么请开始 (提交 X)[X 应为整数，输入范围外的值视为输入最近范围对应的值].", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );

	coinSubmited = 0;
	player.submitCoin = 0;
	anotherPlayer.submitCoin = 0;
	submitTimes = 0;

	gamePhase = 1;
	isControlable = true;

	console.log("移动至提交阶段， 区域" + gameProcess);
}


//提交阶段是提交
function SubmitCoin(player, coin){
	anotherPlayer =  GetAnotherPlayerFromCharacter(playerInGame, player.character);
	if (coin < 1){
		coin = 1;
	}
	else if (coin > coinRequireOfEachProcess[gameProcess] * 0.3){
		coin = coinRequireOfEachProcess[gameProcess] * 0.3;
	}

	if (coin > player.coin){
		if (player.coin === 0){
			ServerSend("ChatRoomChat", { Content: "*安宝：您也太穷了所以本机替您垫付一枚金币.", Type: "Emote", Target: player.character.MemberNumber} );
			coin = 1;
		}
		else {
			coin = player.coin;
		}
	}
	ServerSend("ChatRoomChat", { Content: "*安宝：您将提交"+ coin +"金币，在另一位玩家提交前可以修改", Type: "Emote", Target: player.character.MemberNumber} );
	player.submitCoin = coin;

	if (anotherPlayer.submitCoin !== 0){
		ServerSend("ChatRoomChat", { Content: "*安宝：两位玩家已完成提交.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：两位玩家已完成提交.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		player.coin -= player.submitCoin;
		anotherPlayer.coin -= anotherPlayer.submitCoin;

		coinSubmited += player.submitCoin + anotherPlayer.submitCoin;
		if (player.submitCoin > anotherPlayer.submitCoin){
			ServerSend("ChatRoomChat", { Content: "*安宝：对方本次提交的金币少于您.", Type: "Emote", Target: player.character.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*安宝：对方本次提交的金币多于您.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		}
		else if(player.submitCoin < anotherPlayer.submitCoin){
			ServerSend("ChatRoomChat", { Content: "*安宝：对方本次提交的金币多于您.", Type: "Emote", Target: player.character.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*安宝：对方本次提交的金币少于您.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		}
		else {
			ServerSend("ChatRoomChat", { Content: "*安宝：对方本次提交的金币等于您.", Type: "Emote", Target: player.character.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*安宝：对方本次提交的金币等于您.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		}

		player.submitCoin = 0;
		anotherPlayer.submitCoin = 0;
		submitTimes +=1 ;
		if (submitTimes >= 3){
			ServerSend("ChatRoomChat", { Content: "*安宝：三轮提交已完成，共提交" +coinSubmited+ "金币", Type: "Emote", Target: player.character.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*安宝：三轮提交已完成，共提交" +coinSubmited+ "金币", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
			if(coinSubmited >= coinRequireOfEachProcess[gameProcess]){
				ServerSend("ChatRoomChat", { Content: "*安宝：恭喜，已达到需求量，将移动至下一阶段", Type: "Emote", Target: player.character.MemberNumber} );
				ServerSend("ChatRoomChat", { Content: "*安宝：恭喜，已达到需求量，将移动至下一阶段" +coinSubmited+ "金币", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
				GotoPhase3(player);
			}
			else {
				ServerSend("ChatRoomChat", { Content: "*安宝：十分遗憾，未能达到需求量，请前往惩罚区域", Type: "Emote", Target: player.character.MemberNumber} );
				ServerSend("ChatRoomChat", { Content: "*安宝：十分遗憾，未能达到需求量，请前往惩罚区域", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
				GotoEnd(player,0);
			}
		}
		else {
			ServerSend("ChatRoomChat", { Content: "*安宝：请开始下一轮提交.", Type: "Emote", Target: player.character.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*安宝：请开始下一轮提交.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		}
	}


}

//移动至阶段3
async function GotoPhase3(player) {
	isControlable = false;
	anotherPlayer =  GetAnotherPlayerFromCharacter(playerInGame, player.character);
	if (gameProcess === 3){
		isControlable = true;
		GotoEnd(player,1);
	}
	else {
		await sleep(1000);
		ServerSend("ChatRoomChat", { Content: "*运输仓正移动着.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*运输仓正移动着.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(1000);
		ServerSend("ChatRoomChat", { Content: "*安宝：在移动至下一区域前，您可以再次使用获得的金币购买商品.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：在移动至下一区域前，您可以再次使用获得的金币购买商品.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(1000);
		ServerSend("ChatRoomChat", { Content: "*安宝：使用(列表)可以随时查看待出售的商品，使用(完成)可以结束购买.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：使用(列表)可以随时查看待出售的商品，使用(完成)可以结束购买.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(1000);
		ServerSend("ChatRoomChat", { Content: "*安宝：(购买 X)商品会为自己使用，(赠送 X)商品将会为搭档使用，当然，她无权拒绝[X 应为整数,为每个商品前的编号].", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：(购买 X)商品会为自己使用，(赠送 X)商品将会为搭档使用，当然，她无权拒绝[X 应为整数,为每个商品前的编号].", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(1000);
		ServerSend("ChatRoomChat", { Content: "*安宝：那么，请自便.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：那么，请自便.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );


		gamePhase = 2;

		shopMenu = GetShopMenu(gameProcess);

		isControlable = true;
	}

	console.log("移动至购买阶段， 区域" + gameProcess);
}

//现实商店
function showShopMenu(player) {
	for (var i = 0; i<shopMenu.length; i++){
		if(shopMenu[i].isSelled === false){
			ServerSend("ChatRoomChat", { Content: "*" + i + ": " + shopMenu[i].name + shopMenu[i].description +"价格：" +shopMenu[i].price+".", Type: "Emote", Target: player.character.MemberNumber} );
		}
		else {
			ServerSend("ChatRoomChat", { Content: "*" + i + ": 已售出.", Type: "Emote", Target: player.character.MemberNumber} );
		}
	}

}

//返回至阶段1
async function GotoPhase1(player) {
	isControlable = false;
	anotherPlayer =  GetAnotherPlayerFromCharacter(playerInGame, player.character);
		await sleep(1000);
		ServerSend("ChatRoomChat", { Content: "*安宝：已确认完成购买，即将到达下一区域.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：已确认完成购买，即将到达下一区域.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(1000);
		ServerSend("ChatRoomChat", { Content: "*一会后， 运输仓停下了，舱门打开后又是一番奇异的景色.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*一会后， 运输仓停下了，舱门打开后又是一番奇异的景色.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		if(gameProcess === 1){
			gameProcess = 2;
			remainedCoinOfEachFloor = [200,200,200,200,200,0];
			await sleep(1000);
			ServerSend("ChatRoomChat", { Content: "*安宝：已到达区域二，本区域共有五层，可行动六次，进入下一区域需要500金币，注意每层金币余量，请开始探索.", Type: "Emote", Target: player.character.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*安宝：已到达区域二，本区域共有五层，可行动六次，进入下一区域需要500金币，注意每层金币余量，请开始探索.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
			await sleep(1000);
			ServerSend("ChatRoomChat", { Content: "*眼前的空间是一个广阔的大厅，其中分布满了柱子，每根柱子的间隔约为5米左右.", Type: "Emote", Target: player.character.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*眼前的空间是一个广阔的大厅，其中分布满了柱子，每根柱子的间隔约为5米左右.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
			await sleep(1000);
			ServerSend("ChatRoomChat", { Content: "*其中一些柱子间有墙连接，墙一面中间有门，但墙的另一面只是墙.", Type: "Emote", Target: player.character.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*其中一些柱子间有墙连接，墙一面中间有门，但墙的另一面只是墙.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );

		}
		else {

			gameProcess = 3;
			remainedCoinOfEachFloor = [350,300,250,350,300,250];
			await sleep(1000);
			ServerSend("ChatRoomChat", { Content: "*安宝：已到达区域三，本区域共有六层，可行动八次，进入结局区域需要1000金币，注意每层金币余量，请开始探索.", Type: "Emote", Target: player.character.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*安宝：已到达区域三，本区域共有六层，可行动八次，进入结局区域需要1000金币，注意每层金币余量，请开始探索.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
			await sleep(1000);
			ServerSend("ChatRoomChat", { Content: "*眼前的空间是一个正立方形的房间，但是无论是地板，墙壁，天花板，其中心都有一个舱门.", Type: "Emote", Target: player.character.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*眼前的空间是一个正立方形的房间，但是无论是地板，墙壁，天花板，其中心都有一个舱门.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
			await sleep(1000);
			ServerSend("ChatRoomChat", { Content: "*而且你发现，你可以走在墙上甚至是天花板上.", Type: "Emote", Target: player.character.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*而且你发现，你可以走在墙上甚至是天花板上.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );

		}
		playerInGame[0].slots[6].RemoveEquip(playerInGame[0]);
		playerInGame[1].slots[6].RemoveEquip(playerInGame[1]);
		playerInGame[0].location = "0";
		playerInGame[1].location = "0";
		gamePhase = 0;
		isControlable = true;

		console.log("移动至探索阶段， 区域" + gameProcess);
}

//处理结局
async function GotoEnd(player, type) {
	isControlable = false;
	anotherPlayer =  GetAnotherPlayerFromCharacter(playerInGame, player.character);

	if(type === 0){
		await sleep(2000);
		ServerSend("ChatRoomChat", { Content: "*运输舱在运至这个区域时明显发生了颠簸.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*运输舱在运至这个区域时明显发生了颠簸.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(2000);
		ServerSend("ChatRoomChat", { Content: "*运输舱停下并打开了舱门，面前的场景几乎让你感到莫大的恐惧.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*运输舱停下并打开了舱门，面前的场景几乎让你感到莫大的恐惧.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(2000);
		ServerSend("ChatRoomChat", { Content: "*在上不见顶，下不见底的极其广阔的空间中，被无数的形似棺材的箱子的阵列填满，从每一个箱子上的小窗望去，里面都装着一个人.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*在上不见顶，下不见底的极其广阔的空间中，被无数的形似棺材的箱子的阵列填满，从每一个箱子上的小窗望去，里面都装着一个人.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(2000);
		ServerSend("ChatRoomChat", { Content: "*安宝：您未能完成游戏目标，作为惩罚，您将成为该游戏的电源之一.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：您未能完成游戏目标，作为惩罚，您将成为该游戏的电源之一.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(2000);
		ServerSend("ChatRoomChat", { Content: "*一个似乎是空的箱子离开了阵列到了你的面前，打开了盖子.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*一个似乎是空的箱子离开了阵列到了你的面前，打开了盖子.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(2000);
		ServerSend("ChatRoomChat", { Content: "*你拼命挣扎，但箱子还是把你装了进去.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*你拼命挣扎，但箱子还是把你装了进去.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(2000);
		ServerSend("ChatRoomChat", { Content: "*大量管道伸入了你身上的每一个洞，有的在往你体内灌东西，有的在从你体内抽东西，仅是这一会你就高潮了数次.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*大量管道伸入了你身上的每一个洞，有的在往你体内灌东西，有的在从你体内抽东西，仅是这一会你就高潮了数次.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(2000);
		ServerSend("ChatRoomChat", { Content: "*安宝：能量抽取工作将持续4,294,967,296小时，完成抽取工作后会为您提供身上锁的密码并进行排出‬.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：能量抽取工作将持续4,294,967,296小时，完成抽取工作后会为您提供身上锁的密码并进行排出.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(2000);
		ServerSend("ChatRoomChat", { Content: "*安宝：那么还请享受这一过程，如果没法享受将只有痛苦‬.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：那么还请享受这一过程，如果没法享受将只有痛苦.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(2000);
		ServerSend("ChatRoomChat", { Content: "*安宝：箱子的合上了盖子，只留下在同时处于天国于地狱的你留在里面‬.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：箱子的合上了盖子，只留下在同时处于天国于地狱的你留在里面‬.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(2000);
		ServerSend("ChatRoomChat", { Content: "*结局：永劫.[提示：有注意到每个区域的每层的金币储量是有限的吗？最好即使切换楼层哦].", Type: "Chat"} );
		ServerSend("ChatRoomChat", { Content: "*[其实只需要等15分钟就可以获得密码了，随时(排出)可以直接离开，当然没有密码的话就算再进来也没法给哦].", Type: "Chat"} );
		IsGameStart = false;
		End1(player, anotherPlayer);
		ResetGame();
	}
	else{
		await sleep(1000);
		ServerSend("ChatRoomChat", { Content: "*运输舱移动了似乎十分漫长的时间.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*运输舱移动了似乎十分漫长的时间.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(5000);
		ServerSend("ChatRoomChat", { Content: "*运输舱的舱门打开了，但你仍被固定在里面.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*运输舱的舱门打开了，但你仍被固定在里面.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(1000);
		ServerSend("ChatRoomChat", { Content: "*面前是一位女孩子，穿着全套的电子拘束器，你听到了安宝的声音，不是从内耳道耳机里，而是从面前的女孩子身上.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*面前是一位女孩子，穿着全套的电子拘束器，你听到了安宝的声音，不是从内耳道耳机里，而是从面前的女孩子身上.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(1000);
		ServerSend("ChatRoomChat", { Content: "*安宝：以这种方式会见二位真是不好意思，再此重新自我介绍，本机是游戏执行AI 安洁莉卡，在过去的某个时点，本机曾是人类.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：以这种方式会见二位真是不好意思，再此重新自我介绍，本机是游戏执行AI 安洁莉卡，在过去的某个时点，本机曾是人类.", Type: "Emote", Target: anotherPlayer.character.MemberNumber} );
		await sleep(1000);
		IsGameStart = false;
		ResetGame();
		if(player.EndingEquipCount === 6 && anotherPlayer.EndingEquipCount === 6){
			End4(player, anotherPlayer);
		}
		else {
			if (player.EndingEquipCount >= 6){
				End2(player);
			}
			else{
				End3(player);
			}
			if (anotherPlayer.EndingEquipCount >= 6){
				End2(anotherPlayer);
			}
			else{
				End3(anotherPlayer);
			}
		}





	}
	resetRoom(2);
}

//
function End1(player1, player2) {

	playerInpunish.push(player1);
	playerInpunish.push(player2);
	playerInGame.splice(playerInGame.indexOf(player1),1);
	playerInGame.splice(playerInGame.indexOf(player2),1);
	//穿上对应装备
	//InventoryRemove(player.character, "ItemDevices", true);
	QuestList(14).QuestFail(player1);
	QuestList(14).QuestFail(player2);
	InventoryWear(player1.character, "CryoCapsule","ItemDevices");
	InventoryWear(player2.character, "CryoCapsule","ItemDevices");
	InventoryLock(player1.character, InventoryGet(player1.character, "ItemDevices"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
	InventoryLock(player2.character, InventoryGet(player2.character, "ItemDevices"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);

	InventoryGet(player1.character,"ItemDevices").Property.CombinationNumber = player1.lockcode;
	InventoryGet(player2.character,"ItemDevices").Property.CombinationNumber = player2.lockcode;
	InventoryGet(player1.character,"ItemDevices").Property.Type = "Closed";
	InventoryGet(player2.character,"ItemDevices").Property.Type = "Closed";
	ChatRoomCharacterUpdate(player1.character);
	ChatRoomCharacterUpdate(player2.character);


	setTimeout(function () {
		player1.slots[7].GetInventorys(player1)[1].Property.Text = player1.lockcode.toString();
		ChatRoomCharacterUpdate(playe1r.character);
		ServerSend("ChatRoomChat", { Content: "*已在项圈上显示密码", Type: "Emote", Target: player1.character.MemberNumber} );

		player2.slots[7].GetInventorys(player2)[1].Property.Text = player2.lockcode.toString();
		ChatRoomCharacterUpdate(player2.character);
		ServerSend("ChatRoomChat", { Content: "*已在项圈上显示密码", Type: "Emote", Target: player2.character.MemberNumber} );
	}, 900 * 1000);

	//resetRoom(0);


}

function End2(player) {
	var time = 5000;
	ServerSend("ChatRoomChat", { Content: "*安宝：您身上的是...难道...", Type: "Emote", Target: player.character.MemberNumber} );
	if(player.EndingEquipCount === 6){
		ServerSend("ChatRoomChat", { Content: "*安宝：啊啊...您集齐了...", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：我终于能，解脱了", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝身上的电子拘束具脱落到了地上，随之她也倒在地上，没了气息.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*你突然感到一阵头痛.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*脑！袋！要！炸！了！", Type: "Emote", Target: player.character.MemberNumber} );
		setTimeout(ServerSend("ChatRoomChat", { Content: "*你是安洁莉卡，游戏《异次元色色阵》的执行AI，你现在的任务是处理面前的无名尸体并主持进行下一场游戏.", Type: "Emote", Target: player.character.MemberNumber} ),
			time);
		time +=1000;
		setTimeout(ServerSend("ChatRoomChat", { Content: "*身上的电子拘束具让你感到十分的舒服，让你感到你理应为这个游戏服务.", Type: "Emote", Target: player.character.MemberNumber} ),
			time);
		time +=1000;
		setTimeout(ServerSend("ChatRoomChat", { Content: "*你走出了运输舱，坐在了还有余温的椅子上，开始操作控制台.", Type: "Emote", Target: player.character.MemberNumber} ),
			time);
		time +=1000;
		setTimeout(ServerSend("ChatRoomChat", { Content: "*"+player.character.Name+"达成结局：传承[打出这个结局可不容易，恭喜恭喜，不过还有一个结局，密码已显示在项圈上，30秒后送走].", Type: "Chat"} ),
			time);
		player.slots[6].RemoveEquip(player);
		player.slots[7].GetInventorys(player)[1].Property.Text = player.lockcode.toString();
		ChatRoomCharacterUpdate(player.character);

	}
	else {
		ServerSend("ChatRoomChat", { Content: "*安宝：啊啊...果然是这样...", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：失态了，您的项圈或许是因为一次性穿戴多个电子拘束器的原因出错了，所以没法...", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：我...本机认为还是应该还您自由.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*安宝：那么，请离开吧，若是还有机会的话，恳请您能...没什么.", Type: "Emote", Target: player.character.MemberNumber} );
		setTimeout(ServerSend("ChatRoomChat", { Content: "*"+player.character.Name+"达成结局：遗憾[提示：或许应该分多次找到电子拘束器，出于作者的恶趣味所以不提供密码，想要密码的话得重新游戏，30秒后送走].", Type: "Chat"} ),
			time);
		player.slots[6].RemoveEquip(player);
	}
	playerInpunish.push(player);
	playerInGame.splice(playerInGame.indexOf(player),1);
	setTimeout(function (player) {
		ChatRoomAdminChatAction("Kick", player.MemberNumber.toString())
	}, time + 30 * 1000, player.character)

	//resetRoom(0);
}

function End3(player) {
	player.slots[6].RemoveEquip(player);
	ServerSend("ChatRoomChat", { Content: "*安宝：那么请您支付500金币以获得拘束器的密码", Type: "Emote", Target: player.character.MemberNumber} );
	if(player.coin >= 500){
		ServerSend("ChatRoomChat", { Content: "*安宝：非常感谢您的配合，这就将密码提供给您", Type: "Emote", Target: player.character.MemberNumber} );
		player.slots[7].GetInventorys(player)[1].Property.Text = player.lockcode.toString();
		ChatRoomCharacterUpdate(player.character);
		ServerSend("ChatRoomChat", { Content: "*"+player.character.Name+"达成结局：通关[提示：要不要试试在游戏中多检查检查周围环境，30秒后送走].", Type: "Chat"} );

	}
	else {
		ServerSend("ChatRoomChat", { Content: "*安宝：真是遗憾，您只能在这套束缚里离开了，如果参加下一场游戏并提供500金币的话，还是可以将密码提供给您的.", Type: "Emote", Target: player.character.MemberNumber} );
		ServerSend("ChatRoomChat", { Content: "*"+player.character.Name+"达成结局：再来[提示：试着抢先拿到更多金币吧，30秒后送走].", Type: "Chat"} );
	}
	playerInpunish.push(player);
	playerInGame.splice(playerInGame.indexOf(player),1);

	setTimeout(function (player) {
		ChatRoomAdminChatAction("Kick", player.MemberNumber.toString())
	}, time + 30 * 1000, player.character)

	//resetRoom(0);

}

function End4(player1, player2) {
	var time = 5000;
	ServerSend("ChatRoomChat", { Content: "*安宝：两人...竟然能同时...", Type: "Emote", Target: player1.character.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*安宝：两人...竟然能同时...", Type: "Emote", Target: player2.character.MemberNumber} );

	ServerSend("ChatRoomChat", { Content: "*安宝：循环，终于也将...", Type: "Emote", Target: player1.character.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*安宝：循环，终于也将...", Type: "Emote", Target: player2.character.MemberNumber} );

	ServerSend("ChatRoomChat", { Content: "*安宝身上的电子拘束具脱落到了地上，随之她也倒在地上，没了气息.", Type: "Emote", Target: player1.character.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*安宝身上的电子拘束具脱落到了地上，随之她也倒在地上，没了气息.", Type: "Emote", Target: player2.character.MemberNumber} );

	ServerSend("ChatRoomChat", { Content: "*你突然感到一阵头痛.", Type: "Emote", Target: player1.character.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*你突然感到一阵头痛.", Type: "Emote", Target: player2.character.MemberNumber} );

	ServerSend("ChatRoomChat", { Content: "*脑！袋！要！炸！了！", Type: "Emote", Target: player1.character.MemberNumber} );
	ServerSend("ChatRoomChat", { Content: "*脑！袋！要！炸！了！", Type: "Emote", Target: player2.character.MemberNumber} );

	setTimeout(function (){
		player1.slots[6].RemoveEquip(player1);
		InventoryWear(player1, "TheDisplayFrame", "ItemDevices", "Default",80);
		player1.slots[7].GetInventorys(player1)[1].Property.Text = player.lockcode.toString();
		ChatRoomCharacterUpdate(player1.character);

		player2.slots[6].RemoveEquip(player2);
		InventoryWear(player2, "TheDisplayFrame", "ItemDevices", "Default",80);
		player2.slots[7].GetInventorys(player2)[1].Property.Text = player.lockcode.toString();
		ChatRoomCharacterUpdate(player2.character);
	}, time);
	time +=1000;


	setTimeout(ServerSend("ChatRoomChat", { Content: "*循环终究还是没能被打破，现在你和你的搭档被固定在柱子里，全身的肌肉早已因为长年没有进行活动而早已萎缩.", Type: "Emote", Target: player1.character.MemberNumber} ),
		time);
	setTimeout(ServerSend("ChatRoomChat", { Content: "*循环终究还是没能被打破，现在你和你的搭档被固定在柱子里，全身的肌肉早已因为长年没有进行活动而早已萎缩.", Type: "Emote", Target: player2.character.MemberNumber} ),
		time);
	time +=1000;
	setTimeout(ServerSend("ChatRoomChat", { Content: "*你们会共享彼此的快感，已经记不清是谁最先高潮的，但一方的高潮会传递至另一方，随后更强的高潮又会传递回来.", Type: "Emote", Target: player1.character.MemberNumber} ),
		time);
	setTimeout(ServerSend("ChatRoomChat", { Content: "*你们会共享彼此的快感，已经记不清是谁最先高潮的，但一方的高潮会传递至另一方，随后更强的高潮又会传递回来.", Type: "Emote", Target: player2.character.MemberNumber} ),
		time);
	time +=1000;
	setTimeout(ServerSend("ChatRoomChat", { Content: "*你的精神扩张到了整个设施的范围，你能感到这个游戏正在随着你们不断的高潮而不断的扩张与丰富.", Type: "Emote", Target: player1.character.MemberNumber} ),
		time);
	setTimeout(ServerSend("ChatRoomChat", { Content: "*你的精神扩张到了整个设施的范围，你能感到这个游戏正在随着你们不断的高潮而不断的扩张与丰富.", Type: "Emote", Target: player2.character.MemberNumber} ),
		time);
	time +=1000;
	setTimeout(ServerSend("ChatRoomChat", { Content: "*而接下来的来访者，将会体验由你们二人完善至极致的，游戏这一概念的顶点.", Type: "Emote", Target: player1.character.MemberNumber} ),
		time);
	setTimeout(ServerSend("ChatRoomChat", { Content: "*而接下来的来访者，将会体验由你们二人完善至极致的，游戏这一概念的顶点.", Type: "Emote", Target: player2.character.MemberNumber} ),
		time);
	time +=1000;
	setTimeout(ServerSend("ChatRoomChat", { Content: "*"+player1.character.Name+" 与 "+ +player2.character.Name +"达成结局：极致[竟然能达到这个结局，牛逼牛逼，30秒后送走].", Type: "Chat"} ),
		time);
	setTimeout(ServerSend("ChatRoomChat", { Content: "*密码分别是 " + player1.lockcode.toString() +" 和 "+ player2.lockcode.toString() + "要好好记住哦", Type: "Chat"} ),
		time);
	setTimeout(function (player) {
		ChatRoomAdminChatAction("Kick", player.MemberNumber.toString())
	}, time + 30 * 1000, player1.character);
	setTimeout(function (player) {
		ChatRoomAdminChatAction("Kick", player.MemberNumber.toString())
	}, time + 30 * 1000, player2.character);
}


//电子装备变动时调用
function ChangeCollarText(player) {
	if (player.slots[7] !== null){
		if (player.EndingEquipCount < 6){
			player.slots[7].GetInventorys(player)[1].Property.Text = player.EndingEquipCount.toString();
		}
		else if(player.EndingEquipCount < 7){
			player.slots[7].GetInventorys(player)[1].Property.Text = "MAX";
		}
		else {
			player.slots[7].GetInventorys(player)[1].Property.Text = "ERR";
		}
	}

}

//从玩家的Character获取到另一个玩家的Player
function GetAnotherPlayerFromCharacter(PlayerStack,player) {
	for (var i = 0; i < PlayerStack.length; i++){
		if(PlayerStack[i].character !== player){
			return PlayerStack[i];
		}
	}
	return "null";
}
//从玩家的Character获取到玩家的Player
function GetPlayerFromCharacter(PlayerStack,player) {
	for (var i = 0; i < PlayerStack.length; i++){
		if(PlayerStack[i].character === player){
			return PlayerStack[i];
		}
	}
	return "null";
}

//玩家结构体
function PlayerStruct() {
	this.character = null;
	this.slots = [];//head mouth body arm leg cloth device neck
	this.location = "";
	this.coin = 0;
	this.submitCoin = 0;
	this.state = new stateStruct().PlayerDefault();
	this.item = [];
	this.lockcode = "";
	this.movementCount = 0;
	this.currentQuest = null;
	this.isCurrentQuestSuccess = false;
	this.EndingEquipCount = 0;

	this.NewPlayer = function (Sender) {
		this.character = Sender;
		this.slots = [null, null, null, null, null, null, null, null];
		this.location = "等待区域";
		this.coin = 0;
		this.submitCoin = 0;
		this.state = new stateStruct().PlayerDefault();
		this.item = [];
		this.lockcode = Math.floor(Math.random() * 9000+1000).toString();
		this.movementCount = 0;
		this.currentQuest = null;
		this.isCurrentQuestSuccess = false;
		this.EndingEquipCount = 0;
		return this;
	}


}

//装备结构体
function EquipStruct() {
	this.slot = 0;// head mouth body arm leg cloth device neck
	this.useSlot = [];
	this.state = new stateStruct().EquipDefault();
	this.name = "";
	this.id = 0;
	this.description = "";
	this.equipAsset = [];


	this.SetEquip = function (slot, useSlot, state, name, id, description, equipAsset) {
		this.slot =slot;
		this.useSlot = useSlot;
		this.state = state;
		this.name = name;
		this.id = id;
		this.description = description;
		this.equipAsset = equipAsset;
		return this;
	};

	//检测是否可穿戴装备后穿戴
	/**
	 * @return {boolean}
	 */
	this.WearEquip = function (wearer) {
		//检测对应槽位是否被占用
		if (wearer.slots[this.slot] === null ){
			//检测占用槽位是否被占用
			for (var i = 0; i<this.useSlot.length; i++){
				if (wearer.slots[this.useSlot[i]] !== null ){
					ServerSend("ChatRoomChat", { Content: "*但是该槽位被其他装备占用了", Type: "Emote", Target: wearer.character.MemberNumber} );
					return false;
				}
			}
			//匹配通过则调用穿戴
			this.ForceWearEquip(wearer);
			return true;
		}
		else {
			ServerSend("ChatRoomChat", { Content: "*但是该槽位已经有装备了", Type: "Emote", Target: wearer.character.MemberNumber} );
			return false;
		}
	};

	//不检测是否可穿戴直接取代
	this.ForceWearEquip = function (wearer) {

		if(wearer.slots[this.slot] !== null){
			//该槽位被其他装备占用时处理
			if (typeof wearer.slots[this.slot] === "number"){
				wearer.slots[wearer.slots[this.slot]].RemoveEquip(wearer);
			}
			//该槽位以存在其他装备时处理
			else {
				wearer.slots[this.slot].RemoveEquip(wearer);
			}
		}

		//脱下占用槽位的所有装备并占用
		for(var i = 0; i< this.useSlot.length; i++){
			if (wearer.slots[this.useSlot[i]] !== null && typeof wearer.slots[this.useSlot[i]] !== "number"){
				wearer.slots[this.useSlot[i]].RemoveEquip(wearer);
			}
			wearer.slots[this.useSlot[i]] = this.slot;
		}
		wearer.slots[this.slot] = this;
		for (var i = 0; i < this.equipAsset.length; i++){
			InventoryWear(wearer.character, this.equipAsset[i].assetName, this.equipAsset[i].assetGroup, this.equipAsset[i].color, 100, null, null, true);
			inv = InventoryGet(wearer.character,this.equipAsset[i].assetGroup);
			if(inv.hasOwnProperty('Property') && inv.Property !== undefined){
				if(inv.Property.hasOwnProperty('Type') === true){
					inv.Property.Type = this.equipAsset[i].propertyType;
				}
				if (inv.Property.hasOwnProperty('Text') === true){
					inv.Property.Text = this.equipAsset[i].propertyText;
				}
				if (inv.Property.hasOwnProperty('Mode') === true){
					inv.Property.Mode = this.equipAsset[i].propertyMode;
				}
			}

		}
		//结局相关装备处理
		if(this.id >= 100){
			wearer.EndingEquipCount +=1;
			ChangeCollarText(wearer);

		}
		this.Addlock(wearer);
		ChatRoomCharacterUpdate(wearer.character);
	};

	//移除装备
	this.RemoveEquip = function (wearer) {
		wearer.slots[this.slot] = null;
		for (var i = 0; i < this.equipAsset.length; i++){
			InventoryRemove(wearer.character, this.equipAsset[i].assetGroup);
		}
		for (var i = 0; i< this.useSlot.length; i++){
			wearer.slots[this.useSlot[i]] = null;
		}
		if(this.id >= 100){
			wearer.EndingEquipCount -=1;
			ChangeCollarText(wearer);
		}
		ChatRoomCharacterUpdate(wearer.character);
	};

	this.Addlock = function (wearer) {
		for (var i = 0; i < this.equipAsset.length; i++){
			InventoryLock(wearer.character, InventoryGet(wearer.character, this.equipAsset[i].assetGroup), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
			inv = InventoryGet(wearer.character,this.equipAsset[i].assetGroup);
			if(inv.hasOwnProperty('Property') && inv.Property !== undefined){
				if(inv.Property.hasOwnProperty('CombinationNumber') === true){
					inv.Property.CombinationNumber = wearer.lockcode;
				}
			}

		}
		ChatRoomCharacterUpdate(wearer.character);
	};

	//在游戏内的该装备
	this.GetInventorys = function (wearer) {
		list = [];
		for (var i = 0; i < this.equipAsset.length; i++){
			list.push(InventoryGet(wearer.character,this.equipAsset[i].assetGroup));
		}
		return list;
	}
}

//按id或名字返回一个EquipStruct
function EquipList(indexOrName) {
	equip = new EquipStruct();
	switch (indexOrName) {
		//运输舱，
		case 0:
		case "运输舱":{
			equip.SetEquip(6,[], equip.state.EquipDefault(), "运输舱", 0,"{无效果.靠自己没有出去的可能}",
				[new EquipAssetStruct().SetEquipAsset("FuturisticCrate", "ItemDevices", null, "w3l3a3d0t0h0", null)]);
			return equip;
		}

		case 1:
		case "电子项圈":{
			equip.SetEquip(7,[], equip.state.EquipDefault(), "电子项圈", 1,"{无效果.显示屏偶尔会显示些什么}",
				[new EquipAssetStruct().SetEquipAsset("FuturisticCollar", "ItemNeck", null, null, "lock"),
					new EquipAssetStruct().SetEquipAsset("ElectronicTag", "ItemNeckAccessories", null, null, "lock")]);
			return equip;
		}

		case 2:
		case "史莱姆":{
			equip.SetEquip(4,[], equip.state.SetState(2, -3, 0,0,0), "史莱姆", 2,"{str+2，agi-3.怎么甩也甩不掉}",
				[new EquipAssetStruct().SetEquipAsset("Slime", "ItemBoots", null, null, null)]);
			return equip;
		}

		case 3:
		case "后手缚":{
			equip.SetEquip(3,[], equip.state.SetState(-3, 2, 0,0,0), "后手缚", 3,"{str-3，agi+2.感觉绳痕很难消掉}",
				[new EquipAssetStruct().SetEquipAsset("HempRope", "ItemArms", null, null, null)]);
			return equip;
		}

		case 4:
		case "眼罩":{
			equip.SetEquip(0,[], equip.state.SetState(0, 0, 2,-3,0), "眼罩", 4,"{int+2，mnd-3.眼前一黑}",
				[new EquipAssetStruct().SetEquipAsset("PaddedBlindfold", "ItemHead", null, null, null)]);
			return equip;
		}

		case 5:
		case "贞操带":{
			equip.SetEquip(2,[], equip.state.SetState(0, 0, -3,2,0), "贞操带", 5,"{int-3，mnd+2.你开始想自慰了}",
				[new EquipAssetStruct().SetEquipAsset("PolishedChastityBelt", "ItemPelvis", null, null, null)]);
			return equip;
		}

		case 6:
		case "贞操带与震动棒":{
			equip.SetEquip(2,[], equip.state.SetState(0, 0, -3,-1,0), "贞操带与震动棒", 6,"{int-3，mnd-1.震得你连路也走不直}",
				[new EquipAssetStruct().SetEquipAsset("PolishedChastityBelt", "ItemPelvis", null, null, null),
					new EquipAssetStruct().SetEquipAsset("VibratingDildo", "ItemVulva", null, null, null,"High")]);
			return equip;
		}

		case 7:
		case "触手服":{
			equip.SetEquip(5,[], equip.state.SetState(-1, -1, -1,-1,-1), "触手服", 7,"{all-1.这些触手在未经你允许的情况下开发你的身体}",
				[new EquipAssetStruct().SetEquipAsset("SeamlessCatsuit", "Suit", "#202020", "OpaqueGloves", null),
					new EquipAssetStruct().SetEquipAsset("SeamlessCatsuit", "SuitLower", ["#202020"], null, null)]);
			return equip;
		}

		case 8:
		case "束缚绑带":{
			equip.SetEquip(3,[4], equip.state.SetState(3, -2, 3,-2,0), "束缚绑带", 8,"{str+3，agi-2，int3，mnd-2.只需几根就能让你动弹不得}",
				[new EquipAssetStruct().SetEquipAsset("SturdyLeatherBelts", "ItemArms", null, "Three", null),
					new EquipAssetStruct().SetEquipAsset("SturdyLeatherBelts", "ItemLegs", null, "Two", null),
					new EquipAssetStruct().SetEquipAsset("SturdyLeatherBelts", "ItemFeet", null, "Three", null)]);
			return equip;
		}

		case 9:
		case "乳胶修女":{
			equip.SetEquip(0,[1], equip.state.SetState(-2, 3, -2,3,0), "乳胶修女", 9,"{str-2，agi+3，int-2，mnd+3.你发现你会无意识的做出祷的动作}",
				[new EquipAssetStruct().SetEquipAsset("FuturisticMask", "ItemHead", ["#000000", "#FFFFFF", "#FFFFFF"], "Blind", null),
					new EquipAssetStruct().SetEquipAsset("LatexRespirator", "ItemMouth3", null, "f2g0s1m1l1", null),
					new EquipAssetStruct().SetEquipAsset("LatexHabit", "ItemHood", null, "Loose", null)]);
			return equip;
		}

		case 10:
		case "拘束衣":{
			equip.SetEquip(3,[], equip.state.SetState(-4, 0, 0,3,0), "拘束衣", 10,"{str-4，mnd+3.就像贴身的监狱}",
				[new EquipAssetStruct().SetEquipAsset("PrisonLockdownSuit", "ItemArms", ["#cecece", "Default"], "r3s0", null),
					new EquipAssetStruct().SetEquipAsset("PrisonLockdownGag", "ItemMouth2", ["#cecece", "Default", "Default"], null, null)]);
			return equip;
		}

		case 11:
		case "强高配饰":{
			equip.SetEquip(2,[], equip.state.SetState(3, -4, 0,0,0), "强高配饰", 11,"{str+3，agi-4.平均每分钟都会让你高潮一次}",
				[new EquipAssetStruct().SetEquipAsset("ClitAndDildoVibratorbelt", "ItemVulva", null, "d3e3", null)]);
			return equip;
		}

		case 12:
		case "大史莱姆":{
			equip.SetEquip(0,[], equip.state.SetState(0, 3, -4,0,0), "大史莱姆", 12,"{agi+3，int-4.青苹果味}",
				[new EquipAssetStruct().SetEquipAsset("Slime", "ItemHood", null, null, null)]);
			return equip;
		}

		case 13:
		case "女仆装":{
			equip.SetEquip(5,[], equip.state.SetState(0, 0, 3,-4,0), "女仆装", 13,"{int+3，mnd-4.奉献精神的体现}",
				[new EquipAssetStruct().SetEquipAsset("MaidOutfit1", "Cloth", null, null, null),
					new EquipAssetStruct().SetEquipAsset("FrillyApron", "ClothAccessory", null, null, null),
					new EquipAssetStruct().SetEquipAsset("Gloves1", "Gloves", ["#AAAAAA"], null, null),
					new EquipAssetStruct().SetEquipAsset("AnkleStrapShoes", "Shoes", null, null, null),
					new EquipAssetStruct().SetEquipAsset("MaidHairband1", "Hat", null, null, null),
					new EquipAssetStruct().SetEquipAsset("Stockings2", "Socks", null, null, null)]);
			return equip;
		}

		case 14:
		case "侍寝套装":{
			equip.SetEquip(5,[], equip.state.SetState(0, 0, 3,-4,0), "侍寝套装", 14,"{int+3，mnd-4.献身精神的体现}",
				[new EquipAssetStruct().SetEquipAsset("HaremPants2", "ClothLower", null, null, null),
					new EquipAssetStruct().SetEquipAsset("HaremGlove", "Gloves", null, null, null),
					new EquipAssetStruct().SetEquipAsset("HaremBra", "Bra", null, null, null),
					new EquipAssetStruct().SetEquipAsset("Sandals", "Shoes", null, null, null),
					new EquipAssetStruct().SetEquipAsset("RoundPiercing", "ItemNipplesPiercings", null, null, null),
					new EquipAssetStruct().SetEquipAsset("RoundClitPiercing", "ItemVulvaPiercings", null, "HaremChain", null),
					new EquipAssetStruct().SetEquipAsset("HaremStockings", "Socks", null, null, null),
					new EquipAssetStruct().SetEquipAsset("FaceVeil", "Mask", null, null, null)]);
			return equip;
		}

		case 15:
		case "挠痒靴":{
			equip.SetEquip(4,[], equip.state.SetState(0, -2, 0,0,0), "挠痒靴", 15,"{agi-2.你感觉肺活量受到了锻炼}",
				[new EquipAssetStruct().SetEquipAsset("LockingBoots1", "ItemBoots", null, null, null)]);
			return equip;
		}

		case 16:
		case "史莱姆王":{
			equip.SetEquip(0,[1,2,3,4,5], equip.state.SetState(-10, 10, -10,-10,-10), "史莱姆王", 16,"{agi+10，其余-10.她会带你去该去的地方}",
				[new EquipAssetStruct().SetEquipAsset("Slime", "ItemHead", null, null, null),
					new EquipAssetStruct().SetEquipAsset("Slime", "ItemMouth", null, null, null),
					new EquipAssetStruct().SetEquipAsset("Slime", "ItemArms", null, "p1t1", null)]);
			return equip;
		}

		case 17:
		case "触手皇":{
			equip.SetEquip(0,[1,2,3,4,5], equip.state.SetState(-10, 2, -10,-10,-10), "触手皇", 17,"{agi+2，其余-10.它深入了你身上的每一个洞}",
				[new EquipAssetStruct().SetEquipAsset("Tentacles", "ItemHead", null, null, null),
					new EquipAssetStruct().SetEquipAsset("Tentacles", "ItemMouth", null, null, null),
					new EquipAssetStruct().SetEquipAsset("Tentacles", "ItemArms", null, null, null),
					new EquipAssetStruct().SetEquipAsset("Tentacles", "ItemButt", null, null, null),
					new EquipAssetStruct().SetEquipAsset("Tentacles", "ItemLegs", null, null, null),
					new EquipAssetStruct().SetEquipAsset("Tentacles", "ItemFeet", null, null, null)]);
			return equip;
		}

		case 18:
		case "华美舞者":{
			equip.SetEquip(0,[1,2,3,4,5], equip.state.SetState(-10, -10, 10,10,-10), "华美舞者", 18,"{int+10，其余-10.你就像艺术品般完美}",
				[new EquipAssetStruct().SetEquipAsset("Ribbons3", "HairAccessory3", ["#BE0000"], null, null),
					new EquipAssetStruct().SetEquipAsset("BondageSkirt", "ClothLower", ["#1D1D1D", "#BE0000", "#BE0000"], null, null),
					new EquipAssetStruct().SetEquipAsset("DominatrixLeotard", "Bra", ["#444444", "#444444"], null, null),
					new EquipAssetStruct().SetEquipAsset("Veil2", "Hat", ["#474747"], null, null),
					new EquipAssetStruct().SetEquipAsset("LeatherSlimMaskOpenMouth", "ItemHead", null, null, null),
					new EquipAssetStruct().SetEquipAsset("PlugGag", "ItemMouth", null, null, null),
					new EquipAssetStruct().SetEquipAsset("BoxTieArmbinder", "ItemArms", ["#BE0000", "#ffffff"], null, null),
					new EquipAssetStruct().SetEquipAsset("MonoHeel", "ItemBoots", ["#202020", "#BE0000", "#999"], null, null)]);
			return equip;
		}

		case 19:
		case "落地灯":{
			equip.SetEquip(0,[1,2,3,4,5], equip.state.SetState(-10, -10, 2,-10,-10), "落地灯", 19,"{int+2，其余-10.你正在发光发热}",
				[new EquipAssetStruct().SetEquipAsset("LampHeadHood", "ItemHood", ["#bbbbbb", "#bbbbbb", "#bbbbbb"], null, null),
					new EquipAssetStruct().SetEquipAsset("PlugGag", "ItemMouth", ["#FFFFFF"], null, null),
					new EquipAssetStruct().SetEquipAsset("TheDisplayFrame", "ItemDevices", null, null, null)]);
			return equip;
		}

		case 20:
		case "犬化":{
			equip.SetEquip(0,[1,2,3,4,5], equip.state.SetState(-10, -10, -10,10,-10), "犬化", 20,"{mnd+10，其余-10.汪~}",
				[new EquipAssetStruct().SetEquipAsset("BoneGag", "ItemMouth", null, null, null),
					new EquipAssetStruct().SetEquipAsset("PolishedChastityBra", "ItemBreast", null, null, null),
					new EquipAssetStruct().SetEquipAsset("HeavyLatexCorset", "ItemTorso", null, "Straps", null),
					new EquipAssetStruct().SetEquipAsset("StrictLeatherPetCrawler", "ItemArms", null, null, null)]);
			return equip;
		}

		case 21:
		case "美人鱼":{
			equip.SetEquip(0,[1,2,3,4,5], equip.state.SetState(-10, -10, -10,10,-10), "美人鱼", 21,"{mnd+2，其余-10.舍弃了腿，换来了鳍}",
				[new EquipAssetStruct().SetEquipAsset("MermaidSuit", "ItemArms", null, null, null)]);
			return equip;
		}

		case 22:
		case "拷问":{
			equip.SetEquip(0,[1,2,3,4,5], equip.state.SetState(10, -10, -10,-10,-10), "拷问", 22,"{str+10，其余-10.恐惧随着伤疤刻入身体}",
				[new EquipAssetStruct().SetEquipAsset("PolishedSteelHood", "ItemHood", null, null, null),
					new EquipAssetStruct().SetEquipAsset("Pillory", "ItemArms", null, null, null),
					new EquipAssetStruct().SetEquipAsset("CrossedStraightPiercing", "ItemNipplesPiercings", null, null, null),
					new EquipAssetStruct().SetEquipAsset("NippleWeightClamps", "ItemNipples", null, null, null),
					new EquipAssetStruct().SetEquipAsset("PolishedMittens", "ItemHands", null, null, null),
					new EquipAssetStruct().SetEquipAsset("ObedienceBelt", "ItemPelvis", null, "c3s1e0", "SLAVE"),
					new EquipAssetStruct().SetEquipAsset("WoodenHorse", "ItemDevices", null, null, null)]);
			return equip;
		}

		case 23:
		case "囚禁":{
			equip.SetEquip(0,[1,2,3,4,5], equip.state.SetState(2, -10, -10,-10,-10), "拷问", 22,"{str+2，其余-10.即使身上的枷锁被卸下，心灵仍然被囚禁}",
				[new EquipAssetStruct().SetEquipAsset("PolishedSteelHood", "ItemHood", null, null, null),
					new EquipAssetStruct().SetEquipAsset("Pillory", "ItemArms", null, null, null),
					new EquipAssetStruct().SetEquipAsset("PolishedMittens", "ItemHands", null, null, null),
					new EquipAssetStruct().SetEquipAsset("ObedienceBelt", "ItemPelvis", null, "c0s1e0", "SLAVE"),
					new EquipAssetStruct().SetEquipAsset("CrossedStraightPiercing", "ItemNipplesPiercings", null, null, null),
					new EquipAssetStruct().SetEquipAsset("NippleWeightClamps", "ItemNipples", null, null, null),
					new EquipAssetStruct().SetEquipAsset("SpreaderDildoBar", "ItemFeet", null, null, null),
					new EquipAssetStruct().SetEquipAsset("WoodenBox", "ItemDevices", null, null, null)]);
			return equip;
		}

		case 24:
		case "蜘蛛巢":{
			equip.SetEquip(0,[3,4], equip.state.SetState(3, -3, -3,3,0), "蜘蛛巢", 24,"{str+3，agi-3，int-3，mnd+3.有什么刺入了你的身体}",
				[new EquipAssetStruct().SetEquipAsset("WebBlindfold", "ItemHead", null, "Cocoon", null),
					new EquipAssetStruct().SetEquipAsset("Web", "ItemArms", null, "KneelingSuspended", null)]);
			return equip;
		}

		case 25:
		case "婴儿套装":{
			equip.SetEquip(0,[3,4], equip.state.SetState(3, 3, -3,-3,0), "婴儿套装", 25,"{str+3，agi+3，int-3，mnd-3.你想喝奶奶}",
				[new EquipAssetStruct().SetEquipAsset("HarnessPacifierGag", "ItemMouth", null, null, null),
					new EquipAssetStruct().SetEquipAsset("AdultBabyHarness", "ItemTorso", null, null, null),
					new EquipAssetStruct().SetEquipAsset("PawMittens", "ItemHands", null, null, null),
					new EquipAssetStruct().SetEquipAsset("MittenChain1", "ItemArms", null, null, null),
					new EquipAssetStruct().SetEquipAsset("DiaperHarness", "ItemPelvis", null, null, null)]);
			return equip;
		}

		case 100:
		case "电子紧身衣":{
			equip.SetEquip(5,[], equip.state.SetState(1, 1, 1,1,1), "电子紧身衣", 100,"{all+!.似乎你的项圈对这件衣服有反应}",
				[new EquipAssetStruct().SetEquipAsset("PilotSuit", "Suit", null, "OpaqueGloves", null),
					new EquipAssetStruct().SetEquipAsset("PilotSuit", "SuitLower", null, null, null)]);
			return equip;
		}

		case 101:
		case "电子口套":{
			equip.SetEquip(1,[], equip.state.SetState(0, 0, 0,2,0), "电子口套", 101,"{mnd+@.似乎你的项圈对这件口套有反应}",
				[new EquipAssetStruct().SetEquipAsset("FuturisticHarnessPanelGag", "ItemMouth", null, "g3p3t4", null)]);
			return equip;
		}

		case 102:
		case "电子眼罩":{
			equip.SetEquip(0,[], equip.state.SetState(0, 0, 2,0,0), "电子眼罩", 102,"{int+@.似乎你的项圈对这件眼罩有反应}",
				[new EquipAssetStruct().SetEquipAsset("InteractiveVRHeadset", "ItemHead", null, "b5f0g0", null)]);
			return equip;
		}

		case 103:
		case "电子贞操具":{
			equip.SetEquip(2,[], equip.state.SetState(1, 1, 1,1,1), "电子贞操具", 103,"{all+!.似乎你的项圈对这套贞操具有反应}",
				[new EquipAssetStruct().SetEquipAsset("FuturisticHarness", "ItemTorso", null, null, null),
					new EquipAssetStruct().SetEquipAsset("FuturisticBra2", "ItemBreast", null, "d0s0", null),
					new EquipAssetStruct().SetEquipAsset("VibratingDildo", "ItemVulva", null, null, null, "High"),
					new EquipAssetStruct().SetEquipAsset("VibratingDildoPlug", "ItemButt", null, null, null, "High"),
					new EquipAssetStruct().SetEquipAsset("FuturisticChastityBelt", "ItemPelvis", null, "m1f1b1t0o1", null)]);
			return equip;
		}
		case 104:
		case "电子单手套":{
			equip.SetEquip(3,[], equip.state.SetState(2, 0, 0,0,0), "电子单手套", 104,"{str+@.似乎你的项圈对这件单手套有反应}",
				[new EquipAssetStruct().SetEquipAsset("FuturisticArmbinder", "ItemArms", null, null, null)]);
			return equip;
		}

		case 105:
		case "电子腿铐":{
			equip.SetEquip(4,[], equip.state.SetState(0, 2, 0,0,0), "电子腿铐", 105,"{agi+@.似乎你的项圈对这套腿铐有反应}",
				[new EquipAssetStruct().SetEquipAsset("FuturisticLegCuffs", "ItemLegs", null, "Chained", null),
					new EquipAssetStruct().SetEquipAsset("FuturisticAnkleCuffs", "ItemFeet", null, "Chained", null),
					new EquipAssetStruct().SetEquipAsset("FuturisticHeels", "ItemBoots", null, "Heel", null)]);
			return equip;
		}

		case 106:
		case "异常电子项圈":{
			equip.SetEquip(7,[], equip.state.EquipDefault(), "异常电子项圈", 106,"{无效果.显示屏正在显示乱码}",
				[new EquipAssetStruct().SetEquipAsset("FuturisticCollar", "ItemNeck", null, null, "lock"),
					new EquipAssetStruct().SetEquipAsset("ElectronicTag", "ItemNeckAccessories", null, null, "lock")]);
			return equip;
		}


	}
}

//装备游戏资源结构体
function EquipAssetStruct() {
	this.assetName = "";
	this.assetGroup = "";
	this.color = [];
	this.propertyType = "";
	this.propertyText = "";
	this.propertyMode = "";
	this.SetEquipAsset = function (assetName, assetGroup, color, propertyType, propertyText) {
		this.assetName = assetName;
		this.assetGroup = assetGroup;
		this.color = color;
		this.propertyType = propertyType;
		this.propertyText = propertyText;
		return this;
	};
	this.SetEquipAsset = function (assetName, assetGroup, color, propertyType, propertyText, propertyMode) {
		this.assetName = assetName;
		this.assetGroup = assetGroup;
		this.color = color;
		this.propertyType = propertyType;
		this.propertyText = propertyText;
		this.propertyMode = propertyMode;
		return this;
	};
}

//属性值结构体
function stateStruct() {
	this.state = [];
	this.PlayerDefault = function () {
		this.state = [5,5,5,5,5];
		return this;
	};

	this.EquipDefault = function () {
		this.state = [0,0,0,0,0];
		return this;
	};

	this.SetState = function (str, agi, int, mid, luk) {
		this.state = [str,agi,int,mid,luk];
		return this;
	};

	this.SetStr = function (str) {
		this.state[0] = str;
	};
	this.SetAgi = function (agi) {
		this.state[1] = agi;
	};
	this.SetInt = function (int) {
		this.state[2] = int;
	};
	this.SetMid = function (mid) {
		this.state[3] = mid;
	};
	this.SetLuk = function (luk) {
		this.state[4] = luk;
	};
	this.GetState = function () {
		return this.state;
	};
	this.GetState = function (index) {
		return this.state[index];
	};
	this.ModfiyState = function (state) {
		for (var i = 0; i< this.state.length; i++){
			this.state[i] += state[i];
		}
		return this.state;
	}
}

//任务结构体
function QuestStruct() {
	this.description = "";
	this.successText = "";
	this.failText = "";
	this.stateRequire = 0;//str, agi, int, mid, luk
	this.valueRequire = 0;//0~很多
	this.worthCoin = 0;//0~很多
	this.successEquip = [];
	this.ForceEquipWhenSuccess = false;
	this.failEquip = [];
	this.blockEquipName = [];

	this.SetQuest = function (description, successText, failText, stateRequire, valueRequire, worthCoin, successEquip,ForceEquipWhenSuccess, failEquip, blockEquipName) {
		this.description = description;
		this.successText = successText;
		this.failText = failText;
		this.stateRequire = stateRequire;//str, agi, int, mid, luk
		this.valueRequire = valueRequire;//0~很多
		this.worthCoin = worthCoin;//0~很多
		this.successEquip = successEquip;
		this.ForceEquipWhenSuccess = ForceEquipWhenSuccess;
		this.failEquip = failEquip;
		this.blockEquipName = blockEquipName;
		return this;
	};
	//显示任务文本
	this.ShowText = function (player) {
		ServerSend("ChatRoomChat", { Content: "*" + this.description, Type: "Emote", Target: player.character.MemberNumber} );
	};

	//判定任务，成功执行成功函数，失败执行失败函数
	/**
	 * @return {number}
	 */
	this.DoQuest = function (player) {
		plystate = player.state.GetState(this.stateRequire);
		modfiyState = 0;
		randomState = 0;
		for (var i = 0; i < player.slots.length; i++){
			if (player.slots[i] !== null && typeof player.slots[i] !== "number"){
				modfiyState += player.slots[i].state.GetState(this.stateRequire);
			}
		}
		randomState = Math.floor(Math.random() * 5 - 2); //-2~+2
		ServerSend("ChatRoomChat", { Content: "*判定出目: (基础：" + plystate.toString() + "+装备："+ modfiyState.toString()+ "+乱数："+ randomState.toString()+")/目标："+ this.valueRequire, Type: "Emote", Target: player.character.MemberNumber} );
		if ((plystate + modfiyState + randomState) >= this.valueRequire){
			ServerSend("ChatRoomChat", { Content: "*成功.", Type: "Emote", Target: player.character.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*" + this.successText, Type: "Emote", Target: player.character.MemberNumber} );
			this.QuestSuccess(player, this.worthCoin + Math.floor(Math.random() * 21 - 10)); //-10~+10
		}
		else {
			ServerSend("ChatRoomChat", { Content: "*失败.", Type: "Emote", Target: player.character.MemberNumber} );
			ServerSend("ChatRoomChat", { Content: "*" + this.failText, Type: "Emote", Target: player.character.MemberNumber} );
			this.QuestFail(player);
		}
	};

	this.QuestSuccess = function (player, coin) {
		if(remainedCoinOfEachFloor[parseInt(player.location.replace(/[^\d]/g, " "))] >= coin){
			ServerSend("ChatRoomChat", { Content: "*获得" + coin + "金币", Type: "Emote", Target: player.character.MemberNumber} );
			player.coin += coin;
			remainedCoinOfEachFloor[parseInt(player.location.replace(/[^\d]/g, " "))] -= coin;
		}
		else {
			ServerSend("ChatRoomChat", { Content: "*获得" + remainedCoinOfEachFloor[parseInt(player.location.replace(/[^\d]/g, " "))] + "金币", Type: "Emote", Target: player.character.MemberNumber} );
			player.coin += remainedCoinOfEachFloor[parseInt(player.location.replace(/[^\d]/g, " "))];
			remainedCoinOfEachFloor[parseInt(player.location.replace(/[^\d]/g, " "))] = 0;
		}
		if(this.ForceEquipWhenSuccess === true){
			for(var ix = 0; ix < this.successEquip.length; ix++){
				ServerSend("ChatRoomChat", { Content: "*你被穿上了" + this.successEquip[ix].name, Type: "Emote", Target: player.character.MemberNumber} );
				this.successEquip[ix].ForceWearEquip(player);
			}
		}
		player.isCurrentQuestSuccess = true;
		console.log(player.character.Name +" 执行成功 " + this.description);
	};

	this.WearSuccessEquip = function(player){
		for(var i = 0; i < this.successEquip.length; i++){
			ServerSend("ChatRoomChat", { Content: "*你穿上了" + this.successEquip[i].name, Type: "Emote", Target: player.character.MemberNumber} );
			this.successEquip[i].WearEquip(player);
		}
	};

	this.QuestFail = function (player) {
		for(var i = 0; i < this.failEquip.length; i++){
			ServerSend("ChatRoomChat", { Content: "*你被穿上了" + this.failEquip[i].name, Type: "Emote", Target: player.character.MemberNumber} );
			this.failEquip[i].ForceWearEquip(player);
		}
		console.log(player.character.Name +" 执行失败 " + this.description);
	};
}

//按id返回一个QuestStruct
function QuestList(indexOrName) {
	quest = new QuestStruct();
	switch (indexOrName) {
		case 0:{
			quest.SetQuest("房间里是一滩活动着的粘液，进入后有个标牌写着“任务：击败史莱姆[str 4]”,可以选择(执行)任务[消耗行动]，或(不执行)以返回",
							"史莱姆被你一脚踢爆了，它无力地摊在地上.[掉落：史莱姆{腿部，str+2，agi-3}可以选择(穿戴)]",
							"你踢了史莱姆，但是它反而缠在了你的脚上.[强制装备：史莱姆{腿部，str+2，agi-3}]",
							0,4,50,[EquipList("史莱姆")],false,[EquipList("史莱姆")],[]);
			return quest;
		}

		case 1:{
			quest.SetQuest("房间里房间里满地都是想蛇一样扭动的绳子，进入后有个标牌写着“任务：按下房间深处按钮[agi 4]”,可以选择(执行)任务[消耗行动]，或(不执行)以返回",
				"你灵活地绕开了所有绳子，到达了房间深处.[掉落：后手缚{手臂，str-3，agi+2}可以选择(穿戴)]",
				"你踩在了一条绳子上，绳子立马弹起来把你绑住了.[强制装备：后手缚{手臂，str-3，agi+2}]",
				1,4,50,[EquipList("后手缚")],false,[EquipList("后手缚")],[]);
			return quest;
		}

		case 2:{
			quest.SetQuest("房间里有张桌子，上面有纸笔，进入后有个标牌写着“任务：答出卷子上的题目[int 4]”,可以选择(执行)任务[消耗行动]，或(不执行)以返回",
				"题目十分简单，你三下五除二就得出了7.5的答案.[掉落：眼罩{头部，int+2，mnd-3}可以选择(穿戴)]",
				"题目十分简单，但是交卷时你忘了写名字.[强制装备：眼罩{头部，int+2，mnd-3}]",
				2,4,50,[EquipList("眼罩")],false,[EquipList("眼罩")],[]);
			return quest;
		}

		case 3:{
			quest.SetQuest("房间里矗立着一根震动棒，进入后有个标牌写着“任务：坐在震动棒上坚持5分钟不高潮[mnd 4]”,可以选择(执行)任务[消耗行动]，或(不执行)以返回",
				"你忍住了高潮，颤抖着把身体挪了出来.[掉落：贞操带{身体，int-3，mnd+2}可以选择(穿戴)]",
				"你高潮了，地上伸出贞操带把震动棒锁在了体内.[强制装备：贞操带与震动棒{身体，int-3，mnd-1}]",
				3,4,50,[EquipList("贞操带")],false,[EquipList("贞操带与震动棒")],[]);
			return quest;
		}

		case 4:{
			quest.SetQuest("房间里的一个台座上有一个红色的按钮，进入后有个标牌写着“任务：按下按钮后穿上出现的衣服[luk 5]”,可以选择(执行)任务[消耗行动]，或(不执行)以返回",
				"你穿上了出现的紧身衣，异常的合身.[强制装备：电子紧身衣{衣服，all+1}]",
				"机器臂把你抓住装进出现的触手服中，千万根细小的触手抚摸着你每一寸身体.[强制装备：触手服{衣服，all-1}]",
				4,5,10,[EquipList("电子紧身衣")],true,[EquipList("触手服")],[]);
			return quest;
		}



		case 5:{
			quest.SetQuest("房间里地面上摆着已经拘束衣，进入后有个标牌写着“任务：穿上并挣脱拘束衣[str 6]”,可以选择(执行)任务[消耗行动]，或(不执行)以返回",
				"在地上蠕动了好一会后，你总算是挣脱了出来.[掉落：拘束衣{手臂，str-4，mnd+3}可以选择(穿戴)]",
				"精疲力竭的你选择放弃，就这样穿着拘束衣离开.[强制装备：拘束衣{手臂，str-4，mnd+3}]",
				0,6,100,[EquipList("拘束衣")],false,[EquipList("拘束衣")],[]);
			return quest;
		}

		case 6:{
			quest.SetQuest("房间里充满着间谍电影里常见的光束阵，进入后有个标牌写着“任务：避开所有强制绝顶光束[agi 6]”,可以选择(执行)任务[消耗行动]，或(不执行)以返回",
				"最后一根光束差点擦到你，光是靠近光束就能感到快感让你心有余悸.[掉落：强高配饰{身体，str+3，agi-4}可以选择(穿戴)]",
				"你被一根光束照到后毫无征兆地高潮了，随之而来的是更多来不及躲开的光束.[强制装备：强高配饰{身体，str+3，agi-4}]",
				1,6,100,[EquipList("强高配饰")],false,[EquipList("强高配饰")],[]);
			return quest;
		}

		case 7:{
			quest.SetQuest("房间里是一个大号史莱姆，进入后有个标牌写着“任务：释放魔法击败史莱姆[int 6]”,可以选择(执行)任务[消耗行动]，或(不执行)以返回",
				"直到史莱姆被五种不同属性的魔法同时轰击后，你相信了你其实会魔法的事实.[掉落：大史莱姆{头部，agi+3，int-4}可以选择(穿戴)]",
				"你作为坚定的唯物主义者，是肯定放不出魔法的，扒在你头上的史莱姆同学也这么认为.[强制装备：大史莱姆{头部，agi+3，int-4}]",
				2,6,100,[EquipList("大史莱姆")],false,[EquipList("大史莱姆")],[]);
			return quest;
		}

		case 8:{
			quest.SetQuest("房间里是一个人偶，旁边摆着两套衣服，进入后有个标牌写着“任务：选择装束并侍奉主人[mnd 6]”,可以选择(执行)任务[消耗行动]，或(不执行)以返回",
				"你选择了女仆装，给人偶奉上了上好的口口红茶.[掉落：女仆装{衣服，int+3，mnd-4}可以选择(穿戴)]",
				"你选择了侍寝套装，被人偶精湛的指技带上了天.[强制装备：侍寝套装{衣服，int+3，mnd-4}]",
				4,6,100,[EquipList("女仆装")],false,[EquipList("侍寝套装")],[]);
			return quest;
		}
		case 9:{
			quest.SetQuest("房间里的一个台座上有一个红色的按钮，进入后有个标牌写着“任务：按下按钮后穿上出现的鞋子[luk 6]”,可以选择(执行)任务[消耗行动]，或(不执行)以返回",
				"你穿上了出现的高跟鞋和腿铐，身高暴涨15厘米.[强制装备：电子腿铐{腿脚，agi+2}]",
				"机器臂把你的脚塞进了挠痒靴中，里面的滚轮和刷头让你笑得几乎窒息.[强制装备：挠痒靴{腿脚，agi-2}]",
				4,6,10,[EquipList("电子腿铐")],true,[EquipList("挠痒靴")],[]);
			return quest;
		}

		case 10:{
			quest.SetQuest("房间里有一个巨大的怪物，进入后有个标牌写着“任务：击败奇美拉[str 8]”,可以选择(执行)任务[消耗行动]，或(不执行)以返回",
				"在一场史诗般的战斗后，怪物变回了史莱姆，但它仍缠在你身上.[强制装备：史莱姆王{全部槽位，agi+10，其余-10}]",
				"你被打败了，怪物长出了无数的触手.[强制装备：触手皇{腿脚，agi+2，其余-10}]",
				0,8,180,[EquipList("史莱姆王")],true,[EquipList("触手皇")],[]);
			return quest;
		}

		case 11:{
			quest.SetQuest("房间整个像是个宴会厅，进入后有个标牌写着“任务：成为焦点[agi 8]”,可以选择(执行)任务[消耗行动]，或(不执行)以返回",
				"你的舞姿吸引了在场每一个摄像头的注意.[强制装备：华美舞者{全部槽位，int+10，其余-10}]",
				"你的舞姿不行，只能靠发光吸引注意力.[强制装备：落地灯{全部槽位，int+2，其余-10}]",
				1,8,180,[EquipList("华美舞者")],true,[EquipList("落地灯")],[]);
			return quest;
		}

		case 12:{
			quest.SetQuest("房间里面是一个生态系统，进入后有个标牌写着“任务：回归自然[int 8]”,可以选择(执行)任务[消耗行动]，或(不执行)以返回",
				"你解放了内心的野性，成为了一只可爱的小狗.[强制装备：犬化{全部槽位，mnd+10，其余-10}]",
				"你回归了水中成为一条鱼，但是仍有一半是人.[强制装备：美人鱼{全部槽位，mnd+2，其余-10}]",
				2,8,180,[EquipList("犬化")],true,[EquipList("美人鱼")],[]);
			return quest;
		}

		case 13:{
			quest.SetQuest("房间是一间拷问室，里面是全副武装的机器人，进入后有个标牌写着“任务：撑过拷问[int 8]”,可以选择(执行)任务[消耗行动]，或(不执行)以返回",
				"你撑了下来，但身心几乎被完全摧毁.[强制装备：拷问{全部槽位，str+10，其余-10}]",
				"你屈服了，于是你被装进了狭小的盒子里.[强制装备：囚禁{全部槽位，str+2，其余-10}]",
				3,8,180,[EquipList("拷问")],true,[EquipList("囚禁")],[]);
			return quest;
		}
		case 14:{
			quest.SetQuest("房间里只有一个按钮，进入后有个标牌写着“任务：按下按钮，然后拿走本层剩余金币[luk -10]”,可以选择(执行)任务[消耗行动]，或(不执行)以返回",
				"正在你高兴于好多金币入账时，你突然失去了身体的控制权，然后一件又一件地穿上了凭空出现的电子装备.[强制装备：全套电子装备{复合装备}]",
				"按钮没反应.",
				4,-10,500,[EquipList(100),EquipList(101),EquipList(102),EquipList(103),EquipList(104),EquipList(105), EquipList(106)],true,[EquipList(100),EquipList(101),EquipList(102),EquipList(103),EquipList(104),EquipList(105), EquipList(106)],[]);
			return quest;
		}
	}
}

//按区域获得随机QuestStruct
function QuestListIndexByArea(area) {
	quest = new QuestStruct();
	quests = [];
	switch (area) {
		case 1:{
			quests = [QuestList(0),QuestList(1),QuestList(2),QuestList(3),QuestList(4)];
		}
			break;
		case 2:{
			quests = [QuestList(5),QuestList(6),QuestList(7),QuestList(8),QuestList(9)];
		}
			break;
		case 3:{
			quests = [QuestList(10),QuestList(11),QuestList(12),QuestList(13),QuestList(14)];
		}
			break;

	}
	quest = quests[Math.floor(Math.random() * quests.length)];
	return quest;
}

//商品结构体
function GoodsStruct() {
	this.name = "";
	this.price = 0;
	this.description = "";
	this.useText = "";
	this.stateEffect = [0,0,0,0,0];
	this.equip = [];
	this.isSelled =false;

	this.SetGoods = function (name, price ,description, useText, stateEffect, equip) {
		this.name = name;
		this.price = price;
		this.description = description;
		this.useText = useText;
		this.stateEffect = stateEffect;
		this.equip = equip;
		this.isSelled =false;
	};

	this.SellGoods = function (buyer, user) {
		if (this.isSelled === false){
			if (buyer.coin >= this.price){
				buyer.coin -= this.price;
				this.isSelled = true;
				ServerSend("ChatRoomChat", { Content: "*" + this.useText, Type: "Emote", Target: user.character.MemberNumber} );
				user.state.ModfiyState(this.stateEffect);
				for(var i = 0; i < this.equip.length; i++){
					ServerSend("ChatRoomChat", { Content: "*你穿上了" + this.equip[i].name, Type: "Emote", Target: user.character.MemberNumber} );
					this.equip[i].ForceWearEquip(user);
				}

				console.log(buyer.character.toString() +"购买" + this.name);

			}
			else {
				ServerSend("ChatRoomChat", { Content: "*钱不够", Type: "Emote", Target: buyer.character.MemberNumber} );

			}
		}
		else {
			ServerSend("ChatRoomChat", { Content: "*该商品已卖出", Type: "Emote", Target: buyer.character.MemberNumber} );
		}

	}

}

function GoodsList(indexOrName) {
	goods = new GoodsStruct();
	switch (indexOrName) {
		case 0:{
			goods.SetGoods("strUP按摩",30,"{str永久+2}","许多电极贴片贴在了你全身上下，然后针刺般的麻痹感遍布了你的全身，不过因为肌肉抽搐所以起到了锻炼效果{str永久+2}",
				[2,0,0,0,0],[]);
			break;
		}
		case 1:{
			goods.SetGoods("strDown按摩",15,"{str永久-2}","许多电极贴片贴在了你全身上下，电击的酥麻感让你浑身脱力，你感觉忘记了一些发力方式{str永久-2}",
				[-2,0,0,0,0],[]);
			break;
		}
		case 2:{
			goods.SetGoods("agiUP媚药",30,"{agi永久+2}","粉色的气体充入了你的运输舱，这些气体让你的身体变得更加敏感{agi永久+2}",
				[0,2,0,0,0],[]);
			break;
		}
		case 3:{
			goods.SetGoods("agiDown媚药",15,"{agi永久-2}","粉色的气体充入了你的运输舱，这些气体让你的意识变得十分模糊{agi永久+2}",
				[0,-2,0,0,0],[]);
			break;
		}
		case 4:{
			goods.SetGoods("intUP锦囊",30,"{int永久+2}","锦囊在你面前打开，里面有张收据，抬头是“智商税”{int永久+2}",
				[0,0,2,0,0],[]);
			break;
		}
		case 5:{
			goods.SetGoods("intDown锦囊",15,"{int永久-2}","锦囊在你面前打开，里面有张纸条，上面写着大大的“⑨”{int永久-2}",
				[0,0,-2,0,0],[]);
			break;
		}
		case 6:{
			goods.SetGoods("mndUp课程",30,"{mnd永久+2}","耳朵深处的内耳道耳机开始以最大音量播放“JUST DO IT！”，你感到自信的同时感到听力受损{mnd永久+2}",
				[0,0,0,2,0],[]);
			break;
		}
		case 7:{
			goods.SetGoods("mndDown课程",15,"{mnd永久-2}","耳朵深处的内耳道耳机开始以你的声线播放淫荡的话语，你几乎将这些声音以为是自己的心声{mnd永久-2}",
				[0,0,0,-2,0],[]);
			break;
		}
		case 8:{
			goods.SetGoods("电子贞操具",40,"{身体，all+1}","{两根疯狂震动着的棒棒作为赠品插入了你的前后穴，然后贞操具把快感锁在体内[强制装备：电子贞操具]}",
				[0,0,0,0,0],[EquipList("电子贞操具")]);
			break;
		}
		case 9:{
			goods.SetGoods("束缚绑带",20,"{手臂，腿脚，str+3，agi-2，int+3，mnd-2}","{你看着绑带一根根的缠在你身体上，一点点的剥夺你的活动能力[强制装备：束缚绑带]}",
				[0,0,0,0,0],[EquipList("束缚绑带")]);
			break;
		}
		case 10:{
			goods.SetGoods("乳胶修女",20,"{头部，口部，str-2，agi+3，int-2，mnd+3}","{戴上这个头套后，你的大脑被祷的欲望填满了[强制装备：束缚绑带]}",
				[0,0,0,0,0],[EquipList("乳胶修女")]);
			break;
		}
		case 11:{
			goods.SetGoods("蜘蛛巢",60,"{头部，手臂，腿脚，str+3，agi-3，int-3，mnd+3}","{有蜘蛛！！！[强制装备：蜘蛛巢]}",
				[0,0,0,0,0],[EquipList("蜘蛛巢")]);
			break;
		}
		case 12:{
			goods.SetGoods("婴儿套装",60,"{口部，手臂，身体，str+3，agi+3，int-3，mnd-3}","{你感到你的精神正在退行[强制装备：婴儿套装]}",
				[0,0,0,0,0],[EquipList("婴儿套装")]);
			break;
		}
	}
	return goods;
}

function GetShopMenu(gamePhase) {
	shopMenu = [];
	switch (gamePhase){
		case 1:{
			//随机生成5个能力变动
			for(var i = 0; i < 5; i++){
				shopMenu.push(GoodsList(Math.floor(Math.random() * 8)));
			}
			shopMenu.push(GoodsList(8));
			shopMenu.push(GoodsList(9));
			shopMenu.push(GoodsList(10));
		}
		break;
		case 2:{
			//随机生成3个能力变动
			for(var i = 0; i < 5; i++){
				shopMenu.push(GoodsList(Math.floor(Math.random() * 8)));
			}
			shopMenu.push(GoodsList(8));
			shopMenu.push(GoodsList(11));
			shopMenu.push(GoodsList(12));
		}
			break;
	}
	return shopMenu;
}
