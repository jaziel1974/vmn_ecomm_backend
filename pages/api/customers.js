import { mongooseConnect } from "@/lib/mongoose";
import { Customer } from "@/models/Customer";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Customer.findOne({ _id: req.query.id }));
        }
        else if (req.query?.communicationLabels) {
            const ids = JSON.parse(req.query.communicationLabels);
            res.json(await Customer.find({communicationLabels: {$in: ids}}));
        }
        else {
            res.json(await Customer.find().sort({ name: 1 }));
        }
    }
    else if (method === 'POST') {
        const { name, address, addressExt, addressNotes, priceId, email, phone, communicationLabels, shippingType } = req.body;
        const customerDoc = await Customer.create({
            name, address, addressExt, addressNotes, priceId, email, phone, communicationLabels, shippingType
        });
        res.json(customerDoc);
    }
    else if (method === 'PUT') {
        const {name, address, addressExt, addressNotes, priceId, email, phone, communicationLabels, shippingType, _id} = req.body;
        await Customer.updateOne({_id}, {name, address, addressExt, addressNotes, priceId, email, phone, communicationLabels, shippingType});
        res.json(true);
    }
    else if(method === 'DELETE'){
        if (req.query?.id) {
            await Customer.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}
