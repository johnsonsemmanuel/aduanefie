import Welcome, { getServerSideProps as getWelcomeProps } from "./welcome";

export default Welcome;

export const getServerSideProps = async (context) => {
  // A fresh visitor needs an entry point before a module-specific catalogue can render.
  // Home remains a distinct discovery page. Only explicit legacy market links
  // redirect; the saved choice is retained by Shop navigation instead.
  const candidate = context.query.module || context.query.module_id;
  const moduleId = Array.isArray(candidate) ? candidate[0] : candidate;
  if (["1", "2"].includes(String(moduleId))) {
    return { redirect: { destination: `/home?module=${moduleId}`, permanent: false } };
  }
  const result = await getWelcomeProps(context);
  // Keep the preview entry response out of shared caches.
  context.res?.setHeader("Cache-Control", "private, no-store");
  return result;
};
