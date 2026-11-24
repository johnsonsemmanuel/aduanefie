import { filterOutRiderShareModules } from "helper-functions/moduleFilter";

// "zoneid" may be stored as a scalar or a JSON array - normalize to an array.
export const getCurrentZoneIds = () => {
  if (typeof window === "undefined") return undefined;
  const rawZoneIds = localStorage.getItem("zoneid");
  if (!rawZoneIds) return undefined;
  try {
    const parsed = JSON.parse(rawZoneIds);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [rawZoneIds];
  }
};

export const zoneWiseModule = (data) => {
  const currentZoneIds = getCurrentZoneIds();
  return filterOutRiderShareModules(data)?.filter((moduleItem) => {
    const zoneIds = moduleItem?.zones?.map((zone) => zone.id);
    return currentZoneIds?.some((id) => zoneIds?.includes(id));
  });
};
