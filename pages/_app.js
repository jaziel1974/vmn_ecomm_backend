import { SessionProvider } from "next-auth/react"
import '@/styles/globals.css'
import { AppContext } from "@/components/Context"
import { useState } from "react";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [ordersToPrint, setOrdersToPrint] = useState([]);

  return (
    <SessionProvider session={session}>
      <AppContext.Provider value={{ordersToPrint, setOrdersToPrint}}>
        <Component {...pageProps} />
      </AppContext.Provider>
    </SessionProvider>
  )
}
