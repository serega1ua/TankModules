import  {view}  from "./view.js";
import  {utils}  from "./utils.js";
import {_CELL_SIZE, CSSCLASSFOR_OUR_TANK, CSSCLASSFOR_TO_TOP, CSSCLASSFOR_TO_BOTTOM, CSSCLASSFOR_TO_LEFT, CSSCLASSFOR_TO_RIGHT, CSSCLASSFOR_ENEMY_TANK, CSSCLASSFOR_ENEMY_TANK_DAMAGED} from "./consts.js";
import {modelData, _cells, infoPanelText, CSS_Classses_Changed, ID_Changed, tanksArmy, modelDataOfShot} from "./model.js";

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
    view.consoleLog(this.name, " have been shotted ")
};






var controllerFor_showTankFirstTime = function (kindOfTank, classOfTank) {
    //контроллер взял из модели ТАНКОВ данные о местоположении танка:
    var i = kindOfTank.i;
    var j = kindOfTank.j;

    //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ:
    var element = _cells[i][j].dom;

    //отдал для отображения данные двух моделей:
    view.showTank(element, classOfTank);

    view.consoleLog("направление выстрела: ", modelData.directionOfOurTank);

};



var createTanksByConstructor = function  () {
    tanksArmy.ourTank = new MakeTank(utils.getRandomIntFromInterval(0, _CELL_SIZE - 1), utils.getRandomIntFromInterval(0, _CELL_SIZE - 1), "ally");
    tanksArmy.enemyTank = new MakeTank(utils.getRandomIntFromInterval(1, _CELL_SIZE - 1), utils.getRandomIntFromInterval(1, _CELL_SIZE - 1), "enemy");
    view.consoleLog("создали конструктором наш танк:");
    view.consoleDir(tanksArmy.ourTank);
    view.consoleLog("создали конструктором чужой танк:");
    view.consoleDir(tanksArmy.enemyTank);
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

    view.consoleLog("вот массив с моделью поля:");
    view.consoleDir(_cells);
};


// контроллер может двигать любой танк, созданный конструктором, используя для отображения импортированный из view объект
var _controllerFor_showResultOfMoving = function (kindOfTank, newRow, newCell, classOfTank) {
    //контроллер взял из модели ТАНКОВ данные о местоположении танка для удаления:
    var i = kindOfTank.i;
    var j = kindOfTank.j;

    //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ (для удаления из неё танка):
    var elementForDeleting = _cells[i][j].dom;

    view.deleteTank(elementForDeleting, classOfTank);
    if (kindOfTank===tanksArmy.ourTank) { view.clearTankDirection(elementForDeleting, CSSCLASSFOR_TO_RIGHT, CSSCLASSFOR_TO_TOP, CSSCLASSFOR_TO_BOTTOM, CSSCLASSFOR_TO_LEFT);}

    //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ (для вставки в неё танка), newRow и newCell- это дельта сдвига:
    var elementForNewShowing = _cells[i + newRow][j + newCell].dom;
    //отдал для отображения данные двух моделей
    view.showTank(elementForNewShowing, classOfTank, modelData.directionOfOurTank);
    //(и из модели о направлении танка directionOfOurTank взял направление):
    if (kindOfTank===tanksArmy.ourTank) { view.showTankDirection(elementForNewShowing, modelData.directionOfOurTank);
        view.consoleLog("направление выстрела: ", modelData.directionOfOurTank)}

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

    var random = utils.getRandomIntFromInterval(0, Object.keys(sides).length - 1);

    //взяли рэндомно свойство с функцией в нём
    var arr = Object.keys(sides)[random];

    //и вызвали эту функцию
    sides[arr]();


};


//вспомогательная функция для _createModelOfThisShotController
var colorToDamaged = function () {
    view.showTank(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSSCLASSFOR_ENEMY_TANK_DAMAGED)
};

var that=this;
//вспомогательная функция для _createModelOfThisShotController
var isTargetedWell =  function() {    // если танк-враг на одном ряду с нашим, то пункт поражения

    // у нас есть переменная directionOfOurTank, определяющая состояние направления выстрела (например, вниз-это CSSCLASSFOR_TO_BOTTOM)

    // если танк на одной горизонтальной линии с врагом  ourTank.i === enemyTank.i
    // и направление выстрела направо  directionOfOurTank === CSSCLASSFOR_TO_RIGHT
    // и наш танк левее вражеского ourTank.j < enemyTank.j
    // то выстрел вправо shotDirection = "right"  состояния попадания modelDataOfShot.shotHitOrOut = "hit"  точка попадания по горизонтали bullet.finalPosition_J = enemyTank.j
    // и по вертикали пуля не смещается: _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;

    if (tanksArmy.ourTank.i === tanksArmy.enemyTank.i && modelData.directionOfOurTank === CSSCLASSFOR_TO_RIGHT  && tanksArmy.ourTank.j < tanksArmy.enemyTank.j) {
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
        }, 3000);
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

    if (tanksArmy.ourTank.i === tanksArmy.enemyTank.i && modelData.directionOfOurTank === CSSCLASSFOR_TO_LEFT  && tanksArmy.ourTank.j > tanksArmy.enemyTank.j) {
        modelDataOfShot.shotDirection = "left";
        // то есть по горизонтальной координате неизменно пуля пойдет
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I = _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_I;

        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J = tanksArmy.enemyTank.j;

        view.consoleLog("!цель захвачена! удар по столбцу: ",_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);

        // console.log("цель захвачена! удар по столбцу:");
        // console.log(_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);
        modelDataOfShot.shotHitOrOut = "hit";


        controller.pauseGame();

        setTimeout(function () {
            modelDataOfShot.shotHitOrOut = "out";
            controller.startGame();
        }, 3000);
    }



    // если танк на одной вертикальной линии с врагом  ourTank.j === enemyTank.j
    // и направление выстрела вниз  directionOfOurTank === CSSCLASSFOR_TO_BOTTOM
    // и наш танк выше вражеского ourTank.i < enemyTank.i
    // то выстрел вправо shotDirection = "bottom"  состояния попадания shotHitOrOut = "hit"  точка попадания по горизонтали bullet.finalPosition_I = enemyTank.i
    // и по вертикали пуля не смещается: _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;

    if (tanksArmy.ourTank.j === tanksArmy.enemyTank.j && modelData.directionOfOurTank === CSSCLASSFOR_TO_BOTTOM  && tanksArmy.ourTank.i < tanksArmy.enemyTank.i) {
        modelDataOfShot.shotDirection = "bottom";
        // то есть по вертикальной координате неизменно пуля пойдет
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J = _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_J;

        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I = tanksArmy.enemyTank.i;


        view.consoleLog("!цель захвачена! удар по столбцу: ",_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);

        // console.log("цель захвачена! удар по столбцу:");
        // console.log(_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);
        modelDataOfShot.shotHitOrOut = "hit";

        controller.pauseGame();

        setTimeout(function () {
            modelDataOfShot.shotHitOrOut = "hit";
            controller.startGame();
        }, 3000);
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

        view.consoleLog("!цель захвачена! удар по столбцу: ",_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);

        // console.log("цель захвачена! удар по столбцу:");
        // console.log(_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);
        modelDataOfShot.shotHitOrOut = "out";

    }




    // если танк на одной вертикальной линии с врагом  ourTank.j === enemyTank.j
    // и направление выстрела вверх  directionOfOurTank === CSSCLASSFOR_TO_TOP
    // и наш танк ниже вражеского ourTank.i > enemyTank.i
    // то выстрел вверх shotDirection = "top"  состояния попадания shotHitOrOut = "hit"  точка попадания по горизонтали bullet.finalPosition_I = enemyTank.i
    // и по вертикали пуля не смещается: _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;

    if (tanksArmy.ourTank.j === tanksArmy.enemyTank.j && modelData.directionOfOurTank === CSSCLASSFOR_TO_TOP  && tanksArmy.ourTank.i > tanksArmy.enemyTank.i) {
        modelDataOfShot.shotDirection = "top";
        // то есть по вертикальной координате неизменно пуля пойдет
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J = _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_J;

        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I = tanksArmy.enemyTank.i;

        view.consoleLog("!цель захвачена! удар по столбцу: ",_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);

        // console.log("цель захвачена! удар по столбцу:");
        // console.log(_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);
        modelDataOfShot.shotHitOrOut = "hit";

        controller.pauseGame();

        setTimeout(function () {
            modelDataOfShot.shotHitOrOut = "hit";
            controller.startGame();
        }, 3000);
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

        view.consoleLog("!цель захвачена! удар по столбцу: ",_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);

        // console.log("цель захвачена! удар по столбцу:");
        // console.log(_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);
        modelDataOfShot.shotHitOrOut = "out";

    }


} ;

//вспомогательная функция для _createModelOfThisShotController
//потом вынести в блок view
var drawBulletTrajectory1 = function (distanceOfShot, element1, positionFrom, finalSpot) {

    view.consoleLog ("distanceOfShot: ", distanceOfShot);
     view.consoleLog ("positionFrom: ", positionFrom);
     view.consoleLog ("finalSpot: ", finalSpot);




    var bulletElement = _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.domBullet;
    bulletElement.className = "shotMark displayAsBlock";

    modelDataOfShot.start1 = Date.now();

    clearInterval(modelDataOfShot.handleGun1);


    var clearSettingsOfGun = function () {
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I = null;
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J= null;
        element1.style.left =0+ 'px';
        element1.style.top =0+ 'px';
    };



    modelDataOfShot.handleGun1 = setInterval(function () {

        var timePassed1 = Date.now() - modelDataOfShot.start1;

        if(modelDataOfShot.shotDirection === "right") {element1.style.left = (timePassed1) / 2 + 'px';}
        if(modelDataOfShot.shotDirection === "left") {element1.style.left = "-" +(timePassed1) / 2 + 'px';}
        if(modelDataOfShot.shotDirection === "bottom"){element1.style.top =  (timePassed1) / 2 + 'px';}
        if(modelDataOfShot.shotDirection === "top"){element1.style.top = "-"+(timePassed1) / 2 + 'px';}


        if (((timePassed1) / 2) >= finalSpot && modelDataOfShot.shotDirection === "right") {
            view.consoleLog("долетел!");
            clearInterval(modelDataOfShot.handleGun1); // конец через столько-то секунд
            finalSpot = null;
            positionFrom = null;
            distanceOfShot = null;
            element1.className = "shotMark"; // то есть невидимый
            var targetCell = _cells[_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I][_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J];

            if (  modelDataOfShot.shotHitOrOut === "hit"){  colorToDamaged();}

            targetCell.dom.classList.add('red');
            setTimeout(function () {
                targetCell.dom.classList.remove('red');
            }, 1000);

            clearSettingsOfGun();

        }

        if (((timePassed1) / 2) >= finalSpot && modelDataOfShot.shotDirection === "left") {

            clearInterval(modelDataOfShot.handleGun1); // конец через столько-то секунд
            finalSpot = null;
            positionFrom = null;
            distanceOfShot = null;
            element1.className = "shotMark"; // то есть невидимый
            var targetCell2 = _cells[_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I][_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J];
            view.consoleLog("_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I : ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I);
            view.consoleLog("_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J : ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);


            if (  modelDataOfShot.shotHitOrOut === "hit"){  colorToDamaged();}

            targetCell2.dom.classList.add('red');
            setTimeout(function () {
                targetCell2.dom.classList.remove('red');
            }, 1000);

            clearSettingsOfGun();
        }

        if (((timePassed1) / 2) >= finalSpot && modelDataOfShot.shotDirection === "top") {


            clearInterval(modelDataOfShot.handleGun1); // конец через столько-то секунд
            finalSpot = null;
            positionFrom = null;
            distanceOfShot = null;
            element1.className = "shotMark"; // то есть невидимый
            var targetCell3 = _cells[_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I][_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J];
            view.consoleLog("_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I : ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I);
            view.consoleLog("_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J : ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);


            if (  modelDataOfShot.shotHitOrOut === "hit"){  colorToDamaged();}

            targetCell3.dom.classList.add('red');
            setTimeout(function () {
                targetCell3.dom.classList.remove('red');
            }, 1000);

            clearSettingsOfGun();

        }
        if (((timePassed1) / 2) >= finalSpot && modelDataOfShot.shotDirection === "bottom") {



            clearInterval(modelDataOfShot.handleGun1); // конец через столько-то секунд
            finalSpot = null;
            positionFrom = null;
            distanceOfShot = null;
            element1.className = "shotMark"; // то есть невидимый
            var targetCell4 = _cells[_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I][_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J];
            view.consoleLog("_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I : ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I);
            view.consoleLog("_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J : ", _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J);


            if (  modelDataOfShot.shotHitOrOut === "hit"){  colorToDamaged();}

            targetCell4.dom.classList.add('red');
            setTimeout(function () {
                targetCell4.dom.classList.remove('red');
            }, 1000);

            clearSettingsOfGun();
        }



    }, 20);

};


//
var _createModelOfThisShotController = function () {

    if (!modelDataOfShot.shotState){
        view.consoleLog("танк может стрелять 1 раз в 1 секунду");
        return;}

    //ищем танк врага
    isTargetedWell();    // присвоит shotHitOrOut = "out" если мимо и shotHitOrOut = "hit" если в цель
    // присвоит  shotDirection  направление выстрела, например, "left";


    view.consoleLog("наносим удар по клетке с  координатами (i / j): ",
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I, " / ",
        _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J );




    var element1 = _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.domBullet;
    element1.style.left = 15 + 'px';

    // function getCssProperty(elem, property) {
    //     return parseFloat(window.getComputedStyle(elem, null).getPropertyValue(property));
    // }


    if (modelData.directionOfOurTank === CSSCLASSFOR_TO_RIGHT){
        var distanceOfShot = (_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J - _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_J) * 20;
        var positionFrom = utils.getCssProperty(element1, "left");
        var finalSpot = positionFrom + distanceOfShot;
    }

    if (modelData.directionOfOurTank === CSSCLASSFOR_TO_LEFT){
        distanceOfShot = (_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_J - _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_J) * 20;
        positionFrom = utils.getCssProperty(element1, "left");
        finalSpot = distanceOfShot - positionFrom;
    }

    if (modelData.directionOfOurTank === CSSCLASSFOR_TO_TOP){

        distanceOfShot = (_cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.startPosition_I - _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.finalPosition_I) * 20;
        positionFrom = utils.getCssProperty(element1, "top");
        finalSpot = distanceOfShot - positionFrom;
    }

    if (modelData.directionOfOurTank === CSSCLASSFOR_TO_BOTTOM){

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


        controller.init = function (contianer) {


            //рисуем поле, сначала приняли контейнер или задали свой, если не был передан в вызове
            if (typeof contianer === 'undefined') {
                var container = document.body;
                view.consoleLog("Обратите внимание вы не передали контейнер и поле будет document.body");
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






var handlePressKey = (function (e) {

    if (!modelData.gameState) {  view.consoleLog("Так, танк может двигаться 1 раз в секунду"); return;}

    if (e.keyCode === 38) {
        this.move("top");
    } else if (e.keyCode === 37) {
        this.move("left");
    } else if (e.keyCode === 40) {
        this.move("bottom");
    } else if (e.keyCode === 39) {
        this.move("right");
    }
    else if (e.keyCode === 65) {
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
}).bind(controller);





//этой функцией задаем текст включателя навешивания обработчика события
controller.setEventListener = function  (){document.addEventListener("keydown",  handlePressKey);} ;

controller.startGame = function () {

//включаем тут обработчик нажатия клавиш, чтоб не включать из файла index.js
    this.setEventListener();


    modelData.gameState = true;
    modelData.start = Date.now();//  взяли время старта функции startGame
    view.consoleLog("Игра в конкретном сеансе стартовала в  ", new Date(modelData.start).toString().slice(16, 24));

    clearInterval(modelData.handle); // на всякий случай отменили этот же setInterval, если запущен уже

    var that = this;

    //setInterval нигде не объявлялся ранее, т.е. он - метод Window и потому по умолчанию у него в скобках вызова this=Window
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
    modelData.timeOfWholeGame = modelData.timeOfWholeGame + (modelData.timePassed / 1000); // плюсуем время конкрктного сеанса до pauseGame()

    view.consoleLog("ПАУЗА. До паузы в этом сеансе игры прошло   ", modelData.timePassed / 1000,  " секунд");
    view.consoleLog("Сейчас общее время игры   ", modelData.timeOfWholeGame, " секунд");
    // добавляем время, которое прошло перед паузой через pauseGame()
    clearInterval(modelData.handle);
    modelData.timePassed = 0; //обнуляем, чтоб второй раз этот сеанс не был посчитан при вызове   endGame() после  вызова pauseGame()
};


controller.endGame = function () {
    view.consoleLog("gameState = ", modelData.gameState);
    modelData.gameState = false;
    modelData.timeOfWholeGame = modelData.timeOfWholeGame + (modelData.timePassed / 1000); // плюсуем время конкрктного сеанса до endGame()
    clearInterval(modelData.handle);
    if (modelData.timeOfWholeGame) view.consoleLog("КОНЕЦ ИГРЫ. Игра длилась ", modelData.timeOfWholeGame, " сек.");
    else if (!modelData.timeOfWholeGame) view.consoleLog("нет данных о длительности игры");
    // start = Date.now();
    modelData.timeOfWholeGame = 0;
    view.consoleLog("конец игры, счетчик времени игры обнулён");
    this.init(document.getElementById("forGameContainer"));
};




controller.move = function (direction) {

                if (!modelData.gameState) {

                     view.consoleLog("Вау, танк-то может двигаться 1 раз в секунду");
                    return;}

                var newRow = 0;
                var newCell = 0;

                var directionOfMove = {
                    top: function () {
                        //если танк уже смотрит в эту сторону, то идет на клетку вверх
                        if(modelData.directionOfOurTank === CSSCLASSFOR_TO_TOP){
                            newRow = -1;
                            return;
                        }
                        //иначе только разворачивается (без движения) в заданную сторону
                        modelData.directionOfOurTank = CSSCLASSFOR_TO_TOP;

                    },
                    bottom: function () {

                        //если танк уже смотрит в эту сторону, то идет на клетку вверх
                        if(modelData.directionOfOurTank === CSSCLASSFOR_TO_BOTTOM){
                            newRow = 1;
                            return;
                        }
                        modelData.directionOfOurTank = CSSCLASSFOR_TO_BOTTOM;

                    },
                    left: function () {


                        //если танк уже смотрит в эту сторону, то идет на клетку вверх
                        if(modelData.directionOfOurTank === CSSCLASSFOR_TO_LEFT){
                            newCell = -1;
                            return;
                        }
                        //иначе только разворачивается (без движения) в заданную сторону
                        modelData.directionOfOurTank = CSSCLASSFOR_TO_LEFT;

                    },
                    right: function () {

                        //если танк уже смотрит в эту сторону, то идет на клетку вверх
                        if(modelData.directionOfOurTank === CSSCLASSFOR_TO_RIGHT){
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
                    },

                };


                directionOfMove[direction]();


                //не даём выехать за пределы поля
                if ((tanksArmy.ourTank.i + newRow) > (_CELL_SIZE - 1)) {
                    view.consoleLog("край поля!");
                    return;
                }
                if ((tanksArmy.ourTank.j + newCell) > (_CELL_SIZE - 1)) {
                    view.consoleLog("край поля!");
                    return;
                }
                if ((tanksArmy.ourTank.i + newRow) < 0) {
                    view.consoleLog("край поля!");
                    return;
                }
                if ((tanksArmy.ourTank.j + newCell) < 0) {
                    view.consoleLog("край поля!");
                    return;
                }

            //!!!!и тут, если var newRow = 0;  var newCell = 0; только разворот произойдет через новое значение CSSCLASSFOR_OUR_TANK
                _controllerFor_showResultOfMoving(tanksArmy.ourTank, newRow, newCell, CSSCLASSFOR_OUR_TANK);

            //вот тут на 1 секунду приостанавливаем возможность передвигать танк
    modelData.gameState = false;

                setTimeout(function () {
                    modelData.gameState = true;
                }, 1000);

            //в модели обновляем данные
    tanksArmy.ourTank.i = tanksArmy.ourTank.i + newRow;
    tanksArmy.ourTank.j = tanksArmy.ourTank.j + newCell;


            };



controller.shot = function () {

    _createModelOfThisShotController();

};


export {controller};



