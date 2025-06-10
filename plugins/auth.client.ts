export default defineNuxtPlugin(async () => {
  const { initAuth } = useAuth()
  
  // 在客户端初始化认证状态
  await initAuth()
})
