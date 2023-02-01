import axios from "axios"

const API_URL = "https://rickandmortyapi.com/api/character?page=1"

const strategies = {
  fecth: "FETCH",
  axios: "AXIOS",
  xhr: "XMLHTTPREQUEST"
}

document.addEventListener('DOMContentLoaded', () => {
  initApp()
})

function initApp() {
  showCode(strategies.fecth)
  handleRendering(strategies.fecth)
  handleOptions()
}

function handleOptions() {
  const buttonXHR = document.querySelector(".button-xhr")
  const buttonFetch = document.querySelector(".button-fetch")
  const buttonAxios = document.querySelector(".button-axios")

  buttonXHR.addEventListener('click', () => {
    showCode(strategies.xhr)
    handleRendering(strategies.xhr)
  })

  buttonFetch.addEventListener('click', () => {
    showCode(strategies.fecth)
    handleRendering(strategies.fecth)
  })

  buttonAxios.addEventListener('click', () => {
    showCode(strategies.axios)
    handleRendering(strategies.axios)
  })
}

function showCode(strategy) {
  const codeContainer = document.querySelector('.show-code .code')

  let text;
  switch (strategy) {
    case strategies.fecth:
      text = requestWithFetch.toString()
      break;
    case strategies.axios:
      text = requestWithAxios.toString()
      break;
    case strategies.xhr:
      text = requestWithXMLHttpRequest.toString()
      break;
    default:

  }

  codeContainer.textContent = text

}

function mappingUtilityAttributes(characters) {
  return characters.map((character) => ({
    id: character.id,
    name: character.name,
    status: character.status,
    specie: character.species,
    gender: character.gender,
    origin: character.origin.name,
    image: character.image,
  }))
}

async function requestWithFetch() {
  const response = await fetch(API_URL)
  const data = await response.json()

  return mappingUtilityAttributes(data.results)
}

async function requestWithAxios() {
  const { data } = await axios.get(API_URL)

  return mappingUtilityAttributes(data.results)
}

function requestWithXMLHttpRequest() {
  const returnContainer = document.querySelector('.show-code .return')
  const xhr = new XMLHttpRequest()
  xhr.open('GET', API_URL, true)
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      const rawData = JSON.parse(xhr.responseText)
      const data = mappingUtilityAttributes(rawData.results)    
      renderData(data)
      returnContainer.replaceChildren("")
      returnContainer.classList.remove('content-center')
      returnContainer.textContent = JSON.stringify(data, null, 2)  
    }
  }
  xhr.send()  
}

async function handleRendering(strategy) {
  const returnContainer = document.querySelector('.show-code .return')
  renderSpinner(returnContainer)
  const charactersContainer = document.querySelector(".characters-container")
  renderSpinner(charactersContainer)  
  let data  
  switch(strategy) {
    case strategies.fecth:
      data = await requestWithFetch()
      break;
    case strategies.axios:
      data = await requestWithAxios()      
      break;
    case strategies.xhr:
      data = requestWithXMLHttpRequest()      
      return;
    default:
      data = requestWithAxios()      
      break;
  }
  returnContainer.replaceChildren("")
  renderData(data)
  returnContainer.textContent = JSON.stringify(data, null, 2)
  returnContainer.classList.remove('content-center')
  charactersContainer.classList.remove('content-center')
}

function renderData(characters) {
  console.log('render')
  const charactersContainer = document.querySelector(".characters-container")
  charactersContainer.replaceChildren("")
  characters.forEach((character) => {
    const card = document.createElement("DIV")
    card.classList.add('card')
    const image = document.createElement("IMG")
    image.src = character.image
    image.alt = character.name
    const labelContainer = document.createElement("DIV")
    labelContainer.classList.add("content")
    const name = document.createElement("P")
    name.textContent = character.name
    const specie = document.createElement("P")
    specie.textContent = character.specie

    labelContainer.append(name, specie)

    card.append(image, labelContainer)
    charactersContainer.appendChild(card)
  })
}

function renderSpinner(container) { 
  container.classList.add('content-center') 
  const spinnerHTML = 
  `<div class="sk-chase">
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
  </div>`

  container.innerHTML = spinnerHTML
}