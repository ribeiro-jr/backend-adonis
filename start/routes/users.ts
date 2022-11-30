import Route from '@ioc:Adonis/Core/Route'
import UsersController from 'App/Controllers/Http/UsersController'

Route.group(() => {
  Route.get('/', new UsersController().index)
  Route.post('/', new UsersController().store)
}).prefix('/api/users')
