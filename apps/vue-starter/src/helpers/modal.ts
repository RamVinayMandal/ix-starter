import { createVNode, render, type Component } from "vue";
import {
  showModal as _showModal,
  showMessage,
  type IxModalSize,
  type ModalInstance,
} from "@siemens/ix";
import { iconInfo, iconTrashcan } from "@siemens/ix-icons/icons";

export function showDeleteMessage(t: (key: string) => string): Promise<{ actionId: string }> {
  return showMessage({
    message: t("delete-message"),
    icon: iconTrashcan,
    iconColor: "color-alarm",
    actions: [
      {
        id: "cancel",
        text: t("delete-cancel"),
        type: "cancel",
      },
      {
        id: "okay",
        text: t("delete-confirm"),
        type: "okay",
      },
    ],
    messageTitle: "Delete Device?",
  }) as unknown as Promise<{ actionId: string }>;
}

export function showDemoModal(t: (key: string) => string) {
  showMessage({
    message: t("demo-message"),
    icon: iconInfo,
    actions: [
      {
        id: "cancel",
        text: t("cancel"),
        type: "cancel",
      },
      {
        id: "okay",
        text: t("okay"),
        type: "okay",
      },
    ],
    messageTitle: "Demo app",
  });
}

export async function showModal(
  component: Component,
  modalSize?: IxModalSize,
): Promise<ModalInstance> {
  const vnode = createVNode(component, {});
  const container = document.createElement("div");
  container.style.visibility = "block";
  render(vnode, container);

  return await _showModal({
    title: "Custom Modal",
    content: container,
    size: modalSize,
  });
}
