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
        else {
            res.json(await Customer.find())
        }
    }

    if (method === 'POST') {
        const { name, address, addressExt, addressNotes, priceId, email } = req.body;
        const customerDoc = await Customer.create({
            name, address, addressExt, addressNotes, priceId, email
        });
        res.json(customerDoc);
    }

    if (method === 'PUT') {
        const {name, address, addressExt, addressNotes, priceId, email, _id} = req.body;
        await Customer.updateOne({_id}, {name, address, addressExt, addressNotes, priceId, email});
        res.json(true);
    }

    if(method === 'DELETE'){
        if (req.query?.id) {
            await Customer.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}
