export const timeValueSplit = (timeValue: number) => {
  let tempValue = timeValue;
  const day = Math.floor(tempValue / (24 * 60 * 60 * 1000));
  tempValue -= day * 24 * 60 * 60 * 1000;
  const hour = Math.floor(tempValue / (60 * 60 * 1000));
  tempValue -= hour * 60 * 60 * 1000;
  const minute = Math.floor(tempValue / (60 * 1000));
  tempValue -= minute * 60 * 1000;
  const second = Math.floor(tempValue / 1000);

  return [day, hour, minute, second];
};

export const timeDiffFromNow = (
  timeString?: string,
  fromTimeString?: string
) => {
  if (!timeString) return undefined;
  const currentTime = fromTimeString ? new Date(fromTimeString) : new Date();
  const targetTime = new Date(timeString);

  // Calculate the difference
  return targetTime.getTime() - currentTime.getTime();
};
