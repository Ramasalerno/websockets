const socket = io.connect();

const fetchProducts = async (products) => {
  try {
    const res = await fetch(`https://onyx-storm-germanium.glitch.me/history.hbs`);
    const data = await res.text();
    const template = Handlebars.compile(data);
    const pLength = products.length > 0;
    const html = template({products, pLength});
    return html;
  } catch (error) {
    console.error(error);
  }
}

// MODAL EVENTS
modalBtn.addEventListener(`click`, () => {
  let userActual = JSON.parse(localStorage.getItem(`user`));
  // join-chat -- envía el nombre de quien ingresó a la página.
  socket.emit(`join-chat`, userActual);
})

// PRODUCTS EVENTS
formProducts.addEventListener(`submit`, () => {
  if(nameProduct.value !== `` && priceProduct.value !== `` && imageProduct.value !==``) {
    let name = userName.value;
    // form-products -- envía los datos del producto ingresados desd el formulario.
    socket.emit(`form-products`, {
      nameProduct: nameProduct.value,
      priceProduct: priceProduct.value,
      imageProduct: imageProduct.value,
      name
    });
  }
})

// CHAT EVENTS
inputChat.addEventListener(`keyup`, () => {
  if(inputChat.value.length !== 0) renderOnOff = true;
  else renderOnOff = false;
  let name = userName.value;
  // read-writing -- envía una señal de que alguien está o no escribiendo algo.
  socket.emit(`read-writing`, { name, renderOnOff });
});
submitChat.addEventListener(`click`, () => {
  if(inputChat.value.length > 0) {
    let msg = inputChat.value;
    let name = userName.value;
    // new-message -- envía el mensaje ingresado por el input.
    socket.emit(`new-message`, { msg, name });
    inputChat.value = ``;
    renderOnOff = false;
    // read-writing -- envía una señal de que alguien está o no escribiendo algo.
    socket.emit(`read-writing`, { name, renderOnOff });
  }
  setTimeout(() => {
    windowChat.scrollTop = windowChat.scrollHeight;
  }, 50);
});
changeName.addEventListener(`click`, () => {
  renderOnOff = false;
  let name = userName.value;
  // read-writing -- envía una señal de que alguien está o no escribiendo algo.
  socket.emit(`read-writing`, { name, renderOnOff });
  let userActual = JSON.parse(localStorage.getItem(`user`));
  if(name.length >= 3 && name !== userActual) {
    localStorage.setItem(`user`, JSON.stringify(name));
    // join-chat -- envía el nuevo nombre.
    socket.emit(`join-chat`, name);
  } 
})

socket.on(`get-products`, async (products) => {
  const renderProducts = await fetchProducts(products);
  historyProducts.innerHTML = renderProducts;
});

socket.on(`send-product`, (data) => {
  let userActual = JSON.parse(localStorage.getItem(`user`));
  renderNewProduct(userActual, data);
});

socket.on(`get-messages`, data => {
  let userActual = JSON.parse(localStorage.getItem(`user`));
  eachRenderMessage(userActual, data);
});

socket.on(`chat-message`, data => {
  let userActual = JSON.parse(localStorage.getItem(`user`));
  renderMessage(userActual, data)
});

socket.on(`show-writing`, (data, renderOnOff) => {
  renderWriting(data, renderOnOff);
})
