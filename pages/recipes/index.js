import { CssBaseline } from "@mui/material";
import React, { useEffect } from "react";
import SEO from "../../src/components/seo";
import MainLayout from "../../src/components/layout/MainLayout";
import RecipeCatalogue from "../../src/components/recipe/RecipeCatalogue";
import { useDispatch, useSelector } from "react-redux";
import { useGetConfigData } from "../../src/api-manage/hooks/useGetConfigData";
import { setConfigData } from "../../src/redux/slices/configData";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { processMetadata } from "utils/fetchPageMetaData";
import { useRouter } from "next/router";

const RecipesPage = ({ configData, metaData }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const metadata = processMetadata(metaData, {
    title: metaData?.title || `Recipes - ${configData?.business_name}`,
    description: metaData?.description || "",
    image: metaData?.image || configData?.logo_full_url,
    robotsMeta: metaData?.robotsMeta || ""
  });

  const { configData: storeConfigData } = useSelector((state) => state.configData);
  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();

  useEffect(() => {
    if (!configData) {
      configRefetch();
    }
  }, [configData]);

  useEffect(() => {
    if (dataConfig) {
      dispatch(setConfigData(dataConfig));
    }
  }, [dataConfig]);

  const handleRecipeClick = (recipe) => {
    router.push(`/recipes/${recipe.id}`);
  };

  return (
    <>
      <CssBaseline />
      <SEO
        title={metadata?.title}
        image={metadata?.image}
        description={metadata?.description}
        robotsMeta={metadata?.robotsMeta}
        businessName={configData?.business_name}
      />
      <MainLayout configData={configData}>
        <RecipeCatalogue onRecipeClick={handleRecipeClick} />
      </MainLayout>
    </>
  );
};

export default RecipesPage;
export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, "recipes_page");
}
