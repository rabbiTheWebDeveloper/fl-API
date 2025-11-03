import { ShopInfoModel } from "./shopInfo.model";

export const updateShopInfoFromDB = async (data: any): Promise<any> => {
  try {
    const { userId, shopId, ...otherFields } = data;
    if (!shopId) throw new Error("Shop ID is required");
    const result = await ShopInfoModel.findOneAndUpdate(
      { userId, shopId },
      {
        $set: {
          userId,
          shopId,
          ...otherFields, // ✅ spread all  fields properly
        },
      },
      { new: true, upsert: true }
    );

    return result;
  } catch (error) {
    console.error("Error updating Shop Info:", error);
    throw error;
  }
};
