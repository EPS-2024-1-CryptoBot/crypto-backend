import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export interface CoinHistoryQuery {
  coin: string;
}

export class PlaceOrderPayload {
  @IsNotEmpty()
  @IsString()
  symbol: string;

  @IsNotEmpty()
  @IsString()
  side: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  tif: string;

  @IsNotEmpty()
  @IsString()
  order_type: string;
}
