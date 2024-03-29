const createAutoComplete = ({ root, 
                                renderOption,
                                onOptionSelect,
                                inputValue,
                                fetchData }) => {

    root.innerHTML = `
    <label>Search For a Movie</label>
    <input class="input" />
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results">
        </div>
      </div>
    </div>`
    const input = root.querySelector('input');
    const dropdown = root.querySelector(".dropdown")
    const result = root.querySelector(".results")
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

            option.innerHTML = renderOption(movie)
            option.addEventListener("click", () => {
                dropdown.classList.remove("is-active")
                input.value = inputValue(movie)
                onOptionSelect(movie)
            })
            result.appendChild(option)
        }
    }
    input.addEventListener('input', debounce(onInput, 500))
    document.addEventListener("click", (event) => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove("is-active")
        }
    })
}
