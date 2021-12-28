const truffleAssert = require("truffle-assertions");
const utils = require("./utils");
const Redpacket = artifacts.require("RedPacket");

const getBalance = async (address) => {
    return await web3.eth.getBalance(address)
}

contract("Redpack", (accounts) => {
    it("1: grab a packet should success", async () => {
        const instance = await Redpacket.deployed() 
        const cpc_amount = web3.utils.toWei(String(10), "ether")
        await instance.createRedPacket(0, 5, "Hello", {from: accounts[0], value: cpc_amount}) // 第一个红包
        for(let i = 1; i < 6; i++) {
            const tx = await instance.grabRedPacket(1, {from: accounts[i]}) // 抢第一个红包
            await utils.checkEvent(tx, utils.EVENT_GRAB_REDPACKET, async (e) => {
                assert.equal(e.receiver, accounts[i], "accounts is error")
                console.log(e.amount)
              });
        }
    })
    it("2: grab a packet is empty should fail", async () => {
        const instance = await Redpacket.deployed() 
        const cpc_amount = web3.utils.toWei(String(10), "ether")
        await instance.createRedPacket(0, 5, "Hello", {from: accounts[0], value: cpc_amount}) // 第二个红包
        for(let i = 1; i < 6; i++) {
            await instance.grabRedPacket(2, {from: accounts[i]}) // 抢第二个红包
        }
        try {
            await instance.grabRedPacket(2, {from: accounts[6]}) // 抢第二个红包
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("This packet is empty now."));
        }
    })
    it("3: garb a packet not fount should fail", async () => {
        const instance = await Redpacket.deployed() 
        const cpc_amount = web3.utils.toWei(String(10), "ether")
        await instance.createRedPacket(0, 5, "Hello", {from: accounts[0], value: cpc_amount})  // 第三个红包
        try {
            await instance.grabRedPacket(4, {from: accounts[1]}) // 抢第四个红包
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("This packet not found"));
        }
    })
    it("4: garb a packet has grabbed should fail", async () => {
        const instance = await Redpacket.deployed() 
        const cpc_amount = web3.utils.toWei(String(10), "ether")
        await instance.createRedPacket(0, 5, "Hello", {from: accounts[0], value: cpc_amount}) // 第四个红包
        await instance.grabRedPacket(4, {from: accounts[1]}) // 抢第四个红包
        try {
            await instance.grabRedPacket(4, {from: accounts[1]}) // 再抢第四个红包
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("You have grabbed")); 
        }
    })
})