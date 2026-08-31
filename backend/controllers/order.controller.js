const sendResponse = require('../utils/response');
const orderModel = require('../models/order.model');

function getMyOrders(req, res) {
  const { user_id } = req.query;
  if (!user_id) {
    return sendResponse(res, { code: 400, success: false, message: 'user_id wajib diisi' });
  }
  return sendResponse(res, { data: orderModel.findByUser(user_id) });
}

function getAllOrders(req, res) {
  return sendResponse(res, { data: orderModel.findAll() });
}

function updateOrderStatus(req, res) {
  const { status } = req.body;
  const order = orderModel.updateStatus(req.params.id, status);
  if (!order) {
    return sendResponse(res, { code: 400, success: false, message: 'Status tidak valid atau pesanan tidak ditemukan' });
  }
  return sendResponse(res, { message: 'Status pesanan diperbarui', data: order });
}

module.exports = { getMyOrders, getAllOrders, updateOrderStatus };
