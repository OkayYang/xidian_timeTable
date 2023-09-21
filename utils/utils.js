function calculateWeekday(dateString) {
    var date = new Date(dateString);
    var day = date.getDay(); // 星期几（0-6，0代表星期日）
    var week = 1; // 初始化为第一周

    // 获取当年的第一天
    var firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    var firstWeekDay = firstDayOfYear.getDay(); // 当年第一天是星期几

    // 计算date和当年第一天之间的天数差
    var diff = Math.ceil((date - firstDayOfYear) / (24 * 60 * 60 * 1000));

    // 调整计算方式以适应设定的第一周起始日
    diff = diff + (7 - firstWeekDay + 1); // 第一周的起始日是设定的日期

    // 计算周数
    week = Math.ceil(diff / 7);

    // 将星期几转换为中文
    // var weekdayMap = {
    //     0: '星期日',
    //     1: '星期一',
    //     2: '星期二',
    //     3: '星期三',
    //     4: '星期四',
    //     5: '星期五',
    //     6: '星期六'
    // };

    return {
        week: week - 36,
        day: day
    };
}
function getWeedDay(num){
    //将星期几转换为中文
    var weekdayMap = {
        0: '星期日',
        1: '星期一',
        2: '星期二',
        3: '星期三',
        4: '星期四',
        5: '星期五',
        6: '星期六'
    };
    return weekdayMap[num]

}

function calcuWeek() {
    var startDate = new Date(2023, 8, 4); // 设定的第一周起始日
    var today = new Date(); // 当前日期（月份从0开始，所以9表示十月份）
    var result = calculateWeekday(today);
    return result

}
function checkWeekRange(weekString, input) {
    // 判断字符串是否包含逗号
    if (weekString.includes(',')) {
      const ranges = weekString.split(',');
      for (const range of ranges) {
        const [start, end] = range.split('-');
        if (input >= parseInt(start) && input <= parseInt(end)) {
          return true;
        }
      }
    } else if (weekString.includes('-')) {  // 判断字符串是否包含破折号
      const [start, end] = weekString.split('-');
      if (input >= parseInt(start) && input <= parseInt(end)) {
        return true;
      }
    } else {  // 字符串只有一个数字
      const week = parseInt(weekString);
      if (input === week) {
        return true;
      }
    }
  
    return false;
  }
  function convertJSJCDM(array) {
    const timetable = [
      { start: '08:30', end: '09:15' },
      { start: '09:20', end: '10:05' },
      { start: '10:25', end: '11:10' },
      { start: '11:15', end: '12:00' },
      { start: '14:00', end: '14:45' },
      { start: '14:50', end: '15:35' },
      { start: '15:55', end: '16:40' },
      { start: '16:45', end: '17:30' },
      { start: '19:00', end: '19:45' },
      { start: '19:50', end: '20:35' },
      { start: '20:40', end: '21:25' }
    ];
  
    const uniqueMap = new Map();
  
    for (const item of array) {
      const key = `${item.KCMC}-${item.JASMC}`;
  
      if (uniqueMap.has(key)) {
        const timeRanges = uniqueMap.get(key).JSJCDM.split(',');
        const jsjcdm = item.JSJCDM;
        const range = timetable[jsjcdm - 1];
        const lastRange = timeRanges[timeRanges.length - 1];
        const [start, end] = lastRange.split('~');
        if (range.start === end) {
          timeRanges[timeRanges.length - 1] = `${start}~${range.end}`;
        } else {
          timeRanges.push(`${range.start}~${range.end}`);
        }
        uniqueMap.get(key).JSJCDM = timeRanges.join(',');
      } else {
        const jsjcdm = item.JSJCDM;
        const range = timetable[jsjcdm - 1];
        item.JSJCDM = `${range.start}~${range.end}`;
        uniqueMap.set(key, item);
      }
    }
  
    const uniqueArray = Array.from(uniqueMap.values());
  
    // Modify JSJCDM property to desired format
    for (const item of uniqueArray) {
      const timeRanges = item.JSJCDM.split(',');
      const startTimes = timeRanges.map(range => range.split('~')[0]);
      const endTimes = timeRanges.map(range => range.split('~')[1]);
      const modifiedStart = startTimes[0];
      const modifiedEnd = endTimes[endTimes.length - 1];
      item.JSJCDM = `${modifiedStart}~${modifiedEnd}`;
    }
  
    return uniqueArray;
  }
module.exports = {
    calcuWeek: calcuWeek,
    checkWeekRange:checkWeekRange,
    convertJSJCDM:convertJSJCDM,
    getWeedDay:getWeedDay

}