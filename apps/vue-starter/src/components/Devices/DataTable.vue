<script setup lang="ts">
import {iconProject} from "@siemens/ix-icons/icons";
import { ref, computed, onMounted } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import QuickActions from "./QuickActions.vue";
import StatusCell from "./StatusCell.vue";
import { useDeviceStore } from "@/store/deviceStore";
import type { Device, DeviceState } from '@/types';
import type { GridApi } from 'ag-grid-community';


const deviceStore = useDeviceStore(); 

const props = defineProps<{
  filterText: string;
  selectedStatus: string | null;
  selectedCategory: Record<string, string | null>;
}>();
const emit = defineEmits(["cell-clicked"]);
const gridApi = ref<GridApi | null>(null);
const onGridReady = (params: any) => {
  gridApi.value = params.api;
};

interface LocalDevice extends Device {
  quickActions?: any;
}

const rowData = computed(() => deviceStore.devices);
const refreshData = () => {
  gridApi.value?.refreshCells();
  gridApi.value?.redrawRows();
};
const expanded = ref<boolean>(false);
const expandedChanged = (event: CustomEvent) => {
  expanded.value = event.detail.expanded;
};

onMounted(() => {
  deviceStore.fetchDevices();
});

// Column Definitions
const columnDefs = ref([
  {
    field: "deviceName",
    headerName: "Device name",
    editable: true,
    flex: 2,
    minWidth: 150,
  },
  {
    field: "status",
    headerName: "Status",
    editable: true,
    flex: 1,
    minWidth: 150,
    cellRenderer: StatusCell,
    cellRendererParams: (params: any) => {
      return {
        rowData: params.data,
      };
    },
  },
  {
    field: "vendor",
    headerName: "Vendor",
    editable: true,
    flex: 1,
    minWidth: 150,
  },
  {
    field: "deviceType",
    headerName: "Device type",
    editable: true,
    flex: 1,
    minWidth: 150,
  },
  {
    field: "ipAddress",
    headerName: "IP address",
    editable: true,
    flex: 1,
    minWidth: 150,
  },
  {
    field: "quickActions",
    headerName: "Quick actions",
    maxWidth: 150,
    cellRenderer: QuickActions,
    cellStyle: { display: 'flex', alignItems: 'center' },
    cellRendererParams: (params: any) => {
      return {
        api: params.api,
        node: params.node,
        rowData: params.data,
      };
    },
  },
]);

const categories = computed(() => {
  if (rowData.value.length === 0) return {};

  const categoryMap: Record<string, { label: string; options: string[] }> = {};
  columnDefs.value.forEach((col) => {
    if (col.field && col.headerName) {
      categoryMap[col.field] = {
        label: col.headerName,
        options: [
          ...new Set(
            rowData.value.map((device) => {
              const field = col.field as keyof Device;
              return field in device ? device[field]?.toString() ?? "" : "";
            })
          ),
        ].filter(Boolean) as string[],
      };
    }
  });

  return categoryMap;
});

const filteredRowData = computed(() => {
  return rowData.value.filter((device) => {
    const matchesFilterText = Object.values(device).some((value) =>
      String(value ?? "").toLowerCase().includes(props.filterText.toLowerCase())
    );
    
    const matchesStatus = props.selectedStatus
      ? device.status === props.selectedStatus
      : true;

    const matchesCategory = Object.entries(props.selectedCategory).every(
      ([field, value]) => {
        if (!value) return true;
        const deviceValue = device[field as keyof Device];
        return deviceValue?.toString() === value;
      }
    );

    return matchesFilterText && matchesStatus && matchesCategory;
  });
});

const onCellClicked = (event: any) => {
  console.log("Cell clicked:", event.data);
  emit("cell-clicked", { expanded: true, data: event.data });
};

const showEmptyState = computed(() => filteredRowData.value.length === 0);

//To count the devices status
const deviceState = computed(() => {
  const status: Record<DeviceState, number> = {
    Error: 0,
    Maintenance: 0,
    Offline: 0,
    Online: 0,
  };

  rowData.value.forEach((device) => {
    status[device.status] = (status[device.status] || 0) + 1;
  });
  return status;
});

defineExpose({ categories, deviceState, refreshData });
</script>

<template>
  <div class="ag-grid-container">
    <AgGridVue
      @grid-ready="onGridReady"
      class="ag-theme-alpine-dark ag-theme-ix"
      style="width: 100%; height: 100%;"
      :columnDefs="columnDefs"
      :rowData="filteredRowData"
      :rowHeight="42"
      :frameworkComponents="{ QuickActions }"
      :suppressRowTransform="true"
      :suppressCellFocus="true"
      @cell-clicked="onCellClicked"
      rowSelection="single"
    />

    <div v-if="showEmptyState" class="empty-state">
      <IxEmptyState
        header="No devices found"
        sub-header="Please remove search terms or add a new device"
        :icon="iconProject"
        action="Reset Filter"
      ></IxEmptyState>
    </div>
  </div>
</template>

<style scoped>
.ag-grid-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
