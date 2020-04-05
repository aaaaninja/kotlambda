import { ScheduledHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as chromium from 'chrome-aws-lambda'
const holidaysJP = {
  "2020-01-01": "元日",
  "2020-01-13": "成人の日",
  "2020-02-11": "建国記念の日",
  "2020-02-23": "天皇誕生日",
  "2020-02-24": "天皇誕生日 振替休日",
  "2020-03-20": "春分の日",
  "2020-04-29": "昭和の日",
  "2020-05-03": "憲法記念日",
  "2020-05-04": "みどりの日",
  "2020-05-05": "こどもの日",
  "2020-05-06": "憲法記念日 振替休日",
  "2020-07-23": "海の日",
  "2020-07-24": "体育の日",
  "2020-08-10": "山の日",
  "2020-09-21": "敬老の日",
  "2020-09-22": "秋分の日",
  "2020-11-03": "文化の日",
  "2020-11-23": "勤労感謝の日"
}

export const koton: ScheduledHandler = async (event, _context) => {
  const ret = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  }
  console.log(ret)

  if (Object.keys(holidaysJP).includes(event.time.match(/(.+)T/)[1])) {
    console.log('today is holiday!!')
    return ret
  }

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless
  })

  const page = await browser.newPage()
  await page.goto('https://s3.kingtime.jp/independent/recorder/personal/', { waitUntil: "networkidle2" })
  await page.waitFor(5000)
  await page.type('#id', process.env.KOT_ID)
  await page.type('#password', process.env.KOT_PASSWORD)
  await page.click('.btn-control-message')

  const wait_time_list =
    [ 1000 * 60 // 1 min
    , 1000 * 120
    , 1000 * 180
    , 1000 * 240
    , 1000 * 300
    , 1000 * 360
    , 1000 * 420 // 7 min
    ]
  const wait_time = wait_time_list[Math.floor(Math.random() * wait_time_list.length)] // randomに取り出す
  console.log(wait_time)
  await page.waitFor(wait_time)
  await page.click('div.record-btn-inner.record-clock-in')
  await page.waitFor(10000)

  await browser.close()
  return ret
}
