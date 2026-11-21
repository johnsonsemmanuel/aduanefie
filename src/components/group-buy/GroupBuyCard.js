import React from "react";
import { useRouter } from "next/router";
import { Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import PublicIcon from "@mui/icons-material/Public";

const money = (value) =>
  `GH₵ ${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const statusColor = (status) => {
  if (status === "open") return "primary";
  if (status === "locked") return "success";
  if (status === "fulfilled") return "success";
  return "default";
};

const GroupBuyCard = ({ group, onEdit }) => {
  const router = useRouter();
  const committed = Number(group.committed_count || 0);
  const limit = Number(group.member_limit || 5);
  const progress = Math.min(100, (committed / limit) * 100);

  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: "12px", height: "100%", display: "flex", flexDirection: "column" }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <GroupsIcon color="primary" fontSize="small" />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {group.item?.name || "Group buy"}
            </Typography>
          </Stack>
          <Chip size="small" color={statusColor(group.status)} label={group.status} />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {group.store?.name || "Store"}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
          <Chip size="small" variant="outlined" label={`Target ${money(group.target_value_ghs)}`} />
          <Chip size="small" variant="outlined" label={`${money(group.member_share_ghs ?? group.item_share_ghs)} each`} />
          {group.is_cross_border && (
            <Chip size="small" icon={<PublicIcon />} label={group.destination_country} />
          )}
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              {committed} of {limit} members
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {Math.max(0, limit - committed)} spots left
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={progress} sx={{ mt: 0.75, borderRadius: 4 }} />
        </Box>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Stack direction="row" spacing={1}>
          <Button
            fullWidth
            size="small"
            variant="contained"
            onClick={() => router.push(`/group-buys/${group.id}`)}
          >
            View group
          </Button>
          {group.is_organizer && group.status === "open" && onEdit && (
            <Button size="small" variant="outlined" onClick={() => onEdit(group)}>
              Edit
            </Button>
          )}
        </Stack>
      </Box>
    </Card>
  );
};

export default GroupBuyCard;
