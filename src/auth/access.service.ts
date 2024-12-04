import AccessService from "@/service/rbac.service";

const accessService: AccessService = new AccessService();

export const permission = async (feature: string) => {
  try {
    return await accessService.checkPermission(feature);
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
};
