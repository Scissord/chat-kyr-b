import * as Column from "../models/column.js";
import * as Card from "../models/card.js";
import * as CardItem from "../models/card_item.js";
import * as Customer from "../models/customer.js";
import redisClient from "../services/redis/redis.js";

export const getCard = async (req, res) => {
  try {
    const { card_id } = req.params;
    const card = await Card.find(card_id);

    res.status(200).send(card);
  } catch (err) {
    console.log("Error in getCard boardController", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const createCard = async (req, res) => {
  try {
    const column_id = req.params.column_id;
    const { price, source_id, client_id, products } = req.body;

    const card = await Card.create({
      price,
      source_id,
      client_id,
      column_id,
      creator_id: req.user.id
    });

    const column = await Column.find(column_id);
    const cards_ids = Array.isArray(column.cards_ids) ? [...column.cards_ids, card.id] : [card.id];
    await Column.update(column.id, { cards_ids });

    for(const id of products) {
      await CardItem.create({
        card_id: card.id,
        product_id: id
      });
    };

    res.status(200).send({ message: "ok" });
  } catch (err) {
    console.log("Error in createCard boardController", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const card_id = req.params.card_id;

    await Customer.update(card_id, {
      deleted_manager: req.user.id
    });

    // const status = req.user.role.status;
    // const cachedBoard = await redisClient.get(`board_${status}`);

    // if (cachedBoard) {
    //   const boardData = JSON.parse(cachedBoard);
    //   delete boardData.cards[card_id];
    //   await redisClient.setEx(`board_${status}`, 3600, JSON.stringify(boardData));
    // };

    res.status(200).send({ message: "ok" });
  } catch (err) {
    console.log("Error in deleteCard boardController", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const moveCard = async (req, res) => {
  try {
    const { card_id } = req.params;
    const { manager_id } = req.body;

    await Customer.update(card_id, {
      manager_id
    })

    res.status(200).send({ message: "Card moved successfully" });
  } catch (err) {
    console.log("Error in moveCard boardController", err.message);
    res.status(400).send({ error: "Invalid request payload" });
  }
};

export const toggleFixCard = async (req, res) => {
  const { card_id } = req.params;

  try {
    const card = await Customer.find(card_id);

    await Customer.update(card_id, {
      isfixed: !card.isfixed
    })

    res.status(200).send({ message: "Card moved successfully" });
  } catch (err) {
    console.log("Error in toggleFixCard boardController", err.message);
    res.status(400).send({ error: "Invalid request payload" });
  }
};
