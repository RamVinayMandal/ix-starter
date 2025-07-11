<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { IxIcon, IxTypography } from "@siemens/ix-vue";
import { 
  iconSuccess, 
  iconInfo, 
  iconMaintenanceWarning, 
  iconError 
} from '@siemens/ix-icons/icons';



const { t } = useI18n();
const props = defineProps<{ params: any }>();

const statusValue = computed(() => props.params.value);

const iconConfig = computed(() => {
  switch (statusValue.value) {
    case "Online":
      return { name: iconSuccess, color: "color-success" };
    case "Offline":
      return { name: iconInfo };
    case "Maintenance":
      return { name: iconMaintenanceWarning, color: "color-warning" };
    default:
      return { name: iconError, color: "color-alarm" };
  }
});

// Translate the status value
const translatedStatus = computed(() => t(`device-status.${statusValue.value.toLowerCase()}`, statusValue.value));
</script>

<template>
  <div style="display: flex; align-items: center; gap: 0.5rem; height: 100%;">
    <IxIcon :name="iconConfig.name" :color="iconConfig.color" />
    <IxTypography>{{ translatedStatus }}</IxTypography>
  </div>
</template>