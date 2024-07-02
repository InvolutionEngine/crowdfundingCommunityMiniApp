// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
         env: 'jingyu-0gthrnnd7f06d935',
      });
      if(wx.getStorageSync('openid')){
        this.globalData.openid = wx.getStorageSync('openid')
      }
      if(wx.getStorageSync('userInfo')){
        this.globalData.userInfo = wx.getStorageSync('userInfo')
      }

      var that = this;
      wx.cloud.callFunction({
        name:'getUserOpenid',
        success(res){
          console.log("app.js",res.result.openid)
          that.globalData.openid = res.result.openid
          wx.setStorageSync('openid',res.result.openid)
        }
      })

    }
  },
  // 全局数据
  globalData : {
    userInfo:null,
    openid:null,
    //金刚区-文创鉴赏 解决 wx.switchTab中的url不能携带参数的问题
    jgtipsec:false,
  }

});
