<script setup lang="ts">
import { IxContentHeader } from "@siemens/ix-vue";
import DeviceRange from "../components/Overview/DeviceRange.vue";
import StatusHistory from "../components/Overview/StatusHistory.vue";
import IncidentHistory from "../components/Overview/IncidentHistory.vue";
import { useI18n } from "vue-i18n";
import { useIsMobileViewPort } from "@/composables/useMediaQuery";

const { t } = useI18n();
const isMobile = useIsMobileViewPort();
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
}

.card-container {
  display: flex;
  gap: 1rem;
  flex-direction: column;
}

ix-card {
  width: 100%;
  min-height: 25rem;
}
</style>
