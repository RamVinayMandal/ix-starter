import { createVNode, render, type Component } from 'vue';
import { showModal as _showModal, type IxModalSize, type ModalInstance } from '@siemens/ix';
import DemoModal from '@/components/Common/DemoModal.vue';

export async function showDemoModal() {
  const modalInstance = await showModal(DemoModal);
  modalInstance.onClose.on((message) => {
    console.log('dialog closed...' + message);
  });
  modalInstance.onDismiss.on((message) => {
    console.log('dialog dismissed...' + message);
  });
}

export async function showModal(component: Component, modalSize?: IxModalSize) : Promise<ModalInstance> {
  const vnode = createVNode(component, {});
  const container = document.createElement('div');
  container.style.visibility = 'block';
  render(vnode, container);

  return await _showModal({
    title: 'Custom Modal',
    content: container,
    size: modalSize
  });
}