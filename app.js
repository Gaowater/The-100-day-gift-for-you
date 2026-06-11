// ======================================================
// app.js — 100天礼物主程序
// 功能：天数、句子、卡片渲染、心情、BG、星空、相册等
// ======================================================

// ─── 全局 ───
const startDate = new Date('2026-02-07');
const today = new Date();
const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;

// ─── 天数 & 日期 ───
document.getElementById('daysCount').textContent = diffDays >= 1 ? diffDays : 1;
document.getElementById('todayDate').textContent =
  `今天 ${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

// ─── 底部每日一句 ───
const quotesByDay = {
  0: ["行到水穷处，坐看云起时。——王维","生活明朗，万物可爱","愿你眼里有光，心中有爱"],
  1: ["今天也是元气满满的一天","阳光正好，微风不燥","新的一天，新的开始","保持热爱，奔赴山海"],
  2: ["什么越洗越脏？水。","有些路看起来很近，走起来却很远","好事多磨"],
  3: ["人生就像一盒巧克力。——《阿甘正传》","愿你被世界温柔以待","心之所向，素履以往"],
  4: ["考拉的指纹和人类几乎一模一样。","傍晚的微风最温柔","今天也要好好吃饭","生活原本沉闷，跑起来就有风"],
  5: ["向前跑，迎着冷眼和嘲笑。——《追梦赤子心》","星星发亮是为了让每个人都找到属于自己的星星","把普通的日子过得浪漫些"],
  6: ["天才是百分之一的灵感加百分之九十九的汗水。——爱迪生","周末愉快","愿你做一个快乐的大人"]
};
const dayQuotes = quotesByDay[today.getDay()];
document.getElementById('footerQuote').textContent =
  '「 ' + dayQuotes[Math.floor(Math.random() * dayQuotes.length)] + ' 」';

// ─── 渲染卡片 ───
const container = document.getElementById('cardsContainer');
cardsData.forEach((card, index) => {
  const cardEl = document.createElement('div');
  cardEl.className = 'card';
  let hintHTML = '';
  if (index === 4) hintHTML = '<p class="card-hint">✦ 双击这里</p>';
  if (index === 6) hintHTML = '<p class="card-hint">✦ 双击这里</p>';
  if (index === 8) hintHTML = '<p class="card-hint">✦ 双击这里</p>';
  cardEl.innerHTML = `
    <div class="card-image" data-lightbox-src="images/${card.image}">
      <div class="card-image-overlay"></div>
      <img src="images/${card.image}" alt="${card.title || '图片' + (index + 1)}" loading="lazy">
    </div>
    <div class="card-content">
      ${card.title ? '<h3 class="card-title">' + card.title + '</h3>' : ''}
      <p class="card-text">${card.text}</p>
      ${hintHTML}
    </div>`;
  if (index === 4) {
    cardEl.addEventListener('dblclick', () => {
      openAlbum('album1');
      cardEl.classList.remove('card-shake');
      void cardEl.offsetWidth;
      cardEl.classList.add('card-shake');
    });
  }
  if (index === 6) {
    cardEl.addEventListener('dblclick', () => {
      openAlbum('album2');
      cardEl.classList.remove('card-shake');
      void cardEl.offsetWidth;
      cardEl.classList.add('card-shake');
    });
  }
  if (index === 8) {
    cardEl.addEventListener('dblclick', () => {
      openSingleImage('images/album/secret.jpg');
      cardEl.classList.remove('card-shake');
      void cardEl.offsetWidth;
      cardEl.classList.add('card-shake');
    });
  }
  container.appendChild(cardEl);
});

// 卡片点击图片打开灯箱（事件委托，兼容动态生成）
container.addEventListener('click', (e) => {
  const target = e.target.closest('.card-image');
  if (target) {
    const src = target.getAttribute('data-lightbox-src');
    if (src) openLightbox(src);
  }
});

// ─── 卡片滚动渐入 ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.card').forEach((card, i) => {
  setTimeout(() => observer.observe(card), i * 100);
});

// ─── 灯箱（单图放大） ───
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  lb.querySelector('img').src = src;
  lb.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target === e.currentTarget || e.target.classList.contains('lightbox-close')) {
    e.currentTarget.style.display = 'none';
    document.body.style.overflow = '';
  }
});

// ─── 星空（双击表头触发） ───
const headerArea = document.getElementById('headerArea');
const starsContainer = document.getElementById('starsContainer');
const headerHint = document.getElementById('headerHint');
let starsActive = false;

function createStars() {
  starsContainer.innerHTML = '';
  for (let i = 0; i < 16; i++) {
    const star = document.createElement('div');
    star.className = 'star-particle';
    star.style.cssText =
      'left:' + Math.random() * 100 + '%;' +
      'top:' + Math.random() * 100 + '%;' +
      'width:' + (2 + Math.random() * 4) + 'px;' +
      'height:' + (2 + Math.random() * 4) + 'px;' +
      'animation-delay:' + Math.random() * 3 + 's;' +
      'animation-duration:' + (2 + Math.random() * 4) + 's;';
    starsContainer.appendChild(star);
  }
}

headerArea.addEventListener('dblclick', (e) => {
  e.preventDefault();
  if (!starsActive) {
    starsActive = true;
    headerArea.classList.add('stars-active');
    headerHint.textContent = '✨ 星光已点亮';
    createStars();
    setTimeout(() => { headerHint.style.opacity = '0.4'; }, 2000);
  }
});

// ─── 昼夜切换 ───
const themeToggle = document.getElementById('themeToggle');
let isNight = false;
themeToggle.addEventListener('click', () => {
  isNight = !isNight;
  if (isNight) {
    document.body.classList.add('night-mode');
    if (!starsActive) {
      starsActive = true;
      headerArea.classList.add('stars-active');
      headerHint.textContent = '✨ 星光已点亮';
      createStars();
      setTimeout(() => { headerHint.style.opacity = '0.4'; }, 2000);
    }
  } else {
    document.body.classList.remove('night-mode');
  }
});

// ─── 昼夜切换 ───
(function() {
  const toggle = document.getElementById('themeToggle');
  const prefersNight = localStorage.getItem('nightMode') === 'true';
  if (prefersNight) document.body.classList.add('night-mode');

  toggle.addEventListener('click', function() {
    const isNight = document.body.classList.toggle('night-mode');
    localStorage.setItem('nightMode', isNight);
  });
})();

// ─── 背景音乐 ───
const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('musicBtn');
const iconOn = document.querySelector('.music-icon-on');
const iconOff = document.querySelector('.music-icon-off');
let musicPlaying = true;

musicBtn.addEventListener('click', () => {
  if (musicPlaying) {
    bgm.pause();
    iconOn.style.display = 'none';
    iconOff.style.display = 'inline';
    musicPlaying = false;
  } else {
    bgm.play().catch(() => {});
    iconOn.style.display = 'inline';
    iconOff.style.display = 'none';
    musicPlaying = true;
  }
});

// ─── 心情系统 ───
const moodMap = {
  yuyue:   'mood-yuyue',
  youxian: 'mood-youxian',
  qidai:   'mood-qidai',
  ziyou:   'mood-ziyou',
  beishang:'mood-beishang',
  gudu:    'mood-gudu',
  fennu:   'mood-fennu',
  yihan:   'mood-yihan',
  wuliao:  'mood-wuliao',
  kongxu:  'mood-kongxu',
  fadian:  'mood-fadian'
};

// 我的心情（从 config.js 读取 myMood）
const myMoodIcon = document.getElementById('myMoodIcon');
if (myMood && moodMap[myMood]) {
  myMoodIcon.className = 'mood-badge-icon ' + moodMap[myMood];
}

// 她的心情
const herMoodBadge = document.getElementById('herMoodBadge');
const herMoodIcon = document.getElementById('herMoodIcon');
const moodOverlay = document.getElementById('moodOverlay');
const savedHerMood = localStorage.getItem('herMood');
if (savedHerMood && moodMap[savedHerMood]) {
  herMoodIcon.className = 'mood-badge-icon ' + moodMap[savedHerMood];
} else {
  herMoodIcon.className = 'mood-badge-icon mood-empty';
}

herMoodBadge.addEventListener('click', () => {
  moodOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
});

moodOverlay.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    moodOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }
});

document.querySelectorAll('.mood-item').forEach((item) => {
  item.addEventListener('click', function () {
    const mood = this.getAttribute('data-mood');
    localStorage.setItem('herMood', mood);
    herMoodIcon.className = 'mood-badge-icon ' + moodMap[mood];
    moodOverlay.style.display = 'none';
    document.body.style.overflow = '';
  });
});

// ─── 相册 ───
const albumData = {
  album1: {
    photos: ['a7.jpg','a8.jpg','a9.jpg','a10.jpg','a11.jpg','a12.jpg','a13.jpg','a14.jpg'],
    hasVideo: true
  },
  album2: {
    photos: ['a8.jpg','a9.jpg','a10.jpg','a11.jpg','a12.jpg','a13.jpg','a14.jpg'],
    hasVideo: false
  }
};

function openAlbum(albumId) {
  const data = albumData[albumId];
  if (!data) return;
  const overlay = document.getElementById('albumOverlay');
  const grid = overlay.querySelector('.album-grid');
  const videoSection = overlay.querySelector('.album-video');
  grid.innerHTML = '';
  data.photos.forEach((photo) => {
    const img = document.createElement('img');
    img.src = 'images/album/' + photo;
    img.alt = photo;
    img.loading = 'lazy';
    img.onclick = () => openLightbox('images/album/' + photo);
    grid.appendChild(img);
  });
  videoSection.style.display = data.hasVideo ? 'block' : 'none';
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

document.getElementById('albumOverlay').addEventListener('click', function (e) {
  if (e.target === this || e.target.className === 'album-close') {
    this.style.display = 'none';
    document.body.style.overflow = '';
    this.querySelector('.album-video').style.display = 'block';
    const v = this.querySelector('video');
    if (v) v.pause();
  }
});

// ─── 单图弹出（secret.jpg） ───
function openSingleImage(src) {
  const overlay = document.createElement('div');
  overlay.className = 'single-image-overlay';
  overlay.innerHTML =
    '<span class="single-image-close">&times;</span><img src="' + src + '" alt="照片">';
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target.className === 'single-image-close') {
      overlay.remove();
      document.body.style.overflow = '';
    }
  });
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}

// ─── 更新日志折叠 ───
document.getElementById('changelogContent').style.display = 'none';
document.getElementById('changelogToggle').addEventListener('click', function () {
  const content = document.getElementById('changelogContent');
  content.style.display = content.style.display === 'block' ? 'none' : 'block';
});
