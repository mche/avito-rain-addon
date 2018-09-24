// Import the page-mod API
var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;

// Create a page mod
// It will run a script whenever a ".org" URL is loaded
// The script replaces the page contents with a message
pageMod.PageMod({
  //~ include: "*.avito.ru/additem",
// http://www.avito.ru/packages/get_packages?lid=637640&cid=24
  //~ include: /.*\.avito\.ru\/packages\/get_packages/,
  include: /.*\.avito\.ru\/additem/,
  contentScriptFile: [data.url("jquery.min.js"),
                      data.url("avito.js")]
});



