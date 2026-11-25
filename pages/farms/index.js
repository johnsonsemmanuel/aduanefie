// Preserve links to the initial farming hub without duplicating navigation.
export const getServerSideProps = async () => ({ redirect: { destination: "/live", permanent: false } });
export default function FarmsRedirect() { return null; }
