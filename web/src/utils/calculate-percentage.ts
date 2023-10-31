type CalculatePercentageProps = {
  value: number
  total: number
}

export function calculatePercentage({
  value,
  total,
}: CalculatePercentageProps) {
  const percentage = ((value / total) * 100).toFixed(2)

  return Number(percentage)
}
