import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { isAdminRequest } from "../auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        const type = req.query.type;
        if (!type) res.status(400).json({ error: 'Missing type' });

        if (type[0] === 'crm' && type[1] === 'listadistribuicao') {
            const parent = await Category.findOne({ name: 'CRM' });
            const child = await Category.findOne({ parent: parent._id });
            res.json(await Category.find({ parent: child._id }).populate('parent'));
        }
        else{
            if (!type) res.status(400).json({ error: 'Invaid type' });
        }
    }
    else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}