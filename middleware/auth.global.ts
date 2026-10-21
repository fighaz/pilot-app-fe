export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const isLoginPage = to.path === '/login'

  if (isLoginPage && auth.isLoggedIn) {
    return navigateTo('/', { replace: true })
  }

  if (!isLoginPage && !auth.isLoggedIn) {
    return navigateTo('/login', { replace: true })
  }
})
