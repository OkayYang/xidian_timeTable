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
    week: week - 37,
    day: day
  };
}
function calcuWeek() {
  var startDate = new Date(2023, 8, 4); // 设定的第一周起始日
  var today = new Date(); // 当前日期（月份从0开始，所以9表示十月份）
  var result = calculateWeekday(today);
  return result

}
function getWeekDates(weekNumber) {
  var startDate = new Date(2023, 8, 4); // 设定的第一周起始日
  var currentDate = new Date(startDate.getTime());
  currentDate.setDate(currentDate.getDate() + (weekNumber - 1) * 7); // 计算指定周数的起始日期

  var weekDates = [];
  
  for (var i = 0; i < 7; i++) {
    var date = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000);
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // 月份从0开始，需要加1；使用slice(-2)确保月份有两位数
    var day = ("0" + date.getDate()).slice(-2); // 使用slice(-2)确保日期有两位数
    var formattedDate = month + "-" + day;
    var weekday = getWeekday2(i); // 获取星期几
    weekDates.push({ date: formattedDate, week: weekday });
  }

  return weekDates;
}

// 获取星期几
function getWeekday2(dayIndex) {
  var weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[dayIndex];
}


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
function getWeedDay(num) {
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
function transformCourses(courses) {
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

  // 对课程列表按照JSJCDM升序排序
  courses.sort((a, b) => a.JSJCDM - b.JSJCDM);

  const mergedCourses = [];

  for (const course of courses) {
    const start = timetable[course.JSJCDM - 1].start;
    const end = timetable[course.JSJCDM - 1].end;

    const existingCourse = mergedCourses.find(
      (c) => c.XQ === course.XQ && c.KCMC === course.KCMC && c.ZCMC === course.ZCMC && c.JASMC === course.JASMC
    );

    if (existingCourse) {
      existingCourse.JSJCDM.end = end;
      existingCourse.JSJCDM.skjd += 1;
    } else {
      mergedCourses.push({
        XQ: course.XQ,
        KCMC: course.KCMC,
        ZCMC: course.ZCMC,
        JASMC: course.JASMC,
        JSJCDM: { start, end, skjc: course.JSJCDM, skjd: 1 }
      });
    }
  }

  return mergedCourses.map((course) => ({
    ...course,
    JSJCDM: `${course.JSJCDM.start}~${course.JSJCDM.end}`,
    skjc: course.JSJCDM.skjc,
    skjd: course.JSJCDM.skjd
  }));
}
function convertJSJCDM(courses) {
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

  const mergedCourses = [];

  for (const course of courses) {
    const start = timetable[course.JSJCDM - 1].start;
    const end = timetable[course.JSJCDM - 1].end;

    const existingCourse = mergedCourses.find(
      (c) => c.XQ === course.XQ && c.KCMC === course.KCMC && c.ZCMC === course.ZCMC && c.JASMC === course.JASMC
    );

    if (existingCourse) {
      existingCourse.JSJCDM.end = end;
    } else {
      mergedCourses.push({
        XQ: course.XQ,
        KCMC: course.KCMC,
        ZCMC: course.ZCMC,
        JASMC: course.JASMC,
        JSJCDM: { start, end }
      });
    }
  }

  return mergedCourses.map((course) => ({
    ...course,
    JSJCDM: `${course.JSJCDM.start}~${course.JSJCDM.end}`
  }));
}
function getThisWeekDates() {
  var currentDate = new Date(); // 获取当前日期
  var currentDay = currentDate.getDay(); // 获取当前是星期几
  var daysToAdd = 1 - currentDay; // 计算需要添加的天数，使得下一个周一
  currentDate.setDate(currentDate.getDate() + daysToAdd); // 调整日期到下一个周一

  var weekDates = [];
  var daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
  for (var i = 0; i < 7; i++) {
    var month = currentDate.getMonth() + 1; // 注意月份是从0开始计数的，所以需要加1
    var day = currentDate.getDate();
    var formattedDate = (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
    var week = '周' + daysOfWeek[currentDate.getDay()];
    var dateObj = {
      week: week,
      date: formattedDate
    };
    weekDates.push(dateObj);
    currentDate.setDate(currentDate.getDate() + 1); // 增加一天
  }

  return weekDates;
}

module.exports = {
  calcuWeek: calcuWeek,
  checkWeekRange: checkWeekRange,
  convertJSJCDM: convertJSJCDM,
  getWeedDay: getWeedDay,
  transformCourses: transformCourses,
  getThisWeekDates: getThisWeekDates,
  getEveryDaySchedul:getEveryDaySchedul,
  getWeekSchedul:getWeekSchedul,
  getWeekDates:getWeekDates

}