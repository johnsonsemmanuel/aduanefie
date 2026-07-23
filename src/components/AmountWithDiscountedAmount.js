import { Typography } from "@mui/material";
import {
	getAmountWithSign,
	getDiscountedAmount,
} from "../helper-functions/CardHelpers";


const AmountWithDiscountedAmount = ({ item, noPrimaryColor }) => {
	const moduleWiseLayout = () => {
		return (
			<Typography
				variant="h5"
				display="flex"
				alignItems="center"
				flexWrap="wrap"
				gap="5px"
				sx={{
					fontSize: { xs: "13px", sm: "16px" },
					color: (theme) =>
						noPrimaryColor ? "inherit" : theme.palette.primary.main,
				}}
				component="h4"
			>
				{getDiscountedAmount(
					item?.price,
					item?.discount,
					item?.discount_type,
					item?.store_discount,
					item?.quantity
				) === item?.price ? (
					getAmountWithSign(
						getDiscountedAmount(
							item?.price,
							item?.discount,
							item?.discount_type,
							item?.store_discount,
							item?.quantity
						)
					)
				) : (
					<>
						{getAmountWithSign(
							getDiscountedAmount(
								item?.price,
								item?.discount,
								item?.discount_type,
								item?.store_discount,
								item?.quantity
							)
						)}
						<Typography
							fontWeight="400"
							color="text.secondary"
							sx={{ fontSize: { xs: "11px", sm: "12px" } }}
						>
							<del>{getAmountWithSign(item?.price)}</del>
						</Typography>
					</>
				)}
			</Typography>
		);
	};
	return <>{moduleWiseLayout()}</>;
};

AmountWithDiscountedAmount.propTypes = {};

export default AmountWithDiscountedAmount;
