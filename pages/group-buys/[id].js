import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Chip,
  CssBaseline,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CustomContainer from "components/container";
import MainLayout from "components/layout/MainLayout";
import SEO from "components/seo";
import { getGuestId } from "helper-functions/getToken";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import useAddCartItem from "api-manage/hooks/react-query/add-cart/useAddCartItem";
import {
  useGetGroupBuy,
  useGetGroupBuyQuote,
  useJoinGroupBuy,
  useLeaveGroupBuy,
} from "api-manage/hooks/react-query/group-buy/useGroupBuys";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { useDispatch } from "react-redux";
import { useGetConfigData } from "api-manage/hooks/useGetConfigData";
import { setConfigData } from "redux/slices/configData";
import toast from "react-hot-toast";

const money = (value) =>
  `GH₵ ${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const GroupBuyDetailPage = ({ configData }) => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();

  useEffect(() => {
    if (configData) dispatch(setConfigData(configData));
    else configRefetch();
  }, [configData, configRefetch, dispatch]);

  useEffect(() => {
    if (dataConfig) dispatch(setConfigData(dataConfig));
  }, [dataConfig, dispatch]);

  const effectiveConfig = configData || dataConfig;
  const [country, setCountry] = useState("");

  const { data: group, isLoading, refetch } = useGetGroupBuy(id);
  useEffect(() => {
    if (group?.destination_country) setCountry(group.destination_country);
  }, [group?.destination_country]);

  const { data: quote } = useGetGroupBuyQuote(
    id,
    country || group?.destination_country,
    Boolean(group?.is_cross_border)
  );
  const { mutate: join, isLoading: joining } = useJoinGroupBuy();
  const { mutate: leave, isLoading: leaving } = useLeaveGroupBuy();
  const { mutate: addToCart, isLoading: adding } = useAddCartItem();

  if (isLoading || !group) {
    return (
      <MainLayout configData={effectiveConfig}>
        <CustomContainer><Box sx={{ py: 5 }}><Typography>Loading group…</Typography></Box></CustomContainer>
      </MainLayout>
    );
  }

  const committed = Number(group.committed_count || 0);
  const limit = Number(group.member_limit || 5);
  const spotsLeft = Math.max(0, limit - committed);
  const isMember = Boolean(group.viewer);
  // The prescription checkout entry point is deliberately not group-aware.
  const pharmacyUnsupported = getCurrentModuleType() === "pharmacy";
  const canCheckout = group.status === "locked" && isMember && !pharmacyUnsupported;

  const actionOptions = {
    onSuccess: () => {
      toast.success("Updated");
      refetch();
    },
    onError: onErrorResponse,
  };

  const handleJoin = () =>
    join({ id, payload: { delivery_address: null } }, actionOptions);

  const handleCheckout = () => {
    addToCart(
      {
        postData: {
          guest_id: getGuestId(),
          model: "Item",
          add_on_ids: [],
          add_on_qtys: [],
          item_id: group.item_id,
          price: group.unit_price,
          quantity: group.share_units,
          variation: null,
        },
        store_id: group.store_id,
      },
      {
        onSuccess: () => router.push(`/checkout?group_buy_id=${id}`),
        onError: onErrorResponse,
      }
    );
  };

  return (
    <>
      <CssBaseline />
      <SEO
        title={`Group Buy #${group.id} | ${effectiveConfig?.business_name || "Aduanefie"}`}
        businessName={effectiveConfig?.business_name}
        configData={effectiveConfig}
      />
      <MainLayout configData={effectiveConfig}>
        <CustomContainer>
          <Box sx={{ py: { xs: 3, md: 5 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: 22, md: 28 } }}>
                Shared group buy #{group.id}
              </Typography>
              <Chip label={group.status} color={group.status === "locked" ? "success" : "primary"} />
            </Stack>

            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: "12px" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {group.item?.name || "Item"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {group.store?.name || "Store"}
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">
                        {committed} of {limit} members joined
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {spotsLeft} spots left
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (committed / limit) * 100)}
                      sx={{ mt: 1, borderRadius: 4 }}
                    />
                  </Box>

                  {group.status === "open" && (
                    <Alert severity="info" sx={{ mt: 3 }}>
                      Nobody is charged while the group is filling. If it does not
                      reach {limit} members, everyone is released automatically.
                    </Alert>
                  )}
                  {group.status === "locked" && (
                    <Alert severity="success" sx={{ mt: 3 }}>
                      The group is complete. Your share is ready for checkout.
                    </Alert>
                  )}
                  {["cancelled", "expired"].includes(group.status) && (
                    <Alert severity="warning" sx={{ mt: 3 }}>
                      This group did not complete. No payment was taken from any member.
                    </Alert>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={5}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: "12px" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Your share
                  </Typography>
                  <Stack spacing={1.25}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Pool target</Typography>
                      <Typography variant="body2">{money(group.target_value_ghs)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Effective unit price</Typography>
                      <Typography variant="body2">{money(group.unit_price)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Your units</Typography>
                      <Typography variant="body2">{group.share_units}</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Item share</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {money(group.member_share_ghs)}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Delivery is charged separately on your own order.
                    </Typography>
                  </Stack>

                  {group.is_cross_border && (
                    <Box sx={{ mt: 3 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        Cross-border pooled freight
                      </Typography>
                      {quote?.quote?.available ? (
                        <Stack spacing={0.5}>
                          {quote.quote.options.slice(0, 3).map((option) => (
                            <Stack key={option.shipping_rate_id} direction="row" justifyContent="space-between">
                              <Typography variant="caption">{option.name}</Typography>
                              <Typography variant="caption">
                                {money(option.amount)} · {option.estimated_days?.min}-{option.estimated_days?.max}d
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No shipping lane is configured for this destination yet.
                        </Typography>
                      )}
                    </Box>
                  )}

                  <Stack spacing={1} sx={{ mt: 3 }}>
                    {pharmacyUnsupported && (
                      <Alert severity="info">
                        Group buying is not available in the pharmacy module yet.
                      </Alert>
                    )}
                    {!isMember && group.status === "open" && !pharmacyUnsupported && (
                      <Button fullWidth variant="contained" onClick={handleJoin} disabled={joining}>
                        {joining ? "Joining…" : "Join this group"}
                      </Button>
                    )}
                    {isMember && group.status === "open" && (
                      <Button fullWidth variant="outlined" onClick={() => leave({ id }, actionOptions)} disabled={leaving}>
                        Leave group
                      </Button>
                    )}
                    {canCheckout && (
                      <Button fullWidth variant="contained" onClick={handleCheckout} disabled={adding}>
                        {adding ? "Preparing…" : "Checkout my share"}
                      </Button>
                    )}
                    {group.viewer?.participant_id && ["cancelled", "expired"].includes(group.status) && (
                      <Alert severity="success">Released — no payment was taken.</Alert>
                    )}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export const getServerSideProps = getCommonServerSideProps;
export default GroupBuyDetailPage;
