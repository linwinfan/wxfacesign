var Bmob = require('../../utils/bmob.js');
var that;
Page({
  data: {
    currentUserId: null,
    Xuexiaos:[],
    index:-1,
    choseXuexiao:'点击选择您的学校',
    Xueyuans:[],
    xyindex:-1,
    choseYX: '点击选择您的院系',
    Classes:[],
    bjindex:-1,
    choseBJ:"点击选择您的班级",
    Students:[],
    studentindex:-1,
    choseStudent:"点击选择您的学号与姓名",
    xh:'',
    realName:''
  },


  onLoad: function (options) {
    that = this;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    that.setData({
      currentUserId: currentUserId
    })

    var User = Bmob.Object.extend("_User");
    var queryUser = new Bmob.Query(User);
    // 查询所有数据
    queryUser.get(currentUserId, {
      success: function (result) {
        
        var register = result.get("register");
        var content = result.get("content");
      },
      error: function (object, error) {
        // 查询失败
      }
    });
    if(that.data['Xuexiaos'].length>0)
      return;
    var Xuexiao = Bmob.Object.extend("Dict");
    var query = new Bmob.Query(Xuexiao);
    // 查询所有数据
    query.equalTo("type", "t0");
    query.select("value");
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        var xuexiaos = [];
        for (var i = 0; i < results.length; i++) {
          xuexiaos=results[i].get("value");
          console.log(results[i].get("value"));
        }
        that.setData({
          Xuexiaos: xuexiaos
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },


  onShow: function () {
  
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    //获得专业
    var Xuexiao = Bmob.Object.extend("Dict");
    var query = new Bmob.Query(Xuexiao);
    // 查询所有数据
    query.equalTo("type", "t1");
    query.equalTo("key", that.data.Xuexiaos[e.detail.value]);
    query.select("value");
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        var xueyuans = [];
        for (var i = 0; i < results.length; i++) {
          xueyuans = results[i].get("value");
          console.log(results[i].get("value"));
        }
        that.setData({
          Xueyuans: xueyuans
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    this.setData({
      index: e.detail.value,
      choseXuexiao: that.data.Xuexiaos[e.detail.value]
    })
  },

  bindYXPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    //获得专业
    var Xuexiao = Bmob.Object.extend("Dict");
    var query = new Bmob.Query(Xuexiao);
    // 查询所有数据
    query.equalTo("type", "t2");
    query.equalTo("key", that.data.choseXuexiao + "-" + that.data.Xueyuans[e.detail.value]);
    query.select("value");
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        var classes = [];
        for (var i = 0; i < results.length; i++) {
          classes = results[i].get("value");
          console.log(results[i].get("value"));
        }
        that.setData({
          Classes: classes
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    this.setData({
      yxindex: e.detail.value,
      choseYX: that.data.Xueyuans[e.detail.value]
    })
  },

  bindBJPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    //获得专业
    var Xuexiao = Bmob.Object.extend("Dict");
    var query = new Bmob.Query(Xuexiao);
    // 查询所有数据
    query.equalTo("type", "t3");
    query.equalTo("key", that.data.choseXuexiao + "-" + that.data.choseYX + "-" + that.data.Classes[e.detail.value]);
    query.select("value");
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        var students = [];
        for (var i = 0; i < results.length; i++) {
          students = results[i].get("value");
          console.log(results[i].get("value"));
        }
        that.setData({
          Students: students
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    this.setData({
      bjindex: e.detail.value,
      choseBJ: that.data.Classes[e.detail.value]
    })
  },

  bindStudentPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var sts = that.data.Students[e.detail.value].split('-');
    this.setData({
      studentindex: e.detail.value,
      xh:sts[0],
      realName:sts[1],
      choseStudent: that.data.Students[e.detail.value]
    })
  },

  registerSuccess: function (e) {
    var currentUserId = that.data.currentUserId;
    var realName = that.data.realName;
    var xh = that.data.xh;
    var telephone = e.detail.value.telephone;
    console.log(currentUserId)
    if (!xh) {
      wx.showToast({
        title: '请填写您的学号',
        image: '../../images/warn.png',
        duration: 2000
      })
    }
    else if (!realName) {
      wx.showToast({
        title: '请填写您的姓名',
        image: '../../images/warn.png',
        duration: 2000
      })
    }
    else if (!telephone) {
      wx.showToast({
        title: '请填写您的电话',
        image: '../../images/warn.png',
        duration: 2000
      })
    }
    else{
      var User = Bmob.Object.extend("_User");
      var queryUser = new Bmob.Query(User);
      queryUser.get(currentUserId, {
        success: function (result) {
          result.fetchWhenSave(true);
          result.set('register', true);
          result.set('xuexiao', that.data.choseXuexiao);
          result.set('xueyuan', that.data.choseYX);
          result.set('bj', that.data.choseBJ);
          result.set('realName', realName);
          result.set('xh', xh);
          result.set('telephone', telephone);
          result.save().then(function(obj) {
            console.log(obj);
          },function(error){
            console.log(error);
          });
          console.log(result.get('register'));
          wx.navigateBack(); 
        },
        error: function (object, error) {
        }
      });
    }
  },

  






})