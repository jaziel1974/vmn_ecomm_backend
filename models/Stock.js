const {model, Schema, models, default: mongoose} = require("mongoose");

const StockSchema = new Schema({
        _product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
        from: {type:String, required:true},
        to: String, required: true,
        quantity: {type: Number, required: true},
    }, {
        timestamps: true,
});

export const Stock = models.Stock || model('Stock', ProductSchema);