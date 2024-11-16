import axios from 'axios';
import * as Message from '../../models/message.js';
import * as MessageMapper from './messageMapper.js';
import * as Attachment from '../../models/attachment.js';

export default async function updateChat(customer_id, phone, instance) {
  let isUpdated = false;
  const res = await axios({
    url: `${process.env.GREEN_API_URL}/waInstance${instance.instance_id}/getChatHistory/${instance.api_token}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      chatId: phone
    }
  })

  const messages = await Message.getChat(customer_id);

  // if(messages.length !== res.data.length) {
    await Message.destroyChat(customer_id);
    for(const message of messages) {
      await Attachment.destroyAttachment(message.id);
    };
    for(const message of res.data) {
      switch (message.typeMessage) {
        case 'locationMessage':
          const lm = await MessageMapper.locationMessage(customer_id, message)
          break;
        case 'textMessage':
          const tm = await MessageMapper.textMessage(customer_id, message)
          break;
        case 'imageMessage':
          const im = await MessageMapper.imageMessage(customer_id, message)
          break;
        case 'documentMessage':
          const dm = await MessageMapper.documentMessage(customer_id, message)
          break;
        case 'audioMessage':
          const am = await MessageMapper.audioMessage(customer_id, message)
          break;
        case 'videoMessage':
          const vm = await MessageMapper.videoMessage(customer_id, message)
          break;
        case 'quotedMessage':
          const qm = await MessageMapper.quotedMessage(customer_id, message)
          break;
        case 'stickerMessage':
          const sm = await MessageMapper.stickerMessage(customer_id, message)
          break;
        case 'extendedTextMessage':
          const etm = await MessageMapper.extendedTextMessage(customer_id, message)
          break;
        default:
          break;
      }
      isUpdated = true;
    };
  // }

  return isUpdated;
};
