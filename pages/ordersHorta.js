import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [daySelected, setDaySelected] = useState();

    useEffect(() => {
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
        });
    }, []);

    useEffect(() => {
        if (daySelected) {
            setFilteredOrders(
                orders.filter(
                    order => {
                        const orderDate = new Date(order.createdAt);
                        return orderDate.getTime() >= daySelected.getTime();
                    })
            )
        };
    }, [daySelected]);

    let footer = '';
    if (daySelected) {
        footer = <p> Date selected.</p>
    }

    return (
        <Layout>
            <div class="float-container">
                <div style={{ float: "left" }}>Orders</div>
                <div style={{ float: "rigth" }}>
                    Dates:
                    <DayPicker
                        mode="single"
                        selected={daySelected}
                        onSelect={setDaySelected}
                        footer={footer}
                    />
                </div>
            </div>

            <h1>Products</h1>
            <table>
                {filteredOrders.length > 0 && filteredOrders.map(order => (
                    order.line_items.map(l => (
                        <tr>
                            <td>
                                {l.quantity}
                            </td>
                            <td>
                                {l.name}
                            </td>
                        </tr>
                    ))
                ))}
            </table>
        </Layout>
    )
}