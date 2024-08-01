import monkeyGame from "./game.js";

document.addEventListener("DOMContentLoaded", () => {
    const $container = document.querySelector("#game");
    monkeyGame($container);
});
