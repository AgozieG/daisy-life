import { Router } from 'express';
import { verifyPaystackTransaction } from '../services/paystackService.js';
import { sendOrderReceiptEmail } from '../services/whatsappService.js';

const router = Router();

router.post('/verify-and-dispatch', async (req, res) => {
  const { reference, cartItems, deliveryDetails, userProfile, deliveryType, grandTotal } = req.body;

  if (!reference || !Array.isArray(cartItems) || cartItems.length === 0 || !deliveryDetails || !userProfile) {
    return res.status(400).json({ success: false, message: 'Missing required order fields' });
  }
  if (!deliveryDetails.phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }
  if (deliveryType === 'delivery' && !deliveryDetails.address) {
    return res.status(400).json({ success: false, message: 'Delivery address is required' });
  }

  try {
    // 1. Verify payment directly with Paystack (never trust the client alone)
    const paystackRes = await verifyPaystackTransaction(reference);
    const { status, data } = paystackRes;

    if (!status || !data || data.status !== 'success') {
      return res.status(400).json({ success: false, message: 'Payment could not be verified' });
    }

    // 2. Fraud check: verified amount must cover the calculated cart total
    const paidAmount = data.amount / 100;
    const serverCalculatedTotal = cartItems.reduce((sum, item) => sum + Number(item.lineTotal || 0), 0);
    const expected = Number(grandTotal) || serverCalculatedTotal;

    if (paidAmount < Math.min(expected, serverCalculatedTotal) - 1) {
      return res.status(400).json({ success: false, message: 'Paid amount does not match order total' });
    }

    // 3. Dispatch order receipt to the restaurant email (non-blocking if SMTP isn't configured yet)
    let emailSent = false;
    try {
      await sendOrderReceiptEmail({ reference, cartItems, deliveryDetails, userProfile, deliveryType, paidAmount });
      emailSent = true;
    } catch (emailErr) {
      console.warn('Order email dispatch failed:', emailErr.message);
    }

    return res.json({
      success: true,
      message: emailSent
        ? 'Order confirmed and emailed to the kitchen'
        : 'Order confirmed. Email dispatch is not active yet, but your payment was verified.',
      orderId: reference,
      emailSent,
      whatsappSent: emailSent,
    });
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Something went wrong confirming your order';
    console.error('Order verification/dispatch error:', message);
    return res.status(500).json({ success: false, message });
  }
});

export default router;
