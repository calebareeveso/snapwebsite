const express = require("express"),
  app = express(),
  puppeteer = require("puppeteer");
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
app.get("/", async (request, response) => {
  if (request.query.url == undefined) {
    response.setHeader("content-type", "text/plain");
    response.send("ERROR: Missing URL parameter");
  } else {
    try {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
      });
      const page = await browser.newPage();
      //Set View port
      await page.setViewport({
        width: 1280,
        height: 1280,
        deviceScaleFactor: 0.2,
      });

      // Page Load Options
      const pageLoadOptions = {
        waitUntil: "load",
        timeout: 0,
      };

      // Read url query parameter.
      await page.goto(request.query.url, pageLoadOptions);

      // Take snapshot
      const b64string = await page.screenshot({ encoding: "base64" });

      // Close browser
      await browser.close();

      // Send response
      console.log(`Snapped: ${request.query.url}`);
      response.json({ b64string });
    } catch (error) {
      response.send({ error: error.message });
      console.log(error);
    }
  }
});

var listener = app.listen(3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
