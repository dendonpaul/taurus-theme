const Search = () => {
  const openSearchButton = document.querySelectorAll(".js-search-trigger");
  const closeSearchIcon = document.querySelector(".search-overlay__close");
  const searchOverlayOpen = document.querySelector(".search-overlay");
  const searchInputField = document.querySelector("#search-term");
  const searchResultsDiv = document.querySelector("#search-overlay__results");

  //Timer Vairable
  let timerOut;

  let overlayOpened = false;

  //Methods
  //Open overlay
  const openCloseOverlay = () => {
    searchOverlayOpen.classList.toggle("search-overlay--active");
    document.getElementsByTagName("body")[0].classList.toggle("body-no-scroll");
    overlayOpened = !overlayOpened;
    setTimeout(() => {
      searchInputField.focus();
    }, 100);
  };
  //check Key press
  const checkKeyPress = (e) => {
    //open overlay if 'S' key pressed and overlay is not already active
    if (e.keyCode === 83 && !overlayOpened) {
      openCloseOverlay();
    }
    //close overlay if 'Esc' key pressed and overlay in already active
    if (e.keyCode === 27 && overlayOpened) {
      openCloseOverlay();
    }
  };
  //Timer function
  const timerFn = () => {
    clearTimeout(timerOut);
    timerOut = setTimeout(() => {
      console.log("Timer");
    }, 2000);
  };
  //Search Function with Timeout
  const searchFunction = () => {
    timerFn();
    //search from WP
  };

  //Events
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
