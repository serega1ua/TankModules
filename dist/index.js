'use strict';

let view = {};

view.consoleLog = function (...rest) {
    console.log(...rest);
};

view.consoleDir = function (objForConsole) {
    console.dir(objForConsole);
};

view.toZero = function (element1) {
    element1.style.left = 10 + 'px';
    element1.style.top = 10 + 'px';
};

view.leftStyleSet = function (element1, pixels) {
    element1.style.left = pixels + 'px';
};

view.setCssClass = function (element, CssClass) {
    element.className = CssClass;
};

view.addCssClass = function (element, CssClass) {

    element.classList.add(CssClass);
};

view.removeCssClass = function (element, CssClass) {

    element.classList.remove(CssClass);
};

view.removeCssClassFromAllCells = function (_cells, CssClass) {

    // тут есть 2 массива: _cells.length и _cells[i], обходим каждый
    for (let i = 0, len = _cells.length; i < len; i++) {
        for (let j = 0, len2 = _cells[i].length; j < len2; j++) {

            _cells[i][j].dom.classList.remove(CssClass);
        }
    }
};

view.addAndRemoveCssClassInTime = function (element, CssClass, TimeOfShowing) {

    element.classList.add(CssClass);

    setTimeout(function () {
        element.classList.remove(CssClass);
    }, TimeOfShowing);
};

view.toright = function (element1, timePassed1) {
    element1.style.left = timePassed1 / 2 + 'px';
};
view.toleft = function (element1, timePassed1) {
    element1.style.left = "-" + timePassed1 / 2 + 'px';
};
view.tobottom = function (element1, timePassed1) {
    element1.style.top = timePassed1 / 2 + 'px';
};
view.totop = function (element1, timePassed1) {
    element1.style.top = "-" + timePassed1 / 2 + 'px';
};

// view.renderField:
// -получает от контроллера данные о модели поля _cells
// -получает от контроллера данные о тексте инфо-панели infoPanelText
// -получает от контроллера данные о стинг-значения CSS и ID отрисовываемых элементов
// -получает от контроллера данные о html-контейнере, куда вставлять поле боя
// -осуществляет отображение поля, используя appendChild
view.renderField = function (contianer, _cells, infoPanelText, clsforWrapper, clsforInfoPanel, IDforWrapper, IDforInfoPanel) {

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
    // info.appendChild(tankDOMelement);
    //
    // setTimeout(function () {
    //     tankDOMelement.parentNode.removeChild(tankDOMelement);
    // }, 3000);


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

    //element.innerText = "i=" + i + "\r" + "j=" + j;

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

//
// view.showTank = function (elementDOM, classOfTank) {
//     if (!classOfTank) console.warn("Не передан css-класс танка");
//     elementDOM.classList.add(classOfTank);
//
// };


//document.createElement('img')

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

let utils = {};

//генерирует случ.значения в заданном диапазоне
utils.getRandomIntFromInterval = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

//извлекает значение css-свойства
utils.getCssProperty = function (elem, property) {
    return parseFloat(window.getComputedStyle(elem, null).getPropertyValue(property));
};

const _CELL_SIZE = 20;
const CSSCLASSFOR_OUR_TANK = "cellWithOurTank";
//вот три класса, в которых бэкграундзадает разные направления   танка
const CSSCLASSFOR_TO_TOP = "ToTop";
const CSSCLASSFOR_TO_BOTTOM = "ToBottom";
const CSSCLASSFOR_TO_LEFT = "ToLeft";
const CSSCLASSFOR_TO_RIGHT = "ToRight";
const CSSCLASSFOR_ENEMY_TANK = "cellWithEnemyTank";
const CSSCLASSFOR_ENEMY_TANK_DAMAGED = "cellWithEnemyTankDamaged";

var modelData = {};
modelData.gameState = null;
modelData.start = null; // тут хранить время начала
modelData.handle = null; // через эту глобальную переменную будем останавилвать вот так: clearInterval(handle);
modelData.timePassed = null; //тут будем хранить время, прошедшее ДО паузы, чтоб учитывать в общем времени игру ДО паузы через pauseGame()
modelData.timeOfWholeGame = 0; // тут хранить длительность всей игры с учетом пауз
modelData.TIMEOFGAME = 77000000; //сколько будет работать один сеанс игры
modelData.directionOfOurTank = "ToRight"; //тут будем хранить направление танка (куда смотрит), первое значение "ToRight"
modelData.distanceOfShotForEnemy = 12;

var _cells = []; // в массиве _cells  будет модель "чистых" данных о том, что в клетках
var tanksArmy = {};
tanksArmy.ourTank = null;
tanksArmy.enemyTank = null;

var infoPanelText = `<pre> press keys \u2190 \u2191 \u2192 \u2193 for moving to the left, right, top, bottom
     press 'a' for moving to the top-left \u2196
     press 's' for moving to the top-right \u2197
     press 'z' for moving to the bottom-left \u2199
     press 'x' for moving to the bottom-right \u2198
     press 'space' to make a shot</pre>`;

//тут все css-классы, их достаточно изменить в модели и css-файле
var CSS_Classses_Changed = {};
CSS_Classses_Changed.forWrapper = "outside-cell";
CSS_Classses_Changed.forInfoPanel = "info";
CSS_Classses_Changed.forInsideCell = "inside-cell";
CSS_Classses_Changed.forFirstInRowInsideCell = "clear-both inside-cell";
CSS_Classses_Changed.forBullet = "shotMark";
CSS_Classses_Changed.forVisibleBullet = "shotMark displayAsBlock";

CSS_Classses_Changed.forRadar1 = "displayAsBlockAndReady1";
CSS_Classses_Changed.forExplosion = "red";
CSS_Classses_Changed.forLocator = "locator";
CSS_Classses_Changed.forEnemyTankOnRadar = "cellWithEnemyTankOnRadar";
CSS_Classses_Changed.forTarget = "target";
CSS_Classses_Changed.ToTurn = "ToTurn";
CSS_Classses_Changed.forHiddenOutline = "forHiddenOutline";
CSS_Classses_Changed.moveRightOneCell = "moveRightOneCell";
CSS_Classses_Changed.moveTopOneCell = "moveTopOneCell";
CSS_Classses_Changed.moveBottomOneCell = "moveBottomOneCell";
CSS_Classses_Changed.moveLeftOneCell = "moveLeftOneCell";
CSS_Classses_Changed.moveTopLeftOneCell = "moveTopLeftOneCell";
CSS_Classses_Changed.moveTopRightOneCell = "moveTopRightOneCell";
CSS_Classses_Changed.moveBottomRightOneCell = "moveBottomRightOneCell";
CSS_Classses_Changed.moveBottomLeftOneCell = "moveBottomLeftOneCell";
CSS_Classses_Changed.swingEffectBullet = "swing-effect-bullet";
CSS_Classses_Changed.swingEffect = "swing-effect";
CSS_Classses_Changed.fade = "fade";

CSS_Classses_Changed.moveBottom = "moveBottom";
CSS_Classses_Changed.moveTop = "moveTop";
CSS_Classses_Changed.moveLeft = "moveLeft";
CSS_Classses_Changed.moveRight = "moveRight";
CSS_Classses_Changed.forMovingBackground = "forMovingBackground";
CSS_Classses_Changed.ToRight = "ToRight";
CSS_Classses_Changed.ToTop = "ToTop";
CSS_Classses_Changed.ToBottom = "ToBottom";
CSS_Classses_Changed.ToLeft = "ToLeft";

//тут все id-индентификаторы, их достаточно изменить в модели и css-файле
var ID_Changed = {};
ID_Changed.forInfo = "info-cell";
ID_Changed.forWrapper = "wrapper";
ID_Changed.forBullet = "shotMark";

//МОДЕЛЬ ВЫСТРЕЛА ПУЛЕЙ
var modelDataOfShot = {};
modelDataOfShot.shotState = true; //в shotState храним состояние "в состоянии выстрела" или "не в состоянии выстрела", чтоб не стрелять повторно в момент совершаемого выстрела
modelDataOfShot.shotHitOrOut = "out"; //в shotInOrOut храним состояние "летит в цель" (Hit) или "в молоко, т.е. в край поля" (Out)
modelDataOfShot.shotDirection = null;
modelDataOfShot.handleGun1; // аналог handle в функции  движения танка (но тут для пули)
modelDataOfShot.start1; // аналог start в функции  движения танка (но тут для пули)


let modelFunctions = {};

modelFunctions.createTanksByConstructor = function (utilsGetRandomIntFromInterval, _CELL_SIZE) {
    tanksArmy.ourTank = new modelFunctions.MakeTank(utilsGetRandomIntFromInterval(0, _CELL_SIZE - 1), utilsGetRandomIntFromInterval(0, _CELL_SIZE - 1), "ally");
    tanksArmy.enemyTank = new modelFunctions.MakeTank(utilsGetRandomIntFromInterval(1, _CELL_SIZE - 1), utilsGetRandomIntFromInterval(1, _CELL_SIZE - 1), "enemy");
};

//это конструктор для создания танка
modelFunctions.MakeTank = function (i, j, enemyOrAlly) {
    this.i = i;
    this.j = j;
    this.name = enemyOrAlly;
    this.health = 100;
};

modelFunctions.MakeTank.prototype.shotByGun = function () {};

//снижение здоровья танка в его модели
modelFunctions.minusHealth = function (tank) {
    //снижаем здоровье  объекта танка
    tank.health = tank.health - 1;
};

//обновление координат танка в его модели
modelFunctions.renewModelTanksPositions = function (newRow, newCell) {
    tanksArmy.ourTank.i = tanksArmy.ourTank.i + newRow;
    tanksArmy.ourTank.j = tanksArmy.ourTank.j + newCell;
};

//
// //это конструктор для создания танка
// var MakeTank = function (i, j, enemyOrAlly) {
//     this.i = i;
//     this.j = j;
//     this.name = enemyOrAlly;
//     this.health = 100;
// };
//
// MakeTank.prototype.shotByGun = function () {
//     view.consoleLog(this.name, " have been shotted ")
// };


var controllerFor_showTankFirstTime = function (kindOfTank, classOfTank) {
    //контроллер взял из модели ТАНКОВ данные о местоположении танка:
    var i = kindOfTank.i;
    var j = kindOfTank.j;

    //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ:
    var element = _cells[i][j].dom;

    //отдал для отображения данные двух моделей:   //exp
    view.showTank(element, classOfTank);

    view.consoleLog("направление выстрела: ", modelData.directionOfOurTank);
};

//
// var createTanksByConstructor = function () {
//     tanksArmy.ourTank = new MakeTank(utils.getRandomIntFromInterval(0, _CELL_SIZE - 1), utils.getRandomIntFromInterval(0, _CELL_SIZE - 1), "ally");
//     tanksArmy.enemyTank = new MakeTank(utils.getRandomIntFromInterval(1, _CELL_SIZE - 1), utils.getRandomIntFromInterval(1, _CELL_SIZE - 1), "enemy");
//
// };

// //снижение здоровья танка
// var minusHealth = function (tank) {
//     //снижаем здоровье  объекта танка
//     tank.health = tank.health - 1;
// };


//это внутри контроллера оставим, тут берем из импортированных данных массив-модель поля _cells
// и создаем новые данные о нем, сохраняя в этот же массив в модуле  model.js модели
//из модуля view контроллер использует функцию view.createElement, создающую dom-элементы
// (т.е. модуль view сообщается с моделью черех контроллер)
var _createDataModelOfField = function (_rowsNumber, _cellsNumber) {
    var _rowsNumberFinal = _rowsNumber || 20;
    var _cellsNumberFinal = _cellsNumber || 20;

    for (let i = 0; i < _rowsNumberFinal; i++) {
        _cells[i] = [];
        for (let j = 0; j < _cellsNumberFinal; j++) _cells[i].push({
            value: null,
            dom: view.createElement(i, j, CSS_Classses_Changed.forInsideCell, CSS_Classses_Changed.forFirstInRowInsideCell),
            //создание dom-элемента осуществим функцией из модуля view
            i: i,
            j: j,
            //есть пуля в модели данных, тут её стартовое положение и DOM-элемент(пока что не отображённый)
            bullet: {
                domBullet: view.createElementOfBullet(i, j, ID_Changed.forBullet, CSS_Classses_Changed.forBullet),
                startPosition_I: i,
                startPosition_J: j,
                finalPosition_I: null,
                finalPosition_J: null,
                inProcess: null
            }
        });
    }

    view.consoleLog("вот массив с моделью поля:");
    view.consoleDir(_cells);
};

var generateNewPositionForNewTank = function () {

    tanksArmy.enemyTank.i = utils.getRandomIntFromInterval(0, _CELL_SIZE - 1);
    tanksArmy.enemyTank.j = utils.getRandomIntFromInterval(0, _CELL_SIZE - 1);

    if (tanksArmy.enemyTank.i === tanksArmy.ourTank.i && tanksArmy.enemyTank.j === tanksArmy.ourTank.j) {
        generateNewPositionForNewTank();
    }
};

//реализация плавного движения танка
var realizationOfFlowMoving = function (tank, newRow, newCell, classOfTank, i, j, _cells$$1) {

    if (newCell === 0 && newRow === 0) {
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToTurn, 300);
        }
    }

    if (newCell === 1 && newRow === 0) {

        // скрываем границы соседнего элемента, чтоб при переезде танка ему не надо было "подлазить" под линию границы
        if (_cells$$1[i][j + 1]) {
            view.addAndRemoveCssClassInTime(_cells$$1[i][j + 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveRightOneCell, 300);

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToRight, 300);
        }

        if (classOfTank === CSSCLASSFOR_ENEMY_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSSCLASSFOR_ENEMY_TANK, 300);
        }
    }
    if (newCell === 0 && newRow === -1) {

        // скрываем границы соседнего элемента, чтоб при переезде танка ему не надо было "подлазить" под линию границы
        if (_cells$$1[i - 1][j]) {
            view.addAndRemoveCssClassInTime(_cells$$1[i - 1][j].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveTopOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToTop, 300);
        }
        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
        if (classOfTank === CSSCLASSFOR_ENEMY_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSSCLASSFOR_ENEMY_TANK, 300);
        }
    }
    if (newCell === 0 && newRow === 1) {

        // скрываем границы соседнего элемента, чтоб при переезде танка ему не надо было "подлазить" под линию границы
        if (_cells$$1[i + 1][j]) {
            view.addAndRemoveCssClassInTime(_cells$$1[i + 1][j].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveBottomOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToBottom, 300);
        }
        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
        if (classOfTank === CSSCLASSFOR_ENEMY_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSSCLASSFOR_ENEMY_TANK, 300);
        }
    }
    if (newCell === -1 && newRow === 0) {

        if (_cells$$1[i][j - 1]) {
            view.addAndRemoveCssClassInTime(_cells$$1[i][j - 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveLeftOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToLeft, 300);
        }
        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
        if (classOfTank === CSSCLASSFOR_ENEMY_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSSCLASSFOR_ENEMY_TANK, 300);
        }
    }

    if (newCell === -1 && newRow === -1) {

        if (_cells$$1[i - 1][j - 1]) {
            view.addAndRemoveCssClassInTime(_cells$$1[i - 1][j - 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveTopLeftOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToTop, 300);
        }
        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
        if (classOfTank === CSSCLASSFOR_ENEMY_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSSCLASSFOR_ENEMY_TANK, 300);
        }
    }

    if (newCell === 1 && newRow === -1) {

        if (_cells$$1[i - 1][j + 1]) {
            view.addAndRemoveCssClassInTime(_cells$$1[i - 1][j + 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveTopRightOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToTop, 300);
        }
        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
        if (classOfTank === CSSCLASSFOR_ENEMY_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSSCLASSFOR_ENEMY_TANK, 300);
        }
    }

    if (newCell === 1 && newRow === 1) {

        if (_cells$$1[i + 1][j + 1]) {
            view.addAndRemoveCssClassInTime(_cells$$1[i + 1][j + 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveBottomRightOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToBottom, 300);
        }
        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
        if (classOfTank === CSSCLASSFOR_ENEMY_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSSCLASSFOR_ENEMY_TANK, 300);
        }
    }

    if (newCell === -1 && newRow === 1) {

        if (_cells$$1[i + 1][j - 1]) {
            view.addAndRemoveCssClassInTime(_cells$$1[i + 1][j - 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveBottomLeftOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToBottom, 300);
        }
        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
        if (classOfTank === CSSCLASSFOR_ENEMY_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSSCLASSFOR_ENEMY_TANK, 300);
        }
    }
};

// контроллер может двигать любой танк, созданный конструктором, используя для отображения импортированный из view объект
var _controllerFor_showResultOfMoving = function (kindOfTank, newRow, newCell, classOfTank) {
    //контроллер взял из модели ТАНКОВ данные о местоположении танка для удаления:
    var i = kindOfTank.i;
    var j = kindOfTank.j;

    //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ (для удаления из неё танка):
    var elementForDeleting = _cells[i][j].dom;
    //    view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forTarget, 500);

    view.deleteTank(elementForDeleting, classOfTank);

    //реализация плавного движения танка
    realizationOfFlowMoving(elementForDeleting, newRow, newCell, classOfTank, i, j, _cells);

    //удаляем значок прицела на вражеском танке, на случай, если тот уехал раньше, чем значок сам исчез
    view.deleteTank(elementForDeleting, CSS_Classses_Changed.forTarget);

    //и очищаем значок радара или прицела на случай, если наш танк ходит (чтоб радар не оставался на месте танка после его ухода с этой клетке)
    var elementBulletForDeleting = _cells[i][j].bullet.domBullet;
    if (elementBulletForDeleting) {
        view.deleteTank(elementBulletForDeleting, CSS_Classses_Changed.forRadar1);
        view.deleteTank(elementBulletForDeleting, CSS_Classses_Changed.forRadar);
    }

    if (kindOfTank === tanksArmy.ourTank) {
        setTimeout(function () {
            view.clearTankDirection(elementForDeleting, CSSCLASSFOR_TO_RIGHT, CSSCLASSFOR_TO_TOP, CSSCLASSFOR_TO_BOTTOM, CSSCLASSFOR_TO_LEFT);
        }, 300);
    }

    //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ (для вставки в неё танка), newRow и newCell- это дельта сдвига:
    var elementForNewShowing = _cells[i + newRow][j + newCell].dom;

    //отдал для отображения данные двух моделей
    if (kindOfTank === tanksArmy.enemyTank) {

        setTimeout(function () {
            view.showTank(elementForNewShowing, classOfTank);
        }, 300);
    }

    //(и из модели о направлении танка directionOfOurTank взял направление):
    if (kindOfTank === tanksArmy.ourTank) {

        setTimeout(function () {
            view.showTankDirection(elementForNewShowing, modelData.directionOfOurTank);
            //  view.consoleLog("направление выстрела: ", modelData.directionOfOurTank)
        }, 300);
    }
};

//функция проверяет, будут ли танки на одной горизонтали после смещения по горизонтали на deltaOfMovingGoriz
var isOnTheSameGorizontalLine = function (tank1, tank2, deltaOfMovingGoriz) {
    if (tank1.i + deltaOfMovingGoriz === tank2.i) return true;
};

//функция проверяет, будут ли танки на одной вертикали после смещения по горизонтали на deltaOfMovingVert
var isOnTheSameVerticalLine = function (tank1, tank2, deltaOfMovingVert) {
    if (tank1.j + deltaOfMovingVert === tank2.j) return true;
};

//если ближе количества  клеток modelData.distanceOfShotForEnemy, то вражеский танк поражает излучением
var isShotDistanceBetweenTanks = function (tank1, tank2, deltaOfMoving, lineGorOrVert) {
    if (lineGorOrVert === "GorizontalLine" && Math.abs(tank1.j + deltaOfMoving - tank2.j) < modelData.distanceOfShotForEnemy) {
        // view.consoleLog("Math.abs((tank1.j + deltaOfMoving) - tank2.j) < 4");
        // view.consoleLog((tank1.j + deltaOfMoving), " and ", tank2.j);
        return true;
    }
    if (lineGorOrVert === "VerticalLine" && Math.abs(tank1.i + deltaOfMoving - tank2.i) < modelData.distanceOfShotForEnemy) {
        // view.consoleLog("Math.abs((tank1.i + deltaOfMoving) - tank2.i)) < 4");
        // view.consoleLog((tank1.i + deltaOfMoving), " and ", tank2.i);
        return true;
    }
};

//визуальный эффект радара
var showRadarEffect = function (newRowForEnemy, newCellForEnemy, newRowForOur, newCellForOur) {
    //эффект на нашем танке
    view.addAndRemoveCssClassInTime(_cells[tanksArmy.ourTank.i + newRowForOur][tanksArmy.ourTank.j + newCellForOur].dom, CSS_Classses_Changed.swingEffect, 1000);
    view.addAndRemoveCssClassInTime(_cells[tanksArmy.ourTank.i + newRowForOur][tanksArmy.ourTank.j + newCellForOur].bullet.domBullet, CSS_Classses_Changed.forRadar, 1000);

    //эффект на вражеском танке
    //    view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i + newRowForEnemy][tanksArmy.enemyTank.j + newCellForEnemy].dom, "opacity", 300);

    setTimeout(function () {
        view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forLocator, 300);
        view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forEnemyTankOnRadar, 700);
    }, 300);
};

var moveEnemyTank = function (newRow, newCell) {

    //в 4-х if ниже не даём выехать за пределы поляи "отталкиваем" его от прилипания к краю поля

    if (tanksArmy.enemyTank.i + newRow > _CELL_SIZE - 1) {
        newRow = newRow - 2;
    }
    if (tanksArmy.enemyTank.j + newCell > _CELL_SIZE - 1) {
        newCell = newCell - 2;
    }
    if (tanksArmy.enemyTank.i + newRow < 0) {
        newRow = newRow + 2;
    }
    if (tanksArmy.enemyTank.j + newCell < 0) {
        newCell = newCell + 2;
    }

    //это запрет цели наезжать на танк при хаотичном её движении, просто смещение в случае наезда задается как ноль по обеим координатам
    // а при следующем смещении она поедет дальше, следующие случайные координаты её передвижения не совпадут/ лишнюю секунду цель простоит на месте тут
    if (isOnTheSameVerticalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newCell) && isOnTheSameGorizontalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newRow)) {
        view.consoleLog("цель пыталась наехать  на наш танк, двойная потеря здоровья нашего танка!");

        showRadarEffect(0, 0, 0, 0);
        modelFunctions.minusHealth(tanksArmy.ourTank);
        modelFunctions.minusHealth(tanksArmy.ourTank);

        view.consoleLog("здоровье tanksArmy.ourTank = ", tanksArmy.ourTank.health);

        return;
    }

    if (isOnTheSameGorizontalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newRow) && !isShotDistanceBetweenTanks(tanksArmy.enemyTank, tanksArmy.ourTank, newCell, "GorizontalLine")) {
        view.consoleLog("на одной горизонтали ввиду передвижения вражеского танка!");
        view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i + newRow][tanksArmy.enemyTank.j + newCell].dom, CSS_Classses_Changed.forTarget, 500);
    }

    //срабатывание радара, если возможен выстрел по вертикали
    if (isOnTheSameVerticalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newCell) && !isShotDistanceBetweenTanks(tanksArmy.enemyTank, tanksArmy.ourTank, newRow, "VerticalLine")) {
        view.consoleLog("на одной вертикали  ввиду передвижения вражеского танка!");
        view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i + newRow][tanksArmy.enemyTank.j + newCell].dom, CSS_Classses_Changed.forTarget, 500);
    }

    //срабатывание радара, если возможен выстрел по горизонтали. newRow - это будущее смещение по горизонтали
    if (isOnTheSameGorizontalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newRow) && isShotDistanceBetweenTanks(tanksArmy.enemyTank, tanksArmy.ourTank, newCell, "GorizontalLine")) {
        view.consoleLog("на одной горизонтали и ближе 4 клеток!");
        showRadarEffect(newRow, newCell, 0, 0);
        modelFunctions.minusHealth(tanksArmy.ourTank);
        view.consoleLog("здоровье tanksArmy.ourTank = ", tanksArmy.ourTank.health);
    }

    //срабатывание радара, если возможен выстрел по вертикали
    if (isOnTheSameVerticalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newCell) && isShotDistanceBetweenTanks(tanksArmy.enemyTank, tanksArmy.ourTank, newRow, "VerticalLine")) {
        view.consoleLog("на одной вертикали и ближе 4 клеток!");
        showRadarEffect(newRow, newCell, 0, 0);
        modelFunctions.minusHealth(tanksArmy.ourTank);
        view.consoleLog("здоровье tanksArmy.ourTank = ", tanksArmy.ourTank.health);
    }

    _controllerFor_showResultOfMoving(tanksArmy.enemyTank, newRow, newCell, CSSCLASSFOR_ENEMY_TANK);

    //и после отображения в модели данных указываем новое местоположение (т.е. контроллер обновляет данные в модели)
    tanksArmy.enemyTank.i = tanksArmy.enemyTank.i + newRow;
    tanksArmy.enemyTank.j = tanksArmy.enemyTank.j + newCell;
};

var _moveToRandomDirection = function () {

    var sides = {
        left: function () {
            moveEnemyTank(0, -1);
        },
        right: function () {
            moveEnemyTank(0, 1);
        },
        top: function () {
            moveEnemyTank(-1, 0);
        },
        bottom: function () {
            moveEnemyTank(1, 0);
        },
        topLeft: function () {
            moveEnemyTank(-1, -1);
        },
        bottomLeft: function () {
            moveEnemyTank(1, -1);
        },
        topRight: function () {
            moveEnemyTank(-1, 1);
        },
        bottomRight: function () {
            moveEnemyTank(1, 1);
        }

    };

    var random = utils.getRandomIntFromInterval(0, Object.keys(sides).length - 1);

    //взяли рэндомно свойство с функцией в нём
    var arr = Object.keys(sides)[random];

    //и вызвали эту функцию
    sides[arr]();
};

//вспомогательная функция для _createModelOfThisShotController
var colorToDamaged = function () {

    view.removeCssClassFromAllCells(_cells, CSSCLASSFOR_ENEMY_TANK);

    //view.removeCssClass(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSSCLASSFOR_ENEMY_TANK);
    view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSSCLASSFOR_ENEMY_TANK_DAMAGED, 2000);

    var temporary_i = tanksArmy.enemyTank.i;
    var temporary_j = tanksArmy.enemyTank.j;
    setTimeout(function () {
        view.addAndRemoveCssClassInTime(_cells[temporary_i][temporary_j].dom, CSS_Classses_Changed.fade, 3000);
    }, 500);
};

//вспомогательная функция для _createModelOfThisShotController
var isTargetedWell = function () {
    // если танк-враг на одном ряду с нашим, то пункт поражения

    // у нас есть переменная directionOfOurTank, определяющая состояние направления выстрела (например, вниз-это CSSCLASSFOR_TO_BOTTOM)

    // если танк на одной горизонтальной линии с врагом  ourTank.i === enemyTank.i
    // и направление выстрела направо  directionOfOurTank === CSSCLASSFOR_TO_RIGHT
    // и наш танк левее вражеского ourTank.j < enemyTank.j
    // то выстрел вправо shotDirection = "right"  состояния попадания modelDataOfShot.shotHitOrOut = "hit"  точка попадания по горизонтали bullet.finalPosition_J = enemyTank.j
    // и по вертикали пуля не смещается: _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;

    if (tanksArmy.ourTank.i === tanksArmy.enemyTank.i && modelData.directionOfOurTank === CSSCLASSFOR_TO_RIGHT && tanksArmy.ourTank.j < tanksArmy.enemyTank.j) {
        modelDataOfShot.shotDirection = "right";
        // то есть по горизонтальной координате неизменно пуля пойдет
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I = _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_I;

        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J = tanksArmy.enemyTank.j;

        view.consoleLog("!цель захвачена! удар по столбцу: ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);
        // console.log("цель захвачена! удар по столбцу:");
        // console.log(_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);
        modelDataOfShot.shotHitOrOut = "hit";

        controller.pauseGame();

        setTimeout(function () {
            modelDataOfShot.shotHitOrOut = "out";
            controller.startGame();
        }, 2000);
    }

    // если танк НЕ на одной горизонтальной линии с врагом  ourTank.i !== enemyTank.i
    // и направление выстрела направо  directionOfOurTank === CSSCLASSFOR_TO_RIGHT
    if (tanksArmy.ourTank.i !== tanksArmy.enemyTank.i && modelData.directionOfOurTank === CSSCLASSFOR_TO_RIGHT) {
        modelDataOfShot.shotDirection = "right";

        //тут горизонтально он стреляет,  задаем finalPosition_I (он был null)
        // то есть по горизонтальной координате неизменно пуля пойдет
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I = _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_I;
        //по умолчанию он выстрелит до края поля
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J = _CELL_SIZE - 1;

        modelDataOfShot.shotHitOrOut = "out";
    }

    // если танк НЕ на одной горизонтальной линии с врагом  ourTank.i !== enemyTank.i
    // и направление выстрела влево  directionOfOurTank === CSSCLASSFOR_TO_LEFT
    if (tanksArmy.ourTank.i !== tanksArmy.enemyTank.i && modelData.directionOfOurTank === CSSCLASSFOR_TO_LEFT) {
        modelDataOfShot.shotDirection = "left";

        //тут горизонтально он стреляет,  задаем finalPosition_I (он был null)
        // то есть по горизонтальной координате неизменно пуля пойдет
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I = _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_I;
        //по умолчанию он выстрелит до края поля
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J = 0;

        modelDataOfShot.shotHitOrOut = "out";
    }

    // если танк на одной горизонтальной линии с врагом  ourTank.i === enemyTank.i
    // и направление выстрела налево  directionOfOurTank === CSSCLASSFOR_TO_LEFT
    // и наш танк левее вражеского ourTank.j < enemyTank.j
    // то выстрел вправо shotDirection = "right"  состояния попадания shotHitOrOut = "hit"  точка попадания по горизонтали bullet.finalPosition_J = enemyTank.j
    // и по вертикали пуля не смещается: _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;

    if (tanksArmy.ourTank.i === tanksArmy.enemyTank.i && modelData.directionOfOurTank === CSSCLASSFOR_TO_LEFT && tanksArmy.ourTank.j > tanksArmy.enemyTank.j) {
        modelDataOfShot.shotDirection = "left";
        // то есть по горизонтальной координате неизменно пуля пойдет
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I = _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_I;

        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J = tanksArmy.enemyTank.j;

        view.consoleLog("!цель захвачена! удар по столбцу: ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);

        // console.log("цель захвачена! удар по столбцу:");
        // console.log(_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);
        modelDataOfShot.shotHitOrOut = "hit";

        controller.pauseGame();

        setTimeout(function () {
            modelDataOfShot.shotHitOrOut = "out";
            controller.startGame();
        }, 2000);
    }

    // если танк на одной вертикальной линии с врагом  ourTank.j === enemyTank.j
    // и направление выстрела вниз  directionOfOurTank === CSSCLASSFOR_TO_BOTTOM
    // и наш танк выше вражеского ourTank.i < enemyTank.i
    // то выстрел вправо shotDirection = "bottom"  состояния попадания shotHitOrOut = "hit"  точка попадания по горизонтали bullet.finalPosition_I = enemyTank.i
    // и по вертикали пуля не смещается: _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;

    if (tanksArmy.ourTank.j === tanksArmy.enemyTank.j && modelData.directionOfOurTank === CSSCLASSFOR_TO_BOTTOM && tanksArmy.ourTank.i < tanksArmy.enemyTank.i) {
        modelDataOfShot.shotDirection = "bottom";
        // то есть по вертикальной координате неизменно пуля пойдет
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J = _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_J;

        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I = tanksArmy.enemyTank.i;

        view.consoleLog("!цель захвачена! удар по столбцу: ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);

        // console.log("цель захвачена! удар по столбцу:");
        // console.log(_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);
        modelDataOfShot.shotHitOrOut = "hit";

        controller.pauseGame();

        setTimeout(function () {
            modelDataOfShot.shotHitOrOut = "hit";
            controller.startGame();
        }, 2000);
    }

    // если танк не на одной вертикальной линии с врагом  ourTank.j !== enemyTank.j
    // и направление выстрела вниз  directionOfOurTank === CSSCLASSFOR_TO_BOTTOM
    // и наш танк выше вражеского ourTank.i < enemyTank.i
    // то выстрел вправо shotDirection = "bottom"  состояния попадания shotHitOrOut = "hit"  точка попадания по горизонтали bullet.finalPosition_I = enemyTank.i
    // и по вертикали пуля не смещается: _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;

    if (tanksArmy.ourTank.j !== tanksArmy.enemyTank.j && modelData.directionOfOurTank === CSSCLASSFOR_TO_BOTTOM) {
        modelDataOfShot.shotDirection = "bottom";
        // то есть по вертикальной координате неизменно пуля пойдет
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J = _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_J;

        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I = _CELL_SIZE - 1;

        view.consoleLog("!цель захвачена! удар по столбцу: ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);

        // console.log("цель захвачена! удар по столбцу:");
        // console.log(_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);
        modelDataOfShot.shotHitOrOut = "out";
    }

    // если танк на одной вертикальной линии с врагом  ourTank.j === enemyTank.j
    // и направление выстрела вверх  directionOfOurTank === CSSCLASSFOR_TO_TOP
    // и наш танк ниже вражеского ourTank.i > enemyTank.i
    // то выстрел вверх shotDirection = "top"  состояния попадания shotHitOrOut = "hit"  точка попадания по горизонтали bullet.finalPosition_I = enemyTank.i
    // и по вертикали пуля не смещается: _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;

    if (tanksArmy.ourTank.j === tanksArmy.enemyTank.j && modelData.directionOfOurTank === CSSCLASSFOR_TO_TOP && tanksArmy.ourTank.i > tanksArmy.enemyTank.i) {
        modelDataOfShot.shotDirection = "top";
        // то есть по вертикальной координате неизменно пуля пойдет
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J = _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_J;

        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I = tanksArmy.enemyTank.i;

        view.consoleLog("!цель захвачена! удар по столбцу: ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);

        // console.log("цель захвачена! удар по столбцу:");
        // console.log(_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);
        modelDataOfShot.shotHitOrOut = "hit";

        controller.pauseGame();

        setTimeout(function () {
            modelDataOfShot.shotHitOrOut = "hit";
            controller.startGame();
        }, 2000);
    }

    // если танк не на одной вертикальной линии с врагом  ourTank.j !== enemyTank.j
    // и направление выстрела вверх  directionOfOurTank === CSSCLASSFOR_TO_TOP
    // то выстрел вверх shotDirection = "top"  состояния попадания shotHitOrOut = "hit"  точка попадания по горизонтали bullet.finalPosition_I = enemyTank.i
    // и по вертикали пуля не смещается: _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;

    if (tanksArmy.ourTank.j !== tanksArmy.enemyTank.j && modelData.directionOfOurTank === CSSCLASSFOR_TO_TOP) {
        modelDataOfShot.shotDirection = "top";
        // то есть по вертикальной координате неизменно пуля пойдет
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J = _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_J;

        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I = 0;

        view.consoleLog("цель захвачена! удар по столбцу: ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);

        // console.log("цель захвачена! удар по столбцу:");
        // console.log(_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);
        modelDataOfShot.shotHitOrOut = "out";
    }
};

//вспомогательная функция для _createModelOfThisShotController
//потом вынести в блок view
var drawBulletTrajectory1 = function (distanceOfShot, element1, positionFrom, finalSpot) {

    // view.consoleLog("distanceOfShot: ", distanceOfShot);
    // view.consoleLog("positionFrom: ", positionFrom);
    // view.consoleLog("finalSpot: ", finalSpot);


    var bulletElement = _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.domBullet;

    //отдаем в view-модель для показа потем добавления css-класса
    view.setCssClass(bulletElement, CSS_Classses_Changed.forVisibleBullet);

    //bulletElement.className = CSS_Classses_Changed.forVisibleBullet;


    modelDataOfShot.start1 = Date.now();

    clearInterval(modelDataOfShot.handleGun1);

    var clearSettingsOfGun = function () {
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I = null;
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J = null;

        // вместо element1.style.left =0+ 'px';
        // вместо element1.style.top =0+ 'px';
        //  функция view.toZero обнуляет element1.style.left и element1.style.right
        view.toZero(element1);
    };

    modelDataOfShot.handleGun1 = setInterval(function () {

        var timePassed1 = Date.now() - modelDataOfShot.start1;
        //выносим отрисовку полета пули в модуль представления (например, метод view.toright)
        if (modelDataOfShot.shotDirection === "right") {
            view.toright(element1, timePassed1);
        }
        if (modelDataOfShot.shotDirection === "left") {
            view.toleft(element1, timePassed1);
        }
        if (modelDataOfShot.shotDirection === "bottom") {
            view.tobottom(element1, timePassed1);
        }
        if (modelDataOfShot.shotDirection === "top") {
            view.totop(element1, timePassed1);
        }

        if (timePassed1 / 2 >= finalSpot && modelDataOfShot.shotDirection === "right") {
            view.consoleLog("долетел!");
            clearInterval(modelDataOfShot.handleGun1); // конец через столько-то секунд
            finalSpot = null;
            positionFrom = null;
            distanceOfShot = null;
            view.setCssClass(element1, CSS_Classses_Changed.forBullet);
            //element1.className = CSS_Classses_Changed.forBullet; // то есть невидимый
            var targetCell = _cells[_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I][_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J];

            if (modelDataOfShot.shotHitOrOut === "hit") {
                colorToDamaged();

                modelFunctions.minusHealth(tanksArmy.enemyTank);
                view.consoleLog("здоровье tanksArmy.enemyTank = ", tanksArmy.enemyTank.health);

                view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.moveRight, 1000);
                view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forMovingBackground, 1000);

                if (_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j + 1]) {
                    view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j + 1].dom, CSS_Classses_Changed.forHiddenOutline, 1000);
                }

                generateNewPositionForNewTank();
            }

            //эта  функция принимает dom-элемент, сss-класс и время, которое этот сss-класс висит на элементе
            // используем её для случаев "показался и исчез через секунду" (в данном случае взрыв)
            view.addAndRemoveCssClassInTime(targetCell.dom, CSS_Classses_Changed.forExplosion, 300);

            clearSettingsOfGun();
        }

        if (timePassed1 / 2 >= finalSpot && modelDataOfShot.shotDirection === "left") {

            clearInterval(modelDataOfShot.handleGun1); // конец через столько-то секунд
            finalSpot = null;
            positionFrom = null;
            distanceOfShot = null;

            view.setCssClass(element1, CSS_Classses_Changed.forBullet);
            //element1.className = CSS_Classses_Changed.forBullet; // то есть невидимый

            var targetCell2 = _cells[_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I][_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J];
            view.consoleLog("_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I : ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I);
            view.consoleLog("_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J : ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);

            if (modelDataOfShot.shotHitOrOut === "hit") {
                colorToDamaged();

                modelFunctions.minusHealth(tanksArmy.enemyTank);
                view.consoleLog("здоровье tanksArmy.enemyTank = ", tanksArmy.enemyTank.health);
                view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.moveLeft, 1000);
                view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forMovingBackground, 1000);

                if (_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j - 1]) {
                    view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j - 1].dom, CSS_Classses_Changed.forHiddenOutline, 1000);
                }

                generateNewPositionForNewTank();
            }

            //эта  функция принимает dom-элемент, сss-класс и время, которое этот сss-класс висит на элементе
            // используем её для случаев "показался и исчез через секунду" (в данном случае взрыв)
            view.addAndRemoveCssClassInTime(targetCell2.dom, CSS_Classses_Changed.forExplosion, 300);

            //  view.addCssClass (targetCell2.dom, 'red');
            // // targetCell2.dom.classList.add('red');
            //  setTimeout(function () {
            //      targetCell2.dom.classList.remove('red');
            //  }, 1000);

            clearSettingsOfGun();
        }

        if (timePassed1 / 2 >= finalSpot && modelDataOfShot.shotDirection === "top") {

            clearInterval(modelDataOfShot.handleGun1); // конец через столько-то секунд
            finalSpot = null;
            positionFrom = null;
            distanceOfShot = null;

            view.setCssClass(element1, CSS_Classses_Changed.forBullet);

            //element1.className = CSS_Classses_Changed.forBullet; // то есть невидимый
            var targetCell3 = _cells[_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I][_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J];
            view.consoleLog("_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I : ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I);
            view.consoleLog("_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J : ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);

            if (modelDataOfShot.shotHitOrOut === "hit") {
                colorToDamaged();

                modelFunctions.minusHealth(tanksArmy.enemyTank);
                view.consoleLog("здоровье tanksArmy.enemyTank = ", tanksArmy.enemyTank.health);
                view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.moveTop, 1000);
                view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forMovingBackground, 1000);

                if (_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.i - 1]) {
                    view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i - 1][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forHiddenOutline, 1000);
                }

                generateNewPositionForNewTank();
            }

            //эта  функция принимает dom-элемент, сss-класс и время, которое этот сss-класс висит на элементе
            // используем её для случаев "показался и исчез через секунду" (в данном случае взрыв)
            view.addAndRemoveCssClassInTime(targetCell3.dom, CSS_Classses_Changed.forExplosion, 300);

            //targetCell3.dom.classList.add('red');
            // setTimeout(function () {
            //     targetCell3.dom.classList.remove('red');
            // }, 1000);

            clearSettingsOfGun();
        }
        if (timePassed1 / 2 >= finalSpot && modelDataOfShot.shotDirection === "bottom") {

            clearInterval(modelDataOfShot.handleGun1); // конец через столько-то секунд
            finalSpot = null;
            positionFrom = null;
            distanceOfShot = null;

            view.setCssClass(element1, CSS_Classses_Changed.forBullet);

            // element1.className = CSS_Classses_Changed.forBullet; // то есть невидимый


            var targetCell4 = _cells[_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I][_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J];
            view.consoleLog("_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I : ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I);
            view.consoleLog("_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J : ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);

            if (modelDataOfShot.shotHitOrOut === "hit") {
                colorToDamaged();

                modelFunctions.minusHealth(tanksArmy.enemyTank);
                view.consoleLog("здоровье tanksArmy.enemyTank = ", tanksArmy.enemyTank.health);
                view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.moveBottom, 1000);
                view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forMovingBackground, 1000);
                if (_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.i + 1]) {
                    view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i + 1][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forHiddenOutline, 1000);
                }

                generateNewPositionForNewTank();
            }

            //эта  функция принимает dom-элемент, сss-класс и время, которое этот сss-класс висит на элементе
            // используем её для случаев "показался и исчез через секунду" (в данном случае взрыв)
            view.addAndRemoveCssClassInTime(targetCell4.dom, CSS_Classses_Changed.forExplosion, 300);

            //  view.addCssClass (targetCell4.dom, 'red');
            // // targetCell4.dom.classList.add('red');
            //  setTimeout(function () {
            //      targetCell4.dom.classList.remove('red');
            //  }, 1000);

            clearSettingsOfGun();
        }
    }, 20);
};

//
var _createModelOfThisShotController = function () {

    if (!modelDataOfShot.shotState) {
        view.consoleLog("танк может стрелять 1 раз в 1 секунду");
        return;
    }

    //ищем танк врага
    isTargetedWell(); // присвоит shotHitOrOut = "out" если мимо и shotHitOrOut = "hit" если в цель
    // присвоит  shotDirection  направление выстрела, например, "left";

    view.addAndRemoveCssClassInTime(_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].dom, CSS_Classses_Changed.swingEffectBullet, 900);

    view.consoleLog("наносим удар по клетке с  координатами (i / j): ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I, " / ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);

    var element1 = _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.domBullet;

    // вместо element1.style.left = 15 + 'px';
    view.leftStyleSet(element1, 15);

    // function getCssProperty(elem, property) {
    //     return parseFloat(window.getComputedStyle(elem, null).getPropertyValue(property));
    // }


    if (modelData.directionOfOurTank === CSSCLASSFOR_TO_RIGHT) {
        var distanceOfShot = (_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J - _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_J) * 20;
        var positionFrom = utils.getCssProperty(element1, "left");
        var finalSpot = positionFrom + distanceOfShot;
    }

    if (modelData.directionOfOurTank === CSSCLASSFOR_TO_LEFT) {
        distanceOfShot = (_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_J - _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J) * 20;
        positionFrom = utils.getCssProperty(element1, "left");
        finalSpot = distanceOfShot - positionFrom;
    }

    if (modelData.directionOfOurTank === CSSCLASSFOR_TO_TOP) {

        distanceOfShot = (_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_I - _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I) * 20;
        positionFrom = utils.getCssProperty(element1, "top");
        finalSpot = distanceOfShot - positionFrom;
    }

    if (modelData.directionOfOurTank === CSSCLASSFOR_TO_BOTTOM) {

        distanceOfShot = (_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I - _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_I) * 20;
        positionFrom = utils.getCssProperty(element1, "top");
        finalSpot = distanceOfShot - positionFrom;
    }

    //вот тут на 1 секунду приостанавливаем возможность выстрела
    modelDataOfShot.shotState = false;

    setTimeout(function () {
        modelDataOfShot.shotState = true;
    }, 1000);

    drawBulletTrajectory1(distanceOfShot, element1, positionFrom, finalSpot);
};

//вот этот экспортируемый объект controller будет в методах содержать экспортируемые методы контроллера
let controller = {};

controller.init = function (container) {

    //рисуем поле, сначала приняли контейнер или задали свой, если не был передан в вызове
    if (typeof container === 'undefined') {
        var container = document.body;
        view.consoleLog("Обратите внимание вы не передали контейнер и поле будет document.body");
    }

    _createDataModelOfField(_CELL_SIZE, _CELL_SIZE);

    //отдает для отображения во view-модуль dom-контейнер и данные модели _cells (данные модели
    // получены из модуля model.js модели, т.е. данные модели приходят на отрисовку через посредничество контроллера)
    view.renderField(container, _cells, infoPanelText, CSS_Classses_Changed.forWrapper, CSS_Classses_Changed.forInfoPanel, ID_Changed.forWrapper, ID_Changed.forInfoPanel);

    modelFunctions.createTanksByConstructor(utils.getRandomIntFromInterval, _CELL_SIZE);
    controllerFor_showTankFirstTime(tanksArmy.ourTank, CSSCLASSFOR_OUR_TANK);
    controllerFor_showTankFirstTime(tanksArmy.enemyTank, CSSCLASSFOR_ENEMY_TANK);
};

var handlePressKey = function (e) {

    if (!modelData.gameState) {
        view.consoleLog("Так, танк может двигаться 1 раз в секунду");
        return;
    }

    if (e.keyCode === 38) {
        this.move("top");
    } else if (e.keyCode === 37) {
        this.move("left");
    } else if (e.keyCode === 40) {
        this.move("bottom");
    } else if (e.keyCode === 39) {
        this.move("right");
    } else if (e.keyCode === 65) {
        this.move("topleft");
    } else if (e.keyCode === 83) {
        this.move("topright");
    } else if (e.keyCode === 90) {
        this.move("bottomleft");
    } else if (e.keyCode === 88) {
        this.move("bottomright");
    } else if (e.keyCode === 32) {
        this.shot();
    }
}.bind(controller);

//этой функцией задаем текст включателя навешивания обработчика события
controller.setEventListener = function () {
    document.addEventListener("keydown", handlePressKey);
};

controller.startGame = function () {

    //включаем тут обработчик нажатия клавиш, чтоб не включать из файла index.js
    this.setEventListener();

    modelData.gameState = true;
    modelData.start = Date.now(); //  взяли время старта функции startGame
    view.consoleLog("Игра в конкретном сеансе стартовала в  ", new Date(modelData.start).toString().slice(16, 24));

    clearInterval(modelData.handle); // на всякий случай отменили этот же setInterval, если запущен уже

    modelData.handle = setInterval(function () {
        // вычислить сколько времени прошло с начала анимации
        modelData.timePassed = Date.now() - modelData.start;
        //   console.log("В этом сеансе прошло   " + timePassed / 1000 + "секунд");

        if (modelData.timePassed >= modelData.TIMEOFGAME) {
            view.consoleLog("Истекло максимальное время сеанса, оно составляло ", timeOfGame);
            clearInterval(handle); // конец через столько-то секунд
            controller.endGame();
            return;
        }

        _moveToRandomDirection();
    }, 1000);
};

controller.pauseGame = function () {
    modelData.gameState = false;
    modelData.timeOfWholeGame = modelData.timeOfWholeGame + modelData.timePassed / 1000; // плюсуем время конкрктного сеанса до pauseGame()

    view.consoleLog("ПАУЗА. До паузы в этом сеансе игры прошло   ", modelData.timePassed / 1000, " секунд");
    view.consoleLog("Сейчас общее время игры   ", modelData.timeOfWholeGame, " секунд");
    // добавляем время, которое прошло перед паузой через pauseGame()
    clearInterval(modelData.handle);
    modelData.timePassed = 0; //обнуляем, чтоб второй раз этот сеанс не был посчитан при вызове   endGame() после  вызова pauseGame()
};

controller.endGame = function () {
    view.consoleLog("gameState = ", modelData.gameState);
    modelData.gameState = false;
    modelData.timeOfWholeGame = modelData.timeOfWholeGame + modelData.timePassed / 1000; // плюсуем время конкрктного сеанса до endGame()
    clearInterval(modelData.handle);
    if (modelData.timeOfWholeGame) view.consoleLog("КОНЕЦ ИГРЫ. Игра длилась ", modelData.timeOfWholeGame, " сек.");else if (!modelData.timeOfWholeGame) view.consoleLog("нет данных о длительности игры");
    // start = Date.now();
    modelData.timeOfWholeGame = 0;
    view.consoleLog("конец игры, счетчик времени игры обнулён");
    this.init(document.getElementById("forGameContainer"));
};

controller.move = function (direction) {

    if (!modelData.gameState) {

        view.consoleLog("Опаньки, а танк-то может двигаться 1 раз в секунду");
        return;
    }

    var newRow = 0;
    var newCell = 0;

    var directionOfMove = {
        top: function () {
            //если танк уже смотрит в эту сторону, то идет на клетку вверх
            if (modelData.directionOfOurTank === CSSCLASSFOR_TO_TOP) {
                newRow = -1;
                return;
            }
            //иначе только разворачивается (без движения) в заданную сторону
            modelData.directionOfOurTank = CSSCLASSFOR_TO_TOP;
        },
        bottom: function () {

            //если танк уже смотрит в эту сторону, то идет на клетку вверх
            if (modelData.directionOfOurTank === CSSCLASSFOR_TO_BOTTOM) {
                newRow = 1;
                return;
            }
            modelData.directionOfOurTank = CSSCLASSFOR_TO_BOTTOM;
        },
        left: function () {

            //если танк уже смотрит в эту сторону, то идет на клетку вверх
            if (modelData.directionOfOurTank === CSSCLASSFOR_TO_LEFT) {
                newCell = -1;
                return;
            }
            //иначе только разворачивается (без движения) в заданную сторону
            modelData.directionOfOurTank = CSSCLASSFOR_TO_LEFT;
        },
        right: function () {

            //если танк уже смотрит в эту сторону, то идет на клетку вверх
            if (modelData.directionOfOurTank === CSSCLASSFOR_TO_RIGHT) {
                newCell = 1;
                return;
            }
            //иначе только разворачивается (без движения) в заданную сторону
            modelData.directionOfOurTank = CSSCLASSFOR_TO_RIGHT;
        },
        topleft: function () {
            newRow = -1;
            newCell = -1;
            modelData.directionOfOurTank = CSSCLASSFOR_TO_TOP;
        },
        topright: function () {
            newRow = -1;
            newCell = 1;
            modelData.directionOfOurTank = CSSCLASSFOR_TO_TOP;
        },
        bottomleft: function () {
            newRow = 1;
            newCell = -1;
            modelData.directionOfOurTank = CSSCLASSFOR_TO_BOTTOM;
        },
        bottomright: function () {
            newRow = 1;
            newCell = 1;
            modelData.directionOfOurTank = CSSCLASSFOR_TO_BOTTOM;
        }

    };

    directionOfMove[direction]();

    //не даём выехать за пределы поля
    if (tanksArmy.ourTank.i + newRow > _CELL_SIZE - 1) {
        view.consoleLog("край поля!");
        return;
    }
    if (tanksArmy.ourTank.j + newCell > _CELL_SIZE - 1) {
        view.consoleLog("край поля!");
        return;
    }
    if (tanksArmy.ourTank.i + newRow < 0) {
        view.consoleLog("край поля!");
        return;
    }
    if (tanksArmy.ourTank.j + newCell < 0) {
        view.consoleLog("край поля!");
        return;
    }

    //срабатывание прицела, если возможен выстрел по горизонтали
    if (isOnTheSameGorizontalLine(tanksArmy.ourTank, tanksArmy.enemyTank, newRow)) {
        view.consoleLog("на одной горизонтали ввиду нашего передвижения!", tanksArmy.ourTank.i, tanksArmy.ourTank.j);
        view.addAndRemoveCssClassInTime(_cells[tanksArmy.ourTank.i + newRow][tanksArmy.ourTank.j + newCell].bullet.domBullet, CSS_Classses_Changed.forRadar1, 200);
        //эффект на вражеском танке
        view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forTarget, 500);
    }

    //срабатывание прицела если возможен выстрел по вертикали
    if (isOnTheSameVerticalLine(tanksArmy.ourTank, tanksArmy.enemyTank, newCell)) {
        view.consoleLog("на одной вертикали  ввиду нашего передвижения!", tanksArmy.ourTank.i, tanksArmy.ourTank.j);
        view.addAndRemoveCssClassInTime(_cells[tanksArmy.ourTank.i + newRow][tanksArmy.ourTank.j + newCell].bullet.domBullet, CSS_Classses_Changed.forRadar1, 200);
        view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forTarget, 500);
    }

    //!!!!и тут, если var newRow = 0;  var newCell = 0; только разворот произойдет через новое значение CSSCLASSFOR_OUR_TANK
    _controllerFor_showResultOfMoving(tanksArmy.ourTank, newRow, newCell, CSSCLASSFOR_OUR_TANK);

    //и еще очищаем появляющееся на 1 сек. изображение радара на случай, если в эту секунду танк успел уйти
    // view.removeCssClass(_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.domBullet, CSS_Classses_Changed.forRadar);


    //вот тут на 1 секунду приостанавливаем возможность передвигать танк
    modelData.gameState = false;

    setTimeout(function () {
        modelData.gameState = true;
    }, 1000);

    //в модели обновляем данные
    // tanksArmy.ourTank.i = tanksArmy.ourTank.i + newRow;
    // tanksArmy.ourTank.j = tanksArmy.ourTank.j + newCell;
    modelFunctions.renewModelTanksPositions(newRow, newCell);
};

controller.shot = function () {
    _createModelOfThisShotController();
};

//console.log("88888888");
controller.init(document.getElementById("forGameContainer")); //создаём поле, передавая html-контейнер
controller.startGame();
//controller.pauseGame();
