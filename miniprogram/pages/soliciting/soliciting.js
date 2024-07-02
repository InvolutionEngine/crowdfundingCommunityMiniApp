// pages/soliciting/soliciting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cueText:"网络社区环境各式各样，鲸遇在此呼吁大家理想讨论，快乐分享，一起在文创的知识世界遨游！倘若发现不当言论，鲸遇将保留最终起诉权力！我们将会竭尽全力维护社区友善气氛。",
    labelgroup:["音乐潮玩","美术设计","新时代风格"],
    detailcontext:"尊敬的文创设计师们，我们很高兴向您推荐潮玩城市音乐节的需求。潮玩城市音乐节是一个结合音乐、时尚和科技元素的大型活动，旨在为城市青年提供一个多彩、多样的文化体验。我们计划在城市主要场馆举办多场音乐表演和音乐沙龙活动，邀请现场嘉宾和网络直播双平台共同参与。此次音乐节的主题将以潮流和创新为核心，通过音乐、电子竞技、娱乐等形式表现出城市年轻人对时尚文化和新科技的追求。活动内容包括现场DJ演出、音乐展览、电子竞技比赛、全息投影表演、科技展示等，同时还将提供精致的美食和饮品，为观众营造一个独特的现场体验。潮玩城市音乐节的目标是促进城市创意产业的发展，同时为广大城市年轻人提供一个交流和展示的平台。我们希望此次活动能够吸引来自各地的年轻人和音乐爱好者，体验这场潮流、时尚、科技与音乐的盛宴。因此，我们希望您能够批准这次活动，提供必要的支持和协助，一同打造一场难忘的音乐盛宴。 谢谢您的关注，期待得到您的回复。发布人：潮玩城市音乐节组委会",
    // 这里填五 是保证第五颗星能正常显示（都大于 可以覆盖0-4 ）
    starList:5,
    Egconversation:"真的很感谢各位设计大牛的陪伴与指导，帮助与关怀，第一稿的初见仍历历在目，一路走来有太多欢声笑语，最终交稿成功。再次感谢各位！",
  },
  // 鲸宝咨询热线
  JBclerkbtn(){
    wx.showModal({
      title: '提示',
      content: '咨询热线尚未开启，敬请期待',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 点击跳转评论remarks页面
  goto_remarks(){
    wx.navigateTo({
      url: '/pages/remarks/remarks'
    })
  },
  // 点击跳转免责声明页面
  goto_disclaimer(){
    wx.navigateTo({
      url: '/pages/disclaimer/disclaimer'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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