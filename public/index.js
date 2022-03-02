// ASK FOR MODAL
const modal = document.querySelector(`.aside`);
const modalContainer = document.querySelector(`.aside__container`);
const modalForm = document.querySelector(`#asideForm`);
const modalInput = document.querySelector(`#asideInput`);
const modalBtn = document.querySelector(`#asideButton`);

// ASK FOR PRODUCTS
const formProducts = document.querySelector(`#formProducts`);
const historyProducts = document.querySelector(`#historyProducts`);
const nameProduct = document.querySelector(`#nameProduct`);
const priceProduct = document.querySelector(`#priceProduct`);
const imageProduct = document.querySelector(`#imageProduct`);
const errorMsgProduct = document.querySelector(`#errorMessageProduct`);

// ASK FOR CHAT
const windowChat = document.querySelector(`.chat__container`);
const userName = document.querySelector(`#userName`);
const changeName = document.querySelector(`#changeUserName`);
const submitChat = document.querySelector(`#messageButton`);
const inputChat = document.querySelector(`#messageInput`);
const messageBox = [submitChat, inputChat];

// GENERAL FUNCTIONS
const formatKeyCode = (value, input, btn) => {
  if(value.keyCode !== 8) {
    if(input.value.length == 6) {
      value.preventDefault();
    }
    if(value.keyCode === 32) {
      value.preventDefault();
    }
    if(input.value.length >= 3 && value.keyCode === 13) {
      btn.click();
    }
  }
}
const readInput = (input) => {
  if(input.value === ``) {
    input.classList.add(`error__input`);
  } else {
    input.classList.remove(`error__input`);
  }
}

// FUNCTIONS TO RENDER
const renderMessage = (socketId, data) => {
  const div = document.createElement(`div`);
  let html;
  if (data.id) {
    div.classList.add(`userMessage`);
    if (socketId === data.id) {
      div.classList.add(`myUser`);
    } else {
      div.classList.add(`anotherUser`);
    }
    html = `
      <p><span class="bot__user">${data.username}</span> <span class="bot__time">${data.time}</span></p>
      <p>${data.text}</p>
    `;
  } else {
    div.classList.add(`bot`);
    html = `<p>${data.text} <span class="bot__user">${data.username}</span></p>`;
  }
  div.innerHTML = html;
  document.getElementById(`renderMessages`).appendChild(div);
};
const eachRenderMessage = (socketId, data) => {
  if(data.length > 0) {
    const nameFound = data.find(user => user.username === socketId);
    if(nameFound !== undefined) {
      data.map(ee => {
        renderMessage(nameFound.id, ee);
      });
    }
  }
};
const renderNewProduct = (socketId, data) => {
  const div = document.createElement(`div`);
  let html;
  if (data.id) {
    if (socketId === data.id) {
      html = `
        <p>${data.text}</p>
      `;
    } else {
      html = `
        <p><span class="bot__user">${data.username}</span> ${data.text}</p>
      `;
    }
  }
  div.classList.add(`bot`);
  div.innerHTML = html;
  document.getElementById(`renderMessages`).appendChild(div);
};
const renderWriting = (data, renderOnOff) => {
  let html;
  if(renderOnOff) {
    html= `
      <div class="bot">
        <p><span class="bot__user">${data.username}</span> ${data.text} <span class="bot__writing"></span></p>
      </div>
    `;
  } else {
    html = ``;
  }
  document.getElementById(`renderNotification`).innerHTML = html;
};

// GENERAL VARIABLES 
let renderOnOff;

// EVENTOS GENERALES
window.addEventListener(`unload`, () => {
  localStorage.clear();
});
window.addEventListener(`click`, (e) => {
  if(e.target.classList.contains(`aside__blur`)) {
    modalContainer.classList.add(`notClose`);
    setTimeout(() => {
      modalContainer.classList.remove(`notClose`);
    }, 1000);
  }
});

// MODAL EVENTS
modalInput.addEventListener(`keydown`, (e) => {
  formatKeyCode(e, modalInput, modalBtn);
});
modalInput.addEventListener(`keyup`, () => {
  if(modalInput.value.length < 3) {
    modalBtn.classList.add(`disabled`);
    modalBtn.setAttribute(`disabled`, `true`);
  } else {
    modalBtn.classList.remove(`disabled`);
    modalBtn.removeAttribute(`disabled`);
  }
});
modalBtn.addEventListener(`click`, () => {
  if(modalInput.value.length >= 3) {
    modal.classList.add(`close`);
    userName.value = modalInput.value;
    localStorage.setItem(`user`, JSON.stringify(userName.value));
    setTimeout(() => {
      modal.innerHTML = ``;
      modal.style.display = `none`;
    }, 1000);
  } else {
    modalBtn.classList.add(`disabled`);
    modalBtn.setAttribute(`disabled`, `true`);
  }
});

// PRODUCTS EVENTS
formProducts.addEventListener(`submit`, (e) => {
  e.preventDefault();
  if(nameProduct.value === `` || priceProduct.value === `` || imageProduct.value === ``) {
    errorMsgProduct.classList.add(`error__message`);
    readInput(nameProduct);
    readInput(priceProduct);
    readInput(imageProduct);
  } else {
    errorMsgProduct.classList.remove(`error__message`);
    nameProduct.classList.remove(`error__input`);
    priceProduct.classList.remove(`error__input`);
    imageProduct.classList.remove(`error__input`);
  }
})

// CHAT EVENTS
userName.addEventListener(`keydown`, (e) => {
  formatKeyCode(e, userName, changeName);
});
userName.addEventListener(`keyup`, () => {
  if(userName.value.length < 3) {
    changeName.classList.add(`disabled`);
    changeName.setAttribute(`disabled`, `true`);
  } else {
    changeName.classList.remove(`disabled`);
    changeName.removeAttribute(`disabled`);
  }
});
inputChat.addEventListener(`keydown`, (e) => {
  if(e.keyCode === 13) submitChat.click();
});
changeName.addEventListener(`click`, () => {
  inputChat.value = ``;
  let userActual = JSON.parse(localStorage.getItem(`user`));
  if(userName.value.length >= 3) {
    changeName.classList.toggle(`chat__btn--change`);
    changeName.classList.toggle(`chat__btn--save`);
    messageBox.forEach(e => e.classList.toggle(`disabled`));
    messageBox.forEach(e => e.toggleAttribute(`disabled`));
    userName.classList.toggle(`disabled`);
    userName.toggleAttribute(`disabled`);
    if(userName.value !== userActual) document.getElementById(`renderMessages`).innerHTML = ``;
  } else {
    changeName.classList.add(`disabled`);
    changeName.setAttribute(`disabled`, `true`);
  }
});