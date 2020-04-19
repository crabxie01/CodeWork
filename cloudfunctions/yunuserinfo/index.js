// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: "fireman-84f8l"})
// 云函数入口函数event.uOpenid
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
   return cloud.database().collection("UserInfo").where(
    {openid:event.uOpenid}
  ).get({
    success:function(res){
      return res;  
  }    
})  
}