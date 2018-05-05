function login(){
  wx.login({
    success: function (res) {
      if (res.code) {
        //发起网络请求
        wx.request({
          url: 'https://paide.teamarm.cn/?r=action/api/login',
          method: 'POST',
          data: {
            code: res.code
          },
          success: function (data) {
            if (data.data.call_success === true && data.data.logic_success === true) {
              wx.setStorageSync('user_id', data.data.result.user_id)
            } else {
              wx.showToast({ title: data.data.result })
            }
          },
          fail: function () {
            wx.showToast({ title: '网络请求错误' })
          }
        });
      } else {
        wx.showToast({ title: '获取用户登录态失败！' + res.errMsg })
      }
    }
  })
}

module.exports = {
  login: login
}
