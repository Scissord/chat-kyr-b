import * as User from '../models/user.js';
import * as Customer from '../models/customer.js';

export const get = async (req, res) => {
	try {
    const role = req.user.role;
    const { customer_id } = req.body;

    let users = [];

    // ПД
    if(+role.id === 3 || +role.id === 5) {
      const newUsers = await User.getForChats(3, 5);
      users = [
        { id: 'disabled', name: 'Выберите ответственного' },
        ...newUsers.map(u => ({
          id: u.id,
          name: u.name
        }))
      ];
    };

    // КД
    if(+role.id === 4 || +role.id === 6) {
      const newUsers = await User.getForChats(4, 6);
      users = [
        { id: 'disabled', name: 'Выберите ответственного' },
        ...newUsers.map(u => ({
          id: u.id,
          name: u.name
        }))
      ];
    };

    // АДМИН
    if(+role.id === 7) {
      const newUsers = await User.get();
      users = [
        { id: 'disabled', name: 'Ответственный' },
        ...newUsers.map(u => ({
          id: u.id,
          name: u.name
        }))
      ];
    };

    // ВЛ
    if(+role.id === 9 || +role.id === 10) {
      const newUsers = await User.getForChats(9, 10);
      users = [
        { id: 'disabled', name: 'Выберите ответственного' },
        ...newUsers.map(u => ({
          id: u.id,
          name: u.name
        }))
      ];
    };

    const customer = await Customer.find(customer_id)
    let chats = [];
    if(customer) {
      chats = await Customer.getConnections(customer.phone);
    };

		res.status(200).send({
      message: 'ok',
      users,
      chats
    });
	}	catch (err) {
		console.log("Error in get message controller", err.message);
		res.status(500).send({ error: "Internal Server Error" });
	}
};
