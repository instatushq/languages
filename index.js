const { readdirSync } = require('fs')
const fs = require('fs/promises')
const path = require('path')
require('dotenv').config()

var api = process.env.APIKEY
var googleTranslate = require('google-translate')(api)

const jsonsInDir = readdirSync('./').filter(file => path.extname(file) === '.json')

jsonsInDir.forEach(async file => {
  if (file && file !== "list.json" && file.includes("lock") === false && file !== "package.json") {
    const fileData = await fs.readFile(path.join('./', file))
    const json = JSON.parse(fileData.toString())

    const originals = {
      "week": "week",
    }

    try {
      let count = 1

      for (const [key, text] of Object.entries(originals)) {
        const translation = await new Promise ((res, rej) => googleTranslate.translate(text, json.languageCode, (err, data) => { err ? rej(err) : res(data) }))
        console.log("No: " + count + " " + json.languageCode + " :>", translation.translatedText)
        json[key] = translation.translatedText
        count++
        await fs.writeFile(file, JSON.stringify(json, null, '  '), 'utf8')
      }
    } catch (error) {
      console.log("Error in " + file)
      console.log(error)
    }
  } else {
    console.log("This " + file + " isn't a lang file")
  }
})
