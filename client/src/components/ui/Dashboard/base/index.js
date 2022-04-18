import React from "react";

// CSS
import styles from "./style.module.css";
import { Button, Spinner } from "react-bootstrap";

// Hooks
import { useWeb3 } from "components/providers";
import { useNetwork, useAccount } from "components/hooks/web3";

const Dashboard = () => {
  const { gameContract, web3 } = useWeb3();
  const { network } = useNetwork();
  const { account } = useAccount();

  const [userScore, setUserScore] = React.useState();
  const [currentState, setCurrentState] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [toAddress, setToAddress] = React.useState("");

  // On click send function for transfer token
  const onClickSend = async () => {
    try {
      if (gameContract && account?.data) {
        await gameContract.methods
          .transferFrom(account.data, toAddress, currentState.checkpoint[0])
          .send({ from: account.data });
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    // Async function for fecthing data from blockchain
    const fetchData = async () => {
      setIsLoading(true);
      const _userScore = await gameContract.methods
        .getScore__sender()
        .call({ from: account.data });

      setUserScore(_userScore);

      const _currentState = await gameContract.methods.getInfo().call();
      setCurrentState(_currentState);
      setIsLoading(false);
    };

    if (web3 && account.data && gameContract.methods) fetchData();
  }, [web3, account.data, gameContract.methods]);
  return (
    <div>
      <div className="d-flex mt-5 flex-column">
        <p className="mx-auto fs-4 fw-bold good-font">Cheese Touch</p>
        <p className="mx-auto good-font fs-5">
          Cheese Touch is an NFT dApp but in Cheese Touch no one wants to have
          cheese touch NFT.
        </p>
        <p className="mx-auto good-font fs-5">
          Only 1 token to be 'live' at a time. But if there is no live token ,
          anyone can create new cheese touch token and can start next round of
          the game
        </p>
        <p className="mx-auto good-font fs-5">
          Cheese Touch NFT can transfer to another user like other nft projects.
          But if any user holds live token more than 24 hours then they can no
          longer transfer it.
        </p>
        <p className="mx-auto good-font fs-5">
          At the beginning of the next round, the Cheese Touch NFT will be
          burned and 1 point will be written to the user.
        </p>
      </div>
      <div className="d-flex flex-row justify-content-around mx-auto">
        <div className="d-flex flex-column mt-3 ">
          <p className="fw-bold good-font text-dark fs-5 mb-0 text-center">
            My Score
          </p>
          {isLoading ? (
            <Spinner
              animation="border"
              variant="dark"
              className="mx-auto mt-2"
            />
          ) : (
            <p className="fw-bold good-font text-danger fs-1 text-center">
              {userScore !== undefined ? userScore : "Can not fetch data"}
            </p>
          )}
        </div>
        <div className="d-flex flex-column mt-3">
          <p className="fw-bold good-font text-dark fs-5 mb-0 text-center">
            Current State
          </p>
          {isLoading ? (
            <Spinner
              animation="border"
              variant="dark"
              className="mx-auto mt-2"
            />
          ) : (
            <React.Fragment>
              {currentState !== undefined ? (
                <React.Fragment>
                  <p className="fw-bold good-font text-primary fs-5 text-center mb-0 mt-2">
                    Current Token ID : {currentState.checkpoint[0]}
                  </p>
                  <p className="fw-bold good-font text-primary fs-5 mt-0 text-center mb-0">
                    Current Token Owner :{" "}
                    {String(currentState.checkpoint[2]).substring(0, 6)}...
                    {String(currentState.checkpoint[2]).slice(-6)}
                  </p>
                  <p className="fw-bold good-font text-primary fs-5 mt-2 text-center">
                    Last Transfer : <br />
                    {new Date(
                      currentState.checkpoint[1] * 1000
                    ).toLocaleTimeString()}
                    <br />
                    {new Date(
                      currentState.checkpoint[1] * 1000
                    ).toLocaleDateString()}
                  </p>
                  <p className="fw-bold good-font text-primary fs-5 mt-2 text-center">
                    Still round going : {currentState.isDead ? "No" : "Yes"}
                  </p>
                </React.Fragment>
              ) : (
                <p className="fw-bold good-font text-danger fs-1 text-center">
                  Can not fetch data
                </p>
              )}
            </React.Fragment>
          )}
        </div>
        <div className="d-flex flex-column mt">
          <p className="fw-bold good-font text-dark fs-5 mb-0 text-center">
            Transfer Cheese NFT!!!
          </p>
          {isLoading ? (
            <Spinner
              animation="border"
              variant="dark"
              className="mx-auto mt-2"
            />
          ) : (
            <div>
              {currentState !== undefined && account.data ? (
                <React.Fragment>
                  {currentState.checkpoint[2] === account.data ? (
                    <div className="d-flex flex-column">
                      <p className="fw-bold good-font text-danger fs-6 text-center">
                        YOU HAVE LIVE CHEESE NFT!! TRANSFER IT NOW!!!
                      </p>
                      <input
                        type={"text"}
                        placeholder="to Address"
                        className={`w-100 text-center shadow-none`}
                        onChange={(e) => setToAddress(e.target.value)}
                      />
                      <Button
                        onClick={onClickSend}
                        disabled={
                          web3.utils.isAddress(toAddress) === true
                            ? false
                            : true
                        }
                        className="good-font mx-auto mt-2"
                      >
                        Send NFT
                      </Button>
                    </div>
                  ) : (
                    <p className="fw-bold good-font text-danger fs-6 text-center">
                      You do not have it no need to panic!
                    </p>
                  )}
                </React.Fragment>
              ) : (
                <p className="fw-bold good-font text-danger fs-6 text-center">
                  Can not fetch data
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
