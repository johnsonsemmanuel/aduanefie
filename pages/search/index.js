import { Box, NoSsr } from "@mui/material";
import CompactMobileHeader from "components/common/CompactMobileHeader";
import SearchWithTitle from "components/home/SearchWithTitle";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getToken } from "helper-functions/getToken";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setConfigData } from "redux/slices/configData";
import { processMetadata } from "utils/fetchPageMetaData";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import SearchResult from "../../src/components/home/search";
import ModuleSearchContainer from "../../src/components/home/search/ModuleSearchContainer";
import MainLayout from "../../src/components/layout/MainLayout";
import SEO from "../../src/components/seo";

const SearchPage = ({ configData, metaData }) => {
  const metadata = processMetadata(metaData, {
    title: `Search - ${configData?.business_name}`,
    description: metaData?.description || "",
    image: `${metaData?.image || configData?.logo_full_url}`,
    robotsMeta: metaData?.robotsMeta || "",
  });

  const router = useRouter();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(0);
  const token = getToken();
  const zoneid =
    typeof window !== "undefined" ? localStorage.getItem("zoneid") : undefined;
  const searchQuery =
    router.query?.data_type === "searched" ? router.query.search : "";

  useEffect(() => {
    if (configData && Object.keys(configData).length > 0) {
      dispatch(setConfigData(configData));
    }
  }, [configData]);

  const moduleType = getCurrentModuleType();

  // Keep one Nearby surface. Old search links that still carry
  // quick_action=nearby are moved to the section page, which owns the location
  // control and status banner.
  useEffect(() => {
    if (!router.isReady || router.query.quick_action !== "nearby") return;

    const rest = { ...router.query };
    const search = rest.search;
    delete rest.quick_action;
    delete rest.search;
    delete rest.data_type;
    router.replace({
      pathname: "/home/nearby",
      query: {
        ...rest,
        module: typeof rest.module === "string" ? rest.module : moduleType,
        ...(typeof search === "string" && search ? { q: search } : {}),
      },
    });
  }, [router, router.isReady, router.query, moduleType]);

  const isModuleWithSidebar =
    moduleType === ModuleTypes.FOOD ||
    moduleType === ModuleTypes.GROCERY ||
    moduleType === ModuleTypes.PHARMACY ||
    moduleType === ModuleTypes.ECOMMERCE ||
    moduleType === ModuleTypes.SERVICE;

  const searchResult = (
    <SearchResult
      searchValue={router.query.search}
      name={router.query.name}
      isSearch={router.query.fromSearch}
      routeTo={router.query.from}
      configData={configData}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
    />
  );

  return (
    <>
      <SEO
        title={metadata.title}
        description={metadata.description}
        image={metadata.image}
        robotsMeta={metadata.robotsMeta}
        configData={configData}
      />
      <MainLayout configData={configData}>
        <NoSsr>
          {/* Sidebar modules use the fixed MobileSearchPageBar, which needs a
              60px spacer. Non-sidebar modules now get an in-flow compact header. */}
          <Box sx={{ mt: { xs: isModuleWithSidebar ? "60px" : 0, md: "34px" } }}>
            {isModuleWithSidebar ? (
              <ModuleSearchContainer
                searchValue={router.query.search}
                configData={configData}
                zoneid={zoneid}
                searchQuery={searchQuery}
              />
            ) : (
              <>
                <CompactMobileHeader title="Search" />
                <SearchWithTitle
                  currentTab={0}
                  zoneid={zoneid}
                  token={token}
                  searchQuery={searchQuery}
                  name={router.query.name}
                  query={router.query}
                />
                {searchResult}
              </>
            )}
          </Box>
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default SearchPage;

export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, "search_page");
};
