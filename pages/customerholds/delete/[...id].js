import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteUserPage() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState();
    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/customerholds/customerholds?id=' + id).then(response => {
            setUserInfo(response.data);
        });
    }, [id]);

    function goBack() {
        router.push('/customerholds');
    }

    async function deleteCustomerHold(){
        await axios.delete('/api/customerholds/customerholds?id='+id);
        goBack();
    }

    return (
        <Layout>
            <h1>{userInfo?.name}</h1>
            <h1 className="text-center">Do you really want to delete "{userInfo?.name}"?</h1>
            <div className="flex gap-2 justify-center">
                <button className="btn-red" onClick={deleteCustomerHold}>Yes</button>
                <button className="btn-default" onClick={goBack}>No</button>
            </div>
        </Layout>
    )
}