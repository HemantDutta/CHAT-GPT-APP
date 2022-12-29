import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.getElementsByTagName('form');
const chatCont = document.getElementById('chat_cont');

let loadInterval;


//Loading animation while text is being generated...
function loader(element){
    element.textContent = '';

    loadInterval = setInterval(()=>{
        element.textContent += '.';

        if(element.textContent === "...."){
            element.textContent = '';
        }
    }, 300);
}


//Typing animation
function typeAnim(element, text) {
    let index = 0;

    let interval = setInterval(()=>{
        if(index < text.length){
            element.innerHTML += text.charAt(index);
            index++;
        }
        else{
            clearInterval(interval);
        }
    }, 20);

}