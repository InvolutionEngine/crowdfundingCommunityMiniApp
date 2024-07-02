import { getMainColor } from '../../utils/image-main-color'

const timeTool = require("../../utils/timeTool")
const app = getApp()
const db= wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    if_open_content:false
  },
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
                console.log("点赞取消",res)
                that.newpage(that.data.proposition)
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
                that.newpage(that.data.proposition)
              }
            })
          }
        }
      })
    }
  },
  toUserDetail(e){
    wx.navigateTo({
      url: '/pages/userDetail/userDetail?openid='+e.currentTarget.dataset.openid,
    })
  },
  toJLDetail(e){
    wx.navigateTo({
      url: '/pages/jlDetail/jlDetail?id='+e.currentTarget.dataset.id,
    })
  },
  // 跳转官方页面
  gotobusDetail(event){
    console.log(event.currentTarget.dataset.openid)
    wx.navigateTo({
      url: '../../pages/userDetail/userDetail?openid='+event.currentTarget.dataset.openid
    })
  },
  // content显示开关
  contentSwicth(){
    let that = this
    var if_open_content =this.data.if_open_content
    // 如果是true 改为false // 如果是false 改为 true
    if(if_open_content){
      that.setData({
        if_open_content:false
      })
    }else{
      that.setData({
        if_open_content:true
      })
    }
    
  },
  // setBackgroundColor() {
  //   const ctx = wx.createCanvasContext('myCanvas')
  //   const that = this
  //   wx.getImageInfo({
  //     src: that.data.url,
  //     success: function (res) {
  //       const poster = res.path
  //       ctx.drawImage(poster, 100,100, 150, 100)
  //       ctx.draw(false, () => {
  //         wx.canvasToTempFilePath({
  //           x: 100,
  //           y: 100,
  //           width: 150,
  //           height: 100,
  //           destWidth: 150,
  //           destHeight: 100,
  //           canvasId: "myCanvas",
  //           success(res) {
  //             let tempPath = res.tempFilePath
  //             // 这种方式获取canvas区域隐含的像素数据
  //             wx.canvasGetImageData({
  //               canvasId: 'myCanvas',
  //               x: 100,
  //               y: 100,
  //               width: 150,
  //               height: 100,
  //               success(res) {
  //                 const imageData = res.data
  //                 // 分区块，可以拓展性的求主要色板，用来做palette
  //                 let resImageObj = getMainColor(imageData)
  //                 const { defaultRGB } = resImageObj
  //                 const { r, g, b } = defaultRGB
  //                 let resBackground = `rgb(${r}, ${g}, ${b})`
  //                 console.log('resBackground',resBackground)
  //                 that.setData({
  //                   resBackground
  //                 })
                  
  //                 // ctx.setFillStyle(resBackground)
  //                 // ctx.fillRect(0, 0, 150, 100)
  //                 // ctx.draw()
  //               },
  //             })
  //           },
  //           fail() {
  //             throw new Error()
  //           }
  //         })
  //       })
  //     },
  //     fail() {

  //     }
  //   })
  // },

  // 通过proposition获取数据库 拿到content信息 和 url
  getContent(str){
    // 一定要加 var that  =this 
    // 否则因为作用域的问题导致在appData里找不到数据
    var that  =this
    console.log(str);
    wx.cloud.database().collection('proposition').where({
      proposition: _.eq(str)
    }).get({
      success(res){
        var time = timeTool.formatTime(new  Date(res.data[0].pubTime)).substring(0,10)
        that.setData({
          content:res.data[0].content,
          url:res.data[0].url,
          busName:res.data[0].busName,
          bus_openid:res.data[0]._openid,
          pubTime:time,
          clicknum:res.data[0].clicknum,
        })
      }
    })
  },
  // 获取话题页的actions数据
  getActionList(str){
    var that  =this
    console.log(str);
    wx.cloud.database().collection('actions').where({
      proposition: _.eq(str)
    }).get({
      success(res){
        console.log("获取话题页的actions",res);
        that.setData({
          actionsList:res.data
        })
      }
    })
  },
  newpage(proposition){
    this.getContent(proposition)
    this.getActionList(proposition)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that =this;
    // console.log(options);
    let proposition = JSON.parse(options.proposition_str)
    let topicName = JSON.parse(options.topicName_str)
    console.log(topicName);
    console.log(proposition);
    that.setData({
      topicName:topicName,
      proposition:proposition
    })
    this.newpage(proposition)
    // this.setBackgroundColor()
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