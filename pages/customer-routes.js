import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

function getDefaultDateRange() {
    const today = new Date();
    const day = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    let start, end;
    if (day === 4 || day === 5 || day === 6 || day === 0 || day === 1) { // Thu(4), Fri(5), Sat(6), Sun(0), Mon(1)
        // This week's Thursday to next Monday
        start = new Date(today);
        // Find this week's Thursday
        const daysSinceThursday = (day + 3) % 7; // Thursday is 4
        start.setDate(today.getDate() - daysSinceThursday);
        start.setHours(0,0,0,0);
        end = new Date(start);
        // Find next Monday
        const thursdayDay = start.getDay();
        const daysToNextMonday = (8 - thursdayDay) % 7 + 4; // always 4 days after Thursday
        end.setDate(start.getDate() + daysToNextMonday);
        end.setHours(23,59,59,999);
    } else {
        // Previous Thursday to previous Wednesday
        end = new Date(today);
        // Find previous Wednesday
        const daysSinceWednesday = (day + 4) % 7; // Wednesday is 3
        end.setDate(today.getDate() - daysSinceWednesday);
        end.setHours(23,59,59,999);
        start = new Date(end);
        // Find previous Thursday
        const endDay = end.getDay();
        const daysSinceThursday = (endDay + 3) % 7; // Thursday is 4
        start.setDate(end.getDate() - daysSinceThursday);
        start.setHours(0,0,0,0);
    }
    return [start, end];
}

export default function CustomerRoutesPage() {
    const [defaultStart, defaultEnd] = getDefaultDateRange();
    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(defaultEnd);
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
                    <li key={idx} className="mb-4 p-2 border rounded flex items-center gap-4">
                        <div>
                            <b>{customer.name}</b><br />
                            {customer.address}
                        </div>
                        <div className="flex gap-2 ml-auto">
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
