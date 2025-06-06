// Load playlists

const loadAllDOM = () => {
    displayPlaylists(data)
    createPlaylist()
    setupSearchBar()
    setupSorting()

}

// Make sure the DOM content is loaded
// Call the load playlists method
document.addEventListener("DOMContentLoaded", () => {
    loadAllDOM()
})


const displayPlaylists = (arr) => {
    let playlistsList = document.querySelector("#playlist-cards")
    playlistsList.innerHTML=''
    for (const playlist of arr) {
        const el = createPlaylistElement(playlist)
        playlistsList.appendChild(el)
        //Add an event listener for each heart button
        createHeart(playlist.playlistID)
        createDelete(playlist.playlistID)
        createEdit(playlist)
    }
}



// Create a playlist element and return it


const createPlaylistElement = (playlist) => {
    const playlistEl = document.createElement("article")
    playlistEl.className = "playlist-card"
    playlistEl.id = `playlist-card${playlist.playlistID}`
    playlistEl.innerHTML = `
        <img class="playlist-image" src="${playlist.playlistArt}" alt="">
        <h4 style="margin:0px">${playlist.playlistName}</h4>
        <p style="margin:4px">${playlist.playlistAuthor}</p>
        <div class="like-function">
            <button id="edit${playlist.playlistID}" class="edit"> Edit </button>
            <button id="heart" class="heart">
                <i id="heart${playlist.playlistID}"class="material-symbols-outlined">
                    favorite
                </i>
            </button>
            <div id="heart-text-container">
                <p id="heart-text${playlist.playlistID}" class="heart-text">${playlist.likes}</p>
            </div>
            <button id="delete${playlist.playlistID}" class="delete"> Delete </button>
        </div>
    `
    // Add modal event listener to each playlist element
    playlistEl.addEventListener("click", () => {
        updateModalDisplay(playlist.playlistID)
        openModal()
    })
    
    return playlistEl
}

// Create a function to update the modal
const updateModalDisplay = (playlistID) => {

    let playlist = getPlaylistWithID(playlistID)
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
        const el = createSongElement(songIdx)
        songContainer.appendChild(el)
    }
}

// Creates a song element from the playlist opened by modal
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

const createHeart = (id) => {
    const heartEl = document.querySelector(`#heart${id}`)
    const likesEl = document.querySelector(`#heart-text${id}`)
    let clicked = false
    let playlist = getPlaylistWithID(id)
    let totalLikes = playlist.likes
    heartEl.addEventListener("click", (event) => {
        playlist = getPlaylistWithID(id)
        event.stopPropagation()
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

const createDelete = (id) => {
    const deletebtn = document.querySelector(`#delete${id}`)
    deletebtn.addEventListener("click", (event) => {
        let playlist = getPlaylistWithID(id)
        event.stopPropagation()
        let i = 0
        while (i != data.length) {
            if (data[i] === playlist) {
                data.splice(i, 1)
                let playlistEl = document.querySelector(`#playlist-card${playlist.playlistID}`)
                playlistEl.remove()
                break
            }
            i++;
        }
    })
}

const createEdit = (playlist) => {
    const modal = document.querySelector("#modify-modal")
    const editbtn = document.querySelector(`#edit${playlist.playlistID}`)
    const span = document.querySelector(".close1")
    editbtn.addEventListener("click", (event) => {
        event.stopPropagation()
        modal.style.display = "flex"

        span.onclick = () => {
            modal.style.display = "none";
        }
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        setupForm(playlist.playlistID)

        let submission = document.querySelector("#review-form")
        const parent = document.querySelector("#modal-rect3")
        const clone = submission.cloneNode(true)
        parent.replaceChild(clone, submission)
        const newSubmission = document.querySelector("#review-form")
        newSubmission.addEventListener('submit', (event) => {
            event.preventDefault()
            event.stopPropagation()
            handlePlaylistSubmit(playlist)
        }) 
    })
}

const createPlaylist = () => {
    const modal = document.querySelector("#modify-modal")
    const playlistbtn = document.querySelector("#create-btn")
    const span = document.querySelector(".close1")

    playlistbtn.addEventListener("click", (event) => {
        event.stopPropagation()
        modal.style.display = "flex"

        span.onclick = () => {
            modal.style.display = "none";
        }
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        setupForm(null)

        let submission = document.querySelector("#review-form")
        const parent = document.querySelector("#modal-rect3")
        const clone = submission.cloneNode(true)
        parent.replaceChild(clone, submission)
        const newSubmission = document.querySelector("#review-form")
        newSubmission.addEventListener('submit', (event) => {
            event.preventDefault()
            event.stopPropagation()
            handlePlaylistSubmit(null)
        }) 
    })
}


const setupForm = (id) => {
    let playlist = getPlaylistWithID(id)
    const playlistAuthor = document.querySelector("#playlist-author")
    const playlistName = document.querySelector("#playlist-name")
    const playlistURL = document.querySelector("#playlist-URL")
    const formTitle = document.querySelector("#title")
    if (playlist !== null) {

        playlistAuthor.value = playlist.playlistAuthor
        playlistName.value = playlist.playlistName
        playlistURL.value = playlist.playlistArt
        formTitle.textContent = "Edit Existing Playlist"
    } else {
        playlistAuthor.value = ""
        playlistName.value = ""
        playlistURL.value = "assets/img/playlist.png"
        formTitle.textContent = "Create New Playlist"
    }
    const form = document.querySelector("#add-songs")
    form.innerHTML=''

    songs.forEach((song) => {
        const songOption = document.createElement("input")
        songOption.type = "checkbox"
        songOption.value = song.songID
        if (playlist !== null & playlist?.songs.includes(song.songID)) {
            songOption.checked = true
        }
        // songOption.checked()
        const label = document.createElement("label")
        label.id = `label${song.songID}`
        label.textContent = `${song.songTitle}  by ${song.songArtist}`
        form.appendChild(songOption)
        form.appendChild(label)
        form.appendChild(document.createElement("br"))
    })
}

const handlePlaylistSubmit = (playlist) => {
    const playlistAuthor = document.querySelector("#playlist-author")
        const playlistName = document.querySelector("#playlist-name")
        const playlistURL = document.querySelector("#playlist-URL")
        const playlistSongs = document.querySelectorAll("input")
        const author = playlistAuthor.value
        const name = playlistName.value
        const url = playlistURL.value
        const songs = []
        for (let song of playlistSongs) {
            if (song.checked){
                songs.push(song.value)
            }
        }
    if (playlist === null) {
        const newPlaylist = {
            "playlistID": data.length,
            "playlistName": name,
            "playlistAuthor": author,
            "playlistArt": url,
            "likes": 0,
            "songs" : songs
        }
        data.push(newPlaylist)
        let playlistsList = document.querySelector("#playlist-cards")
        const el = createPlaylistElement(newPlaylist)
        playlistsList.appendChild(el)
        createHeart(newPlaylist.playlistID)
        createDelete(newPlaylist.playlistID)
        createEdit(newPlaylist)

    } else {
        playlist = {
            ...playlist,
            "playlistName": name,
            "playlistAuthor": author,
            "playlistArt": url,
            "songs": songs
        }
        let index = findIndex(playlist.playlistID)
        data[index] = playlist
        updatePlaylistCard(playlist.playlistID)
    }
}

const updatePlaylistCard = (id) => {
    playlist = getPlaylistWithID(id)
    let playlistCard = document.querySelector(`#playlist-card${id}`)

    const playlistName = playlistCard.querySelector("h4")
    playlistName.textContent = playlist.playlistName

    const playlistAuthor = playlistCard.querySelector("p")
    playlistAuthor.textContent = playlist.playlistAuthor

    const playlistArt = playlistCard.querySelector("img")
    playlistArt.textContent = playlist.playlistArt
}

const findIndex = (id) => {
    let i = 0
    for (let el of data) {
        if (el.playlistID === id) {
            return i
        }
        i += 1
    }
}
const getPlaylistWithID = (id) => {
    for (let el of data) {
        if (el.playlistID === id) {
            return el
        }
    }
    return null
}

const setupSearchBar = () => {
    //create event listener
    const form = document.querySelector("#search-bar")
    form.addEventListener("submit", (event) => {
        //receive input
        event.preventDefault()
        const inputEl = document.querySelector("#search-input")
        const input = inputEl.value
        let filteredData = searchData(input)
        displayPlaylists(filteredData)

    })
}

const setupSorting = () => {
    
}

const searchData = (target) => {
    target = target.toLowerCase()
    const res = []
    for (const playlist of data) {
        let name = playlist.playlistName
        let author = playlist.playlistAuthor
        name = name.toLowerCase()
        author = author.toLowerCase()
        if (name.includes(target) || author.includes(target)) {
            res.push(playlist)
        }
    }
    return res
}
