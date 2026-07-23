export const ModuleTypes = {
  GROCERY: "grocery",
  RENTAL: "rental",
  // RIDE: deprioritized — redirected to community delivery (DEPRECATED — retained for backend data compatibility)
  RIDE: "ride-share" || "rideshare",
};

export const StoreTypes = {
  DEFAULT: "default",
  FARM: "farm",
};

export const DeliveryAgentTypes = {
  DEFAULT: "is_delivery",
  COMMUNITY_AGENT: "community_agent",
};

export const AccountTypes = {
  VENDOR: "vendor",
  FARMER: "farmer",
  COMMUNITY_AGENT: "community_agent",
  MARKETER: "marketer",
  CUSTOMER: "customer",
};
