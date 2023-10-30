import React, { useEffect, useState } from "react";

export default function OrdersToPrint() {
    const [ordersToPrint, setOrdersToPrint] = useState([]);

    useEffect(() => {
        setOrdersToPrint(JSON.parse(localStorage.getItem('OrdersToPrint')));
    }, []);

    return (
        <div style={{display: "flex", "flex-wrap": "wrap", "grid-gap": "0.5cm", width: "22cm"}}>
            {ordersToPrint.length > 0 && ordersToPrint.map(order => (
                <div key={order.id} style={{width: "5cm"}}>
                    <div>
                        <b>{order.Customers[0]?.name}</b><br></br>
                        {order.Customers[0]?.address}<br></br>
                        {order.Customers[0]?.addressExt}<br></br>
                    </div>
                    <div>
                        {order.line_items.map(l => (
                            <div>
                                {l.quantity} {l.price_data.product_data.name}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}