import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import PostType from './PostType'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @column()
  public post_type_id: number

  @column()
  public title: string

  @column()
  public cover: string

  @column()
  public resume: string

  @column()
  public content: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => PostType)
  public post_type: BelongsTo<typeof PostType>

  @manyToMany(() => Category, {
    pivotTable: 'post_categories',
    pivotTimestamps: true,
  })
  public categories: ManyToMany<typeof Category>
}
