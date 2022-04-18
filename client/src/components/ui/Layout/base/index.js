import React from "react";

// CSS
import styles from "./style.module.css";

// Header
import { Header } from "components/ui";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
