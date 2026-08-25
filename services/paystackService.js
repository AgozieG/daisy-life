import axios from 'axios';

export async function verifyPaystackTransaction(reference) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey || secretKey.includes('your_paystack_secret_key')) {
    throw new Error('PAYSTACK_SECRET_KEY is not set correctly in the backend .env file');
  }

  const response = await axios.get(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  });

  return response.data;
}
