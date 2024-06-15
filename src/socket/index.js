const { User, Profile, Chat } = require("../../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const connectedUser = {};

const socketIo = (io) => {
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      next();
    } else {
      next(new Error("Not Authorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("client connect:", socket.id);

    const token = socket.handshake.auth.token;
    const tokenKey = process.env.SECRET_KEY;
    const { id: userId } = jwt.verify(token, tokenKey);

    connectedUser[userId] = socket.id;

    socket.on("load admin contact", async () => {
      try {
        const data = await User.findAll({
          include: {
            model: Profile,
            as: "profile",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
          where: { status: "admin" },
        });

        socket.emit("admin contact", data);
      } catch (error) {
        console.log("Error loading admin contacts:", error.message);
        socket.emit("admin contact error", { message: error.message });
      }
    });

    socket.on("load customer contact", async () => {
      try {
        const data = await User.findAll({
          include: [
            {
              model: Profile,
              as: "profile",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            {
              model: Chat,
              as: "recipientMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
              },
            },
            {
              model: Chat,
              as: "senderMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
              },
            },
          ],
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
          where: { status: "customer" },
        });

        socket.emit("customer contact", data);
      } catch (error) {
        console.log("Error loading customer contacts:", error.message);
        socket.emit("customer contact error", { message: error.message });
      }
    });

    socket.on("load messages", async (payload) => {
      try {
        const idRecipient = payload;
        const idSender = userId;

        let data = await Chat.findAll({
          where: {
            idRecipient: { [Op.or]: [idRecipient, idSender] },
            idSender: { [Op.or]: [idRecipient, idSender] },
          },
          include: [
            {
              model: User,
              as: "recipient",
              attributes: { exclude: ["createdAt", "updatedAt", "password"] },
            },
            {
              model: User,
              as: "sender",
              attributes: { exclude: ["createdAt", "updatedAt", "password"] },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
          },
          order: [["createdAt", "ASC"]],
        });

        data = JSON.parse(JSON.stringify(data));

        socket.emit("messages", data);
      } catch (error) {
        console.log("Error loading messages:", error.message);
        socket.emit("messages error", { message: error.message });
      }
    });

    socket.on("send message", async (payload) => {
      try {
        const { idRecipient, message } = payload;
        const idSender = userId;

        const data = { idSender, idRecipient, message };

        await Chat.create(data);

        io.to(socket.id).to(connectedUser[idRecipient]).emit("new message");
      } catch (error) {
        console.log("Error sending message:", error.message);
        socket.emit("send message error", { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("client disconnect:", socket.id);
      delete connectedUser[userId];
    });
  });
};

module.exports = socketIo;
