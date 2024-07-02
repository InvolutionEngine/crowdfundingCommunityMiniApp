// pages/wansheng/wansheng.js
const timeTool = require("../../utils/timeTool")
const app =getApp()
const db= wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    wanshengList:[],
    current:1,

    // 是否折叠 true就是折叠
    if_fold:true,
    

    // publiser:[{
    //   faceImg:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/text_faceImg/女1.jpeg',
    //   nickname:'绫罗娃娃',
    //   identity:'项目发布者',
    //   content:'言治骨角者，既切之而复磋之；',
    //   artwork:[
    //     {
    //       id:'111',
    //       name:'《剪纸星影-十二生肖-兔系列》',
    //       img:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/vitalityBox/万生-兔系列/1.webp'
    //     },
    //     {
    //       id:'222',
    //       name:'《剪纸星影-十二生肖-；龙系列》',
    //       img:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/vitalityBox/万生-兔系列/1.webp'
    //     }
    //   ]
    // },{
    //   faceImg:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/text_faceImg/男1.jpeg',
    //   nickname:'小黄要好好吃饭',
    //   identity:'艺术设计',
    //   content:'如切如磋，如琢如磨。',
    // },{
    //   faceImg:'cloud://jingyu-0gthrnnd7f06d935.6a69-jingyu-0gthrnnd7f06d935-1309854973/text_faceImg/女2.jpeg',
    //   nickname:'兔子本兔',
    //   identity:'美工&文案',
    //   content:'字字看来皆是血，十年辛苦不寻常',
    // }],
  
  },

  // 跳转到其他万生
  gotows(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../wansheng/wansheng?id='+e.currentTarget.dataset.id,
    })
  },
  // 改成展开
  unfold_button(){
    this.setData({
      if_fold: false
    })
  },
  // 改成折叠
  fold_button(){
    this.setData({
      if_fold: true
    })
  },
  exchangeCurrent(e){
    // console.log(e.currentTarget.dataset.index)
    this.setData({
      current: e.currentTarget.dataset.index
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.id = options.id
    this.get_wansheng()
  },

  get_wansheng(){
    let that =this
    db.collection('vitalityBox').doc(this.data.id).get({
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