import CustomLogo from "./CustomLogo";
import { Stack } from "@mui/system";
import { useSelector } from "react-redux";

const LogoSide = ({ configData, width, height, objectFit }) => {
  const reduxConfigData = useSelector((state) => state.configData?.configData);
  const logoImg =
    configData?.logo_full_url || reduxConfigData?.logo_full_url || "";

  return (
    <Stack
      direction="row"
      alignItems="center"
      width="fit-content"
      justifyContent="flex-start"
    >
      <CustomLogo
        atlText="logo"
        logoImg={logoImg}
        width={width}
        height={height}
        objectFit={objectFit}
      />
    </Stack>
  );
};

LogoSide.propTypes = {};

export default LogoSide;
