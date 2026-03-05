document.addEventListener('DOMContentLoaded', () => {
    let facilitiesData = [];
    const grid = document.getElementById('facilities-list');
    const noResults = document.getElementById('no-results');
    const statusFilters = document.getElementById('type-filters'); // Wait, I named it type-filters in HTML
    const dimensionFilters = document.getElementById('dimension-filters');
    const searchInput = document.getElementById('facility-search');
    
    // Modal Elements
    const modal = document.getElementById('facility-modal');
    const closeModal = document.querySelector('.close-modal');
    
    // Initial State
    let currentFilters = {
        type: 'all',
        dimension: 'all',
        search: ''
    };

    // 1. Fetch Data
    fetch('data/facilities.json')
        .then(response => response.json())
        .then(data => {
            facilitiesData = data;
            renderGrid();
        })
        .catch(err => {
            console.error('Error loading facilities:', err);
            grid.innerHTML = '<p class="error">无法加载设施数据。</p>';
        });

    // 2. Event Listeners
    
    // Type Filter
    statusFilters.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            // Remove active class from siblings
            Array.from(statusFilters.children).forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            currentFilters.type = e.target.dataset.filter;
            renderGrid();
        }
    });

    // Dimension Filter
    dimensionFilters.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            Array.from(dimensionFilters.children).forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            currentFilters.dimension = e.target.dataset.filter;
            renderGrid();
        }
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value.toLowerCase().trim();
        renderGrid();
    });

    // Modal Close
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // 3. Render Functions
    function renderGrid() {
        grid.innerHTML = '';
        
        const filtered = facilitiesData.filter(item => {
            const matchType = currentFilters.type === 'all' || item.type === currentFilters.type;
            const matchDim = currentFilters.dimension === 'all' || item.dimension === currentFilters.dimension;
            const matchSearch = !currentFilters.search || 
                                item.title.toLowerCase().includes(currentFilters.search) || 
                                item.intro.toLowerCase().includes(currentFilters.search);
            return matchType && matchDim && matchSearch;
        });

        if (filtered.length === 0) {
            noResults.classList.remove('is-hidden');
            return;
        } else {
            noResults.classList.add('is-hidden');
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'facility-card';
            card.onclick = () => openModal(item);

            const statusColor = getStatusColor(item.status);
            const statusText = getStatusText(item.status);
            
            card.innerHTML = `
                <div class="card-header">
                    <h3 class="card-title">${item.title}</h3>
                    <div class="status-indicator-badge status-${item.status}">
                         <div class="status-dot"></div>
                         <span>${statusText}</span>
                    </div>
                </div>
                <p class="card-intro">${item.intro}</p>
                <div class="card-meta">
                    <span class="meta-tag">${getTypeText(item.type)}</span>
                    <span class="meta-tag">${getDimensionText(item.dimension)}</span>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function openModal(item) {
        // Populate specific fields
        document.getElementById('modal-title').innerText = item.title;
        document.getElementById('modal-intro').innerText = item.intro;
        
        // Badges
        const badgesContainer = document.getElementById('modal-badges');
        badgesContainer.innerHTML = '';
        
        // Status Badge
        const statusBadge = document.createElement('span');
        statusBadge.className = `badge badge-status-${item.status} large-badge`;
        statusBadge.innerHTML = `<i class="fas ${getStatusIcon(item.status)}"></i> ${getStatusText(item.status)}`;
        badgesContainer.appendChild(statusBadge);

        // Type Badge
        const typeBadge = document.createElement('span');
        typeBadge.className = 'badge badge-type large-badge';
        typeBadge.innerHTML = `<i class="fas fa-cube"></i> ${getTypeText(item.type)}`;
        badgesContainer.appendChild(typeBadge);
        
        // Location
        document.getElementById('modal-dimension').innerText = getDimensionText(item.dimension);
        const coords = item.coordinates;
        document.getElementById('modal-coords').innerText = `X: ${coords.x}, Y: ${coords.y}, Z: ${coords.z}`;
        
        // Map Link
        const mapLink = document.getElementById('modal-map-link');
        const worldName = getMapWorldName(item.dimension);
        // Format: #world:X:Y:Z:88:0:0:0:1:flat
        mapLink.href = `https://mcmap.lunadeer.cn/#${worldName}:${coords.x}:${coords.y}:${coords.z}:500:0:0:0:1:flat`;

        // Contributors
        const contribList = document.getElementById('modal-contributors');
        contribList.innerHTML = '';
        if (item.contributors && item.contributors.length > 0) {
            item.contributors.forEach(name => {
                const tag = document.createElement('div');
                tag.className = 'contributor-tag';
                // Using minotar for avatar
                tag.innerHTML = `<img src="https://minotar.net/avatar/${name}/20" alt="${name}">${name}`;
                contribList.appendChild(tag);
            });
        } else {
            contribList.innerHTML = '<span class="text-secondary">暂无记录</span>';
        }

        // Instructions
        renderContentList(document.getElementById('modal-instructions'), item.instructions);

        // Notes
        renderContentList(document.getElementById('modal-notes'), item.notes);

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    function renderContentList(container, list) {
        container.innerHTML = '';
        if (!list || list.length === 0) {
            container.innerHTML = '<p>无</p>';
            return;
        }
        list.forEach(block => {
            if (block.type === 'text') {
                const p = document.createElement('p');
                p.innerText = block.content;
                container.appendChild(p);
            } else if (block.type === 'image') {
                const img = document.createElement('img');
                img.src = block.content;
                img.loading = 'lazy';
                container.appendChild(img);
            }
        });
    }

    // Helpers
    function getStatusText(status) {
        const map = {
            'online': '正常运行',
            'maintenance': '维护中',
            'offline': '暂时失效'
        };
        return map[status] || status;
    }

    function getStatusColor(status) {
        const map = {
            'online': 'status-online',
            'maintenance': 'status-maintenance',
            'offline': 'status-offline'
        };
        return map[status] || '';
    }

    function getStatusIcon(status) {
        const map = {
            'online': 'fa-check-circle',
            'maintenance': 'fa-wrench',
            'offline': 'fa-times-circle'
        };
        return map[status] || 'fa-info-circle';
    }

    function getTypeText(type) {
        const map = {
            'resource': '资源类',
            'xp': '经验类',
            'infrastructure': '基础设施'
        };
        return map[type] || type;
    }
    
    function getDimensionText(dim) {
        const map = {
            'overworld': '主世界',
            'nether': '下界',
            'end': '末地'
        };
        return map[dim] || dim;
    }

    function getMapWorldName(dim) {
        const map = {
            'overworld': 'world',
            'nether': 'world_nether',
            'end': 'world_the_end'
        };
        return map[dim] || 'world';
    }
});
