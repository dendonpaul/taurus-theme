const Search = () => {
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
    }, 1000);
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
  const getResults = () => {
    if (previousValue !== "") {
      searchResultsDiv.innerHTML = "This is the results";
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
