var login = require('../../utils/login.js')

//update.js
Page({
  data: {
    inputVal: "",
    selectShow: false,
    types: ["类型1", "类型2", "类型3"],
    passwordTips: [
      { id: 1, unique: 'password_tips_1', value: '' }
    ],
    passwordTipsLength: 1,
    classes: '',
    name: '',
    account: '',
    typeIndex: 0,
    primaryLoading: false,
    warnLoading: false,
    disabled: false
  },
  onLoad: function (e) {
    const account_id = e.id;
    const user_id = wx.getStorageSync('user_id');

    const that = this;

    wx.setStorageSync('account_id', account_id);

    wx.request({
      url: 'https://paide.teamarm.cn/?r=action/api/get_account_info',
      method: 'POST',
      data: {
        account_id: account_id,
        user_id: user_id,
      },
      success: function (res) {

        const data = res.data;

        if (data.call_success === true && data.logic_success === true) {
          let password_tips = [];

          for (let i = 0; i < data.result.password_tips.length; i++) {
            let index = i + 1;
            password_tips.push({
              id: index,
              unique: 'password_tips_' + index,
              value: res.data.result.password_tips[i]
            })
          }

          that.setData({
            classes: data.result.classes,
            name: data.result.name,
            account: data.result.account,
            passwordTips: password_tips,
            passwordTipsLength: password_tips.length
          })

        } else {
          if (data.result) {
            wx.showToast({ title: data.result })
          } else {
            login.login();
            that.onLoad();
          }
        }
      },
      fail: function () {
        wx.showToast({ title: '网络请求错误' })
      }
    })
  },
  onUnload: function () {
    wx.removeStorageSync('account_id');
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
      classes: e.detail.value
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
  //搜索框功能（选择类型）
  selectClass: function (e) {
    this.setData({
      classes: e.currentTarget.dataset.text
    });
  },
  //添加密码提示
  addPasswordTips: function (e) {

    const length = this.data.passwordTips.length + 1;
    this.data.passwordTips = this.data.passwordTips.concat([{ id: length, unique: 'password_tips_' + length }]);
    this.setData({
      passwordTips: this.data.passwordTips
    })
  },
  //提交表单，更新数据
  formSubmit: function (e) {

    const that = this;
    const param = e.detail.value;
    const classes = param.classes;
    const name = param.name;
    const account = param.account;
    const account_id = wx.getStorageSync('account_id');

    let password_tips = [];
    for (let i = 0; i < this.data.passwordTips.length; i++) {
      let index = i + 1;
      if (param['password_tips_' + index] != '') {
        password_tips.push(param['password_tips_' + index]);
      }
    }
    password_tips = password_tips.join(',')

    const user_id = wx.getStorageSync('user_id');

    that.setData({
      primaryLoading: true,
      warnLoading: false,
      disabled: true
    });

    wx.request({
      url: 'https://paide.teamarm.cn/?r=action/api/update_account_info',
      method: 'POST',
      data: {
        classes: classes,
        name: name,
        account: account,
        password_tips: password_tips,
        user_id: user_id,
        account_id: account_id,
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
          primaryLoading: false,
          warnLoading: false,
          disabled: false
        });
      }
    })
  },
  //移除密码
  delPassword: function (e) {

    const that = this;

    const account_id = wx.getStorageSync('account_id');
    const user_id = wx.getStorageSync('user_id');

    that.setData({
      primaryLoading: false,
      warnLoading: true,
      disabled: true
    });

    wx.request({
      url: 'https://paide.teamarm.cn/?r=action/api/del_account_info',
      method: 'POST',
      data: {
        account_id: account_id,
        user_id: user_id,
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
            that.delPassword();
          }
        }
      },
      fail: function () {
        wx.showToast({ title: '网络请求错误' })
      },
      complete: function () {
        that.setData({
          primaryLoading: false,
          warnLoading: false,
          disabled: false
        });
      }
    })
  }
});