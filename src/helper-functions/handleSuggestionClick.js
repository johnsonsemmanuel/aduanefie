import { handleStoreRedirect } from "./handleStoreRedirect";
import { openSearchProductModal } from "redux/slices/searchProductModal";

export const handleSuggestionItemClick = (
  item,
  router,
  dispatch,
  closeSuggestion,
) => {
  closeSuggestion?.();

  if (!item?.id) return;
  dispatch(openSearchProductModal(item));
};

export const handleSuggestionStoreClick = (store, router, closeSuggestion) => {
  closeSuggestion?.();
  handleStoreRedirect(store, router);
};
