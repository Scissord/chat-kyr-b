import axios from 'axios';
import * as Message from '../../models/message.js';
import * as Attachment from '../../models/attachment.js';
import * as Instance from '../../models/instance.js';
import * as User from '../../models/user.js';
import * as Customer from '../../models/customer.js';
import randomInstance from '../instance/randomInstance.js';

export default async function sendTemplateMessage(user_id, customer, file, customer_id, product) {
  let instance = await Instance.findByBuyerPhone(customer.buyer_phone);

  if (!instance) {
    const newInstance = await randomInstance();
    instance = {
      instance_id: newInstance.randomInstanceId,
      api_token: newInstance.randomApiToken,
      phone: newInstance.randomBuyerPhone
    };

    await Customer.update(customer_id, {
      buyer_phone: newInstance.randomBuyerPhone,
    });
  };

  let isAuthorized = false;
  let maxRetries = 10;
  let attempts = 0;

  while (!isAuthorized && attempts < maxRetries) {
    const instanceStatus = await axios({
      method: 'GET',
      url: `${process.env.GREEN_API_URL}/waInstance${instance.instance_id}/getStateInstance/${instance.api_token}`,
    });

    if (instanceStatus.data.stateInstance === 'authorized') {
      isAuthorized = true;
    } else {
      const newInstance = await randomInstance();
      instance = {
        instance_id: newInstance.randomInstanceId,
        api_token: newInstance.randomApiToken,
        phone: newInstance.randomBuyerPhone,
      };

      await Customer.update(customer_id, {
        buyer_phone: newInstance.randomBuyerPhone,
      });

      attempts++;
    }
  }

  if (isAuthorized) {
    const url = process.env.URL + `templates/${product}/` + file.filename;
    await axios({
      url: `${process.env.GREEN_API_URL}/waInstance${instance.instance_id}/sendFileByUrl/${instance.api_token}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        chatId: customer.phone,
        urlFile: url,
        fileName: file.filename
      },
    })


    let obj = await Message.create({
      user_id,
      customer_id,
      text: "",
      incoming: false,
    });

    const attachment = await Attachment.create({
      message_id: obj.id,
      link: url,
      name: file.filename,
      contentType: file.mimetype
    });

    obj.attachments = [attachment]

    const manager = await User.find(user_id);
    obj.manager_name = manager.name;

    await Customer.update(customer_id, { manager_id: user_id });

    return obj;
  }
};
