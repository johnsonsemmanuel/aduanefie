import { fetchPageMetadata } from "utils/fetchPageMetaData";
import { getApiContent } from "api-manage/getApiContent";

// Maintenance mode is only enforced when the admin has explicitly opted
// the react website into the maintenance window. The legacy check
// (`configData.maintenance_mode` alone) would also lock out the site
// during mobile-only or admin-only maintenance windows.
export const checkMaintenanceMode = (configData) => {
  const isMaintenanceMode =
    configData?.maintenance_mode_data?.maintenance_system_setup?.includes(
      "react_website"
    );
  return !!(isMaintenanceMode && configData?.maintenance_mode);
};

export const getCommonServerSideProps = async (
  context,
  pageName,
  pageId = null
) => {
  const { req, res } = context;
  const language = req.cookies.languageSetting;

  // Config and page metadata are independent. Fetch them in parallel so a
  // slow metadata lookup no longer adds its latency after the config request.
  const [config, metaData] = await Promise.all([
    fetch(
      `${(process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "")}/api/v1/config`,
      {
        method: "GET",
        headers: {
          "X-software-id": 33571750,
          "X-server": "server",
          "X-localization": language,
          origin: process.env.NEXT_CLIENT_HOST_URL,
        },
      }
    )
      .then((response) => response.json())
      .then((payload) => getApiContent(payload)),
    fetchPageMetadata(pageName, pageId, language),
  ]);

  if (
    checkMaintenanceMode(config) &&
    context.resolvedUrl &&
    !context.resolvedUrl.startsWith("/maintainance")
  ) {
    return {
      redirect: {
        destination: "/maintainance",
        permanent: false,
      },
    };
  }

  // Set cache control headers for 1 hour (3600 seconds)
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate"
  );

  return {
    props: {
      configData: config,
      metaData: metaData,
    },
  };
};
