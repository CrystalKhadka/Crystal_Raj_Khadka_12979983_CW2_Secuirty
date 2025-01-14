const axios = require('axios');
const dotenv = require('dotenv')

const verifyPayment = async (token, amount) => {
  try {
    const response = await axios.post(
      'https://khalti.com/api/v2/payment/verify/',
      {
        token,
        amount,
      },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

module.exports = {
  verifyPayment,
};
