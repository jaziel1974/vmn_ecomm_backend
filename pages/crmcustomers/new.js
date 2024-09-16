import CrmCustomerForm from "@/components/CrmCustomerForm";
import Layout from "@/components/Layout";

export default function NewCustomer() {
    return (
        <Layout>
            <h1>New CRM Customer</h1>
            <CrmCustomerForm></CrmCustomerForm>
        </Layout>
    )
}
