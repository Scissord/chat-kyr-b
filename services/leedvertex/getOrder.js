import axios from 'axios';
import * as Customer from '../../models/customer.js';
import sendTextMessage from '../greenApi/sendTextMessage.js';
import updateAvatar from '../greenApi/updateAvatar.js';
import redisClient from '../redis/redis.js';
import randomInstance from '../instance/randomInstance.js';

export default async function getOrder(order_id, text, user_id, status, phone) {
  let customer = await Customer.findWhere({ order_id: order_id });

  if(+status === 100) {
    status = 0;
  };

  if(!customer) {
    const res = await axios({
      method: 'GET',
      url: `https://callcenter-kyrgyzstan.leadvertex.ru/api/admin/getOrdersByIds.html?token=${process.env.LEADVERTEX_API_KEY}&ids=${order_id}`,
    })

    if(res.status === 200) {
      const order = res.data[order_id];

      const goodKeys = Object.keys(order.goods);
      const firstGoodKey = goodKeys[0];

      const { randomBuyerPhone, randomInstanceId, randomApiToken } = await randomInstance();

      customer = await Customer.create({
        name: order.fio,
        buyer_phone: randomBuyerPhone,
        good: firstGoodKey,
        ai_active: false,
        manager_id: user_id,
        phone: order.phone + '@c.us',
        status,
        order_id
      });
    };
  }

  if(phone !== "") {
    customer = await Customer.update(customer.id, {
      phone,
    })
  };

  const message = await sendTextMessage(user_id, customer, text, customer.id, status);
  await updateAvatar(customer);

  console.log('here1');

  let messages = await redisClient.get(customer.id);

  console.log('here2');

  messages = messages ? JSON.parse(messages) : [];

  console.log('here3');

  messages.push(message);

  console.log('here4');

  await redisClient.setEx(customer.id, 3600, JSON.stringify(messages));

  console.log('here5');

  return customer
};
