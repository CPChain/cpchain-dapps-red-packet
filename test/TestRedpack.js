const Redpack = artifacts.require("Redpack");

contract("Redpack", (accounts) => {
    it("Greet", async () => {
    const instance = await Redpack.deployed()
    const text = await instance.greet()
    console.log(text)
    })
})
