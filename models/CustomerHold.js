import mongoose, {model, models, Schema } from "mongoose";

const CustomerHoldSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phoneNumber: {type: String, required: true},
});

export const CustomerHold = models?.CustomerHold || model('CustomerHold', CustomerHoldSchema);