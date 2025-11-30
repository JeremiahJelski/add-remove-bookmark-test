const addBookmarkBtn = document.getElementById('add-bookmark-btn');
const saveBtn = document.getElementById('save-btn');
const closeModalBtn = document.getElementById('close-modal');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const modal = document.getElementById('modal');
const bookmarkContainer = document.getElementById('bookmark-container');
const bookmarkForm = document.getElementById('bookmark-form');
const deleteTile= document.getElementById('delete-icon');
let bookmarks = [];


// Add a bookmark
function showModal() {
    modal.classList.add("show-modal");
    setTimeout(() => {
        websiteNameEl.focus();
    }, 10); // To ensure browser completes the modal display before trying to focus
}

// Close modal
function closeModal() {
    modal.classList.remove("show-modal");
    bookmarkForm.reset();
}

// Delete a bookmark
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });
    // Update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Validate form
function validateBookmark(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0=9@:._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert("Please fill a name and website URL.")
        return false;
    }
    if (!urlValue.match(regex)) {

        alert('Please provide a valid web address');
        return false;
    }
    return true;
}

// Populate bookmarks on page (on DOM)
function buildBookmarks() {
    // Empty container before looping to add all bookmarks to avoid doubles
    bookmarkContainer.textContent = '';

    bookmarks.forEach((bm) => {
        const {name, url} = bm;

        // Create item container
        const item = document.createElement('div');
        item.classList.add('item');
        // Delete button
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid', 'fa-xmark', 'delete-icon');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onClick', `deleteBookmark('${url}')`);
        // Favicon / link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'favicon');
        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarkContainer.appendChild(item);
    });
}

// Fetch bookmarks from local storage
function fetchBookmarks() {
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        bookmarks = [{name: 'Test', url: 'https://test.com'}];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// On clicking Save btn
function saveBookmark(e) {
    e.preventDefault(); 
    const websiteNameValue = websiteNameEl.value;
    let websiteUrlValue = websiteUrlEl.value;
    if (!websiteUrlValue.includes('https://') && !websiteUrlValue.includes('http://')) {
        websiteUrlValue = `https://${websiteUrlValue}`;
    }
    if (!validateBookmark(websiteNameValue, websiteUrlValue)) {
        return false;
    }
    const bookmark = {
        name: websiteNameValue,
        url: websiteUrlValue
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    closeModal();
}



// Event listeners
addBookmarkBtn.addEventListener('click', showModal);
saveBtn.addEventListener('click', saveBookmark);
closeModalBtn.addEventListener('click', closeModal);
// deleteTile.addEventListener('click', deleteBookmark);
window.addEventListener('click', (e) => (e.target === modal ? closeModal() : false));


// Populate bookmarks from local storage
fetchBookmarks();