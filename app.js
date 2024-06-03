// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

"use strict";

const searchParam = new URLSearchParams(location.search);
const LatLngToArrayString = (ll) => {
  return `[${ll.lat.toFixed(5)}, ${ll.lng.toFixed(5)}]`;
};

var map,
  lyrOSM,
  mrkCurrentLocation,
  popExample,
  ctlZoom,
  ctlAttribute,
  ctlScale,
  ctlPan,
  ctlZoomslider,
  ctlMeasure;

map = L.map(`mapdiv`, {
  center: [13.760063, 100.542583],
  zoom: 3,
  zoomControl: false,
  // dragging:false,
  // minZoom:10,
  // maxZoom:14
  attributionControl: false,
});
lyrOSM = L.tileLayer(`http://{s}.tile.osm.org/{z}/{x}/{y}.png`);
map.addLayer(lyrOSM);

let markers = L.markerClusterGroup();

var pusher = new Pusher(searchParam.get(`key`), {
  cluster: searchParam.get(`cluster`),
});

const defaultValues = {
  number: "#",
  char: "?",
  keyword: "KEYWORD",
};

var channel = pusher.subscribe("my-channel");

const removeBodyClass = () => {
  document.body.className = ``;
}

channel.bind("update-qrcode", function (data) {
  console.log(data)
  var qrcode = new QRCode(document.getElementById("qr"), {
    text: data.qrtext,
    width: 128,
    height: 128,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
  document.getElementById(`qralt`).innerText = data.qrtext;
  removeBodyClass();
})
channel.bind("update-answer", function (data) {
  const res = data
  markers.clearLayers();
  document.getElementById(`i1`).innerText = res.i1;
  document.getElementById(`i2`).innerText = res.i2;
  document.getElementById(`i3`).innerText = res.i3;
  document.getElementById(`i4`).innerText = res.i4;
  document.getElementById(`i5`).innerText = res.i5;
  document.getElementById(`i6`).innerText = res.i6;
  document.getElementById(`i7`).innerText = res.i7;
  document.getElementById(`i8`).innerText = res.i8;
  document.getElementById(`i9`).innerText = res.i9;
  document.getElementById(`i10`).innerText = res.i10;
  document.getElementById(`i11`).innerText = res.i11;
  document.getElementById(`dleft`).innerText = 
  (res.i1 === defaultValues.char ? 1 : 0)+
  (res.i2 === defaultValues.char ? 1 : 0)+
  (res.i3 === defaultValues.char ? 1 : 0)+
  (res.i4 === defaultValues.number ? 1 : 0)+
  (res.i5 === defaultValues.number ? 1 : 0)+
  (res.i6 === defaultValues.keyword ? 1 : 0)+
  (res.i7 === defaultValues.number ? 1 : 0)+
  (res.i8 === defaultValues.number ? 1 : 0)+
  (res.i9 === defaultValues.number ? 1 : 0)+
  (res.i10 === defaultValues.char ? 1 : 0)+
  (res.i11 === defaultValues.char ? 1 : 0)+
  0
  ;
  const portals = res.portals;
  console.log(portals);
  let c = 1
  for (const portal of portals) {
    markers.addLayer(
      L.marker(portal.geo)
        .bindPopup(`<h2>${c}) ${portal.geo}</h2>`)
        .bindTooltip(`${portal.geo}`)
    );
    c++
  }
  map.addLayer(markers);
  removeBodyClass();
});
