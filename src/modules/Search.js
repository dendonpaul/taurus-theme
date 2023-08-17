const Search = () => {

  //ADD SEARCH HTML TO THE PAGE
  const addSearchHtml = () => {
    let p = document.createElement("div");
    p.classList.add("search-overlay");
    p.innerHTML = `
      <div class="search-overlay__top">
        <div class="container">
          <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
          <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term">
          <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
        </div>
      </div>
      <div class="container">
        <div id="search-overlay__results"></div>
      </div>
    `
    document.body.append(p);
  }
  addSearchHtml();



  const openSearchButton = document.querySelectorAll(".js-search-trigger");
  const closeSearchIcon = document.querySelector(".search-overlay__close");
  const searchOverlayOpen = document.querySelector(".search-overlay");
  const searchInputField = document.querySelector("#search-term");
  const searchResultsDiv = document.querySelector("#search-overlay__results");

  const selectAllInputFields = document.querySelectorAll("input");
  const selectAllTextArea = document.querySelectorAll("textarea");
  console.log(selectAllInputFields, selectAllTextArea);

  //Timer Vairable
  let timerOut;
  //Spinner status
  let isSpinnerActive = false;
  //Input value
  let previousValue;
  //Overlay status
  let overlayOpened = false;
  //is any input field focused


  

  //Methods
  //Open overlay
  const openCloseOverlay = () => {
    searchOverlayOpen.classList.toggle("search-overlay--active");
    document.getElementsByTagName("body")[0].classList.toggle("body-no-scroll");
    overlayOpened = !overlayOpened;
    //setTimeout for autofocus on search input
    setTimeout(() => {
      //focus input field on openoverlay
      searchInputField.focus();
      //rest input field to empty when overlay closed
      searchInputField.value = "";
    }, 100);
    if (!overlayOpened) {
      searchResultsDiv.innerHTML = "";
    }
  };

  //check Key press S and Esc
  const checkKeyPress = (e) => {
    let inputActive = checkInputActive();
    console.log(inputActive);
    //open overlay if 'S' key pressed and overlay is not already active
    if (e.keyCode === 83 && !overlayOpened && !inputActive) {
      openCloseOverlay();
    }
    //close overlay if 'Esc' key pressed and overlay in already active
    if (e.keyCode === 27 && overlayOpened) {
      openCloseOverlay();
    }
  };

  //Check if input fields are selected. Disable S and Esc functionality to open overlay, if true
  const checkInputActive = () => {
    if (
      document.activeElement.tagName === "INPUT" ||
      document.activeElement.tagName === "TEXTAREA"
    ) {
      return true;
    } else return false;
  };

  //Timer function
  const timerFn = () => {
    clearTimeout(timerOut);
    timerOut = setTimeout(() => {
      return getResults();
    }, 500);
  };

  //Search Function with Timeout
  const searchFunction = () => {
    //run functionality only if search field is empty and there is a change in the input value
    if (previousValue !== searchInputField.value || previousValue !== "") {
      //load spinner wit initial key down
      if (!isSpinnerActive) {
        searchResultsDiv.innerHTML = "<div class='spinner-loader'></div>";
        isSpinnerActive = true;
        timerFn();
      }
    }
    previousValue = searchInputField.value;
  };

  //Get Results
  const getResults = async () => {
    if (previousValue !== "") {
      //Fetch pages based on search
      let jsonDataPages = await fetch(taurusData.root_url+"/wp-json/wp/v2/pages?search=" + previousValue)
        .then((res) => res.json())
        .then((res) => {
          return res;
        });
      //Fetch posts based on search
      let  jsonDataPosts = await fetch(taurusData.root_url+"/wp-json/wp/v2/posts?search=" + previousValue)
      .then(res=>res.json())
      .then(res=>res)

      //Merge both results
      let jsonData = [...jsonDataPages, ...jsonDataPosts]
      console.log(jsonDataPages, jsonDataPosts, jsonData)

      //Print resuts on results div
      searchResultsDiv.innerHTML = `
        <h2 class="search-overlay__section-title">Search Results</h2>
        ${jsonData.length === 0  ? "No Results Found" : `
          <ul class="link-list min-list">
            ${jsonData.map((result) => `<li><a href="${result.link}">${result.title.rendered}</a> ${result.type=='post' ? "by " +result.authorName:""}</li>`)
            .join("")}
          </ul>
          `
        }
        `;
    } else {
      searchResultsDiv.innerHTML = "";
    }
    isSpinnerActive = false;
  };

  //------------------Events----------------------------//
  //Open Search event
  openSearchButton.forEach((item) => {
    item.addEventListener("click", openCloseOverlay);
  });

  //close overlay event
  closeSearchIcon.addEventListener("click", openCloseOverlay);

  //open overlay on 'S' button
  document.addEventListener("keyup", checkKeyPress);

  //Search input trigger if search overlay is open
  searchInputField.addEventListener("keyup", searchFunction);


  
};

export default Search;
