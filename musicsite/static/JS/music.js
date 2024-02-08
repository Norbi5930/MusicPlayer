
let playing = false
let oldMusic;
const music = document.getElementById("audio");
const musicTitle = document.getElementById("musicTitle");
const volume_input = document.getElementById("range");
const seekbar = document.getElementById("seekbar");
const seekvalue = document.getElementById("seekvalue");
let localoldMusic = localStorage.getItem("oldMusic");
let localVolume = localStorage.getItem("volume");

if (localoldMusic) {
    oldMusic = localoldMusic;
    musicTitle.textContent = localoldMusic;
    music.src = "/static/music/" + oldMusic + ".mp3";
};

if (localVolume) {
    volume_input.value = parseFloat(localVolume);
    music.volume = parseFloat(localVolume);
};




music.addEventListener("timeupdate", function() {
    const currentMinutes = Math.floor(music.currentTime / 60);
    const currentSeconds = Math.floor(music.currentTime % 60);
    const musicMinutes = Math.floor(music.duration / 60);
    const musicSeconds = Math.floor(music.duration % 60);

    const formattedTime = `${currentMinutes < 10 ? '0' : ''}${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}/${musicMinutes < 10 ? '0': ' '}${musicMinutes}:${musicSeconds < 10 ? '0': ''}${musicSeconds}`;
    seekvalue.textContent = `${formattedTime}`;
    seekbar.value = (music.currentTime / music.duration) * 100;

    if (music.currentTime == music.duration && playing) {
        get_music();
        playing = true;
        start_music();
    };
});


const start_stop_button = document.getElementById("start-stop");
start_stop_button.addEventListener("click", function() {
    start_music()
});

volume_input.addEventListener("input", function() {
    let volumeValue = parseFloat(volume_input.value);
    music.volume = volumeValue;
    localStorage.setItem("volume", music.volume);
});

seekbar.addEventListener("input", function() {
    const value = parseFloat(seekbar.value);
    const newPosition = (value / 100) * music.duration;
    music.currentTime = newPosition;
})

function start_music() {
    if (playing) {
        music.pause();
        playing = false;
        start_stop_button.textContent = "►"
    } else{
        music.play();
        playing = true;
        start_stop_button.textContent = "||"
    };
};


const next_button = document.getElementById("next");

next_button.addEventListener("click", function() {
    playing = false;
    get_music()
    start_stop_button.textContent = "||";
});


function play_manual_music(buttonID) {
    const localOldButton = localStorage.getItem("oldButton");
    let oldButton;
    const button = document.getElementById("list-play-button-" + buttonID);
    if (localOldButton) {
        oldButton = document.getElementById(localOldButton).textContent = "►"
    }
    if (button == document.getElementById(localOldButton) && playing) {
        start_music()
        button.textContent = "►"
    } else {
        const allSelectedMusic = document.querySelectorAll(".active-music");
        allSelectedMusic.forEach(function(title) {
            title.classList.remove("active-music");
        });
        const music_title = document.getElementById("list-music-" + buttonID);
        music_title.classList.add("active-music")
        localStorage.setItem("oldButton", "list-play-button-" + buttonID);
        button.textContent = "||"
        musicTitle.textContent = music_title.textContent;
        oldMusic = music_title.textContent;
        localStorage.setItem("oldMusic", oldMusic);
        music.src = "/static/music/" + music_title.textContent + ".mp3"
        playing = false;
        start_music();
    };
}


function get_music() {
    fetch("api/get_music", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            old_music: oldMusic
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            musicTitle.textContent = data.title;
            oldMusic = data.title;
            localStorage.setItem("oldMusic", oldMusic);
            
            music.src = "/static/music/" + data.title + ".mp3";
            start_music();
        }
    })
    .catch(error => {
        console.error("Hiba: ", error);
    });
};


const favoriteButton = document.getElementById("favoriteMusic");

favoriteButton.addEventListener("click", function() {
    addFavoriteMusic()
})


function addFavoriteMusic() {
    fetch("api/add_favorite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
            musicTitle: musicTitle.textContent
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Sikeresen hozzáadva a kedvencek listájához!")
        } else {
            alert("Sikertelen kedvencekhez adás")
        }
    })
    .catch(error => {
        console.error("Error: ", error)
    })
}

const playlistButtons = document.querySelectorAll("#playlistAll, #playlistFavorite");
const playlistAllButton = document.getElementById("playlistAll");
const playlistFavoriteButton = document.getElementById("playlistFavorite");
let selected_button = playlistAllButton;
selected_button.classList.add("playlist-button-active")

playlistAllButton.addEventListener("click", function() {
    playlistButtons.forEach(function(button) {
        button.classList.remove("playlist-button-active");
    });
    selected_button = playlistAllButton;
    playlistAllButton.classList.add("playlist-button-active");
})
playlistFavoriteButton.addEventListener("click", function() {
    playlistButtons.forEach(function(button) {
        button.classList.remove("playlist-button-active");
    });
    selected_button = playlistFavoriteButton;
    playlistFavoriteButton.classList.add("playlist-button-active");
})


playlistButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        if (selected_button == playlistFavoriteButton) {
            console.log("Test")
        }
    })
})