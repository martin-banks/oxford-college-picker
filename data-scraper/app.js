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
          link: `https:${a.getAttribute('href')}`,
          active: false,
        })
      )

    return rows
  })

  const collegesArray = colleges
    .reduce((output, college) => {
      const update = output
      const key = college.name.toLowerCase().replace(/\s+/gi, '-')
      update[key] = college
      return update
    }, {})

  for (const college of colleges) {
    const { name, link } = college
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
              const items = part.split(':')
                .map(a => a.trim())
                .filter(x => x.length)

              if (items.length) {
                update[items[0]] = items[1].toLowerCase() === 'yes'
              }
              return update
            }, {})
          return parts
        })
        .reduce((output, part) => {
          const update = output
          Object.keys(part).forEach(key => {
            update[key] = part[key]
          })
          return update
        }, {})



        // const facilities = data.reduce((output, d) => {
        //   const update = output
        //   Object
        // }, {})
        output[sectionName] = data
      }

      return {
        name,
        data: output,
      }
    })
    const key = name.toLowerCase().replace(/\s+/gi, '-')
    collegesArray[key].facilities = data.data

    fs.writeFile(
      path.join(__dirname, `./data/${name.toLowerCase().replace(/\s+/gi, '-')}.json`),
      JSON.stringify(data, 'utf8', 2),
      err => console.log(err || `${name} list write success`)
    )
  }

  fs.writeFile(
    './data-scraper/all-college-list.json',
    JSON.stringify(collegesArray, 'utf8', 2),
    err => console.log(err || 'College list write success')
  )


  await browser.close()
 
})()
