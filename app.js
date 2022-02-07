// IP Canada
// Amsterdam 185.180.223.193
// Japon 84.17.34.18

// Selecting HTML markups
const loader = document.querySelector(".loader");
const inputIP = document.querySelector("#input-ip");
const btnSubmit = document.querySelector("#btn-submit");
const ipAddress = document.querySelector("#ip-address");
const place = document.querySelector("#location");
const timezone = document.querySelector("#timezone");
const isp = document.querySelector("#isp");
const animatedPaths = document.querySelectorAll(".icon-loader path:not(:nth-child(4))");

// Variables for the map
let map;
let mainLayer;
let marker;

// Fixing CORS issues

const bypass_cors_url = "https://cors-anywhere.herokuapp.com/";
const header_options = {
    headers: {
        'Access-Control-Allow-Origin' : '*',
    }
}

// Variables for the IP API
let ip_url;
const apiKey = "at_REL4efjOZl4Z6ulxFE2IluZmnjuqY";

// Calling the map API
function callMap(lat, long) {

    const customMarker = L.icon({
        iconUrl: './images/icon-location-map.svg',
        iconSize:     [35, 45], // size of the icon
        iconAnchor:   [17.5, 45], // point of the icon which will correspond to marker's location
    });

    const zoomLevel = 13;

    if (map != undefined) {
        map.remove();
    }

    map = L.map('map').setView([lat, long], zoomLevel);

    mainLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoia2lsZWx4IiwiYSI6ImNrejZyNXZnNzBlanIycHM4a3M0aG44bzkifQ.zrXi78bPh6qTtEDnWBAbrQ'
    });

    marker = L.marker([lat, long], {icon: customMarker});

    mainLayer.addTo(map);
    marker.addTo(map);

    if(!loader.classList.contains("loader-invisible")) {
        loader.classList.add("loader-invisible");
        document.querySelector("body").style.overflowY = "visible";
        // document.querySelector("#map").style.display = "block";
        loader.innerHTML = "";
    }
}

// Calling the IP Locator API
getIPAdress = (default_ip) => {

    if(default_ip == undefined) {
        ip_url = `${bypass_cors_url}https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`;
    } else {
        ip_url = `${bypass_cors_url}https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${default_ip}`;
    }

    fetch(ip_url, header_options)
    .then((reponse) => {
        return reponse.json();
    })
    .then((data) => {
        console.log(data);
        callMap(data.location.lat, data.location.lng);
        updateInfos(data);
    })
    .catch((error) => {
        console.log(error);
        window.alert("Please enter a valid address IP or domain name");
    });
}

// Updating the infos
function updateInfos(data) {

    ipAddress.innerText = data.ip;
    place.innerText = data.location.city+ ", " + data.location.country +  " "  + data.location.postalCode;
    timezone.innerText = data.location.timezone;
    isp.innerText = data.isp;
}

// Checking the input
inputIP.addEventListener("input", () => {

    if(inputIP.value == "" || inputIP.value == undefined) {
        btnSubmit.setAttribute("disabled", true);
    } else {
        btnSubmit.removeAttribute("disabled");
    }
})

btnSubmit.addEventListener("click", (event) => {
    event.preventDefault();
    getIPAdress(inputIP.value);
})

// Launching function when page is loaded
getIPAdress();