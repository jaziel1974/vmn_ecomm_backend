const { Schema, models, model } = require("mongoose");

const UserSchema = new Schema({
    name:String,
    email:String,
    image:String,
    phoneNumber:String,
    password:String
}, {
    timestamps: true
});

export const User = models?.User || model('User', UserSchema);