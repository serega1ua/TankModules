var modelData = {};
//import  {utils}  from "./utils.js";

modelData.gameState = null;
modelData.start = null; // тут хранить время начала
modelData.handle = null; // через эту глобальную переменную будем останавилвать вот так: clearInterval(handle);
modelData.timePassed = null; //тут будем хранить время, прошедшее ДО паузы, чтоб учитывать в общем времени игру ДО паузы через pauseGame()
modelData.timeOfWholeGame = 0;// тут хранить длительность всей игры с учетом пауз
modelData.TIMEOFGAME = 77000000; //сколько будет работать один сеанс игры
modelData.directionOfOurTank = "ToRight"; //тут будем хранить направление танка (куда смотрит), первое значение "ToRight"
modelData.distanceOfShotForEnemy = 10;

//ну там функция именно для канваса создает сама стили, потому добавление этого id визуально не имеет значения, хотя и присваивает css правила для   #explosion
modelData.IDforThisExplosion = "explosion";

//это характеристики взрыва при поражении танка (они по умолчанию заданы )
modelData.particlesNumberOfExplosionForTank = 55;

modelData.colorOfExplosionForTank = [
    "#b3b3b3",
    "#4d4d4d",
    "#fa0000",
    "#570000",
    "#fa0000",
    "#fa0000",
    "#fa0000",
    "#4d4d4d",
    "#ffffff"
];

modelData.particlesNumberOfExplosionForBorder = 47;
modelData.colorOfExplosionForTopBorder = [
    "#FCB150",
    "#902B2B",
    "#FCB150",
    "#A63232",
    "#A62626",
    "#FD5039",
    "#C12F2A",
    "#FF6540",
    "#FCB150"
];


modelData.colorOfExplosionForRightBorder = [
    "#cc324b",
    "#902B2B",
    "#cc324b",
    "#A63232",
    "#A62626",
    "#FD5039",
    "#C12F2A",
    "#FF6540",
    "#cc324b",
];


modelData.colorOfExplosionForBottomBorder = [
    "#11A8AB",
    "#902B2B",
    "#11A8AB",
    "#A63232",
    "#A62626",
    "#FD5039",
    "#C12F2A",
    "#FF6540",
    "#11A8AB"
];


modelData.colorOfExplosionForLeftBorder = [
    "#4fc4f6",
    "#902B2B",
    "#4fc4f6",
    "#A63232",
    "#A62626",
    "#FD5039",
    "#C12F2A",
    "#FF6540",
    "#4fc4f6"
];


var _cells = []; // в массиве _cells  будет модель "чистых" данных о том, что в клетках
var tanksArmy = {};
tanksArmy.ourTank = null;
tanksArmy.enemyTank = null;
tanksArmy.locatorTank = null;

var infoPanelText = (` 
	<p>Вы - это танк в поле из клеток. Против Вас: вражеский вертолет и авто-локатор.</p>
	<p>Для старта игры нажать кнопку <span>"Start"</span>.</p>
	<p>Используйте кнопки на клавиатуре <span>&#x2190; &#x2191; &#x2192; &#x2193;</span>  для движения Вашего танка.</p>
	<p>Можем двигать наш танк по диагонали: <span>'a' &#x2196;, 's'  &#x2197;, 'z'  &#x2199;,'x'  &#x2198;</span>.  </p>
	<p>Ходить можно <span>1 раз в секунду</span>.</p>
	<p>Кнопка <span>"Пробел"('Space')</span> - выстрел.</p>
	<p>Вертолет врага может поражать Вас поражающим излучением, если он <span>на одной линии</span> с Вами и <span>ближе 10 клеток</span>.</p>
	<p>Вы можете поразить выстрелом вертолет врага, если он <span>на одной линии</span> с Вами.</p>
	<p>Вы можете <span>задавить локатор врага/вертолет</span> (наехать на него).</p>
	<p>Если Вы на "линии огня", то срабатывает "прицел"-подсказка.</p>
	<p>Локатор при Вашем приближении "беспокоится", после наезда на него возникает новый в ином месте.</p>
	<p>P.s.</p>
	<p>Локатор сообщает о ходе сражения в консоль браузера (одновременное нажатие <span>Ctrl+Shift+I</span> откроет консоль).</p>									   
 `);

//тут  css-классы, их достаточно изменить в модели и css-файле
var CSS_Classses_Changed = {};
CSS_Classses_Changed.forWrapper = "outside-cell";
CSS_Classses_Changed.forInfoPanel = "info";
CSS_Classses_Changed.forInsideCell = "inside-cell";
CSS_Classses_Changed.forFirstInRowInsideCell = "clear-both inside-cell";
CSS_Classses_Changed.forBullet = "shotMark";
CSS_Classses_Changed.forVisibleBullet = "shotMark displayAsBlock"
CSS_Classses_Changed.forRadar1 = "displayAsBlockAndReady1";
CSS_Classses_Changed.forExplosion = "red";
CSS_Classses_Changed.forExplosionBig = "explosion";
CSS_Classses_Changed.forLocator = "locator";
CSS_Classses_Changed.forEnemyTankOnRadar = "cellWithEnemyTankOnRadar";
CSS_Classses_Changed.forTarget = "target";
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
CSS_Classses_Changed.topLocatorDanger = "top-locator-danger";
CSS_Classses_Changed.topLocator = ".top-locator";
CSS_Classses_Changed.pipeInLocatorInDanger = "pipeIn-locator-inDanger";
CSS_Classses_Changed.pipeInLocator = ".pipeIn-locator";
CSS_Classses_Changed.pipeLocatorInDanger = "pipe-locator-inDanger";
CSS_Classses_Changed.pipeLocator = ".pipe-locator";
CSS_Classses_Changed.moveBottom = "moveBottom";
CSS_Classses_Changed.moveTop = "moveTop";
CSS_Classses_Changed.moveLeft = "moveLeft";
CSS_Classses_Changed.moveRight = "moveRight";
CSS_Classses_Changed.forMovingBackground = "forMovingBackground";
CSS_Classses_Changed.ToRight = "ToRight";
CSS_Classses_Changed.ToTop = "ToTop";
CSS_Classses_Changed.ToBottom = "ToBottom";
CSS_Classses_Changed.ToLeft = "ToLeft";
CSS_Classses_Changed.ToTurn = "ToTurn";

//тут все id-индентификаторы, их достаточно изменить в модели и css-файле
var ID_Changed = {};
ID_Changed.forInfo = "info-cell";
ID_Changed.forWrapper = "wrapper";
ID_Changed.forBullet = "shotMark";
ID_Changed.forAdvertsTank = "tiny";
ID_Changed.forHelicopter = "helicopter";
ID_Changed.forLocator = "locator";

//МОДЕЛЬ ВЫСТРЕЛА ПУЛЕЙ
var modelDataOfShot = {};
modelDataOfShot.shotState = true;//в shotState храним состояние "в состоянии выстрела" или "не в состоянии выстрела", чтоб не стрелять повторно в момент совершаемого выстрела
modelDataOfShot.shotHitOrOut = "out";//в shotInOrOut храним состояние "летит в цель" (Hit) или "в молоко, т.е. в край поля" (Out)
modelDataOfShot.shotDirection = null;
modelDataOfShot.handleGun1; // аналог handle в функции  движения танка (но тут для пули)
modelDataOfShot.momentOfBulletStart;// аналог start в функции  движения танка (но тут для пули)
modelDataOfShot.pictureFrequencyOfBullet = 5; //дает частоту показа пули при полете (как часто отрисовываются промежуточные представления в полете пули), если браузер тормозит, то можем её увеличить (меньшее количество промежуточных положений пули приедется отрисовывать)
modelDataOfShot.speedOfBullet = 1.5; //варьируем от 1.5 до 4. Чем больше значение, тем медленнее полет пули (например, если здоровье танка хуже - стреляет более "вяло" и пуля медленнее летит)

//тексты всех информационных сообщений
modelData.messageLetsGo = "Ну что, игра стартовала!";
modelData.messageOutOfField = "край поля!";
modelData.messageDirectionOfShot = "направление выстрела: ";
modelData.messageCanMoveOnlyOneTimeInSec = "Сейчас gameState == false, потому танк не может двигаться";
modelData.messageCanShootOnlyOneTimeInSec = "танк может стрелять 1 раз в 1 секунду";
modelData.messagePeriodIsEnded = "Истекло максимальное время сеанса, оно составляло ";
modelData.messagePause = "ПАУЗА. До паузы в этом сеансе игры прошло   ";
modelData.messageEnd = "КОНЕЦ ИГРЫ. Игра длилась ";
modelData.messageTimeOfGame = "Сейчас общее время игры   ";
modelData.messageSeconds = " секунд";
modelData.messageNoDataRegardingTimeOfGame = "нет данных о длительности игры";
modelData.messageEndAndCounterToZero = "конец игры, счетчик времени игры обнулён";
modelData.messageWhereShoot = "наносим удар по клетке с  координатами (i / j): ";
modelData.messageWhenStart = "Игра в конкретном сеансе стартовала в  ";
modelData.messageCannotMoveNow = "Опаньки, а танк-то может двигаться 1 раз в секунду";
modelData.messageHaveNoContainer = "Обратите внимание: у нас в разметке не было <div id='id-whole-block-for-game'> (чтоб он был, надо его раскомментировать в HTML-файле). Потому аппендим в document.body";
modelData.messageHealthOfLocator = "здоровье локатора = ";
modelData.messageHealthOfEnemy = "здоровье врага = ";
modelData.messageHealthOur = "наше здоровье = ";
modelData.messageSameVertical = "на одной вертикали  ввиду передвижения вражеского танка!";
modelData.messageSameGorizontal = "на одной горизонтали ввиду передвижения вражеского танка!";
modelData.messageSameGorizontalByUs = "на одной горизонтали с врагом ввиду нашего передвижения!";
modelData.messageSameVerticalByUs = "на одной вертикали с врагом  ввиду нашего передвижения!";
modelData.messageSameGorizontalAndAttack = "враг на одной горизонтали и на расстоянии его выстрела ";
modelData.messageSameVerticalAndAttack = "враг на одной вертикали и приблизился на расстояние его выстрела ";
modelData.messageEnemyPressedLocator = "цель пыталась наехать  на локатор,  потеря здоровья локатора!";
modelData.messageEnemyPressedUs = "цель пыталась наехать  на наш танк, двойная потеря здоровья нашего танка!";
modelData.messageItsTargeted = "цель захвачена прицелом! удар по столбцу: ";
modelData.messageEnemyCrushed = "наш танк задавил врага, пятикратная потеря здоровья вертолета и врага, и локатора!";
modelData.messageCanCrushLocator = "Можно раздавить локатор врага, наехав на него! Сейчас наш танк на одной линии с ним."
modelData.messageOnDiagonalAndNear = "по диагонали приблизился";

//готовые массивы с css-классами для отрисовки фигурок транспортных средств через css
modelData.arrayOfArgsForCSSofLocator = ["main", "tank-locator", "top-locator", "pipe-locator", "pipeIn-locator", "middle-locator", "bottom-locator", "wheel-locator", "wheel-locator", "dot-locator", "dotIn-locator", "dot-locator", "dotIn-locator", "locator"];
modelData.arrayOfArgsForCSSofLocatorOnDanger = ["main", "tank-locator", "top-locator", "pipe-locator pipe-locator-inDanger", "pipeIn-locator-inDanger", "middle-locator", "bottom-locator", "wheel-locator", "wheel-locator", "dot-locator", "dotIn-locator", "dot-locator", "dotIn-locator", "locator"];
modelData.arrayOfArgsForCSSofHelicopter = ["main", "helicopterBody", "helicopterTop", "topBlade topBladeSpinning", "displayNone", "windowInHead", "helicopterTail", "tailContainer", "displayNone", "displayNone", "displayNone", "displayNone", "displayNone", "helicopter"];
modelData.arrayOfArgsForCSSofAdvertsTank = ["main", "tank-tiny", "top-tiny", "pipe-tiny", "pipeIn-tiny", "middle-tiny", "bottom-tiny", "wheel-tiny wheel-rotate-slowly-tiny", "wheel-tiny wheel-rotate-tiny", "dot-tiny", "dotIn-tiny", "dot-tiny", "dotIn-tiny"]

let modelFunctions = {};


modelFunctions.createTanksByConstructor = function (getRandom, _CELL_SIZE) {

    //третий аргумент 6 означает, что нам нужно 6 значений, не сопадающий друг с другом
    var tempArray = getRandom(0, _CELL_SIZE - 1, 6);

    tanksArmy.ourTank = new modelFunctions.MakeTank(tempArray[0], tempArray[1], "ally");
    tanksArmy.enemyTank = new modelFunctions.MakeTank(tempArray[2], tempArray[3], "enemy");
    tanksArmy.locatorTank = new modelFunctions.MakeTank(tempArray[4], tempArray[5], "locator");

};

/* var generateNewPositionForNewTank = function (venicleForRandomPosition  ) {

 venicleForRandomPosition.i = utils.getRandomIntFromInterval(0, _CELL_SIZE - 1);
 venicleForRandomPosition.j = utils.getRandomIntFromInterval(0, _CELL_SIZE - 1);


 if ((venicleForRandomPosition.i === tanksArmy.ourTank.i) && (venicleForRandomPosition.j === tanksArmy.ourTank.j)) {
 generateNewPositionForNewTank();
 }


 }; */


//tanksArmy.locatorTank.ElementOfLocatorGraficByCSS = ElementOfLocatorGraficByCSS;


//это конструктор для создания танка
modelFunctions.MakeTank = function (i, j, enemyOrAlly) {
    this.i = i;
    this.j = j;
    this.name = enemyOrAlly;
    this.health = 100;
};

modelFunctions.MakeTank.prototype.shotByGun = function () {
    /* нет пока реализации, заложена на перспективу */
};


//снижение здоровья танка в его модели
modelFunctions.minusHealth = function (tank) {
    //снижаем здоровье  объекта танка
    tank.health = tank.health - 1;
};

//обновление координат танка в его модели,  
modelFunctions.renewModelTanksPositions = function (tank /* в первом аргументе  принимает  tanksArmy.enemyTank || tanksArmy.ourTank */,
                                                    newRow,
                                                    newCell) {
    tank.i = tank.i + newRow;
    tank.j = tank.j + newCell;
}


export {modelData, _cells, infoPanelText, CSS_Classses_Changed, ID_Changed, tanksArmy, modelDataOfShot, modelFunctions};