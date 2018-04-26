let viewMovingModule = {};

viewMovingModule.consoleLog1 = function (...rest) {

};


viewMovingModule.getRandomIntFromIntervalInArray = function (min, max, numberOfRandomsRegiered, ...rest) {
    var arrOfResults = [];

    while (arrOfResults.length < numberOfRandomsRegiered) {

        var result = Math.floor(Math.random() * (max - min + 1) + min);

        if (result == rest[0]
            || result == rest[1]
            || result == rest[2]
            || result == rest[3]
            || result == rest[4]
            || result == rest[5]) {
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


viewMovingModule.createDataModelOfField = function (_rowsNumber, _cellsNumber, _cells,
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


export {viewMovingModule};