import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CrmCustomerForm(
    {
        _id,
        name: existingName,
        email: existingEmail,
        phone: existingPhone,
        communicationLabels: assignedCommunicationLabels,
    }) {

    const router = useRouter();

    useEffect(() => {
        axios.get('/api/categories/crm/listadistribuicao').then(result => {
            setCategories(result.data);
        })
    }, []);

    const [communicationLabels, setCommunicationLabels] = useState(assignedCommunicationLabels || []);
    const [name, setName] = useState(existingName || '');
    const [email, setEmail] = useState(existingEmail || "");
    const [goToCrmCustomers, setGoToCrmCustomers] = useState(false);
    const [phone, setPhone] = useState(existingPhone || "5511");
    const [categories, setCategories] = useState([]);

    async function saveCrmCustomer(ev) {
        if (!name || name.trim() === '' || !email || email.trim() === '' || !phone || phone.trim() === '') {
            alert('The name, email and phone are required');
            return;
        }

        ev.preventDefault();

        const data = { name, email, phone, communicationLabels };
        if (_id) {
            //update
            await axios.put('/api/crm/crm', { ...data, _id })
        }
        else {
            //create
            await axios.post('/api/crm/crm', data);
        }
        setGoToCrmCustomers(true);
    }

    if (goToCrmCustomers) {
        router.push('/crmcustomers');
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
        <form onSubmit={saveCrmCustomer}>
            <label>Customer name</label>
            <input type="text" placeholder="customer name"
                value={name} onChange={ev => setName(ev.target.value)}>
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
            <label>Email</label>
            <input type="text" placeholder="email"
                value={email} onChange={ev => setEmail(ev.target.value)}>
            </input>
            <button type="submit" className="btn-primary">Save</button>
        </form >
    )
}