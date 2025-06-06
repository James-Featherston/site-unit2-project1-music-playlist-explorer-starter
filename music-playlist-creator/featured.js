/*
Loads the DOM and entry into program
*/
document.addEventListener("DOMContentLoaded", () => {
    loadAllDOM()
})

/*
Randomly selects a playlist and calls the necessary functions to display it
*/
const loadAllDOM = () => {
    let playlistIdx = Math.floor(Math.random() * (data.length))
    console.log(playlistIdx)
    let playlist = data[playlistIdx]
    setUpPlaylist(playlist)
    getSongs(playlist)
}

/*
Input: Playlist Object
Result: The playlist display contains the correct information
*/
const setUpPlaylist = (playlist) => {
    const playlistImgEl = document.querySelector("#featured-playlist-img")
    const playlistTitleEl = document.querySelector("#featured-playlist-title")
    const playlistCreatorEl = document.querySelector("#featured-playlist-author")
    playlistTitleEl.textContent = playlist.playlistName
    playlistCreatorEl.textContent = playlist.playlistAuthor
    playlistImgEl.src = playlist.playlistArt
}

/*
Input: Playlist Object
Result: Removes old songs and adds the new ones for the specific playlist
*/
const getSongs = (playlist) => {
    let songContainer = document.querySelector("#featured-song-card")
    const elementsToClear = songContainer.querySelectorAll('.modal-song-container')

    elementsToClear.forEach( element => {
        element.remove()
    })

    for (const songIdx of playlist.songs) {
        const el = createSongElement(songIdx)
        songContainer.appendChild(el)
    }
}

/*
Input: Song index in songs array
Output: A song element
*/
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
