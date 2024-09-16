import { mongooseConnect } from "@/lib/mongoose";
import { Crm } from "@/models/Crm";
import { isAdminRequest } from "./../auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        if (req.query?.id) {
            let data = await Crm.findOne({ _id: req.query?.id });
            res.json(data);
        }
        else if (req.query?.communicationLabels) {
            const ids = JSON.parse(req.query.communicationLabels);
            let data = await Crm.find({ communicationLabels: { $in: ids } }).sort({ name: 1 });
            res.json(data);
        }
        else {
            let data = await Crm.find()
                .sort({ name: 1 })
            res.json(data);
        }
    }

    else if (method === 'POST') {
        const { name, email, phone, communicationLabels } = req.body;
        const customerDoc = await Crm.create({
            name, email, phone, communicationLabels
        });
        res.json(customerDoc);
    }

    else if (method === 'PUT') {
        const {name, email, phone, communicationLabels, _id} = req.body;
        await Crm.updateOne({_id}, {name, email, phone, communicationLabels});
        res.json(true);
    }

    else if(method === 'DELETE'){
        if (req.query?.id) {
            await Crm.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}
