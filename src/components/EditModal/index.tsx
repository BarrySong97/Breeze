import { Input, Modal } from "@douyinfe/semi-ui";
import { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import { FC, useState } from "react";
import { db, Habit } from "../../db";
export interface EditModalProps extends ModalReactProps {
  habit: Habit;
}
const EditModal: FC<EditModalProps> = ({ habit, onOk, ...props }) => {
  const [value, setValue] = useState<string>(habit.name);
  return (
    <Modal
      {...props}
      onOk={async (e) => {
        onOk?.(e);
        if (!habit.id) return;
        db.habits.update(habit.id, { name: value });
      }}
    >
      <Input value={value} onChange={(e) => setValue(e)} />
    </Modal>
  );
};

export default EditModal;
