import { getMarketplaceHref } from "utils/marketplaceNavigation";

// Canonical Home is shopping. Keep /welcome as a separate introduction.
export const getServerSideProps = async ({ query, req, res }) => {
  res?.setHeader("Cache-Control", "private, no-store");
  return {
    redirect: {
      destination: getMarketplaceHref(query.module || query.module_id, req.cookies.selectedModule),
      permanent: false,
    },
  };
};

export default function MarketplaceEntry() { return null; }
