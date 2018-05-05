var login = require('utils/login.js')

//app.js
App({
  onLaunch: function () {
    //调用登录接口
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        login.login();
      },
      fail: function () {
        wx.removeStorageSync('user_id');
        login.login();
      }
    })
  }
})