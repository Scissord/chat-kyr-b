import axios from 'axios';
import * as User from '../../models/user.js';
import * as Message from '../../models/message.js';
import * as Instance from '../../models/instance.js';
import * as Customer from '../../models/customer.js';
import randomInstance from '../instance/randomInstance.js';

export default async function sendTextMessage(user_id, customer, message, customer_id) {
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

  const res = await axios({
    url: `${process.env.GREEN_API_URL}/waInstance${instance.instance_id}/sendMessage/${instance.api_token}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      chatId: customer.phone,
      message: message
    },
  })

  let obj = null;
  if(res.status === 200) {
    obj = await Message.create({
      user_id,
      customer_id,
      text: message,
      incoming: false,
    });
  };

  const manager = await User.find(user_id);
  obj.manager_name = manager.name;

  return obj;
};
