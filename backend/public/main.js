const socket = io("http://localhost:4000");

const clientsTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

const messageTone = new Audio("/snooze1.mp3")
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("clients-total", (data) => {
  clientsTotal.innerText = `Total Client Count: ${data}`;
});

function sendMessage() {
  if (!messageInput.value) return;
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };

  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = "";
}

socket.on("message", (data) => {
  messageTone.play()
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
  clearFeedback()
  const element = `
       <li class="${isOwnMessage ? "message-right" : "message-left"}">
          <p class="message">
          ${data.message}
            <span>${data.name} ${moment(data.dateTime).fromNow()}</span>
          </p>
        </li>
    `;

  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", (e) => {
  socket.emit("publicFeedback", {
    feedback: `${nameInput.value} is typing`,
  });
});

messageInput.addEventListener("keypress", (e) => {

  socket.emit("publicFeedback", {
    feedback: `${nameInput.value} is typing`,
  });
});

messageInput.addEventListener("blur", (e) => {
  socket.emit("publicFeedback", {
    feedback: ``,
  });
});

socket.on("feedBack", (data) => {
  clearFeedback()
  const feedback = `
  
        <li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
  `;
  messageContainer.innerHTML += feedback
});

function clearFeedback(){
  document.querySelectorAll("li.message-feedback").forEach(element => {
    element.parentNode.removeChild(element);
  })
}