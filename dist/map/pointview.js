const map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.transform([32.73354709614068,39.86552815134803], 'EPSG:4326', 'EPSG:3857'),
      zoom: 18
    })
  });
  var markers=[];
  function httpGet(theUrl)
  {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
      xmlHttp.send( null );
      return xmlHttp.responseText;
  }
reg_json=JSON.parse(httpGet("/api/data"));
var stroke = new ol.style.Stroke({color: 'black', width: 2});
var fill = new ol.style.Fill({color: 'red'});
for (i=0;i<reg_json.length;i++)
{
    var feature=new ol.Feature({
        geometry: new ol.geom.Point(
        
          ol.proj.fromLonLat([parseFloat(reg_json[i].data.longitude),parseFloat(reg_json[i].data.latitude)]) )         
        ,
        attributes:
        {
            name:reg_json[i].data.name,
            height:reg_json[i].data.height
        }
      });
      feature.setStyle(new ol.style.Style({
        image: new ol.style.RegularShape({
          fill: fill,
          stroke: stroke,
          points: 3,
          radius: 10,
          rotation: Math.PI / 4,
          angle: 0
        })
      }));
    markers.push(feature);
}


var vectorSource = new ol.source.Vector({
    features: markers
  });
  var markerVectorLayer = new ol.layer.Vector({
    source: vectorSource
  });
  map.addLayer(markerVectorLayer);
 map.on("click",handleMapClick);
  function handleMapClick(evt){
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
    return feature;
    });
    if (feature) {
        var att = feature.getProperties();
        document.getElementById("name").innerText=att.attributes.name;
        document.getElementById("height").innerText=att.attributes.height;
    }

    
}

function submit(event)
{
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/post", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    var data=JSON.stringify({
        Name: document.getElementById('name').value,
        Latitude: document.getElementById('Latitude').value,
        Longitude: document.getElementById('Longitude').value,
        TreeHeight: document.getElementById('TreeHeight').value
    });
    console.log(data);
    xhr.send(data);
}