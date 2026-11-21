import { alpha, Box, shadows, useTheme } from "@mui/system";
import { Typography } from "@mui/material";
import React from "react";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { TitleTopSection } from "./CustomStylesDeliveryman";

const DeliverymanFormWrapper = ({ title, component }) => {
  const theme = useTheme();
  return (
    <CustomBoxFullWidth
      sx={{
        bgcolor: (theme) => theme.palette.neutral[100],
        mt: "20px",
        borderRadius: "8px",
        boxShadow: shadows[1],
      }}
    >
      <TitleTopSection
        sx={{
          borderBottom: `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
          p: { xs: 1.2, sm: 2 },
        }}
      >
        <Typography
          fontSize={{ xs: "16px", sm: "18px" }}
          fontWeight="500"
          textAlign="left"
        >
          {title}
        </Typography>
      </TitleTopSection>
      <Box p={2} mt={2}>
        {component}
      </Box>
    </CustomBoxFullWidth>
  );
};

export default DeliverymanFormWrapper;
