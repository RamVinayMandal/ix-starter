/*
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
 
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
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
  IxEmptyState,
} from "@siemens/ix-vue";
import { iconProject } from "@siemens/ix-icons/icons";
import {
  iconAddCircle,
  iconSuccess,
  iconMaintenanceWarning,
  iconError,
  iconInfo,
} from "@siemens/ix-icons/icons";
import { FilterState, LogicalFilterOperator } from "@siemens/ix";
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
const categoryFilterState = ref<FilterState>({ tokens: [], categories: [] });

const { t } = useI18n();

const categories = computed(() => {
  const devices = deviceStore.devices;
  if (!devices.length) return {};

  const keys = Object.keys(devices[0]);
  const categoryMap = {} as Record<string, { label: string; options: string[] }>;

  keys.forEach((key) => {
    const uniqueValues = Array.from(new Set(devices.map((device) => (device as any)[key] ?? "")));
    const kebabKey = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    let label = t(`device-details.${kebabKey}`);
    if (label === `device-details.${kebabKey}`) {
      label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
    }
    categoryMap[key] = { label, options: uniqueValues };
  });

  return categoryMap;
});

const deviceState = computed(() => {
  const counts = { Error: 0, Maintenance: 0, Offline: 0, Online: 0 };
  deviceStore.devices.forEach((device) => {
    if (device.status && counts.hasOwnProperty(device.status)) {
      counts[device.status]++;
    }
  });
  return counts;
});

const filteredDevices = computed(() => {
  let devices = deviceStore.devices;

  if (categoryFilterState.value.categories?.length) {
    for (const cat of categoryFilterState.value.categories) {
      devices = devices.filter((device) => (device as any)[cat.id] === cat.value);
    }
  }

  if (categoryFilterState.value.tokens?.length) {
    const tokens = categoryFilterState.value.tokens.map((t) => t.toLowerCase());
    devices = devices.filter((device) =>
      Object.values(device).some((val) =>
        typeof val === 'string' && tokens.some((token) => val.toLowerCase().includes(token))
      )
    );
  }

  return devices;
});

function resetFilters() {
  selectedStatus.value = null;
  categoryFilterState.value = { tokens: [], categories: [] };
}

const maintenanceButtonLabel = computed(() => {
  if (!selectedData.value) return t("device-details-footer.set-maintenance");
  if (selectedData.value.status === "Maintenance") return t("device-details-footer.end-maintenance");
  return t("device-details-footer.set-maintenance");
});


const filteredDeviceDetails = computed(() => {
  if (!selectedData.value) return {};
  return Object.keys(selectedData.value).reduce((acc, key) => {
    if (key !== "id") acc[key] = (selectedData.value as any)[key];
    return acc;
  }, {} as Record<string, any>);
});


const toggleMaintenance = async () => {
  if (!selectedData.value) return;
  isMaintenanceLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const newStatus: DeviceState = selectedData.value.status === "Maintenance" ? "Online" : "Maintenance";
  const updatedDevice: Device = { ...selectedData.value, status: newStatus };
  deviceStore.editDevice(updatedDevice);
  selectedData.value = updatedDevice;
  if (dataTableRef.value?.gridApi) {
    const api = dataTableRef.value.gridApi;
    api.forEachNode((node) => {
      if (node.data && node.data.id === updatedDevice.id) {
        node.setData(updatedDevice);
      }
    });
  }
  isMaintenanceLoading.value = false;
};

const addDeviceClick = async () => {
  await showModal(AddDevicesModal, "600");
};


const toggleFilter = (status: string) => {
  const wasActive = selectedStatus.value === status;
  selectedStatus.value = wasActive ? null : status;
  categoryFilterState.value = wasActive
    ? { tokens: [], categories: [] }
    : {
      tokens: [],
      categories: [{ id: "status", value: status, operator: LogicalFilterOperator.EQUAL }],
    };
};

const onCategoryFilterChanged = (event: CustomEvent<FilterState>) => {
  const filterState = event.detail;
  categoryFilterState.value = filterState;
  const statusCategory = filterState.categories?.find((cat) => cat.id === "status");
  selectedStatus.value = statusCategory ? (statusCategory.value as string) : null;
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
  return categories.value[key]?.label || key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
};

onMounted(() => {
  deviceStore.fetchDevices();
  const closeByEscape = (event: KeyboardEvent) => {
    if (expanded.value && event.key === "Escape") expanded.value = false;
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
    <IxButton ghost class="add-devices-button" :icon="iconAddCircle" @click="addDeviceClick" aria-label="add device">
      Add device
    </IxButton>
  </IxContentHeader>

  <section class="devices-page">
    <section class="device-filter">
      <IxCategoryFilter placeholder="Filter by" class="category-filter" :filterState="categoryFilterState"
        :categories="categories" @filterChanged="onCategoryFilterChanged" />

      <section class="quick-filter">
        <IxChip :outline="selectedStatus !== 'Online'" :icon="iconSuccess" variant="success"
          @click="() => toggleFilter('Online')">
          {{ deviceState.Online }} online
        </IxChip>
        <IxChip :outline="selectedStatus !== 'Maintenance'" :icon="iconMaintenanceWarning" variant="warning"
          @click="() => toggleFilter('Maintenance')">
          {{ deviceState.Maintenance }} maintenance
        </IxChip>
        <IxChip :outline="selectedStatus !== 'Error'" :icon="iconError" variant="alarm"
          @click="() => toggleFilter('Error')">
          {{ deviceState.Error }} error
        </IxChip>
        <IxChip :outline="selectedStatus !== 'Offline'" :icon="iconInfo" variant="neutral"
          @click="() => toggleFilter('Offline')">
          {{ deviceState.Offline }} offline
        </IxChip>
      </section>
    </section>

    <template v-if="deviceStore.devices.length > 0 && filteredDevices.length === 0">
      <div class="empty-state-wrapper">
        <IxEmptyState
          :header="t('device-quick-actions.no-devices-found') !== 'device-quick-actions.no-devices-found' ? t('device-quick-actions.no-devices-found') : 'No devices found'"
          :sub-header="t('device-quick-actions.no-devices-found-desc') !== 'device-quick-actions.no-devices-found-desc' ? t('device-quick-actions.no-devices-found-desc') : 'Please remove search terms or add a new device'"
          :icon="iconProject" :action="t('reset-filter') !== 'reset-filter' ? t('reset-filter') : 'Reset Filter'"
          @actionClick="resetFilters" />
      </div>
    </template>
    <template v-else>
      <DataTableInstance ref="dataTableRef" :filterText="''" :selectedStatus="selectedStatus" :selectedCategory="categoryFilterState.categories.reduce((acc: Record<string, string>, cat) => {
        acc[cat.id] = cat.value;
        return acc;
      }, {})
        " @cell-clicked="handleCellClicked" />
    </template>
  </section>
  <IxPane :heading="t('device-details-header.title')" composition="right" size="320px" variant="floating" hideOnCollapse
    :expanded="expanded" class="pane-popup" @expandedChanged="handlePaneExpandedChanged">
    <div class="container">
      <div>
        <IxTypography format="h1" class="deviceName">
          {{ selectedData?.deviceName || 'No device selected' }}
        </IxTypography>
        <template v-if="selectedData">
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
        </template>
      </div>
      <IxButton outline :disabled="isMaintenanceLoading" @click="toggleMaintenance">
        <div class="maintenance-button">
          <IxSpinner v-if="isMaintenanceLoading" size="small" />
          {{ maintenanceButtonLabel }}
        </div>
      </IxButton>
    </div>
  </IxPane>
</template>

<style scoped>
.empty-state-wrapper {
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
}

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
