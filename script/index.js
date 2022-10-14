let weatherType = document.querySelector('.weather')
let city = document.querySelector('.location')
let icon = document.querySelector('.icon img')
let thermometer = document.querySelector('.mainStat img')
let temperature = document.querySelector('.mainStat .statValue')
let windSpeed = document.querySelector('.wind .statValue')
let cloudCover = document.querySelector('.clouds .statValue')
let humidity = document.querySelector('.humidity .statValue')
let date = new Date
let apiLink = 'https://api.openweathermap.org/data/2.5/weather?appid=e313288fa1586debabc518b5dd1f002c&q=Skopje&units=metric'
const timeNow = date.getHours()
const partOfDay = (timeNow <= 5 || timeNow >= 19) ? 'night' : 'day'
const isSunRisingOrSetting = (timeNow == 6 || timeNow == 18) ? true : false
//TODO Search bar for every loaction:
//? https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
//TODO Add options for more metric units (Fahrenheit, Miles/hour)
//TODO Optimize backgrounds
//TODO Add more language support

const loadBackground = () => {
  const backgroundID = Math.ceil(Math.random() * 5)
  const backgroundURL = `img/backgrounds/${partOfDay}/${backgroundID}.jpg`

  document.body.style.backgroundImage = `url(${backgroundURL})`
}

const fetchData = async () => {
  await fetch (apiLink)
  .then(response => response.json())
  .then(data => {
    renderData(data)
    adjustThermometerLevel(data)
    setIcon(data.weather[0].id, data.wind.speed)
  })
}

const renderData = data => {
  weatherType.innerText = data.weather[0].description
  city.innerText = data.name
  temperature.innerText = Math.round(data.main.temp) + '°C'
  windSpeed.innerText = Math.round(data.wind.speed) + 'm/s'
  cloudCover.innerText = data.clouds.all + '%'
  humidity.innerText = data.main.humidity + '%'
}

const adjustThermometerLevel = data => {
  let thermometerLevel
  let temp = Math.round(data.main.temp)

  if(temp <= 0) thermometerLevel = 1
  else if(temp >= 1 && temp <= 10) thermometerLevel = 2
  else if(temp >= 11 && temp <= 20) thermometerLevel = 3
  else if(temp >= 21 && temp <= 29) thermometerLevel = 4
  else if(temp >= 30 && temp <= 38) thermometerLevel = 5
  else if(temp >= 39) thermometerLevel = 6
  
  thermometer.src = `img/icons/right/ic_thermometer_${thermometerLevel}.svg`
}

const setIcon = (weatherID, windSpeedNumber) => {
  let isWindFast = (windSpeedNumber >= 10) ? true : false
  let iconID, iconIndex
  const rangeOfIcons = iconConfig[weatherID].length

  if(isSunRisingOrSetting && (weatherID == 800 || weatherID == 801))
    icon.src = `img/icons/left/half_sun.svg`
  else{
    switch (rangeOfIcons) {
      case 4:
        if(partOfDay === 'day')
          if(isWindFast) iconIndex = 2
          else iconIndex = 0
        else
          if(isWindFast) iconIndex = 3
          else iconIndex = 1
        break
      case 3:
        if(isWindFast) iconIndex = 2
        else{
          if(partOfDay === 'day') iconIndex = 0
          else iconIndex = 1
        }
        break
      case 2:
        if(partOfDay === 'day') iconIndex = 0
        else iconIndex = 1
        break
      default:
        iconIndex = 0
        break
    }

    iconID = iconConfig[weatherID][iconIndex]
    icon.src = `img/icons/left/${iconID}.svg`
  }
}

loadBackground()
fetchData()