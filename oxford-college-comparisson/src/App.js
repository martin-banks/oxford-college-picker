import React, { Component } from 'react'
import './App.css'

import collegeDataJSON from './content/all-college-list.json'
import facilitiesJSON from './content/facility-options.json'

class App extends Component {

  constructor (props) {
    super(props)
    this.state = {
      collegeData: collegeDataJSON,
      facilities: facilitiesJSON,
    }

    this.updateColleges = this.updateColleges.bind(this)
  }

  updateColleges ({ group, facility }) {
    // const filters = Object.keys(this.state.facilities)
    //   .filter(key => {
    //     const activeKeys = Object.keys(this.state.facilities[key])
    //       .filter(k => this.state.facilities[key][k])
    //     return activeKeys.keys.length
    //   })
    // console.log({ filters })
    // const colleges = this.state.collegeData
    //   .filter(c => {
    //   })
    
    // console.log('before', Object.keys(this.state.collegeData).length)

    // const value = this.state.facilities[group][facility]
    // const colleges = Object.keys(this.state.collegeData)
    //   .map(key => {
    //     const c = this.state.collegeData[key]
    //     if (c.facilities[group] && c.facilities[group][facility]) {
    //       c.active = value
    //     } else {
    //       c.active = !value
    //     }
    //     return c
    //   })

    // console.log('after', colleges.length)
    // console.log({ colleges }, '\n')

    // this.setState({ collegeData: colleges })

    const filters = Object.keys(this.state.facilities)
      .map(group => {
        // filter group
        const facilities = this.state.facilities[group]
        const filteredFacilities = Object.keys(facilities)
          .filter(f => facilities[f])
        return { [group]: filteredFacilities }
      })
      
      // .filter(x => {
      //   console.log(x, Object.keys(x))
      // })

    

    const filtersToUse = filters.forEach(f => {
      console.log(Object.keys(f))
      console.log(Object.keys(f).filter(x => f[x]))
      // Object.keys(f).forEach(k => console.log(filters[k]))

      // Object.keys(f).forEach(x => console.log('->', x, filters))
    })


    console.log({ filters }, filters.length)
    // console.log({ filtersToUse })

  }

  toggleOption (e) {
    const group = e.target.getAttribute('data-group')
    const facility = e.target.innerText

    const data = this.state.facilities
    data[group][facility] = !this.state.facilities[group][facility]
    this.setState({ facilities: data })

    console.log(this.state.facilities[group][facility])
    console.log({ group, facility })
    console.log('\n')

    this.updateColleges({ group, facility })
  }


  render() {
    return (
      <div className="App">
        <div className="filters">
          <h3>Choose options</h3>
          {
            Object.keys(this.state.facilities)
              .map(k => <div>
                  <h4>{ k }</h4>
                  {
                    Object.keys(this.state.facilities[k]).map(f => <button
                      data-group={ k }
                      onClick={ this.toggleOption.bind(this) }
                      style={{
                        color: this.state.facilities[k][f]
                          ? 'green'
                          : 'red'
                      }}
                    >{ f }</button>)
                  }  
                </div>
              )
          }
        </div>
        <ul>  
          {
            Object.keys(this.state.collegeData)
              .map(key => <li>
                  <a
                    style={{
                      color: this.state.collegeData[key].active
                        ? 'green'
                        : 'red'
                    }}
                    href={ this.state.collegeData[key].link }
                  >
                    { this.state.collegeData[key].name }
                  </a>
                </li>
              )
          }
        </ul>
      </div>
    )
  }
}

export default App
