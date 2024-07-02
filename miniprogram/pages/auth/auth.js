const app = getApp()
const timeTool = require("../../utils/timeTool")
const db= wx.cloud.database()
const _ = db.command

Page({

  data: {

  },
  onLoad(options) {
    
  },
  //新建一个用户数据
  newUser(globalData){
    var that = this;
    var flag = true;
    // 添加蒙版 防止重复发送
    console("globalData",globalData)
    wx.cloud.database().collection('user').where({
      _openid:_.eq(globalData.openid)
    }).get({
      success(res){
        console.log("已经拥有数据了",res)
        that.flag = false
      }
    })
    //   }
    // })
    if(!flag){
      return;
    }
    wx.showLoading({
      title:'注册中',
      mask:'true'
    })
    console("拿到了userInfo",userInfo)
    wx.cloud.database().collection('user').add({
      data:{
        user_message:{
          nickName:globalData.userInfo.nickName,
          city:"",
          country:"中国",
          field:["传统文化","文创收集者"],
          gender:2,
          hobby:"博览群书",
          tagmessage:"文创狂魔",
          honor:["萌新用户","文创爱好者"],
          integral:0,
          level:1,
          personality:"这个人很神秘，还没有留下印记呢",
          province:"",
          status:"用户",
          avatarUrl:globalData.userInfo.avatarUrl
        },
        _openid:globalData.openid
      },
    })
  },
  

  getInfo(){
    //  wx.getUserProfile({
    //   //  鲸遇需要获取您的必要信息以实现更优质的服务
    //    desc: '获取用户必要的信息',
    //    success(res){

    //      console.log(res)

    //      app.globalData.userInfo = res.userInfo
    //      console.log("app.globalData.userInfo",app.globalData.userInfo)
    //      // 设置缓存  
    //      wx.setStorageSync('userInfo', res.userInfo)//键值对
    //      wx.setStorageSync('globalData', app.globalData)//键值对
            
    //      wx.navigateBack({
    //        success(res){
    //          wx.showToast({
    //            title: '授权成功！',
    //          })
    //        }
    //      })
    //      wx.getStorage({
    //       key: 'globalData',
    //       success (res) {
    //         console.log("getStorage",res.data)
    //         wx.cloud.database().collection('user').add({
    //           data:{
    //             // user_message:{
    //               openid:res.data.openid,
    //               nickName:res.data.userInfo.nickName,
    //               city:"",
    //               country:"中国",
    //               field:["传统文化","文创收集者"],
    //               gender:2,
    //               hobby:"博览群书",
    //               tagmessage:"文创狂魔",
    //               honor:["萌新用户","文创爱好者"],
    //               integral:0,
    //               level:1,
    //               personality:"这个人很神秘，还没有留下印记呢",
    //               province:"",
    //               status:"用户",
    //               avatarUrl:res.data.userInfo.avatarUrl
    //             },
    //           // },
    //       })
    //       }
    //     })
    //    }
    //  })
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
    
  }


  // getInfo(e){
  //   console.log(e.detail.userInfo);
  //   app.globalData.userInfo = e.detail.userInfo
  //   wx.navigateBack({
  //     success(res){
  //       wx.showToast({
  //         title: '授权成功',
  //       })
  //     }
  //   })
  // }

  
})