import axios from 'axios';

const shippoClient = axios.create({
  baseURL: 'https://api.goshippo.com/',
  headers: {
    'Authorization': `ShippoToken ${process.env.SHIPPO_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const transaction = async(rate) => {
  const response = await shippoClient.post('/transactions/', {
      rate: rate,
      label_file_type: 'PDF'
  });
  return response.data;
}

export const getTransaction = async(rate) => {
  const response = await shippoClient.get('/transactions/');
  return response.data;
}