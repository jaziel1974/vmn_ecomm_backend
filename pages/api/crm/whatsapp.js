import axios from "axios";

export default async function handle(req, res) {
    return new Promise((resolve, reject) => {
        const { method } = req;

        if (method === 'POST') {
            let session = process.env.WHATS_CRM_SESSION;
            let host = process.env.WHATS_HOST;

            const { customer, message, token } = req.body;

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.token,
                'Accept': '*/*'
            }

            const data = {
                phone: customer.phone,
                isGroup: false,
                isNewsletter: false,
                message: message
            }

            axios.post(host + '/api/' + session + '/send-message', data, { headers: headers })
                .then(result => {
                    res.json(result.data);
                    resolve();
                }).catch(error => {
                    res.status(400).send({ message: "sending whats" + error.message });
                    resolve();
                });
        }
    });
}