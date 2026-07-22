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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import useGetAgentEarnings from "api-manage/hooks/react-query/community-agent/useGetAgentEarnings";
import CustomPagination from "components/custom-pagination";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { useSelector } from "react-redux";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomPaperBigCard from "styled-components/CustomStyles.style";

const CommunityAgentEarnings = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { profileInfo } = useSelector((state) => state.profileInfo);

  const [page, setPage] = useState(1);
  const [pageLimit] = useState(10);

  const agentId = profileInfo?.id;
  const { data, isLoading } = useGetAgentEarnings({
    agent_id: agentId,
    offset: (page - 1) * pageLimit,
    limit: pageLimit,
  });

  const earnings = data?.data?.earnings ?? data?.earnings ?? [];
  const totalDeliveries = data?.data?.total_deliveries ?? data?.total_deliveries ?? earnings.length;
  const totalEarnings = data?.data?.total_earnings ?? data?.total_earnings ?? 0;
  const totalSize = data?.data?.total_size ?? data?.total_size ?? 0;

  const summaryCards = useMemo(() => [
    {
      label: t("Total Deliveries"),
      value: totalDeliveries,
      color: theme.palette.primary.main,
    },
    {
      label: t("Total Earnings"),
      value: `${getAmountWithSign(totalEarnings)}`,
      color: theme.palette.success.main,
    },
    {
      label: t("Avg. per Delivery"),
      value: totalDeliveries > 0 ? `${getAmountWithSign(Number(totalEarnings) / totalDeliveries)}` : "0.00",
      color: theme.palette.info.main,
    },
  ], [totalDeliveries, totalEarnings, theme, t]);

  return (
    <CustomStackFullWidth spacing={3}>
      <Typography fontSize="20px" fontWeight="700">
        {t("Community Agent Earnings")}
      </Typography>

      <Grid container spacing={2}>
        {summaryCards.map((card, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <CustomPaperBigCard
              padding="20px"
              noboxshadow=""
              sx={{
                textAlign: "center",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography fontSize="12px" color="text.secondary" mb={0.5}>
                {card.label}
              </Typography>
              <Typography fontSize="22px" fontWeight="700" color={card.color}>
                {card.value}
              </Typography>
            </CustomPaperBigCard>
          </Grid>
        ))}
      </Grid>

      <CustomPaperBigCard
        padding="0"
        noboxshadow=""
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography fontSize="16px" fontWeight="600">
            {t("Earnings History")}
          </Typography>
        </Box>
        {isLoading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">{t("Loading...")}</Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size={isSmall ? "small" : "medium"}>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: theme.palette.neutral[100],
                    }}
                  >
                    <TableCell>{t("Order ID")}</TableCell>
                    <TableCell>{t("Date")}</TableCell>
                    <TableCell>{t("Store")}</TableCell>
                    <TableCell align="right">{t("Fee (GHS)")}</TableCell>
                    <TableCell align="right">{t("Commission")}</TableCell>
                    <TableCell align="center">{t("Status")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {earnings.map((item) => (
                    <TableRow key={item?.id} hover>
                      <TableCell>{item?.order_id ?? "-"}</TableCell>
                      <TableCell>
                        {item?.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>{item?.store_name ?? "-"}</TableCell>
                      <TableCell align="right">
                        {getAmountWithSign(item?.delivery_fee ?? 0)}
                      </TableCell>
                      <TableCell align="right">
                        {getAmountWithSign(item?.commission ?? 0)}
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          fontSize="12px"
                          fontWeight="600"
                          color={
                            item?.status === "paid"
                              ? theme.palette.success.main
                              : item?.status === "pending"
                              ? theme.palette.warning.main
                              : theme.palette.text.secondary
                          }
                        >
                          {t(item?.status ?? "pending")}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {earnings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary" py={3}>
                          {t("No earnings yet")}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {totalSize > pageLimit && (
              <Box sx={{ display: "flex", justifyContent: "center", pb: 2, pt: 1 }}>
                <CustomPagination
                  total_size={totalSize}
                  page_limit={pageLimit}
                  offset={page}
                  setOffset={setPage}
                />
              </Box>
            )}
          </>
        )}
      </CustomPaperBigCard>
    </CustomStackFullWidth>
  );
};

export default CommunityAgentEarnings;
