var modelData={};
modelData.gameState = null;
modelData.start = null; // тут хранить время начала
modelData.handle = null; // через эту глобальную переменную будем останавилвать вот так: clearInterval(handle);
modelData.timePassed = null; //тут будем хранить время, прошедшее ДО паузы, чтоб учитывать в общем времени игру ДО паузы через pauseGame()
modelData.timeOfWholeGame = 0;// тут хранить длительность всей игры с учетом пауз
modelData.TIMEOFGAME = 77000000; //сколько будет работать один сеанс игры
modelData.directionOfOurTank = "ToRight"; //тут будем хранить направление танка (куда смотрит), первое значение "ToRight"
modelData.distanceOfShotForEnemy = 12;

var _cells = []; // в массиве _cells  будет модель "чистых" данных о том, что в клетках
var tanksArmy = {};
tanksArmy.ourTank = null;
tanksArmy.enemyTank  = null;

var infoPanelText = (`<pre> press keys \u2190 \u2191 \u2192 \u2193 for moving to the left, right, top, bottom
     press 'a' for moving to the top-left \u2196
     press 's' for moving to the top-right \u2197
     press 'z' for moving to the bottom-left \u2199
     press 'x' for moving to the bottom-right \u2198
     press 'space' to make a shot</pre>`);

//тут все css-классы, их достаточно изменить в модели и css-файле
var CSS_Classses_Changed = {};
CSS_Classses_Changed.forWrapper = "outside-cell";
CSS_Classses_Changed.forInfoPanel = "info";
CSS_Classses_Changed.forInsideCell ="inside-cell";
CSS_Classses_Changed.forFirstInRowInsideCell = "clear-both inside-cell";
CSS_Classses_Changed.forBullet = "shotMark";
CSS_Classses_Changed.forVisibleBullet = "shotMark displayAsBlock"

CSS_Classses_Changed.forRadar1 ="displayAsBlockAndReady1";
CSS_Classses_Changed.forExplosion ="red";
CSS_Classses_Changed.forLocator ="locator";
CSS_Classses_Changed.forEnemyTankOnRadar ="cellWithEnemyTankOnRadar";
CSS_Classses_Changed.forTarget ="target";
CSS_Classses_Changed.ToTurn = "ToTurn";
CSS_Classses_Changed.forHiddenOutline ="forHiddenOutline";
CSS_Classses_Changed.moveRightOneCell ="moveRightOneCell";
CSS_Classses_Changed.moveTopOneCell ="moveTopOneCell";
CSS_Classses_Changed.moveBottomOneCell ="moveBottomOneCell";
CSS_Classses_Changed.moveLeftOneCell ="moveLeftOneCell";
CSS_Classses_Changed.moveTopLeftOneCell ="moveTopLeftOneCell";
CSS_Classses_Changed.moveTopRightOneCell ="moveTopRightOneCell";
CSS_Classses_Changed.moveBottomRightOneCell ="moveBottomRightOneCell";
CSS_Classses_Changed.moveBottomLeftOneCell ="moveBottomLeftOneCell";
CSS_Classses_Changed.swingEffectBullet ="swing-effect-bullet";
CSS_Classses_Changed.swingEffect ="swing-effect";
CSS_Classses_Changed.fade ="fade";

CSS_Classses_Changed.moveBottom ="moveBottom";
CSS_Classses_Changed.moveTop ="moveTop";
CSS_Classses_Changed.moveLeft ="moveLeft";
CSS_Classses_Changed.moveRight ="moveRight";
CSS_Classses_Changed.forMovingBackground ="forMovingBackground";
CSS_Classses_Changed.ToRight ="ToRight";
CSS_Classses_Changed.ToTop = "ToTop";
CSS_Classses_Changed.ToBottom ="ToBottom";
CSS_Classses_Changed.ToLeft ="ToLeft";

//тут все id-индентификаторы, их достаточно изменить в модели и css-файле
var ID_Changed = {};
ID_Changed.forInfo = "info-cell";
ID_Changed.forWrapper = "wrapper";
ID_Changed.forBullet = "shotMark";


//МОДЕЛЬ ВЫСТРЕЛА ПУЛЕЙ
var modelDataOfShot={};
modelDataOfShot.shotState = true;//в shotState храним состояние "в состоянии выстрела" или "не в состоянии выстрела", чтоб не стрелять повторно в момент совершаемого выстрела
modelDataOfShot.shotHitOrOut = "out";//в shotInOrOut храним состояние "летит в цель" (Hit) или "в молоко, т.е. в край поля" (Out)
modelDataOfShot.shotDirection = null;
modelDataOfShot.handleGun1; // аналог handle в функции  движения танка (но тут для пули)
modelDataOfShot.start1;// аналог start в функции  движения танка (но тут для пули)





let modelFunctions = {};

modelFunctions.createTanksByConstructor = function (utilsGetRandomIntFromInterval, _CELL_SIZE) {
    tanksArmy.ourTank = new modelFunctions.MakeTank(utilsGetRandomIntFromInterval(0, _CELL_SIZE - 1), utilsGetRandomIntFromInterval(0, _CELL_SIZE - 1), "ally");
    tanksArmy.enemyTank = new modelFunctions.MakeTank(utilsGetRandomIntFromInterval(1, _CELL_SIZE - 1), utilsGetRandomIntFromInterval (1, _CELL_SIZE - 1), "enemy");

};



//это конструктор для создания танка
modelFunctions.MakeTank = function (i, j, enemyOrAlly) {
    this.i = i;
    this.j = j;
    this.name = enemyOrAlly;
    this.health = 100;
};

modelFunctions.MakeTank.prototype.shotByGun = function () {

};


//снижение здоровья танка в его модели
modelFunctions.minusHealth = function (tank) {
    //снижаем здоровье  объекта танка
    tank.health = tank.health - 1;
};

//обновление координат танка в его модели
modelFunctions.renewModelTanksPositions = function (newRow, newCell) {
    tanksArmy.ourTank.i = tanksArmy.ourTank.i + newRow;
    tanksArmy.ourTank.j = tanksArmy.ourTank.j + newCell;
}

export {modelData, _cells,   infoPanelText, CSS_Classses_Changed, ID_Changed, tanksArmy, modelDataOfShot, modelFunctions};