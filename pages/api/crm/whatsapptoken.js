import axios from "axios";

export default async function handle(req, res) {
    return new Promise((resolve, reject) => {
        const { method } = req;

        let session = process.env.WHATS_CRM_SESSION;
        let secretkey = process.env.WHATS_SECRET_KEY;

        if (method === 'GET') {
            let host = process.env.WHATS_HOST;

            axios.post(host + '/api/' + session + '/' + secretkey + '/generate-token')
                .catch(error => {
                    console.log(error);
                    res.status(400).send({ message: error.message });
                    resolve();
                })
                .then(response => {
                    res.json(response.data);
                    resolve();
                })
        }
    })
}

