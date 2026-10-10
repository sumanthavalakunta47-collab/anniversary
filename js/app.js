/**
 * Sumanth & Teena Mohitha - Anniversary Web Application
 * Master Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particles Engine
  const particles = new RomanticParticles('particles-canvas');

  // 2. Initialize Anniversary Counter
  const counter = new AnniversaryCounter();

  // 3. Initialize Audio Engine
  const audio = new RomanticAudioEngine();

  // 4. Initialize Card Generator
  const cardGen = new AnniversaryCardGenerator('card-canvas');

  // 5. App State & DOM Elements
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const wishesContainer = document.getElementById('wishes-container');
  const timelineContainer = document.getElementById('timeline-container');
  const reasonsContainer = document.getElementById('reasons-container');
  const galleryContainer = document.getElementById('gallery-container');
  const photoUploadInput = document.getElementById('photo-upload-input');
  const envelope = document.getElementById('anniversary-envelope');
  const giftBox = document.getElementById('surprise-gift-box');
  const voucherCard = document.getElementById('voucher-card');
  const celebrationHeroBtn = document.getElementById('celebrate-hero-btn');

  // ----------------------------------------------------
  // Audio Controls
  // ----------------------------------------------------
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      const isPlaying = audio.toggleMusic();
      if (isPlaying) {
        musicToggleBtn.classList.add('playing');
        musicToggleBtn.innerHTML = '🎵 Music: Playing';
        showToast('🎶 Romantic soundscape playing...');
      } else {
        musicToggleBtn.classList.remove('playing');
        musicToggleBtn.innerHTML = '🔇 Music: Muted';
        showToast('Music paused');
      }
    });
  }

  // ----------------------------------------------------
  // Render Wishes Showcase & Filters
  // ----------------------------------------------------
  function renderWishes(category = 'all') {
    if (!wishesContainer) return;
    wishesContainer.innerHTML = '';

    const filtered = category === 'all' 
      ? anniversaryWishesData 
      : anniversaryWishesData.filter(w => w.category === category);

    filtered.forEach(wish => {
      const card = document.createElement('div');
      card.className = 'wish-card';
      card.innerHTML = `
        <div>
          <div class="wish-header">
            <span class="wish-emoji">${wish.emoji}</span>
            <span class="wish-badge">${wish.tags[0]}</span>
          </div>
          <h3 class="wish-title">${wish.title}</h3>
          <p class="wish-body">“${wish.text}”</p>
        </div>
        <div class="wish-footer">
          <span class="wish-quotee">${wish.quotee}</span>
          <div class="wish-actions">
            <button class="btn-wish-action copy-btn" title="Copy Wish">📋 Copy</button>
            <button class="btn-wish-action speech-btn" title="Listen Wish">🔊 Listen</button>
            <button class="btn-wish-action use-card-btn" title="Create Card">🎨 Make Card</button>
          </div>
        </div>
      `;

      // Copy Action
      const copyBtn = card.querySelector('.copy-btn');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(wish.text);
        showToast('💌 Wish copied to clipboard!');
        audio.playChimeEffect();
      });

      // Text to Speech
      const speechBtn = card.querySelector('.speech-btn');
      speechBtn.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const cleanText = wish.text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.pitch = 1.05;
          utterance.rate = 0.95;
          window.speechSynthesis.speak(utterance);
          showToast('🗣️ Reading wish aloud...');
        } else {
          showToast('Speech synthesis not supported in this browser.');
        }
      });

      // Use in Card Studio
      const useCardBtn = card.querySelector('.use-card-btn');
      useCardBtn.addEventListener('click', () => {
        const studioTextarea = document.getElementById('card-message-input');
        if (studioTextarea) {
          studioTextarea.value = wish.text;
          cardGen.updateState({ message: wish.text });
          document.getElementById('card-studio-section').scrollIntoView({ behavior: 'smooth' });
          showToast('✨ Wish loaded into Card Studio!');
          audio.playChimeEffect();
        }
      });

      wishesContainer.appendChild(card);
    });
  }

  // Wishes Category Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-category');
      renderWishes(category);
    });
  });

  renderWishes('all');

  // ----------------------------------------------------
  // Interactive 3D Envelope & Wax Seal
  // ----------------------------------------------------
  if (envelope) {
    envelope.addEventListener('click', () => {
      const isOpen = envelope.classList.toggle('open');
      if (isOpen) {
        audio.playChimeEffect();
        triggerConfetti(60);
        showToast('💌 Love letter opened!');
      }
    });
  }

  // ----------------------------------------------------
  // Render Love Story Timeline
  // ----------------------------------------------------
  if (timelineContainer) {
    loveTimelineEvents.forEach(item => {
      const el = document.createElement('div');
      el.className = 'timeline-item';
      el.innerHTML = `
        <div class="timeline-dot">${item.icon}</div>
        <div class="timeline-card">
          ${item.image ? `
            <div class="timeline-img-box">
              <img src="${item.image}" alt="${item.title}" loading="lazy" class="timeline-img">
            </div>
          ` : ''}
          <span class="timeline-tag">${item.tag}</span>
          <h4 class="timeline-title">${item.title}</h4>
          <p class="timeline-desc">${item.description}</p>
        </div>
      `;
      timelineContainer.appendChild(el);
    });
  }

  // ----------------------------------------------------
  // Render Reasons to Love Flip Cards
  // ----------------------------------------------------
  if (reasonsContainer) {
    reasonsToLove.forEach(reason => {
      const card = document.createElement('div');
      card.className = 'flip-card';
      card.innerHTML = `
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <span class="reason-num">${reason.number}</span>
            <div class="reason-icon">${reason.emoji}</div>
            <h4 class="reason-title">${reason.title}</h4>
            <small style="color: var(--primary-gold); margin-top: 8px;">(Tap to Reveal ✨)</small>
          </div>
          <div class="flip-card-back">
            <div style="font-size: 2rem; margin-bottom: 10px;">💖</div>
            <p class="reason-text">${reason.text}</p>
          </div>
        </div>
      `;
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        audio.playChimeEffect();
      });
      reasonsContainer.appendChild(card);
    });
  }

  // ----------------------------------------------------
  // Memories Photo Gallery & Real Photos
  // ----------------------------------------------------
  const defaultPhotos = [
    {
      url: 'assets/images/memory1_event_heart.jpg',
      caption: 'Every Beat of My Heart Belongs to You • Sumanth & Mohitha 💖'
    },
    {
      url: 'assets/images/memory2_selfie_smiles.jpg',
      caption: 'Your Smile is My Favorite View in the Whole Universe ✨'
    },
    {
      url: 'assets/images/memory3_traditional.jpg',
      caption: 'Pure Elegance, Grace & Sacred Togetherness 💫'
    },
    {
      url: 'assets/images/memory4_holding_hands.jpg',
      caption: 'Holding Your Hand Through Every Season of Life • October 13 🤝💍'
    }
  ];

  function getStoredPhotos() {
    const saved = localStorage.getItem('anniversary_user_photos');
    if (!saved) return defaultPhotos;
    try {
      const parsed = JSON.parse(saved);
      // If user had previous default sample photos, ensure our new real photos take center stage
      if (parsed.length > 0 && parsed[0].url.includes('unsplash')) {
        localStorage.setItem('anniversary_user_photos', JSON.stringify(defaultPhotos));
        return defaultPhotos;
      }
      return parsed;
    } catch (e) {
      return defaultPhotos;
    }
  }

  function renderGallery() {
    if (!galleryContainer) return;
    galleryContainer.innerHTML = '';
    const photos = getStoredPhotos();

    photos.forEach(photo => {
      const pCard = document.createElement('div');
      pCard.className = 'photo-card';
      pCard.innerHTML = `
        <div class="photo-img-wrapper">
          <img src="${photo.url}" alt="${photo.caption}" loading="lazy">
          <div class="photo-overlay">
            <span class="photo-caption">${photo.caption}</span>
          </div>
        </div>
        <div style="text-align:center; font-size:0.95rem; color:var(--text-gold); font-family:var(--font-serif); padding-top: 6px;">
          ${photo.caption}
        </div>
      `;

      pCard.addEventListener('click', () => {
        openLightbox(photo.url, photo.caption);
      });

      galleryContainer.appendChild(pCard);
    });
  }

  renderGallery();

  // Photo Upload Handler
  if (photoUploadInput) {
    photoUploadInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const currentPhotos = getStoredPhotos();
      let loadedCount = 0;

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          currentPhotos.unshift({
            url: event.target.result,
            caption: `Cherished Memory • Sumanth & Mohitha`
          });
          loadedCount++;
          if (loadedCount === files.length) {
            localStorage.setItem('anniversary_user_photos', JSON.stringify(currentPhotos));
            renderGallery();
            showToast(`📸 ${files.length} memory photo(s) added!`);
            audio.playSuccessCelebration();
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Lightbox Modal
  const modalOverlay = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalClose = document.getElementById('modal-close');

  function openLightbox(url, caption) {
    if (!modalOverlay) return;
    modalImg.src = url;
    modalCaption.textContent = caption;
    modalOverlay.classList.add('active');
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  // ----------------------------------------------------
  // Surprise Gift Box & Celebration
  // ----------------------------------------------------
  if (giftBox) {
    giftBox.addEventListener('click', () => {
      giftBox.classList.add('opened');
      if (voucherCard) voucherCard.classList.add('show');
      audio.playSuccessCelebration();
      triggerConfetti(120);
      showToast('🎁 Happy Anniversary! Special love vow revealed!');
    });
  }

  if (celebrationHeroBtn) {
    celebrationHeroBtn.addEventListener('click', () => {
      audio.playSuccessCelebration();
      triggerConfetti(100);
      showToast('💖 Celebrating Sumanth & Teena Mohitha!');
    });
  }

  // ----------------------------------------------------
  // Card Studio Listeners
  // ----------------------------------------------------
  const themeSelect = document.getElementById('card-theme-select');
  const namesInput = document.getElementById('card-names-input');
  const dateInput = document.getElementById('card-date-input');
  const messageInput = document.getElementById('card-message-input');
  const subtitleInput = document.getElementById('card-subtitle-input');
  const downloadCardBtn = document.getElementById('download-card-btn');

  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => cardGen.updateState({ theme: e.target.value }));
  }
  if (namesInput) {
    namesInput.addEventListener('input', (e) => cardGen.updateState({ coupleName: e.target.value }));
  }
  if (dateInput) {
    dateInput.addEventListener('input', (e) => cardGen.updateState({ dateText: e.target.value }));
  }
  if (messageInput) {
    messageInput.addEventListener('input', (e) => cardGen.updateState({ message: e.target.value }));
  }
  if (subtitleInput) {
    subtitleInput.addEventListener('input', (e) => cardGen.updateState({ subtitle: e.target.value }));
  }
  if (downloadCardBtn) {
    downloadCardBtn.addEventListener('click', () => {
      cardGen.downloadCard('Sumanth_Mohitha_Anniversary_Oct13.png');
      audio.playChimeEffect();
      showToast('🎉 Card exported successfully!');
    });
  }

  // ----------------------------------------------------
  // Confetti Engine (Canvas-based Fireworks burst)
  // ----------------------------------------------------
  function triggerConfetti(count = 80) {
    const confettiCanvas = document.getElementById('confetti-canvas');
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ffd700', '#ff4d79', '#ffffff', '#e0245e', '#f5d77f', '#a855f7'];

    for (let i = 0; i < count; i++) {
      pieces.push({
        x: confettiCanvas.width / 2 + (Math.random() - 0.5) * 200,
        y: confettiCanvas.height * 0.4 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18 - 8,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.35,
        opacity: 1
      });
    }

    function renderConfetti() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      let active = false;

      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.008;

        if (p.opacity > 0) {
          active = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (active) {
        requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    renderConfetti();
  }

  // ----------------------------------------------------
  // Toast Notification System
  // ----------------------------------------------------
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }
});
