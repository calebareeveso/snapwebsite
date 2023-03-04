const express = require("express"),
  app = express(),
  puppeteer = require("puppeteer");
const sharp = require("sharp");
app.get("/", async (request, response) => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    //Set View port
    await page.setViewport({ width: 1280, height: 720 });
    // Read url query parameter.
    await page.goto(request.query.url);
    // Take snapshot
    const snapshot = await page.screenshot();
    // Close browser
    await browser.close();

    // Resize snapshot
    const buffer = await sharp(snapshot)
      .resize({ width: 320, height: 180 })
      .jpeg()
      .toBuffer();

    // Send response
    response.setHeader("content-type", "text/plain");
    response.send(buffer.toString("base64"));
  } catch (error) {
    response.send({ error: error.message });
    console.log(error);
  }
});

var listener = app.listen(3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
