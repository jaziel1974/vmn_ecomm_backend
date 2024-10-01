import Layout from "@/components/Layout";
import { encrypt } from "@/lib/crypt";
import { useState } from "react";

export default function SettingsPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [encryptionKey, setEncryptionKey] = useState("");

    const generateKey = () => {
        setEncryptionKey(encrypt(email + ":" + password + ":" + expirationDate));
    }
    
    return (
        <Layout>
            <h1>Settings</h1>
            <container className="grid-wrap">
                <div>
                    <h3>Generate encrypted key</h3>
                    <input type="text" placeholder="E-mail" onChange={e => setEmail(e.target.value)}/>
                    <input type="text" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                    <input type="text" placeholder="Expiration date" onChange={e => setExpirationDate(e.target.value)}/>
                    <button type="button" className="btn-default" onClick={ev => generateKey()}>Generate</button>
                    <input type="text" placeholder="Encryption key" value={encryptionKey}/>
                </div>
           </container>
        </Layout>
    )
}