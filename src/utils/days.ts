export const getPreviousMonthYear = (month: number, year: number) => {
  const currentDate = new Date(year, month - 1, 1);
  const previousDate = new Date(currentDate);

  previousDate.setMonth(currentDate.getMonth() - 1);

  const previousMonth = previousDate.getMonth() + 1;
  const previousYear = previousDate.getFullYear();

  return { month: previousMonth, year: previousYear };
}