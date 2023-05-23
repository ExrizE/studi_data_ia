import React from 'react';
import CardTable from "../../components/Cards/CardTable.js";

import IndexNavbar from "../../components/Navbars/IndexNavbar.js";
import Footer from "../../components/Footers/Footer.js";

export default function Index() {
  return (
    <>
      <IndexNavbar fixed />
      <section className="mt-48 md:mt-40 pb-10 relative">
        <div className="container mx-auto items-center">
          <div className="w-full mb-12 px-4">
            <CardTable color="dark" />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
