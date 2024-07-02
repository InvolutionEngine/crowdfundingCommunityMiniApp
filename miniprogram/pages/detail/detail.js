// pages/detail/detail.js
const timeTool = require("../../utils/timeTool")
const app =getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    givelike:false,
    imageStyle:false,
    plcaceHolder:'评论',
  },
  // false ->  true
  givelike_ftot(){
    this.setData({
      givelike:true
    })
    wx.showToast({
      title: '昵称已开启',
      duration: 1000,
      icon: "success",
      mask: true,
    })
  },
  // true ->  false
  givelike_ttof(){
    this.setData({
      givelike:false
    })
    wx.showToast({
      title: '头像已开启',
      duration: 1000,
      icon: "success",
      mask: true,
    })
  },
  //  ---------------
  // false ->  true
  changeStyle_ftt(){
    this.setData({
      imageStyle:true
    })
    wx.showToast({
      title: '已开启全图模式',
      duration: 1000,
      icon: "success",
      mask: true,
    })
  },
  // true ->  false
  changeStyle_ttf(){
    this.setData({
      imageStyle:false
    })
    wx.showToast({
      title: '已关闭全图模式',
      duration: 1000,
      icon: "success",
      mask: true,
    })
  },
  // 点击地址
  openLocation(event){
    var that =this;
    console.log(event.currentTarget.dataset.index);
    wx.openLocation({
      latitude: that.data.action.latitude,
      longitude: that.data.action.longitude,
    })
  },
  // 发布评论
  publishComment(){
    var that = this
    if(app.globalData.userInfo == null){
      wx.navigateTo({
        url: '../auth/auth',
      })
    }else{
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
    }
  },
  getInputValue(event){
    console.log(event.detail.value)
    this.data.inputValue = event.detail.value
  },
  // 点击图片
    previewImg(event){
      var that = this;
      wx.previewImage({
        current:event.currentTarget.dataset.src,
        urls: that.data.action.images,
      })
  },
  //分享
  onShareAppMessage(){
    return{
      title: this.data.action.text,
      imageUrl: this.data.action.images[0],
      path:'pages/detail/detail?id=' + this.data.id
    }
  },

  onLoad(options) {
    this.setData({
      openid : app.globalData.openid
    })

    console.log(options.id)
    this.data.id = options.id
    this.getDetail()
  },
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
  // 点赞函数
  prizeAction(){
    var that = this
    if(app.globalData.userInfo == null){
      wx.navigateTo({
        url: '../auth/auth',
      })
    }else{
      var that = this 
      console.log(this.data.id)
      wx.cloud.database().collection('actions').doc(that.data.id).get({
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
            wx.cloud.database().collection('actions').doc(that.data.id).update({
              data:{
                prizeList:action.prizeList,
                prizenum:qixiaonum-1
              },
              success(res){
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
            wx.cloud.database().collection('actions').doc(that.data.id).update({
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
  // 删除
  delete(){
    console.log(this.data.id)
    var that = this;
    wx.cloud.database().collection('actions').doc(this.data.id).remove({
      success(res){
        console.log(res)

        // 删除成功了再提示
        wx.navigateBack({
          success(res){
            wx.showToast({
              title: '删除成功!',
            })
          }
        })
      }
    })
  },
  // 删除评论
  deleteComment(event){
    var that = this
    console.log(event.currentTarget.dataset.index)
    wx.showModal({
      title:'提示',
      content:'确认要删除此评论吗？',
      success(res){
        if(res.confirm){
          var index = event.currentTarget.dataset.index
          wx.cloud.database().collection('actions').doc(that.data.id).get({
            success(res){
              console.log(res)
              var action = res.data
              action.commentList.splice(index,1)
              wx.cloud.database().collection('actions').doc(that.data.id).update({
                data:{
                  commentList:action.commentList
                },
                success(res){
                  wx.showToast({
                    title: '删除成功！',
                  })
                  that.getDetail()
                }
              })
            }
          })
        }else if(res.cancel){
          console.log('取消')
        }
      }
    })
  },
  // 回复评论
  replyComment(event){
    console.log(event.currentTarget.dataset.index)
    var index = event.currentTarget.dataset.index

    this.setData({
      plcaceHolder :'回复' + this.data.action.commentList[index].nickName,
      toOpenid:this.data.action.commentList[index].openid,
      toNickname:this.data.action.commentList[index].nickName,
    }) 
  },

})