const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomiclabs/hardhat-waffle");

describe("TokenController", () => {
  const tokenId = 1;
  const quantity = 100;
  const data = "0x00";
  let tokenController, ownerAddress, userAddress, owner, user;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    userAddress = await user.getAddress();
    const TokenController = await ethers.getContractFactory("TokenController");
    tokenController = await TokenController.deploy();
    await tokenController.deployed();
  });

  it("should mint tokens", async () => {
    //* mint 100 tokens with id 1
    await tokenController.mint(ownerAddress, tokenId, quantity, data);

    //* the balance of tokenId 1 should be 100
    expect(await tokenController.balanceOf(ownerAddress, tokenId)).to.equal(
      quantity
    );
  });

  it("should transfer tokens to address", async () => {
    //* mint 100 tokens with id 1
    await tokenController.mint(ownerAddress, tokenId, quantity, data);

    //* transfer 20 tokens to userAddress
    const transferQuantity = 20;
    await tokenController.safeTransferFrom(
      ownerAddress,
      userAddress,
      tokenId,
      transferQuantity,
      data
    );

    //* the balance of ownerAddress, tokenId 1 should be 80
    expect(await tokenController.balanceOf(ownerAddress, tokenId)).to.equal(
      quantity - transferQuantity
    );
    //* the balance of userAddress, tokenId 1 should be 20
    expect(await tokenController.balanceOf(userAddress, tokenId)).to.equal(
      transferQuantity
    );
  });

  it("should restrict mint function to ownerOnly", async () => {
    //* this calls the mint function from the context of user
    const mintAsOtherUser = () =>
      tokenController
        .connect(user)
        .mint(ownerAddress, tokenId, quantity, data);

    //* expect mintAsOtherUser to throw an error
    await expect(mintAsOtherUser()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });
});
