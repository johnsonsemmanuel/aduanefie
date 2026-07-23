import React from "react";
import { Typography, Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import CustomTimeFormat from "../../date-and-time-formators/CustomTimeFormat";
import CustomAlert from "../../alert/CustomAlert";

const NotAvailableCard = ({ endTime, startTime, moduleType }) => {
  const { t } = useTranslation();
  return (
    <Box textAlign="center">
        <Stack spacing={1} alignItems="flex-start">
          <Typography
            color={(theme) => theme.palette.primary.main}
            variant="h5"
          >
            {t("Store is closed.")}
          </Typography>
        </Stack>
    </Box>
  );
};
export default NotAvailableCard;
