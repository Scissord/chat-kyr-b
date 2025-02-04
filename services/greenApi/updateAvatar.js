import axios from 'axios';
import * as Customer from '../../models/customer.js';
import * as Instance from '../../models/instance.js';
import randomInstance from '../instance/randomInstance.js';

export default async function updateAvatar(customer) {
  console.log('start updateAvatar')
  console.log(customer);
  let instance = await Instance.findByBuyerPhone(customer.buyer_phone);
  console.log("instance", instance)
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

  let res = null;
  try {
    res = await axios({
      url: `${process.env.GREEN_API_URL}/waInstance${instance.instance_id}/getAvatar/${instance.api_token}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        chatId: customer.phone,
      },
    })

    console.log("res.status", res.status);
    console.log("res.data", res.data);
  } catch (err) {
    console.log("err", err);
    console.log("err.response", err.response)
    console.log("err.response.data", err.response.data)
  }

  if(res.status === 200 && res.data.available === true) {
    await Customer.update(customer.id, {
      avatar: res.data.urlAvatar,
    });
  };

  console.log('end updateAvatar')
  return;
};
