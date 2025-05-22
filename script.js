const cityInput = document.querySelector(".cityInput")
const searchBtn = document.querySelector(".searchBtn")

const notFoundSection = document.querySelector('.notFound')
const searchCitySection = document.querySelector(".searchCity")
const weatherInfoSection = document.querySelector(".weatherInfo")

const countryText = document.querySelector('.countryText')
const tempTxt = document.querySelector('.tempTxt')
const conditionTxt = document.querySelector('.conditionTxt')
const HumidityValueTxt = document.querySelector('.HumidityValueTxt')
const windValueTxt = document.querySelector('.windValueTxt')
const weatherSummaryImg = document.querySelector('.weatherSummaryImg')
const currentDateText = document.querySelector('.currentDateText')

const forecastItemContainer = document.querySelector('.forecastItemContainer')

const apiKey = "99fd044ad7860a4c0c31eba3e84cac30"

searchBtn.addEventListener('click', () =>{
    if (cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
    }
    cityInput.value = ''
    cityInput.blur()
})

cityInput.addEventListener('keydown', (e) =>{
    if(e.key == 'Enter' && cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

async function getFetchData (endPoint, city){
        const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

        const response = await fetch(apiUrl) 
        
        return response.json()
}

// We are matching the weather image icon to the id that we're getting as return 
//? As every id starts with a number and that number is assigned to the specific type of weather

function getWeatherIcon (id){
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate (){
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: "2-digit",
        month: 'short'
    }
    // console.log(currentDate)
    return currentDate.toLocaleDateString('en-GB', options)
}


async function updateWeatherInfo (city){
    const weatherData =  await getFetchData ('weather', city)

    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection)
        return
    }
    console.log(weatherData)


//! This is where we're matching the value(classes) what we've declared in the html to match with the API data 
    const {
        name: country,
        main: { temp, humidity},
        weather: [{id, main}],
        wind: {speed}
    } = weatherData

    countryText.textContent = country
    tempTxt.textContent = Math.round(temp) + '°C'
    conditionTxt.textContent = main
    HumidityValueTxt.textContent = humidity
    windValueTxt.textContent = speed + ' M/s'

    currentDateText.textContent = getCurrentDate()
    weatherSummaryImg.src = `/assets/weather/${getWeatherIcon(id)}`


    await updateForecastsInfo(city)

    showDisplaySection(weatherInfoSection)
}

async function updateForecastsInfo(city){
    const forecastsData = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]


    forecastItemContainer.innerHTML = '' //! This line is important for clearing the pre made html 

    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastsItem(forecastWeather)
        }
    });

}

function updateForecastsItem(weatherData){
    const {
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    } = weatherData
    
    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)
    
    const forecastItem = `
    <div class="forecastItem">
    <h4 class="forecastItemDate regularTxt"> ${dateResult} </h4>
    <img src="assets/weather/${getWeatherIcon(id)}" class="forecastItemImg">
    <h4 class="forecastItemTemp">${Math.round(temp)}°C</h4>
    </div>
    `
forecastItemContainer.insertAdjacentHTML('beforeend', forecastItem )
    
}


function showDisplaySection (section){
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')

    section.style.display = 'flex'
} 
