const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const {
    developmentChains,
    networkConfig,
} = require("../../helper-hardhat-config")
const { solidity } = require("ethereum-waffle")
const { assert, expect } = require("chai")
const chai = require("chai")
const { log } = require("console")
chai.use(solidity)

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle", async () => {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
              console.log("contract initialized")
          })
          describe("fulfillRandomWords", () => {
              it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async () => {
                  console.log("Setting up test...")
                  const startingTimeStamp = await raffle.getLastTimestamp()
                  const accounts = await ethers.getSigners()
                  console.log("Setting up Listener...")
                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked"),
                          async () => {
                              console.log("Winner picked event fired!")
                              resolve()
                              try {
                                  const recentWinner =
                                      await raffle.getRecentWinner()
                                  const raffleState =
                                      await raffle.getRaffleState()
                                  const winnerBalance =
                                      await accounts[0].getBalance()
                                  const endingTimeStamp =
                                      await raffle.getLatestTimestamp()
                                  await expect(raffle.getPlayer(0)).to.be
                                      .reverted
                                  assert.equal(
                                      recentWinner.toString(),
                                      accounts[0].address,
                                  )
                                  assert.equal(raffleState, 0)
                                  assert.equal(
                                      winnerEndingBalance.toString(),
                                      winnerStartingBalance
                                          .add(raffleentranceFee)
                                          .toString(),
                                  )
                                  assert.equal(
                                      endingTimeStamp > startingTimeStamp,
                                  )
                              } catch (e) {
                                  console.log(e)
                                  reject(e)
                              }
                          }
                      console.log("Entering Raffle...")
                      await raffle.enterRaffle({ value: raffleEntranceFee })
                      console.log("waiting...")
                      const winnerStartingBalance =
                          await accounts[0].getbalance()
                  })
              })
          })
      })
