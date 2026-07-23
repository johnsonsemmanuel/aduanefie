import { Box, Typography } from "@mui/material";
import CustomContainer from "components/container";
import { useTranslation } from "react-i18next";

const MarketerRegistration = ({ configData }) => {
  const { t } = useTranslation();
  return (
    <CustomContainer>
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          {t("Marketer Registration")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("This feature is coming soon.")}
        </Typography>
      </Box>
    </CustomContainer>
  );
};

export default MarketerRegistration;
