
/* Entry point into the program and ensures the DOM content is loaded */
document.addEventListener("DOMContentLoaded", () => {
    loadAllDOM()
})

/* Loads necessary event listeners and other necessary setup */
const loadAllDOM = () => {
    displayPlaylists(data)
    createPlaylist()
    setupSearchBar()
    setupSorting()
    setupAddSong()
}

/* 
Displays the playlist and configures the buttons
Input: Playlist array
Result: Displays the playlists in the order they appear in the array
*/
const displayPlaylists = (arr) => {
    let playlistsList = document.querySelector("#playlist-cards")
    playlistsList.innerHTML=''
    for (const playlist of arr) {
        const el = createPlaylistElement(playlist)
        playlistsList.appendChild(el)
        //Add an event listener for each button
        createHeart(playlist.playlistID)
        createDelete(playlist.playlistID)
        createEdit(playlist)
    }
}



/* 
Creates a playlist element based on the input object 
Input: Playlist object
Output: Playlist element
*/
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

/* 
Updates the modal display
Input: The playlist id that is opening the modal
Result: The shared modal element now has the content of input playlistID
*/
const updateModalDisplay = (playlistID) => {

    // Updates the playlist information in the modal
    let playlist = getPlaylistWithID(playlistID)
    const playlistImgEl = document.querySelector("#modal-playlist-image")
    const playlistTitleEl = document.querySelector("#modal-playlist-title")
    const playlistCreatorEl = document.querySelector("#modal-playlist-creator")
    playlistTitleEl.textContent = playlist.playlistName
    playlistCreatorEl.textContent = playlist.playlistAuthor
    playlistImgEl.src = playlist.playlistArt

    // Changes the songs within the modal
    updateSongs(playlistID)

    // Creates shuffle event listener and removes old one
    const shuffle = document.querySelector("#shuffle-button")
    const parent = document.querySelector("#shuffle-container")
    const clone = shuffle.cloneNode(true)
    parent.replaceChild(clone, shuffle)
    const newShuffle = document.querySelector("#shuffle-button")
    newShuffle.addEventListener("click", (event) => {
        event.stopPropagation()
        shuffleSongs(playlistID)
    })
}

/* 
Input: Playlist object
Result: The songs within the playlist are shuffled
*/
const shuffleSongs = (playlistID) => {
    const playlist = getPlaylistWithID(playlistID)
    const songs = playlist.songs
    for (let i = songs.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = songs[i]
        songs[i] = songs[j]
        songs[j] = temp
    }
    updateSongs(playlistID)
}

/*
Input: The playlist with the target songs
Result: Rerenders the modal such that the songs are in the order they appear in the playlist
*/
const updateSongs = (playlistID) => {
    const playlist = getPlaylistWithID(playlistID)
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

/*
Input: The index of the song appears in the songs array
Output: A song element with the content of the desired song
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

/*
Opens modal and sets up event listeners to close the modal
*/
const openModal = () => {
    const modal = document.querySelector(".modal")
    const span = document.querySelector(".close")
    modal.style.display = "flex"

    const shuffle = document.querySelector("#shuffle-button")
    span.onclick = () => {
        modal.style.display = "none";
    }
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

/*
Input: Playlist ID
Result: Adds the heart event listeners to the playlist element with the input id
and updates the like counts on screen and the playlist data array.
*/
const createHeart = (id) => {
    const heartEl = document.querySelector(`#heart${id}`)
    const likesEl = document.querySelector(`#heart-text${id}`)
    let playlist = getPlaylistWithID(id)
    if (playlist.liked) {
        heartEl.style["-webkit-text-fill-color"] = "red"  
    }
    let totalLikes = playlist.likes
    heartEl.addEventListener("click", (event) => {
        playlist = getPlaylistWithID(id)
        event.stopPropagation()
        if (!playlist.liked) {
            heartEl.style["-webkit-text-fill-color"] = "red"    
            totalLikes += 1
        } else {
            heartEl.style["-webkit-text-fill-color"] = "white"
            totalLikes -= 1
        }
        likesEl.textContent = totalLikes
        playlist.liked = !playlist.liked
        playlist = {
            ...playlist,
            likes : totalLikes,

        }
        let playlistIdx = findIndex(id)
        data [playlistIdx] = playlist

    })
}

/* 
Input: Playlist ID
Result: Creates an event listener that, when triggered, removes the target 
playlist from the display and playlist data array.
*/
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


/*
Input: Playlist Object
Result: Creates an event listener that, when triggered, opens up the edit modal 
and creates the submit modal for the form
*/
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
            modal.style.display = "none";
        }) 
    })
}

/*
Creates an event listener that, when triggered, allows opens up the 
create playlist modal and sets up the submission modal
*/
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
            modal.style.display = "none";
        }) 
    })
}

/* 
Input: Playlist ID
Result: Fills the form based on if it is an editing form or a create form. 
*/
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
        playlistURL.value = "https://picsum.photos/270/230"
        formTitle.textContent = "Create New Playlist"
    }
    const form = document.querySelector("#add-songs")
    form.innerHTML=''

    songs.forEach((song) => {
        const songOption = document.createElement("input")
        songOption.type = "checkbox"
        songOption.value = song.songID
        if (playlist !== null & playlist?.songs.includes(song.songID - 1)) {
            songOption.checked = true
        }
        const label = document.createElement("label")
        label.id = `label${song.songID}`
        label.textContent = `${song.songTitle}  by ${song.songArtist}`
        form.appendChild(songOption)
        form.appendChild(label)
        form.appendChild(document.createElement("br"))
    })
}


/* 
Input: Playlist object
Result: Captures the data from the input form and updates the underlying arrays
and rerenders the playlist elements.
*/
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
                songs.push(song.value - 1)
            }
        }
    if (playlist === null) {
        const newPlaylist = {
            "playlistID": data.length + 1,
            "playlistName": name,
            "playlistAuthor": author,
            "playlistArt": url,
            "likes": 0,
            "songs" : songs
        }
        data.push(newPlaylist)
        displayPlaylists(data)


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

/* 
Input: Playlist ID
Updates the desired playlist card
*/
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

/* 
Input: Playlist ID
Output: Index of the playlist within the data array
Linear searches for the index of the playlist within the data array 
(Array may not be sorted)
*/
const findIndex = (id) => {
    let i = 0
    for (let el of data) {
        if (el.playlistID === id) {
            return i
        }
        i += 1
    }
}

/*
Input: Playlist ID
Output: The playlist if it exists
*/
const getPlaylistWithID = (id) => {
    for (let el of data) {
        if (el.playlistID === id) {
            return el
        }
    }
    return null
}

/*
Sets up the event listeners and logic for the search bar
*/
const setupSearchBar = () => {
    //create event listener
    const form = document.querySelector("#search-bar")
    const clearBtn = document.querySelector('#clear-btn');
    const refreshBtn = document.querySelector('#refresh-screen');
    form.addEventListener("submit", (event) => {
        //receive input
        event.preventDefault()
        const inputEl = document.querySelector("#search-input")
        const input = inputEl.value
        let filteredData = searchData(input)
        displayPlaylists(filteredData)
    })
    clearBtn.addEventListener("click", () => {
        const inputEl = document.querySelector("#search-input")
        inputEl.value = ""
    })
    refreshBtn.addEventListener("click", () => {
        displayPlaylists(data)
        const inputEl = document.querySelector("#search-input")
        inputEl.value = ""
    })


}

/*
Sets up the event listeners and logic for the sort buttons
*/
const setupSorting = () => {
    const name = document.querySelector("#sort-by-name")
    const likes = document.querySelector("#sort-by-likes")
    const date = document.querySelector("#sort-by-date")

    name.addEventListener("click", () => {
        let sortedData = null
        sortedData = sortByName()
        displayPlaylists(sortedData)
    })
    likes.addEventListener("click", () => {
        let sortedData = null
        sortedData = sortByLikes()
        displayPlaylists(sortedData)
    })
    date.addEventListener("click", () => {
        let sortedData = null
        sortedData = sortByDate()
        displayPlaylists(sortedData)
    })

}

/*
Input: The substring to be searched for
Output: A list of playlists that contain the desired substring 
*/
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

/*
Output: The playlist array sorted by name
*/
const sortByName = () => {
    return data.sort((a, b) => a.playlistName.localeCompare(b.playlistName))
}

/*
Output: The playlist array sorted by likes
*/
const sortByLikes = () => {
    return data.sort((a, b) => b.likes - a.likes)
}

/*
Output: The playlist array sorted by date added
*/
const sortByDate = () => {
    return data.sort((a, b) => b.playlistID - a.playlistID)
}


/*
Adds event listeners for creating a song and adds the song to the underlying
songs array after submission.
*/
const setupAddSong = () => {
    const modal = document.querySelector("#add-song-modal")
    const songBtn = document.querySelector("#create-song-btn")
    const span = document.querySelector(".close2")
    
    songBtn.addEventListener("click", () => {
        modal.style.display = "flex"

        span.onclick = () => {
            modal.style.display = "none";
        }
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        const submission = document.querySelector("#new-song-form")
        const parent = document.querySelector("#modal-rect4")
        const clone = submission.cloneNode(true)
        parent.replaceChild(clone, submission)
        const newSubmission = document.querySelector("#new-song-form")

        newSubmission.addEventListener("submit", (event) => {
            event.preventDefault()
            modal.style.display = "none";
            const name = document.querySelector("#song-name")
            const author = document.querySelector("#song-artist")
            let nameVal = name.value
            let authorVal = author.value

            newSong = {
                "songID" : songs.length + 1,
                "songTitle" : nameVal,
                "songArtist" : authorVal,
                "songAlbum" : "Unknown",
                "songImg" : "https://picsum.photos/270/230",
                "songTime" : "0:00",
            }
            songs.push(newSong)
        })
    })
}



