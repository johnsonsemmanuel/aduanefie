import styled from "@emotion/styled";
import { Box } from "@mui/system";

export const ActonButtonsSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "end",
  alignItems: "center",
  gap: "15px",
  backgroundColor: theme.palette.background.default,
  padding: ".75rem",
  borderRadius: "10px 0 0 10px",
}));

export const FormSection = styled(Box)(({ theme }) => ({}));
export const TitleTopSection = styled(Box)(({ theme }) => ({}));
