import axios from 'axios'

export const stockOverview = async (symbol: string) => {
  const URL = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${process.env.NEXT_ALPHAVANTAGE}`

  const options = {
    method: 'GET',
    url: URL,
  }

  try {
    const response = await axios.request(options)
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}
