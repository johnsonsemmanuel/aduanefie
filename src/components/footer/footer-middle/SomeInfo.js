import { Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import CustomImageContainer from "../../CustomImageContainer";
import Link from "next/link";

// Phone numbers (and similar "+880…" strings) must keep left-to-right digit
// order even in RTL locales — otherwise the leading "+" jumps to the right.
const isLtrValue = (value) =>
  typeof value === "string" && /^\+?[\d\s()-]+$/.test(value.trim());

const Inner = ({ image, alt, title, info, t, theme }) => (
  <Stack
    alignItems="center"
    gap={{ xs: "8px", md: "14px" }}
    sx={{
      flex: 1,
      px: { xs: "6px", md: "8px" },
      py: { xs: "8px", md: "4px" },
      cursor: "pointer",
      minWidth: 0,
      width: "100%",
      img: { transition: "all ease 0.5s" },
      "&:hover .info-label": { color: theme.palette.primary.main },
      "&:hover .info-value": { color: theme.palette.primary.main },
    }}
  >
    <CustomImageContainer
      src={image.src}
      alt={alt}
      height={42}
      width={42}
      smheight="34px"
      sm_width="34px"
    />
    <Stack gap="4px" alignItems="center" sx={{ width: "100%", minWidth: 0 }}>
      <Typography
        className="info-label"
        sx={{
          fontSize: { xs: "12.5px", md: "14px" },
          fontWeight: 600,
          color: "neutral.1050",
          letterSpacing: "-0.3px",
          lineHeight: 1.25,
          textAlign: "center",
          transition: "color 0.2s ease",
        }}
      >
        {t(title)}
      </Typography>
      <Typography
        className="info-value"
        dir={isLtrValue(info) ? "ltr" : undefined}
        sx={{
          fontSize: { xs: "12px", md: "13px" },
          fontWeight: 400,
          color: "neutral.500",
          letterSpacing: "-0.2px",
          lineHeight: 1.35,
          textAlign: "center",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          maxWidth: "100%",
          transition: "color 0.2s ease",
          ...(isLtrValue(info) && { unicodeBidi: "isolate" }),
        }}
      >
        {info}
      </Typography>
    </Stack>
  </Stack>
);

const SomeInfo = ({ image, alt, title, info, t, href }) => {
  const theme = useTheme();

  if (href) {
    return (
      <Link href={href} style={{ flex: 1, textDecoration: "none" }}>
        <Inner
          image={image}
          alt={alt}
          title={title}
          info={info}
          t={t}
          theme={theme}
        />
      </Link>
    );
  }

  return (
    <Inner
      image={image}
      alt={alt}
      title={title}
      info={info}
      t={t}
      theme={theme}
    />
  );
};

SomeInfo.propTypes = {};

export default SomeInfo;
