const { ethers } = require("hardhat");

async function main() {
  const NFT_ADDRESS = "0x838F3d2c639478D5772FAE581695d64553F66CB9"; // address of previously deployed NFT contract
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(NFT_ADDRESS);
  console.log("Marketplace deployed to:", marketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });