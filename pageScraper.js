
const axios = require("axios");
const https = require("https");
const moment = require('moment');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  baseURL: "http://192.168.189.15/integracion/api/",
  // timeout: 1000,
  //headers: {'Content-Type': 'multipart/form-data'}
});

const scraperObject = {
  url: "https://www.bcv.org.ve/",
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url);
    // Wait for the required DOM to be rendered
    await page.waitForSelector(".main-container");
    // Get the link to all the required books

    const tasa = await page.$eval(
      "#dolar > .field-content > .recuadrotsmc > .centrado > strong",
      (el) => el.innerHTML
    );

    const fecha = await page.$eval(".dinpro > span", (el) =>
      el.getAttribute("content")
    );

   let fechaTasa = fecha.split('T')[0];

   let fechaActual = moment().format('YYYY-MM-DD');

    console.log("Tasa: " + tasa);
    
    console.log("Fecha Actual: " + fechaActual);

    console.log("Fecha Banco Central: " + fechaTasa);


   if (fechaTasa == fechaActual) {
    
   console.log('aqui')
    axiosIns
      .post("/cargar-tasa", {
        tasa: tasa,
        fecha: fecha,
      })
      .then(function (response) {
        // handle success
        console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        console.log("finalizado");
      });

    let t = parseFloat(tasa.replace(/,/g, "."));
    axiosIns
      .post(
        "https://admin.kfc.com.ve/api/rate_insert",
        {
          price: redondeado(t.toFixed(3), 2),
          //fecha : fecha
        },
        { httpsAgent }
      )
      .then(function (response) {
        // handle success
        console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        console.log("finalizado");
      });
    }

    if (fechaTasa != fechaActual) {
        
      console.log(`la tasa se actualizara ${fechaTasa}`);

      console.log(`****** TASA NO ACTUALIZADA ******`);
      
    }

    console.log("Hasta Luego!");

    setTimeout(function () {
      
      process.exit();
    }, 5000);

    
  },
};

function redondeado(tasa, decimales) {
  let factor = Math.pow(10, decimales);
  let a = Math.round(tasa * factor) / factor;
  return a;
}



module.exports = scraperObject;
