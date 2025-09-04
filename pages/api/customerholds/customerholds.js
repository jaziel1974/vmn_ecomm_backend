import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./../auth/[...nextauth]";
import { CustomerHold } from "@/models/CustomerHold";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await CustomerHold.findOne({ _id: req.query.id }));
        }
        else {
            res.json(await CustomerHold.find().sort({ name: 1 }));
        }
    }
    else if (method === 'POST') {
        const { name, email } = req.body;
        const userDoc = await CustomerHold.create({
            name, email
        });
        res.json(userDoc);
    }
    else if (method === 'PUT') {
        const {name, email, _id} = req.body;
        await CustomerHold.updateOne({_id}, {name, email});
        res.json(true);
    }
    else if(method === 'DELETE'){
        if (req.query?.id) {
            await CustomerHold.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}