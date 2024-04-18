let currentsong = new Audio;
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";

    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');


    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    currFolder= folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }
   


    let songUL = document.querySelector(".song-name").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
                        <img class="invert" src="music.svg" alt="">
                       <div class="info">
                        <div>${song.replaceAll("%20", " ")}</div>
                       <div>Arjan dhillon</div>
                    </div>
                     <div class="playnow">
                    <h3>Play now</h3>
                        <img  src="play-2.svg" alt="">
                    </div> 
       </li>`;
    }
    var audio = new Audio(songs[2]);
    audio.play();


    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration, audio.currentSrc, audio.currentTime)
    });

    // attach a event listner to each song
    Array.from(document.querySelector(".song-name").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
     

    
}
const playmusic = (track, pause = false) => {
    // let audio = new Audio ("/songs/" + track)
    currentsong.src = `/${currFolder}/` + (track)
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00.00"


}

async function displayAlbums(){
    let a = await fetch (`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchros= div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
   Array.from(anchros).forEach( async e=> {
    if(e.href.includes("/songs")){
        let folder=e.href.split("/").slice(-2)[0]
       // get the meta data of the folder
// <<<<<<<<<<<<<<  ✨ Codeium Command 🌟 >>>>>>>>>>>>>>>>
      try {
        let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });
        if (!a.ok) {
          throw new Error(`Network response was not ok. Status: ${a.status}`);
        }
        let response = await a.json();
      } catch (error) {
        console.error(`Error: ${error.message} while fetching json for album ${folder}`);
        return;
      }

      //let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
     //let response = await a.json();
// <<<<<<<  a0630e62-5661-4c73-bc2d-b52cfcfa0d2b  >>>>>>>
        cardContainer.innerHTML=cardContainer.innerHTML+     
        `<div data-folder="ADS" class="card ">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" id="Play" fill="#000">
                    <path fill="none" d="M0 0h48v48H0z" fill="000"></path>
                    <path
                        d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm-4 29V15l12 9-12 9z"
                        fill="#34a853" class="color000000 svgShape"></path>
                </svg>
            </div>

            <img  src="/songs/${folder}/cover.jpg" alt=""
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        
    }
   })
        
            
    }



async function main() {
    // get the lists of all thwe song
await getSongs("songs/ADS")
    playmusic(songs[0], true)

// display all the albums dynamicly
displayAlbums()





    //Attach a event listner to play,nextand previous
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"


        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })
    //LISTEN FOR TIMEUPDATE EVENT
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)
            }/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    // add a event lister for hamburger open
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"

    })
    // add a event lister for hamburger close
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"

    })
    //Add a event listner for next previous
    previous.addEventListener("click", () => {
        console.log("previous was clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })

    //add event for next 
    next.addEventListener("click", () => {
        console.log("next was clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }

    })
    // add a event for volume up down
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",
        (e) => {
            currentsong.volume = parseInt(e.target.value) / 100
        })
 // load albums on click
 Array.from(document.getElementsByClassName("card")).forEach(e=>{
    console.log(e)
    e.addEventListener("click" ,async item=>{
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        

    })
 })


}
main() 