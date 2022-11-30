import Route from '@ioc:Adonis/Core/Route'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

Route.group(() => {
  Route.post('/login', async ({ auth, request, response }) => {
    const email = request.input('email')
    const password = request.input('password')

    const user = await User.query().where('email', email).firstOrFail()
    console.log(await Hash.verify(user.password, password))

    if (!(await Hash.verify(user.password, password))) {
      return response.unauthorized('Invalid credentials')
    }
    // Generate token
    const token = await auth.use('api').generate(user, {
      expiresIn: '1 day',
    })

    return response.ok(token)
  })

  Route.post('/logout', async ({ auth, response }) => {
    await auth.use('api').revoke()
    return response.ok({
      revoked: true,
    })
  }).middleware('auth')
}).prefix('/api')
