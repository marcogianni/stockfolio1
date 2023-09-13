import axios from 'axios'

export const alphaSearch = async (symbol: string) => {
  const URL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${process.env.NEXT_ALPHAVANTAGE}`

  const options = {
    method: 'GET',
    url: URL,
    headers: {
      'User-Agent': 'request',
    },
  }

  try {
    const response = await axios.request(options)
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}
