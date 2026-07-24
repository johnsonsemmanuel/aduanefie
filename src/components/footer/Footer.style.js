import { Box, alpha, styled } from "@mui/material";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
export const StyledFooterBackground = styled(Box)(
	({ theme, nobottommargin }) => ({
		//minHeight: '500px',
		width: "100%",
		backgroundColor: theme.palette.background.custom4,
		borderRadius:'20px 20px 0 0',
		marginTop:'-16px',
		[theme.breakpoints.down("md")]: {
			marginBottom: nobottommargin === "true" ? "none" : "70px",
		},
	})
);

export const StyledFooterTop = styled(CustomStackFullWidth)(({ theme }) => ({
	backgroundColor: alpha(theme.palette.primary.main, 0.1),
	width: "100%",
	[theme.breakpoints.down("md")]: {
		paddingBottom:"20px"
	},
}));
