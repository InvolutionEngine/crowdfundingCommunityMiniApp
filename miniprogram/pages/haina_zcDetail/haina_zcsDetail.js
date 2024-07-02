// pages/haina_zcDetail/haina_zcsDetail.js
const timeTool = require("../../utils/timeTool")
const app = getApp()
const db= wx.cloud.database()
const _ = db.command
var page = undefined;

// var bulletChatList = [];
// var id = 0;
// var cycle = null;  //计时器
// var topArray = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150];//用来做随机top值
// var usedTop = [];



Page({

  /**
   * 页面的初始数据
   */
  data: {
    usermessage:[],
    doomDatas:[],
    progressBar:'0%',
    progressBarNum:0,
    if_showSupport:false,
    if_showmoneyTarge:false,
    if_showComment:false,
    if_supportBtn:false,
    switch:true,
    choose:"全部",
    // syTime:'',
    choosebtnContent:"",
    choosebtnMoney:0,
    list:[],
    speUrl:[],
    deliverytime:"",
  },

  barrageDone(){
    console.log('回调完成')
  },


  chooseSpeBox_choosebtn(e){
    var that = this
    // console.log("chooseSpeBox_choosebtn拿到了",e.currentTarget.dataset.goodsname);
    console.log("chooseSpeBox_choosebtn拿到了",e.currentTarget.dataset.money);
    console.log("chooseSpeBox_choosebtn拿到了",e.currentTarget.dataset.list);
    console.log("chooseSpeBox_choosebtn拿到了",e.currentTarget.dataset.speurl);
    that.setData({
      choosebtnContent:e.currentTarget.dataset.goodsname,
      choosebtnMoney:e.currentTarget.dataset.money,
      list:e.currentTarget.dataset.list,
      speUrl:e.currentTarget.dataset.speurl,
      deliverytime:e.currentTarget.dataset.deliverytime
    })
  },

  chooseBox(){
    if(this.data.choose == "全部"){
      this.setData({
        choose:"精选"
      })
    }else{
      this.setData({
        choose:"全部"
      })
    }
  },
  // 支付按钮
  Zfbtn(){
    // 拿不到数据是点击太快了
    var that = this
    var tempgoods = that.data.zcgoods
    // console.log("Zfbtn",that.data.spe_money);
    // console.log("Zfbtn",that.data.spe_list);
    // console.log("Zfbtn",that.data.spe_url);
    // console.log("tempgoods",tempgoods)
    console.log("tempgoods.completedMoneyTarge",tempgoods.completedMoneyTarge)
    console.log("that.data.choosebtnMoney",that.data.choosebtnMoney)
    wx.showModal({
      title: '提示',
      content: '确认是否购买',
      complete: (res) => {
        if (res.confirm) {
          wx.cloud.database().collection('order').add({
            data:{
             goodsName:tempgoods.goodsName,
             goodsId:tempgoods.goodsId,
             spe_name:that.data.choosebtnContent,
             spe_money:that.data.choosebtnMoney,
             spe_list:that.data.list,
             spe_url:that.data.speUrl,
             shoptime:new Date().toJSON().substring(0, 10),
             deliverytime:that.data.deliverytime,
            //  type决定该订单系统的状态
             type:"待收货",

             userOpenid:"oKDti5DETqNZz6qAogqG0N_JPQrw",
             faceImg:"https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEKJe7pY3EQj5TIXoew4fbccxolAqAEEcWDOhCQ0gjpxpgvCn8KwIvF75LvQQJSZOXSw5HumZ76HKm3Z64ETgUx5K6WZkFTEH6zorKct7J2Vcg/132",
             nickName:"大小王",
            },
          })
          wx.cloud.database().collection('crowdfunding').doc(tempgoods._id).update({
            data:{
              completedMoneyTarge : tempgoods.completedMoneyTarge+that.data.choosebtnMoney,
              completedPerson : tempgoods.completedPerson + 1,
            },
            success(res){
              wx.showToast({
                title: '确认收货成功',
              })
            }
          })

          setTimeout(()=>//不能缺少
          {
             wx.showToast({
               title: '购买成功！',
             })
             that.setData({
              if_supportBtn:false
            })
          },3000)
        }
      }
    })
  },

  getUserMessage(){
    wx.getStorage({
      key: 'globalData',
      success (res) {
        console.log("getStorage",res.data)
        db.collection('user').where({
          nickName :_.eq(res.data.userInfo.nickName)
        }).get({
          success(res){
            console.log("res",res);
            this.setData({
              usermessage:res.data[0]
            })
          },
        })
      }
    })
  },


  // 显示支持一下弹窗 
  pubSuportBtn(){
    if(this.data.if_supportBtn){
      this.setData({
        if_supportBtn:false
      })
    }else{
      this.setData({
        if_supportBtn:true
      })
    }
  },
  switchBtn(){
    if(this.data.switch){
      this.setData({
        switch:false
      })
    }else{
      this.setData({
        switch:true
      })
    }
  },
  // 
  commentOpen(){
    this.setData({
      if_showComment:true
    })
  },
  commentClose(){
    this.setData({
      if_showComment:false
    })
  },
  targeOpen(){
    this.setData({
      if_showmoneyTarge:true
    })
  },
  targeClose(){
    this.setData({
      if_showmoneyTarge:false
    })
  },
  supportOpen(){
    this.setData({
      if_showSupport:true
    })
  },
  supportClose(){
    this.setData({
      if_showSupport:false
    })
  },

  // 获取通过 nav + ?id 传进来的id的那一个众筹产品信息
  getzcDetail(id){
    var that = this;
    wx.cloud.database().collection('crowdfunding').doc(id).get({
      success(res){
        console.log('众筹详情页获取当个众筹商品成功',res)
        var list = res.data
        var temp
        // 格式化时间
        list.endTime = timeTool.formatTime(new  Date(list.endTime))
        list.startTime = timeTool.formatTime(new  Date(list.startTime))
        for(var l in list.UpdateProcess ){
          list.UpdateProcess[l].updateTime = timeTool.formatTime(new  Date(list.UpdateProcess[l].updateTime))
        }
        for(var l in list.commentList ){
          list.commentList[l].time = timeTool.formatTime(new  Date(list.commentList[l].time))
          // temp[l] = list.commentList[l].contentText
           //获取评论弹幕 数据库读取+随机数
          //  (text,top,time,color)
          doom.push(new Doom(list.commentList[l].contentText,Math.ceil(Math.random()*100),1.5+Math.ceil(Math.random()*10),"#ffffff"));

        
          // 新的弹幕组件信息
          // doomList.push(new DoomList(list.commentList[l].contentText,list.commentList[l].faceImg));
        }
        // 判断是否完成
        for(var l in list.TargeList ){
          if(list.completedMoneyTarge>=list.TargeList[l].money)
          {
            list.TargeList[l].type = "已完成";
          }
          // &&都要满足
          // (list.completedMoneyTarge<list.TargeList[l].money&&list.completedMoneyTarge>=list.TargeList[l-1].money)||(list.completedMoneyTarge<list.TargeList[l].money)&&(l=0)
          if((list.completedMoneyTarge<list.TargeList[l].money*0.5))
          {
            list.TargeList[l].type = "未开始";
          }
        
        }
        // console.log('----------',res)
        // 倒叙循环  如果有问题 注意看是不是数据库里的UpdateProcess和commentList后面有带空格
        // list.UpdateProcess = list.UpdateProcess.reverse()
        // list.commentList = list.commentList.reverse()


        // console.log('55',temp)
        that.setData({
          // tempcommenList:temp,
          // doomList:doomList,
          doomDatas : doom,
          zcgoods:list,
          // progressBar 百分比
          progressBar:(list.completedMoneyTarge/res.data.moneyTarge*100).toFixed(2)+'%',
          progressBarNum:(list.completedMoneyTarge/res.data.moneyTarge*100).toFixed(2),
          choosebtnContent:list.goods_speList[0].goodsName,
          // syTime:list.endTime-new Date(),
        })
      }
    })
  },
  onLoad(options) {
    
    page = this;//如果不加这句话就会在doom class处曝出page.setDate未定义的错误
    console.log(options.id);
    this.getzcDetail(options.id);
    this.getUserMessage();
    
    //叠加数据 barrageList  doomList
    // var that = this
    // doomList.forEach(function (item, index) {
    //   that.data.barrageList.push({ words: item.words,avatar: item.avatar });
    // });
    // that.setData({
    //   barrageList: that.data.barrageList
    // });
    //d弹幕没了就不要考虑采用函数反复获取评论
    //采用设置animation-iteration-count: infinite;，循环执行,这样子就会无限的从0到单个数组所渲染的dom长度，无限的循环套娃，就会有循环滚动的感觉了
  },

  
  // getRandomColor() {
  //   let rgb = []
  //   for (let i = 0; i < 3; ++i) {
  //     let color = Math.floor(Math.random() * 256).toString(16)
  //     color = color.length == 1 ? '0' + color : color
  //     rgb.push(color)
  //   }
  //   return '#' + rgb.join('')
  // },
  onHide() {

  },

  onUnload() {
  },

})
// var doomList=[];
// class DoomList{
//   constructor(words,avatar){
//     this.words = words;
//     this.avatar = avatar;
//   }
// }


var doom=[];
var i=0;//用做唯一的wx:key
class Doom{
  constructor(text,top,time,color){
    this.text = text;
    this.top = top+'%';
    this.time = time;
    this.color = color;
    this.display = true;
    var that = this;
    this.id = i++;
    setTimeout(function(){
      doom.splice(doom.indexOf(that),1);//动画完成，从列表中移除这项
      page.setData({
      doomDatas : doom
    })
    },this.time*1000)//定时器动画完成后执行。
  }
}
// function getRandomColor() {
//   let rgb = []
//   for (let i = 0; i < 3; ++i) {
//     let color = Math.floor(Math.random() * 256).toString(16)
//     color = color.length == 1 ? '0' + color : color
//     rgb.push(color)
//   }
//   return '#' + rgb.join('')
// }
//   barrageList: [{
  //     "words": "恭喜橙cc ʚ🧸ྀིɞ抽到米丽Molly",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKN7icTnnckpsFYianVNtSgSRh1eGHQqUBsGKOjqxWViczy4ich7GYZaNYBFVibo3RpbuHcgffYlzmbu4A/132"
  //   },
  //   {
  //     "words": "恭喜Tᴀɴɢᴇʀɪɴᴇ橘···抽到木筏",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELHXR7cXiciczWZYeG6zy30pT7YHqiar46ypKcsWziaUgJr1oiciaCDckvojibMNRia6nPC47pASJGCDoag8w/132"
  //   },
  //   {
  //     "words": "恭喜HviviN抽到木筏",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/38gT6kFbfMQWicpibcpSumdxJKZSvVVKbM4nwUZF0dIBp8rWnuXUz4Amo6nAHQrJy6XjRYfC0DMYdlX4D2n3zVibw/132"
  //   },
  //   {
  //     "words": "恭喜✨爱❤️小陶抽到木筏",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIPPp6tia03NZejI7MjWrAccv0IwP6W6QBG3HS31AtUqnY5bXKAo1ChFOK3sjLnMtaKcdGlib3wiaOmw/132"
  //   },
  //   {
  //     "words": "恭喜Panda抽到海星",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Dk9Br14qh0AWblZib3nRdhhJdngRibacIVTNJuQ9TPCTblQxxdic6fwGydL7icXb5bQ8Df7b1EoIsniatNNSbC31VnA/132"
  //   },
  //   {
  //     "words": "恭喜团子抽到旅行",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83erLgVaV7RGvmVUBusU4QVjQKPNYccjMfZbicWZZfichtkiaxGFcXzZJ5ic0MUImIx9aatiaFZocjK62azQ/132"
  //   },
  //   {
  //     "words": "恭喜n抽到万圣节印克Molly",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Wul1bxtlYVlVvXIBGwmmiaDg4lfsTmS2DUtkiathDgCqQUBgWwiaq6vSIIPMPLp0Obia5tDBBy3SlLPAUVzeEzSMRw/132"
  //   },
  //   {
  //     "words": "恭喜🌵皮皮象🐘抽到双子座",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqQMnYlcuIuVNSaSerHwr0J8EoWLAMInEPgnibiaTcZpKQibiaoeq4x1zeUKdyViahewaU5NLpWicq3Hxvg/132"
  //   },
  //   {
  //     "words": "恭喜静静抽到砍柴",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/fh5t8woWHfWUicDS1YYicNI4pNiazBg7NLgUpCf74LcQdsicNu8q5ll0gCfmpaEybWU1H466lXRNcxVGttpbcNibW9g/132"
  //   },
  //   {
  //     "words": "恭喜十六抽到皮艇",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIw9DQgYakaZlbCI16yjOiaRo9vQR4ukhCplXVp8cTI7hEBF064LjI3dGOLOtSEETjpWtgQZIvSpCA/132"
  //   },
  //   {
  //     "words": "恭喜🍇抽到砍柴",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL84AUC4PsNXlJR1cA7QoqIAGvp1GAyYD5QBfrKuxpFVqMySYn6PeV49SxmI7ycKGN2wdSjIFpX7w/132"
  //   },
  //   {
  //     "words": "恭喜💕抽到皮艇",
  //     "avatar": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKW8Eicmrdn75qxdibpjW57S2w6kXLUAsOwibtjr3ffEn1rZuJZNXfbibxcsE9GkgnYwJhA4L1GCragKw/132"
  //   },
  //   {
  //     "words": "恭喜🐮.L抽到涂鸦奥斯卡",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/1tD0RricaTLzwomfHHufenPmUXPiaMFjOOOXLzKddicDLiaA1rS8xHhHWJlswicNiamHZZfRxtXesYoLOJYiahUBskk2g/132"
  //   },
  //   {
  //     "words": "恭喜💋Melody _···抽到登山",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83ephiahO1BnkTrvm8adQrau81O5xU9nYuic3BL8vr33zXhgia4TZh7Wic0rhiccT2z27qEicpWibkYBt7edjw/132"
  //   },
  //   {
  //     "words": "恭喜GavinZCY抽到火堆",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoibIPRa2kiaqf6aiaWWDHNfcePDE78yEIvicNprdRaPUWl4YtYeHLXF9du2N63l7iazD7K9iaMJbDQHo5w/132"
  //   },
  //   {
  //     "words": "恭喜欢抽到北极熊",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJotkWUtM26UIXHtTvqFibxayia5q3ylnKDeo8bic5r7PhkgW9Id1YObFv0rUbXa9z9Gx6yI8iaUZmjnQ/132"
  //   },
  //   {
  //     "words": "恭喜ᴋɪᴋɪ抽到企鹅",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ9hS8j2p0QsCITUVEuPtHxGQPvyGDgHolHZQwPf4GHwQNia7u8lmEpmRRUOWg8me6rvkO7IH4Uibtw/132"
  //   },
  //   {
  //     "words": "恭喜Carson抽到火堆",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKhfJq2F0dAr1XDstAibjia7e5EiaCeWsVEcRncDXHW8DWRia9uiccBic2aUWYiaC3iaiakXEDuNibpct2LTZ1A/132"
  //   },
  //   {
  //     "words": "恭喜冷眼看你装抽到雪地旅行者",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Gk4AZcP2TQd4VPxe8jJ3SnsNP5dhyicsvCbE1RkGfmiaRj59jrjiatuYsKYtoOM7tQia9vlQT4cdE2Gznj3yp4kotg/132"
  //   },
  //   {
  //     "words": "恭喜hulahala抽到雪地旅行者",
  //     "avatar": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTICow4PNkygn26VmDQTwT5PBhaASdYno69Zav18q3CMqcaicG0iab2JE1lwOEnlDOnUnX5pdXvo6Picg/132"
  //   },
  //   {
  //     "words": "恭喜零抽到雪地旅行者",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/67ahwboZZxY1XrBfJLqbiaMtMHBPYnEAMJCfibib7U4ybJnUssE07ToeJZCSafTIrv8gxBnicvZWBPVpqPfMsO5tJw/132"
  //   },
  //   {
  //     "words": "恭喜iiiamlyd1a···抽到六角恐龙",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/6BY0kMKB861fABGP1dupicA5ibfxMFSx2gYOiae6shrjrATlVBQrdibtBXufESnMVmrrf59icYhLmkqqY61hBqicp3CA/132"
  //   },
  //   {
  //     "words": "恭喜5Am抽到牛奶小可爱",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLaZrBxV8PAfbMh57fIVFowEnr0HNTkOvcM3xAs0W2jE4xRxQtvNYbWtu8bkSBNlD06LhBAomMH9g/132"
  //   },
  //   {
  //     "words": "恭喜Dr.焦健抽到火堆",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83era28Dia2Ga3rP852PdwoGa0jP8Z0GzUDZUXiaoEWxrDWxP68UkneYjMNeV6FEGxOPlqkNcSjXfRnKQ/132"
  //   },
  //   {
  //     "words": "恭喜渼雯抽到加欧Molly",
  //     "avatar": "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEI2b67MQUP19wxicvRpJZJA7f03r1hUg9ACg6cYfP71ILtEdXGd3PGicianGsuqaOtR7DQ9gicle67jaw/132"
  //   },
  //   {
  //     "words": "恭喜mdk妈幸 1868···抽到企鹅",
  //     "avatar": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eo87joibViaflIBTySnZJ5spvEDXr39vJGKRQNRtsM0NzIgsTunqNiaibh2HcTjpaVWFaFc8QvxicKGfCw/132"
  //   },
  //   {
  //     "words": "恭喜💎逸小兔👑抽到皮艇",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ4asTs6OWT5X4ChJywfEF5SPvic0X7QLqMOtLNgsPey6zraeb0MDRLBINNHgqq5hzEXb9NAUpgKVw/132"
  //   },
  //   {
  //     "words": "恭喜岁杪拾伊抽到珊瑚",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/3oImemj5RiaKBZ3gtw845q3xphNzibG98BnG2MI7kV0mSibd49rMxnsWz8k52BCZX1ficuzLH9Ku0u6RlYl9qOy8Uw/132"
  //   },
  //   {
  //     "words": "恭喜🦄抽到木筏",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Odhicd3gdPPIT5PEmMAfxst32mMgg3ALcVZyAZGROE1UbJ4CiajkLibuo4SvvWzUYrZ9jPXo1jMdmdRROxMoOoM1A/132"
  //   },
  //   {
  //     "words": "恭喜Janelle💭抽到徒步",
  //     "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83epO6Y8SNhHED1icNqINFIfEeCcY3YqDPbsZU6QsbA1NB2gviadG6IbT4ibIWkficc3blKt3LkEZiaWKiaqw/132"
  //   }
  // ],
  // doomList:[],
    // 弹幕群
    //(text,top,time,color)
    //'一波弹幕即将来袭','50%',5,"#ffffff"