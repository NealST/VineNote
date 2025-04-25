import { format } from 'date-fns';

export const createTimeStamp = function(millisecond = Date.now()) {
  const timeStr = format(new Date(millisecond), 'yyyy-MM-dd HH:mm:ss');
  return timeStr;
}
