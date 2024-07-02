// pages/message/message.js
const app = getApp()
const db= wx.cloud.database()
const time = require('../../utils/timeTool.js')

const capsule = wx.getMenuButtonBoundingClientRect()



Page({
  /**
   * 页面的初始数据
   */
  data: {

    // 前言
    qianyan:'欢迎各位文创设计师们前来参“创意无限：玩偶VS公仔”主题活动！这是一个结合了童趣可爱与设计创意的盛会，让参与者们通过玩偶与公仔的元素，发挥无限的设计想象，创作出独具匠心的文创作品。',
    // 背景
    beijing:'在多元的文化环中，玩偶和公仔作为广受欢迎的可爱角色，具有承载情感、传递快乐的独特魅力。本次活动旨在通过这两种元素，激发设计师们对创意的无限探索，引领文创设计的新风尚，让每一个玩偶公仔都成设计的源泉，发更多有趣、有料、有趣的灵感。',
    // 活动内容
    introduce:"本次活动已“玩偶公仔文创大乱斗”为赛事主题，希望借此机会让文创设计师们将玩偶和公仔的个性元素融入到文创的设计当中，实现文创多元素融合特性。实际创作核心不做限制，由文创设计师们自由发挥新的创意~~~",
    
    // 规则
    rule:"用户根据活动主题发布自己创作的文创内容信息，各位小鲸鱼们可以用自己的鲸票为自己喜欢的文创产品进行投票，投票信息榜单会实时更新，每一只鲸鱼每天最多可以投一张票哦~  如果出现相同票数者，则已最快达到最高票数者为准。",
    
    // 结语
    jieyu:'“创意无限：玩偶VS公”主题活动，是一场释放设计力量、进文创交流、挖掘创意潜能的绝佳机会。让我们一起在个充满童、创意无限舞台上，共同受设计的魔，用心灵和情创作属于自己的文创精品！',
    

    if_chiyun:false,
    temp:0,
    //词云模拟
    list:[
      'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/词云/1.png',
      'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/词云/2.png',
      'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/词云/3.png',
      'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/词云/4.png',
      'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/词云/5.png',
      // {
      //   url:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/词云/1.png',
      //   id:1,
      // },
      // {
      //   url:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/词云/2.png',
      //   id:2,
      // },
      // {
      //   url:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/词云/3.png',
      //   id:3,
      // },
      // {
      //   url:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/词云/4.png',
      //   id:4,
      // },
      // {
      //   url:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/词云/5.png',
      //   id:5,
      // },
      
    ],
    currentIdea:0,
    if_showIDEA:false,
    currentIndex:0,
    if_showdetail:false,
    // 倒计时
    nowDate: '2024-6-30 18:00:00', //结束时间
    countdown: '', //倒计时
    days: '00', //天
    hours: '00', //时
    minutes: '00', //分
    seconds: '00', //秒
    // -----
    value:"点我查询~",
    inputvalue:"",
    yanxiang:{},
    iffocus:false,
    // 赛品评估   文创鉴赏
    tapchoose:"赛品评估",
    // 第一个tap
    currentchoose:"作品展示",//作品展示、主题介绍、时排行榜
    // 第二个tap
    currentchooseSec:"创意亮点",//祝福祈愿 词云速览 创意亮点
    // 通过接口获取微信胶囊的信息const 赋值到capsule 然后再用setData赋值到页面数据
    capsuleHeight:"",
    // 胶囊与上方的距离 同步到搜索栏即可实现相同距离
    capsuleTop:"",

    // 总投票数
    allNum:0,
  },
  search(e){
    let that = this 
    let like = like
    if(e.detail.value){
      wx.showLoading({
        title: '搜索中',
      })
      db.collection("yanxiang").where({
        worksname:{
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
  ideaClose(){
    this.setData({
      if_showIDEA:false
    })
  },
  ideaOpen(e){
    // console.log('ideaOpen',e.currentTarget.dataset.id)
    this.setData({
      if_showIDEA:true,
       currentIdea:e.currentTarget.dataset.id
    })
  },
  detailClose(){
    this.setData({
      if_showdetail:false
      
    })
  },
  detailOpen(e){
    console.log('detailOpen',e.currentTarget.dataset.id)
    this.setData({
      if_showdetail:true,
       currentIndex:e.currentTarget.dataset.id
    })
  },

  chiyun_open(){
    this.setData({
      if_chiyun : true
    })
  },
  chiyun_next(){
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    console.log('111',this.data.temp)
    if(this.data.temp==4){
      this.setData({
        temp : 0
      })
    }else{
      this.setData({
        temp : this.data.temp+1
      })
    }
    console.log('222',this.data.temp)
  },

  // text,top,time,color
  bindbt:function(){
    doommList.push(new Doomm('梦想成真！大吉大利！万事如意！',Math.ceil(Math.random()*100),Math.ceil(Math.random()*10),getRandomColor()));
    this.setData({
      doommData : doommList,
    })
  },
  // 投票
  voteBtn(e){
    // console.log("voteBtn",e.currentTarget.dataset.id)
    // e.currentTarget.dataset.id
    var that = this
    var temp = that.data.allNum
    wx.showModal({
      title: '提示',
      content: '确认是否投票',
      success (res) {
          // 这里是模拟上传延迟
          if (res.confirm) {
          wx.showLoading({
            title: '投票成功',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)          
          temp = temp + 1
          that.setData({
            allNum: temp
          })
          db.collection("yanxiang").doc(e.currentTarget.dataset.id).update({
            data:{
              voteNum:(e.currentTarget.dataset.num+1),
            }
          })
          wx.showToast({
            title: '请下拉刷新',
            icon: 'success',
            duration: 2000
          })          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  // 时间计算
  countTime() {
    let days,hours, minutes, seconds;
    let nowDate = this.data.nowDate;
    // console.log(nowDate)
    let that = this;
    let now = new Date().getTime();
    let end = new Date(nowDate).getTime(); //设置截止时间
    // console.log("开始时间：" + now, "截止时间:" + end);
    let leftTime = end - now; //时间差                         
    if (leftTime >= 0) {
      days = Math.floor(leftTime / 1000 / 60 / 60 / 24);
      hours = Math.floor(leftTime / 1000 / 60 / 60 % 24);
      minutes = Math.floor(leftTime / 1000 / 60 % 60);
      seconds = Math.floor(leftTime / 1000 % 60);
      seconds = seconds < 10 ? "0" + seconds : seconds
      minutes = minutes < 10 ? "0" + minutes : minutes
      hours = hours < 10 ? "0" + hours : hours
      that.setData({
        countdown: days+":"+hours + "：" + minutes + "：" + seconds,
        days,
        hours,
        minutes,
        seconds
      })
      // console.log(that.data.countdown)
      //递归每秒调用countTime方法，显示动态时间效果
      setTimeout(that.countTime, 1000);
    } else {
      that.setData({
        countdown: '已截止'
      })
    }
 },
  // 双项切换专题
  tapchange(e){
    let that =this
    let name = e.currentTarget.dataset.name
    that.setData({
      tapchoose:name
    })
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
    console.log("e.detail.value:",temp)
  },
  // 切换作品展示、主题介绍、时排行榜
  switchover(e){
    let that =this
    let name = e.currentTarget.dataset.name
    that.setData({
      currentchoose:name
    })
  },
  // 切换选项二
  switchoverSec(e){
    let that =this
    let name = e.currentTarget.dataset.name
    that.setData({
      currentchooseSec:name
    })
  },
  changeTime(e){
    for(let i =0;i<e.length;i++){
      console.log('changeTime',e)
      e[i].time = time.formatTime(new Date(e[i].time))
      if(i+1 == e.length){
        return e
      }
    }
  },

  getyanxiang(){
    let that = this
    that.setData({
      yanxiang:[],
    })
    wx.cloud.database().collection("yanxiang").orderBy('voteNum','desc').get({
      success:res=>{
        console.log('getyanxiang()函数_success',res)
        that.setData({
          yanxiang:res.data,
        })
      },fail:err=>{
          console.log('getyanxiang()函数_err',err)
        }
    })
    console.log("------------")
  },
  onPullDownRefresh(){
    //定时两秒结束 通过stopPullDownRefresh 停止下拉刷新 从而停止小白点的存在时间
    // 下拉刷新的背景可以在本json 重新设置 且默认小白点颜色为背景同色 ，所以设置成 dark  比较能显示
    setTimeout(function(){
      wx.stopPullDownRefresh()
    },800)
    this.getyanxiang()
  },
  onLoad(options) {
    this.countTime();
    var that = this;
    // 放在这里是让第一次刷新时也能检测到，剩余的放在onshow函数中(每次页面刷新都能执行)
    if(app.globalData.jgtipsec){
			that.setData({
        tapchoose:"文创鉴赏",
      })
    }
    // let that =this
    // this.getMessages()
    db.collection("yanxiang").orderBy('voteNum','desc').get({
        success:res=>{
          console.log('getyanxiang_success',res)
          var list = res.data
          var temp = 0
          for( var l in list){
            temp= temp+list[l].voteNum
          }
          that.setData({
            yanxiang:res.data,
            allNum:temp
          })
        },fail:err=>{
            console.log('getyanxiang_err',err)
          }
      })
      that.setData({
        capsuleHeight:capsule.height,
        capsuleTop:capsule.top,
      })
      // console.log(res.right)
      // console.log(res.bottom)
      // console.log(res.left)
      // 最后将全局变量jgtipsec置会回alse
      app.globalData.jgtipsec=false
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
    var that = this;
    if(app.globalData.jgtipsec){
			that.setData({
        tapchoose:"文创鉴赏",
      })
    }
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
  
})

var doommList=[];
var i=0;
class Doomm{
  constructor(text,top,time,color){
    this.text = text+i;
    this.top = top;
    this.time = time;
    this.color = color;
    this.display = true;
    let that = this;
    this.id = i++;
    setTimeout(function(){
      doommList.splice(doommList.indexOf(that),1);//动画完成，从列表中移除这项
      this.setData({
      doommData : doommList
    })
    },this.time*1000)//定时器动画完成后执行。
  }
}

function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}