 import {controller, setEventListener}  from "./controller.js";
 //console.log("88888888");
  controller.init(document.getElementById("forGameContainer"));//создаём поле, передавая html-контейнер
  controller.startGame();
 setEventListener();
 //
 // setInterval(function () {
 //     controller.move("left");
 //     console.log("222222222222");
 // }, 2000);
 //
