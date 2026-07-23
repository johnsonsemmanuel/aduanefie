import { combineReducers } from "@reduxjs/toolkit";
import AddAddressModalReducer from "../slices/addAddress";
import brandsReducer from "../slices/brands";
import cartReducer from "../slices/cart";
import cashbackReducer from "../slices/cashbackList";
import categoryIdsReducer from "../slices/categoryIds";
import configDataReducer from "../slices/configData";

import fbCredentialSliceReducer from "../slices/fbCredentials";
import guestUserReducer from "../slices/guestUserInfo";
import languageChangeReducer from "../slices/languageChange";
import offlinePaymentInfoReducer from "../slices/offlinePaymentData";
import profileInfoReducers from "../slices/profileInfo";
import searchFilterReducer from "../slices/searchFilter";
import storedDataSliceReducer from "../slices/storedData";
import themeSettingsReducer from "../slices/themeSettings";
import utilsReducers from "../slices/utils";
import wishListReducer from "../slices/wishList";
import storeResDataReducer from "../slices/storeRegistrationData";
import rentalCategoriesLists from "../slices/rentalCategories";
import rentalSearch from "../slices/rentalSearch";
import searchProductModalReducer from "../slices/searchProductModal";
import savedRecipesReducer from "../slices/savedRecipes";
import organicFilterReducer from "../slices/organicFilter";
import recipeFilterReducer from "../slices/recipeFilter";

//register all reducers here
export const rootReducer = combineReducers({

  themeSettings: themeSettingsReducer,
  configData: configDataReducer,
  utilsData: utilsReducers,
  profileInfo: profileInfoReducers,
  cart: cartReducer,
  wishList: wishListReducer,
  searchFilterStore: searchFilterReducer,
  fbCredentialsStore: fbCredentialSliceReducer,
  storedData: storedDataSliceReducer,
  languageChange: languageChangeReducer,
  addressModel: AddAddressModalReducer,
  guestUserInfo: guestUserReducer,
  offlinePayment: offlinePaymentInfoReducer,
  categoryIds: categoryIdsReducer,
  cashbackList: cashbackReducer,
  brands: brandsReducer,
  storeRegData: storeResDataReducer,
  rentalCategoriesLists: rentalCategoriesLists,
  rentalSearch: rentalSearch,
  searchProductModal: searchProductModalReducer,
  savedRecipes: savedRecipesReducer,
  organicFilter: organicFilterReducer,
  recipeFilter: recipeFilterReducer,
});
