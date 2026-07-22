import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CustomPagination from "components/custom-pagination";
import RecipeCard from "./RecipeCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import useGetRecipes from "api-manage/hooks/react-query/recipe/useGetRecipes";
import usePostSaveRecipe from "api-manage/hooks/react-query/recipe/usePostSaveRecipe";
import useDeleteSavedRecipe from "api-manage/hooks/react-query/recipe/useDeleteSavedRecipe";
import { useSelector, useDispatch } from "react-redux";
import { resetRecipeFilter, setCategory, setSelectedIngredients } from "redux/slices/recipeFilter";
import { addSavedRecipe, removeSavedRecipe } from "redux/slices/savedRecipes";
import toast from "react-hot-toast";

const CATEGORY_OPTIONS = [
  { label: "All", value: null },
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Dessert", value: "dessert" },
  { label: "Snack", value: "snack" },
  { label: "Vegetarian", value: "vegetarian" },
];

const RecipeCatalogue = ({ onRecipeClick }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { category } = useSelector((state) => state.recipeFilter);
  const { savedRecipes } = useSelector((state) => state.savedRecipes);
  const { mutate: saveRecipe, isLoading: saveLoading } = usePostSaveRecipe();
  const { mutate: deleteRecipe, isLoading: deleteLoading } = useDeleteSavedRecipe();

  const [page, setPage] = useState(1);
  const [pageLimit] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, refetch } = useGetRecipes({
    offset: (page - 1) * pageLimit,
    limit: pageLimit,
    category,
    search: searchQuery,
  });

  const recipes = data?.data?.recipes ?? data?.recipes ?? [];
  const totalSize = data?.data?.total_size ?? data?.total_size ?? 0;

  const handleCategoryChange = (value) => {
    dispatch(setCategory(value));
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleResetFilters = () => {
    dispatch(resetRecipeFilter());
    setSearchQuery("");
    setPage(1);
  };

  const handleSaveToggle = (recipe) => {
    if (!recipe) return;
    const isSaved = savedRecipes?.list?.some((r) => r.id === recipe.id);
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

  const hasActiveFilters = category || searchQuery;

  const isRecipeSaved = (recipeId) => savedRecipes?.list?.some((r) => r.id === recipeId);

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        flexWrap="wrap"
        gap={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        mb={3}
      >
        <TextField
          placeholder={t("Search recipes...")}
          value={searchQuery}
          onChange={handleSearchChange}
          size="small"
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 1, display: "flex", color: theme.palette.text.secondary }}>
                <SearchIcon fontSize="small" />
              </Box>
            ),
          }}
          sx={{
            minWidth: { xs: "100%", sm: 260 },
            flex: 1,
            maxWidth: { xs: "100%", sm: 360 },
          }}
        />
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Select
            value={category || "all"}
            onChange={(e) => handleCategoryChange(e.target.value === "all" ? null : e.target.value)}
            displayEmpty
            size="small"
            sx={{ minWidth: 140 }}
            startAdornment={<FilterListIcon sx={{ mr: 1, color: theme.palette.text.secondary, fontSize: 18 }} />}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <MenuItem key={opt.label} value={opt.value || "all"}>
                {t(opt.label)}
              </MenuItem>
            ))}
          </Select>
          {hasActiveFilters && (
            <Button
              variant="text"
              size="small"
              onClick={handleResetFilters}
              startIcon={<ClearIcon />}
              sx={{ textTransform: "none" }}
            >
              {t("Clear")}
            </Button>
          )}
        </Box>
      </Stack>

      {isLoading ? (
        <Grid container spacing={2}>
          {[...Array(pageLimit)].map((_, i) => (
            <Grid item xs={6} sm={6} md={4} key={i}>
              <ProductCardSimmer variant="vertical" />
            </Grid>
          ))}
        </Grid>
      ) : recipes.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {t("No recipes found")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t("Try adjusting your filters or search query")}
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {recipes.map((recipe) => (
              <Grid item xs={6} sm={6} md={4} key={recipe?.id}>
                <RecipeCard
                  recipe={recipe}
                  onClick={() => onRecipeClick?.(recipe)}
                  onSave={() => handleSaveToggle(recipe)}
                  isSaved={isRecipeSaved(recipe?.id)}
                />
              </Grid>
            ))}
          </Grid>
          {totalSize > pageLimit && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CustomPagination
                total_size={totalSize}
                page_limit={pageLimit}
                offset={page}
                setOffset={setPage}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default RecipeCatalogue;
