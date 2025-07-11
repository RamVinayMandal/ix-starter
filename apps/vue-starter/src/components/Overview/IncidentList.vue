<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { showDemoModal } from "@/helpers/modal";
import type { Incident } from "./incident";
import {
  IxLayoutGrid,
  IxTypography,
  IxRow,
  IxCol,
  IxIcon,
  IxEventListItem,
  IxEventList,
  IxButton,
  IxIconButton,
} from "@siemens/ix-vue";
import { addIcons } from '@siemens/ix-icons';
import { 
  iconCloudUpload,
  iconMaintenanceWarning,
  iconInfo,
  iconError,
  iconOpenExternal
} from '@siemens/ix-icons/icons';

addIcons({ 
  'cloud-upload': iconCloudUpload,
  'maintenance-warning': iconMaintenanceWarning,
  'info': iconInfo,
  'error': iconError
});

const { t } = useI18n();

interface Props {
  incidents: Incident[];
  search: string;
}

const props = defineProps<Props>();

const searchFilter = (incident: Incident): boolean => {
  if (!props.search) return true;
  
  const query = props.search.toLowerCase();
  return Object.values(incident).some(
    (value) => typeof value === "string" && value.toLowerCase().includes(query)
  );
};

const filteredIncidents = computed(() => props.incidents.filter(searchFilter));
</script>

<template>
  <section class="incident-list">
    <IxLayoutGrid :no-margin="true">
      <IxRow class="eventlist-headeroffset">
        <IxCol size="3" sizeSm="6">
          <IxRow style="gap: 1rem">
            <IxTypography format="label" bold text-color="soft">
              Type
            </IxTypography>
            <IxTypography format="label" bold text-color="soft">
              Incident name
            </IxTypography>
          </IxRow>
        </IxCol>
        <IxCol size="3" sizeSm="4">
          <IxTypography
            format="label"
            bold
            text-color="soft"
            class="titleoffset-device"
          >
            Device
          </IxTypography>
        </IxCol>
        <IxCol size="3" class="desktop">
          <IxTypography
            format="label"
            bold
            text-color="soft"
            class="titleOffset-date"
          >
            Date
          </IxTypography>
        </IxCol>
      </IxRow>
    </IxLayoutGrid>
    <IxEventList :itemHeight="72" :animated="false" class="event-list">
      <IxEventListItem
        v-for="incident in filteredIncidents"
        :key="incident.id"
        :itemColor="'color-' + incident.color"
      >
        <IxLayoutGrid noMargin>
          <IxRow>
            <IxCol size="3">
              <IxRow style="gap: 1rem">
                <IxIcon :name="incident.icon" size="24" />
                <IxTypography bold>{{ incident.incidentName }}</IxTypography>
              </IxRow>
              <IxRow>
                <IxTypography class="info-text" textColor="soft">{{
                  incident.infoText
                }}</IxTypography>
              </IxRow>
            </IxCol>
            <IxCol siz e="3">
              <IxTypography bold>{{ incident.deviceName }}</IxTypography>
              <IxTypography textColor="soft">{{
                incident.ipAddress
              }}</IxTypography>
            </IxCol>
            <IxCol>
              <IxTypography textColor="soft">{{ incident.date }}</IxTypography>
              <IxTypography textColor="soft">{{ incident.time }}</IxTypography>
            </IxCol>
            <IxCol className="incident-actions">
              <IxIconButton variant="secondary" ghost :icon="iconOpenExternal"/>
              <IxButton outline color="primary" @click="showDemoModal">{{t("incidents.create-task")}}</IxButton>
            </IxCol>
          </IxRow>
        </IxLayoutGrid>
      </IxEventListItem>
    </IxEventList>
  </section>
</template>

<style scoped>
.incident-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.event-list {
  overflow: auto;
  height: 100%;
  position: relative;
}

.eventlist-headeroffset {
  padding-left: 1.125rem;
}

.incident-actions {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
}

.info-text {
  padding-left: 2.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
