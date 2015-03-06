enchant();

window.onload = function() {
	game = new Game(640, 360);
	game.fps = 30;
	game.scale = 1;
	
	game.preload(
		"res/kotoba-1.png",
		"res/kotoba-2.png",
		"res/kotoba-3.png",
		"res/kotoba-4.png",
		"res/kotoba-5.png",
		"res/kotoba-6.png",
		"res/kotoba-7.png",
		"res/kotoba-8.png",
		"res/host.png",
		"res/girl.png",
		"res/line.png"
	);
	
	game.onload = function(){
		//console.log("Hello world");
		
		game.rootScene.backgroundColor = 'black';
		
		var scene;
		
		//Scene
		scene = new GameplayScene();
		
		scene.addEventListener("enterframe", function(){
			window.document.onkeyup = function(e){
				//var temp = String.fromCharCode(e.keyCode)
				console.log(e.keyCode);
				scene.updateChant(e.keyCode);
			}
		});
		
		game.pushScene(scene);
	}
	
	game.start();
	
};

/*SCENE SECTION*/
var IntroScene = enchant.Class.create(enchant.Scene, {
	initialize: function(){
		enchant.Scene.call(this);
	}
});

var GameplayScene = enchant.Class.create(enchant.Scene, {
	//Initializing the main gameplay scene
	initialize: function(){
		
		enchant.Scene.call(this);
		
		this.isPause = false;
		
		//Girl image
		var girl = new Sprite(750, 425);
		girl.image = game.assets["res/girl.png"];
		girl.x = 100;
		girl.y = -55;
		this.girl = girl;
		
		//Host image
		var host = new Sprite(750, 425);
		host.image = game.assets["res/host.png"];
		host.x = -190;
		host.y = -50;
		host.opacity = 0.5;
		this.host = host;
		
		//Combo counter
		this.combo = 0;
		
		//Combo text
		var label = new Label("COMBO<br>" + this.combo);
		label.x = 9;
		label.y = 32;        
		label.color = "yellow";
		label.font = "22px strong";
		label.textAlign = "center";
		this.comboText = label;
		
		//Input array
		this.input = [];
		
		//Input preview
		var input = new Label("ANSWER");
		input.x = 9;
		input.y = 320;
		input.color = "white";
		input.font = "16px strong";
		input.textAlign = "center";
		this.inputText = input;
		
		//Chant group
		var chantGroup = new Group();
		this.chantGroup = chantGroup;
		
		//Border line
		var line = new Sprite(640, 9);
		line.image = game.assets["res/line.png"];
		line.x = 0;
		line.y = 280;
		this.line = line;
		
		//Chant
		//chant = new Kotoba("1");
		//chant.x = 9;
		//chant.y = 100;
		//this.chant = chant;
		
		//Time counter for generating chant
		//and the chant number (if chant number > 8 then back to 1)
		this.generateTimer = 0;
		this.chantCount = 1;
		
		//this.chantGroup.addChild(chant);
		
		//Adding entities to the scene
		this.addChild(this.girl);
		this.addChild(this.host);
		this.addChild(this.comboText);
		this.addChild(this.inputText);
		this.addChild(this.chantGroup);
		this.addChild(this.line);
		
		//Add event
		this.addEventListener("enterframe", this.onEnterFrame);
	},
	//Updating combo for each successful typing
	updateCombo: function(){
		this.combo += 1;
		this.comboText.text = "COMBO<br>" + this.combo;
	},
	//Updating chant input based on keyboard press
	updateChant: function(keycode){
		var key = String.fromCharCode(keycode);
		
		if(keycode == 8){
			console.log("Backspace");
			this.input.pop();
		}
		else if(keycode == 13){
			var chant = this.chantGroup.childNodes[0];
			
			if (chant != null) {
				if (chant.checkWord(this.inputText.text)){
					console.log("UNYA~ GOOD!");
					
					this.updateCombo();
					
					chant.remove();
				}
				else {
					console.log("RAWR~ BAD!");
				}
			}
			
			this.input = [];
		}
		else{
			this.input.push(key);
		}
		
		var currentInput = this.input.join("");
		
		this.inputText.text = currentInput;
	},
	togglePause: function(){
		if (this.isPause){
			this.removeEventListener("enterframe", this.onEnterFrame);
		}
		else {
			this.addEventListener("enterframe", this.onEnterFrame);
		}
	},
	onEnterFrame: function(evt){
		this.generateTimer += evt.elapsed * 0.0005;
		if (this.generateTimer >= 1){
			//Create new chant
			var idx = this.chantCount.toString();
			var chant = new Kotoba(idx);
			this.chantGroup.addChild(chant);
			
			//Add the chant counter
			this.chantCount += 1;
			if (this.chantCount > 8){
				this.chantCount = 1;
			}
			
			//Reset the timer
			this.generateTimer = 0;
		}
	}
});

var GameOverScene = enchant.Class.create(enchant.Scene, {
	initialize: function(){
		enchant.Scene.call(this);
	}
});

/*END OF SCENE SECTION*/

/*GAME OBJECT SECTION*/

var Kotoba = enchant.Class.create(enchant.Sprite, {
	/*
	*"Since this are secret words; you must not fail."
	*The word need to type correctly.
	*Will fall down from the top of the screen and typed before reach the border.
	*/
	initialize: function(num){
		//console.log(num);
		enchant.Sprite.call(this, 142, 16);
		
		var front = "res/kotoba-";
		var back = num.concat(".png");
		var link = front.concat(back);
		
		//console.log(link);
		
		//Chant image
		this.image = game.assets[link];
		
		//Positioning
		this.x = 50;
		this.y = -this.height;
		
		//Chant word
		if (num == "1"){
			this.word = "REGUBARU";
		}
		else if(num == "2"){
			this.word = "KURIYAN";
		}
		else if(num == "3"){
			this.word = "ZANDASU";
		}
		else if(num == "4"){
			this.word = "ATIBON";
		}
		else if(num == "5"){
			this.word = "REGATORU";
		}
		else if(num == "6"){
			this.word = "ARUBAN";
		}
		else if(num == "7"){
			this.word = "ZANDORA";
		}
		else if(num == "8"){
			this.word = "IMOORU";
		}
		
		//Add event update
		this.addEventListener("enterframe", this.onEnterFrame);
	},
	checkWord: function(input){
		console.log(input);
		//console.log(this.word.text);
		if (input == this.word){
			
			return true;
		}
		else {
			
			return false;
		}
	},
	remove: function(){
		this.parentNode.removeChild(this);
		delete this;
	},
	onEnterFrame: function(evt){
		speed = 100;
		
		this.y += speed * evt.elapsed * 0.001;
		
		if (this.y > 280){
			this.remove();
		}
	}
});

var Host = enchant.Class.create(enchant.Sprite, {
	initialize: function(){
		
	},
	changeExpression: function(num){
		
	}
});

var Girl = enchant.Class.create(enchant.Sprite, {
	initialize: function(){
		
	},
	changeExpression: function(num){
		
	}
});
/*END OF GAME OBJECT SECTION*/
