/**
 * Created by Administrator on 2016/4/1.
 */
initial = function () {
    "use strict";

    var initial = {
        addPopulation: addPopulation,
        destroyPopulation: destroyPopulation,
        iniLayerSwitch: iniLayerSwitch,
        destroyLayerSwitch: destroyLayerSwitch,
        iniElevationSlider: iniElevationSlider,
        iniCarousel: iniCarousel,
        backOriginalView: backOriginalView,
        doubleClickZoomIn: doubleClickZoomIn,
        DateFromEpoch: DateFromEpoch,
        initializeDatelabel: initializeDatelabel,
        initialDraw: readyDrawsth,
    };


    /**
     * This class is an example of a custom DataSource.  It loads JSON data as
     * defined by Google's WebGL Globe, https://github.com/dataarts/webgl-globe.
     * @alias WebGLGlobeDataSource
     * @constructor
     *
     * @param {String} [name] The name of this data source.  If undefined, a name
     *                        will be derived from the url.
     *
     * @example
     * var dataSource = new Cesium.WebGLGlobeDataSource();
     * dataSource.loadUrl('sample.json');
     * viewer.dataSources.add(dataSource);
     */
    function WebGLGlobeDataSource(name) {
        //All public configuration is defined as ES5 properties
        //These are just the "private" variables and their defaults.
        this._name = name;
        this._changed = new Cesium.Event();
        this._error = new Cesium.Event();
        this._isLoading = false;
        this._loading = new Cesium.Event();
        this._entityCollection = new Cesium.EntityCollection();
        this._seriesNames = [];
        this._seriesToDisplay = undefined;
        this._heightScale = 10000000;
    }

    Object.defineProperties(WebGLGlobeDataSource.prototype, {
        //The below properties must be implemented by all DataSource instances

        /**
         * Gets a human-readable name for this instance.
         * @memberof WebGLGlobeDataSource.prototype
         * @type {String}
         */
        name: {
            get: function () {
                return this._name;
            }
        },
        /**
         * Since WebGL Globe JSON is not time-dynamic, this property is always undefined.
         * @memberof WebGLGlobeDataSource.prototype
         * @type {DataSourceClock}
         */
        clock: {
            value: undefined,
            writable: false
        },
        /**
         * Gets the collection of Entity instances.
         * @memberof WebGLGlobeDataSource.prototype
         * @type {EntityCollection}
         */
        entities: {
            get: function () {
                return this._entityCollection;
            }
        },
        /**
         * Gets a value indicating if the data source is currently loading data.
         * @memberof WebGLGlobeDataSource.prototype
         * @type {Boolean}
         */
        isLoading: {
            get: function () {
                return this._isLoading;
            }
        },
        /**
         * Gets an event that will be raised when the underlying data changes.
         * @memberof WebGLGlobeDataSource.prototype
         * @type {Event}
         */
        changedEvent: {
            get: function () {
                return this._changed;
            }
        },
        /**
         * Gets an event that will be raised if an error is encountered during
         * processing.
         * @memberof WebGLGlobeDataSource.prototype
         * @type {Event}
         */
        errorEvent: {
            get: function () {
                return this._error;
            }
        },
        /**
         * Gets an event that will be raised when the data source either starts or
         * stops loading.
         * @memberof WebGLGlobeDataSource.prototype
         * @type {Event}
         */
        loadingEvent: {
            get: function () {
                return this._loading;
            }
        },

        //These properties are specific to this DataSource.

        /**
         * Gets the array of series names.
         * @memberof WebGLGlobeDataSource.prototype
         * @type {String[]}
         */
        seriesNames: {
            get: function () {
                return this._seriesNames;
            }
        },
        /**
         * Gets or sets the name of the series to display.  WebGL JSON is designed
         * so that only one series is viewed at a time.  Valid values are defined
         * in the seriesNames property.
         * @memberof WebGLGlobeDataSource.prototype
         * @type {String}
         */
        seriesToDisplay: {
            get: function () {
                return this._seriesToDisplay;
            },
            set: function (value) {
                this._seriesToDisplay = value;

                //Iterate over all entities and set their show property
                //to true only if they are part of the current series.
                var collection = this._entityCollection;
                var entities = collection.values;
                collection.suspendEvents();
                for (var i = 0; i < entities.length; i++) {
                    var entity = entities[i];
                    entity.show = value === entity.seriesName;
                }
                collection.resumeEvents();
            }
        },
        /**
         * Gets or sets the scale factor applied to the height of each line.
         * @memberof WebGLGlobeDataSource.prototype
         * @type {Number}
         */
        heightScale: {
            get: function () {
                return this._heightScale;
            },
            set: function (value) {
                if (value > 0) {
                    throw new Cesium.DeveloperError('value must be greater than 0');
                }
                this._heightScale = value;
            }
        },
        /**
         * Gets whether or not this data source should be displayed.
         * @memberof WebGLGlobeDataSource.prototype
         * @type {Boolean}
         */
        show: {
            get: function () {
                return this._entityCollection;
            },
            set: function (value) {
                this._entityCollection = value;
            }
        }
    });

    /**
     * Asynchronously loads the GeoJSON at the provided url, replacing any existing data.
     * @param {Object} url The url to be processed.
     * @returns {Promise} a promise that will resolve when the GeoJSON is loaded.
     */
    WebGLGlobeDataSource.prototype.loadUrl = function (url) {
        if (!Cesium.defined(url)) {
            throw new Cesium.DeveloperError('url is required.');
        }

        //Create a name based on the url
        var name = Cesium.getFilenameFromUri(url);

        //Set the name if it is different than the current name.
        if (this._name !== name) {
            this._name = name;
            this._changed.raiseEvent(this);
        }

        //Use 'when' to load the URL into a json object
        //and then process is with the `load` function.
        var that = this;
        return Cesium.when(Cesium.loadJson(url), function (json) {
            return that.load(json, url);
        }).otherwise(function (error) {
            //Otherwise will catch any errors or exceptions that occur
            //during the promise processing. When this happens,
            //we raise the error event and reject the promise.
            this._setLoading(false);
            that._error.raiseEvent(that, error);
            return Cesium.when.reject(error);
        });
    };

    /**
     * Loads the provided data, replacing any existing data.
     * @param {Object} data The object to be processed.
     */
    WebGLGlobeDataSource.prototype.load = function (data) {
        //>>includeStart('debug', pragmas.debug);
        if (!Cesium.defined(data)) {
            throw new Cesium.DeveloperError('data is required.');
        }
        //>>includeEnd('debug');

        //Clear out any data that might already exist.
        this._setLoading(true);
        this._seriesNames.length = 0;
        this._seriesToDisplay = undefined;

        var heightScale = this.heightScale;
        var entities = this._entityCollection;

        //It's a good idea to suspend events when making changes to a
        //large amount of entities.  This will cause events to be batched up
        //into the minimal amount of function calls and all take place at the
        //end of processing (when resumeEvents is called).
        entities.suspendEvents();
        entities.removeAll();

        //WebGL Globe JSON is an array of series, where each series itself is an
        //array of two items, the first containing the series name and the second
        //being an array of repeating latitude, longitude, height values.
        //
        //Here's a more visual example.
        //[["series1",[latitude, longitude, height, ... ]
        // ["series2",[latitude, longitude, height, ... ]]

        // Loop over each series
        for (var x = 0; x < data.length; x++) {
            var series = data[x];
            var seriesName = series[0];
            var coordinates = series[1];

            //Add the name of the series to our list of possible values.
            this._seriesNames.push(seriesName);

            //Make the first series the visible one by default
            var show = x === 0;
            if (show) {
                this._seriesToDisplay = seriesName;
            }

            //Now loop over each coordinate in the series and create
            // our entities from the data.
            for (var i = 0; i < coordinates.length; i += 3) {
                var latitude = coordinates[i];
                var longitude = coordinates[i + 1];
                var height = coordinates[i + 2];

                //Ignore lines of zero height.
                if (height === 0) {
                    continue;
                }

                var color = Cesium.Color.fromHsl((0.6 - (height * 0.5)), 1.0, 0.5);
                var surfacePosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
                var heightPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, height * heightScale);

                //WebGL Globe only contains lines, so that's the only graphics we create.
                var polyline = new Cesium.PolylineGraphics();
                polyline.material = new Cesium.ColorMaterialProperty(color);
                polyline.width = new Cesium.ConstantProperty(2);
                polyline.followSurface = new Cesium.ConstantProperty(false);
                polyline.positions = new Cesium.ConstantProperty([surfacePosition, heightPosition]);

                //The polyline instance itself needs to be on an entity.
                var entity = new Cesium.Entity({
                    id: seriesName + ' index ' + i.toString(),
                    show: show,
                    polyline: polyline,
                    seriesName: seriesName //Custom property to indicate series name
                });

                //Add the entity to the collection.
                entities.add(entity);
            }
        }

        //Once all data is processed, call resumeEvents and raise the changed event.
        entities.resumeEvents();
        this._changed.raiseEvent(this);
        this._setLoading(false);
    };

    WebGLGlobeDataSource.prototype._setLoading = function (isLoading) {
        if (this._isLoading !== isLoading) {
            this._isLoading = isLoading;
            this._loading.raiseEvent(this, isLoading);
        }
    };
    function addPopulation() {
        //Now that we've defined our own DataSource, we can use it to load
        //any JSON data formatted for WebGL Globe.
        var dataSource = new WebGLGlobeDataSource();
        $("#cover").show();
        setTimeout(function () {
            dataSource.loadUrl('./dataset/json/population909500.json').then(function () {
                $("#cover").hide();
                //After the initial load, create buttons to let the user switch among series.
                function createSeriesSetter(seriesName) {
                    return function () {
                        dataSource.seriesToDisplay = seriesName;
                    };
                }

                for (var i = 0; i < dataSource.seriesNames.length; i++) {
                    var seriesName = dataSource.seriesNames[i];
                    Sandcastle.addToolbarButton(seriesName, createSeriesSetter(seriesName));
                }


            });

            viewer.clock.shouldAnimate = false;
            viewer.dataSources.add(dataSource);

        }, 1500);
    }

    function destroyPopulation() {
        viewer.dataSources.removeAll();
        $("#toolbar_popu").hide();
        $("#toolbar_popu").html("");
    }


    var layer2000Name = "2000_china_lai_pcttorgb_png";
    var layer2005Name = "2005_china_lai_pcttorgb_png";
    var layer2010Name = "2010_china_lai_pcttorgb_png";

    function getImageryProvider(layerName) {
        var imageryProvider = new Cesium.TileMapServiceImageryProvider({
            url: "/wwwroot/Earth_Data/" + layerName + "/",
            fileExtension: "png"
        });

        return imageryProvider;
    }

    var layersArr = [];

    function iniLayerSwitch() {
        var layers = viewer.scene.imageryLayers;
        var layer2000 = layers.addImageryProvider(getImageryProvider(layer2000Name));
        var layer2005 = layers.addImageryProvider(getImageryProvider(layer2005Name));
        var layer2010 = layers.addImageryProvider(getImageryProvider(layer2010Name));

        var dataImageLayer = new Array(layer2000, layer2005, layer2010);

        layersArr = dataImageLayer;

        jQuery('#LayerSwitcher').slider({
            min: 0.0,
            max: 15.0,
            value: 0,
            step: 0.1,
            slide: function (event, ui) {
                if (ui.value < 5) {
                    dataImageLayer[0].alpha = 1;
                    dataImageLayer[1].alpha = 0;
                    dataImageLayer[2].alpha = 0;

                    dataImageLayer[0].alpha = ui.value / 5;
                    $("#currentYear").html("中国区域叶面积指数变化：2000年");
                } else if (ui.value >= 5 && ui.value < 10) {
                    dataImageLayer[0].alpha = 1;
                    dataImageLayer[1].alpha = 1;
                    dataImageLayer[2].alpha = 0;

                    dataImageLayer[0].alpha = (1 - (ui.value - 5) / 5);
                    dataImageLayer[1].alpha = (ui.value - 5) / 5;
                    $("#currentYear").html("中国区域叶面积指数变化：2005年");
                } else if (ui.value >= 10 && ui.value < 15) {
                    dataImageLayer[0].alpha = 0;
                    dataImageLayer[1].alpha = 1;
                    dataImageLayer[2].alpha = 1;

                    dataImageLayer[1].alpha = (1 - (ui.value - 10) / 5);
                    dataImageLayer[2].alpha = (ui.value - 10) / 5;
                    $("#currentYear").html("中国区域叶面积指数变化：2010年");
                }
            }
        });
    }

    function destroyLayerSwitch() {
        var layers = viewer.scene.imageryLayers;

        if (layers.contains(layersArr[0])) {
            layers.remove(layersArr[0]);
        }
        if (layers.contains(layersArr[1])) {
            layers.remove(layersArr[1]);
        }
        if (layers.contains(layersArr[2])) {
            layers.remove(layersArr[2]);
        }

        jQuery('#LayerSwitcher').html("");
    }

    function iniElevationSlider() {
        //jQuery('#ElevationSlider').slider({
        //    min: 1.0,
        //    max: 25.0,
        //    value: mapView.verticalScale,
        //    step: 0.1,
        //    slide: function (event, ui) {
        //        mapView.setVerticalScale(ui.value);
        //    }
        //});
        //
    }

    function iniCarousel() {
        //$('.web3dglobe-mainmenu > li > a').click(function () {
        //    $('.web3dglobe-mainmenu > li').each(function () {
        //        $(this).removeClass('active');
        //    });
        //
        //    $(this).parent().addClass('active');
        //});

        $("#ui-carousel-next")
            .add("#ui-carousel-prev")
            .hover(
                function () {
                    $(this).css("opacity", 0.7);
                },
                function () {
                    $(this).css("opacity", 1.0);
                }
            );
        $.each($('#carousel-items').children(), function (i, e) {
            carousel_items.push($(e).html());
            prodList.push({
                label: $($(e).children()['1']).text()
            });
        });
    }

    /**
     * 在没有跟踪卫星的情况下，按空格键回到最初的观察角度
     * @param scene
     */
    function backOriginalView(scene) {
        //var backViewHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        //backViewHandler.setInputAction(function (movement) {
        //    if (!viewer.trackedEntity) {
        //        scene.camera.viewRectangle(Cesium.Rectangle.fromDegrees(100.5, -10.5, 130.0, 89.0));
        //    }
        //}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        function getFlagForKeyCode(keyCode) {
            switch (keyCode) {
                case ' '.charCodeAt(0):
                    return 'spaceKey';
                //case 'A'.charCodeAt(0):
                //    return 'moveLeft';
                default:
                    return undefined;
            }
        }

        document.addEventListener('keydown', function (e) {
            var flagName = getFlagForKeyCode(e.keyCode);
            if (flagName == 'spaceKey') {
                if (!viewer.trackedEntity) {
                    scene.camera.viewRectangle(Cesium.Rectangle.fromDegrees(100.5, -10.5, 125.0, 80.0));
                }
            }
        }, false);
    }

    /**
     * 双击放大放大放大
     */
    function doubleClickZoomIn(scene) {
        var doubleClickHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        doubleClickHandler.setInputAction(function (movement) {
            var cameraPos = scene.camera.position;
            var cartographicPos = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cameraPos);
            var height = cartographicPos.height;
            console.log(height);
            //defaultMoveAmount:100000.0;
            if (height > 3000000.0) {
                scene.camera.moveForward(3000000.0);
            } else if (height < 200000.0) {
                //defaultLookAmount  Math.PI / 60.0
                scene.camera.lookUp(Cesium.Math.toRadians(90));
            } else {
                scene.camera.moveForward(200000.0);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }


    /**
     * Created by chet on 15/7/25.
     * 初始化卫星更新的时间标签
     */
    function initializeDatelabel() {
        //$.ajaxSettings.async = false;
        $.getJSON("php/getTLE/initialDatelabel.php", function (data) {
            var dateArray = DateFromEpoch(data);

            $("#yearLabel").text(dateArray['year']);
            $("#monthLabel").text(dateArray['month']);
            $("#dayLabel").text(dateArray['day']);
            $("#hourLabel").text(dateArray['hour']);
            $("#minuteLabel").text(dateArray['minute']);
            $("#secondLabel").text(dateArray['second']);
        });
        // $.ajaxSettings.async = true;
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

    /**
     * Created by chet on 15/8/3.
     */
    function readyDrawsth() {
        var scene = viewer.scene;
        var drawHelper = new DrawHelper(viewer);
        var toolbar = drawHelper.addToolbar(document.getElementById("drawSthTools"), {
            //buttons: ['marker', 'polyline', 'polygon', 'circle', 'extent']
            buttons: ['polygon', 'circle', 'extent']
        });
        toolbar.addListener('polygonCreated', function (event) {
            //loggingMessage('Polygon created with ' + event.positions.length + ' points');
            loggingMessage('多边形创建完成，共含有 ' + event.positions.length + ' 点');
            var polygon = new DrawHelper.PolygonPrimitive({
                positions: event.positions,
                material: Cesium.Material.fromType('Checkerboard')
            });
            scene.primitives.add(polygon);
            polygon.setEditable();
            polygon.addListener('onEdited', function (event) {
                //loggingMessage('Polygon edited, ' + event.positions.length + ' points');
                loggingMessage('多边形编辑完成,共含有 ' + event.positions.length + ' 点');
            });

        });
        toolbar.addListener('circleCreated', function (event) {
            //loggingMessage('Circle created: center is ' + event.center.toString() + ' and radius is ' + event.radius.toFixed(1) + ' meters');
            loggingMessage('圆形创建完成: 中心点为 ' + event.center.toString() + '，半径为 ' + event.radius.toFixed(1) + ' 米');
            var circle = new DrawHelper.CirclePrimitive({
                center: event.center,
                radius: event.radius,
                material: Cesium.Material.fromType(Cesium.Material.RimLightingType)
            });
            scene.primitives.add(circle);
            circle.setEditable();
            circle.addListener('onEdited', function (event) {
                //loggingMessage('Circle edited: radius is ' + event.radius.toFixed(1) + ' meters');
                loggingMessage('圆形编辑完成: 半径为 ' + event.radius.toFixed(1) + ' 米');
            });
        });
        toolbar.addListener('extentCreated', function (event) {
            var extent = event.extent;
            //loggingMessage('Extent created (N: ' + extent.north.toFixed(3) + ', E: ' + extent.east.toFixed(3) + ', S: ' + extent.south.toFixed(3) + ', W: ' + extent.west.toFixed(3) + ')');
            loggingMessage('长方形创建完成 (N: ' + extent.north.toFixed(3) + ', E: ' + extent.east.toFixed(3) + ', S: ' + extent.south.toFixed(3) + ', W: ' + extent.west.toFixed(3) + ')');
            var extentPrimitive = new DrawHelper.ExtentPrimitive({
                extent: extent,
                material: Cesium.Material.fromType(Cesium.Material.StripeType)
            });
            scene.primitives.add(extentPrimitive);
            extentPrimitive.setEditable();
            extentPrimitive.addListener('onEdited', function (event) {
                //loggingMessage('Extent edited: extent is (N: ' + event.extent.north.toFixed(3) + ', E: ' + event.extent.east.toFixed(3) + ', S: ' + event.extent.south.toFixed(3) + ', W: ' + event.extent.west.toFixed(3) + ')');
                loggingMessage('长方形编辑完成: 范围为 (N: ' + event.extent.north.toFixed(3) + ', E: ' + event.extent.east.toFixed(3) + ', S: ' + event.extent.south.toFixed(3) + ', W: ' + event.extent.west.toFixed(3) + ')');

            });
        });

        function loggingMessage(message) {
            $('#logging').attr("style", "display:block");
            $('#logging').html(message);
            $('#logging').css("color", "black");
        }
    }


    return initial;
}();
