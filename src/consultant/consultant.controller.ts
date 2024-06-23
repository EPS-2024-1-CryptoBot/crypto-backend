import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { UserService } from '../user/user.service';
import { ConsultantService } from './consultant.service';
import { CoinHistoryQuery, PlaceOrderPayload } from './dto/consultant.dto';
import { RequestWithUser } from 'src/commomTypes';
import { availableTickers } from './consultant.utils';

@Controller('consultant')
@ApiTags('consultant')
export class ConsultantController {
  constructor(
    private readonly consultantService: ConsultantService,
    private readonly userService: UserService,
  ) {}

  @Auth()
  @Get('/coin_list')
  getCoinList() {
    return this.consultantService.getCoinList();
  }

  @Auth()
  @Get('/coin_list_with_summary')
  getCoinListWithSummary() {
    return this.consultantService.getCoinListWithSummary();
  }

  @Auth()
  @Get('/coin_history')
  getCoinHistory(@Query() query: CoinHistoryQuery) {
    const { coin } = query;
    return this.consultantService.getCoinHistory(coin);
  }

  @Auth()
  @Get('/contract_list')
  async getContractList(@Req() req: RequestWithUser) {
    const { user } = req;
    return this.consultantService.getContractList(user);
  }

  @Get('/symbol_price')
  getSymbolPrice(@Query('symbol') symbol: string) {
    return this.consultantService.getBinanceSymbolInfo(symbol);
  }

  @Get('/binance_balance')
  getBinanceBalance() {
    return this.consultantService.getBinanceBalance();
  }

  @Post('/place_order')
  placeOrder(@Body() orderPayload: PlaceOrderPayload) {
    return this.consultantService.placeOrder(orderPayload);
  }

  @Get('/order/:orderId/status')
  getOrderInfo(
    @Param('orderId') orderId: string,
    @Query('symbol') symbol: string,
  ) {
    return this.consultantService.getOrderInfo(orderId, symbol);
  }

  @Delete('/order/:orderId')
  cancelOrder(
    @Param('orderId') orderId: string,
    @Query('symbol') symbol: string,
  ) {
    return this.consultantService.cancelOrder(orderId, symbol);
  }

  @Get('tickers')
  getTickers() {
    return availableTickers;
  }

  @Get('stock_compass/stocks/stock-summary/:ticker')
  getStockSummary(@Param('ticker') ticker: string) {
    if (!availableTickers.some((t) => t.ticker === ticker)) {
      return { error: 'Ticker not found' };
    }
    return this.consultantService.getStockSummary(ticker);
  }
}
