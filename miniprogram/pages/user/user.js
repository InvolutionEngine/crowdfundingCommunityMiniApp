// pages/user/user.js
const timeTool = require("../../utils/timeTool")
const app = getApp()
const db= wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // user:[],
    version:"none",
  },
  // 订单信息
  goto_orderMessage(){
    wx.navigateTo({
      url: '../orderMessage/orderMessage',
    })
  },
  //支持项目
  goto_supportProject(){
    wx.navigateTo({
      url: '../supportProject/supportProject',
    })
  },
  //我的发布
  goto_myAction(){
    wx.navigateTo({
      url: '../myActions/myActions',
    })
  },
  //关于我们
  show_version_Pop(){
    if (this.data.version === "none") {
      this.setData({
        version: "block"
      })
    } else {
      this.setData({
        version: "none"
      })
    }
  },


  //用户是否登录判断
  login(){
    let that = this
    // user
    // 这里只是获取user数据库的信息
    wx.getStorage({
      key: 'globalData',
      success (res) {
        console.log("getStorage",res.data)
        // 这个留给还没有登录 user没数据 的人用
        // that.setData({
        //   tempuserInfo:res.data
        // })
        // 找
        db.collection('user').where({
          nickName :_.eq(res.data.userInfo.nickName)
        }).get({
          success(res){
            console.log("res",res);
            that.setData({
              user:res.data[0]
            })
          },
        })
      }
     
    })
    console.log("login结束了");
  },
  // login_two
  login_two(){
    wx.getUserProfile({
      //  鲸遇需要获取您的必要信息以实现更优质的服务
       desc: '获取用户必要的信息',
       success(res){
         console.log(res)
         app.globalData.userInfo = res.userInfo
         console.log("app.globalData.userInfo",app.globalData.userInfo)
         var list = app.globalData.userInfo
         // 设置缓存  
         wx.setStorageSync('globalData', app.globalData)//键值对
         wx.navigateBack({
           success(res){
             wx.showToast({
               title: '授权成功！',
             })
           }
         })
         db.collection('user').where({
          nickName :_.eq(list.nickName)
        }).get({
          success(res){
            console.log("res",res);
            that.setData({
              user:res.data[0]
            })
          },
          fail(err){
            wx.getStorage({
              key: 'globalData',
              success (res) {
                console.log("getStorage",res.data)
                wx.cloud.database().collection('user').add({
                  data:{
                    // user_message:{
                      nickName:res.data.userInfo.nickName,
                      city:"",
                      country:"中国",
                      field:["传统文化"],
                      gender:2,
                      hobby:"传统文化",
                      tagmessage:"加班狂魔",
                      honor:["萌新用户","文创爱好者"],
                      integral:0,
                      level:1,
                      personality:"这个人很神秘，还没有留下印记呢",
                      province:"",
                      status:"用户",
                      avatarUrl:res.data.userInfo.avatarUrl
                    },
                  // },
              })
              }
            })
          }
        }) 
       }
     })     
  },
  //修改个信签名
  change_personality(){
    wx.navigateTo({
      url: '../change_personality/change_personality'
    })
  },

  //registeredBtn
  registeredBtn(){
    this.login_two()
    this.login()
  },
  
  //显示我的界面  注册
  register(){
    let that = this
    wx.showModal({
      title:'提示',
      content:'您还没注册过 是否需要注册',
      success(res){
        if(res.confirm){
          console.log('用户点击确定')
          //---------------------
          wx.getUserProfile({
            desc:'需要进行注册哦',
            success:(user_message)=>{
              console.log(user_message)
              wx.showLoading({
                title: '正在为您注册',
              })
             db.collection('user').add({
               data:{
                user_message:user_message.userInfo
               }
             }).then(user=>{
               wx.hideLoading()
               wx.showToast({
                 title: '注册成功',
               })
                that.login()
             })
            }
          })
          // wx.showModal({
          //   title:'提示',
          //   content:'您还需要进一步完善信息哦',
          //   success(res){
          //     if(res.confirm){
          //       console.log('用户点击确定')
          //       wx.navigateTo({
          //         url: '../index/index'     
          //       })
          //     }else{
          //       console.log('用户点击取消')
          //     }
          //   }
          // })
         //---------------------
        }else if(res.cancel){
           console.log('用户点击取消')
        }
      }
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that =this
    // that.login()
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