import React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useGetGroupBuyMembers } from "api-manage/hooks/react-query/group-buy/useGroupBuys";
import CustomModal from "components/modal";
import VerifiedBadge from "components/group-buy/VerifiedBadge";

const money = (value) =>
  value === null || value === undefined
    ? "Not set"
    : `₵ ${Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

const initials = (name) =>
  String(name || "M")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const GroupBuyMembers = ({ open, onClose, id }) => {
  const { data: members = [], isLoading, isError, refetch } =
    useGetGroupBuyMembers(id, open);

  return (
    <CustomModal
      openModal={open}
      handleClose={onClose}
      closeButton
      maxWidth="480px"
    >
      <DialogTitle>Group members</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Typography color="text.secondary">Loading members...</Typography>
        ) : isError ? (
          <Stack spacing={1}>
            <Typography color="error" variant="body2">
              Could not load the member list.
            </Typography>
            <Button size="small" onClick={() => refetch()}>Retry</Button>
          </Stack>
        ) : members.length === 0 ? (
          <Typography color="text.secondary">No members yet.</Typography>
        ) : (
          <Stack divider={<Divider flexItem />} spacing={0}>
            {members.map((member, index) => (
              <Stack
                key={member.participant_id || `organiser-${index}`}
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ py: 1.5 }}
              >
                <Avatar sx={{ width: 34, height: 34, fontSize: 13 }}>
                  {initials(member.name)}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {member.name}
                      {member.is_self ? " (you)" : ""}
                    </Typography>
                    {member.role === "organiser" && (
                      <Chip size="small" color="primary" label="Organiser" />
                    )}
                    {member.role === "organiser" && (
                      <VerifiedBadge trust={member.trust_badge} />
                    )}
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {member.share_units
                      ? `${member.share_units} units - ${money(member.item_share_ghs)}`
                      : "No share yet"}
                    {member.fulfillment_status
                      ? ` - ${member.fulfillment_status}`
                      : ""}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        )}
      </DialogContent>
    </CustomModal>
  );
};

export default GroupBuyMembers;
