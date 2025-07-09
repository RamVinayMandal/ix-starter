<script setup lang="ts">
import { IxContentHeader } from "@siemens/ix-vue";
import DeviceRange from "../components/Overview/DeviceRange.vue";
import StatusHistory from "../components/Overview/StatusHistory.vue";
import IncidentHistory from "../components/Overview/IncidentHistory.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <IxContentHeader
    slot="header"
    :headerTitle="t('content-header')"
  ></IxContentHeader>
  <section class="list">
    <div class="card-container">
      <DeviceRange></DeviceRange>
      <StatusHistory></StatusHistory>
    </div>
    <IncidentHistory />
  </section>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow: hidden;
  height: 100%;
}

.list.h-100 {
  height: 100%;
}

.card-container {
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

ix-card {
  width: 100%;
  flex: 1;
}

ix-card + ix-card {
  flex: 2;
}
</style>
