import crypto from 'crypto'

export const generateOTP = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(6)), (num) =>
    (num % 10).toString()
  ).join('')
}
