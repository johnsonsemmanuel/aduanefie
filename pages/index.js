import Home from "./home";
import { getCommonServerSideProps } from "../src/utils/serverSidePropsHelper";

export default Home;

export const getServerSideProps = async (context) => {
  // Reuse the same data fetching as the Home page.
  return await getCommonServerSideProps(context, "home_page");
};
