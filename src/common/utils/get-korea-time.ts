export const getKoreaTime = async (): Promise<Date> => {
  const now = new Date();
  const koreaTimeDiff = now.getTimezoneOffset() / 60;
  const koreaNow = new Date(now.getTime() - koreaTimeDiff * 60 * 60 * 1000);

  return koreaNow;
};
