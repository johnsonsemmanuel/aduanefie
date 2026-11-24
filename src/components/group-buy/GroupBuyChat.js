import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useGetGroupBuyMessages, useSendGroupBuyMessage } from "api-manage/hooks/react-query/group-buy/useGroupBuys";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import CustomModal from "components/modal";

const clock = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const GroupBuyChat = ({ open, onClose, id }) => {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);
  const { data: messages = [], isLoading, isError, refetch } =
    useGetGroupBuyMessages(id, open);
  const { mutate: send, isLoading: sending } = useSendGroupBuyMessage(id);

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages.length, open]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    send(text, {
      onSuccess: () => setDraft(""),
      onError: onErrorResponse,
    });
  };

  return (
    <CustomModal
      openModal={open}
      handleClose={onClose}
      closeButton
      maxWidth="520px"
      drawerHeight="80dvh"
    >
      <DialogTitle sx={{ pb: 1 }}>
        Group chat
        <Typography variant="caption" color="text.secondary" display="block">
          Only members of this group can see these messages.
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", p: 2, pt: 0 }}>
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            minHeight: 220,
            maxHeight: "48dvh",
            pr: 0.5,
          }}
        >
          {isLoading ? (
            <Typography color="text.secondary">Loading messages...</Typography>
          ) : isError ? (
            <Stack spacing={1}>
              <Typography color="error" variant="body2">
                Could not load the chat.
              </Typography>
              <Button size="small" onClick={() => refetch()}>Retry</Button>
            </Stack>
          ) : messages.length === 0 ? (
            <Stack spacing={0.5} sx={{ py: 3 }}>
              <Typography variant="body2" color="text.secondary">
                No messages yet.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Say hello and agree on a collection point with the group.
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={1.25}>
              {messages.map((message) => (
                <Stack
                  key={message.id}
                  direction="row"
                  justifyContent={message.is_self ? "flex-end" : "flex-start"}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.25,
                      maxWidth: "82%",
                      borderRadius: message.is_self
                        ? "12px 12px 2px 12px"
                        : "12px 12px 12px 2px",
                      bgcolor: message.is_self ? "primary.main" : "background.paper",
                      color: message.is_self ? "primary.contrastText" : "text.primary",
                    }}
                  >
                    {!message.is_self && (
                      <Typography variant="caption" sx={{ fontWeight: 700, display: "block" }}>
                        {message.sender_name}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      {message.body}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.75, display: "block", mt: 0.5, textAlign: "right" }}
                    >
                      {clock(message.created_at)}
                    </Typography>
                  </Paper>
                </Stack>
              ))}
              <div ref={bottomRef} />
            </Stack>
          )}
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: 2, alignItems: "flex-end" }}>
          <TextField
            fullWidth
            size="small"
            multiline
            maxRows={4}
            placeholder="Write a message"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={sending || !draft.trim()}
            sx={{ minWidth: 72, height: 40 }}
          >
            Send
          </Button>
        </Stack>
        <Chip
          size="small"
          variant="outlined"
          label="Updates every 8 seconds"
          sx={{ alignSelf: "flex-start", mt: 1 }}
        />
      </DialogContent>
    </CustomModal>
  );
};

export default GroupBuyChat;
