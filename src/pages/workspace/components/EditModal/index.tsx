import { Input, Modal } from "@douyinfe/semi-ui";
import { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { FC, useState } from "react";
import { HabitDTO, HabitsService, UpdateHabit } from "../../../../api";
import { db, Habit } from "../../../../db";
export interface EditModalProps extends ModalReactProps {
  habit: HabitDTO;
  updateMutation: UseMutationResult<HabitDTO, unknown, UpdateHabit, unknown>;
}
const EditModal: FC<EditModalProps> = ({
  habit,
  updateMutation,
  onOk,
  ...props
}) => {
  const [value, setValue] = useState<string>(habit.name);
  return (
    <Modal
      {...props}
      onOk={async (e) => {
        onOk?.(e);
        if (!habit.id) return;
        updateMutation.mutate({
          id: habit.id,
          name: value,
          order: habit.order,
        });
      }}
    >
      <Input value={value} onChange={(e) => setValue(e)} />
    </Modal>
  );
};

export default EditModal;
