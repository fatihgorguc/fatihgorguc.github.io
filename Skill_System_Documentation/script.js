const contentArea = document.getElementById('content-area');

function loadContent(page) {
    // Update iframe content
    document.getElementById('content-frame').src = `pages/${page}`;

    // Update the browser URL without reloading the page
    window.history.pushState({ page }, "", `/${page}`);
}

// Handle back/forward navigation
window.onpopstate = function (event) {
    if (event.state && event.state.page) {
        document.getElementById('content-frame').src = `pages/${event.state.page}`;
    }
};

// Load the correct page on first visit or refresh
window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || "Overview/Introduction.html";
    loadContent(page);
};

// document.addEventListener("DOMContentLoaded", function () {
//     const params = new URLSearchParams(window.location.search);
//     const page = params.get("page");
//     const hash = window.location.hash;
//
//     if (page) {
//         loadContent(page + hash);
//     } else {
//         loadContent("pages/Overview/Introduction.html");
//     }
// });
//
//
// window.onload = function () {
//     const params = new URLSearchParams(window.location.search);
//     const page = params.get('page');
//     if (page) {
//         loadContent(page);
//     }
// };
//
// function loadContent(htmlPath) {
//     history.pushState(null, '', '?page=' + htmlPath);
//     contentArea.src = htmlPath;
//
//     contentArea.onload = function () {
//         const hash = htmlPath.split('#')[1];
//         if (hash) {
//             const doc = contentArea.contentDocument || contentArea.contentWindow.document;
//             const targetElement = doc.getElementById(hash);
//             if (targetElement) {
//                 targetElement.scrollIntoView();
//             }
//         }
//     };
// }


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

