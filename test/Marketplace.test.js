const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('TokenController', function () {
  it("Should return the new greeting once it's changed", async function () {
    [owner, creator, addr1, addr2] = await ethers.getSigners();

    const TokenController = await ethers.getContractFactory('TokenController');
    const tokenController = await TokenController.deploy();
    await tokenController.deployed();
    tokenControllerAddress = tokenController.address;

    const Marketplace = await ethers.getContractFactory('Marketplace');
    const marketplace = await Marketplace.deploy(tokenControllerAddress);
    await marketplace.deployed();
    marketplaceAddress = marketplace.address;

    await tokenController.connect(owner).mint(1, 2000);

    expect(await tokenController.balanceOf(owner.address, 1)).to.be.equal(2000);

    await tokenController.connect(addr1).setApprovalForAll(marketplaceAddress, true);
    await tokenController.connect(addr2).setApprovalForAll(marketplaceAddress, true);
    await tokenController.connect(owner).setApprovalForAll(marketplaceAddress, true);

    listNFT = await marketplace.connect(owner).listNft(1, 44, 14, 4);

    // const ownerAmount = await tokenController.balanceOf(owner.address, 0);
    // console.log(ownerAmount);

    await tokenController.safeTransferFrom(
      owner.address,
      addr2.address,
      0,
      14000,
      '0x00'
    );

    // const addr1Amount = await tokenController.balanceOf(addr2.address, 1);
    // console.log(addr1Amount);

    buyNFT1 = await marketplace.connect(addr2).buyNFT(1, 14);
  });
});
