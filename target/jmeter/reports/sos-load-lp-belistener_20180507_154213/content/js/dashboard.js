/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.97, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-hip-hop"], "isController": false}, {"data": [0.8, 500, 1500, "https://qa.starofservice.com/"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-blues"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique-chretienne"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-country"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-swing"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-fanfare"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-chant-acapella"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/dj"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50, 0, 0.0, 419.46, 368, 749, 491.4, 506.34999999999997, 749.0, 1.7745599091425328, 44.74161159985449, 0.0], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-hip-hop", 5, 0, 0.0, 385.2, 369, 399, 399.0, 399.0, 399.0, 0.20580366330520683, 4.259372105885984, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/", 5, 0, 0.0, 537.8, 476, 749, 749.0, 749.0, 749.0, 0.20429009193054137, 5.174683988764045, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-blues", 5, 0, 0.0, 381.2, 373, 387, 387.0, 387.0, 387.0, 0.20673116679070536, 4.281394388799305, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique-chretienne", 5, 0, 0.0, 410.2, 377, 486, 486.0, 486.0, 486.0, 0.20660303293252347, 4.883619543097392, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-country", 5, 0, 0.0, 382.6, 372, 395, 395.0, 395.0, 395.0, 0.20662864699561947, 4.275639063662286, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique", 5, 0, 0.0, 447.6, 397, 484, 484.0, 484.0, 484.0, 0.20679956985689468, 7.347847216477789, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-swing", 5, 0, 0.0, 391.4, 372, 417, 417.0, 417.0, 417.0, 0.20662864699561947, 4.763153527667575, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-fanfare", 5, 0, 0.0, 387.2, 378, 397, 397.0, 397.0, 397.0, 0.20670552730580016, 4.757255041031047, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-chant-acapella", 5, 0, 0.0, 396.2, 368, 425, 425.0, 425.0, 425.0, 0.20727966171959206, 4.481815420052235, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/dj", 5, 0, 0.0, 475.2, 396, 505, 505.0, 505.0, 505.0, 0.2055667475229207, 7.779015104016774, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
