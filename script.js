console.log("Let's write some js");

let currentSong = new Audio();
const seekBar = document.getElementById("seek-bar");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");
const volumeBar= document.getElementById("volume-bar");

let currentSongIndex = 0;

function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
}
async function getSongs() {
    let a = await fetch("http://127.0.0.1:57113/songs/")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for(let index = 0; index < as.length; index++){
        const element =as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    console.log(songs)
    return songs;
}

const playMusic = (track,index)=>{
    // let audio = new Audio("/songs/"+ track);
    currentSong.src = "/songs/" + track;
    currentSong.play();
    play_pause.src="pause.svg";
    currentSongIndex=index;

    const songTitle = document.getElementById("song-title");
    songTitle.innerText = track.replaceAll("%20"," ");
    // songTitle.innerText=songTitle.innerText.replaceAll("%20"," ");

    currentSong.addEventListener("loadedmetadata", () => {
        seekBar.max = currentSong.duration;
        totalTimeEl.textContent = formatTime(currentSong.duration);
    });

    currentSong.addEventListener("timeupdate", () => {
        seekBar.value = currentSong.currentTime;
        currentTimeEl.textContent = formatTime(currentSong.currentTime);
    });

    seekBar.addEventListener("input", () => {
        currentSong.currentTime = seekBar.value;
    });
    
    volumeBar.addEventListener("input", ()=>{
        currentSong.volume=volumeBar.value;
    })
    
}

let songs=[];
async function main(){ 

    songs=await getSongs();
    console.log(songs);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for(const song of songs){
        songUL.innerHTML = songUL.innerHTML + `
            <li>
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20", " ")}</div>
                  <div>By Vipin</div>
                </div>
                <span>
                  <div id="div1">Play Now</div>
                <div>
                  <img class="invert" src="play.svg" alt="">
                </div>
                </span>
              </li>`;
    }

    
    //Attach an event listener to each song:
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, index)=>{
        e.addEventListener("click", element=>{
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            // playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            let songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playMusic(songName, index);
        })
    })

    // adding play/pause eventListner to play/pause button to change icon and play/pause song
    play_pause.addEventListener("click", element=>{
        if(currentSong.paused){
            if(currentSong.src==="")
                playMusic(songs[0],0);
            else
                currentSong.play();
            play_pause.src="pause.svg";
        }
        else{
            currentSong.pause();
            play_pause.src="play.svg";
        }
    })
    let prevBtn=document.getElementsByClassName("prev-btn")[0];
    prevBtn.addEventListener("click", ()=>{
        // console.log("Prev button clicked, current index:", currentSongIndex);
        if(currentSongIndex>0)
            playMusic(songs[currentSongIndex-1],currentSongIndex-1);
    });

    let nextBtn = document.getElementsByClassName("next-btn")[0];
    nextBtn.addEventListener("click",()=>{
        if(currentSongIndex<songs.length-1)
            playMusic(songs[currentSongIndex+1],currentSongIndex+1);
    })
    // effect on hamburger button
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left ="0";
    })
    // effect on cross button
    document.querySelector(".cross").addEventListener("click", ()=>{
        document.querySelector(".left").style.left ="-120%"
    })

    document.querySelectorAll(".card").forEach((card)=>{
        card.addEventListener("mouseover", ()=>{
            card.querySelector(".cir-btn").style.display = "block";
        });
        card.addEventListener("mouseout",()=>{
            card.querySelector(".cir-btn").style.display = "none";
        });
    })

}
 
main()