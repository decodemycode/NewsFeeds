/*jshint esversion: 6 */

//Breaking news Threshold Time in Minutes
let breakingNewsThresholdMin = 100;

// News API parameters
let country = "in";
let category = "entertainment"; //entertainment, general, health, science, sports, technology

let sources = 'bbc-news';
let q = "india";
document.getElementById("searchTxt").value = q;
let endpoint = "top-headlines";
// let endpoint = "everything";
let pageSize = 20;

let url = new URL(`/v2/${endpoint}`, 'https://newsapi.org');

// url.searchParams.set('country', country);
// url.searchParams.set('sources', sources);
url.searchParams.set('q', q);
url.searchParams.set('pageSize', pageSize);

let apikey = document.getElementById("apikey").value;
url.searchParams.set('apiKey', apikey);

// Searching News
let searchTxt = document.getElementById("searchTxt").addEventListener("input", searchNews);

/* Seraching News making a New Request */
function requestNews() {
    inputval = document.getElementById("searchTxt").value || "India";
    url.searchParams.set('q', inputval);
    document.getElementById("searchTxt").value = inputval;
    url.searchParams.set('q', inputval);
    let apikey = document.getElementById("apikey").value;
    url.searchParams.set('apiKey', apikey);
    req();
}

/* Seraching News on Existing Page */
function searchNews() {
    inputval = document.getElementById("searchTxt").value;
    newscards = document.querySelectorAll(".card");
    Array.from(newscards).forEach(function (element) {
        let newsText = element.getElementsByClassName("card-body")[0].innerText;
        if (newsText.toLowerCase().includes(inputval.toLowerCase())) {
            element.style.display = "block";
        }
        else {
            element.style.display = "none";
        }
    });
}

// -----------------create an AJAX get request-----------------
let req = function () {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.timeout = 10000;
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function () {
        if (this.status == 200) {
            // let json = JSON.parse(this.response);
            let json = this.response;
            loadNews(json.articles);
        }
        else {
            if (this.status == 401)
                console.log(this.status)
            newsAccordian.innerHTML = `<h4 style="color:blue;">Enter Proper API Key or get correct Key at <a href='https://newsapi.org' target='_blank'><u>NewsAPI.org</u></a></h4>`;
        }
    };
};

// Check if API Key is valid
if (apikey.length != 32) {
    newsAccordian.innerHTML = `<h4 style="color:blue;">Enter correct API Key or get at <a href='https://newsapi.org' target='_blank'><u>NewsAPI.org</u></a></h4>`;
}

function loadNews(articles) {
    let now = Date.now();
    let newsHTML = '';
    articles.forEach((news, index) => {
        console.log(news);

        // Show Breaking News Icon in Header if threshold is less than given <breakingNewsThresholdMin> minutes
        let newsDate = new Date(Date.parse(news.publishedAt));
        let newsTime = newsDate.getTime();
        if ((now - newsTime) / 60000 < breakingNewsThresholdMin) {
            breakingNews = '<img class = "breakingNews" src="/giphy.gif">';
        } else { breakingNews = ""; }


        newsHTML += `
                    <div id = "newscard${index}" class="card">
                    <div class="card-header" id="heading${index}">
                        <h2 class="mb-0">
                            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${index}"
                                aria-expanded="true" aria-controls="collapse${index}">
                                ${news.title.split(' -')[0]} </button><span class="badge badge-secondary" style="font-size: 15px;">${news.source.name || ''}</span>
                                ${breakingNews}
                        </h2>
                    </div>

                    <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" data-parent="#newsAccordian">

                        <div class="card-body">

                            ${news.urlToImage ? `<img class = 'newsimage' src = ${news.urlToImage}> ` : ''}
                            <b>${news.title.split(' -')[0]}</b><br><br>
                                ${news.content || " "} <br> ${news.description || " "}
                                    <a href='${news.url}' target="_balnk">Show More...</a>
                        </div>
                        
                    </div>
                    </div>
                            `;
    });
    let newsAccordian = document.getElementById("newsAccordian");
    newsAccordian.innerHTML = newsHTML || `<h3 style="color:blue;">No News for Given Serach</h3>`;
}








