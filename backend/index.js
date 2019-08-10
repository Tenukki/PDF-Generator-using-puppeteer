const fs = require('fs-extra')  
const path = require('path')  
const Puppeteer = require('puppeteer')  
const hbs = require('handlebars')  
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(cors())


let browser
const alusta = async() => {
  try {
    browser = await Puppeteer.launch()
  } catch (error) {
    console.log(error)
  }

}



let data = {}

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
  //new.pdf tilalle voidaan asettaa palautettavan tiedoston nimi
  //hakee tiedoston polusta ja palauttaa sen responsessa jonka front end lataa window.open()
  res.download(filelocation,"new.pdf")
    
})

app.post('/api/pdf', async(req,res) => {
  console.time();
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
  await hmtl(data)
  res.status(200).json({status: 200})
  console.timeEnd();
})

const hmtl = async(reveived) => {
  try {
    await alusta()
    const page = await browser.newPage()
    
    await page.goto(process.cwd()+"/updatedHmtlTemplate.html", {
      waitUntil: "networkidle2"
    })

    await page.evaluate((reveived) => {
      document.getElementById('a1').value = reveived.name
      document.getElementById('a2').value = reveived.id
      document.getElementById('a3').value = reveived.email
      document.getElementById('a4').value = reveived.text
      let hmtlbody = document.body.innerHTML
      console.log(hmtlbody)
    },reveived);

    //loppu renderöidään
    await page.pdf({
      path: "second.pdf",
      pageRanges: "1",
      format: "A4",
      printBackground: true
    })
    console.log("done")
    

  } catch (error) {
    console.log(error)
  }
  
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})