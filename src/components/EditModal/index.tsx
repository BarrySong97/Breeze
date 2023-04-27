import { Input, Modal } from "@douyinfe/semi-ui";
import { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import React, { FC } from "react";
export interface EditModalProps extends ModalReactProps {}
const EditModal: FC<EditModalProps> = ({ ...props }) => {
  return (
    <Modal {...props}>
      <Input />
    </Modal>
  );
};

export default EditModal;
