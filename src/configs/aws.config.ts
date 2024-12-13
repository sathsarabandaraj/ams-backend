
import { SESv2Client, SESv2ClientConfig } from '@aws-sdk/client-sesv2';
import { AWS_SES_ACCESS_KEY_ID, AWS_SES_REGION, AWS_SES_SECRET_ACCESS_KEY } from './env.config';

const sesConfig: SESv2ClientConfig = ({
    region: AWS_SES_REGION,
    credentials: {
        accessKeyId: AWS_SES_ACCESS_KEY_ID,
        secretAccessKey: AWS_SES_SECRET_ACCESS_KEY
    }
});

export const sesClient = new SESv2Client(sesConfig); 
