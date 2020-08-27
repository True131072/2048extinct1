function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continue = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  this.applyClasses(wrapper, classes);
  var outputtext = new Array();
  outputtext[1] = "1";
  outputtext[2] = "2";
  outputtext[4] = "4";
  outputtext[8] = "8";
  outputtext[16] = "16";
  outputtext[32] = "32";
  outputtext[64] = "64";
  outputtext[128] = "128";
  outputtext[256] = "256";
  outputtext[512] = "512";
  outputtext[1024] = "1024";
  outputtext[2048] = "2048";
  outputtext[4096] = "4096";
  outputtext[8192] = "8192";
  outputtext[16384] = "16384";
  outputtext[32768] = "32768";
  outputtext[65536] = "65536";
  outputtext[131072] = "131072";
  outputtext[262144] = "262144";
  outputtext[524288] = "524288";
  outputtext[1048576] = "1048576";
  outputtext[2097152] = "2097152";
  outputtext[4194304] = "4194304";
  outputtext[8388608] = "8388608";
  outputtext[16777216] = "16777216";
  outputtext[33554432] = "33554432";
  outputtext[67108864] = "67108864";
  outputtext[134217728] = "134217728";
  outputtext[268435456] = "268435456";
  outputtext[536870912] = "536870912";
  outputtext[1073741824] = "1G";
  outputtext[2147483648] = "2G";
  outputtext[4294967296] = "4G";
  outputtext[8589934592] = "8G";
  outputtext[17179869184] = "16G";
  outputtext[34359738368] = "32G";
  outputtext[68719476736] = "64G";
  outputtext[137438953472] = "128G";
  outputtext[274877906944] = "256G";
  outputtext[549755813888] = "512G";
  outputtext[1099511627776] = "1024G";
  outputtext[2199023255552] = "2048G";
  outputtext[4398046511104] = "4096G";
  outputtext[8796093022208] = "8192G";
  outputtext[17592186044416] = "16384G";
  outputtext[35184372088832] = "32768G";
  outputtext[70368744177664] = "65536G";
  outputtext[140737488355328] = "131072G";
  outputtext[281474976710656] = "262144G";
  outputtext[562949953421312] = "524288G";
  outputtext[1125899906842624] = "1048576G";
  outputtext[2251799813685248] = "2097152G";
  outputtext[4503599627370496] = "4194304G";
  outputtext[9007199254740992] = "8388608G";
  outputtext[18014398509481984] = "16777216G";
  outputtext[36028797018963970] = "33554432G";
  outputtext[72057594037927940] = "67108864G";
  outputtext[144115188075855870] = "134217728G";
  outputtext[288230376151711740] = "268435456G";
  outputtext[576460752303423500] = "536870912G";
  outputtext[1152921504606847000] = "1073741824G";
  outputtext[2305843009213694000] = "2147483647G";
  outputtext[4611686018427388000] = "∞";
  
  inner.classList.add("tile-inner");
  inner.textContent = outputtext[tile.value];

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
