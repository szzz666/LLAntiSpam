//--可修改配置部分
// 用于触发重新加载的命令
const reloadCommand = "asreload";
// 重新加载命令的冷却时间（单位：tick），以防止频繁重新加载
const cooldownTicks = 60
// 最大尝试次数，用于处理命令执行失败时的重试机制
const maxAttempts = 3
// 消息的最大长度限制，以防止过长的消息导致的问题
const maxLength = 100
// 当检测到用户发送的消息过于频繁时显示的警告信息
const messageTooSpam = "请不要刷屏!"
// 当用户发送的消息超过最大长度限制时显示的警告信息，其中 %maxLength% 会被替换为实际的最大长度值
const messageTooLong = "消息过长，请限制在 %maxLength% 字以内"
//--可修改配置部分结束

var lastMessageTicks = new Map();
var messageCounts = new Map();
mc.listen("onChat", (player, msg) => {
    var playerName = player.name;
    var currentTick = mc.getTime(1);
    if (msg.length > maxLength) {
        player.sendText(messageTooLong.replace("%maxLength%", maxLength), 1);
        return false;
    }
    if (lastMessageTicks.has(playerName)) {
        var lastMessageTick = lastMessageTicks.get(playerName);
        var messageCount = messageCounts.get(playerName) || 0;
        if (currentTick - lastMessageTick < cooldownTicks) {
            messageCount++;
            messageCounts.set(playerName, messageCount);
            if (messageCount > maxAttempts) {
                player.sendText(messageTooSpam, 1);
                lastMessageTicks.set(playerName, currentTick);
                return false;
            }
        } else {
            messageCounts.set(playerName, 1);
        }
    } else {
        messageCounts.set(playerName, 1);
    }
    lastMessageTicks.set(playerName, currentTick);
});