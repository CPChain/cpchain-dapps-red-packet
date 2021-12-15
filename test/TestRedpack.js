const Redpacket = artifacts.require("RedPacket");

const getBalance = async (address) => {
    return await web3.eth.getBalance(address)
}

contract("Redpack", (accounts) => {
    it("T1", async () => {
        // 测试用例：account[0] 发 5 个红包，account[1:5] 各抢一个，account[6] 没抢到
        // 不发送消息到群聊天
        const instance = await Redpacket.deployed()
        // 发红包
        const cpc_10 = web3.utils.toWei(String(10), "ether")
        await instance.createRedPacket(0, 5, "Hello, world", {from: accounts[0], value: cpc_10})

        // 抢红包
        for(let i = 1; i < 6; i++) {
            await instance.grabRedPacket(1, {from: accounts[i]})
        }

        // 再抢红包，报错，已抢光
        try {
            await instance.grabRedPacket(1, {from: accounts[6]})
            assert.fail()
        } catch(error) {
            assert.ok(error.toString().includes("This packet is empty now."));
        }

        // Balance 校验
        for(let i = 0; i < 6; i++) {
            let grab = (await getBalance(accounts[i])) - web3.utils.toWei(String(100), "ether")
            console.log('Account', i, grab, 'CPC')
        }
    })
    it("test uintToString", async () => {
        const instance = await Redpacket.deployed()
        console.log(JSON.parse(await instance.getMessageWithSeq(1)))
        console.log(await instance.getMessageWithSeq(10000000))
    })
})
