const sendResponse = require('../utils/response');
const orderModel = require('../models/order.model');

function getMyOrders(req, res) {
  return sendResponse(res, { data: orderModel.findByUser(req.user.id) });
}

module.exports = { getMyOrders };
