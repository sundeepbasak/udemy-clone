export interface ISendMailParams {
    to: string;
    from: string;
    subject: string;
    html: string;
}

export interface IMailerService {
    sendEmail(params: ISendMailParams): Promise<any>
}