import SES from 'aws-sdk/clients/ses';
import MessageData from './structures/MessageData';
import Template from './Template';

const addressIgnore = ['carlosbalb@oi.com.br', 'bb188b1aefc425a98c6ea94ab1888f1f@uol.com.br', 'ibbatista@oi.com.br', '	298bcb520c02c14afa663cb8555a7b79@uol.com.br', '	8f14f2cd2300789e82c496578b4dc65a@bol.com.br', '	rechuang@yahoo.com', 'adriamake@ig.com.br', 'soniarcj@ig.com.br'];

class SendMessageToRecipientService {
  private client: SES;

  constructor() {
    this.client = new SES({
      region: 'us-west-2',
    });
  }

  async run(to: string, messageData: MessageData): Promise<void> {
    if (addressIgnore.indexOf(to) !== -1) {
      return;
    }

    await this.client
      .sendEmail({
        Source: 'Hey Liberdade <oi@heyliberdade.com.br>',
        SourceArn: 'arn:aws:ses:us-west-2:191302063853:identity/oi@heyliberdade.com.br',
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: Template.assunto,
          },
          Body: {
            Html: {
              Data: Template.body,
            },
            Text: {
              Data: Template.body,
            }
          },
        },
        ConfigurationSetName: 'OHR',
        Tags: [{ Name: 'hl_statistic_dimension_name', Value: 'NULL' }]
      }, (callback) => {
        // console.log(callback);
        // console.log('------------------------');
        // console.log('');
      });
    // }, (callback) => {
    //   console.log(callback, 'callback');
    // })
    // .promise();    
  }
}

export default SendMessageToRecipientService;
