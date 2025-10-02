import { Button, Modal } from "antd";

export const SharedModal = ({
  message,
  callback,
  changeStatus,
  modalState,
  isLoading,
}) => {
  return (
    <Modal
      title={<p style={{ margin: 0 }}>Confirmation</p>}
      open={modalState}
      onCancel={callback}
      footer={[
        <Button key="cancel" danger onClick={callback}>
          Annuler
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={changeStatus}
          loading={isLoading}
        >
          Confirmer
        </Button>,
      ]}
    >
      <p
        style={{
          marginBottom: "8px",
          marginTop: "-8px",
        }}
      >
        {message}
      </p>
    </Modal>
  );
};
