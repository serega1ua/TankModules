let view = {};
import  {utils}  from "./utils.js";
import  {controller}  from "./controller.js";


view.consoleLog = function (...rest) {
    console.log(rest.join(""));

    /* есть резервный вариант вывода подсказок в панель подсказок на экран игры */
    /* var p = document.createElement("div"); */
    /* p.innerHTML = rest.join(""); */

    /* есть и такой резервный вариант вывода подсказок в панель подсказок на экран игры */
    /* 	var newtext = document.createTextNode(rest.join(""));
     var ul = document.getElementById("infoLine");
     ul.insertBefore(document.createElement("br"), ul.firstChild);
     ul.insertBefore(newtext, ul.firstChild);  *///перед firstChild вставляем

};


view.consoleDir = function (objForConsole) {
    console.dir(objForConsole);
};

view.toZero = function (element1) {
    element1.style.left = 10 + 'px';
    element1.style.top = 10 + 'px';
};

/* TODO В большинстве случаев внешний вид элементов задаётся классами. А JavaScript добавляет или удаляет их. Такой код красив и гибок, дизайн можно легко изменять.
 Свойство style нужно использовать лишь там, где классы не подходят, например если точное значение цвета/отступа/высоты вычисляется в JavaScript.
 */

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

//принимает DOM-элемент, css класс для удаления в этом элементе (CssClass), css класс по которому найти в элементе конкретный div
view.removeCssClassByParalellCssClass = function (element, CssClassToDelete, paralellStaticCssClass) {

    var changingPartOfVenicle = element.querySelector(paralellStaticCssClass);
//может быть возвращен null, потому страхуемся через if
    if (changingPartOfVenicle) {
        changingPartOfVenicle.classList.remove(CssClassToDelete);
    }

};


view.addCssClassByParalellCssClass = function (element, CssClassToAdd, paralellStaticCssClass) {

    var changingPartOfVenicle = element.querySelector(paralellStaticCssClass);
//может быть возвращен null, потому страхуемся через if
    if (changingPartOfVenicle) {
        changingPartOfVenicle.classList.add(CssClassToAdd);
    }

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


view.removeElementByClass = function (classToDelete) {
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
}


view.removeElementById = function (IDtoDelete) {
    var lostedChild = document.getElementById(IDtoDelete);

    if (lostedChild) {
        lostedChild.parentNode.removeChild(lostedChild);
    }
}


view.createDataModelOfField = function (_rowsNumber, _cellsNumber, _cells,
                                        CSS_Classses_ChangedforInsideCell, CSS_Classses_ChangedforFirstInRowInsideCell,
                                        ID_ChangedforBullet, CSS_Classses_ChangedforBullet /* , viewcreateElement, viewcreateElementOfBullet */) {
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

    /*  view.consoleLog("вот массив с моделью поля, в нем DOM-элементы вложены,
     но не отображены, пока не отданы в модуль view для отображения:");
     view.consoleDir(_cells); */
};


//принимает цвета и количество фрагментов взрыва
view.explosion = function (particlesNumber = 47, colors = [
    "#6A0000",
    "#900000",
    "#902B2B",
    "#A63232",
    "#A62626",
    "#FD5039",
    "#C12F2A",
    "#FF6540",
    "#f93801"
], IdOfWrapperDivForExplosion, element) {


    const rad = Math.PI / 180;
    let canvases = [];

    const spring = 1 / 10;
    const friction = 0.85;

    var canvasHeight = 16;
    var canvasWidth = 18;
//particlesNumber = 47;// количество фрагментов взрыва
    var canvasesNumber = 1;// сколько создаем  областей взрыва


    class HTML5canvas { /* that fragment/snippet is taken from https://codepen.io/enxaneta/pen/yvPmLo?page=1& */
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
            element.appendChild(this.div);//в наш самый верхний div-клетку вкладываем
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
            this.center = {x: canvasWidth / 2, y: canvasHeight / 2};
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

}


view.addAndRemoveExplosion = function (element, CssClass /* "explosion" */, TimeOfShowing, NumberOfExplosion, colorOfExplosion) {

    //CssClass "explosion" только информативно нужен.
    /* ID  token must begin with a letter ([A-Za-z]) and may be followed by any number of letters, digits ([0-9]), hyphens ("-"), underscores ("_"), colons (":"), and periods ("."). */
    var tempID = CssClass + "_time_" + (new Date(Date.now()).toString().slice(16, 24)).replace(/[:]/g, "-") + "_number_" + utils.getRandomIntFromInterval(1, 10000);
    //и запомнили ID,  чтоб потом удалить именно этот взрыв
    view.explosion(
        NumberOfExplosion/*  это количество клубов взрыва */,
        colorOfExplosion /* это набор цветов взрыва */,
        tempID /* это временный ID на период взрыва */,
        element /* это div поля, куда вкладываепм взрыв */
    );


    setTimeout(function () {
        //остается элемент со взрывом , потому его удаляем и только его, для этого и генерировали уникальный ID на период TimeOfShowing взрыва

        view.removeElementById(tempID + "divInsideCell");//удалили div, созданный view.explosion

    }, TimeOfShowing);


};

view.addAndRemoveIdInTime = function (element, ID, TimeOfShowing) {

    element.setAttribute("id", ID);


    setTimeout(function () {
        element.removeAttribute("id");
    }, TimeOfShowing);

};

view.toright = function (element, timePassed, speedOfBullet) {
    element.style.left = (timePassed) / speedOfBullet + 'px';
};
view.toleft = function (element, timePassed, speedOfBullet) {
    element.style.left = "-" + (timePassed) / speedOfBullet + 'px';
};
view.tobottom = function (element, timePassed, speedOfBullet) {
    element.style.top = (timePassed) / speedOfBullet + 'px';
};
view.totop = function (element, timePassed, speedOfBullet) {
    element.style.top = "-" + (timePassed) / speedOfBullet + 'px';
};


//функция createElementOfTankGraficByCSS должна принимать разный набор string-аргументов
// и возвращать в зависсимости от  набора полученных аргументов разные танки (вражеский и несколько видов нашего)

//но помещать в одну переменную каждый наш созданный танк (каждый вид)? Чтоб не удалять объект танка?

//эта функция создает dom-элемент фигуры в игре (рисуем html-разметку фигурки js-кодом, что можно было вставлять игру на любую уже имеющуюся страницу)
view.createElementOfTankGraficByCSS = function (rest /* ...rest */ /* elementMainClass,
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
    elementMain.className = rest[0]/* elementMainClass */;
    elementMain.id = rest[13]/* id */;

//создали 	section-tank и вложили  его в main
    var elementSection = document.createElement("section");
    elementSection.className = rest[1]/*  elementSectionClass */;
    elementMain.appendChild(elementSection);

    //создали 	div top
    var elementTop = document.createElement("div");
    elementTop.className = rest[2]/* elementTopClass */;

    //создали div pipe и вложили его в	div top
    var elementPipe = document.createElement("div");
    elementPipe.className = rest[3]/* elementPipeClass */;
    elementTop.appendChild(elementPipe);

    //создали div pipeIn и вложили его в	div pipe
    var elementPipeIn = document.createElement("div");
    elementPipeIn.className = rest[4]/*  elementPipeInClass */;
    elementPipe.appendChild(elementPipeIn);

    // и вложили 	div top  в section-tank
    elementSection.appendChild(elementTop);

    //создали div middle и вложили его в	section-tank
    var elementMiddle = document.createElement("div");
    elementMiddle.className = rest[5]/* elementMiddleClass */;
    elementSection.appendChild(elementMiddle);


    //создали div bottom и вложили его в	section-tank
    var elementBottom = document.createElement("div");
    elementBottom.className = rest[6]/* elementBottomClass */;
    elementSection.appendChild(elementBottom);


    //создали div Wheel1 и вложили его в	bottom
    var elementWheel1 = document.createElement("div");
    elementWheel1.className = rest[7] /* elementWheel1Class */;
    elementBottom.appendChild(elementWheel1);

    //создали div Wheel2 и вложили его в	bottom
    var elementWheel2 = document.createElement("div");
    elementWheel2.className = rest[8]/* elementWheel2Class */;
    elementBottom.appendChild(elementWheel2);

    //создали div Dot1 и вложили его в	elementWheel1
    var elementDot1 = document.createElement("div");
    elementDot1.className = rest[9]/* elementDot1Class */;
    elementWheel1.appendChild(elementDot1);

    //создали div DotIn1 и вложили его в elementDot1
    var elementDotIn1 = document.createElement("div");
    elementDotIn1.className = rest[10]/* elementDotIn1Class */;
    elementDot1.appendChild(elementDotIn1);


    //создали div Dot2 и вложили его в	elementWheel2
    var elementDot2 = document.createElement("div");
    elementDot2.className = rest[11]/* elementDot2Class */;
    elementWheel2.appendChild(elementDot2);

    //создали div DotIn2 и вложили его в elementDot2
    var elementDotIn2 = document.createElement("div");
    elementDotIn2.className = rest[12]/* elementDotIn2Class */;
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

view.createVenicleGraficByCSS = function (venicle /* tanksArmy.locatorTank */, arrayOfArgsForCSS) {

    venicle.ElementByCSS = view.createElementOfTankGraficByCSS(arrayOfArgsForCSS);


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

view.showAdverts = function (ElementOfTankGraficByCSS) {
    document.getElementById("WorldieOfTanksID").appendChild(ElementOfTankGraficByCSS);
}


// view.renderField:
// -получает от контроллера данные о модели поля _cells
// -получает от контроллера данные о тексте инфо-панели infoPanelText
// -получает от контроллера данные о стринг-значения CSS и ID отрисовываемых элементов
// -получает от контроллера данные о html-контейнере, куда вставлять поле боя
// -осуществляет отображение поля, используя appendChild
view.renderField = function (contianer,
                             _cells,
                             infoPanelText,
                             clsforWrapper,
                             clsforInfoPanel,
                             IDforWrapper,
                             IDforInfoPanel,
                             ElementOfTankGraficByCSS) {

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

    /*   info = document.createElement("div");
     info.className = clsforInfoPanel;
     info.id = IDforInfoPanel;
     info.innerHTML = infoPanelText;
     */


    view.removeElementById("buttons-block");
    view.removeElementById("WorldieOfTanksID");
    view.removeElementById("btn1");
    view.removeElementById("btn2");
    view.removeElementById("btnStop");
    view.removeElementById("Start");
    view.removeElementById("Pause");
    view.removeElementById("Stop");

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


    contianer.appendChild(headline);

    ElementOfTankGraficByCSS.id = "tiny";

    headline.appendChild(ElementOfTankGraficByCSS);


    contianer.appendChild(wrapper);
    contianer.appendChild(buttonsBlock);
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


view.showTank = function (elementDOM, classOfTank, ElementByCSS) {
    if (!classOfTank) console.warn("Не передан css-класс танка");

    //тут он выбирает, что отобразить:  tanksArmy.enemyTank.ElementByCSS или tanksArmy.locatorTank.ElementByCSS
    //ElementByCSS для tanksArmy.ourTank.ElementByCSS = null
    if (ElementByCSS) {
        elementDOM.appendChild(ElementByCSS);
        return
    }


    elementDOM.classList.add(classOfTank);


};


// на самом деле она дублирует функцию _showTank
view.showTankDirection = function (elementDOM, direction) {

    // в аргументе direction принимает одно из значений
    // const CSSCLASSFOR_TO_TOP = "ToTop";
    // const CSSCLASSFOR_TO_BOTTOM = "ToBottom";
    // const CSSCLASSFOR_TO_LEFT = "ToLeft";
    // const CSSCLASSFOR_TO_RIGHT = "ToRight";

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