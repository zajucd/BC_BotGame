// SCRIPTED - Work together to reach the end - TIP: talk to each other! - CODE in BIO.
// -----------------------------------------------------------------------------

activateStoryRoom()

Player.Description = `
BOT game：StrangeRoom
源代码: https://github.com/keykey5/BC-BOT-repository
发布地址: https://github.com/zajucd/BC_BotGame

汉化,修改 by zajucd

需要帮助 = 锁图标

私语 !leave 来紧急脱出
但是你的搭档会被关在小盒里

whisper !leave to escape
but your partner will be capture

普通结局后的对话事件因为技术原因没法直接释放，回大厅找女仆吧

攻略往下翻


























普通结局攻略
1.玩家A装备桌子上的口球与束手器
2.玩家B将装置上的棒棒插入玩家A
3.玩家B操作桌子左边的旋钮至玩家A的棒棒提示达到最大
4.玩家B按下桌子中间的按钮
5.玩家B进入盒子启动笔记本电脑
6.玩家B报出笔记本电脑显示的颜色，玩家A按下对应按钮
7.重复6.五次达成普通结局


本游戏共存在4种结局，请自己探索

真结局的提示只能在戴上贞操带之前触发(大概)
 
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

ChatRoomMessageAdditionDict["StrangeRoom"] = function(SenderCharacter, msg, data) {ChatRoomMessageStrangeRoom(SenderCharacter, msg, data)}
ChatRoomMessageAdditionDict["EnterLeave"] = function(SenderCharacter, msg, data) {ChatRoomMessageEnterLeave(SenderCharacter, msg, data)}

function ChatRoomMessageEnterLeave(SenderCharacter, msg, data) {
    if (SenderCharacter.MemberNumber == Player.MemberNumber) {
        return;
    }
	if ((data.Type == "Action") && (msg.startsWith("ServerEnter"))) {
		setTimeout(enterLeaveEvent,1*1000,SenderCharacter,msg)
	} else if (data.Type != null && SenderCharacter.MemberNumber != Player.MemberNumber) {
		if ((data.Type == "Chat") || (data.Type == "Whisper")) {
			if (msg.includes("!leave")) {
				free(SenderCharacter.MemberNumber, update = false)
				if(SenderCharacter.MemberNumber == charList[0] || SenderCharacter.MemberNumber == charList[1]){
					partnerMemberNumber = SenderCharacter.MemberNumber == charList[0] ? charDict[charList[1]].MemberNumber : charDict[charList[0]].MemberNumber
					InventoryWear(charDict[partnerMemberNumber], "LeatherArmbinder", "ItemArms", "Default",80)
					InventoryWear(charDict[partnerMemberNumber], "SmallWoodenBox","ItemDevices","Default",100)
					InventoryWear(charDict[partnerMemberNumber], "VibratingDildo","ItemVulva","Default")
					InventoryGet(charDict[partnerMemberNumber],"ItemVulva").Property = { Intensity: 3, Effect: ["Vibrating"] }
					InventoryGet(charDict[partnerMemberNumber],"ItemVulva").Asset.Effect = []
					InventoryWear(charDict[partnerMemberNumber], "PolishedChastityBelt", "ItemPelvis","Default",100)
					InventoryGet(charDict[partnerMemberNumber],"ItemPelvis").Property = {Block: [ "ItemButt" ], Restrain: "ClosedBack"}
					InventoryWear(charDict[partnerMemberNumber], "LeatherBlindfold", "ItemHead","Default",100)
					InventoryWear(charDict[partnerMemberNumber], "HarnessBallGag", "ItemMouth","Default",100)
					imprisonedList.push(partnerMemberNumber)
					resetRoom()
				}
				ChatRoomCharacterUpdate(SenderCharacter)
				ChatRoomAdminChatAction("Kick", SenderCharacter.MemberNumber.toString())

			}
		}
	}
}

function ChatRoomMessageStrangeRoom(SenderCharacter, msg, data) {
    if (SenderCharacter.MemberNumber == Player.MemberNumber) {
        return;
    }
  if (storyActive) {
  	if ((data.Type == "Action") && (msg.startsWith("ServerEnter"))) {
		setTimeout(storyStart(SenderCharacter), 300, SenderCharacter)

    } else if ((msg.startsWith("ServerLeave")) || (msg.startsWith("ServerDisconnect")) || (msg.startsWith("ServerBan")) || (msg.startsWith("ServerKick"))) {
      if (imprisonedList.includes(SenderCharacter.MemberNumber)) {
        imprisonedList.splice(imprisonedList.indexOf(SenderCharacter.MemberNumber),1);
      } else if (charList.includes(SenderCharacter.MemberNumber)) {
        if (!imprisonedList.includes(charList[0])) {free(charList[0])}
        if (!imprisonedList.includes(charList[1])) {free(charList[1])}
        ServerSend("ChatRoomChat", { Content: "*[RESET: 有玩家退出房间，游戏已重置]", Type: "Emote"} );
        resetRoom()
      } else {
		  //setTimeout(storyStart(SenderCharacter), 300, SenderCharacter)
      }
    }

    if (data.Type != null) {
      if ((data.Type == "Chat") && storyProgress == 0 && msg.toLowerCase().includes("i need a hint") && charList.includes(SenderCharacter.MemberNumber)) {
        if (SenderCharacter.IsKneeling()) {
          if (InventoryIsWorn(SenderCharacter, "HarnessBallGag", "ItemMouth") && InventoryIsWorn(SenderCharacter, "LeatherArmbinder", "ItemArms")) {
            partnerName = SenderCharacter.MemberNumber == charList[0] ? charDict[charList[1]].Name : charDict[charList[0]].Name
            ServerSend("ChatRoomChat", { Content: "嘿嘿，小菜鸡! 你呢 " + partnerName + "? 你也是吗? [SAY: I need a hint]", Type: "Chat"} );
          } else {
            ServerSend("ChatRoomChat", { Content: "乐了，给你们一点提示: 试着用桌子(desk)上的东西自缚吧。", Type: "Chat"} );
          }
        } else {
          ServerSend("ChatRoomChat", { Content: "好呀, 不过你先得跪下. ", Type: "Chat"} );
        }
      } else if ((data.Type == "Chat") && storyProgress == 10 && SenderCharacter.IsKneeling() && isExposed(SenderCharacter) && charList.includes(SenderCharacter.MemberNumber) && msg.toLowerCase().includes('i am sorry that i was not a true mistress and i deserve this shameful punishment')) {
        ServerSend("ChatRoomChat", { Content: "真是个乖孩子! 小朋友们，要发送密码了哦. ", Type: "Chat"} );
        ServerSend("ChatRoomChat", { Content: "密码: " + lockCode + ".", Type: "Whisper", Target: SenderCharacter.MemberNumber} );
      } else if ((data.Type == "Chat") && SenderCharacter.IsKneeling() && isExposed(SenderCharacter) && charList.includes(SenderCharacter.MemberNumber) && msg.toLowerCase().includes('i wish to replace her to get the punishment')) {
		  ServerSend("ChatRoomChat", { Content: "真是美妙的奉献精神，那就由你来代替她吧. ", Type: "Chat"} );
      	  partnerMemberNumber = SenderCharacter.MemberNumber == charList[0] ? charDict[charList[1]].MemberNumber : charDict[charList[0]].MemberNumber
		  InventoryWear(SenderCharacter, "LeatherArmbinder", "ItemArms", "Default",80)
		  InventoryWear(SenderCharacter, "SmallWoodenBox","ItemDevices","Default",100)
		  InventoryWear(SenderCharacter, "VibratingDildo","ItemVulva","Default")
		  InventoryGet(SenderCharacter,"ItemVulva").Property = { Intensity: 3, Effect: ["Vibrating"] }
		  InventoryGet(SenderCharacter,"ItemVulva").Asset.Effect = []
		  InventoryWear(SenderCharacter, "PolishedChastityBelt", "ItemPelvis","Default",100)
		  InventoryGet(SenderCharacter,"ItemPelvis").Property = {Block: [ "ItemButt" ], Restrain: "ClosedBack"}
		  InventoryWear(SenderCharacter, "LeatherBlindfold", "ItemHead","Default",100)
		  InventoryWear(SenderCharacter, "HarnessBallGag", "ItemMouth","Default",100)
		  imprisonedList.push(SenderCharacter)
		  free(partnerMemberNumber, update = false)
		  InventoryRemove(charDict[partnerMemberNumber],"ItemDevices")
		  InventoryRemove(charDict[partnerMemberNumber],"ItemHead")
		  InventoryRemove(charDict[partnerMemberNumber],"ItemPelvis")
		  InventoryRemove(charDict[partnerMemberNumber], "ItemVulva")
		  InventoryRemove(charDict[partnerMemberNumber],"ItemArms")
		  InventoryRemove(charDict[partnerMemberNumber],"ItemMouth")
		  ChatRoomAdminChatAction("Kick", partnerMemberNumber.toString())
		  resetRoom()




	  } else if ((data.Type == "Emote") || (data.Type == "Action") || (data.Type == "Hidden" && msg.startsWith("ChatRoomBot"))) {
        commandHandler(SenderCharacter,msg)
      } else if ((data.Type == "Whisper") && InventoryIsWorn(SenderCharacter, "HarnessBallGag", "ItemMouth")) {
        if (msg.toLowerCase().includes("save me")) {
          if (storyProgress > 0) {
            ServerSend("ChatRoomChat", { Content: "桀桀桀! 已经晚了，接受命运吧.", Type: "Whisper", Target: SenderCharacter.MemberNumber} );
          } else {
            partnerName = SenderCharacter.MemberNumber == charList[0] ? charDict[charList[1]].Name : charDict[charList[0]].Name
            ServerSend("ChatRoomChat", { Content: "你会得救,但是必须得有一个巫妖王，" + partnerName + " 会代替你接受惩罚. 如果后悔的话就回复no,犹豫太久会被她看出来哦. [whisper: yes or no]", Type: "Whisper", Target: SenderCharacter.MemberNumber} );
            saveSlave = 1
          }
        } else if ((msg.toLowerCase().includes("yes") && saveSlave == 1)) {
          saveSlave = 2
          ServerSend("ChatRoomChat", { Content: "好的，你会在最后得救. 看来 " + partnerName + "没有调教好你.", Type: "Whisper", Target: SenderCharacter.MemberNumber} );
        } else if ((msg.toLowerCase().includes("no") && saveSlave == 1)) {
          saveSlave = 0
          ServerSend("ChatRoomChat", { Content: "看来你已经变成" + partnerName + "的形状了. 玩的开心!", Type: "Whisper", Target: SenderCharacter.MemberNumber} );
        } else if ((msg.toLowerCase().includes("yes") && saveSlave == 3)) {
          saveSlave = 0
          ServerSend("ChatRoomChat", { Content: "你很快就会得救，很快是多久呢？", Type: "Whisper", Target: SenderCharacter.MemberNumber} );
        } else if ((msg.toLowerCase().includes("no") && saveSlave == 3)) {
          saveSlave = 2
          ServerSend("ChatRoomChat", { Content: "真是令人感动的忠诚，你获得了年度奴隶奖的提名（并没有这个奖）", Type: "Whisper", Target: SenderCharacter.MemberNumber} );
        }
      }
    }
  }
}



function storyStart(sender) {

  // check if all imprisoned people are in room. Sometimes they are not. Don't know why.
  tempList = imprisonedList.slice()
  for (ii = 0; ii < tempList.length; ii++) {
    check = false
    for (jj = 0; jj < ChatRoomCharacter.length; jj++) {
      if (tempList[ii] == ChatRoomCharacter[jj].MemberNumber) {
        check = true
      }
    }
    if (!check) {imprisonedList.splice(imprisonedList.indexOf(tempList[ii]),1);}
  }

  if (isExposed(sender) || sender.IsRestrained() || CharacterIsInUnderwear(sender) || sender.IsChaste() || sender.IsShackled() || sender.IsBlind() || !sender.CanTalk() || sender.IsEnclose() || sender.IsMounted() || sender.IsEgged() || sender.IsDeaf()) {
    ServerSend("ChatRoomChat", { Content: "", Type: "Emote", Target: sender.MemberNumber} );
    console.log()
    //imprisonedList.push(sender.MemberNumber)
  } else if (sender.ItemPermission>2) {
    ServerSend("ChatRoomChat", { Content: "*[需要调低 玩家权限 才能游玩. 二十秒后踢出房间. 想玩的话修改权限后再来哦.]", Type: "Emote", Target: sender.MemberNumber} );
    setTimeout(function(sender) {ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())}, 20*1000, sender)
	  // setTimeout(resetRoom(), 20*1000, sender)

    //imprisonedList.push(sender.MemberNumber)
  } else if (InventoryBlockedOrLimitedCustomized(sender, AssetGet("Female3DCG","ItemDevices","SmallWoodenBox")) || InventoryBlockedOrLimitedCustomized(sender,AssetGet("Female3DCG","ItemPelvis", "PolishedChastityBelt"))) {
    ServerSend("ChatRoomChat", { Content: "**[需要 小木盒子（SMALL WOODEN BOX）、 抛光贞操带（POLISHED CHASTITY BELT）的权限. 二十秒后踢出房间. 想玩的话修改权限后再来哦.]", Type: "Emote", Target: sender.MemberNumber} );
    setTimeout(function(sender) {ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())}, 20*1000, sender)
	  // setTimeout(resetRoom(), 20*1000, sender)
  } else if (InventoryBlockedOrLimitedCustomized(sender, AssetGet("Female3DCG","ItemMisc","CombinationPadlock")))  {
    ServerSend("ChatRoomChat", { Content: "**[需要 组合密码锁（COMBINATION PADLOCK）的权限. 二十秒后踢出房间. 想玩的话修改权限后再来哦.]", Type: "Emote", Target: sender.MemberNumber} );
    setTimeout(function(sender) {ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())}, 20*1000, sender)
	  // setTimeout(resetRoom(), 20*1000, sender)
  } else {
    ServerSend("ChatRoomChat", { Content: "*进入房间后你一直感受到视线. 你环顾四周但是找不到视线来源.", Type: "Emote", Target: sender.MemberNumber} );
  }
  if (ChatRoomCharacter.length - 1 - imprisonedList.length != 2) {
    ServerSend("ChatRoomChat", { Content: "*除了感受到视线，什么也没有发生. 目前而言.", Type: "Emote"} );
  } else if (ChatRoomCharacter.length - 1 - imprisonedList.length == 2) {
    closeRoomStory()
    ServerSend("ChatRoomChat", { Content: "*门突然关上了. 你们被锁在里面了.", Type: "Emote"} );
    ServerSend("ChatRoomChat", { Content: "*现在你们只能 探索(explore) 这个房间. [NOTE:通过发送 *单词 来行动（例：*explore）. 或者对bot私语 !leave 来紧急脱出,现在紧急脱出会把队友装箱]", Type: "Emote"} );
    ServerSend("ChatRoomChat", { Content: "如果卡关了可以随时放弃. 发送 'I need a hint'. 玩的开心!", Type: "Chat"} );
    for (ii = 0; ii < ChatRoomCharacter.length; ii++) {
      if (ChatRoomCharacter[ii].MemberNumber != Player.MemberNumber && !imprisonedList.includes(ChatRoomCharacter[ii].MemberNumber)) {
        charList.push(ChatRoomCharacter[ii].MemberNumber)
        charDict[ChatRoomCharacter[ii].MemberNumber] = ChatRoomCharacter[ii]
        charPos[ChatRoomCharacter[ii].MemberNumber] = "room1"
        mirrorInspectDict[ChatRoomCharacter[ii].MemberNumber] = 4
      }
    }
  }
}


function canMove(sender, msg) {

  // return true when player can move
  if (sender.IsKneeling() && !msg.toLowerCase().includes("crawl")) {
    ServerSend("ChatRoomChat", { Content: "*私人: 跪下了可没法走路, 你现在得 爬到(crawl to) 或 爬出(crawl back).", Type: "Emote", Target: sender.MemberNumber} )
    return false
  } else if (!sender.CanWalk() && !msg.toLowerCase().includes("hop")) {
    ServerSend("ChatRoomChat", { Content: "*私人: 腿被绑住可没法走路, 你现在得 跳到(hop to) 或 跳出(hop back).", Type: "Emote", Target: sender.MemberNumber} )
    return false
  }
  return true

}


function commandHandler(sender, msg) {

  if (!charList.includes(sender.MemberNumber)) { return }
  partnerMemberNumber = sender.MemberNumber == charList[0] ? charDict[charList[1]].MemberNumber : charDict[charList[0]].MemberNumber

  if (msg.toLowerCase().includes("i need a hint")) {
    ServerSend("ChatRoomChat", { Content: "*私人: 听不见，这么小声也想放弃，给我打在公屏上.", Type: "Emote", Target: sender.MemberNumber} );
    return
  }

  switch (charPos[sender.MemberNumber]) {

    case "room1":
      if (msg.toLowerCase().includes("explore")) {
        ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 探索房间.", Type: "Emote"} );
        backToRoom1(sender, msg)
      } else if (msg.toLowerCase().includes("desk")) {
        if (!canMove(sender,msg)) { return }
        charPos[sender.MemberNumber] = "desk"
        ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 移动到桌子边.", Type: "Emote"} );
        gagNum = 2
        armbinderNum = 2
        if (InventoryIsWorn(sender, "HarnessBallGag", "ItemMouth")) { gagNum = gagNum - 1 }
        if (InventoryIsWorn(charDict[partnerMemberNumber], "HarnessBallGag", "ItemMouth")) { gagNum = gagNum - 1 }
        if (InventoryIsWorn(sender, "LeatherArmbinder", "ItemArms")) { armbinderNum = armbinderNum - 1 }
        if (InventoryIsWorn(charDict[partnerMemberNumber], "LeatherArmbinder", "ItemArms")) { armbinderNum = armbinderNum - 1 }
        outMsg = "*私人: 你看见"
        if (gagNum || armbinderNum) {
          outMsg = outMsg + ((armbinderNum == 2) ? " 两个束手器" : ((armbinderNum == 1) ? " 一个束手器" : "")) + ((gagNum && armbinderNum) ? " 和" : "") + ((gagNum == 2) ? " 两个口球" : ((gagNum == 1) ? " 一个口球" : "")) + "."
          outMsg = outMsg + " 还有"
        }
        outMsg = outMsg + " 三个抽屉. 你可以调查 左边的(left), 中间的(middle) 或 右边的(right)."
        if (gagNum || armbinderNum) {
          outMsg = outMsg + " 你还可以" + ((armbinderNum) ? " 穿上束手器(wear the armbinder)" : "") + ((gagNum && armbinderNum) ? " 和" : "") + ((gagNum) ? " 戴上口球(wear the gag)" : "") + "."
        }
        outMsg = outMsg + " 或者 返回(back)."
        ServerSend("ChatRoomChat", { Content: outMsg, Type: "Emote", Target: sender.MemberNumber} );
      } else if (msg.toLowerCase().includes("mirror")) {
        if (!canMove(sender,msg)) { return }
        charPos[sender.MemberNumber] = "mirror"
        ServerSend("ChatRoomChat", { Content: "*私人: 这是个又高又大的全身镜. 说不定有什么秘密? 你可以 检查(inspect) 它, 看看(look) 自己 或者 返回(back).", Type: "Emote", Target: sender.MemberNumber} );
      } else if (msg.toLowerCase().includes("plaque")) {
        if (!canMove(sender,msg)) { return }
        ServerSend("ChatRoomChat", { Content: "*私人: 这块青铜牌匾上写着: 一人调教，一人服从. 上面还画着一些拘束具的图案.", Type: "Emote", Target: sender.MemberNumber} );
      } else if (msg.toLowerCase().includes("wooden box") && storyProgress == 50) {
        if (!canMove(sender,msg)) { return }
        charPos[sender.MemberNumber] = "wooden boxes 2"
        ServerSend("ChatRoomChat", { Content: "*私人: 有几个木盒打开了. 里面是空的... 你很容易就能进去. 你可以 走进去(step inside) 或者 返回(back).", Type: "Emote", Target: sender.MemberNumber} );
      } else if (msg.toLowerCase().includes("wooden box")) {
        if (!canMove(sender,msg)) { return }
        charPos[sender.MemberNumber] = "wooden boxes"
        ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 移动到木盒边.", Type: "Emote"} );
        if (woodenBoxOpen) {
          ServerSend("ChatRoomChat", { Content: "*私人: 木盒的长宽高大约都是一米. 跪下来的话很容易就能进去. 有个盒子打开了，你看见有个笔记本电脑在里面. 你可以 走进去(step inside) 或者 返回(back).", Type: "Emote", Target: sender.MemberNumber} );
        } else {
          ServerSend("ChatRoomChat", { Content: "*私人: 木盒的长宽高大约都是一米. 跪下来的话很容易就能进去. 盒子都关着. 你可以 打开(open) 或者 返回(back).", Type: "Emote", Target: sender.MemberNumber} );
        }
      } else if ((msg.toLowerCase().includes("device") && deviceAvailable)) {
        if (!canMove(sender,msg)) { return }
        charPos[sender.MemberNumber] = "device"
        partnerName = sender.MemberNumber == charList[0] ? charDict[charList[1]].Name : charDict[charList[0]].Name
        if (dildoInside == 0) {
          ServerSend("ChatRoomChat", { Content: "*私人: 你看见三个颜色不同的按钮: 你可以 按红按钮(press the red button), 按蓝按钮(press the blue button) or 按绿按钮(press the green button). 还有个又粗又大的震动棒，被一根链子拴住了所以带不走. 你可以 把棒棒插进自己(use the dildo on myself) 或 把棒棒插进队友(use the dildo on " + partnerName + ").", Type: "Emote", Target: sender.MemberNumber} );
        } else if (InventoryIsWorn(charDict[dildoInside],"PolishedChastityBelt","ItemPelvis")) {
          ServerSend("ChatRoomChat", { Content: "*私人: 你看见三个颜色不同的按钮: 你可以 按红按钮(press the red button), 按蓝按钮(press the blue button) or 按绿按钮(press the green button).棒棒插进了" + charDict[dildoInside].Name + " 里面. 棒棒被链子拴住了, 所以她没法四处走动.", Type: "Emote", Target: sender.MemberNumber} );
        } else {
          ServerSend("ChatRoomChat", { Content: "*私人: 你看见三个颜色不同的按钮: 你可以 按红按钮(press the red button), 按蓝按钮(press the blue button) or 按绿按钮(press the green button).", Type: "Emote", Target: sender.MemberNumber} );
        }
      } else if (msg.toLowerCase().includes("door") && (storyProgress == 10 || storyProgress == 20)) {
        if (!canMove(sender,msg)) {
          ServerSend("ChatRoomChat", { Content: "*你走不掉.", Type: "Emote", Target: sender.MemberNumber} );
          return
         }
        partnerName = sender.MemberNumber == charList[0] ? charDict[charList[1]].Name : charDict[charList[0]].Name
        ServerSend("ChatRoomChat", { Content: "*门现在开了. 你可以再待一会. 你可以 离开(leave) 然后把 " + partnerName + " 抛弃在这里. [会离开房间]", Type: "Emote", Target: sender.MemberNumber} );
      } else if (msg.toLowerCase().includes("door") && storyProgress == 30) {
        if (!canMove(sender,msg)) {
          ServerSend("ChatRoomChat", { Content: "*你走不掉.", Type: "Emote", Target: sender.MemberNumber} );
          return
         }
        if (imprisonedList.includes(sender.MemberNumber)) {
          imprisonedList.splice(imprisonedList.indexOf(sender.MemberNumber),1)
        } else if (imprisonedList.includes(charDict[partnerMemberNumber].MemberNumber) && !InventoryIsWorn(charDict[partnerMemberNumber].MemberNumber, "SmallWoodenBox", "ItemDevices")) {
          imprisonedList.splice(imprisonedList.indexOf(partnerMemberNumber),1)
        }
        if (imprisonedList.includes(charDict[partnerMemberNumber].MemberNumber)) {
          ServerSend("ChatRoomChat", { Content: "*门现在开了.但是 " + charDit[partnerMemberNumber].Name + " 还在盒子里, 要把她抛弃在这里吗? 你可以 离开(leave) 然后把 " + partnerName + " 抛弃在这里. [会离开房间]", Type: "Emote", Target: sender.MemberNumber} );
        } else {
          ServerSend("ChatRoomChat", { Content: "*门现在开了. 你们可以一起 离开(leave) 然后去其他地方玩♂耍. [会离开房间]", Type: "Emote", Target: sender.MemberNumber} );
        }
      } else if (msg.toLowerCase().includes("leave") && (storyProgress == 10 || storyProgress == 20 || storyProgress == 30) && !imprisonedList.includes(sender.MemberNumber)) {
        ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
        if (imprisonedList.includes(partnerMemberNumber)) {
          ServerSend("ChatRoomChat", { Content: "*" + charDict[partnerMemberNumber].Name + " 关上了门然后把你丢在这里, 你再也出不去了.", Type: "Emote"} );
        } else {
          ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 离开了房间.", Type: "Emote"} );
        }
        if (ChatRoomCharacter.length == imprisonedList.length + 1) {
          resetRoom()
        }
      }

      break;


    case "inside box":
        if (msg.toLowerCase().includes("crawl outside")) {
          charPos[sender.MemberNumber] = "wooden boxes"
          InventoryRemove(sender,"ItemDevices")
          ChatRoomCharacterUpdate(sender)
          if (tabletActive) {
            tabletActive = false
            ServerSend("ChatRoomChat", { Content: "*私人: 你爬出去后发现笔记本电脑关上了. 你可以再次 走进去(step inside) 或 爬进去(crawl inside) 或者 返回(back).", Type: "Emote", Target: sender.MemberNumber} );
          } else {
            ServerSend("ChatRoomChat", { Content: "*私人: 你爬了出去. 你可以再次 走进去(step inside) 或 爬进去(crawl inside) 或者 返回(back).", Type: "Emote", Target: sender.MemberNumber} );
          }
        } else if (msg.toLowerCase().includes("tablet")) {
          if (!sender.CanInteract()) {
            ServerSend("ChatRoomChat", { Content: "*笔记本电脑没有开机. 因为手被绑着, " + sender.Name + " 试着用嘴打开电脑, 但是糊了一电脑口水都没按到电源键.", Type: "Emote"} )
          } else if (dildoIntensity != 3) {
            ServerSend("ChatRoomChat", { Content: "*私人: 笔记本电脑未连接电源.", Type: "Emote", Target: sender.MemberNumber} )
          } else {
            ServerSend("ChatRoomChat", { Content: "*滴!", Type: "Emote", Target: sender.MemberNumber} );
            tabletActive = true
            setTimeout(function() {
              nextColor = correctCode[0] == 0 ? "red" : (correctCode[0] == 1 ? "blue" : "green")
              ServerSend("ChatRoomChat", { Content: "*私人: 电脑打开了然后显示了文字: '输入五个颜色'. 当前颜色为 " + nextColor + ".  -等待输入-", Type: "Emote", Target: sender.MemberNumber} );
            },2*1000)
          }
        } else if (msg.toLowerCase().includes("look around")) {
          ServerSend("ChatRoomChat", { Content: "*私人: 你看看四周. 没什么值得注意. 四周的木板把你困在了狭小的空间内. 你幽闭恐惧症有点发症了, 盖子还开着. 但说不定什么时候就关上了... ", Type: "Emote", Target: sender.MemberNumber} );
        }
      break;


    case "wooden boxes":
      if (msg.toLowerCase().includes("back") || msg.toLowerCase().includes("explore")) {
        backToRoom1(sender, msg)
      } else if (woodenBoxOpen && (msg.toLowerCase().includes("step inside"))) {
        if (sender.IsKneeling()) {
          ServerSend("ChatRoomChat", { Content: "*私人: 你得 爬进去(crawl inside).", Type: "Emote", Target: sender.MemberNumber} );
        } else {
          ServerSend("ChatRoomChat", { Content: "*私人: 盒子太小了. 你得跪下然后 爬进去(crawl inside).", Type: "Emote", Target: sender.MemberNumber} );
        }
      } else if (woodenBoxOpen && sender.IsKneeling() && (msg.toLowerCase().includes("crawl inside"))) {
        charPos[sender.MemberNumber] = "inside box";
        ServerSend("ChatRoomChat", { Content: "*私人: 你颤抖着爬了进去. 面前有个没有开机的笔记本电脑你也不知道怎么打开它. 你可以 爬出去(crawl outside), 使用 电脑(tablet) 或 环顾四周(look around).", Type: "Emote", Target: sender.MemberNumber} );
        InventoryWear(sender, "SmallWoodenBox","ItemDevices","Default",100)
        InventoryLock(sender, InventoryGet(sender, "ItemDevices"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber)
        InventoryGet(sender, "ItemDevices").Property.CombinationNumber = lockCode
        ChatRoomCharacterUpdate(sender)
      } else if (!woodenBoxOpen && (msg.toLowerCase().includes("open"))) {
        if (!sender.CanInteract()) {
          ServerSend("ChatRoomChat", { Content: "*私人: 你的手被绑着所以只能用身体顶. 笑死，压根打不开.", Type: "Emote", Target: sender.MemberNumber} );
        } else {
          ServerSend("ChatRoomChat", { Content: "*私人: 你拼尽全力尝试打开盖子, 但是盖子比你有劲. 笑死，压根打不开.", Type: "Emote", Target: sender.MemberNumber} );
        }
        setTimeout(function(sender) {
          ServerSend("ChatRoomChat", { Content: "*啊♂", Type: "Emote", Target: sender.MemberNumber} );
        }, 3*1000, sender)
      } else if (msg.toLowerCase().includes("desk") || msg.toLowerCase().includes("mirror") || msg.toLowerCase().includes("device") || msg.toLowerCase().includes("wooden box")) {
        ServerSend("ChatRoomChat", { Content: "*私人: 在这之前你先得 返回(back).", Type: "Emote", Target: sender.MemberNumber} );
      }
      break;

    case "wooden boxes 2":
      if (msg.toLowerCase().includes("back") || msg.toLowerCase().includes("explore")) {
        backToRoom1(sender, msg)
      } else if (msg.toLowerCase().includes("step inside")) {
        if (sender.IsKneeling()) {
          ServerSend("ChatRoomChat", { Content: "*私人: 你得 爬进去(crawl inside).", Type: "Emote", Target: sender.MemberNumber} );
        } else {
          ServerSend("ChatRoomChat", { Content: "*私人: 盒子太小了. 你得跪下然后 爬进去(crawl inside).", Type: "Emote", Target: sender.MemberNumber} );
        }
      } else if (sender.IsKneeling() && (msg.toLowerCase().includes("crawl inside"))) {
        charPos[sender.MemberNumber] = "imprisoned"
        ServerSend("ChatRoomChat", { Content: "*私人: 你最后只能接受你的命运. 你爬进盒子然后盖子自己盖上了. 听见上锁的声音后你知道你再也出不去了.", Type: "Emote", Target: sender.MemberNumber} );
        InventoryWear(sender, "SmallWoodenBox","ItemDevices","Default",100)
        InventoryLock(sender, InventoryGet(sender, "ItemDevices"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber)
        InventoryGet(sender, "ItemDevices").Property.CombinationNumber = lockCode
        ChatRoomCharacterUpdate(sender)
        if (charPos[partnerMemberNumber] == "imprisoned") {
          if (!imprisonedList.includes(charList[0])) imprisonedList.push(charList[0])
          if (!imprisonedList.includes(charList[1])) imprisonedList.push(charList[1])
          console.log("Ending - 'Will of Submission' for " + sender.Name + " (" + sender.MemberNumber + ") & " + charDict[partnerMemberNumber].Name + " (" + partnerMemberNumber + ").")
          setTimeout(function () {
            ServerSend("ChatRoomChat", { Content: "*看来你们两个都是抖M: 这个小盒才是你们永远的家.", Type: "Emote"} );
            ServerSend("ChatRoomChat", { Content: "结局 - '两个抖M走进盒' for " + sender.Name + " (" + sender.MemberNumber + ") & " + charDict[partnerMemberNumber].Name + " (" + partnerMemberNumber + ").", Type: "Chat"} );
            setTimeout(resetRoom, 10*1000);
          }, 5*1000)
        }
      }
      break;

    case "right_drawer_open":
      if (msg.toLowerCase().includes("turn")) {
        if (!sender.CanInteract()) {
          ServerSend("ChatRoomChat", { Content: "*私人: 你手被绑住了，没法这么做.", Type: "Emote", Target: sender.MemberNumber} );
          return
        } else {
          ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 将电源控制调了一档.", Type: "Emote"} );
        }

        if (dildoInside) {
          dildoIntensity = dildoIntensity + 1

          partnerName = sender.MemberNumber == charList[0] ? charDict[charList[1]].Name : charDict[charList[0]].Name
          dildoAsset = InventoryGet(charDict[partnerMemberNumber], "ItemVulva")

          if (dildoAsset == null || dildoAsset.Asset.Name != "VibratingDildo") {
            console.log('Error?')
          }

          switch (dildoIntensity) {

            case 0:
              ServerSend("ChatRoomChat", { Content: "*你体内的棒棒开始轻轻震动.", Type: "Emote", Target: partnerMemberNumber} );
              dildoAsset.Property.Intensity = dildoIntensity
              dildoAsset.Property.Effect = ["Vibrating"]
              CharacterLoadEffect(partnerAsset)
              ChatRoomCharacterUpdate(partnerAsset)
              break;

            case 1:
              ServerSend("ChatRoomChat", { Content: "*你体内的棒棒开始稍快震动.", Type: "Emote", Target: partnerMemberNumber} );
              dildoAsset.Property.Intensity = dildoIntensity
              dildoAsset.Property.Effect = ["Vibrating"]
              CharacterLoadEffect(partnerAsset)
              ChatRoomCharacterUpdate(partnerAsset)
              break;

            case 2:
              ServerSend("ChatRoomChat", { Content: "*你体内的棒棒开始猛烈震动.", Type: "Emote", Target: partnerMemberNumber} );
              dildoAsset.Property.Intensity = dildoIntensity
              dildoAsset.Property.Effect = ["Vibrating"]
              CharacterLoadEffect(partnerAsset)
              ChatRoomCharacterUpdate(partnerAsset)
              break;

            case 3:
              ServerSend("ChatRoomChat", { Content: "*你体内的棒棒开始以 ！最大！速度 震动.", Type: "Emote", Target: partnerMemberNumber} );
              dildoAsset.Property.Intensity = dildoIntensity
              dildoAsset.Property.Effect = ["Vibrating"]
              CharacterLoadEffect(partnerAsset)
              ChatRoomCharacterUpdate(partnerAsset)
              // if (!woodenBoxOpen) { setTimeout(openWoodenBox, 5*1000) }
              break;

            case 4:
              woodenBoxCloseMessage = ""
              // if (woodenBoxOpen) {
              //   woodenBoxCloseMessage =  " and the wooden box immediately closes";
              //   woodenBoxOpen = false
              // }
              ServerSend("ChatRoomChat", { Content: "*你体内的棒棒停了下来" + woodenBoxCloseMessage + ".", Type: "Emote", Target: partnerMemberNumber} );
              dildoIntensity = -1
              dildoAsset.Property.Intensity = dildoIntensity
              dildoAsset.Property.Effect = []
              dildoAsset.Asset.Effect = []
              CharacterLoadEffect(partnerAsset)
              ChatRoomCharacterUpdate(partnerAsset)
              break;

          }
        } else if (deviceAvailable) {
          ServerSend("ChatRoomChat", { Content: "*墙边的棒棒发出了一些声音.", Type: "Emote"} );
        }

        if (sender.CanInteract() && (!deviceAvailable || dildoInside)) {
          ServerSend("ChatRoomChat", { Content: "*私人: ...有发生什么吗?", Type: "Emote", Target: sender.MemberNumber} );
        }

      }
      // No "Break" so it can check also the options below.

      // TODO:
    case "middle_drawer_open":
      // if (msg.toLowerCase().includes("wear") && msg.toLowerCase().includes("dildo chastity belt")) {
      //   InventoryWear(sender, "VibratingDildo","ItemVulva","Default")
      //   InventoryGet(sender,"ItemVulva").Property = { Intensity: -1, Effect: [] }
      //   InventoryGet(sender,"ItemVulva").Asset.Effect = []
      //   InventoryWear(sender, "PolishedChastityBelt", "ItemPelvis","Default",100)
      //   InventoryGet(sender,"ItemPelvis").Property = {Restrain: null}
      //   InventoryLock(sender, InventoryGet(sender, "ItemPelvis"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber)
      //   InventoryGet(sender, "ItemPelvis").Property.CombinationNumber = lockCode
      //   ChatRoomCharacterUpdate(sender)
      //   ServerSend("ChatRoomChat", { Content: sender.Name + " inserts the dildo inside her pussy. Locks immediately block the item on her.", Type: "Emote", } );
      //}

      if (msg.toLowerCase().includes("button")) {
        if (dildoIntensity == 3 && charPos[sender.MemberNumber] == "middle_drawer_open") {
          if (woodenBoxOpen) {
            ServerSend("ChatRoomChat", { Content: "*私人: 你按下按钮但是什么都没有发生. 木盒子已经打开了.", Type: "Emote", Target: sender.MemberNumber} )
          } else {
            openWoodenBox()
          }
        } else {
          ServerSend("ChatRoomChat", { Content: "*私人: 你按下按钮但是什么都没有发生. 电力不足.", Type: "Emote", Target: sender.MemberNumber} )
        }
      }


    case "desk":
      if (msg.toLowerCase().includes("back") || msg.toLowerCase().includes("explore")) {
        backToRoom1(sender, msg)
      } else if (msg.toLowerCase().includes("left")) {
        ServerSend("ChatRoomChat", { Content: "*私人: 你在抽屉里发现一张照片. 上面是一个女王和她的奴隶. 她穿着[女王套装]拿着[鞭子]正在调教她的小奴隶. ", Type: "Emote", Target: sender.MemberNumber} );
      } else if (msg.toLowerCase().includes("middle")) {
        ServerSend("ChatRoomChat", { Content: "*私人: 里面有一个 按钮(button) .", Type: "Emote", Target: sender.MemberNumber} );
        // ServerSend("ChatRoomChat", { Content: "*Private: In the drawer you find a chastity belt with a dildo attached to it. You can (wear the dildo chastity belt), but you know that it won't come of that easily.", Type: "Emote", Target: sender.MemberNumber} );
        charPos[sender.MemberNumber] = "middle_drawer_open"
      } else if (msg.toLowerCase().includes("right")) {
        charPos[sender.MemberNumber] = "right_drawer_open"
        ServerSend("ChatRoomChat", { Content: "*私人: 你打开了右边的抽屉. 里面有一套电子装置，上面有一个旋钮可以 拧(turn). 装置钉在了抽屉里所以无法拿走. 版面上写着: 电源控制, 调至！最大！.", Type: "Emote", Target: sender.MemberNumber} );
      } else if (msg.toLowerCase().includes("wear") && msg.toLowerCase().includes("armbinder")) {
        if (!sender.CanInteract()) {
          ServerSend("ChatRoomChat", { Content: "*私人: 你手被绑住了，没法这么做.", Type: "Emote", Target: sender.MemberNumber} );
        } else {
          ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 用束手器把自己绑了起来.", Type: "Emote"} );
          InventoryWear(sender, "LeatherArmbinder", "ItemArms", "Default",80)
          ChatRoomCharacterUpdate(sender)
          story1(sender)
        }
      } else if (msg.toLowerCase().includes("wear") && msg.toLowerCase().includes("gag")) {
        //if (!sender.CanInteract()) {
        //  ServerSend("ChatRoomChat", { Content: "*Private: You cannot do that, your arms restrained.", Type: "Emote", Target: sender.MemberNumber} );
        if (InventoryIsWorn(sender, "HarnessBallGag", "ItemMouth")) {
          ServerSend("ChatRoomChat", { Content: "*私人: 你的嘴里已经有一个口球了.", Type: "Emote", Target: sender.MemberNumber} );
        } else {
          ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 给自己戴上了口球.", Type: "Emote"} );
          InventoryWear(sender, "HarnessBallGag","ItemMouth","Default",80)
          ChatRoomCharacterUpdate(sender)
          story1(sender)
        }
      } else if (msg.toLowerCase().includes("desk") || msg.toLowerCase().includes("mirror") || msg.toLowerCase().includes("device") || msg.toLowerCase().includes("wooden box")) {
        ServerSend("ChatRoomChat", { Content: "*私人: 在这之前你先得 返回(back).", Type: "Emote", Target: sender.MemberNumber} );
      }
      break;

    case "mirror":

      if (msg.toLowerCase().includes("back") || msg.toLowerCase().includes("explore")) {
        backToRoom1(sender, msg)

      } else if (msg.toLowerCase().includes("look")) {

        partnerMemberNumber = sender.MemberNumber == charList[0] ? charDict[charList[1]].MemberNumber : charDict[charList[0]].MemberNumber
        partnerName = sender.MemberNumber == charList[0] ? charDict[charList[1]].Name : charDict[charList[0]].Name

        if (InventoryIsWorn(sender, "HarnessBallGag", "ItemMouth")) {
          // Slave
          // lookLikeSlave = [ isExposed(sender) + sender.IsKneeling() + InventoryIsWorn(sender, "HarnessBallGag", "ItemMouth") + InventoryIsWorn(sender, "LeatherArmbinder", "ItemArms") ]
          if (isExposed(sender,["PolishedChastityBelt"]) && InventoryIsWorn(sender, "HarnessBallGag", "ItemMouth") && InventoryIsWorn(sender, "LeatherArmbinder", "ItemArms")) {
            if (sender.IsKneeling() && charPos[partnerMemberNumber] == 'mirror' && dressLikeMistress(partnerMemberNumber) && InventoryIsWorn(charDict[partnerMemberNumber],"SpankingToys","ItemHands")) {
              ServerSend("ChatRoomChat", { Content: "*私人: 你看见你自己被束缚的裸体, 跪在你的女王前. 你觉得羞耻但是自豪.", Type: "Emote", Target: sender.MemberNumber} );
              ServerSend("ChatRoomChat", { Content: "*秘密: 镜子上显示一行文字: '你们之中有一个人会失去自由. 如果你对 " + Player.Name + "私语发送 (save me), 你会在结束后得到自由, 但是你的女王会失去她的地位. 这由你自己决定'.", Type: "Emote", Target: sender.MemberNumber} );
              return // skip the part below about the partner being near you and the part about kneeling
            } else {
              ServerSend("ChatRoomChat", { Content: "*私人: 你看着镜中的倒影. 你没有自由，衣不蔽体, 多么棒的仆人.", Type: "Emote", Target: sender.MemberNumber} );
            }
            ServerSend("ChatRoomChat", { Content: "*秘密: 镜子上显示一行文字: '你们之中有一个人会失去自由. 如果你对 " + Player.Name + "私语发送 (save me), 你会在结束后得到自由, 但是你的女王会失去她的地位. 这由你自己决定'..", Type: "Emote", Target: sender.MemberNumber} );
          } else if (isExposed(sender,["PolishedChastityBelt"])) {
            ServerSend("ChatRoomChat", { Content: "*私人: 你看着自己的裸体，感到十分弱小，没有力量.", Type: "Emote", Target: sender.MemberNumber} );
          } else if (sender.IsRestrained()) {
            ServerSend("ChatRoomChat", { Content: "*私人: 你看着被束缚的自己，感到感到十分弱小，没有力量. 实际上确实没有力量.", Type: "Emote", Target: sender.MemberNumber} );
          } else {
            ServerSend("ChatRoomChat", { Content: "*私人: 你看着镜中的倒影: 怎么会有这么可爱的孩子.", Type: "Emote", Target: sender.MemberNumber} );
          }

          if (ReputationCharacterGet(sender,"Dominant")<=-50) {
            if (sender.IsKneeling()) {
              ServerSend("ChatRoomChat", { Content: "*私人: 你看着自己跪在镜子前的样子. 像是一个服从者的样子.", Type: "Emote", Target: sender.MemberNumber} );
            } else { // something about crawling around
              ServerSend("ChatRoomChat", { Content: "*私人: 你看着镜中的自己，你在想'姐就是女王，自信放光芒'.", Type: "Emote", Target: sender.MemberNumber} );
            }

          }

        } else {

          // Mistress
          // lookLikeSlave = [ isExposed(sender.) + sender.IsKneeling() + InventoryIsWorn(sender, "HarnessBallGag", "ItemMouth") + InventoryIsWorn(sender, "LeatherArmbinder", "ItemArms") ]
          if (!dressLikeMistress(sender.MemberNumber) && !InventoryIsWorn(sender,"SpankingToys","ItemHands")) {
            ServerSend("ChatRoomChat", { Content: "*私人: 你看着镜中的倒影: 怎么会有这么可爱的孩子.", Type: "Emote", Target: sender.MemberNumber} );
          } else if (dressLikeMistress(sender.MemberNumber) && !InventoryIsWorn(sender,"SpankingToys","ItemHands")) {
            ServerSend("ChatRoomChat", { Content: "*私人: 你看着你的着装, 如女王般性感. 但是少了什么东西, 让你觉得你没那么有力.", Type: "Emote", Target: sender.MemberNumber} );
          } else if (!dressLikeMistress(sender.MemberNumber) && InventoryIsWorn(sender,"SpankingToys","ItemHands")) {
            ServerSend("ChatRoomChat", { Content: "*私人: 你看着你手中的鞭子. 十分有力, 但是衣着并没有那么性感?", Type: "Emote", Target: sender.MemberNumber} );
          } else if (dressLikeMistress(sender.MemberNumber) && InventoryIsWorn(sender,"SpankingToys","ItemHands") && (charPos[partnerMemberNumber] != "mirror")) {
            ServerSend("ChatRoomChat", { Content: "*私人: 你得着装和鞭子让你性感而有力. 但是少了什么人在身边。", Type: "Emote", Target: sender.MemberNumber} );
          } else if (dressLikeMistress(sender.MemberNumber) && InventoryIsWorn(sender,"SpankingToys","ItemHands") && (charPos[partnerMemberNumber] == "mirror") && !lookLikeSlave(partnerMemberNumber)) {
            ServerSend("ChatRoomChat", { Content: "*私人: 你得着装和鞭子让你性感而有力. 。" + charDict[partnerMemberNumber].Name + " 在你身边, 但她缺了点什么.", Type: "Emote", Target: sender.MemberNumber} );
            return // skip the part below about the partner being near you
          } else {
            ServerSend("ChatRoomChat", { Content: "*私人: 你现在像一个真正的女王, 性感的服装，有力的鞭子，还有一个小奴隶在身边", Type: "Emote", Target: sender.MemberNumber} );
            ServerSend("ChatRoomChat", { Content: "*秘密: 镜子上显示一行文字: '只有真正的女王才能看到这个提示: 如果被需要说出颜色, 调换蓝色与绿色. 以及对你的奴隶上点心: 她可能有个下克上的办法!'.", Type: "Emote", Target: sender.MemberNumber} );
            return // skip the part below about the partner being near you
          }
        }

        if (charPos[partnerMemberNumber] == "mirror") {
          ServerSend("ChatRoomChat", { Content: "*私人: " + partnerName + " 正在你的身边.", Type: "Emote", Target: sender.MemberNumber} );
        }

      } else if (msg.toLowerCase().includes("inspect")) {
        //ServerSend("ChatRoomChat", { Content: "*Private: There are two small plaque. One is too ruined to decipher.", Type: "Emote", Target: sender.MemberNumber} );
        ServerSend("ChatRoomChat", { Content: "*私人: 有两个牌匾. 一个写着: '女王: 性感, 有力 且被服侍. 此乃真女王'.", Type: "Emote", Target: sender.MemberNumber} );
        if (mirrorInspectDict[sender.MemberNumber] == 0) {
          ServerSend("ChatRoomChat", { Content: "*私人: 另一个写着: '...li 赞美你的谎言'. 这个牌匾很脏.", Type: "Emote", Target: sender.MemberNumber} );
        } else if (mirrorInspectDict[sender.MemberNumber] == 1) {
          ServerSend("ChatRoomChat", { Content: "*私人: 另一个写着: '...li 赞美你的谎言'. 这些污渍... ?.", Type: "Emote", Target: sender.MemberNumber} );
        } else if (mirrorInspectDict[sender.MemberNumber] == 2) {
          ServerSend("ChatRoomChat", { Content: "*私人: 另一个写着: '...li 赞美你的谎言'. 看起来...", Type: "Emote", Target: sender.MemberNumber} );
        } else if (mirrorInspectDict[sender.MemberNumber] == 3) {
          ServerSend("ChatRoomChat", { Content: "*私人: 另一个写着: '...li 赞美你的谎言'. 这下面写着什么. 很难发现. '但你将赤身裸体地被束缚于被真实之前'.", Type: "Emote", Target: sender.MemberNumber} );
        } else {
          ServerSend("ChatRoomChat", { Content: "*私人: 另一个写着: '奴隶: 赞美你的谎言, 但你将赤身裸体地被束缚于被真实之前'.", Type: "Emote", Target: sender.MemberNumber} );
        }
        mirrorInspectDict[sender.MemberNumber] = mirrorInspectDict[sender.MemberNumber] + 1
      } else if (msg.toLowerCase().includes("desk") || msg.toLowerCase().includes("mirror") || msg.toLowerCase().includes("device") || msg.toLowerCase().includes("wooden box")) {
        ServerSend("ChatRoomChat", { Content: "*私人: 在这之前你先得 返回(back).", Type: "Emote", Target: sender.MemberNumber} );
      }
      break;


    case "device":
      partnerName = sender.MemberNumber == charList[0] ? charDict[charList[1]].Name : charDict[charList[0]].Name
      if (msg.toLowerCase().includes("back") || msg.toLowerCase().includes("explore")) {
        dildoInserting = false
        if (dildoInside == sender.MemberNumber && !dildoLocked) {
          ServerSend("ChatRoomChat", { Content: "*私人: 你体内的棒棒被拴住了. 你没法四处走动, 你可以 拔掉棒棒(take out the dildo). 你能够着的只有面前的按钮. 你可以 按下按钮(press the <color> button).", Type: "Emote", Target: sender.MemberNumber});
        } else {
          backToRoom1(sender, msg)
        }
      } else if (msg.toLowerCase().includes("press the red button") || msg.toLowerCase().includes("press the blue button") || msg.toLowerCase().includes("press the green button")) {
        if (dildoIntensity == 3) {
          ServerSend("ChatRoomChat", { Content: "*你听见滴的一声'.", Type: "Emote", Target: sender.MemberNumber});
          if (tabletActive && msg.toLowerCase().includes("press the red button")) {
            coloredButtonPushed(sender, 0);
          } else if (tabletActive && msg.toLowerCase().includes("press the blue button")) {
            coloredButtonPushed(sender, 1);
          } else if (tabletActive && msg.toLowerCase().includes("press the green button")) {
            coloredButtonPushed(sender, -1);
          }
        } else {
          ServerSend("ChatRoomChat", { Content: "*私人: 按下按钮后什么也没发生. 或许装置没有通电.", Type: "Emote", Target: sender.MemberNumber} )
        }
      } else if (msg.toLowerCase().includes("dildo on myself") && dildoInside == 0) {
        asset = AssetGet("Female3DCG", "ItemVulva", "VibratingDildo")
        if (!sender.CanInteract()) {
          ServerSend("ChatRoomChat", { Content: "*私人: 你的手被绑着. 得有人来帮你.", Type: "Emote", Target: sender.MemberNumber});
        } else if (InventoryAllow(sender, asset.Prerequisite) || !customInventoryGroupIsBlocked(sender,"ItemVulva")) {
          ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 把棒棒插进了自己体内.", Type: "Emote"});
          ServerSend("ChatRoomChat", { Content: "*私人: 棒棒被链子拴着了. 而且它正在你体内, 你现在不能在房间里移动. 你可以 拔掉棒棒(take out the dildo), 或者你附近有什么东西...", Type: "Emote", Target: sender.MemberNumber});
          dildoInside = sender.MemberNumber
          InventoryWear(sender, "VibratingDildo","ItemVulva","Default")
          InventoryGet(sender,"ItemVulva").Property = { Intensity: -1, Effect: [] }
          InventoryGet(sender,"ItemVulva").Asset.Effect = []
          CharacterLoadEffect(sender)
          ChatRoomCharacterUpdate(sender)
          if (typeof checkIfDildoIsInsertedHandle !== 'undefined') {
            clearInterval(checkIfDildoIsInsertedHandle)
          }
          checkIfDildoIsInsertedHandle = setInterval(checkIfDildoIsInserted, 5*1000)
        } else {
          ServerSend("ChatRoomChat", { Content: "*私人:你不能这么做, 你的这部分被挡住了.", Type: "Emote", Target: sender.MemberNumber});
        }
      } else if (msg.toLowerCase().includes("dildo on " + partnerName.toLowerCase()) && dildoInside == 0) {
        asset = AssetGet("Female3DCG", "ItemVulva", "VibratingDildo")
        partnerName = sender.MemberNumber == charList[0] ? charDict[charList[1]].Name : charDict[charList[0]].Name
        for (R = 0; R < ChatRoomCharacter.length; R++) {
          if (partnerMemberNumber == ChatRoomCharacter[R].MemberNumber) {
            partnerAsset = ChatRoomCharacter[R]
          }
        }

        if (!sender.CanInteract()) {
          ServerSend("ChatRoomChat", { Content: "*私人: 你的手被绑住了，你不能这么做.", Type: "Emote", Target: sender.MemberNumber});
        } else if (charPos[partnerMemberNumber] != "device") {
          ServerSend("ChatRoomChat", { Content: "*私人: " + partnerName + " 离你太远了.", Type: "Emote", Target: sender.MemberNumber});
        } else if (!InventoryAllow(partnerAsset, asset.Prerequisite) || customInventoryGroupIsBlocked(partnerAsset,"ItemVulva")) {
          ServerSend("ChatRoomChat", { Content: "*私人: 你不能这么做. " + partnerName + "的这部分被挡住了", Type: "Emote", Target: sender.MemberNumber});
        } else {
          ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 拿起棒棒打算插入 " + partnerName +  ".", Type: "Emote"});
          ServerSend("ChatRoomChat", { Content: "*私人: [等待 " + partnerName + " 回应]. ", Type: "Emote", Target: sender.MemberNumber});
          ServerSend("ChatRoomChat", { Content: "*私人: 你可以 接受(accept) 或 拒绝(refuse).", Type: "Emote", Target: partnerMemberNumber});
          dildoInserting = partnerMemberNumber
        }
      } else if (msg.toLowerCase().includes("take out the dildo") && dildoInside == sender.MemberNumber && !dildoLocked) {
        ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 拔掉了棒棒. 她现在可以四周走动了.", Type: "Emote"})
        InventoryRemove(sender, "ItemVulva")
        ChatRoomCharacterUpdate(sender)
        dildoInside = 0
        // if (woodenBoxOpen) {
        //   ServerSend("ChatRoomChat", { Content: "*The wooden box door is now closed.", Type: "Emote"})
        //   woodenBoxOpen = false
        // }
      } else if (msg.toLowerCase().includes("accept") && dildoInserting == sender.MemberNumber) {
        partnerName = sender.MemberNumber == charList[0] ? charDict[charList[1]].Name : charDict[charList[0]].Name
        ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 张开腿让 " + partnerName + " 把棒棒塞入她的体内.", Type: "Emote"});
        dildoInserting = false
        dildoInside = sender.MemberNumber
        InventoryWear(sender, "VibratingDildo","ItemVulva","Default")
        InventoryGet(sender,"ItemVulva").Property = { Intensity: -1, Effect: [] }
        InventoryGet(sender,"ItemVulva").Asset.Effect = []
        CharacterLoadEffect(sender)
        ChatRoomCharacterUpdate(sender)
        if (typeof checkIfDildoIsInsertedHandle !== 'undefined') {
          clearInterval(checkIfDildoIsInsertedHandle)
        }
        checkIfDildoIsInsertedHandle = setInterval(checkIfDildoIsInserted, 5*1000)
      } else if (msg.toLowerCase().includes("refuse") && dildoInserting == sender.MemberNumber) {
        partnerName = sender.MemberNumber == charList[0] ? charDict[charList[1]].Name : charDict[charList[0]].Name
        ServerSend("ChatRoomChat", { Content: "*" + sender.Name + " 不想让 " + partnerName + " 把棒棒插入她体内.", Type: "Emote"});
        dildoInserting = false
      } else if (msg.toLowerCase().includes("desk") || msg.toLowerCase().includes("mirror") || msg.toLowerCase().includes("device") || msg.toLowerCase().includes("wooden box")) {
        ServerSend("ChatRoomChat", { Content: "*私人: 在这之前你先得 返回(back).", Type: "Emote", Target: sender.MemberNumber} );
      }

      break;

  }
}


function story1(sender) {
  if (InventoryIsWorn(sender, "HarnessBallGag", "ItemMouth") && InventoryIsWorn(sender, "LeatherArmbinder", "ItemArms")) {

    // check if arms are restrained or not
    // if (InventoryGet(sender, "ItemArms").Property.Restrain == null) {
    //   ServerSend("ChatRoomChat", { Content: "*Private: You feel the cuffs on your arms attracting each other with enourmous strength. Before you can do anything you find yourself with your arms tied on your back.", Type: "Emote", Target: sender.MemberNumber} );
    //   InventoryGet(sender, "ItemArms").Property.Restrain = "Both"
    //   InventoryGet(sender, "ItemArms").Property.SetPose = ["BackElbowTouch"]
    //   InventoryGet(sender, "ItemArms").Property.Effect = ["Block", "Prone"];
    //   InventoryGet(sender, "ItemArms").Property.SelfUnlock = false
    //   InventoryGet(sender, "ItemArms").Property.Difficulty = 6;
    //   ChatRoomCharacterUpdate(sender)
    // }

    // Set the lock code
    InventoryLock(sender, InventoryGet(sender, "ItemMouth"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber)
    InventoryGet(sender, "ItemMouth").Property.CombinationNumber = lockCode
    InventoryLock(sender, InventoryGet(sender, "ItemArms"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber)
    InventoryGet(sender, "ItemArms").Property.CombinationNumber = lockCode
    ChatRoomCharacterUpdate(sender)

    ServerSend("ChatRoomChat", { Content: "*私人: 你听见你身上的束手器和口球发出滴的一声. 然后随着锁声它们被锁上了. 你现在没法摆脱这些拘束具了.", Type: "Emote", Target: sender.MemberNumber} );

    partnerName = sender.MemberNumber == charList[0] ? charDict[charList[1]].Name : charDict[charList[0]].Name
    partnerMemberNumber = sender.MemberNumber == charList[0] ? charDict[charList[1]].MemberNumber : charDict[charList[0]].MemberNumber

    if (InventoryIsWorn(charDict[partnerMemberNumber], "HarnessBallGag", "ItemMouth") && InventoryIsWorn(charDict[partnerMemberNumber], "LeatherArmbinder", "ItemArms")) {
      ServerSend("ChatRoomChat", { Content: "*现在 " + sender.Name + "身上的拘束具也上锁了, 你们知道这是注定的. 你们都喜欢被束缚起来动弹不得的感受.", Type: "Emote"} );
      if (charPos[partnerMemberNumber] == "inside box") {
        imprisonedList.push(partnerMemberNumber)
        ServerSend("ChatRoomChat", { Content: "* " + charDict[partnerMemberNumber].name + " 所在盒子的盖子被锁上了. 同时另一个盒子的盖子也打开了...", Type: "Emote"} );
      } else {
        setTimeout(function () {ServerSend("ChatRoomChat", { Content: "*你听见盒子打开的声音.", Type: "Emote"})}, 5*1000);
      }
      storyProgress = 50
    } else {
      setTimeout(deviceAppear, 5*1000)
    }
  }
}

function deviceAppear() {
  if (storyProgress == 50) {return}
  ServerSend("ChatRoomChat", { Content: "*你听见墙边发出噪音. 你发现墙正在缓慢移动.", Type: "Emote"} );
  setTimeout(function() {
    ServerSend("ChatRoomChat", { Content: "*在墙转过180度后, 某种 装置(device) 出现在你面前. 上面有三个按钮以及旁边有一根震动棒.", Type: "Emote"} );
    deviceAvailable = true;
  }, 5*1000);
}


function openWoodenBox(sender) {
  if (dildoIntensity == 3) {
    //partnerName = charDict[dildoInside].Name
    ServerSend("ChatRoomChat", { Content: "*一个木盒随着咔嚓一声打开了. 同时一个贞操带锁在了 " + charDict[dildoInside].Name + "身上把棒棒锁在了里面, 但是链子松开了所以 " + charDict[dildoInside].Name + " 可以移动了.", Type: "Emote"} );
    woodenBoxOpen = true
    dildoLocked = true
    InventoryWear(charDict[dildoInside], "PolishedChastityBelt", "ItemPelvis","Default",100)
    InventoryGet(charDict[dildoInside],"ItemPelvis").Property = {Block: [ "ItemButt" ], Restrain: "ClosedBack"}
    InventoryLock(charDict[dildoInside], InventoryGet(charDict[dildoInside], "ItemPelvis"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber)
    InventoryGet(charDict[dildoInside], "ItemPelvis").Property.CombinationNumber = lockCode
    ChatRoomCharacterUpdate(charDict[dildoInside])
  }
}


function coloredButtonPushed(sender, buttonColor) {
  // 0 is red , 1 ius blue -1 is green
  insertedCode.push(buttonColor)
  if (customCompareArray(insertedCode,correctCode) || customCompareArray(insertedCode,alternativeCode)) {
    if (insertedCode.length == 3 && saveSlave == 2) {
      partnerMemberNumber = sender.MemberNumber == charList[0] ? charDict[charList[1]].MemberNumber : charDict[charList[0]].MemberNumber
      ServerSend("ChatRoomChat", { Content: "你仍想自救吗? 你仍然可以做 " + charDict[partnerMemberNumber].Name + "的奴隶.  [私语: （YES）来做个乖孩子接受惩罚或是 （NO） 来背叛]", Type: "Whisper", Target: sender.Name} );
      saveSlave = 3
    }
    if (insertedCode.length == correctCode.length && saveSlave >= 2) {
      partnerMemberNumber = sender.MemberNumber == charList[0] ? charDict[charList[1]].MemberNumber : charDict[charList[0]].MemberNumber
      charPos[partnerMemberNumber] = "imprisoned"
      storyProgress = 20
      imprisonedList.push(partnerMemberNumber)
      ServerSend("ChatRoomChat", { Content: "*滴————!.", Type: "Emote"} );
      ServerSend("ChatRoomChat", { Content: "*最后一个按钮按下的同时盒子的盖子关上了. 几只机械手伸了出来: 首先把棒棒塞入了 " + charDict[partnerMemberNumber].Name + "体内, 然后穿上贞操带和全套拘束具然后上锁，真是个可怜的孩子.", Type: "Emote"} );
      InventoryWear(charDict[partnerMemberNumber], "VibratingDildo","ItemVulva","Default")
      InventoryGet(charDict[partnerMemberNumber],"ItemVulva").Property = { Intensity: 3, Effect: ["Vibrating"] }
      InventoryGet(charDict[partnerMemberNumber],"ItemVulva").Asset.Effect = []
      InventoryWear(charDict[partnerMemberNumber], "PolishedChastityBelt", "ItemPelvis","Default",100)
      InventoryGet(charDict[partnerMemberNumber],"ItemPelvis").Property = {Block: [ "ItemButt" ], Restrain: "ClosedBack"}
      InventoryWear(charDict[partnerMemberNumber], "LeatherBlindfold", "ItemHead","Default",100)
      InventoryWear(charDict[partnerMemberNumber], "HarnessBallGag", "ItemMouth","Default",100)
      InventoryWear(charDict[partnerMemberNumber], "LeatherArmbinder", "ItemArms", "Default",80)
      CharacterLoadEffect(charDict[partnerMemberNumber])
      ChatRoomCharacterUpdate(charDict[partnerMemberNumber])
      ServerSend("ChatRoomChat", { Content: "*同时 " + sender.Name + " 身上的所有锁和束手器都解开了.", Type: "Emote"} );
      InventoryRemove(sender,"ItemArms")
      InventoryUnlock(sender,InventoryGet(sender,"ItemMouth"))
      if (InventoryGet(sender,"ItemMouth") != null) { InventoryUnlock(sender,InventoryGet(sender,"ItemMouth")) }
      ChatRoomCharacterUpdate(sender)
      ServerSend("ChatRoomChat", { Content: "真是看到了难得一见的场面. 看来你对 " + sender.Name + " 的调教还不够. 她现在下克上了. 希望你喜欢这个结局 " + sender.Name + ",  门(door) 现在打开了.", Type: "Chat"} );
      ServerSend("ChatRoomChat", { Content: charDict[partnerMemberNumber].Name + " 看来你不是很擅长做S,你会被调教成M. 希望你能比她出色.", Type: "Chat"} );
      console.log("Ending 'Dominance Failure & Betrayal' for: the failed domme " + charDict[partnerMemberNumber].Name + " (" + partnerMemberNumber + ") & her betrayer " + sender.Name + " (" + sender.MemberNumber + ").")
      ServerSend("ChatRoomChat", { Content: "结局 '下克上' : 不是很行的S " + charDict[partnerMemberNumber].Name + " (" + partnerMemberNumber + ") & 二五仔 " + sender.Name + " (" + sender.MemberNumber + ").", Type: "Chat"} );
    } else if (insertedCode.length == correctCode.length) {
      partnerMemberNumber = sender.MemberNumber == charList[0] ? charDict[charList[1]].MemberNumber : charDict[charList[0]].MemberNumber
      charPos[sender.MemberNumber] = "imprisoned"
      storyProgress = 10
      imprisonedList.push(sender.MemberNumber)
      ServerSend("ChatRoomChat", { Content: "*滴————!.", Type: "Emote"} );
      ServerSend("ChatRoomChat", { Content: "*最后一个按钮按下的同时盒子的盖子关上了. 几只机械手伸了出来给 " + sender.Name + "戴上了眼罩并上锁.真是个可怜的孩子.", Type: "Emote"} );
      ServerSend("ChatRoomChat", { Content: "*她被装进盒子里, 然后彻底锁上.", Type: "Emote"} );
      ServerSend("ChatRoomChat", { Content: "*私人: 你可以 爬出去(crawl outside) 然后 现在可以调查 门(door).", Type: "Emote", Target: partnerMemberNumber} );
      InventoryWear(sender, "LeatherBlindfold", "ItemHead","Default",100)
      InventoryWear(sender, "SmallWoodenBox","ItemDevices","Default",100)
      InventoryLock(sender, InventoryGet(sender, "ItemDevices"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock")}, Player.MemberNumber)
      InventoryGet(sender, "ItemDevices").Property.CombinationNumber = lockCode
      ChatRoomCharacterUpdate(sender)

      if (customCompareArray(insertedCode,alternativeCode)) {
        storyProgress = 30
        console.log("结局 - '女王与奴隶' : 女王 " + charDict[partnerMemberNumber].Name + " (" + partnerMemberNumber + ") & 奴隶 " + sender.Name + " (" + sender.MemberNumber + ").")
        ServerSend("ChatRoomChat", { Content: "祝贺! 你是真正的女王! 你的奴隶已经打包好了随你处置.", Type: "Chat"} );
        ServerSend("ChatRoomChat", { Content: "锁的密码会发送给你. 你可以解锁然后带走她或者把她留在这个小盒里. 会有人陪她的.", Type: "Chat"} );
        ServerSend("ChatRoomChat", { Content: "*私人: 锁的密码:" + lockCode + ". 可别忘了!", Type: "Emote", Target: partnerMemberNumber} );
        ServerSend("ChatRoomChat", { Content: "结局 - '女王与奴隶': 女王 " + charDict[partnerMemberNumber].Name + " (" + partnerMemberNumber + ") & 奴隶 " + sender.Name + " (" + sender.MemberNumber + ").", Type: "Chat"} );
      } else {
        ServerSend("ChatRoomChat", { Content: "结局 - '抖S与抖M' : 抖S " + charDict[partnerMemberNumber].Name + " (" + partnerMemberNumber + ") & 抖M " + sender.Name + " (" + sender.MemberNumber + ").", Type: "Chat"} );
        console.log("Ending - 'The Domme and The Sub' for: the domme " + charDict[partnerMemberNumber].Name + " (" + partnerMemberNumber + ") & the submissive " + sender.Name + " (" + sender.MemberNumber + ").")
        ServerSend("ChatRoomChat", { Content: "emm, " + charDict[partnerMemberNumber].Name + " 你是个不错的S, 但是 " + sender.Name + "得留在这里。如果想要救她的话，跪下然后说：'i wish to replace her to get the punishment'.当然你可以不这么做，会有人陪她的.", Type: "Chat"} );
      }
    } else {
      nextColor = correctCode[insertedCode.length] == 0 ? "red" : (correctCode[insertedCode.length] == 1 ? "blue" : "green")
      ServerSend("ChatRoomChat", { Content: "*私人: 滴! 屏幕的颜色改变了: 现在是 " + nextColor + ". -等待输入-", Type: "Emote", Target: sender.MemberNumber == charList[0] ? charDict[charList[1]].MemberNumber : charDict[charList[0]].MemberNumber} );
    }
  } else {
    // inserted wrong code, reset to a new code
    correctCode = Array.from({length: 5}, () => Math.floor(Math.random() * 3)-1); // -1 is red, 0 blue and 1 is green. Multiply the array *-1 and you obtain the alternative code that does "something different".
    alternativeCode = correctCode.map(function(x) { return x * -1; });
    insertedCode = []
    nextColor = correctCode[0] == 0 ? "red" : (correctCode[0] == 1 ? "blue" : "green")
    ServerSend("ChatRoomChat", { Content: "*私人: 滴! 屏幕的颜色改变了: 现在是 " + nextColor + ". -等待输入-", Type: "Emote", Target: sender.MemberNumber == charList[0] ? charDict[charList[1]].MemberNumber : charDict[charList[0]].MemberNumber} );
  }
}

function backToRoom1(sender, msg) {
  if (!canMove(sender,msg)) { return }
  charPos[sender.MemberNumber] = "room1"
  deviceMessage = ""
  if (deviceAvailable) {deviceMessage = " 墙边还有一套 装置(device)."}
  ServerSend("ChatRoomChat", { Content: "*私人: 房间的一侧有一张 桌子(desk) , 一面 镜子(mirror) 另一边有一些 木盒(wooden boxes)  房间中央的底座上放着 牌匾(plaque) ." + deviceMessage, Type: "Emote", Target: sender.MemberNumber} );
  if (storyProgress == 10) {
    ServerSend("ChatRoomChat", { Content: "*私人: 你察觉到了变化, 现在你能检查 门(door) 了.", Type: "Emote", Target: sender.MemberNumber} );
  }
}


function checkIfDildoIsInserted() {

  if (dildoInside == 0) {
    console.log("Dildo is not inserted 1")
    dildoIntensity = -1
    clearInterval(checkIfDildoIsInsertedHandle)
    if (dildoIntensity >= 0) {
      ServerSend("ChatRoomChat", { Content: "*你听见棒棒发出的声音逐渐减弱然后消失.", Type: "Emote"} );
    }
  }

  dildoAsset = InventoryGet(partnerAsset, "ItemVulva")

  if (dildoAsset == null || dildoAsset.Asset.Name != "VibratingDildo") {
    console.log("Dildo is not inserted 2")
    if (dildoIntensity >= 0) {
      console.log("Dildo is not inserted 3")
      ServerSend("ChatRoomChat", { Content: "*你听见棒棒发出的声音逐渐减弱然后消失.", Type: "Emote"} );
    }
    dildoInside = 0
    dildoIntensity = -1
    clearInterval(checkIfDildoIsInsertedHandle)
  }

}


if (typeof storyActive === 'undefined') {
  storyActive = false
}

function resetRoom() {

  if (typeof checkIfDildoIsInsertedHandle !== 'undefined') {
    clearInterval(checkIfDildoIsInsertedHandle)
  }

  if (typeof imprisonedList === 'undefined') {
    imprisonedList = []
  }

  charDict = {}
  charPos = {}
  charList = []
  deviceAvailable = false
  dildoInserting = false
  dildoIntensity = -1
  dildoInside = 0 // the member number of the player with the dildo inside. 0 if noone
  dildoLocked = false
  correctCode = Array.from({length: 5}, () => Math.floor(Math.random() * 3)-1); // -1 is red, 0 blue and 1 is green. Multiply the array *-1 and you obtain the alternative code that does "something different".
  alternativeCode = correctCode.map(function(x) { return x * -1; });
  insertedCode = []
  woodenBoxOpen = false
  tabletActive = false
  storyProgress = 0  // 0 - Beginning / 10 - The Domme and The Sub / 20 - Dominance Failure & Betrayal / 30 - The Mistress and The Slave / 50 - Will of submission /
  mirrorInspectDict = {}
  lockCode = Math.floor(Math.random() * 9000+1000).toString()
  saveSlave = 0 // 0 - no save / 1 - asked question / 2 - will be saved / 3 - will be saved but is asked for confirmation (can revert to 0 if denied)

  // check if all imprisoned people are in room. Sometimes they are not. Don't know why.
  tempList = imprisonedList
  for (ii = 0; ii < tempList.length; ii++) {
    check = false
    for (jj = 0; jj < ChatRoomCharacter.length; jj++) {
      if (tempList[ii] == ChatRoomCharacter[jj]) {
        check = true
      }
    }
    if (check) {imprisonedList.splice(imprisonedList.indexOf(tempList[ii]),1);}
  }

  // Update room
  var UpdatedRoom = {
		Name: ChatRoomData.Name,
		Description: ChatRoomData.Description,
		Background: ChatRoomData.Background,
		Limit: (3 + imprisonedList.length).toString(),
		Admin: ChatRoomData.Admin,
		Ban: ChatRoomData.Ban,
		Private: false,
      Locked: false,
      Language: ChatRoomData.Language
	};
	ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
	ChatAdminMessage = "UpdatingRoom";

}



// Sends the chat room update packet to the server and waits for the answer
function closeRoomStory() {
	var UpdatedRoom = {
		Name: ChatRoomData.Name,
		Description: ChatRoomData.Description,
		Background: ChatRoomData.Background,
		Limit: (3 + imprisonedList.length).toString(),
		Admin: ChatRoomData.Admin,
		Ban: ChatRoomData.Ban,
		Private: true,
        Locked: true,
        Language: ChatRoomData.Language
	};
	ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
	ChatAdminMessage = "UpdatingRoom";
}


// Sends the chat room update packet to the server and waits for the answer
function openRoomStory() {
	var UpdatedRoom = {
		Name: ChatRoomData.Name,
		Description: ChatRoomData.Description,
		Background: ChatRoomData.Background,
		Limit: ChatRoomData.Limit,
		Admin: ChatRoomData.Admin,
		Ban: ChatRoomData.Ban,
		Private: ChatRoomData.Private,
        Locked: false,
        Language: ChatRoomData.Language
	};
	ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
	ChatAdminMessage = "UpdatingRoom";
}




function customInventoryGroupIsBlocked(C, GroupName, ignoreItemArray = []) {

	// Items can block each other (hoods blocks gags, belts blocks eggs, etc.)
	for (var E = 0; E < C.Appearance.length; E++) {
    if (ignoreItemArray.includes(C.Appearance[E].Asset.Name)) continue;
		if (!C.Appearance[E].Asset.Group.Clothing && (C.Appearance[E].Asset.Block != null) && (C.Appearance[E].Asset.Block.includes(GroupName))) return true;
		if (!C.Appearance[E].Asset.Group.Clothing && (C.Appearance[E].Property != null) && (C.Appearance[E].Property.Block != null) && (C.Appearance[E].Property.Block.indexOf(GroupName) >= 0)) return true;
	}

	// Nothing is preventing the group from being used
	return false;

}

function customCompareArray(array1, array2) {
  //comprare two arrays until the last element of array1. If array2 is longer the remaining elements are ignored
  out = true
  for (var ii = 0; ii < array1.length; ii++) {
    if (array1[ii] != array2[ii]) {out = false}
  }
  return out
}


function lookLikeSlave(memNum) {
  return (isExposed(charDict[memNum], ["PolishedChastityBelt"]) && charDict[memNum].IsKneeling() && InventoryIsWorn(charDict[memNum], "HarnessBallGag", "ItemMouth") && InventoryIsWorn(charDict[memNum], "LeatherArmbinder", "ItemArms"))
}

function dressLikeMistress(memNum) {
  return (InventoryIsWorn(charDict[memNum],"MistressBoots","Shoes") && InventoryIsWorn(charDict[memNum],"MistressBottom","ClothLower") && InventoryIsWorn(charDict[memNum],"MistressGloves","Gloves") && InventoryIsWorn(charDict[memNum],"MistressTop","Cloth"))
}

function InventoryBlockedOrLimitedCustomized(C, ItemAsset, ItemType) {
  // slight variation of the official function InventoryBlockedOrLimited
  Item = {"Asset": ItemAsset}
	let Blocked = InventoryIsPermissionBlocked(C, Item.Asset.DynamicName(Player), Item.Asset.DynamicGroupName, ItemType);
	let Limited = !InventoryCheckLimitedPermission(C, Item, ItemType);
	return Blocked || Limited;
}
