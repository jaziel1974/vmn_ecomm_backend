import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
    await mongooseConnect();
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        return res.status(400).json({ error: "Missing date range" });
    }
    // Find orders in date range
    const orders = await Order.find({
        createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    });
    // Map to unique customers by email
    const unique = {};
    for (const order of orders) {
        if (!order.email) continue;
        if (!unique[order.email]) {
            unique[order.email] = {
                name: order.name,
                address: order.streetAddress,
                email: order.email
            };
        }
    }
    res.json(Object.values(unique));
}
