// `/store` was a legacy alias that redirected to /home before rendering
// anything. Keep the bookmark working, but send users to the real store grid.
export const getServerSideProps = async ({ query }) => {
  const module = query.module
    ? `?module=${encodeURIComponent(query.module)}`
    : "";
  return {
    redirect: {
      destination: `/all-stores${module}`,
      permanent: false,
    },
  };
};

export default function StoreRedirect() {
  return null;
}
