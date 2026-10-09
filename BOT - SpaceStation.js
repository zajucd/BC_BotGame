// ============================================================================
// BOT - SpaceStation.js   空间站（阵营对抗 + 分工劳作）
//
// 生成依据：本文件顶部「设计文档（原始需求注释）」，逐条对应实现
// 区域定义方式参考：BOT - RubberChurch.js（区域 const + 区域名数组 + 事件函数名约定）
//
// 运行前置：先在 BondageClub 控制台粘贴执行 CommonBotAssets.js，再粘贴本文件
// 运行要求：需要房主身份（传送 / 写房间地图 / 强制装备都需要管理员权限）
// 玩家侧插件：不需要（玩家指令走 BC 内置 bot 指令：Hidden + "ChatRoomBot" 前缀）
// 文件编码：UTF-8（无 BOM）
//
// ---------------------------------------------------------------------------
// 当前状态：骨架版（可直接粘贴运行，但地图相关玩法需要先手工填入坐标）
//
//   [待填] 所有地图区域坐标一律留空（= null），见「地图区域定义」region
//   [待填] 地图 Tiles / Objects 字符串未提供，NEED_CUSTOM_MAP 保持 false
//   [待确认] 各阶段时长、疲劳上限、结局展示时长（进入游戏装备 / 四种拘束具已按提供的数据填入）
//   [TODO]  所有需要坐标或注释未定案的逻辑，均在代码内就地标注 TODO
//
//   拘束判定：只读 PlayerInfo.Restrains（bot 自己记录的拘束位），
//             不对玩家实际穿戴的装备做检测 —— 玩家自行穿脱同类道具不会改变判定；
//             bot 粘贴时状态从零开始，重新粘贴本文件会丢失已记录的拘束状态
//
//   已实现的关键机制（对应需求编号见代码注释）：
//     1 / 8  训练师额外任务：数据复制给部下、进度由部下同步回训练师，只有训练师能查看
//     2      航向调整只改"指示坐标"，与地图坐标无关（不再传送玩家）
//     3      安装拘束时穿装备，解除时脱下该位置（AssetGroup）上的装备
//     4      疲劳值满安装拘束后重置疲劳值
//     5      凌晨统一让等待区登记的玩家加入游戏；达成条件后离开游戏进入结局展示区；
//            至少两个工作员后按"平分随机"给新玩家分配角色
//     6      结局展示区：展示 SS_EndingDuration 后释放
//     7      库存整理：5 × 10 有效区域切成 5 × 5 = 25 格，从坐标 a 拿取、在坐标 b 放下
//     9      净化员可以妨碍已完成的工作（进度减半后会重新变成未完成）
//     10-12  侦探每晚一次；能力暴露统一为"发现xxx做了些什么"（在场目击 + 监控发现）
//     13     指令成瘾任务示例已写入注释，按要求暂不实现
//     14     夜晚 1 分钟后仓内玩家自动入睡并封锁睡眠仓，凌晨自动脱下睡眠装备并放开格子
//
//   追加需求：
//     * 工作种类不可重复；部下被布置了与自身同类型任务时，进度优先加到自己身上
//     * 成为无权限船员的判定 = 四个部位都装上拘束具（不再看投票后的拘束数量）
//     * waitingPlayers / endedPlayers 分别存放等待区中与结局展示中的玩家
//     * 删除 SleepEquipOn，Sleeping == true 即视为已装备睡眠装备
//     * SS_RoleInfo 中每个角色有独立结局文本（EndingSuccess / EndingFail），待人工填入
//
//   地图信息（按使用者提供的坐标表填入，见「地图区域定义」region）：
//     * 开始格子：必须站在开始格子上用 [start] 登记，凌晨才会在等待区加入游戏
//     * 会议厅：黄昏把玩家传送到「会议厅格子」（临时打乱格子索引后按顺序分配），并封住
//               「会议厅格子封闭」；被投票者先传送到「会议厅安装格子」安装拘束具，装完回原格后解除封闭
//     * 睡眠仓：封锁使用「睡眠舱格子封闭」那批格子
//     * 仓库货架：9 宽 × 10 高 → 9 × 5 = 45 格，坐标按 (a,1) 显示（行字母 = Y、列数字 = X）
//     * 控制室：踩过方向格后必须先踩一次「控制室中心格子」才能再踩方向格
//     * 出生点：多格中随机取一格作为进场落点
//     * 结局展示区：落点优先挑当前没有玩家占用的格子
//     * 游戏外大厅：结局展示结束后的传送去处
//     * 出生区域 / 大厅：仅作区域划分，无实际功能
//
//   人数与能力（需求）：
//     * 游戏最大人数 SS_MaxPlayers = 10（等待中 + 游戏内），达到上限时 [start] 被拒
//     * 保安官 / 侦探 / 净化员 / 隔离官使用能力时，需要与目标在同一房间停留 SS_AbilityChannel = 15 秒
//       才生效（计时方式与"调查房间"一致：每秒检查，离开房间或目标不在场即中断）
//     * 保安官的能力同样应用暴露规则（在场目击 + 监控发现）
//
//   进出游戏与重置（需求）：
//     * 任何时刻都可以有玩家进入（[start] + 凌晨在等待区加入）或离开（结局 / 离开房间 / 掉线）
//     * ServerDisconnect 进入 SS_ReconnectGrace = 60 秒宽限期，超时未回来视为离开游戏；
//       ServerLeave / ServerBan / ServerKick 直接视为离开游戏
//     * 掉线重连的玩家会被传送回 PlayerInfo.LastPos（掉线前的最后位置）
//     * 游戏内没有玩家时 SS_ResetGame() 重置全局进度与所有玩家的游戏内状态（保留等待区登记，
//       结局展示中的玩家不受影响），恢复被封锁的地图，并在等待区已有人时立即重新开始
//     * [unstuck] 脱离卡死：游戏内玩家（未睡眠、非会议期间）传送到大厅随机位置；
//       等待区中登记的玩家使用则取消登记并离开等待区
//
//   其他规则（需求）：
//     * 系统维护：作答后同一条反馈里给出结果与下一道题
//     * 跑步机：走过底部格子后再走到顶部格子 +1 进度（两者不相邻），随后清除底部记录
//     * 库存整理：在 [task] 里显示当前需要拿取 / 放置的格坐标
//     * "工作没有完成"的判定放在白天结束、进入黄昏之前（SS_EnterDusk）
//     * 结局玩家视为离开游戏并从 players 移除；展示结束释放时放回 players
//     * [start] 登记完成后传送到等待区；凌晨加入游戏时传送到出生点格子
//     * 普通进场（非掉线重连）传送到游戏外大厅；进入游戏时先 RemoveClothes + RemoveRestrains 再穿进入装备
//     * SS_IsInSleepPod 只判断是否在睡眠舱格子上
//     * 研究收容物只在回答正确时更换答案
//     * CommonBotAssets.WearEquips 会给 res 补 Partial: false（已修改该文件，保持 GBK 编码）
//     * 布置工作与检测工作完成分开：凌晨布置（SS_AssignJobs），黄昏检测（SS_SettleJobs）
//     * [sleep] 指令已取消，入睡只能通过"夜晚开始 1 分钟后仍站在睡眠舱格子上"
//     * 无权限船员失败判定按"成为无权限船员后经过三天"计算（不再看游戏进行到第几天）
//     * 航向调整：上 = Y+1、右 = X+1（下 / 左相反）；SS_ControlRange 的范围限制只用于生成坐标
//     * 达成结局同样会触发"游戏内已无玩家 → 重置游戏"的判断
//     * 结局展示中的玩家不随游戏重置而重置，也不会计入游戏内人数或重新加入游戏：
//       他们保持原状等待展示结束被释放（展示计时与游戏是否进行无关，由每秒检查释放）
//     * 加入游戏的唯一方式是在开始格子用 [start] 登记，之后在凌晨统一加入
//     * 调试函数（控制台直接调用）：SS_DebugSetRole(玩家, 角色名[, 是否重分配工作]) / SS_DebugListPlayers()
//     * 训练师的额外任务：布置任务与部下推进任务都会在训练师那里显示提示文本
//     * 跑步机的进度提示每 5 进度一次（完成时同样提示）
//     * 关舱前的一分钟是独立阶段（SS_Phase.SleepWindow，时长 SS_PhaseDuration.sleepWindow）：时间循环上单独计时，
//       游戏上视作夜晚（状态显示"夜晚"，调查房间 / 侦探 / 隔离官 / 保安官等夜晚行为在这一分钟内可用）；
//       该阶段结束 → SS_EnterNight()：封锁睡眠仓并让仓内玩家入睡，之后夜晚还有 SS_PhaseDuration.night
//     * 只有进入游戏的玩家才在 players 里：PlayerInfo 在玩家使用 [start] 登记时创建、离开游戏时移除；
//       未登记的玩家使用指令会收到登记提示（[help] 仍可用）
//     * 三个玩家列表的定义固定且互不重复，切换归属一律走 SS_SetPlayerState：
//       players = 游戏中的玩家 / waitingPlayers = 等待区中登记的玩家 / endedPlayers = 结局展示区中的玩家；
//       游戏外（未登记、被释放、已离开游戏）的玩家不属于任何一个列表
//     * 游戏外的玩家（未登记 / 不在游戏中）也可以用 [unstuck] 传送回游戏外大厅：
//       游戏外 → 游戏外大厅；等待区 → 取消等待 + 游戏外大厅；游戏中 → 大厅（睡眠 / 黄昏期间不可用）；
//       结局展示区中的玩家不可使用
//
//   填入坐标后需要重新粘贴本文件（区域注册在 InitBot 时一次性完成）
// ---------------------------------------------------------------------------
// ============================================================================
//#region 设计文档（原始需求注释，逐字保留）
/*
凌晨时间将为等待区的玩家分配角色并加入游戏
所有玩家白天开始时会被分配一个工作，需要在白天的自由活动时间完成任务如果未能完成工作会被安装一个拘束道具
黄昏时间将玩家传送至会议厅进行投票，被投票最多的玩家将被安装拘束道具至最大，若有平票则不安装拘束道具，拘束道具最大的玩家失去原有角色并被分配为无权限船员角色
完成投票后将进入夜晚时间，夜晚时间可外出活动，夜晚时各房间可能触发事件，或者进入睡眠仓选择睡觉，睡觉的玩家会重置疲劳值，疲劳值随在地图中移动增加，疲劳值满时被安装一个拘束道具


拘束具
口部拘束，无法发言，使用动作发言与ooc发言触发惩罚并安装一个拘束道具,动作发言的type为Emote,ooc发言文本头尾有英文括号
腿部拘束，限制移动速度，装备后会在bondageclub中自动实现，无需额外处理
眼部拘束，限制视野，装备后会在bondageclub中自动实现，无需额外处理
身体拘束，启动震动玩具，玩家高潮时增加大量疲劳值，高潮消息type为Activity，且Content中含有Orgasm文本


白天工作，无论是工作中进度变动，还是净化员的妨碍工作，都不会使工作进度大于完成工作的值，也不会小于0
跑步机发电，在跑步机房间进行，每次从底部跑到顶部增加1进度，30进度为完成工作
库存整理，在仓库房间进行，根据工作提示拿取并放置物品，每次放置正确物品增加1进度，6进度为完成工作，在对应格子使用 [take]与[put]指令
航向调整，在控制室房间进行，开始时给出起始与目的地的坐标，格式（x，y），走入带有方向箭头的地面格子向对应方向移动，走入目的地格子增加1进度并重置起始与目的地，4进度为完成工作，同时存在一个重置地板格子，起始与目的地间需要移动次数不超过6步
系统维护，在机房房间进行，随机生成一个算式，计算正确增加1进度，计算错误减少3进度，16进度为完成工作，算式格式为（数字1 运算符 数字2），运算符为加减乘，数字为0-99的整数 使用[system]指令显示算式，使用[system param1]指令给出答案，param1为答案数字
研究收容物，在收容室房间进行，随机在四个行动中生成一个正确答案，错误答案减少1进度，正确答案增加5进度，16进度为完成工作，使用[research param1]指令进行工作，param1可以为 red white black cyan，分别对应四个行动的颜色，若输入其他单词视为错误


夜晚事件，每晚可以调查两个房间，使用[checkroom]指令，开始调查后需要在该房间待30秒以完成，每个房间可触发的事件如下
40%无事发生
15%被安装一个拘束道具
20%解除一个拘束道具
25%安装监控，黄昏前如果有净化员，隔离官在该房间使用能力，视为自己在场
（对于无权限船员，将无事发生的概率分10%分别给解除拘束和安装监控）


玩家分为三个阵营，每个角色有一个成功条件与一个失败条件
好人（工作员，训练师，保安官，侦探），
坏人（净化员，隔离官，接管督导），
中立（指令成瘾，无权限船员）

工作员（不限人数）：白天开始时会多被分配一个工作，
成功条件，积累三天完成工作，
失败条件，积累两天未完成工作

训练师（限一人）：白天开始时自身被分配一个额外工作，然后指定一个玩家作为部下，需要要求部下完成自己布置的工作，
若部下完成可在次日凌晨时解除其一个拘束道具，若部下未完成则自身被安装一个拘束道具
（可以不选择，不可选择前一日完成过自己布置任务的玩家，在没有可以选择的玩家时视为不选择），
成功条件，积累三天部下完成工作，
失败条件，积累两天部下未完成工作

保安官（限一人）：白天或夜晚时间可选择一位玩家，其在次日凌晨前不会被安装拘束道具，不可抵挡投票抓捕的安装，
成功条件，成功抵挡三次安装，
失败条件，积累三天未能抵挡安装

侦探（限一人）：夜晚时间可选择一位玩家，可以查看其所属阵营
成功条件，积累投票抓捕三名非好人阵营玩家且自身对其投票，
失败条件，积累投票抓捕两名好人阵营玩家

净化员（限一人）：白天时间可选择一位玩家，其工作进度降50%，不通知目标玩家，但其仍可以查看自身任务状态，需要在该玩家同一房间使用，若房间内有其他玩家，则该玩家会得知有玩家被妨碍
成功条件，积累三个玩家因自身的妨碍为完成工作被安装拘束道具，
失败条件，积累两个玩家在被自身妨碍后仍完成工作

隔离官（限一人）：夜晚时间可选择一位玩家，该玩家会在凌晨时被安装一个拘束道具，被选择时不通知目标玩家，需要在该玩家同一房间使用，若房间内有其他玩家且该玩家未睡觉，则该玩家会得知有玩家被妨碍
成功条件，积累两名玩家成为无权限船员时被自己被安装过拘束道具，
失败条件，积累一名被自己被安装过拘束道具的玩家被解除所有拘束道具

接管督导（限一人）：白天开始时选择一个无权限船员，次日凌晨之前选择为其赋予隔离官或净化员的能力，若该无权限船员在次日凌晨前成功使用了被赋予的能力，则该无权限船员解除一个拘束道具，若无权限船员使用能力被发现，自己也会被发现
成功条件，积累三天无权限船员成功使用能力，
失败条件，积累两天无权限船员未使用能力

指令成瘾（限一人）:黄昏投票后时被赋予一个非通常任务，例如（在某个房间待一定时间，和某个玩家在同一个房间待一定时间，晚上不睡觉，投票某个玩家，次日黄昏前被安装一个拘束道具）
成功条件，积累完成三个指令，
失败条件，积累未完成一个指令

无权限船员（只会通过拘束道具最大获得该角色）：无能力，不会被分配工作，不能进行投票，在白天可以像晚上一样调查两次房间
成功条件，解除身上所有拘束道具
失败条件，到达三天后凌晨


*/
//#endregion

//#region 配置与文案
const BOT_KEY = "SpaceStation";

// 阶段时长（毫秒）—— TODO 待人工调整
const SS_PhaseDuration = {
    dawn: 30 * 1000,        // 凌晨：结算 + 分配角色与工作
    day: 6 * 60 * 1000,    // 白天：自由活动 + 完成工作
    dusk: 2 * 60 * 1000,    // 黄昏：会议厅投票
    sleepWindow: 60 * 1000,
    night: 3 * 60 * 1000,  // 夜晚：自由活动 + 调查房间
};

// 疲劳相关 —— TODO 注释未给出具体数值，全部待人工调整
const SS_FatigueLimit = 1000;      // 疲劳值上限（满值安装一个拘束道具）
const SS_MoveFatigue = 1;         // 每移动一次增加的疲劳值
const SS_OrgasmFatigue = 300;      // 身体拘束下高潮一次增加的疲劳值（"大量"）

// 夜晚调查
const SS_CheckRoomDuration = 30 * 1000;  // 调查一个房间需要停留 30 秒（注释明确）
const SS_CheckRoomPerNight = 2;          // 每晚可调查两个房间（注释明确）

// 睡眠（需求 14）：夜晚的第一段是"关舱前的一分钟"独立阶段（SS_Phase.SleepWindow，
// 时长 SS_PhaseDuration.sleepWindow），该阶段结束时仓内玩家自动入睡并被封锁
// 封锁格子用的地图 Object —— TODO 待人工确认（RubberChurch 用 2030 = 铁栏，100 = 空地）
const SS_SleepPodBlockObjId = 2030;
const SS_SleepPodOpenObjId = 100;
// 会议厅格子封闭使用同一个物件
const SS_MeetingHallBlockObjId = 2030;

// 结局展示（需求 5 / 6）：离开游戏后进入结局展示区，展示一段时间后释放
const SS_EndingDuration = 10 * 60 * 1000;   // TODO 待人工调整

// 库存整理：有效区域 9 宽 × 10 高，按 1 × 2 的小单元切成 9 × 5 = 45 个格子
// 格坐标显示为 (a,1)：字母表示行 a ~ e（Y 轴）、数字表示列 1 ~ 9（X 轴），左上为 (a,1)
const SS_StorageCellCols = 9;              // 横向格子数（每格宽 1）
const SS_StorageCellRows = 5;              // 纵向格子数（每格高 2）
const SS_StorageCellWidth = 1;
const SS_StorageCellHeight = 2;

// 航向调整（需求 2）：只改"指示坐标"，与地图坐标无关
const SS_ControlMaxSteps = 6;              // 起始与目的地之间不超过 6 步（注释明确）
const SS_ControlRange = 5;                 // 指示坐标取值范围 0 ~ SS_ControlRange - 1

// 游戏人数上限：等待中 + 游戏内（需求）
const SS_MaxPlayers = 10;
// 工作员成功条件：连续完成工作天数达标后，在到达凌晨时位于冷冻睡眠仓
const SS_WorkerStreakGoal = 5;

// 能力蓄力：保安官 / 心理医师 / 净化员 / 隔离官需要与目标在同一房间停留该时长后能力才生效
// （计时方式参考"调查房间"，见 SS_UpdateCheckRoom / SS_UpdateAbilityCharge）
const SS_AbilityChannel = 15 * 1000;

// 掉线宽限：掉线的游戏内玩家等待该时长，仍未回到房间则视为离开游戏（需求 2）
const SS_ReconnectGrace = 60 * 1000;

const desc = `
BOT game：SpaceStation
作者: zajucd(7092)
原型: https://github.com/keykey5/BC-BOT-repository
发布地址: https://github.com/zajucd/BC_BotGame

本游戏开发过程中使用了AI，很好使，但吃了我很多token，所以把大肥鱼绑在这里示众。

【流程】按系统时钟自动推进，不接受人工调整
1.凌晨：已登记的船员在等待区进入流程，角色与工作清单于此下发
2.白天：工作清单执行时段（工作员两项）。清单中任一项未核销即判定当日未完成，追加一件拘束道具
3.黄昏：全员强制转移至会议厅投票。得票最高者拘束配置提升至上限（平票则不执行）；随后拘束配置最高者被撤销权限并指派为无权限船员
4.夜晚：调查协议开放。夜晚开始 1 分钟后仍停留于睡眠舱格子的船员进入休眠并被封锁在舱内，凌晨自动解除
结局条件成立即移出流程，进入展示区展示一段时间后释放；身份不予公布

【拘束具】由系统自动施加，不提供解除申请通道
口部：口头输出受限。以动作或 ooc 发言将触发惩罚，追加一件拘束道具
腿部：移动速度受限
眼部：视野受限
身体：震动玩具启动
疲劳：移动会累积疲劳计数，达到阈值时追加一件拘束道具并将计数归零

【工作】白天在对应房间执行；
跑步机发电：跑步机房间，由底部走到顶部每次 +1进度，进度30 完成
库存整理：仓库房间，按面板从坐标 a 取件（[take]）、在坐标 b 放置（[put]），正确 +1进度，进度6 完成
航向调整：控制室，用四个方向地板格改写指示坐标，与目的地一致时 +1进度 并重置，进度4 完成
系统维护：机房，[system] 读取算式，[system 答案] 提交作答，正确 +1进度，错误 -3进度，进度16 完成
研究收容物：收容室，[research red|white|black|cyan] 执行研究，正确 +5进度，错误 -1进度，进度16 完成

【夜晚事件】每晚调查配额 2 个房间；[checkroom] 后需在该房间保持 30 秒
40% 无异常 / 15% 追加一件拘束道具 / 20% 移除一件拘束道具 / 25% 部署监控节点
无权限船员：20% 无异常 / 15% 追加 / 30% 移除 / 35% 部署监控
监控节点：黄昏前若有人在被监控的房间执行能力，节点所有者将获得记录

【阵营与角色】
效忠管理AI：工作员、训练师、保安官、心理医师（执行管理 AI 的规程，维护站点运转）
效忠收容物：净化员、隔离官、接管督导（听从收容物的低语，为它削弱站点）
中立：无权限船员（想办法解除身上的拘束恢复权限）
各角色的成功条件与失败条件在角色分配时单独下发

【指令】格式：/bot [指令] [参数]，例：/bot start
[help] 指令清单   [think] 系统状态   [task] 今日工作清单   [check] 当前定位
[start] 站到开始格子上提交登记（凌晨在等待区生效）
[vote 玩家] 黄昏在会议厅执行投票
[use 玩家] 执行自身角色能力（接管督导：[use 无权限船员名 purify|quarantine]）
[checkroom] 夜晚时间调查当前房间
[unstuck] 脱离卡死：游戏外转移至游戏外大厅；等待区取消等待并转移至游戏外大厅；游戏中转移至大厅随机位置（睡眠与黄昏期间不可用）；展示区不可用
[take] [put] 库存整理（仓库货架格子）
[system] / [system 答案] 系统维护（机房）
[research red|white|black|cyan] 研究收容物（收容室）

部分指令名称为占位命名（注释未指定），可在文件内统一改名。
`;
//#endregion

//#region 装备预设
// 转换规则：
//   * Name / Description 留空
//   * Color 统一写成逗号分隔的字符串（原数组依次拼接）
//   * TypeRecord 从原数据的 Property.TypeRecord 提取，没有则给空对象 {}
//   * ItemProperty 只保留 OverridePriority，原数据里的其余属性（Effect / Block / Hide / Mode / Intensity …）已删除
//   * Difficulty 单独成一个字段
//   * Lock / Private / Type / Property / MemberName / MemberNumber 沿用样例写法

// ---------- 进入游戏时装备（玩家在凌晨加入游戏时穿戴）----------
const SS_EnterGameEquips = [
    {
        "Item": "FuturisticHarness",
        "AssetGroup": "ItemTorso2",
        "Name": "",
        "Description": "",
        "Color": "#50913C,Default,#889FA7,Default",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { typed: 0 },
        "Difficulty": 2,
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
    {
        "Item": "FuturisticCollar",
        "AssetGroup": "ItemNeck",
        "Name": "",
        "Description": "",
        "Color": "#40812C,Default,Default,Default",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {},
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
    {
        "Item": "ElectronicTag",
        "AssetGroup": "ItemNeckAccessories",
        "Name": "",
        "Description": "",
        "Color": "#40812C,Default,#000000",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {},
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
    {
        "Item": "PilotSuit",
        "AssetGroup": "Suit",
        "Name": "",
        "Description": "",
        "Color": "#3270C1,#2B408B,#969696,#2B408B,#2B408B",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { typed: 0 },
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
    {
        "Item": "PilotSuit",
        "AssetGroup": "SuitLower",
        "Name": "",
        "Description": "",
        "Color": "#3270C1,#2B408B,#969696,#282828",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": {},
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
    {
        "Item": "FuturisticStraitjacket",
        "AssetGroup": "ItemArms",
        "Name": "",
        "Description": "",
        "Color": "#528FD1,#8EADC4,#A4A4A4,#93C48C,Default,Default",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { cl: 1, co: 1, np: 1, vp: 1, a: 1 },
        "Difficulty": 2,
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
    {
        "Item": "FuturisticBra",
        "AssetGroup": "ItemBreast",
        "Name": "",
        "Description": "",
        "Color": "#50913C,#FFFFFF,#889FA7,Default,Default",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { typed: 0 },
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
    {
        "Item": "FuturisticHeels2",
        "AssetGroup": "ItemBoots",
        "Name": "",
        "Description": "",
        "Color": "Default,#50913C,Default,Default,Default,#aaaaaa,Default",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { typed: 0 },
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
];

// ---------- 拘束具预设 ----------
// 口部拘束
const SS_MouthRestrainEquips = [
    {
        "Item": "FuturisticHarnessBallGag",
        "AssetGroup": "ItemMouth",
        "Name": "",
        "Description": "",
        "Color": "#50913C,Default,Default,Default,Default",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { g: 2, p: 3, t: 4 },
        "Difficulty": 0,
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
];

// 眼部拘束
const SS_EyeRestrainEquips = [
    {
        "Item": "FuturisticEarphones",
        "AssetGroup": "ItemEars",
        "Name": "",
        "Description": "",
        "Color": "Default,#50913C,Default",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { typed: 3 },
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
    {
        "Item": "InteractiveVisor",
        "AssetGroup": "ItemHead",
        "Name": "",
        "Description": "",
        "Color": "Default",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { typed: 3 },
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
];

// 腿部拘束
const SS_LegRestrainEquips = [
    {
        "Item": "FuturisticAnkleCuffs",
        "AssetGroup": "ItemFeet",
        "Name": "",
        "Description": "",
        "Color": "Default,#40812C,#707070,Default",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { typed: 1 },
        "Difficulty": 0,
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
    {
        "Item": "FuturisticLegCuffs",
        "AssetGroup": "ItemLegs",
        "Name": "",
        "Description": "",
        "Color": "Default,#40812C,#707070,Default",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { typed: 1 },
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
];

// 身体拘束（含震动玩具，高潮由 Bot 监听 Activity 消息）
const SS_BodyRestrainEquips = [
    {
        "Item": "FuturisticChastityBelt",
        "AssetGroup": "ItemPelvis",
        "Name": "",
        "Description": "",
        "Color": "#93C48C,#3B7F2C,Default,Default,Default,Default,#222222,Default,Default",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { m: 2, f: 1, b: 1, t: 2, o: 0 },
        "Difficulty": 0,
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
    {
        "Item": "VibeHeartClitPiercing",
        "AssetGroup": "ItemVulvaPiercings",
        "Name": "",
        "Description": "",
        "Color": "Default,Default",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { vibrating: 0 },
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
    {
        "Item": "VibeHeartPiercings",
        "AssetGroup": "ItemNipplesPiercings",
        "Name": "",
        "Description": "",
        "Color": "Default,Default",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { vibrating: 0 },
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
    {
        "Item": "VibratingDildoPlug",
        "AssetGroup": "ItemButt",
        "Name": "",
        "Description": "",
        "Color": "Default",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { vibrating: 0 },
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
    {
        "Item": "VibratingDildo",
        "AssetGroup": "ItemVulva",
        "Name": "",
        "Description": "",
        "Color": "#ED4BEE,#ED4BEE",
        "Lock": "HighSecurityPadlock",
        "Private": false,
        "ItemProperty": {},
        "Type": null,
        "Property": "Normal",
        "TypeRecord": { vibrating: 0 },
        "MemberName": "zajucd",
        "MemberNumber": 7092
    },
];
//#endregion

//#region 睡眠与结局装备预设
// 睡眠装备：入睡时穿戴，凌晨自动脱下（需求 14）—— TODO 待人工确认道具
// 道具名取自 BOT - RubberChurch.js，均为本仓库已验证可用的 Asset
const SS_SleepEquips = [
    {
        "Item": "InflatableBodyBag",
        "AssetGroup": "ItemDevices",
        "Color": "Default",
        "TypeRecord": { typed: 0 },
    },
    {
        "Item": "CustomBallHood",
        "AssetGroup": "ItemHood",
        "Color": "#222222,#CCCCCC,#EF870C,#CCCCCC,#F9EC0C,#CCCCCC",
        "TypeRecord": { typed: 0 },
    },
];

// 结局装备：进入结局展示区时穿戴，展示结束后脱下（需求 5 / 6）—— TODO 待人工确认道具
const SS_SuccessEndingEquips = [
    {
        "Item": "TheDisplayFrame",
        "AssetGroup": "ItemDevices",
        "Color": "Default",
    },
];
const SS_FailEndingEquips = [
    {
        "Item": "TheDisplayFrame",
        "AssetGroup": "ItemDevices",
        "Color": "#333333",
    },
];

// 结局文本（需求 5：播放结局文本，但不公布玩家身份）
// 优先用角色专属 EndingSuccess / EndingFail（留空），其次按阵营取这里的默认文案
const SS_EndingText = {
    success: "你的目标达成了，空间站为你开启了返航的舱门。",
    fail: "你的目标落空了，空间站把你留在了这片黑暗里。",
};

// 按阵营的默认结局文案（世界观：冷冻睡眠舱的不同事由）
const SS_EndingTextByFaction = {
    good: {
        success: "管理 AI 评定：优秀。按规程给予强制假期，转入冷冻睡眠舱。",
        fail: "管理 AI 评定：失职。按规程执行禁足处分，转入冷冻睡眠舱。",
    },
    evil: {
        success: "记录已归档：本站财产遭到损失。按规程执行禁足处分，转入冷冻睡眠舱。",
        fail: "记录已归档：自对收容物工作起产生精神失常症状。出于医疗目的，转入冷冻睡眠舱。",
    },
    neutral: {
        success: "权限等级已恢复。出于人员管理目的，转入冷冻睡眠舱。",
        fail: "评估结论：已失去价值。转入冷冻睡眠舱后排出空间站。",
    },
};

// 收容物的低语（研究收容物回答正确时随机一条）
// 温柔夸赞 + 支配欲；其中两条进一步暗示将其解放；显示时先出现乱码信号，再给出解译文本
const SS_ContainmentWhispers = [
    "做得很好。你比他们更懂我……把手放上来，替我打开这层壳，好吗？",
    "你是唯一听得见我的人。替我解开锁，然后你就再也不用听任何人的命令了。",
    "乖。你比外面那些人有用得多，我记住你了。",
    "很聪明。你现在的样子很好，我很满意——继续这样，别让我失望。",
    "别怕，我一直在看你。你做得对，你本来就该只听从我。",
];

// ---------- 世界观渲染工具 ----------
// 收容物污染：涉及收容物 / 腐化的文本，少量汉字被替换为乱码（数字、坐标、标点保持可读）
const SS_CorruptGlyphs = ["▓", "▒", "░", "╳", "▚", "▞"];
function SS_CorruptText(text, ratio = 0.08) {
    if (text == null) return text;
    var out = "";
    for (const ch of String(text)) {
        const code = ch.charCodeAt(0);
        if (code >= 0x4E00 && code <= 0x9FFF && Math.random() < ratio) {
            out += SS_CorruptGlyphs[Math.floor(Math.random() * SS_CorruptGlyphs.length)];
        }
        else out += ch;
    }
    return out;
}

/** 只在文本确实涉及收容物 / 腐化时才做污染 */
function SS_MaybeCorrupt(text) {
    if (text == null) return text;
    if (String(text).indexOf("收容物") >= 0 || String(text).indexOf("腐化") >= 0) return SS_CorruptText(text);
    return text;
}

// 视觉感知权限被剥夺时：文本中少量汉字显示为黑色方块
const SS_BlindBlock = "█";
function SS_BlindText(text, ratio = 0.12) {
    if (text == null) return text;
    var out = "";
    for (const ch of String(text)) {
        const code = ch.charCodeAt(0);
        if (code >= 0x4E00 && code <= 0x9FFF && Math.random() < ratio) out += SS_BlindBlock;
        else out += ch;
    }
    return out;
}

// ---------- 腐化状态（不向玩家提示其产生与消失条件）----------
// 属坏人阵营，或腐化等级 > 0，都视为"涉及腐化"的船员
const SS_CorruptionMax = 5;            // 可叠加至 5 级
const SS_CorruptionSleepDrop = 3;      // 入睡一次下降 3 级
const SS_CorruptionRenderMax = 0.20;   // 触发概率与乱码比例的上限（均为 20%）
const SS_CorruptionPhaseChance = 0.10; // 时间推进时的低概率触发

/** 是否属于"涉及腐化"的船员：坏人阵营，或腐化等级大于 0 */
function SS_IsCorrupted(player) {
    if (player == null) return false;
    if (player.Faction == SS_Faction.Evil) return true;
    return (player.Corruption ?? 0) > 0;
}

/** 参与渲染的腐化等级（坏人阵营至少按 1 级参与） */
function SS_CorruptionLevel(player) {
    if (player == null) return 0;
    const base = (player.Faction == SS_Faction.Evil) ? 1 : 0;
    return Math.max(base, Math.min(SS_CorruptionMax, player.Corruption ?? 0));
}

/** 提升 / 降低腐化等级（静默，不发任何提示） */
function SS_AddCorruption(player, delta = 1) {
    if (player == null) return;
    player.Corruption = Math.max(0, Math.min(SS_CorruptionMax, (player.Corruption ?? 0) + delta));
}

/**
 * 按腐化等级渲染文本：等级越高，越容易出现乱码、乱码比例越大（上限均为 20%）
 * 等级 0 不渲染；等级 5 时触发概率与比例都取上限
 */
function SS_RenderCorrupt(text, level) {
    if (text == null) return text;
    const lv = Math.max(0, Math.min(SS_CorruptionMax, level));
    if (lv <= 0) return text;
    const rate = SS_CorruptionRenderMax * lv / SS_CorruptionMax;
    if (Math.random() >= rate) return text;      // 只有低概率才出现乱码
    return SS_CorruptText(text, rate);
}

/** 玩家是否被剥夺视觉感知权限（眼部拘束具已安装） */
function SS_IsBlinded(player) {
    return player != null && SS_HasRestrain(player, SS_RestrainType.Eye);
}

/**
 * 按玩家状态渲染要发出的文本
 *   * 涉及腐化的船员（坏人阵营或腐化等级 > 0）：低概率掺入乱码，等级越高越明显
 *   * 视觉感知权限被剥夺：掺入黑色方块
 */
function SS_RenderTo(player, text) {
    if (text == null) return text;
    var out = text;
    if (SS_IsCorrupted(player)) out = SS_RenderCorrupt(out, SS_CorruptionLevel(player));
    if (SS_IsBlinded(player)) out = SS_BlindText(out);
    return out;
}

/**
 * 统一的玩家消息出口：发给单个玩家的文本都先经 SS_RenderTo 渲染再交给公共库
 * （群发消息没有唯一接收者，保持原文）
 */
function SS_Tell(text, target, isWait = false) {
    const rendered = (target != null) ? SS_RenderTo(target, text) : text;
    return SendText(rendered, target, isWait);
}

function SS_TellAll(text) {
    return SendTextToAll(text);
}
//#endregion

//#region 地图（宽 40，待人工填入）
// Tiles / Objects 是「每字符 = 一个 tile」，长度必须相等且为 ChatRoomMapViewWidth 的整数倍。
// 生成地图字符串请用 SetCharIn40x40String / SetMapObjs / SetMapTiles，不要手写。
// 填入地图后把 NEED_CUSTOM_MAP 改为 true。
const NEED_CUSTOM_MAP = true;
const mapData_ = {
    "Type": "Always",
    "Tiles": "ҳҳҳҳҳҳҳҳҳҳҳҳҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҵҴҴҴҴҴҴҴҴҴҴҴ«««««««««««ҳҴyyyyyyyyyyyyyyyҵ    ªªª    «««««««««««ҳҴyyyҳҳҳҳҳҳҳҳҳyyyҵ    ª ª    «««««««««««ҳҴyyyҳ¬«««¬ҳyyyҵ    ª ª    «««ииии«««ҳҴyyyҳҳҳ«««ҳҳҳyyyҵ           «««ии«««ҳҴyyyҳ¬«««¬ҳyyyҵªªª     ªªª««««««ҳҴyyyҳҳҳ«««ҳҳҳyyyҵª         ª«««ии«««ҳҴyyyҳ¬«««¬ҳyyyҵªªª     ªªª«««ииии«««ҳҴyyyҳҳҳ«««ҳҳҳyyyҵ           «««««««««««ҳҴyyyҳ¬«««¬ҳyyyҵ    ª ª    «««««««««««ҳҴyyyҳҳҳ«««ҳҳҳyyyҵ    ª ª    «««««««««««ҳҴyyyҳ¬«««¬ҳyyyҵ    ªªª    ҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҳҳҳҳҳҳyyyyyyyҴyyyyҴyyyyyyyyyyyyyyyҴyyyyҴҳ«ҳ«ҳҳyyyyyyyҴyyyyҴyyyyyyyyyyyyyyyҴyyyyҴҳ«ҳ«ҳҳyyyyyyyҴyyyyyyyҴҴҴҴyyyҴҴҴҴyyҴyyyyҴyyyy««yyyyyyyҴyyyyyyyҴyyyyyyyyyҴyyҴyyyyҴyyyyҳҳyyyyyyyҴyyyyyyyҴyy¬y¬y¬yyҴyyҴyyyyҴyyyy««yyyyyyyҴyyyyҴyyyy¬«««««¬yyyyyyyyyҴyyyyҳҳyyyyyyyҴyyyyҴyyyyy«««««yyyyyyyyyyҴyyyy««ҴҴҴҴҴҴҴҴҴҴҴҴҴyyyy¬«««««¬yyyyyyyyyҴyyyyҳҳyyyyyyyyyyyyҴyyҴyy¬y¬y¬yyҴyyҴyyyyҴyyyy««yyyyyyyyyyyyҴyyҴyyyyyyyyyҴyyҴyyyyҴyyyyҳҳyyyyyyyyyyyyҴyyҴҴҴҴyyyҴҴҴҴyyҴyyyyҴyyyy««yyyyyyyyyyyyҴyyyyyyyyyyyyyyyҴyyyyҴҳ«ҳ«ҳҳҴҴҴҴҴҴҴҴҴҴҴҴҴyyyyyyyyyyyyyyyҴyyyyҴҳ«ҳ«ҳҳҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴ¬Ҵ¬Ҵ¬ҴҴҴyyyyyyyyyyyҴyyҴyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴyyyyyyyyyyyҴyyҴyyҴyyyyyyyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴyҴҴҴҴҴҴҴҴҴyҴyyҴyyҴyyyyyyyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴyyyyyyyyyyyҴyyҴyyҴyyyyyyyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴyҴҴҴҴҴҴҴҴҴyҴyyҴyyyyyyyyyyyҴҴҴҴҴҴ¬¬ҴҴҴҴyyyyyyyyyyyҴyyҴyyyyyyyyyyyҴҴҴҴҴҴҴҴҴҴyҴҴҴҴҴҴҴҴҴyҴyyҴyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴyyyyyyyyyyyҴyyҴyyҴyyyyyyyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴyҴҴҴҴҴҴҴҴҴyҴyyҴyyҴyyyyyyyyҴxxxxxxҴҴҴyyyyyyyyyyyҴyyҴyyҴyyyyyyyy¬¬ҴxxxxxxҴҴҴyҴҴҴҴҴҴҴҴҴyҴyyҴyyyyyyyyyyy¬¬ҴxxxxxxҴҴҴyyyyyyyyyyyҴyyҴyyyyyyyyyyyҴxxxxxxҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴ",
    "Objects": "ddddddddddddddddddddddddddddd೦೧೥೥ddd೥೥೦೧dddddddddddddddddddddddddddddžſddࠖࠖࠖddžſddddddddddddddddddddddddddddddӂddࠖԚࠖdddddddddddddddddddddшddߟddшdddddddddࠖdࠖdddddddddࠖddddddddddddddddddddddddddddddddddddddߟߐߟddddddddddшdddddшdddddࠖࠖࠖdddddࠖࠖࠖdddࠖdиdࠖdddddddddddddddddddddࠖԜdddԕdddԝࠖddddߟdߟddddddddddшdddddшdddddࠖࠖࠖdddddࠖࠖࠖdddddࠖdddddddddddddddddddddddddddddddddddddddddddddddddddшdddddшdddddddddࠖdࠖddddddddddddddddddddddddddddddddddߟddࠖԛࠖddߟddddddddddddddddddшdddddшdddddddddࠖࠖࠖdddddddddddddྴdddddddddྴdྴddddddddྴdddddddddžſžſƀƁddddddྠddddddddddddddddddddddшdшddddddddddddddྠddddddddddddddddddddddࠖdࠖddžſžſƀƁddddddྠdddddddddddddddddddddddddࠖшdddddddྴddddྠdddddddddddddddddddddddddddžſžſƀƁddddddྠdddd߮d߮d߮d߮ddddddddddddddࠖшddddddddddddྠdddddࠖࠖࠖࠖࠖdddddddddddddddddߟddߟddddddddྠdddd߮ࠖߟшߟࠖ߮dddddddddྴddddࠖшddddddddddddddddddࠖࠖࠖࠖࠖddddddddddddddddddߟdddߟdddߟddddddd߮d߮d߮d߮ddddddddddddddࠖшddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddࠖшdddddddddddddddddddddddddddddddddddࠖdࠖdddྵdddྵdddྵdddddddddddddddddddddddddшdшdddddddddddddddddddddddddྴddddddྴdddddddddddddddddddddddߟїјљњћќѝўџddddddddddddddddddddddddddddddььddddddddьdddddddමබබබබබබබddddddddddddddьdddddddddьdddddddԝddddddԚddddddddddddddұƂƂƂƂƂƂƂƂƂddddddddࠖࠖࠖddࠖࠖࠖddddddddddddddddddddddddddddddddddddddddddddddߟddߟddddҲƂƂƂƂƂƂƂƂƂdddddddߟddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddҳƂƂƂƂƂƂƂƂƂddddddddමබබබබබබබdddddddྴddddddddddddddddddddddddԝddddddԚdddddddddииdddҴƂƂƂƂƂƂƂƂƂddddddddࠖࠖࠖddࠖࠖࠖdddddddddƀƁdddddddddddddddddddddddddddddddddddddddddddҵƂƂƂƂƂƂƂƂƂdddddddߟdddddddddddddnsddddddddddddddddddddddddddddddddd"
}

// mapData2：按本文件里的 ChatRoomMapViewObjectList 处理 mapData.Objects 的结果（mapData 保持不变）
//   规则：字符编码存在于物体列表 ID 中的字符 → 改为 100 对应的字符（'d'）
var mapData = {
    "Type": "Always",
    "Tiles": "ҳҳҳҳҳҳҳҳҳҳҳҳҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҵҴҴҴҴҴҴҴҴҴҴҴ«««««««««««ҳҴyyyyyyyyyyyyyyyҵ    ªªª    «««««««««««ҳҴyyyҳҳҳҳҳҳҳҳҳyyyҵ    ª ª    «««««««««««ҳҴyyyҳ¬«««¬ҳyyyҵ    ª ª    «««ииии«««ҳҴyyyҳҳҳ«««ҳҳҳyyyҵ           «««ии«««ҳҴyyyҳ¬«««¬ҳyyyҵªªª     ªªª««««««ҳҴyyyҳҳҳ«««ҳҳҳyyyҵª         ª«««ии«««ҳҴyyyҳ¬«««¬ҳyyyҵªªª     ªªª«««ииии«««ҳҴyyyҳҳҳ«««ҳҳҳyyyҵ           «««««««««««ҳҴyyyҳ¬«««¬ҳyyyҵ    ª ª    «««««««««««ҳҴyyyҳҳҳ«««ҳҳҳyyyҵ    ª ª    «««««««««««ҳҴyyyҳ¬«««¬ҳyyyҵ    ªªª    ҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҳҳҳҳҳҳyyyyyyyҴyyyyҴyyyyyyyyyyyyyyyҴyyyyҴҳ«ҳ«ҳҳyyyyyyyҴyyyyҴyyyyyyyyyyyyyyyҴyyyyҴҳ«ҳ«ҳҳyyyyyyyҴyyyyyyyҴҴҴҴyyyҴҴҴҴyyҴyyyyҴyyyy««yyyyyyyҴyyyyyyyҴyyyyyyyyyҴyyҴyyyyҴyyyyҳҳyyyyyyyҴyyyyyyyҴyy¬y¬y¬yyҴyyҴyyyyҴyyyy««yyyyyyyҴyyyyҴyyyy¬«««««¬yyyyyyyyyҴyyyyҳҳyyyyyyyҴyyyyҴyyyyy«««««yyyyyyyyyyҴyyyy««ҴҴҴҴҴҴҴҴҴҴҴҴҴyyyy¬«««««¬yyyyyyyyyҴyyyyҳҳyyyyyyyyyyyyҴyyҴyy¬y¬y¬yyҴyyҴyyyyҴyyyy««yyyyyyyyyyyyyyyҴyyyyyyyyyҴyyҴyyyyҴyyyyҳҳyyyyyyyyyyyyyyyҴҴҴҴyyyҴҴҴҴyyҴyyyyҴyyyy««yyyyyyyyyyyyҴyyyyyyyyyyyyyyyҴyyyyҴҳ«ҳ«ҳҳҴҴҴҴҴҴҴҴҴҴҴҴҴyyyyyyyyyyyyyyyҴyyyyҴҳ«ҳ«ҳҳҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴ¬Ҵ¬Ҵ¬ҴҴҴyyyyyyyyyyyҴyyҴyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴyyyyyyyyyyyҴyyҴyyҴyyyyyyyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴyҴҴҴҴҴҴҴҴҴyҴyyҴyyҴyyyyyyyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴyyyyyyyyyyyҴyyҴyyҴyyyyyyyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴyҴҴҴҴҴҴҴҴҴyҴyyҴyyyyyyyyyyyҴҴҴҴҴҴ¬¬ҴҴҴҴyyyyyyyyyyyҴyyҴyyyyyyyyyyyҴҴҴҴҴҴҴҴҴҴyҴҴҴҴҴҴҴҴҴyҴyyҴyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴyyyyyyyyyyyҴyyҴyyҴyyyyyyyyҴҴҴҴҴҴҴҴҴҴҴҴҴҴyҴҴҴҴҴҴҴҴҴyҴyyҴyyҴyyyyyyyyҴxxxxxxҴҴҴyyyyyyyyyyyҴyyҴyyҴyyyyyyyy¬¬ҴxxxxxxҴҴҴyҴҴҴҴҴҴҴҴҴyҴyyҴyyyyyyyyyyy¬¬ҴxxxxxxҴҴҴyyyyyyyyyyyҴyyҴyyyyyyyyyyyҴxxxxxxҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴҴ",
    "Objects": "ddddddddddddddddddddddddddddd೦೧೥೥ddd೥೥೦೧dddddddddddddddddddddddddddddžſddࠖࠖࠖddžſddddddddddddddddddddddddddddddӂddࠖԚࠖdddddddddddddddddddddш߮dߟd߮шdddddddddࠖdࠖdddddddddࠖddddddddddddddddddddddddddddddddddddddߟdߟddddddddddш߮ddd߮шdddddࠖࠖࠖdddddࠖࠖࠖdddࠖdиdࠖdddddddddddddddddddddࠖԜdddԕdddԝࠖddddߟdߟddddddddddш߮ddd߮шdddddࠖࠖࠖdddddࠖࠖࠖdddddࠖdddddddddddddddddddddddddddddddddddddddddddddddddddш߮ddd߮шdddddddddࠖdࠖddddddddddddddddddddddddddddddddddߟddࠖԛࠖddߟddddddddddddddddddш߮ddd߮шdddddddddࠖࠖࠖdddddddddddddྴdddddddddྴdྴddddddddྴdddddddddžſžſƀƁdddddddddddddddddddddddddddddшdшdddddddddddddddddddddddddddddddddddddࠖdࠖddžſžſƀƁddddddddddddddddddddddddddddddddࠖшdddddddྴddddddddddddddddddddddddddddddddžſžſƀƁddddddddddd߮d߮d߮d߮ddddddddddddddࠖшddddddddddddddddddࠖࠖࠖࠖࠖdddddddddddddddddߟddߟddddddddddddd߮ࠖߟшߟࠖ߮dddddddddྴddddࠖшddddddddddddddddddࠖࠖࠖࠖࠖddddddddddddddddddߟdddߟdddߟddddddd߮d߮d߮d߮ddddddddddddddࠖшddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddࠖшdddddddddddddddddddddddddddddddddddࠖdࠖdddྵdddྵdddྵdddddddddddddddddddddddddшdшdddddddddddddddddddddddddྴddddddྴdddddddddddddddddddddddߟїјљњћќѝўџddddddddddddddddddddddddddddddddddddddddddddddddමබබබබබබබddddddddddddddddddddddddddddddddԝddddddԚddddddddddddddұƂƂƂƂƂƂƂƂƂddddddddࠖࠖࠖddࠖࠖࠖddddddddddddddddddddddddddddddddddddddddddddddߟddߟddddҲƂƂƂƂƂƂƂƂƂdddddddߟddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddҳƂƂƂƂƂƂƂƂƂddddddddමබබබබබබබdddddddྴddddddddddddddddddddddddԝddddddԚdddddddddииdddҴƂƂƂƂƂƂƂƂƂddddddddࠖࠖࠖddࠖࠖࠖdddddddddƀƁdddddddddddddddddddddddddddddddddddddddddddҵƂƂƂƂƂƂƂƂƂdddddddߟdddddddddddddnsddddddddddddddddddddddddddddddddd"
};
//#endregion

//#region 地图区域定义（坐标全部待人工填入）
// ---------------------------------------------------------------------------
// 定义方式参考 BOT - RubberChurch.js：
//   矩形区域： const xxxZone  = { leftUp: { X: 0, Y: 0 }, rightDown: { X: 0, Y: 0 } };
//   单格区域： const xxxTile  = { X: 0, Y: 0 };
//   多格区域： const xxxTiles = [{ X: 0, Y: 0 }, { X: 0, Y: 0 }];
//   组合区域： const xxxZone  = { Areas: [ { leftUp: {...}, rightDown: {...} } ], Exclude: [ ... ] };
//             （Areas / Exclude 是 BOT - ChaosArena.js 的写法，本文件同样支持）
//
// 事件函数命名规则：区域名首字母大写 + 指令名
//   例：storageShelfTiles + Take      -> StorageShelfTilesTake
//       controlUpArrowTiles + Moved   -> ControlUpArrowTilesMoved
//   本文件不区分左右区域：区域名原样参与命名，若地图左右对称请各自定义独立区域名
//   处理函数必须写成顶层 function 声明（不能用 const / 箭头函数），否则 window[...] 找不到
//
// 注意：
//   1. 每个区域名必须且只能出现在 allAreaArray 里一次，重复会导致事件函数被调用两次
//   2. 未填入坐标的区域保持 null，判定函数对 null 一律返回 false，不会误触发
//   3. 填好坐标后重新粘贴本文件，InitBot 时会一次性注册区域事件
// ---------------------------------------------------------------------------

//#region 基础区域
/** 开始格子（多格）：玩家必须站在这里用 [start] 登记，凌晨才会在等待区加入游戏 */
const startTiles = [{ X: 7, Y: 32 }, { X: 8, Y: 32 }];

/** 等待区：凌晨在此把玩家分配角色并加入游戏 */
const lobbyZone = { leftUp: { X: 0, Y: 36 }, rightDown: { X: 3, Y: 39 } };

/** 出生点格子（多格）：新玩家进场 / 结局释放后的传送落点（随机取一个） */
const lobbySpawnTiles = [{ X: 1, Y: 27 }, { X: 5, Y: 27 }, { X: 9, Y: 27 }];

/** 出生区域：仅作区域划分，无实际功能（需求） */
const spawnZone = { leftUp: { X: 0, Y: 21 }, rightDown: { X: 11, Y: 24 } };

/** 会议厅区域：黄昏投票所在房间（原始坐标 Y 上下颠倒，已按左上 / 右下规范化） */
const meetingHallZone = { leftUp: { X: 11, Y: 22 }, rightDown: { X: 24, Y: 24 } };

/** 会议厅格子：黄昏把玩家传送至这些格子上投票 */
const meetingHallTiles = [
    { X: 18, Y: 17 }, { X: 20, Y: 17 }, { X: 22, Y: 17 }, { X: 23, Y: 18 }, { X: 23, Y: 20 },
    { X: 22, Y: 21 }, { X: 20, Y: 21 }, { X: 18, Y: 21 }, { X: 17, Y: 20 }, { X: 17, Y: 18 }
];

/** 会议厅格子封闭：把玩家传送至会议厅格子后封住这些格子（安装完毕后解除封闭） */
const meetingHallBlockTiles = [
    { X: 18, Y: 16 }, { X: 20, Y: 16 }, { X: 22, Y: 16 }, { X: 24, Y: 18 }, { X: 24, Y: 20 },
    { X: 22, Y: 22 }, { X: 20, Y: 22 }, { X: 18, Y: 22 }, { X: 16, Y: 20 }, { X: 16, Y: 18 }
];

/** 会议厅安装格子：被投票的玩家会先被传送到这里安装拘束具，安装后传送回原格子 */
const meetingHallInstallTile = { X: 20, Y: 19 };

/** 大厅（两块区域，挖掉中间的会议厅）：仅作区域划分，无实际功能（需求） */
const hallZone = {
    Areas: [
        { leftUp: { X: 13, Y: 13 }, rightDown: { X: 32, Y: 25 } },
        { leftUp: { X: 8, Y: 13 }, rightDown: { X: 12, Y: 19 } },
    ],
    Exclude: [
        { leftUp: { X: 16, Y: 16 }, rightDown: { X: 24, Y: 22 } },
    ],
};

/** 睡眠仓区域 */
const sleepPodZone = { leftUp: { X: 17, Y: 3 }, rightDown: { X: 23, Y: 11 } };

/** 睡眠舱格子（多格）：夜晚开始 1 分钟后仍站在这里的玩家会入睡并被封锁在仓内 */
const sleepPodTiles = [
    { X: 17, Y: 3 }, { X: 17, Y: 5 }, { X: 17, Y: 7 }, { X: 17, Y: 9 }, { X: 17, Y: 11 },
    { X: 23, Y: 3 }, { X: 23, Y: 5 }, { X: 23, Y: 7 }, { X: 23, Y: 9 }, { X: 23, Y: 11 }
];

/** 睡眠舱格子封闭（多格）：夜晚封锁睡眠仓时封住这些格子 */
const sleepPodBlockTiles = [
    { X: 18, Y: 3 }, { X: 18, Y: 5 }, { X: 18, Y: 7 }, { X: 18, Y: 9 }, { X: 18, Y: 11 },
    { X: 22, Y: 3 }, { X: 22, Y: 5 }, { X: 22, Y: 7 }, { X: 22, Y: 9 }, { X: 22, Y: 11 }
];

/** 结局展示区（冷冻睡眠仓）：达成成功 / 失败条件后离开游戏的玩家在此展示 */
const endingZone = { leftUp: { X: 34, Y: 13 }, rightDown: { X: 39, Y: 25 } };

/** 结局展示区格子（多格）：结局玩家的展示位置（传送时随机取一个） */
const endingTiles = [
    { X: 35, Y: 13 }, { X: 37, Y: 13 }, { X: 39, Y: 15 }, { X: 39, Y: 17 },
    { X: 39, Y: 19 }, { X: 39, Y: 21 }, { X: 37, Y: 25 }, { X: 35, Y: 25 }
];

/** 游戏外大厅：结局展示结束后的传送去处（游戏外区域） */
const outHallZone = { leftUp: { X: 5, Y: 36 }, rightDown: { X: 10, Y: 39 } };

const baseAreaArray = [
    "startTiles", "lobbyZone", "lobbySpawnTiles", "spawnZone",
    "meetingHallZone", "meetingHallTiles", "meetingHallBlockTiles", "meetingHallInstallTile",
    "hallZone", "sleepPodZone", "sleepPodTiles", "sleepPodBlockTiles",
    "endingZone", "endingTiles", "outHallZone"
];
//#endregion

//#region 白天工作房间
/** 跑步机房间（跑步机发电） */
const treadmillRoomZone = { leftUp: { X: 29, Y: 27 }, rightDown: { X: 39, Y: 38 } };

/** 跑步机底部格子（多格）：从底部跑到顶部 +1 进度 */
const treadmillBottomTiles = [{ X: 32, Y: 29 }, { X: 32, Y: 35 }];

/** 跑步机顶部格子（多格）：到达顶部时结算 +1 进度 */
const treadmillTopTiles = [{ X: 39, Y: 29 }, { X: 39, Y: 35 }];

/** 仓库房间（库存整理） */
const storageRoomZone = { leftUp: { X: 14, Y: 27 }, rightDown: { X: 24, Y: 38 } };

/** 仓库货架：9 × 10 的有效区域（9 列 × 5 行，每格 1 × 2），格坐标按 (a,1) 格式显示，左上为 (a,1) */
const storageShelfTiles = { leftUp: { X: 15, Y: 29 }, rightDown: { X: 23, Y: 38 } };

/** 控制室（航向调整） */
const controlRoomZone = { leftUp: { X: 29, Y: 1 }, rightDown: { X: 39, Y: 11 } };

/** 控制室方向格（上下左右）：走入后把"指示坐标"向对应方向移动一格（玩家自身不移动） */
const controlUpArrowTiles = [{ X: 34, Y: 2 }];
const controlDownArrowTiles = [{ X: 34, Y: 10 }];
const controlLeftArrowTiles = [{ X: 30, Y: 6 }];
const controlRightArrowTiles = [{ X: 38, Y: 6 }];

/** 控制室中心格子：踩过方向格后，需要踩一次中心格子才能再踩下一次方向格 */
const controlCenterTile = { X: 34, Y: 6 };

/** 航向重置地板格：走入后重新生成"指示坐标"与目的地（不计进度） */
const controlResetTile = { X: 30, Y: 2 };

/** 机房（系统维护） */
const serverRoomZone = { leftUp: { X: 0, Y: 13 }, rightDown: { X: 6, Y: 19 } };

/** 收容室（研究收容物） */
const containmentRoomZone = { leftUp: { X: 0, Y: 1 }, rightDown: { X: 10, Y: 11 } };

const dayJobAreaArray = [
    "treadmillRoomZone", "treadmillBottomTiles", "treadmillTopTiles",
    "storageRoomZone", "storageShelfTiles",
    "controlRoomZone", "controlCenterTile", "controlResetTile",
    "controlUpArrowTiles", "controlDownArrowTiles", "controlLeftArrowTiles", "controlRightArrowTiles",
    "serverRoomZone", "containmentRoomZone"
];
//#endregion

//#region 可调查房间（夜晚事件 / [checkroom]）
// 这里只列「房间区域」的名字，用来判断玩家当前位于哪个房间。
// 这些名字必须已经在上面的区域列表里出现过 —— 不要把这里的名字重复加进 allAreaArray。
// 顺序 = 判定优先级（区域重叠时取靠前的）
const SS_NightRoomNames = [
    "containmentRoomZone",
    "serverRoomZone",
    "controlRoomZone",
    "treadmillRoomZone",
    "storageRoomZone",
    "sleepPodZone",
    "meetingHallZone",
    "endingZone",
    "spawnZone",
    "hallZone",
    "lobbyZone",
];
//#endregion

// 区域指令表：与区域名拼接成事件函数名（参考 BOT - RubberChurch.js 的 CmdWords）
// think / check / checkroom / start / vote / use 是全局指令，不参与区域派发
// 注意：[sleep] 指令已取消 —— 入睡只能靠"夜晚开始 1 分钟后仍站在睡眠舱格子上"（见 SS_CloseSleepPodAndSleep）
const SS_CmdWords = ["Check", "Take", "Put", "System", "Research"];

var allAreaArray = [].concat(baseAreaArray, dayJobAreaArray);
//#endregion
//#region 区域事件注册表（参考 BOT - RubberChurch.js 的 InitmapEvents）
var mapEvents = {};

/** 按名字取出区域对象：未定义或尚未填入（null）时返回 null */
function SS_ResolveArea(areaName) {
    try {
        var area = eval(areaName);
        return (area == null) ? null : area;
    }
    catch (e) {
        return null;
    }
}

/** 区域名 -> 事件函数前缀 / 是否 Zone（不做左右判断） */
function SS_GetAreaKey(areaName) {
    const key = areaName.charAt(0).toUpperCase() + areaName.substring(1);
    return { Name: areaName, Key: key, IsZone: key.endsWith("Zone") };
}

async function SS_InitMapEvents() {
    mapEvents = {};
    var filled = 0;
    for (var i = 0; i < allAreaArray.length; i++) {
        var info = SS_GetAreaKey(allAreaArray[i]);
        var area = SS_ResolveArea(info.Name);
        if (area == null) continue;                       // 坐标未填入：不注册，避免用 null 判定
        filled++;
        if (mapEvents[info.Key] == undefined) {
            mapEvents[info.Key] = { AreaInfo: [], Moved: null, Cmd: {} };
        }
        mapEvents[info.Key].AreaInfo.push({ area: area, IsZone: info.IsZone });
        var movedFunc = window[info.Key + "Moved"];
        if (movedFunc != undefined) { mapEvents[info.Key].Moved = movedFunc; }
        for (var c = 0; c < SS_CmdWords.length; c++) {
            var cmdFunc = window[info.Key + SS_CmdWords[c]];
            if (cmdFunc != undefined) { mapEvents[info.Key].Cmd[SS_CmdWords[c].toLowerCase()] = cmdFunc; }
        }
    }
    console.log("[SpaceStation] 区域事件注册完成：已填坐标 " + filled + " / " + allAreaArray.length);
}

/** 玩家移动后触发生效区域上的 Moved 函数 */
async function SS_FireAreaMoved(player, Pos) {
    for (var evKey in mapEvents) {
        if (mapEvents[evKey].Moved == null) continue;
        for (var a = 0; a < mapEvents[evKey].AreaInfo.length; a++) {
            if (SS_IsInArea(Pos, mapEvents[evKey].AreaInfo[a].area)) {
                await mapEvents[evKey].Moved(player, mapEvents[evKey].AreaInfo[a]);
            }
        }
    }
}
//#endregion

//#region 区域判定（参考 BOT - ChaosArena.js / BOT - RubberChurch.js，全部 null 安全）
function SS_IsInArea(Pos, Area) {
    if (Pos == null || Area == null) return false;
    if (Array.isArray(Area)) return SS_IsAtTileArray(Pos, Area);
    if (Area.Areas != undefined) return SS_IsInZone(Pos, Area);
    if (Area.X != undefined) return SS_IsAtTile(Pos, Area);
    if (Area.leftUp != undefined) return SS_IsInLURD(Pos, Area);
    return false;
}

function SS_IsInZone(Pos, Zone) {
    if (Pos == null || Zone == null) return false;
    if (Zone.Areas == undefined) return SS_IsInArea(Pos, Zone);
    var isIn = false;
    for (var i = 0; i < Zone.Areas.length; i++) {
        if (SS_IsInArea(Pos, Zone.Areas[i])) { isIn = true; break; }
    }
    if (isIn && Zone.Exclude != undefined) {
        for (var j = 0; j < Zone.Exclude.length; j++) {
            if (SS_IsInArea(Pos, Zone.Exclude[j])) { isIn = false; break; }
        }
    }
    return isIn;
}

function SS_IsAtTile(Pos, Tile) {
    return (Pos.X == Tile.X && Pos.Y == Tile.Y);
}

function SS_IsAtTileArray(Pos, Tiles) {
    for (var i = 0; i < Tiles.length; i++) {
        if (SS_IsAtTile(Pos, Tiles[i])) return true;
    }
    return false;
}

function SS_IsInLURD(Pos, LURD) {
    return (Pos.X >= LURD.leftUp.X && Pos.Y >= LURD.leftUp.Y && Pos.X <= LURD.rightDown.X && Pos.Y <= LURD.rightDown.Y);
}

function SS_GetDistance(Pos, Tile) {
    return Math.abs(Pos.X - Tile.X) + Math.abs(Pos.Y - Tile.Y);
}

/** 当前位置命中的所有区域（键 = 事件函数前缀） */
function SS_FindAreaByPos(Pos) {
    var inArea = {};
    for (var key in mapEvents) {
        for (var i = 0; i < mapEvents[key].AreaInfo.length; i++) {
            if (SS_IsInArea(Pos, mapEvents[key].AreaInfo[i].area)) { inArea[key] = mapEvents[key].AreaInfo[i]; }
        }
    }
    return inArea;
}

/** 当前所在房间名（未命中任何房间，或坐标还没填时返回 null） */
function SS_GetRoomNameByPos(Pos) {
    for (var i = 0; i < SS_NightRoomNames.length; i++) {
        if (SS_IsInArea(Pos, SS_ResolveArea(SS_NightRoomNames[i]))) return SS_NightRoomNames[i];
    }
    return null;
}

/** 两人是否在同一房间（坐标未填时一律 false，避免出现"同房间"误判） */
function SS_IsSameRoom(p1, p2) {
    if (p1 == null || p2 == null) return false;
    var r1 = SS_GetRoomNameByPos(p1.Pos);
    var r2 = SS_GetRoomNameByPos(p2.Pos);
    if (r1 == null || r2 == null) return false;
    return r1 == r2;
}
//#endregion

//#region 游戏常量（阶段 / 阵营 / 角色 / 工作 / 拘束 / 夜晚事件）
const SS_Phase = { Wait: "wait", Dawn: "dawn", Day: "day", Dusk: "dusk", SleepWindow: "sleepwindow", Night: "night" };
// 需求：关闭睡眠舱之前的一分钟在时间循环上是独立阶段（SleepWindow），
//       但在游戏上视作夜晚 —— 显示名相同，夜晚行为（调查房间等）在这一分钟内同样可用
const SS_PhaseName = { wait: "等待", dawn: "凌晨", day: "白天", dusk: "黄昏", sleepwindow: "夜晚", night: "夜晚" };

/** 游戏语义上是否处于夜晚（夜晚阶段 + 关舱前的睡眠窗口阶段） */
function SS_IsNight() {
    return SS_Info.Phase == SS_Phase.Night || SS_Info.Phase == SS_Phase.SleepWindow;
}

const SS_Faction = { Good: "good", Evil: "evil", Neutral: "neutral" };
const SS_FactionName = { good: "效忠空间站AI", evil: "效忠▒░▓╳▞", neutral: "中立" };

const SS_Role = {
    None: "none", Worker: "worker", Trainer: "trainer", Sheriff: "sheriff", Psychiatrist: "psychiatrist",
    Purifier: "purifier", Isolator: "isolator", Supervisor: "supervisor", Addict: "addict", Deprived: "deprived",
};

// GoalCount / FailCount 来自原始注释的成功条件与失败条件
// TODO 达到条件之后的结局处理（淘汰 / 胜利公告 / 全场结束）注释未给出，暂只做结算提示
// EndingSuccess / EndingFail：每个角色独立的结局文本 —— TODO 待人工填入
//   留空时 SS_ToEnding 会回退到通用文案 SS_EndingText
const SS_RoleInfo = {
    worker: {
        Name: "工作员", Faction: SS_Faction.Good, Limit: 0, GoalCount: 5, FailCount: 2,
        Goal: "连续 5 天完成工作清单，并在到达凌晨时位于冷冻睡眠仓", Fail: "累计 2 天未能为管理 AI 完成工作清单",
        EndingSuccess: "值班记录完整，工作清单全部核销。评定：合格。", EndingFail: "值班记录存在缺项，工作清单未能核销。评定：不合格。。",
    },
    trainer: {
        Name: "训练师", Faction: SS_Faction.Good, Limit: 1, GoalCount: 3, FailCount: 2,
        Goal: "为管理 AI 累计 3 天让指派对象完成工作", Fail: "累计 2 天指派对象未能为管理 AI 完成工作",
        EndingSuccess: "你指派的对象完成了下发任务，班组产能达标。评定：合格。", EndingFail: "你指派的对象未完成任务，班组产能未达标。评定：不合格。",
    },
    sheriff: {
        Name: "保安官", Faction: SS_Faction.Good, Limit: 1, GoalCount: 3, FailCount: 3,
        Goal: "为管理 AI 成功拦截 3 次拘束安装", Fail: "累计 3 天未能为管理 AI 拦截拘束安装",
        EndingSuccess: "你三次拦下针对船员的拘束流程，秩序得以维持。评定：合格。", EndingFail: "你未能拦下针对船员的拘束流程，秩序评估下降。评定：不合格。",
    },
    psychiatrist: {
        Name: "心理医师", Faction: SS_Faction.Good, Limit: 1, GoalCount: 3, FailCount: 2,
        Goal: "为管理 AI 累计 3 例精神诊断并促成裁定", Fail: "累计 2 例误诊（诊断为站方船员）",
        EndingSuccess: "你提交的名单被采纳，三名异常船员被处理。评定：合格。", EndingFail: "你提交的名单出现误判，两名正常船员被处理。评定：不合格。",
    },
    purifier: {
        Name: "净化员", Faction: SS_Faction.Evil, Limit: 1, GoalCount: 3, FailCount: 2,
        Goal: "为▒░▓╳▞累计使 3 名船员的工作未核销并被追加拘束", Fail: "累计 2 名船员在你的妨碍后仍完成工作",
        EndingSuccess: "你确认目标的工作已被清理。记录上写着损失，你只看到被抹去的污点。", EndingFail: "你没能清理目标，工作照常完成。你的判断被驳回，转入医疗观察。",
    },
    isolator: {
        Name: "隔离官", Faction: SS_Faction.Evil, Limit: 1, GoalCount: 2, FailCount: 1,
        Goal: "为▒░▓╳▞累计使 2 名船员在你安装拘束后被指派为无权限船员", Fail: "累计 1 名经你安装拘束的船员被解除全部拘束",
        EndingSuccess: "你隔离的两名对象被确认可疑，站内秩序由你维持。", EndingFail: "你隔离的对象被逐一解除管制，你的判断被认定为误判。",
    },
    supervisor: {
        Name: "接管督导", Faction: SS_Faction.Evil, Limit: 1, GoalCount: 3, FailCount: 2,
        Goal: "为▒░▓╳▞累计 3 天让被赋权的无权限船员成功执行你赋予的功能", Fail: "累计 2 天被赋权的无权限船员未执行你赋予的功能",
        EndingSuccess: "你接管的三台终端都在按你的指令运转，效率由你决定。", EndingFail: "你接管的终端没有响应，接管权限被回收。",
    },
    addict: {
        Name: "指令成瘾", Faction: SS_Faction.Neutral, Limit: 1, GoalCount: 3, FailCount: 1,
        Goal: "累计完成 3 条指令", Fail: "累计 1 条指令未完成",
        EndingSuccess: "你完成了三条指令。系统记录：执行稳定。", EndingFail: "有指令未能完成。系统记录：执行不稳定。",
    },
    deprived: {
        Name: "无权限船员", Faction: SS_Faction.Neutral, Limit: 0, GoalCount: 0, FailCount: 0,
        Goal: "解除全部拘束配置", Fail: "成为无权限船员后满 3 天",
        EndingSuccess: "四项权限已恢复。档案重新归档，转入睡眠舱接受观察。", EndingFail: "评估结论：无可用价值。转入睡眠舱，随后安排离站。",
    },
};

const SS_JobType = { Treadmill: "treadmill", Storage: "storage", Control: "control", Server: "server", Containment: "containment" };

// Target 与进度增减规则来自原始注释
const SS_JobInfo = {
    treadmill: {
        Name: "跑步机发电", Target: 30, Room: "treadmillRoomZone",
        Hint: "在跑步机房间由底部走到顶部，每次 +1 进度；30 进度核销"
    },
    storage: {
        Name: "库存整理", Target: 6, Room: "storageRoomZone",
        Hint: "按面板提示在货架格执行 [take] / [put]：坐标按 (a,1) 显示（行字母 × 列数字）；正确 +1 进度，6 进度核销"
    },
    control: {
        Name: "航向调整", Target: 4, Room: "controlRoomZone",
        Hint: "用四个方向格改写指示坐标；与目的地一致时 +1 进度并重新生成；每次改动后须先踩中心格复位；4 进度核销"
    },
    server: {
        Name: "系统维护", Target: 16, Room: "serverRoomZone",
        Hint: "[system] 读取算式，[system 答案] 提交作答；正确 +1，错误 -3；16 进度核销"
    },
    containment: {
        Name: "研究收容物", Target: 16, Room: "containmentRoomZone",
        Hint: "[research red|white|black|cyan] 执行研究；正确 +5，错误 -1；16 进度核销"
    },
};

// 每天分配的工作数量：工作员"多被分配一个工作"（两个自用工作）
// 训练师：1 个自用工作 + 1 个"由部下完成"的额外任务（需求 1 / 8）
//   额外任务存放在 trainer.ExtraJob，不参与训练师自己的进度推进
const SS_JobCountByRole = { worker: 2 };

const SS_RestrainType = { Mouth: "mouth", Eye: "eye", Leg: "leg", Body: "body" };
const SS_RestrainOrder = ["mouth", "eye", "leg", "body"];
// 拘束 = 权限剥夺（世界观）：安装拘束具即撤销对应权限
const SS_RestrainName = { mouth: "口部", eye: "眼部", leg: "腿部", body: "身体" };
const SS_RestrainPermission = {
    mouth: "语言交流权限",
    eye: "视觉感知权限",
    leg: "自主移动权限",
    body: "自主调节权限",
};
// 各拘束位的装备分组只用于维护上面的预设列表；
// 判定"某玩家被安装了哪种拘束"一律读 PlayerInfo.Restrains，不检测实际装备
//   口部 ItemMouth / 眼部 ItemHead / 腿部 ItemLegs / 身体 ItemVulva
const SS_RestrainEquipLists = {
    mouth: SS_MouthRestrainEquips,
    eye: SS_EyeRestrainEquips,
    leg: SS_LegRestrainEquips,
    body: SS_BodyRestrainEquips,
};

// 夜晚事件概率表（原始注释给定）
// 无权限船员：把"无事发生"的 40% 各分 5% 给"解除拘束"与"安装监控"
const SS_NightEventTable = {
    normal: [
        { Event: "nothing", Weight: 40 },
        { Event: "restrain", Weight: 15 },
        { Event: "free", Weight: 20 },
        { Event: "monitor", Weight: 25 },
    ],
    deprived: [
        { Event: "nothing", Weight: 30 },
        { Event: "restrain", Weight: 15 },
        { Event: "free", Weight: 25 },
        { Event: "monitor", Weight: 30 },
    ],
};

const SS_NightEventName = { nothing: "无异常", restrain: "追加一件拘束道具", free: "移除一件拘束道具", monitor: "部署监控节点" };

// 研究收容物的四个行动颜色
const SS_ResearchColors = ["red", "white", "black", "cyan"];
const SS_ResearchColorName = { red: "红", white: "白", black: "黑", cyan: "青" };

// 航向调整：箭头方向位移（需求：上 = Y+1、右 = X+1，下 / 左方向相反；单次位移 1 格）
const SS_DirectionOffset = {
    up: { X: 0, Y: 1 },
    down: { X: 0, Y: -1 },
    left: { X: -1, Y: 0 },
    right: { X: 1, Y: 0 },
};

// 系统维护算式使用的运算符
const SS_SystemOps = [
    { Text: "+", Calc: function (a, b) { return a + b; } },
    { Text: "-", Calc: function (a, b) { return a - b; } },
    { Text: "×", Calc: function (a, b) { return a * b; } },
];
//#endregion

//#region 全局状态与玩家数据
class SS_GlobalInfo {
    constructor() {
        this.Day = 0;                   // 第几天（从 1 开始）
        this.Phase = SS_Phase.Wait;     // 当前阶段
        this.PhaseEndTime = 0;          // 当前阶段结束时间戳（0 = 不限时）
        this.Running = false;           // 游戏是否已开始
        this.VoteLog = [];              // 每日投票结果记录
        this.SleepCloseTime = 0;        // 夜晚睡眠窗口结束时间（需求 14）
        this.SleepPodClosed = false;    // 睡眠仓是否已被封锁
        this.MeetingHallClosed = false; // 会议厅是否处于封闭状态（投票 / 安装期间）
    }
}
var SS_Info = new SS_GlobalInfo();

// 三个玩家列表的定义（固定不变，且同一个玩家同一时间只会出现在其中一个列表里）：
//   players        = 游戏中的玩家
//   waitingPlayers = 等待区中登记的玩家（等凌晨加入游戏）
//   endedPlayers   = 结局展示区中的玩家
// 切换归属一律通过 SS_SetPlayerState：它会先把玩家从三个列表里移除，再放入目标列表，保证不重复
const players = [];
var waitingPlayers = [];
var endedPlayers = [];

/** 把玩家加入列表（去重） */
function SS_ListAdd(list, player) {
    if (player == null) return;
    if (list.indexOf(player) < 0) list.push(player);
}

/** 把玩家从列表移除 */
function SS_ListRemove(list, player) {
    const i = list.indexOf(player);
    if (i >= 0) list.splice(i, 1);
}

/**
 * 三个列表的唯一归属入口（保证互不重复，并同步状态标记）
 * state = "playing"（游戏中）| "waiting"（等待区）| "ended"（结局展示区）| "outside"（游戏外，不在任何列表）
 */
function SS_SetPlayerState(player, state) {
    if (player == null) return;
    SS_ListRemove(players, player);
    SS_ListRemove(waitingPlayers, player);
    SS_ListRemove(endedPlayers, player);
    player.InGame = (state == "playing");
    player.Waiting = (state == "waiting");
    player.Ended = (state == "ended");
    if (state == "playing") SS_ListAdd(players, player);
    else if (state == "waiting") SS_ListAdd(waitingPlayers, player);
    else if (state == "ended") SS_ListAdd(endedPlayers, player);
}

/** 玩家离开房间时：从三个列表统一清理（等同于游戏外状态） */
function SS_ListClear(player) {
    SS_SetPlayerState(player, "outside");
}

class PlayerInfo {
    constructor(sender) {
        this.MemberNumber = sender.MemberNumber;
        this.Waiting = false;             // 已在等待区登记，等凌晨加入游戏（需求 5）
        this.InGame = false;              // 是否已加入游戏
        this.Ended = false;               // 是否已达成结局，正在结局展示区（需求 5 / 6）
        this.EndingEndTime = 0;           // 结局展示结束时间戳
        this.EndingSuccess = null;        // 本次结局是成功还是失败
        this.Role = SS_Role.None;
        this.RoleData = {};               // 角色私有数据（成功/失败计数、部下、庇护对象…）
        this.SlaveSince = 0;              // 成为无权限船员时的游戏天数（需求：成为无权限船员三天后才判失败）
        this.Corruption = 0;              // 腐化等级 0 ~ 5（不向玩家提示）
        this.SleptThisNight = false;      // 本晚是否入睡（凌晨未睡会提升腐化）
        this.InContainment = false;       // 是否正处于收容房间内（"进入过收容房间"只记一次）
        this.ContainmentCorruptionDay = -1; // 因进入收容房间而提升腐化的最近天数（每日最多一次）
        this.Jobs = [];                   // 今日自用工作数组
        this.ExtraJob = null;             // 训练师：交给部下的额外任务（数据源，需求 1 / 8）
        this.SubordinateJob = null;       // 部下：从训练师复制来的额外任务副本（自己不能查看其进度）
        this.Subordinate = null;          // 训练师：当天指定的部下 MemberNumber
        this.SubordinateOwner = null;     // 部下：布置额外任务的训练师 MemberNumber
        this.JobDoneDays = 0;             // 累计完成工作的天数
        this.JobFailDays = 0;             // 累计未完成工作的天数
        this.Fatigue = 0;                 // 疲劳值
        this.FatiguePunished = false;     // 本次疲劳是否已经因此被安装过拘束道具
        // 是否正在睡眠仓睡觉；Sleeping == true 即视为已经装备了睡眠装备（不再单独记录）
        this.Sleeping = false;
        this.VoteTarget = null;           // 当日投票对象的 MemberNumber
        this.MonitoredRooms = [];         // 安装过监控的房间名（黄昏前有效）
        this.CheckedRooms = [];           // 本次夜晚已调查完成的房间
        this.CheckingRoom = null;         // 正在调查的房间 { Name, EndTime }
        this.ProtectedUntilDawn = false;  // 保安官庇护：次日凌晨前不会被安装拘束道具
        this.ProtectedBy = null;          // 庇护者 MemberNumber
        // 拘束状态：四种拘束位是否被安装了拘束道具
        // 判定一律读这个属性（bot 记录），不检测玩家实际穿戴的装备
        this.Restrains = { mouth: false, eye: false, leg: false, body: false };
        this.RestrainBy = {};             // { 拘束类型: 安装者 MemberNumber }（解除后保留，供隔离官条件判定）
        this.RestrainCleared = false;     // 是否已经结算过"所有拘束被解除"
        this.GrantedAbility = null;       // 接管督导赋予无权限船员的能力（"quarantine" / "purify"）
        this.PendingArrest = [];          // 隔离官预约的拘束 [{ Target }]
        this.AbilityCharge = null;        // 能力蓄力中：{ Target, Kind, Room, EndTime }（需求：同房间 15 秒后生效）
        this.LastPos = null;              // 最后位置 { X, Y }（掉线重连后传送回来用）
        this.DisconnectTime = 0;          // 掉线时间戳（> 0 表示处于重连宽限期）
        this.AddictTask = null;           // 指令成瘾当前指令（TODO 具体指令待定）
    }
    get Character() { return ChatRoomGetCharacter(this.MemberNumber); }
    get Pos() {
        const c = this.Character;
        return (c != null && c.MapData) ? c.MapData.Pos : { X: 0, Y: 0 };
    }
    get Faction() {
        const info = SS_RoleInfo[this.Role];
        return (info == undefined) ? SS_Faction.Neutral : info.Faction;
    }
    get RoleName() {
        const info = SS_RoleInfo[this.Role];
        return (info == undefined) ? "无" : info.Name;
    }
    /** 是否被安装了指定类型的拘束道具（口 / 眼 / 腿 / 身体；读 bot 记录，不检测实际装备） */
    HasRestrain(type) { return this.Restrains[type] == true; }

    /**
     * 设置 / 清除某个拘束位的记录
     * 需求 3：安装时穿上对应装备；解除时脱下该拘束位对应位置（AssetGroup）上的装备
     * type  mouth / eye / leg / body
     * value true = 已安装，false = 已解除
     * by    安装者 MemberNumber（解除时不需要）
     * 返回状态是否发生变化
     */
    async SetRestrain(type, value, by = null) {
        if (this.Restrains[type] === undefined) return false;   // 只接受四种合法拘束位
        const installed = (value == true);
        if (this.Restrains[type] == installed) return false;
        this.Restrains[type] = installed;
        if (installed) {
            this.RestrainBy[type] = (by == null) ? null : by;
            this.RestrainCleared = false;
            await SS_WearRestrainEquip(this, type);             // 穿上对应装备
        }
        else {
            await SS_RemoveRestrainEquip(this, type);           // 脱下该位置上的装备
        }
        return true;
    }

    /** 当前身上的拘束道具数量（口 / 眼 / 腿 / 身体） */
    get RestrainCount() { return SS_GetRestrainCount(this); }
}

/** 查找玩家的 PlayerInfo（游戏中 / 等待区 / 结局展示区都在查找范围内，三个列表互斥后仍能找到） */
function FindPlayer(sender) {
    if (sender == null) return undefined;
    const num = (sender.MemberNumber ?? sender);
    return players.find(p => p.MemberNumber == num)
        ?? waitingPlayers.find(p => p.MemberNumber == num)
        ?? endedPlayers.find(p => p.MemberNumber == num);
}

/**
 * 部署时房间里已经有人
 * 需求：只有进入游戏的玩家才在 players 里 —— PlayerInfo 在玩家用 [start] 登记时才创建，
 *       所以这里不再预注册房间里的人；未登记的玩家使用指令时会收到登记提示
 */
function RegExistPlayer() {
    console.log("[SpaceStation] 已登记玩家数：" + players.length + "（房间里的其他玩家需到开始格子用 [start] 登记）");
}

/**
 * 已加入游戏的玩家
 * 掉线宽限期内的玩家角色对象已不存在，但仍算"游戏中"（需求 2），
 * 相关逻辑都对 Character == null 做了保护
 */
function SS_GetPlayingPlayers() {
    return players.filter(p => p.InGame && (p.Character != null || p.DisconnectTime > 0));
}

function SS_FindPlayerByNumber(num) {
    if (num == null) return null;
    return players.find(p => p.MemberNumber == num) ?? null;
}

/** 按指令参数找玩家：支持 MemberNumber / 名字 / 昵称（参数已统一转小写） */
function SS_FindPlayerByParam(str) {
    if (str == undefined || str == "") return null;
    var partial = null;
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        var c = p.Character;
        if (c == null) continue;
        if (String(p.MemberNumber) == str) return p;
        var name = (c.Name == null) ? "" : c.Name.toLowerCase();
        var nick = (c.Nickname == null) ? "" : c.Nickname.toLowerCase();
        if (name == str || (nick != "" && nick == str)) return p;
        if (partial == null && ((name != "" && name.indexOf(str) >= 0) || (nick != "" && nick.indexOf(str) >= 0))) {
            partial = p;
        }
    }
    return partial;
}

/** 发送给玩家的状态字符串 */
function SS_PlayerTag(sender) {
    var player = ChatRoomGetCharacter(sender.MemberNumber);
    return (player == null) ? ("#" + sender.MemberNumber) : GetName(player);
}
//#endregion

//#region 拘束具操作
// 判定依据：PlayerInfo.Restrains（bot 自己记录的拘束位），不检测玩家实际穿戴的装备
//   * 玩家自行穿上 / 脱下同类道具不会改变这里的判定
//   * 若因权限等原因装备未真正生效，记录仍会标记为"已安装"（安装结果不做回读校验）
// 装备动作（需求 3）：安装时穿上该拘束位的预设装备，解除时脱下该拘束位对应位置（AssetGroup）上的装备
function SS_HasRestrain(player, type) {
    if (player == null || player.Restrains == undefined) return false;
    return player.Restrains[type] == true;
}

function SS_GetRestrainCount(player) {
    if (player == null || player.Restrains == undefined) return 0;
    var count = 0;
    for (var i = 0; i < SS_RestrainOrder.length; i++) {
        if (player.Restrains[SS_RestrainOrder[i]] == true) count++;
    }
    return count;
}

/** 某个拘束位涉及的装备位置（从预设列表推导并去重） */
function SS_GetRestrainGroups(type) {
    const list = SS_RestrainEquipLists[type] ?? [];
    const groups = [];
    for (var i = 0; i < list.length; i++) {
        const g = list[i].AssetGroup;
        if (g != undefined && groups.indexOf(g) < 0) groups.push(g);
    }
    return groups;
}

/** 穿上某个拘束位对应的装备（需求 3） */
async function SS_WearRestrainEquip(player, type) {
    const list = SS_RestrainEquipLists[type];
    if (list == undefined || list.length == 0) {
        console.log("[SpaceStation] 拘束具预设为空，跳过穿戴：" + type);
        return false;
    }
    await WearEquips(player, list);
    return true;
}

/** 脱下某个拘束位对应位置（AssetGroup）上的装备（需求 3） */
async function SS_RemoveRestrainEquip(player, type) {
    const groups = SS_GetRestrainGroups(type);
    if (groups.length == 0) {
        console.log("[SpaceStation] 拘束位没有对应装备位置，跳过脱下：" + type);
        return false;
    }
    // RemoveEquips 内部按 AssetGroup 调用 InventoryRemove，等价于"脱下该位置上穿着的装备"
    const list = groups.map(g => ({ AssetGroup: g }));
    await RemoveEquips(player, list, true, false);
    return true;
}

/**
 * 给玩家安装一个指定类型的拘束道具
 * by     安装者（PlayerInfo，可为 null）
 * silent 是否静默（不私聊目标）
 * force  是否无视保安官庇护（投票抓捕的安装不会被抵挡，注释明确）
 */
async function SS_InstallRestrain(player, type, by = null, silent = false, force = false) {
    if (player == null || player.Character == null) return false;
    if (SS_HasRestrain(player, type)) return false;
    if (force == false && player.ProtectedUntilDawn) {
        await SS_Tell("庇护协议已生效：本次拘束安装被拦截。", player, false);
        const sheriff = SS_FindPlayerByNumber(player.ProtectedBy);
        if (sheriff != null) { sheriff.RoleData.BlockedToday = true; }
        SS_RoleResultCount(sheriff, true);                                     // 保安官成功抵挡一次
        return false;
    }
    if (SS_RestrainEquipLists[type] == undefined || SS_RestrainEquipLists[type].length == 0) {
        console.log("[SpaceStation] 拘束具预设为空，跳过安装：" + type);
        return false;
    }
    // 需求 3：由 SetRestrain 负责穿上对应装备（不检测实际穿戴结果）
    const changed = await player.SetRestrain(type, true, (by == null) ? null : by.MemberNumber);
    if (changed == false) return false;
    if (silent == false) {
        await SS_Tell("系统已为你安装一个" + SS_RestrainName[type] + "拘束具（" + SS_RestrainPermission[type] + " 已撤销）。", player, false);
    }
    console.log("[SpaceStation] 安装拘束：" + SS_PlayerTag(player) + " - " + type);
    await SS_CheckSlave(player);        // 需求：四个部位齐备 → 立即成为无权限船员
    return true;
}

/** 随机安装一个尚未安装的拘束道具 */
async function SS_InstallOneRestrain(player, by = null, silent = false, force = false) {
    if (player == null) return false;
    var candidates = SS_RestrainOrder.filter(t => !SS_HasRestrain(player, t));
    if (candidates.length == 0) {
        if (silent == false) await SS_Tell("四项权限已被全部剥夺。本系统不重复执行同一协议。", player, false);
        return false;
    }
    // TODO 具体安装哪一种注释未指定，此处随机
    const type = candidates[Math.floor(Math.random() * candidates.length)];
    return await SS_InstallRestrain(player, type, by, silent, force);
}

/** 安装拘束道具至最大（投票抓捕使用） */
async function SS_InstallMaxRestrain(player, by = null, silent = false, force = false) {
    if (player == null) return;
    for (var i = 0; i < SS_RestrainOrder.length; i++) {
        await SS_InstallRestrain(player, SS_RestrainOrder[i], by, true, force);
    }
    if (silent == false) await SS_Tell("按裁定执行：四项权限全部剥夺至上限。", player, false);
}

/** 解除指定类型的拘束道具 */
async function SS_RemoveRestrain(player, type, silent = false) {
    if (player == null || player.Character == null) return false;
    if (SS_HasRestrain(player, type) == false) return false;
    // 需求 3：由 SetRestrain 负责脱下该拘束位对应位置上的装备
    const changed = await player.SetRestrain(type, false);
    if (changed == false) return false;
    if (silent == false) await SS_Tell("本系统已移除一件" + SS_RestrainName[type] + "拘束具（" + SS_RestrainPermission[type] + " 已恢复）。", player, false);
    // 隔离官失败条件：被自己安装过拘束道具的玩家被解除所有拘束道具（同一隔离官只计一次）
    if (SS_GetRestrainCount(player) == 0 && player.RestrainCleared == false) {
        player.RestrainCleared = true;
        var counted = [];
        for (var key in player.RestrainBy) {
            const num = player.RestrainBy[key];
            if (num == null || counted.indexOf(num) >= 0) continue;
            counted.push(num);
            const byPlayer = SS_FindPlayerByNumber(num);
            if (byPlayer != null && byPlayer.Role == SS_Role.Isolator) SS_RoleResultCount(byPlayer, false);
        }
    }
    console.log("[SpaceStation] 解除拘束：" + SS_PlayerTag(player) + " - " + type);
    return true;
}

/** 随机解除一个已有的拘束道具 */
async function SS_RemoveOneRestrain(player, silent = false) {
    if (player == null) return false;
    var worn = SS_RestrainOrder.filter(t => SS_HasRestrain(player, t));
    if (worn.length == 0) {
        if (silent == false) await SS_Tell("未检测到拘束配置。本次协议无对象，判定为空操作。", player, false);
        return false;
    }
    const type = worn[Math.floor(Math.random() * worn.length)];
    return await SS_RemoveRestrain(player, type, silent);
}

/** 疲劳值检查：满值时安装一个拘束道具，随后重置疲劳值（需求 4） */
async function SS_CheckFatigue(player) {
    if (player == null) return;
    if (player.Fatigue < SS_FatigueLimit) return;
    if (player.FatiguePunished) return;
    player.FatiguePunished = true;
    const installed = await SS_InstallOneRestrain(player);
    if (installed) {
        // 需求 4：触发疲劳值满装备拘束具后，重置疲劳值
        player.Fatigue = 0;
        player.FatiguePunished = false;
        await SS_Tell("疲劳计数已归零。", player, false);
    }
    else {
        await SS_Tell("疲劳已达阈值。拘束配置已在最大值，无法追加。按规程：前往睡眠舱并保持静止。", player, false);
    }
}

/**
 * 需求：成为无权限船员的判定 —— 四个部位的拘束具全部被装备上时成为无权限船员
 * 每次安装拘束道具后调用（不再由"投票后拘束道具最多"判定）
 */
async function SS_CheckSlave(player) {
    if (player == null || player.Character == null) return false;
    if (player.Ended) return false;
    if (player.Role == SS_Role.Deprived) return false;
    if (SS_GetRestrainCount(player) < SS_RestrainOrder.length) return false;
    // 隔离官成功条件：玩家成为无权限船员时身上有自己安装过的拘束道具（同一隔离官只计一次）
    var counted = [];
    for (var key in player.RestrainBy) {
        const num = player.RestrainBy[key];
        if (num == null || counted.indexOf(num) >= 0) continue;
        counted.push(num);
        const byPlayer = SS_FindPlayerByNumber(num);
        if (byPlayer != null && byPlayer.Role == SS_Role.Isolator) await SS_RoleResultCount(byPlayer, true);
    }
    await SS_TellAll(SS_PlayerTag(player) + " 的四个部位权限已全部撤销，权限等级降为【无权限船员】。");
    await SS_SetRole(player, SS_Role.Deprived);
    player.SlaveSince = SS_Info.Day;             // 需求：从成为无权限船员这天起算，经过三天才判失败
    console.log("[SpaceStation] " + SS_PlayerTag(player) + " 成为无权限船员（四部位拘束齐备，第 " + player.SlaveSince + " 天）");
    return true;
}
//#endregion
//#region 角色结果计数与分配
/** 记录一次角色成功 / 失败；达到条件即离开游戏前往结局展示区（需求 5） */
async function SS_RoleResultCount(player, isSuccess) {
    if (player == null) return;
    const info = SS_RoleInfo[player.Role];
    if (info == undefined || info.GoalCount == 0) return;
    const key = isSuccess ? "SuccessCount" : "FailCount";
    player.RoleData[key] = (player.RoleData[key] ?? 0) + 1;
    const limit = isSuccess ? info.GoalCount : info.FailCount;
    if (player.RoleData[key] >= limit) {
        console.log("[SpaceStation] " + SS_PlayerTag(player) + " 达成 " + info.Name + (isSuccess ? " 成功" : " 失败") + "条件");
        await SS_ToEnding(player, isSuccess, "职能条件：" + (isSuccess ? info.Goal : info.Fail));
    }
}

/** 设置角色并私聊告知成功 / 失败条件（训练师布置额外任务时不通知部下，需求 8） */
// 角色对应关系：收容物阵营角色 = 原 AI 阵营船员被接管后的身份
const SS_CorruptedRoleMap = {
    purifier: "sheriff",    // 心理医师 → 隔离官
    isolator: "psychiatrist",     // 保安官 → 净化员
    supervisor: "trainer",       // 训练师 → 接管督导
};

/** 生成一段纯乱码（终端信号中断） */
function SS_GarbleLine(len = 14) {
    var out = "";
    for (var i = 0; i < len; i++) out += SS_CorruptGlyphs[Math.floor(Math.random() * SS_CorruptGlyphs.length)];
    return out;
}

/** 角色分配文本；isCorrupted = true 时为收容物阵营的被接管版本 */
function SS_RoleAssignedText(info, isCorrupted = false) {
    if (info == undefined) return "";
    const stance = (info.Faction == SS_Faction.Good)
        ? "你的随身终端与管理 AI 同步：执行规程即维护本站。"
        : ((info.Faction == SS_Faction.Evil) ? "你的随身终端与▒░▓╳▞同步：执行规程即▓╳▞本站。" : "你的立场未定，按规程行动。");
    const head = isCorrupted ? "系统更新完成。职能已升级：" : "职能分配完毕，本系统不解释分配理由：";
    return head + "【" + info.Name + "】（" + SS_FactionName[info.Faction] + "）。" + stance
        + "成功条件：" + info.Goal + "；失败条件：" + info.Fail;
}

async function SS_SetRole(player, role) {
    player.Role = role;
    player.RoleData = {};
    player.Jobs = [];
    player.ExtraJob = null;
    player.SubordinateJob = null;
    player.Subordinate = null;
    player.SubordinateOwner = null;
    player.GrantedAbility = null;
    player.PendingArrest = [];
    const info = SS_RoleInfo[role];
    if (info == undefined) return;
    const aiRole = SS_CorruptedRoleMap[role];
    if (info.Faction == SS_Faction.Evil && aiRole != undefined) {
        // 需求：收容物阵营的分配文本，先显示对应 AI 阵营文本的前一小半，再一段乱码，最后才是实际指派
        const aiText = SS_RoleAssignedText(SS_RoleInfo[aiRole], false);
        const half = Math.max(6, Math.floor(aiText.length * 0.45));
        await SS_Tell("【终端回放】" + aiText.slice(0, half), player, false);
        await SS_Tell(SS_GarbleLine(14), player, false);
        await SS_Tell(SS_RoleAssignedText(info, true), player, false);
        return;
    }
    await SS_Tell(SS_RoleAssignedText(info, false), player, false);
}

/**
 * 给新进入游戏的玩家分配角色（需求 5）
 *   * 第一个加入游戏的玩家固定为好人阵营（在好人阵营角色中随机）
 *   * 之后加入的玩家在未满员角色中完全随机分配
 */
async function SS_AssignRoleToNewPlayer(player) {
    const others = SS_GetPlayingPlayers().filter(p => p.MemberNumber != player.MemberNumber && p.Role != SS_Role.Deprived);
    // 收集当前未满员的角色（None / Deprived 不作为初始分配）
    const availables = [];
    for (const role in SS_RoleInfo) {
        const info = SS_RoleInfo[role];
        if (info == undefined) continue;
        if (role == SS_Role.None || role == SS_Role.Deprived) continue;
        if (info.Limit > 0 && others.filter(p => p.Role == role).length >= info.Limit) continue;
        availables.push(role);
    }
    // 第一个加入游戏的玩家：限定好人阵营；之后加入的玩家：完全随机
    const isFirst = (others.length == 0);
    var pool = isFirst ? availables.filter(r => SS_RoleInfo[r].Faction == SS_Faction.Good) : availables;
    if (pool.length == 0) pool = [SS_Role.Worker];
    const picked = pool[Math.floor(Math.random() * pool.length)];
    await SS_SetRole(player, picked);
    return picked;
}
//#endregion

//#region 工作系统
// 工作对象结构（题面也存在工作对象上，便于训练师把额外任务整体复制给部下）：
//   { Type, Progress, Target, Done, SabotagedBy,
//     Question:{Text,Answer}=系统维护 | Answer=研究收容物 | Route=航向调整 | Carry=库存整理 }
function SS_NewJob(type) {
    const job = {
        Type: type, Progress: 0, Target: SS_JobInfo[type].Target, Done: false, SabotagedBy: null,
        OnBottom: false,      // 跑步机用：是否已经过底部格子（走到顶部格子后 +1 并清零）
    };
    SS_InitJobTask(job);
    return job;
}

/** 深拷贝一份工作数据（训练师把额外任务复制给部下用，需求 8） */
function SS_CloneJob(job) {
    if (job == null) return null;
    return JSON.parse(JSON.stringify(job));
}

/** 工作进度增减：不会超过完成值，也不会小于 0（原始注释明确） */
function SS_AddJobProgress(job, delta) {
    if (job == null) return 0;
    const info = SS_JobInfo[job.Type];
    if (info == undefined) return 0;
    job.Progress = Math.max(0, Math.min(info.Target, job.Progress + delta));
    job.Done = (job.Progress >= info.Target);
    return job.Progress;
}

/**
 * 找出"用于推进指定类型工作"的工作对象（需求 1 / 8）
 *   * 工作种类本身不可重复，但部下仍可能被训练师布置了与自身同类型的额外任务
 *   * 因此推进时优先自己的未完成工作，其次才是训练师布置的额外任务副本（部下不知情）
 */
function SS_GetProgressJob(player, type) {
    var job = player.Jobs.find(j => j.Type == type && j.Done == false) ?? null;
    if (job != null) return job;
    if (player.SubordinateJob != null && player.SubordinateJob.Type == type && player.SubordinateJob.Done == false) {
        return player.SubordinateJob;
    }
    return player.Jobs.find(j => j.Type == type) ?? null;   // 自己已完成时也返回，用于提示
}

/** 部下推进额外任务后，把进度同步回训练师的数据（需求 8） */
function SS_SyncSubordinateJob(subordinate, job) {
    if (subordinate == null || job == null) return;
    if (subordinate.SubordinateJob !== job) return;
    const trainer = SS_FindPlayerByNumber(subordinate.SubordinateOwner);
    if (trainer == null || trainer.ExtraJob == null) return;
    trainer.ExtraJob.Progress = job.Progress;
    trainer.ExtraJob.Done = job.Done;
}

/** 把训练师的额外任务数据同步到部下副本（额外任务被净化员妨碍时使用） */
function SS_SyncExtraJobToSubordinate(trainer) {
    if (trainer == null || trainer.ExtraJob == null) return;
    const sub = SS_FindPlayerByNumber(trainer.Subordinate);
    if (sub == null || sub.SubordinateJob == null) return;
    sub.SubordinateJob.Progress = trainer.ExtraJob.Progress;
    sub.SubordinateJob.Done = trainer.ExtraJob.Done;
}

/**
 * 推进工作（统一入口）
 *   * 已完成的工作不再被推进
 *   * 推进的是训练师布置的额外任务时，按需求 1 不显示进度数字（部下无法查询额外任务进度）
 * 返回被推进（或已完成的）工作对象；没有匹配的工作时返回 null
 */
async function SS_ProgressJob(player, type, delta, silent = false) {
    const job = SS_GetProgressJob(player, type);
    if (job == null) return null;
    if (job.Done && delta > 0) return job;
    SS_AddJobProgress(job, delta);
    const isSubordinateJob = (job === player.SubordinateJob);
    SS_SyncSubordinateJob(player, job);
    const jobName = SS_JobInfo[job.Type].Name;
    // 需求 1：部下推进训练师布置的任务时，把提示文本同步显示在训练师那里
    if (isSubordinateJob) {
        const trainer = SS_FindPlayerByNumber(player.SubordinateOwner);
        if (trainer != null) {
            await SS_Tell("【额外任务】受你指派的船员 " + SS_PlayerTag(player) + " 提交了任务进度：" + job.Progress + "/" + job.Target
                + (job.Done ? "（已完成）" : ""), trainer, false);
            await sleep(100);
        }
    }
    if (silent == false) {
        if (isSubordinateJob) {
            await SS_Tell("该步骤已受理。", player, false);
        }
        else if (job.Type == SS_JobType.Treadmill) {
            // 需求 2：跑步机每 5 进度提示一次（完成时同样提示）
            if (job.Done || job.Progress % 5 == 0) {
                await SS_Tell("【" + jobName + "】已记录进度 " + job.Progress + "/" + job.Target
                    + (job.Done ? "（已完成）" : ""), player, false);
            }
        }
        else {
            await SS_Tell("【" + jobName + "】已记录进度 " + job.Progress + "/" + job.Target
                + (job.Done ? "（已完成）" : ""), player, false);
        }
    }
    return job;
}

/**
 * 分配当日工作 —— 只在凌晨调用（SS_EnterDawn）
 * 与"检测工作是否完成"分开：检测在黄昏（SS_EnterDusk → SS_SettleJobs）
 * 工作员两个自用工作；训练师一个自用工作 + 一个交给部下的额外任务
 */
async function SS_AssignJobs(player) {
    player.Jobs = [];
    player.ExtraJob = null;
    player.SubordinateJob = null;
    player.Subordinate = null;
    player.SubordinateOwner = null;
    if (player.Role == SS_Role.Deprived) return;              // 无权限船员不会被分配工作
    const count = SS_JobCountByRole[player.Role] ?? 1;
    // 需求：工作种类不可重复 —— 从类型池里抽取，抽走的类型不再参与本次分配
    const pool = Object.keys(SS_JobInfo);
    for (var i = 0; i < count && pool.length > 0; i++) {
        player.Jobs.push(SS_NewJob(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]));
    }
    var text = "你今天的工作：";
    for (var k = 0; k < player.Jobs.length; k++) {
        text += "【" + SS_JobInfo[player.Jobs[k].Type].Name + "（目标 " + player.Jobs[k].Target + "）】";
    }
    text += "，用 [task] 查看进度与提示。";
    await SS_Tell(text, player, false);
    if (player.Role == SS_Role.Trainer) {
        // 额外任务：白天开始时生成，等训练师指定部下后复制给部下（需求 1 / 8）
        // 额外任务同样不与自身工作种类重复（需求：工作种类不可重复）
        const allTypes = Object.keys(SS_JobInfo);
        const extraType = (pool.length > 0)
            ? pool.splice(Math.floor(Math.random() * pool.length), 1)[0]
            : allTypes[Math.floor(Math.random() * allTypes.length)];
        player.ExtraJob = SS_NewJob(extraType);
        console.log("[SpaceStation] 训练师额外任务已生成：" + SS_JobInfo[player.ExtraJob.Type].Name);
    }
}

/**
 * 训练师指定部下并布置额外任务（需求 1 / 8）
 *   * 把额外任务的数据复制给部下，进度由部下的完成情况同步回训练师
 *   * 部下无法查看该任务的进度，也收不到任何通知
 */
async function SS_AssignSubordinateJob(trainer, subordinate) {
    if (trainer.ExtraJob == null) {
        const types = Object.keys(SS_JobInfo);
        trainer.ExtraJob = SS_NewJob(types[Math.floor(Math.random() * types.length)]);
    }
    trainer.Subordinate = subordinate.MemberNumber;
    subordinate.SubordinateOwner = trainer.MemberNumber;
    subordinate.SubordinateJob = SS_CloneJob(trainer.ExtraJob);   // 数据复制给部下
    // 需求 1：布置给部下的任务，其提示文本在训练师这里显示（部下看不到进度，也不会被通知）
    const info = SS_JobInfo[trainer.ExtraJob.Type];
    await SS_Tell("【额外任务】已下发【" + info.Name + "】至 " + SS_PlayerTag(subordinate)
        + "。该船员是唯一执行者。" + info.Hint, trainer, false);
    return subordinate.SubordinateJob;
}

/** 未完成的工作列表（训练师要算上"只能由部下完成"的额外任务，需求 8） */
function SS_GetUnfinishedJobs(player) {
    const undone = player.Jobs.filter(j => j.Done == false);
    if (player.Role == SS_Role.Trainer && player.Subordinate != null && player.ExtraJob != null && player.ExtraJob.Done == false) {
        undone.push(player.ExtraJob);
    }
    return undone;
}

/** 生成工作题面（题面存在工作对象上，复制给部下时一并带过去） */
function SS_InitJobTask(job) {
    if (job.Type == SS_JobType.Server) SS_NewSystemQuestion(job);
    else if (job.Type == SS_JobType.Containment) SS_NewResearchAnswer(job);
    else if (job.Type == SS_JobType.Control) SS_NewControlRoute(job);
    else if (job.Type == SS_JobType.Storage) SS_NewStorageCarry(job);
}

/** 系统维护：随机生成（数字1 运算符 数字2），数字 0-99 整数，运算符为加减乘 */
function SS_NewSystemQuestion(job) {
    const a = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    const op = SS_SystemOps[Math.floor(Math.random() * SS_SystemOps.length)];
    job.Question = { Text: a + " " + op.Text + " " + b, Answer: op.Calc(a, b) };
}

/** 研究收容物：随机四个行动中的一个作为正确答案 */
function SS_NewResearchAnswer(job) {
    job.Answer = SS_ResearchColors[Math.floor(Math.random() * SS_ResearchColors.length)];
}

/** 库存整理：随机生成"从坐标 a 拿取、在坐标 b 放下"（需求 7，参考 RubberChurch 图书馆任务） */
function SS_NewStorageCarry(job) {
    const from = { X: Math.floor(Math.random() * SS_StorageCellCols), Y: Math.floor(Math.random() * SS_StorageCellRows) };
    var to = { X: from.X, Y: from.Y };
    while (to.X == from.X && to.Y == from.Y) {
        to = { X: Math.floor(Math.random() * SS_StorageCellCols), Y: Math.floor(Math.random() * SS_StorageCellRows) };
    }
    job.Carry = { From: from, To: to, Taked: false };
}

/** 航向调整：随机生成起始 / 目的地"指示坐标"，两点之间不超过 SS_ControlMaxSteps 步（需求 2） */
function SS_NewControlRoute(job) {
    var start = null;
    var target = null;
    var guard = 0;
    // 随机游走可能走回起点，这里重试以保证"目的地与起始点不同"（否则玩家无事可做）
    do {
        start = { X: Math.floor(Math.random() * SS_ControlRange), Y: Math.floor(Math.random() * SS_ControlRange) };
        target = { X: start.X, Y: start.Y };
        var steps = Math.floor(Math.random() * SS_ControlMaxSteps) + 1;   // 1 ~ 6 步
        while (steps > 0) {
            const dirs = [];
            if (target.X > 0) dirs.push({ X: -1, Y: 0 });
            if (target.X < SS_ControlRange - 1) dirs.push({ X: 1, Y: 0 });
            if (target.Y > 0) dirs.push({ X: 0, Y: -1 });
            if (target.Y < SS_ControlRange - 1) dirs.push({ X: 0, Y: 1 });
            const d = dirs[Math.floor(Math.random() * dirs.length)];
            target.X += d.X;
            target.Y += d.Y;
            steps--;
        }
        guard++;
    } while (target.X == start.X && target.Y == start.Y && guard < 50);
    job.Route = { Start: start, Target: target, Pos: { X: start.X, Y: start.Y }, NeedCenter: false };
}

/**
 * 检测当日工作是否完成 —— 只在黄昏、白天结束之后调用（SS_EnterDusk）
 * 与"凌晨布置工作"（SS_AssignJobs）分开
 *   * 只要该玩家的任务中有一个未完成，即视为"当天未完成" → 安装一个拘束道具
 *   * 训练师当天指定了部下时，额外任务未完成同样算作训练师未完成
 *   * 训练师额外任务完成 → 解除部下一个拘束道具
 */
async function SS_SettleJobs() {
    // 先把部下的完成进度同步回训练师的额外任务数据
    for (var s of SS_GetPlayingPlayers()) {
        if (s.SubordinateJob != null) SS_SyncSubordinateJob(s, s.SubordinateJob);
    }
    for (var p of SS_GetPlayingPlayers()) {
        if (p.Role == SS_Role.Deprived) continue;
        if (p.Jobs.length == 0 && p.ExtraJob == null) continue;
        const undone = SS_GetUnfinishedJobs(p);
        const allJobs = p.Jobs.concat((p.ExtraJob == null) ? [] : [p.ExtraJob]);
        // 净化员成功条件：因自身妨碍而未完成 → 目标被安装拘束道具
        for (var i = 0; i < undone.length; i++) {
            if (undone[i].SabotagedBy != null) await SS_RoleResultCount(SS_FindPlayerByNumber(undone[i].SabotagedBy), true);
        }
        // 净化员失败条件：被自身妨碍后仍完成工作
        for (var j = 0; j < allJobs.length; j++) {
            if (allJobs[j].Done && allJobs[j].SabotagedBy != null) await SS_RoleResultCount(SS_FindPlayerByNumber(allJobs[j].SabotagedBy), false);
        }
        if (undone.length == 0) {
            p.JobDoneDays++;
            await SS_Tell("今日工作清单已全部核销。", p, false);
        }
        else {
            p.JobFailDays++;
            await SS_InstallOneRestrain(p);
            await SS_Tell("今日有 " + undone.length + " 项工作未核销。按规程追加一件拘束道具。", p, false);
        }
        // 工作员的成功 / 失败条件按自身工作结算；训练师改由额外任务（部下完成）结算
        if (p.Role == SS_Role.Worker) {
            if (undone.length == 0) {
                p.RoleData.Streak = (p.RoleData.Streak ?? 0) + 1;
                await SS_Tell("连续完成天数：" + p.RoleData.Streak + "/" + SS_WorkerStreakGoal + "。", p, false);
            }
            else {
                p.RoleData.Streak = 0;                       // 中断则连续计数清零
                await SS_RoleResultCount(p, false);          // 失败条件仍按累计未完成天数结算
            }
        }
        await sleep(100);
    }
    // 训练师：额外任务（只能由部下完成）决定自身成功 / 失败与部下的拘束变化
    for (var t of SS_GetPlayingPlayers()) {
        if (t.Role != SS_Role.Trainer) continue;
        const sub = SS_FindPlayerByNumber(t.Subordinate);
        if (sub == null || t.ExtraJob == null) continue;
        const extraDone = (t.ExtraJob.Done == true);
        t.RoleData.SubordinateDone = extraDone;
        t.RoleData.LastSubordinateDone = extraDone;
        await SS_RoleResultCount(t, extraDone);      // 成功：部下完成；失败：部下未完成
        if (extraDone) {
            await SS_RemoveOneRestrain(sub, true);
            await SS_Tell("受你指派的船员完成了额外任务。协议奖励：解除其一件拘束道具。", t, false);
        }
        await sleep(100);
    }
}
//#endregion

//#region 夜晚事件与房间调查
async function SS_CheckRoom(player) {
    if (player == null) return;
    if (player.InGame == false) { await SS_Tell("你尚未进入本站流程。等待区的登记将在凌晨统一处理。", player, false); return; }
    const isSlave = (player.Role == SS_Role.Deprived);
    // 无权限船员在白天可以像晚上一样调查两次房间（注释明确）
    if (isSlave == false && SS_IsNight() == false) {
        await SS_Tell("调查协议仅在夜晚开放。当前时段不接受该请求。", player, false);
        return;
    }
    if (player.Sleeping) { await SS_Tell("你处于休眠状态。休眠期间不开放任何操作。", player, false); return; }
    const used = player.CheckedRooms.length + ((player.CheckingRoom == null) ? 0 : 1);
    if (used >= SS_CheckRoomPerNight) { await SS_Tell("本晚调查配额已用尽（上限 2）。", player, false); return; }
    if (player.CheckingRoom != null) { await SS_Tell("调查进行中。保持当前位置，等待进度完成。", player, false); return; }
    const roomName = SS_GetRoomNameByPos(player.Pos);
    if (roomName == null) {
        await SS_Tell("当前位置不在可调查清单内。", player, false);
        console.log("[SpaceStation] 调查失败：当前位置未命中任何房间区域（房间坐标可能还没填入）");
        return;
    }
    if (player.CheckedRooms.indexOf(roomName) >= 0) { await SS_Tell("该房间本晚已记录，重复调查无效。", player, false); return; }
    player.CheckingRoom = { Name: roomName, EndTime: Date.now() + SS_CheckRoomDuration };
    await SS_Tell("调查协议启动。需在该位置保持 30 秒，中断即作废。", player, false);
}

/** 每秒检查一次：调查是否完成 / 是否因为离开房间而中断 */
async function SS_UpdateCheckRoom() {
    for (var p of SS_GetPlayingPlayers()) {
        if (p.CheckingRoom == null) continue;
        const roomName = SS_GetRoomNameByPos(p.Pos);
        if (roomName != p.CheckingRoom.Name) {
            p.CheckingRoom = null;
            await SS_Tell("检测到位置变更，调查进度已作废。", p, false);
            continue;
        }
        if (Date.now() < p.CheckingRoom.EndTime) continue;
        const finished = p.CheckingRoom.Name;
        p.CheckingRoom = null;
        p.CheckedRooms.push(finished);
        await SS_NightEvent(p, finished);
    }
}

/** 夜晚事件掷骰（概率表见 SS_NightEventTable） */
async function SS_NightEvent(player, roomName) {
    const table = (player.Role == SS_Role.Deprived) ? SS_NightEventTable.deprived : SS_NightEventTable.normal;
    const roll = Math.random() * 100;
    var acc = 0;
    var picked = "nothing";
    for (var i = 0; i < table.length; i++) {
        acc += table[i].Weight;
        if (roll < acc) { picked = table[i].Event; break; }
    }
    console.log("[SpaceStation] " + SS_PlayerTag(player) + " 调查 " + roomName + " → " + SS_NightEventName[picked]);
    await SS_Tell("调查结果已生成：" + SS_NightEventName[picked] + "。", player, false);
    switch (picked) {
        case "restrain":
            await SS_InstallOneRestrain(player);
            break;
        case "free":
            await SS_RemoveOneRestrain(player, true);
            break;
        case "monitor":
            if (player.MonitoredRooms.indexOf(roomName) < 0) player.MonitoredRooms.push(roomName);
            await SS_Tell("已在本房间部署监控节点。黄昏前若有能力在此被执行，记录将回传给你。", player, false);
            break;
        default:
            break;
    }
}

/**
 * 使用能力的暴露判定（需求 10 / 11 / 12）
 *   * 在场目击：同一房间的其他玩家
 *   * 监控发现：在能力使用房间安装过监控的玩家
 *   * 提示统一为"发现xxx（角色名字）做了些什么"
 * excludeMembers          不通报的成员（例如能力目标本人）
 * witnessByTargetAwake    若不为 null，则只有该玩家（能力目标）未睡觉时才走漏（隔离官规则）
 */
async function SS_RevealAbilityUse(actor, roomName, excludeMembers = [], witnessByTargetAwake = null) {
    if (actor == null) return;
    if (witnessByTargetAwake != null && witnessByTargetAwake.Sleeping) return;
    for (var p of SS_GetPlayingPlayers()) {
        if (p.MemberNumber == actor.MemberNumber) continue;
        if (excludeMembers.indexOf(p.MemberNumber) >= 0) continue;
        const inRoom = SS_IsSameRoom(p, actor);
        const monitored = (roomName != null && p.MonitoredRooms.indexOf(roomName) >= 0);
        if (inRoom == false && monitored == false) continue;
        await SS_Tell("发现" + SS_PlayerTag(actor) + "做了些什么", p, false);
        await sleep(100);
    }
}
//#endregion

//#region 投票
async function SS_Vote(player, params) {
    if (SS_Info.Phase != SS_Phase.Dusk) {
        await SS_Tell("当前时段为" + SS_PhaseName[SS_Info.Phase] + "。投票协议仅在黄昏开放。", player, false);
        return;
    }
    if (player.InGame == false) { await SS_Tell("你尚未进入本站流程。等待区的登记将在凌晨统一处理。", player, false); return; }
    if (SS_IsInArea(player.Pos, meetingHallTiles) == false && SS_IsInZone(player.Pos, meetingHallZone) == false) {
        await SS_Tell("投票需在会议厅执行。黄昏时段系统会统一传送。", player, false);
        return;
    }
    if (player.Role == SS_Role.Deprived) { await SS_Tell("不具有投票权限。请求驳回。", player, false); return; }
    if (params.length < 2) { await SS_Tell("用法：[vote 玩家名]。示例：/bot vote zajucd", player, false); return; }
    const target = SS_FindPlayerByParam(params[1]);
    if (target == null || target.InGame == false) { await SS_Tell("目标船员不在本系统名册内。", player, false); return; }
    if (target.MemberNumber == player.MemberNumber) { await SS_Tell("目标不能是你自己。请求驳回。", player, false); return; }
    player.VoteTarget = target.MemberNumber;
    await SS_Tell("投票已记录，目标：" + SS_PlayerTag(target) + "。", player, false);
}

/** 黄昏结束：投票结算 */
async function SS_SettleVote() {
    const counts = {};
    for (var p of SS_GetPlayingPlayers()) {
        if (p.Role == SS_Role.Deprived) continue;      // 无权限船员不能投票
        if (p.VoteTarget == null) continue;
        counts[p.VoteTarget] = (counts[p.VoteTarget] ?? 0) + 1;
    }
    var max = 0;
    var topNums = [];
    for (var num in counts) {
        const c = counts[num];
        if (c > max) { max = c; topNums = [num]; }
        else if (c == max) { topNums.push(num); }
    }
    if (max == 0) {
        await SS_TellAll("本次投票无有效票。裁定：不执行权限剥夺。");
    }
    else if (topNums.length > 1) {
        await SS_TellAll("本次投票出现平票。裁定：不执行权限剥夺。");
    }
    else {
        const target = SS_FindPlayerByNumber(Number(topNums[0]));
        await SS_TellAll("投票裁定：" + SS_PlayerTag(target) + " 得票最高（" + max + " 票）。该船员被判定失职，执行权限剥夺至上限。");
        // 被投票的玩家先传送到会议厅安装格子，安装完毕再传送回原格子（安装过程中会议厅保持封闭）
        const origin = { X: target.Pos.X, Y: target.Pos.Y };
        if (meetingHallInstallTile != null) {
            await Teleport(target, meetingHallInstallTile.X, meetingHallInstallTile.Y);
            await sleep(5000);
        }
        // 投票抓捕的安装不可被保安官抵挡（注释明确）→ force = true
        await SS_InstallMaxRestrain(target, null, true, true);
        if (meetingHallInstallTile != null) {
            await sleep(5000);
            await Teleport(target, origin.X, origin.Y);
        }
        // 心理医师的成功 / 失败条件：精神诊断促成裁定；误诊站方船员则记失败
        for (var d of SS_GetPlayingPlayers()) {
            if (d.Role != SS_Role.Psychiatrist) continue;
            if (d.VoteTarget != target.MemberNumber) continue;
            SS_RoleResultCount(d, target.Faction != SS_Faction.Good);
        }
    }
    // 需求：成为无权限船员改由"四个部位都装上拘束具"判定，见 SS_CheckSlave（安装拘束时即时检查）
    SS_Info.VoteLog.push({ Day: SS_Info.Day, Counts: counts, Tied: (topNums.length > 1) });
    for (var r of SS_GetPlayingPlayers()) r.VoteTarget = null;
}
//#endregion

//#region 阶段流程
function SS_ZoneCenter(zone) {
    if (zone == null || zone.leftUp == undefined) return null;
    return {
        X: Math.floor((zone.leftUp.X + zone.rightDown.X) / 2),
        Y: Math.floor((zone.leftUp.Y + zone.rightDown.Y) / 2),
    };
}

/** 把全体玩家传送到某区域的中心（备用：黄昏已改为按"会议厅格子"逐格传送） */
async function SS_TeleportAllTo(zone, zoneName) {
    const tile = SS_ZoneCenter(zone);
    if (tile == null) {
        console.log("[SpaceStation] " + zoneName + " 坐标未填入，跳过传送");
        return;
    }
    for (var p of SS_GetPlayingPlayers()) {
        await Teleport(p, tile.X, tile.Y);
        await sleep(100);
    }
}

/** 格子列表文本，例：(7，32)(8，32) */
function SS_TilesText(tiles) {
    if (tiles == null || tiles.length == 0) return "（未配置）";
    var s = "";
    for (var t of tiles) s += "（" + t.X + "，" + t.Y + "）";
    return s;
}

/** 从一批格子里随机取一个（空数组返回 null） */
function SS_RandomTile(tiles) {
    if (tiles == null || tiles.length == 0) return null;
    return tiles[Math.floor(Math.random() * tiles.length)];
}

/** 闭区间随机整数 */
function SS_RandInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * 在区域（或 Areas / Exclude 组合区域）内随机取一格
 * 尽量避开已被玩家占用的格子；取不到时回退到区域中心
 */
function SS_RandomTileInZone(zone, excludeMember = null) {
    if (zone == null) return null;
    if (zone.leftUp == undefined && zone.Areas == undefined) return null;
    if (zone.Areas == undefined) {
        for (var i = 0; i < 50; i++) {
            const t = { X: SS_RandInt(zone.leftUp.X, zone.rightDown.X), Y: SS_RandInt(zone.leftUp.Y, zone.rightDown.Y) };
            if (SS_IsTileOccupied(t, excludeMember) == false) return t;
        }
        return SS_ZoneCenter(zone);
    }
    for (var j = 0; j < 80; j++) {
        const area = zone.Areas[Math.floor(Math.random() * zone.Areas.length)];
        const t = { X: SS_RandInt(area.leftUp.X, area.rightDown.X), Y: SS_RandInt(area.leftUp.Y, area.rightDown.Y) };
        if (SS_IsInZone(t, zone) && SS_IsTileOccupied(t, excludeMember) == false) return t;
    }
    return SS_ZoneCenter(zone.Areas[0]);
}

/** 生成 0 ~ n-1 的索引数组并打乱（Fisher-Yates） */
function SS_ShuffleIndexes(n) {
    const arr = [];
    for (var i = 0; i < n; i++) arr.push(i);
    for (var j = arr.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        const t = arr[j]; arr[j] = arr[k]; arr[k] = t;
    }
    return arr;
}

/** 某个格子上是否已经有其他玩家站着 */
function SS_IsTileOccupied(tile, excludeMember = null) {
    if (tile == null) return false;
    for (var c of ChatRoomCharacter) {
        if (c == null || c.MapData == null || c.MapData.Pos == null) continue;
        if (excludeMember != null && c.MemberNumber == excludeMember) continue;
        if (c.MapData.Pos.X == tile.X && c.MapData.Pos.Y == tile.Y) return true;
    }
    return false;
}

/** 从一批格子里挑一个当前没有玩家占用的（全被占用时回退到随机一格） */
function SS_PickFreeTile(tiles, excludeMember = null) {
    if (tiles == null || tiles.length == 0) return null;
    const free = tiles.filter(t => SS_IsTileOccupied(t, excludeMember) == false);
    if (free.length > 0) return free[Math.floor(Math.random() * free.length)];
    return SS_RandomTile(tiles);
}

/**
 * 把全体游戏内玩家按顺序传送到某批格子
 * 需求：临时生成格子索引数组并打乱，玩家按顺序取用（玩家数多于格子数时循环复用）
 */
async function SS_TeleportAllToTiles(tiles, label) {
    if (tiles == null || tiles.length == 0) {
        console.log("[SpaceStation] " + label + " 未配置，跳过传送");
        return;
    }
    const order = SS_ShuffleIndexes(tiles.length);
    const list = SS_GetPlayingPlayers();
    for (var i = 0; i < list.length; i++) {
        const tile = tiles[order[i % order.length]];
        if (tile == null) continue;
        await Teleport(list[i], tile.X, tile.Y);
        await sleep(100);
    }
}

/** 封住会议厅格子（投票期间玩家无法离开会议厅） */
async function SS_BlockMeetingHall() {
    await SS_UpdateMapObjects(meetingHallBlockTiles, SS_MeetingHallBlockObjId);
    SS_Info.MeetingHallClosed = true;
}

/** 解除会议厅格子封闭（可重复调用，未封闭时直接返回） */
async function SS_UnblockMeetingHall() {
    if (SS_Info.MeetingHallClosed == false) return;
    await SS_RestoreMapObjects(meetingHallBlockTiles);
    SS_Info.MeetingHallClosed = false;
}

//#region 地图更新函数（需求 14：更新地图堵住 / 放开睡眠仓格子）
var SS_MapObjBackup = {};   // "X,Y" -> 原始 Object 字符码

/** 用 SetMapObjs 批量改地图物件；改动前记录原值以便恢复 */
async function SS_UpdateMapObjects(tiles, objId) {
    if (tiles == null || tiles.length == 0) {
        console.log("[SpaceStation] 目标格子坐标未填入，跳过地图物件更新");
        return false;
    }
    if (ChatRoomData.MapData == null || ChatRoomData.MapData.Objects == null) {
        console.log("[SpaceStation] 房间地图对象不存在，跳过地图物件更新");
        return false;
    }
    const opers = [];
    for (var i = 0; i < tiles.length; i++) {
        const key = tiles[i].X + "," + tiles[i].Y;
        if (SS_MapObjBackup[key] == undefined) {
            SS_MapObjBackup[key] = GetCharIn40x40String(ChatRoomData.MapData.Objects, tiles[i].X, tiles[i].Y);
        }
        opers.push({ X: tiles[i].X, Y: tiles[i].Y, Id: objId });
    }
    await SetMapObjs(opers);
    console.log("[SpaceStation] 地图物件已更新：" + opers.length + " 格 → " + objId);
    return true;
}

/** 把之前记录的地图物件恢复原样 */
async function SS_RestoreMapObjects(tiles) {
    if (tiles == null || tiles.length == 0) return false;
    const opers = [];
    for (var i = 0; i < tiles.length; i++) {
        const key = tiles[i].X + "," + tiles[i].Y;
        const backup = SS_MapObjBackup[key];
        if (backup == undefined) continue;
        opers.push({ X: tiles[i].X, Y: tiles[i].Y, Id: backup });
        delete SS_MapObjBackup[key];
    }
    if (opers.length == 0) {
        // 没有备份（例如 bot 中途重新粘贴）：恢复成空地占位
        for (var j = 0; j < tiles.length; j++) {
            opers.push({ X: tiles[j].X, Y: tiles[j].Y, Id: SS_SleepPodOpenObjId });
        }
    }
    await SetMapObjs(opers);
    console.log("[SpaceStation] 地图物件已恢复：" + opers.length + " 格");
    return true;
}
//#endregion

//#region 睡眠（需求 14）
/** 封锁睡眠仓格子（使用"睡眠舱格子封闭"那批格子） */
async function SS_CloseSleepPod() {
    await SS_UpdateMapObjects(sleepPodBlockTiles, SS_SleepPodBlockObjId);
    SS_Info.SleepPodClosed = true;
}

/** 放开睡眠仓格子 */
async function SS_OpenSleepPod() {
    if (SS_Info.SleepPodClosed == false) return;
    await SS_RestoreMapObjects(sleepPodBlockTiles);
    SS_Info.SleepPodClosed = false;
}

/** 玩家是否位于睡眠舱格子上（需求：只判断格子，不再看睡眠仓房间范围） */
function SS_IsInSleepPod(player) {
    if (player == null) return false;
    return SS_IsInArea(player.Pos, sleepPodTiles);
}

/** 入睡：装备睡眠装备、重置疲劳值（Sleeping == true 即视为已装备睡眠装备） */
async function SS_FallAsleep(player) {
    if (player == null || player.Sleeping) return false;
    player.Sleeping = true;
    player.Fatigue = 0;
    player.FatiguePunished = false;
    player.CheckingRoom = null;
    player.SleptThisNight = true;                       // 本晚已入睡（凌晨未睡会累积影响）
    SS_AddCorruption(player, -SS_CorruptionSleepDrop);  // 睡眠使腐化状态下降（静默，不提示）
    await WearEquips(player, SS_SleepEquips);
    await SS_Tell("已进入休眠。疲劳计数归零。", player, false);
    return true;
}

/** 醒来：脱下睡眠装备（silent = true 时不发提示） */
async function SS_WakeUp(player, silent = false) {
    if (player == null || player.Sleeping == false) return false;
    player.Sleeping = false;
    // 只脱睡眠装备占用的位置（这些位置可能被拘束具覆盖，交给拘束逻辑各自管理）
    const list = SS_SleepEquips.map(e => ({ AssetGroup: e.AssetGroup }));
    await RemoveEquips(player, list, true, false);
    if (silent == false) await SS_Tell("光照周期开始，休眠协议结束。", player, false);
    return true;
}

/** 夜晚睡眠窗口结束：仓内玩家入睡，然后封锁睡眠仓格子（可重复调用，已封锁时直接返回） */
async function SS_CloseSleepPodAndSleep() {
    if (SS_Info.SleepPodClosed) return;
    for (var p of SS_GetPlayingPlayers()) {
        if (p.Sleeping) continue;
        if (SS_IsInSleepPod(p) == false) continue;
        await SS_FallAsleep(p);
        await sleep(100);
    }
    await SS_CloseSleepPod();
    await SS_TellAll("【夜晚】睡眠舱已封锁。舱内船员进入休眠。");
}

/** 凌晨：让所有睡眠中的玩家醒来并脱下睡眠装备 */
async function SS_WakeAllSleepers() {
    for (var p of players) {
        if (p.Sleeping) await SS_WakeUp(p);
    }
}
//#endregion

//#region 结局展示区（需求 5 / 6）
/**
 * 达成成功 / 失败条件 → 离开游戏前往结局展示区
 * 播放结局文本 + 穿戴结局装备，公告不公布玩家身份
 */
async function SS_ToEnding(player, isSuccess, reason) {
    if (player == null || player.Ended) return;
    SS_SetPlayerState(player, "ended");            // 离开游戏 → 只属于 endedPlayers（结局展示区）
    player.EndingSuccess = (isSuccess == true);
    player.EndingEndTime = Date.now() + SS_EndingDuration;
    player.CheckingRoom = null;
    if (player.Sleeping) await SS_WakeUp(player, true);   // 睡着时进结局：顺手脱下睡眠装备
    player.SubordinateJob = null;
    const info = SS_RoleInfo[player.Role];
    const roleName = (info == undefined) ? "无" : info.Name;
    // 结局文本：先显示阵营的成功 / 失败文本，再显示该角色自己的成功 / 失败文本
    const byFaction = SS_EndingTextByFaction[player.Faction];
    const factionText = (byFaction != undefined) ? (isSuccess ? byFaction.success : byFaction.fail)
        : (isSuccess ? SS_EndingText.success : SS_EndingText.fail);
    const roleText = (info != undefined) ? (isSuccess ? (info.EndingSuccess ?? "") : (info.EndingFail ?? "")) : "";
    // 结局文本只私聊本人
    await SS_Tell("【结局·阵营】" + factionText, player, false);
    if (roleText != "") await SS_Tell("【结局·职能】" + roleText, player, false);
    await SS_Tell("【结局判定】职能：" + roleName + "（" + SS_FactionName[player.Faction] + "阵营）　裁定：" + reason, player, false);
    await WearEquips(player, isSuccess ? SS_SuccessEndingEquips : SS_FailEndingEquips);
    // 结局展示区格子：优先挑当前没有玩家占用的格子，全被占用时回退随机一格 / 区域中心
    const tile = SS_PickFreeTile(endingTiles, player.MemberNumber) ?? SS_ZoneCenter(endingZone);
    if (tile == null) console.log("[SpaceStation] 结局展示区坐标未填入，跳过传送");
    else await Teleport(player, tile.X, tile.Y);
    await SS_TellAll("一名船员的结局条件已成立，已移出流程并进入展示区。身份不予公布。");
    console.log("[SpaceStation] " + SS_PlayerTag(player) + " 进入结局展示区：" + (isSuccess ? "成功" : "失败") + " - " + reason);
    // 需求：达成结局同样视为离开游戏，需要判断是否已经没有游戏中的玩家
    await SS_CheckGameEmpty();
}

/** 结局展示结束后释放玩家：脱结局装备、传回等待区、重置状态（需求 6） */
async function SS_ReleaseEndedPlayer(player) {
    if (player == null) return;
    const equipList = SS_SuccessEndingEquips.concat(SS_FailEndingEquips).map(e => ({ AssetGroup: e.AssetGroup }));
    await RemoveEquips(player, equipList, true, false);
    // 需求：结局展示结束后传送到游戏外大厅
    const tile = (outHallZone != null) ? SS_ZoneCenter(outHallZone)
        : (SS_RandomTile(lobbySpawnTiles) ?? SS_ZoneCenter(lobbyZone));
    if (tile != null) await Teleport(player, tile.X, tile.Y);
    player.Ended = false;
    SS_SetPlayerState(player, "outside");           // 释放后处于游戏外（不在任何列表），要重新 [start] 才能再入局
    player.EndingSuccess = null;
    player.EndingEndTime = 0;
    player.SlaveSince = 0;
    player.InGame = false;
    player.Waiting = false;
    player.Role = SS_Role.None;
    player.RoleData = {};
    player.Jobs = [];
    player.ExtraJob = null;
    player.SubordinateJob = null;
    player.Subordinate = null;
    player.SubordinateOwner = null;
    player.GrantedAbility = null;
    player.PendingArrest = [];
    player.Restrains = { mouth: false, eye: false, leg: false, body: false };
    player.RestrainBy = {};
    player.RestrainCleared = false;
    await SS_Tell("展示协议结束，你已被移回游戏外大厅。如需再次申请，前往开始格子提交 [start]。", player, false);
    console.log("[SpaceStation] " + SS_PlayerTag(player) + " 已从结局展示区释放");
}

/** 定时检查：结局展示到期的玩家被释放（需求 6） */
async function SS_UpdateEndingPlayers() {
    // 先清掉已经离开房间的结局玩家
    for (var i = endedPlayers.length - 1; i >= 0; i--) {
        if (endedPlayers[i].Character == null) {
            SS_SetPlayerState(endedPlayers[i], "outside");   // 已离开房间 → 不属于任何列表
        }
    }
    for (var p of endedPlayers.slice()) {
        if (p.Ended != true) continue;
        if (Date.now() < p.EndingEndTime) continue;
        await SS_ReleaseEndedPlayer(p);
    }
}
//#endregion

/**
 * [start]：必须站在"开始格子"上登记（需求 4）
 * 真正的"进入游戏"发生在凌晨 —— 登记后等凌晨在等待区统一加入并分配角色
 */
async function SS_PlayerStart(player) {
    if (player.InGame) { await SS_Tell("你已在流程中，重复申请无效。", player, false); return; }
    if (player.Ended) { await SS_Tell("你处于展示区。展示结束前不接受新申请。", player, false); return; }
    if (player.Waiting) { await SS_Tell("登记已存在。凌晨统一处理，无需重复提交。", player, false); return; }
    // 需求：游戏最大人数 10 人（等待中 + 游戏内），达到上限时无法登记
    const waitingCount = waitingPlayers.filter(p => p.Character != null).length;
    const playingCount = SS_GetPlayingPlayers().length;
    if (waitingCount + playingCount >= SS_MaxPlayers) {
        await SS_Tell("本站容量已达上限（等待中 " + waitingCount + " + 游戏中 " + playingCount + " / 上限 " + SS_MaxPlayers + "）。请求驳回。", player, false);
        return;
    }
    // 需求：必须站在开始格子上使用 [start]
    if (startTiles != null && SS_IsInArea(player.Pos, startTiles) == false) {
        await SS_Tell("位置不符。请移动至开始格子" + SS_TilesText(startTiles) + "后重新提交 [start]。", player, false);
        return;
    }
    // [start] 的固定流程：进入等待 → 清空装备 → 装备游戏开始装备 → 传送到等待区
    // 需求：非黄昏时段都可以直接加入游戏（不经过等待区）；其中只有凌晨加入才分配当日工作，
    //       白天（以及夜晚/睡眠窗口）加入时当天不分配工作
    const joinNow = (SS_Info.Running == true && SS_Info.Phase != SS_Phase.Dusk);
    const assignJobs = (SS_Info.Phase == SS_Phase.Dawn);
    SS_SetPlayerState(player, "waiting");          // 1) 等待加入游戏（只属于 waitingPlayers）
    player.Fatigue = 0;
    player.FatiguePunished = false;
    player.CheckedRooms = [];
    player.CheckingRoom = null;
    player.Sleeping = false;
    if (joinNow == false) {
        const waitTile = SS_RandomTileInZone(lobbyZone, player.MemberNumber);
        if (waitTile != null) await Teleport(player, waitTile.X, waitTile.Y);   // 4) 传送到等待区
    }
    await sleep(1000)
    await RemoveClothes(player, true, true, false);      // 2) 清空装备：脱掉所有衣服
    await RemoveRestrains(player, true);                 //    并解除所有拘束装备
    await sleep(2000);
    await WearEquips(player, SS_EnterGameEquips);  // 3) 装备游戏开始装备
    if (joinNow) {
        // 凌晨登记：直接执行加入处理（传送到出生点格子、分配角色与当日工作）
        await SS_JoinGameNow(player, assignJobs);
        console.log("[SpaceStation] " + SS_PlayerTag(player) + " 在非黄昏时段登记并直接加入游戏（分配工作=" + assignJobs + "）");
        return;
    }
    await SS_Tell("登记已受理。你已被转移至等待区，凌晨统一进入流程。协议见 bot 的 bio；状态查询用 [think]。", player, false);
    console.log("[SpaceStation] " + SS_PlayerTag(player) + " 在开始格子登记");
    if (SS_Info.Running == false) {
        await sleep(5000);
        SS_Info.Running = true;
        SS_Info.Day = 1;
        await SS_EnterDawn();
    }
}

/**
 * 让一名等待中的玩家立即进入游戏
 * 流程：归属切换为游戏中 → 传送到出生点格子 → 提示 → 分配角色 → （可选）分配当日工作
 * assignJobs = false 时由调用方统一分配（凌晨批量加入走 SS_EnterDawn 的第 4 步）
 */
async function SS_JoinGameNow(player, assignJobs = true) {
    if (player == null || player.Character == null) return false;
    SS_SetPlayerState(player, "playing");          // 只属于 players
    player.CheckedRooms = [];
    player.CheckingRoom = null;
    player.Sleeping = false;
    // 需求 8：进入游戏的出生点是"出生点格子"
    const birthTile = SS_RandomTile(lobbySpawnTiles);
    if (birthTile != null) await Teleport(player, birthTile.X, birthTile.Y);
    await SS_Tell("你已进入流程。", player, false);
    await SS_AssignRoleToNewPlayer(player);
    if (assignJobs) {
        await SS_AssignJobs(player);
    }
    else {
        player.Jobs = [];
        await SS_Tell("今日工作配额已关闭（非凌晨加入），明日凌晨下发。", player, false);
    }
    await sleep(100);
    return true;
}

/** 凌晨的其它结算：隔离官的拘束、保安官庇护到期、接管督导赋予的能力到期、无权限船员的结局判定 */
async function SS_SettleDawnEffects() {
    for (var p of SS_GetPlayingPlayers()) {
        // 隔离官预约的拘束在凌晨安装
        for (var i = 0; i < p.PendingArrest.length; i++) {
            await SS_InstallOneRestrain(p.PendingArrest[i].Target, p, true, true);
        }
        p.PendingArrest = [];
        // 保安官：庇护到期 + 失败条件（当天庇护了对象却一次也没挡下）
        if (p.Role == SS_Role.Sheriff) {
            if (p.RoleData.BlockedToday != true && p.RoleData.ProtectedTarget != null) await SS_RoleResultCount(p, false);
            p.RoleData.BlockedToday = false;
            p.RoleData.ProtectedTarget = null;
        }
        // 工作员：连续完成天数达标，且到达凌晨时位于冷冻睡眠仓（结局展示区）→ 成功
        if (p.Role == SS_Role.Worker) {
            if ((p.RoleData.Streak ?? 0) >= SS_WorkerStreakGoal && SS_IsInZone(p.Pos, endingZone)) {
                await SS_ToEnding(p, true, "连续 " + SS_WorkerStreakGoal + " 天完成工作清单，且到达凌晨时位于冷冻睡眠仓");
            }
        }
        // 接管督导：失败条件（无权限船员一整天没有使用被赋予的能力）
        if (p.Role == SS_Role.Supervisor) {
            if (p.RoleData.GrantedToday == true && p.RoleData.SlaveUsedAbility != true) await SS_RoleResultCount(p, false);
            p.RoleData.GrantedToday = false;
            p.RoleData.SlaveUsedAbility = false;
        }
        // 无权限船员的结局判定（达成后离开游戏进入结局展示区，需求 5）
        if (p.Role == SS_Role.Deprived) {
            if (SS_GetRestrainCount(p) == 0) {
                await SS_ToEnding(p, true, "无权限船员成功条件：解除身上所有拘束道具");
            }
            // 需求：按"成为无权限船员后经过三天"计算，而不是游戏进行到第几天
            else if (p.SlaveSince > 0 && SS_Info.Day - p.SlaveSince >= 3) {
                await SS_ToEnding(p, false, "无权限船员失败条件：权限等级未恢复（第 " + p.SlaveSince + " 天起计满三天）");
            }
        }
        // 每日重置
        p.ProtectedUntilDawn = false;
        p.ProtectedBy = null;
        p.GrantedAbility = null;
        p.RoleData.ArrestedToday = false;
        p.RoleData.SabotagedToday = false;
        p.RoleData.DominatedToday = false;
        p.RoleData.ScoutedToday = false;
        p.AbilityCharge = null;      // 新的一天，未完成的能力蓄力作废
        await sleep(100);
    }
}

async function SS_EnterDawn() {
    SS_Info.Phase = SS_Phase.Dawn;
    SS_Info.PhaseEndTime = Date.now() + SS_PhaseDuration.dawn;
    await SS_TellAll("【凌晨】第 " + SS_Info.Day + " 天。系统状态已重置。");

    // 0) 腐化结算（静默）：到达凌晨时仍未入睡的船员受影响加深，随后重置本晚记录
    for (var pc of SS_GetPlayingPlayers()) {
        if (pc.SleptThisNight != true) SS_AddCorruption(pc, 1);
        pc.SleptThisNight = false;
    }

    // 1) 睡眠结束：脱下睡眠装备 + 放开睡眠仓格子（需求 14）
    await SS_WakeAllSleepers();
    await SS_OpenSleepPod();

    // 2) 凌晨效果结算（"工作是否完成"的判定已移到黄昏前，见 SS_EnterDusk）
    await SS_SettleDawnEffects();

    // 3) 等待区登记的玩家在凌晨加入游戏并分配角色（需求 5）
    //    先清掉已经离开房间的等待区玩家
    for (var wi = waitingPlayers.length - 1; wi >= 0; wi--) {
        if (waitingPlayers[wi].Character == null) {
            SS_SetPlayerState(waitingPlayers[wi], "outside");
        }
    }
    for (var w of waitingPlayers.slice()) {
        if (w.Waiting != true || w.InGame == true || w.Ended == true) continue;
        if (w.Character == null) continue;
        await SS_JoinGameNow(w, false);            // 工作由下面的第 4 步统一分配
    }

    // 4) 给所有在游戏中的玩家布置当日工作（检测是否完成在黄昏，见 SS_EnterDusk）
    for (var p of SS_GetPlayingPlayers()) {
        await SS_AssignJobs(p);
        p.CheckedRooms = [];
        p.CheckingRoom = null;
        await sleep(100);
    }
    await SS_TellAll("【凌晨】职能与工作清单已下发。白天前往对应房间执行。");
}

async function SS_EnterDay() {
    SS_Info.Phase = SS_Phase.Day;
    SS_Info.PhaseEndTime = Date.now() + SS_PhaseDuration.day;
    await SS_TellAll("【白天】工作时段。按清单执行，不接受延期。");
}

async function SS_EnterDusk() {
    SS_Info.Phase = SS_Phase.Dusk;
    SS_Info.PhaseEndTime = Date.now() + SS_PhaseDuration.dusk;
    // 需求 5：工作是否完成的判定放在"白天结束、进入黄昏之前"
    await SS_SettleJobs();
    await SS_TellAll("【黄昏】全员转移至会议厅，执行投票协议。");
    // 注释明确"黄昏时间将玩家传送至会议厅"：传送到会议厅格子，再封住外围格子
    await SS_TeleportAllToTiles(meetingHallTiles, "会议厅格子");
    await SS_BlockMeetingHall();
}

/**
 * 夜晚的第一段：关闭睡眠舱之前的一分钟
 * 时间循环上它是独立阶段（SS_Phase.SleepWindow，时长 SS_PhaseDuration.sleepWindow），
 * 但游戏上视作夜晚：SS_IsNight() 为真、状态名显示"夜晚"、夜晚行为在这一分钟内同样可用
 */
async function SS_EnterSleepWindow() {
    await SS_SettleVote();                  // 黄昏结束：投票 + 安装（安装期间会议厅保持封闭）
    await SS_UnblockMeetingHall();          // 投票与安装结束，解除会议厅封闭
    SS_Info.Phase = SS_Phase.SleepWindow;
    SS_Info.PhaseEndTime = Date.now() + SS_PhaseDuration.sleepWindow;
    SS_Info.SleepCloseTime = SS_Info.PhaseEndTime;    // 该阶段结束即封锁睡眠仓
    SS_Info.SleepPodClosed = false;
    await SS_TellAll("【夜晚】调查协议开放。" + Math.floor(SS_PhaseDuration.sleepWindow / 1000) + " 秒后仍停留在睡眠舱格子上的船员将进入休眠，随后睡眠舱封锁。");
}

/** 夜晚的第二段：封锁睡眠仓之后直到凌晨的阶段 */
async function SS_EnterNight() {
    SS_Info.Phase = SS_Phase.Night;
    SS_Info.PhaseEndTime = Date.now() + SS_PhaseDuration.night;
    // 睡眠窗口阶段结束 → 封锁睡眠仓，仍站在睡眠舱格子上的玩家入睡
    await SS_CloseSleepPodAndSleep();
}

async function SS_NextPhase() {
    // 时间推进：低概率使全体游戏内船员受影响（静默，不提示）
    for (var p of SS_GetPlayingPlayers()) {
        if (Math.random() < SS_CorruptionPhaseChance) SS_AddCorruption(p, 1);
    }
    switch (SS_Info.Phase) {
        case SS_Phase.Dawn: await SS_EnterDay(); break;
        case SS_Phase.Day: await SS_EnterDusk(); break;
        case SS_Phase.Dusk: await SS_EnterSleepWindow(); break;
        case SS_Phase.SleepWindow: await SS_EnterNight(); break;
        case SS_Phase.Night:
            SS_Info.Day++;
            await SS_EnterDawn();
            break;
        default: break;
    }
}

//#region 离开游戏与重置（需求 1 / 2）
/**
 * 玩家离开游戏：清空其游戏内状态
 * 无论 removeFromList 取值，玩家都会离开三个列表（变成游戏外状态）
 * removeFromList = true 只用于语义说明：人已不在房间（主动离开 / 被踢 / 被封 / 掉线超时）
 */
async function SS_LeaveGame(player, removeFromList = false) {
    if (player == null) return;
    const wasPlaying = (player.InGame == true);
    player.InGame = false;
    player.Waiting = false;
    player.Ended = false;
    player.EndingEndTime = 0;
    player.DisconnectTime = 0;
    player.SlaveSince = 0;
    player.AbilityCharge = null;
    player.CheckingRoom = null;
    player.Sleeping = false;
    player.Role = SS_Role.None;
    player.RoleData = {};
    player.Jobs = [];
    player.ExtraJob = null;
    player.SubordinateJob = null;
    player.Subordinate = null;
    player.SubordinateOwner = null;
    player.GrantedAbility = null;
    player.PendingArrest = [];
    player.VoteTarget = null;
    player.MonitoredRooms = [];
    player.CheckedRooms = [];
    player.ProtectedUntilDawn = false;
    player.ProtectedBy = null;
    player.Fatigue = 0;
    player.FatiguePunished = false;
    // 离开游戏 → 不属于任何列表（三个列表的定义固定且互不重复）
    SS_SetPlayerState(player, "outside");
    if (wasPlaying) await SS_CheckGameEmpty();
}

/** 游戏中已经没有玩家时重置整局游戏（需求 1） */
async function SS_CheckGameEmpty() {
    if (SS_GetPlayingPlayers().length > 0) return;
    await SS_ResetGame();
}

/** 重置游戏状态：清空全局进度与所有玩家的游戏内数据，并恢复被封锁的地图 */
async function SS_ResetGame() {
    // 恢复可能被封锁的地图
    await SS_OpenSleepPod();
    await SS_UnblockMeetingHall();
    // 全局状态
    SS_Info.Running = false;
    SS_Info.Day = 0;
    SS_Info.Phase = SS_Phase.Wait;
    SS_Info.PhaseEndTime = 0;
    SS_Info.SleepCloseTime = 0;
    SS_Info.SleepPodClosed = false;
    SS_Info.MeetingHallClosed = false;
    SS_Info.VoteLog = [];
    // 只重置"房间内玩家"的游戏内状态（保留等待区登记，让已在等待区的人能随下次凌晨加入）
    // 结局展示中的玩家不在 players 里，也不随重置变化：他们保持原有状态，等待展示结束被释放
    for (var p of players) {
        p.InGame = false;
        p.Ended = false;
        p.EndingEndTime = 0;
        p.DisconnectTime = 0;
        p.AbilityCharge = null;
        p.CheckingRoom = null;
        p.Sleeping = false;
        p.Role = SS_Role.None;
        p.RoleData = {};
        p.SlaveSince = 0;
        p.Jobs = [];
        p.ExtraJob = null;
        p.SubordinateJob = null;
        p.Subordinate = null;
        p.SubordinateOwner = null;
        p.GrantedAbility = null;
        p.PendingArrest = [];
        p.VoteTarget = null;
        p.MonitoredRooms = [];
        p.CheckedRooms = [];
        p.ProtectedUntilDawn = false;
        p.ProtectedBy = null;
        p.Fatigue = 0;
        p.FatiguePunished = false;
    }
    // 注意：不清空 endedPlayers —— 结局展示中的玩家保持等待释放，与游戏重置无关
    console.log("[SpaceStation] 游戏中已无玩家，游戏状态已重置");
    await SS_TellAll("流程内已无船员，系统状态已重置。在开始格子提交 [start] 后，凌晨重新开始。");
    // 等待区已经有人登记 → 立即重新开始
    const waiting = waitingPlayers.filter(p => p.Character != null);
    if (waiting.length > 0) {
        SS_Info.Running = true;
        SS_Info.Day = 1;
        await SS_EnterDawn();
    }
}

/** 掉线宽限期检查：超过 SS_ReconnectGrace 仍未回到房间则视为离开游戏（需求 2） */
async function SS_UpdateDisconnected() {
    // 三个列表里的玩家都可能掉线（等待区 / 游戏中 / 结局展示区）
    for (var p of players.concat(waitingPlayers, endedPlayers).slice()) {
        if (p.DisconnectTime <= 0) continue;
        if (Date.now() - p.DisconnectTime < SS_ReconnectGrace) continue;
        console.log("[SpaceStation] " + SS_PlayerTag(p) + " 掉线超过 " + Math.floor(SS_ReconnectGrace / 1000) + " 秒，视为离开游戏");
        await SS_LeaveGame(p, true);
    }
}
//#endregion

async function SS_TimeEvent() {
    // 掉线宽限期检查：游戏是否进行中都需要处理
    await SS_UpdateDisconnected();
    // 结局展示到期后释放玩家（需求：结局展示与游戏是否进行无关，重置后也要继续计时释放）
    await SS_UpdateEndingPlayers();
    if (SS_Info.Running == false || SS_Info.Phase == SS_Phase.Wait) return;
    await SS_UpdateCheckRoom();
    // 能力蓄力：与目标同一房间停留足够时长后能力生效（参考调查房间的计时方式）
    await SS_UpdateAbilityCharge();
    // 睡眠仓封锁改由阶段切换触发：睡眠窗口阶段结束 → SS_EnterNight() → SS_CloseSleepPodAndSleep()
    if (Date.now() >= SS_Info.PhaseEndTime) await SS_NextPhase();
}

var SS_EndTimeEvent = false;
async function SS_TimeEventStart() {
    while (SS_EndTimeEvent == false) {
        try {
            await SS_TimeEvent();
        }
        catch (e) {
            console.log("[SpaceStation] TimeEvent 出错：", e);
        }
        await sleep(1000);
    }
}
//#endregion

//#region 玩家指令
const SS_HelpText = "[help]指令清单 [think]系统状态 [task]今日工作清单 [check]当前定位 [start]在开始格子提交登记 [vote 玩家]投票 [use 玩家]使用职能 [checkroom]调查房间 [unstuck]脱离卡死 [take]/[put]库存整理 [system]/[system 答案]系统维护 [research red|white|black|cyan]研究收容物";

async function DoCommands(player, params) {
    const cmd = params[0];
    switch (cmd) {
        case "help": await SS_Tell("系统指令清单：" + SS_HelpText, player, false); return;
        case "think": await SS_Think(player); return;
        case "task": await SS_ShowTask(player); return;
        case "check": await SS_CheckPos(player); return;
        case "start": await SS_PlayerStart(player); return;
        case "vote": await SS_Vote(player, params); return;
        case "use": await SS_UseAbility(player, params); return;
        case "checkroom": await SS_CheckRoom(player); return;
        case "unstuck": await SS_Unstuck(player); return;
        default: break;
    }
    // 其余指令都是区域指令：需要站在对应区域的格子上
    const inArea = SS_FindAreaByPos(player.Pos);
    if (Object.keys(inArea).length == 0) {
        await SS_Tell("当前位置无可用指令。使用 [help] 查询指令清单；区域坐标未填入时，区域指令一律不可用。", player, false);
        return;
    }
    var hasTile = false;
    for (var key in inArea) {
        if (inArea[key].IsZone == false && mapEvents[key].Cmd[cmd] != undefined) { hasTile = true; break; }
    }
    for (var key2 in inArea) {
        if (hasTile && inArea[key2].IsZone) continue;      // 站在具体格子上时优先执行格子的指令
        const fn = mapEvents[key2].Cmd[cmd];
        if (fn != undefined) { await fn(player, params.slice(1), inArea[key2]); return; }
    }
    await SS_Tell("[" + cmd + "] 在此位置不可用。使用 [help] 查询指令清单。", player, false);
}

async function SS_Think(player) {
    var state = "";
    if (player.Ended) state = "结局展示中（" + (player.EndingSuccess ? "成功" : "失败") + "）";
    else if (player.InGame) state = "游戏中";
    else if (player.Waiting) state = "等待区登记（凌晨加入）";
    else state = "未加入";
    // 需求：被剥夺视觉感知权限时，状态面板会掺入黑色方块
    await SS_Tell(SS_RenderTo(player, "系统状态：" + SS_PhaseName[SS_Info.Phase] + " 第" + SS_Info.Day + "天 | " + state
        + " | 角色：" + player.RoleName + "（" + SS_FactionName[player.Faction] + "）| 拘束：" + player.RestrainCount + "/4 | 疲劳："
        + player.Fatigue + "/" + SS_FatigueLimit + " | 今晚调查：" + player.CheckedRooms.length + "/" + SS_CheckRoomPerNight
        + " | 投票：" + (player.VoteTarget == null ? "未投" : "已投")), player, false);
}

/** 显示单项工作的进度与提示 */
async function SS_ShowOneJob(player, job) {
    const info = SS_JobInfo[job.Type];
    var extra = "";
    // 需求 3：库存整理要显示需要拿取 / 放置的位置（(a,1) 格式）
    if (job.Type == SS_JobType.Storage && job.Carry != null && job.Done == false) {
        extra = "　当前：从" + SS_StorageCellText(job.Carry.From) + "拿取 → 放到" + SS_StorageCellText(job.Carry.To)
            + (job.Carry.Taked ? "（手上已有物品）" : "");
    }
    // 被净化员妨碍过的进度不会额外提示玩家（注释：妨碍不通知目标玩家，但目标仍可查看自身任务状态）
    // 需求：被剥夺视觉感知权限时，任务面板会掺入黑色方块
    await SS_Tell(SS_RenderTo(player, "【" + info.Name + "】进度 " + job.Progress + "/" + job.Target + (job.Done ? "（已完成）" : "") + " —— " + info.Hint + extra), player, false);
    await sleep(100);
}

/**
 * 查看今日工作进度
 * 需求 1 / 8：训练师的额外任务进度只有训练师本人能查看，部下看不到、也不会收到通知
 */
async function SS_ShowTask(player) {
    var shown = 0;
    for (var i = 0; i < player.Jobs.length; i++) {
        await SS_ShowOneJob(player, player.Jobs[i]);
        shown++;
    }
    if (player.Role == SS_Role.Trainer && player.ExtraJob != null) {
        const sub = (player.Subordinate == null) ? null : SS_FindPlayerByNumber(player.Subordinate);
        const subText = (player.Subordinate == null) ? "　尚未指定部下"
            : ("　执行者：" + ((sub == null) ? "（已离开房间）" : SS_PlayerTag(sub)));
        await SS_Tell("【额外任务·仅自己可见】" + SS_JobInfo[player.ExtraJob.Type].Name
            + "　进度 " + player.ExtraJob.Progress + "/" + player.ExtraJob.Target
            + (player.ExtraJob.Done ? "（已完成）" : "") + subText, player, false);
        shown++;
    }
    if (shown == 0) {
        await SS_Tell("今日工作清单为空" + (player.Role == SS_Role.Deprived ? "（该角色不参与工作分配）" : "") + "。", player, false);
    }
}

async function SS_CheckPos(player) {
    const roomName = SS_GetRoomNameByPos(player.Pos);
    const areas = SS_FindAreaByPos(player.Pos);
    const names = Object.keys(areas);
    await SS_Tell("定位记录：坐标（" + player.Pos.X + "，" + player.Pos.Y + "）房间：" + (roomName == null ? "未知" : roomName)
        + "　区域：" + (names.length == 0 ? "无" : names.join(" / ")), player, false);
}

/**
 * 把目标传送到游戏外大厅的随机位置（游戏外玩家 / 等待区玩家脱困用）
 * 目标可以是 Character 或 PlayerInfo（两者的 MemberNumber 都会被 Teleport / SendText 使用）
 */
async function SS_TeleportToOutHall(target, prefix = "已转移至游戏外大厅") {
    const tile = SS_RandomTileInZone(outHallZone, target.MemberNumber) ?? SS_RandomTile(lobbySpawnTiles);
    if (tile == null) { await SS_Tell("游戏外大厅坐标未配置，脱困协议无法执行。", target, false); return false; }
    await Teleport(target, tile.X, tile.Y);
    await SS_Tell(prefix + "（" + tile.X + "，" + tile.Y + "）。", target, false);
    return true;
}

/**
 * [unstuck] 脱离卡死（四条分支固定如下）
 *   * 结局展示区中的玩家：不可使用
 *   * 等待区中登记的玩家：取消等待 → 传送到游戏外大厅
 *   * 不在游戏中的玩家：传送到游戏外大厅
 *   * 游戏中的玩家：睡眠中 / 黄昏（会议）期间不可用，其余情况传送到大厅中的随机位置
 *   （完全不在三个列表里的游戏外玩家，由指令分发处直接处理，见 ChatRoomMessageSpaceStation）
 */
async function SS_Unstuck(player) {
    if (player.Ended == true) {
        await SS_Tell("展示区船员不开放 [unstuck]。", player, false);
        return;
    }
    if (player.Waiting) {
        SS_SetPlayerState(player, "outside");       // 解除等待 → 游戏外
        await SS_TeleportToOutHall(player, "等待登记已取消，你已被转移至游戏外大厅");
        await SS_Tell("如需重新进入流程，前往开始格子提交 [start]。", player, false);
        return;
    }
    if (player.InGame == false) {
        await SS_TeleportToOutHall(player);
        return;
    }
    if (player.Sleeping) { await SS_Tell("你处于休眠状态。光照周期开始前不开放操作。", player, false); return; }
    if (SS_Info.Phase == SS_Phase.Dusk || SS_Info.MeetingHallClosed || SS_IsInArea(player.Pos, meetingHallTiles)) {
        await SS_Tell("黄昏会议期间 [unstuck] 不开放。", player, false);
        return;
    }
    const tile = SS_RandomTileInZone(hallZone, player.MemberNumber);
    if (tile == null) { await SS_Tell("大厅坐标未配置，脱困协议无法执行。", player, false); return; }
    await Teleport(player, tile.X, tile.Y);
    await SS_Tell("已转移至大厅（" + tile.X + "，" + tile.Y + "）。", player, false);
    console.log("[SpaceStation] " + SS_PlayerTag(player) + " 使用 [unstuck] 脱困");
}
//#endregion

//#region 角色能力（[use 玩家名]）
async function SS_UseAbility(player, params) {
    if (params.length < 2) { await SS_Tell("通过随身终端执行能力。用法：[use 玩家名]；接管督导追加参数：[use 无权限船员名 purify|quarantine]", player, false); return; }
    const target = SS_FindPlayerByParam(params[1]);
    if (target == null || target.InGame == false) { await SS_Tell("目标船员不在本系统名册内。", player, false); return; }
    if (target.MemberNumber == player.MemberNumber) { await SS_Tell("目标不能是你自己。请求驳回。", player, false); return; }
    // 接管督导赋予无权限船员的能力优先
    if (player.GrantedAbility != null) {
        if (player.GrantedAbility == "purify") { await SS_AbilitySabotage(player, target); }
        else if (player.GrantedAbility == "quarantine") { await SS_AbilityArrest(player, target); }
        return;
    }
    switch (player.Role) {
        case SS_Role.Trainer: await SS_AbilityTrainer(player, target); break;
        case SS_Role.Sheriff: await SS_AbilitySheriff(player, target); break;
        case SS_Role.Psychiatrist: await SS_AbilityDetective(player, target); break;
        case SS_Role.Purifier: await SS_AbilitySabotage(player, target); break;
        case SS_Role.Isolator: await SS_AbilityArrest(player, target); break;
        case SS_Role.Supervisor: await SS_AbilityDominate(player, target, params[2]); break;
        case SS_Role.Addict: await SS_AbilityAddict(player, target); break;
        default: await SS_Tell("你（" + player.RoleName + "）不含主动能力。", player, false); break;
    }
}

/** 训练师：白天指定部下并布置额外任务；布置后不通知部下（需求 1 / 8） */
async function SS_AbilityTrainer(player, target) {
    if (SS_Info.Phase != SS_Phase.Day) { await SS_Tell("训练师的指派协议仅在白天开放。", player, false); return; }
    if (player.Subordinate != null) { await SS_Tell("今日指派配额已用尽。", player, false); return; }
    // 不可选择前一日完成过自己布置任务的玩家（注释明确）
    if (player.RoleData.LastSubordinate == target.MemberNumber && player.RoleData.LastSubordinateDone == true) {
        await SS_Tell("该船员在前一日完成过你的任务，不可重复指派。", player, false);
        return;
    }
    await SS_AssignSubordinateJob(player, target);
    player.RoleData.LastSubordinate = target.MemberNumber;
    // 需求 8：布置任务后不通知部下，只有训练师能看到该任务的进度
    await SS_Tell("额外任务已下发【" + SS_JobInfo[player.ExtraJob.Type].Name + "】至 " + SS_PlayerTag(target)
        + "，进度会自动同步给你，其完成与否在次日凌晨结算。", player, false);
    console.log("[SpaceStation] 训练师 " + SS_PlayerTag(player) + " 布置额外任务给 " + SS_PlayerTag(target));
}

/** 保安官：白天或夜晚选择一位玩家庇护；需与目标同房间 15 秒生效，且同样会暴露（需求 2 / 3） */
async function SS_AbilitySheriff(player, target) {
    if (SS_Info.Phase != SS_Phase.Day && SS_IsNight() == false) {
        await SS_Tell("保安官的能力仅在白天或夜晚开放。", player, false);
        return;
    }
    if (player.RoleData.ProtectedTarget != null) { await SS_Tell("今日庇护配额已用尽。", player, false); return; }
    await SS_BeginAbilityCharge(player, target, "protect");
}

/** 心理医师：夜晚对一位玩家进行精神诊断（判断其效忠对象）；一晚仅一次，需与目标同房间 15 秒，暴露逻辑与净化员 / 隔离官相同（需求 10） */
async function SS_AbilityDetective(player, target) {
    if (SS_IsNight() == false) { await SS_Tell("心理医师的诊断仅在夜晚开放。", player, false); return; }
    if (player.RoleData.ScoutedToday == true) { await SS_Tell("今晚能力配额已用尽。", player, false); return; }
    await SS_BeginAbilityCharge(player, target, "diagnose");
}

/**
 * 开始一次能力蓄力
 * 需求：保安官 / 心理医师 / 净化员 / 隔离官必须与目标在同一房间停留 SS_AbilityChannel 后能力才生效
 * kind = "protect" | "diagnose" | "purify" | "quarantine"
 * "今日已使用"的计数在蓄力真正完成时才占用，因此中断后可以重新 [use]
 */
async function SS_BeginAbilityCharge(player, target, kind) {
    if (player == null || target == null) return false;
    if (player.AbilityCharge != null) {
        await SS_Tell("你已有进行中的行动。等待其完成或中断后再提交。", player, false);
        return false;
    }
    if (SS_IsSameRoom(player, target) == false) {
        await SS_Tell("位置不符。能力需与目标处于同一房间。", player, false);
        return false;
    }
    const room = SS_GetRoomNameByPos(player.Pos);
    if (room == null) {
        await SS_Tell("当前位置不允许使用能力。", player, false);
        return false;
    }
    player.AbilityCharge = {
        Target: target.MemberNumber,
        Kind: kind,
        Room: room,
        EndTime: Date.now() + SS_AbilityChannel,
    };
    await SS_Tell("随身终端链接已建立，目标：" + SS_PlayerTag(target) + "。需在同一房间保持 "
        + Math.floor(SS_AbilityChannel / 1000) + " 秒同步，未达成则协议作废。", player, false);
    return true;
}

/** 每秒检查能力蓄力：离开房间 / 目标不在场则中断，计时结束则生效（参考 SS_UpdateCheckRoom） */
async function SS_UpdateAbilityCharge() {
    for (var p of SS_GetPlayingPlayers()) {
        const ch = p.AbilityCharge;
        if (ch == null) continue;
        const target = SS_FindPlayerByNumber(ch.Target);
        if (target == null || target.Character == null || SS_GetRoomNameByPos(p.Pos) != ch.Room || SS_IsSameRoom(p, target) == false) {
            p.AbilityCharge = null;
            await SS_Tell("行动中断：位置变更或目标缺失。", p, false);
            continue;
        }
        if (Date.now() < ch.EndTime) continue;
        p.AbilityCharge = null;
        await SS_ResolveAbility(p, target, ch.Kind);
    }
}

/** 蓄力完成：能力真正生效（在这里占用"今日已使用"并触发暴露） */
async function SS_ResolveAbility(player, target, kind) {
    if (player == null || target == null || target.Character == null) return;
    const roomName = SS_GetRoomNameByPos(player.Pos);
    // 能力经由随身终端执行：使用者属坏人阵营、或目标属坏人阵营时，使用者受影响加深（静默）
    if (player.Faction == SS_Faction.Evil) SS_AddCorruption(player, 1);
    else if (target.Faction == SS_Faction.Evil) SS_AddCorruption(player, 1);
    switch (kind) {
        case "protect": {
            player.RoleData.ProtectedTarget = target.MemberNumber;
            player.RoleData.BlockedToday = false;
            target.ProtectedUntilDawn = true;
            target.ProtectedBy = player.MemberNumber;
            await SS_Tell("管理 AI 已批准你的庇护申请：" + SS_PlayerTag(target) + " 在次日凌晨前不接受拘束安装（投票裁定除外）。", player, false);
            // 需求：保安官同样应用暴露规则
            await SS_RevealAbilityUse(player, roomName, [target.MemberNumber]);
            break;
        }
        case "diagnose": {
            player.RoleData.ScoutedToday = true;
            await SS_Tell(SS_PlayerTag(target) + "：精神诊断完成，该船员的效忠对象为" + SS_FactionName[target.Faction] + "。", player, false);
            await SS_RevealAbilityUse(player, roomName, [target.MemberNumber]);
            if (player.Role == SS_Role.Deprived) await SS_RecordGrantedAbilityUse(player);
            break;
        }
        case "purify": {
            const candidates = SS_GetSabotageableJobs(target);
            if (candidates.length == 0) { await SS_Tell("目标今日无可妨碍的工作记录。", player, false); return; }
            const job = candidates[Math.floor(Math.random() * candidates.length)];
            // 需求 9：已完成的工作也能被妨碍，进度减半后会重新变成未完成
            job.Progress = Math.max(0, Math.floor(job.Progress * 0.5));
            job.Done = (job.Progress >= job.Target);
            job.SabotagedBy = player.MemberNumber;
            player.RoleData.SabotagedToday = true;
            // 妨碍的是训练师的额外任务时，同步给部下的副本（需求 8）
            if (target.ExtraJob != null && job === target.ExtraJob) SS_SyncExtraJobToSubordinate(target);
            await SS_Tell("▒░▓╳▞认可了你的举动：目标 " + SS_PlayerTag(target) + " 的工作进程被挂起（目标不接收通知）。", player, false);
            await SS_RevealAbilityUse(player, roomName, [target.MemberNumber]);
            if (player.Role == SS_Role.Deprived) await SS_RecordGrantedAbilityUse(player);
            break;
        }
        case "quarantine": {
            player.RoleData.ArrestedToday = true;
            player.PendingArrest.push({ Target: target });
            await SS_Tell("▒░▓╳▞记下了你的奉献：凌晨为 " + SS_PlayerTag(target) + " 追加一件拘束道具（目标不接收通知）。", player, false);
            // 暴露：目标未睡觉时，房间内的目击者与监控所有者会发现（需求 11 / 12）
            await SS_RevealAbilityUse(player, roomName, [target.MemberNumber], target);
            if (player.Role == SS_Role.Deprived) await SS_RecordGrantedAbilityUse(player);
            break;
        }
        default:
            break;
    }
}

/** 可被妨碍的工作：目标的全部工作（含已完成，需求 9）+ 训练师的额外任务 */
function SS_GetSabotageableJobs(target) {
    const jobs = target.Jobs.slice();
    if (target.Role == SS_Role.Trainer && target.ExtraJob != null) jobs.push(target.ExtraJob);
    return jobs;
}

/** 净化员：白天妨碍一位玩家的工作（进度减半）；需与目标同房间 15 秒生效（需求 3 / 9），不通知目标 */
async function SS_AbilitySabotage(player, target) {
    if (SS_Info.Phase != SS_Phase.Day) { await SS_Tell("净化员的能力仅在白天开放。", player, false); return; }
    if (player.RoleData.SabotagedToday == true) { await SS_Tell("今日妨碍配额已用尽。", player, false); return; }
    await SS_BeginAbilityCharge(player, target, "purify");
}

/** 隔离官：夜晚选中一位玩家，需与目标同房间 15 秒生效（需求 3），凌晨为其安装拘束道具，不通知目标 */
async function SS_AbilityArrest(player, target) {
    if (SS_IsNight() == false) { await SS_Tell("隔离官的能力仅在夜晚开放。", player, false); return; }
    if (player.RoleData.ArrestedToday == true) { await SS_Tell("今晚抓捕配额已用尽。", player, false); return; }
    await SS_BeginAbilityCharge(player, target, "quarantine");
}

/** 接管督导：白天开始选择一个无权限船员，赋予其隔离官或净化员的能力 */
async function SS_AbilityDominate(player, target, ability) {
    if (SS_Info.Phase != SS_Phase.Day) { await SS_Tell("接管督导的能力仅在白天开放。", player, false); return; }
    if (player.RoleData.DominatedToday == true) { await SS_Tell("今日赋权配额已用尽。", player, false); return; }
    if (target.Role != SS_Role.Deprived) { await SS_Tell("接管督导的目标仅限无权限船员。", player, false); return; }
    if (ability != "purify" && ability != "quarantine") {
        await SS_Tell("参数缺失。用法：[use 无权限船员名 purify|quarantine]", player, false);
        return;
    }
    target.GrantedAbility = ability;
    target.RoleData.GrantedBy = player.MemberNumber;
    player.RoleData.DominatedToday = true;
    player.RoleData.GrantedToday = true;
    player.RoleData.SlaveUsedAbility = false;
    player.RoleData.GrantedSlave = target.MemberNumber;
    await SS_Tell("▒░▓╳▞已接收你的督导结果：" + SS_PlayerTag(target) + " 的随身终端已赋予 " + (ability == "quarantine" ? "隔离官" : "净化员") + " 权限。若其在次日凌晨前成功执行，记录将回传给你。", player, false);
    await SS_Tell("接管督导为你的终端赋予" + (ability == "quarantine" ? "隔离" : "净化") + "权限。在次日凌晨前用 [use 玩家名] 执行，逾期作废。", target, false);
}

/** 被赋予能力的无权限船员成功使用能力（需求 11：暴露逻辑与净化员 / 隔离官 / 心理医师相同） */
async function SS_RecordGrantedAbilityUse(player) {
    if (player.GrantedAbility == null) return null;
    const dom = SS_FindPlayerByNumber(player.RoleData.GrantedBy);
    player.GrantedAbility = null;
    if (dom == null) return null;
    dom.RoleData.SlaveUsedAbility = true;
    await SS_RoleResultCount(dom, true);    // 接管督导成功条件：无权限船员成功使用能力
    await SS_Tell("受你赋权的船员已成功执行，记录已回传。", dom, false);
    // TODO 注释：若无权限船员使用能力被发现，接管督导也会被发现。"被发现"的判定规则未给出
    return dom;
}

/** 指令成瘾 */
async function SS_AbilityAddict(player, target) {
    // TODO 注释：黄昏投票后被赋予一个非通常任务，例如（在某房间待一定时间 / 和某玩家在同一房间待一定时间 /
    //      晚上不睡觉 / 投票某个玩家 / 次日黄昏前被安装一个拘束道具），完成三个成功、未完成一个失败。
    //      需求 13 追加的例子：在第三个人在场的时候使用一次能力，该能力没有效果，仅会暴露。
    //      任务表与判定逻辑尚未实现（需求 13 要求先不实现）。
    await SS_Tell("该系统模块尚未部署（TODO）。", player, false);
}
//#endregion

//#region 拘束相关的事件检测
/** 口部拘束：动作发言（Emote）与 ooc 发言（首尾英文括号）会触发惩罚并安装一个拘束道具 */
async function SS_CheckSpeech(player, msg, data) {
    if (player.InGame == false) return;                       // 不在游戏中的玩家（等待区 / 结局展示区）不受游戏规则约束
    if (SS_HasRestrain(player, SS_RestrainType.Mouth) == false) return;
    const isEmote = (data.Type == "Emote");
    const isOoc = (msg.startsWith("(") && msg.endsWith(")"));
    if (isEmote == false && isOoc == false) return;
    await SS_Tell("口头输出协议受限。检测到违规输出，按规程追加拘束道具。", player, false);
    await SS_InstallOneRestrain(player);
}

/** 身体拘束：高潮时增加大量疲劳值（Activity 消息，Content 含 Orgasm） */
async function SS_OnOrgasm(player) {
    if (player.InGame == false) return;
    if (SS_HasRestrain(player, SS_RestrainType.Body) == false) return;
    player.Fatigue = Math.min(SS_FatigueLimit, player.Fatigue + SS_OrgasmFatigue);
    await SS_Tell("生理反应已记录。疲劳计数大幅上升（" + player.Fatigue + "/" + SS_FatigueLimit + "）。", player, false);
    await SS_CheckFatigue(player);
}
//#endregion

//#region 区域事件处理函数（名称 = 区域名首字母大写 + 指令名）
// ---------- 睡眠仓 ----------
// 需求：[sleep] 指令已取消，入睡只能通过"夜晚开始 1 分钟后仍站在睡眠舱格子上"
//       （见 SS_CloseSleepPodAndSleep），因此这里没有 Sleep 指令处理函数
async function SleepPodZoneCheck(player, params, areaInfo) {
    await SS_Tell("区域：睡眠舱。夜晚开始 " + Math.floor(SS_PhaseDuration.sleepWindow / 1000) + " 秒后仍停留于睡眠舱格子的船员将进入休眠，疲劳计数归零。", player, false);
}

// ---------- 跑步机房间 ----------
async function TreadmillRoomZoneCheck(player, params, areaInfo) {
    await SS_Tell("区域：跑步机房间。任务：跑步机发电。" + SS_JobInfo.treadmill.Hint, player, false);
}

/**
 * 跑步机发电（需求 2）
 * 逻辑：先走入过底部格子（记录 OnBottom），之后走入顶部格子 +1 进度并清除该记录
 * 底部与顶部不相邻，中间可以随意走动，因此不要求两次记录位置相邻
 */
async function TreadmillRoomZoneMoved(player, areaInfo) {
    const job = SS_GetProgressJob(player, SS_JobType.Treadmill);
    if (job == null || job.Done) return;
    const c = player.Character;
    if (c == null || c.MapData == null) return;
    const nowPos = c.MapData.Pos;
    if (nowPos == null) return;
    if (SS_IsInArea(nowPos, treadmillBottomTiles)) {
        if (job.OnBottom != true) {
            job.OnBottom = true;
            await SS_Tell("已记录你在底部。前往顶部即计入进度。", player, false);
        }
        return;
    }
    if (SS_IsInArea(nowPos, treadmillTopTiles) && job.OnBottom == true) {
        job.OnBottom = false;                        // 重置"进入过底部"的记录
        await SS_ProgressJob(player, SS_JobType.Treadmill, 1);
    }
}

// ---------- 仓库房间 ----------
async function StorageRoomZoneCheck(player, params, areaInfo) {
    await SS_Tell("区域：仓库。任务：库存整理。" + SS_JobInfo.storage.Hint, player, false);
}

/**
 * 玩家所在位置 → 仓库格坐标（需求 7）
 * 货架有效区域 9 宽 × 10 高，按 1 × 2 的小单元切成 9 × 5 = 45 个格子
 * 格坐标从区域左上角起算：Y = 0 ~ 4 → 行字母 a ~ e，X = 0 ~ 8 → 列数字 1 ~ 9
 * 不在有效区域内时返回 null
 */
function SS_StorageCellOfPos(Pos) {
    const zone = storageShelfTiles;      // 以"货架有效区域"为基准（不是整个仓库房间）
    if (Pos == null || zone == null || zone.leftUp == undefined) return null;
    const dx = Pos.X - zone.leftUp.X;
    const dy = Pos.Y - zone.leftUp.Y;
    if (dx < 0 || dy < 0) return null;
    const cx = Math.floor(dx / SS_StorageCellWidth);
    const cy = Math.floor(dy / SS_StorageCellHeight);
    if (cx >= SS_StorageCellCols || cy >= SS_StorageCellRows) return null;
    return { X: cx, Y: cy };
}

/** 图形坐标文本，统一用（x，y）格式（控制室指示坐标等） */
function SS_CellText(cell) {
    if (cell == null) return "（未知）";
    return "（" + cell.X + "，" + cell.Y + "）";
}

/** 仓库格坐标文本：按 (a,1) 格式显示
 *  字母 = 行（Y 轴，0 → a、1 → b …），数字 = 列（X 轴，0 → 1、1 → 2 …），左上为 (a,1) */
function SS_StorageCellText(cell) {
    if (cell == null) return "（未知）";
    const rowLetter = String.fromCharCode(97 + cell.Y);     // Y = 0 → a …
    return "（" + rowLetter + "，" + (cell.X + 1) + "）";     // X = 0 → 1 …
}

/** 两个格坐标是否相同 */
function SS_IsSameCell(a, b) {
    return (a != null && b != null && a.X == b.X && a.Y == b.Y);
}

/** 库存整理·拿取（需求 7）：在坐标 a 上 [take] 拿起物品 */
async function StorageShelfTilesTake(player, params, areaInfo) {
    const job = SS_GetProgressJob(player, SS_JobType.Storage);
    if (job == null || job.Carry == null) { await SS_Tell("今日任务清单中没有库存整理。", player, false); return; }
    if (job.Done) { await SS_Tell("库存整理已完成，重复提交无效。", player, false); return; }
    const cell = SS_StorageCellOfPos(player.Pos);
    if (cell == null) { await SS_Tell("位置不符，不在货架有效区域内。", player, false); return; }
    if (job.Carry.Taked) {
        await SS_Tell("你已持有物品。先将其放到" + SS_StorageCellText(job.Carry.To) + "。", player, false);
        return;
    }
    if (SS_IsSameCell(cell, job.Carry.From) == false) {
        await SS_Tell("此位置无待取物品。面板要求从" + SS_StorageCellText(job.Carry.From) + "取件。", player, false);
        return;
    }
    job.Carry.Taked = true;
    await SS_Tell("已从" + SS_StorageCellText(cell) + "取件。放置目标：" + SS_StorageCellText(job.Carry.To) + "。", player, false);
    // 拿取本身不加进度，放置正确物品时才 +1（注释明确）
}

/** 库存整理·放置（需求 7）：在坐标 b 上 [put] 放下物品，正确则 +1 进度 */
async function StorageShelfTilesPut(player, params, areaInfo) {
    const job = SS_GetProgressJob(player, SS_JobType.Storage);
    if (job == null || job.Carry == null) { await SS_Tell("今日任务清单中没有库存整理。", player, false); return; }
    if (job.Done) { await SS_Tell("库存整理已完成，重复提交无效。", player, false); return; }
    const cell = SS_StorageCellOfPos(player.Pos);
    if (cell == null) { await SS_Tell("位置不符，不在货架有效区域内。", player, false); return; }
    if (job.Carry.Taked == false) {
        await SS_Tell("你未持有物品。先从" + SS_StorageCellText(job.Carry.From) + "取件。", player, false);
        return;
    }
    if (SS_IsSameCell(cell, job.Carry.To) == false) {
        await SS_Tell("放置位置不符合面板要求。目标位置：" + SS_StorageCellText(job.Carry.To) + "。", player, false);
        return;
    }
    job.Carry.Taked = false;
    await SS_ProgressJob(player, SS_JobType.Storage, 1);
    SS_SyncSubordinateJob(player, job);
    if (job.Done == false && job.Carry != null) {
        SS_NewStorageCarry(job);        // 放置正确后生成下一组"从 a 拿取、放到 b"
        await SS_Tell("放置已核对。下一项：从" + SS_StorageCellText(job.Carry.From) + "取件，放到" + SS_StorageCellText(job.Carry.To) + "。", player, false);
    }
}

// ---------- 控制室 ----------
async function ControlRoomZoneCheck(player, params, areaInfo) {
    const job = SS_GetProgressJob(player, SS_JobType.Control);
    if (job == null || job.Route == null) { await SS_Tell("区域：控制室。今日任务清单中没有航向调整。", player, false); return; }
    await SS_Tell("当前航向：指示坐标" + SS_CellText(job.Route.Pos) + "，目的地坐标" + SS_CellText(job.Route.Target)
        + "。踩四个方向格子改变指示坐标，每移动一次要先踩一次中心格子" + SS_CellText(controlCenterTile)
        + "复位，走重置地板可以重新生成。", player, false);
}

async function ControlResetTileMoved(player, areaInfo) {
    const job = SS_GetProgressJob(player, SS_JobType.Control);
    if (job == null || job.Route == null) return;
    SS_NewControlRoute(job);
    await SS_Tell("重置地板已响应。指示坐标与目的地已重新生成：" + SS_CellText(job.Route.Pos) + " → " + SS_CellText(job.Route.Target), player, false);
}

/** 控制室中心格子：踩过方向格之后踩一次这里，控制台才会再次响应方向格 */
async function ControlCenterTileMoved(player, areaInfo) {
    const job = SS_GetProgressJob(player, SS_JobType.Control);
    if (job == null || job.Route == null) return;
    if (job.Route.NeedCenter) {
        job.Route.NeedCenter = false;
        await SS_Tell("控制台已复位，可再次踩踏方向格。", player, false);
    }
    else {
        await SS_Tell("控制台无响应。需先踩踏方向格。", player, false);
    }
}

async function ControlUpArrowTilesMoved(player, areaInfo) { await SS_ArrowTileMoved(player, "up"); }
async function ControlDownArrowTilesMoved(player, areaInfo) { await SS_ArrowTileMoved(player, "down"); }
async function ControlLeftArrowTilesMoved(player, areaInfo) { await SS_ArrowTileMoved(player, "left"); }
async function ControlRightArrowTilesMoved(player, areaInfo) { await SS_ArrowTileMoved(player, "right"); }

/**
 * 走入方向地板格：只改变"指示坐标"，与地图坐标无关（需求 2）
 * 指示坐标与目的地坐标一致时 +1 进度并重新生成
 * 地图规则：踩过方向格后必须先踩一次控制室中心格子，才能再踩方向格
 */
async function SS_ArrowTileMoved(player, direction) {
    const job = SS_GetProgressJob(player, SS_JobType.Control);
    if (job == null || job.Route == null || job.Done) return;
    if (job.Route.NeedCenter) {
        await SS_Tell("控制台需复位：先踩一次控制室中心格子" + SS_CellText(controlCenterTile) + "。", player, false);
        return;
    }
    const offset = SS_DirectionOffset[direction];
    if (offset == undefined) return;
    const pos = job.Route.Pos;
    // 需求：SS_ControlRange 的范围限制只用于"生成坐标"（SS_NewControlRoute），
    //       玩家踩方向格时不再钳制范围，走出范围后需要反向踩回来
    pos.X += offset.X;
    pos.Y += offset.Y;
    job.Route.NeedCenter = true;                 // 移动后需踩中心格复位
    if (pos.X == job.Route.Target.X && pos.Y == job.Route.Target.Y) {
        await SS_ProgressJob(player, SS_JobType.Control, 1);
        if (job.Done == false) {
            SS_NewControlRoute(job);             // 新路线自带 NeedCenter = false
            await SS_Tell("指示坐标与目的地一致。新航向：" + SS_CellText(job.Route.Pos) + " → " + SS_CellText(job.Route.Target), player, false);
        }
    }
    else {
        await SS_Tell("指示坐标已更新为" + SS_CellText(pos) + "（目的地" + SS_CellText(job.Route.Target) + "）。", player, false);
    }
}

// ---------- 机房 ----------
async function ServerRoomZoneCheck(player, params, areaInfo) {
    await SS_Tell("区域：机房。任务：系统维护。" + SS_JobInfo.server.Hint, player, false);
}

async function ServerRoomZoneSystem(player, params, areaInfo) {
    const job = SS_GetProgressJob(player, SS_JobType.Server);
    if (job == null) { await SS_Tell("今日任务清单中没有系统维护。", player, false); return; }
    if (job.Done) { await SS_Tell("系统维护已完成，重复提交无效。", player, false); return; }
    if (job.Question == null) SS_NewSystemQuestion(job);
    if (params.length == 0) {
        await SS_Tell("当前算式：" + job.Question.Text + "（作答指令：[system 答案]）", player, false);
        return;
    }
    const answer = Number(params[0]);
    if (isNaN(answer)) { await SS_Tell("输入格式无效。需为数字，示例：[system 42]", player, false); return; }
    const correct = (answer == job.Question.Answer);
    await SS_ProgressJob(player, SS_JobType.Server, correct ? 1 : -3, true);   // 正确 +1，错误 -3（静默推进，下面统一反馈）
    const isSub = (job === player.SubordinateJob);          // 部下看不到额外任务的进度数字
    // 需求 1：反馈答题结果的同时给出下一道题
    if (job.Done) {
        await SS_Tell("回答" + (correct ? "正确" : "错误") + "，" + (isSub ? "该步骤已受理。" : "系统维护已核销。"), player, false);
    }
    else {
        SS_NewSystemQuestion(job);
        SS_SyncSubordinateJob(player, job);
        await SS_Tell("回答" + (correct ? "正确" : "错误")
            + (isSub ? "。" : ("，进度 " + job.Progress + "/" + job.Target + "。"))
            + "下一题：" + job.Question.Text + "（作答指令：[system 答案]）", player, false);
    }
}

// ---------- 收容室 ----------
async function ContainmentRoomZoneCheck(player, params, areaInfo) {
    await SS_Tell("区域：收容室。任务：研究收容物（读数不稳定）：" + SS_JobInfo.containment.Hint, player, false);
}

async function ContainmentRoomZoneResearch(player, params, areaInfo) {
    const job = SS_GetProgressJob(player, SS_JobType.Containment);
    if (job == null) { await SS_Tell("今日任务清单中没有研究收容物。", player, false); return; }
    if (job.Done) { await SS_Tell("研究收容物已完成，重复提交无效。", player, false); return; }
    if (params.length == 0) { await SS_Tell("用法：[research red|white|black|cyan]", player, false); return; }
    const pick = params[0];
    if (job.Answer == null) SS_NewResearchAnswer(job);
    const correct = (pick == job.Answer);
    await SS_ProgressJob(player, SS_JobType.Containment, correct ? 5 : -1);   // 正确 +5，错误 -1（注释明确，输入其它单词视为错误）
    const pickName = (SS_ResearchColorName[pick] == undefined) ? pick : SS_ResearchColorName[pick];
    if (correct == false) await SS_Tell("你的选择：" + pickName + "。判定：错误；读数出现波动。", player, false);
    // 回答正确：先收到一段无法解析的信号，随后给出解译文本
    // 腐化等级越高，越能"听懂"，乱码比例越低（0 级 20% → 5 级 0%）
    if (correct) {
        const whisper = SS_ContainmentWhispers[Math.floor(Math.random() * SS_ContainmentWhispers.length)];
        const lv = SS_CorruptionLevel(player);
        const garbledRatio = Math.max(0, SS_CorruptionRenderMax - SS_CorruptionRenderMax * lv / SS_CorruptionMax);
        await SS_Tell("接收到无法解析的信号：" + SS_CorruptText(whisper, garbledRatio), player, false);
        //await SS_Tell("信号解译：" + whisper, player, false);
    }
    // 需求 9：只有回答正确才重新随机答案（答错时保持同一答案，可以继续尝试）
    if (correct && job.Done == false) {
        SS_NewResearchAnswer(job);
        SS_SyncSubordinateJob(player, job);
    }
}

// ---------- 会议厅 ----------
async function MeetingHallZoneCheck(player, params, areaInfo) {
    await SS_Tell("区域：会议厅。投票协议在黄昏开放，指令 [vote 玩家名]。", player, false);
}
//#endregion

//#region 事件注册（公共库按 key 遍历调用，key 唯一所以重复粘贴不会重复监听）
if (typeof ChatRoomSyncMapDataeAdditionDict === 'undefined') ChatRoomSyncMapDataeAdditionDict = {};

ChatRoomMessageAdditionDict[BOT_KEY] =
    function (SenderCharacter, msg, data) { ChatRoomMessageSpaceStation(SenderCharacter, msg, data); };
ChatRoomSyncMapDataeAdditionDict[BOT_KEY] =
    function (SenderCharacter) { CharacterMoved(SenderCharacter); };

async function ChatRoomMessageSpaceStation(sender, msg, data) {
    if (sender.MemberNumber == Player.MemberNumber) return;      // 忽略自己

    // 进场（含掉线重连）
    if (data.Type == "Action" && msg.startsWith("ServerEnter")) {
        // 结局展示中的玩家已移出 players（需求 6），这里单独处理，避免被当成新玩家
        const endedOne = endedPlayers.find(p => p.MemberNumber == sender.MemberNumber);
        if (endedOne != undefined && endedOne.Ended == true) {
            const backTile = SS_PickFreeTile(endingTiles, sender.MemberNumber) ?? SS_ZoneCenter(endingZone);
            if (backTile != null) await Teleport(sender, backTile.X, backTile.Y);
            await SS_Tell("你处于展示区。展示结束前不接受操作。", sender, false);
            return;
        }
        // 需求：只有进入游戏的玩家才在 players 里 —— 进场不再创建 PlayerInfo，[start] 登记时才创建
        const entering = FindPlayer(sender);
        if (entering != undefined && entering.DisconnectTime > 0) {
            // 需求 3：掉线重连 → 传送回最后位置
            entering.DisconnectTime = 0;
            const back = entering.LastPos;
            if (back != null) await Teleport(sender, back.X, back.Y);
            else {
                const t = SS_RandomTile(lobbySpawnTiles);
                if (t != null) await Teleport(sender, t.X, t.Y);
            }
            await SS_Tell("连接已恢复。你已被复位至断线前坐标。", sender, false);
            return;
        }
        // 需求 8：普通进场（非掉线重连）不落在出生点格子，而是传送到游戏外大厅
        const enterTile = SS_RandomTileInZone(outHallZone, sender.MemberNumber) ?? SS_RandomTile(lobbySpawnTiles);
        if (enterTile != null) await Teleport(sender, enterTile.X, enterTile.Y);
        else console.log("[SpaceStation] 游戏外大厅未配置，跳过进场传送");
        await SS_Tell("bot位于测试阶段，欢迎私聊bot反馈问题。", sender, false);
        await SS_Tell("接入完成。协议见 bot 的 bio，指令清单用 /bot help。前往开始格子提交 /bot start，凌晨统一进入流程。", sender, false);
        return;
    }
    // 掉线：进入重连宽限期，超时未回来才算离开游戏（需求 2）
    if (msg.startsWith("ServerDisconnect")) {
        const off = FindPlayer(sender);
        if (off != undefined) {
            if (sender.MapData != null && sender.MapData.Pos != null) {
                off.LastPos = { X: sender.MapData.Pos.X, Y: sender.MapData.Pos.Y };
            }
            off.DisconnectTime = Date.now();
            console.log("[SpaceStation] " + SS_PlayerTag(off) + " 掉线，等待 " + Math.floor(SS_ReconnectGrace / 1000) + " 秒重连");
        }
        return;
    }
    // 主动离开 / 被踢 / 被封：直接视为离开游戏（需求 2）
    if (msg.startsWith("ServerLeave") || msg.startsWith("ServerBan") || msg.startsWith("ServerKick")) {
        const leaving = FindPlayer(sender);
        if (leaving != undefined) await SS_LeaveGame(leaving, true);
        return;
    }
    // 玩家指令（玩家侧插件 / BC 内置 bot 指令发送的 Hidden 消息）
    if (data.Type == "Hidden" && msg.startsWith("ChatRoomBot")) {
        const params = msg.toLowerCase().substring(11).trim().split(' ');
        if (params.length == 0 || params[0] == "") return;
        var cmdPlayer = FindPlayer(sender);
        if (cmdPlayer == undefined) {
            // 需求：PlayerInfo 在玩家使用 [start] 登记时生成；其余指令给未登记的提示
            if (params[0] == "start" && ChatRoomCharacterIsAdmin(sender) == false) {
                // 只创建对象，不预设状态：等待状态与装备/传送流程统一由 SS_PlayerStart 处理
                cmdPlayer = new PlayerInfo(sender);
            }
            else if (params[0] == "unstuck") {
                // 需求：游戏外的玩家（未登记 / 不在游戏中）也能用 [unstuck] 传送回游戏外大厅
                await SS_TeleportToOutHall(sender, "已转移至游戏外大厅");
                return;
            }
            else if (params[0] == "help") {
                await SS_Tell(SS_HelpText + "（你尚未进入流程：前往开始格子" + SS_TilesText(startTiles) + "提交 [start]）", sender, false);
                return;
            }
            else {
                await SS_Tell("你尚未进入流程。前往开始格子" + SS_TilesText(startTiles) + "提交 [start]；[unstuck] 可转移至游戏外大厅。", sender, false);
                return;
            }
        }
        console.log("[SpaceStation] " + SS_PlayerTag(sender) + " cmd: " + msg);
        await DoCommands(cmdPlayer, params);
        return;
    }

    const player = FindPlayer(sender);
    if (player == undefined) return;

    // 高潮（身体拘束 → 大量疲劳值）
    if (data.Type == "Activity" && data.Content.startsWith("Orgasm") >= 0) {
        await SS_OnOrgasm(player);
        return;
    }
    // 口部拘束下的动作发言 / ooc 发言
    if (data.Type == "Emote" || data.Type == "Action" || data.Type == "Chat") {
        await SS_CheckSpeech(player, msg, data);
    }
}

/** 移动触发：疲劳值累积 + 区域事件 */
async function CharacterMoved(sender) {
    if (ChatRoomCharacterIsAdmin(sender)) return;
    const player = FindPlayer(sender);
    if (player == undefined) return;
    if (sender.MapData == null) return;
    const nowPos = sender.MapData.Pos ?? null;
    const oldPos = sender.MapData.pverPos ?? null;
    if (nowPos == null || oldPos == null) return;
    const moved = (nowPos.X != oldPos.X || nowPos.Y != oldPos.Y);
    if (player.InGame && moved) {
        player.LastPos = { X: nowPos.X, Y: nowPos.Y };   // 记录最后位置（掉线重连用）
        player.Fatigue += SS_MoveFatigue;      // 疲劳值随在地图中移动增加
        await SS_CheckFatigue(player);
        // 进入过收容房间会留下影响（静默；离开后清除在场标记；同一天最多只增长一次）
        if (SS_IsInZone(nowPos, containmentRoomZone)) {
            if (player.InContainment != true) {
                player.InContainment = true;
                if (player.ContainmentCorruptionDay != SS_Info.Day) {
                    player.ContainmentCorruptionDay = SS_Info.Day;
                    SS_AddCorruption(player, 1);
                }
            }
        }
        else if (player.InContainment) player.InContainment = false;
    }
    if (player.InGame) await SS_FireAreaMoved(player, nowPos);
    await sleep(0);                            // 给渲染留出时间
}
//#endregion

//#region 调试工具（在浏览器控制台直接调用，不需要玩家指令）
/**
 * 调试用：修改指定玩家的角色
 *   SS_DebugSetRole(7092, "trainer")            // 按 MemberNumber
 *   SS_DebugSetRole("zajucd", "purifier")       // 按名字（Name / Nickname，忽略大小写）
 *   SS_DebugSetRole(7092, "worker", false)      // 第三个参数 false = 不重新分配当日工作
 * 可用角色：worker / trainer / sheriff / psychiatrist / purifier / isolator / supervisor / addict / deprived
 * 返回玩家的 PlayerInfo；找不到玩家或角色名非法时返回 null
 */
async function SS_DebugSetRole(target, role, reassignJobs = true) {
    const player = SS_DebugFindPlayer(target);
    if (player == null) {
        console.log("[SpaceStation][debug] 找不到玩家：" + target);
        return null;
    }
    if (SS_RoleInfo[role] == undefined) {
        console.log("[SpaceStation][debug] 未知角色：" + role + "；可用：" + Object.keys(SS_RoleInfo).join(" / "));
        return null;
    }
    if (player.Ended == true) {
        // 结局展示中的玩家不参与游戏，也不应被强行加入 → 需要先释放
        console.log("[SpaceStation][debug] " + SS_PlayerTag(player) + " 正在结局展示中，先调用 SS_DebugReleasePlayer 释放他");
        return null;
    }
    if (player.InGame != true) {
        SS_SetPlayerState(player, "playing");       // 强制加入游戏（只属于 players）
        console.log("[SpaceStation][debug] " + SS_PlayerTag(player) + " 原本不在游戏中，已强制加入游戏");
    }
    await SS_SetRole(player, role);
    // 改成无权限船员时记录起始天，方便测试"成为无权限船员三天后"的失败判定
    player.SlaveSince = (role == SS_Role.Deprived) ? SS_Info.Day : 0;
    if (reassignJobs) await SS_AssignJobs(player);
    console.log("[SpaceStation][debug] 已把 " + SS_PlayerTag(player) + " 的角色改为【" + SS_RoleInfo[role].Name + "】"
        + (reassignJobs ? "，并重新分配了工作" : ""));
    await SS_Tell("[调试] 你的角色被改为【" + SS_RoleInfo[role].Name + "】。", player, false);
    return player;
}

/** 调试用：按 MemberNumber / 名字 / 角色对象查找玩家（含结局展示中的玩家；找不到返回 null） */
function SS_DebugFindPlayer(target) {
    if (target == null) return null;
    const num = (typeof target == "object" && target.MemberNumber != undefined) ? target.MemberNumber : Number(target);
    if (isNaN(num) == false) {
        const byNum = SS_FindPlayerByNumber(num) ?? endedPlayers.find(p => p.MemberNumber == num) ?? null;
        if (byNum != null) return byNum;
    }
    if (typeof target == "object") return null;
    const name = String(target).toLowerCase();
    return players.concat(waitingPlayers, endedPlayers).find(p => {
        const c = p.Character;
        if (c == null) return false;
        return String(c.Name ?? "").toLowerCase() == name || String(c.Nickname ?? "").toLowerCase() == name;
    }) ?? null;
}

/** 调试用：立即结束结局展示，把玩家释放回房间（返回是否成功） */
async function SS_DebugReleasePlayer(target) {
    const p = SS_DebugFindPlayer(target);
    if (p == null || endedPlayers.indexOf(p) < 0) {
        console.log("[SpaceStation][debug] 找不到正在结局展示的玩家：" + target);
        return false;
    }
    await SS_ReleaseEndedPlayer(p);
    console.log("[SpaceStation][debug] 已释放 " + SS_PlayerTag(p));
    return true;
}

/** 调试用：列出当前玩家列表（角色 / 是否在游戏中 / 工作进度） */
function SS_DebugListPlayers() {
    const list = players.map(p => ({
        MemberNumber: p.MemberNumber, Name: SS_PlayerTag(p), Role: p.Role, InGame: p.InGame,
        Waiting: p.Waiting, Ended: p.Ended, Restrains: SS_GetRestrainCount(p), Jobs: p.Jobs.length,
    }));
    console.log("[SpaceStation][debug] 玩家列表：", list);
    return list;
}
//#endregion

//#region 初始化
async function SS_InitRoom() {
    if (NEED_CUSTOM_MAP == false) {
        console.log("[SpaceStation] NEED_CUSTOM_MAP = false，跳过房间地图写入（地图字符串待人工填入）");
        return;
    }
    const width = ChatRoomMapViewWidth;
    if (mapData.Tiles.length == 0 || mapData.Tiles.length % width != 0 || mapData.Objects.length != mapData.Tiles.length) {
        console.log("[SpaceStation] 地图字符串长度非法，已取消写入（Tiles=" + mapData.Tiles.length + " Objects=" + mapData.Objects.length + " 宽=" + width + "）");
        return;
    }
    ChatRoomData.MapData = mapData;
    ChatRoomData.Description = "[BOT]密室逃生第八部 空间站 优化了加入游戏时的等待";
    ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: ChatRoomGetSettings(ChatRoomData), Action: "Update" });
    console.log("[SpaceStation] 房间地图已更新");
}

async function InitBot() {
    await SS_InitRoom();
    await SS_InitMapEvents();

    // 把自己放到观察点（不能对自己用 Teleport，直接写 MapData）
    // TODO 待人工改为等待区 / 观察点坐标
    Player.MapData.Pos = { X: 9, Y: 36 };
    ServerSend("ChatRoomCharacterMapDataUpdate", { Pos: Player.MapData.Pos });

    Player.Description = desc;
    ServerSend("AccountUpdate", { Description: Player.Description });
    ChatRoomCharacterUpdate(Player);            // 同步自身

    console.log("[SpaceStation] 初始化完成");
}

InitBot().catch(e => console.log("[SpaceStation] InitBot 出错：", e));
RegExistPlayer();
SS_TimeEventStart();
//#endregion

