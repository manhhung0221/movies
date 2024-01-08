const fetchData = async searchTerm => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'e359a9d5',
      s: searchTerm
    }
  });
  if (response.data.Error){
    return []
  }
  return response.data.Search
};
const input = document.querySelector('input');
const onInput = async (event) => {
  const movies= await fetchData(event.target.value);
  for (movie of movies){
    const movieElement=document.createElement("div")
    if (movie.Poster!=='N/A'){
      movieElement.innerHTML=`<h1>Title: ${movie.Title}</h1>
      <img src="${movie.Poster}"/>
      <br>`
      document.body.appendChild(movieElement)
    }

  }
}
input.addEventListener('input', debounce(onInput,500))

