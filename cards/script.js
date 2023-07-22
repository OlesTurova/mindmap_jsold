
document.oncontextmenu = function() {return false;}; //без contextmenu
let AllConnectionAndCards = []; //массив для объектов карта+связи
let secondPointTop; //y статичной карточки
let secondPointLeft;
let secondId
let secondCard
let existingLineArray = new Array();

let connectionCount = 0

/////////// graph

class Graph{
    constructor(noVertic){
        this.noVertic = noVertic;
        this.adjList = new Map();
    }

    addVert(v){
        this.adjList.set(v, []);
    }

    addEdge(v, w){
        this.adjList.get(v).push(w);
        this.adjList.get(w).push(v);
    }

    removeNode(v) {
    if (this.adjacencyList.has(v)) {
      this.adjacencyList.get(v).forEach((edge) => {
        this.adjacencyList.get(edge).delete(v);
      });
      this.adjacencyList.delete(v);
    }
  }

    hasEdge(v, w) {
    if (this.adjacencyList.get(v).has(w)) {
      return true
    }
    return false;
  }

    removeEdge(v, w) {
        this.adjacencyList.get(v).delete(w);
        this.adjacencyList.get(w).delete(v);
    }

    printGraph(){
        let keys = this.adjList.keys();
        for (let v of keys){
            let eList = this.adjList.get(v);
            let data = ' ';
            for(let e in eList){
                data = data + eList[e] + ' '
            }
            console.log(v + '->' + data)
        }
    }
}

let AllCards = new Graph;
AllCards.addVert('A');
AllCards.addVert('B');
AllCards.addEdge('A', 'B');
AllCards.printGraph()

//                               CANVAS
let c = document.querySelector(".connectOnCanvas");
let ctx;
let x1; //x point1
let y1; //y point1
let x2; //x point2
let y2; //y point2
let oneLineCanvas;
let thisLineid;
let ConnectingTrue = false;

window.addEventListener("mousedown", createConnectFirst, false);
window.addEventListener('mousemove', moveX2Y2, false);
window.addEventListener("mouseup", stopMovingUp, false);

let card1;
let card2;
let IdToClass;
let canDelete = false;
let newClassForThisConnect

function createConnectFirst(event){
        let eventClick = event.target;
        card1 = eventClick.parentNode;
        if (eventClick.classList.contains('clickablespace') && (ConnectingTrue == false) && (event.which === 3)){
            let point1 = card1.querySelector('.thisPoint');
            let point1Cor = point1.getBoundingClientRect();
            ConnectingTrue = true;
            canDelete = true;
            oneLineCanvas = c.cloneNode(true);
            
            oneLineCanvas.width = window.innerWidth;
            oneLineCanvas.height = window.innerHeight;
            document.body.appendChild(oneLineCanvas)
            ctx = oneLineCanvas.getContext("2d");
            x1 = point1Cor.left;
            y1 = point1Cor.top;
            x2 = event.pageX;
            y2 = event.pageY;

            return [x1, y1, ctx, oneLineCanvas, card1, canDelete]
        }

    }

    function moveX2Y2(event){
                let eventClick = event.target;
                if(ConnectingTrue)
                    {
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.clearRect(0, 0, oneLineCanvas.width, oneLineCanvas.height);
                        ctx.lineTo(event.pageX, event.pageY);
                        ctx.stroke();
                        ctx.strokeStyle = "red";
                        document.removeEventListener('mousedown', createConnectFirst);

                    }
                }
    
    function stopMovingUp(event){
        let clickingEvent = event.target;
        card2 = clickingEvent.parentNode;

        
        if ((!(clickingEvent.classList.contains('clickablespace')) || (card1 == card2)) && (event.which === 3) && (canDelete)){
            ctx.clearRect(0, 0, oneLineCanvas.width, oneLineCanvas.height);
            ConnectingTrue = false;
            document.removeEventListener('mousemove', moveX2Y2);
            oneLineCanvas.remove()
            canDelete = false;
        }
        else if ((clickingEvent.classList.contains('clickablespace')) && (event.which === 3)){
            let point2 = card2.querySelector('.thisPoint');
            let point2Cor = point2.getBoundingClientRect();

            ConnectingTrue = false;
            x2 = point2Cor.left;
            y2 = point2Cor.top;

            let id1 = card1.id
            let id2 = card2.id

            let existingLine1 = document.getElementsByClassName(`${id1} ${id2}`);
            let existingLine2 = document.getElementsByClassName(`${id2} ${id1}`);
            
            
            console.log(id1)

            
                if(existingLineArray.includes(existingLine1) || existingLineArray.includes(existingLine2)){
                    ctx.clearRect(0, 0, oneLineCanvas.width, oneLineCanvas.height);
                    console.log('есть')
                    ConnectingTrue = false;
                    document.removeEventListener('mousemove', moveX2Y2);
                    oneLineCanvas.remove()
                    canDelete = false;
                    return
                }

                else{
                    existingLineArray.push(existingLine1);
                    console.log('нет')
                }
            



            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.clearRect(0, 0, oneLineCanvas.width, oneLineCanvas.height);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.strokeStyle = "red";
            
            newClassForThisConnect = card2.id;
            oneLineCanvas.classList.add(newClassForThisConnect);
            newClassForThisConnect = card1.id;
            oneLineCanvas.classList.add(newClassForThisConnect);

            document.removeEventListener('mousemove', moveX2Y2);
            thisConnectId1 = card1.id;
            thisConnectId2 = card2.id;
            thisConnection = thisConnectId1 + '' + thisConnectId2;
            let thisObject1 = AllConnectionAndCards[card1.id - 1];
            let thisObject2 = AllConnectionAndCards[card2.id - 1];
            let numberOfConnection1 = 'connection' + AllConnectionAndCards[card1.id - 1]['connectionsCount']
            let numberOfConnection2 = 'connection' + AllConnectionAndCards[card1.id - 1]['connectionsCount']

            AllCards.addEdge(`${thisConnectId1}`, `${thisConnectId2}`);
            AllCards.printGraph()

            if(card1.id < card2.id){
                AllConnectionAndCards[card1.id - 1][numberOfConnection1] =(thisConnectId1 + '' + thisConnectId2);
                AllConnectionAndCards[card2.id - 1][numberOfConnection2] =(thisConnectId1 + '' + thisConnectId2);
                AllConnectionAndCards[card1.id - 1]['connectionsCount']++
                AllConnectionAndCards[card2.id - 1]['connectionsCount']++
            }
            else{
                AllConnectionAndCards[card1.id - 1]['connection'] = (thisConnectId2 + '' + thisConnectId1);
                AllConnectionAndCards[card2.id - 1]['connection'] = (thisConnectId2 + '' + thisConnectId1);
                AllConnectionAndCards[card1.id - 1]['connectionsCount']++
                AllConnectionAndCards[card2.id - 1]['connectionsCount']++
            }
            return
        }

        else if(!((clickingEvent.classList.contains('clickablespace')) || !(card1 == card2)) && (event.which === 3) && (canDelete)){
            
            ctx.lineTo(x2, y2);
                ctx.stroke();
                ctx.closePath();
        }

    }

    //инструкция

    function popupClose(){
        let popUpWin = document.getElementById('popup');
        popUpWin.style.opacity = 0;
        popUpWin.style.top = '25%'
    }

    let editwinopen = false;
    let cardwin = document.querySelector('.cards');
    let hiddeneditwin = document.querySelector('.firstedit');
    let allId = []; //массив для id всех карточек

    //создать новую карточку

    window.addEventListener('dblclick', function(event) {
    let clickspace = event.target;

    if (editwinopen == true){
      console.log('true')
      return
    }

    else{
        let showeditwin = hiddeneditwin.cloneNode(true);
        document.body.appendChild(showeditwin)
        showeditwin.style.display = "block";
        showeditwin.style.left = (event.clientX - showeditwin.clientWidth / 2) + 'px';
        showeditwin.style.top = (event.clientY - showeditwin.clientHeight / 2) + 'px';
        editwinopen = true;

        return
    }
  });

  //кнопка удаления

  function deletebut(){
        let thisbut = event.target;
        let thiswin = thisbut.parentNode.parentNode.parentNode.parentNode;
        thiswin.remove();

        let thisCanvas = document.getElementsByClassName(thiswin.id);
        let canvases = new Array()
        
        canvases = [...thisCanvas];
        function deleteCon(thisC){
            thisC.remove()
        }
        canvases.forEach(element => deleteCon(element));
        editwinopen = false;

        editwinopen = false;

    }

    //кнопка сохранения

    function savebut(){

        let thisbut = event.target;
        let thisblock = thisbut.parentNode.parentNode.parentNode;
        let thiswin = thisbut.parentNode.parentNode.parentNode.parentNode;
        let textc = thiswin.querySelector('.cardtext');
        let titlec = thiswin.querySelector('.cardtitle');
        let theSpace = thiswin.querySelector(".emptyspace");
        thisblock.style.display = "none";
        editwinopen = false;

        thiswin.classList.add('cards');
        thiswin.classList.remove('editwindow');
        textc.classList.add("cardtextsmall");
        textc.classList.remove("cardtext");
        titlec.classList.add("cardtitlesmall");
        titlec.classList.remove("cardtitle");
        theSpace.classList.add("clickablespace")

        if (thiswin.classList.contains('firstedit')){
            let thiswinId = allId.length + 1;
            thiswin.id = thiswinId;
            allId.push(thiswinId)
            AllConnectionAndCards.push(
                {
                    'card': thiswinId,
                    'connectionsCount': 0
                }
            );
            thiswin.classList.remove("firstedit");
            thiswin.style.left = (event.clientX - thiswin.clientWidth / 2 - 120) + 'px';
            thiswin.style.top = (event.clientY - thiswin.clientHeight / 2 - 87) + 'px';
            AllCards.addVert(`${thiswinId}`);
            
            AllCards.printGraph()

            return
            
        }

        else{
            thiswin.style.left = (event.clientX - thiswin.clientWidth / 2 - 180) + 'px';
            thiswin.style.top = (event.clientY - thiswin.clientHeight / 2 - 110) + 'px';
            return

        }
        
    }


//перенос по зажатии лкм и открытие существующей
  
    window.addEventListener("mousedown", DragCards);
    
    function DragCards(){
        let thiswin = event.target;
        let CardsArray = new Array();
        if(thiswin.classList.contains('clickablespace') && (event.which === 1)){
            if (event.detail === 1) {
                //перенос карточки
                let clicking = thiswin.parentNode;
                let OldId = clicking.id;
                clicking.setAttribute("id", "cardclick");
                const cardmove = document.getElementById("cardclick");
                let shiftX = event.clientX - cardmove.getBoundingClientRect().left;
                let shiftY = event.clientY - cardmove.getBoundingClientRect().top;
                document.body.append(cardmove);
                cardmove.style.position = 'absolute';
                cardmove.style.zIndex = 1000;

                moveAt(event.pageX, event.pageY);
                document.addEventListener('mousemove', onMouseMove);

                function moveAt(pageX, pageY) {
                    
                    cardmove.style.left = pageX - shiftX + 'px';
                    cardmove.style.top = pageY - shiftY + 'px';

                    //window border
                    if(((pageY - shiftY) <= 0) && ((pageX - shiftX) <= 0)){
                        cardmove.style.top = 0;
                        cardmove.style.left = 0;
                        
                    }

                    else if(((pageX - shiftX) <= 0) && ((pageY - shiftY) >= (window.innerHeight - 130))){
                        cardmove.style.left = 0;
                        cardmove.style.top = window.innerHeight - 130 + 'px';
                    }

                    else if(((pageX - shiftX) >= (window.innerWidth - 190)) && ((pageY - shiftY) >= (window.innerHeight - 130))){
                        cardmove.style.left = window.innerWidth - 190 + 'px';
                        cardmove.style.top = window.innerHeight - 130 + 'px';
                    }

                    else if(((pageX - shiftX) >= (window.innerWidth - 190)) && ((pageY - shiftY) <= 0)){
                        cardmove.style.left = window.innerWidth - 190 + 'px';
                        cardmove.style.top = 0;
                    }

                    else if(((pageY - shiftY) >= (window.innerHeight - 130))){
                        cardmove.style.top = (window.innerHeight - 130) + 'px';
                        cardmove.style.left = pageX - shiftX + 'px';
                        
                    }
                    
                    else if ((pageX - shiftX) <= 0){
                        cardmove.style.left = 0;
                        cardmove.style.top = pageY - shiftY + 'px';
                    }
                    else if ((pageY - shiftY) <= 0){
                        cardmove.style.left = pageX - shiftX + 'px';
                        cardmove.style.top = 0;
                    }

                    else if(((pageX - shiftX) >= (window.innerWidth - 190))){
                        cardmove.style.left = (window.innerWidth - 190) + 'px';
                        cardmove.style.top = pageY - shiftY + 'px';
                    }

                    else{
                        cardmove.style.left = pageX - shiftX + 'px';
                        cardmove.style.top = pageY - shiftY + 'px';
                    }

                    jQuery(document).mouseleave(function(){
                        document.removeEventListener('mousemove', onMouseMove);
                    
                    clicking.onmouseup = null;
                    clicking.removeAttribute('id');
                    clicking.setAttribute('id', OldId)
                    secondPointLeft = 0;
                    secondPointTop = 0;
                    })

                    let thisCanvas = document.getElementsByClassName(OldId);
                    let canvases = new Array()
                    canvases = [...thisCanvas]; //массив с канвасами
                    let ClassesArray; //массив с классами связей к карточкам (от активной карточки)
                    ClassesArray = new Array();

                    function moveThisCon(thisC){
                        thisC.classList.remove('connectOnCanvas')
                        thisC.classList.remove(OldId)
                        let forClasses = thisC.className;
                        
                        ClassesArray.push(forClasses)

                        thisC.classList.add('connectOnCanvas')
                        thisC.classList.add(OldId)

                    }
                    
                    canvases.forEach(element => moveThisCon(element));

                    for (let i = 0; i < ClassesArray.length; i++){
                        let activeCancas = canvases[i];
                        ctx = activeCancas.getContext("2d");
                        
                        let card2Id = ClassesArray[i];
                        let card2El = document.getElementById(card2Id);
                        
                        ctx.beginPath();
                        let cardwhere1 = card2El.getBoundingClientRect();
                        ctx.moveTo((cardwhere1.left + 100), (cardwhere1.top + 100));
                        ctx.clearRect(0, 0, activeCancas.width, activeCancas.height);
                        ctx.lineTo(event.pageX, event.pageY);
                        ctx.stroke();
                        ctx.strokeStyle = "red";
                        ctx.closePath()

                        //window out

                        if(((pageY - shiftY) <= 0) && ((pageX - shiftX) <= 0)){
                            ctx.beginPath();
                            let cardwhere1 = card2El.getBoundingClientRect();
                            ctx.moveTo((cardwhere1.left + 100), (cardwhere1.top + 100));
                            ctx.clearRect(0, 0, activeCancas.width, activeCancas.height);
                            ctx.lineTo(40, 40);
                            ctx.stroke();
                            ctx.strokeStyle = "red";
                            ctx.closePath()
                        
                    }

                    else if(((pageX - shiftX) <= 0) && ((pageY - shiftY) >= (window.innerHeight - 130))){
                            ctx.beginPath();
                            let cardwhere1 = card2El.getBoundingClientRect();
                            ctx.moveTo((cardwhere1.left + 100), (cardwhere1.top + 100));
                            ctx.clearRect(0, 0, activeCancas.width, activeCancas.height);
                            ctx.lineTo(40, (window.innerHeight - 70));
                            ctx.stroke();
                            ctx.strokeStyle = "red";
                            ctx.closePath()
                    }

                    else if(((pageX - shiftX) >= (window.innerWidth - 190)) && ((pageY - shiftY) >= (window.innerHeight - 130))){
                        ctx.beginPath();
                            let cardwhere1 = card2El.getBoundingClientRect();
                            ctx.moveTo((cardwhere1.left + 100), (cardwhere1.top + 100));
                            ctx.clearRect(0, 0, activeCancas.width, activeCancas.height);
                            ctx.lineTo(((window.innerWidth - 70)), (window.innerHeight - 70));
                            ctx.stroke();
                            ctx.strokeStyle = "red";
                            ctx.closePath()
                    }

                    else if(((pageX - shiftX) >= (window.innerWidth - 190)) && ((pageY - shiftY) <= 0)){
                        ctx.beginPath();
                            let cardwhere1 = card2El.getBoundingClientRect();
                            ctx.moveTo((cardwhere1.left + 100), (cardwhere1.top + 100));
                            ctx.clearRect(0, 0, activeCancas.width, activeCancas.height);
                            ctx.lineTo(((window.innerWidth - 70)), 40);
                            ctx.stroke();
                            ctx.strokeStyle = "red";
                            ctx.closePath()
                    }

                    else if(((pageY - shiftY) >= (window.innerHeight - 130))){
                        ctx.beginPath();
                            let cardwhere1 = card2El.getBoundingClientRect();
                            ctx.moveTo((cardwhere1.left + 100), (cardwhere1.top + 100));
                            ctx.clearRect(0, 0, activeCancas.width, activeCancas.height);
                            ctx.lineTo(event.pageX, (window.innerHeight - 70));
                            ctx.stroke();
                            ctx.strokeStyle = "red";
                            ctx.closePath()
                        
                    }
                    
                    else if ((pageX - shiftX) <= 0){
                        ctx.beginPath();
                            let cardwhere1 = card2El.getBoundingClientRect();
                            ctx.moveTo((cardwhere1.left + 100), (cardwhere1.top + 100));
                            ctx.clearRect(0, 0, activeCancas.width, activeCancas.height);
                            ctx.lineTo(20, event.pageY);
                            ctx.stroke();
                            ctx.strokeStyle = "red";
                            ctx.closePath()
                    }
                    else if ((pageY - shiftY) <= 0){
                        ctx.beginPath();
                            let cardwhere1 = card2El.getBoundingClientRect();
                            ctx.moveTo((cardwhere1.left + 100), (cardwhere1.top + 100));
                            ctx.clearRect(0, 0, activeCancas.width, activeCancas.height);
                            ctx.lineTo(event.pageX, 20);
                            ctx.stroke();
                            ctx.strokeStyle = "red";
                            ctx.closePath()
                    }

                    else if(((pageX - shiftX) >= (window.innerWidth - 190))){
                        ctx.beginPath();
                            let cardwhere1 = card2El.getBoundingClientRect();
                            ctx.moveTo((cardwhere1.left + 100), (cardwhere1.top + 100));
                            ctx.clearRect(0, 0, activeCancas.width, activeCancas.height);
                            ctx.lineTo(((window.innerWidth - 70)), event.pageY);
                            ctx.stroke();
                            ctx.strokeStyle = "red";
                            ctx.closePath()
                    }

                    }

                }
                function onMouseMove(event) {
                    moveAt(event.pageX, event.pageY);
                }

                clicking.onmouseup = function() {
                    document.removeEventListener('mousemove', onMouseMove);
                    
                    clicking.onmouseup = null;
                    clicking.removeAttribute('id');
                    clicking.setAttribute('id', OldId)
                    secondPointLeft = 0;
                    secondPointTop = 0;
                    
                };

                clicking.ondragstart = function() {
                };

            } 

                //open

                else if (event.detail === 2) {
                    let clickingspacein = event.target;
                    let thiswin = clickingspacein.parentNode;
                    let textc = thiswin.querySelector(".cardtextsmall");
                    let hiddenButt = thiswin.querySelector(".container");
                    let titlec = thiswin.querySelector('.cardtitlesmall');

                    editwinopen = true;
                    hiddenButt.style.display = "block";
                    thiswin.style.left = (event.clientX - thiswin.clientWidth / 2 - 80) + 'px';
                    thiswin.style.top = (event.clientY - thiswin.clientHeight / 2 - 100) + 'px';

                    thiswin.classList.add('editwindow');
                    thiswin.classList.remove('cards');       
                    textc.classList.add('cardtext');
                    textc.classList.remove("cardtextsmall");
                    titlec.classList.add("cardtitle");
                    titlec.classList.remove("cardtitlesmall");
                    clickingspacein.classList.remove("clickablespace");

                    return
                        
                }
            }

            
    }
