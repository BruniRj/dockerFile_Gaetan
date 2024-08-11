import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';


@Injectable()
export class EmailService {

    constructor(
        private readonly mailerService: MailerService
    ) {}

    public sendEmail(to: string, subject: string, randomCode: number):Promise<{randomCode: number, expirationDate: Date}> {
        const expirationDate = moment().add(24, 'hour').toDate();
        const formattedExpirationDate = moment(expirationDate).format('DD MMM YYYY [à] HH:mm');
        return new Promise((resolve, reject) => {
            this.mailerService
                .sendMail({
                    to,
                    subject,
                    template:'email-template',
                    context: {
                        USERNAME:to.split("@")[0],
                        EMAIL:to,
                        RANDOM_CODE:randomCode,
                        EXPIRE_DATE:formattedExpirationDate
                    }
                }).then((info) => {
                    Logger.log(info.response); // Log the response message
                    resolve({randomCode, expirationDate});
                }).catch((err) => {
                    Logger.error(err.message); // Log the error
                    reject(0);
                });
            }
        );
    }
}
