import axios from "axios";

export default async function handle(req, res) {

    return new Promise((resolve, reject) => {
        const { method } = req;

        if (method === 'POST') {
            let session = process.env.WHATS_CRM_SESSION;
            let host = process.env.WHATS_HOST;

            const { customer, message, token, file, fileName } = req.body;

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.token,
                'Accept': '*/*'
            }

            const payload = {
                phone: customer.phone,
                isGroup: false,
                base64: `data:image/jpeg;base64,${file}`,
                filename: fileName,
                caption: message
            }

            axios.post(host + '/api/' + session + '/send-image', payload, { headers: headers })
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

export const config = {
    api: { 
        bodyParser: {
            sizeLimit: '100mb'
        } 
    }
}