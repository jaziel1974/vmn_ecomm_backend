import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomerForm from "@/components/CustomerForm";
import CrmCustomerForm from "@/components/CrmCustomerForm";

export default function EditCustomerPage() {
    const [crmCustomerInfo, setCrmCustomerInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/crm/crm?id=' + id).then(response => {
            setCrmCustomerInfo(response.data);
        });
    }, [id]);

    return (
        <Layout>
            <h1>Edit CRM customer</h1>
            {crmCustomerInfo && (
                <CrmCustomerForm {...crmCustomerInfo}/>
            )}
        </Layout>
    )
}