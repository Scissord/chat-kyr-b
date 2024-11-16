import * as Message from "../models/message.js";
import * as Customer from "../models/customer.js";
import * as Attachment from "../models/attachment.js";
import * as Instance from "../models/instance.js";
import redisClient from '../services/redis/redis.js';
import sendTextMessage from '../services/greenApi/sendTextMessage.js';
import sendFileMessage from '../services/greenApi/sendFileMessage.js';
import replyFile from '../services/greenApi/replyFile.js';
import replyLocation from "../services/greenApi/replyLocation.js";
import getOrder from "../services/leedvertex/getOrder.js";
import formatDate from "../helpers/formatDate.js";
import updateChat from "../services/greenApi/updateChat.js";

export const get = async (req, res) => {
	try {
    const customer_id = req.params.customer_id
    await Message.clear(customer_id);

    const cachedMessages = await redisClient.get(customer_id);
		if (cachedMessages) {

			return res.status(200).send({
        message: 'ok',
        messages: JSON.parse(cachedMessages),
      });
		};

    const messagesFromDm = await Message.getChat(customer_id);
    const messages = messagesFromDm.map((message) => ({
      ...message,
      created_at: formatDate(message.created_at)
    }));

		await redisClient.setEx(customer_id, 3600, JSON.stringify(messages));

		res.status(200).send({
      message: 'ok',
      messages,
    });
	}	catch (err) {
		console.log("Error in get message controller", err.message);
		res.status(500).send({ error: "Internal Server Error" });
	}
};

export const create = async (req, res) => {
  try {
    const { customer_id, message, type } = req.body;

    const customer = await Customer.find(customer_id);
    const file = req.files[0];

    let obj = null;

    if(type === 'textMessage') {
      obj = await sendTextMessage(req.user.id, customer, message, customer_id);
    };

    if(type === 'fileMessage') {
      obj = await sendFileMessage(req.user.id, customer, file, customer_id);
    };

    let messages = await redisClient.get(customer_id);
    messages = messages ? JSON.parse(messages) : [];

    messages.push(obj);

    await redisClient.setEx(customer_id, 3600, JSON.stringify(messages));

		res.status(200).send({ message: obj });
	}	catch (err) {
		console.log("Error in post message controller", err.message);
		res.status(500).send({ error: "Internal Server Error" });
	}
};

export const leadvertexCreate = async (req, res) => {
  try {
    const { leadvertex_id, phone, message } = req.body;

    const customer = await getOrder(leadvertex_id, message, req.user.id, req.user.role.status, phone);

    res.status(200).send({ status: "ok", customer: customer });
	}	catch (err) {
		console.log("Error in leadvertexCreate message controller", err.message);
		res.status(500).send({ error: "Internal Server Error" });
	}
};

export const cache = async (req, res) => {
  try {
    const message = req.body;
    const customer_id = req.body.customer_id.toString();

    let messages = await redisClient.get(customer_id);

    if(messages && messages.length > 0) {
      messages = JSON.parse(messages);
      message.created_at = formatDate(message.created_at)
      messages.push(message);
    } else {
      const messagesFromDm = await Message.getChat(message.customer_id);
      messages = messagesFromDm.map((message) => ({
        ...message,
        created_at: formatDate(message.created_at)
      }));
    };

    await redisClient.setEx(customer_id, 3600, JSON.stringify(messages));

		res.status(200).send({ message: "ok" });
	}	catch (err) {
		console.log("Error in cache message controller", err.message);
		res.status(500).send({ error: "Internal Server Error" });
	}
};

export const clear = async (req, res) => {
  try {
		res.status(200).send({ status: "ok" });
	}	catch (err) {
		console.log("Error in clear message controller", err.message);
		res.status(500).send({ error: "Internal Server Error" });
	}
};

export const reply = async (req, res) => {
  try {
    const { message_id, customer_id } = req.body;

    const customer = await Customer.find(customer_id);
    const message = await Message.find(message_id);
    const attachment = await Attachment.findByMessageId(message_id);

    let obj = null;

    if(!attachment) {
      obj = await sendTextMessage(req.user.id, customer, message.text, customer_id);
    } else {
      if(!attachment.contentType) {
        obj = await replyLocation(req.user.id, customer, attachment, customer_id);
      } else {
        obj = await replyFile(req.user.id, customer, attachment, customer_id);
      }
    };

    let messages = await redisClient.get(customer_id);
    messages = messages ? JSON.parse(messages) : [];

    messages.push(obj);

    await redisClient.setEx(customer_id, 3600, JSON.stringify(messages));

		res.status(200).send({ status: "ok" });
	}	catch (err) {
		console.log("Error in reply message controller", err.message);
		res.status(500).send({ error: "Internal Server Error" });
	}
};

export const sync = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const customer = await Customer.find(customer_id);
    if(!customer) res.status(400).send({ status: "Customer not found" });

    const instance = await Instance.findByBuyerPhone(customer.buyer_phone);
    if(!instance) res.status(400).send({ status: "Instance not found" });

    let messages = [];
    const isUpdated = await updateChat(customer_id, customer.phone, instance);
    if(isUpdated) {
      const messagesFromDm = await Message.getChat(customer_id);
      messages = messagesFromDm.map((message) => ({
        ...message,
        created_at: formatDate(message.created_at)
      }));

      await redisClient.setEx(customer_id, 3600, JSON.stringify(messages));
    }

    res.status(200).send({ status: "ok", messages });
	}	catch (err) {
		console.log("Error in sync message controller", err.message);
		res.status(500).send({ error: "Internal Server Error" });
	}
};
