const { Schema, model, models, default: mongoose } = require("mongoose");

const CrmSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    communicationLabels: { type: [mongoose.Types.ObjectId] },
},
    {
        timestamps: true
    }
);

export const Crm = models.Crm || model('Crm', CrmSchema);