<template>
  <v-sheet class="d-flex align-center">
    <v-text-field
      hide-details
      id="location"
      label="Location"
      v-model="location"
      type="input"
    ></v-text-field>
    <v-btn variant="plain" @click="() => findPlace(location)">search</v-btn>
  </v-sheet>
  <v-sheet class="pa-2">
    <v-sheet> Time Zone: {{ timezone }}</v-sheet>
    <v-sheet> Local Time: {{ localTime }}</v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref } from "vue";
import getTimeZone from "@/api/timezone";
const emit = defineEmits(["addLocations"]);
const location = ref("");
const timezone = ref("");
const localTime = ref("");

var google = null;
var map = null;
const fields = ["formatted_address", "geometry", "name"];

const updateTimeZone = async (location) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const res = await getTimeZone(location.toUrlValue(), timestamp);

  const localtime = new Date(
    timestamp * 1000 + res.rawOffset * 1000 + res.dstOffset * 1000
  );

  timezone.value = res.timeZoneName;
  localTime.value = localtime.toUTCString();
};

const initSearch = (m_google, m_map) => {
  const input = document.getElementById("location");
  google = m_google;
  map = m_map;
  const options = {
    fields,
    strictBounds: false,
  };

  var autocomplete = new google.maps.places.Autocomplete(input, options);

  autocomplete.addListener("place_changed", () => {
    var place = autocomplete.getPlace();
    location.value = place.name;

    if (!place.geometry) {
      //try to find using place api
      findPlace(place.name);
    } else {
      emit("addLocations", place);
      updateTimeZone(place.geometry.location);
    }
  });
};

const findPlace = (place) => {
  const request = {
    fields,
    query: place,
  };

  var service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      //return first only
      emit("addLocations", results[0]);
      //display timezone
      updateTimeZone(results[0].geometry.location);
    } else {
      //result not found
      console.log("result not found");
    }
  });
};

defineExpose({ initSearch });
</script>
