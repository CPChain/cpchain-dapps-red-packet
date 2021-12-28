const truffleAssert = require("truffle-assertions");

exports.cpc = (val) => {
    return web3.utils.toWei(String(val), "ether")
  }

exports.EVENT_CREATE_REDPACKET = "CreateRedPacket"
exports.EVENT_GRAB_REDPACKET = "GrabRedPacket"
exports.EVENT_REFUND = "Refund"

exports.checkEvent = async (tx, event, cb) => {
  let result;
  truffleAssert.eventEmitted(tx, event, (ev) => {
    result = ev
    return true
  });
  await cb(result)
}