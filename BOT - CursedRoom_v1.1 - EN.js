activateStoryRoom();

RemoveCloth(Player,null);
RemoveRestrains(Player,null);
WearFullRestrains(Player,null);
InventoryWear(Player, "TheDisplayFrame", "ItemDevices", "Default",80);



Player.Description = `

BOT game：CursedRoom V1.1
author: zajucd(7092)
prototype: https://github.com/keykey5/BC-BOT-repository
address: https://github.com/zajucd/BC_BotGame
Machine translation, does not guarantee text errors
answer is below

 
 
 
 
 
 
 
 
 
 
 
 

 2，6，9，4，1
 101(binary system)=5(decimal system)
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
	if (SenderCharacter.MemberNumber == Player.MemberNumber) {
		return;
	}
	if (storyActive) {
		if ((data.Type == "Action") && (msg.startsWith("ServerEnter"))) {
			setTimeout(storyStart(SenderCharacter), 300, SenderCharacter)
		} else if ((msg.startsWith("ServerLeave")) || (msg.startsWith("ServerDisconnect")) || (msg.startsWith("ServerBan")) || (msg.startsWith("ServerKick"))) {
			resetRoom()
		}
		if (data.Type != null) {
			if (msg.toLowerCase().includes("1145141919810") && charList.includes(SenderCharacter.MemberNumber)) {
				ServerSend("ChatRoomChat", { Content: "The transportation program starts in 30 seconds", Type: "Chat"} );
				ServerSend("ChatRoomChat", { Content: "*The cell is starting to shake, it seems like you are about to be transported away.", Type: "Emote"} );
				ServerSend("ChatRoomChat", { Content: "*Before being transported away, you saw a row of numbers：" + lockCode + " ，You realize that you have to remember this row of numbers.", Type: "Emote"} );
				setTimeout(function (SenderCharacter) {
					console.log("? kick");
					ChatRoomAdminChatAction("Kick", SenderCharacter.MemberNumber.toString())
				}, 30 * 1000, SenderCharacter);
				resetRoom()
			}else if ((data.Type == "Emote") || (data.Type == "Action") || (data.Type == "Hidden" && msg.startsWith("ChatRoomBot"))) {
				if(isDeviceOn && SenderCharacter.MemberNumber != Player.MemberNumber){
					ServerSend("ChatRoomChat", { Content: "*You take small jumps and move.", Type: "Emote"} );
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
			ServerSend("ChatRoomChat", { Content: "*In this small cell, you are powerless against anything.", Type: "Emote"} );
		}
		else {
			if (msg.toLowerCase().includes("explore")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " Explore the room.", Type: "Emote"} );
				explore(sender, msg)
			}
			else if (msg.toLowerCase().includes("wall")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " Check wall.", Type: "Emote"} );
				wall(sender, msg)
			}
			else if (msg.toLowerCase().includes("button")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " Check button.", Type: "Emote"} );
				button(sender, msg)
			}
			else if (msg.toLowerCase().includes("box")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " Check boxs.", Type: "Emote"} );
				box(sender, msg)
			}
			else if (msg.toLowerCase().includes("light")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " Check light.", Type: "Emote"} );
				light(sender, msg)
			}
			else if (msg.toLowerCase().includes("wear")) {
				wear(sender, msg)
			}
			else if (msg.toLowerCase().includes("struggle")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " try struggle.", Type: "Emote"} );
				struggle(sender, msg)
			}
			else if (msg.toLowerCase().includes("cell")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " Check cell.", Type: "Emote"} );
				cell(sender, msg)
			}
			else if (msg.toLowerCase().includes("get into it")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " Enter Cell.", Type: "Emote"} );
				enter(sender, msg)
			}
			else if (msg.toLowerCase().includes("corner")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " Check corner.", Type: "Emote"} );
				corner(sender, msg)
			}

			else if (msg.toLowerCase().includes("device")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " Check device.", Type: "Emote"} );
				device(sender, msg)
			}
			else if (msg.toLowerCase().includes("skip")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " skip.", Type: "Emote"} );
				progressTo2(sender, msg);
				isSuccess = true;
			}
			else if (msg.toLowerCase().includes("wait")) {
				ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " wait.", Type: "Emote"} );
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
	ServerSend("ChatRoomChat", { Content: "*You looked around the room, and there were red and large (button) on the table in front of you,and a (wall) on the side.", Type: "Emote"} );
	if (storyProgress == 0) {
		ServerSend("ChatRoomChat", { Content: "*The door is not locked,you can still leave now.", Type: "Emote"} );
	}else if (storyProgress == 1){
		ServerSend("ChatRoomChat", { Content: "*There is a row of numbered (box)es,and there are three indicator (light)s on the wall in front.The door is not locked,and you can still leave now.", Type: "Emote"} );
	}else if (storyProgress == 2){
		ServerSend("ChatRoomChat", { Content: "*Now a grid on the wall protrudes, forming a (cell),waiting for you to enter. The door is locked and you can no longer leave.", Type: "Emote"} );
	}else {//storyProgress == 3
		ServerSend("ChatRoomChat", { Content: "*There is a row of numbered (box)es,and there are three indicator (light)s on the wall in front.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*There is now an additional control (device) on the (button) table.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*The (cell) is waiting for you to enter at any time, and you don't have much time left", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*There seem to be some scratches in the (corner).", Type: "Emote"} );
	}
}

//墙 进度1：无 进度2：显示cell 进度3：提示cell
function wall(sender, msg) {
	ServerSend("ChatRoomChat", { Content: "*The cracks on this wall divide it into one grid after another. As you listen closely, there seems to be panting and sobbing sounds,", Type: "Emote"} );
	if (storyProgress <= 1) {
		ServerSend("ChatRoomChat", { Content: "*You didn't dare to keep think, so you backed away", Type: "Emote"} );
	}else if (storyProgress == 2){
		ServerSend("ChatRoomChat", { Content: "*Now a grid on the wall protrudes, forming a (cell). You understand that the sound inside the wall comes from the people stored inside the compartment, and you will also join them. An indescribable feeling rises from your heart.", Type: "Emote"} );
	}
	else{// storyProgress == 2
		ServerSend("ChatRoomChat", { Content: "*The (cell) is still there, and your blindfold shows: Enter!", Type: "Emote"} );
	}
}

//按钮 进度1：progressTo1函数 进度2：无 进度3：buttoninish函数
function button(sender, msg) {
	//console.log("button")
	ServerSend("ChatRoomChat", { Content: "*You pressed the button,", Type: "Emote"} );
	if (storyProgress == 0) {
		progressTo1(sender, msg);
	}

	else if(storyProgress <=2 ){
		ServerSend("ChatRoomChat", { Content: "*There was no response.", Type: "Emote"} );
	}


	//进度3
	else{
		if(buttonCount == 3){
			ServerSend("ChatRoomChat", { Content: "*......", Type: "Emote"} );
			setTimeout(function (sender) {
				ServerSend("ChatRoomChat", { Content: "*Did the machine not recognize this.", Type: "Emote"} );
			}, 2 * 1000, sender);

		}
		else if(buttonCount == 4){
			ServerSend("ChatRoomChat", { Content: "*beep.", Type: "Emote"} );
			setTimeout(function (sender) {
				buttonFinish(sender, msg)
			}, 10 * 1000, sender);
		}
		else{
			ServerSend("ChatRoomChat", { Content: "*beep.", Type: "Emote"} );
		}
		buttonCount++;

	}
	//console.log(InventoryGet(sender, "ItemNeckAccessories"))
	//console.log(InventoryGet(sender, "ItemNeck"))
}

//盒子 进度1：wear函数 进度3：取认证卡，
function box(sender, msg) {
	if (storyProgress == 0) {
		ServerSend("ChatRoomChat", { Content: "*Theoretically, you shouldn't see this,but it's fun to find a bug,isn't it.", Type: "Emote"} );
	}else if (storyProgress == 1){
		ServerSend("ChatRoomChat", { Content: "*Nine boxes are arranged in a row, with numbers 1 to 9 written on them. It looks like you can try opening one of them.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*There is also a display screen that says:"+boxText[restrainCount]+".", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*[NOTE:send *box number to open a box（example：*box 2）.", Type: "Emote"} );
		if(msg.toLowerCase().includes("1")||
			msg.toLowerCase().includes("2")||
			msg.toLowerCase().includes("3")||
			msg.toLowerCase().includes("4")||
			msg.toLowerCase().includes("5")||
			msg.toLowerCase().includes("6")||
			msg.toLowerCase().includes("7")||
			msg.toLowerCase().includes("8")||
			msg.toLowerCase().includes("9")){//是否含数字
			ServerSend("ChatRoomChat", { Content: "*You try opening a box.", Type: "Emote"} );
			if(msg.toLowerCase().includes(boxNum[restrainCount])){
				isWareable = true;
				ServerSend("ChatRoomChat", { Content: "*The box is open, inside is" + restrainText[restrainCount] +",The inner wall of the box reads: (wear) it.", Type: "Emote"} );
				if(restrainCount == 4){
					ServerSend("ChatRoomChat", { Content: "*You instinctively glanced at the door when it arrived, and it was not locked yet.", Type: "Emote"} );
				}
			}
			else {
				life--;
				ServerSend("ChatRoomChat", { Content: "*The indicator light has turned off, and you have an ominous feeling.", Type: "Emote"} );
				if(life == 0){
					progressTo2(sender, msg);
				}

			}
		}
	}
	else if(storyProgress == 2){
		ServerSend("ChatRoomChat", { Content: "*No matter what you do with the box, it has no reaction at all, there is only one thing you can do.", Type: "Emote"} );
	}
	else {// storyProgress == 3
		if(isDeviceOn && cardCount<=2){
			if(isGagOff){
				ServerSend("ChatRoomChat", { Content: "*Nine boxes are arranged in a row, with numbers 1 to 9 written on them. Now you can take out the key card with your mouth.", Type: "Emote"} );
				ServerSend("ChatRoomChat", { Content: "*There is also a display screen that says:"+boxText2[cardCount]+".", Type: "Emote"} );
				if(cardCount == 1){
					ServerSend("ChatRoomChat", { Content: "*"+boxText20[0]+"", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*"+boxText20[1]+"", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*"+boxText20[2]+"", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*"+boxText20[3]+"", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*"+boxText20[4]+"", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*"+boxText20[5]+"", Type: "Emote"} );
				}
				ServerSend("ChatRoomChat", { Content: "*[NOTE:send *box number to open a box（example：*box 2）.", Type: "Emote"} );
				if(msg.toLowerCase().includes("1")||
					msg.toLowerCase().includes("2")||
					msg.toLowerCase().includes("3")||
					msg.toLowerCase().includes("4")||
					msg.toLowerCase().includes("5")||
					msg.toLowerCase().includes("6")||
					msg.toLowerCase().includes("7")||
					msg.toLowerCase().includes("8")||
					msg.toLowerCase().includes("9")){//是否含数字
					ServerSend("ChatRoomChat", { Content: "*You try opening a box.", Type: "Emote"} );
					if(msg.toLowerCase().includes(boxNum2[cardCount])){

						if(cardCount == 2){
							isBoxOpenStop = false;
							t5 = setTimeout(function (SenderCharacter) {
								if (!isBoxOpenStop){
									ServerSend("ChatRoomChat", { Content: "*The box has finally opened, and you have taken out a key card.", Type: "Emote"} );
									cardCount++;
								}
								else{
									ServerSend("ChatRoomChat", { Content: "*There was a beep on the other side of the box, it seems you need to stay there.", Type: "Emote"} );
								}
							}, 30 * 1000, sender)
						}
						else {
							ServerSend("ChatRoomChat", { Content: "*you have taken out a key card.", Type: "Emote"} );
							cardCount++;
						}

					}
					else {
						setTimeout(function (SenderCharacter) {
							ServerSend("ChatRoomChat", { Content: "*The box can't be opened, you wasted some time.", Type: "Emote"} );
						}, 5 * 1000, sender)
					}
				}
			}
			else{
				ServerSend("ChatRoomChat", { Content: "*Nine boxes are arranged in a row, with numbers 1 to 9 written on them.You realize that in your current state, even if there is something inside, you cannot take it out.", Type: "Emote"} );
			}
		}
		else {
			ServerSend("ChatRoomChat", { Content: "*Nine boxes are arranged in a row, with numbers 1 to 9 written on them.It looks like there's nothing inside.", Type: "Emote"} );
		}
	}
}

//指示灯 进度1：显示生命 进度2：无 进度3：显示101,5
function light(sender, msg) {
	if (storyProgress == 0) {
		ServerSend("ChatRoomChat", { Content: "*Theoretically, you shouldn't see this,but it's fun to find a bug,isn't it.", Type: "Emote"} );
	}
	else if (storyProgress == 1){
		ServerSend("ChatRoomChat", { Content: "*There are three indicator lights," + (life) +"of them is on.", Type: "Emote"} );
	}
	else if(storyProgress == 2){
		ServerSend("ChatRoomChat", { Content: "*Now all the indicator lights are off, there's only one thing you can do.", Type: "Emote"} );
	}
	else {// storyProgress == 3
		ServerSend("ChatRoomChat", { Content: "*Left one and right one are on, and the middle one is off.", Type: "Emote"} );
		//101 == 5
	}
}

//穿 进度1 根据装备数穿装备与progressTo2函数 进度2：无 进度3：无
function wear(sender, msg) {
	if (storyProgress == 0) {
		ServerSend("ChatRoomChat", { Content: "*Theoretically, you shouldn't see this,but it's fun to find a bug,isn't it.", Type: "Emote"} );
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
						"TypeRecord": {typed : 1},
						"HeightModifier": 16,
						"LockedBy": "CombinationPadlock",
						"LockMemberNumber": Player.MemberNumber,
						"CombinationNumber": lockCode
					};
					//刷新角色
					ChatRoomCharacterUpdate(sender);
					isWareable = false;
					restrainCount ++;
					ServerSend("ChatRoomChat", { Content: "*You put them on and they fit strangely, but now you have to put in a lot of effort just to stand still.", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*The box is closed, and there is a mechanical sound coming from inside, as if the things inside are different.", Type: "Emote"} );
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
					ServerSend("ChatRoomChat", { Content: "*You put them on, and now you are confident that these things are tailored for you. You try to touch your private parts, but the excitement is completely blocked out of the chastity belt.", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*The box is closed, and there is a mechanical sound coming from inside, as if the things inside are different.", Type: "Emote"} );
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
					ServerSend("ChatRoomChat", { Content: "*You put them on, your face is completely covered, and something is stuck in your mouth. Strangely, you can still see things.", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*The box is closed, and there is a mechanical sound coming from inside, as if the things inside are different.", Type: "Emote"} );
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
					ServerSend("ChatRoomChat", { Content: "*You put them on, and your hands were forced to clench into fists.", Type: "Emote"} );
					ServerSend("ChatRoomChat", { Content: "*The box is closed, and there is a mechanical sound coming from inside, as if the things inside are different.", Type: "Emote"} );
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
					ServerSend("ChatRoomChat", { Content: "*The robotic arm kindly extended to help you put it on, and now you are perfectly bound.", Type: "Emote"} );
					break;
			}
			if(restrainCount ==5){
				progressTo2(sender, msg);

			}
		}


	}else {// storyProgress == 2
		ServerSend("ChatRoomChat", { Content: "*There's nothing left for you to wear, there's only one thing you can do.", Type: "Emote"} );
	}
}

//角落 进度1：无 进度2：无 进度3：提示button
function corner(sender, msg){
	if(storyProgress <=2){
		ServerSend("ChatRoomChat", { Content: "*Theoretically, you shouldn't see this,but it's fun to find a bug,isn't it.", Type: "Emote"} );
	}
	else {
		ServerSend("ChatRoomChat", { Content: "*You carefully examined the scratches, and from the metal plate next to it, it appears to be the text left by the previous person who was also bound by their entire body.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*After all, even if one finger could move, it wouldn't be so difficult to identify.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*scratches says：LI__T 2 -> 10 TI__S B___ON WAI_!", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*GAG D_V__E 15SEc.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*You tried to use metal sheets to break your shackles, but modern industry cannot be shaken by just metal sheets.", Type: "Emote"} );

	}

}

//面板 进度3：提示box与button 三次认证卡后调查结局
function device(sender, msg){
	if (storyProgress <=2 ) {
		ServerSend("ChatRoomChat", { Content: "*Theoretically, you shouldn't see this,but it's fun to find a bug,isn't it.", Type: "Emote"} );
	}
	else {
		if (isDeviceOn){
			if(!isSuccess2){
				ServerSend("ChatRoomChat", { Content: "*Panel display: Debugging mode. To obtain the release key, please remove three key cards from the (box) and visit again.", Type: "Emote"} );
			}
			else {
				ServerSend("ChatRoomChat", { Content: "*The panel has closed again.", Type: "Emote"} );
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
					"TypeRecord": {typed : 1},
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
					"TypeRecord": {g: 2, p: 3, t: 4},
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

				ServerSend("ChatRoomChat", { Content: "*Panel display: The release key is displayed on the collar, debugging mode is turned off, and binding is being restored.", Type: "Emote"} );
				ServerSend("ChatRoomChat", { Content: "*Although the situation has not improved or even worsened, at least you still have a key that you cannot use on your own.", Type: "Emote"} );
			}


		}
		else {
			ServerSend("ChatRoomChat", { Content: "*You touched the device, but there seems to be no response.", Type: "Emote"} );
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
			"TypeRecord": {cl: 1, co: 1, np: 1, vp: 1, a: 0},
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
			"TypeRecord": {typed : 1},
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
			"TypeRecord": {typed : 1},
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
			"TypeRecord": {g: 2, p: 3, t: 4},
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
			"TypeRecord": {b:0,f:1,g:0},
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
		ServerSend("ChatRoomChat", { Content: "*ding-dong.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*Prompt sound: Debugging mode has been activated, adjusting constraints.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*The powerful magnetic force tightly sucks your leg cuffs and foot cuffs together, and after a brief release from armbinder, your arms are put back into a restraining suit.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*The thick and long thing stuck in your mouth pressed against your throat in one breath, and the vision of the eye mask was also closed, leaving only the countdown displayed on it.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*At least your shoes have been taken off了.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*Prompt sound: Debugging mode startup completed, operation (device) unlocked.", Type: "Emote"} );
	}
	else {
		ServerSend("ChatRoomChat", { Content: "*Debugging mode instruction input error，inputed" + buttonCount +"times.Unable to attempt to enter debugging mode again within 1000 seconds.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*It seems that you have lost your last chance.", Type: "Emote"} );
	}
}

//检测是否移动 取下口塞
function gagOff(sender, msg){
	if (isGagOffStop){
		ServerSend("ChatRoomChat", { Content: "*There was a buzzing sound on the device side.", Type: "Emote"} );
	}
	else{
		InventoryRemove(sender,"ItemMouth");
		//刷新角色
		ChatRoomCharacterUpdate(sender);
		isGagOff = true;
		ServerSend("ChatRoomChat", { Content: "*buzzing！", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*A magnetic force was generated from the device, and it suddenly sucked your mouth plug up, causing you to fall directly onto the device", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*You find that the lock on the gag is unlocked. You try to regain balance and remove the gag by stepping back. Finally, you pull out a long, outrageous dildo from your throat.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*Now your mouth is free, you try to call for help, and after losing your voice, you feel that this room is made of soundproofing material.", Type: "Emote"} );
	}
}

//推进至1
function progressTo1(sender, msg){
	storyProgress =1;
	ServerSend("ChatRoomChat", { Content: "*There is current on the button, so you electrocuted and passed out.", Type: "Emote"} );
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
	ServerSend("ChatRoomChat", { Content: "*After waking up, you found yourself wearing a strange tight fitting suit and feeling a bit strange about your neck. When you reached out and touched it, a collar was locked. Now you need to find a way to unlock it. Perhaps you can try (explore) here.", Type: "Emote"} );

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
				"TypeRecord": {typed : 1},
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
		ServerSend("ChatRoomChat", { Content: "*As the last indicator light goes out, you realize that your opportunities have run out, and the robotic arm extends out to restrain you layer by layer.", Type: "Emote"} );
	}

	var UpdatedRoom = {
		Name: ChatRoomData.Name,
		Description: ChatRoomData.Description,
		Background: ChatRoomData.Background,
		Limit: (2).toString(),
		Admin: ChatRoomData.Admin,
		Ban: ChatRoomData.Ban,
		Private: ChatRoomData.Private,
		Locked: true,
		Language: ChatRoomData.Language
	};
	ServerSend("ChatRoomAdmin", {MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update"});
	ChatAdminMessage = "UpdatingRoom";
	ServerSend("ChatRoomChat", { Content: "*After hearing a click, you looked at the door where you came in and it was locked. You had always had the chance to leave before, but now it's gone.", Type: "Emote"} );
	ServerSend("ChatRoomChat", { Content: "*If there is any noise near the (wall), perhaps you can check it. If you haven't given up yet, you can try (struggle).", Type: "Emote"} );
}

//推进至3 progress3End函数计时
function progressTo3(sender, msg){
	stopTimeOut = false;
	storyProgress = 3;
	enableProgress3End = true;
	ServerSend("ChatRoomChat", { Content: "*Not long after, you regained consciousness, and the pain all over your body made you realize that you had been like this for a long time. You glanced at the door, but it was still locked.", Type: "Emote"} );
	ServerSend("ChatRoomChat", { Content: "*Your eye mask displays a line of text: Resistance detected. The fully tuned program will be ready to complete and start in 373 seconds. Before the program starts, enter the (cell) to terminate the program.", Type: "Emote"} );
	ServerSend("ChatRoomChat", { Content: "*It seems that if you want to go out, you must find a way before the program starts. Try to (explore) it.", Type: "Emote"} );
	t1 = setTimeout(function (sender) {
		ServerSend("ChatRoomChat", { Content: "*Eye mask display: Resistance behavior detected. The fully tuned program will be ready to complete and start in 300 seconds. Before the program starts, enter the (cell) to terminate the program.", Type: "Emote"} );
	}, 73 * 1000, sender);
	t2 = setTimeout(function (sender) {
		ServerSend("ChatRoomChat", { Content: "*Eye mask display: Resistance behavior detected. The fully tuned program will be ready to complete and start in 200 seconds. Before the program starts, enter the (cell) to terminate the program.", Type: "Emote"} );
	}, 173 * 1000, sender);
	t3 = setTimeout(function (sender) {
		ServerSend("ChatRoomChat", { Content: "*Eye mask display: Resistance behavior detected. The fully tuned program will be ready to complete and start in 100 seconds. Before the program starts, enter the (cell) to terminate the program.", Type: "Emote"} );
	}, 273 * 1000, sender);
	t4 = setTimeout(function (sender) {
		progress3End(sender, msg)
	}, 373 * 1000, sender);
}

//挣扎 3次通向progressTo3函数或progress2End函数
function struggle(sender, msg) {
	ServerSend("ChatRoomChat", { Content: "*You struggled tirelessly until you were exhausted, and the restraints on your body did not loosen at all.", Type: "Emote"} );
	if(struggleCouont == 0){
		ServerSend("ChatRoomChat", { Content: "*Modern industry, son.", Type: "Emote"} );
		struggleCouont++;
	}
	else if(storyProgress ==2){
		if(struggleCouont == 1){
			ServerSend("ChatRoomChat", { Content: "*You haven't given up yet, maybe there will be some turning point if you try harder.", Type: "Emote"} );
		}
		else if (struggleCouont == 2){
			ServerSend("ChatRoomChat", { Content: "*You received a strong electric shock from the collar, and you fainted again.", Type: "Emote"} );
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
		ServerSend("ChatRoomChat", { Content: "*Theoretically, you shouldn't see this,but it's fun to find a bug,isn't it.", Type: "Emote"} );
	}else {// storyProgress == 2
		ServerSend("ChatRoomChat", { Content: "*The cell is very small, and if you enter, there is not even room for activity. It is waiting for you to (get into it), and you have no other choice.", Type: "Emote"} );
	}
}

//进入舱室 process2end normal process3end giveup
function enter(sender, msg) {

	if (storyProgress <= 1) {
		ServerSend("ChatRoomChat", { Content: "*Theoretically, you shouldn't see this,but it's fun to find a bug,isn't it.", Type: "Emote"} );
	}else {// storyProgress == 2
		toEnd = true;
		isGameOver = true;
		if(storyProgress == 3)
		{
			ServerSend("ChatRoomChat", { Content: "*You still accepted your fate.", Type: "Emote"} );
		}
		ServerSend("ChatRoomChat", { Content: "*As you step in, the cell door closes behind you.", Type: "Emote"} );

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
			"TypeRecord": {w:2,l:3,a:0,d:0,t:0,h:0},
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
		ServerSend("ChatRoomChat", { Content: "*You are forced to stand in this small cell, unable to even bend your knees.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*You feel that the hose is connected to your mouth and backyard, and something is flowing in through the hose.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*Something foreign object has penetrated your private area, violently thrusting in and out.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*Under intense stimulation, you lose consciousness.", Type: "Emote"} );
		if(storyProgress == 2){
			ServerSend("ChatRoomChat", { Content: "*End: Coming too early and leaving too late. Tip: If had struggled a few more times back then", Type: "Chat"} );
		}
		else if (storyProgress == 3){
			if(isSuccess2){
				ServerSend("ChatRoomChat", { Content: "*True End：There is no way to go. From the moment the door was locked, your fate was already predetermined", Type: "Chat"} );
			}
			else {
				ServerSend("ChatRoomChat", { Content: "*End：Destined by fate. Tip: If you have a stronger will", Type: "Chat"} );
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
		"TypeRecord": {w:2,l:3,a:0,d:0,t:0,h:0},,
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
	ServerSend("ChatRoomChat", { Content: "*When you wake up, you find yourself locked in the cell.", Type: "Emote"} );
	ServerSend("ChatRoomChat", { Content: "*You are forced to stand in this small cell, unable to even bend your knees.", Type: "Emote"} );
	ServerSend("ChatRoomChat", { Content: "*You feel that the hose is connected to your mouth and backyard, and something is flowing in through the hose.", Type: "Emote"} );
	ServerSend("ChatRoomChat", { Content: "*Something foreign object has penetrated your private area, violently thrusting in and out.", Type: "Emote"} );
	ServerSend("ChatRoomChat", { Content: "*Under intense stimulation, you lose consciousness.", Type: "Emote"} );
	ServerSend("ChatRoomChat", { Content: "*End：It has become a foregone conclusion. Tip: If all the restraints are worn by oneself", Type: "Chat"} );
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
			"TypeRecord": {w:2,l:3,a:0,d:0,t:0,h:0},
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
		ServerSend("ChatRoomChat", { Content: "*Eye mask display: Countdown ends, tuning program starts.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*You were forcibly dragged into the cell by a robotic arm.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*The extremely thick and massive object directly pierced into your private area, violently shaking and thrusting. You felt that your private area was about to be destroyed, but your mournful cry was suppressed in your throat by the huge dildo in your mouth.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*A certain fluid is pumped in large quantities through the hoses in the mouth and backyard. You can clearly feel that your body is about to burn, but the narrow compartment cannot dissipate any heat.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*The intense pain gradually turns into crazy pleasure. You originally thought you were about to climax, but the stimulation stopped in an instant. After you calmed down a bit, the stimulation started again, as if orgasm could never come.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*You almost lost consciousness, but the electric shock from the collar immediately woke you up.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*The training is still ongoing, and gradually you have lost your sense of time.", Type: "Emote"} );
		if(isSuccess2){
			ServerSend("ChatRoomChat", { Content: "*True End：At the last moment. From the moment the door was locked, your fate was already predetermined", Type: "Chat"} );
		}
		else {
			ServerSend("ChatRoomChat", { Content: "*End：Time is up. Tip: If you act faster", Type: "Chat"} );
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
		ServerSend("ChatRoomChat", { Content: "*It seems like a day, a week, a month, a year, or even a century has passed.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*Without any warning, you have reached orgasm, which is hundreds of times more intense than any previous orgasm in your life.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*Finally, you have reached the desired climax, and in the lingering charm, your brain has nothing but happiness.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*You hear a prompt sound: Transport program starts, transport will begin in 30 seconds.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*You feel that the cell is shaking and seems to be moving.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*You see a row of numbers：" + lockCode + " ，You realize that you have to remember this row of numbers.", Type: "Emote"} );
		if(isSuccess2){
			ServerSend("ChatRoomChat", { Content: "*[Congratulations, this is the true end. It's really despairing to find out after trying hard that it's useless]", Type: "Emote"} );
		}
		else{
			ServerSend("ChatRoomChat", { Content: "*[Try to challenge the true end again]", Type: "Emote"} );
		}


		InventoryGet(sender, "ItemNeckAccessories").Property = {Effect: Array(0), Text: lockCode};
		//刷新角色
		ChatRoomCharacterUpdate(sender);
		setTimeout(function (sender) {
			console.log("end kick");
			ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
			resetRoom()
		}, 30 * 1000, sender);



	}
	else if(isSuccess){
		ServerSend("ChatRoomChat", { Content: "*In a daze, you regained consciousness.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*You hear a prompt sound: Transport program starts, transport will begin in 30 seconds.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*You feel that the cell is shaking and seems to be moving.", Type: "Emote"} );
		ServerSend("ChatRoomChat", { Content: "*You see a row of numbers：" + lockCode + " ，You realize that you have to remember this row of numbers.", Type: "Emote"} );
		if(storyProgress == 3){
			if(isSuccess2){
				ServerSend("ChatRoomChat", { Content: "*[Congratulations, this is the true end. It's really despairing to find out after trying hard that it's useless]", Type: "Emote"} );
			}
			else{
				ServerSend("ChatRoomChat", { Content: "*[Try to challenge the true end again]", Type: "Emote"} );
			}
		}
		else{
			ServerSend("ChatRoomChat", { Content: "*[Well done, you tied yourself tightly by yourself. As a reward, I'll help you skip the original 300 second waiting time]", Type: "Emote"} );

		}
		InventoryGet(sender, "ItemNeckAccessories").Property = {Effect: Array(0), Text: lockCode};
		//刷新角色
		ChatRoomCharacterUpdate(sender);
		setTimeout(function (sender) {
			console.log("end kick");
			ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
			resetRoom()
		}, 30 * 1000, sender);

	}
	else {
		ServerSend("ChatRoomChat", { Content: "*In a daze, you regained consciousness.", Type: "Emote" });
		ServerSend("ChatRoomChat", { Content: "*You hear a prompt sound: Transport program starts, transport will begin in 30 seconds.", Type: "Emote" });
		ServerSend("ChatRoomChat", { Content: "*You feel that the cell is shaking and seems to be moving.", Type: "Emote" });
		ServerSend("ChatRoomChat", { Content: "*You see a row of numbers：" + lockCode + " ，You realize that you have to remember this row of numbers.", Type: "Emote" });
		InventoryGet(sender, "ItemNeckAccessories").Property = {Effect: Array(0), Text: lockCode};
		//刷新角色
		ChatRoomCharacterUpdate(sender);
		setTimeout(function (sender) {
			console.log("end kick");
			ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
			resetRoom()
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

	ServerSend("ChatRoomChat", { Content: "*address: https://github.com/zajucd/BC_BotGame ", Type: "Emote"} );


	// check if all imprisoned people are in room. Sometimes they are not. Don't know why.

	if (isExposed(sender) || sender.IsRestrained() || sender.IsChaste() || sender.IsShackled() || sender.IsBlind() || !sender.CanTalk() || sender.IsEnclose() || sender.IsMounted() || sender.IsEgged() || sender.IsDeaf()) {
		ServerSend("ChatRoomChat", {
			Content: "*[You need to wear clothes and not be bound to play Kick out of the room in twenty seconds If you want to play, take off your equipment and come back again.]",
			Type: "Emote"
		});
		setTimeout(function (sender) {
			console.log("error kick");
			ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
		}, 10 * 1000, sender)
		//imprisonedList.push(sender.MemberNumber)
	} else if (sender.ItemPermission > 2) {
		ServerSend("ChatRoomChat", {
			Content: "*[Need to lower permissions to play Kick out of the room in twenty seconds If you want to play, please modify your permissions before coming back. Set the location in the character file, select the third option, and then select the first option.]",
			Type: "Emote"
		});
		setTimeout(function (sender) {
			ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
		}, 20 * 1000, sender)
		// setTimeout(resetRoom(), 20*1000, sender)

		//imprisonedList.push(sender.MemberNumber)
	} else if (InventoryBlockedOrLimitedCustomized(sender, AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock"))) {
		ServerSend("ChatRoomChat", {
			Content: "**[Require permission to COMBINATION PADLOCK Kick out of the room in twenty seconds If you want to play, please modify your permissions and come back later]",
			Type: "Emote"
		});
		setTimeout(function (sender) {
			console.log("error kick");
			ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
		}, 20 * 1000, sender)
		// setTimeout(resetRoom(), 20*1000, sender)
	} else {
		ServerSend("ChatRoomChat", {
			Content: "*[It is currently unclear how well the current version supports scripts. If possible, please open the public script permission. In Settings ->Scripts].",
			Type: "Emote"
		});
		ServerSend("ChatRoomChat", {
			Content: "*[Please don't remove equip yourself, otherwise you won't know how the bot will explode].",
			Type: "Emote"
		});
		ServerSend("ChatRoomChat", {
			Content: "*You have entered a strange room, and in front of you is a table with a large and red (button), tempting you to press it or you can (explore) the surroundings.[NOTE:send *word to take action（example：*button）.]",
			Type: "Emote"
		});
	}
}
var t1 = 0;
var t2 = 0;
var t3 = 0;
var t4 = 0;
var t5 = 0;

function resetRoom() {
	console.log("reset");
	// check if all imprisoned people are in room. Sometimes they are not. Don't know why.
	stopTimeOut = true;
	storyProgress = 0;
	life = 3;
	restrainCount = 0;
	cardCount = 0;
	struggleCouont = 0;
	buttonCount = 0;
	lockCode = Math.floor(Math.random() * 9000+1000).toString();
	restrainText = ["Two pairs of leg cuffs and a pair of high heels", "A chastity bra, a chastity belt, and a set of straps", "A gag and an eye mask", "Two pairs of arm cuffs and a pair of mittens","A armbinger"];
	boxText = ["1+1=?", "3*2=?", "The 5th decimal place after PI is?","the area of a circle with a radius of 2 is ?PI","lim x→0 sinx/x = ?"];
	boxText2 = ["?times have you passed through the equipment in the box so far", "The number corresponding to the most symbols on the keyboard in the following figure is?","Open Box 9 and wait for 30 seconds"];
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

	clearTimeout(t1);
	clearTimeout(t2);
	clearTimeout(t3);
	clearTimeout(t4);
	clearTimeout(t5);

	// Update room
	var UpdatedRoom = {
		Name: ChatRoomData.Name,
		Description: ChatRoomData.Description,
		Background: "VaultCorridor",
		Limit: (2).toString(),
		Admin: ChatRoomData.Admin,
		Ban: ChatRoomData.Ban,
		Private: ChatRoomData.Private,
		Locked: false,
		Language: ChatRoomData.Language
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
