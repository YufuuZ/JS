document.addEventListener('DOMContentLoaded', function() {
    var gameContainer = document.getElementById('gameContainer');
    var startButton = document.getElementById('startButton');
  
    var icebergs = document.getElementsByClassName('iceberg');
    var penguin = document.getElementById('penguin');
    var gamePaused = false; // 游戏是否暂停的标志
    var timer; // 计时器
    var penguins = []; // 保存所有企鹅照片的数组
  
    // 音频元素
    var oceanAudio = document.getElementById('oceanAudio');
    var dropAudio = document.getElementById('dropAudio');
    var fallAudio = document.getElementById('fallAudio');
  
    // 点击开始游戏按钮的事件处理函数
    startButton.addEventListener('click', function() {
      document.getElementById('gameStart').style.display = 'none'; // 隐藏开始游戏按钮
      gameContainer.style.display = 'block'; // 显示游戏容器
  
      // 设置浮冰不透明度循环
      for (var i = 0; i < icebergs.length; i++) {
        var iceberg = icebergs[i];
        var delay = i * 500; // 延迟时间根据索引 i 进行设置，单位为毫秒
        fadeOpacity(iceberg, 2, delay);
      }
  
      // 循环播放海浪音频
      oceanAudio.loop = true;
      oceanAudio.play();
  
      // 开始计时器
      startTimer();
    });
  
    // 浮冰点击事件处理函数
    for (var i = 0; i < icebergs.length; i++) {
      var iceberg = icebergs[i];
      iceberg.addEventListener('click', function() {
        if (gamePaused) {
          return; // 游戏已暂停，不执行后续逻辑
        }
  
        var icebergRect = this.getBoundingClientRect();
        var icebergTop = icebergRect.top;
        var icebergLeft = icebergRect.left;
  
        var penguinTop = icebergTop - 40; // 向上移动 50px
        var penguinLeft = icebergLeft - 270; // 向左移动 270px
  
        penguin.style.top = penguinTop + 'px';
        penguin.style.left = penguinLeft + 'px';
  
        clearTimeout(timer); // 重置计时器
        startTimer(); // 重新开始计时
  
        var icebergOpacity = parseFloat(window.getComputedStyle(this).getPropertyValue('opacity'));
        if (icebergOpacity < 0.5) {
          gamePaused = true;
          stopTimer();
          gameOver();
          fallAudio.play(); // 播放落水音频
        } else {
          dropAudio.play(); // 播放水滴音频
        }
      });
    }
  
    function fadeOpacity(element, duration, delay) {
      setTimeout(function() {
        var startOpacity = 1;
        var endOpacity = 0;
  
        animate();
  
        function animate() {
          element.style.opacity = startOpacity;
  
          var interval = 10; // Interval in milliseconds
          var steps = duration * 1000 / interval;
          var deltaOpacity = (endOpacity - startOpacity) / steps;
  
          var currentStep = 0;
          var fadeInterval = setInterval(function() {
            if (currentStep < steps) {
              startOpacity += deltaOpacity;
              element.style.opacity = startOpacity;
              currentStep++;
            } else {
              clearInterval(fadeInterval);
              startOpacity = endOpacity;
              endOpacity = 1 - endOpacity;
              deltaOpacity = -deltaOpacity;
              setTimeout(animate, 1000);
            }
          }, interval);
        }
      }, delay);
    }
  
    function startTimer() {
      timer = setTimeout(function() {
        gamePaused = true;
        gameOver();
      }, 2500);
  
      // 每七秒复制一只企鹅照片，并排列在上一只企鹅的左侧
      setInterval(function() {
        var newPenguin = penguin.cloneNode(true);
        var lastPenguin = penguins[penguins.length - 1]; // 获取最后一只企鹅
        var lastPenguinRect = lastPenguin.getBoundingClientRect();
        var lastPenguinTop = lastPenguinRect.top;
  
        var newPenguinTop = lastPenguinTop + 'px';
        var newPenguinLeft = lastPenguin.style.left;
        newPenguin.style.top = newPenguinTop;
        newPenguin.style.left = newPenguinLeft;
  
        gameContainer.appendChild(newPenguin);
        penguins.push(newPenguin);
  
        movePenguins(); // 移动所有企鹅照片
      }, 7000);
    }
  
    function stopTimer() {
      clearTimeout(timer);
    }
  
    function gameOver() {
      while (gameContainer.firstChild) {
        gameContainer.removeChild(gameContainer.firstChild);
      }
  
      // 重置企鹅数组
      penguins = [];
  
      var gameOverDiv = document.createElement('div');
      gameOverDiv.id = 'gameOverDiv';
      gameOverDiv.innerHTML = '<p class="gameOverText">游戏结束</p>';
  
      var playAgainBtn = document.createElement('button');
      playAgainBtn.innerText = '再玩一次';
      playAgainBtn.classList.add('playAgainButton'); // 添加自定义类名
  
      playAgainBtn.addEventListener('click', function() {
        location.reload(); // 刷新页面重新开始游戏
      });
  
      gameOverDiv.appendChild(playAgainBtn);
      gameContainer.appendChild(gameOverDiv);
    }
  
    function movePenguins() {
      var penguinRect = penguin.getBoundingClientRect();
      var penguinTop = penguinRect.top;
  
      for (var i = 1; i < penguins.length; i++) {
        var currentPenguin = penguins[i];
        var prevPenguin = penguins[i - 1];
  
        var prevPenguinLeft = parseFloat(prevPenguin.style.left);
        var prevPenguinTop = parseFloat(prevPenguin.style.top);
  
        var currentPenguinTop = prevPenguinTop + 'px';
        var currentPenguinLeft = prevPenguinLeft - 110 + 'px'; // 左侧排列，向左移动110px
  
        currentPenguin.style.top = currentPenguinTop;
        currentPenguin.style.left = currentPenguinLeft;
      }
    }
  });
  