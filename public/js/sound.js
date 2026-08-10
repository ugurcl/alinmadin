const sound = {
  on: localStorage.getItem("redin_sound") === "1",
  ctx: null,
};

function ctx() {
  if (!sound.ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    sound.ctx = new AC();
  }
  if (sound.ctx.state === "suspended") sound.ctx.resume();
  return sound.ctx;
}

function thud() {
  const ac = ctx();
  if (!ac) return;
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(48, now + 0.16);
  gain.gain.setValueAtTime(0.6, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.3);

  const noise = ac.createBufferSource();
  const buffer = ac.createBuffer(1, ac.sampleRate * 0.09, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  noise.buffer = buffer;
  const noiseGain = ac.createGain();
  noiseGain.gain.setValueAtTime(0.22, now);
  noise.connect(noiseGain).connect(ac.destination);
  noise.start(now);
}

function ding() {
  const ac = ctx();
  if (!ac) return;
  const now = ac.currentTime;
  [880, 1320].forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + i * 0.07);
    gain.gain.linearRampToValueAtTime(0.16, now + i * 0.07 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.5);
    osc.connect(gain).connect(ac.destination);
    osc.start(now + i * 0.07);
    osc.stop(now + i * 0.07 + 0.55);
  });
}

const SOUNDS = { thud, ding };

function play(name) {
  if (!sound.on) return;
  try {
    SOUNDS[name]?.();
  } catch {}
}

const soundBtn = document.getElementById("btn-sound");

function paintSoundBtn() {
  soundBtn.classList.toggle("sound-on", sound.on);
  soundBtn.setAttribute("aria-pressed", String(sound.on));
  soundBtn.title = sound.on ? "Sesi kapat" : "Sesi aç";
}

soundBtn.addEventListener("click", () => {
  sound.on = !sound.on;
  localStorage.setItem("redin_sound", sound.on ? "1" : "0");
  paintSoundBtn();
  if (sound.on) play("ding");
});

paintSoundBtn();
