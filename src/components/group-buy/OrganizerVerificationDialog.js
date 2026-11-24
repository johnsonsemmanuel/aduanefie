import React, { useState } from "react";
import {
  Alert,
  Button,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import CustomModal from "components/modal";
import {
  useGetOrganizerVerification,
  useSubmitOrganizerVerification,
} from "api-manage/hooks/react-query/group-buy/useGroupBuys";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import toast from "react-hot-toast";
import {
  getMarketProfile,
  getStoredCountry,
  normalizeCountry,
} from "utils/marketProfiles";

/**
 * Optional trust tier. Only the last four characters are sent; the app never
 * asks for a full identity document number or a document photo. The country's
 * market profile decides which document label and verification rules apply.
 */
const OrganizerVerificationDialog = ({ open, onClose }) => {
  const [last4, setLast4] = useState("");
  const { configData } = useSelector((state) => state.configData);
  const countryCode =
    normalizeCountry(configData?.country) || getStoredCountry() || "GH";
  const marketProfile = getMarketProfile(countryCode);

  const { data: verification, isLoading } = useGetOrganizerVerification(
    open,
    countryCode,
  );
  const { mutate: submit, isLoading: submitting } =
    useSubmitOrganizerVerification();

  const required = verification?.required_orders || 2;
  const completed = verification?.completed_external_orders || 0;
  const progress = Math.min(100, (completed / required) * 100);
  const status = verification?.status || "unverified";
  const identityLabel =
    verification?.identity_label || marketProfile?.identity?.label || "ID";
  const last4Label =
    verification?.identity_last4_label ||
    marketProfile?.identity?.last4_label ||
    `${identityLabel} last 4 characters`;
  const identityHint =
    verification?.identity_hint || marketProfile?.identity?.hint || "";
  const available =
    verification?.verification_available ??
    marketProfile?.identity?.verification_available ??
    true;

  const handleSubmit = () => {
    if (!/^[A-Za-z0-9]{4}$/.test(last4)) {
      toast.error(`Enter the last 4 characters of your ${identityLabel}.`);
      return;
    }
    submit(
      { identity_last4: last4.toUpperCase(), country_code: countryCode },
      {
        onSuccess: () => {
          toast.success("Reference submitted for review.");
          setLast4("");
          onClose?.();
        },
        onError: onErrorResponse,
      },
    );
  };

  return (
    <CustomModal openModal={open} handleClose={onClose} closeButton maxWidth="480px">
      <DialogTitle>Verified organiser badge</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Anyone can create a group. The badge is earned after an admin
            reviews your {identityLabel} reference and you have completed at
            least {` ${required} `}
            orders from other suppliers.
          </Typography>

          {isLoading ? (
            <Typography variant="body2" color="text.secondary">
              Checking your verification status...
            </Typography>
          ) : !available ? (
            <Alert severity="warning">
              Verification is not available in your country yet. The verified
              organiser badge is temporarily unavailable, and no weaker check
              will be used in its place.
            </Alert>
          ) : (
            <>
              <Stack spacing={0.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    Completed external orders
                  </Typography>
                  <Typography variant="caption">
                    {completed} of {required}
                  </Typography>
                </Stack>
                <LinearProgress variant="determinate" value={progress} />
              </Stack>

              {status === "verified" && verification?.verified && (
                <Alert severity="success">
                  Verified organiser. {identityLabel} ending{" "}
                  {verification.identity_last4 || verification.ghana_card_last4}.
                </Alert>
              )}
              {status === "pending" && (
                <Alert severity="info">
                  Your reference is awaiting admin review.
                </Alert>
              )}
              {status === "rejected" && (
                <Alert severity="warning">
                  {verification?.note ||
                    "The previous submission was not approved. You can submit again."}
                </Alert>
              )}
              {status === "unverified" && (
                <Alert severity="info">
                  No {identityLabel} reference submitted yet.
                </Alert>
              )}

              {!verification?.verified && (
                <>
                  <TextField
                    label={last4Label}
                    value={last4}
                    onChange={(event) =>
                      setLast4(
                        event.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 4),
                      )
                    }
                    inputProps={{ maxLength: 4, inputMode: "text" }}
                    helperText={identityHint}
                    fullWidth
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {status === "pending"
                      ? "Update reference"
                      : status === "rejected"
                        ? "Submit again"
                        : "Submit for review"}
                  </Button>
                </>
              )}
            </>
          )}
        </Stack>
      </DialogContent>
    </CustomModal>
  );
};

export default OrganizerVerificationDialog;
