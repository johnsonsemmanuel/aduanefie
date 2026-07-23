import { alpha, InputBase, styled } from "@mui/material";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

export const Search = styled(CustomStackFullWidth)(({ theme, type2 }) => ({
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.neutral[200] : "#f2f2f2",
  color: theme.palette.neutral[600],
  height: "40px",
  border: type2
    ? `1px solid ${alpha(theme.palette.primary.main, 0.4)}`
    : "1px solid #e0e0e0",
  borderRadius: "9999px",
  transition: theme.transitions.create(["box-shadow", "border-color"], {
    duration: theme.transitions.duration.short,
  }),
}));

export const StyledInputBase = styled(InputBase)(
  ({ theme, language_direction }) => ({
    color: "primary.main",
    width: "100%",

    "& .MuiInputBase-input": {
      padding: "10px 10px",
      transition: theme.transitions.create("width"),
      width: "100%",
    },
  }),
);
