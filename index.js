const autoComplete = {
  renderOption(movie) {
    const imgURL = movie.Poster === "N/A" ? "" : movie.Poster
    return `<img src="${imgURL}"/>
    <h1>Title: ${movie.Title} (${movie.Year})</h1>`
  },

  inputValue(movie) {
    return movie.Title
  },
  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: 'e359a9d5',
        s: searchTerm
      }
    });
    if (response.data.Error) {
      return []
    }
    return response.data.Search
  }
}
createAutoComplete({
  ...autoComplete,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden")
    movieOnSelect(movie, document.querySelector("#left-summary"), 'left')
  },
})
createAutoComplete({
  ...autoComplete,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden")
    movieOnSelect(movie, document.querySelector("#right-summary"), 'right')
  },

})
let leftMovie;
let rightMovie;
const movieOnSelect = async (movie, idSummary, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'e359a9d5',
      i: movie.imdbID
    }
  })

  idSummary.innerHTML = movieTemplate(response.data)
  if (side === 'left') {
    leftMovie = response.data
  } else {
    rightMovie = response.data
  }
  if (leftMovie && rightMovie) {
    const leftElement=document.querySelectorAll("#left-summary .notification")
    const rightElement=document.querySelectorAll("#right-summary .notification")

    leftElement.forEach((leftStat,index)=>{
      rightStat=rightElement[index]
      leftValue=parseFloat(leftStat.dataset.value)
      rightValue=parseFloat(rightStat.dataset.value )
      if (rightValue>leftValue){
        leftStat.classList.remove('is-primary')
        leftStat.classList.add('is-warning')
        rightStat.classList.remove('is-warning')
        rightStat.classList.add('is-primary')
        
      }
      else{
        rightStat.classList.remove('is-primary')
        rightStat.classList.add('is-warning')   
        leftStat.classList.remove('is-warning')
        leftStat.classList.add('is-primary')     
        
      }
      
      
    })
  }
}

const movieTemplate = (movieDetail) => {
  const dollar = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  )
  const metascore = parseInt(movieDetail.Metascore)
  const imdbRating = parseFloat(movieDetail.imdbRating)
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""))
  const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word)

    if (isNaN(value)) {
      if (prev === undefined) {
        prev = 0
      }
      return prev
    }
    else { return prev + value }
  }, 0)

  return `
  <article  class="media">
  <figure class="media-left">
      <p class="image">
          <img src="${movieDetail.Poster}" />
      </p>
  </figure>
  <div class="media-content">
      <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
      </div>
  </div>
</article>
<article data-value=${awards} class="notification is-primary">
  <p class="title">${movieDetail.Awards}</p>
  <p class="subtitle">Awards</p>
</article>
<article data-value=${dollar} class="notification is-primary">
  <p class="title">${movieDetail.BoxOffice}</p>
  <p class="subtitle">Box Office</p>
</article>
<article data-value=${metascore} class="notification is-primary">
  <p class="title">${movieDetail.Metascore}</p>
  <p class="subtitle">Metascore</p>
</article>
<article data-value=${imdbRating} class="notification is-primary">
  <p class="title">${movieDetail.imdbRating}</p>
  <p class="subtitle">IMDB Rating</p>
</article>
<article data-value=${imdbVotes} class="notification is-primary">
  <p class="title">${movieDetail.imdbVotes}</p>
  <p class="subtitle">IMDB Votes</p>
</article>
  `
}