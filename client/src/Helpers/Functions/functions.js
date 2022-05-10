export const removeUpperAccents = (text) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const GetfirstWeekEnd = (month, year) => {
  var firstDay = new Date(year + "-" + month + "-" + 1);
  let dayOfWeek = firstDay.getDay();
  var endday;
  var startCount = dayOfWeek;
  if (startCount !== 0) {
    endday = new Date(firstDay.setDate(firstDay.getDate() + (7 - dayOfWeek)));
  } else {
    endday = new Date(firstDay.setDate(firstDay.getDate() + 1));
  }
  return endday;
};

export const getWeeksInMonth = (year, month) => {
  let weeks = [],
    lastDate = new Date(year, month, 0),
    numDays = lastDate.getDate();
  let weeks_start_day = [];
  let weeks_last_day = [];
  let start = 1;
  let end =
    GetfirstWeekEnd(month, year).getDate() - 1 === start
      ? GetfirstWeekEnd(month, year).getDate() - 1
      : GetfirstWeekEnd(month, year).getDate();
  while (start <= numDays) {
    weeks.push(start + "/" + month + "-" + end + "/" + month);
    weeks_last_day.push(end);
    weeks_start_day.push(start);
    start = end + 1;
    end = end + 7;
    end = start === 1 && end === 8 ? 1 : end;
    if (end > numDays) {
      end = numDays;
    }
  }
  return [weeks, weeks_start_day, weeks_last_day];
};

export const getCurrentWeekInMonth = (year, month) => {
  const today = new Date().getDate();
  let counter = 0;
  let weeks = [],
    lastDate = new Date(year, month, 0),
    numDays = lastDate.getDate();
  let weeks_start_day = [];
  let weeks_last_day = [];
  let start = 1;
  let end =
    GetfirstWeekEnd(month, year).getDate() - 1 === start
      ? GetfirstWeekEnd(month, year).getDate() - 1
      : GetfirstWeekEnd(month, year).getDate();

  while (start <= numDays) {
    counter++;
    if (start <= today && today <= end) return counter;
    weeks.push(start + "/" + month + "-" + end + "/" + month);
    weeks_last_day.push(end);
    weeks_start_day.push(start);
    start = end + 1;
    end = end + 7;
    end = start === 1 && end === 8 ? 1 : end;
    if (end > numDays) {
      end = numDays;
    }
  }
};

export const getSelectedDayBelongsWeekInMonth = (year, month, selectedDay) => {
  const today = new Date(selectedDay).getDate();
  let counter = 0;
  let weeks = [],
    lastDate = new Date(year, month, 0),
    numDays = lastDate.getDate();
  let weeks_start_day = [];
  let weeks_last_day = [];
  let start = 1;
  let end =
    GetfirstWeekEnd(month, year).getDate() - 1 === start
      ? GetfirstWeekEnd(month, year).getDate() - 1
      : GetfirstWeekEnd(month, year).getDate();

  while (start <= numDays) {
    counter++;
    if (start <= today && today <= end) return counter;
    weeks.push(start + "/" + month + "-" + end + "/" + month);
    weeks_last_day.push(end);
    weeks_start_day.push(start);
    start = end + 1;
    end = end + 7;
    end = start === 1 && end === 8 ? 1 : end;
    if (end > numDays) {
      end = numDays;
    }
  }
};

export const truncateString = (str, num) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};
