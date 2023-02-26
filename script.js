const data = 'data.json';
const mainEl = document.querySelector('main');
const asideEl = document.querySelector('aside');
const filterEl = document.querySelector('.filter');
const clearEl = document.querySelector('.clear');
clearEl.addEventListener("click", () => clearFilters());

let selected = {
    role : [],
    level : [], 
    languages : [], 
    tools : []
};
let selectedLength = 0;

const generateFilterBtn = (type, tag) => {
    const filterTag = document.createElement('div');
    filterTag.className = 'card__tags--filter';
    filterTag.innerHTML = `<span>${tag}</span>`;
    filterTag.setAttribute(type, tag.toLowerCase());
    
    const filterClose = document.createElement('button');
    filterClose.classList.add = 'remove';
    filterClose.innerHTML = '<img src="images/icon-remove.svg" alt="Delete Filter">';
    filterClose.addEventListener("click", () => {
        filterTag.remove();
        removeFilter(type, tag.toLowerCase());      
    });
    
    filterEl.appendChild(filterTag).appendChild(filterClose);
}

const addFilter = (type, tag) => {
    asideEl.setAttribute('aria-hidden', false);
    const tagLowerCase = tag.toLowerCase();

    let result = false;

    if (type === "data-role" && !selected.role.includes(tagLowerCase)) {
        selected.role.push(tagLowerCase);
        generateFilterBtn(type, tag);
        selectedLength++;
    }
    if (type === "data-level" && !selected.level.includes(tagLowerCase)) {
        selected.level.push(tagLowerCase);
        generateFilterBtn(type, tag);
        selectedLength++;
    }
    if (type === "data-languages" && !selected.languages.includes(tagLowerCase)) {
        selected.languages.push(tagLowerCase);
        generateFilterBtn(type, tag);
        selectedLength++;
    }
    if (type === "data-tools" && !selected.tools.includes(tagLowerCase)) {
        selected.tools.push(tagLowerCase);
        generateFilterBtn(type, tag);
        selectedLength++;
    }
    
    loadData();
}

const removeFilter = (type, tag) => {
    if (type === "data-role") {
        const roleTagIndex = selected.role.indexOf(tag);
        selected.role.splice(roleTagIndex, 1);
    }
    if (type === "data-level") {
        const levelTagIndex = selected.level.indexOf(tag);
        selected.level.splice(levelTagIndex, 1);
    }
    if (type === "data-languages") {
        const langTagIndex = selected.languages.indexOf(tag);
        selected.languages.splice(langTagIndex, 1);
    }
    if (type === "data-tools") {
        const toolsTagIndex = selected.tools.indexOf(tag);
        selected.tools.splice(toolsTagIndex, 1);
    }

    selectedLength--;
    if (selectedLength === 0) clearFilters();

    loadData();
}

const clearFilters = () => {
    selected = {
        role : [],
        level : [], 
        languages : [], 
        tools : []
    };

    asideEl.setAttribute('aria-hidden', true);
    filterEl.innerHTML = '';
    selectedLength = 0;

    loadData();
}

const generateListings = data => {
    mainEl.innerHTML = '';
    data.forEach((item, i) => {
        const card = document.createElement('div');
        card.className = `card card--animation${item.featured ? ' featured' : ''}`;
        card.innerHTML = `
            <div class="card__listing">
            <div class="card__image">
                <img src="${item.logo}" alt="${item.company}">
            </div>
            <div class="card__text">
                <div class="card__text--top">
                <span class="card__text--company-name">${item.company}</span>
                ${item.new ? '<span class="badge badge-primary">New!</span>' : ''}
                ${item.featured ? '<span class="badge badge-secondary">Featured</span>' : ''}
                </div>
                <h2><a href="#" class="transition">${item.position}</a></h2>
                <ul class="card__text--description">
                    <li>${item.postedAt}</li>
                    <li>${item.contract}</li>
                    <li>${item.location}</li>
                </ul>
            </div>
            </div>
        `;
        const cardTags = document.createElement('div');
        cardTags.className = 'card__tags listing';

        const typesArr = ['role', 'level', 'languages', 'tools'];
        const textArr = [[item.role], [item.level], item.languages, item.tools];
        
        for (const [type, tag] of textArr.entries()) {
            const typeName = `data-${typesArr[type]}`;
            for (const item of tag) {
                const btn = document.createElement('button');
                btn.className = 'tag transition';
                btn.setAttribute(typeName, item.toLowerCase());
                btn.innerHTML = item;
                cardTags.appendChild(btn);
                btn.addEventListener("click", () =>  addFilter(typeName, item));
            }
        }

        card.appendChild(cardTags);

        const tagsArr = [item.role, item.level, ...item.languages, ...item.tools].map(item => item.toLowerCase());
        const selectedArr = [...selected.role, ...selected.level, ...selected.languages, ...selected.tools];
        const tagsSelectedIntersection = [tagsArr, selectedArr].reduce((a, b) => a.filter(c => b.includes(c)));

        // Show all listings
        if (selectedLength === 0) mainEl.appendChild(card);

        // Show filtered listings only
        if (selectedLength > 0 && tagsSelectedIntersection.length === selectedArr.length) {
            mainEl.appendChild(card);
            asideEl.scrollIntoView({ behavior: 'smooth' });
        }
        
    })
}

const errorMsg = err => {
    mainEl.innerHTML = `
    <div class="card error">
        <h2>Error</h2>
        <p>Failed loading data, please try again later.</p>
        <p>${err}</p>
    </div>
    `;
}

const loadData = async () => {
    try {
        const requestData = await fetch(data);
        if (!requestData.ok) throw new Error(error);
        const result = await requestData.json();
        return generateListings(result);
    }
    catch (error) {
        errorMsg(error);
    }
}

loadData();