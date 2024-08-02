import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
    const [categories, setCategories] = useState([]);
    const [communicationLabels, setCommunicationLabels] = useState([]);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        axios.get('/api/categories/crm/listadistribuicao').then(result => {
            setCategories(result.data);
        })
    }, []);

    useEffect(() => {
        axios.get('/api/customers?communicationLabels=' + JSON.stringify(communicationLabels)).then(result => {
            setCustomers(result.data);
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

    return (
        <Layout>
            <h1>CRM</h1>
            <h2 className="mb-4"><b>Enviar mensagem</b></h2>

            <container className="grid-wrap">
                <div>
                    <label>Pick one or more label</label>
                    <div className="flex mt-4">
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
                    <table className="basic mt-2">
                <thead>
                    <tr>
                        <td>Customer name</td>
                        <td>Address</td>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(customer => (
                        <tr key={customer._id}>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

                </div>
            </container>
        </Layout>
    )
}