var context = $('#canvas')[0].getContext('2d');

function getGrid() {
    this._positions = [];
    this._moveCount = 0;
    this.draw();
}

(function(getGrid) {
    Math.TWO_PI = Math.PI * 2;
    context.lineWidth = 5;

    getGrid.p = getGrid.prototype;
    
    getGrid.p.draw = function() {
        var i = 0, x, y, pos;
        context.beginPath();
        for (; i < 2; i++) {
            x = 100 + 100*i;
            context.moveTo(x, 0);
            context.lineTo(x, 300);
        }
        for (i = 0; i < 2; i++) {
    
            y = 100 + 100*i;
            context.moveTo(0, y);
            context.lineTo(300, y);
        }
        
		//Border of game - Black
        context.strokeStyle = '#000000';
        context.stroke();
        context.closePath();
        
        getpos = this._positions;
        for (i = 0; i < 9; i ++) {
            x = i % 3 | 0;
            y = i / 3 | 0;
            if (getpos[i] === 'x') {
                drawX(x, y);
            } else if (getpos[i] === 'o') {
                drawO(x, y);
            }
        }
    };
    
    getGrid.p.markCellWithX = function(x, y) {
        this._positions[(y * 3) + x] = 'x';
        this._moveCount++;

        if (this._checkVictory(x, y, 'x')) {
          this.currentState = 'x victory'
        } else if (this._checkDraw()) {
          this.currentState = 'draw';
        }
        this.draw();
    };
    
    getGrid.p.markCellWithO = function(x, y) {
        this._positions[(y * 3) + x] = 'o';
        this._moveCount++;

        if (this._checkVictory(x, y, 'o')) {
          this.currentState = 'o victory'
        } else if (this._checkDraw()) {
          this.currentState = 'draw';
        }

        this.draw();
    };
    
    getGrid.p.isMarkedCell = function(x, y) {
        return typeof this._positions[(y * 3) + x] !== 'undefined';
    };

    getGrid.p.isMarkedCellWith = function(x, y, symbol) {
        return this._positions[(y * 3) + x] === symbol;
    };
    
    
    getGrid.p._checkVictory = function(x, y, symbol) {
      var i;

      for(i = 0; i < 3; i++) {
        if(!this.isMarkedCellWith(x, i, symbol)) break;
        if(i == 2) return true;
      }

      //Row
      for(i = 0; i < 3; i++) {
        if(!this.isMarkedCellWith(i, y, symbol)) break;
        if(i == 2) return true;
      }


      if(x == y){
        //In Diagonal
        for(i = 0; i < 3; i++) {
          if(!this.isMarkedCellWith(i, i, symbol)) break;
          if(i == 2) return true;
        }
      }

      //Check Anti Dialog
      for(i = 0; i < 3; i++){
        if(!this.isMarkedCellWith(i, (2 - i), symbol)) break;
        if(i == 2) return true;
      }

      return false;
    };

    getGrid.p._checkDraw = function() {
      return this._moveCount == 9;
    };
    
    function drawX(cellX, cellY) {
        var i = 0, dx, dy;
        context.beginPath();
        for (i = 0; i < 2; i++) {
            dx = (cellX * 100) + 10 + (80*i);
            dy = (cellY * 100) + 10;
            context.moveTo(dx, dy);
            dx = (cellX * 100) + 90 - (80*i);
            dy = (cellY * 100) + 90;
            context.lineTo(dx, dy);
        }
        context.strokeStyle = '#3333ff';
        context.stroke();
        context.closePath();
    }
    
    function drawO (cellX, cellY) {
        context.beginPath();
        context.arc(cellX*100 + 50, 
                cellY*100 + 50, 
                40, 0, Math.TWO_PI, false);
        context.strokeStyle = '#ff3333';
        context.stroke();
        context.closePath();
    }
})(getGrid);

getgRid = new getGrid();
playerTurn = 0; // Player 1 X 

$('#canvas').click(function(e) {
  var x, y;
  x = e.offsetX / 100 | 0;
  y = e.offsetY / 100 | 0;

    
  if (!getgRid.isMarkedCell(x, y)) {
    if (playerTurn === 0) {
      if (getgRid.markCellWithX(x, y));
      playerTurn = 1; // Player 2 
    } else {
      getgRid.markCellWithO(x, y);
      playerTurn = 0; // Player 1
    }

    if (typeof getgRid.currentState !== 'undefined') {
      var setinfo = $('#legend');
      $('#canvas').off('click');

      if (getgRid.currentState === 'o victory') {
        setinfo

          .text('PLAYER 2 WINS');
		  //Get state of Player 2
      } else if (getgRid.currentState === 'x victory') {
        setinfo

          .text('PLAYER 1 WINS');
      } else if (getgRid.currentState === 'draw'){
        setinfo

          .text('ITS A DRAW!');
      }
    }
  }
});
