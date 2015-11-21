/**
 * Created by chet on 15/8/5.
 */
function jqwidgetsDatable() {
    var data = new Array();
    var firstNames =
        [
            "Andrew", "Nancy", "Shelley", "Regina", "Yoshi", "Antoni", "Mayumi", "Ian", "Peter", "Lars", "Petra", "Martin", "Sven", "Elio", "Beate", "Cheryl", "Michael", "Guylene"
        ];
    var lastNames =
        [
            "Fuller", "Davolio", "Burke", "Murphy", "Nagase", "Saavedra", "Ohno", "Devling", "Wilson", "Peterson", "Winkler", "Bein", "Petersen", "Rossi", "Vileid", "Saylor", "Bjorn", "Nodier"
        ];
    var productNames =
        [
            "Black Tea", "Green Tea", "Caffe Espresso", "Doubleshot Espresso", "Caffe Latte", "White Chocolate Mocha", "Cramel Latte", "Caffe Americano", "Cappuccino", "Espresso Truffle", "Espresso con Panna", "Peppermint Mocha Twist"
        ];
    var priceValues =
        [
            "2.25", "1.5", "3.0", "3.3", "4.5", "3.6", "3.8", "2.5", "5.0", "1.75", "3.25", "4.0"
        ];
    for (var i = 0; i < 200; i++) {
        var row = {};
        var productindex = Math.floor(Math.random() * productNames.length);
        var price = parseFloat(priceValues[productindex]);
        var quantity = 1 + Math.round(Math.random() * 10);
        row["firstname"] = firstNames[Math.floor(Math.random() * firstNames.length)];
        row["lastname"] = lastNames[Math.floor(Math.random() * lastNames.length)];
        row["productname"] = productNames[productindex];
        row["price"] = price;
        row["quantity"] = quantity;
        row["total"] = price * quantity;
        data[i] = row;
    }
    var source =
    {
        localData: data,
        dataType: "array",
        dataFields: [
            {name: 'firstname', type: 'string'},
            {name: 'lastname', type: 'string'},
            {name: 'productname', type: 'string'},
            {name: 'quantity', type: 'number'},
            {name: 'price', type: 'number'},
            {name: 'total', type: 'number'}
        ]
    };
    var dataAdapter = new $.jqx.dataAdapter(source);

    $("#crossSatsTable").jqxDataTable(
        {
            width: 850,
            pageable: true,
            pagerButtonsCount: 10,
            source: dataAdapter,
            columnsResize: true,
            columns: [
                {text: 'Name', dataField: 'firstname', width: 200},
                {text: 'Last Name', dataField: 'lastname', width: 200},
                {text: 'Product', editable: false, dataField: 'productname', width: 180},
                {text: 'Quantity', dataField: 'quantity', width: 80, cellsAlign: 'right', align: 'right'},
                {
                    text: 'Unit Price',
                    dataField: 'price',
                    width: 90,
                    cellsAlign: 'right',
                    align: 'right',
                    cellsFormat: 'c2'
                },
                {text: 'Total', dataField: 'total', cellsAlign: 'right', align: 'right', cellsFormat: 'c2'}
            ]
        });
}


//经纬度转Web墨卡托
function lonLat2WebMercator(lonLat) {
    var x = lonLat.lon;
    var y = lonLat.lat;

    var xEnd = (x / 180.0) * 20037508.34;

    if (y > 85.05112) {
        y = 85.05112;
    }

    if (y < -85.05112) {
        y = -85.05112;
    }

    y = (Math.PI / 180.0) * y;
    var tmp = Math.PI / 4.0 + y / 2.0;
    var yEnd = 20037508.34 * Math.log(Math.tan(tmp)) / Math.PI;

    return {
        'x': xEnd,
        'y': yEnd
    }
}
//Web墨卡托转经纬度
function WebMercator2lonLat(mercator) {
    var x = mercator.x;
    var y = mercator.y;

    var lon = x / 20037508.34 * 180;
    var mmy = y / 20037508.34 * 180;
    var lat = 180 / Math.PI * (2 * Math.atan(Math.exp(mmy * Math.PI / 180)) - Math.PI / 2);

    return{
        'lon':lon,
        'lat':lat
    }
}


