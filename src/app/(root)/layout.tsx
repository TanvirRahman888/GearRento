import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { PlatformAnnouncement } from "@/components/shared/platform-announcement";
import React from "react";

const RootLayout = ({children,}: Readonly<{children: React.ReactNode;}>) => {
  return <>
  <Navbar/>
  <PlatformAnnouncement />
  {children}
  <Footer/>
  </>;
};

export default RootLayout;
