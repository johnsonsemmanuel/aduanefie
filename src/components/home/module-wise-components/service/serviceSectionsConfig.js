import { Box } from "@mui/system";
import OffersSectionPage from "components/home/section-page/OffersSectionPage";
import TabbedSectionPage from "components/home/section-page/TabbedSectionPage";

export const getServiceSections = () => [
  {
    id: "offers",
    label: "Service Offers",
    icon: (
      <Box sx={{ color: "warning.dark", display: "flex" }}>
        <i
          className="fi fi-rr-badge-percent"
          style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
        />
      </Box>
    ),
    content: <OffersSectionPage />,
    mobileContent: <OffersSectionPage />,
  },
  {
    id: "top-rated",
    label: "Top Providers",
    icon: (
      <Box sx={{ color: "warning.dark", display: "flex" }}>
        <i
          className="fi fi-rr-star"
          style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
        />
      </Box>
    ),
    content: <TabbedSectionPage sectionType="top-rated" />,
    mobileContent: <TabbedSectionPage sectionType="top-rated" />,
  },
  {
    id: "nearby",
    label: "Nearby Providers",
    icon: (
      <Box sx={{ color: "primary.dark", display: "flex" }}>
        <i
          className="fi fi-rs-marker"
          style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
        />
      </Box>
    ),
    content: <TabbedSectionPage sectionType="nearby" />,
    mobileContent: <TabbedSectionPage sectionType="nearby" />,
  },
];
