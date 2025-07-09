<script setup lang="ts">
import {
  IxRow,
  IxIconButton,
  IxTooltip,
  IxDropdown,
  IxDropdownQuickActions,
  IxDropdownItem,
  IxDivider,
} from "@siemens/ix-vue";
import {iconPen, iconTrashcan, iconContextMenu, iconDuplicate, iconCut, iconCopy, iconPaste, iconRename, iconPcTower} from "@siemens/ix-icons/icons";

import { defineProps } from "vue";

const props = defineProps(["params", "api", "node"]);


const startEditingFirstCell = () => {  
  console.log(props.params.node.data)
  props.params.api.startEditingCell({
    rowIndex: props.params.node?.rowIndex,
    colKey: "deviceName",
  });
};

const deleteDevice = () => {
  console.log("Delete device clicked for row:",props.params.node.data);
  props.params.api.applyTransaction({
    remove: [props.params.node.data],
  });
};

const toggleStatus=()=>{
  const currentStatus = props.params.node.data.status;
  console.log(currentStatus);
  const newStatus = currentStatus === "Online" ? "Offline" : "Online";
  props.params.node.setDataValue("status", newStatus);
}
const startMaintenance=()=>{
  const currentStatus = props.params.node.data.status;
  console.log(currentStatus);
  const newStatus = currentStatus === "Maintenance" ? "Online" : "Maintenance";
  props.params.node.setDataValue("status", newStatus);  
}

const duplicateRow = () => {
  console.log("Duplicate device clicked for row:",props.params.node);
  props.params.api.applyTransaction({
    add: [props.params.node.data],
  });
};

const copyRow = () => {
  console.log("Copy device clicked for row:",props.params.node.data);
  navigator.clipboard.writeText(JSON.stringify(props.params.node.data));
};

const pasteRow = () => {
  console.log("Paste device clicked for row:",props.params.node.data);
  navigator.clipboard.readText().then((text) => {
    const data = JSON.parse(text);
    props.params.api.applyTransaction({
      add: [data],
    });
  });
};

const copyAndDeleteRow = () => {
  copyRow();
  deleteDevice();
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
    <IxTooltip id="tooltip-edit" for=".edit-tooltip">
      Rename
    </IxTooltip>

    <!-- Delete Button -->
    <IxIconButton
      class="delete-tooltip"
      aria-describedby="tooltip-delete"
      :icon="iconTrashcan"
      variant="secondary"
      ghost
      @click="deleteDevice"
    />
    <IxTooltip id="tooltip-delete" for=".delete-tooltip">
      Delete
    </IxTooltip>

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
  <IxDropdownItem :icon="iconRename" label="Rename" @click="startEditingFirstCell"></IxDropdownItem>
  <IxDropdownItem :icon="iconPcTower" label="Toggle Status" @click="toggleStatus"></IxDropdownItem>
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