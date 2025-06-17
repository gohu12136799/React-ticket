import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import React from "react";

const { confirm } = Modal;
interface Props {
  id: number;
  completed: boolean;
  onConfirm: () => void;
}
export const ModalConfirmCompleted = ({ id, completed, onConfirm }: Props) => {
  return confirm({
    title: `Do you want to mark ticket ${id}?`,
    icon: <ExclamationCircleFilled />,
    content: completed
      ? "Mark ticket as Incomplete?"
      : "Mark ticket as Complete?",
    okText: completed ? "Incomplete" : "Complete",
    okButtonProps: {
      style: {
        backgroundColor: completed ? "#c61212" : "#065906",
        borderColor: completed ? "#c61212" : "#065906",
        color: "white",
      },
    },
    cancelText: "Cancel",
    onOk() {
      onConfirm();
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

export default ModalConfirmCompleted;
