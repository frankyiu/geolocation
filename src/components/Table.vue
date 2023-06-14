<template>
  <v-sheet class="pr-2 text-right">
    <v-btn @click="handleDelete" class="mb-2" color="red"> Delete </v-btn>
  </v-sheet>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="props.locations"
    items-per-page="10"
    item-value="id"
    show-select
    class="elevation-1"
  ></v-data-table>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps(["locations"]);
const emit = defineEmits(["deleteLocations"]);

const selected = ref([]);
const headers = ref([{ title: "Name", key: "name" }]);

function handleDelete() {
  emit("deleteLocations", selected.value);
}
</script>
