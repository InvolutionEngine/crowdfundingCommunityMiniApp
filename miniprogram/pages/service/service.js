// pages/service/service.js
const timeTool = require("../../utils/timeTool")
const app = getApp()
const db= wx.cloud.database()
const capsule = wx.getMenuButtonBoundingClientRect()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    designerMessage:"作为设计师，我认为雕像艺术是一种非常特殊的艺术形式，它的特点在于利用一定的材料，通过雕刻、塑造等手段刻画出独特的造型或表现手法，以达到表达艺术家意图的目的。就其本身而言，雕像艺术是多方面的，它不仅包括人物类雕像，还有动物、建筑、装饰等方面的雕像艺术。另一方面，它的风格也是非常丰富多样的，从西方的古典主义、文艺复兴，到东方的佛教、道教，再到现代艺术的各种风格，都有着不同的表现形式，令人感受到强烈的艺术张力。从设计师的视角而言，对于雕像艺术的理解还需要从设计的角度出发，这包括对材料、工艺、空间、视觉效果、以及观众与环境等方面的认识，这些因素将对雕像的创作、制造与展示都产生重要的影响。因此，在设计一个雕像时，需要充分考虑这些因素，才能创造出一件成功的作品。",
    anticontent:"潮玩城市音乐节是一个结合音乐、时尚和科技元素的大型活动，旨在为城市青年提供一个多彩、多样的文化体验。我们计划在城市主要场馆举办多场音乐表演和音乐沙龙活动，邀请现场嘉宾和网络直播双平台共同参与。此次音乐节的主题将以潮流和创新为核心，通过音乐、电子竞技、娱乐等形式表现出城市年轻人对时尚文化和新科技的追求。活动内容包括现场DJ演出、音乐展览、电子竞技比赛、全息投影表演、科技展示等，同时还将提供精致的美食和饮品，为观众营造一个独特的现场体验。潮玩城市音乐节的目标是促进城市创意产业的发展，同时为广大城市年轻人提供一个交流和展示的平台。我们希望此次活动能够吸引来自各地的年轻人和音乐爱好者，体验这场潮流、时尚、科技与音乐的盛宴。因此，我们希望您能够批准这次活动，提供必要的支持和协助，一同打造一场难忘的音乐盛宴。",
    if_helpful:false,
    likesgoodsList:[],
    currentGifBc:"",
    wanshengList:[],
    propositionpRate:[],
    greatActions:[],
    currentsection:"设计师有话说",
    // 模拟labelgroupbox
    labelgroup:["音乐潮玩","美术设计","新时代风格"],
    sectiontapList:["精华","征集","设计师有话说"],
    subjectList:[],
    currenttopTap:"看万生",
    topTapList:["找众筹","广场","看万生"],
    currentIndex: 0,
    capsuleHeight:"",
    // 胶囊与上方的距离 同步到搜索栏即可实现相同距离
    capsuleTop:"",
  },
  gotows(e){
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../wansheng/wansheng?id='+e.currentTarget.dataset.id,
    })
  },

  //跳转话题
  goto_topic(event){
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
  // 点击跳转subject页面
  goto_subject(e){
    wx.navigateTo({
      url: '/pages/subject/subject?id='+e.currentTarget.dataset.id
   })
  },
  if_helpfulBtn(){
    this.setData({
      if_helpful:!this.data.if_helpful
    })
    if(this.data.if_helpful==false){
      wx.showToast({
        title: '已完成评价',
        duration: 1000,
        icon: "success",
        mask: true,
      })
    }else{
      wx.showToast({
        title: '已取消评价',
        duration: 1000,
        icon: "error",
        mask: true,
      })
    }
  },
  // 优惠卷
  cardBtn(){
    // showModal弹窗
    wx.showModal({
      title: '提示',
      content: '当前优惠卷系统维护中，尚无法使用',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 点击跳转征集详情页面
  goto_soliciting(){
    wx.navigateTo({
      url: '/pages/soliciting/soliciting'
   })
  },
  // 点击跳转海纳页面
  goto_haina(){
    wx.navigateTo({
       url: '/pages/haina/haina'
    })
  },
  /* 这里实现控制中间凸显图片的样式 */
  handleChange: function (e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },
  // 获取猜你喜欢的商品列表  若数据库中的数量少于skip(X) X的值会无法正常显示
  get_likesgoodsList(){
    var that = this
    wx.cloud.database().collection('crowdfunding').orderBy("completedPersonNum","desc").skip(1).get({
      success(res){
        console.log('获取猜你喜欢商品成功',res)
        that.setData({
          likesgoodsList:res.data,
        })
      }
    })
  },
  //获取万生信息
  get_wansheng(){
    let that =this
    db.collection("vitalityBox").get({
      success:res=>{
        console.log('获取万生信息',res)
        that.setData({
          wanshengList:res.data
        })
      },fail:err=>{
          console.log('获取万生信息失败',err)
        }
    })
  },
  //广场下方的tap切换
  exchangeSection(e){
    let that =this
    let name = e.currentTarget.dataset.name
    that.setData({
      currentsection:name
    })
  },
  // 切换上方的tab页面
  exchangeTopTap(e){
    let that =this
    let name = e.currentTarget.dataset.name
    that.setData({
      currenttopTap:name
    })
  },
  // 获取分类圈子数据
  get_proposition(){
    let that =this
    db.collection("proposition").orderBy('count','desc').where({
      type:"proposition",
    }).get({
      success:res=>{
        console.log('proposition连接成功',res)
        that.setData({
          propositionpRate:res.data
        })
      },fail:err=>{
          console.log('proposition连接失败',err)
        }
    })
  },
  //获取话题热议subject
  get_subjectList(){
    let that = this
      db.collection('proposition').orderBy('clicknum','desc').where({
        type: 'subject',
      })
      .get({
        success: function(res) {
          that.setData({
            subjectList:res.data
          })
          console.log("获取subject",res.data)
        }
      })
  },
  // 点击图片 查看图片
  previewImg(event){
    var that = this;
    console.log(event.currentTarget.dataset.src);
    wx.previewImage({
      current:event.currentTarget.dataset.src,
      urls: that.data.greatActions[event.currentTarget.dataset.index].images,
    })
  },
  //获取精华帖子详细信息
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    that.setData({

      capsuleHeight:capsule.height,
      capsuleTop:capsule.top

    })
    // 轮播图数据库连接
    // db.collection("swiper").get({
    //   success:res=>{
    //     console.log('轮播图连接成功',res)
    //     that.setData({
    //       swiper:res.data
    //     })
    //   },fail:err=>{
    //       console.log('轮播图连接失败',err)
    //     }
    // })
    that.get_proposition()
    that.get_subjectList()
    that.get_great_actions()
    that.get_wansheng()
    that.get_likesgoodsList()
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