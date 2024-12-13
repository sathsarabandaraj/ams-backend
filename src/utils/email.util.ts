import { SendEmailCommandOutput, SendEmailCommandInput, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { sesClient } from "../configs/aws.config";
import { API_URL, PLATFORM_NAME, AWS_SES_SENDER_EMAIL, OTP_EXPIRY } from "../configs/env.config";
import { renderTemplate } from "./render-template.util";

export const sendOtpEmail = async (recipientFirstName: string, recipientEmail: string, otp: string): Promise<SendEmailCommandOutput> => {
    const imageUrl = `${API_URL}/static/img/email-small.jpg`;

    const emailBody = await renderTemplate('otp-verification', {
        imageUrl: imageUrl,
        platformName: PLATFORM_NAME,
        firstName: recipientFirstName,
        otp: otp,
    });
    const input: SendEmailCommandInput = {
        FromEmailAddress: `${PLATFORM_NAME} <${AWS_SES_SENDER_EMAIL}>`,
        Destination: {
            ToAddresses: [recipientEmail],
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
                        Data: `Hi ${recipientFirstName},\n\nYour OTP is ${otp}.\n\nOTP is only valid for ${OTP_EXPIRY / 60} mins. \n\nRegards,\n${PLATFORM_NAME}`,
                        Charset: 'UTF-8'
                    }
                },
            },
        }
    };

    try {
        const command = new SendEmailCommand(input);
        return await sesClient.send(command);
    
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw error;
    }
};
