import Layout from "@/components/Layout";
import OrderForm from "@/components/OrderForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditOrderPage() {
    const [orderInfo, setOrderInfo] = useState();
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/orders?orderEdit=true&id=' + id).then(response => {
            setOrderInfo(response.data);

        });
    }, [id]);


    return (
        <Layout>
            <h1>Edit order</h1>
            {orderInfo && (
                <OrderForm {...orderInfo}/>
            )}
        </Layout>
    )
}