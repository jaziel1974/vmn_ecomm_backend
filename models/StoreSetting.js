import { model, models, Schema } from "mongoose";

const StoreSettingSchema = new Schema({
        id: {type:String, required:true},
        value: {type:Object},
    }, {
        timestamps: true,
});

export const StoreSetting = models?.StoreSetting || model('StoreSetting', StoreSettingSchema);