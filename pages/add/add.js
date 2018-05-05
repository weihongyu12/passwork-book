var login = require('../../utils/login.js')

//add.js
Page({
  data: {
    inputVal: "",
    selectShow: false,
    types: ["类型1", "类型2", "类型3"],
    passwordTips: [
      { id: 1, unique: 'password_tips_1' }
    ],
    typeIndex: 0,
    loading: false,
    disabled: false
  },
  bindTypeChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      typeIndex: e.detail.value
    })
  },
  //搜索框功能
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //搜索框功能
  blurInput: function (e) {
    this.setData({
      selectShow: false
    });
  },
  //搜索框功能
  focusInput: function (e) {
    this.setData({
      selectShow: true
    });
  },
  //选择类型
  selectClass:function(e){
    this.setData({
      inputVal: e.currentTarget.dataset.text
    });
  },
  //添加密码提示
  addPasswordTips: function () {
    const length = this.data.passwordTips.length + 1;
    this.data.passwordTips = this.data.passwordTips.concat([{ id: length, unique: 'password_tips_' + length }]);
    this.setData({
      passwordTips: this.data.passwordTips
    })
  },
  //提交表单，增加数据
  formSubmit: function (e) {

    const that = this;
    const param = e.detail.value;
    const classes = param.classes;
    const name = param.name;
    const account = param.account;

    that.setData({
      loading: true,
      disabled: true
    });

    let password_tips = [];
    for (let i = 0; i < this.data.passwordTips.length; i++) {
      let index = i + 1;
      if (param['password_tips_' + index] != '') {
        password_tips.push(param['password_tips_' + index]);
      }
    }
    password_tips = password_tips.join(',')

    const user_id = wx.getStorageSync('user_id');

    wx.request({
      url: 'https://paide.teamarm.cn/?r=action/api/add_account_info',
      method: 'POST',
      data: {
        classes: classes,
        name: name,
        account: account,
        password_tips: password_tips,
        user_id: user_id
      },
      success: function (res) {
        const data = res.data;
        if (data.call_success === true && data.logic_success === true) {
          wx.redirectTo({ url: '/pages/index/index' });
        } else {
          if (data.result){
            wx.showToast({ title: data.result })
          }else{
            login.login();
            that.formSubmit();
          }
        }
      },
      fail: function () {
        wx.showToast({ title: '网络请求错误' })
      },
      complete: function () {
        that.setData({
          loading: false,
          disabled: false
        });
      }
    })
  }
});