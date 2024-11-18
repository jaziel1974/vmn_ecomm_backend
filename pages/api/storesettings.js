import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";
import { StoreSetting } from "@/models/StoreSetting";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'PUT') {
        const { id } = req.body;

        var data = await StoreSetting.findOne({ id: id });
        var result = await StoreSetting.updateOne( { _id: data._id }, { id, value: !data.value});
        res.json(!data.value);
    }
}