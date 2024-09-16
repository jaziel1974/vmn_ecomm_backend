import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CRMPage() {
    const [categories, setCategories] = useState([]);
    const [communicationLabels, setCommunicationLabels] = useState([]);
    const [crms, setCrms] = useState([]);
    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        axios.get('/api/categories/crm/listadistribuicao').then(result => {
            setCategories(result.data);
        })
    }, []);

    useEffect(() => {
        axios.get('/api/crm/crm?communicationLabels=' + JSON.stringify(communicationLabels)).then(result => {
            setCrms(result.data);
        })
    }, [communicationLabels]);

    const handleCategoryCheck = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setCommunicationLabels([...communicationLabels, value]);
        } else {
            setCommunicationLabels(communicationLabels.filter(item => item !== value));
        }
    };

    const handleNameFilter = (e) => {
        const value = e.target.value;
        setCrms(crms.filter(c => c.name.toLowerCase().includes(value)));
    };

    const sendMessageConfirmation = async () => {
        if (confirm("Confirme para enviar a mensagem!")) {
            setIsLoading(true);
            await sendMessage();
            setIsLoading(false);
        }
    };

    const sendMessage = async () => {

        let token = null;

        token = await axios.get('/api/crm/whatsapptoken');
        console.log("token", token);

        if (!token) {
            setIsLoading(false);
            alert("Token inválido!");
            return;
        }

        for(let i = 0; i < messageList.length; i++) {
            let customer = messageList[i];
            let customMessage = message.replace('${name}', customer.name);

            let data = {
                message: customMessage,
                customer: customer,
                token: token.data
            }
            await axios.post('/api/crm/whatsapp', data);
        }

        alert("Mensagens enviadas com sucesso!");
    }

    return (
        <Layout>
            <h1>CRM</h1>
            <div style={{ border: '1px solid black', padding: '10px' }}>
                <label>Message:</label>
                <textarea className="h-32 mt-2 ml-4" style={{ width: '99%' }} placeholder="Message" onChange={e => setMessage(e.target.value)}></textarea>

                <container className="grid-wrap" style={{ width: '99%' }}>
                    <div>
                        <label>Labels</label>
                        <div className="flex mt-2 ml-4">
                            {categories.length > 0 && categories.map((c, index) => (
                                <>
                                    <input type="checkbox"
                                        id={c._id}
                                        key={c._id}
                                        value={c._id}
                                        checked={communicationLabels.find(item => item === c._id) != undefined}
                                        onChange={handleCategoryCheck}
                                        className="w-7 h-5"
                                    />
                                    <label htmlFor={`category-${index}`} className="ml-2 mr-2">{c.name}</label>
                                </>
                            ))}
                        </div>
                        <label>Filter by name</label>
                        <input type="text" onChange={handleNameFilter} className="h-8 mt-2 ml-4" />
                        <div className="flex mt-2 ml-4">
                            <table className="basic mt-2 mr-2">
                                <thead>
                                    <tr>
                                        <td>CRM List</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {crms.map(crm => (
                                        <tr key={crm._id} onClick={() => setMessageList(messageList.concat(crm))}>
                                            <td>{crm.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <table className="basic mt-2" style={{ height: 'fit-content' }}>
                                <thead>
                                    <tr>
                                        <td>Message List</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messageList.map(crm => (
                                        <tr key={crm._id} onClick={() => setMessageList(messageList.filter(c => c._id !== crm._id))}>
                                            <td>{crm.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </container>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'sticky', bottom: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-primary ml-4" onClick={ev => sendMessageConfirmation()}>Enviar mensagem</button>
            </div>

            <div style={{ position: 'sticky', bottom: '10px', marginTop: '10px' }}>
                {isLoading && <span>"wait... processing..."</span>}
            </div>
        </Layout >
    )
}
