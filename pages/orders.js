import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        var date = new Date() - 3;
        axios.get('/api/orders?filterDate=' + date).then(response => {
            setOrders(response.data);
        });
    }, []);

    useEffect(() => {
        if (startDate && endDate && orders) {
            setFilteredOrders(
                orders.filter(
                    order => {
                        const orderDate = new Date(order.createdAt);
                        return orderDate.getTime() >= startDate.getTime() && orderDate.getTime() <= endDate.getTime();
                    })
            );
            localStorage.setItem('OrdersToPrint', JSON.stringify(filteredOrders));
        };
    }, [startDate]);

    function removeOrder(orderId) {
        axios.delete("/api/orders?_id=" + orderId)
            .then(result => {
                setFilteredOrders((order) => {
                    order.filter((i) => i._id !== orderId)
                });
            });
    }

    function pay(orderId, paid) {
        console.log(orderId);
        axios.put("/api/orders?_id=" + orderId + "&paid=" + paid)
            .then(result => {
                const alteredFilteredOrders = [...filteredOrders];

                let order = alteredFilteredOrders.find(
                    a => a._id === orderId
                );
                order.paid = paid;
                setFilteredOrders(alteredFilteredOrders);
            })
    }

    return (
        <Layout>
            <h1>Orders</h1>
            <div className="flex">
                <div>
                    Between:&nbsp;
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                            date.setHours(0, 0, 0, 0);
                            setStartDate(date);
                        }}
                    />
                </div>
                <div>
                    &nbsp;and:&nbsp;
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => {
                            date.setHours(0, 0, 0, 0);
                            setEndDate(date);
                        }}
                    />
                </div>
                <Link className="btn-default" href="/ordersToPrint" target="_blank" state={orders}>Print</Link>
            </div>
            <container className="grid-wrap">
                <div>
                    <table className="basic">
                        <thead>
                            <tr>
                                <th>Date</th>
                                {<th>Paid</th>}
                                <th>Recipient</th>
                                <th>Products</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 && filteredOrders.map(order => (
                                <tr key={order._id}>
                                    <td>
                                        {new Date(order.createdAt).toLocaleString()}
                                        <button type="button" className="btn-default" onClick={ev => removeOrder(order._id)}>Remove</button>
                                    </td>
                                    {
                                        <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                                            <button onClick={ev => pay(order._id, !order.paid)}>{order.paid ? 'YES' : 'NO'}</button>
                                        </td>
                                    }
                                    <td>
                                        <b>{order.name}</b> {order.email} <br></br>
                                        {orders.city != null ?
                                            order.city && order.postalCode && order.country : null}
                                        {order.streetAddress}
                                    </td>
                                    <td>
                                        {order.line_items.map(l => (
                                            <>
                                                {l.quantity} {l.price_data.product_data.name}<br></br>
                                            </>
                                        ))}
                                        <Link className="btn-default" href={{
                                            pathname: '/orders/edit/' + order._id,
                                            query: {
                                                "lineItems": order.line_items
                                            }
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </container>
        </Layout>
    )
}