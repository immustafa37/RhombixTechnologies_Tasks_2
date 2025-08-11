document.addEventListener('DOMContentLoaded', function() {
    // Sample songs data
    const songs = [
        {
            id: 1,
            title: "Blinding Lights",
            artist: "The Weeknd",
            category: "pop",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            img: "https://i.scdn.co/image/ab67616d00001e02a935e865c6d5a8c5a5e0d669"
        },
        {
            id: 2,
            title: "Bohemian Rhapsody",
            artist: "Queen",
            category: "rock",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            img: "https://i.scdn.co/image/ab67616d00001e02e8b066f70c206551210d902b"
        },
        {
            id: 3,
            title: "Take Five",
            artist: "Dave Brubeck",
            category: "jazz",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            img: "https://i.scdn.co/image/ab67616d00001e02a3a0e1d5a5c0e8b8e0b5f5e5"
        },
        {
            id: 4,
            title: "Moonlight Sonata",
            artist: "Beethoven",
            category: "classical",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            img: "https://i.scdn.co/image/ab67616d00001e02b5b5b5b5b5b5b5b5b5b5b5b5"
        },
        {
            id: 5,
            title: "Shape of You",
            artist: "Ed Sheeran",
            category: "pop",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
            img: "https://i.scdn.co/image/ab67616d00001e02a3a0e1d5a5c0e8b8e0b5f5e5"
        },
        {
            id: 6,
            title: "Sweet Child O' Mine",
            artist: "Guns N' Roses",
            category: "rock",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
            img: "https://i.scdn.co/image/ab67616d00001e02e8b066f70c206551210d902b"
        }
    ];

    // DOM Elements
    const playlistElement = document.getElementById('playlist');
    const songListElement = document.getElementById('song-list');
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const currentSongTitle = document.getElementById('current-song-title');
    const currentSongArtist = document.getElementById('current-song-artist');
    const currentSongImg = document.getElementById('current-song-img');
    const addSongBtn = document.getElementById('add-song-btn');
    const modal = document.getElementById('add-song-modal');
    const closeBtn = document.querySelector('.close-btn');
    const addSongForm = document.getElementById('add-song-form');

    // Audio element
    const audio = new Audio();
    let currentSongIndex = -1;
    let playlist = [];
    let isPlaying = false;

    // Initialize the app
    function init() {
        renderSongList(songs);
        setupEventListeners();
    }

    // Render the main song list
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

    // Render the playlist
    function renderPlaylist() {
        playlistElement.innerHTML = '';
        
        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            if (index === currentSongIndex) {
                li.classList.add('active');
            }
            li.innerHTML = `
                <span>${song.title} - ${song.artist}</span>
                <button class="remove-btn icon-btn" data-id="${song.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            li.addEventListener('click', () => playSong(index));
            
            const removeBtn = li.querySelector('.remove-btn');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFromPlaylist(song.id);
            });
            
            playlistElement.appendChild(li);
        });
    }

    // Add song to playlist
    function addToPlaylist(song) {
        if (!playlist.some(s => s.id === song.id)) {
            playlist.push(song);
            renderPlaylist();
            
            // If this is the first song added, play it automatically
            if (playlist.length === 1) {
                playSong(0);
            }
        }
    }

    // Remove song from playlist
    function removeFromPlaylist(songId) {
        const songIndex = playlist.findIndex(song => song.id === songId);
        
        if (songIndex !== -1) {
            // If we're removing the currently playing song
            if (songIndex === currentSongIndex) {
                if (isPlaying) {
                    pauseSong();
                }
                
                // If it's the last song in playlist
                if (playlist.length === 1) {
                    currentSongIndex = -1;
                    updatePlayerInfo(null);
                } 
                // If it's not the last song, play the next one
                else if (currentSongIndex === playlist.length - 1) {
                    currentSongIndex = 0;
                    playSong(currentSongIndex);
                } else {
                    playSong(currentSongIndex);
                }
            } 
            // If we're removing a song before the current one, adjust the index
            else if (songIndex < currentSongIndex) {
                currentSongIndex--;
            }
            
            playlist = playlist.filter(song => song.id !== songId);
            renderPlaylist();
        }
    }

    // Play a song from the playlist
    function playSong(index) {
        if (index >= 0 && index < playlist.length) {
            currentSongIndex = index;
            const song = playlist[currentSongIndex];
            
            audio.src = song.url;
            audio.play()
                .then(() => {
                    isPlaying = true;
                    updatePlayerInfo(song);
                    renderPlaylist();
                    updatePlayButton();
                })
                .catch(error => {
                    console.error('Error playing song:', error);
                });
        }
    }

    // Pause the current song
    function pauseSong() {
        audio.pause();
        isPlaying = false;
        updatePlayButton();
    }

    // Play the next song
    function playNextSong() {
        if (playlist.length > 0) {
            const nextIndex = (currentSongIndex + 1) % playlist.length;
            playSong(nextIndex);
        }
    }

    // Play the previous song
    function playPrevSong() {
        if (playlist.length > 0) {
            const prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
            playSong(prevIndex);
        }
    }

    // Update player info display
    function updatePlayerInfo(song) {
        if (song) {
            currentSongTitle.textContent = song.title;
            currentSongArtist.textContent = song.artist;
            currentSongImg.src = song.img || 'https://via.placeholder.com/50';
        } else {
            currentSongTitle.textContent = 'No song selected';
            currentSongArtist.textContent = '-';
            currentSongImg.src = 'https://via.placeholder.com/50';
        }
    }

    // Update play/pause button
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

    // Filter songs based on search and category
    function filterSongs() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categorySelect.value;
        
        let filteredSongs = songs;
        
        // Filter by category
        if (category !== 'all') {
            filteredSongs = filteredSongs.filter(song => song.category === category);
        }
        
        // Filter by search term
        if (searchTerm) {
            filteredSongs = filteredSongs.filter(song => 
                song.title.toLowerCase().includes(searchTerm) || 
                song.artist.toLowerCase().includes(searchTerm)
            );
        }
        
        renderSongList(filteredSongs);
    }

    // Setup event listeners
    function setupEventListeners() {
        // Player controls
        playBtn.addEventListener('click', () => {
            if (playlist.length === 0) return;
            
            if (isPlaying) {
                pauseSong();
            } else {
                if (currentSongIndex === -1) {
                    playSong(0);
                } else {
                    audio.play()
                        .then(() => {
                            isPlaying = true;
                            updatePlayButton();
                        });
                }
            }
        });
        
        nextBtn.addEventListener('click', playNextSong);
        prevBtn.addEventListener('click', playPrevSong);
        
        // Volume control
        volumeSlider.addEventListener('input', () => {
            audio.volume = volumeSlider.value;
        });
        
        // Song ended
        audio.addEventListener('ended', playNextSong);
        
        // Search and filter
        searchInput.addEventListener('input', filterSongs);
        categorySelect.addEventListener('change', filterSongs);
        
        // Modal controls
        addSongBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Add song form
        addSongForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newSong = {
                id: Date.now(), // Simple unique ID
                title: document.getElementById('song-title').value,
                artist: document.getElementById('song-artist').value,
                category: document.getElementById('song-category').value,
                url: document.getElementById('song-url').value,
                img: 'https://via.placeholder.com/150'
            };
            
            songs.push(newSong);
            addToPlaylist(newSong);
            filterSongs();
            
            // Reset form
            addSongForm.reset();
            modal.style.display = 'none';
        });
    }

    // Initialize the app
    init();
});