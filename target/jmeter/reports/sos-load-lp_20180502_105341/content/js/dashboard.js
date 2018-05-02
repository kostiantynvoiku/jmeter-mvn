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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.926, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/service-de-sommellerie"], "isController": false}, {"data": [0.8, 500, 1500, "https://qa.starofservice.com/"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/conseil-en-musique-de-fete"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-fanfare"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-chant-acapella"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-d-animaux"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/service-de-buffet-de-bonbons"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique-de-mariage"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/bartending"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/dj"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-chant-solo"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-hip-hop"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-r-b"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-blues"], "isController": false}, {"data": [0.8, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-show-laser"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-pop"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-rock"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/soufflage-de-bulles"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-quatuor-a-cordes"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/gateau-de-mariage-personnalise"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-free-run-et-parkour"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-swing"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-jazz"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-latino"], "isController": false}, {"data": [0.6, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/location-de-taureau-mecanique"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/service-de-patisserie"], "isController": false}, {"data": [0.8, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-reggae"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-clown"], "isController": false}, {"data": [0.7, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/tatouage-au-henne"], "isController": false}, {"data": [0.7, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/magicien"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/karaoke"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/caricature"], "isController": false}, {"data": [0.6, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/animation-et-reception"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-mariachis"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-personnages-costumes"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique-chretienne"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-duo-musical"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-comedie"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-quintette"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-feu-d-artifice"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/danse-du-ventre"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-cirque"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/service-d-un-chef-personnel"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/body-painting"], "isController": false}, {"data": [0.9, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/lacher-de-colombes"], "isController": false}, {"data": [0.8, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-danse"], "isController": false}, {"data": [0.8, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/mime"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-country"], "isController": false}, {"data": [1.0, 500, 1500, "https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 250, 0, 0.0, 511.79199999999975, 365, 4512, 838.6000000000001, 1211.45, 3176.860000000022, 3.701565021691171, 93.17285950062185, 0.0], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/service-de-sommellerie", 5, 0, 0.0, 396.8, 374, 433, 433.0, 433.0, 433.0, 0.10455438919325834, 2.689518716542595, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/", 5, 0, 0.0, 577.2, 477, 935, 935.0, 935.0, 935.0, 0.10314595152140278, 2.5996003094378546, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/conseil-en-musique-de-fete", 5, 0, 0.0, 379.0, 369, 393, 393.0, 393.0, 393.0, 0.10445391493273168, 2.3876492058891117, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-fanfare", 5, 0, 0.0, 407.6, 384, 436, 436.0, 436.0, 436.0, 0.10465286644201184, 2.5615424262720556, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-chant-acapella", 5, 0, 0.0, 402.0, 371, 439, 439.0, 439.0, 439.0, 0.10436016781114985, 2.3993666316190434, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-d-animaux", 5, 0, 0.0, 489.6, 390, 842, 842.0, 842.0, 842.0, 0.10458500669344042, 2.3345742998033803, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/service-de-buffet-de-bonbons", 5, 0, 0.0, 382.6, 367, 410, 410.0, 410.0, 410.0, 0.10459813396928998, 2.601980729101293, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique-de-mariage", 5, 0, 0.0, 394.2, 383, 408, 408.0, 408.0, 408.0, 0.10456313522104647, 3.6556252352670544, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/bartending", 5, 0, 0.0, 397.6, 383, 435, 435.0, 435.0, 435.0, 0.1045609485769255, 3.3381899715594217, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/dj", 5, 0, 0.0, 420.4, 384, 478, 478.0, 478.0, 478.0, 0.10439939030756061, 3.9562679110203995, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-chant-solo", 5, 0, 0.0, 404.0, 377, 431, 431.0, 431.0, 431.0, 0.10455876202425762, 2.726900682245922, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-hip-hop", 5, 0, 0.0, 401.4, 380, 435, 435.0, 435.0, 435.0, 0.10441029067824925, 2.3021245536460073, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-r-b", 5, 0, 0.0, 381.2, 370, 391, 391.0, 391.0, 391.0, 0.10451286553374721, 2.3038758922785894, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-blues", 5, 0, 0.0, 395.6, 372, 420, 420.0, 420.0, 420.0, 0.10472520107238606, 2.308965688096934, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-show-laser", 5, 0, 0.0, 702.6, 383, 1413, 1413.0, 1413.0, 1413.0, 0.13912849908175193, 3.5023969231732424, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-pop", 5, 0, 0.0, 379.4, 367, 399, 399.0, 399.0, 399.0, 0.10448447360722196, 2.3029439153466793, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-rock", 5, 0, 0.0, 380.8, 376, 384, 384.0, 384.0, 384.0, 0.10456313522104647, 2.305392484263248, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/soufflage-de-bulles", 5, 0, 0.0, 466.6, 369, 779, 779.0, 779.0, 779.0, 0.10887079214388365, 2.3898414705177893, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-quatuor-a-cordes", 5, 0, 0.0, 380.2, 377, 387, 387.0, 387.0, 387.0, 0.104574069813649, 2.309922739370046, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/gateau-de-mariage-personnalise", 5, 0, 0.0, 391.2, 378, 413, 413.0, 413.0, 413.0, 0.10457625700660922, 2.896067867376391, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-free-run-et-parkour", 5, 0, 0.0, 508.2, 376, 993, 993.0, 993.0, 993.0, 0.13107190604765773, 2.9345258965318375, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-swing", 5, 0, 0.0, 388.2, 366, 401, 401.0, 401.0, 401.0, 0.10476908892800268, 2.5703213398918785, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-jazz", 5, 0, 0.0, 397.4, 387, 407, 407.0, 407.0, 407.0, 0.10440593025683859, 3.0152310307475463, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-latino", 5, 0, 0.0, 401.8, 377, 446, 446.0, 446.0, 446.0, 0.10445827936322233, 2.3028766177976014, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/location-de-taureau-mecanique", 5, 0, 0.0, 860.6, 371, 1634, 1634.0, 1634.0, 1634.0, 0.168554476806904, 3.848276477801375, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/service-de-patisserie", 5, 0, 0.0, 400.0, 384, 415, 415.0, 415.0, 415.0, 0.10453253052349892, 3.1334238519714837, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle", 5, 0, 0.0, 609.6, 378, 1503, 1503.0, 1503.0, 1503.0, 0.12481901243197363, 3.7918650768885116, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-reggae", 5, 0, 0.0, 410.0, 372, 517, 517.0, 517.0, 517.0, 0.10455001672800267, 2.3062263455587155, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-clown", 5, 0, 0.0, 559.8, 368, 1204, 1204.0, 1204.0, 1204.0, 0.11368804001819008, 2.8485293386198274, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/tatouage-au-henne", 5, 0, 0.0, 854.6, 378, 1994, 1994.0, 1994.0, 1994.0, 0.1332161031625503, 3.8632669917139584, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/magicien", 5, 0, 0.0, 843.6, 373, 1612, 1612.0, 1612.0, 1612.0, 0.14320082483675106, 3.8546193901076875, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/karaoke", 5, 0, 0.0, 386.8, 373, 405, 405.0, 405.0, 405.0, 0.10444300545192488, 2.303049866312953, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/caricature", 5, 0, 0.0, 532.6, 370, 1097, 1097.0, 1097.0, 1097.0, 0.10985148079796116, 2.477343990300114, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/animation-et-reception", 5, 0, 0.0, 2020.0, 387, 4512, 4512.0, 4512.0, 4512.0, 0.1481218153809693, 4.45453215724612, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-mariachis", 5, 0, 0.0, 378.4, 376, 381, 381.0, 381.0, 381.0, 0.10448010698762956, 2.3046842349966568, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-personnages-costumes", 5, 0, 0.0, 510.4, 373, 890, 890.0, 890.0, 890.0, 0.11810558639423645, 2.6776750915318295, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique-chretienne", 5, 0, 0.0, 404.6, 369, 478, 478.0, 478.0, 478.0, 0.10460907588342365, 2.636577772925079, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-duo-musical", 5, 0, 0.0, 399.8, 385, 424, 424.0, 424.0, 424.0, 0.10443646085721446, 2.3936755237488514, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-comedie", 5, 0, 0.0, 556.8, 376, 1211, 1211.0, 1211.0, 1211.0, 0.11581312394320524, 2.8754227179023926, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-quintette", 5, 0, 0.0, 390.8, 373, 416, 416.0, 416.0, 416.0, 0.10449102422101941, 2.3031903395435833, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-feu-d-artifice", 5, 0, 0.0, 541.2, 370, 1169, 1169.0, 1169.0, 1169.0, 0.12844885166726608, 3.0016138394004006, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/danse-du-ventre", 5, 0, 0.0, 489.6, 381, 867, 867.0, 867.0, 867.0, 0.10559885108450019, 2.352771276848508, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-cirque", 5, 0, 0.0, 554.0, 371, 1212, 1212.0, 1212.0, 1212.0, 0.1115996696649778, 2.798165545554985, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/service-d-un-chef-personnel", 5, 0, 0.0, 394.4, 368, 413, 413.0, 413.0, 413.0, 0.10456532195662631, 2.8873916441851226, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/body-painting", 5, 0, 0.0, 603.2, 399, 1369, 1369.0, 1369.0, 1369.0, 0.1066507401561367, 2.4435934233821084, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/lacher-de-colombes", 5, 0, 0.0, 470.0, 368, 808, 808.0, 808.0, 808.0, 0.12352083796536475, 2.7162521770547694, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-danse", 5, 0, 0.0, 683.0, 376, 1742, 1742.0, 1742.0, 1742.0, 0.11955430156377027, 3.565730394588972, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/mime", 5, 0, 0.0, 690.4, 365, 1206, 1206.0, 1206.0, 1206.0, 0.17556179775280897, 4.020262300298455, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-country", 5, 0, 0.0, 401.4, 380, 438, 438.0, 438.0, 438.0, 0.10453908716469087, 2.3056789879048276, 0.0], "isController": false}, {"data": ["https://qa.starofservice.com/annubis/ile-de-france/paris/paris-01/spectacle-de-musique", 5, 0, 0.0, 418.4, 376, 496, 496.0, 496.0, 496.0, 0.10448447360722196, 3.7224634434947967, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 250, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
