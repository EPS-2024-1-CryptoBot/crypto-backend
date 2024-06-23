import axios from 'axios';
import { fetchConfig } from 'src/app.config';

type TickerInfo = {
  ticker: string;
  companyName: string;
};

export const availableTickers: TickerInfo[] = [
  {
    ticker: 'ITUB4',
    companyName: 'Itaú Unibanco Holding S.A.',
  },
  {
    ticker: 'PETR4',
    companyName: 'Petroleo Brasileiro S.A.',
  },
  {
    ticker: 'VALE3',
    companyName: 'Vale S.A.',
  },
  {
    ticker: 'BBDC4',
    companyName: 'Banco Bradesco S.A.',
  },
  {
    ticker: 'ABEV3',
    companyName: 'Ambev S.A.',
  },
  {
    ticker: 'B3SA3',
    companyName: 'B3 S.A. - Brasil, Bolsa, Balcão',
  },
  {
    ticker: 'BBAS3',
    companyName: 'Banco do Brasil S.A.',
  },
  {
    ticker: 'PETR3',
    companyName: 'Petroleo Brasileiro S.A.',
  },
  {
    ticker: 'ITSA4',
    companyName: 'Itaúsa - Investimentos Itaú S.A.',
  },
  {
    ticker: 'LREN3',
    companyName: 'Lojas Renner S.A.',
  },
  {
    ticker: 'WEGE3',
    companyName: 'WEG S.A.',
  },
  {
    ticker: 'GGBR4',
    companyName: 'Gerdau S.A.',
  },
  {
    ticker: 'RENT3',
    companyName: 'Localiza Rent a Car S.A.',
  },
  {
    ticker: 'SUZB3',
    companyName: 'Suzano S.A.',
  },
  {
    ticker: 'VVAR3',
    companyName: 'Via Varejo S.A.',
  },
  {
    ticker: 'CIEL3',
    companyName: 'Cielo S.A.',
  },
];

export const stockCompassApi = axios.create({
  baseURL: fetchConfig('integration', 'stock_compass_api'),
  headers: {
    'Content-Type': 'application/json',
  },
});
