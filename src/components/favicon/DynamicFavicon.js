import React from "react";
import Head from "next/head";
import placeholder from "../../../public/static/no-image-found.png";

const DynamicFavicon = ({ configData }) => {
  const fallbackIcon =
    typeof placeholder === "string"
      ? placeholder
      : placeholder?.src || "/static/no-image-found.png";
  const iconHref = configData?.fav_icon_full_url || fallbackIcon;

  return (
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href={iconHref} />
      <link rel="icon" href={iconHref} />
      <link rel="icon" type="image/png" sizes="32x32" href={iconHref} />
      <link rel="icon" type="image/png" sizes="16x16" href={iconHref} />
    </Head>
  );
};

DynamicFavicon.propTypes = {};

export default DynamicFavicon;
