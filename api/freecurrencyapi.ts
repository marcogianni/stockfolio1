import axios from 'axios'

export const getCurrencyExchange = async () => {
  const options = {
    method: 'GET',
    url: `https://api.freecurrencyapi.com/v1/latest`,
    params: {
      apikey: process.env.NEXT_FREECURRENCYAPI,
    },
  }

  try {
    const response = await axios.request(options)
    return response.data
  } catch (error) {
    console.error(error)
  }
}
