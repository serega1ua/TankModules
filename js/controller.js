'use strict';

/* Object.defineProperty(exports, '__esModule', { value: true });
 */
let utils = {};

//генерирует случ.значения в заданном диапазоне
utils.getRandomIntFromInterval = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

//извлекает значение css-свойства
utils.getCssProperty = function (elem, property) {
    return parseFloat(window.getComputedStyle(elem, null).getPropertyValue(property));
};

let view$1 = {};
view$1.consoleLog = function (...rest) {
    console.log(rest.join(""));

    /* есть резервный вариант вывода подсказок в панель подсказок на экран игры */
    /* var p = document.createElement("div"); */
    /* p.innerHTML = rest.join(""); */

    /* есть и такой резервный вариант вывода подсказок в панель подсказок на экран игры */
    /* 	var newtext = document.createTextNode(rest.join(""));
     var ul = document.getElementById("infoLine");
     ul.insertBefore(document.createElement("br"), ul.firstChild);
     ul.insertBefore(newtext, ul.firstChild);  */ //перед firstChild вставляем
};

view$1.consoleDir = function (objForConsole) {
    console.dir(objForConsole);
};

view$1.toZero = function (element1) {
    element1.style.left = 10 + 'px';
    element1.style.top = 10 + 'px';
};

/* TODO В большинстве случаев внешний вид элементов задаётся классами. А JavaScript добавляет или удаляет их. Такой код красив и гибок, дизайн можно легко изменять.
 Свойство style нужно использовать лишь там, где классы не подходят, например если точное значение цвета/отступа/высоты вычисляется в JavaScript.
 */

view$1.leftStyleSet = function (element1, pixels) {
    element1.style.left = pixels + 'px';
};

view$1.setCssClass = function (element, CssClass) {
    element.className = CssClass;
};

view$1.addCssClass = function (element, CssClass) {

    element.classList.add(CssClass);
};

view$1.removeCssClass = function (element, CssClass) {

    element.classList.remove(CssClass);
};

//принимает DOM-элемент, css класс для удаления в этом элементе (CssClass), css класс по которому найти в элементе конкретный div
view$1.removeCssClassByParalellCssClass = function (element, CssClassToDelete, paralellStaticCssClass) {

    var changingPartOfVenicle = element.querySelector(paralellStaticCssClass);
    //может быть возвращен null, потому страхуемся через if
    if (changingPartOfVenicle) {
        changingPartOfVenicle.classList.remove(CssClassToDelete);
    }
};

view$1.addCssClassByParalellCssClass = function (element, CssClassToAdd, paralellStaticCssClass) {

    var changingPartOfVenicle = element.querySelector(paralellStaticCssClass);
    //может быть возвращен null, потому страхуемся через if
    if (changingPartOfVenicle) {
        changingPartOfVenicle.classList.add(CssClassToAdd);
    }
};

view$1.removeCssClassFromAllCells = function (_cells, CssClass) {

    // тут есть 2 массива: _cells.length и _cells[i], обходим каждый
    for (let i = 0, len = _cells.length; i < len; i++) {
        for (let j = 0, len2 = _cells[i].length; j < len2; j++) {

            _cells[i][j].dom.classList.remove(CssClass);
        }
    }
};

view$1.addAndRemoveCssClassInTime = function (element, CssClass, TimeOfShowing) {

    element.classList.add(CssClass);

    setTimeout(function () {
        element.classList.remove(CssClass);
    }, TimeOfShowing);
};

view$1.removeElementByClass = function (classToDelete) {
    var lostedChild = document.getElementsByClassName(classToDelete);

    for (var i = 0; i < lostedChild.length; i++) {
        lostedChild[i].parentNode.removeChild(lostedChild[i]);
    }

    // вот так быстрее:	var children = el.childNodes.length; for (var i=0; i<children.length; i++) { el.removeNode(children[i]); } 

    //TODO пока отключил	 
    /* if (lostedChild[0] {
     lostedChild[0].parentNode.removeChild(lostedChild)[0];
     }
     */
};

view$1.removeElementById = function (IDtoDelete) {
    var lostedChild = document.getElementById(IDtoDelete);

    if (lostedChild) {
        lostedChild.parentNode.removeChild(lostedChild);
    }
};

//  тут берем из импортированных данных model.js массив-модель поля _cells, наполняем _cells данными 
//(можно эту функцию вынести из модуля controller и только вызывать её здесь)
//То есть у нас есть массив-модель данных о происходящем на поле и (отдельно) есть отображение этой модели
// и создаем новые данные о нем, сохраняя в этот же массив в модуле  model.js модели
//из модуля view контроллер использует функцию view.createElement, создающую dom-элементы
// (т.е. модуль view сообщается с моделью через контроллер)
view$1.createDataModelOfField = function (_rowsNumber, _cellsNumber, _cells, CSS_Classses_ChangedforInsideCell, CSS_Classses_ChangedforFirstInRowInsideCell, ID_ChangedforBullet, CSS_Classses_ChangedforBullet /* , viewcreateElement, viewcreateElementOfBullet */
) {
    var _rowsNumberFinal = _rowsNumber || 20;
    var _cellsNumberFinal = _cellsNumber || 20;

    for (let i = 0; i < _rowsNumberFinal; i++) {
        _cells[i] = [];
        for (let j = 0; j < _cellsNumberFinal; j++) _cells[i].push({
            /* в каждую ячейку двумерного массива пушим объект, в котором
             два DOM-объекта: пуля и танк, изначально hidden */
            value: null,
            //создание dom-элемента осуществим функцией из модуля view
            dom: view$1.createElement(i, j, CSS_Classses_ChangedforInsideCell /* это "inside-cell" */
            , CSS_Classses_ChangedforFirstInRowInsideCell /* это"clear-both inside-cell" */
            ),
            i: i,
            j: j,
            //есть пуля в модели данных, тут её стартовое положение и DOM-элемент(пока что не отображённый)
            bullet: {
                domBullet: view$1.createElementOfBullet(i, j, ID_ChangedforBullet, CSS_Classses_ChangedforBullet),
                startPosition_I: i,
                startPosition_J: j,
                finalPosition_I: null,
                finalPosition_J: null,
                inProcess: null
            }
        });
    }

    /*  view.consoleLog("вот массив с моделью поля, в нем DOM-элементы вложены,
     но не отображены, пока не отданы в модуль view для отображения:");
     view.consoleDir(_cells); */
};

//принимает цвета и количество фрагментов взрыва
view$1.explosion = function (particlesNumber = 47, colors = ["#6A0000", "#900000", "#902B2B", "#A63232", "#A62626", "#FD5039", "#C12F2A", "#FF6540", "#f93801"], IdOfWrapperDivForExplosion, element) {

    let canvases = [];

    const spring = 1 / 10;
    const friction = 0.85;

    var canvasHeight = 16;
    var canvasWidth = 18;
    //particlesNumber = 47;// количество фрагментов взрыва
    var canvasesNumber = 1; // сколько создаем  областей взрыва


    class HTML5canvas {
        /* that fragment/snippet is taken from https://codepen.io/enxaneta/pen/yvPmLo?page=1& */
        constructor(i) {
            //this.i = i;
            this.particles = [];

            this.createElements();

            this.createParticles();
            this.explosionDraw();
        }

        createElements() {
            this.div = document.createElement("div");
            this.div.className = "explosionDiv"; // вот его надо будет удалить нам, причем именно  конретного только его, чтобы множественные взрывы могли быть
            this.div.id = IdOfWrapperDivForExplosion + "divInsideCell"; // присваиваем id

            this.canv = document.createElement("canvas");
            this.canv.id = IdOfWrapperDivForExplosion + "canvasInsideCell";
            this.ctx = this.canv.getContext("2d");
            this.cw = this.canv.width = canvasWidth;
            this.ch = this.canv.height = canvasHeight;

            this.div.appendChild(this.canv);

            // вот сюда надо передать именно нужную клетку,иначе было бы невозможно более 1 взрыва олновременно
            /* console.log(IdOfWrapperDivForExplosion); */
            element.appendChild(this.div); //в наш самый верхний div-клетку вкладываем
        }

        createParticles() {
            this.particles.length = 0;
            for (let i = 0; i < particlesNumber; i++) {
                this.particles.push(new Particle());
            }
        }

        explosionUpdate() {
            if (this.particles.length > 0) {
                for (let i = 0; i < this.particles.length; i++) {
                    this.particles[i].update();
                    if (this.particles[i].r < 0.5) {
                        this.particles.splice(i, 1);
                    }
                }
            }
        }

        explosionDraw() {
            if (this.particles.length > 0) {
                this.ctx.clearRect(0, 0, this.cw, this.ch);
                this.ctx.globalCompositeOperation = "lighter";
                for (let i = 0; i < this.particles.length; i++) {
                    this.particles[i].draw(this.ctx);
                }
            }
        }
    }

    class Particle {
        constructor() {
            this.decay = 0.95;
            //////////// конфигурация-форма взрываменяется при смене аргументов ниже///////////////
            this.r = randomIntFromInterval(2, 15);
            this.R = 10 - this.r;
            ///////////////конфигурация-форма взрываменяется при смене аргументов ниже/////////////////////////
            this.angle = Math.random() * 2 * Math.PI;
            this.center = { x: canvasWidth / 2, y: canvasHeight / 2 };
            this.pos = {};
            this.pos.x = this.center.x + this.r * Math.cos(this.angle);
            this.pos.y = this.center.y + this.r * Math.sin(this.angle);
            this.target = {};
            this.target.x = this.center.x + this.R * Math.cos(this.angle);
            this.target.y = this.center.y + this.R * Math.sin(this.angle);
            this.color = colors[~~(Math.random() * colors.length)];
            this.vel = {
                x: 0,
                y: 0
            };
            this.acc = {
                x: 0,
                y: 0
            };
        }

        update() {
            let dx = this.target.x - this.pos.x;
            let dy = this.target.y - this.pos.y;

            this.acc.x = dx * spring;
            this.acc.y = dy * spring;
            this.vel.x += this.acc.x;
            this.vel.y += this.acc.y;

            this.vel.x *= friction;
            this.vel.y *= friction;

            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;

            if (this.r > 0) this.r *= this.decay;
        }

        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    for (let i = 0; i < canvasesNumber; i++) {
        canvases.push(new HTML5canvas(i));
    }

    function Draw() {
        var requestId = window.requestAnimationFrame(Draw);

        for (let j = 0; j < canvases.length; j++) {
            let c = canvases[j];
            c.explosionUpdate();
            c.explosionDraw();
        }
    }

    Draw();

    function randomIntFromInterval(mn, mx) {
        return Math.floor(Math.random() * (mx - mn + 1) + mn);
    }
};

view$1.addAndRemoveExplosion = function (element, CssClass /* "explosion" */, TimeOfShowing, NumberOfExplosion, colorOfExplosion) {

    //CssClass "explosion" только информативно нужен.
    /* ID  token must begin with a letter ([A-Za-z]) and may be followed by any number of letters, digits ([0-9]), hyphens ("-"), underscores ("_"), colons (":"), and periods ("."). */
    var tempID = CssClass + "_time_" + new Date(Date.now()).toString().slice(16, 24).replace(/[:]/g, "-") + "_number_" + utils.getRandomIntFromInterval(1, 10000);
    //и запомнили ID,  чтоб потом удалить именно этот взрыв
    view$1.explosion(NumberOfExplosion /*  это количество клубов взрыва */
    , colorOfExplosion /* это набор цветов взрыва */
    , tempID /* это временный ID на период взрыва */
    , element /* это div поля, куда вкладываепм взрыв */
    );

    setTimeout(function () {
        //остается элемент со взрывом , потому его удаляем и только его, для этого и генерировали уникальный ID на период TimeOfShowing взрыва

        view$1.removeElementById(tempID + "divInsideCell"); //удалили div, созданный view.explosion
    }, TimeOfShowing);
};

view$1.addAndRemoveIdInTime = function (element, ID, TimeOfShowing) {

    element.setAttribute("id", ID);

    setTimeout(function () {
        element.removeAttribute("id");
    }, TimeOfShowing);
};

view$1.toright = function (element, timePassed, speedOfBullet) {
    element.style.left = timePassed / speedOfBullet + 'px';
};
view$1.toleft = function (element, timePassed, speedOfBullet) {
    element.style.left = "-" + timePassed / speedOfBullet + 'px';
};
view$1.tobottom = function (element, timePassed, speedOfBullet) {
    element.style.top = timePassed / speedOfBullet + 'px';
};
view$1.totop = function (element, timePassed, speedOfBullet) {
    element.style.top = "-" + timePassed / speedOfBullet + 'px';
};

//функция createElementOfTankGraficByCSS должна принимать разный набор string-аргументов
// и возвращать в зависсимости от  набора полученных аргументов разные танки (вражеский и несколько видов нашего)

//но помещать в одну переменную каждый наш созданный танк (каждый вид)? Чтоб не удалять объект танка?

//эта функция создает dom-элемент фигуры в игре (рисуем html-разметку фигурки js-кодом, что можно было вставлять игру на любую уже имеющуюся страницу)
view$1.createElementOfTankGraficByCSS = function (rest /* ...rest */ /* elementMainClass,
                                                                   elementSectionClass,
                                                                   elementTopClass,
                                                                   elementPipeClass,
                                                                   elementPipeInClass,
                                                                   elementMiddleClass,
                                                                   elementBottomClass,
                                                                   elementWheel1Class,
                                                                   elementWheel2Class,
                                                                   elementDot1Class,
                                                                   elementDotIn1Class,
                                                                   elementDot2Class,
                                                                   elementDotIn2Class,
                                                                   id */) {

    if (!rest) return null;

    var elementMain = document.createElement("main");
    elementMain.className = rest[0] /* elementMainClass */;
    elementMain.id = rest[13] /* id */;

    //создали 	section-tank и вложили  его в main
    var elementSection = document.createElement("section");
    elementSection.className = rest[1] /*  elementSectionClass */;
    elementMain.appendChild(elementSection);

    //создали 	div top
    var elementTop = document.createElement("div");
    elementTop.className = rest[2] /* elementTopClass */;

    //создали div pipe и вложили его в	div top
    var elementPipe = document.createElement("div");
    elementPipe.className = rest[3] /* elementPipeClass */;
    elementTop.appendChild(elementPipe);

    //создали div pipeIn и вложили его в	div pipe
    var elementPipeIn = document.createElement("div");
    elementPipeIn.className = rest[4] /*  elementPipeInClass */;
    elementPipe.appendChild(elementPipeIn);

    // и вложили 	div top  в section-tank
    elementSection.appendChild(elementTop);

    //создали div middle и вложили его в	section-tank
    var elementMiddle = document.createElement("div");
    elementMiddle.className = rest[5] /* elementMiddleClass */;
    elementSection.appendChild(elementMiddle);

    //создали div bottom и вложили его в	section-tank
    var elementBottom = document.createElement("div");
    elementBottom.className = rest[6] /* elementBottomClass */;
    elementSection.appendChild(elementBottom);

    //создали div Wheel1 и вложили его в	bottom
    var elementWheel1 = document.createElement("div");
    elementWheel1.className = rest[7] /* elementWheel1Class */;
    elementBottom.appendChild(elementWheel1);

    //создали div Wheel2 и вложили его в	bottom
    var elementWheel2 = document.createElement("div");
    elementWheel2.className = rest[8] /* elementWheel2Class */;
    elementBottom.appendChild(elementWheel2);

    //создали div Dot1 и вложили его в	elementWheel1
    var elementDot1 = document.createElement("div");
    elementDot1.className = rest[9] /* elementDot1Class */;
    elementWheel1.appendChild(elementDot1);

    //создали div DotIn1 и вложили его в elementDot1
    var elementDotIn1 = document.createElement("div");
    elementDotIn1.className = rest[10] /* elementDotIn1Class */;
    elementDot1.appendChild(elementDotIn1);

    //создали div Dot2 и вложили его в	elementWheel2
    var elementDot2 = document.createElement("div");
    elementDot2.className = rest[11] /* elementDot2Class */;
    elementWheel2.appendChild(elementDot2);

    //создали div DotIn2 и вложили его в elementDot2
    var elementDotIn2 = document.createElement("div");
    elementDotIn2.className = rest[12] /* elementDotIn2Class */;
    elementDot2.appendChild(elementDotIn2);

    //document.body.appendChild(elementMain);
    return elementMain;
};

/*   
 view.createVeniclesGraficByCSS = function (tanksArmy, arrayOfArgsForCSSofLocator, arrayOfArgsForCSSofHelicopter) {


 tanksArmy.locatorTank.ElementByCSS = view.createElementOfTankGraficByCSS(arrayOfArgsForCSSofLocator);
 tanksArmy.enemyTank.ElementByCSS = view.createElementOfTankGraficByCSS(arrayOfArgsForCSSofHelicopter);
 tanksArmy.ourTank.ElementByCSS = null;


 } */

view$1.createVenicleGraficByCSS = function (venicle /* tanksArmy.locatorTank */, arrayOfArgsForCSS) {

    venicle.ElementByCSS = view$1.createElementOfTankGraficByCSS(arrayOfArgsForCSS);
};

// ТАНК (рисуем средствами css изображение танка, функция view.createElementOfTankGraficByCSS создает DOM-элемент)
// это стоящий танк игрока (вправо). Это положение по умолчанию. Дуло вправо. Колеса медленно вращаются вправо.
// var ElementOfTankGraficByCSS = view.createElementOfTankGraficByCSS(["main",
//     "tank-tiny", "top-tiny", "pipe-tiny", "pipeIn-tiny", "middle-tiny", "bottom-tiny",
//     "wheel-tiny wheel-rotate-slowly-tiny", "wheel-tiny wheel-rotate-tiny", "dot-tiny", "dotIn-tiny", "dot-tiny", "dotIn-tiny"]);


// ЛОКАТОР(аналогично: локатора, та же функция view.createElementOfTankGraficByCSS создает DOM-элемент)
//а это локатор, создаем на той же html-разметке от функции view.createElementOfTankGraficByCSS, как и остальные фигурки
//var ElementOfLocatorGraficByCSS =/* функция modelFunctions.createTanksByConstructor создала  объект tanksArmy.locatorTank, 
//                                                     в нем свойства i j дают положение по горизонтали и вертикали */
/* view.createElementOfTankGraficByCSS("main",
 "tank-locator", "top-locator",
 "pipe-locator", "pipeIn-locator",
 "middle-locator", "bottom-locator",
 "wheel-locator",
 "wheel-locator",
 "dot-locator", "dotIn-locator", "dot-locator", "dotIn-locator", "locator" ); */

// ВЕРТОЛЕТ (аналогично: вертолета, та же функция view.createElementOfTankGraficByCSS создает DOM-элемент)
//а это вертолет, создаем на той же html-разметке от функции view.createElementOfTankGraficByCSS, как и остальные фигурки
/* var ElementOfHelicopterGraficByCSS = view.createElementOfTankGraficByCSS(
 "main",
 "helicopterBody",
 "helicopterTop", "topBlade topBladeSpinning",
 "displayNone", "windowInHead",
 "helicopterTail",
 "tailContainer",
 "displayNone", "displayNone", "displayNone", "displayNone", "displayNone", "helicopter"  ); */

//а это вертолет подпрыгивающий  
/* var ElementOfHelicopterJumpingGraficByCSS = view.createElementOfTankGraficByCSS(
 "main",
 "helicopterBody jumpEffect",
 "helicopterTop", "topBlade topBladeSpinning",
 "displayNone", "windowInHead",
 "helicopterTail",
 "tailContainer",
 "displayNone", "displayNone", "displayNone", "displayNone", "displayNone" ); */

/* покажем рекламный танк (он много ресурсов памяти кушает, потому показываем только когда не играем) */

view$1.showAdverts = function (ElementOfTankGraficByCSS) {
    document.getElementById("WorldieOfTanksID").appendChild(ElementOfTankGraficByCSS);
};

// view.renderField:
// -получает от контроллера данные о модели поля _cells
// -получает от контроллера данные о тексте инфо-панели infoPanelText
// -получает от контроллера данные о стринг-значения CSS и ID отрисовываемых элементов
// -получает от контроллера данные о html-контейнере, куда вставлять поле боя
// -осуществляет отображение поля, используя appendChild
view$1.renderField = function (contianer, //это document.getElementById("id-whole-block-for-game")
_cells, infoPanelText, clsforWrapper, //CSS_Classses_Changed.forWrapper = "outside-cell";
clsforInfoPanel, IDforWrapper, //ID_Changed.forWrapper = "wrapper"; 
IDforInfoPanel, ElementOfTankGraficByCSS, messageHaveNoContainer) {

    //берем body и в его конец аппендим
    var wholeContainer = document.body;

    // вот тут просто всю готовую разметку создадим, включая document.getElementById("forGameContainer")				 


    //вот блок для всей игры в целом, но не его будем чиcтить при пересоздании, а wrapper
    if (contianer) {
        var wholeBlockForGame = contianer;
        wholeBlockForGame.className = 'whole-block-for-game';
        wholeBlockForGame.id = 'id-whole-block-for-game';
        wholeContainer.appendChild(wholeBlockForGame); //в body его
        /* console.log("в if (contianer) ") */
    }

    // приняли контейнер или задали свой, если не был передан в вызове

    if (!contianer) {
        view$1.consoleLog(messageHaveNoContainer
        /* "Обратите внимание вы не передали контейнер и аппендим в document.body" */
        );
        var wholeBlockForGame = document.createElement("div");
        wholeBlockForGame.className = 'whole-block-for-game';
        wholeBlockForGame.id = 'id-whole-block-for-game';
        wholeContainer.appendChild(wholeBlockForGame); //в body его
        /* console.log("НЕ в if (contianer) ") */
    }

    var widthWrapper = document.createElement("div");
    widthWrapper.className = 'width-wrapper';
    widthWrapper.id = 'id-width-wrapper';
    wholeBlockForGame.appendChild(widthWrapper);

    var myFlexContainer = document.createElement("div");
    myFlexContainer.className = 'my-flex-container flex-grid-quarters';
    myFlexContainer.id = 'id-my-flex-container';
    widthWrapper.appendChild(myFlexContainer);

    var myFlexBlockDouble = document.createElement("div");
    myFlexBlockDouble.className = 'my-flex-block my-flex-block_double';
    myFlexBlockDouble.id = 'forGameContainer';
    myFlexContainer.appendChild(myFlexBlockDouble);

    var myFlexBlockInfo = document.createElement("div");
    myFlexBlockInfo.className = 'my-flex-block my-flex-block-info';
    myFlexBlockInfo.id = 'forGameContainer';
    myFlexContainer.appendChild(myFlexBlockInfo);

    var forInfoHead = document.createElement("h3");
    forInfoHead.className = 'forInfo';
    forInfoHead.id = 'forInfo';
    forInfoHead.innerHTML = "Панель подсказок";
    myFlexBlockInfo.appendChild(forInfoHead);

    var infoLine = document.createElement("div");
    infoLine.className = 'infoLine';
    infoLine.id = 'infoLine';
    infoLine.innerHTML = infoPanelText;
    myFlexBlockInfo.appendChild(infoLine);

    /* 
    +<div class='whole-block-for-game'> 
    		+<div class='width-wrapper'> 
    				+<div class='my-flex-container flex-grid-quarters'> 
    				 
    					<!-- для этого блока внутренности скриптом сейчас созданы -->
    					+<div class='my-flex-block my-flex-block_double' id="forGameContainer"> 
    					+</div>   
    				 
    					+<div class='my-flex-block'> 
    							+<h3 id="forInfo">Панель подсказок</h3>
    							+<div class="infoLine" id="infoLine">
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
    									   
    							+</div>
    					+</div>  
    				 
    				+</div>   
    		+</div>  
     
      +</div>
    
    
    
    
     */

    //удаляем в новом сеансе игры, если был уже ID_Changed.forWrapper = "wrapper";
    //и внутринего все клетки игрового поля удаляем (CSS_Classses_Changed.forWrapper = "outside-cell"; и все в него вложенное)
    var wrapper = document.getElementById(IDforWrapper); //ID_Changed.forWrapper = "wrapper";
    if (wrapper) {
        wrapper.innerHTML = "";
        wrapper.parentNode.removeChild(wrapper);
    }

    wrapper = document.createElement("div");
    wrapper.className = clsforWrapper; //CSS_Classses_Changed.forWrapper = "outside-cell";
    wrapper.id = IDforWrapper;

    var info = document.getElementById(IDforInfoPanel);
    if (info) {
        info.innerHTML = "";
        info.parentNode.removeChild(info);
    }

    /*   info = document.createElement("div");
     info.className = clsforInfoPanel;
     info.id = IDforInfoPanel;
     info.innerHTML = infoPanelText;
     */

    view$1.removeElementById("buttons-block");
    view$1.removeElementById("WorldieOfTanksID");
    view$1.removeElementById("btn1");
    view$1.removeElementById("btn2");
    view$1.removeElementById("btnStop");
    view$1.removeElementById("Start");
    view$1.removeElementById("Pause");
    view$1.removeElementById("Stop");

    var headline = document.createElement("H3");
    headline.innerHTML = "Worldie Of Tanks";
    headline.id = "WorldieOfTanksID";

    var buttonsBlock = document.createElement("div");
    buttonsBlock.className = "buttons-block";
    buttonsBlock.id = "buttons-block";

    var btn1 = document.createElement("button");
    btn1.type = "button";
    btn1.className = "btn";
    btn1.id = "btn1";

    var btn2 = document.createElement("button");
    btn2.type = "button";
    btn2.className = "btn";
    btn2.id = "btn2";

    var btnStop = document.createElement("button");
    btnStop.type = "button";
    btnStop.className = "btn";
    btnStop.id = "btnStop";

    var btn1span = document.createElement("span");
    btn1span.innerHTML = "Start";
    btn1span.id = "Start";
    btn1.appendChild(btn1span);

    var btn2span = document.createElement("span");
    btn2span.innerHTML = "Pause";
    btn2span.id = "Pause";
    btn2.appendChild(btn2span);

    var btn3span = document.createElement("span");
    btn3span.innerHTML = "Stop";
    btn3span.id = "Stop";
    btnStop.appendChild(btn3span);

    buttonsBlock.appendChild(btn1);
    buttonsBlock.appendChild(btn2);
    buttonsBlock.appendChild(btnStop);

    /* contianer.appendChild(headline); 
    //вместо 	contianer будет myFlexBlockDouble
    */
    myFlexBlockDouble.appendChild(headline);

    ElementOfTankGraficByCSS.id = "tiny";

    headline.appendChild(ElementOfTankGraficByCSS);

    /*  contianer.appendChild(wrapper);
     contianer.appendChild(buttonsBlock);
    //вместо 	contianer будет myFlexBlockDouble
    */
    myFlexBlockDouble.appendChild(wrapper);
    myFlexBlockDouble.appendChild(buttonsBlock);

    /*  contianer.appendChild(info); */

    /* setTimeout(function () {
     view.removeElementById("tiny");
     }, 4000); */

    // тут есть 2 массива: _cells.length и _cells[i], обходим каждый
    for (let i = 0, len = _cells.length; i < len; i++) {
        for (let j = 0, len2 = _cells[i].length; j < len2; j++) {

            wrapper.appendChild(_cells[i][j].dom);

            _cells[i][j].dom.appendChild(_cells[i][j].bullet.domBullet);
            //пока что она display: none;
            /*.shotMark {
             display: none;
             width: 2px;
             height: 2px;
             border-radius: 100%;
             border: 1px solid red;
             background-color: yellow;
             position: absolute;
             z-index: 4 !important;
             top: 50%;
             left: 50%;
             transform: translate(-50%, -50%);
             }*/
        }
    }
};

//эта функция получила от контроллера данные из модели i, j и создает dom-элемент каждой клетки для вкладки в массив-модель

view$1.createElement = function (i, j, clsForInsideCell, clsForFirstInRowInsideCell) {
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
view$1.createElementOfBullet = function (i, j, idForBullet, classForBullet) {
    var element = document.createElement("div");
    element.className = classForBullet;
    element.id = idForBullet;
    return element;
};

view$1.showTank = function (elementDOM, classOfTank, ElementByCSS) {
    if (!classOfTank) console.warn("Не передан css-класс танка");

    //тут он выбирает, что отобразить:  tanksArmy.enemyTank.ElementByCSS или tanksArmy.locatorTank.ElementByCSS
    //ElementByCSS для tanksArmy.ourTank.ElementByCSS = null
    if (ElementByCSS) {
        elementDOM.appendChild(ElementByCSS);
        return;
    }

    elementDOM.classList.add(classOfTank);
};

// на самом деле она дублирует функцию _showTank
view$1.showTankDirection = function (elementDOM, direction) {

    // в аргументе direction принимает одно из значений
    // const CSSCLASSFOR_TO_TOP = "ToTop";
    // const CSSCLASSFOR_TO_BOTTOM = "ToBottom";
    // const CSSCLASSFOR_TO_LEFT = "ToLeft";
    // const CSSCLASSFOR_TO_RIGHT = "ToRight";

    elementDOM.classList.add(direction);
};

view$1.clearTankDirection = function (elementDOM, CSSCLASSFOR_TO_RIGHT, CSSCLASSFOR_TO_TOP, CSSCLASSFOR_TO_BOTTOM, CSSCLASSFOR_TO_LEFT) {
    //и надо очистить клетку от css-класса направления,
    // тут одно из 4-х направлений, очищаем от всех
    elementDOM.classList.remove(CSSCLASSFOR_TO_RIGHT);
    elementDOM.classList.remove(CSSCLASSFOR_TO_TOP);
    elementDOM.classList.remove(CSSCLASSFOR_TO_BOTTOM);
    elementDOM.classList.remove(CSSCLASSFOR_TO_LEFT);
};

//функция представления (очищает клетку от любого танка)
view$1.deleteTank = function (elementDOMforDeleting, classOfTank) {
    if (!classOfTank) console.warn("Не передан css-класс танка");
    elementDOMforDeleting.classList.remove(classOfTank);
};

let viewMovingModule = {};

viewMovingModule.consoleLog1 = function (...rest) {};

viewMovingModule.getRandomIntFromIntervalInArray = function (min, max, numberOfRandomsRegiered, ...rest) {
    var arrOfResults = [];

    while (arrOfResults.length < numberOfRandomsRegiered) {

        var result = Math.floor(Math.random() * (max - min + 1) + min);

        if (result == rest[0] || result == rest[1] || result == rest[2] || result == rest[3] || result == rest[4] || result == rest[5]) {
            continue;
        }

        /* console.log("result" + result);
         console.log(arrOfResults.length); */

        if (arrOfResults.indexOf(result) == -1) {
            arrOfResults.push(result);
        }
        //можно применить arr.includes(elem)  из ES7 вместо arrOfResults.indexOf(result) == -1
    }

    return arrOfResults;
};

viewMovingModule.createDataModelOfField = function (_rowsNumber, _cellsNumber, _cells, CSS_Classses_ChangedforInsideCell, CSS_Classses_ChangedforFirstInRowInsideCell, ID_ChangedforBullet, CSS_Classses_ChangedforBullet /* , viewcreateElement, viewcreateElementOfBullet */) {
    var _rowsNumberFinal = _rowsNumber || 20;
    var _cellsNumberFinal = _cellsNumber || 20;

    for (let i = 0; i < _rowsNumberFinal; i++) {
        _cells[i] = [];
        for (let j = 0; j < _cellsNumberFinal; j++) _cells[i].push({
            /* в каждую ячейку двумерного массива пушим объект, в котором
             два DOM-объекта: пуля и танк, изначально hidden */
            value: null,
            //создание dom-элемента осуществим функцией из модуля view
            dom: view.createElement(i, j, CSS_Classses_ChangedforInsideCell /* это "inside-cell" */
            , CSS_Classses_ChangedforFirstInRowInsideCell /* это"clear-both inside-cell" */
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

    /*  view.consoleLog("вот массив с моделью поля, в нем DOM-элементы вложены,
     но не отображены, пока не отданы в модуль view для отображения:");
     view.consoleDir(_cells); */
};

const _CELL_SIZE = 20;
const CSSCLASSFOR_OUR_TANK = "cellWithOurTank";
//вот три класса, в которых бэкграундзадает разные направления   танка
const CSSCLASSFOR_TO_TOP = "ToTop";
const CSSCLASSFOR_TO_BOTTOM = "ToBottom";
const CSSCLASSFOR_TO_LEFT = "ToLeft";
const CSSCLASSFOR_TO_RIGHT = "ToRight";
const CSSCLASSFOR_ENEMY_TANK = "cellWithEnemyTank";

var modelData = {};
//import  {utils}  from "./utils.js";

modelData.gameState = null;
modelData.start = null; // тут хранить время начала
modelData.handle = null; // через эту глобальную переменную будем останавилвать вот так: clearInterval(handle);
modelData.timePassed = null; //тут будем хранить время, прошедшее ДО паузы, чтоб учитывать в общем времени игру ДО паузы через pauseGame()
modelData.timeOfWholeGame = 0; // тут хранить длительность всей игры с учетом пауз
modelData.TIMEOFGAME = 77000000; //сколько будет работать один сеанс игры
modelData.directionOfOurTank = "ToRight"; //тут будем хранить направление танка (куда смотрит), первое значение "ToRight"
modelData.distanceOfShotForEnemy = 10;

//ну там функция именно для канваса создает сама стили, потому добавление этого id визуально не имеет значения, хотя и присваивает css правила для   #explosion
modelData.IDforThisExplosion = "explosion";

//это характеристики взрыва при поражении танка (они по умолчанию заданы )
modelData.particlesNumberOfExplosionForTank = 55;

modelData.colorOfExplosionForTank = ["#b3b3b3", "#4d4d4d", "#fa0000", "#570000", "#fa0000", "#fa0000", "#fa0000", "#4d4d4d", "#ffffff"];

modelData.particlesNumberOfExplosionForBorder = 47;
modelData.colorOfExplosionForTopBorder = ["#FCB150", "#902B2B", "#FCB150", "#A63232", "#A62626", "#FD5039", "#C12F2A", "#FF6540", "#FCB150"];

modelData.colorOfExplosionForRightBorder = ["#cc324b", "#902B2B", "#cc324b", "#A63232", "#A62626", "#FD5039", "#C12F2A", "#FF6540", "#cc324b"];

modelData.colorOfExplosionForBottomBorder = ["#11A8AB", "#902B2B", "#11A8AB", "#A63232", "#A62626", "#FD5039", "#C12F2A", "#FF6540", "#11A8AB"];

modelData.colorOfExplosionForLeftBorder = ["#4fc4f6", "#902B2B", "#4fc4f6", "#A63232", "#A62626", "#FD5039", "#C12F2A", "#FF6540", "#4fc4f6"];

var _cells = []; // в массиве _cells  будет модель "чистых" данных о том, что в клетках
var tanksArmy = {};
tanksArmy.ourTank = null;
tanksArmy.enemyTank = null;
tanksArmy.locatorTank = null;

var infoPanelText = ` 
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
 `;

//тут  css-классы, их достаточно изменить в модели и css-файле
var CSS_Classses_Changed = {};
CSS_Classses_Changed.forWrapper = "outside-cell";
CSS_Classses_Changed.forInfoPanel = "info";
CSS_Classses_Changed.forInsideCell = "inside-cell";
CSS_Classses_Changed.forFirstInRowInsideCell = "clear-both inside-cell";
CSS_Classses_Changed.forBullet = "shotMark";
CSS_Classses_Changed.forVisibleBullet = "shotMark displayAsBlock";
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
modelDataOfShot.shotState = true; //в shotState храним состояние "в состоянии выстрела" или "не в состоянии выстрела", чтоб не стрелять повторно в момент совершаемого выстрела
modelDataOfShot.shotHitOrOut = "out"; //в shotInOrOut храним состояние "летит в цель" (Hit) или "в молоко, т.е. в край поля" (Out)
modelDataOfShot.shotDirection = null;
modelDataOfShot.handleGun1; // аналог handle в функции  движения танка (но тут для пули)
modelDataOfShot.momentOfBulletStart; // аналог start в функции  движения танка (но тут для пули)
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
modelData.messageCanCrushLocator = "Можно раздавить локатор врага, наехав на него! Сейчас наш танк на одной линии с ним.";
modelData.messageOnDiagonalAndNear = "по диагонали приблизился";

//готовые массивы с css-классами для отрисовки фигурок транспортных средств через css
modelData.arrayOfArgsForCSSofLocator = ["main", "tank-locator", "top-locator", "pipe-locator", "pipeIn-locator", "middle-locator", "bottom-locator", "wheel-locator", "wheel-locator", "dot-locator", "dotIn-locator", "dot-locator", "dotIn-locator", "locator"];
modelData.arrayOfArgsForCSSofLocatorOnDanger = ["main", "tank-locator", "top-locator", "pipe-locator pipe-locator-inDanger", "pipeIn-locator-inDanger", "middle-locator", "bottom-locator", "wheel-locator", "wheel-locator", "dot-locator", "dotIn-locator", "dot-locator", "dotIn-locator", "locator"];
modelData.arrayOfArgsForCSSofHelicopter = ["main", "helicopterBody", "helicopterTop", "topBlade topBladeSpinning", "displayNone", "windowInHead", "helicopterTail", "tailContainer", "displayNone", "displayNone", "displayNone", "displayNone", "displayNone", "helicopter"];
modelData.arrayOfArgsForCSSofAdvertsTank = ["main", "tank-tiny", "top-tiny", "pipe-tiny", "pipeIn-tiny", "middle-tiny", "bottom-tiny", "wheel-tiny wheel-rotate-slowly-tiny", "wheel-tiny wheel-rotate-tiny", "dot-tiny", "dotIn-tiny", "dot-tiny", "dotIn-tiny"];

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
modelFunctions.renewModelTanksPositions = function (tank /* в первом аргументе  принимает  tanksArmy.enemyTank || tanksArmy.ourTank */
, newRow, newCell) {
    tank.i = tank.i + newRow;
    tank.j = tank.j + newCell;
};

//импортируем из других модулей объекты и переменные
//после обработки в gulp можем объдинить в один js-файла
//в разных модулях отображение поддерживает пока что только последний FireFox (там флаг надо включить для поддержки)
var controllerFor_showTankFirstTime = function (kindOfTank, /* принимаем tanksArmy.ourTank или tanksArmy.enemyTank или tanksArmy.locatorTank, созданные modelFunctions.createTanksByConstructor*/
classOfTank /* это css-класс для клетки с танком */) {

    //контроллер взял из модели ТАНКОВ данные о местоположении танка:
    var i = kindOfTank.i;
    var j = kindOfTank.j;

    //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ:
    var element = _cells[i][j].dom;

    //отдал для отображения данные двух моделей. В тертьем аргументе отдает   tanksArmy.enemyTank.ElementByCSS или tanksArmy.locatorTank.ElementByCSS    
    view$1.showTank(element, classOfTank, kindOfTank.ElementByCSS);

    //в modelData.directionOfOurTank храним направление башни нашего танка, у него возможные значения "ToTop" "ToBottom" "ToLeft" "ToRight":
};

//эта функция обновляет местоположение танка, давая случайное местоположение в поле. 
//Для нашего танка tanksArmy.ourTank она применяется тоже (путем передачи функции в тот модуль), в modelFunctions.createTanksByConstructor механизм генерации случайного местоположения использует эту функцию.
//при первом создании объектов это местоположение генерируется функцией modelFunctions.createTanksByConstructor 
var generateNewPositionForNewTank = function (venicleForRandomPosition /* принимает tanksArmy.enemyTank или tanksArmy.locatorTank*/) {

    //в третьем аргументе указываем, сколько значений в полученном массиве нам надо
    var tempArr = viewMovingModule.getRandomIntFromIntervalInArray(0, _CELL_SIZE - 1, 2, tanksArmy.ourTank.i, tanksArmy.ourTank.j, tanksArmy.locatorTank.i, tanksArmy.locatorTank.j, tanksArmy.enemyTank.i, tanksArmy.enemyTank.j);

    venicleForRandomPosition.i = tempArr[0];
    venicleForRandomPosition.j = tempArr[1];
};

//реализация плавного движения танка (перетаскивание клетки с бэкграндом элемента (например, влево: путем изменения  margin-left: 0px; до -20px в течении 0.3 секунды). 
//Также происходит сокрытие границ клеток, через которые происходит движение.
var realizationOfFlowMoving = function (tank, newRow, newCell, classOfTank, i, j, _cells$$1) {

    /* разворот стоящего на месте танка */
    if (newCell === 0 && newRow === 0) {
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToTurn, 300);
        }
    }

    if (newCell === 1 && newRow === 0) {

        // скрываем границы соседнего элемента, чтоб при переезде танка ему не надо было "подлазить" под линию границы
        if (_cells$$1[i][j + 1]) {
            view$1.addAndRemoveCssClassInTime(_cells$$1[i][j + 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveRightOneCell, 300);

        view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToRight, 300);
        }
    }
    if (newCell === 0 && newRow === -1) {

        // скрываем границы соседнего элемента, чтоб при переезде танка ему не надо было "подлазить" под линию границы
        if (_cells$$1[i - 1][j]) {
            view$1.addAndRemoveCssClassInTime(_cells$$1[i - 1][j].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveTopOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToTop, 300);
        }
        view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
    }
    if (newCell === 0 && newRow === 1) {

        // скрываем границы соседнего элемента, чтоб при переезде танка ему не надо было "подлазить" под линию границы
        if (_cells$$1[i + 1][j]) {
            view$1.addAndRemoveCssClassInTime(_cells$$1[i + 1][j].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveBottomOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToBottom, 300);
        }
        view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
    }
    if (newCell === -1 && newRow === 0) {

        if (_cells$$1[i][j - 1]) {
            view$1.addAndRemoveCssClassInTime(_cells$$1[i][j - 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveLeftOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToLeft, 300);
        }
        view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
    }

    if (newCell === -1 && newRow === -1) {

        if (_cells$$1[i - 1][j - 1]) {
            view$1.addAndRemoveCssClassInTime(_cells$$1[i - 1][j - 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveTopLeftOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToTop, 300);
        }
        view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
    }

    if (newCell === 1 && newRow === -1) {

        if (_cells$$1[i - 1][j + 1]) {
            view$1.addAndRemoveCssClassInTime(_cells$$1[i - 1][j + 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveTopRightOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToTop, 300);
        }
        view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
    }

    if (newCell === 1 && newRow === 1) {

        if (_cells$$1[i + 1][j + 1]) {
            view$1.addAndRemoveCssClassInTime(_cells$$1[i + 1][j + 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveBottomRightOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToBottom, 300);
        }
        view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
    }

    if (newCell === -1 && newRow === 1) {

        if (_cells$$1[i + 1][j - 1]) {
            view$1.addAndRemoveCssClassInTime(_cells$$1[i + 1][j - 1].dom, CSS_Classses_Changed.forHiddenOutline, 300);
        }

        view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.moveBottomLeftOneCell, 300);
        if (classOfTank === CSSCLASSFOR_OUR_TANK) {
            view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.ToBottom, 300);
        }
        view$1.addAndRemoveCssClassInTime(tank, CSS_Classses_Changed.forMovingBackground, 300);
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

    view$1.deleteTank(elementForDeleting, classOfTank);

    //реализация плавного движения танка
    realizationOfFlowMoving(elementForDeleting, newRow, newCell, classOfTank, i, j, _cells);

    //удаляем значок прицела на вражеском танке, на случай, если тот уехал раньше, чем значок сам исчез
    view$1.deleteTank(elementForDeleting, CSS_Classses_Changed.forTarget);

    //и очищаем значок радара или прицела на случай, если наш танк ходит (чтоб радар не оставался на месте танка после его ухода с этой клетке)
    var elementBulletForDeleting = _cells[i][j].bullet.domBullet;
    if (elementBulletForDeleting) {
        //убираем с _cells[i][j].dom эффект swing (если танк качается и хочет пойти, то он перестаёт качаться)
        view$1.deleteTank(_cells[i][j].dom, CSS_Classses_Changed.swingEffect);
        view$1.deleteTank(elementBulletForDeleting, CSS_Classses_Changed.forRadar1);
    }

    if (kindOfTank === tanksArmy.ourTank) {
        setTimeout(function () {
            view$1.clearTankDirection(elementForDeleting, CSSCLASSFOR_TO_RIGHT, CSSCLASSFOR_TO_TOP, CSSCLASSFOR_TO_BOTTOM, CSSCLASSFOR_TO_LEFT);
        }, 300);
    }

    //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ (для вставки в неё танка), newRow и newCell- это дельта сдвига:
    var elementForNewShowing = _cells[i + newRow][j + newCell].dom;

    //отдал для отображения данные двух моделей
    if (kindOfTank === tanksArmy.enemyTank) {

        setTimeout(function () {
            view$1.showTank(elementForNewShowing, classOfTank, tanksArmy.enemyTank.ElementByCSS);
        }, 300);
    }

    //(и из модели о направлении танка directionOfOurTank взял направление):
    if (kindOfTank === tanksArmy.ourTank) {

        setTimeout(function () {

            view$1.showTankDirection(elementForNewShowing, modelData.directionOfOurTank);
        }, 300);
    }
};

//функция проверяет, будут ли танки на одной горизонтали после смещения по горизонтали на deltaOfMovingGoriz
var isOnTheSameGorizontalLine = function (tank1, tank2, deltaOfMovingGoriz) {
    if (tank1.i + deltaOfMovingGoriz === tank2.i) return true;
};

//функция проверяет, будут ли танки на одной вертикали после смещения по вертикали на deltaOfMovingVert
var isOnTheSameVerticalLine = function (tank1, tank2, deltaOfMovingVert) {
    if (tank1.j + deltaOfMovingVert === tank2.j) return true;
};

//функция проверяет, в соседней или нет (в том числе по диагонали) клетке по значению обоих осей (в данном случае по диагонали имеет значение проверка)
var isNear = function (tank1, tank2, deltaOfMovingGoriz, deltaOfMovingVert) {
    if (Math.abs(tank1.j + deltaOfMovingVert - tank2.j) < 2 && Math.abs(tank1.i + deltaOfMovingGoriz - tank2.i) < 2) {
        return true;
    }
};

//если ближе количества  клеток modelData.distanceOfShotForEnemy, то вражеский танк поражает излучением
var isShotDistanceBetweenTanks = function (tank1, tank2, deltaOfMoving, lineGorOrVert) {
    if (lineGorOrVert === "GorizontalLine" && Math.abs(tank1.j + deltaOfMoving - tank2.j) < modelData.distanceOfShotForEnemy) {

        return true;
    }
    if (lineGorOrVert === "VerticalLine" && Math.abs(tank1.i + deltaOfMoving - tank2.i) < modelData.distanceOfShotForEnemy) {

        return true;
    }
};

//визуальный эффект радара-ударного излучения вертолета
var showRadarEffectOnEnemyVenicle = function () {
    view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forLocator, 1100);
};

//эффекты удара по нашему танку
var showRadarEffect = function (newRowForEnemy, newCellForEnemy, newRowForOur, newCellForOur, timeOfExplosion = 900) {
    var temporaryElement = _cells[tanksArmy.ourTank.i + newRowForOur][tanksArmy.ourTank.j + newCellForOur].dom;
    //эффект на нашем танке от поражения излучением вертолета (дает покачивание)
    view$1.addAndRemoveCssClassInTime(temporaryElement, CSS_Classses_Changed.swingEffect, 1000);

    view$1.addAndRemoveExplosion(temporaryElement,
    //CSS_Classses_Changed.forExplosionBig, //"explosion"
    modelData.IDforThisExplosion, timeOfExplosion, //по умолчанию он timeOfExplosion=900
    modelData.particlesNumberOfExplosionForTank, modelData.colorOfExplosionForTank);

    //эффект на вражеском танке
    //    view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i + newRowForEnemy][tanksArmy.enemyTank.j + newCellForEnemy].dom, "opacity", 300);

    setTimeout(showRadarEffectOnEnemyVenicle, //Первым аргументом setTimeout может быть ан.ф, код, имя FD или FE
    200);
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

    //это запрет цели наезжать на наш танк при хаотичном её движении, для этого смещение в случае наезда задается как ноль по обеим координатам
    // а при следующем смещении она поедет дальше, следующие случайные координаты её передвижения не совпадут/ лишнюю секунду цель простоит на месте тут
    if (isOnTheSameVerticalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newCell) && isOnTheSameGorizontalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newRow)) {
        view$1.consoleLog(modelData.messageEnemyPressedUs /* "цель пыталась наехать  на наш танк, двойная потеря здоровья нашего танка!" */);

        showRadarEffect(0, 0, 0, 0);
        modelFunctions.minusHealth(tanksArmy.ourTank);
        modelFunctions.minusHealth(tanksArmy.ourTank);

        setTimeout(function () {
            view$1.consoleLog(modelData.messageHealthOur /* "наше здоровье = " */, tanksArmy.ourTank.health);
        }, 1100);

        return;
    }

    if (isOnTheSameVerticalLine(tanksArmy.enemyTank, tanksArmy.locatorTank, newCell) && isOnTheSameGorizontalLine(tanksArmy.enemyTank, tanksArmy.locatorTank, newRow)) {
        view$1.consoleLog(modelData.messageEnemyPressedLocator /* "цель пыталась наехать  на локатор,  потеря здоровья локатора!" */);

        showRadarEffectOnEnemyVenicle();
        modelFunctions.minusHealth(tanksArmy.locatorTank);

        setTimeout(function () {
            view$1.consoleLog(modelData.messageHealthOfLocator /* "здоровье локатора = " */, tanksArmy.locatorTank.health);
        }, 1100);

        return;
    }

    //срабатывание прицела, если возможен выстрел по горизонтали(вследствие движения танка противника)
    if (isOnTheSameGorizontalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newRow) && !isShotDistanceBetweenTanks(tanksArmy.enemyTank, tanksArmy.ourTank, newCell, "GorizontalLine")) {

        setTimeout(function () {
            view$1.consoleLog(modelData.messageSameGorizontal /* "на одной горизонтали ввиду передвижения вражеского танка!" */);
        }, 1100);

        view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i + newRow][tanksArmy.enemyTank.j + newCell].dom, CSS_Classses_Changed.forTarget, 500);
        //происходит добавление (заранее, до передвижения врага в эту клетку) CSS_Classses_Changed.forTarget (в css это .target:before), это значок прицела
    }

    //срабатывание прицела, если возможен выстрел по вертикали (вследствие движения танка противника)
    if (isOnTheSameVerticalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newCell) && !isShotDistanceBetweenTanks(tanksArmy.enemyTank, tanksArmy.ourTank, newRow, "VerticalLine")) {

        setTimeout(function () {
            view$1.consoleLog(modelData.messageSameVertical /* "на одной вертикали  ввиду передвижения вражеского танка!" */);
        }, 1100);

        view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i + newRow][tanksArmy.enemyTank.j + newCell].dom, CSS_Classses_Changed.forTarget, 500);
        //происходит добавление (заранее, до передвижения врага в эту клетку) CSS_Classses_Changed.forTarget (в css это .target:before), это значок прицела
    }

    //срабатывание поражающего излучения врага, если возможен выстрел по горизонтали. newRow - это будущее смещение по горизонтали
    if (isOnTheSameGorizontalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newRow) && isShotDistanceBetweenTanks(tanksArmy.enemyTank, tanksArmy.ourTank, newCell, "GorizontalLine")) {

        setTimeout(function () {
            view$1.consoleLog(modelData.messageSameGorizontalAndAttack /* "на одной горизонтали и приблизился на расстояние поражения " */ + modelData.distanceOfShotForEnemy);
        }, 1100);

        showRadarEffect(newRow, newCell, 0, 0);
        modelFunctions.minusHealth(tanksArmy.ourTank);

        setTimeout(function () {
            view$1.consoleLog(modelData.messageHealthOur /* "наше здоровье = " */, tanksArmy.ourTank.health);
        }, 1100);
    }

    //срабатывание поражающего излучения врага, если возможен выстрел по вертикали
    if (isOnTheSameVerticalLine(tanksArmy.enemyTank, tanksArmy.ourTank, newCell) && isShotDistanceBetweenTanks(tanksArmy.enemyTank, tanksArmy.ourTank, newRow, "VerticalLine")) {

        setTimeout(function () {
            view$1.consoleLog(modelData.messageSameVerticalAndAttack /* "враг на одной вертикали и приблизился на расстояние поражения " */ + modelData.distanceOfShotForEnemy);
        }, 1100);

        showRadarEffect(newRow, newCell, 0, 0);
        modelFunctions.minusHealth(tanksArmy.ourTank);

        setTimeout(function () {
            view$1.consoleLog(modelData.messageHealthOur /* "наше здоровье = " */, tanksArmy.ourTank.health);
        }, 1100);
    }

    //срабатывание поражающего излучения врага, если по диагонали ближе 1 клетки
    if (isNear(tanksArmy.enemyTank, tanksArmy.ourTank, newRow, newCell)) {

        setTimeout(function () {
            view$1.consoleLog(modelData.messageOnDiagonalAndNear /* "по диагонали приблизился вражина!" */);
        }, 0);

        showRadarEffect(newRow, newCell, 0, 0, 100); // пятый аргумент timeOfExplosion, он факультативный, по умочанию он 900
        modelFunctions.minusHealth(tanksArmy.ourTank);

        setTimeout(function () {
            view$1.consoleLog(modelData.messageHealthOur /* "наше здоровье = " */, tanksArmy.ourTank.health);
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

//вспомогательная функция для _createModelOfThisShotController, принимает tanksArmy.enemyTank или tanksArmy.locatorTank
var colorToDamaged = function (aimFromTanksArmy) {

    /*  view.removeCssClassFromAllCells(_cells, CSSCLASSFOR_ENEMY_TANK);
     */

    //вот так взрыв добавляем
    view$1.addAndRemoveExplosion(_cells[aimFromTanksArmy.i][aimFromTanksArmy.j].dom, modelData.IDforThisExplosion, 1000);

    //вот так удаляем у вертолета излучения радара (он взорвался, ему незачем дальше излучать, особенно если он успеет заново появится после своей гибели)
    view$1.removeCssClass(_cells[aimFromTanksArmy.i][aimFromTanksArmy.j].dom, CSS_Classses_Changed.forLocator);

    /*  var showRadarEffectOnEnemyVenicle = function () {
     view.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forLocator, 1100);
     } */
};

var hideDamaged = function () {

    setTimeout(function () {
        //и надо удалить вертолет, берем из модели его id "helicopter"
        view$1.removeElementById(ID_Changed.forHelicopter);
    }, 400);
};

//вспомогательная функция для _createModelOfThisShotController
var isTargetedWell = function (ourTank, enemyTank) {
    // если танк-враг на одном ряду с нашим, то пункт поражения

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
            view$1.consoleLog(modelData.messageItsTargeted /* "цель захвачена нашим прицелом! удар по столбцу: " */
            , _cells[ourTank.i][ourTank.j].bullet.finalPosition_J);
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

        view$1.consoleLog("!цель захвачена! удар по столбцу: ", _cells[ourTank.i][ourTank.j].bullet.finalPosition_J);

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

        view$1.consoleLog("!цель захвачена! удар по столбцу: ", _cells[ourTank.i][ourTank.j].bullet.finalPosition_J);

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

        view$1.consoleLog("!цель захвачена! удар по столбцу: ", _cells[ourTank.i][ourTank.j].bullet.finalPosition_J);

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

        view$1.consoleLog("!цель захвачена! удар по столбцу: ", _cells[ourTank.i][ourTank.j].bullet.finalPosition_J);

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

        view$1.consoleLog("цель захвачена! удар по столбцу: ", _cells[ourTank.i][ourTank.j].bullet.finalPosition_J);

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
    view$1.toZero(bulletDOMElement);
};

//вспомогательная функция для _createModelOfThisShotController, контролирует отрисовку полета, разрыва пули и сброс данных о пули в модели данных
// bulletDOMElement - это _cells[tanksArmy.ourTank.i][tanksArmy.ourTank.j].bullet.domBullet
var drawBulletTrajectory = function ( /* distanceOfShot, */bulletDOMElement, /* positionFrom, */finalDistanceOfShot, bulletValueInShotController, speedOfBullet) {

    //отдаем в view-модель для показа (путем добавления css-класса): происходит добавление класса displayAsBlock, т.е. display: block вместо display: none
    view$1.setCssClass(bulletDOMElement, CSS_Classses_Changed.forVisibleBullet);

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
            view$1.toright(bulletDOMElement, timePassedInFlightBullet, speedOfBullet);
        }
        if (modelDataOfShot.shotDirection === "left") {
            view$1.toleft(bulletDOMElement, timePassedInFlightBullet, speedOfBullet);
        }
        if (modelDataOfShot.shotDirection === "bottom") {
            view$1.tobottom(bulletDOMElement, timePassedInFlightBullet, speedOfBullet);
        }
        if (modelDataOfShot.shotDirection === "top") {
            view$1.totop(bulletDOMElement, timePassedInFlightBullet, speedOfBullet);
        }

        /* (timePassedInFlightBullet) / 2) - это количество пикселей уже пройденных пулей, так определяет view.toright*/
        /* finalDistanceOfShot - это количество пикселей для пролета, получено умножением количества клеток на 20 (20 - это размер стороны квадрта клетки) */
        //далее 4 блока if (различаются только направлением полета пули: вправо, влеко, вверх, вниз)
        if (timePassedInFlightBullet / speedOfBullet >= finalDistanceOfShot && modelDataOfShot.shotDirection === "right") {
            view$1.consoleLog("долетел!");
            clearInterval(modelDataOfShot.handleGun1); // конец через столько-то секунд
            /*  finalDistanceOfShot = null;
             positionFrom = null;
             distanceOfShot = null; */
            view$1.setCssClass(bulletDOMElement, CSS_Classses_Changed.forBullet);
            //bulletDOMElement.className = CSS_Classses_Changed.forBullet; // то есть невидимый
            var targetCell = _cells[bulletValueInShotController.finalPosition_I][bulletValueInShotController.finalPosition_J];

            if (modelDataOfShot.shotHitOrOut === "hit") {
                colorToDamaged(tanksArmy.enemyTank);
                hideDamaged();

                modelFunctions.minusHealth(tanksArmy.enemyTank);
                view$1.consoleLog(modelData.messageHealthOfEnemy /* "здоровье tanksArmy.enemyTank = " */, tanksArmy.enemyTank.health);

                view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.moveRight, 1000);
                view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forMovingBackground, 1000);

                if (_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j + 1]) {
                    view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j + 1].dom, CSS_Classses_Changed.forHiddenOutline, 1000);
                }

                generateNewPositionForNewTank(tanksArmy.enemyTank);
                clearSettingsOfGun(bulletValueInShotController, bulletDOMElement);
                return; //если уже есть попадание в танк , то к бортику снаряд не летит, потому выходим из функции
            }

            //эта  функция принимает dom-элемент, сss-класс и время, которое этот сss-класс висит на элементе
            // используем её для случаев "показался и исчез через секунду" (в данном случае взрыв)
            // view.addAndRemoveCssClassInTime(targetCell.dom, CSS_Classses_Changed.forExplosion, 300);

            //добавление этого класса отдельной функцией, потому что ею надо еще и удалить созданные при взрыве вложенные элементы
            //принимает характеристики взрыва при ударе   снаряда о бортик, последние два аргумента заменяют значения по умолчанию
            view$1.addAndRemoveExplosion(targetCell.dom, modelData.IDforThisExplosion, 1000, modelData.particlesNumberOfExplosionForBorder, modelData.colorOfExplosionForRightBorder);

            clearSettingsOfGun(bulletValueInShotController, bulletDOMElement);
        }

        if (timePassedInFlightBullet / speedOfBullet >= finalDistanceOfShot && modelDataOfShot.shotDirection === "left") {

            clearInterval(modelDataOfShot.handleGun1); // конец через столько-то секунд
            /*    finalDistanceOfShot = null;
             positionFrom = null;
             distanceOfShot = null; */

            view$1.setCssClass(bulletDOMElement, CSS_Classses_Changed.forBullet);
            //bulletDOMElement.className = CSS_Classses_Changed.forBullet; // то есть невидимый

            var targetCell2 = _cells[bulletValueInShotController.finalPosition_I][bulletValueInShotController.finalPosition_J];

            if (modelDataOfShot.shotHitOrOut === "hit") {
                colorToDamaged(tanksArmy.enemyTank);
                hideDamaged();

                modelFunctions.minusHealth(tanksArmy.enemyTank);
                view$1.consoleLog(modelData.messageHealthOfEnemy /* "здоровье tanksArmy.enemyTank = " */, tanksArmy.enemyTank.health);
                view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.moveLeft, 1000);
                view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forMovingBackground, 1000);

                if (_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j - 1]) {
                    view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j - 1].dom, CSS_Classses_Changed.forHiddenOutline, 1000);
                }

                generateNewPositionForNewTank(tanksArmy.enemyTank);
                clearSettingsOfGun(bulletValueInShotController, bulletDOMElement);
                return; //если уже есть попадание в танк, то к бортику снаряд не летит, потому выходим из функции
            }

            //эта  функция принимает dom-элемент, сss-класс и время, которое этот сss-класс висит на элементе
            // используем её для случаев "показался и исчез через секунду" (в данном случае взрыв)
            //view.addAndRemoveCssClassInTime(targetCell2.dom, CSS_Classses_Changed.forExplosion, 300);

            //принимает характеристики взрыва при ударе   снаряда о бортик, последние два аргумента заменяют значения по умолчанию
            view$1.addAndRemoveExplosion(targetCell2.dom, CSS_Classses_Changed.forExplosionBig, 1000, modelData.particlesNumberOfExplosionForBorder, modelData.colorOfExplosionForLeftBorder);
            clearSettingsOfGun(bulletValueInShotController, bulletDOMElement);
        }

        if (timePassedInFlightBullet / speedOfBullet >= finalDistanceOfShot && modelDataOfShot.shotDirection === "top") {

            clearInterval(modelDataOfShot.handleGun1); // конец через столько-то секунд
            /*        finalDistanceOfShot = null;
             positionFrom = null;
             distanceOfShot = null; */

            view$1.setCssClass(bulletDOMElement, CSS_Classses_Changed.forBullet);

            //bulletDOMElement.className = CSS_Classses_Changed.forBullet; // то есть невидимый
            var targetCell3 = _cells[bulletValueInShotController.finalPosition_I][bulletValueInShotController.finalPosition_J];

            if (modelDataOfShot.shotHitOrOut === "hit") {
                colorToDamaged(tanksArmy.enemyTank);
                hideDamaged();

                modelFunctions.minusHealth(tanksArmy.enemyTank);
                view$1.consoleLog(modelData.messageHealthOfEnemy /* "здоровье tanksArmy.enemyTank = " */, tanksArmy.enemyTank.health);
                view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.moveTop, 1000);
                view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forMovingBackground, 1000);

                if (_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.i - 1]) {
                    view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i - 1][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forHiddenOutline, 1000);
                }

                generateNewPositionForNewTank(tanksArmy.enemyTank);
                clearSettingsOfGun(bulletValueInShotController, bulletDOMElement);
                return;
            }

            //эта  функция принимает dom-элемент, сss-класс и время, которое этот сss-класс висит на элементе
            // используем её для случаев "показался и исчез через секунду" (в данном случае взрыв)
            // view.addAndRemoveCssClassInTime(targetCell3.dom, CSS_Classses_Changed.forExplosion, 300);

            //принимает характеристики взрыва при ударе   снаряда о бортик, последние два аргумента заменяют значения по умолчанию
            view$1.addAndRemoveExplosion(targetCell3.dom, CSS_Classses_Changed.forExplosionBig, 1000, modelData.particlesNumberOfExplosionForBorder, modelData.colorOfExplosionForTopBorder);

            clearSettingsOfGun(bulletValueInShotController, bulletDOMElement);
        }

        if (timePassedInFlightBullet / speedOfBullet >= finalDistanceOfShot && modelDataOfShot.shotDirection === "bottom") {

            clearInterval(modelDataOfShot.handleGun1); // конец через столько-то секунд


            view$1.setCssClass(bulletDOMElement, CSS_Classses_Changed.forBullet);

            var targetCell4 = _cells[bulletValueInShotController.finalPosition_I][bulletValueInShotController.finalPosition_J];

            if (modelDataOfShot.shotHitOrOut === "hit") {
                colorToDamaged(tanksArmy.enemyTank);
                hideDamaged();

                modelFunctions.minusHealth(tanksArmy.enemyTank);
                view$1.consoleLog(modelData.messageHealthOfEnemy /* "здоровье tanksArmy.enemyTank = " */, tanksArmy.enemyTank.health);
                view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.moveBottom, 1000);
                view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forMovingBackground, 1000);
                if (_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.i + 1]) {
                    view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i + 1][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forHiddenOutline, 1000);
                }

                generateNewPositionForNewTank(tanksArmy.enemyTank);
                clearSettingsOfGun(bulletValueInShotController, bulletDOMElement);
                return; //если уже есть попадание в танк, то к бортику снаряд не летит, потому выходим из функции
            }

            //эта  функция принимает dom-элемент, сss-класс и время, которое этот сss-класс висит на элементе
            // используем её для случаев "показался и исчез через секунду" (в данном случае взрыв)
            // view.addAndRemoveCssClassInTime(targetCell4.dom, CSS_Classses_Changed.forExplosion, 300);


            //принимает характеристики взрыва при ударе   снаряда о бортик, последние два аргумента заменяют значения по умолчанию
            view$1.addAndRemoveExplosion(targetCell4.dom, CSS_Classses_Changed.forExplosionBig, 1000, modelData.particlesNumberOfExplosionForBorder, modelData.colorOfExplosionForBottomBorder);

            clearSettingsOfGun(bulletValueInShotController, bulletDOMElement);
        }
    }, modelDataOfShot.pictureFrequencyOfBullet);

    /* modelData.pictureFrequencyOfBullet дает частоту показа пули при полете (как часто отрисовываются промежуточные представления в полете пули)
     то есть частота в setInterval */
};

//
var _createModelOfThisShotController = function (ourTank, enemyTank) {

    if (!modelDataOfShot.shotState) {
        view$1.consoleLog(modelData.messageCanShootOnlyOneTimeInSec /* "танк может стрелять 1 раз в 1 секунду" */);
        return;
    }

    var bulletDOMElementInShotController = _cells[ourTank.i][ourTank.j].bullet.domBullet;
    var bulletValueInShotController = _cells[ourTank.i][ourTank.j].bullet;

    //ищем танк врага
    isTargetedWell(ourTank, enemyTank); // присвоит shotHitOrOut = "out" если мимо и shotHitOrOut = "hit" если в цель
    // присвоит  shotDirection  направление выстрела, например, "left";

    view$1.addAndRemoveCssClassInTime(_cells[ourTank.i][ourTank.j].dom, CSS_Classses_Changed.swingEffectBullet, 900);

    view$1.consoleLog(modelData.messageWhereShoot, bulletValueInShotController.finalPosition_I, " / ", bulletValueInShotController.finalPosition_J);

    // вместо element1.style.left = 15 + 'px';
    view$1.leftStyleSet(bulletDOMElementInShotController, 15);

    if (modelData.directionOfOurTank === CSSCLASSFOR_TO_RIGHT) {
        var distanceOfShot = (bulletValueInShotController.finalPosition_J - bulletValueInShotController.startPosition_J) * 20;
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

    drawBulletTrajectory( /* distanceOfShot,  */bulletDOMElementInShotController, /* positionFrom, */finalDistanceOfShot, bulletValueInShotController, modelDataOfShot.speedOfBullet);

    setTimeout(function () {

        view$1.consoleLog(modelData.messageWhereShoot, bulletValueInShotController.finalPosition_I, " / ", bulletValueInShotController.finalPosition_J);
    }, 0);
};

//вот этот экспортируемый объект controller будет в методах содержать экспортируемые методы контроллера
let controller = {};

//создает поле, объекты транспортных средств
controller.init = function (container) {

    view$1.createDataModelOfField(_CELL_SIZE, _CELL_SIZE, _cells, CSS_Classses_Changed.forInsideCell, CSS_Classses_Changed.forFirstInRowInsideCell, ID_Changed.forBullet, CSS_Classses_Changed.forBullet /* , view.createElement, view.createElementOfBullet */
    );

    /* тут мы создаем в модуле model: tanksArmy.ourTank,  tanksArmy.enemyTank,  tanksArmy.locatorTank */
    modelFunctions.createTanksByConstructor(viewMovingModule.getRandomIntFromIntervalInArray, /* отдаем функцию из модуля utils */
    _CELL_SIZE /* отдаем размер стороны квадрата поля */
    );

    view$1.createVenicleGraficByCSS(tanksArmy.locatorTank, modelData.arrayOfArgsForCSSofLocator);
    view$1.createVenicleGraficByCSS(tanksArmy.enemyTank, modelData.arrayOfArgsForCSSofHelicopter);
    view$1.createVenicleGraficByCSS(tanksArmy.ourTank, null);
    view$1.createVenicleGraficByCSS(tanksArmy, modelData.arrayOfArgsForCSSofAdvertsTank);

    //отдает для отображения во view-модуль dom-контейнер и данные модели _cells (данные модели
    // получены из модуля model.js модели, т.е. данные модели приходят на отрисовку через посредничество контроллера)
    view$1.renderField(container, _cells, infoPanelText, CSS_Classses_Changed.forWrapper, CSS_Classses_Changed.forInfoPanel, ID_Changed.forWrapper, ID_Changed.forInfoPanel, tanksArmy.ElementByCSS, modelData.messageHaveNoContainer);

    controllerFor_showTankFirstTime(tanksArmy.ourTank, CSSCLASSFOR_OUR_TANK, tanksArmy.ourTank.ElementByCSS /* тут null, так как наш танк рисуем png-картинкой, а не canvas-ом */);
    controllerFor_showTankFirstTime(tanksArmy.enemyTank, CSSCLASSFOR_ENEMY_TANK, tanksArmy.enemyTank.ElementByCSS);
    controllerFor_showTankFirstTime(tanksArmy.locatorTank, CSSCLASSFOR_ENEMY_TANK, tanksArmy.locatorTank.ElementByCSS);
};

var handlePressKey = function (e) {

    if (!modelData.gameState) {

        view$1.consoleLog(modelData.messageCanMoveOnlyOneTimeInSec /* "Сейчас gameState == false, потому танк не может двигаться" */);

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
    view$1.consoleLog(modelData.messageWhenStart, new Date(modelData.start).toString().slice(16, 24));

    clearInterval(modelData.handle); // на всякий случай отменили этот же setInterval, если запущен уже

    modelData.handle = setInterval(function () {
        // вычислить сколько времени прошло с начала анимации
        modelData.timePassed = Date.now() - modelData.start;
        /* view.consoleLog("В этом сеансе прошло   " +  modelData.timePassed / 1000 + "секунд"); */

        if (modelData.timePassed >= modelData.TIMEOFGAME) {
            view$1.consoleLog(modelData.messagePeriodIsEnded /* "Истекло максимальное время сеанса, оно составляло " */, timeOfGame);
            clearInterval(handle); // конец через столько-то секунд
            controller.endGame();
            return;
        }

        _moveToRandomDirection(tanksArmy.ourTank, tanksArmy.enemyTank);
    }, 1000);

    view$1.removeElementById(ID_Changed.forAdvertsTank /* "tiny" */);
};

controller.pauseGame = function () {
    modelData.gameState = false;
    modelData.timeOfWholeGame = modelData.timeOfWholeGame + modelData.timePassed / 1000; // плюсуем время конкрктного сеанса до pauseGame()

    view$1.consoleLog(modelData.messagePause /* "ПАУЗА. До паузы в этом сеансе игры прошло   " */, modelData.timePassed / 1000, modelData.messageSeconds /* " секунд" */);
    view$1.consoleLog(modelData.messageTimeOfGame /* "Сейчас общее время игры   " */, modelData.timeOfWholeGame, modelData.messageSeconds /* " секунд" */);
    // добавляем время, которое прошло перед паузой через pauseGame()
    clearInterval(modelData.handle);
    modelData.timePassed = 0; //обнуляем, чтоб второй раз этот сеанс не был посчитан при вызове   endGame() после  вызова pauseGame()

    /* покажем рекламный танк (он много ресурсов памяти кушает, потому показываем только когда не играем) */
    /*  view.showAdverts(tanksArmy.ElementByCSS); */
};

controller.endGame = function () {
    /* view.consoleLog("gameState = ", modelData.gameState); */
    modelData.gameState = false;
    modelData.timeOfWholeGame = modelData.timeOfWholeGame + modelData.timePassed / 1000; // плюсуем время конкрктного сеанса до endGame()
    clearInterval(modelData.handle);
    if (modelData.timeOfWholeGame) view$1.consoleLog(modelData.messageEnd /* "КОНЕЦ ИГРЫ. Игра длилась " */, modelData.timeOfWholeGame, " сек.");else if (!modelData.timeOfWholeGame) view$1.consoleLog(modelData.messageNoDataRegardingTimeOfGame /* "нет данных о длительности игры" */);
    // start = Date.now();
    modelData.timeOfWholeGame = 0;
    view$1.consoleLog(modelData.messageEndAndCounterToZero /* "конец игры, счетчик времени игры обнулён" */);

    /*  this.init(document.getElementById("forGameContainer")); */
    /* покажем рекламный танк (он много ресурсов памяти кушает, потому показываем только когда не играем) */
    view$1.showAdverts(tanksArmy.ElementByCSS);
};

/* вот движение нашего танка, тут куча if, но в конце функции 
 движение будет инициировано вызовом _controllerFor_showResultOfMoving(tanksArmy.ourTank, newRow, newCell, CSSCLASSFOR_OUR_TANK); */

controller.move = function (direction) {

    if (!modelData.gameState) {

        view$1.consoleLog(modelData.messageCannotMoveNow /* "Опаньки, а танк-то может двигаться 1 раз в секунду" */);
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
        }

    };

    //и вот так вызываем конретную функцию (чтоб не строит пачку условий через if)
    directionOfMove[direction]();

    //не даём выехать за пределы поля
    if (tanksArmy.ourTank.i + newRow > _CELL_SIZE - 1) {
        view$1.consoleLog(modelData.messageOutOfField); //modelData.messageOutOfField = "край поля!";
        return;
    }
    if (tanksArmy.ourTank.j + newCell > _CELL_SIZE - 1) {
        view$1.consoleLog(modelData.messageOutOfField);
        return;
    }
    if (tanksArmy.ourTank.i + newRow < 0) {
        view$1.consoleLog(modelData.messageOutOfField);
        return;
    }
    if (tanksArmy.ourTank.j + newCell < 0) {
        view$1.consoleLog(modelData.messageOutOfField);
        return;
    }

    //если при ходе он давит транспортное средство врага
    if (isOnTheSameVerticalLine(tanksArmy.ourTank, tanksArmy.enemyTank, newCell) && isOnTheSameGorizontalLine(tanksArmy.ourTank, tanksArmy.enemyTank, newRow)) {
        view$1.consoleLog(modelData.messageEnemyCrushed /* "наш танк задавил врага, пятикратная потеря здоровья вертолета и врага, и локатора!" */);

        colorToDamaged(tanksArmy.enemyTank);
        hideDamaged();

        for (var i = 0; i < 5; i++) {
            modelFunctions.minusHealth(tanksArmy.locatorTank);
            modelFunctions.minusHealth(tanksArmy.enemyTank);
        }
        view$1.consoleLog(modelData.messageHealthOfEnemy /* "здоровье tanksArmy.enemyTank = " */
        , tanksArmy.enemyTank.health);

        view$1.consoleLog(modelData.messageHealthOfLocator /* "здоровье tanksArmy.locatorTank = " */
        , tanksArmy.locatorTank.health);
        generateNewPositionForNewTank(tanksArmy.enemyTank);
        modelDataOfShot.shotHitOrOut = "hit";

        controller.pauseGame();
        setTimeout(function () {
            modelDataOfShot.shotHitOrOut = "out";
            controller.startGame();
        }, 2000);
    }

    //если при  ходе он давит локатор
    if (isOnTheSameVerticalLine(tanksArmy.ourTank, tanksArmy.locatorTank, newCell) && isOnTheSameGorizontalLine(tanksArmy.ourTank, tanksArmy.locatorTank, newRow)) {

        view$1.consoleLog(modelData.messageLocatorCrushed /* "наш танк раздавил локатор, двойная потеря здоровья локатора и вертолета!" */);
        colorToDamaged(tanksArmy.locatorTank);
        generateNewPositionForNewTank(tanksArmy.locatorTank);

        //новое местоположение для локатора

        controllerFor_showTankFirstTime(tanksArmy.locatorTank, CSSCLASSFOR_ENEMY_TANK, tanksArmy.locatorTank.ElementByCSS);

        modelFunctions.minusHealth(tanksArmy.enemyTank);
        modelFunctions.minusHealth(tanksArmy.locatorTank);

        view$1.consoleLog(modelData.messageHealthOfLocator /* "здоровье локатора = " */, tanksArmy.locatorTank.health);
        view$1.consoleLog(modelData.messageHealthOfEnemy /* "здоровье противника = " */, tanksArmy.enemyTank.health);

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
    if (isOnTheSameVerticalLine(tanksArmy.ourTank, tanksArmy.locatorTank, newCell) || isOnTheSameGorizontalLine(tanksArmy.ourTank, tanksArmy.locatorTank, newRow) || isNear(tanksArmy.ourTank, tanksArmy.locatorTank, newRow, newCell)) {

        view$1.addCssClassByParalellCssClass(tanksArmy.locatorTank.ElementByCSS, CSS_Classses_Changed.topLocatorDanger /* "top-locator-danger" */
        , CSS_Classses_Changed.topLocator /* ".top-locator" */);

        view$1.addCssClassByParalellCssClass(tanksArmy.locatorTank.ElementByCSS, CSS_Classses_Changed.pipeInLocatorInDanger /* "pipeIn-locator-inDanger" */
        , CSS_Classses_Changed.pipeInLocator /* ".pipeIn-locator" */);

        view$1.addCssClassByParalellCssClass(tanksArmy.locatorTank.ElementByCSS, CSS_Classses_Changed.pipeLocatorInDanger /* "pipe-locator-inDanger" */
        , CSS_Classses_Changed.pipeLocator /* ".pipe-locator" */
        );

        view$1.consoleLog(modelData.messageCanCrushLocator
        /* "Можно раздавить локатор врага, наехав на него! Сейчас наш танк на одной линии с ним." */
        );
    }

    //если не на одной линии с локатором и дальше от локатора более чем на 2 клетки по диагонали
    if (!isOnTheSameVerticalLine(tanksArmy.ourTank, tanksArmy.locatorTank, newCell) && !isOnTheSameGorizontalLine(tanksArmy.ourTank, tanksArmy.locatorTank, newRow) && !isNear(tanksArmy.ourTank, tanksArmy.locatorTank, newRow, newCell)) {

        //функция view.removeCssClassByParalellCssClass принимает DOM-элемент транспортного средства
        // (например, tanksArmy.locatorTank.ElementByCSS), css класс для удаления в конкретном div этого DOM-элемента (CssClass),
        //css класс по которому найти в элементе конкретный div
        //проще говоря: есть div, в который временно добавлялся класс (например, "top-locator-danger"), мы этот "временный" класс удаляем, опираясь на постоянно существующий у этого div класс (например, ".top-locator")

        view$1.removeCssClassByParalellCssClass(tanksArmy.locatorTank.ElementByCSS, CSS_Classses_Changed.topLocatorDanger /* "top-locator-danger" */
        , CSS_Classses_Changed.topLocator /* ".top-locator" */);

        view$1.removeCssClassByParalellCssClass(tanksArmy.locatorTank.ElementByCSS, CSS_Classses_Changed.pipeInLocatorInDanger /* "pipeIn-locator-inDanger" */
        , CSS_Classses_Changed.pipeInLocator /* ".pipeIn-locator" */
        );

        view$1.removeCssClassByParalellCssClass(tanksArmy.locatorTank.ElementByCSS, CSS_Classses_Changed.pipeLocatorInDanger /* "pipe-locator-inDanger" */
        , CSS_Classses_Changed.pipeLocator /* ".pipe-locator" */);
    }

    //срабатывание прицела, если возможен выстрел по горизонтали
    if (isOnTheSameGorizontalLine(tanksArmy.ourTank, tanksArmy.enemyTank, newRow)) {
        view$1.consoleLog(modelData.messageSameGorizontalByUs /* "на одной горизонтали с врагом ввиду нашего передвижения!" */);
        view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.ourTank.i + newRow][tanksArmy.ourTank.j + newCell].bullet.domBullet, CSS_Classses_Changed.forRadar1, 200);
        //эффект на вражеском танке
        view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forTarget, 500);
    }

    //срабатывание прицела если возможен выстрел по вертикали
    if (isOnTheSameVerticalLine(tanksArmy.ourTank, tanksArmy.enemyTank, newCell)) {
        view$1.consoleLog(modelData.messageSameVerticalByUs /* "на одной вертикали с врагом  ввиду нашего передвижения!" */);
        view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.ourTank.i + newRow][tanksArmy.ourTank.j + newCell].bullet.domBullet, CSS_Classses_Changed.forRadar1, 200);
        view$1.addAndRemoveCssClassInTime(_cells[tanksArmy.enemyTank.i][tanksArmy.enemyTank.j].dom, CSS_Classses_Changed.forTarget, 500);
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

controller.init(document.getElementById("id-whole-block-for-game")); //создаём поле, передавая html-контейнер
/* controller.startGame(); */
//controller.pauseGame();


var btn1 = document.getElementById("btn1");
btn1.addEventListener("click", controller.startGame.bind(controller));

/* Внутри обработчика события this ссылается на текущий элемент, то есть на тот, на котором он сработал.
 Потому применяем bind*/

var btn2 = document.getElementById("btn2");
btn2.addEventListener("click", controller.pauseGame.bind(controller));

var btn3 = document.getElementById("btnStop");
btn3.addEventListener("click", controller.endGame.bind(controller));

// exports.controller = controller;
