import { IMailerService, ISendMailParams } from '@/types/mailer.types';
import nodemailer from 'nodemailer';


export class NodeMailerService implements IMailerService {
    private transporter;
    constructor(emailUser: string, emailPassword: string) {
        this.transporter = nodemailer.createTransport({
            host: "smtp.forwardemail.net",
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
                user: emailUser,
                pass: emailPassword
            }
        });
    }

    async sendEmail(params: ISendMailParams) {
        try {
            // send Mail implemntation
            const res = await this.transporter.sendMail({
                from: params.from,
                to: params.to,
                subject: params.subject,
                html: params.html
            })
            return res;
        }
        catch (err) {
            return false
        }
    }
}