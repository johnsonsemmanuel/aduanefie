import Welcome, { getServerSideProps as getWelcomeProps } from "./welcome";
import { getMarketplaceHref } from "utils/marketplaceNavigation";

// Home is the overview; explicit legacy market links still enter Shop.
export default Welcome;
export const getServerSideProps = async (context) => {
  if (context.query.module || context.query.module_id) {
    return { redirect: { destination: getMarketplaceHref(context.query.module || context.query.module_id, context.req.cookies.selectedModule), permanent: false } };
  }
  const result = await getWelcomeProps(context);
  context.res?.setHeader("Cache-Control", "private, no-store");
  return result;
};
