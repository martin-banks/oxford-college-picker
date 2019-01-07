const data = require('./all-college-list.json')
const fs = require('fs')

const options = {}

Object.keys(data).forEach(key => {
  const { facilities } = data[key]
  const groups = Object.keys(facilities)
  groups.forEach(g => {
    const group = g.trim()
    if (!options[group]) options[group] = []
    Object.keys(facilities[g])
      .forEach(key => options[group].push(key))
  })
})

const cleaned = Object.keys(options)
  .reduce((output, k) => {
    const update = output
    output[k] = [...new Set(options[k])]
      .reduce((outputOptions, opt) => {
        const update = outputOptions
        update[opt] = false
        return update
      }, {})
    return update
  }, {})

  const cleanedArr = Object.keys(options)
  .reduce((output, k) => {
    const update = output
    const newEntry = [...new Set(options[k])]
      .reduce((outputOptions, opt) => {
        // const update = outputOptions
        // update[opt] = false
        // return update
        const ud = outputOptions
        ud.push({ [opt]: true })
        return ud
      }, [])
    update.push(newEntry)
    return update
  }, [])

  console.log(cleanedArr)

const cleanedNew = [... new Set(Object.keys(cleaned)
  .reduce((output, key) => {
    const update = output
    Object.keys(cleaned[key])
      .forEach(x => update.push(x.replace('&nbsp;', '')))
    return update
  }, []))]
  .reduce((output, x) => {
    const update = output
    update[x] = false
    return update
  }, {})

// console.log({ cleanedNew })

fs.writeFile(
  './data-scraper/facility-options.json',
  JSON.stringify(cleaned, 'utf8', 2),
  err => console.log(err || 'Facility options written')
)


// console.log(cleaned)
