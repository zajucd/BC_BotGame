activateStoryRoom();

RemoveCloth(Player,null);
RemoveRestrains(Player,null);
WearFullRestrains(Player,null);
InventoryWear(Player, "TheDisplayFrame", "ItemDevices", "Default",80);



Player.Description = `

BOT game：CursedRoom V1.1
更新了新的路线与结局
作者: zajucd(7092)
原型: https://github.com/keykey5/BC-BOT-repository
发布地址: https://github.com/zajucd/BC_BotGame

灵感来源:上古卷轴5mod 被诅咒的战利品
缅怀我一哥们   配了三年的老滚，随着硬盘一起化为了飞灰
门没有上锁，但是会在某些事发生后锁上
下面是数学题的答案，答不出来再往下翻

 
 
 
 
 
 
 
 
 
 
 
 

 2，6，9，4，1
 101(二进制)=5(十进制)
 5，4，9
` // end of description
ServerSend("AccountUpdate", { Description: Player.Description });
ChatRoomCharacterUpdate(Player)


function activateStoryRoom() {
	resetRoom()
	storyActive = true
}

function deactivateStoryRoom() {
	resetRoom()
	storyActive = false
}

ChatRoomMessageAdditionDict["CursedRoom"] = function(SenderCharacter, msg, data) {ChatRoomMessageCursedRoom(SenderCharacter, msg, data)}

function ChatRoomMessageCursedRoom(SenderCharacter, msg, data) {

	if (storyActive) {
		if ((data.Type == "Action") && (msg.startsWith("ServerEnter"))) {
			setTimeout(storyStart(SenderCharacter), 300, SenderCharacter)
		} else if ((msg.startsWith("ServerLeave")) || (msg.startsWith("ServerDisconnect")) || (msg.startsWith("ServerBan")) || (msg.startsWith("ServerKick"))) {
			resetRoom()
		}
		if (data.Type != null) {
			if (msg.toLowerCase().includes("1145141919810") && charList.includes(SenderCharacter.MemberNumber)) {
				ServerSend("ChatRoomChat", { Content: "运输程序启动，30秒后进行运输", Type: "Chat"} );
				ServerSend("ChatRoomChat", { Content: "*舱室开始晃动，看来你即将被运送走.", Type: "Emote"} );
				ServerSend("ChatRoomChat", { Content: "*在被运送走前，你看看见了一行数字：" + lockCode + " ，你意识到你必须得记住这行数字.", Type: "Emote"} );
				setTimeout(function (SenderCharacter) {
					console.log("? kick");
					ChatRoomAdminChatAction("Kick", SenderCharacter.MemberNumber.toString())
				}, 30 * 1000, SenderCharacter);
				resetRoom()
			}else if ((data.Type == "Emote") || (data.Type == "Action") || (data.Type == "Hidden" && msg.startsWith("ChatRoomBot"))) {
				if(isDeviceOn && SenderCharacter.MemberNumber != Player.MemberNumber){
					ServerSend("ChatRoomChat", { Content: "*你小跳步移动.", Type: "Emote"} );
					setTimeout(function (SenderCharacter) {
						commandHandler(SenderCharacter,msg);
					}, 2 * 1000, SenderCharacter)
				}
				else {
					commandHandler(SenderCharacter,msg);
				}

			}


		}
	}
}

function commandHandler(sender, msg) {
	if(sender.MemberNumber !== Player.MemberNumber){
		isGagOffStop = true;
		isBoxOpenStop = true;
		if (isGameOver ){
			ServerSend("ChatRoomChat", { Content: "*在这个狭小的舱室中你对一切都无能为力.", Type: "Emote"} );
		}
		else {
			if (msg.toLowerCase().includes("explore")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 探索房间.", Type: "Emote"} );
				explore(sender, msg)
			}
			else if (msg.toLowerCase().includes("wall")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 查看墙壁.", Type: "Emote"} );
				wall(sender, msg)
			}
			else if (msg.toLowerCase().includes("button")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 查看按钮.", Type: "Emote"} );
				button(sender, msg)
			}
			else if (msg.toLowerCase().includes("box")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 查看盒子.", Type: "Emote"} );
				box(sender, msg)
			}
			else if (msg.toLowerCase().includes("light")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 查看指示灯.", Type: "Emote"} );
				light(sender, msg)
			}
			else if (msg.toLowerCase().includes("wear")) {
				wear(sender, msg)
			}
			else if (msg.toLowerCase().includes("struggle")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 尝试挣扎.", Type: "Emote"} );
				struggle(sender, msg)
			}
			else if (msg.toLowerCase().includes("cell")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 查看舱室.", Type: "Emote"} );
				cell(sender, msg)
			}
			else if (msg.toLowerCase().includes("get into it")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 进入舱室.", Type: "Emote"} );
				enter(sender, msg)
			}
			else if (msg.toLowerCase().includes("corner")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 查看角落.", Type: "Emote"} );
				corner(sender, msg)
			}

			else if (msg.toLowerCase().includes("device")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 查看面板.", Type: "Emote"} );
				device(sender, msg)
			}
			else if (msg.toLowerCase().includes("skip")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 跳过.", Type: "Emote"} );
				progressTo2(sender, msg);
				isSuccess = true;
			}
			else if (msg.toLowerCase().includes("wait")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 等待.", Type: "Emote"} );
				if (storyProgress == 3){
					progress3End(sender, msg);
				}
			}
		}
	}
	


}

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

function explore(sender, msg) {
	ServerSend("ChatRoomChat", { Content: "*你环视了房间，面前的台子上有又红又大的按钮(button),侧面有一堵墙(wall)，", Type: "Emote"} );
	if (storyProgress == 0) {
		ServerSend("ChatRoomChat", { Content: "*门没有上锁，现在还可以离开.", Type: "Emote"} );
	}else if (storyProgress == 1){
		ServerSend("ChatRoomChat", { Content: "*面前有一排有编号的盒子(box)，前方的墙上有三盏指示灯(light)，门没有上锁，现在还可以离开.", Type: "Emote"} );
	}else if (storyProgress == 2){
		ServerSend("ChatRoomChat", { Content: "*现在墙上的一个格子伸了出来，是一个舱室(cell)，等待着你的进入.门上锁了，已经无法离开", Type: "Emote"} );
	}else {//storyProgress == 3
		ServerSend("ChatRoomChat", { Content: "*面前有一排有编号的盒子(box)，前方的墙上有三盏指示灯(light).", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*按钮(button)的台子上现在多出了一个操作面板(device).", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*舱室(cell)随时等待着你的进入,你剩下的时间不多了.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*角落(corner)似乎有一些划痕.", Type: "Emote"} );
	}
}

//墙 进度1：无 进度2：显示cell 进度3：提示cell
function wall(sender, msg) {
	ServerSend("ChatRoomChat", { Content: "*这堵墙上的缝隙将它分成了一个又一个的格子,你靠近仔细听，似乎有喘息声与呜咽声，", Type: "Emote"} );
	if (storyProgress <= 1) {
		ServerSend("ChatRoomChat", { Content: "*你不敢往后想，于是退开了.", Type: "Emote"} );
	}else if (storyProgress == 2){
		ServerSend("ChatRoomChat", { Content: "*现在墙上的一个格子伸了出来，是一个舱室(cell),你理解了墙壁内的声音都来自于被装在舱室里收纳进去的人，而你也将加入她们.一种难以言喻的感觉自你内心升起.", Type: "Emote"} );
	}
	else{// storyProgress == 2
		ServerSend("ChatRoomChat", { Content: "*舱室(cell)仍在那里，你的眼罩上显示着：进入！.", Type: "Emote"} );
	}
}

//按钮 进度1：progressTo1函数 进度2：无 进度3：buttoninish函数
function button(sender, msg) {
	//console.log("button")
	ServerSend("ChatRoomChat", { Content: "*你按下了按钮，", Type: "Emote"} );
	if (storyProgress == 0) {
		progressTo1(sender, msg);
		}

	else if(storyProgress <=2 ){
		ServerSend("ChatRoomChat", { Content: "*没有任何反应.", Type: "Emote"} );
	}


	//进度3
	else{
		if(buttonCount == 3){
			ServerSend("ChatRoomChat", { Content: "*......", Type: "Emote"} );
			setTimeout(function (sender) {
				ServerSend("ChatRoomChat", { Content: "*是不是机器没识别到这一下", Type: "Emote"} );
			}, 2 * 1000, sender);

		}
		else if(buttonCount == 4){
			ServerSend("ChatRoomChat", { Content: "*滴.", Type: "Emote"} );
			setTimeout(function (sender) {
				buttonFinish(sender, msg)
			}, 10 * 1000, sender);
		}
		else{
			ServerSend("ChatRoomChat", { Content: "*滴.", Type: "Emote"} );
		}
			buttonCount++;

	}
	//console.log(InventoryGet(sender, "ItemNeckAccessories"))
	//console.log(InventoryGet(sender, "ItemNeck"))
}

//盒子 进度1：wear函数 进度3：取认证卡，
function box(sender, msg) {
	if (storyProgress == 0) {
		ServerSend("ChatRoomChat", { Content: "*理论上你不应该看见这句话，不过在酒吧点炒饭也是种乐趣，不是吗.", Type: "Emote"} );
	}else if (storyProgress == 1){
		ServerSend("ChatRoomChat", { Content: "*九个盒子一字排开，上面分别写着1至9的编号，看起来你可以试着打开其中一个.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*还有个显示屏，上面写着："+boxText[restrainCount]+".", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*[NOTE:通过发送 *box 数字 来打开盒子（例：*box 2）.", Type: "Emote"} );
		if(msg.toLowerCase().includes("1")||
			msg.toLowerCase().includes("2")||
			msg.toLowerCase().includes("3")||
			msg.toLowerCase().includes("4")||
			msg.toLowerCase().includes("5")||
			msg.toLowerCase().includes("6")||
			msg.toLowerCase().includes("7")||
			msg.toLowerCase().includes("8")||
			msg.toLowerCase().includes("9")){//是否含数字
			ServerSend("ChatRoomChat", { Content: "*你试着打开一个盒子.", Type: "Emote"} );
			if(msg.toLowerCase().includes(boxNum[restrainCount])){
				isWareable = true;
				ServerSend("ChatRoomChat", { Content: "*盒子打开了，里面是"+restrainText[restrainCount]+",盒子内壁刻着:穿上(wear)它.", Type: "Emote"} );
				if(restrainCount == 4){
					ServerSend("ChatRoomChat", { Content: "*你下意识的看了一眼来时的门，目前还没有上锁.", Type: "Emote"} );
				}
			}
			else {
				life--;
				ServerSend("ChatRoomChat", { Content: "*指示灯熄灭了一盏，你有种不详的预感.", Type: "Emote"} );
				if(life == 0){
					progressTo2(sender, msg);
				}

			}
		}
	}
	else if(storyProgress == 2){
		ServerSend("ChatRoomChat", { Content: "*无论你对盒子做什么，它都没有一点反应，你能做的事只有一件.", Type: "Emote"} );
	}
	else {// storyProgress == 3
		if(isDeviceOn && cardCount<=2){
			if(isGagOff){
				ServerSend("ChatRoomChat", { Content: "*九个盒子一字排开，上面分别写着1至9的编号，现在你可以用嘴把认证卡叼出来了.", Type: "Emote"} );
				ServerSend("ChatRoomChat", { Content: "*还有个显示屏，上面写着："+boxText2[cardCount]+".", Type: "Emote"} );
				if(cardCount == 1){
					ServerSend("ChatRoomChat", { Content: "*"+boxText20[0]+"", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*"+boxText20[1]+"", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*"+boxText20[2]+"", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*"+boxText20[3]+"", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*"+boxText20[4]+"", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*"+boxText20[5]+"", Type: "Emote"} );
				}
				ServerSend("ChatRoomChat", { Content: "*[NOTE:通过发送 *box 数字 来打开盒子（例：*box 2）.", Type: "Emote"} );
				if(msg.toLowerCase().includes("1")||
					msg.toLowerCase().includes("2")||
					msg.toLowerCase().includes("3")||
					msg.toLowerCase().includes("4")||
					msg.toLowerCase().includes("5")||
					msg.toLowerCase().includes("6")||
					msg.toLowerCase().includes("7")||
					msg.toLowerCase().includes("8")||
					msg.toLowerCase().includes("9")){//是否含数字
					ServerSend("ChatRoomChat", { Content: "*你试着打开一个盒子.", Type: "Emote"} );
					if(msg.toLowerCase().includes(boxNum2[cardCount])){

						if(cardCount == 2){
							isBoxOpenStop = false;
							setTimeout(function (SenderCharacter) {
								if (!isBoxOpenStop){
									ServerSend("ChatRoomChat", {Content: "*盒子终于打开了，你取出了一个认证卡.", Type: "Emote"} );
									cardCount++;
								}
								else{
									ServerSend("ChatRoomChat", {Content: "*盒子那边滴了一声，看来你得待在那里.", Type: "Emote"} );
								}
							}, 30 * 1000, sender)
						}
						else {
							ServerSend("ChatRoomChat", { Content: "*你取出了一个认证卡.", Type: "Emote"} );
							cardCount++;
						}

					}
					else {
						setTimeout(function (SenderCharacter) {
							ServerSend("ChatRoomChat", { Content: "*盒子打不开，你浪费了一些时间.", Type: "Emote"} );
						}, 5 * 1000, sender)
					}
				}
			}
			else{
				ServerSend("ChatRoomChat", { Content: "*九个盒子一字排开，上面分别写着1至9的编号，你意识到以你现在的状态即使里面有东西也没法拿出来.", Type: "Emote"} );
			}
		}
		else {
			ServerSend("ChatRoomChat", { Content: "*九个盒子一字排开，上面分别写着1至9的编号，看上去里面没有东西.", Type: "Emote"} );
		}
	}
}

//指示灯 进度1：显示生命 进度2：无 进度3：显示101,5
function light(sender, msg) {
	if (storyProgress == 0) {
		ServerSend("ChatRoomChat", { Content: "*理论上你不应该看见这句话，不过在酒吧点炒饭也是种乐趣.", Type: "Emote"} );
	}
	else if (storyProgress == 1){
		ServerSend("ChatRoomChat", { Content: "*有三盏指示灯，其中"+(life)+"盏是亮着的.", Type: "Emote"} );
	}
	else if(storyProgress == 2){
		ServerSend("ChatRoomChat", { Content: "*现在所有指示灯都熄灭了，你能做的事只有一件.", Type: "Emote"} );
	}
	else {// storyProgress == 3
		ServerSend("ChatRoomChat", { Content: "*三盏灯中左右两盏是亮着的，中间是熄灭的.", Type: "Emote"} );
		//101 == 5
	}
}

//穿 进度1 根据装备数穿装备与progressTo2函数 进度2：无 进度3：无
function wear(sender, msg) {
	if (storyProgress == 0) {
		ServerSend("ChatRoomChat", { Content: "*理论上你不应该看见这句话，不过在酒吧点炒饭也是种乐趣.", Type: "Emote"} );
	}else if (storyProgress == 1){
		if(isWareable){
			switch (restrainCount) {
				case 0:
					//腿铐
					InventoryWear(sender, "FuturisticLegCuffs", "ItemLegs", "Default",80);
					InventoryLock(sender, InventoryGet(sender, "ItemLegs"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
					InventoryGet(sender, "ItemLegs").Property.CombinationNumber = lockCode;
					InventoryGet(sender, "ItemLegs").Property.Type = "Chained";

					//踝铐
					InventoryWear(sender, "FuturisticAnkleCuffs", "ItemFeet", "Default",80);
					InventoryLock(sender, InventoryGet(sender, "ItemFeet"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
					InventoryGet(sender, "ItemFeet").Property.CombinationNumber = lockCode;
					InventoryGet(sender, "ItemFeet").Property.Type = "Chained";
					//鞋
					InventoryWear(sender, "FuturisticHeels", "ItemBoots", "Default",80);
					InventoryLock(sender, InventoryGet(sender, "ItemBoots"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
					InventoryGet(sender, "ItemBoots").Property = {
						"Effect": [
							"Lock"
						],
						"Type": "Heel",
						"HeightModifier": 16,
						"LockedBy": "CombinationPadlock",
						"LockMemberNumber": Player.MemberNumber,
						"CombinationNumber": lockCode
					};
					//刷新角色
					ChatRoomCharacterUpdate(sender);
					isWareable = false;
					restrainCount ++;
					ServerSend("ChatRoomChat", { Content: "*你穿上了它们，令人感到诡异的合身，只是你现在光是想站稳都得费尽心神.", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*盒子关上了，里面传出了机械声，似乎里面的东西不一样了.", Type: "Emote"} );
					break;
				case 1:
					//胸罩
					InventoryWear(sender, "FuturisticBra", "ItemBreast", "Default",80);
					InventoryLock(sender, InventoryGet(sender, "ItemBreast"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
					InventoryGet(sender, "ItemBreast").Property.CombinationNumber = lockCode;
					//贞操带
					InventoryWear(sender, "FuturisticTrainingBelt", "ItemPelvis", "Default",80);
					InventoryLock(sender, InventoryGet(sender, "ItemPelvis"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
					InventoryGet(sender, "ItemPelvis").Property.CombinationNumber = lockCode;
					//束带
					InventoryWear(sender, "FuturisticHarness", "ItemTorso", "Default",80);
					InventoryLock(sender, InventoryGet(sender, "ItemTorso"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
					InventoryGet(sender, "ItemTorso").Property.CombinationNumber = lockCode;
					//刷新角色
					ChatRoomCharacterUpdate(sender);
					isWareable = false;
					restrainCount ++;
					ServerSend("ChatRoomChat", { Content: "*你穿上了它们，现在你确信这些东西是为你量身定做的了，你试着触摸私处，但是刺激完全被挡在了贞操带外.", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*盒子关上了，里面传出了机械声，似乎里面的东西不一样了.", Type: "Emote"} );
					break;
				case 2:
					//眼罩
					InventoryWear(sender, "InteractiveVRHeadset", "ItemHead", "Default",80);
					InventoryLock(sender, InventoryGet(sender, "ItemHead"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
					InventoryGet(sender, "ItemHead").Property.CombinationNumber = lockCode;
					//口塞
					InventoryWear(sender, "FuturisticHarnessPanelGag", "ItemMouth", "Default",80);
					InventoryLock(sender, InventoryGet(sender, "ItemMouth"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
					InventoryGet(sender, "ItemMouth").Property.CombinationNumber = lockCode;
					//刷新角色
					ChatRoomCharacterUpdate(sender);
					isWareable = false;
					restrainCount ++;
					ServerSend("ChatRoomChat", { Content: "*你穿上了它们，你的脸完全被挡住了，而且有什么东西伸进了你的嘴里，奇怪的是你仍然能看见东西.", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*盒子关上了，里面传出了机械声，似乎里面的东西不一样了.", Type: "Emote"} );
					break;
				case 3:
					InventoryWear(sender, "FuturisticCuffs", "ItemArms", "Default",80);
					InventoryLock(sender, InventoryGet(sender, "ItemArms"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
					InventoryGet(sender, "ItemArms").Property.CombinationNumber = lockCode;
					//手套
					InventoryWear(sender, "FuturisticMittens", "ItemHands", "Default",80);
					InventoryLock(sender, InventoryGet(sender, "ItemHands"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
					InventoryGet(sender, "ItemHands").Property.CombinationNumber = lockCode;
					//刷新角色
					ChatRoomCharacterUpdate(sender);
					isWareable = false;
					restrainCount ++;
					ServerSend("ChatRoomChat", { Content: "*你穿上了它们，你的手被迫握成了拳头.", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*盒子关上了，里面传出了机械声，似乎里面的东西不一样了.", Type: "Emote"} );
					break;
				case 4:
					InventoryRemove(sender,"ItemArms");
					//单手套
					InventoryWear(sender, "FuturisticArmbinder", "ItemArms", "Default",80);
					InventoryLock(sender, InventoryGet(sender, "ItemArms"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
					InventoryGet(sender, "ItemArms").Property.CombinationNumber = lockCode;
					//刷新角色
					ChatRoomCharacterUpdate(sender);
					isWareable = false;
					restrainCount ++;
					ServerSend("ChatRoomChat", { Content: "*机械臂亲切地伸出来帮你穿上了它，现在你被完美的束缚住了.", Type: "Emote"} );
					break;
			}
			if(restrainCount ==5){
				progressTo2(sender, msg);

			}
		}


	}else {// storyProgress == 2
		ServerSend("ChatRoomChat", { Content: "*已经没有可以给你穿的东西了，你能做的事只有一件.", Type: "Emote"} );
	}
}

//角落 进度1：无 进度2：无 进度3：提示button
function corner(sender, msg){
	if(storyProgress <=2){
		ServerSend("ChatRoomChat", { Content: "*理论上你不应该看见这句话，不过在酒吧点炒饭也是种乐趣.", Type: "Emote"} );
	}
	else {
		ServerSend("ChatRoomChat", { Content: "*你仔细检测了划痕，从旁边的金属片来看，是上一个人在同样被全身束缚的情况下留下的文字.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*毕竟哪怕有一根手指能动都不至于这么难以辨识.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*划痕写着：火丁 白勺 2jinzhi 扌安丑 次 deng1会!", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*口宀 面片反 15.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*你试了试用金属片划你的束缚，但是现代工业岂是区区金属片可以撼动的.", Type: "Emote"} );

	}

}

//面板 进度3：提示box与button 三次认证卡后调查结局
function device(sender, msg){
	if (storyProgress <=2 ) {
		ServerSend("ChatRoomChat", { Content: "*理论上你不应该看见这句话，不过在酒吧点炒饭也是种乐趣.", Type: "Emote"} );
	}
	else {
		if (isDeviceOn){
			if(!isSuccess2){
				ServerSend("ChatRoomChat", { Content: "*面板显示：调试模式，如需获取解除密钥，请从盒子(box)中取出三个认证卡后再次访问.", Type: "Emote"} );
			}
			else {
				ServerSend("ChatRoomChat", { Content: "*面板又关闭了.", Type: "Emote"} );
			}

			if(!isGagOff){
				//等待15秒解除口塞
				isGagOffStop = false;
				setTimeout(function (sender) {
					gagOff(sender, msg)
				}, 15 * 1000, sender);
			}
			if (cardCount ==3 && !isSuccess2){
				isSuccess2 = true;

				InventoryGet(sender, "ItemNeckAccessories").Property = {Effect: Array(0), Text: lockCode};

				InventoryWear(sender, "FuturisticHeels", "ItemBoots", "Default",80);
				InventoryLock(sender, InventoryGet(sender, "ItemBoots"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
				InventoryGet(sender, "ItemBoots").Property = {
					"Effect": [
						"Lock"
					],
					"Type": "Heel",
					"HeightModifier": 16,
					"LockedBy": "CombinationPadlock",
					"LockMemberNumber": Player.MemberNumber,
					"CombinationNumber": lockCode
				};

				InventoryWear(sender, "FuturisticHarnessPanelGag", "ItemMouth", "Default",80);
				InventoryLock(sender, InventoryGet(sender, "ItemMouth"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
				InventoryGet(sender, "ItemMouth").Property ={
					"AutoPunish": 0,
					"AutoPunishUndoTime": 0,
					"AutoPunishUndoTimeSetting": 300000,
					"OriginalSetting": "Plug",
					"ChatMessage": true,
					"BlinkState": 1,
					"Type": "Plug",
					"Effect": [
						"BlockMouth",
						"GagTotal",
						"Lock"
					],
					"LockedBy": "CombinationPadlock",
					"LockMemberNumber": Player.MemberNumber,
					"CombinationNumber": lockCode
				};

				//刷新角色
				ChatRoomCharacterUpdate(sender);

				ServerSend("ChatRoomChat", { Content: "*面板显示：解除密钥已显示在项圈上，调试模式关闭，恢复束缚中.", Type: "Emote"} );
				ServerSend("ChatRoomChat", { Content: "*虽然情况也没有好转甚至更坏了，至少你还有个没法自己用的密钥.", Type: "Emote"} );
			}


		}
		else {
			ServerSend("ChatRoomChat", { Content: "*你动了动面板，似乎没有什么反应.", Type: "Emote"} );
		}
	}
}

//按钮完成 解锁device 非五次无法解锁
function buttonFinish(sender, msg){

	if(buttonCount == 5){
		isDeviceOn = true;
		InventoryRemove(sender,"ItemArms");
		//拘束衣
		InventoryWear(sender, "FuturisticStraitjacket", "ItemArms", "Default",80);
		InventoryLock(sender, InventoryGet(sender, "ItemArms"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
		InventoryGet(sender, "ItemArms").Property = {
			"Type": "cl0co1np1vp1a0",
			"Difficulty": 0,
			"Block": [
			"ItemNipples",
			"ItemNipplesPiercings",
			"ItemVulva",
			"ItemVulvaPiercings",
			"ItemButt",
			"ItemHands"
		],
			"Effect": [
			"Block",
			"Prone",
			"Lock"
		],
			"Hide": [
			"Cloth",
			"ItemNipplesPiercings",
			"ItemVulvaPiercings",
			"ItemVulva",
			"ItemVulvaPiercings",
			"ItemNipples"
		],
			"HideItem": [
			"ItemButtAnalBeads2"
		],
			"AllowActivity": [],
			"Attribute": [],
			"LockedBy": "CombinationPadlock",
			"LockMemberNumber": Player.MemberNumber,
			"CombinationNumber": lockCode
		};
		//状态变更
		InventoryGet(sender, "ItemLegs").Property ={

			"LockedBy": "CombinationPadlock",
			"LockMemberNumber": Player.MemberNumber,
			"CombinationNumber": lockCode,
			"Type": "Closed",
			"SetPose": [
				"LegsClosed"
			],
			"Effect": [
				"Prone",
				"KneelFreeze",
				"Slow",
				"Lock"
			],
			"FreezeActivePose": [
				"BodyLower"
			],
			"Difficulty": 6
		};
		InventoryGet(sender, "ItemFeet").Property ={
			"LockedBy": "CombinationPadlock",
			"LockMemberNumber": Player.MemberNumber,
			"CombinationNumber": lockCode,
			"Type": "Closed",
			"Effect": [
			"Prone",
			"Freeze",
			"Lock"
		],
			"SetPose": [
			"LegsClosed"
		],
			"Difficulty": 6,
			"FreezeActivePose": [
			"BodyLower"
		]
		};
		InventoryGet(sender, "ItemMouth").Property ={
			"AutoPunish": 0,
			"AutoPunishUndoTime": 0,
			"AutoPunishUndoTimeSetting": 300000,
			"OriginalSetting": "Plug",
			"ChatMessage": true,
			"BlinkState": 1,
			"Type": "Plug",
			"Effect": [
				"BlockMouth",
				"GagTotal",
				"Lock"
			],
			"LockedBy": "CombinationPadlock",
			"LockMemberNumber": Player.MemberNumber,
			"CombinationNumber": lockCode
		};
		InventoryGet(sender, "ItemHead").Property ={
			"Type": "b0f1g0",
			"Difficulty": 0,
			"Block": [],
			"Effect": [
				"VR",
				"BlindHeavy",
				"Prone",
				"Lock"
			],
			"Hide": [
				"Mask",
				"Glasses"
			],
			"HideItem": [
				"ItemNoseNoseRing"
			],
			"AllowActivity": [],
			"Attribute": [],
			"LockedBy": "CombinationPadlock",
			"LockMemberNumber": Player.MemberNumber,
			"CombinationNumber": lockCode
		}
		InventoryRemove(sender,"ItemBoots");
		//刷新角色
		ChatRoomCharacterUpdate(sender);
		ServerSend("ChatRoomChat", { Content: "*叮咚.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*提示音：调试模式已启动，调整束缚中.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*强大的磁力将你的腿铐与足铐紧紧的吸在一起，你的手臂在短暂的从单手套解放出来后又被装进了拘束衣内.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*口塞上又粗又长的东西一口气顶到了你的喉咙，眼罩的视觉也被关上了，只留下显示在上面的倒计时.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*至少你的鞋子被脱下来了.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*提示音：调试模式启动完成，操作面板(device)已解锁.", Type: "Emote"} );
	}
	else {
		ServerSend("ChatRoomChat", { Content: "*调试模式指令输入错误，共输入"+buttonCount+"次，1000秒内无法再次尝试进入调试模式.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*看来你已经失去了最后的机会.", Type: "Emote"} );
	}
}

//检测是否移动 取下口塞
function gagOff(sender, msg){
	if (isGagOffStop){
		ServerSend("ChatRoomChat", { Content: "*面板那边嗡了一声.", Type: "Emote"} );
	}
	else{
		InventoryRemove(sender,"ItemMouth");
		//刷新角色
		ChatRoomCharacterUpdate(sender);
		isGagOff = true;
		ServerSend("ChatRoomChat", { Content: "*嗡！", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*从面板上产生一股磁力，猛地将你的口塞吸了上去，你直接倒在了面板上", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*你发现口塞上的锁解开了，你尝试恢复平衡并通过后退来取下口塞，最后从你喉咙里拉出一根长的离谱的假阳具.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*现在你的嘴自由了，你试着呼救，在嗓子发哑后你觉得这个房间是用隔音材料制作的。.", Type: "Emote"} );
	}
}

//推进至1
function progressTo1(sender, msg){
	storyProgress =1;
	ServerSend("ChatRoomChat", { Content: "*按钮是通电的，于是你触电晕了过去.", Type: "Emote"} );
	//项圈
	InventoryWear(sender, "FuturisticCollar", "ItemNeck", "Default",80);
	InventoryLock(sender, InventoryGet(sender, "ItemNeck"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
	InventoryGet(sender, "ItemNeck").Property.CombinationNumber = lockCode;
	InventoryWear(sender, "ElectronicTag", "ItemNeckAccessories", "Default",80);
	InventoryGet(sender, "ItemNeckAccessories").Property = {Effect: Array(0), Text: "lock"};
	InventoryLock(sender, InventoryGet(sender, "ItemNeckAccessories"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
	InventoryGet(sender, "ItemNeckAccessories").Property.CombinationNumber = lockCode;
	//console.log(InventoryGet(sender, "ItemNeckAccessories"))
	//console.log(InventoryGet(sender, "ItemNeck"))
	InventoryRemove(sender,"Cloth")
	InventoryRemove(sender,"ClothLower")
	InventoryRemove(sender,"Bra")
	InventoryRemove(sender,"Panties")
	InventoryWear(sender, "PilotSuit", "Suit", "Default",80);
	InventoryWear(sender, "PilotSuit", "SuitLower", "Default",80);
	InventoryWear(sender, "Catsuit", "Gloves", "#2B408B",80);
	//刷新角色
	ChatRoomCharacterUpdate(sender)
	ServerSend("ChatRoomChat", { Content: "*醒来后你发现自己被穿上了奇怪的紧身衣，而且感到脖子有些异样，你伸手一摸，有个项圈被锁了上去，现在你得找办法解开它，或许你可以试试探索(explore)这里.", Type: "Emote"} );

}

//推进至2
function progressTo2(sender, msg){
	storyProgress = 2

	if(restrainCount !=5){
		isSuccess = false;
		if (restrainCount ==0){
			//腿铐
			InventoryWear(sender, "FuturisticLegCuffs", "ItemLegs", "Default",80);
			InventoryLock(sender, InventoryGet(sender, "ItemLegs"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
			InventoryGet(sender, "ItemLegs").Property.CombinationNumber = lockCode;
			InventoryGet(sender, "ItemLegs").Property.Type = "Chained";

			//踝铐
			InventoryWear(sender, "FuturisticAnkleCuffs", "ItemFeet", "Default",80);
			InventoryLock(sender, InventoryGet(sender, "ItemFeet"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
			InventoryGet(sender, "ItemFeet").Property.CombinationNumber = lockCode;
			InventoryGet(sender, "ItemFeet").Property.Type = "Chained";
			//鞋
			InventoryWear(sender, "FuturisticHeels", "ItemBoots", "Default",80);
			InventoryLock(sender, InventoryGet(sender, "ItemBoots"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
			InventoryGet(sender, "ItemBoots").Property = {
				"Effect": [
					"Lock"
				],
				"Type": "Heel",
				"HeightModifier": 16,
				"LockedBy": "CombinationPadlock",
				"LockMemberNumber": Player.MemberNumber,
				"CombinationNumber": lockCode
			};
			restrainCount ++;
		}

		if(restrainCount ==1){
			//胸罩
			InventoryWear(sender, "FuturisticBra", "ItemBreast", "Default",80);
			InventoryLock(sender, InventoryGet(sender, "ItemBreast"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
			InventoryGet(sender, "ItemBreast").Property.CombinationNumber = lockCode;
			//贞操带
			InventoryWear(sender, "FuturisticTrainingBelt", "ItemPelvis", "Default",80);
			InventoryLock(sender, InventoryGet(sender, "ItemPelvis"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
			InventoryGet(sender, "ItemPelvis").Property.CombinationNumber = lockCode;
			//束带
			InventoryWear(sender, "FuturisticHarness", "ItemTorso", "Default",80);
			InventoryLock(sender, InventoryGet(sender, "ItemTorso"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
			InventoryGet(sender, "ItemTorso").Property.CombinationNumber = lockCode;
			restrainCount ++;
		}
		if(restrainCount ==2){
			InventoryWear(sender, "InteractiveVRHeadset", "ItemHead", "Default",80);
			InventoryLock(sender, InventoryGet(sender, "ItemHead"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
			InventoryGet(sender, "ItemHead").Property.CombinationNumber = lockCode;
			InventoryWear(sender, "FuturisticHarnessPanelGag", "ItemMouth", "Default",80);
			InventoryLock(sender, InventoryGet(sender, "ItemMouth"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
			InventoryGet(sender, "ItemMouth").Property.CombinationNumber = lockCode;
			restrainCount ++;
		}
		if(restrainCount ==3){
			InventoryWear(sender, "FuturisticCuffs", "ItemArms", "Default",80);
			InventoryLock(sender, InventoryGet(sender, "ItemArms"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
			InventoryGet(sender, "ItemArms").Property.CombinationNumber = lockCode;
			//手套
			InventoryWear(sender, "FuturisticMittens", "ItemHands", "Default",80);
			InventoryLock(sender, InventoryGet(sender, "ItemHands"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
			InventoryGet(sender, "ItemHands").Property.CombinationNumber = lockCode;
			restrainCount ++;
		}
		if(restrainCount ==4){
			InventoryRemove(sender,"ItemArms");
			//单手套
			InventoryWear(sender, "FuturisticArmbinder", "ItemArms", "Default",80);
			InventoryLock(sender, InventoryGet(sender, "ItemArms"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
			InventoryGet(sender, "ItemArms").Property.CombinationNumber = lockCode;
			restrainCount ++;
		}
		//刷新角色
		ChatRoomCharacterUpdate(sender);
		ServerSend("ChatRoomChat", { Content: "*随着最后一盏指示灯的熄灭，你意识到你的机会用完了，机械臂伸出来把你层层束缚.", Type: "Emote"} );
	}

	var UpdatedRoom = {
		Name: ChatRoomData.Name,
		Description: ChatRoomData.Description,
		Background: ChatRoomData.Background,
		Limit: (2).toString(),
		Admin: ChatRoomData.Admin,
		Ban: ChatRoomData.Ban,
		Private: false,
		Locked: true
	};
	ServerSend("ChatRoomAdmin", {MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update"});
	ChatAdminMessage = "UpdatingRoom";
	ServerSend("ChatRoomChat", { Content: "*听见咯塔一声后你看向你进来的门，它被锁住了，你之前一直有离开的机会，现在没有了.", Type: "Emote"} );
	ServerSend("ChatRoomChat", { Content: "*墙(wall)边有什么响动，或许可以检查一下，如果你还没死心，可以试着挣扎(struggle)一下.", Type: "Emote"} );
}

//推进至3 progress3End函数计时
function progressTo3(sender, msg){
	storyProgress = 3;
	enableProgress3End = true;
	ServerSend("ChatRoomChat", { Content: "*不知多久后你恢复了意识，浑身的疼痛令你意识到你保持这个样子很久了.你看了一眼门，依旧是锁着的.", Type: "Emote"} );
	ServerSend("ChatRoomChat", { Content: "*你的眼罩上显示了一行字：检测到反抗行为，完全调教程序将在373秒后准备完成并启动，在程序启动前进入舱室(cell)可终止程序.", Type: "Emote"} );
	ServerSend("ChatRoomChat", { Content: "*看来想要出去的话必须得在程序启动前找到办法，试着探索(explore)一下吧.", Type: "Emote"} );
	setTimeout(function (sender) {
		ServerSend("ChatRoomChat", { Content: "*眼罩显示：检测到反抗行为，完全调教程序将在300秒后准备完成并启动，在程序启动前进入舱室(cell)可终止程序.", Type: "Emote"} );
	}, 73 * 1000, sender);
	setTimeout(function (sender) {
		ServerSend("ChatRoomChat", { Content: "*眼罩显示：检测到反抗行为，完全调教程序将在200秒后准备完成并启动，在程序启动前进入舱室(cell)可终止程序.", Type: "Emote"} );
	}, 173 * 1000, sender);
	setTimeout(function (sender) {
		ServerSend("ChatRoomChat", { Content: "*眼罩显示：检测到反抗行为，完全调教程序将在100秒后准备完成并启动，在程序启动前进入舱室(cell)可终止程序.", Type: "Emote"} );
	}, 273 * 1000, sender);
	setTimeout(function (sender) {
		progress3End(sender, msg)
	}, 373 * 1000, sender);
}

//挣扎 3次通向progressTo3函数或progress2End函数
function struggle(sender, msg) {
	ServerSend("ChatRoomChat", { Content: "*你拼了命的挣扎，到筋疲力尽为止，你身上的束缚没有松动分毫.", Type: "Emote"} );
	if(struggleCouont == 0){
		ServerSend("ChatRoomChat", { Content: "*现代工业，小子.", Type: "Emote"} );
		struggleCouont++;
	}
	else if(storyProgress ==2){
		if(struggleCouont == 1){
			ServerSend("ChatRoomChat", { Content: "*你仍未死心，或许再努努力会有什么转机?", Type: "Emote"} );
		}
		else if (struggleCouont == 2){
			ServerSend("ChatRoomChat", { Content: "*你受到了来自项圈的强力电击，你又昏了过去", Type: "Emote"} );
			wait(sender, msg);
			if (isSuccess){
				setTimeout(function (sender) {
					progressTo3(sender, msg)
				}, 15 * 1000, sender);
			}
			else {
				setTimeout(function (sender) {
					progress2End(sender, msg)
				}, 15 * 1000, sender);
			}
		}
		struggleCouont++;
	}




}

//舱室 提示enter（get into it）
function cell(sender, msg) {
	if (storyProgress <= 1) {
		ServerSend("ChatRoomChat", { Content: "*理论上你不应该看见这句话，不过在酒吧点炒饭也是种乐趣.", Type: "Emote"} );
	}else {// storyProgress == 2
		ServerSend("ChatRoomChat", { Content: "*舱室十分狭小，你若是进去连活动的空间都没有，它正等待着你的进入(get into it)，你别无他法.", Type: "Emote"} );
	}
}

//进入舱室 process2end normal process3end giveup
function enter(sender, msg) {

	if (storyProgress <= 1) {
		ServerSend("ChatRoomChat", { Content: "*理论上你不应该看见这句话，不过在酒吧点炒饭也是种乐趣.", Type: "Emote"} );
	}else {// storyProgress == 2
		toEnd = true;
		isGameOver = true;
		if(storyProgress == 3)
		{
			ServerSend("ChatRoomChat", { Content: "*你还是接受了你的命运.", Type: "Emote"} );
		}
		ServerSend("ChatRoomChat", { Content: "*随着你的踏入，舱室门在你身后关上了.", Type: "Emote"} );

		InventoryRemove(sender,"ItemLegs");
		InventoryWear(sender, "FuturisticLegCuffs", "ItemLegs", "Default",80);
		InventoryLock(sender, InventoryGet(sender, "ItemLegs"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
		InventoryGet(sender, "ItemLegs").Property.CombinationNumber = lockCode;
		InventoryGet(sender, "ItemLegs").Property.Type = "Chained";

		InventoryWear(sender, "FuturisticCrate", "ItemDevices", "Default",80);
		InventoryLock(sender, InventoryGet(sender, "ItemDevices"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
		InventoryGet(sender, "ItemDevices").Property= {
			"LockedBy": "CombinationPadlock",
			"LockMemberNumber": Player.MemberNumber,
			"CombinationNumber": lockCode,
			"Type": "w2l3a0d0t0h0",
			"Difficulty": 44,
			"Block": [
				"ItemAddon",
				"ItemFeet",
				"ItemLegs"
			],
			"Effect": [
				"Tethered",
				"BlindLight",
				"Prone",
				"Freeze",
				"Enclose",
				"BlockKneel",
				"Mounted",
				"Lock"
			],
			"Hide": [
				"ItemBoots",
				"Shoes"
			],
			"HideItem": [
				"ShoesFlippers"
			],
			"AllowActivity": [],
			"Attribute": [],
			"SetPose": [
				"Spread"
			]
		};
		ServerSend("ChatRoomChat", { Content: "*你被迫站在这个狭小的舱室内，连弯曲膝盖都做不到.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*你感觉到软管接在你的口塞和后庭上，有什么东西顺着软管流了进来.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*有什么异物顶入了你的私处，暴力的抽插着.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*在强烈的刺激之下，你失去了意识.", Type: "Emote"} );
		if(storyProgress == 2){
			ServerSend("ChatRoomChat", { Content: "*结局：来的太早，走的太晚。提示：当初多挣扎几下的话", Type: "Chat"} );
		}
		else if (storyProgress == 3){
			if(isSuccess2){
				ServerSend("ChatRoomChat", { Content: "*真结局：无路可走。自门锁上的那一刻你的命运就已经注定了", Type: "Chat"} );
			}
			else {
				ServerSend("ChatRoomChat", { Content: "*结局：命中注定。提示：意志坚定一点的话", Type: "Chat"} );
			}

		}

		//刷新角色
		ChatRoomCharacterUpdate(sender);
		wait(sender, msg);
		setTimeout(function (sender) {
			end(sender, msg);
		}, 15 * 1000, sender);

	}

}

//process2end bad
function progress2End(sender, msg){
	isGameOver = true;

	InventoryRemove(sender,"ItemLegs");
	InventoryWear(sender, "FuturisticLegCuffs", "ItemLegs", "Default",80);
	InventoryLock(sender, InventoryGet(sender, "ItemLegs"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
	InventoryGet(sender, "ItemLegs").Property.CombinationNumber = lockCode;
	InventoryGet(sender, "ItemLegs").Property.Type = "Chained";

	InventoryWear(sender, "FuturisticCrate", "ItemDevices", "Default",80);
	InventoryLock(sender, InventoryGet(sender, "ItemDevices"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
	InventoryGet(sender, "ItemDevices").Property= {
		"LockedBy": "CombinationPadlock",
		"LockMemberNumber": Player.MemberNumber,
		"CombinationNumber": lockCode,
		"Type": "w2l3a0d0t0h0",
		"Difficulty": 44,
		"Block": [
			"ItemAddon",
			"ItemFeet",
			"ItemLegs"
		],
		"Effect": [
			"Tethered",
			"BlindLight",
			"Prone",
			"Freeze",
			"Enclose",
			"BlockKneel",
			"Mounted",
			"Lock"
		],
		"Hide": [
			"ItemBoots",
			"Shoes"
		],
		"HideItem": [
			"ShoesFlippers"
		],
		"AllowActivity": [],
		"Attribute": [],
		"SetPose": [
			"Spread"
		]
	};
	ServerSend("ChatRoomChat", { Content: "*你醒来后发现自己被关在了舱室内.", Type: "Emote"} );
	ServerSend("ChatRoomChat", { Content: "*你被迫站在这个狭小的舱室内，连弯曲膝盖都做不到.", Type: "Emote"} );
	ServerSend("ChatRoomChat", { Content: "*你感觉到软管接在你的口塞和后庭上，有什么东西顺着软管流了进来.", Type: "Emote"} );
	ServerSend("ChatRoomChat", { Content: "*有什么异物顶入了你的私处，暴力的抽插着.", Type: "Emote"} );
	ServerSend("ChatRoomChat", { Content: "*在强烈的刺激之下，你失去了意识.", Type: "Emote"} );
	ServerSend("ChatRoomChat", { Content: "*结局：已成定局。提示：如果束缚都是自己穿上的话", Type: "Chat"} );
	//刷新角色
	ChatRoomCharacterUpdate(sender);
	wait(sender, msg);
	setTimeout(function (sender) {
		end(sender, msg);
	}, 15 * 1000, sender);
}

//process3end bad
function progress3End(sender, msg){
	if(!toEnd && enableProgress3End){
		isGameOver = true;

		InventoryRemove(sender,"ItemLegs");
		InventoryWear(sender, "FuturisticLegCuffs", "ItemLegs", "Default",80);
		InventoryLock(sender, InventoryGet(sender, "ItemLegs"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
		InventoryGet(sender, "ItemLegs").Property.CombinationNumber = lockCode;
		InventoryGet(sender, "ItemLegs").Property.Type = "Chained";

		InventoryWear(sender, "FuturisticCrate", "ItemDevices", "Default",80);
		InventoryLock(sender, InventoryGet(sender, "ItemDevices"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber);
		InventoryGet(sender, "ItemDevices").Property= {
			"LockedBy": "CombinationPadlock",
			"LockMemberNumber": Player.MemberNumber,
			"CombinationNumber": lockCode,
			"Type": "w2l3a0d0t0h0",
			"Difficulty": 44,
			"Block": [
				"ItemAddon",
				"ItemFeet",
				"ItemLegs"
			],
			"Effect": [
				"Tethered",
				"BlindLight",
				"Prone",
				"Freeze",
				"Enclose",
				"BlockKneel",
				"Mounted",
				"Lock"
			],
			"Hide": [
				"ItemBoots",
				"Shoes"
			],
			"HideItem": [
				"ShoesFlippers"
			],
			"AllowActivity": [],
			"Attribute": [],
			"SetPose": [
				"Spread"
			]
		};
		ServerSend("ChatRoomChat", { Content: "*眼罩显示：倒计时结束，调教程序启动.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*你被机械臂强行拖入了舱室内.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*极其粗壮的巨物直接捅入了你的私处并猛烈震动与抽插，你觉得私处要被摧毁了，但你的悲鸣声被口塞里巨大的假阳具压在了喉咙里.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*某种流体大量的顺着口部与后庭的软管被泵入，你清晰的感觉到身体仿佛要烧起来一样热，但是狭窄的舱室没法散走一丝一毫的热量.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*剧烈的痛苦逐渐转为令人疯狂的快感，你本来觉得自己要高潮了，但是刺激在刹那间停止了，待你稍冷静后刺激又开始了，似乎高潮永远无法到来.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*你几乎失去了意识，但是来自项圈的电击使你立马清醒了过来.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*调教还在继续，渐渐的你失去了时间观念.", Type: "Emote"} );
		if(isSuccess2){
			ServerSend("ChatRoomChat", { Content: "*真结局：最后一刻。自门锁上的那一刻你的命运就已经注定了", Type: "Chat"} );
		}
		else {
			ServerSend("ChatRoomChat", { Content: "*结局：时间到。提示：动作快一点的话", Type: "Chat"} );
		}
		isGameOver = true;
		//刷新角色
		ChatRoomCharacterUpdate(sender);
		wait(sender, msg);
		setTimeout(function (sender) {
			end(sender, msg);
		}, 15 * 1000, sender);
	}

}

//通用送出
function end(sender, msg) {
	if(storyProgress == 3 && !toEnd){
			ServerSend("ChatRoomChat", { Content: "*似乎过了一天，一周，还是一个月或一年，甚至有可能是一个世纪.", Type: "Emote"} );
			ServerSend("ChatRoomChat", { Content: "*毫无征兆的你达到了高潮，其剧烈程度超出了你此前人生中任何一次高潮的数百倍.", Type: "Emote"} );
			ServerSend("ChatRoomChat", { Content: "*终于迎来了求之不得的高潮，在余韵中你的大脑除了幸福别无他物.", Type: "Emote"} );
			ServerSend("ChatRoomChat", { Content: "*你听见提示音:运输程序启动，30秒后进行运输.", Type: "Emote"} );
			ServerSend("ChatRoomChat", { Content: "*你感到舱室有些晃动，似乎正在移动.", Type: "Emote"} );
			ServerSend("ChatRoomChat", { Content: "*你看看见了一行数字：" + lockCode + " ，你意识到你必须得记住这行数字.", Type: "Emote"} );
			if(isSuccess2){
				ServerSend("ChatRoomChat", { Content: "*[恭喜，这就是真结局了，努力后发现于事无补的情况真的很绝望呢，]", Type: "Emote"} );
			}
			else{
				ServerSend("ChatRoomChat", { Content: "*[再尝试尝试挑战真结局吧]", Type: "Emote"} );
			}


			InventoryGet(sender, "ItemNeckAccessories").Property = {Effect: Array(0), Text: lockCode};
			//刷新角色
			ChatRoomCharacterUpdate(sender);
			setTimeout(function (sender) {
				console.log("end kick");
				ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
				//resetRoom()
			}, 30 * 1000, sender);



	}
	else if(isSuccess){
		ServerSend("ChatRoomChat", { Content: "*恍惚间，你恢复了意识.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*你听见提示音:运输程序启动，30秒后进行运输.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*你感到舱室有些晃动，似乎正在移动.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*你看看见了一行数字：" + lockCode + " ，你意识到你必须得记住这行数字.", Type: "Emote"} );
		if(storyProgress == 3){
			if(isSuccess2){
				ServerSend("ChatRoomChat", { Content: "*[恭喜，这就是真结局了，努力后发现于事无补的情况真的很绝望呢，]", Type: "Emote"} );
			}
			else{
				ServerSend("ChatRoomChat", { Content: "*[再尝试尝试挑战真结局吧]", Type: "Emote"} );
			}
		}
		else{
			ServerSend("ChatRoomChat", { Content: "*[干的不错，你靠自己就把自己绑的严严实实，做为奖励就帮你跳过本来300秒的等待时间吧,]", Type: "Emote"} );

		}
		InventoryGet(sender, "ItemNeckAccessories").Property = {Effect: Array(0), Text: lockCode};
		//刷新角色
		ChatRoomCharacterUpdate(sender);
		setTimeout(function (sender) {
			console.log("end kick");
			ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
			//resetRoom()
		}, 30 * 1000, sender);

	}
	else {
		ServerSend("ChatRoomChat", { Content: "*恍惚间，你恢复了意识.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*你听见提示音:运输程序启动，300秒后进行运输.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*你感到舱室有些晃动，似乎正在移动.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*你看看见了一行数字：" + lockCode + " ，你意识到你必须得记住这行数字.", Type: "Emote"} );
		InventoryGet(sender, "ItemNeckAccessories").Property = {Effect: Array(0), Text: lockCode};
		//刷新角色
		ChatRoomCharacterUpdate(sender);
		setTimeout(function (sender) {
			console.log("end kick");
			ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
			//resetRoom()
		}, 300 * 1000, sender);

	}
}

//通用等待 后一个函数延时15s
function wait(sender, msg) {
	setTimeout(function (sender) {
		ServerSend("ChatRoomChat", { Content: "*......", Type: "Emote"} );
	}, 5 * 1000, sender);
	setTimeout(function (sender) {
		ServerSend("ChatRoomChat", { Content: "*......", Type: "Emote"} );
	}, 7 * 1000, sender);
	setTimeout(function (sender) {
		ServerSend("ChatRoomChat", { Content: "*......", Type: "Emote"} );
	}, 9 * 1000, sender);
	setTimeout(function (sender) {
		ServerSend("ChatRoomChat", { Content: "*......", Type: "Emote"} );
	}, 11 * 1000, sender);
	setTimeout(function (sender) {
		ServerSend("ChatRoomChat", { Content: "*......", Type: "Emote"} );
	}, 13 * 1000, sender);

}


function storyStart(sender) {

		ServerSend("ChatRoomChat", { Content: "*该bot现已发布至 https://github.com/zajucd/BC_BotGame ", Type: "Emote"} );


	// check if all imprisoned people are in room. Sometimes they are not. Don't know why.

		if (isExposed(sender) || sender.IsRestrained() || sender.IsChaste() || sender.IsShackled() || sender.IsBlind() || !sender.CanTalk() || sender.IsEnclose() || sender.IsMounted() || sender.IsEgged() || sender.IsDeaf()) {
			ServerSend("ChatRoomChat", {
				Content: "*[需要 穿着衣服且不被束缚 才能游玩. 二十秒后踢出房间. 想玩的话脱掉装备后再来哦.]",
				Type: "Emote"
			});
			setTimeout(function (sender) {
				console.log("error kick");
				ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
			}, 10 * 1000, sender)
			//imprisonedList.push(sender.MemberNumber)
		} else if (sender.ItemPermission > 2) {
			ServerSend("ChatRoomChat", {
				Content: "*[需要调低 玩家权限 才能游玩. 二十秒后踢出房间. 想玩的话修改权限后再来哦.设置位置在角色档案内选择第三项后选择第一项.]",
				Type: "Emote"
			});
			setTimeout(function (sender) {
				ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
			}, 20 * 1000, sender)
			// setTimeout(resetRoom(), 20*1000, sender)

			//imprisonedList.push(sender.MemberNumber)
		} else if (InventoryBlockedOrLimitedCustomized(sender, AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock"))) {
			ServerSend("ChatRoomChat", {
				Content: "**[需要 组合密码锁（COMBINATION PADLOCK）的权限. 二十秒后踢出房间. 想玩的话修改权限后再来哦.]",
				Type: "Emote"
			});
			setTimeout(function (sender) {
				console.log("error kick");
				ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
			}, 20 * 1000, sender)
			// setTimeout(resetRoom(), 20*1000, sender)
		} else {
			ServerSend("ChatRoomChat", {
				Content: "*This is a Chinese room,make sure you can read Chinese before start.",
				Type: "Emote"
			});
			ServerSend("ChatRoomChat", {
				Content: "*[现在不清楚当前版本对脚本的支持程度如何，条件允许的话请打开公开脚本限权.在 设置-> 脚本 中].",
				Type: "Emote"
			});
			ServerSend("ChatRoomChat", {
				Content: "*[求求你千万不要自己解除装备，不然bot怎么炸的都不知道].",
				Type: "Emote"
			});
			ServerSend("ChatRoomChat", {
				Content: "*你进入了一个奇怪的房间，你的面前有一个台子，上面有一个又大又红的按钮(button)，诱惑着你按下它或者你可以观察(explore)一下周围.[NOTE:通过发送 *单词 来行动（例：*button）.]",
				Type: "Emote"
			});
		}
	}


function resetRoom() {
		console.log("reset");
		// check if all imprisoned people are in room. Sometimes they are not. Don't know why.
		storyProgress = 0;
		life = 3;
		restrainCount = 0;
		cardCount = 0;
		struggleCouont = 0;
		buttonCount = 0;
		lockCode = Math.floor(Math.random() * 9000+1000).toString();
		restrainText = ["两对腿铐和一双高跟鞋","一条贞操胸罩和一条贞操带，还有一套束带","一个口塞与一个眼罩","两对臂铐与一双手套","一条单手套"];
		boxText = ["1+1=?","3*2=?","PI的小数点后第5位为?","半径为2的圆面积为?PI","lim x→0 sinx/x = ?"];
		boxText2 = ["目前为止你穿过?次盒子里的装备","下图中最多符号在键盘上对应的数字为?","打开9号盒子并等待30秒"];
		boxText20 =[" @$@##$%$%$ ",
					" #@#%$##$%% ",
					" #@$%#@$%#@ ",
					" @#$$$%%%$$ ",
					" #$%%%$%$$@ ",
					" @@@#%$#@@% "];
		boxNum = ["2","6","9","4","1"];
		boxNum2 = ["5","4","9"];
		isWareable = false;
		isSuccess = true;
		isSuccess2 = false;
		isDeviceOn = false;
		isGagOff = false;
		isGagOffStop = false;
		toEnd = false;
		isBoxOpenStop = false;
		isGameOver = false;
		enableProgress3End =false;



		// Update room
	var UpdatedRoom = {
		Name: "Escape Game CursedRoom",
		Description: "[BOT]密室逃生第一部  被诅咒的项圈",
		Background: "VaultCorridor",
		Limit: (2).toString(),
		Admin: ChatRoomData.Admin,
		Ban: ChatRoomData.Ban,
		Private: true,
		Locked: false
	};
		ServerSend("ChatRoomAdmin", {MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update"});
		ChatAdminMessage = "UpdatingRoom";

}

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
