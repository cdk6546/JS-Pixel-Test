const canvas = document.getElementById('canvas');
const canvas2D = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Circle{
    constructor(targetX, targetY){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.velocityX = 0;
        this.velocityY = 0;
    }
}

const circles = [];
const name = "nat !";
const fontSize = 200;
const fontColor = "#FFD700";
const numCircles = 700;

const hiddenCanvas = document.createElement('canvas');
const hidden2D = hiddenCanvas.getContext('2d');

function getPixelMap(){
    hiddenCanvas.width = canvas.width;
    hiddenCanvas.height = canvas.height;
    hidden2D.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
    hidden2D.font = `${fontSize}px Arial`;
    hidden2D.textAlign = 'center';
    hidden2D.textBaseline = 'middle';
    hidden2D.fillStyle = 'white';

    const textWidth = hidden2D.measureText(name).width;
    const x = (hiddenCanvas.width - textWidth) / 2;
    const y = hiddenCanvas.height / 2;

    hidden2D.fillText(name, x + textWidth / 2, y); // center

    const pixelData = hidden2D.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height).data;

    const coordinates = [];

    for(let y = 0; y < hiddenCanvas.height; y++){
        for(let x = 0; x < hiddenCanvas.width; x++){
            // row offset, horizontal offset at a specific pixel, 
            // then the starting index for the RGBA values of the pixel (indicated by the 4)
            const index = (y * hiddenCanvas.width + x) * 4;  
            if (pixelData[index] > 200) { // detect bright pixels
                coordinates.push({ x, y });
            }
        }
    }
    return coordinates;
}

function createCircles(){
    const pixelMap = getPixelMap();

    for(let i = 0; i < numCircles; i ++){
        const coordinate = pixelMap[Math.floor(Math.random() * pixelMap.length)]; // 0 to length of array
        
        circles.push(new Circle(coordinate.x, coordinate.y))
    }
}


function updateCircles() {
    circles.forEach((circle) => {
        const dx = circle.targetX - circle.x;
        const dy = circle.targetY - circle.y;

        circle.velocityX += dx * 0.02; // attraction force, how fast it comes towards target
        circle.velocityY += dy * 0.02;

        circle.velocityX *= 0.8; // reducing the velocity each frame, friction-like
        circle.velocityY *= 0.8;

        circle.x += circle.velocityX;
        circle.y += circle.velocityY;
    });
}

function drawCircles() {
    circles.forEach((circle) => {
        canvas2D.fillStyle = circle.color;
        canvas2D.beginPath(); // stop last path
        canvas2D.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2); // draw circle
        canvas2D.fill();
    });
}

function animate(){
    canvas2D.clearRect(0, 0, canvas.width, canvas.height);

    drawCircles();
    updateCircles(); //every frame we move the circles towards the target destination

    requestAnimationFrame(animate);
}

createCircles();
animate();