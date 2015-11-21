/**
 * Created by chet on 15/7/25.
 */
function initializeDatelabel() {
    //开启ajax的同步执行设置，默认是异步执行的
    //$.ajaxSettings.async = false;
    $.ajax({
        url: "php/getTLE/initialDatelabel.php",
        data: {noradNum: 38046},
        type: "POST",
        async: true,
        dataType: 'text',
        success: function (data) {
            //console.log(data);
            //alert(data);
            var dateArray = DateFromEpoch(data);

            $("#yearLabel").text(dateArray['year']);
            $("#monthLabel").text(dateArray['month']);
            $("#dayLabel").text(dateArray['day']);
            $("#hourLabel").text(dateArray['hour']);
            $("#minuteLabel").text(dateArray['minute']);
            $("#secondLabel").text(dateArray['second']);
        },
        error: function (err) {
            alert(err);
        }
    });
    //恢复ajax的异步执行设置，默认是异步执行的，
    // 上边开启了同步执行设置
    //$.ajaxSettings.async = true;
}
/**
 * 从epoch中计算具体日期
 * @param epoch
 * @returns {Array|*}
 * @constructor
 */
function DateFromEpoch(epoch) {
    var epochString, middleChar, headEpoch, endEpoch,
        yearEnd, year, allDays, month, day,
        hour, middleMinute, minute, second,
        dateArray;
    epochString = epoch.toString();
    middleChar = epochString.indexOf(".");
    headEpoch = epochString.slice(0, middleChar);
    endEpoch = epochString.slice(middleChar + 1, epochString.length);

    yearEnd = parseInt(headEpoch.slice(0, 2));
    if (yearEnd < 57) {
        year = parseInt("20" + yearEnd.toString());
    } else {
        year = parseInt("19" + yearEnd.toString());
    }


    allDays = parseInt(headEpoch.slice(2, headEpoch.length));

    var monthdateArray = getMonthdateArray(year, allDays);


    var trueEndEpoch = parseFloat("0." + endEpoch);
    hour = parseInt(trueEndEpoch * 24);
    if (hour < 10)
        hour = "0" + hour.toString();
    middleMinute = (trueEndEpoch * 24 - hour) * 60;
    minute = parseInt(middleMinute);
    if (minute < 10)
        minute = "0" + minute.toString();
    second = ((middleMinute - minute) * 60).toFixed(0);
    if (second < 10)
        second = "0" + second.toString();

    dateArray = new Array();
    dateArray['year'] = year;
    dateArray['month'] = monthdateArray.getMonth;
    dateArray['day'] = monthdateArray.getDay;
    dateArray['hour'] = hour;
    dateArray['minute'] = minute;
    dateArray['second'] = second;

    return dateArray;
}

//JS判断闰年代码
function isLeapYear(Year) {
    if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
        return (true);
    } else {
        return (false);
    }
}
/**
 * 给出年份和一年中的天数，判断是否是闰年
 * 返回一个含有月份和这个月的第几天的数组
 * @param year
 * @param days
 */
function getMonthdateArray(year, days) {
    if (!isLeapYear(year))
        return noLeapMonthday(days);
    else
        return leapMonthday(days);
}
/**
 * 给出一个闰年的天数，返回月份和这个月的某一天
 * 二月29天
 * @param days
 * @returns {Array}
 */
function leapMonthday(days) {
    var month = 0, day = 0;
    if (days < 31) {
        month = 1;
        day = days;
    }
    else if (days == 31) {
        month = 1;
        day = 31;
    }
    else if (days > 31 && days < 60) {
        month = 2;
        day = days - 31;
    }
    else if (days == 60) {
        month = 2;
        day = 28;
    }
    else if (days > 60 && days < 91) {
        month = 3;
        day = days - 60;
    }
    else if (days == 91) {
        month = 3;
        day = 31;
    }
    else if (days > 91 && days < 121) {
        month = 4;
        day = days - 91;
    }
    else if (days == 121) {
        month = 4;
        day = 30;
    }
    else if (days > 121 && days < 152) {
        month = 5;
        day = days - 121;
    }
    else if (days == 152) {
        month = 5;
        day = 31;
    }
    else if (days > 152 && days < 182) {
        month = 6;
        day = days - 152;
    }
    else if (days == 182) {
        month = 6;
        day = 30;
    }
    else if (days > 182 && days < 213) {
        month = 7;
        day = days - 182;
    }
    else if (days == 213) {
        month = 7;
        day = 31;
    }
    else if (days > 213 && days < 244) {
        month = 8;
        day = days - 213;
    }
    else if (days == 244) {
        month = 8;
        day = 31;
    }
    else if (days > 244 && days < 274) {
        month = 9;
        day = days - 244;
    }
    else if (days == 274) {
        month = 9;
        day = 30;
    }
    else if (days > 274 && days < 305) {
        month = 10;
        day = days - 274;
    }
    else if (days == 305) {
        month = 10;
        day = 31;
    }
    else if (days > 305 && days < 335) {
        month = 11;
        day = days - 305;
    }
    else if (days == 335) {
        month = 11;
        day = 30;
    }
    else if (days > 335 && days < 366) {
        month = 12;
        day = days - 335;
    }
    else if (days == 366) {
        month = 12;
        day = 31;
    }

    return {
        'getMonth': month,
        'getDay': day
    };

}
/**
 * 给出一个非闰年的天数，返回月份和这个月的某一天
 * 二月28天
 * @param days
 * @returns {Array}
 */
function noLeapMonthday(days) {
    var month = 0, day = 0;
    if (days < 31) {
        month = 1;
        day = days;
    }
    else if (days == 31) {
        month = 1;
        day = 31;
    }
    else if (days > 31 && days < 59) {
        month = 2;
        day = days - 31;
    }
    else if (days == 59) {
        month = 2;
        day = 28;
    }
    else if (days > 59 && days < 90) {
        month = 3;
        day = days - 59;
    }
    else if (days == 90) {
        month = 3;
        day = 31;
    }
    else if (days > 90 && days < 120) {
        month = 4;
        day = days - 90;
    }
    else if (days == 120) {
        month = 4;
        day = 30;
    }
    else if (days > 120 && days < 151) {
        month = 5;
        day = days - 120;
    }
    else if (days == 151) {
        month = 5;
        day = 31;
    }
    else if (days > 151 && days < 181) {
        month = 6;
        day = days - 151;
    }
    else if (days == 181) {
        month = 6;
        day = 30;
    }
    else if (days > 181 && days < 212) {
        month = 7;
        day = days - 181;
    }
    else if (days == 212) {
        month = 7;
        day = 31;
    }
    else if (days > 212 && days < 243) {
        month = 8;
        day = days - 212;
    }
    else if (days == 243) {
        month = 8;
        day = 31;
    }
    else if (days > 243 && days < 273) {
        month = 9;
        day = days - 243;
    }
    else if (days == 273) {
        month = 9;
        day = 30;
    }
    else if (days > 273 && days < 304) {
        month = 10;
        day = days - 273;
    }
    else if (days == 304) {
        month = 10;
        day = 31;
    }
    else if (days > 304 && days < 334) {
        month = 11;
        day = days - 304;
    }
    else if (days == 334) {
        month = 11;
        day = 30;
    }
    else if (days > 334 && days < 365) {
        month = 12;
        day = days - 334;
    }
    else if (days == 365) {
        month = 12;
        day = 31;
    }
    return {
        'getMonth': month,
        'getDay': day
    };
}