export const formatDate = (dateString: string) => {
    if(dateString==='' || !dateString){
        return '-';
    }
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric',  month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
};


import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const calculateAge = (dob: string): number => {
  return dayjs().diff(dayjs(dob), 'year');
};

export const calculateWorkDuration = (joiningDate: string): string => {
  const start = dayjs(joiningDate);
  const now = dayjs();
  const years = now.diff(start, 'year');
  const months = now.diff(start, 'month') % 12;

  if (years === 0) {
    return `${months} months`;
  }
  return `${years} years${months > 0 ? `, ${months} months` : ''}`;
};
