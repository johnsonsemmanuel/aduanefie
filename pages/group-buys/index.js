import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  CssBaseline,
  Grid,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomContainer from "components/container";
import MainLayout from "components/layout/MainLayout";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import SEO from "components/seo";
import GroupBuyCard from "components/group-buy/GroupBuyCard";
import CreateGroupBuyDialog from "components/group-buy/CreateGroupBuyDialog";
import EditGroupBuyDialog from "components/group-buy/EditGroupBuyDialog";
import { useGetGroupBuys, useGetMyGroupBuys } from "api-manage/hooks/react-query/group-buy/useGroupBuys";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { useDispatch } from "react-redux";
import { useGetConfigData } from "api-manage/hooks/useGetConfigData";
import { setConfigData } from "redux/slices/configData";
import { TRADE_COUNTRIES } from "utils/tradeOptions";

const GroupBuysPage = ({ configData }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();

  useEffect(() => {
    if (configData) dispatch(setConfigData(configData));
    else configRefetch();
  }, [configData, configRefetch, dispatch]);

  useEffect(() => {
    if (dataConfig) dispatch(setConfigData(dataConfig));
  }, [dataConfig, dispatch]);

  const effectiveConfig = configData || dataConfig;
  const [tab, setTab] = useState(0);
  const [status, setStatus] = useState("open");
  const [country, setCountry] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [prefillItem, setPrefillItem] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

  useEffect(() => {
    if (router.query.item_id) {
      setPrefillItem({ id: Number(router.query.item_id) });
      setCreateOpen(true);
    }
  }, [router.query.item_id]);

  const { data, isLoading, isError, refetch } = useGetGroupBuys({ status, country });
  const {
    data: mine,
    isLoading: mineLoading,
    isError: mineError,
    refetch: refetchMine,
  } = useGetMyGroupBuys(tab === 1);
  const groups = data?.data?.data || [];
  const myGroups = mine || [];

  return (
    <>
      <CssBaseline />
      <SEO
        title={`Shared Group Buying | ${effectiveConfig?.business_name || "Aduanefie"}`}
        businessName={effectiveConfig?.business_name}
        configData={effectiveConfig}
      />
      <MainLayout configData={effectiveConfig}>
        <SimpleMobileHeader title="Group Buys" backHref="/trade" />
        <CustomContainer>
          <Box sx={{ pt: { xs: 1.5, md: 3 }, pb: { xs: 3, md: 5 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: 22, md: 28 } }}>
                  Shared Group Buying
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Pool together to reach a bulk price. Five equal shares, your own
                  delivery, and no charge until the group is complete.
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
                Start a group
              </Button>
            </Stack>

            <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 3 }}>
              <Tab label="Discover groups" />
              <Tab label="My groups" />
            </Tabs>

            {tab === 0 ? (
              <>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
                  <TextField
                    select
                    size="small"
                    label="Status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    sx={{ minWidth: 160 }}
                  >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="locked">Complete</MenuItem>
                    <MenuItem value="all">All</MenuItem>
                  </TextField>
                  <TextField
                    select
                    size="small"
                    label="Destination"
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    sx={{ minWidth: 200 }}
                  >
                    <MenuItem value="">All destinations</MenuItem>
                    {TRADE_COUNTRIES.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                {isLoading ? (
                  <Typography color="text.secondary">Loading groups…</Typography>
                ) : isError ? (
                  <Alert
                    severity="error"
                    action={<Button size="small" onClick={() => refetch()}>Retry</Button>}
                  >
                    Could not load shared buying groups.
                  </Alert>
                ) : groups.length ? (
                  <Grid container spacing={2}>
                    {groups.map((group) => (
                      <Grid item xs={12} sm={6} md={4} key={group.id}>
                        <GroupBuyCard group={group} onEdit={setEditingGroup} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography color="text.secondary">
                    No groups here yet. Start one and share it with other buyers.
                  </Typography>
                )}
              </>
            ) : mineLoading ? (
              <Typography color="text.secondary">Loading your groups…</Typography>
            ) : mineError ? (
              <Alert
                severity="error"
                action={<Button size="small" onClick={() => refetchMine()}>Retry</Button>}
              >
                Could not load your groups.
              </Alert>
            ) : myGroups.length ? (
              <Grid container spacing={2}>
                {myGroups.map((group) => (
                  <Grid item xs={12} sm={6} md={4} key={group.id}>
                    <GroupBuyCard group={group} onEdit={setEditingGroup} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="text.secondary">You have not joined a group yet.</Typography>
            )}
          </Box>
        </CustomContainer>
      </MainLayout>

      <CreateGroupBuyDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        item={prefillItem}
      />
      {editingGroup && (
        <EditGroupBuyDialog
          open={Boolean(editingGroup)}
          onClose={() => setEditingGroup(null)}
          group={editingGroup}
          onUpdated={() => {
            refetch();
            refetchMine();
          }}
        />
      )}
    </>
  );
};

export const getServerSideProps = getCommonServerSideProps;
export default GroupBuysPage;
