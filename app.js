//app.js
App({
 onLaunch:function(){
  //  云开发环境初始化
  wx.cloud.init({
    env:"cloud-d75rf",
    traceUser: true,
  })
 }
})