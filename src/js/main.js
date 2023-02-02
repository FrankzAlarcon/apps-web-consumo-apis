import axios from "axios"

const API_URL = "https://rickandmortyapi.com/api/character?page=1"

const strategies = {
  fecth: "FETCH",
  axios: "AXIOS",
  xhr: "XMLHTTPREQUEST",
  jquery: "JQUERY"
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
  const buttonJquery = document.querySelector(".button-jquery")

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

  buttonJquery.addEventListener('click', () => {
    showCode(strategies.jquery)
    handleRendering(strategies.jquery)
  })
}

function showCode(strategy) {
  const codeContainer = document.querySelector('.show-code .code')

  let text;
  switch (strategy) {
    case strategies.fecth:
      text = 
      `async function requestWithFetch() {
        const response = await fetch(API_URL)
        const data = await response.json()
      
        return mappingUtilityAttributes(data.results)
      }`
      break;
    case strategies.axios:
      text = 
      `async function requestWithAxios() {
        const { data } = await axios.get(API_URL)
      
        return mappingUtilityAttributes(data.results)
      }`
      break;
    case strategies.xhr:
      text = 
      `function requestWithXMLHttpRequest() {
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
      }`
      break;
    case strategies.jquery:
      text = 
      `$(document).ready(function(){
        $(".button-jquery").click(function(){
          $.get(API_URL, function(response){
            console.log(response)      
            const data = mappingUtilityAttributes(response.results)    
            renderData(data)
            returnContainer.replaceChildren("")
            returnContainer.classList.remove('content-center')
            returnContainer.textContent = JSON.stringify(data, null, 2)
          });
        });
      });`
      break
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
  const titleCode = document.querySelector(".title-code")
  titleCode.textContent = `Request with: ${strategy}`
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
    case strategies.jquery:
      return
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
  const charactersContainer = document.querySelector(".characters-container")
  charactersContainer.replaceChildren("")  

  const createParagraphWithSpan = (label, content) => {
    const paragraph = document.createElement("P")
    const span = document.createElement("SPAN")
    span.textContent = label
    paragraph.append(span, content)
    return paragraph
  }

  const createImage = (src, alt) => {
    const image = document.createElement("IMG")
    image.src = src
    image.alt = alt
    return image
  }

  characters.forEach((character) => {
    const card = document.createElement("DIV")
    card.classList.add('card')
    const image = createImage(character.image, character.name)

    const labelContainer = document.createElement("DIV")
    labelContainer.classList.add("content")
    const statusContainer = document.createElement("DIV")
    statusContainer.classList.add("status-container")
    const status = document.createElement("SPAN")
    status.classList.add(character.status)
    status.textContent = character.status
    const specie = document.createElement("SPAN")
    specie.classList.add(character.specie)
    specie.textContent = character.specie

    statusContainer.append(status, " - ", specie)
    
    const name = createParagraphWithSpan("Name: ", character.name)
    name.classList.add("name-label")

    const gender = createParagraphWithSpan("Gender: ", character.gender)
    gender.classList.add("gender-label")

    labelContainer.append(statusContainer, name, gender)

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

$(document).ready(function(){
  $(".button-jquery").click(function(){
    $.get(API_URL, function(response){
      console.log('jquery')
      const returnContainer = document.querySelector('.show-code .return')
      const data = mappingUtilityAttributes(response.results)    
      renderData(data)
      returnContainer.replaceChildren("")
      returnContainer.classList.remove('content-center')
      returnContainer.textContent = JSON.stringify(data, null, 2)
    });
  });
});
