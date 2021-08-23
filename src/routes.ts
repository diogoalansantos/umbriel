import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import serverAcceptsEmail from 'server-accepts-email';
import EmailValidator from 'email-deep-validator';

import CreateMessageService from '@services/CreateMessageService';
import ImportContactsService from '@services/ImportContactsService';

const routes = Router();

routes.post('/contacts/import', async (req, res) => {
  const { tags } = req.body;

  const contactsReadStream = fs.createReadStream(
    path.resolve(__dirname, '..', 'tmp', 'teste.csv'),
  );

  const importContacts = new ImportContactsService();

  await importContacts.run(contactsReadStream, tags);

  return res.send();
});

routes.post('/messages', async (req, res) => {
  const { subject, body, tags } = req.body;
  const createMessage = new CreateMessageService();

  const messageData = { subject, body };

  const message = await createMessage.run(messageData, tags);

  return res.json(message);
});

routes.post('/emailtest', async (req, res) => {
  try {
    console.log('Server Accepts Email: ', await serverAcceptsEmail(req.body.email));

    const emailValidator = new EmailValidator();
    const { wellFormed, validDomain, validMailbox } = await emailValidator.verify('foo@email.com');
    console.log('EmailValidator: ', wellFormed, validDomain, validMailbox);

    res.send();
  } catch (e) {
    console.log(e);
    res.send();
  }
});

export default routes;
