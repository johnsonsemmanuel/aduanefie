import React from "react";
import { WrapperForCustomDialogConfirm } from "components/custom-dialog/confirm/CustomDialogConfirm.style";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import DialogTitle from "@mui/material/DialogTitle";
import { alpha, Button, Typography, useTheme } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { t } from "i18next";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { CssTextField } from "components/chat/ChatMessageAdd";
import { PrimaryButton } from "components/Map/map.style";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import CustomMessageReasonBox from "components/my-orders/order-details/other-order/CustomMessageReasonBox";

const formatWhatsAppNumber = (rawPhone) => {
  const digits = String(rawPhone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0") && digits.length === 10) {
    return `233${digits.slice(1)}`;
  }
  return digits;
};

const ChatWithAdmin = ({ automateMessageData, orderID, isBooking }) => {
  const theme = useTheme();
  const router = useRouter();
  const { configData } = useSelector((state) => state.configData);
  const supportWhatsApp = formatWhatsAppNumber(configData?.phone);
  // The automated reasons are order/product-specific (admin-configured for the
  // commerce flow) - for service-module bookings show only the custom message.
  const reasonList = isBooking ? [] : automateMessageData;
  const [selected, setSelected] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [text, setText] = React.useState("");

  const handleClick = (item) => {
    setSelected(item?.id === selected ? false : item?.id);
    setValue(item?.id === selected ? "" : item?.message);
  };
  const handleChange = (e) => {
    setText(e.target.value);
  };
  const handleSubmit = () => {
    router.push({
      pathname: "/profile",
      query: {
        page: "inbox",
        type: "admin",
        id: "admin",
        routeName: "admin_id",
        chatFrom: "true",
        text: `${value}${text}`,
        orderId: orderID,
        // deliveryman_name: storeData?.name,
        // deliveryManData_image: storeData?.logo_full_url,
      },
    });
  };

  return (
    <WrapperForCustomDialogConfirm
      smwidth="20rem"
      width="30rem"
      sx={{ paddingTop: "0px" }}
    >
      <CustomStackFullWidth spacing={1}>
        {reasonList?.length > 0 && (
          <DialogTitle
            id="alert-dialog-title"
            sx={{ padding: "0px 24px 10px 24px" }}
          >
            <Typography textAlign="center" fontSize="14px" fontWeight="500">
              {t("Select the Reason for Support")}
            </Typography>
          </DialogTitle>
        )}

        <DialogContent
          sx={{
            padding: {
              xs: "10px 10px",
              md: "10px 24px",
            },
          }}
        >
          <CustomStackFullWidth spacing={2}>
            <CustomMessageReasonBox
              selected={selected}
              handleClick={handleClick}
              automateMessageData={reasonList}
            />
            {reasonList?.length > 0 ? (
              <Typography textAlign="center" fontSize="14px" fontWeight="500">
                {t("Or Custom Message")}
              </Typography>
            ) : (
              <Typography textAlign="center" fontSize="14px" fontWeight="500">
                {t("Custom Message")}
              </Typography>
            )}

            <CssTextField
              border
              // disabled={disabled}
              fullWidth
              onChange={handleChange}
              // onKeyUp={handleKeyUp}
              placeholder={t("Type here to write a custom message")}
              value={text}
              size="small"
              multiline
              height="80px"
            />
            <PrimaryButton
              disabled={value === "" && text === ""}
              onClick={handleSubmit}
            >
              {t("Send Message")}
            </PrimaryButton>
            {supportWhatsApp && (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<WhatsAppIcon />}
                component="a"
                href={`https://wa.me/${supportWhatsApp}?text=${encodeURIComponent(
                  `Hi Aduanefie, I need help with ${isBooking ? "Booking" : "Order"} #${orderID || ""}${
                    value || text ? ` — ${[value, text].filter(Boolean).join(" ")}` : ""
                  }`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderColor: "#25D366",
                  color: "#128C7E",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "8px",
                  "&:hover": {
                    borderColor: "#128C7E",
                    bgcolor: alpha("#25D366", 0.08),
                  },
                }}
              >
                {t("Chat on WhatsApp")}
              </Button>
            )}
          </CustomStackFullWidth>
        </DialogContent>
      </CustomStackFullWidth>
    </WrapperForCustomDialogConfirm>
  );
};

export default ChatWithAdmin;
