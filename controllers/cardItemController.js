import * as CardItem from "../models/card_item.js";

export const updateCardItem = async (req, res) => {
  try {
    const { card_item_id } = req.params;
    await CardItem.update(card_item_id, req.body);
    res.status(201).send({ message: `Successfully updated, product_id = ${card_item_id}` });
  }  catch (err) {
    console.log("Error in update product controller", err.message);
    res.status(400).send({ error: "Invalid request payload" });
  }
};
