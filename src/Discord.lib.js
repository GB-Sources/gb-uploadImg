/**
 * DISCORD RES CLIENT
 * GOOGLE APPSSCRIPT
 * @author  GB_Sources <goru.akiba@gmail.com>
 * @version v_0.0.1
 * @license MIT
 * @class
 */
class Discord_res{
  /**
   * @construcs Discord_res
   * @param {String}  _CLIENT_ID  app client id obtain from dev dashboard
   * @param {String}  _CLIENT_SECRET  app client secret obtain from dev dasboard
   * @param {String}  _CALLBACK_URL callback url given to generate the code
   */
  constructor(_CLIENT_ID, _CLIENT_SECRET, _CALLBACK_URL){
    this.CLIENT_ID = _CLIENT_ID;
    this.CLIENT_SECRET = _CLIENT_SECRET;
    this.CALLBACK_URL = _CALLBACK_URL;
    this.BASE_DISCORD_API = "https://discord.com/api/v9"

    return this;
  }


  /**
   * Token  Grant
   * @desc access token exchange process
   * @param {String}  code  code obtain from oauth callback process
   */
  token_grant(code){
    var endpoint = "/oauth2/token";
    var server = this.BASE_DISCORD_API+endpoint;
    var headers = {
      "Content-service" : "application/x-www-form-urlencoded;charset=UTF-8"
    }

    var payload = {
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: this.CALLBACK_URL 
    }

    var opt = {
      method : "POST",
      headers,
      payload
    }

    var res = UrlFetchApp.fetch(server, opt).getContentText()
    // console.log(JSON.parse(res));

    return JSON.parse(res)

  }

  /**
   * Identity  Grant
   * @desc  fetch identity from given token access
   * @param {Object}  obj  Authorization Code Grant response
   * @param {String}  obj.access_token  token access obtain from Authorization Code Grant
   */
  identity_grant(obj){
    var endpoint = "/users/@me";
    var server = this.BASE_DISCORD_API+endpoint;

    if(!obj.access_token) return null;
    var headers = {
      Authorization: 'Bearer '+ obj.access_token,
    }

    var opt = {
      headers,
    }

    var res = UrlFetchApp.fetch(server, opt).getContentText()
    // console.log(JSON.parse(res));

    return JSON.parse(res)
  }

}


// https://stackoverflow.com/questions/24340340/urlfetchapp-upload-file-multipart-form-data-in-google-apps-script
class Webhooker{
  constructor(_url, _option){
    this.url = _url;
    this.option = _option || this.defaultopt();
    return this;
  }

  send(){
    // Make a POST request with form data.
    // Because payload is a JavaScript object, it is interpreted as
    // as form data. (No need to specify contentType; it automatically
    // defaults to either 'application/x-www-form-urlencoded'
    // or 'multipart/form-data')
    var options = {
      'method' : 'post',
      'payload' : this.option
    };
    return UrlFetchApp.fetch(this.url, options).getContentText();
  }

  defaultopt(){
    return {
      content: "",
    }
  }

  setContent(_content){
    this.option.content = _content;
    return this
  }

  setEmbeds(_arrOfEmbeds){
    this.option.embeds = _arrOfEmbeds;
    return this;
  }
  
  addAttachments(_attachment){
    if (!this.attachments) this.attachments = [];

    this.attachments.push(_attachment);
    return this;
  }
}