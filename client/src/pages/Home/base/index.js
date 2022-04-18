import React from "react";

// CSS
import styles from "./style.module.css";
import { Spinner, Button } from "react-bootstrap";

// Hooks
import { useWeb3 } from "components/providers";
import { useNetwork, useAccount } from "components/hooks/web3";

// Components
import { Dashboard } from "components/ui";

const Home = () => {
  const { network } = useNetwork();
  const { switchNetwork } = useWeb3();
  const { account } = useAccount();

  return (
    <div>
      {network.hasInitialResponse === true ? (
        <React.Fragment>
          {account?.data !== undefined ? (
            <React.Fragment>
              {network.isSupported === true ? (
                <Dashboard />
              ) : (
                <div className="d-flex flex-column">
                  <p className="good-font fw-bold mx-auto mt-4 fs-5">
                    Network is not supported please change it to FUJI Testnet
                  </p>
                  <Button
                    onClick={() => switchNetwork()}
                    className="w-25 mx-auto"
                    variant="dark"
                  >
                    <span className="good-font fw-bolder">Change Network</span>
                  </Button>
                </div>
              )}
            </React.Fragment>
          ) : (
            <div className="d-flex">
              <p className="good-font fw-bold mx-auto mt-4 fs-5">
                Please connect your wallet.
              </p>
            </div>
          )}
        </React.Fragment>
      ) : (
        <div className="d-flex flex-column">
          <p className="good-font fw-bold mx-auto mt-5 fs-3 text-center">
            Loading network...
          </p>
          <p className="good-font fw-bold mx-auto mt-1 fs-5 text-center">
            Make sure you have metamask installed in your browser. If not you
            can download it from{" "}
            <span
              onClick={() => window.open("https://metamask.io/", "blank")}
              className="text-primary"
              style={{ cursor: "pointer" }}
            >
              here
            </span>
          </p>
          <Spinner animation="grow" size="lg" className="mx-auto" />
        </div>
      )}
    </div>
  );
};

export default Home;
