// pages/dance/dance.js
Page({

  /**
   * Page initial data
   */
  data: {
    currentDir: [],
    isGameStart: true,
    rightCount: 0,
    errorCount: 0,
    ifRight: -1,
    focus: false,
    inputDir: "",
    userLevel: 3,
    enumDir: ['↑', '↓', '←', '→'], //'↖', '↗', '↙', '↘'
    allowError: 3,
    countdown: 3,
    timer: null,
    isClock: false
  },
  onLoad(options) {
    this.getDirective();
    this.data.isClock = options.isClock ? true : false;
    console.log('this.data.isClock=', this.data.isClock);
  },
  onReady() {

  },
  /**
   * 获取当前指令
   * @param {*} e 
   */
  getDirective(e) {
    var arr = [];
    var userLevel = this.data.rightCount < 10 ? this.data.rightCount + 1 : 10;
    for (let i = 0; i < userLevel; i++) {
      arr.push({
        str: this.data.enumDir[Math.floor(Math.random() * this.data.enumDir.length)],
        status: 'normal'
      });
    }
    this.setData({
      currentDir: arr,
      isGameStart: true,
      focus: true,
      inputDir: ""
    })
    console.log(this.data.currentDir);
    //计时器
    // if (this.data.isClock) {
      clearInterval(this.data.timer);
      this.clock();
    // }

  },
  /**
   * 替换字符
   * @param {*} str 
   */
  replaceChar(str) {
    return str.toUpperCase().replace(/W/g, '↑').replace(/S/g, '↓').replace(/A/g, '←').replace(/D/g, '→')
      .replace(/Q/g, '↖').replace(/E/g, '↗').replace(/Z/g, '↙').replace(/C/g, '↘');
  },

  /**
   * 计时器
   */
  clock() {
    //重置时间
    this.setData({
      countdown: 3
    })
    this.data.timer = setInterval(() => {
      console.log(this.data.countdown)
      this.data.countdown--;
      this.setData({
        countdown: this.data.countdown--
      })
      if (this.data.countdown == 0) {
        clearInterval(this.data.timer);
        this.data.errorCount++;
        this.gameOver();
      }
    }, 1000);
  },
  validationStr(str) {
    console.log("validationStr=", str);
    var currentDirTemp = this.data.currentDir;
    for (const s in str) {
      if (currentDirTemp[s].str === str[s]) {
        currentDirTemp[s].status = 'success';
      } else {
        currentDirTemp[s].status = 'error';
      }
    }
    console.log('currentDirTemp=', currentDirTemp);
    this.setData({
      currentDir: currentDirTemp
    })
  },
  /**
   * 输入转换
   * @param {*} e 
   */
  transformInputValue(e) {
    this.setData({
      inputDir: this.replaceChar(e.detail.value)
    }, (res) => {
      console.log('transformInputValue=', this.data.inputDir);
      this.validationStr(this.data.inputDir)
    })
  },
  /**
   * 统计
   * @param {*} inputValue 
   */
  statistical(inputValue) {
    var currentDirStr = "";
    // 转换字符串，今天输入比较
    this.data.currentDir.map(dir => {
      currentDirStr += dir.str;
    })
    if (inputValue === currentDirStr) {
      this.setData({
        rightCount: this.data.rightCount + 1,
        ifRight: 1
      })
    } else {
      this.setData({
        errorCount: this.data.errorCount + 1,
        ifRight: 0
      })
    }
  },
  /**
   * 匹配结果
   * @param {*} e 
   */
  resultDir(e) {
    //获取输入信息
    var inputValue = e.detail.value !== "" ? this.replaceChar(e.detail.value) : "";
    console.log("inputValue=", inputValue);
    //统计正确率
    this.statistical(inputValue);
    //是否结束游戏
    this.gameOver();
  },
  /**
   * 游戏结束
   */
  gameOver() {
    if (this.data.errorCount >= this.data.allowError) {
      this.setData({
        isGameStart: false
      })
      //打错三次提出
      wx.navigateTo({
        url: `/pages/over/over?rightCount=${this.data.rightCount}&errorCount=${this.data.errorCount}`,
      })
    } else {
      this.getDirective();
    }

  }
})