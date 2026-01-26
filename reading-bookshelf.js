// Classic Library Bookshelf JavaScript

// Tab switching function
function switchReadingShelf(index) {
    const tabs = document.querySelectorAll('.shelf-tab');
    const contents = document.querySelectorAll('.shelf-content');

    tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });

    contents.forEach((content, i) => {
        content.classList.toggle('active', i === index);
    });
}

// Book color palette for variety
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

// Extract author last name for book spine
function getAuthorLastName(author) {
    if (!author) return '';
    const parts = author.trim().split(' ');
    return parts[parts.length - 1];
}

// Truncate title for book spine
function truncateTitle(title, maxLength = 40) {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength - 3) + '...';
}

// Create a book spine element
function createBookSpine(title, author, link, colorIndex) {
    const bookColor = bookColors[colorIndex % bookColors.length];
    const authorLastName = getAuthorLastName(author);
    const truncatedTitle = truncateTitle(title);

    return `
        <div class="book-spine-item">
            <a href="${link}" target="_blank" rel="noopener" style="text-decoration: none; color: inherit; display: block; width: 100%; height: 100%;">
                <div class="book-spine" style="background: ${bookColor};">
                    <div class="book-author-vertical">${authorLastName}</div>
                    <div class="book-title-vertical">${truncatedTitle}</div>
                </div>
                <div class="book-tooltip">
                    <div class="tooltip-title">${title}</div>
                    <div class="tooltip-author">by ${author}</div>
                </div>
            </a>
        </div>
    `;
}

// Transform Goodreads data into book spines
function transformGoodreadsToBookshelf() {
    // Wait a bit for Goodreads widgets to load
    setTimeout(() => {
        // Currently Reading
        const currentlyReadingContainer = document.querySelector('#gr_custom_widget_1768341552 .gr_custom_container_1768341552');
        if (currentlyReadingContainer) {
            const books = currentlyReadingContainer.querySelectorAll('.gr_custom_each_container_1768341552');
            const booksRow = document.getElementById('currently-reading-books');
            booksRow.innerHTML = '';

            books.forEach((book, index) => {
                const titleLink = book.querySelector('.gr_custom_title_1768341552 a');
                const authorLink = book.querySelector('.gr_custom_author_1768341552 a');

                if (titleLink && authorLink) {
                    const title = titleLink.textContent.trim();
                    const author = authorLink.textContent.trim();
                    const link = titleLink.href;

                    booksRow.innerHTML += createBookSpine(title, author, link, index);
                }
            });

            if (booksRow.innerHTML === '') {
                booksRow.innerHTML = '<p style="color: var(--text-muted); text-align: center; width: 100%;">No books currently reading</p>';
            }
        }

        // Read
        const readContainer = document.querySelector('#gr_custom_widget_1768341553 .gr_custom_container_1768341553');
        if (readContainer) {
            const books = readContainer.querySelectorAll('.gr_custom_each_container_1768341553');
            const booksRow = document.getElementById('read-books');
            booksRow.innerHTML = '';

            books.forEach((book, index) => {
                const titleLink = book.querySelector('.gr_custom_title_1768341553 a');
                const authorLink = book.querySelector('.gr_custom_author_1768341553 a');

                if (titleLink && authorLink) {
                    const title = titleLink.textContent.trim();
                    const author = authorLink.textContent.trim();
                    const link = titleLink.href;

                    booksRow.innerHTML += createBookSpine(title, author, link, index);
                }
            });

            if (booksRow.innerHTML === '') {
                booksRow.innerHTML = '<p style="color: var(--text-muted); text-align: center; width: 100%;">No books read yet</p>';
            }
        }

        // Want to Read (placeholder - you can add Goodreads widget for this too)
        const wantToReadRow = document.getElementById('want-to-read-books');
        wantToReadRow.innerHTML = '<p style="color: var(--text-muted); text-align: center; width: 100%;">Want to read list coming soon</p>';

    }, 2000); // Give Goodreads 2 seconds to load
}

// Transform Substack articles into magazine cards
function transformSubstackToMagazines() {
    const originalFeed = document.getElementById('substack-feed');

    // Store reference to the original loadSubstackFeed function result
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const articles = originalFeed.querySelectorAll('.substack-article');

                if (articles.length > 0) {
                    const magazinesHTML = Array.from(articles).map(article => {
                        const titleEl = article.querySelector('.substack-article-title a');
                        const excerptEl = article.querySelector('.substack-article-excerpt');

                        const title = titleEl ? titleEl.textContent.trim() : '';
                        const excerpt = excerptEl ? excerptEl.textContent.trim() : '';
                        const link = titleEl ? titleEl.href : '#';

                        // Extract Substack name from title if it contains a dash
                        const parts = title.split(' - ');
                        const substackName = parts.length > 1 ? parts[0] : title;
                        const articleTitle = parts.length > 1 ? parts.slice(1).join(' - ') : '';

                        return `
                            <div class="magazine" onclick="window.open('${link}', '_blank')">
                                <div class="magazine-header">${substackName}</div>
                                <div class="magazine-excerpt">${excerpt}</div>
                                <div class="magazine-meta">
                                    <span>→</span>
                                </div>
                            </div>
                        `;
                    }).join('');

                    originalFeed.innerHTML = magazinesHTML;
                    observer.disconnect(); // Stop observing once we've transformed
                }
            }
        });
    });

    observer.observe(originalFeed, {
        childList: true,
        subtree: true
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    transformGoodreadsToBookshelf();
    transformSubstackToMagazines();
});

// Also try to transform after a delay in case DOMContentLoaded already fired
setTimeout(() => {
    transformGoodreadsToBookshelf();
    transformSubstackToMagazines();
}, 100);
