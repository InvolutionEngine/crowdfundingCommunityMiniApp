// pages/haina/haina.js
const timeTool = require("../../utils/timeTool")
const app = getApp()
const capsule = wx.getMenuButtonBoundingClientRect()
const db= wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {

    zhongchouBanner:[
      {url:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/haina/zhongchouBanner/1.jpg',
       id:'2da1518365ec72ce018174a9782ac24a'},
      {url:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/haina/zhongchouBanner/2.jpg',
      id:'63ca5b1365ec67bb018016376a68b4cb'},
      {url:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/haina/zhongchouBanner/3.jpg',
      id:'5ca5d26765ec62800181e8db797e5aad'},
      {url:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/haina/zhongchouBanner/4.png',
      id:'5ca5d26765ec2d39017b069844a0a382'}
    ],

    value:"点我查询~",
    inputvalue:"",
    // JD
    jingyuJDswiper:['cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/swiper/jingyuJDBox_swiper/图怪兽_8451d3f34445d3145688c1193c99454d_49501.png','cloud://cloud1-8glnu2cm852a2315.636c-cloud1-8glnu2cm852a2315-1309854973/swiper/jingyuJDBox_swiper/图怪兽_9f0ca2b000fecc0c44e7d5e4d06a0e97_76729.png'],
    exchangeBoxtopImg:"",
    // exchangeBoxtopgoods:"",
    //滑动坐标
    startX: 0,
    startY: 0,
    direction: null, //活动方向 L 左滑  R 右滑
    // ["推荐","众筹","鲸遇商城","限时发售","鲸点兑换","文创中心"],
    category_box:["推荐","众筹","鲸遇商城","限时发售"],
    new_choose_category:"鲸遇商城",


    currentmiddle:"全部",
    //中间切换栏
    middlebox:["全部","众筹商品","鲸遇商城","联动产品",],


    salesBtn:["已众筹金额","剩余时间"],
    current_salesBtn:"数量",
    mid_area_box:[{text:"推荐",url:""},{text:"推荐",url:""},{text:"推荐",url:""},{text:"推荐",url:""},,],
    // cate_mini:["传统文化","影视周边","联名作品","艺术设计","潮玩好物"],
    // pageIndex = 0,
    // category_box:[]
    centerItem: 0,
    currentIndex: 0,

    capsuleHeight:"",
    capsuleTop:"",

    tuijianSwiperList:[
    'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/haina/tuijianSwiperList/one.jpg',
    'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/haina/tuijianSwiperList/two.jpg',
    'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/haina/tuijianSwiperList/three.jpg'
    ],
    jyshopList:[
      {
        SwiperList:['cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/goods/001/swiper01.jpg',
        'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/goods/001/swiper02.jpg',
        ],
        commentList:[
          {
            faceImg:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/text_faceImg/女1.jpeg',
            contentText:'众筹成功啦！抢到了早鸟档！',
          }
        ]
      }
    ],
    JDexchangeList:[
      {
      faceImg:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/text_faceImg/男1.jpeg',
      nickName:'楷行草人',
      goodsName:'敦煌文创冰箱贴系列产品',
      },
      {
        faceImg:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/text_faceImg/男2.jpeg',
        nickName:'大大怪小小乖',
        goodsName:'姜子牙文创手办系列产品',
      },
      {
        faceImg:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/text_faceImg/女2.jpeg',
        nickName:'叽里呱啦',
        goodsName:'悟空九头蛇雕塑系列产品',
      }
    ],
    jingyuJDswiper:[
      'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/haina/鲸点积分.png',
      'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/haina/积分兑换.png',
    ],

  },
  search(e){
    console.log(e.detail.value)
    let that = this 
    let like = like
    if(e.detail.value){
      // wx.showLoading({
      //   title: '搜索中',
      // })
      db.collection("crowdfunding").where({
        goodsName:{
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
  searchinput(e){
    let that =  this
    let temp = e.detail.value
    that.setData({
      inputvalue:temp
    })
    // console.log("e.detail.value:",temp)
  },
  gotogoodsDetail(e){
    console.log('gotogoodsDetail',e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../haina_zcDetail/haina_zcsDetail?id='+e.currentTarget.dataset.id,
    })
  },

  // 切换Currentmiddle
  changeCurrentmiddle(e){
    // console.log(e.currentTarget.dataset.name)
    this.setData({
      currentmiddle: e.currentTarget.dataset.currentdata
    })
  },
  /* 这里实现控制中间凸显图片的样式 */
  handleChange: function (e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },
  // 返回服务页面
  return_service(){
    wx.switchTab({ 
      url: '/pages/service/service'
    })

  },
  //轮播图滑动时改变居中项
  handleSwiperChange(e) {
    this.setData({
      centerItem: e.detail.current,
    })
  },

  moneyorder(){
    this.setData({
      crowdfundingList:this.data.crowdfundingList.sort(this.compare('completedMoneyTarge')).reverse()
    })
  },
  timeorder(){
    this.setData({
      crowdfundingList:this.data.crowdfundingList.sort(this.compare('hournum'))
    })
  },
  compare: function(name) {
    return function(o, p) {
    var a, b;
    if (typeof o === "object" && typeof p === "object" && o && p) {
      a = o[name];
      b = p[name];
    if (a === b) {
      return 0;
    }
    if (typeof a === typeof b) {
      return a < b ? -1 : 1;
    }
    return typeof a < typeof b ? -1 : 1;
    } else {
      throw ("error");
    }
    }
    },

  choosecurrentSalesBtn(e){
    // console.log(e.currentTarget.dataset.name)
    if(e.currentTarget.dataset.name=='剩余时间'){
      this.timeorder();
    }
    if(e.currentTarget.dataset.name=='已众筹金额'){
      this.moneyorder();
    }
    this.setData({
      current_salesBtn:e.currentTarget.dataset.name
    })
  },
  // 获取鲸点兑换
  getJDexchangeList(){
    var that = this
    // .where({type:"已付款"})
    wx.cloud.database().collection('JDexchangeList').orderBy("exchangetime","desc").get({
      success(res){
        // console.log('获取鲸点兑换',res)
        var exlist = res.data
        // 格式化时间
        exlist.exchangetime = timeTool.formatTime(new  Date(exlist.exchangetime))
  
        that.setData({
          JDexchangeList:exlist
        })
      }
    })
  },
  // 获取发售中的商品
  getJYshopList(){
    var that = this
    // .where({type:"已付款"})
    wx.cloud.database().collection('crowdfunding').where({type:"发售"}).orderBy("orderNum","desc").get({
      success(res){
        // console.log(' 获取预备商品成功',res)
        that.setData({
          jyshopList:res.data
        })
      }
    })
  },
   // 获取预备中的商品
   getComingList(){
    var that = this
    // .where({type:"已付款"})
    wx.cloud.database().collection('crowdfunding').where({type:"预备"}).orderBy("endTime","desc").get({
      success(res){
        console.log(' 获取预备商品成功',res)
        that.setData({
          comingList:res.data
        })
      }
    })
  },
  // 获取众筹banner  众筹中的
  // getZhongchouBanner(){
  //   var that = this
  //   // .where({type:"已付款"})
  //   wx.cloud.database().collection('crowdfunding').where({type:"众筹"}).orderBy("completedMoneyTarge","desc").get({
  //     success(res){
  //       console.log(' 获取众筹banner成功',res)
  //       that.setData({
  //         zhongchouBanner:res.data,
  //       })
  //     }
  //   })
  // },
  // 获取所有的众筹商品
  getcrowdfunding(){
    var that = this
    wx.cloud.database().collection('crowdfunding').orderBy('completedMoneyTarge','desc').get({
      success(res){
        console.log('获取众筹商品成功',res)
        var now_time =new Date().getTime();
        for(var x in res.data){
          var temp=res.data[x].endTime -now_time;
          temp =parseInt(temp/(3600*1000));
          res.data[x].hournum = temp;
        }
        that.setData({
          crowdfundingList:res.data,
        })
      }
    })
  },

  getzcHournum(){
    var that = this
    var now_time =new Date().getTime();
    now_time = now_time/(1000*60*60);
    console.log('list',that.data.crowdfundingList);
    console.log('now_time',now_time);
    // for(var x in crowdfundingList){
    //   var temp=crowdfundingList[x].endTime -now_time;
    //   that.setData({
    //     crowdfundingList.hournum = temp;
    //   })
    // }
  },

  // 选择分区
  changeChooseItem(e){
    console.log(e.currentTarget.dataset.name)
    this.setData({
      new_choose_category:e.currentTarget.dataset.name
    })
  }
  ,
  // 拿到 推荐区的轮播图
  // getTuijianSwiper(){
  //   var that = this
  //   wx.cloud.database().collection('tuijianBox_swiper').get({
  //     success(res){
  //       console.log('推荐区轮播图连接成功',res)
  //       that.setData({
  //         tuijianSwiperList:res.data
  //       })
  //     }
  //   })
  // },
  // 拿到 众筹区的轮播图
  getZhognchouSwiper(){
    var that = this
    wx.cloud.database().collection('zhognchou_swiper').get({
      success(res){
        // console.log('众筹区轮播图连接成功',res)
        that.setData({
          zhongchouSwiperList:res.data
        })
      }
    })
  },
  // 拿到 鲸遇商城区的轮播图
  // getJingyushopSwiper(){
  //   var that = this
  //   wx.cloud.database().collection('jingyu_swiper').get({
  //     success(res){
  //       console.log('鲸遇商城区连接成功',res)
  //       that.setData({
  //         jingyushopList:res.data
  //       })
  //     }
  //   })
  // },
  // 拿到 category数据库 里面的 种类 
  // getCategory(){
  //   var that = this
  //   wx.cloud.database().collection('hn_category').get({
  //     success(res){
  //       console.log('hn_category连接成功',res)
  //       that.setData({
  //         category_box:res.data
  //       })
  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    // 这里是金刚区跳转的接收装置
    that.setData({
      capsuleHeight:capsule.height,
      capsuleTop:capsule.top,
      new_choose_category:options.choose,
    })
    // that.getCategory();
    // that.getTuijianSwiper();
    that.getZhognchouSwiper();
    // that.getZhongchouBanner();
    that.getComingList();
    // that.getJingyushopSwiper();
    // that.getJYshopList();
    // that.getJDexchangeList();
    // 获取所有的众筹商品
    that.getcrowdfunding();
    that.getzcHournum();
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

  },
  touchstart: function (e) {
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    })
  },

  //滑动中判断滑动方向
  touchmove: function (e) {
    let startX = this.data.startX // 开始x坐标
    let startY = this.data.startY // 开始y坐标
    let touchMoveX = e.changedTouches[0].clientX // 活动变化坐标
    let touchMoveY = e.changedTouches[0].clientY //滑动变化坐标
    let angle = this.angle({
      X: startX,
      Y: startY
    }, {
      X: touchMoveX,
      Y: touchMoveY
    })
    //滑动角度超过retrun
    console.log(Math.abs(angle),"Math.abs(angle)")
    if (Math.abs(angle) > 45) return
    // 上下直划
    if( (touchMoveY - startY)>50||(touchMoveY - startY)<-50)
      return
    // 防止彻划
    if ((touchMoveX - startX)>100 && ((touchMoveY - startY)>20 ||(touchMoveY - startY)<-20)){ //右滑
      console.log("touchMoveX",touchMoveX);
      console.log("startX",startX);
      this.setData({
        direction: 'R'
      })
    } 
    if((touchMoveX - startX)<-100 && ((touchMoveY - startY)>20 ||(touchMoveY - startY)<-20)) {
      console.log("touchMoveX",touchMoveX);
      console.log("startX",startX);
      this.setData({ //左滑
        direction: 'L'
      })
    }
  },

  // 滑动角度限制
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 / Math,atan()返回数据的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI)
  },

 // 滑动结束
  tochend: function (e) {
    let that = this
    if (this.data.direction == 'R') { // 左滑相当于上一页
     console.log("左滑到上一页",e.currentTarget.dataset.before),
     that.setData({
      new_choose_category:e.currentTarget.dataset.before
     })
    } else if (this.data.direction == 'L') { //右滑相当于下一页
     console.log("右滑到下一页",e.currentTarget.dataset.next)
     that.setData({
      new_choose_category:e.currentTarget.dataset.next
     })
    } else { // 相当于滑动不成立,清空driection
      this.setData({
        direction: ''
      })
    }
  },
})
