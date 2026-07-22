import { useMemo, useState } from "react";
import {
  Box,
  Card,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import useGetMarketerDashboard from "api-manage/hooks/react-query/marketer/useGetMarketerDashboard";
import useGetMarketerReferrals from "api-manage/hooks/react-query/marketer/useGetMarketerReferrals";
import CustomPagination from "components/custom-pagination";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

const MarketerDashboard = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: dashboardData, isLoading: dashboardLoading } = useGetMarketerDashboard();
  const { data: referralsData, isLoading: referralsLoading } = useGetMarketerReferrals();

  const dashboard = dashboardData?.data ?? dashboardData;
  const referrals = referralsData?.data?.referrals ?? referralsData?.referrals ?? [];

  const stats = useMemo(() => {
    const safe = dashboard || {};
    return [
      {
        label: t("Total Referrals"),
        value: safe.total_referrals ?? safe.referral_count ?? 0,
        color: theme.palette.primary.main,
      },
      {
        label: t("Total Earnings"),
        value: `${getAmountWithSign(safe.total_earnings ?? safe.earnings ?? 0)}`,
        color: theme.palette.success.main,
      },
      {
        label: t("Pending Payout"),
        value: `${getAmountWithSign(safe.pending_payout ?? safe.pending_commission ?? 0)}`,
        color: theme.palette.warning.main,
      },
      {
        label: t("Paid Out"),
        value: `${getAmountWithSign(safe.paid_out ?? safe.total_paid ?? 0)}`,
        color: theme.palette.info.main,
      },
    ];
  }, [dashboard, theme, t]);

  const [page, setPage] = useState(1);
  const [pageLimit] = useState(10);
  const paginatedReferrals = referrals.slice((page - 1) * pageLimit, page * pageLimit);

  return (
    <CustomStackFullWidth spacing={3}>
      <Typography fontSize="20px" fontWeight="700">
        {t("Marketer Dashboard")}
      </Typography>

      <Grid container spacing={2}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "12px",
              }}
            >
              <Typography fontSize="12px" color="text.secondary" mb={0.5}>
                {stat.label}
              </Typography>
              <Typography fontSize="22px" fontWeight="700" color={stat.color}>
                {stat.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography fontSize="16px" fontWeight="600">
            {t("Recent Referrals")}
          </Typography>
        </Box>
        {referralsLoading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">{t("Loading...")}</Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size={isSmall ? "small" : "medium"}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.neutral[100] }}>
                    <TableCell>{t("Customer")}</TableCell>
                    <TableCell>{t("Store")}</TableCell>
                    <TableCell>{t("Date")}</TableCell>
                    <TableCell align="right">{t("Commission")}</TableCell>
                    <TableCell align="center">{t("Status")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedReferrals.map((item) => (
                    <TableRow key={item?.id} hover>
                      <TableCell>{item?.customer_name ?? item?.customer?.name ?? "-"}</TableCell>
                      <TableCell>{item?.store_name ?? "-"}</TableCell>
                      <TableCell>
                        {item?.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell align="right">{getAmountWithSign(item?.commission ?? 0)}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={t(item?.status ?? "pending")}
                          size="small"
                          color={
                            item?.status === "paid"
                              ? "success"
                              : item?.status === "pending"
                              ? "warning"
                              : "default"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {referrals.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary" py={3}>
                          {t("No referrals yet")}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {referrals.length > pageLimit && (
              <Box sx={{ display: "flex", justifyContent: "center", pb: 2, pt: 1 }}>
                <CustomPagination
                  total_size={referrals.length}
                  page_limit={pageLimit}
                  offset={page}
                  setOffset={setPage}
                />
              </Box>
            )}
          </>
        )}
      </Card>
    </CustomStackFullWidth>
  );
};

export default MarketerDashboard;
