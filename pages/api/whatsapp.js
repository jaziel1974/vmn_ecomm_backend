export default function handle(req, res) {
    const { method } = req;

    if (method === 'GET') {
        let mode = req.query["hub.mode"];
        let challenge = req.query["hub.challenge"];
        let token = req.query["hub.verify_token"];

        const myToken = "vmn";

        if (mode && token) {
            if (mode === "subscribe" && token === myToken) {
                res.status(200).send(challenge);
            } else {
                res.status(403).send('Method not allowed.');
            }
        }
        res.status(403).send('Method not allowed.');
    }
}