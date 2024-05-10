import { Column } from 'typeorm/decorator/columns/Column';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { Base } from './base.entity';

@Entity()
export class Wallet extends Base {
    @Column({ unique: true })
    address: string;
}