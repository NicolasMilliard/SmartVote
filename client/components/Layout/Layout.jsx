import Head from "next/head";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Smart Vote</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
      </Head>
      <main>{children}</main>
    </>
  );
};

export default Layout;
