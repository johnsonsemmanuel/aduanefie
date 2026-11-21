import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import { useCreateGroupBuy } from "api-manage/hooks/react-query/group-buy/useGroupBuys";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const CreateGroupBuyDialog = ({ open, onClose, item, onCreated }) => {
  const [form, setForm] = useState({
    item_id: item?.id || "",
    target_value_ghs: 2000,
    member_limit: 5,
    destination_country: "",
  });
  const { mutate, isLoading } = useCreateGroupBuy();

  const update = (field) => (event) =>
    setForm((previous) => ({ ...previous, [field]: event.target.value }));

  const submit = () => {
    if (!form.item_id) {
      toast.error("Choose an item first.");
      return;
    }
    mutate(
      {
        item_id: Number(form.item_id),
        target_value_ghs: Number(form.target_value_ghs),
        member_limit: Number(form.member_limit),
        destination_country: form.destination_country || undefined,
      },
      {
        onSuccess: (group) => {
          toast.success("Group created. Share it with other buyers.");
          onCreated?.(group);
          onClose?.();
        },
        onError: onErrorResponse,
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Start a shared group buy</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            Pick a pooled target and how many people share it. ₵2,000 is only an
            example — use any amount that fits the item.
          </Typography>
          <TextField
            label="Item ID"
            type="number"
            size="small"
            fullWidth
            value={form.item_id}
            onChange={update("item_id")}
            disabled={Boolean(item?.id)}
            helperText={item?.name || "The product you want to buy together"}
          />
          <TextField
            label="Target value (GH₵)"
            type="number"
            size="small"
            fullWidth
            value={form.target_value_ghs}
            onChange={update("target_value_ghs")}
            inputProps={{ min: 1 }}
          />
          <TextField
            select
            label="Members"
            size="small"
            fullWidth
            value={form.member_limit}
            onChange={update("member_limit")}
          >
            {[2, 3, 4, 5, 6, 8, 10].map((count) => (
              <MenuItem key={count} value={count}>
                {count} people
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Destination country (optional)"
            size="small"
            fullWidth
            value={form.destination_country}
            onChange={update("destination_country")}
            inputProps={{ maxLength: 2 }}
            helperText="Two-letter code, e.g. NG for Nigeria. Leave blank for local delivery."
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button onClick={submit} variant="contained" disabled={isLoading}>
          {isLoading ? "Creating…" : "Create group"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGroupBuyDialog;
