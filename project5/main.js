//buat canvasnya dolo
let canvas = document.getElementById('canvas')
let c = canvas.getContext('2d')

//variabel buat burung
let x = canvas.width/2 -20
let y = canvas.height/2-100
let pk =50
let tk =40
let speedy =0

//variabel buat pipa
let pipes= []
let pipeGap =200
let distancePipes =250
let lebar = 70

//gambar pipa
let topPipe = new Image()
topPipe.src = 'toppipe.png'
let bottomPipe = new Image()
bottomPipe.src = 'bottompipe.png'

//gambar burung
 let terbang = new Image()
terbang.src = 'terbang.png'
let flappy = new Image()
flappy.src = 'flappybird.png'
let die = new Image()
die.src = 'doge.png'
let birdImage = flappy //gambar defaultnyaa

// variabel buat kalah
let kalah =false
let hitPlayed = false

// variabel skor
let score = 0

createPipes()
setInterval(()=>{
    c.clearRect(0,0,canvas.width,canvas.height)
    drawSquare()
    //pergerakan pipa
    if (!kalah) {
        speedy += 1;
        y += speedy;
        // Periksa apakah burung telah melewati pipa
        pipes.forEach(pipe => {
            pipe.x1 -=5
          if(pipe.x1 -30 < x && !pipe.lewat){
            pipe.lewat = true
            let audio = new Audio()
            audio.src = './FlappyBirdSound/sfx_point.wav'
            audio.play()
            score+= 0.5
            document.getElementById('score').innerHTML =score
          }
        })
    }
    if (y >= canvas.height - tk) {
        y = canvas.height - tk;
        kalah = true;
    }
    if(y <= 0){
        y=0
        kalah = true
    }
    if(kalah== true && !hitPlayed){
        let audio = new Audio()
        audio.src = './FlappyBirdSound/sfx_hit.wav'
        audio.play()
        hitPlayed = true
        birdImage = die
    }

    //pipa klo kena
    pipes.forEach(pipe => {
        if (
            x + pk > pipe.x1 && // Kotak berada di sisi kanan pipa
            x < pipe.x1 + pipe.width && // Kotak berada di sisi kiri pipa
            (y < pipe.height && pipe.y1 === 0 || // Cek tabrakan dengan pipa atas
            y + tk > pipe.y1 && pipe.y1 > 0) // Cek tabrakan dengan pipa bawah
        ) {
            kalah = true
        }
    });
drawPipe()
 
},1000/30 )

function createPipes(){
    const pipeCount = 999
    for (let i=0; i<pipeCount; i++){
        const heightAtas =Math.random() *(canvas.height/2)
        const heightBawah =canvas.height - heightAtas- pipeGap
        pipes.push({
            x1 : 700 + i  * distancePipes,
            y1:0,
            height :heightAtas,
            width : lebar
        },{
            x1 : 700 +i * distancePipes,
            y1: canvas.height -heightBawah,
            height : heightBawah,
            width:lebar
        })
    }

}

document.addEventListener('keydown', (event)=>{
    if(event.code == 'Space'){
        speedy -=23
            birdImage = terbang
        let sayap = new Audio()
        sayap.src = './FlappyBirdSound/sfx_wing.wav'
        sayap.play()
    }
    if(kalah == true && event.key=='r'){
        resetGame()
    }
  
})
document.addEventListener('keyup', (event)=>{
    if(event.code == 'Space'){
        birdImage = flappy
    }
})

document.addEventListener('click', (event) => {
    if(!kalah){
        speedy -= 23;
        birdImage = terbang;
        let sayap = new Audio();
        sayap.src = './FlappyBirdSound/sfx_wing.wav';
        sayap.play();
    }
    else{
        resetGame()
    }
})

function drawPipe(){
    c.fillStyle='green'
   pipes.forEach(pipe =>{ 
    if (pipe.y1 === 0) {
        c.drawImage(topPipe, pipe.x1, pipe.y1, pipe.width, pipe.height);
    } else {
        c.drawImage(bottomPipe, pipe.x1, pipe.y1, pipe.width, pipe.height);
    }
   })
}

function drawSquare(){
    c.drawImage(birdImage,x,y,pk,tk)
}

function resetGame() {
    x = canvas.width / 2 - 20;
    y = canvas.height / 2 - 100;
    speedy = 0;
    pipes = [];    
    hitPlayed = false;
    birdImage = flappy;
    kalah = false;
    createPipes();
    score = 0;  
    document.getElementById('score').innerHTML = score;
}

