import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function UserForm(props) {
    const [name, setName] = useState(props.name || "");
    const [email, setEmail] = useState(props.email || "");
    const [password, setPassword] = useState(""); // Don't prefill password
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        await axios.put("/api/users", {
            _id: props._id,
            name,
            email,
            password: password || undefined // Only send password if changed
        });
        router.push("/users");
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <label>Name</label>
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input mb-2"
                required
            />
            <label>Email</label>
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input mb-2"
                required
            />
            <label>Password (leave blank to keep unchanged)</label>
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input mb-2"
            />
            <button type="submit" className="btn-primary">Save</button>
        </form>
    );
}
