import React, { memo, useEffect, useState } from "react";
import { CustomImageContainerStyled } from "styled-components/CustomStyles.style";
import placeholder from "../../public/static/no-image-found.png";
import { Box } from "@mui/system";

const resolveImageSrc = (raw) => {
  const clean = (val) => {
    if (typeof val !== "string") return "";
    const t = val.trim();
    if (!t || /\/assets\/admin\/img\/160x160\/img2\.jpg$/i.test(t)) return "";
    return t;
  };
  if (typeof raw === "string") {
    return clean(raw) || placeholder?.src;
  }
  if (raw && typeof raw === "object") {
    return (
      clean(raw.src) ||
      clean(raw.img_full_url) ||
      clean(raw.image_full_url) ||
      placeholder?.src
    );
  }
  return placeholder?.src;
};

const CustomImageContainer = ({
  cursor,
  mdHeight,
  maxWidth,
  height,
  width,
  objectfit,
  minwidth,
  src,
  alt,
  borderRadius,
  marginBottom,
  smHeight,
  smMb,
  smMaxWidth,
  smWidth,
  aspectRatio,
  padding,
  loading,
  bg,
  borderBottomRightRadius,
  ...rest
}) => {
  const [imageFile, setState] = useState(null);
  useEffect(() => {
    setState(resolveImageSrc(src));
  }, [src]);

  return (
    <CustomImageContainerStyled
      height={height}
      width={width}
      objectfit={objectfit}
      minwidth={minwidth}
      border_radius={borderRadius}
      margin_bottom={marginBottom}
      smheight={smHeight}
      sm_mb={smMb}
      max_width={maxWidth}
      sm_max_width={smMaxWidth}
      sm_width={smWidth}
      md_height={mdHeight}
      cursor={cursor}
      aspect_ratio={aspectRatio}
      padding={padding}
      bg={bg}
      borderBottomRightRadius={borderBottomRightRadius}
      {...rest}
    >
      {!imageFile ? (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            border: (theme) => `1px solid ${theme.palette.neutral[200]}`,
          }}
        />
      ) : (
        <img
          src={imageFile}
          alt={alt || "image"}
          onError={() => {
            setState(placeholder?.src);
          }}
          loading={loading || "lazy"}
        />
      )}
    </CustomImageContainerStyled>
  );
};
export default memo(CustomImageContainer);
