let cards = document.getElementsByClassName("line_card");
let lines = document.getElementsByClassName("line");
let idcount = cards.length;
let linecount = 10000;

function lineCreate(newLineId, LineId, position){
    let newLineHTML = `<div class="line" id="${newLineId}"></div>`
    document.getElementById(LineId).insertAdjacentHTML(position, newLineHTML);
}
        
function spaceCreate(cardId, position) {
  let newSpaceHTML = `<div class="line_space_free"></div>`
  document.getElementById(cardId).insertAdjacentHTML(position, newSpaceHTML);
}

function cardCreate(id, dataSpouseId, dataChildrenIds, dataParentsIds, position) {
    let newCardHTML = `
        <div class="line_card" id="${idcount}" data-spouse-id="${dataSpouseId}" data-children-ids="${dataChildrenIds}" data-parents-ids="${dataParentsIds}">
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
    document.getElementById(id).insertAdjacentHTML(position, newCardHTML);
}        

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

function addSpouse(lineId, id) {
  if(cards[id - 1].getAttribute('data-spouse-id') == null || cards[id - 1].getAttribute('data-spouse-id') == ''){
    idcount++;
    let current = cards[id - 1].dataset.spouseId;
    let newValue = current ? current + ', ' + idcount : idcount;
    cards[id - 1].dataset.spouseId = newValue;
    console.log('Нажата кнопка добавить супруга');
    let iAHTML = 'afterend';
    let side = lines['line-' + lineId].getElementsByClassName("line_card");
    for (let i = 0; i < side.length; i++) {
        if (side[i] === document.getElementById(id) && i < side.length - 1) {
            iAHTML = 'beforebegin';
            break;
        }
    }
    cardCreate(id, id, cards[id - 1].dataset.childrenIds, '', iAHTML);
    spaceCreate(id, iAHTML);
  }
}

function addChild(lineId, id) {
  console.log('Нажата кнопка добавить ребенка');
  idcount++;
  let current = cards[id - 1].dataset.childrenIds; // находим карточку родителя (ту, в которой нажали добавить ребенка) и считываем id детей
  console.log(current);
  let newValue = current ? current + ', ' + idcount : idcount; // добавляем новое значение к добытым данным, это будет новое id ребенка в списке
  cards[id - 1].dataset.childrenIds = newValue; // добавляем в атрибут родителя новое значение id-шек детей
  let newLineId = 'line-' + (Number(lineId) + 1); // вычисляем id новой линии
  console.log(document.getElementById(newLineId) === null);
  if (document.getElementById(newLineId) === null) {  // проверяем, есть ли уже эта линия
    lineCreate(newLineId, 'line-' + lineId, 'afterend'); // если нет - создаем новую
    cardCreate(newLineId, '', '', id, 'afterbegin'); // и добавляем в нее новую карточку
  } else { // если есть
    cardCreate(current.slice(-1), '', '', id, 'afterend'); // находим последнего брата/сестру в списке
    spaceCreate(current.slice(-1), 'afterend'); // и добавляем новую карточку после него
  }
}

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