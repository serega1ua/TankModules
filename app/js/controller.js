//импортируем из других модулей объекты и переменные
//после обработки в gulp можем объдинить в один js-файла
//в разных модулях отображение поддерживает пока что только последний FireFox (там флаг надо включить для поддержки)
import  {view}  from "./view.js";
import  {viewMovingModule}  from "./viewMovingModule.js";
import  {utils}  from "./utils.js";
import {
    _CELL_SIZE,
    CSSCLASSFOR_OUR_TANK,
    CSSCLASSFOR_TO_TOP,
    CSSCLASSFOR_TO_BOTTOM,
    CSSCLASSFOR_TO_LEFT,
    CSSCLASSFOR_TO_RIGHT,
    CSSCLASSFOR_ENEMY_TANK,
    CSSCLASSFOR_ENEMY_TANK_DAMAGED
} from "./consts.js";
import {
    modelData,
    _cells,
    infoPanelText,
    CSS_Classses_Changed,
    ID_Changed,
    tanksArmy,
    modelDataOfShot,
    modelFunctions
} from "./model.js";


var controllerFor_showTankFirstTime = function (kindOfTank, /* принимаем tanksArmy.ourTank или tanksArmy.enemyTank или tanksArmy.locatorTank, созданные modelFunctions.createTanksByConstructor*/
                                                classOfTank  /* это css-класс для клетки с танком */) {

    //контроллер взял из модели ТАНКОВ данные о местоположении танка:
    var i = kindOfTank.i;
    var j = kindOfTank.j;

    //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ:
    var element = _cells[i][j].dom;

    //отдал для отображения данные двух моделей. В тертьем аргументе отдает   tanksArmy.enemyTank.ElementByCSS или tanksArmy.locatorTank.ElementByCSS    
    view.showTank(element, classOfTank, kindOfTank.ElementByCSS);

    //в modelData.directionOfOurTank храним направление башни нашего танка, у него возможные значения "ToTop" "ToBottom" "ToLeft" "ToRight":

};


//  тут берем из импортированных данных model.js массив-модель поля _cells, наполняем _cells данными 
//(можно эту функцию вынести из модуля controller и только вызывать её здесь)
//То есть у нас есть массив-модель данных о происходящем на поле и (отдельно) есть отображение этой модели
// и создаем новые данные о нем, сохраняя в этот же массив в модуле  model.js модели
//из модуля view контроллер использует функцию view.createElement, создающую dom-элементы
// (т.е. модуль view сообщается с моделью через контроллер)


var _createDataModelOfField = function (_rowsNumber, _cellsNumber, _cells,
                                        CSS_Classses_ChangedforInsideCell, CSS_Classses_ChangedforFirstInRowInsideCell,
                                        ID_ChangedforBullet, CSS_Classses_ChangedforBullet) {
    var _rowsNumberFinal = _rowsNumber || 20;
    var _cellsNumberFinal = _cellsNumber || 20;

    for (let i = 0; i < _rowsNumberFinal; i++) {
        _cells[i] = [];
        for (let j = 0; j < _cellsNumberFinal; j++) _cells[i].push({
            /* в каждую ячейку двумерного массива пушим объект, в котором
             два DOM-объекта: пуля и танк, изначально hidden */
            value: null,
            //создание dom-элемента осуществим функцией из модуля view
            dom: view.createElement(
                i,
                j,
                CSS_Classses_ChangedforInsideCell /* это "inside-cell" */,
                CSS_Classses_ChangedforFirstInRowInsideCell /* это"clear-both inside-cell" */
            ),
            i: i,
            j: j,
            //есть пуля в модели данных, тут её стартовое положение и DOM-элемент(пока что не отображённый)
            bullet: {
                domBullet: view.createElementOfBullet(i, j, ID_ChangedforBullet, CSS_Classses_ChangedforBullet),
                startPosition_I: i,
                startPosition_J: j,
                finalPosition_I: null,
                finalPosition_J: null,
                inProcess: null
            }
        });
    }


};


//эта функция обновляет местоположение танка, давая случайное местоположение в поле. 
//Для нашего танка tanksArmy.ourTank она применяется тоже (путем передачи функции в тот модуль), в modelFunctions.createTanksByConstructor механизм генерации случайного местоположения использует эту функцию.
//при первом создании объектов это местоположение генерируется функцией modelFunctions.createTanksByConstructor 
var generateNewPositionForNewTank = function (venicleForRandomPosition /* принимает tanksArmy.enemyTank или tanksArmy.locatorTank*/) {

//в третьем аргументе указываем, сколько значений в полученном массиве нам надо
    var tempArr = viewMovingModule.getRandomIntFromIntervalInArray(0, _CELL_SIZE - 1, 2,
        tanksArmy.ourTank.i, tanksArmy.ourTank.j, tanksArmy.locatorTank.i,
        tanksArmy.locatorTank.j, tanksArmy.enemyTank.i, tanksArmy.enemyTank.j);

    venicleForRandomPosition.i = tempArr[0];
    venicleForRandomPosition.j = tempArr[1];

};


//реализация плавного движения танка (перетаскивание клетки с бэкграндом элемента (например, влево: путем изменения  margin-left: 0px; до -20px в течении 0.3 секунды). 
//Также происходит сокрытие границ клеток, через которые происходит движение.
var realizationOfFlowMoving = function (tank, newRow, newCell, classOfTank, i, j, _cells) {

    /* разворот стоящего на месте танка */
    if (newCell === 0 && newRow === 0) {
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToTurn, 300);
        }
    }

    if (newCell === 1 && newRow === 0) {

        // скрываем границы соседнего элемента, чтоб при переезде танка ему не надо было "подлазить" под линию границы
        if (_cells[i][j + 1]) {
            view.addAndRemoveCssClassInTime(_cells[i][j + 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveRightOneCell, 300);

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToRight, 300);
        }


    }
    if (newCell === 0 && newRow === -1) {

        // скрываем границы соседнего элемента, чтоб при переезде танка ему не надо было "подлазить" под линию границы
        if (_cells[i - 1][j]) {
            view.addAndRemoveCssClassInTime(_cells[i - 1][j].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }


        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveTopOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToTop, 300);
        }
        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);


    }
    if (newCell === 0 && newRow === 1) {


        // скрываем границы соседнего элемента, чтоб при переезде танка ему не надо было "подлазить" под линию границы
        if (_cells[i + 1][j]) {
            view.addAndRemoveCssClassInTime(_cells[i + 1][j].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveBottomOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToBottom, 300);
        }
        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);


    }
    if (newCell === -1 && newRow === 0) {

        if (_cells[i][j - 1]) {
            view.addAndRemoveCssClassInTime(_cells[i][j - 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveLeftOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToLeft, 300);
        }
        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);


    }

    if (newCell === -1 && newRow === -1) {


        if (_cells[i - 1][j - 1]) {
            view.addAndRemoveCssClassInTime(_cells[i - 1][j - 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveTopLeftOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToTop, 300);
        }
        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);


    }


    if (newCell === 1 && newRow === -1) {

        if (_cells[i - 1][j + 1]) {
            view.addAndRemoveCssClassInTime(_cells[i - 1][j + 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveTopRightOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToTop, 300);
        }
        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);


    }


    if (newCell === 1 && newRow === 1) {

        if (_cells[i + 1][j + 1]) {
            view.addAndRemoveCssClassInTime(_cells[i + 1][j + 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveBottomRightOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToBottom, 300);
        }
        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);


    }


    if (newCell === -1 && newRow === 1) {

        if (_cells[i + 1][j - 1]) {
            view.addAndRemoveCssClassInTime(_cells[i + 1][j - 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveBottomLeftOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToBottom, 300);
        }
        view.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);


    }


};


// контроллер может двигать любой танк, созданный конструктором, используя для отображения импортированный из view объект
var _controllerFor_showResultOfMoving = function (kindOfTank, newRow, newCell, classOfTank
                                                  /* принимает tanksArmy.enemyTank || tanksArmy.ourTank, newRow, newCell, CSSCLASSFOR_ENEMY_TANK || CSSCLASSFOR_OUR_TANK*/) {
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
        //убираем с _cells[i][j].dom эффект swing (если танк качается и хочет пойти, то он перестаёт качаться)
        view.deleteTank(_cells[i][j].dom, CSS_Classses_Changed.swingEffect);
        view.deleteTank(elementBulletForDeleting, CSS_Classses_Changed.forRadar1);

    }


    if (kindOfTank === tanksArmy.ourTank) {
        setTimeout(function () {
            view.clearTankDirection(elementForDeleting, CSSCLASSFOR_TO_RIGHT, CSSCLASSFOR_TO_TOP, CSSCLASSFOR_TO_BOTTOM, CSSCLASSFOR_TO_LEFT)
        }, 300);
    }

    //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ (для вставки в неё танка), newRow и newCell- это дельта сдвига:
    var elementForNewShowing = _cells[i + newRow][j + newCell].dom;

    //отдал для отображения данные двух моделей
    if (kindOfTank === tanksArmy.enemyTank) {

        setTimeout(function () {
            view.showTank(elementForNewShowing, classOfTank, tanksArmy.enemyTank.ElementByCSS);
        }, 300);
    }

    //(и из модели о направлении танка directionOfOurTank взял направление):
    if (kindOfTank === tanksArmy.ourTank) {

        setTimeout(function () {

            view.showTankDirection(elementForNewShowing, modelData.directionOfOurTank);

        }, 300);


    }

};


//функция проверяет, будут ли танки на одной горизонтали после смещения по горизонтали на deltaOfMovingGoriz
var isOnTheSameGorizontalLine = function (tank1, tank2, deltaOfMovingGoriz) {
    if ((tank1.i + deltaOfMovingGoriz) === tank2.i) return true
};

//функция проверяет, будут ли танки на одной вертикали после смещения по вертикали на deltaOfMovingVert
var isOnTheSameVerticalLine = function (tank1, tank2, deltaOfMovingVert) {
    if ((tank1.j + deltaOfMovingVert) === tank2.j) return true
};

//функция проверяет, в соседней или нет (в том числе по диагонали) клетке по значению обоих осей (в данном случае по диагонали имеет значение проверка)
var isNear = function (tank1, tank2, deltaOfMovingGoriz, deltaOfMovingVert) {
    if (( Math.abs((tank1.j + deltaOfMovingVert) - tank2.j) < 2)
        && ( Math.abs((tank1.i + deltaOfMovingGoriz) - tank2.i) < 2)) {
        return true
    }
};


//если ближе количества  клеток modelData.distanceOfShotForEnemy, то вражеский танк поражает излучением
var isShotDistanceBetweenTanks = function (tank1, tank2, deltaOfMoving, lineGorOrVert) {
    if ((lineGorOrVert === "GorizontalLine") &&
        (Math.abs((tank1.j + deltaOfMoving) - tank2.j) < modelData.distanceOfShotForEnemy)) {

        return true;
    }
    if ((lineGorOrVert === "VerticalLine") &&
        (Math.abs((tank1.i + deltaOfMoving) - tank2.i) < modelData.distanceOfShotForEnemy)) {

        return true;
    }
};


//визуальный эффект радара-ударного излучения вертолета
var showRadarEffectOnEnemyVenicle = function () {
    view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forLocator, 1100);
}


//эффекты удара по нашему танку
var showRadarEffect = function (newRowForEnemy,
                                newCellForEnemy,
                                newRowForOur,
                                newCellForOur,
                                timeOfExplosion = 900) {
    var temporaryElement = _cells[tanksArmy.ourTank.i + newRowForOur][tanksArmy.ourTank.j + newCellForOur].dom;
    //эффект на нашем танке от поражения излучением вертолета (дает покачивание)
    view.addAndRemoveCssClassInTime(temporaryElement, CSS_Classses_Changed.swingEffect, 1000);

    view.addAndRemoveExplosion(
        temporaryElement,
        //CSS_Classses_Changed.forExplosionBig, //"explosion"
        modelData.IDforThisExplosion,
        timeOfExplosion, //по умолчанию он timeOfExplosion=900
        modelData.particlesNumberOfExplosionForTank,
        modelData.colorOfExplosionForTank);


    //эффект на вражеском танке
//    view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i + newRowForEnemy][tanksArmy.enemyTank.j + newCellForEnemy].dom, "opacity", 300);

    setTimeout(showRadarEffectOnEnemyVenicle, //Первым аргументом setTimeout может быть ан.ф, код, имя FD или FE
        200);
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

    //это запрет цели наезжать на наш танк при хаотичном её движении, для этого смещение в случае наезда задается как ноль по обеим координатам
// а при следующем смещении она поедет дальше, следующие случайные координаты её передвижения не совпадут/ лишнюю секунду цель простоит на месте тут
    if (isOnTheSameVerticalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newCell)
        && isOnTheSameGorizontalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newRow)) {
        view.consoleLog(modelData.messageEnemyPressedUs/* "цель пыталась наехать  на наш танк, двойная потеря здоровья нашего танка!" */);

        showRadarEffect(0, 0, 0, 0);
        modelFunctions.minusHealth(tanksArmy.ourTank);
        modelFunctions.minusHealth(tanksArmy.ourTank);


        setTimeout(function () {
            view.consoleLog(modelData.messageHealthOur/* "наше здоровье = " */, tanksArmy.ourTank.health);

        }, 1100);


        return;

    }


    if (isOnTheSameVerticalLine(tanksArmy.enemyTank, tanksArmy.locatorTank, newCell)
        && isOnTheSameGorizontalLine(tanksArmy.enemyTank, tanksArmy.locatorTank, newRow)) {
        view.consoleLog(modelData.messageEnemyPressedLocator/* "цель пыталась наехать  на локатор,  потеря здоровья локатора!" */);

        showRadarEffectOnEnemyVenicle();
        modelFunctions.minusHealth(tanksArmy.locatorTank);


        setTimeout(function () {
            view.consoleLog(modelData.messageHealthOfLocator/* "здоровье локатора = " */, tanksArmy.locatorTank.health);

        }, 1100);


        return;

    }


//срабатывание прицела, если возможен выстрел по горизонтали(вследствие движения танка противника)
    if (isOnTheSameGorizontalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newRow)
        && !(isShotDistanceBetweenTanks(tanksArmy.enemyTank, tanksArmy.ourTank, newCell, "GorizontalLine"))) {


        setTimeout(function () {
            view.consoleLog(modelData.messageSameGorizontal/* "на одной горизонтали ввиду передвижения вражеского танка!" */);

        }, 1100);


        view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i + newRow][tanksArmy.enemyTank.j + newCell].dom,
            CSS_Classses_Changed.forTarget, 500);
        //происходит добавление (заранее, до передвижения врага в эту клетку) CSS_Classses_Changed.forTarget (в css это .target:before), это значок прицела

    }

    //срабатывание прицела, если возможен выстрел по вертикали (вследствие движения танка противника)
    if (isOnTheSameVerticalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newCell)
        && !(isShotDistanceBetweenTanks(tanksArmy.enemyTank, tanksArmy.ourTank, newRow, "VerticalLine"))) {


        setTimeout(function () {
            view.consoleLog(modelData.messageSameVertical/* "на одной вертикали  ввиду передвижения вражеского танка!" */);


        }, 1100);

        view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i + newRow][tanksArmy.enemyTank.j + newCell].dom,
            CSS_Classses_Changed.forTarget, 500);
        //происходит добавление (заранее, до передвижения врага в эту клетку) CSS_Classses_Changed.forTarget (в css это .target:before), это значок прицела

    }


//срабатывание поражающего излучения врага, если возможен выстрел по горизонтали. newRow - это будущее смещение по горизонтали
    if (isOnTheSameGorizontalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newRow)
        && isShotDistanceBetweenTanks(tanksArmy.enemyTank, tanksArmy.ourTank, newCell, "GorizontalLine")) {


        setTimeout(function () {
            view.consoleLog(modelData.messageSameGorizontalAndAttack/* "на одной горизонтали и приблизился на расстояние поражения " */ + modelData.distanceOfShotForEnemy);


        }, 1100);


        showRadarEffect(newRow, newCell, 0, 0);
        modelFunctions.minusHealth(tanksArmy.ourTank);


        setTimeout(function () {
            view.consoleLog(modelData.messageHealthOur/* "наше здоровье = " */, tanksArmy.ourTank.health);

        }, 1100);


    }

    //срабатывание поражающего излучения врага, если возможен выстрел по вертикали
    if (isOnTheSameVerticalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newCell)
        && isShotDistanceBetweenTanks(tanksArmy.enemyTank, tanksArmy.ourTank, newRow, "VerticalLine")) {


        setTimeout(function () {
            view.consoleLog(modelData.messageSameVerticalAndAttack/* "враг на одной вертикали и приблизился на расстояние поражения " */ + modelData.distanceOfShotForEnemy);


        }, 1100);


        showRadarEffect(newRow, newCell, 0, 0);
        modelFunctions.minusHealth(tanksArmy.ourTank);

        setTimeout(function () {
            view.consoleLog(modelData.messageHealthOur/* "наше здоровье = " */, tanksArmy.ourTank.health);

        }, 1100);
    }

    //срабатывание поражающего излучения врага, если по диагонали ближе 1 клетки
    if (isNear(tanksArmy.enemyTank, tanksArmy.ourTank, newRow, newCell)) {


        setTimeout(function () {
            view.consoleLog(modelData.messageOnDiagonalAndNear /* "по диагонали приблизился вражина!" */);


        }, 0);

        showRadarEffect(newRow, newCell, 0, 0, 100);// пятый аргумент timeOfExplosion, он факультативный, по умочанию он 900
        modelFunctions.minusHealth(tanksArmy.ourTank);


        setTimeout(function () {
            view.consoleLog(modelData.messageHealthOur/* "наше здоровье = " */, tanksArmy.ourTank.health);

        }, 1100);

    }

    //вызвали ффункцию,которая отобразит через модуль view
    _controllerFor_showResultOfMoving(tanksArmy.enemyTank, newRow, newCell, CSSCLASSFOR_ENEMY_TANK);

    //и после отображения в модели данных указываем новое местоположение в модели (т.е. контроллер обновляет данные в модели)
    modelFunctions.renewModelTanksPositions(tanksArmy.enemyTank, newRow, newCell);
    /* что она делает:
     tanksArmy.enemyTank.i = tanksArmy.enemyTank.i + newRow;
     tanksArmy.enemyTank.j = tanksArmy.enemyTank.j + newCell; */
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


//вспомогательная функция для _createModelOfThisShotController, принимает tanksArmy.enemyTank или tanksArmy.locatorTank
var colorToDamaged = function (aimFromTanksArmy) {

    /*  view.removeCssClassFromAllCells(_cells, CSSCLASSFOR_ENEMY_TANK);
     */

    //вот так взрыв добавляем
    view.addAndRemoveExplosion(_cells[aimFromTanksArmy.i][aimFromTanksArmy.j].dom, modelData.IDforThisExplosion, 1000);

    //вот так удаляем у вертолета излучения радара (он взорвался, ему незачем дальше излучать, особенно если он успеет заново появится после своей гибели)
    view.removeCssClass(_cells[aimFromTanksArmy.i][aimFromTanksArmy.j].dom, CSS_Classses_Changed.forLocator)

    /*  var showRadarEffectOnEnemyVenicle = function () {
     view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forLocator, 1100);
     } */


};

var hideDamaged = function () {

    setTimeout(function () {
        //и надо удалить вертолет, берем из модели его id "helicopter"
        view.removeElementById(ID_Changed.forHelicopter);
    }, 400);

}


//вспомогательная функция для _createModelOfThisShotController
var isTargetedWell = function (ourTank, enemyTank) {    // если танк-враг на одном ряду с нашим, то пункт поражения

    // у нас есть переменная directionOfOurTank, определяющая состояние направления выстрела (например, вниз-это CSSCLASSFOR_TO_BOTTOM)

    // если танк на одной горизонтальной линии с врагом  ourTank.i === enemyTank.i
    // и направление выстрела направо  directionOfOurTank === CSSCLASSFOR_TO_RIGHT
    // и наш танк левее вражеского ourTank.j < enemyTank.j
    // то выстрел вправо shotDirection = "right"  состояния попадания modelDataOfShot.shotHitOrOut = "hit"  точка попадания по горизонтали bullet.finalPosition_J = enemyTank.j
    // и по вертикали пуля не смещается: _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;

    if (ourTank.i === enemyTank.i && modelData.directionOfOurTank === CSSCLASSFOR_TO_RIGHT && ourTank.j < enemyTank.j) {
        modelDataOfShot.shotDirection = "right";
        // то есть по горизонтальной координате неизменно пуля пойдет
        _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;

        _cells[ourTank.i][ourTank.j].bullet.finalPosition_J = enemyTank.j;


        setTimeout(function () {
            view.consoleLog(modelData.messageItsTargeted/* "цель захвачена нашим прицелом! удар по столбцу: " */,
                _cells[ourTank.i][ourTank.j].bullet.finalPosition_J);


        }, 0);


        modelDataOfShot.shotHitOrOut = "hit";

        controller.pauseGame();

        setTimeout(function () {
            modelDataOfShot.shotHitOrOut = "out";
            controller.startGame();
        }, 2000);
    }


    // если танк НЕ на одной горизонтальной линии с врагом  ourTank.i !== enemyTank.i
    // и направление выстрела направо  directionOfOurTank === CSSCLASSFOR_TO_RIGHT
    if (ourTank.i !== enemyTank.i && modelData.directionOfOurTank === CSSCLASSFOR_TO_RIGHT) {
        modelDataOfShot.shotDirection = "right";

        //тут горизонтально он стреляет,  задаем finalPosition_I (он был null)
        // то есть по горизонтальной координате неизменно пуля пойдет
        _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;
        //по умолчанию он выстрелит до края поля
        _cells[ourTank.i][ourTank.j].bullet.finalPosition_J = _CELL_SIZE - 1;

        modelDataOfShot.shotHitOrOut = "out";


    }


    // если танк НЕ на одной горизонтальной линии с врагом  ourTank.i !== enemyTank.i
    // и направление выстрела влево  directionOfOurTank === CSSCLASSFOR_TO_LEFT
    if (ourTank.i !== enemyTank.i && modelData.directionOfOurTank === CSSCLASSFOR_TO_LEFT) {
        modelDataOfShot.shotDirection = "left";

        //тут горизонтально он стреляет,  задаем finalPosition_I (он был null)
        // то есть по горизонтальной координате неизменно пуля пойдет
        _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;
        //по умолчанию он выстрелит до края поля
        _cells[ourTank.i][ourTank.j].bullet.finalPosition_J = 0;

        modelDataOfShot.shotHitOrOut = "out";

    }


    // если танк на одной горизонтальной линии с врагом  ourTank.i === enemyTank.i
    // и направление выстрела налево  directionOfOurTank === CSSCLASSFOR_TO_LEFT
    // и наш танк левее вражеского ourTank.j < enemyTank.j
    // то выстрел вправо shotDirection = "right"  состояния попадания shotHitOrOut = "hit"  точка попадания по горизонтали bullet.finalPosition_J = enemyTank.j
    // и по вертикали пуля не смещается: _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;

    if (ourTank.i === enemyTank.i && modelData.directionOfOurTank === CSSCLASSFOR_TO_LEFT && ourTank.j > enemyTank.j) {
        modelDataOfShot.shotDirection = "left";
        // то есть по горизонтальной координате неизменно пуля пойдет
        _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;

        _cells[ourTank.i][ourTank.j].bullet.finalPosition_J = enemyTank.j;

        view.consoleLog("!цель захвачена! удар по столбцу: ", _cells[ourTank.i][ourTank.j].bullet.finalPosition_J);


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

    if (ourTank.j === enemyTank.j && modelData.directionOfOurTank === CSSCLASSFOR_TO_BOTTOM && ourTank.i < enemyTank.i) {
        modelDataOfShot.shotDirection = "bottom";
        // то есть по вертикальной координате неизменно пуля пойдет
        _cells[ourTank.i][ourTank.j].bullet.finalPosition_J = _cells[ourTank.i][ourTank.j].bullet.startPosition_J;

        _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = enemyTank.i;


        view.consoleLog("!цель захвачена! удар по столбцу: ", _cells[ourTank.i][ourTank.j].bullet.finalPosition_J);


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

    if (ourTank.j !== enemyTank.j && modelData.directionOfOurTank === CSSCLASSFOR_TO_BOTTOM) {
        modelDataOfShot.shotDirection = "bottom";
        // то есть по вертикальной координате неизменно пуля пойдет
        _cells[ourTank.i][ourTank.j].bullet.finalPosition_J = _cells[ourTank.i][ourTank.j].bullet.startPosition_J;

        _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _CELL_SIZE - 1;

        view.consoleLog("!цель захвачена! удар по столбцу: ", _cells[ourTank.i][ourTank.j].bullet.finalPosition_J);


        modelDataOfShot.shotHitOrOut = "out";

    }


    // если танк на одной вертикальной линии с врагом  ourTank.j === enemyTank.j
    // и направление выстрела вверх  directionOfOurTank === CSSCLASSFOR_TO_TOP
    // и наш танк ниже вражеского ourTank.i > enemyTank.i
    // то выстрел вверх shotDirection = "top"  состояния попадания shotHitOrOut = "hit"  точка попадания по горизонтали bullet.finalPosition_I = enemyTank.i
    // и по вертикали пуля не смещается: _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;

    if (ourTank.j === enemyTank.j && modelData.directionOfOurTank === CSSCLASSFOR_TO_TOP && ourTank.i > enemyTank.i) {
        modelDataOfShot.shotDirection = "top";
        // то есть по вертикальной координате неизменно пуля пойдет
        _cells[ourTank.i][ourTank.j].bullet.finalPosition_J = _cells[ourTank.i][ourTank.j].bullet.startPosition_J;

        _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = enemyTank.i;

        view.consoleLog("!цель захвачена! удар по столбцу: ", _cells[ourTank.i][ourTank.j].bullet.finalPosition_J);


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

    if (ourTank.j !== enemyTank.j && modelData.directionOfOurTank === CSSCLASSFOR_TO_TOP) {
        modelDataOfShot.shotDirection = "top";
        // то есть по вертикальной координате неизменно пуля пойдет
        _cells[ourTank.i][ourTank.j].bullet.finalPosition_J = _cells[ourTank.i][ourTank.j].bullet.startPosition_J;

        _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = 0;

        view.consoleLog("цель захвачена! удар по столбцу: ", _cells[ourTank.i][ourTank.j].bullet.finalPosition_J);


        modelDataOfShot.shotHitOrOut = "out";

    }


};


/*  функция  clearSettingsOfGun вспомогательная для drawBulletTrajectory. Что делает: 
 - в МОДЕЛИ данных обнуляет положение конечное пули по горизонтали и вертикали:finalPosition_I и finalPosition_J  (оно было в предыдущем выстреле рассчитано)
 - в представлении через вызов view.toZero обнуляет bulletDOMElement.style.left и bulletDOMElement.style.right (иначе пуля визуально летела бы с места прежнего попадания, хоть бы в модели и были бы обнуленные данные )*/
var clearSettingsOfGun = function (bulletValueInShotController, bulletDOMElement) {
    bulletValueInShotController.finalPosition_I = null;
    bulletValueInShotController.finalPosition_J = null;

    //  функция view.toZero обнуляет bulletDOMElement.style.left и bulletDOMElement.style.right
    view.toZero(bulletDOMElement);
};


//вспомогательная функция для _createModelOfThisShotController, контролирует отрисовку полета, разрыва пули и сброс данных о пули в модели данных
// bulletDOMElement - это _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.domBullet
var drawBulletTrajectory = function (/* distanceOfShot, */ bulletDOMElement, /* positionFrom, */ finalDistanceOfShot, bulletValueInShotController, speedOfBullet) {

//отдаем в view-модель для показа (путем добавления css-класса): происходит добавление класса displayAsBlock, т.е. display: block вместо display: none
    view.setCssClass(bulletDOMElement, CSS_Classses_Changed.forVisibleBullet);

    //bulletElement.className = CSS_Classses_Changed.forVisibleBullet;


    modelDataOfShot.momentOfBulletStart = Date.now();

    //очищаем modelDataOfShot.handleGun1 на случай, если еще идет предыдущий выстрел
    clearInterval(modelDataOfShot.handleGun1);


    modelDataOfShot.handleGun1 = setInterval(function () {

        //это время, что пуля провела в полете, определяем вычетом из нынешнего  времени времени старта пули .momentOfBulletStart
        var timePassedInFlightBullet = Date.now() - modelDataOfShot.momentOfBulletStart;
//выносим отрисовку полета пули в модуль представления (например, метод view.toright)
        /* 	что она делает в блоке view:
         view.toright = function (element1, timePassedInFlightBullet) {
         element1.style.left = (timePassedInFlightBullet) / 2 + 'px'; }; */
        if (modelDataOfShot.shotDirection === "right") {
            view.toright(bulletDOMElement, timePassedInFlightBullet, speedOfBullet)
        }
        if (modelDataOfShot.shotDirection === "left") {
            view.toleft(bulletDOMElement, timePassedInFlightBullet, speedOfBullet)
        }
        if (modelDataOfShot.shotDirection === "bottom") {
            view.tobottom(bulletDOMElement, timePassedInFlightBullet, speedOfBullet)
        }
        if (modelDataOfShot.shotDirection === "top") {
            view.totop(bulletDOMElement, timePassedInFlightBullet, speedOfBullet)
        }

        /* (timePassedInFlightBullet) / 2) - это количество пикселей уже пройденных пулей, так определяет view.toright*/
        /* finalDistanceOfShot - это количество пикселей для пролета, получено умножением количества клеток на 20 (20 - это размер стороны квадрта клетки) */
        //далее 4 блока if (различаются только направлением полета пули: вправо, влеко, вверх, вниз)
        if (((timePassedInFlightBullet) / speedOfBullet) >= finalDistanceOfShot && modelDataOfShot.shotDirection === "right") {
            view.consoleLog("долетел!");
            clearInterval(modelDataOfShot.handleGun1); // конец через столько-то секунд
            /*  finalDistanceOfShot = null;
             positionFrom = null;
             distanceOfShot = null; */
            view.setCssClass(bulletDOMElement, CSS_Classses_Changed.forBullet);
            //bulletDOMElement.className = CSS_Classses_Changed.forBullet; // то есть невидимый
            var targetCell = _cells[bulletValueInShotController.finalPosition_I][bulletValueInShotController.finalPosition_J];

            if (modelDataOfShot.shotHitOrOut === "hit") {
                colorToDamaged(tanksArmy.enemyTank);
                hideDamaged();

                modelFunctions.minusHealth(tanksArmy.enemyTank);
                view.consoleLog(modelData.messageHealthOfEnemy/* "здоровье tanksArmy.enemyTank = " */, tanksArmy.enemyTank.health);

                view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.moveRight, 1000);
                view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forMovingBackground, 1000);

                if (_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j + 1]) {
                    view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j + 1].dom, CSS_Classses_Changed.forHiddenOutline, 1000);
                }

                generateNewPositionForNewTank(tanksArmy.enemyTank);
                clearSettingsOfGun(bulletValueInShotController, bulletDOMElement);
                return;//если уже есть попадание в танк , то к бортику снаряд не летит, потому выходим из функции
            }


            //эта  функция принимает dom-элемент, сss-класс и время, которое этот сss-класс висит на элементе
            // используем её для случаев "показался и исчез через секунду" (в данном случае взрыв)
            // view.addAndRemoveCssClassInTime(targetCell.dom, CSS_Classses_Changed.forExplosion, 300);

            //добавление этого класса отдельной функцией, потому что ею надо еще и удалить созданные при взрыве вложенные элементы
            //принимает характеристики взрыва при ударе   снаряда о бортик, последние два аргумента заменяют значения по умолчанию
            view.addAndRemoveExplosion(targetCell.dom,
                modelData.IDforThisExplosion,
                1000,
                modelData.particlesNumberOfExplosionForBorder,
                modelData.colorOfExplosionForRightBorder);


            clearSettingsOfGun(bulletValueInShotController, bulletDOMElement);

        }

        if (((timePassedInFlightBullet) / speedOfBullet) >= finalDistanceOfShot && modelDataOfShot.shotDirection === "left") {

            clearInterval(modelDataOfShot.handleGun1); // конец через столько-то секунд
            /*    finalDistanceOfShot = null;
             positionFrom = null;
             distanceOfShot = null; */

            view.setCssClass(bulletDOMElement, CSS_Classses_Changed.forBullet);
            //bulletDOMElement.className = CSS_Classses_Changed.forBullet; // то есть невидимый

            var targetCell2 = _cells[bulletValueInShotController.finalPosition_I][bulletValueInShotController.finalPosition_J];


            if (modelDataOfShot.shotHitOrOut === "hit") {
                colorToDamaged(tanksArmy.enemyTank);
                hideDamaged();

                modelFunctions.minusHealth(tanksArmy.enemyTank);
                view.consoleLog(modelData.messageHealthOfEnemy/* "здоровье tanksArmy.enemyTank = " */, tanksArmy.enemyTank.health);
                view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.moveLeft, 1000);
                view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forMovingBackground, 1000);

                if (_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j - 1]) {
                    view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j - 1].dom, CSS_Classses_Changed.forHiddenOutline, 1000);
                }

                generateNewPositionForNewTank(tanksArmy.enemyTank);
                clearSettingsOfGun(bulletValueInShotController, bulletDOMElement);
                return;//если уже есть попадание в танк, то к бортику снаряд не летит, потому выходим из функции

            }


            //эта  функция принимает dom-элемент, сss-класс и время, которое этот сss-класс висит на элементе
            // используем её для случаев "показался и исчез через секунду" (в данном случае взрыв)
            //view.addAndRemoveCssClassInTime(targetCell2.dom, CSS_Classses_Changed.forExplosion, 300);

            //принимает характеристики взрыва при ударе   снаряда о бортик, последние два аргумента заменяют значения по умолчанию
            view.addAndRemoveExplosion(targetCell2.dom, CSS_Classses_Changed.forExplosionBig, 1000, modelData.particlesNumberOfExplosionForBorder, modelData.colorOfExplosionForLeftBorder);
            clearSettingsOfGun(bulletValueInShotController, bulletDOMElement);
        }

        if (((timePassedInFlightBullet) / speedOfBullet) >= finalDistanceOfShot && modelDataOfShot.shotDirection === "top") {


            clearInterval(modelDataOfShot.handleGun1); // конец через столько-то секунд
            /*        finalDistanceOfShot = null;
             positionFrom = null;
             distanceOfShot = null; */

            view.setCssClass(bulletDOMElement, CSS_Classses_Changed.forBullet);

            //bulletDOMElement.className = CSS_Classses_Changed.forBullet; // то есть невидимый
            var targetCell3 = _cells[bulletValueInShotController.finalPosition_I][bulletValueInShotController.finalPosition_J];


            if (modelDataOfShot.shotHitOrOut === "hit") {
                colorToDamaged(tanksArmy.enemyTank);
                hideDamaged();

                modelFunctions.minusHealth(tanksArmy.enemyTank);
                view.consoleLog(modelData.messageHealthOfEnemy/* "здоровье tanksArmy.enemyTank = " */, tanksArmy.enemyTank.health);
                view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.moveTop, 1000);
                view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forMovingBackground, 1000);

                if (_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.i - 1]) {
                    view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i - 1][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forHiddenOutline, 1000);
                }

                generateNewPositionForNewTank(tanksArmy.enemyTank);
                clearSettingsOfGun(bulletValueInShotController, bulletDOMElement);
                return;

            }

            //эта  функция принимает dom-элемент, сss-класс и время, которое этот сss-класс висит на элементе
            // используем её для случаев "показался и исчез через секунду" (в данном случае взрыв)
            // view.addAndRemoveCssClassInTime(targetCell3.dom, CSS_Classses_Changed.forExplosion, 300);

            //принимает характеристики взрыва при ударе   снаряда о бортик, последние два аргумента заменяют значения по умолчанию
            view.addAndRemoveExplosion(targetCell3.dom, CSS_Classses_Changed.forExplosionBig, 1000, modelData.particlesNumberOfExplosionForBorder, modelData.colorOfExplosionForTopBorder);


            clearSettingsOfGun(bulletValueInShotController, bulletDOMElement);

        }

        if (((timePassedInFlightBullet) / speedOfBullet) >= finalDistanceOfShot && modelDataOfShot.shotDirection === "bottom") {


            clearInterval(modelDataOfShot.handleGun1); // конец через столько-то секунд


            view.setCssClass(bulletDOMElement, CSS_Classses_Changed.forBullet);


            var targetCell4 = _cells[bulletValueInShotController.finalPosition_I][bulletValueInShotController.finalPosition_J];


            if (modelDataOfShot.shotHitOrOut === "hit") {
                colorToDamaged(tanksArmy.enemyTank);
                hideDamaged();

                modelFunctions.minusHealth(tanksArmy.enemyTank);
                view.consoleLog(modelData.messageHealthOfEnemy/* "здоровье tanksArmy.enemyTank = " */, tanksArmy.enemyTank.health);
                view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.moveBottom, 1000);
                view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forMovingBackground, 1000);
                if (_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.i + 1]) {
                    view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i + 1][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forHiddenOutline, 1000);
                }

                generateNewPositionForNewTank(tanksArmy.enemyTank);
                clearSettingsOfGun(bulletValueInShotController, bulletDOMElement);
                return; //если уже есть попадание в танк, то к бортику снаряд не летит, потому выходим из функции
            }

            //эта  функция принимает dom-элемент, сss-класс и время, которое этот сss-класс висит на элементе
            // используем её для случаев "показался и исчез через секунду" (в данном случае взрыв)
            // view.addAndRemoveCssClassInTime(targetCell4.dom, CSS_Classses_Changed.forExplosion, 300);


            //принимает характеристики взрыва при ударе   снаряда о бортик, последние два аргумента заменяют значения по умолчанию
            view.addAndRemoveExplosion(targetCell4.dom, CSS_Classses_Changed.forExplosionBig, 1000, modelData.particlesNumberOfExplosionForBorder, modelData.colorOfExplosionForBottomBorder);


            clearSettingsOfGun(bulletValueInShotController, bulletDOMElement);
        }


    }, modelDataOfShot.pictureFrequencyOfBullet);

    /* modelData.pictureFrequencyOfBullet дает частоту показа пули при полете (как часто отрисовываются промежуточные представления в полете пули)
     то есть частота в setInterval */

};


//
var _createModelOfThisShotController = function (ourTank, enemyTank) {

    if (!modelDataOfShot.shotState) {
        view.consoleLog(modelData.messageCanShootOnlyOneTimeInSec/* "танк может стрелять 1 раз в 1 секунду" */);
        return;
    }


    var bulletDOMElementInShotController = _cells[ourTank.i][ourTank.j].bullet.domBullet;
    var bulletValueInShotController = _cells[ourTank.i][ourTank.j].bullet;


    //ищем танк врага
    isTargetedWell(ourTank, enemyTank);    // присвоит shotHitOrOut = "out" если мимо и shotHitOrOut = "hit" если в цель
    // присвоит  shotDirection  направление выстрела, например, "left";

    view.addAndRemoveCssClassInTime(_cells[ourTank.i][ourTank.j].dom, CSS_Classses_Changed.swingEffectBullet, 900);

    view.consoleLog(modelData.messageWhereShoot,
        bulletValueInShotController.finalPosition_I, " / ",
        bulletValueInShotController.finalPosition_J);


    // вместо element1.style.left = 15 + 'px';
    view.leftStyleSet(bulletDOMElementInShotController, 15);


    if (modelData.directionOfOurTank === CSSCLASSFOR_TO_RIGHT) {
        var distanceOfShot = (bulletValueInShotController.finalPosition_J
            - bulletValueInShotController.startPosition_J) * 20;
        var positionFrom = utils.getCssProperty(bulletDOMElementInShotController, "left");
        var finalDistanceOfShot = positionFrom + distanceOfShot;
    }

    if (modelData.directionOfOurTank === CSSCLASSFOR_TO_LEFT) {
        distanceOfShot = (bulletValueInShotController.startPosition_J - bulletValueInShotController.finalPosition_J) * 20;
        positionFrom = utils.getCssProperty(bulletDOMElementInShotController, "left");
        finalDistanceOfShot = distanceOfShot - positionFrom;
    }

    if (modelData.directionOfOurTank === CSSCLASSFOR_TO_TOP) {

        distanceOfShot = (bulletValueInShotController.startPosition_I - bulletValueInShotController.finalPosition_I) * 20;
        positionFrom = utils.getCssProperty(bulletDOMElementInShotController, "top");
        finalDistanceOfShot = distanceOfShot - positionFrom;
    }

    if (modelData.directionOfOurTank === CSSCLASSFOR_TO_BOTTOM) {

        distanceOfShot = (bulletValueInShotController.finalPosition_I - bulletValueInShotController.startPosition_I) * 20;
        positionFrom = utils.getCssProperty(bulletDOMElementInShotController, "top");
        finalDistanceOfShot = distanceOfShot - positionFrom;

    }


    //вот тут на 1 секунду приостанавливаем возможность выстрела
    modelDataOfShot.shotState = false;

    setTimeout(function () {
        modelDataOfShot.shotState = true;
    }, 1000);


    drawBulletTrajectory(/* distanceOfShot,  */bulletDOMElementInShotController, /* positionFrom, */ finalDistanceOfShot, bulletValueInShotController, modelDataOfShot.speedOfBullet);


    setTimeout(function () {

        view.consoleLog(modelData.messageWhereShoot,
            bulletValueInShotController.finalPosition_I, " / ",
            bulletValueInShotController.finalPosition_J);


    }, 0);


};


//вот этот экспортируемый объект controller будет в методах содержать экспортируемые методы контроллера
let controller = {};

//создает поле, объекты транспортных средств
controller.init = function (container) {

    //рисуем поле, сначала приняли контейнер или задали свой, если не был передан в вызове
    if (typeof container === 'undefined') {
        var container = document.body;
        view.consoleLog(modelData.messageHaveNoContainer/* "Обратите внимание вы не передали контейнер и поле будет document.body" */
        );
    }


    view.createDataModelOfField(_CELL_SIZE, _CELL_SIZE, _cells,
        CSS_Classses_Changed.forInsideCell, CSS_Classses_Changed.forFirstInRowInsideCell,
        ID_Changed.forBullet, CSS_Classses_Changed.forBullet/* , view.createElement, view.createElementOfBullet */);


    /* тут мы создаем в модуле model: tanksArmy.ourTank,  tanksArmy.enemyTank,  tanksArmy.locatorTank */
    modelFunctions.createTanksByConstructor(
        viewMovingModule.getRandomIntFromIntervalInArray, /* отдаем функцию из модуля utils */
        _CELL_SIZE /* отдаем размер стороны квадрата поля */
    );


    view.createVenicleGraficByCSS(tanksArmy.locatorTank, modelData.arrayOfArgsForCSSofLocator);
    view.createVenicleGraficByCSS(tanksArmy.enemyTank, modelData.arrayOfArgsForCSSofHelicopter);
    view.createVenicleGraficByCSS(tanksArmy.ourTank, null);
    view.createVenicleGraficByCSS(tanksArmy, modelData.arrayOfArgsForCSSofAdvertsTank);


    //отдает для отображения во view-модуль dom-контейнер и данные модели _cells (данные модели
    // получены из модуля model.js модели, т.е. данные модели приходят на отрисовку через посредничество контроллера)
    view.renderField(container,
        _cells,
        infoPanelText,
        CSS_Classses_Changed.forWrapper,
        CSS_Classses_Changed.forInfoPanel,
        ID_Changed.forWrapper,
        ID_Changed.forInfoPanel,
        tanksArmy.ElementByCSS
    );




    controllerFor_showTankFirstTime(tanksArmy.ourTank, CSSCLASSFOR_OUR_TANK, tanksArmy.ourTank.ElementByCSS /* тут null, так как наш танк рисуем png-картинкой, а не canvas-ом */);
    controllerFor_showTankFirstTime(tanksArmy.enemyTank, CSSCLASSFOR_ENEMY_TANK, tanksArmy.enemyTank.ElementByCSS);
    controllerFor_showTankFirstTime(tanksArmy.locatorTank, CSSCLASSFOR_ENEMY_TANK, tanksArmy.locatorTank.ElementByCSS);


};


var handlePressKey = (function (e) {

    if (!modelData.gameState) {

        view.consoleLog(modelData.messageCanMoveOnlyOneTimeInSec /* "Сейчас gameState == false, потому танк не может двигаться" */);

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
controller.setEventListener = function () {
    document.addEventListener("keydown", handlePressKey);


};


controller.startGame = function () {

//включаем тут обработчик нажатия клавиш, чтоб не включать из файла index.js
    this.setEventListener();


    modelData.gameState = true;
    modelData.start = Date.now();//  взяли время старта функции startGame
    view.consoleLog(modelData.messageWhenStart,
        new Date(modelData.start).toString().slice(16, 24));

    clearInterval(modelData.handle); // на всякий случай отменили этот же setInterval, если запущен уже

    var that = this;

    //setInterval нигде не объявлялся ранее, т.е. он - метод Window и потому по умолчанию у него в скобках вызова this=Window
    modelData.handle = setInterval(function () {
        // вычислить сколько времени прошло с начала анимации
        modelData.timePassed = Date.now() - modelData.start;
        /* view.consoleLog("В этом сеансе прошло   " +  modelData.timePassed / 1000 + "секунд"); */

        if (modelData.timePassed >= modelData.TIMEOFGAME) {
            view.consoleLog(modelData.messagePeriodIsEnded/* "Истекло максимальное время сеанса, оно составляло " */, timeOfGame);
            clearInterval(handle); // конец через столько-то секунд
            controller.endGame();
            return;
        }


        _moveToRandomDirection(tanksArmy.ourTank, tanksArmy.enemyTank);


    }, 1000);

    view.removeElementById(ID_Changed.forAdvertsTank/* "tiny" */);

};


controller.pauseGame = function () {
    modelData.gameState = false;
    modelData.timeOfWholeGame = modelData.timeOfWholeGame + (modelData.timePassed / 1000); // плюсуем время конкрктного сеанса до pauseGame()

    view.consoleLog(modelData.messagePause/* "ПАУЗА. До паузы в этом сеансе игры прошло   " */, modelData.timePassed / 1000, modelData.messageSeconds/* " секунд" */);
    view.consoleLog(modelData.messageTimeOfGame/* "Сейчас общее время игры   " */, modelData.timeOfWholeGame, modelData.messageSeconds /* " секунд" */);
    // добавляем время, которое прошло перед паузой через pauseGame()
    clearInterval(modelData.handle);
    modelData.timePassed = 0; //обнуляем, чтоб второй раз этот сеанс не был посчитан при вызове   endGame() после  вызова pauseGame()

    /* покажем рекламный танк (он много ресурсов памяти кушает, потому показываем только когда не играем) */
    /*  view.showAdverts(tanksArmy.ElementByCSS); */
};


controller.endGame = function () {
    /* view.consoleLog("gameState = ", modelData.gameState); */
    modelData.gameState = false;
    modelData.timeOfWholeGame = modelData.timeOfWholeGame + (modelData.timePassed / 1000); // плюсуем время конкрктного сеанса до endGame()
    clearInterval(modelData.handle);
    if (modelData.timeOfWholeGame) view.consoleLog(modelData.messageEnd /* "КОНЕЦ ИГРЫ. Игра длилась " */, modelData.timeOfWholeGame, " сек.");
    else if (!modelData.timeOfWholeGame) view.consoleLog(modelData.messageNoDataRegardingTimeOfGame/* "нет данных о длительности игры" */);
    // start = Date.now();
    modelData.timeOfWholeGame = 0;
    view.consoleLog(modelData.messageEndAndCounterToZero/* "конец игры, счетчик времени игры обнулён" */);

    /*  this.init(document.getElementById("forGameContainer")); */
    /* покажем рекламный танк (он много ресурсов памяти кушает, потому показываем только когда не играем) */
    view.showAdverts(tanksArmy.ElementByCSS);
};


/* вот движение нашего танка, тут куча if, но в конце функции 
 движение будет инициировано вызовом _controllerFor_showResultOfMoving(tanksArmy.ourTank, newRow, newCell, CSSCLASSFOR_OUR_TANK); */

controller.move = function (direction) {

    if (!modelData.gameState) {

        view.consoleLog(modelData.messageCannotMoveNow/* "Опаньки, а танк-то может двигаться 1 раз в секунду" */);
        return;
    }

    var newRow = 0;
    var newCell = 0;

    //реализация смены направления или хождения танка
    //(если уже смотрит в эту сторону - то ход на 1 клетку, если нет - то разворачивается в сторону хода)
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
        },

    };

//и вот так вызываем конретную функцию (чтоб не строит пачку условий через if)
    directionOfMove[direction]();


    //не даём выехать за пределы поля
    if ((tanksArmy.ourTank.i + newRow) > (_CELL_SIZE - 1)) {
        view.consoleLog(modelData.messageOutOfField); //modelData.messageOutOfField = "край поля!";
        return;
    }
    if ((tanksArmy.ourTank.j + newCell) > (_CELL_SIZE - 1)) {
        view.consoleLog(modelData.messageOutOfField);
        return;
    }
    if ((tanksArmy.ourTank.i + newRow) < 0) {
        view.consoleLog(modelData.messageOutOfField);
        return;
    }
    if ((tanksArmy.ourTank.j + newCell) < 0) {
        view.consoleLog(modelData.messageOutOfField);
        return;
    }


    //если при ходе он давит транспортное средство врага
    if (isOnTheSameVerticalLine(tanksArmy.ourTank, tanksArmy.enemyTank, newCell)
        && isOnTheSameGorizontalLine(tanksArmy.ourTank, tanksArmy.enemyTank, newRow)) {
        view.consoleLog(modelData.messageEnemyCrushed/* "наш танк задавил врага, пятикратная потеря здоровья вертолета и врага, и локатора!" */);

        colorToDamaged(tanksArmy.enemyTank);
        hideDamaged();

        for (var i = 0; i < 5; i++) {
            modelFunctions.minusHealth(tanksArmy.locatorTank);
            modelFunctions.minusHealth(tanksArmy.enemyTank);
        }
        view.consoleLog(
            modelData.messageHealthOfEnemy/* "здоровье tanksArmy.enemyTank = " */,
            tanksArmy.enemyTank.health);

        view.consoleLog(
            modelData.messageHealthOfLocator/* "здоровье tanksArmy.locatorTank = " */,
            tanksArmy.locatorTank.health);
        generateNewPositionForNewTank(tanksArmy.enemyTank);
        modelDataOfShot.shotHitOrOut = "hit";

        controller.pauseGame();
        setTimeout(function () {
            modelDataOfShot.shotHitOrOut = "out";
            controller.startGame();
        }, 2000);


    }

    //если при  ходе он давит локатор
    if (isOnTheSameVerticalLine(tanksArmy.ourTank, tanksArmy.locatorTank, newCell)
        && isOnTheSameGorizontalLine(tanksArmy.ourTank, tanksArmy.locatorTank, newRow)) {

        view.consoleLog(modelData.messageLocatorCrushed/* "наш танк раздавил локатор, двойная потеря здоровья локатора и вертолета!" */);
        colorToDamaged(tanksArmy.locatorTank);
        generateNewPositionForNewTank(tanksArmy.locatorTank);

        //новое местоположение для локатора

        controllerFor_showTankFirstTime(tanksArmy.locatorTank, CSSCLASSFOR_ENEMY_TANK, tanksArmy.locatorTank.ElementByCSS);

        modelFunctions.minusHealth(tanksArmy.enemyTank);
        modelFunctions.minusHealth(tanksArmy.locatorTank);

        view.consoleLog(modelData.messageHealthOfLocator/* "здоровье локатора = " */, tanksArmy.locatorTank.health);
        view.consoleLog(modelData.messageHealthOfEnemy /* "здоровье противника = " */, tanksArmy.enemyTank.health);

        //на .5 секунды приостанавливаем возможность давить его, если уже задавил
        modelData.gameState = false;

        setTimeout(function () {
            modelData.gameState = true;
        }, 500);

        /* если раскомментить return то наш танк будет давить,
         но не наезжать сразу на клетку, на котрой раздавил локатор
         (типа как силы исчерпал на надавливание и только следующим ходом пойдет) */
        // return;

    }


    //если на одной линии с локатором ИЛИ   ближе к локатору чем на 2 клетки по диагонали, то выдаем сообщение о возможности уничтожить
    //и на 2 секунды показываем обеспокоенность локатора тем, что он на линии поражения
    if (isOnTheSameVerticalLine(tanksArmy.ourTank, tanksArmy.locatorTank, newCell)
        || isOnTheSameGorizontalLine(tanksArmy.ourTank, tanksArmy.locatorTank, newRow)
        || isNear(tanksArmy.ourTank, tanksArmy.locatorTank, newRow, newCell)) {

        view.addCssClassByParalellCssClass(
            tanksArmy.locatorTank.ElementByCSS,
            CSS_Classses_Changed.topLocatorDanger /* "top-locator-danger" */,
            CSS_Classses_Changed.topLocator /* ".top-locator" */);

        view.addCssClassByParalellCssClass(tanksArmy.locatorTank.ElementByCSS,
            CSS_Classses_Changed.pipeInLocatorInDanger /* "pipeIn-locator-inDanger" */,
            CSS_Classses_Changed.pipeInLocator /* ".pipeIn-locator" */);

        view.addCssClassByParalellCssClass(
            tanksArmy.locatorTank.ElementByCSS,
            CSS_Classses_Changed.pipeLocatorInDanger /* "pipe-locator-inDanger" */,
            CSS_Classses_Changed.pipeLocator /* ".pipe-locator" */
        );

        view.consoleLog(modelData.messageCanCrushLocator
            /* "Можно раздавить локатор врага, наехав на него! Сейчас наш танк на одной линии с ним." */
        );
    }


    //если не на одной линии с локатором и дальше от локатора более чем на 2 клетки по диагонали
    if (
        !(isOnTheSameVerticalLine(tanksArmy.ourTank, tanksArmy.locatorTank, newCell)) &&
        !(isOnTheSameGorizontalLine(tanksArmy.ourTank, tanksArmy.locatorTank, newRow)) &&
        !(isNear(tanksArmy.ourTank, tanksArmy.locatorTank, newRow, newCell))
    ) {

        //функция view.removeCssClassByParalellCssClass принимает DOM-элемент транспортного средства
        // (например, tanksArmy.locatorTank.ElementByCSS), css класс для удаления в конкретном div этого DOM-элемента (CssClass),
        //css класс по которому найти в элементе конкретный div
        //проще говоря: есть div, в который временно добавлялся класс (например, "top-locator-danger"), мы этот "временный" класс удаляем, опираясь на постоянно существующий у этого div класс (например, ".top-locator")

        view.removeCssClassByParalellCssClass(
            tanksArmy.locatorTank.ElementByCSS,
            CSS_Classses_Changed.topLocatorDanger /* "top-locator-danger" */,
            CSS_Classses_Changed.topLocator /* ".top-locator" */);

        view.removeCssClassByParalellCssClass(
            tanksArmy.locatorTank.ElementByCSS,
            CSS_Classses_Changed.pipeInLocatorInDanger /* "pipeIn-locator-inDanger" */,
            CSS_Classses_Changed.pipeInLocator /* ".pipeIn-locator" */
        );

        view.removeCssClassByParalellCssClass(
            tanksArmy.locatorTank.ElementByCSS,
            CSS_Classses_Changed.pipeLocatorInDanger /* "pipe-locator-inDanger" */,
            CSS_Classses_Changed.pipeLocator /* ".pipe-locator" */);


    }

//срабатывание прицела, если возможен выстрел по горизонтали
    if (isOnTheSameGorizontalLine(tanksArmy.ourTank, tanksArmy.enemyTank, newRow)) {
        view.consoleLog(modelData.messageSameGorizontalByUs/* "на одной горизонтали с врагом ввиду нашего передвижения!" */);
        view.addAndRemoveCssClassInTime(
            _cells[tanksArmy.ourTank.i + newRow][tanksArmy.ourTank.j + newCell].bullet.domBullet,
            CSS_Classses_Changed.forRadar1,
            200);
        //эффект на вражеском танке
        view.addAndRemoveCssClassInTime(
            _cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom,
            CSS_Classses_Changed.forTarget,
            500);
    }

    //срабатывание прицела если возможен выстрел по вертикали
    if (isOnTheSameVerticalLine(tanksArmy.ourTank, tanksArmy.enemyTank, newCell)) {
        view.consoleLog(modelData.messageSameVerticalByUs/* "на одной вертикали с врагом  ввиду нашего передвижения!" */);
        view.addAndRemoveCssClassInTime(_cells[tanksArmy.ourTank.i + newRow][tanksArmy.ourTank.j + newCell].bullet.domBullet, CSS_Classses_Changed.forRadar1, 200);
        view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forTarget, 500);
    }


    //и тут, если var newRow = 0;  var newCell = 0; только разворот произойдет через новое значение CSSCLASSFOR_OUR_TANK
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
    modelFunctions.renewModelTanksPositions(tanksArmy.ourTank, newRow, newCell);
};


controller.shot = function () {
    _createModelOfThisShotController(tanksArmy.ourTank, tanksArmy.enemyTank);
};

controller.init(document.getElementById("forGameContainer"));//создаём поле, передавая html-контейнер
/* controller.startGame(); */
//controller.pauseGame();
var cont = document.getElementById("forGameContainer")

var btn1 = document.getElementById("btn1");
btn1.addEventListener("click", controller.startGame.bind(controller));

/* Внутри обработчика события this ссылается на текущий элемент, то есть на тот, на котором он сработал.
 Потому применяем bind*/

var btn2 = document.getElementById("btn2");
btn2.addEventListener("click", controller.pauseGame.bind(controller));

var btn3 = document.getElementById("btnStop");
btn3.addEventListener("click", controller.endGame.bind(controller));


export {controller};