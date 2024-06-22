import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { UserService } from '../user/user.service';
import { ConsultantService } from './consultant.service';
import { CoinHistoryQuery, PlaceOrderPayload } from './dto/consultant.dto';

const availableCoins = require('../mock/availableCoins.json');
const coinHistory = require('../mock/coinHistory.json');

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
    console.log("AVAILABLE COINS", availableCoins);
    return availableCoins;
  }

  @Auth()
  @Get('/coin_history')
  getCoinHistory(@Query() query: CoinHistoryQuery) {
    console.log("COIN HISTORY", coinHistory);
    return coinHistory;
  }

  @Auth()
  @Post('/binance_api_key/:firebaseUid/:apiKey')
  async addApiKeyBinanceToUser(
    @Param('firebaseUid') firebaseUid: string,
    @Param('apiKey') apiKey: string,
    @Res() res: any,
  ) {
    try {
      const response = await this.consultantService.addApiKeyBinanceToUser(apiKey);
      console.log("RESPONSE", response, firebaseUid);
      const updated = await this.userService.updateUserByFirebaseUid(firebaseUid, {
        api_token_binance: response,
      });
      console.log("UPDATED", updated);

      return res.status(HttpStatus.OK).json(updated);
    } catch (error) {
      console.error("ERROR", error);
      throw new HttpException(
        error.message || 'An error occurred while adding the API key',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Auth()
  @Post('/decrypt_binance_api_key/:firebaseUid')
  async decryptApiKeyBinance(
    @Param('firebaseUid') firebaseUid: string,
    @Body() user: { api_token_binance: string },
    @Res() res: any,
  ) {
    try {
      const response = await this.consultantService.getApiKeyBinanceToUser(user.api_token_binance);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.error("ERROR", error);
      throw new HttpException(
        error.message || 'An error occurred while decrypting the API key',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/contract_list')
  getContractList() {
    return this.consultantService.getContractList();
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
}
