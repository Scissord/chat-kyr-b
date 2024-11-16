import axios from 'axios';
import * as Message from '../../models/message.js';
import * as Attachment from '../../models/attachment.js';
import * as Instance from '../../models/instance.js';

export default async function replyLocation(user_id, customer, file, customer_id) {
  const instance = await Instance.findByBuyerPhone(customer.buyer_phone);

  const res = await axios({
    url: `${process.env.GREEN_API_URL}/waInstance${instance.instance_id}/sendLocation/${instance.api_token}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      chatId: customer.phone,
      nameLocation: 'Location',
      address: 'Address',
      latitude: file.lat,
      longitude: file.lon,
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
      lat: file.lat,
      lon: file.lon,
      thumb: file.thumb
    });

    obj.attachments = [attachment]
  };

  return obj;
};
