/*draggable element*/

//Lista con las figuras que aparecen en pantalla
const figuresList = [];

const leftBox = document.querySelector("#red");
const middleBox = document.querySelector("#blue");
const rightBox = document.querySelector("#yellow");

//Guarda el ID de la figura arrastrada
var figureID;

//Guarda el Nombre Alternativo de la figura arrastrada
var figureAltName;

//Puntos y mostrarlo en pantalla
var points = 0; 
document.getElementById("points").innerHTML = points;

//Guarda si la figura cae en la caja o no
var droppedInBox = false;

//Guarda cuantos puntos se necesitan para ganar el nivel actual
var pointsToWinLevel = 15;

//Guarda el nivel actual
var level = "Level_1";

//Guardan las veces que aparecen cada figura de manera repetida
var circleRepeated = 0;
var squareRepeated = 0;
var triangleRepeated = 0;

//Velocidad de la animación de las figuras
var animationFrameRate = 10;

//Guarda el "setInterval" que llama a la funcion "switchColorsAlarm"
var swtColInterval;

//Llama a la funcion "SelectFigure" continuamente cada 1.5 segundos
var selFigInterval = setInterval(SelectFigure, 1500);

//Variables de la funcion switchColorsAlarm()
var alarmActiveNum = 0;
var boxIsPink = false;
var boxIsWhite = true;
var boxBackgroundColor = "white";

//Llama a la función que anima las figuras
animate();

//Maneja el dragstart
function dragStart(figure) {
    droppedInBox = false;
    figureID = figure.target.id;
    
    for (let i = 0; i < figuresList.length; i++) { 
        if (figure.target.alt == figuresList[i].alt) figureAltName = figuresList[i].alt
    }

    figure.dataTransfer.setData('text/plain', figure.target.id);
    setTimeout(() => {
        figure.target.classList.add('hide');
    }, 0);
}

//Maneja el dragEnd
function dragEnd () { 
    for (let i = 0; i < figuresList.length; i++) { //Elimina la figura de la lista 
        if (figureAltName == figuresList[i].alt) figuresList.splice(i, 1);
    }
    decreasePoints();
}

/*drop target*/
const boxes = document.querySelectorAll('.box');

boxes.forEach(boxes => { //Agrega los eventos a las cajas
    boxes.addEventListener('dragenter', dragEnter);
    boxes.addEventListener('dragover', dragOver);
    boxes.addEventListener('dragleave', dragLeave);
    boxes.addEventListener('drop', drop);
})

function dragEnter(figure) {
    figure.preventDefault();
    figure.target.classList.add('drag-over');
}

function dragOver(figure) {
    figure.preventDefault();
    figure.target.classList.add('drag-over');
}

function dragLeave(figure) {
    figure.target.classList.remove('drag-over');
}

function drop(figure) {
    //ID de la caja en la que cae la figura
    const boxID = this.id;

    //Si el color de la caja coincide con una figura específica...
    if (boxID == "red" && figureID == "circulo" || 
        boxID == "blue" && figureID == "cuadrado" || 
        boxID == "yellow" && figureID == "triangulo") {
        //Elimina clase "drag-over" de la figura
        figure.target.classList.remove('drag-over');
        
        droppedInBox = true;

        increasePoints();
    }
}

//Selecciona una figura (circulo, cuadrado o triangulo) al azar
function SelectFigure() {
    let randomNum;
    let figureNum = figuresList.length + 1;
    let figureChosen = false;
    
    do {
        randomNum = Math.random();
        
        if (randomNum <= 0.33 && circleRepeated <= 2)
        {
            spawnFigure("circulo.png", "figuraCirculo", "circulo", "Figure" + figureNum);
            circleRepeated++;
            squareRepeated = 0;
            triangleRepeated = 0;
            figureChosen = true;
        }
        else if (randomNum > 0.33 && randomNum < 0.66 && squareRepeated <= 2)
        {
            spawnFigure("cuadrado.png", "figuraCuadrado", "cuadrado", "Figure" + figureNum);
            squareRepeated++;
            circleRepeated = 0;
            triangleRepeated = 0;
            figureChosen = true;
        }
        else if (randomNum >= 0.66 <= triangleRepeated <= 2)
        {
            spawnFigure("triangulo.png", "figuraTriangulo", "triangulo", "Figure" + figureNum);
            triangleRepeated++;
            circleRepeated = 0;
            squareRepeated = 0;
            figureChosen = true;
        }
    } while (!figureChosen);
}

//Hace aparecer la figura seleccionada, establece sus atributos y la añade a su lista correspondiente
function spawnFigure(imageLink, imageClass, imageId, altName) {
    let myFigure = document.createElement("img");
    myFigure.setAttribute("src", "Imagenes/" + imageLink);
    myFigure.setAttribute("class", imageClass);
    myFigure.setAttribute("id", imageId);
    myFigure.setAttribute("width", "100");
    myFigure.setAttribute("height", "100");
    myFigure.setAttribute("alt", altName);
    document.getElementById("IMGPlacer").appendChild(myFigure);
    myFigure.style.position = "absolute"; //La posicion debe ser absoluta para que la fig pueda ser animada
    myFigure.style.left = randomHorizontalPosition(myFigure.width) + "px";
    
    figuresList.push(myFigure);
    addEventToElement();
}

//Añade ".addEventListener" a los elementos de las listas de las figuras
function addEventToElement() {
    let listPos = figuresList.length - 1;

    figuresList[listPos].addEventListener('dragstart', dragStart);
    figuresList[listPos].addEventListener('dragend', dragEnd);
}

//Anima la caída de las figuras
function animate() { 

    setInterval(fallAnimation, 35);
    
    function fallAnimation() {
        
        for (let i = 0; i < figuresList.length; i++) {
            var figurePosition = figuresList[i].offsetTop;

            if (figurePosition >= 1300) {
                figuresList[i].remove();
            } 
            else {
                figurePosition += animationFrameRate; 
                figuresList[i].style.top = figurePosition + "px";
            }
        }
    }
}

//Selecciona la ubicación horizontal en la que aparece la figura, dentro de los límites de aparición
function randomHorizontalPosition(figureWidth) {
    let spawner = document.getElementById("IMGPlacer");
    let randomNum = Math.floor (Math.random() * spawner.offsetWidth);

    if (randomNum < figureWidth) { 
        randomNum += figureWidth;
    }
    else if (randomNum > (spawner.offsetWidth - figureWidth)){
        randomNum -= figureWidth;
    }
    return randomNum;
}

//Intercambia los colores de las cajas
function switchBoxesColors() {
    console.log("***Cambiar colores***");
    let randomNum = Math.floor (Math.random() * 6) + 1;

    console.log("Color cajas: " + boxBackgroundColor);
    console.log("Es rosa: " + boxIsPink);
    console.log("Es blanco: " + boxIsWhite);

    if (randomNum == 1) 
    {
        leftBox.id = "red";
        leftBox.style.color = "red";
        middleBox.id = "blue";
        middleBox.style.color = "blue";
        rightBox.id = "yellow";
        rightBox.style.color = "yellow";
    }
    else if (randomNum == 2) 
    {
        leftBox.id = "red";
        leftBox.style.color = "red";
        middleBox.id = "yellow";
        middleBox.style.color = "yellow";
        rightBox.id = "blue";
        rightBox.style.color = "blue";
    }
    else if (randomNum == 3) 
    {
        leftBox.id = "yellow";
        leftBox.style.color = "yellow";
        middleBox.id = "red";
        middleBox.style.color = "red";
        rightBox.id = "blue";
        rightBox.style.color = "blue";
    }
    else if (randomNum == 4) 
    {
        leftBox.id = "blue";
        leftBox.style.color = "blue";
        middleBox.id = "red";
        middleBox.style.color = "red";
        rightBox.id = "yellow";
        rightBox.style.color = "yellow";
    }
    else if (randomNum == 5) 
    {
        leftBox.id = "blue";
        leftBox.style.color = "blue";
        middleBox.id = "yellow";
        middleBox.style.color = "yellow";
        rightBox.id = "red";
        rightBox.style.color = "red";
    }
    else if (randomNum == 6) 
    {
        leftBox.id = "yellow";
        leftBox.style.color = "yellow";
        middleBox.id = "blue";
        middleBox.style.color = "blue";
        rightBox.id = "red";
        rightBox.style.color = "red";
    }
}

//Activa una alarma de color rosa antes de que las cajas cambien de posición
function switchColorsAlarm() {
    if (boxIsWhite) {
        boxBackgroundColor = "pink";
        boxIsWhite = false;
    }
    else if (boxIsPink) {
        boxBackgroundColor = "white";
        boxIsPink = false;
    }

    if (boxBackgroundColor == "white") boxIsWhite = true;
    else boxIsPink = true;

    leftBox.style.backgroundColor = boxBackgroundColor;
    middleBox.style.backgroundColor = boxBackgroundColor;
    rightBox.style.backgroundColor = boxBackgroundColor;
       
    alarmActiveNum++;

    if (alarmActiveNum < 4) setTimeout(switchColorsAlarm, 500);
    else {
        alarmActiveNum = 0;
        switchBoxesColors();
    }  
}

//Reduce los puntos 
function decreasePoints() {
    if (!droppedInBox) points--;
    if (points < 0) points = 0;
    document.getElementById("points").innerHTML = points;
}

//Incrementa los puntos
function increasePoints() {
    points++;
    document.getElementById("points").innerHTML = points;
    checkPoints();
}

//Revisa los puntos del jugador para establecer el nivel y la dificultad
function checkPoints() {
    
    if (points >= pointsToWinLevel) {

        switch (level) {
            case "Level_5": 
                clearInterval(selFigInterval);
                console.log("¡¡¡Ganó!!!");
                break;
            
            case "Level_4": 
                pointsToWinLevel = 50; //¡¡¡ 50 !!!
                clearInterval(swtColInterval);
                swtColInterval = setInterval(switchColorsAlarm, 8000);
                level = "Level_5";
                console.log("¡¡¡Cambió a nivel 5!!!");
                break;
            
            case "Level_3": 
                pointsToWinLevel = 50; //¡¡¡ 50 !!!
                swtColInterval = setInterval(switchColorsAlarm, 18000);
                level = "Level_4";
                console.log("¡¡¡Cambió a nivel 4!!!");
                break;
            
            case "Level_2": 
                pointsToWinLevel = 40; //¡¡¡ 40 !!!
                animationFrameRate = 20;
                level = "Level_3";
                console.log("¡¡¡Cambió a nivel 3!!!");
                break;
            
            case "Level_1": 
                pointsToWinLevel = 30; //¡¡¡ 30 !!!
                animationFrameRate = 15;
                level = "Level_2";
                console.log("¡¡¡Cambió a nivel 2!!!");
                break;
        };
        points = 0;
    }
}
