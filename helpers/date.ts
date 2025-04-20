import dayjs from "dayjs";

const dateIdFormat = (date: Date | string): string => {
  return dayjs(date).format('DD MMMM YYYY');
}

export {
  dateIdFormat,
}