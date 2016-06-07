/**
 * Created by Administrator on 2016/6/6.
 */
Gers.Detector = {
    canvas: !!window.CanvasRenderingContext2D,
    webgl: (function () {
        try {
            var canvas = document.createElement('canvas');
            return !!( window.WebGLRenderingContext && ( canvas.getContext('webgl') || canvas.getContext('experimental-webgl') ) );

        } catch (e) {
            return false;
        }

    })(),
    workers: !!window.Worker,
    fileapi: window.File && window.FileReader && window.FileList && window.Blob,

    getWebGLErrorMessage: function () {
        var element = document.createElement('div');
        element.id = 'webgl-error-message';
        element.style.fontFamily = 'monospace';
        element.style.fontSize = '13px';
        element.style.fontWeight = 'normal';
        element.style.textAlign = 'center';
        element.style.background = '#fff';
        element.style.color = '#000';
        element.style.padding = '1.5em';
        element.style.width = '400px';
        element.style.margin = '5em auto 0';

        if (!this.webgl) {
            element.innerHTML = window.WebGLRenderingContext ? [
                'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
                'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
            ].join('\n') : [
                'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
                'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
            ].join('\n');

        }
        return element;
    },

    addGetWebGLMessage: function (parameters) {
        var parent, id, element;
        parameters = parameters || {};
        parent = parameters.parent !== undefined ? parameters.parent : document.body;
        id = parameters.id !== undefined ? parameters.id : 'oldie';

        element = Detector.getWebGLErrorMessage();
        element.id = id;
        parent.appendChild(element);
    }
};
Gers.showErrorPanel = function (jqElement, title, message, error) {
    var defined = function (value) {
        return value !== undefined && value !== null;
    }
    var element = jqElement;
    var overlay = document.createElement('div');
    overlay.className = 'cesium-widget-errorPanel';

    var content = document.createElement('div');
    content.className = 'cesium-widget-errorPanel-content';
    overlay.appendChild(content);

    var errorHeader = document.createElement('div');
    errorHeader.className = 'cesium-widget-errorPanel-header';
    errorHeader.appendChild(document.createTextNode(title));
    content.appendChild(errorHeader);

    var errorPanelScroller = document.createElement('div');
    errorPanelScroller.className = 'cesium-widget-errorPanel-scroll';
    content.appendChild(errorPanelScroller);
    var resizeCallback = function () {
        errorPanelScroller.style.maxHeight = Math.max(Math.round(element.clientHeight * 0.9 - 100), 30) + 'px';
    };
    resizeCallback();
    if (defined(window.addEventListener)) {
        window.addEventListener('resize', resizeCallback, false);
    }

    if (defined(message)) {
        var errorMessage = document.createElement('div');
        errorMessage.className = 'cesium-widget-errorPanel-message';
        errorMessage.innerHTML = '<p style="font-size:15px">' + message + '</p>';
        errorPanelScroller.appendChild(errorMessage);
    }

    //var errorDetails = '(no error details available)';
    //if (defined(error)) {
    //    errorDetails = formatError(error);
    //}
    //
    //var errorMessageDetails = document.createElement('div');
    //errorMessageDetails.className = 'cesium-widget-errorPanel-message';
    //errorMessageDetails.appendChild(document.createTextNode(errorDetails));
    //errorPanelScroller.appendChild(errorMessageDetails);

    var buttonPanel = document.createElement('div');
    buttonPanel.className = 'cesium-widget-errorPanel-buttonPanel';
    content.appendChild(buttonPanel);

    var okButton = document.createElement('button');
    okButton.setAttribute('type', 'button');
    okButton.className = 'cesium-button';
    okButton.appendChild(document.createTextNode('OK'));
    okButton.onclick = function () {
        if (defined(resizeCallback) && defined(window.removeEventListener)) {
            window.removeEventListener('resize', resizeCallback, false);
        }
        element.removeChild(overlay);
    };

    buttonPanel.appendChild(okButton);

    element.appendChild(overlay);
    //element.append(overlay);

    //IE8 does not have a console object unless the dev tools are open.
    //if (typeof console !== 'undefined') {
    //    console.error(title + '\n' + message + '\n' + errorDetails);
    //}
};

if (!Gers.Detector.webgl || navigator.appName != "Netscape") {

    // cesium-widget
    var jqElement=$("cesium-widget");
    var title = '浏览器支持WebGL错误.';
    var message="&nbsp本网站采用了WebGL技术开发而成，检测到您所使用的浏览器内核为IE10以及IE10以下版本，这些版本不支持WebGL。\n";
    message += '&nbsp访问 <a href="http://get.webgl.org">http://get.webgl.org</a> 验证你的web浏览器和硬件是否支持WebGL。' +
        '为了更完美的用户体验，我们推荐您使用<a href="http://sw.bos.baidu.com/sw-search-sp/software/29cd900ea7d/ChromeStandalone_50.0.2661.102_Setup.exe">Google Chrome</a>和<a href="http://www.firefox.com.cn/download/">Firefox</a>浏览器，或者更新您的显卡驱动。\n';
    message+="&nbsp&nbsp&nbsp&nbsp<a href='http://gers.radi.ac.cn'>更多信息...</a>";

    Gers.showErrorPanel(document.body, title, message);
    //$("a.various").click(); //既触发了a标签的点击事件，又触发了页面跳转

    //if (!!(window.attachEvent && !window.opera)) {
    //    document.execCommand("stop");
    //}
    //else {
    //    window.stop();
    //}
}