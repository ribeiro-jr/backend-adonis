import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import { UploadService } from 'App/Services/UploadService'
import Helper from 'App/Helpers/Helper'

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
      const coverImageName = UploadService.applicationStorage(coverImage, 'uploads/posts')

      if (!coverImageName) {
        return response.badRequest({
          status: 204,
          message: 'Não foi possivel fazer o upload do ficheiro',
        })
      }

      body.cover = coverImageName
    }

    body.slug = Helper.slugify(body.title)

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
}
