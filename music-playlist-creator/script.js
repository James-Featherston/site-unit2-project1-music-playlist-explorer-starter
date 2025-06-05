// Load playlists

const loadPlaylists = () => {
    let playlistsList = document.querySelector("#playlist-cards")
    for (const playlist of data) {
        const el = createPlaylistElement(playlist)
        playlistsList.appendChild(el)
        //Add an event listener for each heart button
        createHeart(playlist.playlistID, playlist.likes)
    }
}

// Make sure the DOM content is loaded
// Call the load playlists method
document.addEventListener("DOMContentLoaded", () => {
    loadPlaylists()
})


// Create a playlist element and return it


const createPlaylistElement = (playlist) => {
    const playlistEl = document.createElement("article")
    playlistEl.className = "playlist-card"
    playlistEl.innerHTML = `
        <img class="playlist-image" src="${playlist.playlistArt}" alt="">
        <h4 style="margin:0px">${playlist.playlistName}</h4>
        <p style="margin:4px">${playlist.playlistAuthor}</p>
        <div class="like-function">
            <button id="heart" class="heart">
                <i id="heart${playlist.playlistID}"class="material-symbols-outlined">
                    favorite
                </i>
            </button>
            <div id="heart-text-container">
                <p id="heart-text${playlist.playlistID}" class="heart-text">${playlist.likes}</p>
            </div>
        </div>
    `
    // Add modal event listener to each playlist element
    playlistEl.addEventListener("click", () => {
        updateModalDisplay(playlist)
        openModal()
    })
    
    return playlistEl
}

// Create a function to update the modal
const updateModalDisplay = (playlist) => {
    const playlistImgEl = document.querySelector("#modal-playlist-image")
    const playlistTitleEl = document.querySelector("#modal-playlist-title")
    const playlistCreatorEl = document.querySelector("#modal-playlist-creator")
    playlistTitleEl.textContent = playlist.playlistName
    playlistCreatorEl.textContent = playlist.playlistAuthor
    playlistImgEl.src = playlist.playlistArt


    for (const songIdx of playlist.songs) {
        console.log(songIdx)
        const el = createSongElement(songIdx)
    }

}

// Creates a song element from the playlist opened by modal
const createSongElement = (songIdx) => {
    const song = songs[songIdx]
    const songImg = document.querySelector(".modal-song-img")
    const songTitle = document.querySelector("#modal-song-title")
    const songArtist = document.querySelector("#modal-song-artist")
    const songAlbum = document.querySelector("#modal-song-album")
    const songTime = document.querySelector("#modal-song-time")
    songImg.src = song.songImg
    songTitle.textContent = song.songTitle
    songArtist.textContent = song.songArtist
    songAlbum.textContent = song.songAlbum
    songTime.textContent = song.songTime

}

// Function to open the modal on click
const openModal = () => {
    const modal = document.querySelector(".modal")
    const span = document.querySelector(".close")
    modal.style.display = "flex"
    span.onclick = () => {
    modal.style.display = "none";
    }
    window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    }
}

const createHeart = (playlistID, likes) => {
    const heartEl = document.querySelector(`#heart${playlistID}`)
    const likesEl = document.querySelector(`#heart-text${playlistID}`)
    let clicked = false
    let totalLikes = likes
    heartEl.addEventListener("click", (event) => {
        event.stopPropagation()
        console.log("heart clicked")
        if (!clicked) {
            heartEl.style["-webkit-text-fill-color"] = "red"    
            totalLikes += 1
        } else {
            heartEl.style["-webkit-text-fill-color"] = "white"
            totalLikes -= 1
        }
        clicked = !clicked
        likesEl.textContent = totalLikes
    })
}
