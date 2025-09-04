function fetchItems(page = 1) {
    const archiveContainer = document.getElementById('archive-checkboxes');
    const tagContainer = document.getElementById('tag-checkboxes');
    const resultsCountSpan = document.getElementById('results-count');

    const searchText = document.getElementById('search').value.trim();
    const selectedArchives = Array.from(archiveContainer.querySelectorAll('input:checked')).map(cb => cb.value);
    const selectedTags = Array.from(tagContainer.querySelectorAll('input:checked')).map(cb => cb.value);

    const params = new URLSearchParams();
    if (searchText) params.append('q', searchText);
    selectedArchives.forEach(archive => params.append('archive', archive));
    selectedTags.forEach(tag => params.append('tag', tag));
    params.append('page', page);
    params.append('limit', 10);

    fetch(`${ROOT_URL}/api/search?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
            resultsCountSpan.innerText = data.total;
            renderResults(data.data);
            renderPagination(data.page, data.totalPages);
        });
}

function renderResults(items) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (items.length === 0) {
        resultsContainer.innerHTML = '<p>No items found.</p>';
        return;
    }

    items.forEach(item => {
        let tags = item.tags;
        tags = tags.split('|').join(', ');
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
          <h5>Filename: <a target="_blank" href="<%= url_base %>file/${item.archive}/${item.filename}"">${item.filename}</a></h5>
          <p>${item.description || ''}</p>
          <p>Archive: <em>${item.archive}</em>, Tags: <em>${tags}</em></p>
        `;
        resultsContainer.appendChild(div);
    });
}

function createPaginationElement(i, current) {
    const li = document.createElement('li');
    if (i >= 0) {
        li.className = `page-item ${i === current ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', e => {
            e.preventDefault();
            currentPage = i;
            fetchItems(i);
        });
    } else {
        li.className = `page-item disabled`;
        li.innerHTML = '<span class="page-link">...</span>';
    }
    return li;
}

function renderPagination(current, totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';
    if (totalPages <= 1) return;

    if (totalPages <= 10) {
        for (let i = 1; i <= totalPages; i++) {
            const li = createPaginationElement(i, current);
            paginationContainer.appendChild(li);
        }
    } else {
        let pageList = new Set([1, 2, 3]);

        pageList.add(totalPages - 2);
        pageList.add(totalPages - 1);
        pageList.add(totalPages);

        pageList.add(Math.max(1, current - 2));
        pageList.add(Math.max(1, current - 1));
        pageList.add(current);
        pageList.add(Math.min(totalPages, current + 1));
        pageList.add(Math.min(totalPages, current + 2));

        let pages = Array.from(pageList);
        pages.sort((a, b) => a - b);

        let lastPage = 0;
        for (let i = 0; i < pages.length; i++) {
            if (pages[i] > lastPage + 1) {
                // add spacer if skipping
                const li = createPaginationElement(-1, current);
                paginationContainer.appendChild(li);
            }

            const li = createPaginationElement(pages[i], current);
            paginationContainer.appendChild(li);

            lastPage = pages[i];
        }
    }
}