import { mongooseConnect } from "@/lib/mongoose";
import { CustomerHold } from "@/models/CustomerHold";
import { isAdminRequest } from "../auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        res.json(await CustomerHold.find({}));
    }
}
