import jwt from "jsonwebtoken";

export const checkTokenExpiration = (token, refreshToken) => {
  var isExpired = false;
  var isRefreshExpired = false;

  var decodedToken = jwt.decode(token, { complete: true });
  var decodedRefreshToken = jwt.decode(refreshToken, {
    complete: true,
  });
  var dateNow = new Date();

  if (decodedToken.payload.exp * 1000 < dateNow.getTime()) isExpired = true;
  if (decodedRefreshToken.payload.exp * 1000 < dateNow.getTime())
    isRefreshExpired = true;

  return { isExpired, isRefreshExpired };
};

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

export const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};
