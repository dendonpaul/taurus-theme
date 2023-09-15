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
  const openCloseOverlay = (e) => {
    e.preventDefault();
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
      let jsonData = await fetch(taurusData.root_url+"/wp-json/taurus/v1/search?term=" + previousValue)
        .then((res) => res.json())
        .then((res) => {
          return res;
        });
        console.log(jsonData.generalInfo.map(data=>data))
      //Print resuts on results div
      searchResultsDiv.innerHTML = `
        <div class="row">
          <div class="one-third">
            <h2 class="search-overlay__section-title">General Information</h2>
              <ul class="link-list min-list">
              ${jsonData.generalInfo.length>0 
                ? jsonData.generalInfo.map(data=>{
                  return `
                    <li><a href='${data.link}'>${data.name}</a> ${data.postType=='post' ? `by ${data.postAuthor}` : ''}</li>
                  `
                }).join(' ')
                : "No General Info found"
              }
              </ul>
          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Programmes</h2>
            <ul class="link-list min-list">
              ${jsonData.programmes.length > 0 
                ? jsonData.programmes.map(data=>{
                  return `
                    <li><a href='${data.link}'>${data.name}</a></li>
                  `
                }).join(' ')
                : `No Programmes found. <a href="${taurusData.root_url}/programmes">View All Programmes</a>`
              }
              </ul>
            <h2 class="search-overlay__section-title">Professors</h2>
            <ul class="professor-cards">
              ${jsonData.professors.length > 0
                ? jsonData.professors.map(data=>{
                  return `
                    <li class="professor-card__list-item">
                      <a class="professor-card" href='${data.link}'>
                        <img class="professor-card__image" src="${data.imageURL}"/>
                        <span class="professor-card__name">${data.name}</span>
                      </a>
                    </li>
                  `
                  }).join(' ')
                : `No Professors found. <a href="${taurusData.root_url}/professors">View All Professors</a>`
              }
              </ul>
          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Campuses</h2>
            <ul class="link-list min-list">
              ${jsonData.campuses.length > 0 
                ? jsonData.campuses.map(data=>{
                  return `
                    <li><a href='${data.link}'>${data.name}</a></li>
                  `
                  }).join(' ')
                : `No Campuses found. <a href="${taurusData.root_url}/campuses">View All Campuses</a>`
              }
              </ul>
            <h2 class="search-overlay__section-title">Events</h2>
              ${jsonData.events.length > 0 
                ? jsonData.events.map(data=>{
                    return `
                    <div class="event-summary">
                      <a class="event-summary__date event-summary__date--beige t-center" href="#">
                        <span class="event-summary__month">${data.eventMonth}</span>
                        <span class="event-summary__day">${data.eventDay}</span>
                      </a>
                      <div class="event-summary__content">
                        <h5 class="event-summary__title headline headline--tiny"><a href="${data.link}">${data.name}</a></h5>
                        <p></p>
                      </div>
                    </div>
                    `
                  }).join(' ')
                : "No events found. <a href=''>View All Events</a>"
              }
          </div>
        </div>
        
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
