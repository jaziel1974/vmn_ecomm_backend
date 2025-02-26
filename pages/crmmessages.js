import Layout from "@/components/Layout";
import { readFileAsBase64 } from "@/utils/FileUtils";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";

export default function CRMPage() {
    const [categories, setCategories] = useState([]);
    const [communicationLabels, setCommunicationLabels] = useState([]);
    const [crms, setCrms] = useState([]);
    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        axios.get('/api/categories/crm/listadistribuicao').then(result => {
            setCategories(result.data);
        })
    }, []);

    useEffect(() => {
        if (communicationLabels.length > 0) {
            axios.get('/api/crm/crm?communicationLabels=' + JSON.stringify(communicationLabels)).then(result => {
                setCrms(result.data);
            })
        } else {
            axios.get('/api/crm/crm').then(result => {
                setCrms(result.data);
            })
        }
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

    const selectAll = () => {
        setMessageList(crms);
    };

    const selectNone = () => {
        setMessageList([]);
    };

    const sendMessageConfirmation = async () => {
        if (confirm("Confirme para enviar a mensagem!")) {
            setIsLoading(true);
            await sendCRMMessage();
            setIsLoading(false);
        }
    };

    const sendCRMMessage = async () => {
        setErrors([]);
        let token = null;

        token = await axios.get('/api/crm/whatsapptoken');

        if (!token) {
            setIsLoading(false);
            alert("Token inválido!");
            return;
        }

        for (let i = 0; i < messageList.length; i++) {
            let customer = messageList[i];
            let customMessage = message.replace('${name}', customer.name);
            customMessage = customMessage.replace('${email}', customer.email);

            let data = {
                message: customMessage,
                customer: customer,
                token: token.data
            }
            await axios.post('/api/crm/whatsapp', data)
                .catch(error => {
                    console.log("error", error);
                    setErrors([...errors, {
                        message: error.message,
                        customer: customer
                    }]);
                })
        }

        alert("Envio de mensagens concluído!");
    }

    const sendImageMessage = async () => {
        if (!selectedFile) {
            alert("Selecione um arquivo!");
            return;
        }

        let base64File = await readFileAsBase64(selectedFile);

        setErrors([]);
        let token = null;

        token = await axios.get('/api/crm/whatsapptoken');

        if (!token) {
            setIsLoading(false);
            alert("Token inválido!");
            return;
        }

        for (let i = 0; i < messageList.length; i++) {
            let customer = messageList[i];
            let customMessage = message.replace('${name}', customer.name);
            customMessage = customMessage.replace('${email}', customer.email);

            let data = {
                message: customMessage,
                customer: customer,
                token: token.data,
                file: base64File,
                fileName: "image.png"
            }

            await axios.post('/api/crm/whatsapp-send-image', data)
                .catch(error => {
                    console.log("error", error);
                    setErrors([...errors, {
                        message: error.message,
                        customer: customer
                    }]);
                })
        }

        alert("Envio de mensagens concluído!");
    }

    const sendPdfMessage = async () => {
        if (!selectedFile) {
            alert("Selecione um arquivo!");
            return;
        }

        let base64File = await readFileAsBase64(selectedFile);

        setErrors([]);
        let token = null;

        token = await axios.get('/api/crm/whatsapptoken');

        if (!token) {
            setIsLoading(false);
            alert("Token inválido!");
            return;
        }

        for (let i = 0; i < messageList.length; i++) {
            let customer = messageList[i];
            let customMessage = message.replace('${name}', customer.name);
            customMessage = customMessage.replace('${email}', customer.email);

            let data = {
                message: customMessage,
                customer: customer,
                token: token.data,
                file: base64File
            }

            await axios.post('/api/crm/whatsapp-send-file', data)
                .catch(error => {
                    console.log("error", error);
                    setErrors([...errors, {
                        message: error.message,
                        customer: customer
                    }]);
                })
        }

        alert("Envio de mensagens concluído!");
    }

    const sendReceipt = async () => {
        setErrors([]);
        let token = null;
        token = await axios.get('/api/crm/whatsapptoken');
        if (!token) {
            setIsLoading(false);
            alert("Token inválido!");
            return;
        }

        let startDate = '2025-02-19';
        let endDate = '2025-02-26';

        let orders = await axios.get('/api/orders?filterOrder=true&filterDateIni=' + startDate + '&filterDateEnd=' + endDate + '');

        if (!confirm("Do you want to send " + orders.data.length + " receipts?")) {
            return;
        }

        setIsLoading(true);
        let textReceipt = await axios.get('/api/crm/crmtext?name=ReciboCompra');

        orders.data.map(async order => {
            let messageReceipt = textReceipt.data.text;
            let receipt = createReceipt(order);
            let customer = order.Customers[0];
            messageReceipt = messageReceipt.replace('${name}', customer.name);
            messageReceipt = messageReceipt.replace('${date}', format(parseISO(order.createdAt), "dd/MM/yyyy"));
            messageReceipt = messageReceipt.replace('${receipt}', receipt);

            let data = {
                message: messageReceipt,
                customer: customer,
                token: token.data
            }

            await axios.post('/api/crm/whatsapp', data)
                .catch(error => {
                    console.log("error", error);
                    setErrors([...errors, {
                        message: error.message,
                        customer: customer
                    }]);
                })

            //console.log('data', data);
        })
        alert("Envio de recibos concluído!");
        setIsLoading(false);
    }

    const createReceipt = (order) => {
        let totalCost = 0;
        let description = "";
        let report =
            "Nome: " + order.Customers[0]?.name + "\n" +
            "Endereço: " + order.Customers[0]?.address + " " + order.Customers[0]?.addressExt + "\n\n";

        order.line_items.map(l => (
            totalCost += l.unit_amount,
            description = ("`" + l.quantity + " " + l.name).substring(0, 20),
            report += description + fillWithSpaces(25 - description.length),
            report += " R$ " + l.unit_amount + "`\n"
        ))
        report += "`Total: R$ " + totalCost + "`";

        if (order.customerNotes) {
            report += "\nNotas: " + order.customerNotes;
        }

        report += "\npix para verdemusgonatural@gmail.com"

        return report;
    }

    const fillWithSpaces = (length) => {
        let result = "";
        for (let i = 0; i < length; i++) {
            result += " ";
        }
        return result;
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    return (
        <Layout>
            <span className="text-2xl font-bold mb-4">CRM</span>
            <button className="btn-primary mt-2 ml-4" onClick={ev => sendReceipt()}>Send Receipt</button>
            <div className="mt-3 p-3" style={{ border: '1px solid black' }}>
                <label>Message:</label>
                <textarea className="h-32 mt-2 ml-4" style={{ width: '99%' }} placeholder="Message" onChange={e => setMessage(e.target.value)}></textarea>

                <container className="grid-wrap" style={{ width: '99%' }}>
                    <div style={{ maxWidth: '98%' }}>
                        <label>Labels</label>
                        <div className="flex mt-2 ml-4 flex-wrap">
                            {categories.length > 0 && categories.map((c, index) => (
                                <div key={c._id}>
                                    <input type="checkbox"
                                        id={c._id}
                                        value={c._id}
                                        checked={communicationLabels.find(item => item === c._id) != undefined}
                                        onChange={handleCategoryCheck}
                                        className="w-7 h-5 align-middle"
                                    />
                                    <label htmlFor={`category-${index}`} className="ml-2 mr-2 align-top">{c.name} |</label>
                                </div>
                            ))}
                        </div>
                        <label>Filter by name</label>
                        <input type="text" onChange={handleNameFilter} className="h-8 mt-2 ml-4" />
                        <button className="btn-primary mt-2 ml-4" onClick={selectAll}>Select All</button>
                        <button className="btn-red mt-2 ml-4" onClick={selectNone}>Remove All</button>
                        <button className="btn-primary mt-2 ml-4" onClick={ev => sendImage()}>Send Image</button>
                        <div className="flex mt-2 ml-4 max-h-screen overflow-auto">
                            <table className="basic mt-2 mr-2">
                                <thead>
                                    <tr>
                                        <td>CRM List</td>
                                    </tr>
                                </thead>
                                <tbody >
                                    {crms.map(crm => (
                                        <tr key={crm._id} onClick={() => setMessageList(messageList.concat(crm))}>
                                            <td>{crm.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <table className="basic mt-2 " style={{ height: 'fit-content' }}>
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
            <div>
                <h1>Upload a file</h1>
                <input type="file" onChange={handleFileChange} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'sticky', bottom: '10px', marginTop: '10px', marginRight: '10px' }}>
                <button type="button" className="btn-primary ml-4 shadow-xl ring-1 sm:rounded-xl sm:px-10" onClick={ev => sendImageMessage()}>Enviar xmas mensagem</button>
            </div>

            <div style={{ position: 'sticky', bottom: '10px', marginTop: '10px' }}>
                {isLoading && <span>"wait... processing..."</span>}
            </div>

            {errors &&
                <div className="flex mt-2 ml-4">
                    <table className="basic mt-2 mr-2">
                        <tbody>
                            {errors.map((error, index) => (
                                <tr key={index}>
                                    <td>{error.customer.name + ": " + error.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </Layout >
    )
}
