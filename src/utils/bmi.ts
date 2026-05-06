export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return '偏瘦'
  if (bmi < 24) return '正常'
  if (bmi < 28) return '偏胖'
  return '肥胖'
}

export function getBMIColor(bmi: number): string {
  if (bmi < 18.5) return '#F59E0B'
  if (bmi < 24) return '#10B981'
  if (bmi < 28) return '#F59E0B'
  return '#EF4444'
}
