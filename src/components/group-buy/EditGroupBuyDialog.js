import React, { useEffect, useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import { useUpdateGroupBuy } from "api-manage/hooks/react-query/group-buy/useGroupBuys";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import CustomModal from "components/modal";
import { TRADE_COUNTRIES } from "utils/tradeOptions";
import { MODAL_SELECT_MENU_PROPS } from "utils/modalDropdown";

const EditGroupBuyDialog = ({ open, onClose, group, onUpdated }) => {
  const [form, setForm] = useState({
    target_value_ghs: "",
    member_limit: 5,
    destination_country: "GH",
    notes: "",
  });
  const { mutate, isLoading } = useUpdateGroupBuy();

  // The dialog stays mounted while closed, so hydrate on every open rather
  // than relying on the initial useState value.
  useEffect(() => {
    if (!group?.id || !open) return;
    setForm({
      target_value_ghs: group.target_value_ghs || "",
      member_limit: group.member_limit || 5,
      destination_country: group.destination_country || "GH",
      notes: group.notes || "",
    });
  }, [group?.id, open]);

  const membersJoined = Number(group?.committed_count || 0) > 0;
  const update = (field) => (event) =>
    setForm((previous) => ({ ...previous, [field]: event.target.value }));

  const submit = () => {
    // Never send locked fields once members have joined. The backend rejects
    // the mere presence of a structural key in that state, even if unchanged.
    const payload = membersJoined
      ? { notes: form.notes || null }
      : {
          target_value_ghs: Number(form.target_value_ghs),
          member_limit: Number(form.member_limit),
          destination_country: form.destination_country,
          notes: form.notes || null,
        };

    mutate(
      {
        id: group.id,
        payload,
      },
      {
        onSuccess: (updated) => {
          toast.success("Group details updated.");
          onUpdated?.(updated);
          onClose?.();
        },
        onError: onErrorResponse,
      }
    );
  };

  return (
    <CustomModal
      openModal={open}
      handleClose={onClose}
      closeButton
      maxWidth="480px"
    >
      <DialogTitle>Edit group #{group?.id}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          {membersJoined && (
            <Typography variant="body2" color="text.secondary">
              Members have already joined. The target, member count and
              destination are locked so nobody's share changes unexpectedly.
              You can still update the notes.
            </Typography>
          )}
          <TextField
            label="Target value (₵)"
            type="number"
            size="small"
            fullWidth
            value={form.target_value_ghs}
            onChange={update("target_value_ghs")}
            inputProps={{ min: 1 }}
            disabled={membersJoined}
          />
          <TextField
            select
            label="Members"
            size="small"
            fullWidth
            value={form.member_limit}
            onChange={update("member_limit")}
            SelectProps={{ MenuProps: MODAL_SELECT_MENU_PROPS }}
            disabled={membersJoined}
          >
            {[2, 3, 4, 5, 6, 8, 10].map((count) => (
              <MenuItem key={count} value={count}>
                {count} people
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Destination country"
            size="small"
            fullWidth
            value={form.destination_country}
            onChange={update("destination_country")}
            SelectProps={{ MenuProps: MODAL_SELECT_MENU_PROPS }}
            disabled={membersJoined}
          >
            {TRADE_COUNTRIES.map((country) => (
              <MenuItem key={country.code} value={country.code}>
                {country.code === "GH"
                  ? `Ghana (${country.code}) - local delivery`
                  : `${country.name} (${country.code})`}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Notes for members"
            size="small"
            fullWidth
            multiline
            minRows={2}
            value={form.notes}
            onChange={update("notes")}
            placeholder="Optional collection point or timing details"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button onClick={submit} variant="contained" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save changes"}
        </Button>
      </DialogActions>
    </CustomModal>
  );
};

export default EditGroupBuyDialog;
