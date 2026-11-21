import React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import { useTranslation } from "react-i18next";
import VerifiedBadge from "components/group-buy/VerifiedBadge";
import StatusBadge from "components/common/StatusBadge";
import { getAmountWithSign } from "helper-functions/CardHelpers";

const statusBadgeKey = (status) => {
  if (status === "locked" || status === "fulfilled") return "accepted";
  if (status === "cancelled" || status === "expired") return "canceled";
  return "pending";
};

const statusLabel = (status) => {
  if (status === "open") return "Ongoing";
  if (status === "locked") return "Complete";
  return status;
};

const GroupBuyCard = ({ group, onEdit }) => {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();

  const committed = Number(group.committed_count || 0);
  const limit = Number(group.member_limit || 5);
  const spotsLeft = Math.max(0, limit - committed);
  const progress = Math.min(100, Math.max(6, (committed / Math.max(1, limit)) * 100));
  const sharePrice = group.member_share_ghs ?? group.item_share_ghs ?? 0;
  const imgSrc =
    group.item?.image_full_url ||
    group.item?.image ||
    "/static/no-image-found.png";

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: "12px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 6px 18px ${alpha(theme.palette.primary.deep || "#67513A", 0.12)}`,
        },
      }}
    >
      {/* Product thumbnail header matching marketplace product cards */}
      <Box
        onClick={() => router.push(`/group-buys/${group.id}`)}
        sx={{
          position: "relative",
          height: { xs: 108, sm: 145 },
          bgcolor: theme.palette.background.secondary || "#EFE7D3",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <Box
          component="img"
          src={imgSrc}
          alt={group.item?.name || "Group buy"}
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <Box sx={{ position: "absolute", top: 6, left: 6 }}>
          <StatusBadge
            status={statusBadgeKey(group.status)}
            label={t(statusLabel(group.status))}
          />
        </Box>
        {group.is_cross_border && group.destination_country && (
          <Chip
            size="small"
            icon={<PublicIcon sx={{ fontSize: "13px !important", color: "#fff !important" }} />}
            label={group.destination_country}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              position: "absolute",
              top: 6,
              right: 6,
              height: 20,
              fontSize: "10.5px",
              fontWeight: 700,
              bgcolor: theme.palette.primary.deep || "#67513A",
              color: "#fff",
            }}
          />
        )}
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 1.5 },
          pb: { xs: 0.75, sm: 1 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography
              onClick={() => router.push(`/group-buys/${group.id}`)}
              sx={{
                fontWeight: 700,
                fontSize: { xs: "12.5px", sm: "14px" },
                color: theme.palette.text.primary,
                lineHeight: 1.25,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            >
              {group.item?.name || t("Group buy")}
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "inline-flex" }, flexShrink: 0 }}>
              <VerifiedBadge trust={group.organizer_trust} />
            </Box>
          </Stack>

          <Typography
            sx={{
              fontSize: { xs: "10.5px", sm: "12px" },
              color: theme.palette.text.secondary,
              mt: 0.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {group.store?.name || t("Verified Store")}
          </Typography>

          <Stack
            direction="row"
            alignItems="baseline"
            justifyContent="space-between"
            spacing={0.5}
            sx={{ mt: { xs: 0.75, sm: 1 } }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: "12.5px", sm: "14.5px" },
                color: theme.palette.primary.deep || "#67513A",
                whiteSpace: "nowrap",
              }}
            >
              {getAmountWithSign(sharePrice)}
              <Box
                component="span"
                sx={{
                  fontSize: { xs: "9.5px", sm: "11px" },
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  ml: 0.25,
                }}
              >
                /{t("ea")}
              </Box>
            </Typography>
            <Typography
              sx={{
                display: { xs: "none", sm: "block" },
                fontSize: "11px",
                color: theme.palette.text.secondary,
                whiteSpace: "nowrap",
              }}
            >
              {t("Pool")} {getAmountWithSign(group.target_value_ghs || 0)}
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ mt: { xs: 0.9, sm: 1.25 } }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.35 }}>
            <Typography
              sx={{
                fontSize: { xs: "10px", sm: "11px" },
                fontWeight: 600,
                color: theme.palette.primary.deep || "#67513A",
                whiteSpace: "nowrap",
              }}
            >
              {committed}/{limit} {t("joined")}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "10px", sm: "11px" },
                color: theme.palette.text.secondary,
                whiteSpace: "nowrap",
              }}
            >
              {spotsLeft} {t("left")}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: { xs: 5, sm: 6 },
              borderRadius: 4,
              bgcolor: alpha(theme.palette.primary.main || "#8B9F69", 0.18),
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                bgcolor: theme.palette.primary.main || "#8B9F69",
              },
            }}
          />
        </Box>
      </CardContent>

      <Box sx={{ px: { xs: 1, sm: 1.5 }, pb: { xs: 1, sm: 1.5 }, pt: 0.25 }}>
        <Stack direction="row" spacing={0.75}>
          <Button
            fullWidth
            size="small"
            variant="contained"
            onClick={() => router.push(`/group-buys/${group.id}`)}
            sx={{
              fontSize: { xs: "11.5px", sm: "13px" },
              py: { xs: 0.5, sm: 0.7 },
              borderRadius: "8px",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            {group.status === "open" ? t("Join / View") : t("View")}
          </Button>
          {group.is_organizer && group.status === "open" && onEdit && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => onEdit(group)}
              sx={{
                minWidth: "auto",
                px: { xs: 1, sm: 1.5 },
                fontSize: { xs: "11px", sm: "12.5px" },
                borderRadius: "8px",
                textTransform: "none",
              }}
            >
              {t("Edit")}
            </Button>
          )}
        </Stack>
      </Box>
    </Card>
  );
};

export default GroupBuyCard;
