import { mongooseConnect } from "@/lib/mongoose"
import { Order } from "@/models/Order";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    await mongooseConnect();

    if (req.method === 'PUT' && req.query.paid) {
        res.json(await Order.findByIdAndUpdate(req.query._id, {
            paid: req.query.paid
        }));
    }
    else if (req.method == 'PUT' && req.query.normalization) {
        console.log(req.body, req.query._id);
        res.json(await Order.findByIdAndUpdate(req.query._id, {
            line_items: req.body
        }));
    }
    else if (req.method == 'PUT') {
        res.json(await Order.findByIdAndUpdate(req.body._id, {
            line_items: req.body.lineItems
        }));
    } else if (req.method == 'DELETE') {
        const { _id } = req.query;
        res.json(await Order.deleteOne({ _id }));
    } else if (req.query?.id) {
        const data = await Order.findOne({ _id: req.query.id });
        res.json(data);
    } else if (!req.query.filterDate) {
        //const results = await Order.find().sort({ createdAt: -1 })
        const results = await Order.aggregate([
            {
                $lookup: {
                    from: "customers",
                    localField: "email",
                    foreignField: "email",
                    as: "Customers"
                }
            }
        ])
        res.json(results);
    } else if (req.query.filterDate) {
        const results = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gt: new Date(req.query.filterDate)
                    }
                }
            },
            {
                $lookup: {
                    from: "customers",
                    localField: "email",
                    foreignField: "email",
                    as: "Customers"
                }
            }
        ])
        res.json(results);
    }
}