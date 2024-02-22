import React, { useEffect, useState } from "react";

export default function OrdersToPrint() {
    const [ordersToPrint, setOrdersToPrint] = useState([]);

    useEffect(() => {
        setOrdersToPrint(JSON.parse(localStorage.getItem('OrdersToPrint')));
    }, []);

    return (
        <container className="A4">
            {ordersToPrint.length > 0 && ordersToPrint.map(order => (
                <div key={order.id} className="orderToPrint">
                    <div>
                        <b>{order.Customers[0]?.name}</b><br></br>
                        {order.Customers[0]?.address}<br></br>
                        {order.Customers[0]?.addressExt}<br></br>
                    </div>
                    <div>
                        {order.line_items.map(l => (
                            <div>
                                {l.quantity} {l.name}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </container>
    )
}