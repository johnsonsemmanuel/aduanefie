import React from "react";
import SharedCustomModal from "components/modal";

// Legacy API wrapper: callers pass `setModalOpen`, the shared sheet primitive
// takes `handleClose`. Routing through the shared primitive gives every
// consumer the same mobile bottom-sheet behaviour.
const CustomModal = ({
  openModal,
  setModalOpen,
  children,
  disableAutoFocus,
}) => (
  <SharedCustomModal
    openModal={openModal}
    handleClose={() => setModalOpen?.(false)}
    disableAutoFocus={disableAutoFocus}
  >
    {children}
  </SharedCustomModal>
);

export default CustomModal;
