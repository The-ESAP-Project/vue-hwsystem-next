export default defineNuxtPlugin(async () => {
  const { initAuth, user } = useAuth()
  
  console.log('Auth plugin: initializing...')
  
  // 在客户端初始化认证状态
  try {
    await initAuth()
    console.log('Auth plugin: initialization complete, user:', user.value)
  } catch (error) {
    console.error('Auth plugin: initialization failed', error)
  }
})
