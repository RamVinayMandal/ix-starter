<script setup lang="ts">
import { ref } from "vue";
import { closeModal, dismissModal } from "@siemens/ix";
import {
  type HTMLRefElement,
  IxButton,
  IxModalHeader,
  IxModalContent,
  IxModalFooter,
  IxSelect,
  IxSelectItem,
  IxInput,
} from "@siemens/ix-vue";

const modalRef = ref<HTMLRefElement<HTMLIxModalElement>>();
const addDevice = () => {
  closeModal(modalRef.value as unknown as Element, device.value);
};

const dismiss = () => {
  dismissModal(modalRef.value as unknown as Element, "dismiss payload");
};

const device = ref({
  deviceName: "",
  vendor: "",
  deviceType: "",
  status: "",
  articleNumber: "",
  macAddress: "",
  ipAddress: "",
  firmwareVersion: "",
  serialNumber: "",
});
</script>

<template>
  <div ref="modalRef">
    <IxModalHeader @close="dismiss">Add device </IxModalHeader>
    <IxModalContent>
      <form id="modalForm" noValidate>
        <div class="form-grid">
          <IxInput
            id="device-name"
            label="Device name"
            aria-label="Device name"
            v-model="device.deviceName"
          />
          <IxInput
            id="vendor"
            label="Vendor"
            aria-label="Vendor"
            v-model="device.vendor"
          />
          <div class="item-full-width">
            <IxInput
              id="deviceType"
              label="Device type"
              aria-label="Device type"
              v-model="device.deviceType"
            />
          </div>
          <div class="flex-system">
            <IxSelect
              label="Status"
              id="status"
              :value="device.status"
              @valueChange="device.status = $event.detail as string"
            >
              <IxSelectItem value="Online" label="Online"></IxSelectItem>
              <IxSelectItem value="Offline" label="Offline"></IxSelectItem>
              <IxSelectItem
                value="Maintenance"
                label="Maintenance"
              ></IxSelectItem>
              <IxSelectItem value="Error" label="Error"></IxSelectItem>
            </IxSelect>
          </div>
          <IxInput
            id="articleNumber"
            label="Article number"
            aria-label="Article number"
            v-model="device.articleNumber"
          />
          <IxInput
            id="macAddress"
            label="MAC address"
            v-model="device.macAddress"
          />
          <IxInput
            id="ipAddress"
            label="IP address"
            v-model="device.ipAddress"
          />
          <IxInput
            id="firmwareVersion"
            label="Firmware version"
            v-model="device.firmwareVersion"
          />
          <IxInput
            id="serialNumber"
            label="Serial Number"
            v-model="device.serialNumber"
          />
        </div>
      </form>
    </IxModalContent>
    <IxModalFooter>
      <IxButton outline @click="dismiss">Cancel</IxButton>
      <IxButton @click="addDevice">Add device</IxButton>
    </IxModalFooter>
  </div>
</template>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.item-full-width {
  grid-column: 1 / 3;

  ix-input {
    width: 100%;
  }
}

.flex-system {
  display: flex;
  flex-direction: column;
}
</style>
