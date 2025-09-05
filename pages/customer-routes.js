import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

export default function CustomerRoutesPage() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!startDate || !endDate) return;
        setLoading(true);
        axios.get(`/api/customer-routes?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
            .then(res => setCustomers(res.data))
            .finally(() => setLoading(false));
    }, [startDate, endDate]);

    return (
        <Layout>
            <h1>Customer Routes</h1>
            <div className="flex gap-2 mb-4">
                <div>
                    From: <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                </div>
                <div>
                    To: <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
                </div>
            </div>
            {loading && <div>Loading...</div>}
            <ul>
                {customers.map((customer, idx) => (
                    <li key={idx} className="mb-4 p-2 border rounded">
                        <div><b>{customer.name}</b></div>
                        <div>{customer.address}</div>
                        <div className="flex gap-2 mt-2">
                            <a
                                className="btn-default"
                                href={`https://waze.com/ul?q=${encodeURIComponent(customer.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Waze
                            </a>
                            <a
                                className="btn-default"
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customer.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Google Maps
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
        </Layout>
    );
}
