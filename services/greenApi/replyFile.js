import axios from 'axios';
import * as Message from '../../models/message.js';
import * as Attachment from '../../models/attachment.js';
import * as Instance from '../../models/instance.js';

export default async function replyFile(user_id, customer, file, customer_id) {
  const instance = await Instance.findByBuyerPhone(customer.buyer_phone);

  const res = await axios({
    url: `${process.env.GREEN_API_URL}/waInstance${instance.instance_id}/sendFileByUrl/${instance.api_token}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      chatId: customer.phone,
      urlFile: file.link,
      fileName: file.name
    },
  })

  let obj = null;

  if(res.status === 200) {
    obj = await Message.create({
      user_id,
      customer_id,
      text: "",
      incoming: false,
    });

    const attachment = await Attachment.create({
      message_id: obj.id,
      link: file.link,
      name: file.name,
      contentType: file.contentType,
      lat: file.lat,
      lon: file.lon,
      thumb: file.thumb
    });

    obj.attachments = [attachment]
  };

  return obj;
};
