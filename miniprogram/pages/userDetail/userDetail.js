// pages/userDetail/userDetail.js
const timeTool = require("../../utils/timeTool")
const app = getApp()
const db= wx.cloud.database()
const _ = db.command
Page({

  data: {

  },
  // goback
  goback(){
    wx.navigateBack({
      delta: 1
    })
  },
  // 获取user myOpenid
  getUserMessage(){
    var that = this
    wx.cloud.database().collection('user').where({
      _openid: _.eq(that.data.userOpenid)
    }).get({
      success(res){
        console.log("222222222",res);
        // var time = timeTool.formatTime(new  Date(res.data[0].pubTime)).substring(0,10)
        that.setData({
         usermessage:res.data[0]
        })
      }
    })
  },
  // 点击地址
  openLocation(event){
    var that =this;
    console.log(event.currentTarget.dataset.index);
    wx.openLocation({
      latitude: that.data.actionsList[event.currentTarget.dataset.index].latitude,
      longitude: that.data.actionsList[event.currentTarget.dataset.index].longitude,
    })
  },
  Todetail(event){
    wx.navigateTo({
      url: '../../pages/detail/detail?id='+event.currentTarget.dataset.id
    })
  },
  onLoad(options) {

    var that = this
    console.log('接受到的用户的openid',options.openid)
    that.setData({
      userOpenid:options.openid
    })
    console.log(app.globalData.userInfo)
    var that = this;
    setTimeout(function(){
      console.log(app.globalData.openid)
      that.setData({
        myOpenid:app.globalData.openid
      })
    },2000)
    this.getActionsList()
    this.getUserMessage()
  },
  // 获取列表
  getActionsList(){
    var that = this
    // 连接actions 数据库  orderBy('time','desc')按时间排序 新的在上面
    wx.cloud.database().collection('actions').orderBy('time','desc').where({
      _openid:this.data.userOpenid
    }).get({
      success(res){
        console.log("拿到了",res)
        // 格式化时间 
        var list = res.data
        for(var l in list ){
          list[l].time = timeTool.formatTime(new  Date(list[l].time))
        }
        // 在刷新页面时 用循环来判断prizelist中是否有有自己 的 openid 
        // list[l] 即每一个action动态 prizeList[j] 即里面的每一个元素
        for(var l in list){
          for(var j in list[l].prizeList){
            if(list[l].prizeList[j].openid == app.globalData.openid){
              list[l].isPrized = true
            }
          }
        }
        // for(var l in list){
        //   list[l].prizenum = prizenum
        // }
        // for(var l in list){
        //   if(list[l].commentList.length != 0){
        //     for(var j in list[l].commentList){
        //       list[l].commentList[l].time = timeTool.formatTime(new Date(list[l].commentList[l].time))
        //      }
        //   }
        // }
        that.setData({
          actionsList:list
        })
      }
    })
  },

  
  // 点击图片
  previewImg(event){
      var that = this;
      console.log(event.currentTarget.dataset.src);
      wx.previewImage({
        current:event.currentTarget.dataset.src,
        urls: that.data.actionsList[event.currentTarget.dataset.index].images,
      })
  },

})