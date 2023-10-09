import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteCustomerPage() {
    const router = useRouter();
    const [productInfo, setCustomerInfo] = useState();
    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/customers?id=' + id).then(response => {
            setCustomerInfo(response.data);
        });
    }, [id]);

    function goBack() {
        router.push('/customers');
    }

    async function deleteCustomer(){
        await axios.delete('/api/customers?id='+id);
        goBack();
    }

    return (
        <Layout>
            <h1 className="text-center">Do you really want to delete "{productInfo?.title}"?</h1>
            <div className="flex gap-2 justify-center">
                <button className="btn-red" onClick={deleteCustomer}>Yes</button>
                <button className="btn-default" onClick={goBack}>No</button>
            </div>
        </Layout>
    )
}