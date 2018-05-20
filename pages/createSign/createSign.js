var that;
var Bmob = require('../../utils/bmob.js');
var util = require('../../utils/util.js');
Page({

 
  data: {
    bj: '',
    signName: '',
    signDate:'',
    starttime:'07:00',
    endtime: '08:00',
		currentUserId:''
  },


   
  onLoad: function (options) {
    that=this;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var User = Bmob.Object.extend("_User");
    var queryUser = new Bmob.Query(User);
		var signDate = util.formatDate(new Date());
    queryUser.get(currentUserId, {
    	success: function (result) {
    		that.setData({
					currentUserId:currentUserId,
    			bj: result.attributes.bj,
					signName:[result.attributes.bj , signDate].join('-'),
					signDate:signDate
    		})
    	
    		
    	},
    	error: function (object, error) {
    		// 查询失败
    	}
    });
  },
	
	bindDateChange: function (e) {
		console.log('picker发送选择改变，携带值为', e.detail.value);
		this.setData({
			signDate: e.detail.value,
		})
	},
	
	bindStartTimeChange: function (e) {
		console.log('picker发送选择改变，携带值为', e.detail.value);
		this.setData({
			starttime: e.detail.value,
		})
	},
	
	bindEndTimeChange: function (e) {
		console.log('picker发送选择改变，携带值为', e.detail.value);
		this.setData({
			endtime: e.detail.value,
		})
	},

  createSignSuccess: function (e) {
			that=this;
      var bj = that.data.bj;
      var signName = e.detail.value.signName;
      var signDate = that.data.signDate;
      var starttime = that.data.starttime;
			var endtime = that.data.endtime;
			var currentUserId=that.data.currentUserId;
      if (!bj) {
        wx.showToast({
          title: '未能获取您所在班级，是否您还没有注册完整信息！！！',
          image: '../../images/warn.png',
          duration: 2000
        })
      }
      else if (!signName) {
        wx.showToast({
          title: '请填写签到名称',
          image: '../../images/warn.png',
          duration: 2000
        })
      }
      else if (!signDate) {
        wx.showToast({
          title: '请选择签日期',
          image: '../../images/warn.png',
          duration: 2000
        })
      }
      else{
        var Plansign = Bmob.Object.extend("Plansign");
        var plansign = new Plansign();
				plansign.set('bj',bj);
				plansign.set('signName',signName);
				plansign.set('signDate',signDate);
				plansign.set('starttime',starttime);
				plansign.set('endtime',endtime);
				plansign.set('userid',currentUserId);
				
				plansign.save();
				wx.navigateTo({
					url: '../signlist/signlist'
				})
      }
    },
		
	
  
})