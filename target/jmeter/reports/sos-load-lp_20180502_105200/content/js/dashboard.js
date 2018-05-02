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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.75, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/service-de-sommellerie"], "isController": false}, {"data": [0.7, 500, 1500, "https://qa.starofservice.com/"], "isController": false}, {"data": [0.8, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-jazz"], "isController": false}, {"data": [0.8, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-latino"], "isController": false}, {"data": [0.8, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/conseil-en-musique-de-fete"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-fanfare"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-chant-acapella"], "isController": false}, {"data": [0.5, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/service-de-buffet-de-bonbons"], "isController": false}, {"data": [0.4, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/service-de-patisserie"], "isController": false}, {"data": [0.8, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-reggae"], "isController": false}, {"data": [0.7, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique-de-mariage"], "isController": false}, {"data": [0.4, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/bartending"], "isController": false}, {"data": [0.8, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/dj"], "isController": false}, {"data": [0.7, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/karaoke"], "isController": false}, {"data": [0.6, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-chant-solo"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-hip-hop"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-mariachis"], "isController": false}, {"data": [0.7, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-r-b"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-blues"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique-chretienne"], "isController": false}, {"data": [0.7, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-duo-musical"], "isController": false}, {"data": [0.8, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-pop"], "isController": false}, {"data": [0.8, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-quintette"], "isController": false}, {"data": [0.2, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/service-d-un-chef-personnel"], "isController": false}, {"data": [0.8, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-rock"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-country"], "isController": false}, {"data": [0.8, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-quatuor-a-cordes"], "isController": false}, {"data": [0.4, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/gateau-de-mariage-personnalise"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-swing"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 150, 0, 0.0, 728.0200000000003, 366, 2861, 1746.1000000000004, 2195.099999999998, 2819.6900000000005, 4.089310542242578, 104.15098565163164, 0.0], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/service-de-sommellerie", 5, 0, 0.0, 653.6, 400, 1095, 1095.0, 1095.0, 1095.0, 0.778089013383131, 20.015580016728915, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/", 5, 0, 0.0, 585.4, 481, 897, 897.0, 897.0, 897.0, 0.20425670983291802, 5.147907390007762, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-jazz", 5, 0, 0.0, 663.8, 394, 1680, 1680.0, 1680.0, 1680.0, 0.2525507627033034, 7.293636431078897, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-latino", 5, 0, 0.0, 545.6, 372, 901, 901.0, 901.0, 901.0, 0.2722273642946589, 6.001496825148363, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/conseil-en-musique-de-fete", 5, 0, 0.0, 652.8, 370, 957, 957.0, 957.0, 957.0, 0.2810883741848437, 6.4252300532662465, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-fanfare", 5, 0, 0.0, 500.6, 386, 902, 902.0, 902.0, 902.0, 0.2087334056942473, 5.1090762503131, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-chant-acapella", 5, 0, 0.0, 391.2, 371, 411, 411.0, 411.0, 411.0, 0.208672426025625, 4.7976317635950085, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/service-de-buffet-de-bonbons", 5, 0, 0.0, 1160.2, 368, 2124, 2124.0, 2124.0, 2124.0, 0.4429482636428065, 11.019462731440468, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/service-de-patisserie", 5, 0, 0.0, 1550.0, 379, 2780, 2780.0, 2780.0, 2780.0, 0.5976571838393497, 17.918275983146067, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-reggae", 5, 0, 0.0, 631.0, 390, 945, 945.0, 945.0, 945.0, 0.3014045451805413, 6.648560416541082, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique-de-mariage", 5, 0, 0.0, 849.0, 371, 1270, 1270.0, 1270.0, 1270.0, 0.3696037847427558, 12.921839194633353, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/bartending", 5, 0, 0.0, 1593.4, 374, 2861, 2861.0, 2861.0, 2861.0, 0.385178337570295, 12.298097339380634, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/dj", 5, 0, 0.0, 861.8, 391, 2546, 2546.0, 2546.0, 2546.0, 0.22496175650139477, 8.525040001012329, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/karaoke", 5, 0, 0.0, 521.8, 393, 662, 662.0, 662.0, 662.0, 0.2684275514038761, 5.919037217480002, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-chant-solo", 5, 0, 0.0, 944.4, 374, 1814, 1814.0, 1814.0, 1814.0, 0.3206361421059382, 8.361025775137874, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-hip-hop", 5, 0, 0.0, 466.4, 391, 723, 723.0, 723.0, 723.0, 0.24905359633393107, 5.491339939479976, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-mariachis", 5, 0, 0.0, 439.0, 368, 680, 680.0, 680.0, 680.0, 0.27587728978150516, 6.085465060141249, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-r-b", 5, 0, 0.0, 571.6, 453, 750, 750.0, 750.0, 750.0, 0.29761904761904767, 6.560698009672619, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-blues", 5, 0, 0.0, 393.2, 378, 401, 401.0, 401.0, 401.0, 0.20870726718704347, 4.601546846954961, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique-chretienne", 5, 0, 0.0, 604.0, 392, 1436, 1436.0, 1436.0, 1436.0, 0.21315598755169032, 5.372405158907789, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-duo-musical", 5, 0, 0.0, 553.6, 372, 700, 700.0, 700.0, 700.0, 0.27796308650211254, 6.370892226762286, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-pop", 5, 0, 0.0, 496.0, 366, 690, 690.0, 690.0, 690.0, 0.2907483863464558, 6.408389726405769, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-quintette", 5, 0, 0.0, 520.0, 407, 702, 702.0, 702.0, 702.0, 0.29449876310519496, 6.49133943559312, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/service-d-un-chef-personnel", 5, 0, 0.0, 1755.0, 398, 2282, 2282.0, 2282.0, 2282.0, 0.8726003490401396, 24.09246155104712, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-rock", 5, 0, 0.0, 625.6, 376, 949, 949.0, 949.0, 949.0, 0.3098661378284581, 6.831882611087011, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-country", 5, 0, 0.0, 469.8, 381, 670, 670.0, 670.0, 670.0, 0.22294555669505506, 4.917212302693183, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-quatuor-a-cordes", 5, 0, 0.0, 654.8, 371, 1090, 1090.0, 1090.0, 1090.0, 0.3514691410094194, 7.763555176261773, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/gateau-de-mariage-personnalise", 5, 0, 0.0, 1406.0, 391, 2316, 2316.0, 2316.0, 2316.0, 0.5233410090014653, 14.494092788360895, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique", 5, 0, 0.0, 389.4, 372, 409, 409.0, 409.0, 409.0, 0.2086985558059938, 7.435293664955339, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-swing", 5, 0, 0.0, 391.6, 376, 421, 421.0, 421.0, 421.0, 0.20879442101307052, 5.122395942080428, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 150, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
