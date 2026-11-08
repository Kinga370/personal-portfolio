
const GITHUB_USER = "https://github.com/"; 
const EMAIL = "kingga2321@gmail.com";     
const TYPED_ROLES = ["IT Student at JNEC", "Python Developer", "Web & API Developer", "Network Enthusiast"];


const GH = "https://github.com/" + GITHUB_USER;
const skills = [
  ["HTML / CSS", 85], ["JavaScript", 75], ["Python", 85], ["Node.js & Express", 70],
  ["SQL (SQLite / MySQL)", 80], ["Networking (DNS, DHCP, BGP)", 75]
];
const projects = [
  { t: "Cinema Ticket Booking System", d: "Desktop app for browsing movies and booking seats, with a cinema-themed Tkinter interface and a SQLite database.", tech: ["Python", "Tkinter", "SQLite"], repo: "cinema-booking-system" },
  { t: "Task List REST API", d: "REST API for managing tasks with full CRUD, built using the MVC pattern and a MySQL database.", tech: ["Node.js", "Express", "MySQL", "MVC"], repo: "TaskAPIs" },
  { t: "Ground Booking System", d: "College ground booking app with separate admin and user workflows, stored in SQLite.", tech: ["Python", "Tkinter", "SQLite"], repo: "ground-booking-system" }
];
const $ = s => document.querySelector(s);

// Build skills & projects
$("#skillList").innerHTML = skills.map(([n, v]) =>
  `<div class="skill"><div><span>${n}</span><span>${v}%</span></div><div class="bar"><i data-w="${v}"></i></div></div>`).join("");
$("#projectList").innerHTML = projects.map(p =>
  `<div class="card proj"><h4>${p.t}</h4><p>${p.d}</p>
   <div class="tech">${p.tech.map(x => `<span>${x}</span>`).join("")}</div>
   <a href="${GH}/${p.repo}" target="_blank" rel="noopener">View on GitHub →</a></div>`).join("");

// Contact links
$("#mail").textContent = EMAIL; $("#mail").href = "mailto:" + EMAIL;
$("#gh").textContent = GH.replace("https://", ""); $("#gh").href = GH;
$("#year").textContent = new Date().getFullYear();

// Typing effect
let r = 0, c = 0, del = false;
(function type() {
  const w = TYPED_ROLES[r];
  $("#typed").textContent = w.slice(0, c);
  if (!del && c++ === w.length) { del = true; return setTimeout(type, 1400); }
  if (del && --c === 0) { del = false; r = (r + 1) % TYPED_ROLES.length; }
  setTimeout(type, del ? 40 : 90);
})();

// Theme toggle (remembered)
const root = document.documentElement;
function setTheme(t) { root.dataset.theme = t; $("#theme").textContent = t === "dark" ? "🌙" : "☀️"; try { localStorage.setItem("theme", t); } catch (e) {} }
let saved = "dark"; try { saved = localStorage.getItem("theme") || "dark"; } catch (e) {}
setTheme(saved);
$("#theme").onclick = () => setTheme(root.dataset.theme === "dark" ? "light" : "dark");

// Mobile menu
$("#burger").onclick = () => $("#menu").classList.toggle("open");
$("#menu").onclick = () => $("#menu").classList.remove("open");

// Scroll reveal, skill bars, active link, back-to-top
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("show"); e.target.querySelectorAll(".bar i").forEach(b => b.style.width = b.dataset.w + "%"); }
}), { threshold: .15 });
document.querySelectorAll(".reveal").forEach(s => io.observe(s));
addEventListener("scroll", () => {
  $("#top").style.display = scrollY > 400 ? "block" : "none";
  document.querySelectorAll("section[id]").forEach(s => {
    const a = document.querySelector(`nav a[href="#${s.id}"]`);
    if (a) a.classList.toggle("on", scrollY + 120 >= s.offsetTop && scrollY + 120 < s.offsetTop + s.offsetHeight);
  });
});
$("#top").onclick = () => scrollTo({ top: 0, behavior: "smooth" });

// Contact form -> opens email app
$("#form").onsubmit = e => {
  e.preventDefault();
  const body = `${$("#msg").value}\n\nFrom: ${$("#name").value} (${$("#email").value})`;
  location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Portfolio message from " + $("#name").value)}&body=${encodeURIComponent(body)}`;
  $("#note").textContent = "Opening your email app...";
};

// Animated particle background
const cv = $("#bg"), x = cv.getContext("2d"); let P = [];
function size() { cv.width = innerWidth; cv.height = innerHeight; P = Array.from({ length: Math.min(90, innerWidth / 14) }, () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5 })); }
addEventListener("resize", size); size();
(function draw() {
  x.clearRect(0, 0, cv.width, cv.height);
  const col = root.dataset.theme === "dark" ? "34,211,238" : "124,58,237";
  P.forEach((p, i) => {
    p.x = (p.x + p.vx + cv.width) % cv.width; p.y = (p.y + p.vy + cv.height) % cv.height;
    x.fillStyle = `rgba(${col},.7)`; x.beginPath(); x.arc(p.x, p.y, 1.8, 0, 7); x.fill();
    for (let j = i + 1; j < P.length; j++) {
      const d = Math.hypot(p.x - P[j].x, p.y - P[j].y);
      if (d < 120) { x.strokeStyle = `rgba(${col},${.25 * (1 - d / 120)})`; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(P[j].x, P[j].y); x.stroke(); }
    }
  });
  requestAnimationFrame(draw);
})();

/* ===== BACKGROUND MUSIC ===== */
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const musicText = document.getElementById("musicText");

if (bgMusic && musicBtn) {
  bgMusic.volume = 0.5;
  const baseTitle = document.title;

  // Updates the button, the label and the tab title to match the music state
  function updateMusicUI() {
    const on = !bgMusic.paused;
    musicBtn.classList.toggle("playing", on);
    musicText.textContent = on ? "Now playing" : "Music paused";
    document.title = on ? "🎵 " + baseTitle : baseTitle;
  }
  bgMusic.addEventListener("play", updateMusicUI);
  bgMusic.addEventListener("pause", updateMusicUI);

  // Shows the real reason in the console if the file cannot be played
  bgMusic.addEventListener("error", () => {
    const code = bgMusic.error ? bgMusic.error.code : "unknown";
    console.log("Music file error, code:", code, "(4 = file not found or format not supported)");
    musicText.textContent = "Music unavailable";
  });

  function playMusic() {
    bgMusic.play().catch(err => console.log("Music error:", err.name, "-", err.message));
  }

  // Browsers only allow sound after a click. This runs once, on the first click or key press
  function firstInteraction(e) {
    if (e.target.closest("#musicBtn")) return; // the music button handles its own click
    playMusic();
    document.removeEventListener("click", firstInteraction);
    document.removeEventListener("keydown", firstInteraction);
  }
  document.addEventListener("click", firstInteraction);
  document.addEventListener("keydown", firstInteraction);

  // Music button: play / pause
  musicBtn.addEventListener("click", () => {
    if (bgMusic.paused) playMusic();
    else bgMusic.pause();
  });
}