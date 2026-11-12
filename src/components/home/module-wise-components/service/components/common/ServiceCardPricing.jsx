export const getServiceCardPricing = (item) => {
  const originalPrice = Number(item?.price ?? 0);
  const discount = Number(item?.discount ?? 0);
  let displayPrice = originalPrice;
  let discountText = null;

  if (discount > 0 && originalPrice > 0) {
    if (item?.discount_type === "percent") {
      displayPrice = Math.max(0, originalPrice - (originalPrice * discount) / 100);
      discountText = `-${discount}%`;
    } else {
      displayPrice = Math.max(0, originalPrice - discount);
      discountText = `-${discount}`;
    }
  }

  return {
    displayPrice,
    originalPrice,
    discountText,
  };
};
