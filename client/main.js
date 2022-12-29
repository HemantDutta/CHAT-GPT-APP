import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatCont = document.getElementById('chat_cont');

let loadInterval;


//Loading animation while text is being generated...
function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
        element.textContent += '.';

        if (element.textContent === "....") {
            element.textContent = '';
        }
    }, 300);
}


//Typing animation
function typeAnim(element, text) {
    let index = 0;

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20);

}

//Generating unique ID based on time and random number
function genUniqueID() {
    const timeStamp = Date.now();
    const randomNumber = Math.random();
    const hexString = randomNumber.toString(16);

    return `id-${timeStamp}-${hexString}`;
}

//Generate chat stripes

function chatStripe(isAi, value, uniqueId) {
    return (
        `
            <div class="wrapper ${isAi && 'ai'}">
                <div class="chat">
                    <div class="profile">
                        <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}">
                    </div>
                    <div class="message" id=${uniqueId}>${value}</div>
                </div>
            </div>
        `
    )
}


//Handling input from user

const handleInput = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    //user stripe
    chatCont.innerHTML += chatStripe(false, data.get('prompt'));

    form.reset();

    //ai stripe
    const uniqueId = genUniqueID(); //generating a new unique id for each message div
    chatCont.innerHTML += chatStripe(true, " ", uniqueId); //stripe generated where div with "message" class will get a unique id

    chatCont.scrollTop = chatCont.scrollHeight;

    //using the generated unique id to get the current "message" div
    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    //Fetch data from backend server

    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if(response.ok) {
        const data = await  response.json();
        const parsedData = data.bot.trim();

        typeAnim(messageDiv, parsedData);
    } else {
        const err = await response.text();

        messageDiv.innerHTML = "Something went wrong! Try again...";
        alert(err);
    }
}


form.addEventListener('submit', handleInput);
form.addEventListener('keyup', (e)=>{
    if(e.keyCode === 13) {
        handleInput(e);
    }
})
