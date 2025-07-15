<script setup lang="ts">
import {
  IxRow,
  IxIconButton,
  IxTooltip,
  IxDropdown,
  IxDropdownQuickActions,
  IxDropdownItem,
  IxDivider,
  showToast,
} from "@siemens/ix-vue";
import {
  iconPen,
  iconTrashcan,
  iconContextMenu,
  iconDuplicate,
  iconCut,
  iconCopy,
  iconPaste,
  iconRename,
  iconPcTower,
  iconSingleCheck,
} from "@siemens/ix-icons/icons";
import { useDeviceStore } from "@/store/deviceStore";

interface DeleteModalResult {
  deleted: boolean;
}

const deviceStore = useDeviceStore();

const props = defineProps(["params", "api", "node"]);

const startEditingFirstCell = () => {
  console.log(props.params.node.data);
  props.params.api.startEditingCell({
    rowIndex: props.params.node?.rowIndex,
    colKey: "deviceName",
  });
};

const deleteDevice = () => {
  deviceStore.deleteDevice(props.params.node.data);
};

const toggleStatus = () => {
  const updatedDevice = {
    ...props.params.node.data,
    status: props.params.node.data.status === "Online" ? "Offline" : "Online",
  };
  deviceStore.editDevice(updatedDevice);
};
const startMaintenance = () => {
  const updatedDevice = {
    ...props.params.node.data,
    status: props.params.node.data.status === "Maintenance" ? "Online" : "Maintenance",
  };
  deviceStore.editDevice(updatedDevice);
};

const duplicateRow = () => {
  const currentIndex = deviceStore.devices.findIndex((d) => d.id === props.params.node.data.id);

  const newDevice = {
    ...props.params.node.data,
    id: (deviceStore.devices.length + 1).toString(),
  };

  deviceStore.insertDevice(currentIndex + 1, newDevice);

  showToast({
    message: "Device duplicated",
    type: "success",
    icon: iconSingleCheck,
    iconColor: "color-success",
  });
};

const copyRow = () => {
  navigator.clipboard.writeText(JSON.stringify(props.params.node.data));
  showToast({
    message: "Device copied to clipboard",
    type: "success",
    icon: iconSingleCheck,
    iconColor: "color-success",
  });
};

const pasteRow = async () => {
  try {
    const text = await navigator.clipboard.readText();
    const data = JSON.parse(text);
    const currentIndex = deviceStore.devices.findIndex((d) => d.id === props.params.node.data.id);

    deviceStore.insertDevice(currentIndex + 1, {
      ...data,
      id: (deviceStore.devices.length + 1).toString(),
    });
    showToast({
    message: "Device pasted",
    type: "success",
    icon: iconSingleCheck,
    iconColor: "color-success",
  });
  } catch (error) {
    console.error("Error pasting device:", error);
  }
};

const copyAndDeleteRow = () => {
  copyRow();
  deleteDevice(); 
   showToast({
    message: "Device cut to clipboard",
    type: "success",
    icon: iconSingleCheck,
    iconColor: "color-success",
  });
};
</script>

<template>
  <IxRow class="quick-actions-row">
    <!-- Edit Button -->
    <IxIconButton
      class="edit-tooltip"
      aria-describedby="tooltip-edit"
      :icon="iconPen"
      variant="secondary"
      ghost
      @click="startEditingFirstCell"
    />
    <IxTooltip id="tooltip-edit" for=".edit-tooltip"> Rename </IxTooltip>

    <!-- Delete Button -->
    <IxIconButton
      class="delete-tooltip"
      aria-describedby="tooltip-delete"
      :icon="iconTrashcan"
      variant="secondary"
      ghost
      @click="deleteDevice"
    />
    <IxTooltip id="tooltip-delete" for=".delete-tooltip"> Delete </IxTooltip>

    <!-- Context Menu -->
    <IxIconButton
      :icon="iconContextMenu"
      variant="secondary"
      ghost
      :id="`devices-${props.params.node?.rowIndex}`"
    ></IxIconButton>
    <IxDropdown :trigger="`devices-${props.params.node?.rowIndex}`">
      <IxDropdownQuickActions>
        <IxIconButton :icon="iconDuplicate" ghost @click="duplicateRow"></IxIconButton>
        <IxIconButton :icon="iconCut" ghost @click="copyAndDeleteRow"></IxIconButton>
        <IxIconButton :icon="iconCopy" ghost @click="copyRow"></IxIconButton>
        <IxIconButton :icon="iconPaste" ghost @click="pasteRow"></IxIconButton>
      </IxDropdownQuickActions>
      <IxDivider></IxDivider>
      <IxDropdownItem
        :icon="iconRename"
        label="Rename"
        @click="startEditingFirstCell"
      ></IxDropdownItem>
      <IxDropdownItem
        :icon="iconPcTower"
        label="Toggle Status"
        @click="toggleStatus"
      ></IxDropdownItem>
      <IxDivider />
      <IxDropdownItem :icon="iconTrashcan" label="Delete" @click="deleteDevice"></IxDropdownItem>
    </IxDropdown>
  </IxRow>
</template>

<style scoped>
.quick-actions-row {
  display: flex;
  gap: 0.5rem;
}
</style>
