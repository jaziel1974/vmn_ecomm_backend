import CrmTextForm from "@/components/CrmTextForm";
import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditCrmTextPage() {
    const [crmTextInfo, setCrmTextInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/crm/crmtext?id=' + id).then(response => {
            setCrmTextInfo(response.data);
        });
    }, [id]);

    return (
        <Layout>
            <h1>Edit Crm Text</h1>
            {crmTextInfo && (
                <CrmTextForm {...crmTextInfo}/>
            )}
        </Layout>
    )
}