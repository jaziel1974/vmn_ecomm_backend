const { Schema, models, model } = require("mongoose");

const LineItemSchema = new Schema({
    quantity: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    unit_amount: { type: Number, required: true },
}, { _id: false });

const OrderSchema = new Schema({
    line_items: [LineItemSchema],
    name: String,
    email: String,
    city: String,
    postalCode: String,
    streetAddress: String,
    country: String,
    paid: Boolean,
    adminNotes: String,
    customerNotes: String,
    status: String, //pending, processing, delivered
}, {
    timestamps: true
});

export const Order = models?.Order || model('Order', OrderSchema);