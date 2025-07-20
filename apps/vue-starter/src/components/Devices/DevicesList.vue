<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
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
import { iconAddCircle, iconSuccess, iconMaintenanceWarning, iconError, iconInfo } from "@siemens/ix-icons/icons";
import { FilterState, LogicalFilterOperator } from '@siemens/ix';
import { useDeviceStore } from "@/store/deviceStore";
import type { Device, DeviceState } from "@/types";

interface DataTableExposed {
  refreshData: () => void;
  categories: Record<string, { label: string; options: string[] }>;
  deviceState: Record<DeviceState, number>;
}

const deviceStore = useDeviceStore();
const dataTableRef = ref<(InstanceType<typeof DataTableInstance> & DataTableExposed) | null>(null);

const isMaintenanceLoading = ref(false);
const selectedData = ref<Device | null>(null);
const expanded = ref(false);
const closeByEscapeHandler = ref<((event: KeyboardEvent) => void) | null>(null);

const selectedStatus = ref<string | null>(null);

const categoryFilterState = ref<FilterState>({
  tokens: [],
  categories: [],
});

const categories = computed(() => dataTableRef.value?.categories || {});
const deviceState = computed(() => dataTableRef.value?.deviceState || {
  Error: 0,
  Maintenance: 0,
  Offline: 0,
  Online: 0,
});

const maintenanceButtonLabel = computed(() => {
  if (!selectedData.value) return "Start Maintenance";
  return selectedData.value.status === "Maintenance" ? "End Maintenance" : "Start Maintenance";
});

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

const toggleMaintenance = async () => {
  if (!selectedData.value) return;
  
  isMaintenanceLoading.value = true;
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const newStatus: DeviceState = selectedData.value.status === "Maintenance" ? "Online" : "Maintenance";
  
  const updatedDevice: Device = {
    ...selectedData.value,
    status: newStatus
  };
  
  deviceStore.editDevice(updatedDevice);
  selectedData.value = updatedDevice;
  isMaintenanceLoading.value = false;
};

const addDeviceClick = async () => {
  const modalInstance = await showModal(AddDevicesModal, "600");
  modalInstance.onClose.on((device: Device) => {
    console.log("device added...", device);
  });
};

const toggleFilter = (status: string) => {
  const wasActive = selectedStatus.value === status;
  
  if (wasActive) {
    selectedStatus.value = null;
    categoryFilterState.value = { tokens: [], categories: [] };
  } else {
    selectedStatus.value = status;
    categoryFilterState.value = {
      tokens: [],
      categories: [{ id: 'status', value: status, operator: LogicalFilterOperator.EQUAL }],
    };
  }
};

const onCategoryFilterChanged = (event: CustomEvent<FilterState>) => {
  const filterState = event.detail;
  categoryFilterState.value = filterState;
  
  const statusCategory = filterState.categories?.find(cat => cat.id === 'status');
  selectedStatus.value = statusCategory ? statusCategory.value as string : null;
};

const handleCellClicked = (payload: { expanded: boolean; data: Device }) => {
  selectedData.value = payload.data;
  expanded.value = false;
  nextTick(() => {
    expanded.value = true;
  });
};

const handlePaneExpandedChanged = (event: CustomEvent) => {
  expanded.value = event.detail.expanded;
};

const formatKey = (key: string) => {
  const formattedKey = key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .toLowerCase();
  return formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
};

onMounted(() => {
  const closeByEscape = (event: KeyboardEvent) => {
    if (!expanded.value) return;
    if (event.key === "Escape") {
      expanded.value = false;
    }
  };

  document.addEventListener("keydown", closeByEscape);
  closeByEscapeHandler.value = closeByEscape;
});

onUnmounted(() => {
  if (closeByEscapeHandler.value) {
    document.removeEventListener("keydown", closeByEscapeHandler.value);
  }
});
</script>

<template>
  <IxContentHeader slot="header" headerTitle="Devices">
    <IxButton 
      ghost 
      class="add-devices-button" 
      :icon="iconAddCircle" 
      @click="addDeviceClick"
    >
      Add device
    </IxButton>
  </IxContentHeader>
  
  <section class="devices-page">
    <section class="device-filter">
      <IxCategoryFilter
        placeholder="Filter by"
        class="category-filter"
        :filterState="categoryFilterState"
        :categories="categories"
        @filterChanged="onCategoryFilterChanged"
      />

      <section class="quick-filter">
        <IxChip
          :outline="selectedStatus !== 'Online'"
          :icon="iconSuccess"
          variant="success"
          @click="() => toggleFilter('Online')"
        >
          {{ deviceState.Online }} online
        </IxChip>
        <IxChip
          :outline="selectedStatus !== 'Maintenance'"
          :icon="iconMaintenanceWarning"
          variant="warning"
          @click="() => toggleFilter('Maintenance')"
        >
          {{ deviceState.Maintenance }} maintenance
        </IxChip>
        <IxChip
          :outline="selectedStatus !== 'Error'"
          :icon="iconError"
          variant="alarm"
          @click="() => toggleFilter('Error')"
        >
          {{ deviceState.Error }} error
        </IxChip>
        <IxChip
          :outline="selectedStatus !== 'Offline'"
          :icon="iconInfo"
          variant="neutral"
          @click="() => toggleFilter('Offline')"
        >
          {{ deviceState.Offline }} offline
        </IxChip>
      </section>
    </section>

    <DataTableInstance
      ref="dataTableRef"
      :filterText="''"
      :selectedStatus="selectedStatus"
      :selectedCategory="{}"
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
    @expandedChanged="handlePaneExpandedChanged"
  >
    <div class="container">
      <div>
        <IxTypography format="h1" class="deviceName">
          {{ selectedData?.deviceName || "No device selected" }}
        </IxTypography>

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

      <IxButton 
        outline 
        :disabled="isMaintenanceLoading" 
        @click="toggleMaintenance"
      >
        <div class="maintenance-button">
          <IxSpinner v-if="isMaintenanceLoading" size="small" />
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
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
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
  justify-content: space-between;
  overflow: hidden;
  word-break: break-word;
  padding: 0 0.75rem 1rem;
}

.maintenance-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
