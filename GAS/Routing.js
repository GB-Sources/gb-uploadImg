class Routing{
  constructor(e){
    try{
      this.p = e.parameter;
      this.method = this.p.m;
      this.query = this.p.q;
      this.env = PropertiesService.getScriptProperties().getProperties();
      this.db = new spreadsheetDB("list_url", this.env["db_id"]);

      if (!this.method) return this.default(e);
      return this[this.method]();
    }catch(err){
      return this.err(err)
    }
  }

  send(_obj){
    _obj = typeof _obj == "object"? JSON.stringify(_obj) : _obj;
    return ContentService.createTextOutput(_obj);
  }

  err(_err){
    const db_id = this.env["db_id"];
    const db = new spreadsheetDB("err_msg", db_id);

    db.bulkInput([new Date().toLocaleDateString(), _err]);

    return this.send(_err)
  }

  default(e){
    var redirect_uri = `https://discord.com/api/oauth2/authorize?client_id=${this.env["CLIENT_ID"]}&redirect_uri=${this.env["CALLBACK_URL"]}&response_type=code&scope=webhook.incoming`
    var html =`
      <a href="${redirect_uri}" target="_top">add new Webhook</a>
    `
    return HtmlService.createHtmlOutput(html);
  }

  signup(){
    const dc = new Discord_res(this.env["CLIENT_ID"], this.env["CLIENT_SECRET"], this.env["CALLBACK_URL"])


    var {guild_id, code} = this.p;
    var res = dc.token_grant(code);

    var {id, channel_id, guild_id, application_id, token, url} = res.webhook;
    this.db.bulkInput([id, channel_id, guild_id, application_id, token, url]);

    return this.send(res);
  }

  sendmsg(){
    var server = this.db.getAllData()[1][5];
    const webhook = new Webhooker(server);
    var attachment = {
      url: this.query
    }
    webhook.addAttachments(attachment);
    webhook.setContent("test")

    var res = webhook.send();
    return this.send(res);
  }

  exchangeimg(){
    var data = this.db.getAllData("data");
    var pm = this.query;

    var res = data.find(e => e[0] == pm );

    var obj = {
      code: 200,
      data: res
    }

    return this.send(obj);
  }

  uploadimg(){
    var temp = HtmlService.createTemplateFromFile("formUpload");
    temp._pm = this.query || "abcdasas";
    temp._ch_id = this.p.channel_id;
    temp.app_name = "GB-uploadImg"

    return temp.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}
