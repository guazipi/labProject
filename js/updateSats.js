///**
// * Created by chet on 15/7/25.
// */
/**
 * 关于更新数据基本的框架是搭载好了，但后续的工作还有很多，因为你如果更新过之后，全部卫星会重新布局，这个工作是要放到
 * updateSats()函数里面来写的，问题还有很多吧，先把这个放下。
 *
 *
 */
function updateSats(updatestatus) {
    $.ajax({
        url: "php/getTLE/updatedb.php",
        data: {
            updateOrnot: $("#updateOrnot").val(),
            desktopEpoch: epochFromDate()
        },
        type: "POST",
        async: true,
        dataType: 'text',
        success: function (data) {
            //console.log(data);
            //alert(data);

            if (data == "noupdate") {
                //ui.dialog('更新卫星数据', '您现在使用的卫星轨道数据已是最新数据');
                console.log(data);
            }
            ////不能直接转换为json对象，
            //var dataslice=data.slice(1,data.length-1);
            //console.log(dataslice);
            //
            ////值得一提的是，此时从服务器端传输过来的data还不是真正的JSON格式，需要进一步的处理，
            ////将其转化为真正的JSON对象
            //var ret = $.parseJSON(data);
            //alert(ret);//显示的是object
            //console.log(ret);
            //console.log(ret.TLE_LINE0);
            //console.log(ret.TLE_LINE1);
            //console.log(ret.TLE_LINE2);
        },
        error: function (err) {
            alert(err);
        }
    });
}

$("#updateSatsBtn").attr("disabled", true);
// 可以在更新全部卫星的按钮处放置这个processbar的div，然后当更新时更新全部卫星的按钮是不可用的，
// 当更新完毕后，会弹出一个对话框，征求用户的意见是否加载更新过后的卫星数据
$('#updateSatsBtn').click(function () {
    //$('#updateSatsModal').modal(false);
    updateSats();
    $('#updateSatsModal').modal();
    $("#closeUpdateBox").attr("disabled", true);
    $("#shutdownUpdatedBox").attr("disabled", true);
    initialUpdateatsDialog();

});
function initialUpdateatsDialog() {
    var progressbar = $("#progressbar"),
        progressLabel = $(".progress-label");

    progressbar.progressbar({
        value: false,
        change: function () {
            progressLabel.text(progressbar.progressbar("value") + "%");
        },
        complete: function () {
            progressLabel.text("卫星数据更新完成!");
            $("#closeUpdateBox").attr("disabled", false);
            $("#shutdownUpdatedBox").attr("disabled", false);

            //设置数据库中isupdated字段均为0
            setIsupdatedNull();

            //去掉scene中所有的entity
            viewer.entities.removeAll();
            //初始化从数据库取得的tle数据
            initialTLES();
            //默认select_satellite_group选择国内所有资源卫星
            $("#select_satellite_group").val("innerSats");
            //清空选择卫星的select中的选择项
            $("#select_satellite").empty();
            //初始化并且添加entity到scene
            populateSatelliteEntity();

        }
    });
    function progress() {
        var updatedNum, totalNum;
        updatedNum = getUpdatedNum().updatedNum;
        totalNum = getUpdatedNum().totalNum;
        if (updatedNum > 0) {
            //var val = progressbar.progressbar("value") || 0;
            var processing = updatedNum / totalNum;
            var middleProcessing = processing.toFixed(2);
            progressbar.progressbar("value", middleProcessing * 100);

            if (progressbar.progressbar("value") < 99) {
                setTimeout(progress, 80);
            }
        } else {
            progressbar.progressbar("value", 100);
            progressLabel.text("卫星数据已是最新!");
        }

    }

    setTimeout(progress, 3000);
}
/**
 * 根据数据库中isupdated字段的值来确定多少数据得到来更新
 * @returns {{updatedNum: *, totalNum: *}}
 */
function getUpdatedNum() {
    var updatedNum, totalNum;
    $.ajaxSettings.async = false;
    $.getJSON("php/getTLE/observation.php", function (data, testStatus) {
        updatedNum = data[0];
        totalNum = data[1];
    });
    $.ajaxSettings.async = true;
    return {
        'updatedNum': updatedNum,
        'totalNum': totalNum
    };
}
/**
 * 设置数据库中isupdated字段均为0
 */
function setIsupdatedNull() {
    $.ajaxSettings.async = false;
    $.getJSON("php/getTLE/updatedbIsupdated.php", function (data, testStatus) {

    });
    $.ajaxSettings.async = true;
}

//$("#updateSatsBtn").click(function () {
//    epochFromDate();
//});
/**
 * 从具体的一个日期中求取这个日期的epoch值
 * @returns {Number}
 */
function epochFromDate() {
    var year, month, date, hour, minute, second,
        yearEnd, allDays, headEpoch,
        minuteEnd, minuteHead, middleHourEnd, hourEnd, hourHead, middledayEnd, dayEnd, middleEndEpoch, endEpoch,
        epochString;
    year = $("#yearLabel").text();
    month = $("#monthLabel").text();
    date = $("#dayLabel").text();
    hour = $("#hourLabel").text();
    minute = $("#minuteLabel").text();
    second = $("#secondLabel").text();

    yearEnd = year.slice(2, year.length);
    var days = getDays(parseInt(year), parseInt(month), parseInt(date));
    if (days < 100)
        allDays = "0" + days.toString();
    else
        allDays = days.toString();
    headEpoch = yearEnd.toString() + allDays.toString();


    minuteEnd = (parseFloat(second) / 60).toFixed(4);
    minuteHead = parseFloat(minute).toFixed(4);
    middleHourEnd = add(minuteEnd, minuteHead);
    //这样写不可行，估计是浏览器的兼容性的原因吧，用了一个优化过的函数
    //middleHourEnd = minuteEnd +MinuteHead;

    hourEnd = (middleHourEnd / 60).toFixed(4);
    hourHead = parseFloat(hour).toFixed(4);
    middledayEnd = add(hourEnd, hourHead);

    dayEnd = (middledayEnd / 24).toFixed(8);
    middleEndEpoch = dayEnd.toString();
    endEpoch = middleEndEpoch.slice(2, middleEndEpoch.length);

    epochString = headEpoch + '.' + endEpoch;

    //alert(epochString);
    return parseFloat(epochString);
}
/**
 * 给出年、月、日，判断这一天是这一年的第几天
 * @param year
 * @param month
 * @param date
 * @returns {number}
 */
function getDays(year, month, date) {
    var days = 0,
        monthArray = new Array(0, 31, 0, 31, 30,
            31, 30, 31, 31, 30, 31, 30, 31);
    if (!isLeapYear(year))
        monthArray[2] = 28;
    else
        monthArray[2] = 29;
    for (var i = 1; i < month; ++i) {
        days += monthArray[i];
    }
    days += date;
    return days;
}
/**
 * 优化后的两个浮点数相加的函数
 * 参考：http://www.2cto.com/kf/201502/376763.html
 * @param a
 * @param b
 */
function add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}


function mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {
    }
    try {
        c += e.split(".")[1].length;
    } catch (f) {
    }
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}


