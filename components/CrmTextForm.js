import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function CrmTextForm(
    {
        _id,
        name: existingName,
        text: existingText,
    }) {

    const router = useRouter();
    const [name, setName] = useState(existingName || '');
    const [text, setText] = useState(existingText || '');
    const [goToMainPage, setGoToMainPage] = useState(false);

    async function saveForm(ev) {
        ev.preventDefault();

        const data = { name, text };
        if (_id) {
            await axios.put('/api/crm/crmtext', { ...data, _id })
        }
        else {
            await axios.post('/api/crm/crmtext', data);
        }
        setGoToMainPage(true);
    }

    if (goToMainPage) {
        router.push('/crmtexts');
    }

    return (
        <form onSubmit={saveForm}>
            <label>Name</label>
            <input type="text" placeholder="Name"
                value={name} onChange={ev => setName(ev.target.value)}>
            </input>
            <label>Text</label>
            <textarea placeholder="text"
                value={text} onChange={ev => setText(ev.target.value)}>
            </textarea>
            <button type="submit" className="btn-primary">Save</button>
        </form >
    )
}