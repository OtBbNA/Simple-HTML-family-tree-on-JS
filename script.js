let idcount = document.getElementsByClassName("line_card").length;
let linecount = 10000;
let lineContainer = new Map();
let cardContainer = new Map();

// Проверка клика
document.addEventListener('click', function(event) {
  if (event.target.tagName === 'BUTTON') {
    const lineCard = event.target.closest('.line_card');
    const line = event.target.closest('.line');
    const id = lineCard.id;
    const lineId = line ? line.id.split('-')[1] : null;
    if (event.target.classList.contains('button_spouse')) {
      addSpouse(lineId, id);
    } else if (event.target.classList.contains('button_child')) {
      addChild(lineId, id);
    } else if (event.target.classList.contains('button_parent')) {
      addParent(lineId, id);
    }
    // По желанию можно также определить, в каком div с классом line_card была нажата кнопка
    const parentDiv = event.target.closest('.line_card');
    if (parentDiv) {
      console.log('В div с id:', parentDiv.id);
    }
  }
});


// Функции поиска
function findCard(id) {
  return document.getElementById(id);
}

function findLine(lineId) {
   return document.getElementById('line-' + lineId);
}

// Функция соединения линии 

function connectString(arr) {
    return arr
        .sort((a, b) => Number(a) - Number(b))  // сортировка по возрастанию
        .join(', ');            // соединение через запятую с пробелом
}

// Работа с линиями
function lineCreate(lineId, newLineId, position){
    let newLineHTML = `<div class="line" id="${'line-' + newLineId}"></div>`;
    console.log(cardContainer.get(lineId));
    findLine(lineId).insertAdjacentHTML(position, newLineHTML);
}

// Работа с пробелами
function spaceCreate(card, position) {
  let newSpaceHTML = `<div class="line_space_free"></div>`
  card.insertAdjacentHTML(position, newSpaceHTML);
}

// Функции для карточек
function cardCreate(element, newId, position) {
    let newCardHTML = `
        <div class="line_card" id="${newId}" data-spouse-id data-children-ids data-parents-ids>
            <div class="line_card_top_cross">
                <div class="line_card_cross_free line_card_cross_margin_right"></div>
                <div class="line_card_cross_free"></div>
            </div>
            <div class="line_card_main">
                <button class="button_spouse">добавить супруга</button>
                <button class="button_child">добавить ребенка</button>
                <button class="button_parent">добавить родителя</button>
            </div>
            <div class="line_card_bottom_cross">
                <div class="line_card_cross_free line_card_cross_margin_right"></div>
                <div class="line_card_cross_free"></div>
            </div>
        </div>
        `
      element.insertAdjacentHTML(position, newCardHTML);
}   

function cardUpdate(id, dataSpouseId, dataChildrenId, dataParentsId) {
    let updatedCard = findCard(id);
    let currentSpouse = cardGetSpouseId(id);
    let currentChildrens = cardGetChildsIds(id);
    let currentParents = cardGetParentsIds(id);
    // if (Array.isArray(dataSpouseId)) {
    //   updatedCard.dataset.spouseId = stringFromArray(dataSpouseId);
    // } else 
    if (!currentSpouse.includes(dataSpouseId)) {
      currentSpouse[currentSpouse.length] = dataSpouseId;
      updatedCard.dataset.spouseId = stringFromArray(currentSpouse);
    }
    // if (Array.isArray(dataChildrenId)) {
    //   updatedCard.dataset.childrenIds = stringFromArray(dataChildrenId);
    // } else 
    if (!currentChildrens.includes(dataChildrenId)) {
      currentChildrens[currentChildrens.length] = dataChildrenId;
      updatedCard.dataset.childrenIds = stringFromArray(currentChildrens);
    }
    // if (Array.isArray(dataParentsId)) {
    //   updatedCard.dataset.parentsIds = stringFromArray(dataParentsId);
    // } else
    if (!currentParents.includes(dataParentsId)) {
      currentParents[currentParents.length] = dataParentsId;
      updatedCard.dataset.parentsIds = stringFromArray(currentParents);
    }
}


function cardDelete() {
  
}



function arrayFromString(str) {
  if (!str || str === '') return [];
  return str.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
}

function stringFromArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return '';
  return arr.map(id => id.toString().trim()).filter(id => id).join(', ');
}


function cardGetChildsIds(id) {
  if (id) {
    let childIds = findCard(id).dataset.childrenIds;
    return arrayFromString(childIds);
  }
}

function cardGetParentsIds(id) {
  if (id) {
    let parentsIds = findCard(id).dataset.parentsIds;
    return arrayFromString(parentsIds);
  }
}

function cardGetSpouseId(id) {
  if (id) {
    let spouseId = findCard(id).dataset.spouseId;
    return arrayFromString(spouseId);
  }
}

// Основная логика

// Добавляем супруга
function addSpouse(lineId, spouseCardId) {
  let spouseCard = findCard(spouseCardId); // находим текущую карточку (на которой нажали кнопку добавить супруга)
  let spouseCurrentChildIds = cardGetChildsIds(spouseCardId); // считываем id детей в массив
  let spouseCurrentSuposeIds = cardGetSpouseId(spouseCardId); // считываем id супруга в массив
  let spouseCurrentParentIds = cardGetParentsIds(spouseCardId); // считываем id родителей в массив
  if(spouseCard.getAttribute('data-spouse-id') == null || spouseCard.getAttribute('data-spouse-id') == '') { // Проверяем, что у карточки нет супруга
    idcount++; // увеличиваем счетчик карточек
    let newSpouseId = idcount; 
    cardUpdate(spouseCardId, newSpouseId, '', ''); // устанавливаем для карточки, для которой добавляют супруга, новый id
    let iAHTML = 'afterend'; // временное решение (потом нужно будет проверять - есть ли справа пустое место)
    cardCreate(spouseCard, newSpouseId, iAHTML) // Создаем пустую карточку с новым id
    cardUpdate(newSpouseId, spouseCardId, spouseCurrentChildIds, ''); // Апдейтим значения в новой карточке dataSpouseId, dataChildrenIds, dataParentsIds
    spaceCreate(spouseCard, iAHTML); // добавляем пробел после (между) карточками
    childs.forEach(child => {
      child.dataset.parentsIds = spouseCardId + ', ' + newSpouseId;
    });
  }
}

// Добавляем ребенка
function addChild(lineId, parrentCardId) {
  let parrentCard = findCard(parrentCardId); // находим текущую карточку (на которой нажали кнопку добавить ребенка)
  idcount++; // увеличиваем счетчик карточек
  let childCardId = idcount;
  let parrentCurrentChildIds = cardGetChildsIds(parrentCardId); // считываем id детей в массив
  let parrentCurrentSuposeIds = cardGetSpouseId(parrentCardId); // считываем id супруга в массив
  let parrentCurrentParentIds = cardGetParentsIds(parrentCardId); // считываем id родителей в массив
  let newLineId = Number(lineId) + 1; // вычисляем id новой линии
  if (findLine(newLineId) === null) { // проверяем, есть ли уже эта линия
    lineCreate(lineId, newLineId, 'afterend'); // если нет - создаем новую
    cardCreate(findLine(newLineId), childCardId, 'afterbegin') // и добавляем в нее новую карточку
    cardUpdate(childCardId, '', '', parrentCardId) // сразу добавляем в нее id родителей
    let spouseId = parrentCurrentSuposeIds[0];
    if (spouseId) {
      cardUpdate(childCardId, '', '', spouseId); // добавляе в нее id второго родителя
      cardUpdate(spouseId, '', childCardId, ''); // добавляем второму родителю новых детей
    }
    cardUpdate(parrentCardId, '', childCardId, '');
  } else { // если есть
    let spouseId = parrentCurrentSuposeIds[0];
    cardCreate(findCard(parrentCurrentChildIds[parrentCurrentChildIds.length - 1]), idcount, 'afterend');
    cardUpdate(childCardId, '', '', parrentCardId);
    cardUpdate(childCardId, '', '', spouseId);
    spaceCreate(findCard(parrentCurrentChildIds[parrentCurrentChildIds.length - 1]), 'afterend'); // и добавляем новую карточку после него
    cardUpdate(parrentCardId, '', childCardId, '');
    cardUpdate( spouseId, '', childCardId, '');
  }
}

// Добавляем родителя
function addParent(lineId, id) {
  let currentCard = findCard(id); // находим текущую карточку (на которой нажали кнопку добавить ребенка)
  idcount++; // увеличиваем счетчик карточек
  let currentChildIds = cardGetChildsIds(id); // считываем id детей в массив
  let currentSuposeIds = cardGetParentsIds(id); // считываем id супруга в массив
  let currentParentIds = cardGetParentsIds(id); // считываем id родителей в массив
  let newLineId = Number(lineId) - 1; // вычисляем id новой линии
  currentParentIds[currentParentIds.length] = idcount;
  if (findLine(newLineId) === null) {  // проверяем, есть ли уже эта линия
    lineCreate(newLineId, 'line-' + lineId, 'beforebegin'); // если нет - создаем новую
    cardCreate(newLineId, '', '', id, 'afterbegin'); // и добавляем в нее новую карточку
  } else { // если есть

  }
}