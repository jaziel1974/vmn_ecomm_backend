import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Product.findOne({ _id: req.query.id }));
        }
        else if (req.query?.stockAvailable) {
            res.json(await Product.find()
                .where('stockAvailable', true)
                .sort({ title: 0 })
            )
        }
        else {
            res.json(await Product.find()
                .sort({ title: 0 })
            )
        }
    }

    if (method === 'POST') {
        const { title, description, price, images, category, properties, stock, pricePerZone, stockAvailable } = req.body;
        const productDoc = await Product.create({
            title, description, price, images, category, properties, stock, pricePerZone, stockAvailable
        });
        res.json(productDoc);
    }

    if (method === 'PUT') {
        const { title, description, price, images, category, properties, stock, pricePerZone, _id, stockAvailable } = req.body;
        await Product.updateOne({ _id }, { title, description, price, images, category, properties, stock, pricePerZone, stockAvailable });
        res.json(true);
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({ _id: req.query?.id });
            res.json(true);
        }
    }
}