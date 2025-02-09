const contentArea = document.getElementById('content-area');

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page");
    const hash = window.location.hash;

    if (page) {
        loadContent(page + hash);

    } else {
        loadContent("pages/Overview/Introduction.html");
    }
});
function loadContent(htmlPath) {
    fetch(htmlPath)
        .then(response => response.text())
        .then(html => {
            contentArea.innerHTML = html;
        })
        .catch(error => {
            console.error("Error loading content:", error);
            contentArea.innerHTML = "Sorry, we couldn't load the content.";
        });
}

function toggleSubmenu(id) {
    let submenu = document.getElementById(id);
    let currentHeight = window.getComputedStyle(submenu).height;
    
    if (currentHeight != "0px") {
        submenu.style.height = "0px";
    } else {
        submenu.style.height = (submenu.children.length * 27).toString() + "px";
    }
}

function openInNewTab(url){
    window.open(url, '_blank');
}

