let userName = '';

{
  const elementId = {
    loginForm: 'welcome-form',
    messagesSection: 'messages-section',
    messagesList: 'messages-list',
    addMessageForm: 'add-messages-form',
    userNameInput: 'username',
    messageContentInput: 'message-content',
  };

  const classes = {
    active: 'show',
    message: 'message',
    messageReceived: 'message--received',
    messageSelf: 'message--self',
    messageAuthor: 'message__author',
    messageContent: 'message__content',
  };

  const alerts = {
    userNameField: 'Please insert user name!',
    messageField: 'Message field cannot be empty!'
  };

  const botMessages = {
    userIn: ` has joined the conversation!`,
    userOut: ` has left the conversation!`,
  };

  const loginForm = document.getElementById(elementId.loginForm);
  const messagesSection = document.getElementById(elementId.messagesSection);
  const messagesList = document.getElementById(elementId.messagesList);
  const addMessageForm = document.getElementById(elementId.addMessageForm);
  const userNameInput = document.getElementById(elementId.userNameInput);
  const messageContentInput = document.getElementById(elementId.messageContentInput);

  // eslint-disable-next-line no-undef
  const socket = io();

  socket.on('message', ({ author, content }) => addMessage(author, content));
  socket.on('user', user => addMessage('Chat bot', user + botMessages.userIn));
  socket.on('user-left', user => addMessage('Chat bot', user + botMessages.userOut));

  const login = event => {
    event.preventDefault();

    if(userNameInput.value === ''){
      window.alert(alerts.messageField);
    } else {
      userName = userNameInput.value;
      addMessage(userName, botMessages.userIn);
      socket.emit('user', userNameInput.value);
      loginForm.classList.toggle(classes.active);
      messagesSection.classList.toggle(classes.active);
    }
  };

  const sendMessage = event => {
    event.preventDefault();

    let messageContent = messageContentInput.value;

    if(messageContentInput.value === ''){
      window.alert(alerts.messageField);
    } else {
      addMessage(userName, messageContentInput.value);
      socket.emit('message', { author: userName, content: messageContent });
      messageContentInput.value = '';
    }
  };

  const addMessage = (author, content) => {
    const message = document.createElement('li');

    message.classList.add(classes.message, classes.messageReceived);
    author === userNameInput && message.classList.add(classes.messageSelf);
    message.insertAdjacentHTML('afterbegin',
      `<h3 class="${classes.messageAuthor}">
        ${author === userName ? 'You' : author}
      </h3>`);
    message.insertAdjacentHTML('beforeend',
      `<div class="${classes.messageContent}">
        ${content}
      </div>`);
    messagesList.insertAdjacentElement('beforeend', message);
  };

  loginForm.addEventListener('submit', login);
  addMessageForm.addEventListener('submit', sendMessage);
}