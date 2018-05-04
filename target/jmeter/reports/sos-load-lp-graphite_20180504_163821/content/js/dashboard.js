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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.96, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-hip-hop"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-blues"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique-chretienne"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-country"], "isController": false}, {"data": [0.8, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-swing"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-fanfare"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-chant-acapella"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/dj"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50, 0, 0.0, 358.20000000000005, 275, 1466, 420.5999999999999, 749.0999999999999, 1466.0, 1.812119454914468, 47.49257172595318, 0.0], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-hip-hop", 5, 0, 0.0, 288.2, 279, 302, 302.0, 302.0, 302.0, 0.21554511359227488, 4.75251716277967, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/", 5, 0, 0.0, 446.8, 363, 759, 759.0, 759.0, 759.0, 0.20522924106226656, 5.172418216147436, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-blues", 5, 0, 0.0, 360.8, 285, 557, 557.0, 557.0, 557.0, 0.21551724137931033, 4.751692147090518, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique-chretienne", 5, 0, 0.0, 288.6, 275, 295, 295.0, 295.0, 295.0, 0.21574042112530203, 5.437543485178633, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-country", 5, 0, 0.0, 288.4, 285, 292, 292.0, 292.0, 292.0, 0.21575904030378873, 4.758708911387762, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique", 5, 0, 0.0, 655.6, 352, 1466, 1466.0, 1466.0, 1466.0, 0.20555829633284, 7.323415787904949, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-swing", 5, 0, 0.0, 291.4, 282, 301, 301.0, 301.0, 301.0, 0.21599205149250508, 5.298976872651086, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-fanfare", 5, 0, 0.0, 297.2, 290, 301, 301.0, 301.0, 301.0, 0.21567527929948668, 5.278989453478842, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-chant-acapella", 5, 0, 0.0, 292.2, 283, 305, 305.0, 305.0, 305.0, 0.20931011386470194, 4.812292979215505, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/dj", 5, 0, 0.0, 372.8, 353, 425, 425.0, 425.0, 425.0, 0.21505376344086022, 8.149571572580646, 0.0], "isController": false}]}, function(index, item){
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
