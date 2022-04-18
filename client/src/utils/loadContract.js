export const loadContract = async (name, web3) => {
  let contract = null;

  try {
    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json();

    let networkId = 43113; // FUJI Tesnet

    contract = new web3.eth.Contract(
      Artifact.abi,
      Artifact.networks[networkId].address
    );
  } catch (e) {
    console.log(`Contract ${name} not found`);
  }

  return contract;
};

export const loadContractWithAddress = async (name, address, web3) => {
  let contract = null;

  try {
    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json();

    contract = new web3.eth.Contract(Artifact.abi, address);
  } catch (e) {
    console.log(`Contract ${name} not found`);
  }

  return contract;
};
