var map, bounds, baseData = {}, lastLineId, markers = [];
var styleBase = {
    'color': '#00ccff',
    'weight': 3,
    'opacity': 1
};
var styleHighlight = {
    'color': '#ffcc00',
    'weight': 10,
    'opacity': 1
};
$(function() {
    var nlscmaps = [
        new L.NLSC.PHOTO2(),
        new L.NLSC.B5000(),
        new L.NLSC.MB5000(),
        new L.NLSC.LANDSECT(),
        new L.NLSC.Village(),
        new L.NLSC.LUIMAP(),
    ];
    var overlayMaps = {};
    for (var i in nlscmaps) {
        overlayMaps[nlscmaps[i].name] = nlscmaps[i];
    }
    var baseMaps = {
        '通用版電子地圖': new L.NLSC.EMAP()
    };

    // set up the map
    map = new L.Map('map-canvas', {
        center: new L.LatLng(23.1508773, 120.2054415),
        zoom: 15,
        layers: [baseMaps['通用版電子地圖']]
    })
            .addControl(new L.Control.Scale())
            .addControl(new L.Control.Layers(baseMaps, overlayMaps));


    $.getJSON('gt.json', function(r) {
      var arrayOfLatLngs = [];
      for(k in r) {
        var layerData = {
          points: [],
          data: r[k]
        };
        if(r[k].points.length > 1) {
          //draw a line
          var options = styleBase;
          options.id = r[k].trackname;
          var line = new L.polyline([], options);
          for(i in r[k].points) {
            r[k].points[i].x = parseFloat(r[k].points[i].x);
            r[k].points[i].y = parseFloat(r[k].points[i].y);
            if(r[k].points[i].x < 23.427753 && r[k].points[i].x > 22.874693 && r[k].points[i].y < 120.669614 && r[k].points[i].y > 120.021420) {
              var p = L.latLng(parseFloat(r[k].points[i].x), parseFloat(r[k].points[i].y));
              if(p) {
                arrayOfLatLngs.push(p);
                line.addLatLng(p);
                layerData.points.push({
                  latlng: p,
                  data: r[k].points[i]
                });
              }
            }
          }
          line.on('click', lineClicked);
          line.addTo(map);
          baseData[line._leaflet_id] = layerData;
        } else {
          //place a point
        }
      }
      bounds = new L.LatLngBounds(arrayOfLatLngs);
      map.fitBounds(bounds);
    });
})

function lineClicked() {
  if(map._layers[lastLineId]) {
    map._layers[lastLineId].setStyle(styleBase);
  }
  for(k in markers) {
    map.removeLayer(map._layers[markers[k]]);
  }
  markers = [];
  lastLineId = this._leaflet_id;
  bounds = new L.LatLngBounds(this.getLatLngs());
  var content = '<table class="table table-boarded">';
  for(k in baseData[lastLineId].data) {
    if(typeof(baseData[lastLineId].data[k]) === 'string') {
      content += '<tr><th>' + k + '</th><td>' + baseData[lastLineId].data[k] + '</td></tr>';
    }
  }
  content += '</table>';
  $('#pointContent').html(content);
  for(k in baseData[lastLineId].points) {
    var l = new L.marker(baseData[lastLineId].points[k].latlng).addTo(map);
    markers.push(l._leaflet_id);
  }
  map.fitBounds(bounds);
  map._layers[lastLineId].setStyle(styleHighlight).bringToFront();
}
