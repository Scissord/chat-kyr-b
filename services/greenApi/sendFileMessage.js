import axios from 'axios';
import * as Message from '../../models/message.js';
import * as Attachment from '../../models/attachment.js';
import * as Instance from '../../models/instance.js';
import * as User from '../../models/user.js';

export default async function sendFileMessage(user_id, customer, file, customer_id) {
  const instance = await Instance.findByBuyerPhone(customer.buyer_phone);
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

  return obj;
};
