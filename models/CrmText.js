const { Schema, model, models, default: mongoose } = require("mongoose");

const CrmTextSchema = new Schema({
    name: {type: String, required: true},
    text: String
});

export const CrmText = models?.CrmText || model('CrmText', CrmTextSchema);