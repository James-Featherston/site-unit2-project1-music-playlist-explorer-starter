// Load playlists

const loadAllDOM = () => {
    let playlistIdx = Math.floor(Math.random() * (data.length))
    console.log(playlistIdx)
    let playlist = data[playlistIdx]
    setUpPlaylist(playlist)
    getSongs(playlist)
}

// Make sure the DOM content is loaded
// Call the load playlists method
document.addEventListener("DOMContentLoaded", () => {
    loadAllDOM()
})

const setUpPlaylist = (playlist) => {
    const playlistImgEl = document.querySelector("#featured-playlist-img")
    const playlistTitleEl = document.querySelector("#featured-playlist-title")
    const playlistCreatorEl = document.querySelector("#featured-playlist-author")
    playlistTitleEl.textContent = playlist.playlistName
    playlistCreatorEl.textContent = playlist.playlistAuthor
    playlistImgEl.src = playlist.playlistArt
}

const getSongs = (playlist) => {
    let songContainer = document.querySelector("#featured-song-card")
    const elementsToClear = songContainer.querySelectorAll('.modal-song-container')

    elementsToClear.forEach( element => {
        element.remove()
    })

    for (const songIdx of playlist.songs) {
        console.log(songIdx)
        const el = createSongElement(songIdx)
        songContainer.appendChild(el)
    }
}

const createSongElement = (songIdx) => {
    const song = songs[songIdx]
    const songEl = document.createElement("article")
    songEl.className = "modal-song-container"
    songEl.innerHTML = `
        <img class="modal-song-img" src="${song.songImg}" alt="">
        <section id="modal-song-content">
            <h4 id="modal-song-title" class="no-mg">${song.songTitle}</h4>
            <p id="modal-song-artist" class="no-mg txt-14" >${song.songArtist}</p>
            <p id="modal-song-album" class="no-mg txt-14">${song.songAlbum}</p>
        </section>
        <h4 id="modal-song-time">${song.songTime}</h4>
    `
    return songEl
}
