import axios from 'axios'

const headers = {
  Authorization: process.env.NEXT_FINNHUB,
}

export const companyInfo = async (symbol: string) => {
  const options = {
    method: 'GET',
    url: `https://finnhub.io/api/v1/stock/profile2`,
    params: {
      symbol: symbol,
      token: process.env.NEXT_FINNHUB,
    },
    // headers,
  }

  try {
    const response = await axios.request(options)
    return response.data
  } catch (error) {
    console.error(error)
  }
}
