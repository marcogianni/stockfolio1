import axios from 'axios'

// https://www.alphavantage.co/query?function=CASH_FLOW&symbol=IBM&apikey=demo CASH FLOW
// https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=demo SENTIMENT NEWS
// https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo CURRENCY EXCHANGE

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

/*
 https://iexcloud.io/docs/api/#company
 GET /stock/{symbol}/company

 5 Requests Per Second

 {
  "symbol": "AAPL",
  "companyName": "Apple Inc.",
  "exchange": "NASDAQ",
  "industry": "Telecommunications Equipment",
  "website": "http://www.apple.com",
  "description": "Apple, Inc. engages in the design, manufacture, and marketing of mobile communication, media devices, personal computers, and portable digital music players. It operates through the following geographical segments: Americas, Europe, Greater China, Japan, and Rest of Asia Pacific. The Americas segment includes North and South America. The Europe segment consists of European countries, as well as India, the Middle East, and Africa. The Greater China segment comprises of China, Hong Kong, and Taiwan. The Rest of Asia Pacific segment includes Australia and Asian countries. The company was founded by Steven Paul Jobs, Ronald Gerald Wayne, and Stephen G. Wozniak on April 1, 1976 and is headquartered in Cupertino, CA.",
  "CEO": "Timothy Donald Cook",
  "securityName": "Apple Inc.",
  "issueType": "cs",
  "sector": "Electronic Technology",
  "primarySicCode": 3663,
  "employees": 132000,
  "tags": [
    "Electronic Technology",
    "Telecommunications Equipment"
  ],
  "address": "One Apple Park Way",
  "address2": null,
  "state": "CA",
  "city": "Cupertino",
  "zip": "95014-2083",
  "country": "US",
  "phone": "1.408.974.3123"
}

Finnub
docs/api/websocket-press-releases
60 API calls/minute

https://finnhub.io/docs/api/company-profile


*/
