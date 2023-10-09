const { Schema, model, models, default: mongoose } = require("mongoose");

const CustomerSchema = new Schema({
    name: { type: String, required: true },
    address: String,
    addressExt: String,
    addressNotes: String,
    priceId: { type: Number, required: true },
    email: {type: String, required: true},
},
    {
        timestamps: true
    }
);

export const Customer = models.Customer || model('Customer', CustomerSchema);