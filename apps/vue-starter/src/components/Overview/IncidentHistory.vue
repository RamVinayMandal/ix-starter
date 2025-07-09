<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import incidentsData from "./Incidents.json";
import IncidentList from "./IncidentList.vue";
import {
  IxLayoutGrid,
  IxTypography,
  IxRow,
  IxCol,
  IxInputGroup,
  IxIcon,
  IxEventListItem,
  IxEventList,
  IxButton,
  IxIconButton,
} from "@siemens/ix-vue";
import { iconSearch, iconCardLayout, iconList } from "@siemens/ix-icons/icons";
import { showDemoModal } from "@/helpers/modal";

const { t } = useI18n();
const incidents = ref(incidentsData);
const searchTerm = ref("");

const filteredIncidents = computed(() => {
  if (!searchTerm.value) {
    return incidents.value;
  }

  return incidents.value.filter(
    (incident) =>
      incident.incidentName
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      incident.deviceName
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      incident.ipAddress.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});
</script>

<template>
  <section class="incidents">
    <IxTypography format="label" bold> Incidents </IxTypography>
    <div class="search-and-filter">
      <IxInputGroup>
        <input
          v-model="searchTerm"
          placeholder="Search"
          type="text"
          aria-label="Filter devices"
          class="ix-form-control"
        />
        <span slot="input-start">
          <IxIcon :name="iconSearch" color="color-primary" size="16"></IxIcon>
        </span>
      </IxInputGroup>

      <div class="btn-group">
        <IxButton :icon="iconCardLayout" :outline="true" @click=showDemoModal> Cards </IxButton>
        <IxButton :icon="iconList">List</IxButton>
      </div>
    </div>
    <!-- incidents="{incidents}" search="{searchTerm}" -->
    <IncidentList></IncidentList>
  </section>
</template>

<style scoped>
.search-and-filter {
  display: flex;
  gap: 1rem;
  margin-block-end: 0.75rem;

  ix-input-group {
    max-width: 12.5rem;
  }
}

.incidents {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  overflow: hidden;
}
</style>
