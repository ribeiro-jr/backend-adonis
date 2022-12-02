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
}
