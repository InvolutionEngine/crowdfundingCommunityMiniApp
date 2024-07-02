const timeTool = require("../../utils/timeTool")
const app = getApp()
const db= wx.cloud.database()
const capsule = wx.getMenuButtonBoundingClientRect()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    JGlist:[
    {name:"限时发售",url:"cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/index/JGlist/sale.png",},
    {name:"文创鉴赏",url:"cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/index/JGlist/like.png"},
    {name:"活动速览",url:"cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/index/JGlist/document.png"},
    {name:"订单中心",url:"cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/index/JGlist/card.png"}],
    id:"",
    swiper:[],
    select_detail:"推荐",
    capsuleHeight:"",
    // 胶囊与上方的距离 同步到搜索栏即可实现相同距离
    capsuleTop:"",
    value:"点我查询~",
    inputvalue:"",
    iffocus:false,

    // 查询测试
    // search_list:[
    //   {
    //     title:'小快克命题作品-隔代伪科学',
    //     images:[
    //       'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/actionImages/0.32180685341449444_1709537075858.png',
    //     ],
    //   },
    //   {
    //     title:'洁柔命题作品-抽张上上纤',
    //     images:[
    //       'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/actionImages/0.32180685341449444_1709537075858.png',
    //     ],
    //   },
    // ],
  },
  // 金刚区链接按钮 限时发售 文创鉴赏 活动速览 优惠中心
  // 注意 页面间带值跳转 不仅在链接上要附带上参赛值 在跳转的页面也要设置接受函数
  bannerGoBtn(e){
    let temp = e.currentTarget.dataset.index
    console.log("bannerGoBtn",temp)
    if(temp=='限时发售'){
      wx.navigateTo({
        url: '/pages/haina/haina?choose='+temp,
      })
      return 0;
    }
    // wx.switchTab中的url不能携带参数
    if(temp=='文创鉴赏'){
      app.globalData.jgtipsec=true;
      wx.switchTab({ 
        url: '/pages/message/message'
      })
      return 0;
    }
    if(temp=='活动速览'){
      app.globalData.jgtipsec=true;
      wx.navigateTo({ 
        url: '/pages/subject/subject?id=0601950565e723bf00e7644d168e3ad8'
      })
      return 0;
    }
    if(temp=='订单中心'){
      app.globalData.jgtipsec=true;
      wx.navigateTo({ 
        url: '/pages/orderMessage/orderMessage'
      })
      return 0;
    }
  },
  // 搜索栏失去焦点
  searchnofocus(e){
    let temp = e.detail.value
    this.setData({
      iffocus:false
    })
    //如果点击焦点没输入 则恢复默认值
    if(!temp.length){
      this.setData({
        value:"点我查询~"
      })
    }else{//如果点击焦点有输入 则显示最近一次输入值
      this.setData({
        value:temp
      })
    }
  },
  // 搜索栏获取焦点 并删去默认值
  searchfocus(){
    this.setData({
      value:"",
      iffocus:true,
      cursor:0
    })
  },
  // 搜索栏输入
  search(e){
    console.log(e.detail.value)
    let that = this 
    let like = like
    if(e.detail.value){
      wx.showLoading({
        title: '搜索中',
      })
      db.collection("actions").where({
        title:{
          $regex:'.*' + e.detail.value + '.*',		//queryContent表示欲查询的内容，‘.*’等同于SQL中的‘%’
          $options: 'i'	
        },
      }).get().then(res=>{
        wx.hideLoading()
        console.log('搜索中',res)
        that.setData({
          search_list:res.data,
        })
      })
    }else{
      that.setData({
        search_list:[],
      })
    }
  },
  // 跳转 JL Detail
  toJLDetail(e){
    console.log(e)
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/jlDetail/jlDetail?id='+e.currentTarget.dataset.id,
    })
  },

  // 跳转
  toUserDetail(e){
    console.log(e.currentTarget.dataset.openid)
    wx.navigateTo({
      url: '/pages/userDetail/userDetail?openid='+e.currentTarget.dataset.openid,
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
  // 点击图片
  previewImg(event){
    var that = this;
    console.log(event.currentTarget.dataset.src);
    wx.previewImage({
      current:event.currentTarget.dataset.src,
      urls: that.data.actionsList[event.currentTarget.dataset.index].images,
    })
  },
  // 验证是否注册
  Toregistered(){
    if(app.globalData.userInfo == null){
      wx.navigateTo({
        url: '../auth/auth',
      })
    }else{
      wx.navigateTo({
        url: '../index/index',
      })
    }
  },
  gotoTopicDetail(event){
    console.log(event.currentTarget);
    // 这里的event.currentTarget.dataset.topicname 的 topicname 是小写
    let topicName = event.currentTarget.dataset.topicname
    let proposition = event.currentTarget.dataset.proposition
    console.log(topicName);
    console.log(proposition);
    let str = JSON.stringify(topicName)
    let _str = JSON.stringify(proposition)
    wx.navigateTo({
      url: '../topicDetail/topicDetail?topicName_str='+str+'&proposition_str='+_str
    })
  },
  //跳转详情页
  Todetail(event){
    wx.navigateTo({
      url: '../../pages/detail/detail?id='+event.currentTarget.dataset.id
    })
  },
  //拿到推荐信息
  // get_recommend_msg(){
  //  let that = this
  // },
  


  // 获取动态列表
  getActionsList(){
    var that = this
    // 连接actions 数据库  orderBy('time','desc')按时间排序 新的在上面
    wx.cloud.database().collection('actions').orderBy('time','desc').get({
      success(res){
        console.log("index成功获取动态信息",res)
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
        //       list[l].commentList[j].time = timeTool.formatTime(new Date(list[l].commentList[j].time))
        //      }
        //   }
        // }
        that.setData({
          actionsList:list
        })
      }
    })
  },

  // 删除动态
  deleteAction(event){
    // 需要顶格不然触发不了刷新函数  var that = this;
    var that = this;
    wx.showModal({
      title:'提示',
      content:'确认要删除此评论吗？',
      success(res){
        if(res.confirm){
          console.log(event.currentTarget.dataset.id)
          wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).remove({
            success(res){
                console.log(res)
                wx.showToast({
                  title: '删除成功!',
                })
                that.getActionsList()
              }
          })
        }else if(res.cancel){
          console.log('点击取消删除动态')
        }
      }
    }) 
  },

  // 选择区域函数
  select_detail(e){
    let that =this
    let name = e.currentTarget.dataset.name
    that.setData({
      select_detail:name
    })
  },
  // 下拉刷新
  onPullDownRefresh(){
    //定时两秒结束 通过stopPullDownRefresh 停止下拉刷新 从而停止小白点的存在时间
    // 下拉刷新的背景可以在本jsom 重新设置 且默认小白点颜色为背景同色 ，所以设置成 dark  比较能显示
    setTimeout(function(){
      wx.stopPullDownRefresh()
    },800)
    this.getActionsList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function() {
    var that = this;
    that.setData({
      capsuleHeight:capsule.height,
      capsuleTop:capsule.top
    })
    // that.getActionsList()
    // 因为此时出现了  index.js中的onLoad 函数和  app.js中的onLaunch函数同时运行的情况，导致openid为空
    // 所以让onLaunch 先运行，先调用云函数创建出数据globalData -》 openid 再进行 onLoad 中 myOpenid 的赋值
    setTimeout(function(){
      that.setData({
        myOpenid:app.globalData.openid
        
      })
    },2000)

    that.Toregistered();
    that.getActionsList()
  },
  // 长按删除评论
  deleteComment(event){
    var that = this
    console.log(event.currentTarget.dataset.id)
    console.log(event.currentTarget.dataset.index)
    wx.showModal({
      title:'提示',
      content:'确认要删除此评论吗？',
      success(res){
        if(res.confirm){
          var index = event.currentTarget.dataset.index
          wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).get({
            success(res){
              console.log(res)
              var action = res.data
              action.commentList.splice(index,1)
              wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).update({
                data:{
                  commentList:action.commentList
                },
                success(res){
                  wx.showToast({
                    title: '删除成功！',
                  })
                  that.getActionsList()
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
  // 点赞函数
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
                that.getActionsList()
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
                that.getActionsList()
              }
            })
          }
        }
      })
    }
  },
  //分享
  onShareAppMessage(event){
    // 是分享按钮
    if (event.from == 'button'){
      var index = event.target.dataset.index
    return{
      title: this.data.actionsList[index].text,
      imageUrl: this.data.actionsList[index].images[0],
      path:'pages/detail/detail?id=' + this.data.actionsList[index]._id
    }
    }
    if (event.from == 'menu'){
      return{
        title: '欢迎进入鲸遇-让您随时金遇',
        imageUrl: '',
        path:'pages/index/index' 
      }
   }
  },
})