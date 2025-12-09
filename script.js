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
function cardCreate(id, newId, position, lineId = null) {
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
    lineId ? findCard(id).insertAdjacentHTML(position, newCardHTML) 
    : findLine(lineId).insertAdjacentHTML(position, newCardHTML);
}   

function cardUpdate(id, dataSpouseId, dataChildrenIds, dataParentsIds) {
    let updatedCard = findCard(id);
    let spouses = updatedCard.dataset.spouseId || '';
    if (spouses.trim()) {
        updatedCard.dataset.spouseId = `${spouses}, ${dataSpouseId}`;
    } else {
        updatedCard.dataset.spouseId = dataSpouseId;
    }
    let childrens = updatedCard.dataset.childrenIds || '';
    if (childrens.trim()) {
        updatedCard.dataset.childrenIds = `${childrens}, ${dataChildrenIds}`;
    } else {
        updatedCard.dataset.childrenIds = dataChildrenIds;
    }
    let parents = updatedCard.dataset.parentsIds || '';
    if (parents.trim()) {
        updatedCard.dataset.parentsIds = `${parents}, ${dataParentsIds}`;
    } else {
        updatedCard.dataset.parentsIds = dataParentsIds;
    }
}

function cardDelete() {
  
}

function cardGetChildsIds(id) {
    let childIds = findCard(id).dataset.childrenIds || '';
    if (!childIds.trim()) {  // пустая строка или пробелы
        return [];
    }
    let mass = childIds.split(', ')
        .map(Number)  // преобразуем строки в числа
        .filter(id => !isNaN(id));  // убираем NaN
    
    return mass;
}

function cardGetParentsIds(id) {
    let childIds = findCard(id).dataset.parentsIds || '';
    if (!childIds.trim()) {  // пустая строка или пробелы
        return [];
    }
    let mass = childIds.split(', ')
        .map(Number)  // преобразуем строки в числа
        .filter(id => !isNaN(id));  // убираем NaN
    
    return mass;
}

function cardGetSpouseId(id) {
    let childIds = findCard(id).dataset.spouseId || '';
    if (!childIds.trim()) {  // пустая строка или пробелы
        return [];
    }
    let mass = childIds.split(', ')
        .map(Number)  // преобразуем строки в числа
        .filter(id => !isNaN(id));  // убираем NaN
    
    return mass;
}

// Основная логика

// Добавляем супруга
function addSpouse(lineId, id) {
  let currentCard = findCard(id); // находим текущую карточку (на которой нажали кнопку добавить супруга)
  if(currentCard.getAttribute('data-spouse-id') == null || currentCard.getAttribute('data-spouse-id') == '') { // Проверяем, что у карточки нет супруга
    idcount++; // увеличиваем счетчик карточек
    currentCard.dataset.spouseId = idcount; // устанавливаем для карточки, для которой добавляют супруга, новый id
    let iAHTML = 'afterend'; // временное решение (потом нужно будет проверять - есть ли справа пустое место)
    cardCreate(id, idcount, iAHTML) // Создаем пустую карточку с новым id
    cardUpdate(idcount, id, currentCard.dataset.childrenIds, '', ''); // Апдейтим значения в новой карточке dataSpouseId, dataChildrenIds, dataParentsIds
    spaceCreate(currentCard, iAHTML); // добавляем пробел после (между) карточками
    // let childs = document.querySelectorAll('.line_card[data-parents-ids="1"]'); // Пока убираем, нужно сделать изменение айдишек детей
    // childs.forEach(child => {
    //   child.dataset.parentsIds = id + ', ' + idcount;
    // });
  }
}

// Добавляем ребенка
function addChild(lineId, id) {
  let currentCard = findCard(id); // находим текущую карточку (на которой нажали кнопку добавить ребенка)
  idcount++; // увеличиваем счетчик карточек
  let currentChildIds = cardGetChildsIds(id); // считываем id детей в массив
  let currentSuposeIds = cardGetParentsIds(id); // считываем id супруга в массив
  let currentParentIds = cardGetParentsIds(id); // считываем id родителей в массив
  let newLineId = Number(lineId) + 1; // вычисляем id новой линии
  currentChildIds[currentChildIds.length] = idcount; // добавляем новое значение к добытым данным, это будет новое id ребенка в списке
  console.log(currentChildIds);
  if (findLine(newLineId) === null) { // проверяем, есть ли уже эта линия
    lineCreate(lineId, newLineId, 'afterend'); // если нет - создаем новую
    cardCreate(id, idcount, 'afterbegin', newLineId) // и добавляем в нее новую карточку
    cardUpdate(idcount, '', '', id + ', ' + currentSuposeIds) // сразу добавляем в нее id родителей
    cardUpdate(findCard(currentSuposeIds[0]), '', currentChildIds, ''); 
    currentCard.dataset.childrenIds = connectString(currentChildIds); // добавляем в атрибут родителя новое значение id-шек детей
  } else { // если есть
    cardCreate(id, idcount, 'afterend');
    cardUpdate(idcount, '', '', id + ', ' + currentSuposeIds); // находим последнего брата/сестру в списке
    spaceCreate(findCard(currentChildIds.split(',').pop().trim()), 'afterend'); // и добавляем новую карточку после него
    findCard(currentSuposeIds).dataset.childrenIds = newValue;
    currentCard.dataset.childrenIds = newValue; // добавляем в атрибут родителя новое значение id-шек детей
  }
}

// Добавляем родителя
function addParent(lineId, id) {
  console.log('Нажата кнопка добавить родителя');
  idcount++;
  let newLineId = 'line-' + (Number(lineId) - 1); // вычисляем id новой линии


  if (document.getElementById(newLineId) === null) {  // проверяем, есть ли уже эта линия
    lineCreate(newLineId, 'line-' + lineId, 'beforebegin'); // если нет - создаем новую
    cardCreate(newLineId, '', '', id, 'afterbegin'); // и добавляем в нее новую карточку
  } else { // если есть

  }
}