import {
  Button,
  Checkbox,
  CheckboxGroup,
  List,
  Modal,
  Space,
} from "@douyinfe/semi-ui";
import { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PhFileCsv } from "../../assets/icons/CSV";
import { BiFiletypeJson } from "../../assets/icons/Json";
import { Habit } from "../../db";
import { exportToCsv, exportToJson } from "../../utils/export";
export interface ExportModalProps extends ModalReactProps {
  data?: Habit[];
}
const ExportModal: FC<ExportModalProps> = ({ data, ...props }) => {
  const { t } = useTranslation();

  const [checkboxVal, setCV] = useState(data?.map((v) => v.id) ?? []);

  useEffect(() => {
    setCV(data?.map((v) => v.id) ?? []);
  }, [data]);

  return (
    <Modal {...props} footer={null}>
      <div className="mb-4">
        <CheckboxGroup value={checkboxVal} onChange={(value) => setCV(value)}>
          <List<Habit>
            grid={{
              gutter: 12,
              span: 12,
            }}
            dataSource={data}
            className="component-list-demo-booklist"
            split={false}
            size="small"
            style={{
              border: "1px solid var(--semi-color-border)",
              flexBasis: "100%",
              flexShrink: 0,
              padding: "8px",
            }}
            renderItem={(item) => (
              <List.Item className="list-item">
                <Checkbox value={item.id}>{item.name}</Checkbox>
              </List.Item>
            )}
          />
        </CheckboxGroup>
      </div>
      <div className="flex justify-center items-center mb-6">
        <Space>
          <Button
            onClick={() => {
              const filterData = data?.filter((v) =>
                checkboxVal.includes(v.id)
              );
              exportToJson("habits.json", filterData);
            }}
            icon={<BiFiletypeJson />}
            size="large"
          >
            {t("exportModal.exportJson")}
          </Button>
          <Button
            onClick={() => {
              const filterData = data?.filter((v) =>
                checkboxVal.includes(v.id)
              );
              exportToCsv("habits.csv", filterData);
            }}
            icon={<PhFileCsv />}
            size="large"
            type="secondary"
          >
            {t("exportModal.exportCsv")}
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default ExportModal;
