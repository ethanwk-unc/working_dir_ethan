// rock, paper, scissor -- game logic

var currUserScore = 0; //Current User Score
var currCompScore = 0; //Current Computer Score

const pScoreText = document.querySelector('.p-count');
const pChoiceText = document.querySelector('.pChoice');
const cChoiceText = document.querySelector('.cpuChoice');
const resultText = document.querySelector('.result');

pScoreText.textContent = "Your Score: " + currUserScore;


function game() {
 
    function playGame() {
        // Select html elements
        const rockBtn = document.querySelector('.rock'); 
        const paperBtn = document.querySelector('.paper');
        const scissorBtn = document.querySelector('.scissor');
        // define player moves
        const playerOptions = [rockBtn, paperBtn, scissorBtn];
        const cpuOptions = ['rock','paper','scissors']
         
        // Function to start playing game
        playerOptions.forEach(option => {
            option.addEventListener('click',function(){ // for each button wait for click
                //random roll for cpu's choice
                const n = Math.floor(Math.random() * 3);
                const cpuChoice = cpuOptions[n];

                // Function to check who wins, passes player as text content of btn
                playerChoice = (this.innerText).toLowerCase();
                let playerScore = winner(playerChoice,cpuChoice);

                pChoiceText.textContent = 'you: ' + playerChoice
                cChoiceText.textContent = 'cpu: ' + cpuChoice
                pScoreText.textContent = "Your Score: " + playerScore;
            })
        })
         
    }
 
    // Function to decide winner
    function winner(player,cpu) {

        if(player == cpu){
            resultText.textContent = 'Tie'
            return currUserScore;
        }
        else if(player == 'rock'){
            if(cpu == 'paper'){
                resultText.textContent = 'You Lost';
                return currUserScore;
            }else{
                resultText.textContent = 'You Won!'
                currUserScore++;
                return currUserScore;
            }
        }
        else if(player == 'scissors'){
            if(cpu == 'rock'){
                resultText.textContent = 'You Lost';
                return currUserScore;
            }else{
                resultText.textContent = 'You Won!';
                currUserScore++;
                return currUserScore;
            }
        }
        else if(player == 'paper'){
            if(cpu == 'scissors'){
                resultText.textContent = 'You Lost';
                return currUserScore;
            }else{
                resultText.textContent = 'You Won!';
                currUserScore++;
                return currUserScore;
            }
        }
    }
 
    // play game infinitely
    playGame();
     
}
 
// start game
game();