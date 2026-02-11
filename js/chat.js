document.addEventListener("DOMContentLoaded", function () {

  const bubble = document.getElementById("chat-bubble");
  const windowBox = document.getElementById("chat-window");
  const sendBtn = document.getElementById("chat-send");
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");

messages.innerHTML = `<p><strong>AI:</strong> Hi 👋 I’m Harish’s AI assistant. How can I help you today?</p>`;

  // Toggle chat window
  bubble.addEventListener("click", function () {
    if (windowBox.style.display === "flex") {
      windowBox.style.display = "none";
    } else {
      windowBox.style.display = "flex";
    }
  });

  // Send message
  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    messages.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
    input.value = "";

    try {
      const response = await fetch("https://hbisht-chat-backend.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message })
      });

      const data = await response.json();
      const reply = data.choices[0].message.content;

      messages.innerHTML += `<p><strong>AI:</strong> ${reply}</p>`;
      messages.scrollTop = messages.scrollHeight;

    } catch (error) {
      messages.innerHTML += `<p><strong>AI:</strong> Error connecting to server.</p>`;
    }
  }

  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

});
