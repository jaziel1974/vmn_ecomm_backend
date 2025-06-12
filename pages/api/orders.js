import { mongooseConnect } from "@/lib/mongoose"
import { Order } from "@/models/Order";

export default async function handler(req, res) {
    await mongooseConnect();

    if (req.method === 'PUT' && req.query.paid) {
        res.json(await Order.findByIdAndUpdate(req.query._id, {
            paid: req.query.paid
        }));
    }
    else if (req.method === 'PUT' && req.query.deliver) {
        res.json(await Order.findByIdAndUpdate(req.query._id, {
            status: "delivered"
        }));
    }
    else if (req.method == 'PUT' && req.query.normalization) {
        res.json(await Order.findByIdAndUpdate(req.query._id, {
            line_items: req.body
        }));
    }
    else if (req.method == 'PUT') {
        res.json(await Order.findByIdAndUpdate(req.body._id, {
            line_items: req.body.lineItems,
            adminNotes: req.body.adminNotes,
            customerNotes: req.body.customerNotes,
        }));
    } else if (req.method == 'DELETE') {
        const { _id } = req.query;
        res.json(await Order.deleteOne({ _id }));
    } else if (req.method == 'GET') {
        if (req.query.orderEdit) {
            const data = await Order.findOne({ _id: req.query.id });
            res.json(data);
        } /*else if (!req.query.filterDateIni) {
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
        }*/ else if (req.query.filterOrder) {
            const results = await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gt: new Date(req.query.filterDateIni),
                            $lt: new Date(req.query.filterDateEnd)
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
        else if (req.query.filterHorta) {
            const results = await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(req.query.filterDateIni),
                            $lte: new Date(req.query.filterDateEnd)
                        }
                    }
                },
                { $unwind: { path: "$line_items" } },
                { $project: {
                    name: "$line_items.name",
                    quantity: "$line_items.quantity",
                    price: "$line_items.price"
                } },
                {
                    $group: {
                        "_id": "$name",
                        "qtde": { $sum: "$quantity" },
                        "totalPrice": { $sum: "$price" }
                    }
                },
                {
                    $sort: {
                        "_id": 1
                    }
                }
            ]);
            res.json(results);
        }
    }
}