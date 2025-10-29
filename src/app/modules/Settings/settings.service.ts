import { ISettings } from "./settings.interface";
import { Setting } from "./settings.model";

;

export const getSettingDB = async (): Promise<ISettings[]> => {
  return Setting.find();
};


export const createSettingFromDB = async ( data:any): Promise<ISettings> => {
  const setting = new Setting(data); // Ensure 'data' is used to create an instance of the Mongoose model
  await setting.save();
    return setting;
  };

  export const updateSettingFromDB = async (id: any, data: any): Promise<any> => {
    try {
      const result = await Setting.updateOne({ _id: id }, { $set: data });
      if (result.modifiedCount === 0) {
        throw new Error("Product not found or not modified");
      }
      const updatedDocument = await Setting.findById(id);
      if (!updatedDocument) {
        throw new Error("Product not found");
      }
      return updatedDocument;
    } catch (error) {
      console.error("Error updating Product:", error);
      throw error;
    }
  };