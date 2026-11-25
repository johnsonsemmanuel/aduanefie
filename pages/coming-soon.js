import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import SEO from "../src/components/seo";
import ComingSoonGate from "../src/components/common/ComingSoonGate";
import { getCommonServerSideProps } from "../src/utils/serverSidePropsHelper";

const ComingSoonPage = ({ configData }) => {
  return (
    <>
      <CssBaseline />
      <SEO
        title={
          configData?.business_name
            ? `Coming Soon - ${configData.business_name}`
            : "Coming Soon - Aduanefie"
        }
        description="Join the waitlist for early access to Aduanefie."
        image={configData?.logo_full_url}
        configData={configData}
      />
      <Box
        sx={{
          minHeight: "100dvh",
          width: "100%",
          bgcolor: "background.default",
        }}
      >
        <ComingSoonGate forceVisible standalone />
      </Box>
    </>
  );
};

export default ComingSoonPage;

export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, "home_page");
};
