
//获取当前周日
function getCurrentWeekday() {
  // 2023年9月4号的日期
  const start = new Date(2023, 8, 4); // JavaScript的月份是从0开始计数的，所以8代表9月
  const today = new Date();
  
  // 计算两个日期之间的差值（毫秒）
  const diff = today.getTime() - start.getTime();
  
  // 将差值转换为天数
  const diffDays = Math.floor(diff / (1000 * 3600 * 24));
  
  // 计算当前的周数和星期数
  const week = Math.floor(diffDays / 7) + 1;
  const day = diffDays % 7;
  
  // 返回结果
  return {day: day, week: week};
}
//根据周获取该周日
function getWeekDates(weekNumber) {
  var startDate = new Date(2023, 8, 4); // 设定的第一周起始日
  var currentDate = new Date(startDate.getTime());
  currentDate.setDate(currentDate.getDate() + (weekNumber - 1) * 7); // 计算指定周数的起始日期
  var weekDates = [];
  var weekdays = ['周一', '周二', '周三', '周四', '周五', '周六','周日'];
  for (var i = 0; i < 7; i++) {
    var date = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000);
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // 月份从0开始，需要加1；使用slice(-2)确保月份有两位数
    var day = ("0" + date.getDate()).slice(-2); // 使用slice(-2)确保日期有两位数
    var formattedDate = month + "-" + day;
    var weekday = weekdays[i]; // 获取星期几
    weekDates.push({ date: formattedDate, week: weekday });
  }

  return weekDates;
}

//获取每天课程表
function getEveryDaySchedul(result) {
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
  if (result.length==0) {
    return []
    
  }
  // 按照JSJCDM字段排序
  result.sort((a, b) => a.JSJCDM - b.JSJCDM);

  // 分割为3个数组
  let start = result[0].JSJCDM
  let end = 1
  let a = []
  for (var i = 0; i < result.length; i++) {
    end++
    if (i < result.length - 1 && result[i].KCMC != result[i + 1].KCMC) {
      var json = {
        XQ: result[i].XQ,
        KCMC: result[i].KCMC,
        ZCMC: result[i].ZCMC,
        JASMC: result[i].JASMC,
        start: timetable[start - 1].start,
        end: timetable[start + end - 3].end
      }
      a.push(json)
      start = result[i + 1].JSJCDM
      end = 1

    }
    if (i == result.length - 1) {
      var json = {
        XQ: result[i].XQ,
        KCMC: result[i].KCMC,
        ZCMC: result[i].ZCMC,
        JASMC: result[i].JASMC,
        start: timetable[start - 1].start,
        end: timetable[start + end - 3].end
      }
      a.push(json)
    }

  }
  return a

}
//获取一周课程表
function getWeekSchedul(result){
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
  if (result.length==0) {
    return []
    
  }
  
// 按照JSJCDM字段排序
result.sort((a, b) => (a.XQ - b.XQ) || (a.JSJCDM - b.JSJCDM));

// 分割为3个数组
let start=result[0].JSJCDM
let end =1
let a=[]
for (var i = 0; i < result.length; i++) {
    end++
    if (i<result.length-1&&result[i].KCMC!=result[i+1].KCMC) {
      var json ={
            XQ:result[i].XQ,
            KCMC:result[i].KCMC,
            ZCMC:result[i].ZCMC,
            JASMC:result[i].JASMC,
            JSXM:result[i].JSXM,
            SKFSDM_DISPLAY:result[i].SKFSDM_DISPLAY,
            JSJCDM:timetable[start - 1].start+'~'+timetable[start + end - 3].end,
            skjc:start,
            skcd:end-1
        }
        a.push(json)
        start = result[i+1].JSJCDM
        end=1
        
    }
    if(i==result.length-1){
        let json ={
            XQ:result[i].XQ,
            KCMC:result[i].KCMC,
            ZCMC:result[i].ZCMC,
            JASMC:result[i].JASMC,
            JSXM:result[i].JSXM,
            SKFSDM_DISPLAY:result[i].SKFSDM_DISPLAY,
            JSJCDM:timetable[start - 1].start+'~'+timetable[start + end - 3].end,
            skjc:start,
            skcd:end-1
        }
        a.push(json)
    }
    
}
return a


}
//转换星期几
function getWeedDay(num) {
  //将星期几转换为中文
  var weekdayMap = {
    
    0: '星期一',
    1: '星期二',
    2: '星期三',
    3: '星期四',
    4: '星期五',
    5: '星期六',
    6: '星期日'
    
  };
  return weekdayMap[num]

}
//判断范围
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

module.exports = {
  getCurrentWeekday:getCurrentWeekday,
  checkWeekRange: checkWeekRange,
  getWeedDay: getWeedDay,
  getEveryDaySchedul:getEveryDaySchedul,
  getWeekSchedul:getWeekSchedul,
  getWeekDates:getWeekDates

}