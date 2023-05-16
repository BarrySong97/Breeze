import { Button, Modal, Notification, Space, Upload } from "@douyinfe/semi-ui";
import { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import { useBoolean } from "ahooks";
import React, { ChangeEvent, FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { PhFileCsv } from "../../../../assets/icons/CSV";
import { BiFiletypeJson } from "../../../../assets/icons/Json";
import { db, Habit } from "../../../../db";
import {
  exportToCsv,
  exportToJson,
  importFromCsvOrJson,
} from "../../../../utils/export";
export interface ImportModalProps extends ModalReactProps {}
const ImportModal: FC<ImportModalProps> = ({ ...props }) => {
  const { t } = useTranslation();

  const [
    importLoading,
    { setTrue: setImortLoadingTrue, setFalse: setImportLoadingFalse },
  ] = useBoolean(false);
  async function bulkInsertData(habits: Habit[]) {
    await db.transaction("rw", db.habits, async () => {
      for (const habit of habits) {
        await db.habits.add(habit);
      }
    });
  }
  const handleUpload = async (habits: Habit[]) => {
    // 在这里使用解析后的 habits 数组
    try {
      await bulkInsertData(habits);
      Notification.success({
        position: "top",
        title: t("importModal.importSuccess"),
      });
    } catch (error) {
      Notification.error({
        position: "top",
        title: t("importModal.importFailed"),
      });
    } finally {
      setImportLoadingFalse();
    }
  };
  const handleFileChange = async (file: File) => {
    if (!file) return;
    setImortLoadingTrue();
    const habits = await importFromCsvOrJson(file);
    handleUpload(habits);
  };

  return (
    <Modal {...props} footer={[]}>
      <div className="flex justify-center items-center">
        <Space>
          <Upload
            fileList={[]}
            onFileChange={(file) => {
              handleFileChange(file?.[0]);
            }}
          >
            <Button
              loading={importLoading}
              icon={<BiFiletypeJson />}
              size="large"
            >
              {t("importModal.importJson")}
            </Button>
          </Upload>
          <Upload
            fileList={[]}
            onFileChange={(file) => {
              handleFileChange(file?.[0]);
            }}
          >
            <Button
              loading={importLoading}
              icon={<PhFileCsv />}
              size="large"
              type="secondary"
            >
              {t("importModal.importCsv")}
            </Button>
          </Upload>
        </Space>
      </div>
    </Modal>
  );
};

export default ImportModal;
