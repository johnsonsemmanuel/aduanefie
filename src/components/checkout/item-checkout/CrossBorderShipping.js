import React from "react";
import {
  Box,
  CircularProgress,
  Radio,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { getAmountWithSign } from "helper-functions/CardHelpers";

// Human-readable reason for a quote that came back empty, so the customer is
// never left staring at an empty selector. The server only withholds an option
// when it cannot charge for it honestly (unconfigured lane, missing FX rate,
// missing customs rule), and those are worth saying out loud.
const warningText = (t, warnings = []) => {
  if (warnings.some((warning) => String(warning).startsWith("missing_fx"))) {
    return t(
      "Shipping is not available because the exchange rate for this lane is not configured.",
    );
  }
  if (warnings.some((warning) => String(warning).startsWith("no_customs_rule"))) {
    return t(
      "Import taxes for this destination are not configured, so this order cannot be priced yet.",
    );
  }
  return t("No shipping method is available for this destination yet.");
};

const formatEta = (t, estimatedDays) => {
  const min = estimatedDays?.min;
  const max = estimatedDays?.max;
  if (min && max) return t("{{min}}-{{max}} days", { min, max });
  if (max) return t("Up to {{max}} days", { max });
  if (min) return t("From {{min}} days", { min });
  return null;
};

const CrossBorderShipping = ({
  orderType,
  quote,
  selectedOption,
  setSelectedOption,
  isLoading,
  unsupportedReason,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (orderType !== "delivery") return null;

  const options = quote?.options ?? [];
  const selectedRateId = selectedOption?.shipping_rate_id ?? null;
  const destination = quote?.destination_country;

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: { xs: "10px", md: "14px" },
        boxShadow: `0 1px 4px ${alpha("#000", 0.06)}`,
        px: { xs: 2, md: 3 },
        py: { xs: 1.5, md: 2 },
      }}
    >
      <Stack spacing={{ xs: 1, md: 1.5 }} width="100%">
        <Stack spacing={0.25}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "14px", md: "16px" },
              color: theme.palette.text.primary,
            }}
          >
            {t("International Shipping")}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "11px", md: "12px" },
              color: theme.palette.text.secondary,
            }}
          >
            {destination
              ? t("Choose how this order should be shipped to {{country}}.", {
                  country: destination,
                })
              : t("Choose how this order should be shipped.")}
          </Typography>
        </Stack>

        {unsupportedReason ? (
          <Stack
            direction="row"
            alignItems="flex-start"
            gap={0.75}
            sx={{
              backgroundColor: alpha(theme.palette.error.main, 0.05),
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
              borderRadius: "10px",
              px: 1.5,
              py: 1,
            }}
          >
            <i
              className="fi fi-rr-info"
              style={{
                fontSize: 13,
                lineHeight: 1,
                display: "flex",
                marginTop: 2,
                color: theme.palette.error.dark,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: "11.5px", md: "12.5px" },
                lineHeight: 1.4,
                color: theme.palette.error.dark,
              }}
            >
              {unsupportedReason}
            </Typography>
          </Stack>
        ) : isLoading ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ py: 1 }}
          >
            <CircularProgress size={16} />
            <Typography
              sx={{
                fontSize: { xs: "11.5px", md: "12.5px" },
                color: theme.palette.text.secondary,
              }}
            >
              {t("Finding available shipping methods...")}
            </Typography>
          </Stack>
        ) : options.length === 0 ? (
          <Stack
            direction="row"
            alignItems="flex-start"
            gap={0.75}
            sx={{
              backgroundColor: alpha(theme.palette.warning.main, 0.05),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
              borderRadius: "10px",
              px: 1.5,
              py: 1,
            }}
          >
            <i
              className="fi fi-rr-info"
              style={{
                fontSize: 13,
                lineHeight: 1,
                display: "flex",
                marginTop: 2,
                color: theme.palette.warning.dark,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: "11.5px", md: "12.5px" },
                lineHeight: 1.4,
                color: theme.palette.warning.dark,
              }}
            >
              {warningText(t, quote?.warnings)}
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={{ xs: 1, md: 1.25 }} width="100%">
            {options.map((option) => {
              const isSelected =
                selectedRateId != null &&
                Number(selectedRateId) === Number(option.shipping_rate_id);
              const eta = formatEta(t, option.estimated_days);
              return (
                <Box
                  key={option.shipping_rate_id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedOption?.(option)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedOption?.(option);
                    }
                  }}
                  sx={{
                    cursor: "pointer",
                    border: `1px solid ${
                      isSelected
                        ? theme.palette.primary.main
                        : theme.palette.divider
                    }`,
                    borderRadius: "10px",
                    px: { xs: 1.25, md: 1.5 },
                    py: { xs: 1, md: 1.25 },
                    backgroundColor: isSelected
                      ? alpha(theme.palette.primary.main, 0.04)
                      : theme.palette.background.paper,
                    transition: "border-color 0.15s ease",
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    spacing={1}
                  >
                    <Radio
                      checked={isSelected}
                      size="small"
                      sx={{ p: 0.25, mt: 0.25 }}
                      inputProps={{
                        "aria-label": option.name,
                      }}
                    />
                    <Stack spacing={0.25} minWidth={0} flex={1}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        gap={1}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: "13px", md: "14px" },
                            color: theme.palette.text.primary,
                            wordBreak: "break-word",
                          }}
                        >
                          {option.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: { xs: "13px", md: "14px" },
                            color: theme.palette.text.primary,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getAmountWithSign(option.amount)}
                        </Typography>
                      </Stack>
                      {(option.mode || eta) && (
                        <Typography
                          sx={{
                            fontSize: { xs: "11px", md: "12px" },
                            color: theme.palette.text.secondary,
                            textTransform: "capitalize",
                          }}
                        >
                          {[option.mode, eta].filter(Boolean).join(" · ")}
                        </Typography>
                      )}
                      {option.landed_cost ? (
                        <Typography
                          sx={{
                            fontSize: { xs: "11px", md: "12px" },
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {t(
                            "Estimated landed cost incl. duty and taxes: {{amount}}",
                            {
                              amount: getAmountWithSign(
                                option.landed_cost.total,
                              ),
                            },
                          )}
                        </Typography>
                      ) : null}
                    </Stack>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default CrossBorderShipping;
