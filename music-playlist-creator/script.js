// Load playlists

const loadAllDOM = () => {
    let playlistsList = document.querySelector("#playlist-cards")
    for (const playlist of data) {
        const el = createPlaylistElement(playlist)
        playlistsList.appendChild(el)
        //Add an event listener for each heart button
        createHeart(playlist)
    }

    const shuffle = document.querySelector("#shuffle-button")

}

// Make sure the DOM content is loaded
// Call the load playlists method
document.addEventListener("DOMContentLoaded", () => {
    loadAllDOM()
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

    updateSongs(playlist)
    const shuffle = document.querySelector("#shuffle-button")
    const parent = document.querySelector("#shuffle-container")
    const clone = shuffle.cloneNode(true)
    parent.replaceChild(clone, shuffle)
    const newShuffle = document.querySelector("#shuffle-button")
    newShuffle.addEventListener("click", function (event) {
        handleShuffle(playlist, event)
    })
}

const handleShuffleClicker = null

const handleShuffle = (playlist, event) => {
    event.stopPropagation()
    shuffleSongs(playlist)
}

const shuffleSongs = (playlist) => {
    const songs = playlist.songs
    for (let i = songs.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = songs[i]
        songs[i] = songs[j]
        songs[j] = temp
    }
    updateSongs(playlist)
}

const updateSongs = (playlist) => {
    let songContainer = document.querySelector("#modal-rect2")
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

// Creates a song element from the playlist opened by modal
const createSongElement = (songIdx) => {
    const song = songs[songIdx]
    // songImg.src = song.songImg
    // songTitle.textContent = song.songTitle
    // songArtist.textContent = song.songArtist
    // songAlbum.textContent = song.songAlbum
    // songTime.textContent = song.songTime
    const songEl = document.createElement("article")
    songEl.className = "modal-song-container"
    songEl.innerHTML = `
        <img class="modal-song-img" src="${song.songImg}" alt="">
        <section id="modal-song-content">
            <h4 id="modal-song-title" class="no-mg">${song.songTitle}</h4>
            <p id="modal-song-artist" class="no-mg txt-14" >${song.songArtist}</p>
            <p id="modal-song-album" class="no-mg txt-14">${song.songALbum}</p>
        </section>
        <h4 id="modal-song-time">${song.songTime}</h4>
    `
    return songEl


}

// Function to open the modal on click
const openModal = () => {
    const modal = document.querySelector(".modal")
    const span = document.querySelector(".close")
    modal.style.display = "flex"

    const shuffle = document.querySelector("#shuffle-button")
    span.onclick = () => {
        modal.style.display = "none";
        shuffle.removeEventListener("click", handleShuffle)
    }
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
            shuffle.removeEventListener("click", handleShuffle)
        }
    }
}

const createHeart = (playlist) => {
    const heartEl = document.querySelector(`#heart${playlist.playlistID}`)
    const likesEl = document.querySelector(`#heart-text${playlist.playlistID}`)
    let clicked = false
    let totalLikes = playlist.likes
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
        playlist = {
            ...playlist,
            likes : totalLikes
        }
        likesEl.textContent = totalLikes
    })
}
