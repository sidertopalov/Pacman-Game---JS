// window.onload = function() {
// $(window).on('load', function() {
    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.
    // 448, 496

    class pacmanGhosts {

        constructor (ghost, paths, pacmanPrevLoc, delay = 0) {
            this.ghost = ghost;
            this.paths = paths;
            this.pacmanPrevLoc = pacmanPrevLoc;
            this.delay = delay;
        }

        moveGhost(pacman, map, ghostLocation, pacmanLocation, speed) 
        {

            var startLocation = new Phaser.Point(ghostLocation.y, ghostLocation.x);
            var endLocation = new Phaser.Point(pacmanLocation.y, pacmanLocation.x);
            var searchParameters = new SearchParameters(startLocation, endLocation, map);
            var pathFinder = new PathFinder(searchParameters);

            if (this.paths[0] == null) 
            {
                // console.log(this.paths);
                this.paths = pathFinder.FindPath();
                // console.log(this.paths);
            }

            var tileX = (this.paths[0].y * 16) + 8;
            var tileY = (this.paths[0].x * 16) + 8;
            var ghostX = this.ghost.x;
            var ghostY = this.ghost.y;
            var absX = Math.abs(tileX - ghostX);
            var absY = Math.abs(tileY - ghostY);
            
            // console.log("TileX: " + tileX,"TileY: " + tileY, 
            //     "BlinkyX: " + ghostX,"BlinkyY: " + ghostY,
            //     "PacmanX: " + pacman.x,"PacmanY: " + pacman.y,
            //     "AbsX: " + Math.abs(tileX - ghostX), "AbsY: " + Math.abs(tileY - ghostY));

            if (tileX < ghostX) {
                this.ghost.animations.play('left', 5, true);
            }
            else 
            {
                this.ghost.animations.play('right', 5, true);
            }
            var check = ( pacman.x == this.pacmanPrevLoc.x ) || ( pacman.y == this.pacmanPrevLoc.y );
            if ( check ) 
            {
                if ( absX < 1.0 && absY < 1.0 )
                {
                    if ( (this.paths.length - 1 > 1) && ( 0 < this.paths.length - 1) ) {
                        this.paths.shift();
                    }
                    else
                    {
                        this.pacmanPrevLoc = new Phaser.Point(pacman.x,pacman.y);
                        this.paths = pathFinder.FindPath();
                    }
                }
            }
            else 
            {
                this.pacmanPrevLoc = new Phaser.Point(pacman.x,pacman.y);
                this.paths = pathFinder.FindPath();

            }
            game.physics.arcade.moveToXY(this.ghost, tileX, tileY, speed);
        }

        runTime(ghostLocation, dir, speed, map, bool = false) 
        {
            // var bool = ghostLocation.y == dir.y && ghostLocation.x == ghostLocation.x;
   

            var startLocation = new Phaser.Point(ghostLocation.y, ghostLocation.x);
            var endLocation = new Phaser.Point(dir.y, dir.x);
            var searchParameters = new SearchParameters(startLocation, endLocation, map);
            var pathFinder = new PathFinder(searchParameters);

            if (bool) 
            {
                this.paths = pathFinder.FindPath();
            }

            if (this.paths[0] == null) 
            {
                this.paths = pathFinder.FindPath();
                return
            }
            else 
            {
                var tileX = (this.paths[0].y * 16) + 8;
                var tileY = (this.paths[0].x * 16) + 8;
                var ghostX = this.ghost.x;
                var ghostY = this.ghost.y;
                var absX = Math.abs(tileX - ghostX);
                var absY = Math.abs(tileY - ghostY);
                

                if (tileX < ghostX) {
                    this.ghost.animations.play('left', 5, true);
                }
                else 
                {
                    this.ghost.animations.play('right', 5, true);
                }

                var check = ( pacman.x == this.pacmanPrevLoc.x ) || ( pacman.y == this.pacmanPrevLoc.y );
                if ( check ) 
                {
                    if ( absX < 1.0 && absY < 1.0 )
                    {
                        if ( (this.paths.length - 1 > 1) && ( 0 < this.paths.length - 1) ) {
                            this.paths.shift();
                        }
                        else
                        {
                            this.pacmanPrevLoc = new Phaser.Point(pacman.x,pacman.y);
                            this.paths = pathFinder.FindPath();
                        }
                    }
                }
                else 
                {
                    this.pacmanPrevLoc = new Phaser.Point(pacman.x,pacman.y);
                    this.paths = pathFinder.FindPath();

                }
                game.physics.arcade.moveToXY(this.ghost, tileX, tileY, speed);

            }
        }

    }

    var game = new Phaser.Game(448, 496, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render }, true);

    function preload() 
    {
        game.load.tilemap('map', 'assets/pacman-map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('dot', 'assets/dotRed.png');
        game.load.image('fish', 'assets/fish.png');
        game.load.image('background', 'assets/background.jpg');
        game.load.image('tiles', 'assets/map.png');
        game.load.spritesheet('pacman', 'assets/king.png', 32, 32);
        game.load.spritesheet('red', 'assets/redSeal.png', 32, 32);
        game.load.spritesheet('green', 'assets/greenSeal.png', 32, 32);
        game.load.spritesheet('yellowGhost', 'assets/graySeal.png', 32, 32);
        game.load.spritesheet('pinkyGhost', 'assets/brownSeal.png', 32, 32);

        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        Phaser.Canvas.setImageRenderingCrisp(game.canvas);
        game.physics.startSystem(Phaser.Physics.ARCADE);
    }

    var map = null;
    var layer = null;
    var pacman = null;

    var safetile = 14;
    var gridsize = 16;

    var speed = 120;
    var threshold = 3;

    var marker = new Phaser.Point();
    var turnPoint = new Phaser.Point();

    var directions = [ null, null, null, null, null ];
    var opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];
    // var opposites = [ Phaser.Keyboard.NONE, Phaser.Keyboard.RIGHT, Phaser.Keyboard.LEFT, Phaser.Keyboard.DOWN, Phaser.Keyboard.UP ];

    var current = Phaser.Keyboard.NONE;
    var turning = Phaser.Keyboard.NONE;

    //Information about game (Score,Level,Pacman Life, etc..)
    var score = 0;
    var level = 1;
    var scoreText;
    var levelText;
    var gameState = "RUN";
    var gameStateText;
    var gameOver;
    var restartGame;
    var pacmanLife = 3;
    var pacmanLifeText;

    // Pacman Ghosts
    var blinky;
    var blinkyInst;
    var green;
    var greenInst;
    var yellow;
    var yellowInst;
    var pinky;
    var pinkyInst;

    // Pacman Fish
    var fishGroup;
    var fish;
    var fishTwo;
    var fishThree;
    var fishFour;

    var flag =  true;

    var blinkyPaths;
    var greenPaths;
    var blinkyLocation;
    var pacmanLocation;
    var yellowLocation;
    var pinkyLocation;

    var pacmanPrevLoc;
    var newMap;

    var step = 0;
    var pacmanPrevX;
    var pacmanPrevY;

    var timeJump = 0;
    var gamePause = true;

    function create() {

        map = game.add.tilemap('map');
        map.addTilesetImage('pacman-tiles', 'tiles');
        layer = map.createLayer('Pacman');
        // layer.debug = 1;

        dots = game.add.physicsGroup();

        map.createFromTiles(7, safetile, 'dot', layer, dots);

        dots.setAll('x', 6, false, false, 1);
        dots.setAll('y', 6, false, false, 1);

            // Fish group
        fishGroup = game.add.group();

        // fish = game.add.physicsGroup();
        fish = game.add.sprite((1 * 16) + 8, (8 * 16) + 8, 'fish');
        fishTwo = game.add.sprite((26 * 16) + 8, (8 * 16) + 8, 'fish');
        fishThree = game.add.sprite((1 * 16) + 8, (23 * 16) + 8, 'fish');
        fishFour = game.add.sprite((26 * 16) + 8, (23 * 16) + 8, 'fish');

        fishGroup.add(fish);
        fishGroup.add(fishTwo);
        fishGroup.add(fishThree);
        fishGroup.add(fishFour);

        fish.anchor.set(0.5);
        fishTwo.anchor.set(0.5);
        fishThree.anchor.set(0.5);
        fishFour.anchor.set(0.5);

        game.physics.arcade.enable(fish);
        game.physics.arcade.enable(fishTwo);
        game.physics.arcade.enable(fishThree);
        game.physics.arcade.enable(fishFour);

        fish.body.setSize(16, 16, 8, 8);
        fishTwo.body.setSize(16, 16, 8, 8);
        fishThree.body.setSize(16, 16, 8, 8);
        fishFour.body.setSize(16, 16, 8, 8);

        map.setCollisionByExclusion([safetile], true, layer);

        // Pacman settings
        pacman = game.add.sprite((14 * 16) + 8, (17 * 16) + 8, 'pacman', 0);
        pacman.anchor.set(0.5);
        pacman.animations.add('kinguinLeft', [0], 10, true);
        pacman.animations.add('kinguinUpDown', [1], 10, true);
        pacman.animations.add('kinguinRight', [2], 10, true);

        game.physics.arcade.enable(pacman);
        pacman.body.setSize(16, 16, 8, 8);

        cursors = game.input.keyboard.createCursorKeys();

        levelText = game.add.text(1, 165, 'Level: 1', {fontSize: '14px', fill: 'black'});
        scoreText = game.add.text(0, 185, 'Score: 0', {fontSize: '14px', fill: 'black'});
        pacmanLifeText = game.add.text(23.1 * 16, 10.5 * 16, 'Life: 3', {fontSize: '14px', fill: 'black'});
        gameStateText = game.add.text(23.1 * 16, 11.5 * 16, 'RUN', {fontSize: '14px', fill: 'black'});

        var ghostPnts = game.add.text(23.1 * 16, 16 * 16, "Ghost:", {fontSize: '14px', fill: 'black'});
        var ghostScore = game.add.text(24.1 * 16, 17 * 16, "+250pnt", {fontSize: '14px', fill: 'black'});
        var levelUP = game.add.text(1, 16 * 16, "Level:", {fontSize: '14px', fill: 'black'});
        var levelScore = game.add.text(1 * 16, 17 * 16, "+500pnt", {fontSize: '14px', fill: 'black'});

        //Ghosts settings
        blinky = game.add.sprite((14 * 16) + 8, (11 * 16) + 8, 'red');
        green = game.add.sprite((11.6 * 16) + 8, (14.5 * 16) + 8, 'green');
        yellow = game.add.sprite((13.6 * 16) + 8, (14.5 * 16) + 8, 'yellowGhost');
        pinky = game.add.sprite((15.6 * 16) + 8, (14.5 * 16) + 8, 'pinkyGhost');

        blinky.anchor.set(0.5);
        green.anchor.set(0.5);
        yellow.anchor.set(0.5);
        pinky.anchor.set(0.5);

        blinky.animations.add('left', [0, 1], 10, true);
        blinky.animations.add('right', [2, 3], 10, true);

        green.animations.add('left', [0, 1], 10, true);
        green.animations.add('right', [2, 3], 10, true);

        yellow.animations.add('left', [0, 1], 10, true);
        yellow.animations.add('right', [2, 3], 10, true);

        pinky.animations.add('left', [0, 1], 10, true);
        pinky.animations.add('right', [2, 3], 10, true);

        game.physics.arcade.enable(blinky);
        game.physics.arcade.enable(green);
        game.physics.arcade.enable(yellow);
        game.physics.arcade.enable(pinky);

        blinky.scale.setTo(1,1);
        green.scale.setTo(1, 1);
        yellow.scale.setTo(1, 1);
        pinky.scale.setTo(1, 1);

        blinky.animations.play('left', 5, true);
        green.animations.play('left', 5, true);
        yellow.animations.play('left', 5, true);
        pinky.animations.play('left', 5, true);

        blinky.body.setSize(16, 16, 8, 8);
        green.body.setSize(16, 16, 8, 8);
        yellow.body.setSize(16, 16, 8, 8);
        pinky.body.setSize(16, 16, 8, 8);
        
        // blinkyInst = new pacmanGhosts(blinky, , null);
        // greenInst = new pacmanGhosts(green, null, null);
        // yellowInst = new pacmanGhosts(yellow, null, null);
        // pinkyInst = new pacmanGhosts(pinky, null, null);


            //A star (AI enemy implementation)

        // console.log(blinky);

        blinkyLocation = map.getTileWorldXY(blinky.x, blinky.y);
        greenLocation = map.getTileWorldXY(green.x, green.y);
        pacmanLocation = map.getTileWorldXY(pacman.x, pacman.y);
        
        //Blinky ghost
        var InitializeMap = new Map(map.layer.data);
        newMap = InitializeMap.getMap();
        var startLocation = new Phaser.Point(blinkyLocation.y, blinkyLocation.x);
        var endLocation = new Phaser.Point(pacmanLocation.y, pacmanLocation.x);
        var searchParameters = new SearchParameters(startLocation, endLocation, newMap);
        var pathFinder = new PathFinder(searchParameters);
        blinkyPaths = pathFinder.FindPath();

        blinkyInst = new pacmanGhosts(blinky, blinkyPaths, pacmanLocation);

        // Green ghost
        var grStartLocation = new Phaser.Point(greenLocation.y, greenLocation.x);
        var grEndLocation = new Phaser.Point(pacmanLocation.y, pacmanLocation.x);
        var grSearchParameters = new SearchParameters(startLocation, endLocation, newMap);
        var grPathFinder = new PathFinder(grSearchParameters);
        greenPaths = grPathFinder.FindPath();

        greenInst = new pacmanGhosts(green, greenPaths, pacmanLocation);

        // Yellow ghost
        var yeStartLocation = new Phaser.Point(greenLocation.y, greenLocation.x);
        var yeEndLocation = new Phaser.Point(pacmanLocation.y, pacmanLocation.x);
        var yeSearchParameters = new SearchParameters(startLocation, endLocation, newMap);
        var yePathFinder = new PathFinder(grSearchParameters);
        yellowPaths = yePathFinder.FindPath();

        yellowInst = new pacmanGhosts(yellow, yellowPaths, pacmanLocation);

        // Pinky(brown) ghost
        var piStartLocation = new Phaser.Point(greenLocation.y, greenLocation.x);
        var piEndLocation = new Phaser.Point(pacmanLocation.y, pacmanLocation.x);
        var piSearchParameters = new SearchParameters(startLocation, endLocation, newMap);
        var piPathFinder = new PathFinder(grSearchParameters);
        pinkyPaths = piPathFinder.FindPath();

        pinkyInst = new pacmanGhosts(pinky, pinkyPaths, pacmanLocation);

        pacmanPrevLoc = new Phaser.Point(pacman.x, pacman.y);
     
        pacman.play('kinguinLeft');
        moveKinguin(Phaser.LEFT);


    }
        

    function checkKeys() {

        if (cursors.left.isDown && current !== Phaser.LEFT)
        {
            checkDirection(Phaser.LEFT);
        }
        else if (cursors.right.isDown && current !== Phaser.RIGHT)
        {
            checkDirection(Phaser.RIGHT);
        }
        else if (cursors.up.isDown && current !== Phaser.UP)
        {
            checkDirection(Phaser.UP);
        }
        else if (cursors.down.isDown && current !== Phaser.DOWN)
        {
            checkDirection(Phaser.DOWN);
        }
        else
        {
            //  This forces them to hold the key down to turn the corner
            turning = Phaser.NONE;
        }

    }

    function checkDirection(turnTo) {

        if (turning === turnTo || directions[turnTo] === null || directions[turnTo].index !== safetile) 
        {
            //  Invalid direction if they're already set to turn that way
            //  Or there is no tile there, or the tile isn't index 1 (a floor tile)
            return;
        }

         //  Check if they want to turn around and can
        if (current === opposites[turnTo]) 
        {
            moveKinguin(turnTo);
        }
        else
        {
            turning = turnTo;

            turnPoint.x = (marker.x * gridsize) + (gridsize / 2);
            turnPoint.y = (marker.y * gridsize) + (gridsize / 2);
        }
    }

    function resetGhost(ghost)
    {
        var x;
        var y;
        var ghostLocation;
        var dir = map.getTileWorldXY(14 * 16, 12 * 16);
        
        if (ghost.key === "red")
        {
            x = (14 * 16) + 8;
            y = (11 * 16) + 8;

            ghost.reset(x, y);
            ghostLocation = map.getTileWorldXY(x, y);
            blinkyInst.runTime(ghostLocation, dir, 0, newMap, true);
            blinky.animations.play('left');

        }
        else if(ghost.key === "green")
        {
            x = (11.6 * 16) + 8;
            y = (14.5 * 16) + 8;

            ghost.reset(x, y);
            ghostLocation = map.getTileWorldXY(x, y);
            greenInst.runTime(ghostLocation, dir, 0, newMap, true);
            green.animations.play('left');

            // if (!isDead) {
            //     console.log("isDead = true")
            //     green.animations.play('left');
            // }
            // else{
            //     console.log("Delay: " + green.delay);
            //     greenInst.delay = game.time.time + 2000; // 2sec delay
            // }
        
        }
        else if(ghost.key === "yellowGhost")
        {
            x = (13.6 * 16) + 8;
            y = (14.5 * 16) + 8;

            ghost.reset(x, y);
            ghostLocation = map.getTileWorldXY(x, y);
            yellowInst.runTime(ghostLocation, dir, 0, newMap, true);
            yellow.animations.play('left');

            // if (!isDead) {
            //     console.log("isDead = true")
            //     yellow.animations.play('left');
            // }
            // else{
            //     console.log("Delay: " + yellowInst.delay);
            //     yellowInst.delay = game.time.time + 2000; // 2sec delay
            // }
        }
        else
        {
            x = (15.6 * 16) + 8;
            y = (14.5 * 16) + 8;

            ghost.reset(x, y);
            ghostLocation = map.getTileWorldXY(x, y);
            pinkyInst.runTime(pinkyLocation, dir, 0, newMap, true);
            pinky.animations.play('left');

            // if (isDead) {
                // console.log("isDead = true")
                // yellow.animations.play('left');
            //     pinkyInst.delay = game.time.time + 2000; // 2sec delay

            // }
            // else{
            //     console.log("Delay: " + yellowInst.delay);
            //     yellowInst.delay = game.time.time + 2000; // 2sec delay
            // }
        }
    }

    function eatFish (pacman, fish)
    {
        fish.kill();
        score = score + 100;
        timeJump = game.time.time + 5000; // 5sec Kinguin Time
    }

    function eatGhost(pacman, ghost)
    {
        score = score + 250;
        resetGhost(ghost, true);
    }

    function eatDot (pacman,dot) {
        // Remove the star from the screen
        dot.kill();

        score = score + 10;

        if (dots.total === 0)
        {
            score = score + 500;
            level = level + 1;
            // pacmanLife = 3;

            dots.callAll('revive');
            fishGroup.callAll('revive');

            resetGhost(blinky);
            resetGhost(green);
            resetGhost(yellow);
            resetGhost(pinky);
            pacman.reset((14 * 16) + 8,(17 * 16) + 8);
            pacman.play('kinguinLeft');
            moveKinguin(Phaser.LEFT);

            // gamePause = true;
            alert("Congratulations! You complete the level and win 500 bonus score! Are you ready for next level?");
        }
    }

    function saveStats() {

        // Having problem with multiple-request
        var modal = $('#myModal');
        modal.find("#score").val(score);
        modal.modal('toggle');

        $("#formModal").off().on("submit", function(e){

            e.preventDefault();
            
            $.ajax({ //make ajax request
                type: 'POST',
                url: 'save_stats.php',
                cache: false,
                data: $("#formModal").serialize(),
                success: function(data) { //on Ajax success
                    $myData = JSON.parse(data);

                    //TODO implement to show response
                    alert($myData['msg']);
                    modal.modal('hide');
                    $("#playerName").val("");
                }
            });

        });

        // var myData = {
        //     'score': score,
        //     'playerName': getPlayerName(),
        // };

        // $.ajax({
        //     url: 'save_stats.php',
        //     type: 'POST',
        //     data: myData,
        //     success: function(data)
        //     {
        //         $myData = JSON.parse(data);
        //         if (myData['err'] == false) 
        //         {
        //             alert($myData['msg']);
        //         }
        //         else
        //         {
        //             alert($myData['msg']);
        //         }
        //     }
        // })
        // .done(function () {
        //     console.log('done ');
        // })
        // .fail(function () {
        //     console.log('failed');
        // });
    }

    function getPlayerName(){

        var playerName = prompt("Please enter your name(nickname) for our leaderbord!");
        
        return playerName;
    }

    function eatPacman (pacman,ghost) {
        if (pacmanLife === 1) 
        {
            // send data to php file (PlayerName and Score)
            saveStats();

            pacman.kill();
            blinky.kill();
            green.kill();
            yellow.kill();
            pinky.kill();

            gameOver = game.add.text((11 * 16) - 7, (13 * 16), " Game OVER!", {fontSize: '16px', fill: 'black'});  
            restartText = game.add.text((11 * 16) - 2, (17 * 16), "Click to restart", {fontSize: '14px', fill: 'blue'});

            game.paused = true;
            game.input.onTap.addOnce(restartGame, game);

        } else {

            pacmanLife--;
            pacman.reset((14 * 16) + 8,(17 * 16) + 8);
            pacman.play('kinguinLeft');
            moveKinguin(Phaser.LEFT);

            resetGhost(blinky);
            resetGhost(green);
            resetGhost(yellow);
            resetGhost(pinky);
        }
    }

    function restartGame()
    {
        gameOver.visible = false;
        restartText.visible = false;
        
        // Set started score, life and gameState
        score = 0;
        pacmanLife = 3;
        gameState = "RUN";

        // Revive dots and fishes
        dots.callAll('revive');
        fishGroup.callAll('revive');

        // Reset Seals
        resetGhost(blinky);
        resetGhost(green);
        resetGhost(yellow);
        resetGhost(pinky);

        // Reset Kinguin
        pacman.reset((14 * 16) + 8,(17 * 16) + 8);
        pacman.play('kinguinLeft');
        moveKinguin(Phaser.LEFT);

        game.paused = false;
    }

    function printGameInfo() 
    {
        scoreText.text = 'Score: ' + score;
        levelText.text = 'Level: ' + level;
        pacmanLifeText.text = 'Life: ' + pacmanLife;
        gameStateText.text = gameState;
    }

    function startGame()
    {

        score = 0;
        restartText.visible = false;
        pacmanLife = 3;
        gameState = "RUN";

        // Revive dots and fishes
        dots.callAll('revive');
        fishGroup.callAll('revive');

        // Reset Seals
        resetGhost(blinky);
        resetGhost(green);
        resetGhost(yellow);
        resetGhost(pinky);

        // Reset Kinguin
        // pacman.reset((14 * 16) + 8,(17 * 16) + 8);
        pacman.play('kinguinLeft');
        moveKinguin(Phaser.LEFT);
        gamePause = false;
        game.paused = false;
    }
   

     function update () {

        var gameTime = game.time.time;

        // Start game state
        if (gamePause) 
        {
            pacman.play("kinguinUpDown");
            restartText = game.add.text((11 * 16) + 4, (13 * 16), "Click to start", {fontSize: '14px', fill: 'blue'});
            pacman.reset((14 * 16) + 8,(17 * 16) + 8);
            game.paused = true;
            game.input.onTap.addOnce(startGame, game);
        }


        // Check collisions
        game.physics.arcade.collide(pacman, layer);

        game.physics.arcade.overlap(pacman, fish, eatFish, null, game);
        game.physics.arcade.overlap(pacman, fishTwo, eatFish, null, game);
        game.physics.arcade.overlap(pacman, fishThree, eatFish, null, game);
        game.physics.arcade.overlap(pacman, fishFour, eatFish, null, game);

        game.physics.arcade.overlap(pacman, dots, eatDot, null, game);

        // 
        if (gameTime > timeJump) 
        {
            // Game Time Collision - Seals can eat kinguin
            game.physics.arcade.overlap(pacman, blinky, eatPacman, null, game);
            game.physics.arcade.overlap(pacman, green, eatPacman, null, game);
            game.physics.arcade.overlap(pacman, yellow, eatPacman, null, game);
            game.physics.arcade.overlap(pacman, pinky, eatPacman, null, game);
        }
        else
        {
            // Kinguin Time Collision - Kinguin can eat seals
            game.physics.arcade.overlap(pacman, blinky, eatGhost, null, game);
            game.physics.arcade.overlap(pacman, green, eatGhost, null, game);
            game.physics.arcade.overlap(pacman, yellow, eatGhost, null, game);
            game.physics.arcade.overlap(pacman, pinky, eatGhost, null, game);

        }


        marker.x = game.math.snapToFloor(Math.floor(pacman.x), gridsize) / gridsize;
        marker.y = game.math.snapToFloor(Math.floor(pacman.y), gridsize) / gridsize;

        //  Update our grid sensors
        directions[1] = map.getTileLeft(layer.index, marker.x, marker.y);
        directions[2] = map.getTileRight(layer.index, marker.x, marker.y);
        directions[3] = map.getTileAbove(layer.index, marker.x, marker.y);
        directions[4] = map.getTileBelow(layer.index, marker.x, marker.y);

        checkKeys();

        if(turning !== Phaser.NONE){
            turn();
        }

            // Code below down is fixed ghost move

        pacmanLocation = map.getTileWorldXY(pacman.x, pacman.y);
        blinkyLocation = map.getTileWorldXY(blinky.x, blinky.y);
        greenLocation = map.getTileWorldXY(green.x, green.y);          
        yellowLocation = map.getTileWorldXY(yellow.x, yellow.y);          
        pinkyLocation = map.getTileWorldXY(pinky.x, pinky.y);          

        var InitializeMap = new Map(map.layer.data);
        newMap = InitializeMap.getMap();

        var grPacmanLocation;
        
        if (gameTime > timeJump)
        {
            // Normal state time - Seals trying to catch kinguin
            gameState = "RUN";

            if (pacmanLocation.x - 4 > 0)
            {
                grPacmanLocation = map.getTileWorldXY(pacman.x + 4, pacman.y);
            }
            else if(pacmanLocation.y + 4 < 31)
            {
                grPacmanLocation = map.getTileWorldXY(pacman.x, pacman.y + 4);
            }
            else if (pacmanLocation.x - 4 > 0)
            {
                grPacmanLocation = map.getTileWorldXY(pacman.x - 4, pacman.y);
            }
            else if (pacmanLocation.y + 4 < 28) 
            {
                grPacmanLocation = map.getTileWorldXY(pacman.x, pacman.y - 4);
            }
            else
            {
                grPacmanLocation =  pacmanLocation;
            }

            blinkyInst.moveGhost(pacman, newMap, blinkyLocation, pacmanLocation, 120);
          
            if (score > 50) 
            {
                greenInst.moveGhost(pacman, newMap, greenLocation, grPacmanLocation, 80);  
            }

            if (score > 150) 
            {
                yellowInst.moveGhost(pacman, newMap, yellowLocation, pacmanLocation, 90);
            }

            if(score > 300)
            {
                pinkyInst.moveGhost(pacman, newMap, pinkyLocation, pacmanLocation, 110);
            }
        }
        else
        {
            // Kinguin state time - Seals run away from kinguin
            gameState = "KINGUIN";

            var topLeft = map.getTileWorldXY((1 * 16) + 8, (1 * 16) + 8);
            var topRight = map.getTileWorldXY((24 * 16) + 8, (1 * 16) + 8);
            var botLeft = map.getTileWorldXY((4 * 16) + 8, (26 * 16) + 8);
            var botRight = map.getTileWorldXY((24 * 16) + 8, (26 * 16) + 8);

            var checkBlinky = blinkyLocation.y == topRight.y && blinkyLocation.x == topRight.x;
            var checkGreen = greenLocation.y == botLeft.y && greenLocation.x == botLeft.x;
            var checkYellow = yellowLocation.y == topLeft.y && yellowLocation.x == topLeft.x;
            var checkPinky = pinkyLocation.y == botRight.y && pinkyLocation.x == botRight.x;

            // Calculate directory for each seal
            if (checkBlinky) 
            {
                topRight = pacmanLocation;
            }
            else if(checkGreen)
            {
                botLeft = pacmanLocation;
            }
            else if(checkYellow)
            {
                topLeft = pacmanLocation;
            }
            else if(checkPinky)
            {
                botRight = pacmanLocation;
            }

            blinkyInst.runTime(blinkyLocation, topRight, 70, newMap);

            if (score > 50) 
            {
                greenInst.runTime(greenLocation, botLeft, 70, newMap); 
            }

            if (score > 150) 
            {
                yellowInst.runTime(yellowLocation, topLeft, 70, newMap);
            }

            if(score > 300)
            {
                pinkyInst.runTime(pinkyLocation, botRight, 70, newMap);
            }
        }

        // Game info
        printGameInfo();
    }


    function checkDirGhost(obj) {

        var randomNum = game.rnd.integerInRange(1,400);
        // console.log(randomNum);
        if (randomNum >= 1 && randomNum <= 100) 
        {
            moveGhost(obj, Phaser.LEFT);
        } 
        else if (randomNum >= 101 && randomNum <= 200)
        {
            moveGhost(obj, Phaser.RIGHT);
        }
        else if (randomNum >= 201 && randomNum <= 300) 
        {
            moveGhost(obj, Phaser.UP);
        }
        else if (randomNum >= 301) {
            moveGhost(obj, Phaser.DOWN);
        }
    }

    function moveGhost(obj, dir) {
            
        // var dir = this.dir;
        // console.log(dir);
        if (dir === Phaser.LEFT) 
        {
            obj.body.velocity.x -= 5;
        }
        else if (dir === Phaser.RIGHT) 
        {
            obj.body.velocity.x += 5;
        }
        else if (dir === Phaser.UP) 
        {
            obj.body.velocity.y -= 5;
        }
        else if (dir === Phaser.DOWN) 
        {
            obj.body.velocity.y += 5;
        }
    }

    function turn () {

        var cx = Math.floor(pacman.x);
        var cy = Math.floor(pacman.y);
        

        //  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
        if (!game.math.fuzzyEqual(cx, turnPoint.x, threshold) || !game.math.fuzzyEqual(cy, turnPoint.y, threshold))
        {
            return false;
        }

        //  Grid align before turning
        pacman.x = turnPoint.x;
        pacman.y = turnPoint.y;

        pacman.body.reset(turnPoint.x, turnPoint.y);

        moveKinguin(turning);

        turning = Phaser.NONE;

        return true;

    }

    function moveKinguin(direction) {

        pacman.scale.x = 1;
        pacman.angle = 0;
        
        // console.log(direction);

        if (direction === Phaser.LEFT) // Move to the left
        {
            // pacman.scale.x = -1;
            pacman.animations.play("kinguinLeft");
            pacman.body.velocity.x = -speed;
        }
        else if (direction === Phaser.UP) // Up
        {
            // pacman.angle = 270;
            pacman.animations.play("kinguinUpDown");
            pacman.body.velocity.y = -speed;
        }
        else if (direction === Phaser.RIGHT) // Move to the right
        {
            pacman.animations.play("kinguinRight");
            pacman.body.velocity.x = speed;
        }
        else if(direction === Phaser.DOWN) // Down
        {
            // pacman.angle = 90;
            pacman.animations.play("kinguinUpDown");
            pacman.body.velocity.y = speed;
        }

        current = direction;
    }

    function render() {
        // game.debug.body(pacman);
        // game.debug.body(blinky);
        // game.debug.body(green);
        // game.debug.body(yellow);
        // game.debug.body(pinky);
    }
// });
// };
