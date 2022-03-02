const express = require(`express`);
const http = require(`http`);
const socketIo = require(`socket.io`);
const path = require(`path`);
const products = require(`./models/productsApi`);
const { formatMessage } = require(`./utils/utils`);

const PORT = process.env.PORT || 8080;

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, `./public`)));

// Listen
const connectedServer = httpServer.listen(PORT, () => console.log(`Server is up and running on port: ${PORT}`));
connectedServer.on(`error`, (error) => console.error(error.message));

const messages = [];

io.on(`connection`, (socket) => {
  socket.on(`form-products`, ({ nameProduct, priceProduct, imageProduct, name }) => {
    products.save(nameProduct, priceProduct, imageProduct);
    // send-product -- envía un mensaje a quien subió el producto.
    socket.emit(`send-product`, formatMessage(name, name, `Agregaste un nuevo producto.`));
    // send-product -- envía un mensaje a todos menos a quien subió el producto.
    socket.broadcast.emit(`send-product`, formatMessage(name, name, `agregó un nuevo proucto.`));
    // get-products -- envía los productos a todos.
    io.emit(`get-products`, products.getAll());
  })

  // get-products -- envía los productos existentes a quien ingrese a la página.
  socket.emit(`get-products`, products.getAll());

  socket.on(`join-chat`, (name) => {
    // get-messages -- envía todos los mensajes a quien ingrese a la página.
    socket.emit(`get-messages`, [...messages]);
    // chat-message -- envía un mensaje a quien ingrese a la página.
    socket.emit(`chat-message`, formatMessage(null, name, `Bienvenido`));
    // chat-message -- envía un mensaje a todos menos a quien ingresó a la página.
    socket.broadcast.emit(`chat-message`, formatMessage(null, name, `se unió al chat`));
  });

  socket.on(`read-writing`, ({ name, renderOnOff }) => {
    // show-writing -- envía un mensaje a todos menos a quien está escribiendo.
    socket.broadcast.emit(`show-writing`, formatMessage(null, name, `está`), renderOnOff);
  });

  socket.on(`new-message`, ({ msg, name }) => {
    const newMessage = formatMessage(name, name, msg);
    messages.push(newMessage);
    // chat-message -- envía un mensaje a todos.
    io.emit(`chat-message`, newMessage);
  })
});