const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_WEEK = 604800;
const SECONDS_IN_YEAR = 3.154e7;

export const convertFromSeconds = (seconds_: any) => {
  const minutes = seconds_ / SECONDS_IN_MINUTE;
  const hours = seconds_ / SECONDS_IN_HOUR;
  const days = seconds_ / SECONDS_IN_DAY;
  const weeks = seconds_ / SECONDS_IN_WEEK;
  const years = seconds_ / SECONDS_IN_YEAR;

  if (years > 1) return years.toFixed(0) + " years";
  if (years === 1) return years.toFixed(0) + " year";
  if (weeks >= 5) return weeks.toFixed(0) + " weeks";
  if (weeks === 4) return weeks.toFixed(0) + " weeks";
  if (days > 1) return days.toFixed(0) + " days";
  if (days === 1) return days.toFixed(0) + " day";
  if (hours > 1) return hours.toFixed(0) + " hours";
  if (hours === 1) return hours.toFixed(0) + " hour";
  if (minutes === 1) return minutes.toFixed(0) + " minute";

  return minutes.toFixed(0) + " minutes";
};
