export interface CoinHistoryQuery {
  coin: string;
}

export interface PlaceOrderPayload {
  symbol: string;
  side: string;
  quantity: number;
  price: number;
  tif: string;
}
