import { cuid } from '@ioc:Adonis/Core/Helpers'
import Application from '@ioc:Adonis/Core/Application'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

export class UploadService {
  constructor() {}

  public static async applicationStorage(
    file: MultipartFileContract,
    path: string
  ): Promise<{ name: string | null; error: object | null }> {
    try {
      if (!file.isValid) {
        return { name: null, error: file.errors }
      }

      const filename = `${cuid()}.${file.extname}`

      await file.move(Application.tmpPath(path), {
        name: filename,
      })

      return { name: filename, error: null }
    } catch (error) {
      return { name: null, error }
    }
  }
}
