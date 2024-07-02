// pages/add/add.js
const app = getApp()
const db= wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseTopic:"全部",
    topicList:[{topicName:"全部"}],
    proposition:[],
    chooseproposition:"",
    //
    title:"",
    titleNullString:"想一个有趣的标题吧！(非必填)",
    ifOpentopic:false,
    cloudImgList:[],
    inputValue:"",
    nullString:'记录这一刻的奇思妙想!',
    location:"分享您的位置",
    addresssInfo:{},
    provinces:"",
    Hight:"",
  },
  // 左侧点击选中
  choose_topic(e){
    console.log('choose_topic',e.currentTarget);
    let that = this
    let topicName = e.currentTarget.dataset.name
    that.setData({
      chooseTopic:topicName
    })
    that.getproposition(topicName)
  },
  // 右侧点击选中
  choose_proposition(e){
    console.log('choose_proposition',e.currentTarget);
    let that = this
    let proposition = e.currentTarget.dataset.proposition
    that.setData({
      chooseproposition:proposition,
      ifOpentopic:false
    })
    // 
    db.collection("proposition").where({
      proposition:proposition  
    })
    .get()
    .then(res=>{
      console.log('pkk',res.data[0].topicName)
      that.setData({
        chooseTopic:res.data[0].topicName
      })
    })
  },
  // 开始获得左侧的topic
  getTopic(){
    // db.collection('topic').get({
    //   success:res=>{
    //   console.log('topic_success',res)
    //   that.setData({
    //   topicList:res.data
    //   })
    //  console.log(topicList);
    // },fail:err=>{
    //   console.log('topic_mistake',err)
    //   }
    // })
    let that = this
    let topicList =that.data.topicList
    db.collection("topic")
    .get()
    .then(res=>{
      console.log("获取topic",res.data)
      that.setData({
        topicList:topicList.concat(res.data)
      })
    })
  },
  // 获得右侧的proposition
  getproposition(chooseTopic){
    let that = this
    if( chooseTopic == '全部'){
      db.collection("proposition")
      .get()
      .then(res=>{
        that.setData({
          proposition:res.data
        })
      })
    }else{
      db.collection("proposition").where({
        topicName:chooseTopic  //从数据库里拿数据  左边这个要看数据库的值名
      })
      .get()
      .then(res=>{
        console.log('else',res.data)
        that.setData({
          proposition:res.data
        })
      })
    }
  },

  openTopic(){
    this.setData({
      ifOpentopic:true
    })
  },
  closeTopic(){
    this.setData({
      ifOpentopic:false
    })
  },

  chooseVideo(e){
    var that = this;
    wx.chooseVideo({
      sourceType:['album','camera'],
      maxDuration:60,
      compressed:false,
      camera: 'back',
      success(res){
        console.log(res)
        console.log(res.tempFilePath.match(/\.(\w+)$/)[1])
        wx.showLoading({
          title:'上传中',
        })
        wx.cloud.uploadFile({
          cloudPath:`actionVideos/${Math.random()}_${Date.now()}.${res.tempFilePath.match(/\.(\w+)$/)[1]}`,
          filePath:res.tempFilePath,
          success(suc){
            console.log(suc.fileID);
            that.setData({
              videoUrl:suc.fileID
            })
            wx.hideLoading({})
          }
        })
      },
    })
  },

  chooseAddress(){
    var that =this;
    wx.chooseLocation({
      success(res){
        console.log(res);  
        that.setData({
          location:res.address+res.name,
          addresssInfo:res
        })
        if(res.address ==""){
          that.setData({
            location:"分享您的位置",
          })
        }
      }
    })
  },

  // 用户输入获取
  getValue(e){
    console.log(e.detail.value)
    this.setData({
      inputValue:e.detail.value
    })
  },
  getTitle(e){
    console.log(e.detail.value)
    this.setData({
      title:e.detail.value
    })
  },
  // 添加图片
  chooseImage(){
    var that = this;
    wx.chooseImage({
      count: 9 - that.data.cloudImgList.length,
      // sizeType 图片的质量  original 原图   compressed 压缩
      sizeType:['original','compressed'],
      // sourceType 图像来源  album 图库  camera 相机
      sourceType:['album','camera'], 
      success(res){
        console.log(res)
        console.log(res.tempFilePaths)
        // 上传图片
        that.data.tempImageList = res.tempFilePaths
        that.uploadImages()
      }
    })
  },
  uploadImages(){
    // 图片以数组形式存在
    var that = this;
    for( var i = 0 ; i< this.data.tempImageList.length ; i++){
      // 通过 wx.cloud.uploadFile 上传到 云开发中的云存储中 
      wx.cloud.uploadFile({
        // 这里需要的是反单引号 tap键上面那一个
        cloudPath:`actionImages/${Math.random()}_${Date.now()}.${this.data.tempImageList[i].match(/\.(\w+)$/)[1]}`,
        filePath:this.data.tempImageList[i],
        success(res){
          console.log(res.fileID)
          that.data.cloudImgList.push(res.fileID)
          that.setData({
            cloudImgList:that.data.cloudImgList
          })
        }
      })

    }
  },
  // 删除图片
  deleteImage(e){
    // data-index="{{index}}"  是为了获取第几个被删除
    console.log(e.currentTarget.dataset.index)
    this.data.cloudImgList.splice(e.currentTarget.dataset.index,1)
    this.setData({
      cloudImgList:this.data.cloudImgList
    })
  },
  // 提交
  submitData(){
    var that = this;
    // 添加蒙版 防止重复发送
    wx.showLoading({
      title:'发布中',
      mask:'true'
    })
    // && 都满足
    if(  !that.data.videoUrl && this.data.cloudImgList.length == 0){
      wx.showToast({
        icon:"none",
        title: '您还没添加图片或视频呢！',
      })
      return //下面代码不执行
    }
   if( !this.data.inputValue.length ){
     wx.showToast({
       icon:"none",
       title: '您还没输入内容呢！',
     })
     return //下面代码不执行
   }
  
    // 上传到 action 数据库的 云函数
    wx.cloud.database().collection('actions').add({
      data:{
        nickName:app.globalData.userInfo.nickName,
        faceImg:app.globalData.userInfo.avatarUrl,
        title:this.data.title,
        text:this.data.inputValue,
        images:this.data.cloudImgList,
        time:Date.now(),
        prizeList:[],
        prizenum:0,
        commentList:[],
        latitude:that.data.addresssInfo.latitude,
        longitude:that.data.addresssInfo.longitude,
        provinces:that.data.addresssInfo.name,
        address:that.data.addresssInfo.address + that.data.addresssInfo.name, 
        videoUrl:that.data.videoUrl,
        topicName:this.data.chooseTopic,
        proposition:this.data.chooseproposition
      },
      success(res){
        wx.switchTab({
          url: '../index/index',
        })
        wx.hideLoading({
          success: (res) => {},
        })
        console.log(res)
        wx.showToast({
          title: '成功！请下拉',
        })
        // 重置输入字符
        that.setData({
          inputValue:"",
        })
      }
    })

    // 发送完 数据重置
    this.setData({
      chooseTopic:"全部",
      topicList:[{topicName:"全部"}],
      proposition:[],
      chooseproposition:"",
      inputValue:"",
      nullString:'记录这一刻的奇思妙想吧!',
      title:"",
      titleNullString:"想一个有趣的标题吧！(非必填)",
      location:"请选择位置",
      addresssInfo:{},
      cloudImgList:[],
    })
  },

  // imgHeight(e){
  //   var winWid = wx.getSystemInfoSync().windowWidth//获取当前屏幕宽度

  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(app.globalData.userInfo)
    let that = this
    that.getTopic()
    that.getproposition("全部")
  },
})