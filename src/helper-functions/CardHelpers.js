import { store } from "redux/store";
import { getMarketProfile, DEFAULT_COUNTRY } from "utils/marketProfiles";

/**
 * Format a plain number (non-currency) using config's digit_after_decimal_point.
 * Safe against null / undefined / string / NaN inputs - returns "" for invalid values.
 *
 * @param {number|string|null|undefined} value
 * @param {number} [fallbackDecimals=2]  used when config is not yet loaded
 * @returns {string}
 */
export const formatNumber = (value, fallbackDecimals = 2) => {
  if (value == null || value === "") return "";
  const num = Number(value);
  if (isNaN(num)) return "";
  const { configData } = store?.getState()?.configData || {};
  const decimals = Number.parseInt(configData?.digit_after_decimal_point ?? fallbackDecimals);
  return num.toFixed(isNaN(decimals) ? fallbackDecimals : decimals);
};

// export const getAmountWithSign = (amount, needDecimal = true) => {
//   const stores = store?.getState();
//   const { configData } = stores?.configData || {};
//   let newAmount = needDecimal
//     ? ((amount * 100) / 100).toFixed(
//         Number.parseInt(configData?.digit_after_decimal_point)
//       )
//     : (amount * 100) / 100;
//   if (configData?.currency_symbol_direction === "left") {
//     return `${configData?.currency_symbol}${newAmount}`;
//   } else if (configData?.currency_symbol_direction === "right") {
//     return `${newAmount}${configData?.currency_symbol}`;
//   }
//   return amount;
// };

export const getAmountWithSign = (amount, needDecimal = true, country = null) => {
  if (amount == null || isNaN(Number(amount))) return "";

  const { configData } = store?.getState()?.configData || {};
  // Country-aware currency: resolve the active market so XOF markets show
  // whole CFA amounts and Nigeria shows naira, while Ghana keeps the cedi.
  const marketCountry = country || configData?.country || DEFAULT_COUNTRY;
  const profile = getMarketProfile(marketCountry);
  const decimals = profile?.decimal_places ?? configData?.digit_after_decimal_point ?? 2;
  const symbol = profile?.currency_symbol || configData?.currency_symbol || "";
  const direction = configData?.currency_symbol_direction || "left";

  // Function to format large numbers
  const formatLargeNumber = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 100_000) return (num / 1_000).toFixed(1) + "K";
    return needDecimal ? num.toFixed(decimals) : num;
  };

  // Format the amount
  const formattedAmount = formatLargeNumber(Number(amount));

  // Return amount with currency symbol
  return direction === "left" ? `${symbol}${formattedAmount}` : `${formattedAmount}${symbol}`;
};


export const getDiscountedAmount = (
  price,
  discount,
  discountType,
  storeDiscount,
  quantity
) => {
  let mainPrice = price;
  let q = quantity ? quantity : 1;
  if (discount > 0) {
    if (discountType === "amount") {
      mainPrice = price - discount * q;
    } else if (discountType === "percent" || discountType === "fixed") {
      mainPrice = price - (discount / 100) * price;
    }
  }
  
  
  return mainPrice;
};
export const getSelectedAddOn = (add_ons) => {
  let add_on = "";
  if (add_ons?.length > 0) {
    add_ons?.map((item, index) => {
      if (item?.isChecked) {
        add_on += `${index !== 0 ? ", " : ""}${item.name}`;
      }
    });
  }
  return add_on;
};

// export const getDiscountAmount = (
//   price,
//   discount,
//   discountType,
//   storeDiscount
// ) => {
//   //product wise discount
//   let mainPrice = price;
//
//   if (Number.parseInt(storeDiscount) === 0) {
//     if (discountType === "amount") {
//       mainPrice = discount;
//     } else if (discountType === "percent") {
//       mainPrice = price * (discount / 100);
//     }
//   } else {
//     if (discountType === "amount" || discountType === "fixed") {
//       mainPrice = storeDiscount;
//     } else if (discountType === "percent") {
//       mainPrice = price * (storeDiscount / 100);
//     }
//   }
//   return mainPrice;
// };
export const getReferDiscount = (
  totalAmountForRefer,
  refDiscount,
  refPercentage
) => {
  if (refPercentage === "percentage") {
    return (refDiscount / 100) * totalAmountForRefer;
  } else {
    return refDiscount;
  }
};
