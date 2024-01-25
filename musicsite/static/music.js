
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
})


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
    get_music()
    start_stop_button.textContent = "||";
});


function get_music() {
    fetch("api/get_music", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            musicTitle.textContent = data.title;
            oldMusic = data.title;
            localStorage.setItem("oldMusic", oldMusic);
            
            music.src = "/static/music/" + data.title + ".mp3";
            start_music()
        }
    })
    .catch(error => {
        console.error("Hiba: ", error);
    });
};