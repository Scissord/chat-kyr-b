import * as Column from "../models/column.js";
import * as Customer from "../models/customer.js";
import findProduct from "../helpers/findProduct.js";
import formatDate from "../helpers/formatDate.js";

export const getColumns = async (req, res) => {
  try {
    const role = req.user.role.id;
    const status = req.user.role.status;

    let columns = null;

    if(+role === 3) {
      columns = await Column.getForManager(3, req.user.id);
    } else if (+role === 4) {
      columns = await Column.getForManager(6, req.user.id);
    } else if (+role === 9) {
      columns = await Column.getForManager(72, req.user.id);
    } else {
      columns = await Column.get(status);
    }

    res.status(200).send(columns);
  } catch (err) {
    console.log("Error in getColumns boardController", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  };
};

export const getCards = async (req, res) => {
  try {
    const status = req.user.role.status;
    const columns = await Column.get(status);

    const cards = [];

    for(const column of columns) {
      const { cardsFromDb, total } = await Customer.getForColumn(column.manager_id, 1);

      cardsFromDb.forEach((card, index) => {
        cardsFromDb[index] = {
          id: card.id,
          name: card.name || "",
          avatar: card.avatar || "",
          good: card.good || "",
          order_id: card.order_id || "",
          manager_id: card.manager_id || "",
          text: card.last_message_text || "",
          path: findProduct(+card.good),
          time: card.last_message_date ? formatDate(card.last_message_date) : "",
          manager_name: card.manager_name || "",
          counter: Number(card.counter),
          last_message_text: card.last_message_text || "",
          last_message_date: card.last_message_date || new Date,
          status: Number(card.status),
          isfixed: card.isfixed || false,
        };
      });

      cards.push({
        manager_id: column.manager_id,
        cards: cardsFromDb,
        total
      })
    }

    res.status(200).send(cards);
  } catch (err) {
    console.log("Error in getCards boardController", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getMoreCards = async (req, res) => {
  try {
    const { managerId, page } = req.body;
    const { cardsFromDb, total } = await Customer.getForColumn(managerId, page);

    cardsFromDb.forEach((card, index) => {
      cardsFromDb[index] = {
        id: card.id,
        name: card.name || "",
        avatar: card.avatar || "",
        good: card.good || "",
        order_id: card.order_id || "",
        manager_id: card.manager_id || "",
        text: card.last_message_text || "",
        path: findProduct(+card.good),
        time: card.last_message_date ? formatDate(card.last_message_date) : "",
        manager_name: card.manager_name || "",
        counter: Number(card.counter),
        last_message_text: card.last_message_text || "",
        last_message_date: card.last_message_date || new Date,
        status: Number(card.status),
        isfixed: card.isfixed || false,
      };
    });

    res.status(200).send(cardsFromDb);
  } catch (err) {
    console.log("Error in getMoreCards boardController", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getCustomerInfo = async (req, res) => {
  try {
    const { customer_id } = req.body;
    const card = await Customer.getCustomerForColumn(customer_id);

    card.id = card.id;
    card.name = card.name || "";
    card.avatar = card.avatar || "";
    card.good = card.good || "";
    card.order_id = card.order_id || "";
    card.manager_id = card.manager_id || "";
    card.text = card.last_message_text || "";
    card.path = findProduct(+card.good);
    card.time = card.last_message_date ? formatDate(card.last_message_date) : "";
    card.manager_name = card.manager_name || "";
    card.counter = Number(card.counter);
    card.last_message_text = card.last_message_text || "";
    card.last_message_date = card.last_message_date || new Date;
    card.status = Number(card.status);
    card.isfixed = card.isfixed || false;

    res.status(200).send(card);
  } catch (err) {
    console.log("Error in getCustomerInfo boardController", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const cacheBoard = async (req, res) => {
  try {
    console.log(req.body)
    res.status(200).send(boardData);
  } catch (err) {
    console.log("Error in cache boardController", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  };
};
