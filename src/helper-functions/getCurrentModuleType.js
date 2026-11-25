const readModule = () => {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem("module") || "null");
  } catch {
    return null;
  }
};

export const getCurrentModuleType = () => readModule()?.module_type;

export const getCurrentModuleId = () => readModule()?.id;
