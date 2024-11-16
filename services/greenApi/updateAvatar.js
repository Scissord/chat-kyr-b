import axios from 'axios';
import * as Customer from '../../models/customer.js';
import * as Instance from '../../models/instance.js';
import randomInstance from '../instance/randomInstance.js';

export default async function updateAvatar(customer) {
  let instance = await Instance.findByBuyerPhone(customer.buyer_phone);
  if (!instance) {
    const { randomBuyerPhone, randomInstanceId, randomApiToken } = await randomInstance();
    instance = {
      instance_id: randomInstanceId,
      api_token: randomApiToken,
      phone: randomBuyerPhone
    };

    await Customer.update(customer.id, {
      buyer_phone: randomBuyerPhone
    });
  };

  const res = await axios({
    url: `${process.env.GREEN_API_URL}/waInstance${instance.instance_id}/getAvatar/${instance.api_token}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      chatId: customer.phone,
    },
  })

  if(res.status === 200 && res.data.available === true) {
    await Customer.update(customer.id, {
      avatar: res.data.urlAvatar,
    });
  };

  return;
};
