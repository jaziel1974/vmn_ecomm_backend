import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function OrderForm({
    _id,
    line_items: existingLineItems,
    adminNotes: existingAdminNotes,
    customerNotes: existingCustomerNotes
}) {

    useEffect(() => {
        axios.get('/api/products').then(result => {
            setProducts(result.data);
        })
    }, []);

    const [products, setProducts] = useState([]);
    const [lineItems, setLineItems] = useState(existingLineItems || []);
    const [adminNotes, setAdminNotes] = useState(existingAdminNotes || "");
    const [customerNotes, setCustomerNotes] = useState(existingCustomerNotes || "");
    const [goToOrders, setGoToOrders] = useState(false);

    const [qtd, setQtd] = useState(0);
    const [product, setProduct] = useState(null);
    const [price, setPrice] = useState(700);

    const router = useRouter();

    function addItem() {
        if (qtd > 0 && product && price) {
            let newLine = {
                quantity: parseInt(qtd),
                currency: "USD",
                name: product,
                unit_amount: parseInt(price)
            }

            if (!lineItems.includes(newLine)) {
                setLineItems([...lineItems, newLine]);
            }
            else {
                throw new Error("Item already exists");
            }

        }
        else {
            throw new Error("Please, fill in the quantity field, the product field and the price field");
        }
    }

    function removeItem(item) {
        const newLineItems = lineItems.filter((li) => {
            return li.name !== item;
        });
        setLineItems(newLineItems);
    }

    async function saveOrder(ev) {
        ev.preventDefault();
        const data = { lineItems };
        //update
        await axios.put('/api/orders', { ...data, adminNotes, customerNotes, _id })
        setGoToOrders(true);
    }

    function cancelChanges() {
        setGoToOrders(true);
    }


    if (goToOrders) {
        router.push('/orders');
    }

    return (
        <form onSubmit={saveOrder}>
            <table>
                <thead>
                    <tr>
                        <th>Quantity</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {lineItems.map(l => (
                        <tr>
                            <td>
                                <>
                                    {l.quantity}
                                </>
                            </td>
                            <td>
                                <>
                                    {l.name}
                                </>
                            </td>
                            <td>
                                <>
                                    {l.unit_amount}
                                </>
                            </td>
                            <td>
                                <button type="button" className="btn-default" onClick={ev => removeItem(l.name)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>
                            <input type="text" placeholder="Qtd" onChange={ev => setQtd(ev.target.value)}></input>
                        </td>
                        <td>
                            <select placeholder="Product" onChange={ev => { setProduct(ev.target.value) }}>
                                <option></option>
                                {products.length > 0 && products.map(p => (
                                    <option key={p._id} value={p._title}>{p.title}</option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <input type="text" placeholder="Price" onChange={ev => setPrice(ev.target.value)}></input>
                        </td>
                        <button type="button" className="btn-default" onClick={ev => addItem()}>Add</button>
                        <td>
                        </td>
                    </tr>
                </tbody>
            </table>
            <textarea name="adminNotes" id="adminNotes" placeholder="Admin Notes" cols="30" rows="4" value={adminNotes} onChange={ev => setAdminNotes(ev.target.value)}></textarea>
            <textarea name="customerNotes" id="customerNotes" placeholder="Customer Notes" cols="30" rows="4" value={customerNotes} onChange={ev => setCustomerNotes(ev.target.value)}></textarea>
            <button type="submit" className="btn-primary mr-2">Save</button>
            <button type="button" className="btn-red mr-2" onClick={ev => cancelChanges()}>Cancel</button>
        </form>
    )
}