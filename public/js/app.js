const state = {
  name: "",
  position: "",
  history: [],
};

const phases = document.querySelectorAll(".phase");
const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

function showPhase(id) {
  phases.forEach((p) => p.classList.toggle("active", p.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role === "user" ? "user" : "hr"}`;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
  return div;
}

function setBusy(busy) {
  chatInput.disabled = busy;
  chatForm.querySelector("button").disabled = busy;
  if (!busy) chatInput.focus();
}

async function sendToHr() {
  setBusy(true);
  const typing = addMessage("hr", "Buket yazıyor...");
  typing.classList.add("typing");
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: state.history, name: state.name }),
    });
    const data = await res.json();
    typing.remove();
    if (data.error) {
      addMessage("hr", data.error);
      setBusy(false);
      return;
    }
    if (data.type === "rejection") {
      finishInterview(data.text);
      return;
    }
    state.history.push({ role: "model", text: data.text });
    addMessage("hr", data.text);
    setBusy(false);
  } catch {
    typing.remove();
    addMessage("hr", "Bağlantı koptu. Bunu da olumsuz değerlendireceğiz.");
    setBusy(false);
  }
}

function finishInterview(letter) {
  setTimeout(() => {
    document.getElementById("rejection-text").textContent = letter;
    renderCertificate(state.name, state.position, letter);
    showPhase("phase-rejection");
  }, 800);
}

document.getElementById("btn-apply").addEventListener("click", () => {
  showPhase("phase-form");
  document.getElementById("input-name").focus();
});

document.getElementById("apply-form").addEventListener("submit", (e) => {
  e.preventDefault();
  state.name = document.getElementById("input-name").value.trim();
  state.position = document.getElementById("input-position").value.trim();
  const why = document.getElementById("input-why").value.trim();
  state.history = [
    {
      role: "user",
      text: `Başvuru bilgileri — İsim: ${state.name}. Pozisyon: ${state.position}. Neden bizimle çalışmak istiyor: ${why}`,
    },
  ];
  showPhase("phase-interview");
  sendToHr();
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text || chatInput.disabled) return;
  chatInput.value = "";
  state.history.push({ role: "user", text });
  addMessage("user", text);
  sendToHr();
});

document.getElementById("btn-download").addEventListener("click", downloadCertificate);

document.getElementById("btn-tweet").addEventListener("click", () => {
  const text = encodeURIComponent(
    `Vizyoner Global Teknoloji A.Ş. tarafından resmen reddedildim. 🎉 Sen de reddedilmek için: ${location.origin}`
  );
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
});

document.getElementById("btn-retry").addEventListener("click", () => {
  state.history = [];
  chatLog.innerHTML = "";
  document.getElementById("apply-form").reset();
  showPhase("phase-listing");
});
