/*
 Website screenshot API using ExpressJS + playwright + sharp. Built for caleb.fun
*/
const express = require("express");
const { chromium } = require("playwright");
const sharp = require("sharp");

app = express();

app.get("/", async (request, response) => {
  try {
    // Launch chromium
    let browser = await chromium.launch();
    const page = await browser.newPage();

    //Set View port
    await page.setViewportSize({ width: 1280, height: 720 });

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
    response.send(error);
  }
});

var listener = app.listen(3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
