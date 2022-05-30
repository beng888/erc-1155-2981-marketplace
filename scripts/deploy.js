const hre = require('hardhat');

async function main() {
  const TokenController = await hre.ethers.getContractFactory('TokenController');
  const tokenController = await TokenController.deploy();

  await tokenController.deployed();

  console.log('TokenController deployed to:', tokenController.address);

  //* For MarketPlace

  const Marketplace = await hre.ethers.getContractFactory('Marketplace');
  const marketplace = await Marketplace.deploy(tokenController.address);

  await marketplace.deployed();

  console.log('Marketplace deployed to:', marketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
