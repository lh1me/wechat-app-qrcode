var fs = require('fs');  
var request = require('request');  
var wx_conf = require('../../conf/wx_conf');//微信appid跟appSecret
var AccessToken = {  
  grant_type: 'client_credential',  
  appid: wx_conf.appId,  
  secret: wx_conf.appSecret  
}  
var wx_gettoken_url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=' + AccessToken.grant_type + '&appid=' + AccessToken.appid + '&secret=' + AccessToken.secret;  
//请求二维码的参数  
var postData = {  
  path: "pages/index/index",  
  width: 430  
}  
var createQrcode = {  
  create: function() {  
    console.log('fn：create');  
    this.getToken();  
  },  
  //获取微信的token  
  getToken: function() {  
    console.log('fn：getToken');  
    var that = this;  
    new Promise((resolve, reject) => {  
      console.log('进入Promise方法了');  
      request({  
        method: 'GET',  
        url: wx_gettoken_url  
      }, function(err, res, body) {  
        if (res) {  
          resolve({  
            isSuccess: true,  
            data: JSON.parse(body)  
          });  
        } else {  
          console.log (err);  
          reject({  
            isSuccess: false,  
            data: err  
          });  
        }  
      })  
    }).then(proData => {  
      that.getQrcode(proData);  
    });  
  },  
  //生成二维码  
  getQrcode: function(proData) {  
    console.log ('fn：getQrcode');  
    if (proData.isSuccess) {  
      postData = JSON.stringify(postData);  
      request({  
        method: 'POST',  
        url: 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=' + proData.data.access_token,  
        body: postData  
      }).pipe(fs.createWriteStream('./public/images/index.png'));//路径自己定义吧  
    } else {  
      console.log('Promise请求数据出错');  
    }  
  }  
}  
module.exports = createQrcode;//暴露对象，调用create方法既可以创建二维码