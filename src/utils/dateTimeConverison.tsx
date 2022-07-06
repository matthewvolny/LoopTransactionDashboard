const formatDateTimeFromSeconds = (seconds: number) => {
  const date = new Date(seconds * 1000);
  return `${date.toLocaleDateString("en-US")} ${date.toLocaleTimeString(
    "en-US",
    {
      timeZone: "UTC",
      timeZoneName: "short",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }
  )}`;
};

export { formatDateTimeFromSeconds };
