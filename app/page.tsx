import ContactUsPage from "@/components/ContactUs"
import Navbar from "@/components/Navbar"
import dynamic from "next/dynamic"

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false })

export default function Home() {
  return (
    <>
      <Scene />
      <ContactUsPage/>
    </>
  )
}
