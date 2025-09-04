import { mongooseConnect } from "@/lib/mongoose";
import { CustomerHold } from "@/models/CustomerHold";
import { isAdminRequest } from "../auth/[...nextauth]";
import { User } from "@/models/User";
import { HttpStatusCode } from "axios";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'POST') {
        const { id } = req.body;

        const customerDoc = await CustomerHold.findById({ _id: id });
        if (customerDoc) {
            User.create({
                name: customerDoc.name,
                email: customerDoc.email,
                phoneNumber: customerDoc.phoneNumber,
                password: customerDoc.password
            })
                .then(() => {
                    CustomerHold.deleteOne({ _id: id })
                    .then(() => {
                        res.json(HttpStatusCode.Accepted);
                    })
                    .catch((error) => {
                        console.log(error);
                        res.json(HttpStatusCode.InternalServerError);
                        return;
                    })
                });
        }
    }
    res.json(HttpStatusCode.Accepted);
}
