import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  visible: boolean;
  content?: string; // Storing a simple string for testing
}

const initialState: ModalState = {
  visible: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<string>) => {
      state.visible = true;
      state.content = action.payload; // Store a plain string
    },
    closeModal: (state) => {
      state.visible = false;
      state.content = undefined;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
