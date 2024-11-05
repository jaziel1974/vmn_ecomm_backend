import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "../auth/[...nextauth]";
import { CrmText } from "@/models/CrmText";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        if (req.query?.id) {
            let data = await CrmText.findOne({ _id: req.query?.id });
            res.json(data);
        }
        else if(req.query?.name){
            let data = await CrmText.findOne({ name: req.query.name });
            res.json(data);
        }
        else {
            let data = await CrmText.find()
                .sort({ name: 1 })
            res.json(data);
        }
    }

    else if (method === 'POST') {
        const { name, text } = req.body;
        const customerDoc = await CrmText.create({
            name, text
        });
        res.json(customerDoc);
    }

    else if (method === 'PUT') {
        const {name, text, _id} = req.body;
        await CrmText.updateOne({_id}, {name, text});
        res.json(true);
    }

    else if(method === 'DELETE'){
        if (req.query?.id) {
            await CrmText.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}
