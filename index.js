const fs = require('fs')
const path = require('path')
require('dotenv').config()

var api = process.env.APIKEY
var googleTranslate = require('google-translate')(api)

const jsonsInDir = fs.readdirSync('./').filter(file => path.extname(file) === '.json')
count = 1
jsonsInDir.forEach((file, i) => {
  if (file && file !== "list.json" && file.includes("lock") === false && file !== "package.json") {
    const fileData = fs.readFileSync(path.join('./', file))
    const json = JSON.parse(fileData.toString())

    const key = 'ourText' // our text key 
    let text = 'Our text' // our text to translate here

    googleTranslate.translate(text, json.languageCode, function (err, translation) {
      console.log(err)
      try {
        console.log("No: " + count + " " + json.languageCode + " :>", translation.translatedText)
        json[key] = translation.translatedText
        count++ 
        fs.writeFile(file, JSON.stringify(json, null, '  '), 'utf8', function (err) {
          if (err) throw err
        })
      } catch (error) {
        console.log("Error in " + file)
        console.log(error)
      }
    })
  } else {
    console.log("This " + file + " isn't a lang file")
  }
})
