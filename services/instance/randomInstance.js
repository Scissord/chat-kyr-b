import * as Instance from "../../models/instance.js";

export default async function randomInstance() {
  const instances = await Instance.get();
  const randomIndex = Math.floor(Math.random() * instances.length);
  const randomBuyerPhone = instances[randomIndex].buyer_phone;
  const randomInstanceId = instances[randomIndex].instance_id;
  const randomApiToken = instances[randomIndex].api_token;

  return {
    randomBuyerPhone,
    randomInstanceId,
    randomApiToken
  }
};
