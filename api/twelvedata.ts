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
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const timeSeries = async (symbol: string, interval: '1h' | '4h' | '1day' | '1week' | '1month') => {
  const options = {
    method: 'GET',
    url: `https://api.twelvedata.com/time_series`,
    params: {
      symbol: symbol,
      interval: interval,
      apikey: process.env.NEXT_TWELVEDATA,
      outputsize: 200, // Supports values in the range from 1 to 5000 (default 30)
    },
    headers,
  }

  try {
    const response = await axios.request(options)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const endOfDatePrice = async (symbol: string) => {
  const options = {
    method: 'GET',
    url: `https://api.twelvedata.com/eod`,
    params: {
      symbol: symbol,
      apikey: process.env.NEXT_TWELVEDATA,
    },
    headers,
  }

  try {
    const response = await axios.request(options)
    return response.data
  } catch (error) {
    console.error(error)
  }
}
