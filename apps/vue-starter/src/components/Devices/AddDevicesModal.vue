/*
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

<script setup lang="ts">
import { ref } from "vue";
import { dismissModal } from "@siemens/ix";
import {
  type HTMLRefElement,
  IxButton,
  IxModalHeader,
  IxModalContent,
  IxModalFooter,
  IxSelect,
  IxSelectItem,
  IxInput,
  showToast,
} from "@siemens/ix-vue";
import { useDeviceStore } from "@/store/deviceStore";
import type { Device, DeviceState } from "@/types";
import { iconSingleCheck } from "@siemens/ix-icons/icons";

const modalRef = ref<HTMLRefElement<HTMLIxModalElement>>();
const deviceStore = useDeviceStore();

const device = ref<Omit<Device, "id">>({
  deviceName: "",
  vendor: "",
  deviceType: "",
  status: "Online" as DeviceState,
  articleNumber: "",
  macAddress: "",
  ipAddress: "",
  firmwareVersion: "",
  serialNumber: "",
});

const addDevice = () => {
  deviceStore.addDevice(device.value);

  device.value = {
    deviceName: "",
    vendor: "",
    deviceType: "",
    status: "Online" as DeviceState,
    articleNumber: "",
    macAddress: "",
    ipAddress: "",
    firmwareVersion: "",
    serialNumber: "",
  } as Omit<Device, "id">;

  dismissModal(modalRef.value as unknown as Element, "add-success");
  showToast({
    message: "Device successfully added",
    type: "success",
    icon: iconSingleCheck,
    iconColor: "color-success",
  });
};
const dismiss = () => {
  dismissModal(modalRef.value as unknown as Element, "dismiss payload");
};
</script>

<template>
  <div ref="modalRef" class="modal">
    <IxModalHeader @close="dismiss">Add device </IxModalHeader>
    <IxModalContent>
      <form id="modalForm" noValidate>
        <div class="form-grid">
          <IxInput id="device-name" label="Device name" aria-label="Device name" v-model="device.deviceName" />
          <IxInput id="vendor" label="Vendor" aria-label="Vendor" v-model="device.vendor" />
          <div class="device-type-container">
            <IxInput id="deviceType" label="Device type" aria-label="Device type" v-model="device.deviceType" />
          </div>

          <IxSelect label="Status" id="status" :value="device.status"
            @valueChange="device.status = $event.detail as DeviceState">
            <IxSelectItem value="Online" label="Online"></IxSelectItem>
            <IxSelectItem value="Offline" label="Offline"></IxSelectItem>
            <IxSelectItem value="Maintenance" label="Maintenance"></IxSelectItem>
            <IxSelectItem value="Error" label="Error"></IxSelectItem>
          </IxSelect>

          <IxInput id="articleNumber" label="Article number" aria-label="Article number"
            v-model="device.articleNumber" />
          <IxInput id="macAddress" label="MAC address" v-model="device.macAddress" />
          <IxInput id="ipAddress" label="IP address" v-model="device.ipAddress" />
          <IxInput id="firmwareVersion" label="Firmware version" v-model="device.firmwareVersion" />
          <IxInput id="serialNumber" label="Serial number" v-model="device.serialNumber" />
        </div>
      </form>
    </IxModalContent>
    <IxModalFooter class="footer">
      <IxButton outline @click="dismiss">Cancel</IxButton>
      <IxButton @click="addDevice">Add device</IxButton>
    </IxModalFooter>
  </div>
</template>

<style scoped>
.footer {
  margin-top: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.device-type-container {
  grid-column: 1 / 3;
  width: 50%;
}

.flex-system {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.modal {
  width: 720px;
  max-width: 100%;
}
</style>
