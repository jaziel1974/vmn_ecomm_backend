const { Schema, model, models, default: mongoose } = require("mongoose");

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: { type: [String] },
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    properties: { type: Object },
    stock: {
        type: Object, properties: {
            dateIni: { type: Date },
            dateEnd: { type: Date },
        },
    },
    pricePerZone: {
        type: Object, properties: {
            zone: { type: Number },
            price: { type: Number },
        },
    },
    stockAvailable: {type:Boolean},
    cost: {type:Number},
},
    {
        timestamps: true
    }
);

export const Product = models.Product || model('Product', ProductSchema);