export default function handle(req, res) {
    const { method } = req;
    const token = "EAAI29Ddo4GcBOxLX9DHjoglL1THlZBTyb4uSsGwJn5SpqZBzuSK27YZCr6sNhMAB47S7VIbKtHpZAjT5TO7MK3HLJZCQKNaOuL62OKcAAwEhAF58P8fD0NGNjsBbNyrNpqv3LoeGN8pq2MkyAPPvUrYiAKXma3HeF9RpLsgo0vbsAuFe8NEwDdgwU1BodKWoOQooOg3aza7OUy1t7gL12skJctIvkGifsVxoZD"
    const myToken = "vmn";

    if (method === 'GET') {
        /*
        let mode = req.query["hub.mode"];
        let challenge = req.query["hub.challenge"];
        let token = req.query["hub.verify_token"];


        if (mode && token) {
            if (mode === "subscribe" && token === myToken) {
                res.status(200).send(challenge);
            } else {
                res.status(403).send('Method not allowed.');
            }
        }
        res.status(403).send('Method not allowed.');
        */

        // Parse params from the webhook verification request
        let mode = req.query["hub.mode"];
        let token = req.query["hub.verify_token"];
        let challenge = req.query["hub.challenge"];

        // Check if a token and mode were sent
        if (mode && token) {
            // Check the mode and token sent are correct
            if (mode === "subscribe" && token === myToken) {
                // Respond with 200 OK and challenge token from the request
                res.status(200).send(challenge);
            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                res.sendStatus(403);
            }
        }
    }

    if (method === 'POST') {
        /*
        let bodyData = req.body;
        if (bodyData.object) {
            if (bodyData.entry &&
                bodyData.entry[0].changes &&
                bodyData.entry[0].changes[0].value.message &&
                bodyData.entry[0].changes[0].value.message[0]
            ) {
                let phoneId = bodyData.entry[0].changes[0].value.metadata.phone_number_id;
                let from = bodyData.entry[0].changes[0].value.messages[0].from;
                let msgBody = bodyData.entry[0].changes[0].value.messages[0].text.body;

                axios({
                    method: 'POST',
                    url: "https://graph.facebook.com/v13.0/" + phoneId + "message?access_token=" + token,
                    data: {
                        messaging_product: "whatsapp",
                        to: from,
                        text: "Hi... I'm vmn"
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        }
        */

        // Parse the request body from the POST
        let body = req.body;

        // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
        if (req.body.object) {
            if (
                req.body.entry &&
                req.body.entry[0].changes &&
                req.body.entry[0].changes[0] &&
                req.body.entry[0].changes[0].value.messages &&
                req.body.entry[0].changes[0].value.messages[0]
            ) {
                let phone_number_id =
                    req.body.entry[0].changes[0].value.metadata.phone_number_id;
                let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
                let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
                axios({
                    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
                    url:
                        "https://graph.facebook.com/v12.0/" + phone_number_id +
                        "/messages?access_token=" + token,
                    data: {
                        messaging_product: "whatsapp",
                        to: from,
                        text: { body: "Ack: " + msg_body },
                    },
                    headers: { "Content-Type": "application/json" },
                });
            }
            res.sendStatus(200);
        } else {
            // Return a '404 Not Found' if event is not from a WhatsApp API
            res.sendStatus(404);
        }
    }
}