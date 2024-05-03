'use client';

import React, { useContext } from "react";
import { AppContext } from "@/components/Context";

export default function ProductsToPrint() {
    const { productsToPrint } = useContext(AppContext);

    console.log(productsToPrint);

    return (
        <container className="A4">
            <table className="basic mt-2">
                <thead>
                    <tr>
                        <td>Product name</td>
                        <td>Description</td>
                        <td>Available</td>
                    </tr>
                </thead>
                <tbody>
                    {productsToPrint.length > 0 && productsToPrint.map(product => (
                        <tr key={product.id}>
                            <td>{product.title}</td>
                            <td>{product.description}</td>
                            <td>
                                {product.stockAvailable ? "Yes" : "No"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </container>
    )
}