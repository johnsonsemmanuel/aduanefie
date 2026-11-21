import React, { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import { useCreateGroupBuy } from "api-manage/hooks/react-query/group-buy/useGroupBuys";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useGetItemDetails } from "api-manage/hooks/react-query/product-details/useGetItemDetails";
import { useGetStoresWithoutInfiniteScroll } from "api-manage/hooks/react-query/store/useGetStoresByFiltering";
import useGetStoreCategoriesItems from "api-manage/hooks/react-query/stores-categories/useGetStoreCategoriesItems";
import CustomModal from "components/modal";
import { TRADE_COUNTRIES } from "utils/tradeOptions";
import { MODAL_SELECT_MENU_PROPS, MODAL_POPPER_PROPS } from "utils/modalDropdown";

const supplierLabel = (store) =>
  store?.name || store?.title || `Supplier ${store?.id ?? ""}`;

const CreateGroupBuyDialog = ({ open, onClose, item, onCreated }) => {
  const [form, setForm] = useState({
    item_id: item?.id || "",
    target_value_ghs: 2000,
    member_limit: 5,
    // Ghana is the home market, so local delivery is the default.
    destination_country: "GH",
  });
  const [supplierId, setSupplierId] = useState(
    item?.store_id ? String(item.store_id) : ""
  );
  const { mutate, isLoading } = useCreateGroupBuy();

  // The page can deep-link with only ?item_id. Resolve the item so the picker
  // can show its supplier and product instead of a raw number.
  const { data: prefilledItem } = useGetItemDetails({ id: item?.id });
  const { data: storesData, isLoading: storesLoading } =
    useGetStoresWithoutInfiniteScroll({
      type: "all",
      offset: 1,
      limit: 50,
      filteredData: "all",
      enabled: open,
    });
  const { data: productsData, isLoading: productsLoading } =
    useGetStoreCategoriesItems({ storeId: supplierId, offset: 1, limit: 50 });

  const suppliers = storesData?.stores || storesData?.data || [];
  const products = useMemo(() => {
    const pages = productsData?.pages || [];
    return pages.flatMap((page) => page?.data || page?.products || []);
  }, [productsData]);
  const selectedSupplier =
    suppliers.find((store) => String(store.id) === String(supplierId)) || null;

  // This dialog stays mounted while closed, so useState alone would never see
  // the item passed in from a product page after navigation.
  useEffect(() => {
    if (!item?.id || !prefilledItem?.id) return;
    const price = Number(prefilledItem.price || 0);
    setSupplierId(String(prefilledItem.store_id || ""));
    setForm((previous) => ({
      ...previous,
      item_id: prefilledItem.id,
      target_value_ghs: price
        ? Math.max(1, Math.round(price * previous.member_limit))
        : previous.target_value_ghs,
    }));
  }, [item?.id, prefilledItem?.id]);

  const update = (field) => (event) =>
    setForm((previous) => ({ ...previous, [field]: event.target.value }));

  const selectSupplier = (store) => {
    const nextSupplier = store?.id ? String(store.id) : "";
    setSupplierId(nextSupplier);
    // A product from a previous supplier is no longer valid.
    setForm((previous) => ({ ...previous, item_id: "" }));
  };

  const selectProduct = (event) => {
    const productId = String(event.target.value || "");
    const product = products.find((entry) => String(entry.id) === productId);
    const price = Number(product?.price || 0);
    setForm((previous) => ({
      ...previous,
      item_id: productId,
      target_value_ghs: price
        ? Math.max(1, Math.round(price * previous.member_limit))
        : previous.target_value_ghs,
    }));
  };

  const submit = () => {
    if (!form.item_id) {
      toast.error("Choose a product from a supplier first.");
      return;
    }
    mutate(
      {
        item_id: Number(form.item_id),
        target_value_ghs: Number(form.target_value_ghs),
        member_limit: Number(form.member_limit),
        destination_country: form.destination_country || undefined,
      },
      {
        onSuccess: (group) => {
          toast.success("Group created. Share it with other buyers.");
          onCreated?.(group);
          onClose?.();
        },
        onError: onErrorResponse,
      }
    );
  };

  const selectedProduct = products.find(
    (entry) => String(entry.id) === String(form.item_id)
  );

  return (
    <CustomModal
      openModal={open}
      handleClose={onClose}
      closeButton
      maxWidth="480px"
    >
      <DialogTitle>Start a shared group buy</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            Pick a supplier, then the product you want to buy together. ₵2,000
            is only an example - use any target that fits the item.
          </Typography>
          <Autocomplete
            fullWidth
            options={suppliers}
            loading={storesLoading}
            value={selectedSupplier}
            getOptionLabel={supplierLabel}
            isOptionEqualToValue={(a, b) => String(a?.id) === String(b?.id)}
            onChange={(_, value) => selectSupplier(value)}
            noOptionsText="No suppliers found"
            slotProps={{ popper: MODAL_POPPER_PROPS }}
            componentsProps={{ popper: MODAL_POPPER_PROPS }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Supplier"
                size="small"
                placeholder="Type a supplier name"
                helperText="Start typing to search suppliers."
              />
            )}
          />
          <TextField
            select
            label="Product"
            size="small"
            fullWidth
            value={form.item_id ? String(form.item_id) : ""}
            onChange={selectProduct}
            disabled={!supplierId}
            SelectProps={{ MenuProps: MODAL_SELECT_MENU_PROPS }}
            helperText={
              selectedProduct
                ? `Farmer price ₵${Number(selectedProduct.price || 0).toLocaleString()}`
                : supplierId
                ? "Choose a product from this supplier."
                : "Choose a supplier first."
            }
          >
            <MenuItem value="">Choose a product</MenuItem>
            {products.length ? (
              products.map((product) => (
                <MenuItem
                  key={`${supplierId}-${product.id}`}
                  value={String(product.id)}
                >
                  {product.name || `Product ${product.id}`} - ₵
                  {Number(product.price || 0).toLocaleString()}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="no-products" disabled>
                {productsLoading
                  ? "Loading products..."
                  : supplierId
                  ? "No products from this supplier yet"
                  : "Choose a supplier first"}
              </MenuItem>
            )}
          </TextField>
          <TextField
            label="Target value (₵)"
            type="number"
            size="small"
            fullWidth
            value={form.target_value_ghs}
            onChange={update("target_value_ghs")}
            inputProps={{ min: 1 }}
            helperText="The pooled amount. Each member pays an equal share."
          />
          <TextField
            select
            label="Members"
            size="small"
            fullWidth
            value={form.member_limit}
            onChange={update("member_limit")}
            SelectProps={{ MenuProps: MODAL_SELECT_MENU_PROPS }}
          >
            {[2, 3, 4, 5, 6, 8, 10].map((count) => (
              <MenuItem key={count} value={count}>
                {count} people
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Destination country (optional)"
            size="small"
            fullWidth
            value={form.destination_country}
            onChange={update("destination_country")}
            SelectProps={{ MenuProps: MODAL_SELECT_MENU_PROPS }}
            helperText="Ghana is the default for local delivery."
          >
            {TRADE_COUNTRIES.map((country) => (
              <MenuItem key={country.code} value={country.code}>
                {country.code === "GH"
                  ? `Ghana (${country.code}) - local delivery`
                  : `${country.name} (${country.code})`}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button onClick={submit} variant="contained" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create group"}
        </Button>
      </DialogActions>
    </CustomModal>
  );
};

export default CreateGroupBuyDialog;
