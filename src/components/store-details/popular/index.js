/* eslint-disable react-hooks/exhaustive-deps */
import { alpha, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import usePopularProductsInStore from "../../../api-manage/hooks/react-query/product-details/usePopularProductsInStore";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import H1 from "../../typographies/H1";
import { settings } from "./settings";
import ProductCard from "../../cards/ProductCard";

const PopularInTheStore = ({ id, storeShare, sortBy, type }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const offset = 1;
  const limit = 10;
  const getBG = () => {
    if (getCurrentModuleType()) {
      return {
        bgColor: alpha(theme.palette.primary.main, 0.2),
        title: t("Recommended for you"),
      };
    } else {
      if (storeShare?.moduleType === ModuleTypes.GROCERY) {
        return {
          bgColor: alpha(theme.palette.primary.main, 0.2),
          title: t("Popular in this store!"),
        };
      }
    }
  };

  const { data, refetch, isLoading } = usePopularProductsInStore({
    id,
    sortBy,
    type,
    ...storeShare,
  });

  useEffect(() => {
    refetch();
  }, []);

  // Refetch popular items whenever the active sort/type filter changes
  // so the section reflects the current selection.
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, type]);

  return (
    <CustomBoxFullWidth>
      <>
        {data?.items?.length > 0 && (
          <SliderCustom
            nopadding="true"
            sx={{
              backgroundColor: getBG()?.bgColor,
              padding: "20px 20px 8px 20px",
              borderRadius: "4px",
              marginTop: "12px",
              "& .slick-slide": {
                paddingRight: "20px",
              },
            }}
          >
            <CustomStackFullWidth spacing={2.2}>
              <H1 textAlign="start" text={getBG()?.title} />
              {!isLoading && (
                <Slider {...settings}>
                  {data?.items?.map((item, index) => {
                    return (
                      <ProductCard
                        key={index}
                        item={item}
                        specialCard="true"
                        noRecommended
                      />
                    );
                  })}
                </Slider>
              )}
            </CustomStackFullWidth>
          </SliderCustom>
        )}
      </>
    </CustomBoxFullWidth>
  );
};

PopularInTheStore.propTypes = {};

export default PopularInTheStore;
