//Generate the Canvas
var CANVAS_WIDTH = 1920;
var CANVAS_HEIGHT = 1080;
var true_centerX = CANVAS_WIDTH/2;
var true_centerY = 0;//CANVAS_HEIGHT/2;


//HD Resolutions -1280x720 and 1920 × 1080 Full HD

var canvasElement = $("<canvas id ='GameCanvasScreen' width='" + CANVAS_WIDTH + "' height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('body');

/**By Ryan Giglio*/
function scaleToSmallest() {
    var ratio = CANVAS_WIDTH / CANVAS_HEIGHT;

    if (($(window).width() / ratio) <= $(window).height()) {
        canvasElement.css('width', '100%').css('height', 'auto');
    } else {
        canvasElement.css('height', '100%').css('width', 'auto');
    }
}
scaleToSmallest();

$(window).on('resize', function() {
    scaleToSmallest();
});
//Draw tile map
drawMap(canvas);
// Game State


var states = {
    splash: 0,
    title: 1,
    Game: 2,
    End: 3
};
var currentState = states.Game;

//Game Loop
//var FPS = 60;

// shim layer with setTimeout fallback
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
//Mouse Coordinate Positioning
 /*function writeMessage(canvas, message) {
        var context = canvasid.getContext('2d');
        context.clearRect(0, 0, canvasid.width, canvasid.height);
        context.font = '18pt Calibri';
        context.fillStyle = 'black';
        context.fillText(message, 10, 25);
        console.log(message);
      }
			**/

/** function getMousePos(canvas, evt) {
        var rect = canvasid.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

      var canvasid = document.getElementById('GameCanvasScreen');
      var context = canvas;

      canvasid.addEventListener('mousemove', function(evt) {
         mousePos = getMousePos(canvasid, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        writeMessage(canvas, message);
      }, false); **/



function gameloop() {
    controller();
    if (paused == false) {
    update();
    draw();

        //;
    }
window.requestAnimFrame(gameloop);
}

var paused = false;

 window.requestAnimFrame(gameloop);


//Keyboard Map
function setUpKeys() {
    window.keydown = {};

    function keyName(event) {
        return jQuery.hotkeys.specialKeys[event.which] ||
            String.fromCharCode(event.which).toLowerCase();
    }

    $(document).bind("keydown", function(event) {
        keydown[keyName(event)] = true;
    });

    $(document).bind("keyup", function(event) {
        keydown[keyName(event)] = false;
    });
};
setUpKeys();

var notyet = 0;
function clearTimer() {
    notyet = 0;
}


function pauseGame() {
    if (notyet == 1) {
        console.log("waiting")
        return;
    }
     notyet = 1;
     paused = !paused;
     setTimeout('clearTimer()', 500);
}

//console.log(keydown.esc);


//Canvas Utlity for preventing objects from going over the edge
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

//Text Variables
var splashTextX = CANVAS_WIDTH / 3;
var splashTextY = 0;
var endTextX = CANVAS_WIDTH / 3;
var endTextY = 0;

//Sound creation
var GameLoopMusic_sound = new Howl({
    urls: ['sounds/In-Orbit.mp3'],
    autoplay: false,
    loop: true,
});
var explosion_sound = new Howl({
    urls: ['sounds/explosion.mp3', 'sounds/explosion.wav']
});
var shoot_sound = new Howl({
    urls: ['sounds/shoot.mp3', 'sounds/shoot.wav'],
    volume: 0.2
});

//explosion_sound.play();

//Create The player
var player = {
    // color: "#00A",
    sprite: Sprite("spaceship"),
    x: 700,
    y: 680,
    width: 32,
    height: 32,
    life: 100,
    velX: 0,
    velY: 0,
    angle: 0,
    thrust: 1,
    turnSpeed: .001,
    speed: 4,
    draw: function() {
        //canvas.fillStyle = this.color;
        // canvas.fillRect(this.x, this.y, this.width, this.height);
        this.sprite.draw(canvas, this.x, this.y);
    },
    shoot: function() {
        var bulletPosition = this.midpoint();
        shoot_sound.play();

        playerBullets.push(Bullet({
            speed: 5,
            x: bulletPosition.x,
            y: bulletPosition.y
        }))
    },
    launch: function(){
        var missilePostition = this.midpoint();
        console.log(Missle.width);
        playerMissiles.push(Missle({
            speed: 2,
            x: missilePostition.x - 500,
            y: missilePostition.y
        }))
    },
    midpoint: function() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    },
    explode: function() {
        this.active = false;
        explosion_sound.play();
        GameLoopMusic_sound.fadeOut(0, 2000);
        currentState = states.End;
        // An explosion sound and then end the game
    },
    lifeChange: function(change) {


        this.life = this.life + change; //Adds or subtracts health based on the value added in the function

        if (this.life <= 0) {
            this.explode();
        }

        return this.life;


    }
};


var whirlpool= {
  sprite: Sprite("whirlpool"),
  width: 320,
  height: 320,
  x: true_centerX,
  y: true_centerY,
  draw: function() {
      //canvas.fillStyle = this.color;
      // canvas.fillRect(this.x, this.y, this.width, this.height);
      this.sprite.draw(canvas, this.x, this.y);
  },

}
var topleftQuad= {
  sprite: Sprite("450block"),
  width: 450,
  height: 450,
  x: true_centerX,
  y: true_centerY,
  draw: function() {
      //canvas.fillStyle = this.color;
      // canvas.fillRect(this.x, this.y, this.width, this.height);
      this.sprite.draw(canvas, this.x, this.y);
  },

}
var topRightQuad= {
  sprite: Sprite("450block"),
  width: 450,
  height: 450,
  x: true_centerX + 450,
  y: true_centerY,
  draw: function() {
      //canvas.fillStyle = this.color;
      // canvas.fillRect(this.x, this.y, this.width, this.height);
      this.sprite.draw(canvas, this.x, this.y);
  },



}
var botleftQuad= {
  sprite: Sprite("450block"),
  width: 450,
  height: 450,
  x: true_centerX,
  y: true_centerY + 450,
  draw: function() {
      //canvas.fillStyle = this.color;
      // canvas.fillRect(this.x, this.y, this.width, this.height);
      this.sprite.draw(canvas, this.x, this.y);
  },

}
var botRightQuad= {
  sprite: Sprite("450block"),
  width: 450,
  height: 450,
  x: true_centerX + 450,
  y: true_centerY + 450,
  draw: function() {
      //canvas.fillStyle = this.color;
      // canvas.fillRect(this.x, this.y, this.width, this.height);
      this.sprite.draw(canvas, this.x, this.y);
  },

}

function collisionDetection() {

    /*
     * private function initialize()
     *
     * Initializes the object
     *
     */
    this.initialize = function() {}


    this.hitTest = function( source, target ) {
        var hit = false;
        var start = new Date().getTime();

        if( this.boxHitTest( source, target ) ) {
            if( this.pixelHitTest( source, target ) ) {
                hit = true;
            }
        }

        var end = new Date().getTime();

        if( hit == true ){
            //console.log( 'detection took: ' + (end - start) + 'ms' );
        }

        return hit;
    }


    this.boxHitTest = function( source, target ) {
        return !(
            ( ( source.y + source.height ) < ( target.y ) ) ||
            ( source.y > ( target.y + target.height ) ) ||
            ( ( source.x + source.width ) < target.x ) ||
            ( source.x > ( target.x + target.width ) )
        );
    }


    this.pixelHitTest = function( source, target ) {

            var top = parseInt( Math.max( source.y, target.y ) );
            var bottom = parseInt( Math.min(source.y+source.height, target.y+target.height) );
            var left = parseInt( Math.max(source.x, target.x) );
            var right = parseInt( Math.min(source.x+source.width, target.x+target.width) );

            for (var y = top; y < bottom; y++)
            {
                for (var x = left; x < right; x++)
                {
                    var pixel1 = source.pixelMap.data[ (x - source.x) +"_"+ (y - source.y) ];
                    var pixel2 = target.pixelMap.data[ (x - target.x) +"_"+ (y - target.y) ];

                    if( !pixel1 || !pixel2 ) {
                        continue;
                    };

                    if (pixel1.pixelData[3] == 255 && pixel2.pixelData[3] == 255)
                    {
                        return true;
                    }
                }
            }

            return false;
    }

    /*
     * public function buildPixelMap()
     *
     * Creates a pixel map on a canvas image. Everything
     * with a opacity above 0 is treated as a collision point.
     * Lower resolution (higher number) will generate a faster
     * but less accurate map.
     *
     *
     * @param source (Object) The canvas object
     * @param resolution (int)(DEPRECATED!) The resolution of the map
     *
     * @return object, a pixelMap object
     *
     */
    this.buildPixelMap = function( source ) {
        var resolution = 1;
        var ctx = source.getContext("2d");
        var pixelMap = [];

        for( var y = 0; y < source.height; y++) {
            for( var x = 0; x < source.width; x++ ) {
                var dataRowColOffset = y+"_"+x;//((y * source.width) + x);
                var pixel = ctx.getImageData(x,y,resolution,resolution);
                var pixelData = pixel.data;

                pixelMap[dataRowColOffset] = { x:x, y:y, pixelData: pixelData };

            }
        }
        return {
            data: pixelMap,
            resolution: resolution
        };
    }

    // Initialize the collider
    this.initialize();

    // Return our outward facing interface.
    return {
        hitTest: this.hitTest.bind( this ),
        buildPixelMap: this.buildPixelMap.bind( this )
    };
};
var myNewCollission = new collisionDetection();
//Collision Detection
function collides(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
var WaveForce = .02;
var WavePull = .2;
var yourInthePool = false;
velocityCap = 3;

function handleCollisions() {

// if(yourInthePool === true){
//
//   player.velX = 0;
//   player.velY = 0;
//   yourInthePool = false;
// }

console.log(player.velX);
console.log(player.velY);
          if (collides(topleftQuad, player)) {
              //enemy.explode();
            //  player.lifeChange(-10);
          //  player.friction = player.friction + .01;

        //  player.velX++;
        if(Math.abs(player.velY) <= velocityCap){
          player.velX+=WaveForce;
            player.velY+=WavePull;
        }else {

          }
        }
          if (collides(topRightQuad, player)) {


        //  player.velY++;
        if(Math.abs(player.velY) <= velocityCap){
          player.velY+=WaveForce;
            player.velX-=WavePull;
        }else{

        }

          }
          if (collides(botRightQuad, player)) {


        //  player.velX--;
        if(Math.abs(player.velY) <= velocityCap){
          player.velX-=WaveForce;
            player.velY-=WavePull;
        }else {

        }

          }
          if (collides(botleftQuad, player)) {


//          player.velY--;
if(Math.abs(player.velY) <= velocityCap){
  player.velY-=WaveForce;
    player.velX+=WavePull;
}else {

          }
        }

}

/*** Parrallax background tutorial http://javacoffee.de/?p=866 **/
//Parallax background

/**
 * Data structure to hold layer data
 * @param s <string> Absolute path to the image
 * @param x <int> X coordinate
 * @param Y </int><int> Y coordinate
 */
function Layer(s, x, y) {
    this.img = new Image();
    this.img.src = s;
    this.x = x;
    this.y = y;
}


/**
 * Main ParallaxScrolling class
 * @param ctx <context> Canvas context
 * @param imgdata <array> Array with absolute image paths
 */
function ParallaxScrolling(canvas, imgdata) {
    var self = this;
    if (typeof imgdata === 'undefined') {
        imgdata = []; //fill it with paths to images for the parralax
    };
    this.canvas = canvas;

    // Initialize the layers
    this.layers = new Array(imgdata.length);
    for (i = 0; i < imgdata.length; i++) {
        this.layers[i] = new Layer(imgdata[i], 0, 0);
    }

    // Function: Move all layer except the first one
    this.Move = function() {
        for (var i = 1; i < self.layers.length; i++) {
            if (self.layers[i].x > self.layers[i].img.width) self.layers[i].x = 0;
            self.layers[i].x += i;
        }
    };

    // Function: Draw all layer in the canvas
    this.Draw = function() {
        self.Move();
        for (var i = 0; i < self.layers.length; i++) {
            var x1 = (self.layers[i].x - self.layers[i].img.width);
            self.canvas.drawImage(self.layers[i].img, 0, 0, self.layers[i].img.width, self.layers[i].img.height,
                self.layers[i].x, 0, self.layers[i].img.width, self.layers[i].img.height);
            self.canvas.drawImage(self.layers[i].img, 0, 0, self.layers[i].img.width, self.layers[i].img.height,
                x1, 0, self.layers[i].img.width, self.layers[i].img.height);
        }
    }
}

var layer = new Array('images/space-wall.jpg', 'images/wave.gif');
var parallax = new ParallaxScrolling(canvas, layer);

function controller(){
     //Pause the game
    if (keydown.p) {

        pauseGame();
      //  console.log(paused);

    }

}

function update() { //Updates location and reaction of objects to the canvas




    if (currentState === states.splash) {

        //splashTextX += 1;
        splashTextY += 1;

        if (splashTextY >= 300) {

            currentState = states.title;
        }


    }



    if (currentState === states.title) {

        if (keydown.space) {

            currentState = states.Game;
        }


    }


    if (currentState === states.Game) {


        //Player Movement Controls
        if (keydown.left) {
           if (player.velX > -player.speed) {
              player.angle -= player.turnSpeed;
            }
        }

        if (keydown.right) {
           if (player.velX < player.speed) {
              player.angle += player.turnSpeed;
            }
        }


        if (keydown.up) {
          var radians = player.angle/Math.PI*180;

          player.velX = Math.cos(radians) * player.thrust;
          player.velY = Math.sin(radians) * player.thrust;
        }


        player.x += player.velX;
        player.y += player.velY;

        player.x = player.x.clamp(0, CANVAS_WIDTH - player.width); //prevents character from going past canvas


        player.y = player.y.clamp(0, CANVAS_HEIGHT - player.height); //prevents character from going past canvas


        //Player actions


        //Enemy Update logic


        //Handle Collision
        handleCollisions();




    }



    if (currentState === states.End) {


        endTextY = endTextY + 1;

        if (endTextY >= 300) {

            endTextY = 300;
        }

    }


}

function draw() { //Draws objects to the canvas

    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);




    if (currentState === states.splash) {

        canvas.fillStyle = "#000"; // Set color to black
        canvas.font = '25pt Calibri';
        var SPLASH_SCREEN_TEXT = "Team Splash Screen";
        splashTextX = canvas.measureText(SPLASH_SCREEN_TEXT).width;
        canvas.fillText(SPLASH_SCREEN_TEXT, (CANVAS_WIDTH / 2) - (splashTextX / 2), splashTextY);

    }


    if (currentState === states.title) {

        canvas.fillStyle = "#000"; // Set color to black
        canvas.font = 'bold 40pt Calibri';
        var GAME_NAME_TEXT = "GAME NAME";
        gameTextx = canvas.measureText(GAME_NAME_TEXT).width; //Centers the text based on length
        canvas.fillText(GAME_NAME_TEXT, (CANVAS_WIDTH / 2) - (gameTextx / 2) - 3, CANVAS_HEIGHT / 3);
        //The next two create a special text effect
        canvas.fillStyle = "#F00";
        canvas.fillText(GAME_NAME_TEXT, (CANVAS_WIDTH / 2) - (gameTextx / 2), CANVAS_HEIGHT / 3);

        canvas.fillStyle = "00F";
        canvas.fillText(GAME_NAME_TEXT, (CANVAS_WIDTH / 2) - (gameTextx / 2) + 3, CANVAS_HEIGHT / 3);


        canvas.fillStyle = "#F00";
        canvas.font = 'bold 20pt Calibri';
        var SPACEBAR_TEXT = "Press Space to Continue";
        spaceBarTextx = canvas.measureText(SPACEBAR_TEXT).width; //Centers the text based on length
        canvas.fillText(SPACEBAR_TEXT, (CANVAS_WIDTH / 2) - (spaceBarTextx / 2), CANVAS_HEIGHT - CANVAS_HEIGHT / 4);



    }

    if (currentState === states.Game) {
        parallax.Draw(); //draw background




        //whirlpool Draw

whirlpool.draw();
topleftQuad.draw();
topRightQuad.draw();
botleftQuad.draw();
botRightQuad.draw();
//playerdraw
        player.draw();

//  console.log(player.y);

        //Life Bar top is pink static background
        canvas.strokeRect(20, 20, 100 * 2, 10);
        canvas.fillStyle = "#8B8989";
        canvas.fillRect(20, 20, 100 * 2, 10);

        //Second bar is red dynamic one
        canvas.strokeRect(20, 20, 100 * 2, 10);
        canvas.fillStyle = "#F00";
        canvas.fillRect(20, 20, player.life * 2, 10);




    }



    if (currentState === states.End) {


        canvas.fillStyle = "#F00"; // Set color to red
        canvas.font = '25pt Calibri';

        var GameOVER_TEXT = "Game Over";
        endTextX = canvas.measureText(GameOVER_TEXT).width; //Centers the text based on length
        //canvas.fillText(GameOVER_TEXT, (CANVAS_WIDTH/2) - (GameOVER_TEXTx/2) , CANVAS_HEIGHT-CANVAS_HEIGHT/4);

        canvas.fillText(GameOVER_TEXT, (CANVAS_WIDTH / 2) - (endTextX / 2), endTextY - 90);


        canvas.fillStyle = "#000"; // Set color to black
        canvas.font = '20pt Calibri';
        endTextX = canvas.measureText("First Firstnameson").width;
        canvas.fillText("First Firstnameson", (CANVAS_WIDTH / 2) - (endTextX / 2), endTextY - 45);


        canvas.fillStyle = "#000"; // Set color to black
        canvas.font = '20pt Calibri';
        canvas.fillText("Second Secondton", (CANVAS_WIDTH / 2) - (endTextX / 2), endTextY);



    }


}
