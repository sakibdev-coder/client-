export function estimateRentalTotal(
  price: number,
  rentalType: string,
  startDate: string,
  endDate: string,
  quantity: number
) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start || quantity < 1) return 0;
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));
  const unitDays = rentalType === "Monthly" ? 30 : rentalType === "Weekly" ? 7 : 1;
  return price * Math.ceil(days / unitDays) * quantity;
}

export function rentalUnitLabel(rentalType: string) {
  if (rentalType === "Weekly") return "week";
  if (rentalType === "Monthly") return "month";
  return "day";
}
