import { Controller, Get, Query } from '@nestjs/common';
import { ConsultantService } from './consultant.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { CoinHistoryQuery } from './dto/consultant.dto';

@Controller('consultant')
@ApiTags('consultant')
export class ConsultantController {
  constructor(private readonly consultantService: ConsultantService) {}

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
}
