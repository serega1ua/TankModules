var directionOfOurTank = "ToRight"; //тут будем хранить направление танка (куда смотрит), первое значение "ToRight"

var modelData={};
modelData.gameState = null;
modelData.start = null; // тут хранить время начала
modelData.handle = null; // через эту глобальную переменную будем останавилвать вот так: clearInterval(handle);
modelData.timePassed = null; //тут будем хранить время, прошедшее ДО паузы, чтоб учитывать в общем времени игру ДО паузы через pauseGame()
modelData.timeOfWholeGame = 0;// тут хранить длительность всей игры с учетом пауз
modelData.TIMEOFGAME = 77000000; //сколько будет работать один сеанс игры

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


//тут все id-индентификаторы, их достаточно изменить в модели и css-файле
var ID_Changed = {};
ID_Changed.forInfo = "info-cell";
ID_Changed.forWrapper = "wrapper";
ID_Changed.forBullet = "shotMark";

//todo : в 1 объект собрать переменные
export {directionOfOurTank, modelData, _cells,   infoPanelText, CSS_Classses_Changed, ID_Changed, tanksArmy};