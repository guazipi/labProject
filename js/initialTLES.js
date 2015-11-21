/**
 * Created by chet on 15/7/26.
 */
function initialTLES() {
    /**
     * $.get,post,ajax和getJSON等方法默认是异步请求的，如果你不说明是同步请求，
     * 程序继续运行下去，而异步请求后面使用的变量很可能是在异步请求中进行初始化的，
     * 就会出现某个变量未定义的错误
     * @type {boolean}
     */
    //开启ajax的同步执行设置，默认是异步执行的
    $.ajaxSettings.async = false;
    $.getJSON("php/getTLE/initializeTles.php", function (data, testStatus) {

        /**
         * 此时从服务器的数据库中返回回来是一个多维数组，
         * 每个卫星的tleLine0、tleLine1和tleLine2三行元素一个数组，
         * 每个卫星的数组又组成一个大的数组
         */
        //console.log(data);
        //console.log(data[0][1]);
        getSatrecsFromTLESArray(data);

    });
    //恢复ajax的异步执行设置，默认是异步执行的，
    // 上边开启了同步执行设置
    $.ajaxSettings.async = true;
}
/**
 * 每个卫星的tleLine0、tleLine1和tleLine2三行元素一个数组，
 * 每个卫星的数组又组成一个大的数组，即是tleArray参数
 * @param tlesArray
 *
 * Read TLEs from tlesArray and set GLOBAL satrecs, names, noradId and intlDesig.
 * We can then run the SGP4 propagator over it and render as billboards.
 */

function getSatrecsFromTLESArray(tlesArray) {
    var satnum, max, rets, satrec, startmfe, stopmfe, deltamin;
    var tles = tlesArray

    // Reset the globals
    satrecs = [];
    satData = [];

    for (satnum = 0, max = tles.length; satnum < max; satnum += 1) {
        satData[satnum] = {
            name: tles[satnum][0].trim(), // Name: (ISS (ZARYA))
            intlDesig: tles[satnum][1].slice(9, 17), // Intl Designator YYNNNPPP (98067A)
            noradId: tles[satnum][2].split(' ')[1], // NORAD ID (25544)
            // should parse and store the bits we want, but save string for now
            tle0: tles[satnum][0],
            tle1: tles[satnum][1],
            tle2: tles[satnum][2]
        };

        rets = twoline2rv(WHICHCONST,
            tles[satnum][1],
            tles[satnum][2],
            TYPERUN,
            TYPEINPUT);
        satrec = rets.shift();
        startmfe = rets.shift();
        stopmfe = rets.shift();
        deltamin = rets.shift();
        satrecs.push(satrec); // Don't need to sgp4(satrec, 0.0) to initialize state vector
    }
    // Returns nothing, sets globals: satrecs, satData
}
