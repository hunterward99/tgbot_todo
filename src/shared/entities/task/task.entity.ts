import {
  AutoIncrement,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'tasks' })
export class TaskEntity extends Model<TaskEntity, any> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column(DataType.INTEGER)
  declare ownerId: number;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare description: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isCompleted: boolean;
}
