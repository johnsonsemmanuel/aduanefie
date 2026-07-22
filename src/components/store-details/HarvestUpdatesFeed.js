import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import { shadows } from "@mui/system";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import useGetFarmUpdates from "api-manage/hooks/react-query/farm/useGetFarmUpdates";
import { useTranslation } from "react-i18next";
import CustomImageContainer from "components/CustomImageContainer";
import ImageIcon from "@mui/icons-material/Image";

const HarvestUpdatesFeed = ({ storeId }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data, isLoading } = useGetFarmUpdates(storeId);

  const updates = data?.data ?? data ?? [];

  if (!storeId || (!isLoading && !updates?.length)) return null;

  return (
    <CustomStackFullWidth
      mt={2}
      sx={{
        backgroundColor: theme.palette.neutral[100],
        borderRadius: "8px",
        boxShadow: shadows[1],
        p: { xs: 1.5, sm: 2 },
      }}
    >
      <Typography fontSize="16px" fontWeight="600" mb={1.5}>
        {t("Harvest Updates")}
      </Typography>
      {isLoading ? (
        <Typography fontSize="14px" color="text.secondary">
          {t("Loading updates...")}
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {updates.map((update) => (
            <Box
              key={update?.id}
              sx={{
                p: 1.5,
                backgroundColor: theme.palette.background.paper,
                borderRadius: "8px",
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <Typography fontSize="14px" mb={update?.image ? 1 : 0}>
                {update?.message || update?.text || ""}
              </Typography>
              {update?.image && (
                <Box
                  sx={{
                    width: "100%",
                    maxHeight: "200px",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <CustomImageContainer
                    src={update?.image_full_url || update?.image}
                    width="100%"
                    height="200px"
                    objectFit="cover"
                    borderRadius="6px"
                  />
                </Box>
              )}
              {update?.created_at && (
                <Typography fontSize="11px" color="text.secondary" mt={0.5}>
                  {new Date(update.created_at).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>
      )}
    </CustomStackFullWidth>
  );
};

export default HarvestUpdatesFeed;
