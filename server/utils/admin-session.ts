import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import type { H3Event } from "h3"

export const adminCookieName = "sara_admin"
const sessionMs = 7 * 24 * 60 * 60 * 1000

function digest(value: string) {
  return createHash("sha256").update(value).digest()
}

export function safeEqual(left: string, right: string) {
  return timingSafeEqual(digest(left), digest(right))
}

export function signAdminSession(secret: string, username: string) {
  const payload = Buffer.from(JSON.stringify({
    u: username,
    exp: Date.now() + sessionMs,
  })).toString("base64url")
  const signature = createHmac("sha256", secret).update(payload).digest("base64url")
  return `${payload}.${signature}`
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  }
}

export function requireAdmin(event: H3Event) {
  const config = useRuntimeConfig()
  const session = readAdminSession(getCookie(event, adminCookieName), config.sessionSecret)
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Sign in required",
    })
  }
  return session
}

export function readAdminSession(token: string | undefined, secret: string) {
  if (!token || !secret) {
    return null
  }

  const [payload, signature] = token.split(".")
  if (!payload || !signature) {
    return null
  }

  const expected = createHmac("sha256", secret).update(payload).digest("base64url")
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { u?: unknown, exp?: unknown }
    if (typeof data.u !== "string" || typeof data.exp !== "number" || data.exp < Date.now()) {
      return null
    }
    return { username: data.u }
  }
  catch {
    return null
  }
}
