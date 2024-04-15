'use client';

import React, { useContext } from "react";
import { AppContext } from "@/components/Context";

export default function OrdersToPrint() {
    const { ordersToPrint, setOrdersToPrint } = useContext(AppContext);

    var totalCost = 0.0;
    function calculateTotalCost(price) {
        totalCost += price;
    }
    function useTotalCost() {
        var result = totalCost;
        totalCost = 0.0;
        return result;
    }

    return (
        <container className="A4">
            {ordersToPrint.length > 0 && ordersToPrint.map(order => (
                <div key={order.id} className="orderToPrint">
                    <div>
                        <b>{order.Customers[0]?.name}</b>
                        <hr style={{ height: '5px', color: 'black' }} />
                        {order.Customers[0]?.address}<br></br>
                        {order.Customers[0]?.addressExt}
                    </div>
                    <hr style={{ height: '5px', color: 'black' }} />
                    <div>
                        {order.line_items.map(l => (
                            calculateTotalCost(l.unit_amount),
                            <div>
                                {l.quantity} {l.name} - <b>{l.unit_amount}</b>
                            </div>
                        ))}
                    </div>
                    <hr style={{ height: '5px', color: 'black' }} />
                    <div style={{ float: 'right', paddingBottom: '30px' }}>
                    Total: <b>{useTotalCost()}</b>
                    </div>
                </div>
            ))}
        </container>
    )
}