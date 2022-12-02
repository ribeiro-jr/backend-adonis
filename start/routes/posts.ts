import Route from '@ioc:Adonis/Core/Route'
import PostsController from 'App/Controllers/Http/PostsController'

Route.group(() => {
  Route.get('/', new PostsController().index)
  Route.post('/', new PostsController().store)
  Route.put('/:id', new PostsController().update)
  Route.delete('/:id', new PostsController().delete)
})
  .prefix('/api/posts')
  .middleware('auth')
