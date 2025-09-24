const chatArea = document.getElementById("chatArea");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// ============================
// Helper: Add message to chat
// ============================
function addMessage(content, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = content;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// ============================
// Typing indicator
// ============================
function addTypingIndicator() {
  const indicator = document.createElement("div");
  indicator.classList.add("typing-indicator");
  indicator.id = "typingIndicator";
  indicator.innerHTML = `<span></span><span></span><span></span>`;
  chatArea.appendChild(indicator);
  chatArea.scrollTop = chatArea.scrollHeight;
  return indicator;
}

function removeTypingIndicator(indicator) {
  if (indicator) indicator.remove();
}

// ============================
// Chatbot API call
// ============================
async function sendMessageToChatbot(message, sessionId) {
  try {
    const data = { message: message, session_id: sessionId };
    const response = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error}`);
    }

    const result = await response.json();
    return result.response;
  } catch (error) {
    console.error("Error connecting to chatbot:", error);
    return "Sorry, I'm having trouble connecting right now. Please try again later.";
  }
}

// ============================
// Handle user send
// ============================
async function handleSend() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  const indicator = addTypingIndicator();

  // Use a unique session ID per user (here just a fixed example)
  const sessionId = "user_abc123";

  // Send user input to chatbot API
  const botReply = await sendMessageToChatbot(text, sessionId);

  const delay = Math.min(1500, 500 + botReply.length * 35); // Optional: mimic typing

  setTimeout(() => {
    removeTypingIndicator(indicator);
    addMessage(botReply, "bot");
  }, delay);
}

// ============================
// Welcome message
// ============================
function showWelcomeMessage() {
  setTimeout(() => {
    addMessage(
      "🤖 Welcome to Kisan Mitra! I am your AI farming assistant. Ask me about crops, weather, or pests.",
      "bot"
    );
  }, 600);
}

// ============================
// Events
// ============================
sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSend();
  }
});

// Show welcome message on load
showWelcomeMessage();
