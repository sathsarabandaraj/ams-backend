import {
  type SendEmailCommandOutput,
  type SendEmailCommandInput,
  SendEmailCommand
} from '@aws-sdk/client-sesv2'
import { sesClient } from '../configs/aws.config'
import {
  API_URL,
  PLATFORM_NAME,
  AWS_SES_SENDER_EMAIL,
  OTP_EXPIRY,
  APP_URL
} from '../configs/env.config'
import { renderTemplate } from './render-template.util'

export const sendOtpEmail = async (
  recipientFirstName: string,
  recipientEmail: string,
  otp: string
): Promise<SendEmailCommandOutput> => {
  const imageUrl = `${API_URL ?? ''}/static/img/email-small.jpg`
  const otpExpiryMinutes = OTP_EXPIRY / 60

  const emailBody = await renderTemplate('otp-verification', {
    imageUrl,
    platformName: PLATFORM_NAME,
    firstName: recipientFirstName,
    otp,
    otpExpiryMinutes
  })

  const input: SendEmailCommandInput = {
    FromEmailAddress: `${PLATFORM_NAME} <${AWS_SES_SENDER_EMAIL}>`,
    Destination: {
      ToAddresses: [recipientEmail]
    },
    Content: {
      Simple: {
        Subject: {
          Data: 'Email Verification OTP',
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: emailBody,
            Charset: 'UTF-8'
          },
          Text: {
            Data: `Hello ${recipientFirstName},\n\nYour OTP is ${otp}.\n\nThis OTP is only valid for ${otpExpiryMinutes} minutes.\n\nRegards,\n${PLATFORM_NAME}`,
            Charset: 'UTF-8'
          }
        }
      }
    }
  }

  try {
    const command = new SendEmailCommand(input)
    return await sesClient.send(command)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw error
  }
}

export const sendPasswordResetEmail = async (
  recipientFirstName: string,
  recipientEmail: string,
  otp: string
): Promise<SendEmailCommandOutput> => {
  const imageUrl = `${API_URL ?? ''}/static/img/email-small.jpg`
  const otpExpiryMinutes = OTP_EXPIRY / 60
  const resetLink = `${APP_URL}/auth/password-reset?otp=${otp}`
  const emailBody = await renderTemplate('password-reset-instructions', {
    imageUrl,
    platformName: PLATFORM_NAME,
    firstName: recipientFirstName,
    otp,
    resetLink,
    otpExpiryMinutes
  })

  const input: SendEmailCommandInput = {
    FromEmailAddress: `${PLATFORM_NAME} <${AWS_SES_SENDER_EMAIL}>`,
    Destination: {
      ToAddresses: [recipientEmail]
    },
    Content: {
      Simple: {
        Subject: {
          Data: 'Reset Your Password',
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: emailBody,
            Charset: 'UTF-8'
          },
          Text: {
            Data: `Hello ${recipientFirstName},\n\nUse this OTP to reset your password: ${otp}\nOr click the link below:\n\n${resetLink}\n\nThis OTP is valid for ${otpExpiryMinutes} minutes. Please do not share this email or OTP with anyone.\n\nRegards,\n${PLATFORM_NAME}`,
            Charset: 'UTF-8'
          }
        }
      }
    }
  }

  try {
    const command = new SendEmailCommand(input)
    return await sesClient.send(command)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw error
  }
}
