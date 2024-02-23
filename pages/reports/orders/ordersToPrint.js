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
                        <b>{order.Customers[0]?.name}</b>
                        <hr style={{height: '5px', color: 'black'}}/>
                        {order.Customers[0]?.address}<br></br>
                        {order.Customers[0]?.addressExt}
                        <hr style={{height: '5px', color: 'black'}}/>
                    </div>
                    <div>
                        {order.line_items.map(l => (
                            <div>
                                {l.quantity} {l.name} - {l.unit_amount/100}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </container>
    )
}