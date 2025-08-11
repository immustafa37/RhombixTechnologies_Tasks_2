document.addEventListener('DOMContentLoaded', function() {
    // Sample song data
    const songs = [
        {
            title: "Blinding Lights",
            artist: "The Weeknd",
            category: "pop",
            duration: "3:20",
            cover: "https://i.scdn.co/image/ab67616d00001e02e1a6e5d3b6a3a0c3a0e0e0e0",
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        },
        {
            title: "Bohemian Rhapsody",
            artist: "Queen",
            category: "rock",
            duration: "5:55",
            cover: "https://i.scdn.co/image/ab67616d00001e02e1a6e5d3b6a3a0c3a0e0e0e0",
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        },
        {
            title: "Take Five",
            artist: "Dave Brubeck",
            category: "jazz",
            duration: "5:24",
            cover: "https://i.scdn.co/image/ab67616d00001e02e1a6e5d3b6a3a0c3a0e0e0e0",
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
        },
        {
            title: "Starboy",
            artist: "The Weeknd, Daft Punk",
            category: "electronic",
            duration: "3:50",
            cover: "https://i.scdn.co/image/ab67616d00001e02e1a6e5d3b6a3a0c3a0e0e0e0",
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
        },
        {
            title: "Shape of You",
            artist: "Ed Sheeran",
            category: "pop",
            duration: "3:53",
            cover: "https://i.scdn.co/image/ab67616d00001e02e1a6e5d3b6a3a0c3a0e0e0e0",
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
        },
        {
            title: "Sweet Child O'Mine",
            artist: "Guns N' Roses",
            category: "rock",
            duration: "5:56",
            cover: "https://i.scdn.co/image/ab67616d00001e02e1a6e5d3b6a3a0c3a0e0e0e0",
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
        }
    ];

    // DOM Elements
    const audioPlayer = new Audio();
    let currentSongIndex = 0;
    let isPlaying = false;
    let playlist = JSON.parse(localStorage.getItem('playlist')) || [];
    
    const songListElement = document.getElementById('song-list');
    const playlistSongsElement = document.getElementById('playlist-songs');
    const currentSongTitle = document.getElementById('current-song-title');
    const currentSongArtist = document.getElementById('current-song-artist');
    const currentSongImg = document.getElementById('current-song-img');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeElement = document.getElementById('current-time');
    const durationElement = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const categories = document.querySelectorAll('.category');
    const addSongInput = document.getElementById('new-song');
    const addSongBtn = document.getElementById('add-song-btn');

    // Initialize the app
    function init() {
        renderSongList(songs);
        renderPlaylist();
        setupEventListeners();
    }

    // Render the song list
    function renderSongList(songsToRender) {
        songListElement.innerHTML = '';
        
        songsToRender.forEach((song, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;
            
            li.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div class="song-details">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
                <span class="song-duration">${song.duration}</span>
            `;
            
            li.addEventListener('click', () => playSong(index, songs));
            songListElement.appendChild(li);
        });
    }

    // Render the playlist
    function renderPlaylist() {
        playlistSongsElement.innerHTML = '';
        
        if (playlist.length === 0) {
            playlistSongsElement.innerHTML = '<li>Your playlist is empty</li>';
            return;
        }
        
        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;
            
            li.innerHTML = `
                <span>${song.title} - ${song.artist}</span>
                <button class="remove-song"><i class="fas fa-trash"></i></button>
            `;
            
            const removeBtn = li.querySelector('.remove-song');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFromPlaylist(index);
            });
            
            li.addEventListener('click', () => playSong(index, playlist));
            playlistSongsElement.appendChild(li);
        });
    }

    // Play a song
    function playSong(index, songArray) {
        currentSongIndex = index;
        const song = songArray[index];
        
        audioPlayer.src = song.audio;
        currentSongTitle.textContent = song.title;
        currentSongArtist.textContent = song.artist;
        currentSongImg.src = song.cover;
        
        if (isPlaying) {
            audioPlayer.play();
        }
        
        // Update active song in UI
        updateActiveSongUI(index, songArray);
    }

    // Update active song in UI
    function updateActiveSongUI(index, songArray) {
        // Clear active class from all songs
        document.querySelectorAll('#song-list li, #playlist-songs li').forEach(li => {
            li.classList.remove('active');
        });
        
        // Add active class to current song
        if (songArray === songs) {
            document.querySelector(`#song-list li[data-index="${index}"]`)?.classList.add('active');
        } else {
            document.querySelector(`#playlist-songs li[data-index="${index}"]`)?.classList.add('active');
        }
    }

    // Toggle play/pause
    function togglePlay() {
        if (audioPlayer.src) {
            if (isPlaying) {
                audioPlayer.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                audioPlayer.play();
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
            isPlaying = !isPlaying;
        } else if (playlist.length > 0) {
            playSong(0, playlist);
            togglePlay();
        } else if (songs.length > 0) {
            playSong(0, songs);
            togglePlay();
        }
    }

    // Play next song
    function playNext() {
        let nextIndex = currentSongIndex + 1;
        
        if (audioPlayer.src) {
            // Determine which list we're playing from
            const currentSrc = audioPlayer.src;
            const currentList = playlist.some(song => song.audio === currentSrc) ? playlist : songs;
            
            if (nextIndex >= currentList.length) {
                nextIndex = 0; // Loop back to start
            }
            
            playSong(nextIndex, currentList);
            if (isPlaying) {
                audioPlayer.play();
            }
        }
    }

    // Play previous song
    function playPrev() {
        let prevIndex = currentSongIndex - 1;
        
        if (audioPlayer.src) {
            // Determine which list we're playing from
            const currentSrc = audioPlayer.src;
            const currentList = playlist.some(song => song.audio === currentSrc) ? playlist : songs;
            
            if (prevIndex < 0) {
                prevIndex = currentList.length - 1; // Go to end
            }
            
            playSong(prevIndex, currentList);
            if (isPlaying) {
                audioPlayer.play();
            }
        }
    }

    // Update progress bar
    function updateProgress() {
        const { currentTime, duration } = audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Update time display
        currentTimeElement.textContent = formatTime(currentTime);
        if (duration) {
            durationElement.textContent = formatTime(duration);
        }
    }

    // Set progress when clicked on progress bar
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    }

    // Format time (seconds to MM:SS)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Set volume
    function setVolume() {
        audioPlayer.volume = this.value;
    }

    // Search songs
    function searchSongs() {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (searchTerm === '') {
            renderSongList(songs);
            return;
        }
        
        const filteredSongs = songs.filter(song => 
            song.title.toLowerCase().includes(searchTerm) || 
            song.artist.toLowerCase().includes(searchTerm)
        );
        
        renderSongList(filteredSongs);
    }

    // Filter by category
    function filterByCategory() {
        const category = this.dataset.category;
        
        // Update active category in UI
        categories.forEach(cat => cat.classList.remove('active'));
        this.classList.add('active');
        
        if (category === 'all') {
            renderSongList(songs);
            return;
        }
        
        const filteredSongs = songs.filter(song => song.category === category);
        renderSongList(filteredSongs);
    }

    // Add song to playlist
    function addToPlaylist() {
        const songUrl = addSongInput.value.trim();
        
        if (!songUrl) return;
        
        // Find song in main list
        const songToAdd = songs.find(song => song.audio === songUrl);
        
        if (songToAdd) {
            // Check if already in playlist
            if (!playlist.some(song => song.audio === songUrl)) {
                playlist.push(songToAdd);
                localStorage.setItem('playlist', JSON.stringify(playlist));
                renderPlaylist();
                addSongInput.value = '';
            } else {
                alert('This song is already in your playlist!');
            }
        } else {
            // Allow adding custom songs (just URL)
            playlist.push({
                title: 'Custom Song',
                artist: 'Unknown',
                category: 'custom',
                duration: '0:00',
                cover: 'https://via.placeholder.com/150',
                audio: songUrl
            });
            localStorage.setItem('playlist', JSON.stringify(playlist));
            renderPlaylist();
            addSongInput.value = '';
        }
    }

    // Remove from playlist
    function removeFromPlaylist(index) {
        playlist.splice(index, 1);
        localStorage.setItem('playlist', JSON.stringify(playlist));
        
        // If we removed the currently playing song, stop playback
        if (audioPlayer.src && playlist.every(song => song.audio !== audioPlayer.src)) {
            audioPlayer.pause();
            isPlaying = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            currentSongTitle.textContent = 'No song selected';
            currentSongArtist.textContent = 'Select a song to play';
            currentSongImg.src = 'https://via.placeholder.com/150';
        }
        
        renderPlaylist();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Player controls
        playBtn.addEventListener('click', togglePlay);
        nextBtn.addEventListener('click', playNext);
        prevBtn.addEventListener('click', playPrev);
        progressBar.addEventListener('click', setProgress);
        volumeSlider.addEventListener('input', setVolume);
        
        // Audio events
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('ended', playNext);
        
        // Search and filter
        searchInput.addEventListener('input', searchSongs);
        searchBtn.addEventListener('click', searchSongs);
        categories.forEach(category => {
            category.addEventListener('click', filterByCategory);
        });
        
        // Playlist
        addSongBtn.addEventListener('click', addToPlaylist);
        addSongInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addToPlaylist();
        });
    }

    // Initialize the app
    init();
});