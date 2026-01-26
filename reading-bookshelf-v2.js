// Classic Library Bookshelf JavaScript - Works with existing HTML
// This version dynamically transforms the existing reading section

(function() {
    'use strict';

    // Book color palette
    const bookColors = [
        'linear-gradient(135deg, #a08850, #2c1810)',
        'linear-gradient(135deg, #8b6914, #4a3710)',
        'linear-gradient(135deg, #2d5016, #1a2f0f)',
        'linear-gradient(135deg, #6b4423, #3d2616)',
        'linear-gradient(135deg, #8b4513, #5a2d0c)',
        'linear-gradient(135deg, #556b2f, #36461f)',
        'linear-gradient(135deg, #704214, #4a2b0e)',
        'linear-gradient(135deg, #8b0000, #5a0000)',
        'linear-gradient(135deg, #1e3a5f, #132640)',
        'linear-gradient(135deg, #4a2f1f, #2c1810)'
    ];

    function getAuthorLastName(author) {
        if (!author) return '';
        const parts = author.trim().split(' ');
        return parts[parts.length - 1];
    }

    function truncateTitle(title, maxLength = 35) {
        if (title.length <= maxLength) return title;
        return title.substring(0, maxLength - 3) + '...';
    }

    function createBookCover(title, author, link, coverUrl) {
        return `
            <div class="book-cover-item">
                <a href="${link}" target="_blank" rel="noopener" style="text-decoration: none; color: inherit; display: block; width: 100%; height: 100%;">
                    <div class="book-cover-wrapper">
                        <img src="${coverUrl}" alt="${title}" loading="lazy" />
                    </div>
                    <div class="book-tooltip">
                        <div class="tooltip-title">${title}</div>
                        <div class="tooltip-author">by ${author}</div>
                    </div>
                </a>
            </div>
        `;
    }

    function transformReadingSection() {
        const readingSection = document.getElementById('reading');
        if (!readingSection) {
            console.log('Reading section not found');
            return;
        }

        // Wait for Goodreads widgets to load
        setTimeout(() => {
            // Find all the existing sections
            const readingSections = readingSection.querySelectorAll('.reading-section');

            // Create new library container HTML
            const libraryHTML = `
                <div class="library-container">
                    <div class="shelf-tabs">
                        <button class="shelf-tab active" onclick="window.switchReadingShelf(0)">Currently Reading</button>
                        <button class="shelf-tab" onclick="window.switchReadingShelf(1)">Read</button>
                        <button class="shelf-tab" onclick="window.switchReadingShelf(2)">Want to Read</button>
                    </div>

                    <div class="bookshelf">
                        <div class="shelf-content active" data-shelf="0">
                            <div class="books-row" id="currently-reading-books"></div>
                        </div>
                        <div class="shelf-content" data-shelf="1">
                            <div class="books-row" id="read-books"></div>
                        </div>
                        <div class="shelf-content" data-shelf="2">
                            <div class="books-row" id="want-to-read-books"></div>
                        </div>
                    </div>

                    <div class="magazine-rack">
                        <h3 class="rack-title">Favorite Substack Reads</h3>
                        <div id="substack-feed-new" class="magazines-container"></div>
                    </div>
                </div>
            `;

            // Find and hide the old reading-grid
            const readingGrid = readingSection.querySelector('.reading-grid');
            if (readingGrid) {
                // Hide it but keep it in DOM for Goodreads widgets to load
                readingGrid.style.position = 'absolute';
                readingGrid.style.left = '-9999px';
                readingGrid.style.visibility = 'hidden';

                // Insert new library container after section header
                const sectionHeader = readingSection.querySelector('.section-header');
                if (sectionHeader) {
                    sectionHeader.insertAdjacentHTML('afterend', libraryHTML);
                }

                // Transform Goodreads data after a delay
                setTimeout(() => {
                    transformGoodreadsData();
                    moveSubstackContent();
                }, 1500);
            }
        }, 500);
    }

    function transformGoodreadsData() {
        // Currently Reading
        const currentlyReadingWidget = document.querySelector('#gr_custom_widget_1768341552');
        if (currentlyReadingWidget) {
            const books = currentlyReadingWidget.querySelectorAll('.gr_custom_each_container_1768341552');
            const booksRow = document.getElementById('currently-reading-books');

            if (booksRow && books.length > 0) {
                booksRow.innerHTML = '';
                books.forEach((book, index) => {
                    const titleLink = book.querySelector('.gr_custom_title_1768341552 a');
                    const authorLink = book.querySelector('.gr_custom_author_1768341552 a');
                    const coverImg = book.querySelector('.gr_custom_book_container_1768341552 img');

                    if (titleLink && authorLink && coverImg) {
                        const title = titleLink.textContent.trim();
                        const author = authorLink.textContent.trim();
                        const link = titleLink.href;
                        const coverUrl = coverImg.src.replace('_SX50_', '_SX98_').replace('_SY75_', '_SY150_');
                        booksRow.innerHTML += createBookCover(title, author, link, coverUrl);
                    }
                });
            }
        }

        // Read
        const readWidget = document.querySelector('#gr_custom_widget_1768341553');
        if (readWidget) {
            const books = readWidget.querySelectorAll('.gr_custom_each_container_1768341553');
            const booksRow = document.getElementById('read-books');

            if (booksRow && books.length > 0) {
                booksRow.innerHTML = '';
                books.forEach((book, index) => {
                    const titleLink = book.querySelector('.gr_custom_title_1768341553 a');
                    const authorLink = book.querySelector('.gr_custom_author_1768341553 a');
                    const coverImg = book.querySelector('.gr_custom_book_container_1768341553 img');

                    if (titleLink && authorLink && coverImg) {
                        const title = titleLink.textContent.trim();
                        const author = authorLink.textContent.trim();
                        const link = titleLink.href;
                        const coverUrl = coverImg.src.replace('_SX50_', '_SX98_').replace('_SY75_', '_SY150_');
                        booksRow.innerHTML += createBookCover(title, author, link, coverUrl);
                    }
                });
            }
        }

        // Want to Read - using custom widget
        const wantToReadWidget = document.querySelector('#gr_custom_widget_1769377032');
        if (wantToReadWidget) {
            const books = wantToReadWidget.querySelectorAll('.gr_custom_each_container_1769377032');
            const booksRow = document.getElementById('want-to-read-books');

            if (booksRow && books.length > 0) {
                booksRow.innerHTML = '';
                books.forEach((book, index) => {
                    const titleLink = book.querySelector('.gr_custom_title_1769377032 a');
                    const authorLink = book.querySelector('.gr_custom_author_1769377032 a');
                    const coverImg = book.querySelector('.gr_custom_book_container_1769377032 img');

                    if (titleLink && authorLink && coverImg) {
                        const title = titleLink.textContent.trim();
                        const author = authorLink.textContent.trim();
                        const link = titleLink.href;
                        const coverUrl = coverImg.src.replace('_SX50_', '_SX98_').replace('_SY75_', '_SY150_');
                        booksRow.innerHTML += createBookCover(title, author, link, coverUrl);
                    }
                });
            } else if (booksRow) {
                booksRow.innerHTML = '<p style="color: var(--text-muted); text-align: center; width: 100%; padding: 2rem;">Want to read list coming soon</p>';
            }
        }
    }

    function moveSubstackContent() {
        const oldFeed = document.getElementById('substack-feed');
        const newFeed = document.getElementById('substack-feed-new');

        if (oldFeed && newFeed) {
            // Copy innerHTML from old to new
            newFeed.innerHTML = oldFeed.innerHTML;

            // Also copy any dynamically added children
            const observer = new MutationObserver(() => {
                if (oldFeed.children.length > 0) {
                    while (oldFeed.firstChild) {
                        newFeed.appendChild(oldFeed.firstChild);
                    }
                }
            });

            observer.observe(oldFeed, {
                childList: true,
                subtree: true
            });
        }
    }

    // Tab switching function (global)
    window.switchReadingShelf = function(index) {
        const tabs = document.querySelectorAll('.shelf-tab');
        const contents = document.querySelectorAll('.shelf-content');

        tabs.forEach((tab, i) => {
            tab.classList.toggle('active', i === index);
        });

        contents.forEach((content, i) => {
            content.classList.toggle('active', i === index);
        });
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', transformReadingSection);
    } else {
        transformReadingSection();
    }
})();
