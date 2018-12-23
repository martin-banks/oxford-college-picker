const puppeteer = require('puppeteer')
const mkdirp = require('mkdirp')
const fs = require('fs')
const path = require('path')

console.log('Starting scraper...')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  console.log('Getting page...')
  const initialPage = 'https://www.ox.ac.uk/admissions/undergraduate/colleges/a-z-of-colleges?wssl=1'

  await page.goto(initialPage)
  // await page.screenshot({
  //   path: './data-scraper/data/initial.png',
  // })

  const colleges = await page.evaluate(async () => {
    const table = document.querySelector('table.table-reduced')
    const rows = [...table.querySelectorAll('a')]
      .map(a => ({
          name: a.innerText.trim(),
          link: `https:${a.getAttribute('href')}`
        })
      )

    return rows
  })

  for (const college of colleges) {

    const { name, link } = college
    console.log({ link })
    const collegePage = await browser.newPage()
    await collegePage.goto(link)

    const data = await collegePage.evaluate(async () => {
      const headers = document.querySelectorAll('#content-tab--2 h3')

      const output = {}
      for (const header of headers) {
        const sectionName = header.innerText
        const pars = header.nextSibling
          .innerHTML
          .split('<br>')
        const data = [...pars].map(p => {
          const parts = p
            .split('</li><li>')
            .map(p => p.replace(/\<li\>|\<\/li\>/gi, ''))
            .reduce((output, part) => {
              const update = output
              const items = part.split(':').map(a => a.trim())
              update[items[0]] = items[1]
              return update
            }, {})
          return parts
        })
        output[sectionName] = data
      }

      return {
        name,
        data: output,
      }
    })

    fs.writeFile(
      path.join(__dirname, `./data/${name.toLowerCase().replace(/\s+/gi, '-')}.json`),
      JSON.stringify(data, 'utf8', 2),
      err => console.log(err || `${name} list write success`)
    )
  }

  fs.writeFile(
    path.join(__dirname, './data/all-college-list.json'),
    JSON.stringify(colleges, 'utf8', 2),
    err => console.log(err || 'College list write success')
  )
  
  await browser.close()
 
})()
