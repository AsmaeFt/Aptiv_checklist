

export const getShiftDate = (date) => {
  const hour = new Date(date).getHours();
  const shiftDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  if (hour >= 0 && hour < 6) {
    shiftDate.setUTCDate(shiftDate.getUTCDate() - 1);
  }

  let shift = "night";

  if (hour >= 6 && hour < 14) {
    shift = "morning";
  } else if (hour >= 14 && hour < 22) {
    shift = "evening";
  }

  return { shiftDate, shift };
};