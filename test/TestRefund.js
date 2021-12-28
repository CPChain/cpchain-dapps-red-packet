const truffleAssert = require("truffle-assertions");
const utils = require("./utils");
const Redpacket = artifacts.require("RedPacket");

const getBalance = async (address) => {
    return await web3.eth.getBalance(address)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

contract("Redpack", (accounts) => {
    it("1: set period = 1s should success", async () => {
        const instance = await Redpacket.deployed()
        await instance.setPeriod(3)
        const period = await instance.period()
        assert.equal(period.valueOf(), 3, 'period is error')
        const cpc_amount = web3.utils.toWei(String(10), "ether")
        await instance.createRedPacket(0, 5, "Hello", {from: accounts[1], value: cpc_amount}) // 第一个红包
        await sleep(3000)
        const tx = await instance.refund(1, {from: accounts[1]}) // 第一个红包退款
        await utils.checkEvent(tx, utils.EVENT_REFUND, async (e) => {
            assert.equal(e.remains, utils.cpc(10), "remains is error")
            assert.equal(e.packet_id, 1, "packet_id is error")
        });
    })
    it("2: 剩余红包个数为2，剩余金额不为0, success", async () => {
        const instance = await Redpacket.deployed()
        await instance.setPeriod(3)
        const period = await instance.period()
        assert.equal(period.valueOf(), 3, 'period is error')
        const cpc_amount = web3.utils.toWei(String(10), "ether")
        await instance.createRedPacket(0, 5, "Hello", {from: accounts[1], value: cpc_amount}) // 第二个红包
        for(let i = 1; i < 3; i++) {
            const tx_grab = await instance.grabRedPacket(2, {from: accounts[i]}) // 抢第二个红包
        }
        await sleep(3000)
        const tx_refund = await instance.refund(2, {from: accounts[1]}) // 第二个红包退款
        await utils.checkEvent(tx_refund, utils.EVENT_REFUND, async (e) => {
            assert.equal(e.packet_id, 2, "packet_id is error")
        });
    })
    it("3: 剩余红包个数为0, fail", async () => {
        const instance = await Redpacket.deployed()
        await instance.setPeriod(3)
        const period = await instance.period()
        assert.equal(period.valueOf(), 3, 'period is error')
        const cpc_amount = web3.utils.toWei(String(10), "ether")
        await instance.createRedPacket(0, 5, "Hello", {from: accounts[1], value: cpc_amount}) // 第三个红包
        for(let i = 1; i < 6; i++) {
            const tx_grab = await instance.grabRedPacket(3, {from: accounts[i]}) // 抢第三个红包
        }
        await sleep(3000)
        try{
            const tx_refund = await instance.refund(3, {from: accounts[1]}) // 第三个红包退款
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("This packet is empty now"))
        }
    })
    it("4: 红包不存在", async () => {
        const instance = await Redpacket.deployed()
        await instance.setPeriod(3)
        const period = await instance.period()
        assert.equal(period.valueOf(), 3, 'period is error')
        await sleep(3000)
        try{
            const tx_refund = await instance.refund(4, {from: accounts[1]}) // 第四个红包提前退款
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("This packet not found"))
        }
    })
    it("5: 红包不属于你", async () => {
        const instance = await Redpacket.deployed()
        await instance.setPeriod(3)
        const period = await instance.period()
        assert.equal(period.valueOf(), 3, 'period is error')
        const cpc_amount = web3.utils.toWei(String(10), "ether")
        await instance.createRedPacket(0, 5, "Hello", {from: accounts[1], value: cpc_amount}) // 第四个红包
        await sleep(3000)
        try{
            const tx_refund = await instance.refund(4, {from: accounts[2]}) // 第四个红包退款
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("You are not the sender of the packet"))
        }
    })
    it("6: 红包时间未到", async () => {
        const instance = await Redpacket.deployed()
        await instance.setPeriod(3)
        const period = await instance.period()
        assert.equal(period.valueOf(), 3, 'period is error')
        const cpc_amount = web3.utils.toWei(String(10), "ether")
        await instance.createRedPacket(0, 5, "Hello", {from: accounts[1], value: cpc_amount}) // 第五个红包
        await sleep(2500)
        try{
            const tx_refund = await instance.refund(5, {from: accounts[1]}) // 第五个红包退款
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("Your red packet is still locked"))
        }
    })
    it("7: 红包退款后再抢", async () => {
        const instance = await Redpacket.deployed()
        await instance.setPeriod(3)
        const period = await instance.period()
        assert.equal(period.valueOf(), 3, 'period is error')
        const cpc_amount = web3.utils.toWei(String(10), "ether")
        await instance.createRedPacket(0, 5, "Hello", {from: accounts[1], value: cpc_amount}) // 第六个红包
        await sleep(3000)
        const tx_refund = await instance.refund(6, {from: accounts[1]}) // 第六个红包退款
        try{
            const tx_grab = await instance.grabRedPacket(6, {from: accounts[2]}) // 抢第六个红包
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("This packet is empty now"))
        }
    })
})