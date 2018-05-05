var login = require('../../utils/login.js')

//index.js
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    search: [],
    scrollHeight: 0,
    keyword: '',
    classes: [],
    currentPage: 1,
    pageSize: 5,
    pageCount: 1,
    accountList: [],
    loadmore: true
  },
  onLoad: function () {
    const that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: (res.windowHeight) - 66
        });
      }
    });

    let search = wx.getStorageSync('search');

    if (!search) {
      search = [];
    }

    wx.setStorageSync('search', search);
    that.setData({
      search: search
    })

    //that.loadData();
  },
  onReady: function () {
    this.loadData();
  },
  //搜索框功能
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  //搜索框功能
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  //搜索框功能
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  //搜索框功能
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //加载数据
  loadData: function (currentPage = 1, keyword = '', classes = '') {
    const that = this;
    const user_id = wx.getStorageSync('user_id');

    that.setData({
      loadmore: true
    });

    wx.request({
      url: 'https://paide.teamarm.cn/?r=action/api/search_account_info',
      method: 'POST',
      data: {
        keyword: keyword,
        classes: classes,
        current_page: currentPage,
        page_size: this.data.pageSize,
        user_id: user_id
      },
      success: function (res) {
        const data = res.data;

        if (data.call_success == true && data.logic_success == true) {

          const allClasses = data.result.all_classes;
          const result = data.result.account_list.list;
          let accountList = that.data.accountList;

          if (keyword !== '' || classes !== '') {
            accountList = []
          }

          let newAccountList = [];

          for (let i = 0; i < result.length; i++) {
            newAccountList.push({
              id: result[i].account_id,
              name: result[i].name,
              account: result[i].account,
              password_tips: result[i].password_tips.split(',')
            })
          }

          accountList = accountList.concat(newAccountList);

          that.setData({
            classes: allClasses,
            accountList: accountList,
            pageCount: data.result.account_list.pageCount,
            loadmore: false
          });
        } else {
          if (data.result){
            wx.showToast({ title: data.result })
          }else{
            login.login();
            that.loadData();
          }
        }
      },
      fail: function () {
        wx.showToast({ title: '网络请求错误' })
      },
      complete: function () {
        that.setData({
          loadmore: false
        });
      }
    })
  },
  //跳转到“添加密码”
  addPassword: function () {
    wx.navigateTo({
      url: '/pages/add/add'
    });
  },
  //上拉加载更多
  loadMore: function () {
    const that = this;
    const pageCount = that.data.pageCount;
    let currentPage = that.data.currentPage;

    if (currentPage <= pageCount) {
      currentPage = currentPage + 1;
      that.setData({
        currentPage: currentPage
      })
      that.loadData(currentPage);
    }
  },
  //搜索分类
  searchClass: function (e) {
    const that = this;
    const classes = e.currentTarget.dataset.text;
    that.loadData(1, '', classes);
  },
  //搜索关键字
  searchData: function (e) {
    const that = this;
    const keyword = e.detail.value || e.currentTarget.dataset.text;
    let serach = wx.getStorageSync('search');

    if (e.detail.value) {
      let exist = false;
      for (let i = 0; i < serach.length; i++) {
        if (serach[i] == e.detail.value) {
          exist = true;
        }
      }
      if (!exist) {
        serach.push(e.detail.value)
        wx.setStorageSync('search', serach)
      }
    }
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    that.loadData(1, keyword);
  }
});