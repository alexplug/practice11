// Practice 10 — простая интерактивная галерея
// Требования: createElement, appendChild, remove, setAttribute/removeAttribute,
// classList.add/remove/toggle, события click/input/keydown/mouseover, if/else.

// -------------------- 1) Находим элементы --------------------
const titleInput = document.getElementById('artifact-title');
const categoryInput = document.getElementById('artifact-category');
const imageInput = document.getElementById('artifact-image');
const addBtn = document.getElementById('add-btn');

const searchInput = document.getElementById('search');
const categoriesBox = document.getElementById('categories');
const gallery = document.getElementById('gallery');

const banner = document.getElementById('banner');
const counter = document.getElementById('counter');

const themeBtn = document.getElementById('themeBtn');

const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalFav = document.getElementById('modalFav');

// -------------------- 2) Переменные состояния --------------------
let categoryList = ['all'];       // all = "Все"
let activeCategory = 'all';       // текущая выбранная категория

// -------------------- 3) Вспомогательные функции --------------------
function showBanner(text){
  banner.textContent = text;
  banner.classList.remove('hidden');

  // просто: баннер прячется через 2 секунды
  setTimeout(function(){
    banner.classList.add('hidden');
  }, 2000);
}

function clearInvalid(){
  titleInput.classList.remove('invalid');
  categoryInput.classList.remove('invalid');
  imageInput.classList.remove('invalid');

  // пример removeAttribute
  titleInput.removeAttribute('aria-invalid');
  categoryInput.removeAttribute('aria-invalid');
  imageInput.removeAttribute('aria-invalid');
}

function setInvalid(input){
  input.classList.add('invalid');
  // пример setAttribute
  input.setAttribute('aria-invalid', 'true');
}

function updateCounter(){
  const cards = gallery.querySelectorAll('.card');
  counter.textContent = String(cards.length);
}

function setActiveChip(category){
  const chips = categoriesBox.querySelectorAll('.chip');
  chips.forEach(function(chip){
    chip.classList.remove('chip--active');
  });

  const active = categoriesBox.querySelector('[data-category="' + category + '"]');
  if (active) {
    active.classList.add('chip--active');
  }
}

function addCategory(categoryValue){
  const category = categoryValue.trim().toLowerCase();
  if (category === '') return;

  // если категории нет — создаём кнопку (вкладку)
  if (!categoryList.includes(category)) {
    categoryList.push(category);

    const chip = document.createElement('button');
    chip.classList.add('chip');
    chip.textContent = categoryValue.trim();
    chip.setAttribute('data-category', category);

    chip.addEventListener('click', function(){
      activeCategory = category;
      setActiveChip(category);
      applyFilters();
    });

    categoriesBox.appendChild(chip);
  }
}

function applyFilters(){
  const value = searchInput.value.toLowerCase().trim();
  const cards = gallery.querySelectorAll('.card');

  cards.forEach(function(card){
    const title = card.getAttribute('data-title');
    const cat = card.getAttribute('data-category');

    const okByTitle = title.includes(value);
    const okByCategory = (activeCategory === 'all') || (cat === activeCategory);

    if (okByTitle && okByCategory) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// -------------------- 4) Создание карточки --------------------
function createCard(title, category, imageUrl){
  const card = document.createElement('div');
  card.classList.add('card');

  // данные для фильтра
  card.setAttribute('data-title', title.toLowerCase());
  card.setAttribute('data-category', category.toLowerCase());

  // картинка
  const img = document.createElement('img');
  img.classList.add('card__img');
  img.setAttribute('src', imageUrl);
  img.setAttribute('alt', title);

  // если картинка не загрузилась — уберём src
  img.addEventListener('error', function(){
    img.removeAttribute('src');  // пример removeAttribute
    img.setAttribute('alt', 'Нет изображения');
  });

  // контент
  const body = document.createElement('div');
  body.classList.add('card__body');

  const h3 = document.createElement('h3');
  h3.classList.add('card__title');
  h3.textContent = title;

  const p = document.createElement('p');
  p.classList.add('card__cat');
  p.textContent = 'Категория: ' + category;

  // действия
  const actions = document.createElement('div');
  actions.classList.add('card__actions');

  const favBtn = document.createElement('button');
  favBtn.classList.add('small-btn');
  favBtn.textContent = 'В избранное';

  const delBtn = document.createElement('button');
  delBtn.classList.add('small-btn');
  delBtn.textContent = 'Удалить';

  // --- избранное (if/else + classList) ---
  favBtn.addEventListener('click', function(e){
    e.stopPropagation();

    if (card.classList.contains('favorite')) {
      card.classList.remove('favorite');
      favBtn.textContent = 'В избранное';
    } else {
      card.classList.add('favorite');
      favBtn.textContent = 'Убрать';
    }
  });

  // --- удаление ---
  delBtn.addEventListener('click', function(e){
    e.stopPropagation();
    card.remove();
    updateCounter();
  });

  // --- подсветка при наведении ---
  card.addEventListener('mouseover', function(){
    card.classList.add('hover');
  });

  card.addEventListener('mouseout', function(){
    card.classList.remove('hover');
  });

  // --- модальное окно (детализация) ---
  card.addEventListener('click', function(){
    openModal(card, title, category, imageUrl);
  });

  actions.appendChild(favBtn);
  actions.appendChild(delBtn);

  body.appendChild(h3);
  body.appendChild(p);
  body.appendChild(actions);

  card.appendChild(img);
  card.appendChild(body);

  return card;
}

function openModal(card, title, category, imageUrl){
  modalTitle.textContent = title;
  modalCategory.textContent = category;

  if (card.classList.contains('favorite')) {
    modalFav.textContent = 'избранное';
  } else {
    modalFav.textContent = 'обычный';
  }

  modalImg.setAttribute('src', imageUrl);
  modalImg.setAttribute('alt', title);

  modalOverlay.classList.remove('hidden');
}

function closeModal(){
  modalOverlay.classList.add('hidden');
}

// -------------------- 5) События формы и фильтров --------------------
addBtn.addEventListener('click', function(){
  const title = titleInput.value.trim();
  const category = categoryInput.value.trim();
  const imageUrl = imageInput.value.trim();

  clearInvalid();

  // проверка пустых полей
  if (!title || !category || !imageUrl) {
    if (!title) setInvalid(titleInput);
    if (!category) setInvalid(categoryInput);
    if (!imageUrl) setInvalid(imageInput);

    showBanner('Заполните все поля (название, категория, URL)');
    return;
  }

  addCategory(category);

  const card = createCard(title, category, imageUrl);
  gallery.appendChild(card);

  titleInput.value = '';
  categoryInput.value = '';
  imageInput.value = '';

  updateCounter();
  applyFilters();
});

// Enter = добавить (keydown)
[titleInput, categoryInput, imageInput].forEach(function(inp){
  inp.addEventListener('keydown', function(e){
    if (e.key === 'Enter') {
      addBtn.click();
    }
  });
});

// поиск (input)
searchInput.addEventListener('input', function(){
  applyFilters();
});

// вкладка "Все"
categoriesBox.querySelector('[data-category="all"]').addEventListener('click', function(){
  activeCategory = 'all';
  setActiveChip('all');
  applyFilters();
});

// тема
themeBtn.addEventListener('click', function(){
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
});

// модалка закрытие
modalClose.addEventListener('click', function(){
  closeModal();
});

modalOverlay.addEventListener('click', function(e){
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// -------------------- 6) Старт: 2 примера --------------------
function addDemo(title, category, url){
  addCategory(category);
  const card = createCard(title, category, url);
  gallery.appendChild(card);
}

addDemo('Смартфон', 'Техника', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=60');
addDemo('Книга', 'Учёба', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=60');

updateCounter();
applyFilters();
