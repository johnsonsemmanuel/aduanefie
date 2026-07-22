import { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";

const RecipeCard = ({ recipe, onSave, isSaved, onClick }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const imageUrl = recipe?.image_url || recipe?.thumbnail || recipe?.image || "/images/recipe-placeholder.png";
  const title = recipe?.title || recipe?.name || t("Untitled Recipe");
  const description = recipe?.description || recipe?.short_description || "";
  const prepTime = recipe?.preparation_time || recipe?.prep_time || "";
  const servings = recipe?.servings || recipe?.serving_size || "";
  const rating = recipe?.avg_rating || recipe?.rating || 0;

  const cardContent = useMemo(
    () => ({
      "&:last-child": {
        pb: isSmall ? "12px" : "16px",
      },
    }),
    [isSmall]
  );

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        boxShadow:
          "0px 4px 16px 0px rgba(17, 24, 39, 0.06), 0px 1px 2px 0px rgba(17, 24, 39, 0.04)",
        cursor: "pointer",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0px 8px 24px 0px rgba(17, 24, 39, 0.1), 0px 2px 4px 0px rgba(17, 24, 39, 0.06)",
        },
      }}
      onClick={onClick}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height={isSmall ? "140" : "180"}
          image={imageUrl}
          alt={title}
          sx={{ objectFit: "cover" }}
        />
        {isSaved !== undefined && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <Box
              onClick={(e) => {
                e.stopPropagation();
                onSave?.(recipe);
              }}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {isSaved ? (
                <BookmarkIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
              ) : (
                <BookmarkBorderIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
              )}
            </Box>
          </Box>
        )}
        {rating > 0 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.whiteContainer.main,
              px: 1,
              py: 0.25,
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {rating.toFixed(1)}
          </Box>
        )}
      </Box>
      <CardContent sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        p: isSmall ? "12px" : "16px",
        ...cardContent,
      }}>
        <Typography
          gutterBottom
          variant={isSmall ? "subtitle2" : "h6"}
          component="h2"
          sx={{
            fontWeight: 600,
            fontSize: isSmall ? "14px" : "16px",
            lineHeight: 1.3,
            mb: 0.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            color: theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: isSmall ? "11px" : "12px",
              lineHeight: 1.4,
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </Typography>
        )}
        <Stack
          direction="row"
          spacing={isSmall ? 1 : 2}
          mt="auto"
          flexWrap="wrap"
          useFlexGap
        >
          {prepTime && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <AccessTimeIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: isSmall ? "10px" : "12px" }}>
                {prepTime}
              </Typography>
            </Stack>
          )}
          {servings && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <RestaurantIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: isSmall ? "10px" : "12px" }}>
                {servings} {t("servings")}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
