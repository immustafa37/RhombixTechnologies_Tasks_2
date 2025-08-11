document.addEventListener('DOMContentLoaded', function () {
    // Sample songs data
    const songs = [
        {
            id: 1,
            title: "Kebhi Kebhi",
            artist: "AUR",
            category: "pop",
            url: "assets/songs/default-song.mp3",
            img: "assets/images/default-song.png"
        },
        {
            id: 2,
            title: "Do Pall",
            artist: "Surinder Kaur",
            category: "rock",
            url: "assets/songs/default-song-2.mp3",
            img: "assets/images/default-song-2.jpg"
        }
    ];

    // DOM elements
    const playlistElement = document.getElementById('playlist');
    const songListElement = document.getElementById('song-list');
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const skipForwardBtn = document.getElementById('skip-forward-btn');
    const skipBackwardBtn = document.getElementById('skip-backward-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeElement = document.getElementById('current-time');
    const durationElement = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');
    const currentSongTitle = document.getElementById('current-song-title');
    const currentSongArtist = document.getElementById('current-song-artist');
    const currentSongImg = document.getElementById('current-song-img');
    const addSongBtn = document.getElementById('add-song-btn');
    const modal = document.getElementById('add-song-modal');
    const closeBtn = document.querySelector('.close-btn');
    const addSongForm = document.getElementById('add-song-form');
    const songFileInput = document.getElementById('song-file');
    const songImageInput = document.getElementById('song-image');
    const songUrlInput = document.getElementById('song-url');
    const imageUrlInput = document.getElementById('image-url');

    // Audio
    const audio = new Audio();
    let currentSongIndex = -1;
    let playlist = [];
    let isPlaying = false;

    function init() {
        renderSongList(songs);
        setupEventListeners();
    }

    function renderSongList(songsToRender) {
        songListElement.innerHTML = '';
        songsToRender.forEach(song => {
            const songCard = document.createElement('div');
            songCard.className = 'song-card';
            songCard.innerHTML = `
                <img src="${song.img}" alt="${song.title}">
                <div class="song-card-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist} • ${song.category.charAt(0).toUpperCase() + song.category.slice(1)}</p>
                </div>
            `;
            songCard.addEventListener('click', () => addToPlaylist(song));
            songListElement.appendChild(songCard);
        });
    }

    function renderPlaylist() {
        playlistElement.innerHTML = '';
        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            if (index === currentSongIndex) li.classList.add('active');
            li.innerHTML = `
                <span>${song.title} - ${song.artist}</span>
                <button class="remove-btn icon-btn" data-id="${song.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            li.addEventListener('click', () => playSong(index));
            li.querySelector('.remove-btn').addEventListener('click', e => {
                e.stopPropagation();
                removeFromPlaylist(song.id);
            });
            playlistElement.appendChild(li);
        });
    }

    function addToPlaylist(song) {
        if (!playlist.some(s => s.id === song.id)) {
            playlist.push(song);
            renderPlaylist();
            if (playlist.length === 1) playSong(0);
        }
    }

    function removeFromPlaylist(songId) {
        const songIndex = playlist.findIndex(song => song.id === songId);
        if (songIndex !== -1) {
            if (songIndex === currentSongIndex && isPlaying) pauseSong();
            playlist = playlist.filter(song => song.id !== songId);
            renderPlaylist();
        }
    }

    function playSong(index) {
        if (index >= 0 && index < playlist.length) {
            currentSongIndex = index;
            const song = playlist[currentSongIndex];
            audio.src = song.url;
            audio.play().then(() => {
                isPlaying = true;
                updatePlayerInfo(song);
                renderPlaylist();
                updatePlayButton();
            });
        }
    }

    function pauseSong() {
        audio.pause();
        isPlaying = false;
        updatePlayButton();
    }

    function playNextSong() {
        if (playlist.length > 0) {
            playSong((currentSongIndex + 1) % playlist.length);
        }
    }

    function playPrevSong() {
        if (playlist.length > 0) {
            playSong((currentSongIndex - 1 + playlist.length) % playlist.length);
        }
    }

    function skipForward() {
        audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
    }

    function skipBackward() {
        audio.currentTime = Math.max(audio.currentTime - 10, 0);
    }

    function updatePlayerInfo(song) {
        currentSongTitle.textContent = song ? song.title : 'No song selected';
        currentSongArtist.textContent = song ? song.artist : '-';
        currentSongImg.src = song ? song.img : 'assets/default-song.png';
    }

    function updatePlayButton() {
        const icon = playBtn.querySelector('i');
        if (isPlaying) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
    }

    function updateProgress() {
        if (audio.duration) {
            progressBar.value = (audio.currentTime / audio.duration) * 100;
            currentTimeElement.textContent = formatTime(audio.currentTime);
            durationElement.textContent = formatTime(audio.duration);
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function setProgress() {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    }

    function filterSongs() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categorySelect.value;
        let filteredSongs = songs;
        if (category !== 'all') filteredSongs = filteredSongs.filter(song => song.category === category);
        if (searchTerm) {
            filteredSongs = filteredSongs.filter(song =>
                song.title.toLowerCase().includes(searchTerm) ||
                song.artist.toLowerCase().includes(searchTerm)
            );
        }
        renderSongList(filteredSongs);
    }

    function handleAddSong(e) {
        e.preventDefault();
        const title = document.getElementById('song-title').value;
        const artist = document.getElementById('song-artist').value;
        const category = document.getElementById('song-category').value;

        const isWebTabActive = document.querySelector('.tab-btn[data-tab="web-tab"]').classList.contains('active');

        let audioURL, imageURL;

        if (isWebTabActive) {
            audioURL = songUrlInput.value;
            imageURL = imageUrlInput.value || 'assets/default-song.png';
            if (!audioURL) {
                alert('Please enter an audio URL');
                return;
            }
        } else {
            const audioFile = songFileInput.files[0];
            if (!audioFile) {
                alert('Please select an audio file');
                return;
            }
            audioURL = URL.createObjectURL(audioFile);
            const imageFile = songImageInput.files[0];
            imageURL = imageFile ? URL.createObjectURL(imageFile) : 'assets/default-song.png';
        }

        const newSong = {
            id: Date.now(),
            title,
            artist,
            category,
            url: audioURL,
            img: imageURL
        };

        songs.push(newSong);
        addToPlaylist(newSong);
        filterSongs();
        addSongForm.reset();
        modal.style.display = 'none';
    }

    function setupEventListeners() {
        playBtn.addEventListener('click', () => {
            if (!playlist.length) return;
            isPlaying ? pauseSong() : (currentSongIndex === -1 ? playSong(0) : audio.play());
        });

        nextBtn.addEventListener('click', playNextSong);
        prevBtn.addEventListener('click', playPrevSong);
        skipForwardBtn.addEventListener('click', skipForward);
        skipBackwardBtn.addEventListener('click', skipBackward);

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', playNextSong);
        progressBar.addEventListener('input', setProgress);

        volumeSlider.addEventListener('input', () => {
            audio.volume = volumeSlider.value;
        });

        searchInput.addEventListener('input', filterSongs);
        categorySelect.addEventListener('change', filterSongs);

        addSongBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        addSongForm.addEventListener('submit', handleAddSong);

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
                this.classList.add('active');
                document.getElementById(this.getAttribute('data-tab')).classList.add('active');
            });
        });
    }

    init();
});