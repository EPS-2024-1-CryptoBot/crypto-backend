import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsAlpha,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  @IsAlpha()
  firstName: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  @IsAlpha()
  lastName: string;

  firebaseUid: string;

  public_key: string;

  private_key: string[];
}

export class UpdateUserDto {
  @MinLength(2)
  @MaxLength(20)
  @IsAlpha()
  @ValidateIf((o) => o.firstName !== undefined)
  firstName: string;

  @MinLength(2)
  @MaxLength(20)
  @IsAlpha()
  lastName: string;

  firebaseUid: string;
}

export class UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  firebaseUid: string;
  public_key: string;
  private_key: string[];
}
