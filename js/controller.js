import  {view}  from "./view.js";
import  {_getRandomIntFromInterval}  from "./utils.js";
import {_CELL_SIZE, CSSCLASSFOR_OUR_TANK, CSSCLASSFOR_TO_TOP, CSSCLASSFOR_TO_BOTTOM, CSSCLASSFOR_TO_LEFT, CSSCLASSFOR_TO_RIGHT, CSSCLASSFOR_ENEMY_TANK, CSSCLASSFOR_ENEMY_TANK_DAMAGED} from "./consts.js";
import {directionOfOurTank, modelData, _cells, infoPanelText, CSS_Classses_Changed, ID_Changed, tanksArmy} from "./model.js";

// я должен из модели получить переменные для  ourTank  и enemyTank,
// но если я их оттуда импортирую, то получаю при попытке поместить в них контруктором MakeTank в строке 51 TypeError: "ourTank" is read-only
//это как-то связано со strict-mode? возможно, импортированную переменную нельзя перезаписать новым объектом в strict-mode?
//пока их определил тут, хотя их место - в модели (но помещать в них конструктором объект интерпритатор позволяет только НЕимпортированные если)
// "непрямое создание глобального объекта почти всегда является ошибкой в strict-mode"
// var ourTank = null; //TypeError: "ourTank" is read-only
// var enemyTank  = null;

//это конструктор для создания танка
var MakeTank = function (i, j, enemyOrAlly) {
    this.i = i;
    this.j = j;
    this.name = enemyOrAlly;
    this.health = 100;
};

MakeTank.prototype.shotByGun = function () {
    console.log(this.name + " have been shotted ")
};






var controllerFor_showTankFirstTime = function (kindOfTank, classOfTank) {
    //контроллер взял из модели ТАНКОВ данные о местоположении танка:
    var i = kindOfTank.i;
    var j = kindOfTank.j;

    //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ:
    var element = _cells[i][j].dom;

    //отдал для отображения данные двух моделей:
    view.showTank(element, classOfTank);

    console.log("направление выстрела: " +directionOfOurTank);

};



var createTanksByConstructor = function  () {
    tanksArmy.ourTank = new MakeTank(_getRandomIntFromInterval(0, _CELL_SIZE - 1), _getRandomIntFromInterval(0, _CELL_SIZE - 1), "ally");
    tanksArmy.enemyTank = new MakeTank(_getRandomIntFromInterval(1, _CELL_SIZE - 1), _getRandomIntFromInterval(1, _CELL_SIZE - 1), "enemy");
    console.log("создали конструктором наш танк:");
    console.dir(tanksArmy.ourTank);
    console.log("создали конструктором чужой танк:");
    console.dir(tanksArmy.enemyTank);
};






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
            dom: view.createElement(i, j,  CSS_Classses_Changed.forInsideCell,  CSS_Classses_Changed.forFirstInRowInsideCell),
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

    console.dir(_cells);
};


//===> В МОДУЛЬ Controller
// контроллер может двигать любой танк, созданный конструктором, используя для отображения импортированный из view объект
var _controllerFor_showResultOfMoving = function (kindOfTank, newRow, newCell, classOfTank) {
    //контроллер взял из модели ТАНКОВ данные о местоположении танка для удаления:
    var i = kindOfTank.i;
    var j = kindOfTank.j;

    //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ (для удаления из неё танка):
    var elementForDeleting = _cells[i][j].dom;

    view.deleteTank(elementForDeleting, classOfTank);
    if (kindOfTank===tanksArmy.ourTank) { view.clearTankDirection(elementForDeleting);}

    //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ (для вставки в неё танка), newRow и newCell- это дельта сдвига:
    var elementForNewShowing = _cells[i + newRow][j + newCell].dom;
    //отдал для отображения данные двух моделей
    view.showTank(elementForNewShowing, classOfTank, directionOfOurTank);
    //(и из модели о направлении танка directionOfOurTank взял направление):
    if (kindOfTank===tanksArmy.ourTank) { view.showTankDirection(elementForNewShowing, directionOfOurTank);
        console.log("направление выстрела: " +directionOfOurTank)}

};





var moveEnemyTank = function (newRow, newCell) {

    //в 4-х if ниже не даём выехать за пределы поляи "отталкиваем" его от прилипания к краю поля
    if ((tanksArmy.enemyTank.i + newRow) > (_CELL_SIZE - 1)) {
        newRow = newRow - 2;
    }
    if ((tanksArmy.enemyTank.j + newCell) > (_CELL_SIZE - 1)) {
        newCell = newCell - 2;
    }
    if ((tanksArmy.enemyTank.i + newRow) < 0) {
        newRow = newRow + 2;
    }
    if ((tanksArmy.enemyTank.j + newCell) < 0) {
        newCell = newCell + 2;
    }



    _controllerFor_showResultOfMoving(tanksArmy.enemyTank, newRow, newCell, CSSCLASSFOR_ENEMY_TANK);

    //и после отображения в модели данных указываем новое местоположение (т.е. контроллер обновляет данные в модели)
    tanksArmy.enemyTank.i = tanksArmy.enemyTank.i + newRow;
    tanksArmy.enemyTank.j = tanksArmy.enemyTank.j + newCell;
};






var _moveToRandomDirection = function () {

    var sides = {
        left: function () {
            moveEnemyTank(0, -1)
        },
        right: function () {
            moveEnemyTank(0, 1)
        },
        top: function () {
            moveEnemyTank(-1, 0)
        },
        bottom: function () {
            moveEnemyTank(1, 0)
        },
        topLeft: function () {
            moveEnemyTank(-1, -1)
        },
        bottomLeft: function () {
            moveEnemyTank(1, -1)
        },
        topRight: function () {
            moveEnemyTank(-1, 1)
        },
        bottomRight: function () {
            moveEnemyTank(1, 1)
        },

    };

    var random = _getRandomIntFromInterval(0, Object.keys(sides).length - 1);

    //взяли рэндомно свойство с функцией в нём
    var arr = Object.keys(sides)[random];

    //и вызвали эту функцию
    sides[arr]();


};



//вот этот экспортируемый объект controller будет в методах содержать экспортируемые методы контроллера
let controller = {};


        controller.init = function (contianer) {


            //рисуем поле, сначала приняли контейнер или задали свой, если не был передан в вызове
            if (typeof contianer === 'undefined') {
                var container = document.body;
                console.warn("Обратите внимание вы не передали контейнер и поле будет document.body");
            }


            _createDataModelOfField(_CELL_SIZE, _CELL_SIZE);

            //отдает для отображения во view-модуль dom-контейнер и данные модели _cells (данные модели
            // получены из модуля model.js модели, т.е. данные модели приходят на отрисовку через посредничество контроллера)
            view.renderField(contianer,
                _cells,
                infoPanelText,
                CSS_Classses_Changed.forWrapper,
                CSS_Classses_Changed.forInfoPanel,
                ID_Changed.forWrapper,
                ID_Changed.forInfoPanel
            );


            createTanksByConstructor ();
            controllerFor_showTankFirstTime(tanksArmy.ourTank, CSSCLASSFOR_OUR_TANK);
            controllerFor_showTankFirstTime(tanksArmy.enemyTank, CSSCLASSFOR_ENEMY_TANK);
        };




controller.startGame = function () {

    modelData.gameState = true;
    modelData.start = Date.now();//  взяли время старта функции startGame
    console.log("Игра в конкретном сеансе стартовала в  " + new Date(modelData.start).toString().slice(16, 24));

    clearInterval(modelData.handle); // на всякий случай отменили этот же setInterval, если запущен уже

    var that = this;

    //setInterval нигде не объявлялся ранее, т.е. он - метод Window и потому по умолчанию у него в скобках вызова this=Window
    modelData.handle = setInterval(function () {
        // вычислить сколько времени прошло с начала анимации
        modelData.timePassed = Date.now() - modelData.start;
        //   console.log("В этом сеансе прошло   " + timePassed / 1000 + "секунд");

        if (modelData.timePassed >= modelData.TIMEOFGAME) {
            console.log("Истекло максимальное время сеанса, оно составляло " + timeOfGame);
            clearInterval(handle); // конец через столько-то секунд
           // that.endGame();
            return;
        }


         _moveToRandomDirection();
        console.log("сделан посекундный шаг танка");

    }, 1000);
};


export {controller};
