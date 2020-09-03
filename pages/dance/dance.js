// pages/dance/dance.js
Page({

  /**
   * Page initial data
   */
  data: {
    currentDir: "",
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
    timer: null
  },
  onLoad() {
    this.getDirective();
    var code = wx.login();
    console.log(code);
  },
  onReady() {
    console.log(this.data.focus)
  },
  /**
   * 获取当前指令
   * @param {*} e 
   */
  getDirective(e) {
    var arr = "";
    var userLevel = this.data.rightCount < 10 ? this.data.rightCount + 1 : 10;
    for (let i = 0; i < userLevel; i++) {
      arr += this.data.enumDir[Math.floor(Math.random() * this.data.enumDir.length)];
    }
    this.setData({
      currentDir: arr,
      isGameStart: true,
      focus: true,
      inputDir: ""
    })
    console.log(this.data.currentDir);
    //计时器
    clearInterval(this.data.timer);
    this.clock();
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
   * 统计
   * @param {*} inputValue 
   */
  statistical(inputValue) {
    if (inputValue === this.data.currentDir) {
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
  /**
   * 输入转换
   * @param {*} e 
   */
  transformInputValue(e) {
    console.log('inputValue:', e.detail.value);
    this.setData({
      inputDir: this.replaceChar(e.detail.value)
    })

  },
  /**
   * 匹配结果
   * @param {*} e 
   */
  resultDir(e) {
    //获取输入信息
    var inputValue = e.detail.value !== "" ? this.replaceChar(e.detail.value) : "";
    console.log(inputValue);
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