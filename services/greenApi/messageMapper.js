import * as Message from '../../models/message.js';
import * as Attachment from '../../models/attachment.js';

export const locationMessage = async (customer_id, message) => {
  console.log('locationMessage')
  const incoming = message.type === 'incoming' ? true : false;
  const user_name = message.senderName;
  const created_at = new Date(message.timestamp * 1000);
  const lat = message.location.latitude;
  const lon = message.location.longitude;
  const thumb = message.location.jpegThumbnail;

  const newMessage = await Message.create({
    customer_id,
    text: "",
    incoming,
    user_name,
    created_at,
    is_checked: true,
  });

  const newAttachment = await Attachment.create({
    message_id: newMessage.id,
    lat,
    lon,
    thumb
  })

  newMessage.attachments = [newAttachment];

  return newMessage;
};

export const textMessage = async (customer_id, message) => {
  console.log('textMessage')
  const incoming = message.type === 'incoming' ? true : false;
  const text = message.textMessage;
  const user_name = message.senderName;
  const created_at = new Date(message.timestamp * 1000);

  const newMessage = await Message.create({
    customer_id,
    text,
    incoming,
    user_name,
    created_at,
    is_checked: true,
  });

  return newMessage
};

export const imageMessage = async (customer_id, message) => {
  console.log('imageMessage')
  const incoming = message.type === 'incoming' ? true : false;
  const user_name = message.senderName;
  const created_at = new Date(message.timestamp * 1000);
  const link = message.downloadUrl;
  const name = message.fileName;
  const contentType = message.mimeType;
  const thumb = message.jpegThumbnail;

  const newMessage = await Message.create({
    customer_id,
    text: "",
    incoming,
    user_name,
    created_at,
    is_checked: true,
  });

  const newAttachment = await Attachment.create({
    message_id: newMessage.id,
    link,
    name,
    contentType,
    thumb
  })

  newMessage.attachments = [newAttachment];

  return newMessage;
};

export const documentMessage = async (customer_id, message) => {
  console.log('documentMessage')
  const incoming = message.type === 'incoming' ? true : false;
  const user_name = message.senderName;
  const created_at = new Date(message.timestamp * 1000);
  const link = message.downloadUrl;
  const name = message.fileName;
  const contentType = message.mimeType;
  const thumb = message.jpegThumbnail;

  const newMessage = await Message.create({
    customer_id,
    text: "",
    incoming,
    user_name,
    created_at,
    is_checked: true,
  });

  const newAttachment = await Attachment.create({
    message_id: newMessage.id,
    link,
    name,
    contentType,
    thumb
  })

  newMessage.attachments = [newAttachment];

  return newMessage;
};

export const audioMessage = async (customer_id, message) => {
  console.log('audioMessage')
  const incoming = message.type === 'incoming' ? true : false;
  const user_name = message.senderName;
  const created_at = new Date(message.timestamp * 1000);
  const link = message.downloadUrl;
  const name = message.fileName;
  const contentType = message.mimeType;
  const thumb = message.jpegThumbnail;

  const newMessage = await Message.create({
    customer_id,
    text: "",
    incoming,
    user_name,
    created_at,
    is_checked: true,
  });

  const newAttachment = await Attachment.create({
    message_id: newMessage.id,
    link,
    name,
    contentType,
    thumb
  })

  newMessage.attachments = [newAttachment];

  return newMessage;
  // {
  //   type: 'incoming',
  //   idMessage: '2A7220F2DEFA5537C5509A54EBEC40D5',
  //   timestamp: 1731568754,
  //   typeMessage: 'audioMessage',
  //   chatId: '77762643168@c.us',
  //   downloadUrl: 'https://do-media-7103.fra1.digitaloceanspaces.com/7103111674/dd337ad1-41a6-495b-aaa5-69d6fe364ade.oga',
  //   caption: '',
  //   fileName: 'dd337ad1-41a6-495b-aaa5-69d6fe364ade.oga',
  //   jpegThumbnail: '',
  //   mimeType: 'audio/ogg; codecs=opus',
  //   isAnimated: false,
  //   isForwarded: false,
  //   forwardingScore: 0,
  //   senderId: '77762643168@c.us',
  //   senderName: 'Нур',
  //   senderContactName: ''
  // },
};

export const videoMessage = async (customer_id, message) => {
  console.log('videoMessage')
  const incoming = message.type === 'incoming' ? true : false;
  const user_name = message.senderName;
  const created_at = new Date(message.timestamp * 1000);
  const link = message.downloadUrl;
  const name = message.fileName;
  const contentType = message.mimeType;
  const thumb = message.jpegThumbnail;

  const newMessage = await Message.create({
    customer_id,
    text: "",
    incoming,
    user_name,
    created_at,
    is_checked: true,
  });

  const newAttachment = await Attachment.create({
    message_id: newMessage.id,
    link,
    name,
    contentType,
    thumb
  })

  newMessage.attachments = [newAttachment];

  return newMessage;
};

export const quotedMessage = async (customer_id, message) => {
  console.log('quotedMessage')
  const incoming = message.type === 'incoming' ? true : false;
  const text = message.extendedTextMessage.text;
  const quoted_message = message.quotedMessage.textMessage;
  const user_name = message.senderName;
  const created_at = new Date(message.timestamp * 1000);

  const newMessage = await Message.create({
    customer_id,
    text,
    quoted_message,
    incoming,
    user_name,
    created_at,
    is_checked: true,
  });

  return newMessage
};

export const extendedTextMessage = async (customer_id, message) => {
  console.log('extendedTextMessage')
  const incoming = message.type === 'incoming' ? true : false;
  const text = message.extendedTextMessage.text;
  const user_name = message.senderName;
  const created_at = new Date(message.timestamp * 1000);

  const newMessage = await Message.create({
    customer_id,
    text,
    incoming,
    user_name,
    created_at,
    is_checked: true,
  });

  return newMessage
};
