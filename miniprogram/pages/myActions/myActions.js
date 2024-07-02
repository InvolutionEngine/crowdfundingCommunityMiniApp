// pages/myActions/myActions.js
const app = getApp()
const timeTool = require("../../utils/timeTool")
const db= wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myopenid:"",
  },
  // 获取本地缓存的用户数据
  getlocalmessage(){
    var that = this
    wx.getStorage({
      key: 'globalData',
      success (res) {
        console.log("getStorage",res.data.openid)
        that.setData({
          myopenid:res.data.openid
        })
      }
    })
  },
  // 获取我发布的所有动态信息
  getAllactions(){  
    var that = this    
  //   setTimeout(function() {
  //     console.log('doSomething')
  //  }, 2000);
    console.log(that.myopenid);
    // 连接actions 数据库  orderBy('time','desc')按时间排序 新的在上面
     wx.cloud.database().collection('actions').where({
      _openid: that.myopenid
    }).orderBy('time','desc').get({
      success(res){
        console.log("拿到了",res)
        // 格式化时间 
        var list = res.data
        for(var l in list ){
          list[l].time = timeTool.formatTime(new  Date(list[l].time))
        }
        // 在刷新页面时 用循环来判断prizelist中是否有有自己 的 openid 
        // list[l] 即每一个action动态 prizeList[j] 即里面的每一个元素
        // for(var l in list){
        //   for(var j in list[l].prizeList){
        //     if(list[l].prizeList[j].openid == app.globalData.openid){
        //       list[l].isPrized = true
        //     }
        //   }
        // }
        that.setData({
          actionsList:list
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getlocalmessage() 
    // console.log(this.myopenid);
    this.getAllactions()
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})