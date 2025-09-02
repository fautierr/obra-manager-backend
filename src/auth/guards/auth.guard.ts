import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ConfigService } from '@nestjs/config'
import { formatAndLogTokenTimes } from 'src/utils/token-time'

const dynamicImport = async <T = unknown>(packageName: string): Promise<T> =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-implied-eval
  new Function(`return import('${packageName}')`)() as Promise<T>

export interface AuthUser {
  name: string
  email: string
  picture?: string
  sub: string
  iat: number
  exp: number
  jti?: string
}

export interface RequestWithUser {
  cookies: Record<string, string>
  user?: AuthUser
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context).getContext<{
      req: RequestWithUser
      res: unknown
    }>()

    const req = gqlCtx.req
    console.log('🔥 AuthGuard - cookies recibidas:', req.cookies)

    if (!req || !req.cookies) {
      throw new UnauthorizedException('No request or cookies found')
    }

    const cookieName =
      '__Secure-authjs.session-token' in req.cookies
        ? '__Secure-authjs.session-token'
        : 'authjs.session-token'

    const token = req.cookies[cookieName]
    console.log(
      '🔥 AuthGuard - cookie que se usará:',
      cookieName,
      'valor:',
      token,
    )
    if (!token) {
      throw new UnauthorizedException('No session token found')
    }

    try {
      // ✅ dynamic import de ESM con tipado
      const authCoreJWTModule = await dynamicImport<{
        decode: (params: {
          token: string
          secret: string
          salt?: string
        }) => Promise<AuthUser | null>
      }>('@auth/core/jwt')

      const secret = this.configService.get<string>('nextAuthSecret')
      console.log('🔥 AuthGuard - nextAuthSecret:', secret)
      if (!secret) {
        throw new UnauthorizedException('nextAuthSecret not configured')
      }

      const decoded = await authCoreJWTModule.decode({
        token,
        secret,
        salt: cookieName,
      })
      console.log('🔥 AuthGuard - token decodificado:', decoded)

      if (!decoded) {
        throw new UnauthorizedException('Invalid session')
      }

      const nowInSeconds = Math.floor(Date.now() / 1000)
      formatAndLogTokenTimes(decoded.exp, nowInSeconds)

      if (decoded.exp && decoded.exp < nowInSeconds) {
        throw new UnauthorizedException('Session expired')
      }
      req.user = decoded

      console.log('🤷 User', req.user)

      return true
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown authentication error'
      console.error('AuthGuard error:', err)
      throw new UnauthorizedException('Invalid session: ' + message)
    }
  }
}
