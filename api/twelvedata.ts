import axios from 'axios'

const headers = {
  Authorization: process.env.NEXT_TWELVEDATA,
}

export const searchStock = async (symbol: string) => {
  const options = {
    method: 'GET',
    url: `https://api.twelvedata.com/symbol_search`,
    params: {
      symbol: symbol,
    },
    headers,
  }

  try {
    const response = await axios.request(options)
    console.log('searchStock', response.data)
  } catch (error) {
    console.error(error)
  }
}
