const contentArea = document.querySelector('.content-area');

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = urlParams.get('page') || "pages/Overview/Introduction.html";
    
    loadContent(initialPage, false);
};


function loadContent(page, addToHistory = true) {
    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            contentArea.innerHTML = html;
            
            contentArea.scrollTop = 0;

            if (addToHistory) {
                window.history.pushState({ page }, "", `?page=${page}`);
            }

            const hash = window.location.hash;
            
            if (hash) {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        })
        .catch(error => {
            contentArea.innerHTML = `<p>Error loading content: ${error.message}</p>`;
        });
}


window.addEventListener("popstate", (event) => {
    if (event.state && event.state.page) {
        loadContent(event.state.page, false);
    }
});

function toggleSubmenu(id) {
    let submenu = document.getElementById(id);

    if (submenu.style.maxHeight) {
        submenu.style.maxHeight = null;
    } else {
        submenu.style.maxHeight = submenu.scrollHeight + "px";
    }
}

function openInNewTab(url){
    window.open(url, '_blank');
}

function setHref(url) {
    window.location.href = url;
}

