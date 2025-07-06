export class ErrorCode {
  // 成功
  static readonly Success = 0

  // 通用错误
  static readonly BadRequest = 1000 // 错误的请求
  static readonly Unauthorized = 1003 // 未授权访问
  static readonly NotFound = 1004 // 未找到资源
  static readonly Conflict = 1009 // 冲突 (资源已存在)
  static readonly InternalServerError = 1005 // 内部服务器错误

  // Auth 错误
  static readonly AuthFailed = 2000 // 身份验证失败
}
