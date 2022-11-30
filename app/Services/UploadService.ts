import { cuid } from '@ioc:Adonis/Core/Helpers'
import Application from '@ioc:Adonis/Core/Application'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

export class UploadService {
  constructor() {}

  public static async applicationStorage(file: MultipartFileContract, path: string) {
    try {
      const filename = `${cuid()}.${file.extname}`

      await file.move(Application.tmpPath(path), {
        name: filename,
      })

      return filename
    } catch (error) {
      return null
    }
  }
}
