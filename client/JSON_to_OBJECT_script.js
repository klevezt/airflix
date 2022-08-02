// Reading the file using default
// fs npm package
const fs = require("fs");
const csv = fs.readFileSync("CSV_file.csv");

// Convert the data to String and
// split it in an array
var array = csv.toString().split("\r");

// Since headers are separated, we
// need to traverse remaining n-1 rows.

let obj = {};
for (let i = 0; i < array.length - 1; i++) {

  let str1 = array[i].split(",")[0].replace(/(\r\n|\n|\r|"|')/gm, "");
  let str2 = array[i].split(",")[1].replace(/(\r\n|\n|\r|"|')/gm, ""); 
  console.log(str1);

  obj[str1] =  str2 ;
}

// Convert the resultant array to json and
// generate the JSON output file.
let json = JSON.stringify(obj);
// console.log(json);
fs.writeFileSync("output.json", json);
