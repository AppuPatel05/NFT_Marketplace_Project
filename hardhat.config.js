require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const fs = require('fs');
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
module.exports = {
  solidity: "0.8.4",
  networks: {
    ganache: {
      url: "http://192.168.1.25:7545",
      chainId: 1337// Change this to the desired chain ID
    },hardhat: {
      chainId: 1337
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/J_1JPktYJPsjHNZvJindueia79UIDTFN",
      accounts: [ "0fb191423d4d9eca627b57df10e3518d93ef06a135c2b4823433bd526eba284a" ]
    }
  },
  paths: {
  
  },
};
