import React from "react";

// CSS
import { Button } from "react-bootstrap";

// Hooks
import { useAccount } from "components/hooks/web3";
import { useWeb3 } from "components/providers";

const Header = () => {
  const { account } = useAccount();
  const { connect } = useWeb3();

  return (
    <div className="d-flex w-100 flex-column mt-3">
      <p className="text-center display-4 good-font">Cheese Touch NFT Game</p>
      {account.data !== undefined ? (
        <Button className="mx-auto mt-2" variant="success">
          Connected to <span className="fw-bold">{account.data}</span>
        </Button>
      ) : (
        <Button
          onClick={() => connect()}
          className="w-25 mx-auto mt-2 fw-bold"
          variant="danger"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default Header;
