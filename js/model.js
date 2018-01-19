var modelData={};
modelData.gameState = null;
modelData.start = null; // тут хранить время начала
modelData.handle = null; // через эту глобальную переменную будем останавилвать вот так: clearInterval(handle);
modelData.timePassed = null; //тут будем хранить время, прошедшее ДО паузы, чтоб учитывать в общем времени игру ДО паузы через pauseGame()
modelData.timeOfWholeGame = 0;// тут хранить длительность всей игры с учетом пауз
modelData.TIMEOFGAME = 77000000; //сколько будет работать один сеанс игры
modelData.directionOfOurTank = "ToRight"; //тут будем хранить направление танка (куда смотрит), первое значение "ToRight"
modelData.distanceOfShotForEnemy = 7;

var _cells = []; // в массиве _cells  будет модель "чистых" данных о том, что в клетках
var tanksArmy = {};
tanksArmy.ourTank = null;
tanksArmy.enemyTank  = null;

//todo : а почему без <pre> не работет отображение новых строк?
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
CSS_Classses_Changed.forRadar ="displayAsBlockAndReady";
CSS_Classses_Changed.forRadar1 ="displayAsBlockAndReady1";
CSS_Classses_Changed.forExplosion ="red";
CSS_Classses_Changed.forLocator ="locator";
CSS_Classses_Changed.forEnemyTankOnRadar ="cellWithEnemyTankOnRadar";
CSS_Classses_Changed.forTarget ="target";

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

//todo : в 1 объект собрать переменные
export {modelData, _cells,   infoPanelText, CSS_Classses_Changed, ID_Changed, tanksArmy, modelDataOfShot};