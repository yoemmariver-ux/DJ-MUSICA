// CATÁLOGO DE REMIXES (Reemplaza las URLs de audio por tus previews MP3)
const tracks = [
  {
    id: 1,
    title: "Luna Llena (Club Extended Remix)",
    artist: "BAINT",
    genre: "Reggaetón",
    bpm: 96,
    key: "8A",
    price: 5,
    featured: true,
    cover: "https://picsum.photos",
    audioUrl: "https://soundhelix.com"
  },
  {
    id: 2,
    title: "Noche de Verano (Tech House Edit)",
    artist: "BAINT",
    genre: "Tech House",
    bpm: 126,
    key: "5A",
    price: 6,
    featured: true,
    cover: "https://picsum.photos",
    audioUrl: "https://soundhelix.com"
  },
  {
    id: 3,
    title: "Sin Frenos (Cachengue Party Starter)",
    artist: "BAINT",
    genre: "Cachengue",
    bpm: 102,
    key: "11B",
    price: 4,
    featured: true,
    cover: "https://picsum.photos",
    audioUrl: "https://soundhelix.com"
  },
  {
    id: 4,
    title: "Baila Conmigo (Acapella Intro Edit)",
    artist: "BAINT",
    genre: "Reggaetón",
    bpm: 94,
    key: "4A",
    price: 5,
    featured: true,
    cover: "https://picsum.photos",
    audioUrl: "https://soundhelix.com"
  },
  {
    id: 5,
    title: "Bassline Underground (VIP Mix)",
    artist: "BAINT",
    genre: "Tech House",
    bpm: 128,
    key: "2A",
    price: 7,
    featured: false,
    cover: "https://picsum.photos",
    audioUrl: "https://soundhelix.com"
  }
];

let cart = [];
let currentTrackIndex = null;
let selectedGenre = "all";
let maxBpm = 140;
let searchQuery = "";

// ELEMENTOS DEL DOM
const featuredGrid = document.getElementById("featuredGrid");
const trackList = document.getElementById("trackList");
const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationTimeEl = document.getElementById("durationTime");

// RENDERIZAR TARJETAS DESTACADAS
function renderFeatured() {
  featuredGrid.innerHTML = "";
  const featuredTracks = tracks.filter(t => t.featured);

  featuredTracks.forEach(track => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${track.cover}" alt="${track.title}">
        <button class="card-play-btn" onclick="playTrack(${track.id})">▶</button>
      </div>
      <div class="card-title">${track.title}</div>
      <div class="card-meta">${track.bpm} BPM • ${track.key} • ${track.genre}</div>
      <div class="card-footer">
        <span class="price-tag">$${track.price} USD</span>
        <button class="btn-buy-small" onclick="addToCart(${track.id})">+ Carrito</button>
      </div>
    `;
    featuredGrid.appendChild(card);
  });
}

// RENDERIZAR LISTA FILTRADA
function renderTrackList() {
  trackList.innerHTML = "";
  const filtered = tracks.filter(track => {
    const matchesGenre = selectedGenre === "all" || track.genre === selectedGenre;
    const matchesBpm = track.bpm <= maxBpm;
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery) ||
      track.artist.toLowerCase().includes(searchQuery) ||
      track.key.toLowerCase().includes(searchQuery);
    return matchesGenre && matchesBpm && matchesSearch;
  });

  filtered.forEach((track, index) => {
    const row = document.createElement("div");
    row.className = "track-row";
    row.innerHTML = `
      <span>${index + 1}</span>
      <div class="track-info-cell">
        <img src="${track.cover}" alt="${track.title}" onclick="playTrack(${track.id})">
        <div>
          <div style="font-weight:600; cursor:pointer;" onclick="playTrack(${track.id})">${track.title}</div>
          <div class="track-sub">${track.artist}</div>
        </div>
      </div>
      <div>${track.genre}</div>
      <div>${track.bpm} BPM • <strong>${track.key}</strong></div>
      <div>
        <button class="btn-buy-small" onclick="addToCart(${track.id})">$${track.price} 🛒</button>
      </div>
    `;
    trackList.appendChild(row);
  });
}

// REPRODUCIR PISTA
function playTrack(id) {
  const index = tracks.findIndex(t => t.id === id);
  if (index === -1) return;

  currentTrackIndex = index;
  const track = tracks[index];

  document.getElementById("playerCover").src = track.cover;
  document.getElementById("playerTitle").textContent = track.title;
  document.getElementById("playerArtist").textContent = `${track.artist} • ${track.bpm} BPM (${track.key})`;

  const playerBuyBtn = document.getElementById("playerBuyBtn");
  playerBuyBtn.disabled = false;
  playerBuyBtn.textContent = `Comprar $${track.price}`;
  playerBuyBtn.onclick = () => addToCart(track.id);

  audioPlayer.src = track.audioUrl;
  audioPlayer.play();
  playPauseBtn.textContent = "⏸";
}

playPauseBtn.addEventListener("click", () => {
  if (!audioPlayer.src) return;
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseBtn.textContent = "⏸";
  } else {
    audioPlayer.pause();
    playPauseBtn.textContent = "▶";
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentTrackIndex === null) return;
  const next = (currentTrackIndex + 1) % tracks.length;
  playTrack(tracks[next].id);
});

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentTrackIndex === null) return;
  const prev = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  playTrack(tracks[prev].id);
});

// BARRA DE PROGRESO
audioPlayer.addEventListener("timeupdate", () => {
  if (!audioPlayer.duration) return;
  progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  durationTimeEl.textContent = formatTime(audioPlayer.duration);
});

progressBar.addEventListener("input", () => {
  if (!audioPlayer.duration) return;
  audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});

function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// FILTROS Y BÚSQUEDA
document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    item.classList.add("active");
    selectedGenre = item.dataset.filter;
    renderTrackList();
  });
});

document.getElementById("bpmRange").addEventListener("input", e => {
  maxBpm = Number(e.target.value);
  document.getElementById("bpmValue").textContent = maxBpm;
  renderTrackList();
});

document.getElementById("searchInput").addEventListener("input", e => {
  searchQuery = e.target.value.toLowerCase();
  renderTrackList();
});

// CARRITO DE COMPRAS
function addToCart(id) {
  const track = tracks.find(t => t.id === id);
  if (cart.some(item => item.id === id)) {
    alert("Este remix ya está en tu carrito.");
    return;
  }
  cart.push(track);
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
}

function updateCartUI() {
  document.getElementById("cartCount").textContent = cart.length;
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  let total = 0;
  cart.forEach(item => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <strong>${item.title}</strong>
        <div class="track-sub">${item.genre} • WAV + MP3</div>
      </div>
      <div>
        <span>$${item.price}</span>
        <button onclick="removeFromCart(${item.id})" style="margin-left:8px; background:none; border:none; color:#ff5555; cursor:pointer;">✕</button>
      </div>
    `;
    cartItems.appendChild(div);
  });

  document.getElementById("cartTotal").textContent = total;
}

const cartModal = document.getElementById("cartModal");
document.getElementById("cartBtn").addEventListener("click", () => cartModal.classList.remove("hidden"));
document.getElementById("closeCart").addEventListener("click", () => cartModal.classList.add("hidden"));

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) return alert("Tu carrito está vacío.");
  alert(`Redirigiendo a pasarela de pago por $${document.getElementById("cartTotal").textContent} USD...`);
});

// INICIALIZAR
renderFeatured();
renderTrackList();

// =========================================================
// ELIMINAR FONDO AUTOMÁTICAMENTE DE LOS LOGOS CON CANVAS
// =========================================================
function quitarFondoImagen(imgElement, tipoFondo) {
  if (!imgElement) return;

  const procesar = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;

    ctx.drawImage(imgElement, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (tipoFondo === "blanco") {
        if (r > 230 && g > 230 && b > 230) {
          data[i + 3] = 0;
        }
      } else if (tipoFondo === "negro") {
        if (r < 35 && g < 35 && b < 35) {
          data[i + 3] = 0;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    imgElement.src = canvas.toDataURL("image/png");
  };

  if (imgElement.complete && imgElement.naturalWidth > 0) {
    procesar();
  } else {
