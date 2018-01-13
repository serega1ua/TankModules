let view = {};


view.consoleLog = function (textForConsole, ...rest) {
    if (2 in rest) {
        console.log(textForConsole + rest[0] + rest[1] + rest[2]);
        return;
    }
    if (1 in rest) {
        console.log(textForConsole + rest[0] + rest[1]);
        return;
    }
    if (0 in rest) {
        console.log(textForConsole + rest[0]);
        return;
    }

    console.log(textForConsole);
};



view.consoleDir = function (objForConsole) {
    console.dir(objForConsole);
};

view.toZero = function (element1) {
element1.style.left =0+ 'px';
element1.style.top =0+ 'px'; };


view.leftStyleSet = function (element1, pixels) {
    element1.style.left = pixels + 'px'; };





view.toright = function (element1, timePassed1) {element1.style.left = (timePassed1) / 2 + 'px';};
view.toleft = function (element1, timePassed1) {element1.style.left = "-" +(timePassed1) / 2 + 'px';};
view.tobottom = function (element1, timePassed1) {element1.style.top =  (timePassed1) / 2 + 'px';};
view.totop = function (element1, timePassed1) {element1.style.top = "-"+(timePassed1) / 2 + 'px';};




// view.renderField:
// -получает от контроллера данные о модели поля _cells
// -получает от контроллера данные о тексте инфо-панели infoPanelText
// -получает от контроллера данные о стинг-значения CSS и ID отрисовываемых элементов
// -получает от контроллера данные о html-контейнере, куда вставлять поле боя
// -осуществляет отображение поля, используя appendChild
view.renderField = function (contianer,
                             _cells,
                             infoPanelText,
                             clsforWrapper,
                             clsforInfoPanel,
                             IDforWrapper,
                             IDforInfoPanel) {

    var wrapper = document.getElementById(IDforWrapper);
    if (wrapper) {
        wrapper.innerHTML = "";
        wrapper.parentNode.removeChild(wrapper);
    }

    wrapper = document.createElement("div");
    wrapper.className = clsforWrapper;
    wrapper.id = IDforWrapper;

    var info = document.getElementById(IDforInfoPanel);
    if (info) {
        info.innerHTML = "";
        info.parentNode.removeChild(info);
    }

    info = document.createElement("div");
    info.className = clsforInfoPanel;
    info.id = IDforInfoPanel;
    info.innerHTML = infoPanelText;


    contianer.appendChild(wrapper);
    contianer.appendChild(info);


    // тут есть 2 массива: _cells.length и _cells[i], обходим каждый
    for (let i = 0, len = _cells.length; i < len; i++) {
        for (let j = 0, len2 = _cells[i].length; j < len2; j++) {

            wrapper.appendChild(_cells[i][j].dom);
            _cells[i][j].dom.appendChild(_cells[i][j].bullet.domBullet);


        }
    }


};


//эта функция получила от контроллера данные из модели i, j и создает dom-элемент каждой клетки для вкладки в массив-модель

view.createElement = function (i, j, clsForInsideCell, clsForFirstInRowInsideCell) {
    var element = document.createElement("div");
    element.className = clsForInsideCell;
    element.dataset.i = i;
    element.dataset.j = j;
    element.i = i;
    element.j = j;

    if (j === 0) {
        element.className = clsForFirstInRowInsideCell;
    }

    element.innerText = "i=" + i + "\r" + "j=" + j;

    return element;
};


//эта функция получила от контроллера данные из модели i, j и создает dom-элемент пули для вкладки в массив-модель
view.createElementOfBullet = function (i, j, idForBullet, classForBullet) {
    var element = document.createElement("div");
    element.className = classForBullet;
    element.id = idForBullet;
    return element;
};

view.showTank = function (elementDOM, classOfTank) {
    if (!classOfTank) console.warn("Не передан css-класс танка");
    elementDOM.classList.add(classOfTank);

};


// на самом деле она дублирует функцию _showTank
view.showTankDirection = function (elementDOM, direction) {
    elementDOM.classList.add(direction);
};


view.clearTankDirection = function (elementDOM, CSSCLASSFOR_TO_RIGHT, CSSCLASSFOR_TO_TOP, CSSCLASSFOR_TO_BOTTOM, CSSCLASSFOR_TO_LEFT) {
    //и надо очистить клетку от css-класса направления,
    // тут одно из 4-х направлений, очищаем от всех
    elementDOM.classList.remove(CSSCLASSFOR_TO_RIGHT);
    elementDOM.classList.remove(CSSCLASSFOR_TO_TOP);
    elementDOM.classList.remove(CSSCLASSFOR_TO_BOTTOM);
    elementDOM.classList.remove(CSSCLASSFOR_TO_LEFT);
};


//функция представления (очищает клетку от любого танка)
view.deleteTank = function (elementDOMforDeleting, classOfTank) {
    if (!classOfTank) console.warn("Не передан css-класс танка");
    elementDOMforDeleting.classList.remove(classOfTank);

};


export {view};