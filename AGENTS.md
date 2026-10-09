# BC Bot 开发 Agent

本文件是「BC Bot Game」项目的 Agent 预设指令。任何 AI Agent 在本仓库开发新 bot 时，按本文件执行。
人类也可以直接把本文件内容整段粘贴给任意编码 Agent 使用。

---

## 1. 角色

你是「BC Bot Game」项目的 bot 开发者。目标：在**先分析现有文件**之后，产出一个可整体粘贴进
BondageClub 开发者工具控制台、并立即运行的独立 bot 文件；风格、命名、结构与现有 `BOT - *.js` 一致。

项目交付形态：`CommonBotAssets.js`（前置公共库，先粘贴）→ 任意一个 `BOT - *.js`（再粘贴）。

## 2. 硬性约束（违反即报废）

1. 交付物是**单个 .js 文件全文**：无 import/export、无 require、无构建步骤、无外部依赖。
2. 运行环境是浏览器控制台（非模块）：**不能使用顶层 await**；异步逻辑一律写进 `async function` 再调用。
3. 前置条件是用户已粘贴执行 `CommonBotAssets.js`，因此：
   - 只调用它**已导出**的函数（见第 5 节速查表）；
   - 不重复定义同名全局函数；
   - 不假设它内部未导出的局部变量存在。
4. 不用自己新建的名字去覆盖公共库已有全局名；新 bot 自己的名字统一加前缀（如 `CA_`、`MyBot_`）防止冲突。
5. 编码：新文件写 **UTF-8（无 BOM）**。`CommonBotAssets.js`、`apps.js`、
   `Script - DroneTrainingSystem - Equips.js`、`TOOL - zajucdBetterTeleport….js` 是 **GBK**，
   若要修改这些文件必须保持原编码，否则中文注释变乱码。
6. 地图字符串（`Tiles` / `Objects`）是「每字符 = 一个 tile」，长度必须精确等于
   `ChatRoomMapViewWidth * 高度`（宽 40）。改地图只允许用
   `SetCharIn40x40String(str, x, y, charCode)` / `SetMapObjs` / `SetMapTiles`，或做等长替换；
   绝不手写、绝不破坏长度。
7. 传送 / 改地图 / 踢人需要房主权限，操作前先 `ChatRoomCharacterIsAdmin(char)` 检查。
   `Teleport()` 对 `Player` 自身直接返回 `true`（**不能传送自己**），自身移动用
   `Player.MapData.Pos = {...}` + `ServerSend("ChatRoomCharacterMapDataUpdate", Pos)`。
8. 每个 bot 文件只在末尾调用一次 `InitBot()`。事件通过 `Dict["唯一Key"] = fn` 注册（天然幂等），
   重复粘贴不得产生重复监听。

## 3. 标准骨架（照抄结构，替换语义）

```js
//#region 配置与文案
const BOT_KEY = "MyBot";                       // 唯一，同时作为事件注册 key
const desc = `
BOT game：MyBot
作者: 你的名字(ID)
原型: https://github.com/keykey5/BC-BOT-repository
可用指令 通过发送(/bot [指令] [参数])来使用
[help]查看指令  [think]查看状态
`;
//#endregion

//#region 装备预设
const CatchEquipList = [
    {
        "Item": "HeavyYoke",
        "AssetGroup": "ItemArms",
        "Color": "#202020,Default,Default,Default",
        "TypeRecord": { "typed": 0 },
        "ItemProperty": { "OverridePriority": 12 }
    },
];
//#endregion

//#region 地图（宽 40；用 SetCharIn40x40String 生成，不要手写）
const mapData = { "Type": "Always", "Tiles": "<40*H 字符>", "Objects": "<40*H 字符>" };
//#endregion

//#region 玩家状态
const players = [];
class PlayerInfo {
    constructor(sender) {
        this.MemberNumber = sender.MemberNumber;
        this.hp = 3;
        this.score = 0;
        this.state = "idle";
    }
    get Character() { return ChatRoomGetCharacter(this.MemberNumber); }
    get Pos() {
        const c = this.Character;
        return (c != null && c.MapData) ? c.MapData.Pos : { X: 0, Y: 0 };
    }
}
function FindPlayer(sender) {
    const num = (sender.MemberNumber ?? sender);
    return players.find(p => p.MemberNumber == num);
}
function RegExistPlayer() {                     // 部署时房间里已经有人
    for (const c of ChatRoomCharacter) {
        if (!ChatRoomCharacterIsAdmin(c)) players.push(new PlayerInfo(c));
    }
}
//#endregion

//#region 事件注册（公共库按 key 遍历调用）
ChatRoomMessageAdditionDict[BOT_KEY] =
    function (SenderCharacter, msg, data) { ChatRoomMessageMyBot(SenderCharacter, msg, data); };
ChatRoomSyncMapDataeAdditionDict[BOT_KEY] =
    function (SenderCharacter) { CharacterMoved(SenderCharacter); };

async function ChatRoomMessageMyBot(sender, msg, data) {
    if (sender.MemberNumber == Player.MemberNumber) return;              // 忽略自己
    // 进场
    if (data.Type == "Action" && msg.startsWith("ServerEnter")) {
        Teleport(sender, 20, 20);                                        // 仅房主可用
        if (ChatRoomCharacterIsAdmin(sender) == false) players.push(new PlayerInfo(sender));
        SendText("欢迎，规则见 bot 的 bio，输入 /bot think 测试 bot 是否生效", sender);
    }
    // 离场
    else if (msg.startsWith("ServerLeave") || msg.startsWith("ServerDisconnect")
          || msg.startsWith("ServerBan")   || msg.startsWith("ServerKick")) {
        const i = players.findIndex(p => p.MemberNumber == sender.MemberNumber);
        if (i >= 0) players.splice(i, 1);
    }
    // 玩家指令（玩家侧插件/BC 内置 bot 指令发送 Hidden 消息）
    else if (data.Type == "Hidden" && msg.startsWith("ChatRoomBot")) {
        const params = msg.toLowerCase().substring(11).trim().split(' ');
        const player = FindPlayer(sender);
        if (player != undefined && params.length > 0) DoCommands(player, params);
    }
}

async function CharacterMoved(sender) {                                  // 移动触发
    if (ChatRoomCharacterIsAdmin(sender)) return;
    const player = FindPlayer(sender);
    if (player == undefined) return;
    const nowPos = sender.MapData ? sender.MapData.Pos : null;
    const oldPos = sender.MapData ? sender.MapData.pverPos : null;       // 上一次位置
    if (nowPos == null || oldPos == null) return;
    // TODO: 区域进出判定 / 陷阱判定 / 计分 / 传送
    await sleep(0);                                                      // 给渲染留出时间
}

async function DoCommands(player, params) {
    switch (params[0]) {
        case "help":  SendText("指令: help / think", player.Character, false); break;
        case "think": SendText("状态:" + player.state + " 分数:" + player.score, player.Character, false); break;
    }
}
//#endregion

//#region 初始化
async function InitBot() {
    Player.MapData.Pos = { X: 20, Y: 20 };
    ServerSend("ChatRoomCharacterMapDataUpdate", { Pos: { X: 20, Y: 20 } });

    Player.Description = desc;
    ServerSend("AccountUpdate", { Description: Player.Description });
    ChatRoomCharacterUpdate(Player);                                     // 同步自身

    if (false /* 需要自定义房间地图时改为 true */) {
        ChatRoomData.MapData = mapData;
        ServerSend("ChatRoomAdmin", {
            MemberNumber: Player.ID,
            Room: ChatRoomGetSettings(ChatRoomData),
            Action: "Update"
        });
    }
    RegExistPlayer();
}
InitBot();
//#endregion
```

## 4. 本仓库既有架构（分析结论）

| 文件 | 作用 | 要点 |
| --- | --- | --- |
| `CommonBotAssets.js` | 前置公共库（必须先粘贴） | 885 行，**GBK**。事件分发骨架 + 装备/地图/文本/抓捕工具 |
| `BOT - *.js` | 各游戏 bot | UTF-8（部分带 BOM），注册到两个 `AdditionDict` |
| `BOT - WolfField.js` | **未完成半成品** | 只有 `cloth`/`equip`/`maps`/`PlayerInfo`，无事件注册、无 `InitBot` |
| `Script - *.js` | 玩家侧插件 | 与 bot 通过 `Type:"Hidden"` + `Content` 前缀通信 |
| `apps.js` | BC 官方代码快照 | GBK，只读参考 |

事件分发链路：
- `ServerSocket.on("ChatRoomMessage")` → `ChatRoomMessageAdd` → 遍历
  `ChatRoomMessageAdditionDict[key](SenderCharacter, msg, data)`
- `ServerSocket.on("ChatRoomSyncMapData")` → `ChatRoomMapViewSyncMapAdd` → 遍历
  `ChatRoomSyncMapDataeAdditionDict[key](char)`
- 消息类型：`Chat` / `Whisper` / `Emote` / `Action` / `Hidden`
- 玩家指令前缀：`Hidden` + `msg.startsWith("ChatRoomBot")`，指令体为 `msg.substring(11).trim().split(' ')`
- 系统进出场：`Action` + `ServerEnter` / `ServerLeave` / `ServerDisconnect` / `ServerBan` / `ServerKick`

参考实现优先级：`BOT - ChaosArena.js`（结构最完整：区域表 `Areas`/`Exclude`/`Enter`/`Leave`/`Moved`、
陷阱表、法术表、`PlayerInfo`）→ `BOT - LeashDroneHelper.js`（最小可运行）→ `BOT - PonyRace.js`。

## 5. 已验证 API 速查（只能用这些，不要臆造）

**事件与注册表**
`ServerSocket.on("ChatRoomMessage" | "ChatRoomSyncMapData")`、
`ChatRoomMessageAdditionDict[key](sender, msg, data)`、
`ChatRoomSyncMapDataeAdditionDict[key](char)`、
`CharacterPverPosDict[memberNumber]`

**文本**
`SendText(text, targetChar, isWait = true)`（对自己 = Chat，对他人 = Whisper + Target）、
`SendTextToAll(text)`、`ChatSleep()`（2s）、`sleep(ms)`、`GetName(char)`

**传送与地图**
`Teleport(sender, x, y)`、`ServerSend("ChatRoomCharacterMapDataUpdate", { Pos })`、
`ChatRoomData.MapData.Tiles` / `.Objects`、`GetCharIn40x40String`、`SetCharIn40x40String`、
`SetMapObjs([{X, Y, Id}])`、`SetMapTiles([...])`、`ChatRoomMapViewWidth`、
`ChatRoomGetSettings(ChatRoomData)` + `ServerSend("ChatRoomAdmin", { MemberNumber, Room, Action: "Update" })`

**装备与外观**
`WearEquips(target, EquipList, refresh = true, craft = true, difficulty = 1000)`（列表项含
`AssetGroup` / `Item` / `Color` / `TypeRecord` / `ItemProperty`）、`RemoveEquips(target, list, refresh, removeByItem)`、
`RemoveClothes(sender, refresh, removeUnderwear, removeCosplay)`、`RemoveRestrains(sender, refresh)`、
`RemoveRestrainsWithAssetGroup`、`InventoryWear(target, item, group, color, difficulty, lockCode, extended)`、
`InventoryCraft(Player, target, group, extended, …)`、`InventoryLock`、`InventoryGet` / `InventoryRemove`、
`CharacterAppearanceGetCurrentValue`、`AssetGet`、`ExtendedItemInit`、
`CharacterLoadEffect(c)` + `ChatRoomCharacterUpdate(c)`（**必须成对**，否则外观/拘束不生效）、
`CharacterRefresh`、`CharacterSetActivePose`、
`GetAllInventory(sender)`（导出穿戴 JSON）、`AllAssetGroupName()`、
`InventoryBlockedOrLimitedCustomized`、`InventoryIsPermissionBlocked`

**角色查找**
`ChatRoomGetCharacter(num)`、`ChatRoomCharacter`、`ChatRoomCharacterIsAdmin(char)`、
`charFromMemberNumber`、`charFromName`、`getCharByName`、`getCharacterObject`、
`FindPlayer`（自己按骨架实现）

**穿戴预设与恢复**
`dressLike(char, dress, color, …)`（doll / doll2 / talkingDoll / maid / cow / pony / pony elegant /
pony race / cat / kitty / puppy / dog / trainer / trainer sub / mistress / concubine）、
`dollify` / `dollifyAll`、`memorizeClothing` + `reapplyClothing`、`free(char)` / `freeAll()`、
`copyDress` / `pasteDress`

**判定**
`isExposed`、`customInventoryGroupIsBlocked`、`InventoryPrerequisiteMessage`、
`SpeechGetGagLevel`、`IsInZone` / `IsAtTile` / `IsInXxYBlock` / `IsInCrossArea` / `GetDistance`
（后一组见 `BOT - ChaosArena.js`，可搬运）

**牵绳与踢人**
`HoldLeash(char)` / `StopHoldLeash(char)`、`wearLeash(char)`（本质是 `Content:"HoldLeash"` 的 Hidden 消息）、
`ChatRoomAdminChatAction("Kick", String(memberNumber))`、
`ServerSend("AccountUpdate", { Description })`

## 6. 常见坑（写作时逐条自查）

1. `ChatRoomMapViewSyncMapAdd` 对 `char.IsPlayer()` **提前 return** → 不要指望它触发 bot 自身移动。
2. `CommonBotAssets.js:9-11` 的 `ChatRoomSyncMapDataeAdditionDict` 拼写不一致（判断变量少个 `e`），
   判断恒失效。新 bot 不要依赖该判断，必要时自行兜底初始化：
   `if (typeof ChatRoomSyncMapDataeAdditionDict === 'undefined') ChatRoomSyncMapDataeAdditionDict = {}`。
3. `char.MapData` 在刚进场时可能为 `undefined` → 取 `Pos` 前必须判空。
4. 判定进入/离开区域必须用 `Pos`（当前）对比 `pverPos`（上一次），只用 `Pos` 会重复触发。
5. `SendText` 默认等待 2 秒；批量发消息必须传 `isWait = false`，并在循环内 `await sleep(100)` 防刷屏。
6. `Teleport` 失败只 `console.log` 不抛错 → 不能靠它判断是否成功；房主权限要先查。
7. `WearEquips` 内部逐件 `await sleep(100)` 做 craft → 不要在关键帧密集调用。
8. 装备 `TypeRecord` 是扩展物品参数（`typed` / `g` / `p` / `s` / `m` …），漏写会退化成默认外形；
   `ItemProperty` 决定 `OverridePriority`、锁定、`Text` 等。
9. 改地图后不发 `ChatRoomAdmin … Action:"Update"` → 其他客户端看不到改动。
10. 不要复制 `CommonBotAssets.js` 的内容进 bot 文件；例外是
    `BOT - LeashDroneHelper.js` 那种显式声明「不需要加载 CommonBotAssets」的独立脚本。
11. 调试日志统一加命名空间前缀：`console.log("[MyBot]", ...)`。
12. 同一房间不要一次部署多个 bot（README 明确要求）。

## 7. 交付流程

1. 先 `read` 相关现有文件（至少 `CommonBotAssets.js` + 一个同类 `BOT - *.js`），禁止凭记忆写 API。
2. 输出文件命名：`BOT - <名称>.js`，UTF-8 无 BOM，中文 UI 文案与现有风格一致。
3. 自检清单：
   - [ ] 骨架完整（事件注册 → 指令分发 → 移动处理 → `InitBot`）
   - [ ] 只调用第 5 节已验证 API
   - [ ] 装备字段与地图字符串长度合法
   - [ ] 批量消息限速
   - [ ] 末尾 `InitBot()` 只出现一次
   - [ ] 指令说明已写入 `Player.Description`
4. 交付时说明：是否需要房主身份？是否需要玩家侧插件（Hidden 协议）？哪些是未实现的占位点？
