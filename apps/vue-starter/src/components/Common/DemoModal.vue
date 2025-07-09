<script setup lang="ts">
import { closeModal, dismissModal, } from '@siemens/ix'
import { iconInfo } from '@siemens/ix-icons/icons';
import {
  type HTMLRefElement,
  IxButton,
  IxModalHeader,
  IxModalContent,
  IxModalFooter,
} from '@siemens/ix-vue'
import { ref } from 'vue'

const modalRef = ref<HTMLRefElement<HTMLIxModalElement>>()

const close = () => {
  closeModal(modalRef.value as unknown as Element, 'close payload')
}
const dismiss = () => {
  dismissModal(modalRef.value as unknown as Element, 'dismiss payload')
}
</script>

<template>
  <div ref="modalRef">
    <IxModalHeader onclose="dismiss()" :icon=iconInfo>Demo app</IxModalHeader>
    <IxModalContent>This feature is currently unavailable in the demo version.</IxModalContent>
    <IxModalFooter>
      <IxButton outline @click="dismiss()"> Cancel </IxButton>
      <IxButton @click="close()">OK</IxButton>
    </IxModalFooter>
  </div>
</template>
