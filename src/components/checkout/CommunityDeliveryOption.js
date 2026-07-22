import { useEffect, useState } from "react";
import { Box, Radio, Stack, Typography, alpha, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import usePostCommunityDeliveryCheck from "api-manage/hooks/react-query/checkout/usePostCommunityDeliveryCheck";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import PeopleIcon from "@mui/icons-material/People";

const CommunityDeliveryOption = ({
  address,
  zoneData,
  selectedDeliveryOption,
  setSelectedDeliveryOption,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [communityDelivery, setCommunityDelivery] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const deliveryAddressId = address?.id;
  const zoneId = zoneData?.data?.zone_id ?? zoneData?.zone_id;

  const { mutateAsync } = usePostCommunityDeliveryCheck();

  useEffect(() => {
    if (!deliveryAddressId || !zoneId) {
      setIsAvailable(false);
      setCommunityDelivery(null);
      return;
    }
    let cancelled = false;
    const check = async () => {
      setIsLoading(true);
      try {
        const res = await mutateAsync({
          delivery_address_id: deliveryAddressId,
          zone_id: zoneId,
        });
        if (!cancelled) {
          setCommunityDelivery(res?.data ?? res);
          setIsAvailable(Boolean(res?.available ?? res?.data?.available));
        }
      } catch (err) {
        if (!cancelled) {
          setIsAvailable(false);
          setCommunityDelivery(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [deliveryAddressId, zoneId, mutateAsync]);

  const handleSelect = () => {
    if (!isAvailable || !communityDelivery) return;
    setSelectedDeliveryOption({
      id: `community-${communityDelivery.zone_id || "delivery"}`,
      deliveryType: "community_delivery",
      surcharge: Number(communityDelivery.fee) || 0,
      communityDelivery,
    });
  };

  const isSelected =
    selectedDeliveryOption?.deliveryType === "community_delivery";

  if (!isAvailable && !isLoading) return null;

  return (
    <Box
      sx={{
        width: "100%",
        mt: 1,
        backgroundColor: theme.palette.background.paper,
        borderRadius: { xs: "10px", md: "14px" },
        boxShadow: `0 1px 4px ${alpha("#000", 0.06)}`,
        px: { xs: 2, md: 3 },
        py: { xs: 1.5, md: 2 },
        opacity: isLoading ? 0.7 : 1,
        pointerEvents: isLoading ? "none" : "auto",
      }}
    >
      <Stack
        direction="column"
        alignItems="stretch"
        justifyContent="space-between"
        gap={{ xs: 1.5, md: 2 }}
        width="100%"
      >
        <Stack spacing={0.25}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "14px", md: "16px" },
              color: theme.palette.text.primary,
            }}
          >
            {t("Community Delivery")}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "11px", md: "12px" },
              color: theme.palette.text.secondary,
            }}
          >
            {t("Delivered by a trusted community agent in your neighbourhood")}
          </Typography>
        </Stack>

        <Box
          role="button"
          onClick={handleSelect}
          sx={{
            width: { xs: "100%", sm: "auto" },
            cursor: isAvailable ? "pointer" : "default",
            border: `1px solid ${
              isSelected
                ? theme.palette.primary.main
                : theme.palette.divider
            }`,
            borderRadius: "10px",
            px: { xs: 1.25, md: 1.5 },
            py: { xs: 1, md: 1.25 },
            backgroundColor: theme.palette.background.paper,
            transition: "border-color 0.15s ease",
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
          >
            <Stack direction="row" alignItems="center" spacing={1} flex={1}>
              <PeopleIcon
                sx={{
                  fontSize: { xs: "18px", md: "20px" },
                  color: theme.palette.primary.main,
                }}
              />
              <Stack spacing={0.25} minWidth={0} flex={1}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "13px", md: "14px" },
                    color: theme.palette.text.primary,
                    wordBreak: "break-word",
                  }}
                >
                  {t("Community Delivery")}
                </Typography>
                {communityDelivery?.eta && (
                  <Typography
                    sx={{
                      fontSize: { xs: "11px", md: "12px" },
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {t("ETA")}: {communityDelivery.eta}
                  </Typography>
                )}
                {communityDelivery?.fee != null && (
                  <Typography
                    sx={{
                      fontSize: { xs: "12px", md: "13px" },
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                    }}
                  >
                    {getAmountWithSign(Number(communityDelivery.fee))}
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Radio
              checked={isSelected}
              value="community_delivery"
              onChange={handleSelect}
              size={isSmall ? "small" : "medium"}
              sx={{
                padding: 0,
                color: theme.palette.divider,
                "&.Mui-checked": {
                  color: theme.palette.primary.main,
                },
              }}
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default CommunityDeliveryOption;
