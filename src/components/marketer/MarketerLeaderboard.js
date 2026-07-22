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
import useGetMarketerLeaderboard from "api-manage/hooks/react-query/marketer/useGetMarketerLeaderboard";
import CustomPagination from "components/custom-pagination";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

const MarketerLeaderboard = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const { data, isLoading } = useGetMarketerLeaderboard();

  const leaderboard = useMemo(() => {
    const list = data?.data?.leaderboard ?? data?.leaderboard ?? [];
    return Array.isArray(list) ? list : [];
  }, [data]);

  const [page, setPage] = useState(1);
  const [pageLimit] = useState(20);
  const paginated = leaderboard.slice((page - 1) * pageLimit, page * pageLimit);

  const getRankColor = (rank) => {
    if (rank === 1) return theme.palette.warning.main;
    if (rank === 2) return theme.palette.neutral[400];
    if (rank === 3) return theme.palette.warning.dark;
    return theme.palette.text.secondary;
  };

  return (
    <CustomStackFullWidth spacing={3}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <EmojiEventsRoundedIcon sx={{ fontSize: 28, color: theme.palette.primary.main }} />
        <Typography fontSize="20px" fontWeight="700">
          {t("Marketer Leaderboard")}
        </Typography>
      </Stack>

      {isLoading ? (
        <Card sx={{ p: 4, textAlign: "center", border: `1px solid ${theme.palette.divider}` }}>
          <Typography color="text.secondary">{t("Loading...")}</Typography>
        </Card>
      ) : (
        <>
          <Grid container spacing={2}>
            {paginated.map((item, idx) => {
              const rank = (page - 1) * pageLimit + idx + 1;
              return (
                <Grid item xs={12} sm={6} md={4} key={item?.id}>
                  <Card
                    sx={{
                      p: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: rank <= 3 ? getRankColor(rank) : theme.palette.neutral[100],
                        color: rank <= 3 ? theme.palette.whiteContainer.main : theme.palette.text.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "16px",
                      }}
                    >
                      {rank <= 3 && <EmojiEventsRoundedIcon sx={{ fontSize: 20 }} />}
                      {rank > 3 && rank}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item?.name ?? item?.marketer_name ?? `Marketer #${item?.id}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t("Referrals")}: {item?.referral_count ?? item?.total_referrals ?? 0}
                      </Typography>
                    </Box>
                    <Chip
                      label={getAmountWithSign(item?.total_earnings ?? item?.earnings ?? 0)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Card>
                </Grid>
              );
            })}
            {leaderboard.length === 0 && (
              <Grid item xs={12}>
                <Card sx={{ p: 4, textAlign: "center", border: `1px solid ${theme.palette.divider}` }}>
                  <Typography color="text.secondary">{t("No leaderboard data yet")}</Typography>
                </Card>
              </Grid>
            )}
          </Grid>
          {leaderboard.length > pageLimit && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CustomPagination
                total_size={leaderboard.length}
                page_limit={pageLimit}
                offset={page}
                setOffset={setPage}
              />
            </Box>
          )}
        </>
      )}
    </CustomStackFullWidth>
  );
};

export default MarketerLeaderboard;
