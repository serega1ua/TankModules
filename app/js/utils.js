let utils = {};

//генерирует случ.значения в заданном диапазоне
utils.getRandomIntFromInterval = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

//извлекает значение css-свойства
utils.getCssProperty = function (elem, property) {
    return parseFloat(window.getComputedStyle(elem, null).getPropertyValue(property));
};


export {utils};