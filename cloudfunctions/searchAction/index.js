// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    //搜索的关键字 
    key
  } = event;
  return db.collection("actions").where({
    title:db.RegExp({
      regexp:key,
      options:'i',
    }),
  }).get().then(res =>{
    console.log('success',res)
  }).catch(err =>{
    console.log('error',err)
  })
}