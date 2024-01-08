
const fetchData = async searchTerm => {
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
};

const root = document.querySelector(".autocomplete")
root.innerHTML = `
<label>Search For a Movie</label>
<input class="input" />
<div class="dropdown">
  <div class="dropdown-menu">
    <div class="dropdown-content results">
    </div>
  </div>
</div>`

const input = document.querySelector('input');
const dropdown = document.querySelector(".dropdown")
const result = document.querySelector(".results")

const onInput = async (event) => {
  const movies = await fetchData(event.target.value);
  dropdown.classList.add("is-active")
  result.innerHTML = ""
  if (!movies.length) {
    dropdown.classList.remove("is-active")
  }
  for (let movie of movies) {
    const option = document.createElement("a")

    option.classList.add("dropdown-item")
    if (movie.Poster !== 'N/A') {
      option.innerHTML = `
      <img src="${movie.Poster}"/>
      <h1>Title: ${movie.Title}</h1>`

      result.appendChild(option)
    }

  }
}
input.addEventListener('input', debounce(onInput, 500))
document.addEventListener("click",(event)=>{
  if (!root.contains(event.target)){
    dropdown.classList.remove("is-active")
  }
  else{
    dropdown.classList.add("is-active")
  }
})

