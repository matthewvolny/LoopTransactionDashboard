export const shortenHash = (hash: string): string => {
  return hash.slice(0, 4) + "...." + hash.slice(-5, -1);
};
