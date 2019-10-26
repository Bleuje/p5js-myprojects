//Made by Pedro Caminha

//Global
let height, width
//Inputs from user
let inputProcesses, inputProcessesButton, inputQuantum, inputRunButton, input
let processInfoText = []
let inputProcessesArray = []
//Graphics
let quantum, passedTime, time, length
let board = []
let processesArray = []
function setup() {
	height = windowHeight
	width = windowWidth
	//startx
	board[0] = width*0.2
	//endx
	board[1] = width*0.98
	//starty
	board[2] = height*0.1
	//endy
	board[3] = height*0.98
	//width
	board[4] = board[1]-board[0]
	//height
	board[5] = board[3]-board[2]
	createCanvas(width, height)
	background(255)
	inputProcesses = createInput('10')
	inputProcesses.position(width*0.03, height*0.1)
	inputProcessesButton = createButton('Processes');
	inputProcessesButton.position(inputProcesses.x + inputProcesses.width, inputProcesses.y);
	inputProcessesButton.mousePressed(setNumberOfProcesses);
}

function draw() {
	
}

function setNumberOfProcesses(){
	fill(0)
	for(let i = 1; i<inputProcessesArray.length; i++){
		inputProcessesArray[i].hide()
		processInfoText[i].clear()
		inputQuantum.hide()
		inputRunButton.hide()
		// inputResetButton.hide()
	}
	input = parseInt(inputProcesses.value())
	console.log(processInfoText)
	input = round(max(min(input, 20),1))
	inputProcessesArray = []
	inputProcessesArray[0] = createInput('10')
	inputProcessesArray[0].position(inputProcesses.x, inputProcesses.y+inputProcesses.height)
	processInfoText[0] = text(" Process " + str(String.fromCharCode(65)), inputProcessesButton.x, inputProcesses.y+inputProcesses.height, inputProcessesButton.width, inputProcesses.height)
	for(let i = 1; i<input; i++){
		inputProcessesArray[i] = createInput('10')
		inputProcessesArray[i].position(inputProcesses.x, inputProcessesArray[i-1].y+inputProcesses.height)
		processInfoText[i] = text(" Process " + str(String.fromCharCode(65 + i)), inputProcessesButton.x, inputProcessesArray[i].y, inputProcessesButton.width, inputProcesses.height)
	}
	inputQuantum = createInput('2')
	inputQuantum.position(inputProcesses.x, inputProcessesArray[input-1].y+inputProcesses.height)
	processInfoText[input] = text(" Quantum", inputQuantum.x+inputQuantum.width, inputQuantum.y, inputProcessesButton.width, inputProcesses.height)
	inputRunButton = createButton('RUN');
	inputRunButton.position(inputProcesses.x, inputQuantum.y+inputQuantum.height);
	inputRunButton.mousePressed(start);
	// inputResetButton = createButton('RESET');
	// inputResetButton.position(inputProcesses.x+inputRunButton.width, inputQuantum.y+inputQuantum.height);
	// inputResetButton.mousePressed(run);
}

function start(){
	passedTime = 0

	fill(0)
	rect(board[0]-1, board[2]-1, board[4]+2, board[5]+2);
	fill(255)
	rect(board[0], board[2], board[4], board[5])
	passedTime = 0
	processesArray = []
	time = 0
	heightProcess = board[5]/input
	console.log("PROCESSOS")
	for(let i = 0; i < input; i++){
		processesArray[i] = new process(i, max(inputProcessesArray[i].value(),0), heightProcess)
		console.log("processo " + str(i) + " tempo " + str(inputProcessesArray[i].value()))
		time += int(inputProcessesArray[i].value())
	}
	quantum = min(max(inputQuantum.value(),1),100)
	frameRate(map(quantum, 0, 30, 6, 1))

	run()
}

function run(){
	console.log(time)
	for(let i = 0; i <= time*9; i++){
		length = processesArray[(i)%input].update()
		for(let j = 0; j < input; j++){
			if(j == (i)%input){
				processesArray[j].show(true)
			}else{
				processesArray[j].show(false)
			}
		}
		passedTime += length
	}
}

class process {
	constructor(order, duration, heightProcess) {
		this.duration = duration
		this.order = order
		this.height = heightProcess
		this.color = color(random(0,255), random(0,255),random(0,255))
	}

	update(){
		if(this.duration < quantum){
			let timeVar = this.duration
			console.log(timeVar)
			this.duration = 0
			return map(timeVar, 0, quantum, 0, ((board[4])/time)*quantum)
		}else{
			this.duration -= quantum
			return map(quantum, 0, quantum, 0, ((board[4])/time)*quantum)
		}
	}

	show(paint){
		strokeWeight(0.1)
		stroke(0)

		
		if(paint & this.duration >= 0){
			fill(this.color)
			rect(passedTime+board[0], this.height*this.order+board[2], length, this.height)		
		}else{
			fill(255)
			if(passedTime > board[1]){
				noStroke()
				noFill()
			}
			rect(passedTime+board[0], this.height*this.order+board[2], length, this.height)		
		}
		
	}
}