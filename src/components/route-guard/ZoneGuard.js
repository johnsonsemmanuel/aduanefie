import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { getSavedModuleIdentifier } from "utils/moduleParamManager";
import { getCurrentModuleId } from "helper-functions/getCurrentModuleType";

// Catalogue context only: authentication and delivery eligibility are checked separately.
const ZoneGuard = ({ children }) => {
  const router = useRouter();
  const moduleParam = router.query.module || router.query.module_id;
  useEffect(() => {
    if (!router.isReady || moduleParam) return;
    let saved = null;
    try {
      saved = getSavedModuleIdentifier() || getCurrentModuleId();
    } catch {
      // Unavailable browser storage should return the visitor to market selection.
    }
    router.replace(saved
      ? { pathname: router.pathname, query: { ...router.query, module: String(saved) } }
      : "/welcome");
  }, [router.isReady, router.asPath, moduleParam]);

  return moduleParam ? <>{children}</> : null;
};

export default ZoneGuard;
