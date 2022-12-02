import Application from '@ioc:Adonis/Core/Application'
import { unlinkSync, existsSync } from 'fs'
export default class Helper {
  public static slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  public static paginationParams(params): { page: number; perPage: number } {
    let { page, perPage } = params

    if (!page) page = 1

    if (!perPage) perPage = 5

    return {
      page,
      perPage,
    }
  }

  public static unlinkFile(filename, path) {
    if (!filename) return

    if (typeof filename === 'object') {
      for (let fn of filename) {
        let filePath = Application.tmpPath(path) + fn
        if (existsSync(filePath)) unlinkSync(filePath)
      }
      return
    }

    let filePath = Application.tmpPath(path) + filename
    if (existsSync(filePath)) unlinkSync(filePath)
  }
}
