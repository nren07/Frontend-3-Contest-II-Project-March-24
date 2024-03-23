document.addEventListener("DOMContentLoaded", function () {
  const imageContainer = document.getElementById("image_container");
  const currentDate = new Date().toISOString().split("T")[0];
  const form = document.getElementById("search-form");
  const searchhistory=document.getElementById("search-history");
  localStorage.setItem('key',JSON.stringify([]));


  async function fetchHandler(date) {
    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=VvbEj8biaAY6eOltFi87wn0XCXgdTSWsK4zv250p&date=${date}`
      );
      if (!response.ok) {
        error();
        throw new Error("Failed to fetch data");
      } else {
        const data = await response.json();
        dataRender(data, date);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function error() {
    const ele2 = document.createElement("p");
    ele2.innerText = "No Data Available for this date";
    imageContainer.appendChild(ele2);
  }
  function dataRender(data, date) {
    const heading = document.createElement("h1");
    if (date ==="") {
      heading.innerHTML = "Nasa Picture of the Day";
    } else {
      heading.innerText = `Picture On ${date}`;
    }
    imageContainer.appendChild(heading);
    const ele = document.createElement("img");
    ele.src = data.url;
    ele.alt="Image Not Loaded";
    imageContainer.appendChild(ele);
    const ele2 = document.createElement("h2");
    ele2.innerText = data.title;
    imageContainer.appendChild(ele2);
    const ele3 = document.createElement("p");
    // console.log(data);
    ele3.innerText = data.explanation;
    imageContainer.appendChild(ele3);
  }

  fetchHandler(currentDate);

  function getCurrentImageOfTheDay(date) { // function will execute when date is current
    imageContainer.innerHTML = "";
    fetchHandler(date);
    saveSearch(date);
  }
  function getImageOfTheDay(date) { // function will execute when other then current date
    imageContainer.innerHTML = "";
    fetchHandler(date);
  }
  function saveSearch(date) {
    let objString=localStorage.getItem('key');
    const obj = JSON.parse(objString);
    obj.push(date);
    localStorage.setItem('key',JSON.stringify(obj));
    addSearchToHistory(date);
  }
  function addSearchToHistory(date){
    const list=document.createElement('li');
    const anchorElement = document.createElement("a");
    anchorElement.innerText=date;
    anchorElement.onclick = function() {
        getImageOfTheDay(date);
    };
    list.appendChild(anchorElement);
    searchhistory.appendChild(list);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const date = document.getElementById("search-input").value;
    if (date=="") {
        getCurrentImageOfTheDay(currentDate)
    } else {
      getImageOfTheDay(date);
      saveSearch(date);
    }
  });
});
