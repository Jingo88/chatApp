var ws = new WebSocket('ws://jason.princesspeach.nyc:3000');
// var ws = new WebSocket("ws://localhost:3000");
// var Autolinker = require( 'autolinker' );
var name = prompt("What is Your Name Adventurer");
//prompts the user before any connection is made
var userColor = prompt("What is your favorite color?");
console.log(userColor);
var userName = name.toUpperCase();
console.log(userName);

ws.addEventListener("open", function(evt) {
    console.log("You have been accepted to the League of Extraordinary Gentleman");
    ws.send(JSON.stringify(userName));
    //targets the various tags we'll need
    var body = document.querySelector('body');
    var chatBox = document.querySelector('#chatroom');
    var button = document.querySelector('button');
    var yourSent = document.querySelector('#userMsg');
    var userList = document.querySelector('#knownUsers');
    var fileLink = document.querySelector('#fileAttach');
    var fileType = document.querySelector('#userFile');
    var logout = document.querySelector('#logout');
    //to attach a gif/image/video file to the page you can use radio buttons
    //and add a separate input box which will grab the link
    //then add two extra key/value pairs to the object that is being passed back and forth. 
    //controls the clicking of the submit button
    button.addEventListener('click', function() {
        var object = {
            userName: userName,
            text: yourSent.value,
            uColor: userColor,
            fileLink: fileLink.value,
            fileType: fileType.options[fileType.selectedIndex].value,
        }

        if (yourSent.value === '') {
            var blank = alert('Stop firing blanks');
            return;
        }
        var userMsg = JSON.stringify(object);
        ws.send(userMsg);
        console.log(object.fileLink);
        console.log(object.fileType);
        yourSent.value = '';
        fileLink.value = '';
        fileLink.style.display = 'none';
    });

    //if the user pressed the enter key while in the input box
    yourSent.addEventListener('keydown', function(e) {
        if (e.keyCode === 13 && yourSent.value != '') {
            var object = {
                userName: userName,
                text: yourSent.value,
                uColor: userColor,
                fileLink: fileLink.value,
                fileType: fileType.options[fileType.selectedIndex].value,
            }
            if (yourSent.value === '') {
                var blank = alert('Stop firing blanks');
            return;
            }
            var userMsg = JSON.stringify(object);
            ws.send(userMsg);
            console.log(object.fileLink);
            console.log(object.fileType);
            yourSent.value = '';
            fileLink.value = '';
            fileLink.style.display = 'none';
        }
    });
    fileLink.addEventListener('keydown', function(e) {
        if (e.keyCode === 13 && yourSent.value != '') {
            var object = {
                userName: userName,
                text: yourSent.value,
                uColor: userColor,
                fileLink: fileLink.value,
                fileType: fileType.options[fileType.selectedIndex].value,
            }
            var userMsg = JSON.stringify(object);
            ws.send(userMsg);
            console.log(object.fileLink);
            console.log(object.fileType);
            yourSent.value = '';
            fileLink.value = '';
            fileLink.style.display = 'none';
        }
    });
    ws.addEventListener("message", function(x) {
        var parsed = JSON.parse(x.data);
        var para = document.createElement('span');
        var lineBreak = document.createElement('br');
        var bubble = document.createElement('div');
        console.log(parsed);

        function chatLink() {
            console.log('we are getting in the userLink');
            if (parsed.fileType === 'none') {
                return;
            } else if (parsed.fileType === 'image') {
                var images = document.createElement('img');
                bubble.setAttribute('id', 'bubble');
                images.setAttribute('src', parsed.fileLink);
                images.setAttribute('class', 'upFile');
                bubble.appendChild(images)
                chatBox.appendChild(bubble);
                //video is not working
            } else if (parsed.fileType === 'video') {
                var videos = document.createElement('iframe');
                // var sources = document.createElement('source');
                videos.setAttribute('source', parsed.fileLink);
                videos.setAttribute('class', 'upFile');
                // videos.appendChild(sources);
                chatBox.appendChild(videos);
            } else if (parsed.fileType === 'gif') {
                var gifs = document.createElement('img');
                bubble.setAttribute('id', 'bubble');
                gifs.setAttribute('src', parsed.fileLink);
                gifs.setAttribute('class', 'upFile');
                bubble.appendChild(gifs);
                chatBox.appendChild(bubble);
            }
        }

        function userLink() {
            console.log('we are getting in the userLink');
            if (parsed.fileType === 'none') {
                return;
            } else if (parsed.fileType === 'image') {
                var images = document.createElement('img');
                bubble.setAttribute('id', 'userBubble');
                images.setAttribute('src', parsed.fileLink);
                images.setAttribute('class', 'upFile');
                bubble.appendChild(images);
                chatBox.appendChild(bubble);
                //video is not working
            } else if (parsed.fileType === 'video') {
                var videos = document.createElement('iframe');
                // var sources = document.createElement('source');
                videos.setAttribute('source', parsed.fileLink);
                videos.setAttribute('class', 'upFile');
                // videos.appendChild(sources);
                chatBox.appendChild(videos);
            } else if (parsed.fileType === 'gif') {
                var gifs = document.createElement('img');
                bubble.setAttribute('id', 'userBubble');
                gifs.setAttribute('src', parsed.fileLink);
                gifs.setAttribute('class', 'upFile');
                bubble.appendChild(gifs);
                chatBox.appendChild(bubble);
            }
        }
        //will prompt the user if the name is already taken
        if (parsed === 'TAKENabcd') {
            console.log('the shit has been taken')
            var newName = prompt("Sorry that name is taken, please enter another");
            userName = '';
            userName += newName.toUpperCase();
            ws.send(JSON.stringify(userName));
            //if the package is an array, it will loop through the array and print out the values
            //in list item formate in the div for user list
        } else if (Array.isArray(parsed) === true) {
            userList.innerHTML = '';
            for (i = 0; i < parsed.length; i++) {
                var li = document.createElement('li');
                li.innerText = parsed[i];
                li.style.color = 'red';
                userList.appendChild(li);
                console.log(parsed[i]);
            }
            //if the package is an object, break it down and input it into the chat box
        } else if (typeof parsed === 'object') {
            if (parsed.userName === userName) {
                // found autolinker.js to help create links. 
                var link = /\.com/;
                var incomingText = parsed.text.toString();
                var n = incomingText.search(/\.com/);
                console.log('this is incoming text' + n);
                //Trying to user Autolinker to make incoming links clickable

                if (n > -1){
                    var linkedText = Autolinker.link(incomingText, {newWindow: true});
                    bubble.setAttribute('id', 'userBubble');
                    para.innerText = linkedText;
                    para.appendChild(lineBreak);                
                    para.style.color = parsed.uColor;                
                    bubble.appendChild(para);
                    chatBox.appendChild(bubble);                
                    userLink();                    
                } else {
                    bubble.setAttribute('id', 'userBubble');
                    para.innerText = parsed.text;
                    para.appendChild(lineBreak);                
                    para.style.color = parsed.uColor;                
                    bubble.appendChild(para);
                    chatBox.appendChild(bubble);                
                    userLink();
                }
            } else {
                bubble.setAttribute('id', 'bubble');
                para.innerText = parsed.userName + ": " + parsed.text;
                para.appendChild(lineBreak);
                para.style.color = parsed.uColor;                                
                bubble.appendChild(para)
                chatBox.appendChild(bubble);                
                chatLink();
            }
            //if the package is a string put it into the chat box
        } else if (typeof parsed === 'string') {
            para.innerText = parsed;
            para.style.textAlign = 'center';
            para.style.color = '#b6b6b6'
            para.appendChild(lineBreak);
            chatBox.appendChild(para);
        }
    //supposed to make sure the chatBox always scrolls up
        chatBox.scrollTop = chatBox.scrollHeight;
    });


fileType.addEventListener('click', function() {
    fileLink.style.display = 'inline';
})

logout.addEventListener('click', function() {
    ws.send(JSON.stringify('aeiouabc ' + userName));
    console.log(JSON.stringify('aeiouabc ' + userName))
    closing();
})

function closing(){
    ws.close();
}
});
//you want to send a name to the server on close so it knows what name to remove from the userName array
//this doesn't seem to be working, the close is shutting down before the send is happening. 
fileType.addEventListener('click', function() {
    fileLink.style.display = 'inline';
})

logout.addEventListener('click', function() {
    ws.send(JSON.stringify('aeiouabc ' + userName));
    console.log(JSON.stringify('aeiouabc ' + userName))
    closing();
})

// function closing(){
//     ws.close();
// }