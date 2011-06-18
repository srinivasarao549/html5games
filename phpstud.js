var phpstud = function() {
    return {
        CatchMe: function() {
            // Private properties within Goldfish.
            var canvas;         // HTML 5 canvas element. More info: https://developer.mozilla.org/en/DOM/HTMLCanvasElement
            var context;        // Context of the canvas.
            var tile;           // Individual tile dimensions. Width and height in pixels.
            var fish;           // Sprite controlled by the player, here it's an image of a goldfish.
            var worm;           // Sprite controlled by the game, here an image of a worm the fish sprite tries to eat.
            var scoreMessage;   // Message displayed in the notifications bar.
            var score;          // Number of worms eaten by the fish.
            
            // Private classes
            var Tile = function(_width, _height) {
                this.width = _width;
                this.height = _height;
            };
            var Cell = function(_column, _row) {
                this.column = _column;
                this.row = _row;
            };
            var Sprite = function(_path, _column, _row) {
                this.image = new Image();
                this.image.src = _path;
                this.column = _column;
                this.row = _row;
            };
            var ScoreMessage = function(_text, _backgroundColour) {
                this.text = _text;
                this.backgroundColour = _backgroundColour;
            };
            
            // Private methods
            var paintWater = function() {
                var water = context.createLinearGradient(0, 0, 0, canvas.height);
                water.addColorStop(0, "rgba(0, 150, 255, 0.3)");
                water.addColorStop(1, "rgba(0, 150, 255, 0.7)");
                context.fillStyle = water;
                context.fillRect(0, 0, canvas.width, canvas.height);
            };
            var paintNotificationsBanner = function() {
                context.fillStyle = scoreMessage.backgroundColour;
                context.fillRect(0, canvas.height - tile.height, canvas.width, tile.height);
            };
            var sendNotification = function(message) {
                paintNotificationsBanner();
                context.font = "bold " + tile.height/2 + "px sans-serif";
                context.fillStyle = "rgba(255, 255, 255, 1)";
                context.textBaseline = "top";
                context.fillText(message, tile.width/4, canvas.height - tile.height/1.2);
            };
            var getCursorPosition = function(e) {
                var x;
                var y;
                if (e.pageX != undefined && e.pageY != undefined) {
                    x = e.pageX;
                    y = e.pageY;
                } else {
                    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                }
                x -= canvas.offsetLeft;
                y -= canvas.offsetTop;
                x = Math.min(x, canvas.width);
                y = Math.min(y, canvas.height);
                return new Cell(Math.floor(x/tile.width), Math.floor(y/tile.height));
            };
            var handleClick = function(e) {
                var clickedCell = getCursorPosition(e);
                if (clickedCell.row == Math.floor(canvas.height/tile.height-1)) return;   // The score bar at the bottom is not a valid clickable area.
                fish.column = clickedCell.column;
                fish.row = clickedCell.row;
                if (collision()) score += 1;
            };
            var drawSprites = function() {
                context.drawImage(worm.image, worm.column * tile.width + 1, worm.row * tile.height + 1);
                context.drawImage(fish.image, fish.column * tile.width + 1, fish.row * tile.height + 1);
            };
            var collision = function() {
                return (worm.column == fish.column && worm.row == fish.row);
            };
            var getRandomRow = function() {
                var row = Math.floor(Math.random()*(canvas.height/tile.height-2));
                if (row < 0) row = 0;
                if (row > canvas.height/tile.height-2) row = canvas.height/tile.height-2;
                return row;
            };
            var animateWorm = function() {
                worm.column -= 1;
                // Avoid the fish when on the same row.
                if (worm.row == fish.row) worm.row = getRandomRow();
                // Step over the fish.
                if (collision()) worm.column -= 1;
                // Change row and switch to the right edge of the canvas when reaching the left edge.
                if (worm.column < 0) {
                    worm.column = Math.floor(canvas.width/tile.width);
                    worm.row = getRandomRow();
                }
            };
            var draw = function() {
                context.clearRect(0, 0, canvas.width, canvas.height);
                paintWater();
                sendNotification(scoreMessage.text + ": " + score);
                animateWorm();
                drawSprites();
            };
            
            // Public methods
            return {
                init: function(canvasId, columns, rows, tileWidth, tileHeight, fishPath, wormPath, framesPerSecond, text, backgroundColour) {
                    canvas = document.getElementById(canvasId);
                    context = canvas.getContext("2d");
                    canvas.setAttribute("width", columns * tileWidth);
                    canvas.setAttribute("height", rows * tileHeight + tileHeight);
                    tile = new Tile(tileWidth, tileHeight);
                    fish = new Sprite(fishPath, 1, 1);
                    worm = new Sprite(wormPath, Math.floor(canvas.width/tile.width), Math.floor(canvas.height/tile.height)-3);
                    score = 0;
                    scoreMessage = new ScoreMessage(text, backgroundColour);
                    canvas.addEventListener("click", handleClick, false);
                    setInterval(draw, 1000/framesPerSecond);
                }
            };
        }(),
        TicTacToe: function() {
            // Private methods
            var drawGrid = function() {
                for (var x = tile.width + 0.5; x < canvas.height; x += tile.width) {
                    context.moveTo(0, x);
                    context.lineTo(canvas.width, x);
                }
                for (var y = tile.height + 0.5; y < canvas.width; y += tile.height) {
                    context.moveTo(y, 0);
                    context.lineTo(y, canvas.height);
                }
                context.strokeStyle = "rgba(255, 255, 255, 1)";
                context.stroke();
            };
            
            // Public methods
            return {
                init: function(canvasId, columns, rows, tileWidth, tileHeight) {
                    canvas = document.getElementById(canvasId);
                    context = canvas.getContext("2d");
                    canvas.setAttribute("width", columns * tileWidth);
                    canvas.setAttribute("height", rows * tileHeight + tileHeight);
                },
                test: function() {
                    alert("in the Tic Tac Toe game");
                }
            };
        }()
    };
}();