import type { Metadata } from "next";
import React, { lazy, Suspense } from "react";
import local from 'next/font/local';
import Loader from "@/components/shared/loader/loader";
// import Loading from "@/frontend/components/shared/loader/loader";
import Navbar from "@/components/shared/navbar/navbar";
import { StyledRoot } from "@/styles/Theme/theme";


// import AuthService from "@/authentication/auth.service";
import "./globals.scss";

const TitilliumWeb = local({
  src: [{
    path: '../../public/fonts/Titillium_Web/TitilliumWeb-Light.ttf',
    weight: "300",
  }
  ],
  variable: "--TitilliumWeb",
});

// const TitilliumWeb = Titillium_Web({
//   subsets: ["latin"],
//   weight: "300"
// });

export const metadata: Metadata = {
  title: "Quick Pass Admin",
  description: "Efficiently administer your Quick Pass system with our intuitive admin panel.",
};



export default function RootLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  // const pathName = usePathname();
  // const showHeader = router.pathname === '/login' ? false : true;

  return (
    <html lang="en">
      <body className={`${TitilliumWeb.className}`}>
        <div >
          {<Navbar />}
          <div className="host">
            {/* <p>{activePath}</p> */}
            <div >
           
                <div className="main-content"><Suspense fallback={<Loader />}> <StyledRoot>{children}</StyledRoot></Suspense></div>

            </div>
          </div>
        </div>
      </body>
    </html >
  );
}
