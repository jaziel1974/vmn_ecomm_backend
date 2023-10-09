import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomerForm from "@/components/CustomerForm";

export default function EditCustomerPage() {
    const [customerInfo, setCustomerInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/customers?id=' + id).then(response => {
            setCustomerInfo(response.data);
        });
    }, [id]);

    return (
        <Layout>
            <h1>Edit customer</h1>
            {customerInfo && (
                <CustomerForm {...customerInfo}/>
            )}
        </Layout>
    )
}