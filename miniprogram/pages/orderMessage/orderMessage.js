// pages/orderMessage/orderMessage.js
const capsule = wx.getMenuButtonBoundingClientRect()
const db= wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTap:"全部",
    // "全部","待付款","待收货","已完成","已取消"
    tapList:["全部","待收货","已完成","已取消"],
    capsuleHeight:"",
    // 胶囊与上方的距离 同步到搜索栏即可实现相同距离
    capsuleTop:"",
    userOpenid:"oKDti5DETqNZz6qAogqG0N_JPQrw",

    orderList:[],
  },
  // 确认收货   由  待收货 ->  已完成
  receiptBtn(e){
    var that = this
    console.log("receiptBtn",e.currentTarget.dataset.id)
    wx.cloud.database().collection('order').doc(e.currentTarget.dataset.id).update({
      data:{
        type:'已完成'
      },
      success(res){
        wx.showToast({
          title: '确认收货成功',
        })
      }
    })
    that.setData({
      orderList:[],
    })
    wx.showToast({
      title: '页面加载中',
    })
    setTimeout(()=>//不能缺少
    {
      that.getOrderMessage()
    },1000)
  },
  // 申请退款    由  待收货 ->  申请退款中
  refundBtn(e){
    var that = this
    console.log("receiptBtn",e.currentTarget.dataset.id)
    wx.cloud.database().collection('order').doc(e.currentTarget.dataset.id).update({
      data:{
        type:'申请退款中'
      },
      success(res){
        wx.showToast({
          title: '申请成功',
        })
      }
    })
    that.setData({
      orderList:[],
    })
    wx.showToast({
      title: '页面加载中',
    })
    setTimeout(()=>//不能缺少
    {
      that.getOrderMessage()
    },1000)
  },
  // 取消申请退款  由 申请退款中  -> 待收货
  cancelBtn(e){
    var that = this
    console.log("receiptBtn",e.currentTarget.dataset.id)
    wx.cloud.database().collection('order').doc(e.currentTarget.dataset.id).update({
      data:{
        type:'待收货'
      },
      success(res){
        wx.showToast({
          title: '申请成功',
        })
      }
    })
    that.setData({
      orderList:[],
    })
    wx.showToast({
      title: '页面加载中',
    })
    setTimeout(()=>//不能缺少
    {
      that.getOrderMessage()
    },1000)
  },


  // 返回按钮跳转函数
  returnBtn(){
    wx.switchTab({
      url: '/pages/user/user',
    })
  },
  gotogoodsDetail(e){
    console.log('gotogoodsDetail',e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../haina_zcDetail/haina_zcsDetail?id='+e.currentTarget.dataset.id,
    })
  },

  // 获取订单信息
  getOrderMessage(){
    var that = this
    db.collection('order').where({
      _openid :_.eq("oKDti5DETqNZz6qAogqG0N_JPQrw")
    }).get({
      success(res){
        console.log("成功获取订单信息",res);
        that.setData({
          // 倒序是为了模拟按时间排序
          orderList:res.data.reverse()
        })
      },
    })
  },


  // tap切换函数
  exchangeTap(e){
    let that =this
    let name = e.currentTarget.dataset.name
    that.setData({
      currentTap:name
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
    that.getOrderMessage()
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