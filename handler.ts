import { ScheduledHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as chromium from 'chrome-aws-lambda'

export const koton: ScheduledHandler = async (event, _context) => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless
  })

  const page = await browser.newPage()
  await page.goto('https://s3.kingtime.jp/independent/recorder/personal/')

  const ret = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  };
  console.log(ret)
  return ret
}
