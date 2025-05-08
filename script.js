gsap.registerPlugin(ScrollTrigger);
document.querySelectorAll('[data-page]').forEach(item => {
    item.addEventListener('click', () => {
        const pageId = item.getAttribute('data-page');
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
        window.scrollTo(0, 0);
        initializeAnimations();
        
        // Galeri sayfası açıldığında video ve resimlerin yüklenmesini başlat
        if (pageId === 'gallery') {
            initializeGallery();
        }
    });
});

// Galeri yükleme işlemleri için yeni bir fonksiyon
function initializeGallery() {
    // Video elementlerinin yüklenmesini ve thumbnail oluşturmayı optimize et
    // Gecikmeli
    const videoElements = document.querySelectorAll('.gallery-item video');
    
    // Videoları sırayla, gecikmeli olarak yükle
    videoElements.forEach((video, index) => {
        setTimeout(() => {
            setupVideoThumbnail(video);
        }, index * 150); // Her video için 150ms gecikme
    });
}

// Video thumbnail ve süre bilgisi oluşturma fonksiyonu
function setupVideoThumbnail(video) {
    // Video yüklendiğinde süre bilgisini güncelle
    video.addEventListener('loadedmetadata', function() {
        const durationElement = video.parentElement.querySelector('.video-duration');
        if (durationElement) {
            const duration = Math.round(video.duration);
            durationElement.textContent = formatTime(duration);
        }
        
        // Video yükleniyor göstergesini gizle
        const loadingElement = video.parentElement.querySelector('.video-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        // Videonun ilk karesini thumbnail olarak ayarla
        if (video.readyState >= 2) {
            createThumbnail(video);
        }
    });
    
    // Video hata verirse
    video.addEventListener('error', function() {
        const loadingElement = video.parentElement.querySelector('.video-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
            loadingElement.textContent = 'Yüklenemiyor';
        }
    });
}

// Video thumbnail oluşturma fonksiyonu
function createThumbnail(video) {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL();
        
        // Canvas'ı temizle
        canvas.remove();
        
        // Video üzerine tıklanınca oynatılacak şekilde ayarla
        const playButton = video.parentElement.querySelector('.play-button');
        if (playButton) {
            playButton.style.display = 'flex';
            playButton.addEventListener('click', function() {
                if (video.paused) {
                    video.play();
                    playButton.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    video.pause();
                    playButton.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
        }
        
        // Video bittiğinde play butonu göster
        video.addEventListener('ended', function() {
            if (playButton) {
                playButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    } catch (error) {
        console.error('Thumbnail oluşturulamadı:', error);
    }
}

// Zaman formatı fonksiyonu (00:00 şeklinde)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function initializeAnimations() {
    gsap.to('.hero h1', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.5
    });
    gsap.to('.hero p', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.8
    });
    gsap.to('.hero-button', {
        opacity: 1,
        y: 0,
        duration: 1.1
    });
    gsap.to('.quote', {
        opacity: 0.7,
        y: 0,
        duration: 1,
        delay: 1.4
    });
    gsap.utils.toArray('.info-card').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.2
        });
    });
}

const body = document.querySelector('body');
const overlay = document.createElement('div');
overlay.className = 'overlay';
body.appendChild(overlay);
let expandedCard = null;
document.querySelectorAll('.info-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (expandedCard === card) {
            card.classList.remove('expanded');
            overlay.classList.remove('active');
            expandedCard = null;
        } else {
            if (expandedCard) {
                expandedCard.classList.remove('expanded');
            }
            card.classList.add('expanded');
            overlay.classList.add('active');
            expandedCard = card;
        }
    });
});
function changeColor(element, color) {
    if (!element.classList.contains('expanded')) {
        element.style.backgroundColor = color;
    }
}
function resetColor(element) {
    if (!element.classList.contains('expanded')) {
        element.style.backgroundColor = '#333';
    }
}
document.querySelectorAll('.info-card').forEach(card => {
    card.addEventListener('mouseover', function() {
        changeColor(this, this.dataset.color);
    });
    card.addEventListener('mouseout', function() {
        resetColor(this);
    });
});
overlay.addEventListener('click', () => {
    if (expandedCard) {
        expandedCard.classList.remove('expanded');
        overlay.classList.remove('active');
        expandedCard = null;
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && expandedCard) {
        expandedCard.classList.remove('expanded');
        overlay.classList.remove('active');
        expandedCard = null;
    }
});
const galleryItems = document.querySelectorAll('.gallery-item img');
const galleryOverlay = document.querySelector('.gallery-overlay');
const overlayImage = document.querySelector('.gallery-overlay img');

// Resimlere tıklama işlemi
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        overlayImage.src = item.src;
        document.querySelector('.gallery-overlay video').src = '';
        overlayImage.style.display = 'block';
        document.querySelector('.gallery-overlay video').style.display = 'none';
        galleryOverlay.classList.add('active');
    });
});

// Video tıklama işlemi için yeni bir işleyici ekle
document.querySelectorAll('.gallery-item.video').forEach(videoItem => {
    videoItem.addEventListener('click', (e) => {
        // Play butonuna tıklama durumunu kontrol et
        if (!e.target.closest('.play-button')) {
            const video = videoItem.querySelector('video');
            const galleryOverlayVideo = document.querySelector('.gallery-overlay video');
            galleryOverlayVideo.src = video.src;
            overlayImage.src = '';
            overlayImage.style.display = 'none';
            galleryOverlayVideo.style.display = 'block';
            galleryOverlay.classList.add('active');
            
            // Video'yu yükle ve oynat
            galleryOverlayVideo.load();
            galleryOverlayVideo.play();
        }
    });
});

// Overlay'i kapatma işlemi
galleryOverlay.addEventListener('click', (e) => {
    if (e.target === galleryOverlay) {
        galleryOverlay.classList.remove('active');
        // Video durdur
        const galleryOverlayVideo = document.querySelector('.gallery-overlay video');
        if (galleryOverlayVideo.src) {
            galleryOverlayVideo.pause();
        }
    }
});

// Escape tuşu ile overlay'i kapatma
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        galleryOverlay.classList.remove('active');
        // Video durdur
        const galleryOverlayVideo = document.querySelector('.gallery-overlay video');
        if (galleryOverlayVideo.src) {
            galleryOverlayVideo.pause();
        }
        
        if (expandedCard) {
            expandedCard.classList.remove('expanded');
            expandedCard = null;
        }
    }
});

const aboutSections = {
    'who': {
        title: 'Ben Kimim?',
        text: 'Ben Kaan (AKA: Quirx), 18 yaşındayım ve acemi bir geliştiriciyim. Antalya\'da yaşıyorum aynı zamanda sayısal bölümü 12. Sınıf öğrencisiyim.',
        next: 'what'
    },
    'what': {
        title: 'Ne Yaparım?',
        text: 'Henüz acemi olsam da bir geliştiriciyim, HTML, CSS, JS, Python, Go, PHP öğreniyorum ve YKS\'ye hazırlanıyorum.',
        next: 'likes'
    },
    'likes': {
        title: 'Neler Severim?',
        text: 'Başta kod yazmayı, matematik ve mantık gerektiren işlerle uğraşmayı, oyun oynamayı, kitap okumayı ve anime izlemeyi severim.',
        next: 'favorites'
    },
    'favorites': {
        title: 'Benim *En*lerim',
        text: 'Dizi olarak Mr Robot ve Dexter favorilerim. Anime olarak One Piece favorilerim. Kitaplarda ise Suç ve Ceza en çok beğendiğim eser, müzik olarak ise APT., Die with A Smile ve IDOL sürekli dinlediğim şarkılar. Programlama dillerinde ise Go ve React benim en sevdiğim diller.',
        next: 'social'
    },
    'social': {
        title: 'Sosyal Medya',
        text: 'Github: @quirxsama\nX: @quirxkaan\nYouTube: Quirx\'Sama',
        next: 'who'
    }
};
function nextSection(currentSection) {
    const aboutContent = document.querySelector('.about-content');
    const nextSectionId = aboutSections[currentSection].next;
    const title = aboutContent.querySelector('.about-title');
    const text = aboutContent.querySelector('.about-text');
    const colors = {
        'who': '#ff6b6b',
        'what': '#4ecdc4',
        'likes': '#45b7d1',
        'favorites': '#f7b731',
        'social': '#a55eea'
    };
    const currentColor = colors[currentSection];
    const nextColor = colors[nextSectionId];
    gsap.to(aboutContent, {
        backgroundColor: nextColor,
        duration: 0.4,
        ease: "none"
    });
    text.classList.add('exit');
    setTimeout(() => {
        aboutContent.dataset.section = nextSectionId;
        if (nextSectionId === 'social') {
            text.innerHTML = `
                <div class="social-icons">
                    <a href="https://github.com/quirxsama" target="_blank" class="social-icon github">
                        <i class="fab fa-github"></i>
                    </a>
                    <a href="https://twitter.com/quirxkaan" target="_blank" class="social-icon twitter">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="https://youtube.com/@quirxkaan" target="_blank" class="social-icon youtube">
                        <i class="fab fa-youtube"></i>
                    </a>
                </div>
            `;
        } else {
            text.textContent = translations[currentLang].about[nextSectionId].text;
        }
        title.textContent = translations[currentLang].about[nextSectionId].title;
        text.classList.remove('exit');
        text.classList.add('enter');
        requestAnimationFrame(() => {
            text.classList.remove('enter');
            text.classList.add('active');
        });
    }, 400);
    aboutContent.addEventListener('mouseleave', () => {
        gsap.to(aboutContent, {
            backgroundColor: 'var(--secondary)',
            duration: 0.3
        });
    });
}
document.querySelector('.next-section').addEventListener('click', function() {
    const currentSection = document.querySelector('.about-content').dataset.section;
    nextSection(currentSection);
});
window.onload = initializeAnimations;
const translations = {
    tr: {
        title: "Quirx'in Köşesi",
        nav: {
            home: "Ana Sayfa",
            about: "Hakkımda",
            gallery: "Galeri"
        },
        hero: {
            welcome: "Hoş Geldiniz",
            subtitle: "Beni tanımak için en iyi yer.",
            button: "Kim bu Kaan?",
            quote: "Ey geceyi ve kahverengi bir düzeni taşıyan ellerim, yüzümün uğultusuyla şaşırtın beni!"
        },
        about: {
            who: {
                title: "Ben Kimim?",
                text: "Ben Kaan, 18 yaşındayım ve acemi bir geliştiriciyim. Antalya'da yaşıyorum aynı zamanda sayısal bölümü 12. Sınıf öğrencisiyim."
            },
            what: {
                title: "Ne Yaparım?",
                text: "Henüz acemi olsam da bir geliştiriciyim, HTML, CSS, JS, Python, Go, PHP öğreniyorum ve YKS'ye hazırlanıyorum."
            },
            likes: {
                title: "Neler Severim?",
                text: "Başta kod yazmayı, matematik ve mantık gerektiren işlerle uğraşmayı, oyun oynamayı, kitap okumayı ve anime izlemeyi severim."
            },
            favorites: {
                title: "Benim *En*lerim",
                text: "Dizi olarak Mr Robot ve Dexter favorilerim. Anime olarak One Piece favorilerim. Kitaplarda ise Vadideki Zambak en çok beğendiğim eser, şu sıralar dinlediğim müziklere radyo ikonundan erişebilirsiniz. Programlama konusunda React ve Go kullanmayı severim."
            },
            social: {
                title: "Sosyal Medya",
                text: "Github: @quirxsama\nX: @quirxkaan\nYouTube: Quirx'Sama"
            }
        },
        gallery: {
            title: "Galeri",
            fullscreen: "Büyütülmüş galeri resmi"
        }
    },
    en: {
        title: "Quirx's Corner",
        nav: {
            home: "Home",
            about: "About",
            gallery: "Gallery"
        },
        hero: {
            welcome: "Welcome",
            subtitle: "Best Place to Know Me",
            button: "Who is Kaan?",
            quote: "Oh my hands carrying the night and a brown order, surprise me with the hum of my face!"
        },
        about: {
            who: {
                title: "Who Am I?",
                text: "I'm Kaan, I'm 18 years old and I'm a beginner developer. I live in Antalya and I'm a 12th grade student in science section."
            },
            what: {
                title: "What Do I Do?",
                text: "Although I'm still a beginner, I'm a developer learning HTML, CSS, JS, Python, Go, PHP and preparing for university entrance exam."
            },
            likes: {
                title: "What I Like?",
                text: "I love coding, working on tasks that require mathematics and logic, playing games, reading books, and watching anime."
            },
            favorites: {
                title: "My Favorites",
                text: "Mr Robot and Dexter as TV series are my favorites. One Piece is my favorite anime. In books, Lily of the Valley is my favorite work, you can access the music I am currently listening to from the radio icon. I like to use React and Go for programming."
            },
            social: {
                title: "Social Media",
                text: "Github: @quirxsama\nX: @quirxkaan\nYouTube: Quirx'Sama"
            }
        },
        gallery: {
            title: "Gallery",
            fullscreen: "Enlarged gallery image"
        }
    },
    pl: {
        title: "Kącik Quirxa",
        nav: {
            home: "Strona Główna",
            about: "O Mnie",
            gallery: "Galeria"
        },
        hero: {
            welcome: "Witaj",
            subtitle: "Bajeczne miejsce, by mnie poznać",
            button: "Kim jest Kaan?",
            quote: "O moje ręce niosące noc i brązowy porządek, zaskocz mnie szumem mojej twarzy!"
        },
        about: {
            who: {
                title: "Kim Jestem?",
                text: "Jestem Kaan, mam 18 lat i jestem początkującym programistą. Mieszkam w Antalyi i jestem uczniem 12 klasy na kierunku ścisłym."
            },
            what: {
                title: "Co Robię?",
                text: "Chociaż jestem początkujący, jestem programistą uczącym się HTML, CSS, JS, Python, Go, PHP i przygotowuję się do egzaminu wstępnego na uniwersytet."
            },
            likes: {
                title: "Co Lubię?",
                text: "Uwielbiam kodować, pracować nad zadaniami wymagającymi matematyki i logiki, grać w gry, czytać książki i oglądać anime."
            },
            favorites: {
                title: "Moje Ulubione",
                text: "Mr Robot i Dexter jako seriale to moje ulubione. One Piece to moje ulubione anime. Wśród książek, Lilia w Dolinie to moje ulubione dzieło, możesz uzyskać dostęp do muzyki, której obecnie słucham, z ikony radia. Lubię używać React i Go do programowania."
            },
            social: {
                title: "Media Społecznościowe",
                text: "Github: @quirxsama\nX: @quirxkaan\nYouTube: Quirx'Sama"
            }
        },
        gallery: {
            title: "Galeria",
            fullscreen: "Powiększony obraz galerii"
        }
    },
    de: {
        title: "Quirx's Ecke",
        nav: {
            home: "Startseite",
            about: "Über Mich",
            gallery: "Galerie"
        },
        hero: {
            welcome: "Willkommen",
            subtitle: "Beste Ort, um mich kennenzulernen",
            button: "Wer ist Kaan?",
            quote: "Oh meine Hände, die die Nacht und eine braune Ordnung tragen, überrascht mich mit dem Summen meines Gesichts!"
        },
        about: {
            who: {
                title: "Wer bin ich?",
                text: "Ich bin Kaan, ich bin 18 Jahre alt und ein Anfänger-Entwickler. Ich lebe in Antalya und bin ein Schüler der 12. Klasse im naturwissenschaftlichen Bereich."
            },
            what: {
                title: "Was mache ich?",
                text: "Obwohl ich noch Anfänger bin, bin ich ein Entwickler, der HTML, CSS, JS, Python, Go, PHP lernt und mich auf die Universitätsaufnahmeprüfung vorbereitet."
            },
            likes: {
                title: "Was ich mag?",
                text: "Ich liebe das Programmieren, die Arbeit an Aufgaben, die Mathematik und Logik erfordern, Spielen, Bücher lesen und Anime schauen."
            },
            favorites: {
                title: "Meine Favoriten",
                text: "Mr Robot und Dexter als TV-Serien sind meine Favoriten. One Piece ist mein Lieblingsanime. Bei Büchern ist Die Lilie im Tal mein Lieblingswerk, du kannst auf die Musik, die ich gerade höre, über das Radio-Symbol zugreifen. Ich benutze gerne React und Go zum Programmieren."
            },
            social: {
                title: "Soziale Medien",
                text: "Github: @quirxsama\nX: @quirxkaan\nYouTube: Quirx'Sama"
            }
        },
        gallery: {
            title: "Galerie",
            fullscreen: "Vergrößertes Galeriebild"
        }
    }
};
const langEmojis = {
    'tr': '🇹🇷',
    'en': '🇬🇧',
    'pl': '🇵🇱',
    'de': '🇩🇪'
};
let currentLang = 'tr';
const langSwitch = document.getElementById('lang-switch');
langSwitch.addEventListener('click', () => {
    const languages = ['tr', 'en', 'pl', 'de'];
    const currentIndex = languages.indexOf(currentLang);
    const nextIndex = (currentIndex + 1) % languages.length;
    currentLang = languages[nextIndex];
    langSwitch.textContent = langEmojis[currentLang];
    updateLanguage();
});
function updateLanguage() {
    const lang = currentLang;
    document.title = translations[lang].title;
    document.querySelector('.logo').textContent = translations[lang].title;
    document.querySelectorAll('.menu-item').forEach(item => {
        const key = item.getAttribute('data-page');
        item.textContent = translations[lang].nav[key];
    });
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.querySelector('h1').textContent = translations[lang].hero.welcome;
        hero.querySelector('p').textContent = translations[lang].hero.subtitle;
        hero.querySelector('.hero-button').textContent = translations[lang].hero.button;
        hero.querySelector('.quote').textContent = translations[lang].hero.quote;
        if (!hero.querySelector('.b-letter')) {
            initBeyzaEasterEgg();
        }
    }
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        const section = aboutContent.dataset.section;
        if (translations[lang].about[section]) {
            aboutContent.querySelector('.about-title').textContent = 
                translations[lang].about[section].title;
            const textEl = aboutContent.querySelector('.about-text');
            if (section === 'social') {
                return;
            }
            textEl.textContent = translations[lang].about[section].text;
        }
    }
    const galleryOverlay = document.querySelector('.gallery-overlay img');
    if (galleryOverlay) {
        galleryOverlay.alt = translations[lang].gallery.fullscreen;
    }
    quoteClickCount = 0;
}
function updateGalleryVisibility() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img.src && !img.src.endsWith('null') && !img.src.endsWith('undefined') && !img.src.endsWith('/')) {
            item.style.display = 'block';
            item.classList.add('has-image');
        } else {
            item.style.display = 'none';
            item.classList.remove('has-image');
        }
    });
}
window.addEventListener('load', () => {
    updateGalleryVisibility();
    initializeAnimations();
});
function toggleBackgroundWaves(show) {
    const waves = document.querySelector('.background-waves');
    if (waves) {
        waves.style.display = show ? 'block' : 'none';
    }
}
const songs = [
    {
        title: "Gül Pembe",
        artist: "Barış Manço",
        src: "assets/music/music1.mp3"
    },
    {
        title: "Dernière danse",
        artist: "Indila",
        src: "assets/music/music2.mp3"
    },
    {
        title: "drinks or coffee",
        artist: "ROSÉ",
        src: "assets/music/music3.mp3"
    }
];
let currentSong = 0;
let isPlaying = false;
const radioToggle = document.getElementById('radio-toggle');
const playerContainer = document.getElementById('player-container');
const audio = new Audio(songs[currentSong].src);
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const songProgress = document.getElementById('song-progress');
const volumeControl = document.getElementById('volume-control');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeIcon = document.getElementById('volume-icon');
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    songProgress.value = progress;
    currentTimeEl.textContent = formatTime(audio.currentTime);
});
audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});
volumeControl.addEventListener('input', (e) => {
    const value = e.target.value;
    audio.volume = value / 100;
    updateVolumeIcon(value);
});
function updateVolumeIcon(value) {
    volumeIcon.className = 'fas volume-icon';
    if (value == 0) volumeIcon.className += ' fa-volume-mute';
    else if (value < 33) volumeIcon.className += ' fa-volume-off';
    else if (value < 67) volumeIcon.className += ' fa-volume-down';
    else volumeIcon.className += ' fa-volume-up';
}
volumeIcon.addEventListener('click', () => {
    if (audio.volume > 0) {
        audio.volume = 0;
        volumeControl.value = 0;
    } else {
        audio.volume = 0.5;
        volumeControl.value = 50;
    }
    updateVolumeIcon(volumeControl.value);
});
radioToggle.addEventListener('click', () => {
    playerContainer.classList.toggle('active');
    radioToggle.classList.toggle('pulse');
});
function loadSong(index) {
    currentSong = index;
    audio.src = songs[currentSong].src;
    songTitle.textContent = songs[currentSong].title;
    songArtist.textContent = songs[currentSong].artist;
    if (isPlaying) {
        audio.play();
    }
}
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        radioToggle.classList.remove('pulse');
    } else {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        radioToggle.classList.add('pulse');
    }
    isPlaying = !isPlaying;
}
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
});
nextBtn.addEventListener('click', () => {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
});
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    songProgress.value = progress;
});
songProgress.addEventListener('input', (e) => {
    const time = (e.target.value / 100) * audio.duration;
    audio.currentTime = time;
});
volumeControl.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});
audio.addEventListener('ended', () => {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
});
loadSong(currentSong);
document.querySelectorAll('[data-page]').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
    });
});
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const overlay = document.querySelector('.gallery-overlay');
        const overlayImg = overlay.querySelector('img');
        const overlayVideo = overlay.querySelector('video');
        overlayImg.classList.remove('active');
        overlayVideo.classList.remove('active');
        overlayVideo.pause();
        if (item.classList.contains('video')) {
            const video = item.querySelector('video');
            overlayVideo.src = video.src;
            overlayVideo.classList.add('active');
            overlayVideo.play();
        } else {
            const img = item.querySelector('img');
            overlayImg.src = img.src;
            overlayImg.classList.add('active');
        }
        overlay.classList.add('active');
    });
});
document.querySelector('.gallery-overlay').addEventListener('click', () => {
    const overlay = document.querySelector('.gallery-overlay');
    const video = overlay.querySelector('video');
    if (video.classList.contains('active')) {
        video.pause();
    }
    overlay.classList.remove('active');
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const overlay = document.querySelector('.gallery-overlay');
        const video = overlay.querySelector('video');
        if (overlay.classList.contains('active')) {
            if (video.classList.contains('active')) {
                video.pause();
            }
            overlay.classList.remove('active');
        }
    }
});
function updateGalleryVisibility() {
    document.querySelectorAll('.gallery-item').forEach(item => {
        if (item.classList.contains('video')) {
            const video = item.querySelector('video');
            if (video.src && !video.src.endsWith('null') && !video.src.endsWith('undefined')) {
                item.style.display = 'block';
                item.classList.add('has-image');
            } else {
                item.style.display = 'none';
                item.classList.remove('has-image');
            }
        } else {
            const img = item.querySelector('img');
            if (img.src && !img.src.endsWith('null') && !img.src.endsWith('undefined') && !img.src.endsWith('/')) {
                item.style.display = 'block';
                item.classList.add('has-image');
            } else {
                item.style.display = 'none';
                item.classList.remove('has-image');
            }
        }
    });
}
window.addEventListener('load', () => {
    updateGalleryVisibility();
    initializeAnimations();
});
document.querySelectorAll('.gallery-item.video video').forEach(video => {
    video.addEventListener('loadedmetadata', function() {
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        const durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        video.parentElement.querySelector('.video-duration').textContent = durationText;
    });
    video.addEventListener('waiting', function() {
        video.parentElement.querySelector('.video-loading').style.display = 'block';
    });
    video.addEventListener('playing', function() {
        video.parentElement.querySelector('.video-loading').style.display = 'none';
    });
});

// Overlay videosuna event listener'lar ekle
document.querySelector('.gallery-overlay video').addEventListener('play', function() {
    const playButton = document.querySelector('.gallery-overlay .play-button');
    if (playButton) playButton.style.opacity = '0';
});

document.querySelector('.gallery-overlay video').addEventListener('pause', function() {
    const playButton = document.querySelector('.gallery-overlay .play-button');
    if (playButton) playButton.style.opacity = '1';
});

window.addEventListener('load', () => {
    updateGalleryVisibility();
    initializeAnimations();
});

document.addEventListener('DOMContentLoaded', () => {
    const mobileBBtn = document.querySelector('.mobile-b-btn');
    if (mobileBBtn) {
        mobileBBtn.style.display = 'none';
    }
    
    // Quote tıklama özelliğini ekle
    let quoteClickCount = 0;
    const quote = document.querySelector('.quote');
    const maxBrightness = 3;
    const maxTextShadow = 5; 
    
    quote.addEventListener('click', () => {
        quoteClickCount++;
        if (quoteClickCount <= 10) {
            const brightness = 1 + (quoteClickCount * 0.2);
            const glowSize = quoteClickCount * 0.5; 
            gsap.to(quote, {
                filter: `brightness(${brightness})`,
                textShadow: `0 0 ${glowSize}px rgba(255, 255, 255, 0.8)`,
                duration: 0.3,
                ease: "power2.out"
            });
            if (quoteClickCount === 10) {
                gsap.to(quote, {
                    filter: `brightness(${maxBrightness}) blur(5px)`,
                    textShadow: `0 0 ${maxTextShadow}px rgba(255, 255, 255, 0.8)`,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: () => {
                        const loveMessages = {
                            'tr': 'Sizi seviyorum <span class="heart-emoji">❤️</span>',
                            'en': 'I love all of you <span class="heart-emoji">❤️</span>',
                            'pl': 'Kocham was wszystkich <span class="heart-emoji">❤️</span>',
                            'de': 'Ich liebe euch alle <span class="heart-emoji">❤️</span>'
                        };
                        quote.innerHTML = loveMessages[currentLang];
                        gsap.to(quote, {
                            filter: `brightness(${maxBrightness}) blur(0px)`,
                            opacity: 1,
                            duration: 0.5,
                            ease: "power2.in"
                        });
                    }
                });
            }
        } else if (quoteClickCount <= 20) {
            const remainingClicks = 20 - quoteClickCount;
            const brightness = 1 + (remainingClicks * 0.2);
            const glowSize = remainingClicks * 0.5;
            gsap.to(quote, {
                filter: `brightness(${brightness})`,
                textShadow: `0 0 ${glowSize}px rgba(255, 255, 255, 0.8)`,
                duration: 0.3,
                ease: "power2.out"
            });
            if (quoteClickCount === 20) {
                gsap.to(quote, {
                    filter: 'brightness(1) blur(5px)',
                    textShadow: '0 0 0px rgba(255, 255, 255, 0.8)',
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: () => {
                        quote.textContent = translations[currentLang].hero.quote;
                        gsap.to(quote, {
                            filter: 'brightness(1) blur(0px)',
                            opacity: 1,
                            textShadow: '0 0 0px rgba(255, 255, 255, 0.8)',
                            duration: 0.5,
                            ease: "power2.in"
                        });
                        quoteClickCount = 0;
                    }
                });
            }
        }
    });

    quote.addEventListener('mouseenter', () => {
        if (quoteClickCount < 10) {
            gsap.to(quote, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });

    quote.addEventListener('mouseleave', () => {
        if (quoteClickCount < 10) {
            gsap.to(quote, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
});