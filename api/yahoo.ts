import axios from 'axios'

const headers = {
  'X-RapidAPI-Key': process.env.NEXT_RAPIDAPI_KEY,
  'X-RapidAPI-Host': process.env.NEXT_RAPIDAPI_HOST,
}

export const getStockData = async () => {
  const options = {
    method: 'GET',
    url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart',
    params: {
      interval: '1mo',
      symbol: 'AMRN',
      range: '5y',
      region: 'US',
      includePrePost: 'false',
      useYfid: 'true',
      includeAdjustedClose: 'true',
      events: 'capitalGain,div,split',
    },
    headers,
  }

  try {
    const response = await axios.request(options)
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}

export const searchStock = async () => {
  const options = {
    method: 'GET',
    url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/screeners/list-by-ticker',
    params: { ticker: 'AMRN' },
    headers,
  }
  try {
    const response = await axios.request(options)
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}
