import { useTheme } from "@emotion/react";
import { Clear } from "@mui/icons-material";
import { Box, Dialog, Drawer, Stack, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
const CustomModal = (props) => {
  const {
    openModal,
    handleClose,
    disableAutoFocus,
    closeButton,
    children,
    maxWidth,
    drawerHeight,
    disableContentOverflowClip,
  } = props;
  const handleCloseModal = (event, reason) => {
    event?.stopPropagation?.();
    if (reason && reason === "backdropClick") {
      if (disableAutoFocus) {
        return true;
      } else {
        handleClose?.();
      }
    } else {
      handleClose?.();
    }
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const closeButtonNode = closeButton && (
    <Stack direction="row" justifyContent="flex-end">
      <Box
        onClick={handleCloseModal}
        sx={{
          cursor: "pointer",
          color: theme.palette.text.primary,
          mt: 1.3,
          mr: 1.3,
        }}
      >
        <Clear sx={{ height: "16px" }} />
      </Box>
    </Stack>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={openModal}
        onClose={handleCloseModal}
        sx={{ zIndex: 1500 }}
        PaperProps={{
          sx: {
            borderRadius: "16px 16px 0 0",
            pt: 1,
            pb: "calc(16px + env(safe-area-inset-bottom))",
            ...(disableContentOverflowClip
              ? { overflowY: "visible" }
              : { maxHeight: "90vh", overflowY: "auto" }),
            ...(drawerHeight && { height: drawerHeight }),
          },
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 4,
            borderRadius: "9999px",
            bgcolor: theme.palette.divider,
            mx: "auto",
            mb: closeButton ? 0 : 1,
            flexShrink: 0,
          }}
        />
        {closeButtonNode}
        {children}
      </Drawer>
    );
  }

  return (
    <Dialog
      open={openModal}
      onClose={handleCloseModal}
      maxWidth={maxWidth ? false : "sm"}
      sx={{
        zIndex: 1500,
        ".MuiDialog-paper": {
          margin: "16px",
          ...(disableContentOverflowClip
            ? { overflowX: "visible", overflowY: "visible" }
            : { overflowX: "hidden" }),
          ...(maxWidth && {
            width: `min(${maxWidth}, calc(100vw - 32px))`,
            maxWidth: "100%",
          }),
        },
      }}
    >
      {closeButtonNode}
      {children}
    </Dialog>
  );
};

CustomModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  disableAutoFocus: PropTypes.bool,
  closeButton: PropTypes.bool,
  children: PropTypes.node,
  maxWidth: PropTypes.string,
  drawerHeight: PropTypes.string,
  disableContentOverflowClip: PropTypes.bool,
};

export default CustomModal;
