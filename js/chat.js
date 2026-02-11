/* =====================================================
   CHAT APPLICATION SCRIPT
   Author: Harish AI Assistant
   Description: Controls chat popup, messaging, API call,
   markdown rendering and typing animation
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* =====================================================
     1️⃣ DOM ELEMENT REFERENCES
     ===================================================== */

  const bubble = document.getElementById("chat-bubble");
  const windowBox = document.getElementById("chat-window");
  const sendBtn = document.getElementById("chat-send");
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");

  /* =====================================================
     2️⃣ SAFETY CHECK – ENSURE ELEMENTS EXIST
     ===================================================== */

  if (!bubble || !windowBox || !sendBtn || !input || !messages) {
    console.error("Chat elements missing in HTML.");
    return;
  }

  /* =====================================================
     3️⃣ INITIAL GREETING MESSAGE
     ===================================================== */

  messages.innerHTML = `
  <div class="message-wrapper ai">
    <div class="label">AI</div>
    <div class="ai-message">
      Hi 👋 I’m Harish’s AI assistant. How can I help you today?
    </div>
     </div>
  `;

  /* =====================================================
     4️⃣ CHAT WINDOW TOGGLE (OPEN / CLOSE)
     ===================================================== */

  bubble.addEventListener("click", function () {
    if (windowBox.style.display === "flex") {
      windowBox.style.display = "none";
    } else {
      windowBox.style.display = "flex";
      input.focus();
    }
  });

  /* =====================================================
     5️⃣ SEND MESSAGE FUNCTION
     ===================================================== */

  async function sendMessage() {

    /* ------------------------------
       5.1 Capture User Input
    ------------------------------ */

    const message = input.value.trim();
    if (!message) return;

    messages.innerHTML += `
  <div class="message-wrapper user">
    <div class="label">You</div>
    <div class="user-message">${message}</div>
  </div>
    `;

    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    /* ------------------------------
       5.2 Typing Indicator (Dots)
    ------------------------------ */

    const typingIndicator = document.createElement("div");
    typingIndicator.className = "message-wrapper ai";
    typingIndicator.innerHTML = `
  <div class="label">AI</div>
  <div class="typing-indicator">
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </div>
    `;
    messages.appendChild(typingIndicator);
    messages.scrollTop = messages.scrollHeight;

    /* ------------------------------
       5.3 API Call to Backend
    ------------------------------ */

    try {
      const response = await fetch("https://hbisht-chat-backend.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message })
      });

      const data = await response.json();
      let reply = data.choices[0].message.content;

      /* ------------------------------
         5.4 Clean & Format Response
      ------------------------------ */

      // Remove citation markers like [1][2]
      reply = reply.replace(/\[\d+\]/g, "");

      // Convert Markdown to HTML
      const formattedReply = marked.parse(reply);

      /* ------------------------------
         5.5 Remove Typing Indicator
      ------------------------------ */

      typingIndicator.remove();

      /* ------------------------------
         5.6 Display AI Response
      ------------------------------ */

      messages.innerHTML += `
  <div class="message-wrapper ai">
    <div class="label">AI</div>
    <div class="ai-message">${formattedReply}</div>
  </div>
      `;

      messages.scrollTop = messages.scrollHeight;

    } catch (error) {

      /* ------------------------------
         5.7 Error Handling
      ------------------------------ */

      typingIndicator.remove();

      messages.innerHTML += `
        <div class="ai-message">
          Error connecting to server.
        </div>
      `;
    }
  }

  /* =====================================================
     6️⃣ EVENT LISTENERS
     ===================================================== */

  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

});
