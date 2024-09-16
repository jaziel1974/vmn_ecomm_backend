import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteCrmCustomerPage() {
    const router = useRouter();
    const [crmCustomerInfo, setCrmCustomerInfo] = useState();
    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/crm/crm?id=' + id).then(response => {
            setCrmCustomerInfo(response.data);
            console.log(response.data);
        });
    }, [id]);

    function goBack() {
        router.push('/crmcustomers');
    }

    async function deleteCustomer(){
        await axios.delete('/api/crm/crm?id='+id);
        goBack();
    }

    return (
        <Layout>
            <h1 className="text-center">Do you really want to delete "{crmCustomerInfo?.name}"?</h1>
            <div className="flex gap-2 justify-center">
                <button className="btn-red" onClick={deleteCustomer}>Yes</button>
                <button className="btn-default" onClick={goBack}>No</button>
            </div>
        </Layout>
    )
}