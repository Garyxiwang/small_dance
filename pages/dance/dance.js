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
    focus: false,
    inputDir: "",
    userLevel: 3
  },
  onLoad() {
    this.getDirective();
  },
  /**
   * 获取当前指令
   * @param {*} e 
   */
  getDirective(e) {
    var level1 = ['↑', '↓', '←', '→'];
    var arr = "";
    var userLevel = this.data.rightCount % 3 == 0 ? this.data.rightCount + 1 : 3;
    for (let i = 0; i < userLevel; i++) {
      arr += level1[Math.floor(Math.random() * level1.length)];
    }
    this.setData({
      currentDir: arr,
      isGameStart: true,
      focus: true,
      inputDir: ""
    })
    console.log(this.data.currentDir);
  },
  /**
   * 替换字符
   * @param {*} str 
   */
  replaceChar(str) {
    return str.replace(/w/g, '↑').replace(/s/g, '↓').replace(/a/g, '←').replace(/d/g, '→');
  },
  statistical(inputValue) {
    if (inputValue === this.data.currentDir) {
      this.setData({
        rightCount: this.data.rightCount + 1
      })
    } else {
      this.setData({
        errorCount: this.data.errorCount + 1
      })
    }
  },
  /**
   * 
   * @param {*} e 
   */
  resultDir(e) {
    var inputValue = e.detail.value !== "" ? this.replaceChar(e.detail.value) : "";
    console.log(inputValue);
    this.statistical(inputValue);

    if (this.data.errorCount >= 3) {
      this.setData({
        isGameStart: false
      })
      wx.redirectTo({
        url: '/pages/over/over',
      })
    } else {
      this.getDirective();
    }
  }
})