import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import useGetRecipeDetails from "api-manage/hooks/react-query/recipe/useGetRecipeDetails";
import useGetRecipeIngredients from "api-manage/hooks/react-query/recipe/useGetRecipeIngredients";
import usePostSaveRecipe from "api-manage/hooks/react-query/recipe/usePostSaveRecipe";
import useDeleteSavedRecipe from "api-manage/hooks/react-query/recipe/useDeleteSavedRecipe";
import IngredientList from "./IngredientList";
import ProductCard from "components/cards/ProductCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import { useSelector, useDispatch } from "react-redux";
import { addSavedRecipe, removeSavedRecipe } from "redux/slices/savedRecipes";
import toast from "react-hot-toast";

const RecipeDetail = ({ recipeId }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const dispatch = useDispatch();
  const { savedRecipes } = useSelector((state) => state.savedRecipes);

  const [page, setPage] = useState(1);
  const [pageLimit] = useState(10);
  const [addedToCartIds, setAddedToCartIds] = useState([]);

  const { data: recipeData, isLoading: recipeLoading, refetch: recipeRefetch } =
    useGetRecipeDetails(recipeId);
  const { data: ingredientsData, isLoading: ingredientsLoading, refetch: ingredientsRefetch } =
    useGetRecipeIngredients(recipeId);
  const { mutate: saveRecipe, isLoading: saveLoading } = usePostSaveRecipe();
  const { mutate: deleteRecipe, isLoading: deleteLoading } = useDeleteSavedRecipe();

  const recipe = recipeData?.data ?? recipeData;
  const ingredients = ingredientsData?.data ?? ingredientsData?.ingredients ?? [];
  const recommendedProducts = recipe?.recommended_products ?? recipe?.matched_products ?? [];

  const isSaved = savedRecipes?.list?.some((r) => r.id === recipe?.id);

  useEffect(() => {
    if (recipeId) {
      recipeRefetch();
      ingredientsRefetch();
    }
  }, [recipeId]);

  const handleSaveToggle = () => {
    if (!recipe) return;
    if (isSaved) {
      deleteRecipe(recipe.id, {
        onSuccess: () => {
          dispatch(removeSavedRecipe(recipe.id));
          toast.success(t("Recipe removed from saved recipes"));
        },
        onError: () => {
          toast.error(t("Failed to remove recipe"));
        },
      });
    } else {
      saveRecipe(
        { recipe_id: recipe.id },
        {
          onSuccess: (res) => {
            dispatch(addSavedRecipe({ ...recipe, saved_at: new Date().toISOString() }));
            toast.success(res?.message || t("Recipe saved successfully"));
          },
          onError: () => {
            toast.error(t("Failed to save recipe"));
          },
        }
      );
    }
  };

  const handleAddToCart = (product) => {
    if (!product) return;
    setAddedToCartIds((prev) => [...prev, product.id]);
  };

  const imageUrl = recipe?.image_url || recipe?.thumbnail || recipe?.image || "/images/recipe-placeholder.png";
  const title = recipe?.title || recipe?.name || t("Untitled Recipe");
  const description = recipe?.description || recipe?.short_description || "";
  const prepTime = recipe?.preparation_time || recipe?.prep_time || "";
  const servings = recipe?.servings || recipe?.serving_size || "";
  const calories = recipe?.calories || recipe?.total_calories || "";
  const difficulty = recipe?.difficulty || "";
  const cuisine = recipe?.cuisine || recipe?.category || "";

  if (recipeLoading || ingredientsLoading) {
    return (
      <Stack spacing={3}>
        <Box sx={{ height: isSmall ? 200 : 300, borderRadius: "12px", bgcolor: "neutral.100" }} />
        <Box sx={{ height: 200, borderRadius: "12px", bgcolor: "neutral.100" }} />
      </Stack>
    );
  }

  if (!recipe) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          {t("Recipe not found")}
        </Typography>
        <Button startIcon={<ArrowBackIosNewIcon />} onClick={() => router.back()} sx={{ mt: 2 }}>
          {t("Go Back")}
        </Button>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Button
        startIcon={<ArrowBackIosNewIcon />}
        onClick={() => router.back()}
        sx={{ alignSelf: "flex-start", textTransform: "none" }}
      >
        {t("Back to Recipes")}
      </Button>

      <Box
        sx={{
          position: "relative",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0px 4px 16px 0px rgba(17, 24, 39, 0.08)",
        }}
      >
        <Box
          component="img"
          src={imageUrl}
          alt={title}
          sx={{
            width: "100%",
            height: isSmall ? 220 : 360,
            objectFit: "cover",
            display: "block",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
          }}
        >
          <Button
            variant="contained"
            onClick={handleSaveToggle}
            disabled={saveLoading || deleteLoading}
            startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            sx={{
              backgroundColor: "rgba(255,255,255,0.9)",
              color: isSaved ? theme.palette.primary.main : theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,1)",
              },
              textTransform: "none",
            }}
          >
            {isSaved ? t("Saved") : t("Save")}
          </Button>
        </Box>
      </Box>

      <Stack spacing={2}>
        <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
          {cuisine && <Chip label={cuisine} size="small" color="primary" variant="outlined" />}
          {difficulty && <Chip label={difficulty} size="small" color="default" variant="outlined" />}
          {calories && (
            <Chip
              icon={<LocalFireDepartmentIcon sx={{ fontSize: 16 }} />}
              label={`${calories} ${t("kcal")}`}
              size="small"
              color="error"
              variant="outlined"
            />
          )}
        </Stack>

        <Typography variant="h4" sx={{ fontWeight: 700, fontSize: isSmall ? "24px" : "32px" }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: isSmall ? "14px" : "16px", lineHeight: 1.6 }}>
            {description}
          </Typography>
        )}

        <Stack direction="row" flexWrap="wrap" gap={isSmall ? 2 : 3}>
          {prepTime && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTimeIcon sx={{ color: theme.palette.primary.main }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("Prep Time")}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {prepTime}
                </Typography>
              </Box>
            </Stack>
          )}
          {servings && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <RestaurantIcon sx={{ color: theme.palette.primary.main }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("Servings")}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {servings}
                </Typography>
              </Box>
            </Stack>
          )}
        </Stack>

        <Divider sx={{ my: 1 }} />

        <IngredientList
          ingredients={ingredients}
          availableProducts={recommendedProducts}
          onAddToCart={handleAddToCart}
          addedToCartIds={addedToCartIds}
        />

        {recommendedProducts.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: isSmall ? "16px" : "18px" }}>
              {t("Recommended Products")}
            </Typography>
            <Grid container spacing={2}>
              {recommendedProducts.map((product) => (
                <Grid item xs={6} sm={6} md={3} key={product?.id}>
                  <ProductCard item={product} cardFor="vertical" cardType="vertical-type" noMargin="true" />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default RecipeDetail;
