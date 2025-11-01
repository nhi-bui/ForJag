// Toggle notes
function toggleNote(index) {
  const notes = document.querySelectorAll('.note');
  const content = notes[index].querySelector('.note-content');
  const image = notes[index].querySelector('img');
  const button = notes[index].querySelector('button');

  if (content.style.display === 'block') {
    content.style.display = 'none';
    if(image) image.style.display = 'none';
    button.textContent = 'Reveal';
  } else {
    content.style.display = 'block';
    if(image) image.style.display = 'block';
    button.textContent = 'Hide';
  }
}

// Create floating hearts with random opacity and speed
const heartsContainer = document.getElementById('hearts-container');
if(heartsContainer){
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '❤️';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (20 + Math.random() * 20) + 'px';
    heart.style.opacity = Math.random() * 0.8 + 0.2;
    heart.style.animationDuration = (3 + Math.random() * 4) + 's';

    // Click on heart to float away faster
    heart.addEventListener('click', () => {
      heart.style.transition = 'transform 1s, opacity 1s';
      heart.style.transform = 'translateY(-300px) rotate(360deg)';
      heart.style.opacity = 0;
    });

    heartsContainer.appendChild(heart);
  }
}

// Lock screen password check with animated popups + hearts
let wrongAttempts = 0;

function checkPassword() {
  const passwordInput = document.getElementById('password');
  const password = passwordInput.value;

  if (password === '021125') {
    window.location.href = 'forMyBaby.html';
  } else {
    wrongAttempts++;
    const messages = [
      'Hello? 🤔',
      'Uh... do you not remember? 😅',
      "Try today's date 😉",
      'Still wrong! 💔'
    ];

    const message = messages[Math.min(wrongAttempts - 1, messages.length - 1)];
    showPopup(message);
    spawnHearts();

    passwordInput.value = '';
    passwordInput.focus();
  }
}

// Popup animation
function showPopup(message) {
  const popup = document.createElement('div');
  popup.className = 'popup-alert';
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add('show'), 10);
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => popup.remove(), 500);
  }, 2500);
}

// Spawn floating emojis around popup
function spawnHearts() {
  const emojis = ['😒','💔','😭','🫤','😠','🤞','😓','😤','😡','🥺'];
  for (let i=0;i<10;i++){
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    heart.style.left = Math.random()*90+'vw';
    heart.style.fontSize = (40+Math.random()*40)+'px';
    heart.style.animationDuration = (2+Math.random()*2)+'s';
    document.body.appendChild(heart);
    setTimeout(()=>heart.remove(),4000);
  }
}

// Add hearts along the heart-frame edges
const heartFrame = document.querySelector('.heart-frame');
if (heartFrame) {
  const heartFrame = document.querySelector('.heart-frame');
if (heartFrame) {
  const numHearts = 60; // total decorations around the frame
  const decorations = ['❤️', '✨']; // hearts and sparkles

  for (let i = 0; i < numHearts; i++) {
    const heart = document.createElement('div');
    heart.className = 'frame-heart';
    
    // Pick a random decoration (heart or sparkle)
    heart.textContent = decorations[Math.floor(Math.random() * decorations.length)];

    // Randomly position along the border edges
    const side = Math.floor(Math.random() * 4); // 0=top,1=right,2=bottom,3=left
    const offset = Math.random() * 90 + 5; // offset 5%-95%
    switch(side){
      case 0: // top
        heart.style.top = '0%';
        heart.style.left = offset + '%';
        break;
      case 1: // right
        heart.style.top = offset + '%';
        heart.style.right = '0%';
        break;
      case 2: // bottom
        heart.style.bottom = '0%';
        heart.style.left = offset + '%';
        break;
      case 3: // left
        heart.style.top = offset + '%';
        heart.style.left = '0%';
        break;
    }

    // Random animation duration and size
    heart.style.animationDuration = (2 + Math.random() * 2) + 's';
    heart.style.fontSize = (12 + Math.random() * 12) + 'px';

    heartFrame.appendChild(heart);
  }
}

}


// Canvas scratch setup
const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const card = canvas.parentElement;
let isDrawing = false;

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseleave', () => isDrawing = false);
canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  scratch({ clientX: touch.clientX, clientY: touch.clientY });
});

function scratch(e) {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();

  // Floating sparkles
  const sparkle = document.createElement('div');
  sparkle.className = 'floating-scratch';
  sparkle.textContent = ['💖','✨','💗','🌸','💞'][Math.floor(Math.random()*5)];
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  card.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 1000);

  checkReveal();
}

function checkReveal() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let transparent = 0;
  const pixels = imageData.data;

  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) transparent++;
  }

  if (transparent > pixels.length * 0.02) { // trigger after very little scratch
    revealSlideshow();
  }
}

function revealSlideshow() {
  canvas.remove();

  // Big heart effect
  const heart = document.createElement('div');
  heart.className = 'big-heart';
  heart.textContent = '💖';
  heart.style.position = 'absolute';
  heart.style.fontSize = '4rem';
  heart.style.top = '50%';
  heart.style.left = '50%';
  heart.style.transform = 'translate(-50%, -50%)';
  heart.style.zIndex = 4;
  card.appendChild(heart);
  setTimeout(() => heart.remove(), 2000);

  // Start animated slideshow
  const slides = card.querySelectorAll('.slideshow img');
  let index = 0;
  slides[index].classList.add('active');

  setInterval(() => {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');

    // add small random rotation + zoom for each image
    slides[index].style.transform = `scale(${1 + Math.random()*0.05}) rotate(${Math.random()*4-2}deg)`;
  }, 2500); // switch every 2.5s
}

//Easter Eggs
let secretCode = ["i","l","y"];
let buffer = [];

document.addEventListener("keydown", e => {
  buffer.push(e.key.toLowerCase());
  buffer.splice(-secretCode.length - 1, buffer.length - secretCode.length);

  if (buffer.join("") === secretCode.join("")) {
    let msg = document.getElementById("secretLoveMsg");
    msg.style.display = "block";
    setTimeout(()=> msg.style.display="none", 3000);
  }
});

document.getElementById("clickHeart").addEventListener("click", () => {
  for(let i=0; i<40; i++){
    let c = document.createElement("div");
    c.innerText = "💖";
    c.style.position="fixed";
    c.style.left = Math.random()*100 + "vw";
    c.style.top = Math.random()*100 + "vh";
    c.style.fontSize = Math.random()*20+15 + "px";
    c.style.animation = "fall 2s ease-out forwards";
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),2000);
  }
});

const style = document.createElement('style');
style.innerHTML = `
@keyframes fall {
  to {
    transform: translateY(100vh) rotate(360deg);
    opacity:0;
  }
}`;
document.head.appendChild(style);


document.getElementById("secretWhisper").onclick = () => {
  alert("hehe, you're the cutest person ever 😘💗");
};


document.getElementById("cornerSecret").onmouseover = () => {
  alert("Omg how did you find this? I love you my smart cookie 💘");
};

const audioIcon = document.getElementById("audioSecret");
const loveAudio = document.getElementById("loveAudio");

audioIcon.addEventListener("click", () => {
  loveAudio.currentTime = 0; 
  loveAudio.play();
  alert("turn up your volume baby");
});


