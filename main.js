var map;
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
      for(k in r) {
        if(r[k].points.length > 1) {
          //draw a line
          var line = new L.polyline([]);
          for(i in r[k].points) {
            r[k].points[i].x = parseFloat(r[k].points[i].x);
            r[k].points[i].y = parseFloat(r[k].points[i].y);
            if(r[k].points[i].x < 23.427753 && r[k].points[i].x > 22.874693 && r[k].points[i].y < 120.669614 && r[k].points[i].y > 120.021420) {
              var p = L.latLng(parseFloat(r[k].points[i].x), parseFloat(r[k].points[i].y));
              if(p) {
                line.addLatLng(p);
              }
            }
          }
          line.addTo(map);
        } else {
          //place a point
        }
      }
    });
})
