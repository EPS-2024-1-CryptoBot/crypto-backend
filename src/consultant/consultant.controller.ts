import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { User } from 'src/database/entities';
import { UserService } from '../user/user.service';
import { ConsultantService } from './consultant.service';
import { CoinHistoryQuery } from './dto/consultant.dto';

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
  @Post('/binance_api_key/:firebaseUid/:apiKey')
  async addApiKeyBinanceToUser(
    @Param('firebaseUid') firebaseUid: string,
    @Param('apiKey') apiKey: string,
    @Res() res: any,
  ) {
    try {
      const response = await this.consultantService.addApiKeyBinanceToUser(
        apiKey,
      );
      console.log("RESPONSEEE", response, firebaseUid)
      const updated = await this.userService.updateUserByFirebaseUid(
        firebaseUid,
        { api_token_binance: response },
      );
      console.log("UPDATED", updated)

      return res.status(200).json(updated);
    } catch (error) {
      return res.status(404).json({
        message:
          error.message || 'An error occurred while searching for the user',
      });
    }
  }

  @Auth()
  @Post('/decrypt_binance_api_key/:firebaseUid')
  async decryptApiKeyBinance(
    @Param('firebaseUid') firebaseUid: string,
    @Body() user: any,
    @Res() res: any,
  ) {
    try {
      const response = await this.consultantService.getApiKeyBinanceToUser(
        user.api_token_binance,
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(404).json({
        message:
          error.message || 'An error occurred while searching for the user',
      });
    }
  }
}
