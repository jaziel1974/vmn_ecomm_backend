import { SessionProvider } from "next-auth/react"
import '@/styles/globals.css'
import { AppContext } from "@/components/Context"
import { useState } from "react";

export default function App({ Component, pageProps: { session, ...pageProps } }) {

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const [ordersToPrint, setOrdersToPrint] = useState([]);
  const [productsToPrint, setProductsToPrint] = useState([]);
  const [startDate, setStartDate] = useState(addDays(new Date(), -2));
  const [endDate, setEndDate] = useState(new Date());

  return (
    //<SessionProvider session={session}>
      <AppContext.Provider value={{ ordersToPrint, setOrdersToPrint, productsToPrint, setProductsToPrint, startDate, setStartDate, endDate, setEndDate }}>
        <Component {...pageProps} />
      </AppContext.Provider>
    //</SessionProvider>
  )
}
