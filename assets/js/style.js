// 1. Render Songs
// 2. Scroll Top
// 3. Play / pause / seeks
// 4. CD Rotote
// 5. Next / prev
// 6. random
// 7. Next / repeat when ended 
// 8. Active Song
// 9. Scroll active song into view.
// 10. Play song when click

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const header = $('header h2');
const cdThumb = $('.cd-thumb');
const cdAudio = $('#audio');
const play = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const btnNext = $('.btn-next');
const btnPrev = $('.btn-prev');
const cd = $('.cd');
const playlist = $('.playlist');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [{
            name: 'Độ Tộc 2',
            singer: 'Masew , Độ mixi , Pháo',
            path: '/assets/musics/song1.mp3',
            image: '/assets/images/song1.jpg'
        },
        {
            name: 'Cưới Thôi',
            singer: 'Masew',
            path: '/assets/musics/song2.mp3',
            image: '/assets/images/song2.jpg'
        },
        {
            name: 'Sài Gòn Đau Lòng Quá',
            singer: 'Hứa Kim Tuyền, Hoàng Duyên',
            path: '/assets/musics/song3.mp3',
            image: '/assets/images/song3.jpg'
        },
        {
            name: '3107-3',
            singer: 'Nâu',
            path: '/assets/musics/song4.mp3',
            image: '/assets/images/song4.jpg'
        },
        {
            name: 'I Love You',
            singer: 'クリス・ハート',
            path: '/assets/musics/song5.mp3',
            image: '/assets/images/song5.jpg'
        },
        {
            name: '3107-2',
            singer: 'Nâu',
            path: '/assets/musics/song6.mp3',
            image: '/assets/images/song6.jpg'
        },
        {
            name: 'Tháng Năm',
            singer: 'Soobin Hoàng Sơn',
            path: '/assets/musics/song7.mp3',
            image: '/assets/images/song7.jpg'
        }
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
                </div>`
        })

        playlist.innerHTML = htmls.join('');

    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })

    },
    loadCurrentSong: function() {
        header.textContent = this.currentSong.name;

        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        cdAudio.src = this.currentSong.path;
    },

    handlerEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // xử lý CD bài hát quay
        const cdImage = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // quay trong 10s
            iterations: Infinity
        })
        cdImage.pause();
        // xử lý phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scroolTop = window.scrollY || document.documentElement.scrollTop
            const newWitdh = cdWidth - scroolTop;
            cd.style.width = newWitdh > 0 ? newWitdh + 'px' : 0;
            cd.style.opacity = newWitdh / cdWidth;
        }

        // xử lý khi click play 
        play.onclick = function(a) {
                if (_this.isPlaying) {
                    cdAudio.pause();
                } else {
                    cdAudio.play();
                }
            }
            //     // khi song đc play
        cdAudio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdImage.play()
        }
        cdAudio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing');
            cdImage.pause()
        }

        // khi tiến độ bài hát chạy tinhs ra phần trăm của bài hát
        cdAudio.ontimeupdate = function() {
            if (cdAudio.duration) {
                const progressPercent = Math.floor(cdAudio.currentTime / cdAudio.duration * 100)
                progress.value = progressPercent;
            }

        }

        // xử lý tua bài hát
        progress.onchange = function(e) {
            const seekTime = cdAudio.duration / 100 * e.target.value
            cdAudio.currentTime = seekTime;
        }

        // xử lý next bài hát
        btnNext.onclick = function() {
            _this.nextSong();
            cdAudio.play();
            _this.render()
            _this.scrollToActiveSong()
        }
        btnPrev.onclick = function() {
                _this.prevSong();
                cdAudio.play();
                _this.render()
                _this.scrollToActiveSong()
            }
            // randomBtn.onclick = function(e) {
            //     _this.isRandom = !_this.isRandom
            //     randomBtn.classList.toggle('active', _this.isRandom);
            //     _this.randomSong();
            // }

        // xử lý next khi audio het 
        cdAudio.onended = function() {
                if (_this.isRepeat) {
                    cdAudio.play();
                } else {
                    btnNext.click();
                }

            }
            // xử lý phát lại 1 bài hát 
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // play when click bài hát

        playlist.onclick = function(e) {
            const targetAtr = e.target.closest('.song:not(.active)')
            if (targetAtr || e.target.closest('.option')) {
                if (targetAtr) {
                    _this.currentIndex = Number(targetAtr.dataset.index);
                    _this.loadCurrentSong();
                    _this.render()
                    cdAudio.play();


                }

            }
        }

    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 500)
    },
    nextSong: function() {

        this.currentIndex++
            console.log(this.currentIndex, this.songs.length)
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()

    },
    prevSong: function() {
        this.currentIndex--
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
        this.loadCurrentSong()
    },
    // randomSong: function() {
    //     let newIndex;
    //     do {
    //         this.currentIndex = Math.floor(Math.random() * this.songs.length)
    //     } while (newIndex !== this.currentIndex);
    //     console.log(newIndex);



    // },
    repeatSong: function() {

    },

    start: function() {
        this.repeatSong();
        // this.randomSong();
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();
        // Lắng nghe/ xử lý các sự kiện
        this.handlerEvents();
        // Tải thông tin bài hát đầu tiên vào trong UI
        this.loadCurrentSong();
        // Render playList
        this.render();
        this.nextSong();
        this.prevSong();

    }
}
app.start();