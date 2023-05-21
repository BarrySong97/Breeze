import { Button, Modal, Notification, Space, Upload } from "@douyinfe/semi-ui";
import { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import { useQueryClient } from "@tanstack/react-query";
import { useBoolean } from "ahooks";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { HabitDTO, HabitsService } from "../../../../api";
import { PhFileCsv } from "../../../../assets/icons/CSV";
import { BiFiletypeJson } from "../../../../assets/icons/Json";
export interface ImportModalProps extends ModalReactProps {}
const ImportModal: FC<ImportModalProps> = ({ ...props }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [
    importJsonLoading,
    { setTrue: setImortJsonLoadingTrue, setFalse: setImportJsonLoadingFalse },
  ] = useBoolean(false);
  const [
    importCSVLoading,
    { setTrue: setImortCSVLoadingTrue, setFalse: setImportCSVLoadingFalse },
  ] = useBoolean(false);
  const handleFileChange = async (file: File) => {
    if (!file) return;
    try {
      if (file.type === "application/json") {
        setImortJsonLoadingTrue();
        await HabitsService.habitsControllerImportJson({
          file: file,
        });
      } else {
        setImortCSVLoadingTrue();
        await HabitsService.habitsControllerImportCsv({
          file: file,
        });
      }
      queryClient.fetchQuery(["habits"]);
      Notification.success({
        position: "top",
        title: t("importModal.importSuccess"),
      });
      props.onOk?.({} as any);
    } catch (error) {
      Notification.error({
        position: "top",
        title: t("importModal.importFailed"),
      });
    } finally {
      setImportJsonLoadingFalse();
      setImportCSVLoadingFalse();
    }
  };

  return (
    <Modal {...props} footer={[]}>
      <div className="flex justify-center items-center">
        <Space>
          <Upload
            fileList={[]}
            accept=".json"
            // action="/api/habits/json"
            onFileChange={(file) => {
              handleFileChange(file?.[0]);
            }}
          >
            <Button
              loading={importJsonLoading}
              icon={<BiFiletypeJson />}
              size="large"
            >
              {t("importModal.importJson")}
            </Button>
          </Upload>
          <Upload
            fileList={[]}
            accept=".csv"
            onFileChange={(file) => {
              handleFileChange(file?.[0]);
            }}
          >
            <Button
              loading={importCSVLoading}
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
