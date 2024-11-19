import axios from 'axios';
import * as Message from '../../models/message.js';
import * as Attachment from '../../models/attachment.js';
import * as Instance from '../../models/instance.js';
import * as User from '../../models/user.js';
import * as Customer from '../../models/customer.js';
import randomInstance from '../instance/randomInstance.js';

export default async function sendFileMessage(user_id, customer, file, customer_id) {
  let instance = await Instance.findByBuyerPhone(customer.buyer_phone);
  if (!instance) {
    const { randomBuyerPhone, randomInstanceId, randomApiToken } = await randomInstance();
    instance = {
      instance_id: randomInstanceId,
      api_token: randomApiToken,
      phone: randomBuyerPhone
    };

    await Customer.update(customer_id, {
      buyer_phone: randomBuyerPhone
    });
  }
  const url = process.env.URL + 'uploads/' + file.filename;

  const res = await axios({
    url: `${process.env.GREEN_API_URL}/waInstance${instance.instance_id}/sendFileByUrl/${instance.api_token}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      chatId: customer.phone,
      urlFile: url,
      fileName: file.originalname
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
      link: url,
      name: file.originalname,
      contentType: file.mimetype
    });

    obj.attachments = [attachment]
  };

  const manager = await User.find(user_id);
  obj.manager_name = manager.name;

  await Customer.update(customer_id, { manager_id: user_id });

  return obj;
};
