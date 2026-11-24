import React, { useState } from "react";
import {
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CustomModal from "components/modal";
import { useInviteToGroupBuy } from "api-manage/hooks/react-query/group-buy/useGroupBuys";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import toast from "react-hot-toast";

const GroupBuyInviteDialog = ({ open, onClose, id, itemName }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { mutate: invite, isLoading } = useInviteToGroupBuy(id);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/group-buys/${id}`
      : `https://aduanefie.com/group-buys/${id}`;
  const whatsappText = `Join my Aduanefie Group Buy${
    itemName ? ` for ${itemName}` : ""
  } so we split the bulk price! Nobody pays until the group fills: ${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Group link copied!");
    } catch {
      toast.error("Could not copy link.");
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window !== "undefined") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(whatsappText)}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const handleSubmit = () => {
    invite(
      { email: email.trim(), message: message.trim() || null },
      {
        onSuccess: (response) => {
          toast.success(response?.message || "Invite sent.");
          setEmail("");
          setMessage("");
          onClose?.();
        },
        onError: onErrorResponse,
      }
    );
  };

  return (
    <CustomModal openModal={open} handleClose={onClose} closeButton maxWidth="480px">
      <DialogTitle>Share this group</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleWhatsAppShare}
              sx={{ bgcolor: "#25D366", color: "#fff", fontWeight: 700, "&:hover": { bgcolor: "#1EBE5B" } }}
            >
              Share on WhatsApp
            </Button>
            <Button fullWidth variant="outlined" onClick={handleCopyLink}>
              Copy link
            </Button>
          </Stack>
          <Divider>or invite by email</Divider>
          <Typography variant="body2" color="text.secondary">
            Enter a friend's email and we will send one invite to join this group
            {itemName ? ` for ${itemName}` : ""}.
          </Typography>
          <TextField
            label="Friend's email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
          />
          <TextField
            label="Message (optional)"
            value={message}
            onChange={(event) => setMessage(event.target.value.slice(0, 300))}
            multiline
            maxRows={3}
            inputProps={{ maxLength: 300 }}
            fullWidth
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading || !email.trim()}
          >
            {isLoading ? "Sending..." : "Send invite"}
          </Button>
        </Stack>
      </DialogContent>
    </CustomModal>
  );
};

export default GroupBuyInviteDialog;
