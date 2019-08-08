const fs = require('fs-extra')  
const path = require('path')  
const Puppeteer = require('puppeteer')  
const hbs = require('handlebars')  
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

/*
 Tämä koodi testien jälkeen näyttää toimivan. pupeteer avaa uuden chromen. kun chrome on avannut tiedoston html. Säädä
 domia manuaalisesti javascriptillä passaamalla tiedot domiin. Tiedot poistuvat koska chrome avataan aina uudelleen jolloinka 
 tiedosto avautuu uudelleen ja domi on pyyhkiytynyt pois
*/
app.use(bodyParser.json())
app.use(cors())

let data = {

}

app.get('/api/pdf', (req, res) => {
  const polku = path.join(process.cwd(),"second.pdf")
  console.log(polku)
  res
    .status(200)
    .sendFile(polku)
    
})

app.get('/dowload/:file', (req, res) => {
  let file = req.params.file
  let filelocation = path.join(process.cwd(),"second.pdf")
  console.log(filelocation)
  res.download(filelocation,file)
    
})

app.post('/api/pdf', async(req,res) => {
  const body = req.body
  console.log(body)
  if(body === undefined){
    return res.status(404).json({error: "body was ot defined"}).end()
  }
  data = {
      id: body.id,
      name: body.name,
      email: body.email,
      text: body.text
  }
  console.log(data)
  await hmtl()
  res.status(200).json({status: 200})
})

const randomWord = () => {

  const lorem = new LoremIpsum();

  let sana = lorem.generateWords(80)
  console.log(sana.length)
  return sana
}

const compile = async (filename,data) =>{
  const filepath = path.join(process.cwd(),`${filename}.hbs`)
  const html = await fs.readFile(filepath,"utf-8")
  //const css = await fs.readFile(path.join(process.cwd(),"testi.css"), "utf-8")
  return hbs.compile(html)(data)
}


const hmtl = async() => {
  try {
    const browser = await Puppeteer.launch()
    const page = await browser.newPage()

    //Palautetaan string muotoinen html koodi ja koodin syötetty data
    const content = await compile("htmltemplate",data)
    console.log(content)

    //otetaan string muotinen html data ja tehdän siitä uusi tiedosto
    await fs.writeFile("updatedHmtlTemplate.html",content,(error) => {
      error ? console.log(error) : console.log("file was written")
    })
    
    //asetetaan headless chromelle string muotinen html
    //await page.setContent(content)
    await page.goto(process.cwd()+"/updatedHmtlTemplate.html", {
      waitUntil: "networkidle2"
    })
    //loppu renderöidään
    await page.pdf({
      path: "second.pdf",
      pageRanges: "1",
      format: "A4",
      printBackground: true
    })
    console.log("done")
    await browser.close()
  } catch (error) {
    console.log(error)
  }
  
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})