import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UserForm from "@/components/UserForm";

export default function EditUserPage() {
    const [userInfo, setUserInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/users?id=' + id).then(response => {
            setUserInfo(response.data);
        });
    }, [id]);

    return (
        <Layout>
            <h1>Edit user</h1>
            {userInfo && (
                <UserForm {...userInfo}/>
            )}
        </Layout>
    )
}