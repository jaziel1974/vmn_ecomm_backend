import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

export default function OrdersPage() {
    const [startDate, setStartDate] = useState(addDays(new Date(), -2));
    const [endDate, setEndDate] = useState(new Date());
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (startDate && endDate) {
            axios.get('/api/orders?filterHorta=true&filterDateIni=' + startDate + '&filterDateEnd=' + endDate + '').then(response => {
                setProducts(response.data);
                console.log('orders', products);
            });
        }
    }, [startDate, endDate]);
    
    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    return (
        <Layout>
            <div>
                Between:&nbsp;
                <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                        date.setHours(0, 0, 0, 0);
                        setStartDate(date);
                    }}
                />

                &nbsp;and:&nbsp;
                <DatePicker
                    selected={endDate}
                    onChange={(date) => {
                        date.setHours(0, 0, 0, 0);
                        setEndDate(date);
                    }}
                />
            </div>

            <h1>Products</h1>
            <table>
                {products.length > 0 && products.map(l => (
                    <tr>
                        <td>
                            {l.qtde}
                        </td>
                        <td>
                            {l._id}
                        </td>
                    </tr>
                ))}
            </table>
        </Layout>
    )
}