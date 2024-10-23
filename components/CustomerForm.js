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
        phone: existingPhone,
        communicationLabels: assignedCommunicationLabels,
        shippingType: existingShippingType,
    }) {

    const router = useRouter();

    useEffect(() => {
        axios.get('/api/categories/crm/listadistribuicao').then(result => {
            setCategories(result.data);
        })
    }, []);

    const [communicationLabels, setCommunicationLabels] = useState(assignedCommunicationLabels || []);
    const [name, setName] = useState(existingName || '');
    const [address, setAddress] = useState(existingAddress || '');
    const [addressExt, setAddressExt] = useState(existingAddressExt || '');
    const [addressNotes, setAddressNotes] = useState(existingAddressNotes || '');
    const [priceId, setPriceId] = useState(existingPriceId || 1);
    const [email, setEmail] = useState(existingEmail || "");
    const [goToCustomers, setGoToCustomers] = useState(false);
    const [phone, setPhone] = useState(existingPhone || "5511");
    const [categories, setCategories] = useState([]);
    const [shippingType, setShippingType] = useState(existingShippingType || 'none');

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

        const data = { name, address, addressExt, addressNotes, priceId, email, phone, communicationLabels, shippingType };
        if (_id) {
            //update
            await axios.put('/api/customers', { ...data, _id })
        }
        else {
            //create
            await axios.post('/api/customers', data);
            await axios.post('/api/crm/crm', { name, email, phone, communicationLabels, shippingType });
        }
        setGoToCustomers(true);
    }

    if (goToCustomers) {
        router.push('/customers');
    }

    const handleCategoryCheck = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setCommunicationLabels([...communicationLabels, value]);
        } else {
            setCommunicationLabels(communicationLabels.filter(item => item !== value));
        }
    };

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
            <label>Phone Number</label>
            <input type="text" placeholder="phone number"
                value={phone} onChange={ev => setPhone(ev.target.value)}>
            </input>
            <label>Category</label>
            <div className="flex">
                {categories.length > 0 && categories.map((c, index) => (
                    <>
                        <input type="checkbox"
                            id={c._id}
                            key={c._id}
                            value={c._id}
                            checked={communicationLabels.find(item => item === c._id) != undefined}
                            onChange={handleCategoryCheck}
                            className="w-7 h-5"
                        />
                        <label htmlFor={`category-${index}`} className="ml-2 mr-2">{c.name}</label>
                    </>
                ))}
            </div>
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
            <p>-1: São Paulo; 1: Embu-Guaçu; 2: Horta na Porta; 3: Atacado</p>
            <label>Email</label>
            <input type="text" placeholder="email"
                value={email} onChange={ev => setEmail(ev.target.value)}>
            </input>
            <label>Shipping Type</label>
            <input type="text" placeholder="shipping type"
                value={shippingType} onChange={ev => setShippingType(ev.target.value)}>
            </input>
            <p>none; 4itens; 100; 200</p>
            <button type="submit" className="btn-primary">Save</button>
        </form >
    )
}