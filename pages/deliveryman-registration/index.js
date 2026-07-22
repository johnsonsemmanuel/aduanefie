import { NoSsr } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useEffect, useState } from "react";
import MainLayout from "../../src/components/layout/MainLayout";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import SEO from "../../src/components/seo";
import CustomContainer from "../../src/components/container";
import DeliveryManComponent from "../../src/components/deliveryman-registration/DeliveryManComponent";
import { useDispatch, useSelector } from "react-redux";
import { useGetConfigData } from "api-manage/hooks/useGetConfigData";
import { setConfigData } from "redux/slices/configData";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { processMetadata } from "utils/fetchPageMetaData";
import { ToggleButtonGroup, ToggleButton, Box, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

const Index = ({ metaData }) => {
  const [registrationType, setRegistrationType] = useState("delivery_man");
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();
  const { landingPageData, configData } = useSelector(
    (state) => state.configData
  );
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
  const metadata = processMetadata(metaData, {
    title: metaData?.title || `Deliveryman Registration - ${configData?.business_name}`,
    description: metaData?.description || '',
    image: `${metaData?.image || configData?.logo_full_url}`,
    robotsMeta: metaData?.robotsMeta || ''
  })
  return (
    <>
      <CssBaseline />
      <SEO
        title={metadata.title}
        description={metadata.description}
        image={metadata.image}
        robotsMeta={metadata.robotsMeta}
        configData={configData}
      />
      <MainLayout configData={configData} >
        <SimpleMobileHeader title={registrationType === "community_agent" ? t("Community Agent Application") : t("Deliveryman Application")} />
        <NoSsr>
          <CustomContainer>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: { xs: 2, md: 3 },
                mt: { xs: 1, md: 2 },
              }}
            >
              <ToggleButtonGroup
                value={registrationType}
                exclusive
                onChange={(_, value) => value && setRegistrationType(value)}
                aria-label="registration type"
                sx={{
                  backgroundColor: (theme) => theme.palette.neutral[100],
                  borderRadius: "8px",
                  p: "4px",
                  gap: "4px",
                }}
              >
                <ToggleButton
                  value="delivery_man"
                  aria-label="delivery person"
                  sx={{
                    px: { xs: 2, md: 3 },
                    py: 1,
                    fontSize: { xs: "13px", md: "14px" },
                    fontWeight: 500,
                    borderRadius: "6px",
                    color: registrationType === "delivery_man" ? "primary.main" : "text.secondary",
                    backgroundColor: registrationType === "delivery_man" ? "background.paper" : "transparent",
                    boxShadow: registrationType === "delivery_man" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    "&.Mui-selected": {
                      backgroundColor: "background.paper",
                      color: "primary.main",
                    },
                  }}
                >
                  {t("Delivery Person")}
                </ToggleButton>
                <ToggleButton
                  value="community_agent"
                  aria-label="community agent"
                  sx={{
                    px: { xs: 2, md: 3 },
                    py: 1,
                    fontSize: { xs: "13px", md: "14px" },
                    fontWeight: 500,
                    borderRadius: "6px",
                    color: registrationType === "community_agent" ? "primary.main" : "text.secondary",
                    backgroundColor: registrationType === "community_agent" ? "background.paper" : "transparent",
                    boxShadow: registrationType === "community_agent" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    "&.Mui-selected": {
                      backgroundColor: "background.paper",
                      color: "primary.main",
                    },
                  }}
                >
                  {t("Community Agent")}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <DeliveryManComponent
              configData={configData}
              registrationType={registrationType}
            />
          </CustomContainer>
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default Index;
export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, 'deliveryman_join_page')
}

