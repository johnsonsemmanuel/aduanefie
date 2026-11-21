import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Chip,
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
import { getModuleId } from "helper-functions/getModuleId";
import { useDispatch, useSelector } from "react-redux";
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
  const selectedModule = useSelector((state) => state.utilsData?.selectedModule);
  const activeModuleId = router.query.module_id || selectedModule?.id || getModuleId() || "";
  const activeModuleName = selectedModule?.module_name || "Current Marketplace";
  const [scopeToModule, setScopeToModule] = useState(Boolean(router.query.module_id));
  const [tab, setTab] = useState(0);
  const [status, setStatus] = useState("open");
  const [country, setCountry] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [prefillItem, setPrefillItem] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

  useEffect(() => {
    if (router.query.module_id) {
      setScopeToModule(true);
    }
  }, [router.query.module_id]);

  useEffect(() => {
    if (router.query.item_id) {
      setPrefillItem({ id: Number(router.query.item_id) });
      setCreateOpen(true);
    }
  }, [router.query.item_id]);

  const { data, isLoading, isError, refetch } = useGetGroupBuys({
    status,
    country,
    moduleId: scopeToModule && activeModuleId ? activeModuleId : undefined,
  });
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
        <SimpleMobileHeader title="Group Buys" backHref="/home" />
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
                <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1.25} sx={{ mb: 2.5 }}>
                  {activeModuleId && (
                    <Chip
                      clickable
                      size="small"
                      label={scopeToModule ? activeModuleName : "All Marketplaces"}
                      color={scopeToModule ? "primary" : "default"}
                      variant={scopeToModule ? "filled" : "outlined"}
                      onClick={() => setScopeToModule((prev) => !prev)}
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                  <TextField
                    select
                    size="small"
                    label="Status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    sx={{ minWidth: { xs: 120, sm: 150 } }}
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
                    sx={{ minWidth: { xs: 150, sm: 190 } }}
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
                  <Grid container spacing={{ xs: 1.25, sm: 2 }}>
                    {groups.map((group) => (
                      <Grid item xs={6} sm={6} md={4} key={group.id}>
                        <GroupBuyCard group={group} onEdit={setEditingGroup} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: "12px",
                      border: "1px dashed",
                      borderColor: "divider",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                      No matching group buys right now
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                      Start the first group for this marketplace or browse all marketplaces.
                    </Typography>
                    <Stack direction="row" justifyContent="center" spacing={1} flexWrap="wrap" useFlexGap>
                      <Button size="small" variant="contained" onClick={() => setCreateOpen(true)}>
                        Start a group
                      </Button>
                      {(scopeToModule || country || status !== "all") && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setScopeToModule(false);
                            setCountry("");
                            setStatus("all");
                          }}
                        >
                          Show all marketplaces
                        </Button>
                      )}
                    </Stack>
                  </Box>
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
              <Grid container spacing={{ xs: 1.25, sm: 2 }}>
                {myGroups.map((group) => (
                  <Grid item xs={6} sm={6} md={4} key={group.id}>
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
