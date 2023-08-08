var ocrDemo = {
    CANVAS_WIDTH: 200,
    TRANSLATED_WIDTH: 20,
    PIXEL_WIDTH: 10,
    BLUE: '#0000ff',
    HOST: 'your_host',
    PORT: 'your_port',
    BATCH_SIZE: 10,
    trainingRequestCount: 0,
    trainArray: [],
    data: new Array(this.TRANSLATED_WIDTH * this.TRANSLATED_WIDTH).fill(0),
    canvas: null,
    ctx: null,
};

ocrDemo.init = function() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.canvas.addEventListener('mousemove', e => this.onMouseMove(e));
    this.canvas.addEventListener('mousedown', e => this.onMouseDown(e));
    this.canvas.addEventListener('mouseup', () => this.onMouseUp());
    
    document.getElementById('train-btn').addEventListener('click', () => this.train());
    document.getElementById('test-btn').addEventListener('click', () => this.test());
};

ocrDemo.drawGrid = function() {
    for (var x = this.PIXEL_WIDTH, y = this.PIXEL_WIDTH; 
             x < this.CANVAS_WIDTH; x += this.PIXEL_WIDTH, 
             y += this.PIXEL_WIDTH) {
        this.ctx.strokeStyle = this.BLUE;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.CANVAS_WIDTH);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.CANVAS_WIDTH, y);
        this.ctx.stroke();
    }
};

ocrDemo.onMouseMove = function(e) {
    if (!this.canvas.isDrawing) {
        return;
    }
    this.fillSquare(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
};

ocrDemo.onMouseDown = function(e) {
    this.canvas.isDrawing = true;
    this.fillSquare(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
};

ocrDemo.onMouseUp = function() {
    this.canvas.isDrawing = false;
};

ocrDemo.fillSquare = function(x, y) {
    var xPixel = Math.floor(x / this.PIXEL_WIDTH);
    var yPixel = Math.floor(y / this.PIXEL_WIDTH);
    this.data[(xPixel - 1) * this.TRANSLATED_WIDTH + yPixel - 1] = 1;

    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(xPixel * this.PIXEL_WIDTH, yPixel * this.PIXEL_WIDTH, 
        this.PIXEL_WIDTH, this.PIXEL_WIDTH);
};

ocrDemo.train = function() {
    var digitVal = document.getElementById('digit').value;
    if (!digitVal || this.data.indexOf(1) < 0) {
        alert('Please type and draw a digit value in order to train the network');
        return;
    }
    
    this.trainArray.push({ y0: this.data.slice(), label: parseInt(digitVal) });
    this.trainingRequestCount++;
    
    if (this.trainingRequestCount === this.BATCH_SIZE) {
        this.sendTrainingData();
        this.trainingRequestCount = 0;
        this.trainArray = [];
    }
};

ocrDemo.test = function() {
    if (this.data.indexOf(1) < 0) {
        alert('Please draw a digit in order to test the network');
        return;
    }
    
    var json = {
        image: this.data.slice(),
        predict: true,
    };
    this.sendData(json);
};

ocrDemo.sendTrainingData = function() {
    var json = {
        trainArray: this.trainArray,
        train: true,
    };
    this.sendData(json);
};

ocrDemo.sendData = function(json) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('POST', this.HOST + ':' + this.PORT, false);
    xmlHttp.onload = () => this.receiveResponse(xmlHttp);
    xmlHttp.onerror = () => this.onError(xmlHttp);
    var msg = JSON.stringify(json);
    xmlHttp.setRequestHeader('Content-length', msg.length);
    xmlHttp.setRequestHeader('Connection', 'close');
    xmlHttp.send(msg);
};

ocrDemo.receiveResponse = function(xmlHttp) {
    if (xmlHttp.status !== 200) {
        alert('Server returned status ' + xmlHttp.status);
        return;
    }
    var responseJSON = JSON.parse(xmlHttp.responseText);
    if (xmlHttp.responseText && responseJSON.type === 'test') {
        alert("The neural network predicts you wrote a '" + responseJSON.result + "'");
    }
};

ocrDemo.onError = function(e) {
    alert('Error occurred while connecting to server: ' + e.target.statusText);
};

// Initialize the demo when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    ocrDemo.init();
});
