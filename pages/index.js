// The marketing landing page now lives at /welcome. `/` is served by the
// middleware rewrite, which sends module-aware visitors straight to the
// marketplace (/home) and first-time visitors to the landing page (/welcome).
// This server-side redirect is a fallback for environments where middleware
// does not run (e.g. static export or an older deployment).
export default function Root() {
  return null;
}

export const getServerSideProps = async ({ req }) => {
  const selectedModule = req.cookies?.selectedModule;
  return {
    redirect: {
      destination: selectedModule
        ? `/home?module=${encodeURIComponent(selectedModule)}`
        : "/welcome",
      permanent: false,
    },
  };
};
