export function formatDateLocal(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 24h
  }).format(date)
}

export function formatAndLogTokenTimes(
  exp: number | null,
  nowInSeconds: number,
): { expFormatted: string; nowFormatted: string } {
  const expDate = exp ? new Date(exp * 1000) : null
  const nowDate = new Date(nowInSeconds * 1000)

  const expFormatted = expDate ? formatDateLocal(expDate) : 'No exp claim'
  const nowFormatted = formatDateLocal(nowDate)

  console.log('🔑 Token expira en:', expFormatted)
  console.log('🕒 Hora actual:', nowFormatted)

  return { expFormatted, nowFormatted }
}
