import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CustomerForm(
    {
        _id,
        name: existingName,
        address: existingAddress,
        addressExt: existingAddressExt,
        addressNotes: existingAddressNotes,
        priceId: existingPriceId,
        email: existingEmail,
    }) {
    const [name, setName] = useState(existingName || '');
    const [address, setAddress] = useState(existingAddress || '');
    const [addressExt, setAddressExt] = useState(existingAddressExt || '');
    const [addressNotes, setAddressNotes] = useState(existingAddressNotes || '');
    const [priceId, setPriceId] = useState(existingPriceId || 1);
    const [email, setEmail] = useState(existingEmail || "");
    const [goToCustomers, setGoToCustomers] = useState(false);
    const router = useRouter();

    /*
    replace below code with price list
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, []);
    */

    async function saveCustomer(ev) {
        ev.preventDefault();
        const data = { name, address, addressExt, addressNotes, priceId, email };
        if (_id) {
            //update
            await axios.put('/api/customers', { ...data, _id })
        }
        else {
            //create
            await axios.post('/api/customers', data);
        }
        setGoToCustomers(true);
    }

    if (goToCustomers) {
        router.push('/customers');
    }

    return (
        <form onSubmit={saveCustomer}>
            <label>Customer name</label>
            <input type="text" placeholder="customer name"
                value={name} onChange={ev => setName(ev.target.value)}>
            </input>
            <label>Address</label>
            <input type="text" placeholder="address"
                value={address} onChange={ev => setAddress(ev.target.value)}>
            </input>
            <label>Address extension</label>
            <input type="text" placeholder="address extension"
                value={addressExt} onChange={ev => setAddressExt(ev.target.value)}>
            </input>
            <label>Address notes</label>
            <textarea placeholder="address notes"
                value={addressNotes} onChange={ev => setAddressNotes(ev.target.value)}>
            </textarea>
            <label>Price id</label>
            <input type="number" placeholder="price id"
                value={priceId} onChange={ev => setPriceId(ev.target.value)}>
            </input>
            <p>-1: São Paulo; 1: Embu-Guaçu; 2: Horta na Porta</p>
            <label>Email</label>
            <input type="text" placeholder="email"
                value={email} onChange={ev => setEmail(ev.target.value)}>
            </input>
            <button type="submit" className="btn-primary">Save</button>
        </form >
    )
}