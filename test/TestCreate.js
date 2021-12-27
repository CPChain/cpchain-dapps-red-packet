const truffleAssert = require("truffle-assertions");
const utils = require("./utils");
const Redpacket = artifacts.require("RedPacket");

const getBalance = async (address) => {
    return await web3.eth.getBalance(address)
}

contract("Redpack", (accounts) => {
    it("1: set amount = 0.9 should fail", async () => {
        const instance = await Redpacket.deployed() 
        const cpc_amount = web3.utils.toWei(String(0.9), "ether")
        try {
            await instance.createRedPacket(0, 5, "Hello", {from: accounts[0], value: cpc_amount})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The value can't less than 1 CPC"));
        }
    })
    it("2:set amount = 1 should success", async () => {     //正常发红包
        const instance = await Redpacket.deployed()
        const cpc_amount = web3.utils.toWei(String(1), "ether")
        const tx = await instance.createRedPacket(0, 5, "Hello", {from: accounts[1], value: cpc_amount})
        await utils.checkEvent(tx, utils.EVENT_CREATE_REDPACKET, async (e) => {
            assert.equal(e.amount, utils.cpc(1), "Amount is error")
            assert.equal(e.count, 5, "count is error")
          });
    })
    it("3:set amount = 99 should success", async () => {     //正常发红包
        const instance = await Redpacket.deployed()
        const cpc_amount = web3.utils.toWei(String(99), "ether")
        const tx = await instance.createRedPacket(0, 5, "Hello", {from: accounts[2], value: cpc_amount})
        await utils.checkEvent(tx, utils.EVENT_CREATE_REDPACKET, async (e) => {
            assert.equal(e.amount, utils.cpc(99), "Amount is error")
            assert.equal(e.count, 5, "count is error")
          });
    })
    it("4:set amount = 100 should fail", async () => {
        const instance = await Redpacket.deployed() 
        const cpc_amount = web3.utils.toWei(String(100), "ether")
        try {
            await instance.createRedPacket(0, 5, "Hello", {from: accounts[3], value: cpc_amount})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("sender doesn't have enough funds to send tx."))
        }
    })
    it("5:set count = 0 should fail", async () => {
        const instance = await Redpacket.deployed() 
        const cpc_amount = web3.utils.toWei(String(5), "ether")
        try {
            await instance.createRedPacket(0, 0, "Hello", {from: accounts[4], value: cpc_amount})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The count should greater than 1"))
        }
    })
    it("6:set count = 1 should success", async () => {     
        const instance = await Redpacket.deployed()
        const cpc_amount = web3.utils.toWei(String(5), "ether")
        const tx = await instance.createRedPacket(0, 1, "Hello", {from: accounts[4], value: cpc_amount})
        await utils.checkEvent(tx, utils.EVENT_CREATE_REDPACKET, async (e) => {
            assert.equal(e.amount, utils.cpc(5), "Amount is error")
            assert.equal(e.count, 1, "count is error")
          });
    })
    it("7:set count = 100 should success", async () => {     
        const instance = await Redpacket.deployed()
        const cpc_amount = web3.utils.toWei(String(5), "ether")
        const tx = await instance.createRedPacket(0, 100, "Hello", {from: accounts[4], value: cpc_amount})
        await utils.checkEvent(tx, utils.EVENT_CREATE_REDPACKET, async (e) => {
            assert.equal(e.amount, utils.cpc(5), "Amount is error")
            assert.equal(e.count, 100, "count is error")
          });
    })
    it("8:set count = 101 should fail", async () => {
        const instance = await Redpacket.deployed() 
        const cpc_amount = web3.utils.toWei(String(5), "ether")
        try {
            await instance.createRedPacket(0, 101, "Hello", {from: accounts[4], value: cpc_amount})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The count should less than the upper"))
        }
    })
    it("9:set bless = Null should success", async () => {     
        const instance = await Redpacket.deployed()
        const cpc_amount = web3.utils.toWei(String(5), "ether")
        const tx = await instance.createRedPacket(0, 5, "", {from: accounts[4], value: cpc_amount})
        await utils.checkEvent(tx, utils.EVENT_CREATE_REDPACKET, async (e) => {
            assert.equal(e.amount, utils.cpc(5), "Amount is error")
            assert.equal(e.count, 5, "count is error")
            assert.equal(e.bless, "", "bless is error")
          });
    })
    it("10:set bless =  H测试 -！@3$%^^& should success", async () => {   
        const instance = await Redpacket.deployed()
        const cpc_amount = web3.utils.toWei(String(5), "ether")
        const tx = await instance.createRedPacket(0, 5, "H测试 -！@3$%^^&", {from: accounts[4], value: cpc_amount})
        await utils.checkEvent(tx, utils.EVENT_CREATE_REDPACKET, async (e) => {
            assert.equal(e.amount, utils.cpc(5), "Amount is error")
            assert.equal(e.count, 5, "count is error")
            assert.equal(e.bless, "H测试 -！@3$%^^&", "bless is error")
          });
    })
    it("11:set bless = a*99 should success", async () => {     
        const instance = await Redpacket.deployed()
        const cpc_amount = web3.utils.toWei(String(5), "ether")
        const str = "a"
        const bless = str.repeat(99)
        const tx = await instance.createRedPacket(0, 5, bless, {from: accounts[4], value: cpc_amount})
        await utils.checkEvent(tx, utils.EVENT_CREATE_REDPACKET, async (e) => {
            assert.equal(e.amount, utils.cpc(5), "Amount is error")
            assert.equal(e.count, 5, "count is error")
            assert.equal(e.bless, bless, "bless is error")
          });
    })
    it("12:set bless = a*100 should fail", async () => {
        const instance = await Redpacket.deployed() 
        const cpc_amount = web3.utils.toWei(String(5), "ether")
        const str = "a"
        const bless = str.repeat(100)
        try {
            await instance.createRedPacket(0, 5, bless, {from: accounts[4], value: cpc_amount})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("Length of bless should less than 100"))
        }
    })
    it("13:set upper = 0.99 should fail", async () => {
        const instance = await Redpacket.deployed()
        const upper = utils.cpc(0.99)
        try {
            await instance.setUpper(upper)
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The upper per packet can not be less than 1"))
        }
    })
    it("14:set upper = 1 should success", async () => {     
        const instance = await Redpacket.deployed()
        const upper = utils.cpc(1)
        await instance.setUpper(upper)
        const cpc_amount_1 = web3.utils.toWei(String(1), "ether")
        const tx = await instance.createRedPacket(0, 5, "Hello", {from: accounts[5], value: cpc_amount_1})
        await utils.checkEvent(tx, utils.EVENT_CREATE_REDPACKET, async (e) => {
            assert.equal(e.amount, utils.cpc(1), "Amount is error")
            assert.equal(e.count, 5, "count is error")
            assert.equal(e.bless, "Hello", "bless is error")
          });
        const cpc_amount_2 = web3.utils.toWei(String(1.1), "ether")
        try {
            await instance.createRedPacket(0, 5, "Hello", {from: accounts[5], value: cpc_amount_2})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The value can't be greater than the upper"))
        }
    })
    it("15:set upper = 50 should success", async () => {     
        const instance = await Redpacket.deployed()
        const upper = utils.cpc(50)
        await instance.setUpper(upper)
        const cpc_amount_1 = web3.utils.toWei(String(50), "ether")
        const tx = await instance.createRedPacket(0, 5, "Hello", {from: accounts[5], value: cpc_amount_1})
        await utils.checkEvent(tx, utils.EVENT_CREATE_REDPACKET, async (e) => {
            assert.equal(e.amount, utils.cpc(50), "Amount is error")
            assert.equal(e.count, 5, "count is error")
            assert.equal(e.bless, "Hello", "bless is error")
          });
        const cpc_amount_2 = web3.utils.toWei(String(50.1), "ether")
        try {
            await instance.createRedPacket(0, 5, "Hello", {from: accounts[5], value: cpc_amount_2})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The value can't be greater than the upper"))
        }
    })
    it("16:set upper = 1000000 should success", async () => {     
        const instance = await Redpacket.deployed()
        const upper = utils.cpc(1000000)
        await instance.setUpper(upper)
    })
    it("17:set upper = 1000001 should fail", async () => {
        const instance = await Redpacket.deployed()
        const upper = utils.cpc(1000001)
        try {
            await instance.setUpper(upper)
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The upper per packet can not be greater than 1 million"))
        }
    })
    it("18:set subpacketcntupper = 1 should fail", async () => {
        const instance = await Redpacket.deployed()
        try {
            await instance.setSubPacketCntUpper(0)
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("The upper can't be less than 1"))
        }
    })
    it("19:set subpacketcntupper = 2 should success", async () => {
        const instance = await Redpacket.deployed()
        await instance.setSubPacketCntUpper(2)
    })

})
