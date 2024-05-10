
import {
    IsNotEmpty,
} from 'class-validator';
export class CreateWalletDto {

    @IsNotEmpty()
    receiver: string

    @IsNotEmpty()
    amount: number
}
