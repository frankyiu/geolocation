<template>
  <v-row no-gutters class="h-100">
    <v-col>
      <!-- MAP -->
      <div id="map" class="map w-100 h-100"></div>
    </v-col>
    <v-col cols="4" class="d-flex flex-column ml-2">
      <!-- LOCATE MYSELF -->
      <v-btn :loading="loading" @click="findMyself" class="mb-2">
        Find Myself
      </v-btn>
      <!-- SEARCH -->
      <Search ref="searchRef" @addLocations="addLocations" />

      <!-- TABLE -->
      <Table :locations="locations" @deleteLocations="deleteLocations" />
    </v-col>
  </v-row>
</template>

<script setup>
import { Loader } from "@googlemaps/js-api-loader";
import Table from "./Table.vue";
import Search from "./Search.vue";
import { ref, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";
//toronto
const defaultLocation = { lat: 43.7901576, lng: -79.4101117 };

const loader = new Loader({
  apiKey: import.meta.env.VITE_API_KEY,
  version: "weekly",
  libraries: ["places"],
});

const loading = ref(false);
const locations = ref([]);

const searchRef = ref();

var google = null;
var map = null;
var markers = [];

function findMyself() {
  loading.value = true;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMarker({ location });
        loading.value = false;
      },
      (error) => {
        console.log(error.message);
      }
    );
  }
}

function setMarker(geometry) {
  var marker = new google.maps.Marker({
    map: map,
    position: geometry.location,
  });
  if (geometry.viewport) map.fitBounds(geometry.viewport);
  map.setCenter(geometry.location);
  return marker;
}

function addLocations(place) {
  //update marker on map
  const marker = setMarker(place.geometry);

  const id = uuidv4();
  locations.value = [
    ...locations.value,
    {
      id,
      name: place.name,
    },
  ];
  markers.push({ id, marker });
}

const deleteLocations = (placesIds) => {
  markers
    .filter((ele) => placesIds.includes(ele.id))
    .forEach((ele) => ele.marker.setMap(null));

  markers = markers.filter((ele) => !placesIds.includes(ele.id));

  locations.value = locations.value.filter(
    (location) => !placesIds.includes(location.id)
  );
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 10,
  });
}

onMounted(() => {
  loader
    .load()
    .then((res) => {
      google = res;
      initMap();
      searchRef.value.initSearch(google, map);
    })
    .catch((e) => {
      console.log(e.message);
    });
});
</script>
