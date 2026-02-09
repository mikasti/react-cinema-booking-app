export const formatTime = (isoString: string): string => {
  const d = new Date(isoString);
  const Str = (num: number) => num.toString().padStart(2, "0");
  return `${Str(d.getHours())}:${Str(d.getMinutes())}`;
};

export const formatDate = (isoString: string): string => {
  const d = new Date(isoString);
  const Str = (num: number) => num.toString().padStart(2, "0");
  return `${Str(d.getDate())}.${Str(d.getMonth() + 1)}`;
};
