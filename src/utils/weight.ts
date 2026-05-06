export function kgToJin(kg: number): number {
  return Number((kg * 2).toFixed(1))
}

export function jinToKg(jin: number): number {
  return Number((jin / 2).toFixed(1))
}

export function formatWeight(weight: number, units: 'kg' | 'jin'): string {
  if (units === 'jin') {
    return `${kgToJin(weight)} 斤`
  }
  return `${weight} kg`
}

export function parseWeight(value: number, fromUnits: 'kg' | 'jin'): number {
  if (fromUnits === 'jin') {
    return jinToKg(value)
  }
  return value
}
