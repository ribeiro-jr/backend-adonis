/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import { UploadService } from 'App/Services/UploadService'
import Helper from 'App/Helpers/Helper'

export default class PostsController {
  public async index({ response }: HttpContextContract) {
    return response.ok({
      status: 200,
      data: await Post.query().has('categories'),
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const { category_id } = request.only(['category_id'])
    const body = request.only(['post_type_id', 'title', 'resume', 'content', 'slug', 'cover'])

    const coverImage = request.file('cover_image', {
      extnames: ['jpg', 'png'],
      size: '2mb',
    })

    if (coverImage) {
      const coverImageName = await UploadService.applicationStorage(coverImage, 'uploads/posts')

      if (!coverImageName) {
        return response.badRequest({
          status: 400,
          message: 'Não foi possível fazer o upload do ficheiro',
        })
      }

      body.cover = coverImage
    }

    body.slug = Helper.slugify(body.title)

    const postsWithGivenSlug = await Post.findBy('slug', body.slug)

    if (postsWithGivenSlug?.toJSON()) {
      body.slug = `${body.slug}-${cuid()}`
    }

    const post = await Post.create(body)

    await post.related('categories').sync(category_id)

    return response.ok({
      status: 200,
      data: post,
    })
  }

  public async update({ params, request, response }: HttpContextContract) {
    const { category_id } = request.only(['category_id'])
    const body = request.only(['post_type_id', 'title', 'resume', 'content', 'slug', 'cover'])

    const post = await Post.findOrFail(params.id)

    if (!post?.toJSON()) {
      return response.ok({
        status: 204,
        message: 'Post not founded',
      })
    }

    const coverImage = request.file('cover_image', {
      extnames: ['jpg', 'png'],
      size: '2mb',
    })

    if (coverImage) {
      const coverImageName = await UploadService.applicationStorage(coverImage, 'uploads/posts')

      if (!coverImageName) {
        return response.badRequest({
          status: 204,
          message: 'Não foi possivel fazer o upload do ficheiro',
        })
      }

      body.cover = coverImageName
    }

    body.slug = Helper.slugify(body.title)

    const postsWithGivenSlug = await Post.query()
      .where('slug', body.slug)
      .where('id', '!=', post.id)

    if (postsWithGivenSlug) {
      body.slug = `${body.slug}-${cuid()}`
    }

    await post.merge(body).save()

    if (category_id) {
      await post.related('categories').sync(category_id)
    }

    return response.ok({
      status: 200,
      data: post,
    })
  }

  public async delete({ params, response }: HttpContextContract) {
    const post = await Post.find(params.id)

    if (!post) {
      return response.ok({
        status: 204,
        message: 'Post does not exist',
      })
    }

    await post.delete()
    await post.related('categories').detach()

    return response.ok({
      status: 200,
      data: post,
    })
  }
}
