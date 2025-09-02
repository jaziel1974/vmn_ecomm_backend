import { AppContext } from "@/components/Context";
import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";

export default function OrdersPage() {
    const {setOrdersToPrint} = useContext(AppContext);
    const {startDate, setStartDate} = useContext(AppContext);
    const {endDate, setEndDate} = useContext(AppContext);

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/api/orders?filterOrder=true&filterDateIni=' + startDate + '&filterDateEnd=' + endDate).then(response => {
            setOrders(response.data);
            setOrdersToPrint(response.data);
        });
    }, [startDate, endDate]);

    function removeOrder(orderId) {
        axios.delete("/api/orders?_id=" + orderId)
            .then(result => {
                var filteredOrders = orders.filter((i) => i._id !== orderId);
                setOrders(filteredOrders);
            });
    }

    function pay(orderId, paid) {
        axios.put("/api/orders?_id=" + orderId + "&paid=" + paid)
            .then(result => {
                const alteredFilteredOrders = [...orders];

                let order = alteredFilteredOrders.find(
                    a => a._id === orderId
                );
                order.paid = paid;
                setOrders(alteredFilteredOrders);
            })
    }

    function deliver(orderId) {
        axios.put("/api/orders?_id=" + orderId + "&deliver=" + true)
            .then(result => {
                const alteredFilteredOrders = [...orders];

                let order = alteredFilteredOrders.find(
                    a => a._id === orderId
                );
                order.status = "delivered";
                setOrders(alteredFilteredOrders);
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
                <Link className="btn-default text-sm mb-2" href="./reports/orders/ordersToPrintCustomer">Print (Customer)</Link>
                <Link className="btn-default text-sm mb-2" href="./reports/orders/ordersToPrintAdmin">Print (Admin)</Link>
            </div>
            <container className="grid-wrap">
                <div>
                    <table className="basic">
                        <thead>
                            <tr>
                                <th>Date</th>
                                {<th>Paid/Delivered</th>}
                                <th style={{ width: '18%' }}>Recipient</th>
                                <th style={{ width: '40%' }}>Products</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 && orders.map(order => {
                                // Calculate total for the order
                                const total = order.line_items.reduce((sum, l) => sum + (l.unit_amount), 0);
                                return (
                                    <React.Fragment key={order._id}>
                                        <tr>
                                            <td>
                                                {new Date(order.createdAt).toLocaleString()}
                                            </td>
                                            <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                                                <button type="button" className="btn-default"  onClick={ev => pay(order._id, !order.paid)}>{order.paid ? 'YES' : 'NO'}</button>
                                                <button type="button" className="btn-default"  onClick={ev => deliver(order._id)} >{order?.status === 'delivered' ? 'Delivered' : "Press to deliver"}</button>
                                            </td>
                                            <td style={{ width: '18%' }}>
                                                <b>{order.name}</b> {order.email} <br></br>
                                                {orders.city != null ?
                                                    order.city && order.postalCode && order.country : null}
                                                {order.streetAddress}
                                            </td>
                                            <td style={{ width: '40%' }}>
                                                {order.line_items.map(l => (
                                                    <>
                                                        <span id={l.name}>{l.quantity} {l.name} {l.unit_amount}</span><br></br>
                                                    </>
                                                ))}
                                                <Link className="btn-default" href={{
                                                    pathname: '/orders/edit/' + order._id,
                                                    query: {
                                                        "lineItems": order.line_items,
                                                        "adminNotes": order.adminNotes
                                                    }
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                Total: {total}
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </container>
        </Layout>
    )
}