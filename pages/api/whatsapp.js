export default function handle(req, res) {
    const { method } = req;
    const token = "EAAI29Ddo4GcBOxLX9DHjoglL1THlZBTyb4uSsGwJn5SpqZBzuSK27YZCr6sNhMAB47S7VIbKtHpZAjT5TO7MK3HLJZCQKNaOuL62OKcAAwEhAF58P8fD0NGNjsBbNyrNpqv3LoeGN8pq2MkyAPPvUrYiAKXma3HeF9RpLsgo0vbsAuFe8NEwDdgwU1BodKWoOQooOg3aza7OUy1t7gL12skJctIvkGifsVxoZD"

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

    if (method === 'POST') {
        let bodyData = req.body;
        if(bodyData.object) {
            if(bodyData.entry && 
                bodyData.entry[0].changes &&
                bodyData.entry[0].changes[0].value.message &&
                bodyData.entry[0].changes[0].value.message[0]
                ) {
                    let phoneId = bodyData.entry[0].changes[0].value.metadata.phone_number_id;
                    let from = bodyData.entry[0].changes[0].value.messages[0].from;
                    let msgBody = bodyData.entry[0].changes[0].value.messages[0].text.body;

                    axios({
                        method: 'POST',
                        url:"https://graph.facebook.com/v13.0/"+phoneId+"message?access_token="+token,
                        data:{
                            messaging_product:"whatsapp",
                            to:from,
                            text:"Hi... I'm vmn"
                        },
                        headers:{
                            "Content-Type": "application/json"
                        }
                    });
                    res.sendStatus(200);
                }else{
                    res.sendStatus(404);
                }
        }
    }
}