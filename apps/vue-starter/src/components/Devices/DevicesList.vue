<script setup lang="ts">
import { ref, computed, reactive, onMounted, watchEffect } from "vue";
import DataTableInstance from "./DataTable.vue";
import AddDevicesModal from "./AddDevicesModal.vue";
import { showModal } from "@/helpers/modal";
import {
  IxPane,
  IxTypography,
  IxButton,
  IxChip,
  IxCategoryFilter,
  IxDivider,
  IxContentHeader,
  IxSpinner,
} from "@siemens/ix-vue";
import {iconAddCircle, iconSuccess, iconMaintenanceWarning, iconError,iconInfo} from "@siemens/ix-icons/icons";

import { useDeviceStore } from "@/store/deviceStore";
import type { Device, DeviceState } from "@/types";

const deviceStore = useDeviceStore();
const isMaintenanceLoading = ref(false);
const dataTableRef = ref<(InstanceType<typeof DataTableInstance> & DataTableExposed) | null>(null);
const categories = computed(() => dataTableRef.value?.categories || {});

const filterText = ref<string>("");
const selectedStatus = ref<string | null>(null);
const selectedCategory = ref<Record<string, string | null>>({});

const modal = reactive({ addDevicesModal: false });
const expanded = ref(false);
interface DeviceData extends Device {
  [key: string]: any;
}

interface DataTableExposed {
  refreshData: () => void;
  categories: Record<string, { label: string; options: string[] }>;
  deviceState: Record<DeviceState, number>;
}

const selectedData = ref<Device | null>(null);

const maintenanceButtonLabel = computed(() => {
  if (!selectedData.value) return "Start Maintenance";
  return selectedData.value.status === "Maintenance" ? "End Maintenance" : "Start Maintenance";
});

const toggleMaintenance = async () => {
  if (!selectedData.value) return;
  
  // Show spinner immediately
  isMaintenanceLoading.value = true;
  
  // Wait for 2 seconds first
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Then update the status
  const newStatus: DeviceState = selectedData.value.status === "Maintenance" 
    ? "Online" 
    : "Maintenance";
  
  const updatedDevice: Device = {
    ...selectedData.value,
    status: newStatus
  };
  
  deviceStore.editDevice(updatedDevice);
  selectedData.value = updatedDevice;
  
  // Hide spinner after update
  isMaintenanceLoading.value = false;
};
const addDeviceClick = async () => {
  const modalInstance = await showModal(AddDevicesModal, "600");
  modalInstance.onClose.on((device: DeviceData) => {
    console.log("device added..." + JSON.stringify(device));
  });
};

const resetFilter = () => {
  filterText.value = "";
  selectedStatus.value = null;
  selectedCategory.value = {};
};

const toggleFilter = (status: string) => {
  selectedStatus.value = selectedStatus.value === status ? null : status;
};

const handleCellClicked = (payload: { expanded: boolean; data: any }) => {
  selectedData.value = payload.data;

  // Force reset the expanded state to ensure the pane opens
  expanded.value = false;
  setTimeout(() => {
    expanded.value = true;
  }, 0);

};

const handlePaneCollapse = () => {
  expanded.value = false;
};

// New toggleFilter for IxCategoryFilter
const toggleCategoryFilter = (field: string, value: string) => {
  selectedCategory.value[field] = selectedCategory.value[field] === value ? null : value;
};


const formatKey = (key: string) => {
  const formattedKey = key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .toLowerCase();
  return formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
};
const filteredDeviceDetails = computed(() => {
  if (!selectedData.value) return {};

  return (Object.keys(selectedData.value) as Array<keyof Device>).reduce(
    (acc, key) => {
      if (key !== "id") {
        acc[key] = selectedData.value![key];
      }
      return acc;
    },
    {} as Partial<Record<keyof Device, any>>,
  );
});

onMounted(() => {
  console.log("dataTableRef:", dataTableRef.value);
  const pane = document.querySelector("ix-pane");
  pane?.addEventListener("expandedChanged", (event: CustomEvent) => {
    expanded.value = event.detail.expanded;
  });
});

// ✅ Watch for changes in categories
watchEffect(() => {
  console.log("Updated Categories in DevicesList.vue:", categories.value);
});

const deviceState = computed(
  () =>
    dataTableRef.value?.deviceState || {
      Error: 0,
      Maintenance: 0,
      Offline: 0,
      Online: 0,
    }
);
</script>

<template>
  <IxContentHeader slot="header" :headerTitle="'Devices'">
        <IxButton ghost class="add-devices-button" :icon="iconAddCircle" @click="addDeviceClick">

      Add device
    </IxButton>
  </IxContentHeader>
  <section class="devices-page">
    <!-- Filters -->
    <section class="device-filter">
      <IxCategoryFilter
        placeholder="Filter by"
        class="category-filter"
        :categories="categories"
        @select="
          (field: string, value: string) => {
            console.log(`Selected ${field}: ${value}`);
            toggleCategoryFilter(field, value);
          }
        "
      ></IxCategoryFilter>

      <section class="quick-filter">
        <IxChip
          :outline="selectedStatus !== 'Online'"
          :icon="iconSuccess"
          variant="success"
          @click="toggleFilter('Online')"
        >
          {{ deviceState.Online }} online
        </IxChip>
        <IxChip
          :outline="selectedStatus !== 'Maintenance'"
          :icon="iconMaintenanceWarning"
          variant="warning"
          @click="toggleFilter('Maintenance')"
        >
          {{ deviceState.Maintenance }} maintenance
        </IxChip>
        <IxChip
          :outline="selectedStatus !== 'Error'"
          :icon="iconError"
          variant="alarm"
          @click="toggleFilter('Error')"
        >
          {{ deviceState.Error }} error
        </IxChip>
        <IxChip
          :outline="selectedStatus !== 'Offline'"
          :icon="iconInfo"
          variant="neutral"
          @click="toggleFilter('Offline')"
        >
          {{ deviceState.Offline }} offline
        </IxChip>
      </section>
    </section>

    <!-- Data Table Component -->
    <DataTableInstance
      ref="dataTableRef"
      :filterText="filterText"
      :selectedStatus="selectedStatus"
      :selectedCategory="selectedCategory"
      @cell-clicked="handleCellClicked"
    />
  </section>
  <IxPane
    heading="Device Details"
    composition="right"
    size="320px"
    variant="floating"
    hideOnCollapse
    :expanded="expanded"
    class="pane-popup"
    @collapse="handlePaneCollapse"
  >
    <div class="container">
      <div>
        <IxTypography format="h1" class="deviceName">
          {{ selectedData?.deviceName || "No device selected" }}
        </IxTypography>

        <!-- Dynamically render device details -->
        <template v-for="(value, key) in filteredDeviceDetails" :key="key">
          <div v-if="key !== 'id'">
            <IxTypography format="body" textColor="soft">
              {{ formatKey(key) }}
            </IxTypography>
            <IxTypography format="body" textColor="std">
              {{ value }}
            </IxTypography>
            <IxDivider class="divider" />
          </div>
        </template>
      </div>

      <IxButton outline @click="toggleMaintenance" :disabled="isMaintenanceLoading">
        <div style="display: flex; align-items: center">
          <IxSpinner size="small" v-if="isMaintenanceLoading" />
          {{ maintenanceButtonLabel }}
        </div>
      </IxButton>
    </div>
  </IxPane>
</template>

<style scoped>
.devices-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.device-filter {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin-bottom: 2rem;
  gap: 1rem;
}

.device-filter section.quick-filter {
  display: flex;
  gap: 0.5rem;
  min-width: 38rem;
}

.category-filter {
  flex: 1;
  max-width: 100%;
}
.pane-popup {
  position: fixed;
  z-index: 10;
  top: 7.2rem;
  height: 87vh;
  right: 2rem;
  width: 320px;
}
.deviceName {
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 2rem;
}
.divider {
  margin: 0.5rem 0;
}
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  word-break: break-word;
  padding: 0 0.75rem 1rem;
  gap: 5.9rem;
}
</style>
