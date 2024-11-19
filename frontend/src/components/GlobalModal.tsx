import React from "react";
import { Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { closeModal } from "../store/modalSlice";
import { RootState } from "../store/store";

const GlobalModal: React.FC = () => {
  const dispatch = useDispatch();
  const { visible, content } = useSelector((state: RootState) => state.modal);

  return (
    <Modal open={visible} onCancel={() => dispatch(closeModal())} footer={null}>
      <div>{content || "No content"}</div>
    </Modal>
  );
};

export default GlobalModal;
