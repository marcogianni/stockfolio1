/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_RAPIDAPI_KEY: process.env.NEXT_RAPIDAPI_KEY,
    NEXT_RAPIDAPI_HOST: process.env.NEXT_RAPIDAPI_HOST,
    NEXT_TWELVEDATA: process.env.NEXT_TWELVEDATA,
    NEXT_FREECURRENCYAPI: process.env.NEXT_FREECURRENCYAPI,
    NEXT_FINNHUB: process.env.NEXT_FINNHUB,
  },
}

module.exports = nextConfig
