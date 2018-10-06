class NumberedBox extends createjs.Container{
    constructor(game,number=0)
    {
        super();
        this.game=game;
        this.number=number;
        var movieclip=new lib.NumberedBox();
        movieclip.numberText.text=number;
        movieclip.numberText.font="20px Oswald";
        movieclip.numberText.textBaseline="alphabet";
        movieclip.numberText.x+=2;
        movieclip.numberText.y=36;
        new createjs.ButtonHelper(movieclip,0,1,2,false,new lib.NumberedBox(),3);
        this.setBounds(0,0,50,50);
        this.addChild(movieclip);
        this.on('click',this.handleClick.bind(this));
    }
    handleClick()
    {
        this.game.handleClick(this);
        createjs.Sound.play("Jump");
    }
    
}
class GameData{
    constructor()
    {
        this.totalbox=45;
        this.resetdata();
    }
    resetdata()
    {
        this.currentbox=1;
    }
    isRight(number)
    {
        return(number==this.currentbox);
    }
    nextBox()
    {
        this.currentbox+=1;
    }
    gameWin()
    {
        return (this.currentbox>this.totalbox);
    }

}
class Game{
    constructor(){
        console.log("welcome");
        this.loadAudio();
        this.canvas=document.getElementById("game-canvas");
        this.stage=new createjs.Stage(this.canvas);
        this.stage.height=this.canvas.height;
        this.stage.width=this.canvas.width;
        this.stage.enableMouseOver();
        createjs.Touch.enable(this.stage);
        this.retina();
        createjs.Ticker.setFPS(60);
        this.gamedata=new GameData();
        createjs.Ticker.on("tick",this.stage);
        this.restart();
        
    }
generateBoxes(number=30)
{
    for (var i=number;i>0;--i )
    {
        var movieclip=new NumberedBox(this,i);
        this.stage.addChild(movieclip);
        movieclip.x=Math.random()*(this.stage.width-movieclip.getBounds().width);
        movieclip.y=Math.random()*(this.stage.height-movieclip.getBounds().height);
    }
}
handleClick(numberedBox)
{
    if(this.gamedata.isRight(numberedBox.number))
    {
    this.stage.removeChild(numberedBox);
    this.gamedata.nextBox();
    if(this.gamedata.gameWin())
    {
        createjs.Sound.play("Game Over");
        var gameOverView = new lib.GameOverView();
        this.stage.addChild(gameOverView);
        gameOverView.restartButton.on('click',(function(){
            this.restart();
        }).bind(this));
        createjs.Sound.play("Jump");

    }
    }
}
restart()
{
    this.gamedata.resetdata();
    this.stage.removeAllChildren();
    this.stage.addChild(new lib.Background());
    this.generateBoxes(this.gamedata.totalbox);
}
retina()
{
    this.stage.width=this.canvas.width;
    this.stage.height=this.canvas.height;
    var ratio=window.devicePixelRatio;
    if(ratio==undefined)
    {
        return;
    }
    this.canvas.setAttribute("height",Math.round(this.stage.height*ratio));
    this.canvas.setAttribute("width",Math.round(this.stage.width*ratio));
    this.stage.scaleX=this.stage.scaleY=ratio;
    this.canvas.style.height=this.stage.height+"px";
    this.canvas.style.width=this.stage.width+"px";
}
loadAudio()
{
    createjs.Sound.alternateExtensions=["ogg","wav"];
    createjs.Sound.registerSound("Audio/jump7.aiff","Jump");
    createjs.Sound.registerSound("Audio/game-over.aiff","Game Over");
}
}
var game=new Game();