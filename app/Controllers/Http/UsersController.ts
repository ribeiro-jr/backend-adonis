import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    return response.ok({
      status: 200,
      data: await User.all(),
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['email', 'password'])

    const user = await User.create(data)

    if (!user) {
      return response.badRequest({
        status: 204,
        message: 'Error ao criar utilizador',
      })
    }

    return response.ok({
      status: 200,
      data: user,
    })
  }
}
