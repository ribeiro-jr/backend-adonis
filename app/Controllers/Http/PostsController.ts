import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Application from '@ioc:Adonis/Core/Application'

export default class PostsController {
  public async index({ response }: HttpContextContract) {
    return response.ok(await Post.all())
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.all()
    const coverImage = request.file('cover_image', {
      extnames: ['jpg', 'png'],
      size: '2mb',
    })

    if (coverImage) {
      const coverImageName = `${cuid()}.${coverImage.extname}`

      await coverImage.move(Application.tmpPath('uploads/posts'), {
        name: coverImageName,
      })

      body.cover = coverImageName
    }

    body.slug = this.slugify(body.title)

    const postsWithGivenSlug = await Post.findBy('slug', body.slug)

    if (postsWithGivenSlug?.toJSON()) {
      body.slug = `${body.slug}-${cuid()}`
    }

    const post = await Post.create(body)

    return response.ok({
      status: 200,
      data: post,
    })
  }

  public slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}
