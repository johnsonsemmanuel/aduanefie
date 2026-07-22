import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import useGetSavedRecipes from "api-manage/hooks/react-query/recipe/useGetSavedRecipes";
import useDeleteSavedRecipe from "api-manage/hooks/react-query/recipe/useDeleteSavedRecipe";
import RecipeCard from "components/recipe/RecipeCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import CustomPagination from "components/custom-pagination";
import { useDispatch } from "react-redux";
import { removeSavedRecipe } from "redux/slices/savedRecipes";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const SavedRecipes = ({ configData }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [pageLimit] = useState(12);

  const { data, isLoading, refetch } = useGetSavedRecipes();
  const { mutate: deleteRecipe, isLoading: deleteLoading } = useDeleteSavedRecipe();

  const recipes = useMemo(() => {
    const list = data?.data?.saved_recipes ?? data?.saved_recipes ?? data?.data ?? [];
    return Array.isArray(list) ? list : [];
  }, [data]);

  const totalSize = recipes.length;

  const handleRecipeClick = (recipe) => {
    router.push(`/recipes/${recipe.id}`);
  };

  const handleRemoveRecipe = (recipe, event) => {
    event.stopPropagation();
    deleteRecipe(recipe.id, {
      onSuccess: () => {
        dispatch(removeSavedRecipe(recipe.id));
        toast.success(t("Recipe removed from saved recipes"));
      },
      onError: () => {
        toast.error(t("Failed to remove recipe"));
      },
    });
  };

  const paginatedRecipes = recipes.slice((page - 1) * pageLimit, page * pageLimit);

  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ fontWeight: 700, fontSize: isSmall ? "22px" : "28px" }}>
        {t("Saved Recipes")}
      </Typography>

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
          <BookmarkIcon sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {t("No saved recipes yet")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t("Browse recipes and save your favourites")}
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/recipes")}
            sx={{ mt: 3, textTransform: "none" }}
          >
            {t("Browse Recipes")}
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {paginatedRecipes.map((recipe) => (
              <Grid item xs={6} sm={6} md={4} key={recipe?.id}>
                <Box sx={{ position: "relative" }}>
                  <RecipeCard
                    recipe={recipe}
                    onClick={() => handleRecipeClick(recipe)}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={(e) => handleRemoveRecipe(recipe, e)}
                    disabled={deleteLoading}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      minWidth: "auto",
                      px: 1,
                      py: 0.5,
                      fontSize: "11px",
                      textTransform: "none",
                      zIndex: 2,
                    }}
                  >
                    {t("Remove")}
                  </Button>
                </Box>
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
    </Stack>
  );
};

export default SavedRecipes;
