export const motivationalQuotes = [
  '每一步都是进步，继续加油！',
  '坚持就是胜利，你已经很棒了！',
  '今天的努力，是明天的骄傲。',
  '健康的身体是最大的财富。',
  '慢慢来，比较快。',
  '你比你想象的更强大。',
  '每一次克制，都是对自己的奖励。',
  '改变，从今天开始。',
  '目标在前方，路在脚下。',
  '相信自己，你一定能做到！',
  '减肥是一场马拉松，不是短跑。',
  '享受过程，结果自然来。',
  '今天的汗水，明天的美丽。',
  '健康饮食，规律运动，你就是赢家。',
  '别让昨天的懒惰，阻碍今天的进步。',
]

export function getRandomQuote(): string {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
}

export function getMotivationalMessage(progress: number, streak: number): string {
  if (streak >= 7) return '太棒了！你已经连续记录一周了！'
  if (progress >= 50) return '你已经完成过半了，继续加油！'
  if (progress >= 25) return '四分之一里程碑达成，太厉害了！'
  if (progress >= 10) return '良好的开始，继续保持！'
  if (streak >= 3) return '连续记录三天，习惯正在养成！'
  return getRandomQuote()
}
