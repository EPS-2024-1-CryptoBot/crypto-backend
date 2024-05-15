import { Column } from 'typeorm/decorator/columns/Column';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { Base } from './base.entity';

@Entity()
export class User extends Base {
  @Column('citext', { unique: true })
  email: string;

  @Column({ nullable: true })
  firebaseUid?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  public_key: string;

  @Column('text', { array: true })
  private_key: string[];
}
