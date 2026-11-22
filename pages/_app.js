import "../src/styles/globals.css";
import "../src/styles/nprogress.css";
import "@flaticon/flaticon-uicons/css/all/all.css";
import { CacheProvider } from "@emotion/react";
import { Provider as ReduxProvider } from "react-redux";
import createEmotionCache from "../src/utils/create-emotion-cache";
import { store } from "redux/store";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "theme";

import CssBaseline from "@mui/material/CssBaseline";
import { RTL } from "components/rtl";
import { Toaster } from "react-hot-toast";
import { SettingsConsumer, SettingsProvider } from "contexts/settings-context";
import "../src/language/i18n";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import nProgress from "nprogress";
import Router from "next/router";
import { persistStore } from "redux-persist";
import { useTranslation } from "react-i18next";
import useScrollToTop from "../src/api-manage/hooks/custom-hooks/useScrollToTop";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import ModuleChecker from "../src/components/module-select/ModuleChecker";
import ErrorBoundary from "../src/components/common/ErrorBoundary";
import { Analytics } from "@vercel/analytics/next";

const ComingSoonGate = dynamic(
  () => import("../src/components/common/ComingSoonGate"),
  { ssr: false }
);
const ProSubscriptionExpiredModal = dynamic(
  () => import("../src/components/pro-plan/ProSubscriptionExpiredModal"),
  { ssr: false }
);
import { setLogoutUser } from "redux/slices/profileInfo";
import { clearAllCartData } from "redux/slices/cart";

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

export const currentVersion = process.env.NEXT_PUBLIC_SITE_VERSION;
const clientSideEmotionCache = createEmotionCache();
// Start persistence once, not on every render. SettingsProvider already reads
// the theme cookie on the client, so `_app` does not need getInitialProps.
persistStore(store);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 5, // 5 minutes
      staleTime: 1000 * 60 * 2, // 2 minutes
      // react-query v3 refetches every active query whenever the tab regains
      // focus. On the home page that is ~20 requests each time the user
      // alt-tabs back, for catalogue data that changes far more slowly than
      // the 2 minute staleTime above.
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

function MyApp(props) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
    initialSettings,
  } = props;
  const getLayout = Component.getLayout ?? ((page) => page);
  const { t } = useTranslation();

  // Version check
  useEffect(() => {
    if (!currentVersion) return;

    const storedVersion = localStorage.getItem("appVersion");
    if (storedVersion !== currentVersion) {
      const storedSettings = localStorage.getItem("settings");
      localStorage.clear();
      if (storedSettings) {
        localStorage.setItem("settings", storedSettings);
      }
      localStorage.setItem("appVersion", currentVersion);
    }
  }, []);

  // Sync Redux + React Query when MainApi clears an expired/revoked 401 token
  useEffect(() => {
    const handleSessionExpired = () => {
      store.dispatch(setLogoutUser(null));
      store.dispatch(clearAllCartData());
      queryClient.invalidateQueries();
    };
    window.addEventListener("aduanefie:session-expired", handleSessionExpired);
    return () =>
      window.removeEventListener("aduanefie:session-expired", handleSessionExpired);
  }, []);

  return (
    <>
      {useScrollToTop()}
      <CacheProvider value={emotionCache}>
        <QueryClientProvider client={queryClient}>
          <ReduxProvider store={store}>
            <SettingsProvider initialSettings={initialSettings}>
              <SettingsConsumer>
                {(value) => (
                  <ThemeProvider
                    theme={createTheme({
                      direction: value?.settings?.direction,
                      responsiveFontSizes: value?.settings?.responsiveFontSizes,
                      mode: value?.settings?.theme,
                    })}
                  >
                    <RTL direction={value?.settings?.direction}>
                      <CssBaseline />
                      <Toaster position="top-center" containerStyle={{ zIndex: 99999 }} />
                      <ComingSoonGate />
                      <ModuleChecker />
                      <ProSubscriptionExpiredModal />
                      <ErrorBoundary>
                        {getLayout(<Component {...pageProps} />)}
                      </ErrorBoundary>
                      <Analytics />
                    </RTL>
                  </ThemeProvider>
                )}
              </SettingsConsumer>
            </SettingsProvider>
          </ReduxProvider>
          {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> */}
        </QueryClientProvider>
      </CacheProvider>
    </>
  );
}

export default MyApp;
