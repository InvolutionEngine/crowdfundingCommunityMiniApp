// pages/subject/subject.js
const timeTool = require("../../utils/timeTool")
const app = getApp()
const db= wx.cloud.database()
const capsule = wx.getMenuButtonBoundingClientRect()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {

    currentIndex:0,
    // 是否展开 false不展开
    if_unfold:false,
    // introduction:"尊敬的各位来宾，很荣幸能在这里与大家分享这场盛大的音乐盛宴。潮玩城市音乐节不仅仅是一场音乐演出，更是一次对于新时代的彰显，以及对于个性的肯定。随着时代的发展，人们对于生活品质的追求也越来越高，无论是在穿搭、旅游还是文艺方面，都希望能够呈现出与众不同的个性。而这正是潮玩城市音乐节所呈现的一种态度——彰显个性。潮玩音乐，正如其名，是将流行音乐与潮流文化结合的一种新的方式。它将传统的音乐节注入了独具特色的街头文化元素，不仅有各种音乐表演和艺人互动，还有潮流牌子的推广、现场刺青、自拍装置等等。这场音乐节让人们可以在享受音乐的同时，感受到更多的文化与潮流。在这个新时代，以及这样一个五光十色的音乐节中，我们也要用自己的方式表达出我们的态度和个性。我们不能被固有的观念所束缚，我们要突破限制，创造属于我们自己的潮流。作为“90后”、“00后”一代，我们不仅在生活中追求独立和自由，也在音乐上追求个性和创造力。潮玩城市音乐节的舞台是我们真正跨越新时代的起点，展示我们的创意和表达自我的平台。在这里，我们可以穿着我们自己的衣服，舞出自己的舞步，唱出自己的歌曲。潮玩城市音乐节正是这样一个契机，它让我们明白，只有敢于做自己，才能在这个快速变化的社会中保持自己的个性和魅力。在这场音乐盛宴中，让我们一起彰显我们的个性，放飞自我，用音乐向着更加独立、自由、多元的未来迈进。",

    // 详情页 轮播图-轮播视频
    // detailswiper:[{id:0,url:"cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/propositionUrl/subjectBox/潮玩.jpg"},{id:1,url:"cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/officialBox/cicleBannerBox/circleBanner.jpg"},{id:2,url:"cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/propositionUrl/subjectBox/chaowan1.jpg"},{id:3,url:"cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/propositionUrl/subjectBox/chaowan2.jpg"}],

    // 数据图数据模拟
    // barList:[{name:5,bar:'14%'},{name:4,bar:'79%'},{name:3,bar:'6%'},{name:2,bar:'2%'},{name:1,bar:'2%'}],

    // rulesdetial:[{text:"基本规则解析",img:"cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/Temp/subject-temp1.jpg"},{text:"潮玩设计介绍",img:"cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/Temp/subject-temp2.jpg"},{text:"工具用法分享",img:"cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/Temp/subject-temp3.jpg"}],
    // strategyswiper:["cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/propositionUrl/subjectBox/潮玩.jpg","cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/officialBox/cicleBannerBox/circleBanner.jpg","cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/propositionUrl/subjectBox/chaowan1.jpg","cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/propositionUrl/subjectBox/chaowan2.jpg"],
    currentEx:"详情",
    starList:5,
    xunhuan:3,
    // imgarr:["cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/JL/temp_user_face/男1.jpeg","cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/JL/temp_user_face/女1.jpeg","cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/JL/temp_user_face/男2.jpg","cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/JL/temp_user_face/女2.jpg","cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/JL/temp_user_face/女3.jpeg",],
    // 头部切换栏
    topexchangeList:["详情","攻略","圈子"],
    capsuleHeight:"",
    capsuleTop:"",

    // tagList:["海纳","潮玩","设计分享"],
    greatActions:[],
    all:[],
  },
  // 话题规则按钮
  subject_rulesBtn(){
    wx.showModal({
      title: '提示',
      content: '话题数据库系统维护中，暂无法开启',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //话题视频按钮
  subject_videoBtn(){
    wx.showModal({
      title: '提示',
      content: '话题数据库系统维护中，暂无法开启',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
   //轮播图切换后重新赋值，让下方的缩小同步  
   handleChange: function (event) {
    this.setData({
      currentIndex: event.detail.current
    })
    console.log('handleChange',event.detail.current)
    console.log('handleChange',event)
  },
  //下方的缩小图 点击更改至对应的currntIndex
  exdownsroll(e){
    console.log('exdownsroll',e.currentTarget.dataset.id),
    this.setData({
      currentIndex:e.currentTarget.dataset.id
    })
  },
  //活动介绍折叠函数
  introduction_btn(){
    this.setData({
      if_unfold:!this.data.if_unfold
    })
  },
  // moni
  get_great_actions(){
    let that = this
      db.collection('actions').orderBy('prizenum','acs').where({
        quality:"精华",
      })
      .get({
        success: function(res) {
           // 格式化时间 
          var list = res.data
          for(var l in list ){
            list[l].time = timeTool.formatTime(new  Date(list[l].time))
          }
          that.setData({
            greatActions:list
          })
          console.log("获取精华帖子详细信息",res.data)
        }
      })
  },
  return_service(){
    wx.switchTab({
      url: '/pages/service/service',
    })
  },
  exchangeCurrent(e){
    let that =this
    let name = e.currentTarget.dataset.name
    that.setData({
      currentEx:name
    })
  },

  get_subjects(){
    let that = this
    wx.cloud.database().collection('subjects').doc(this.data.id).get({
      success(res){
        console.log("155",res)
        that.setData({
          all:res.data,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    that.setData({
      capsuleHeight:capsule.height,
      capsuleTop:capsule.top,
      currentIndex:0,
    })
    this.data.id = options.id
    console.log("sgsdgsgsg",options)
    // 获取subject信息
    this.get_subjects()
    this.get_great_actions()
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