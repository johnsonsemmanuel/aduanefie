import { t } from "i18next";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import useGetItemCampaigns from "../../../api-manage/hooks/react-query/useGetItemCampaigns";
import { setRunningCampaigns } from "redux/slices/storedData";
import { HomeComponentsWrapper } from "../HomePageComponents";
import SliderShimmer from "../SliderShimmer";
import Grocery from "./Grocery";

const RunningCampaigns = () => {
  const { configData } = useSelector((state) => state.configData);
  const [openModal, setOpenModal] = useState(false);
  const [campaignsData, setCampaignsData] = useState({});
  const imageBaseUrl = configData?.base_urls?.campaign_image_url;
  const { data, refetch, isFetching, isLoading } = useGetItemCampaigns();
  const router = useRouter();
  const { runningCampaigns } = useSelector((state) => state.storedData);
  const dispatch = useDispatch();
  

  useEffect(() => {
    dispatch(setRunningCampaigns(data));
  }, [data]);
  const handleClick = (product) => {
    setCampaignsData(product);
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  const getModuleWiseView = () => {
    return (
      <Grocery
        runningCampaigns={data}
        handleClick={handleClick}
        configData={configData}
        isFetching={isFetching}
      />
    );
  };
  return (
    <>
      {isFetching ? (
        <SliderShimmer />
      ) : (
        <>
          {data?.length > 0 ? (
            <HomeComponentsWrapper alignItems="flex-start">
              {data?.length > 0 && (
                <Typography
                  sx={{
                    fontSize: { xs: "18px", md: "24px" },
                    fontWeight: 700,
                    color: "neutral.1050",
                    lineHeight: 1.1,
                    letterSpacing: "-1.2px",
                  }}
                  component="h2"
                >
                  {t("Just For You")}
                </Typography>
              )}
              <Box sx={{ width: "100%", mt: "1rem" }}>
                {getModuleWiseView()}
              </Box>
            </HomeComponentsWrapper>
          ) : (
            ""
          )}
        </>
      )}
    </>
  );
};

export default RunningCampaigns;
