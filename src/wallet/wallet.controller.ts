import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ApiTags } from '@nestjs/swagger';
import { WalletApiService } from '@/wallet-api';
import { Auth } from 'src/auth/auth.decorator';
import { RequestWithUser } from 'src/commomTypes';

@Controller('wallet')
@ApiTags('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly walletApiService: WalletApiService,
  ) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.create();
  }

  @Auth()
  @Post('/add_transaction/:from')
  addTransaction(
    @Param('from') from: string,
    @Body() createWalletDto: CreateWalletDto,
  ) {
    return this.walletApiService.addTransaction(from, createWalletDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletService.remove(+id);
  }

  @Auth()
  @Post('mine')
  mineBlock(@Req() req: RequestWithUser) {
    return this.walletApiService.mineBlock(req.user.firebaseUid);
  }

  @Auth()
  @Get('balance')
  getBalance(@Req() req: RequestWithUser) {
    return this.walletApiService.getBalance(req.user.firebaseUid);
  }

  @Auth()
  @Get('transactions')
  getTransactions(@Req() req: RequestWithUser) {
    return this.walletApiService.getTransactions(req.user.firebaseUid);
  }
}
