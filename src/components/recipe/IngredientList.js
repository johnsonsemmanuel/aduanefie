import { useMemo } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";

const IngredientList = ({
  ingredients,
  availableProducts = [],
  onAddToCart,
  addedToCartIds = [],
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const { mapped, matchCount, totalCount } = useMemo(() => {
    const productMap = new Map();
    availableProducts.forEach((product) => {
      const key = (product.name || product.title || product.product_name || "").toLowerCase().trim();
      if (key) productMap.set(key, product);
    });

    const mappedItems = ingredients.map((ingredient) => {
      const ingredientName = ingredient.name || ingredient.title || ingredient.ingredient_name || "";
      const normalized = ingredientName.toLowerCase().trim();
      const matchedProduct = productMap.get(normalized);

      return {
        ...ingredient,
        ingredientName,
        matchedProduct,
        isMatched: !!matchedProduct,
      };
    });

    const matches = mappedItems.filter((item) => item.isMatched).length;
    return { mapped: mappedItems, matchCount: matches, totalCount: mappedItems.length };
  }, [ingredients, availableProducts]);

  if (!ingredients || ingredients.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
        {t("No ingredients listed for this recipe.")}
      </Typography>
    );
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: isSmall ? "16px" : "18px" }}>
          {t("Ingredients")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {matchCount}/{totalCount} {t("available")}
        </Typography>
      </Stack>
      <List disablePadding>
        {mapped.map((item, index) => {
          const isAdded = addedToCartIds?.includes(item.id || item._originalIndex || index);
          return (
            <ListItem
              key={item.id || item._originalIndex || index}
              disablePadding
              sx={{
                py: 1,
                borderBottom: `1px solid ${theme.palette.divider}`,
                "&:last-child": {
                  borderBottom: "none",
                },
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: item.isMatched ? theme.palette.success.main : theme.palette.error.main,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: isSmall ? "13px" : "14px",
                          fontWeight: item.isMatched ? 400 : 500,
                          color: item.isMatched ? theme.palette.text.primary : theme.palette.text.secondary,
                        }}
                      >
                        {item.ingredientName}
                        {item.quantity && (
                          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                            ({item.quantity})
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                    {item.isMatched && (
                      <Button
                        variant={isAdded ? "outlined" : "contained"}
                        size="small"
                        startIcon={isAdded ? <CheckCircleIcon /> : <AddShoppingCartIcon />}
                        onClick={() => onAddToCart?.(item.matchedProduct)}
                        disabled={isAdded}
                        sx={{
                          minWidth: "auto",
                          px: 1.5,
                          py: 0.5,
                          fontSize: isSmall ? "11px" : "12px",
                          textTransform: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isAdded ? t("Added") : `${getAmountWithSign(item.matchedProduct?.price || 0)}`}
                      </Button>
                    )}
                  </Stack>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default IngredientList;
