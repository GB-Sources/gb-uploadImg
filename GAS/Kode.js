function myFunction() {
  const env = PropertiesService.getScriptProperties().getProperties();
  const database_id = env["db_id"];
  const db = new spreadsheetDB("list_url", database_id);

  console.log(db.sp.getSheets().map(e => e.getName()));
}

function setupDatabase(){
  // init env
  const env = PropertiesService.getScriptProperties().getProperties();

  // init database
  const database_id = env["db_id"];
  const db = new spreadsheetDB( null, database_id);

  const sheetList = ["list_url", "err_msg", "data"];

  var cur_sheets = db.sp.getSheets().map(e => e.getName())

  sheetList.map(e => {
    if(cur_sheets.includes(e)) return console.log(`[setupDatabase] Workbook already have: ${e}`)

    console.log(`[setupDatabase] ${e} sheet nnot found`)
    db.createSheet(e);
    console.log(`[setupDatabase] creating new ${e} worksheet`)
    if(e == "list_url") db.bulkInput(["id",	"channel_id",	"guild_id",	"application_id",	"token	url"], e);
  })

}

function doGet(e){
  return new Routing(e);
}

function uploadIMG(_dataUpload){
  try{
    const env = PropertiesService.getScriptProperties().getProperties();
    const database_id = env["db_id"];
    const db = new spreadsheetDB("list_url", database_id);
    const db_data = new spreadsheetDB("data", database_id);

    var img = _dataUpload.theFile;
    var _pm = _dataUpload.pm;
    var _ch_id = _dataUpload.channel_id
    var url = db.getAllData().find(e => e[1] == _ch_id )[5] || db.getAllData()[1][5];


    var options = {
      url,
      img
    };
    
    const webhook = new Webhooker(url,options);
    var res = webhook.send()
    Logger.log(res);

    res = JSON.parse(res);

    var attach_url = res.attachments[0].url;
    

    var obj = [
      _pm,
      attach_url
    ]

    // write to database 
    db_data.bulkInput(obj);

    return attach_url

  } catch (error) {
    err_(error)
    return error.toString();
  }
}

function err_(_err){
  const env = PropertiesService.getScriptProperties().getProperties();
  const db_id = env["db_id"];
  const db = new spreadsheetDB("err_msg", db_id);
  db.bulkInput([new Date().toLocaleDateString(), _err]);
}

function require(filename){
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}