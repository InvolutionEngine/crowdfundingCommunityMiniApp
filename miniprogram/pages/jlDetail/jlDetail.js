// pages/jlDetail/jlDetail.js
const timeTool = require("../../utils/timeTool")
const app =getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plcaceHolder:'留下属于你的气泡吧~~',
  },
   // 发布评论
   publishComment(){
    var that = this
    if(app.globalData.userInfo == null){
      wx.navigateTo({
        url: '../auth/auth',
      })
    }else{
      console.log(that.data.inputValue);
        if(that.data.inputValue){
          var that = this;
        wx.cloud.database().collection('actions').doc(that.data.id).get({
          success(res){
            console.log(res)
            var action = res.data
            var comment = {}
            comment.nickName = app.globalData.userInfo.nickName
            comment.faceImg = app.globalData.userInfo.avatarUrl
            comment.openid = app.globalData.openid
            comment.text = that.data.inputValue
            comment.time = Date.now()
            comment.toOpenid = that.data.toOpenid
            comment.toNickname = that.data.toNickname
            // 将组合好的comment push 推进action.commentList 里
            action.commentList.push(comment)
            wx.cloud.database().collection('actions').doc(that.data.id).update({
              data:{
                commentList : action.commentList
              },
              success(res){
                wx.showToast({
                  title: '评论成功！',
                  icon: 'none',
                  duration: 1500
                })
                that.getDetail()
                that.setData({
                  inputValue:'',
                  plcaceHolder:'评论'
                })
              }
            })
          }
        })
      }else{
        wx.showToast({
          title: '不能输入为空哦!',
          icon: 'none',
          duration: 1500
        })
        }
    }
  },
  getInputValue(event){
    console.log(event.detail.value)
    this.data.inputValue = event.detail.value
  },
  // 
  prizeAction(event){
    if(app.globalData.userInfo == null){
      wx.navigateTo({
        url: '../auth/auth',
      })
    }else{
      var that = this 
      console.log(event.currentTarget.dataset.id)
      wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).get({
        success(res){
          console.log(res)
          var action = res.data
          var tag = false
          var index
          // 判断自己的openid在不在点赞记录里
          // 如果在，即表明自己点赞了
          for(var l in action.prizeList){
            if(action.prizeList[l].openid == app.globalData.openid){
              tag = true
              index = l
              break
            }
          }
          if(tag){
            //  之前已点赞 删除点赞记录
            var qixiaonum = res.data.prizenum
            console.log(action)
            action.prizeList.splice(index,1)
            wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).update({
              data:{
                prizeList:action.prizeList,
                prizenum:qixiaonum-1
              },
              success(res){
                wx.showToast({
                  title: 'QwQ 点赞取消!',
                  icon: 'none',
                  duration: 1500
                })
                console.log("点赞取消",res)
                that.getDetail()
              }
            })
            
          }else{
            // 之前未点赞 增加点赞记录
            var user = {}
            var tempnum = res.data.prizenum
            user.nickName = app.globalData.userInfo.nickName
            user.faceImg = app.globalData.userInfo.avatarUrl
            user.openid = app.globalData.openid
            // push 函数将 上面的信息推入数组
            action.prizeList.push(user)
            wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).update({
              data:{
                prizeList:action.prizeList,
                prizenum:tempnum+1
              },
              success(res){
                wx.showToast({
                  title: '点赞成功！',
                  icon: 'none',
                  duration: 1500
                })
                  that.getDetail()
              }
            })
          }
        }
      })
    }
  },
  // 
  getDetail(){
    var that = this;
    // 通过data-id 和 url="" +event....id 传进来 id 再通过这个id 去到数据库里找 doc(id)
    wx.cloud.database().collection('actions').doc(this.data.id).get({
      success(res){
        console.log('time',res)
        // 格式化时间 
        var action = res.data      
        action.time = timeTool.formatTime(new Date(action.time))
        for( var l in action.prizeList){
          if(action.prizeList[l].openid = app.globalData.openid){
            action.isPrized =true
          }
        }
        for( var l in action.commentList){
          action.commentList[l].time = timeTool.formatTime(new Date(action.commentList[l].time))
        }
        that.setData({
          action:res.data,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      openid : app.globalData.openid
    })

    console.log(options.id)
    this.data.id = options.id
    this.getDetail()
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