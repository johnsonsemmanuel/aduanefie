import { useTheme } from "@emotion/react";
import { Clear } from "@mui/icons-material";
import { Box, Dialog, Drawer, Stack, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import { MOBILE_LAYOUT_MEDIA_QUERY } from "utils/breakpoints";

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
    blurBackdrop,
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
  const isMobile = useMediaQuery(MOBILE_LAYOUT_MEDIA_QUERY);

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
        slotProps={
          blurBackdrop
            ? {
                backdrop: {
                  sx: {
                    backdropFilter: "blur(16px)",
                    backgroundColor: "rgba(0, 0, 0, 0.55)",
                  },
                },
              }
            : undefined
        }
        PaperProps={{
          sx: {
            width: "calc(100% - 16px)",
            maxWidth: "540px",
            mx: "auto",
            mb: "calc(8px + env(safe-area-inset-bottom))",
            borderRadius: "18px",
            pt: 1,
            px: { xs: 1.5, sm: 2 },
            pb: 2,
            ...(disableContentOverflowClip
              ? { overflowY: "visible" }
              : { maxHeight: "85dvh", overflowY: "auto" }),
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
      slotProps={
        blurBackdrop
          ? {
              backdrop: {
                sx: {
                  backdropFilter: "blur(16px)",
                  backgroundColor: "rgba(0, 0, 0, 0.55)",
                },
              },
            }
          : undefined
      }
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
