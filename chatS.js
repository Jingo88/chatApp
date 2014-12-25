//fix scroll to top - andrew gave you the code
//fix video
//add links - can do a www? check on a string
//this is extremely difficult. Found autolinker.js on github.
//this will help to make links appear when typed in various formats. 
//how to remove user from list when they close the browser instead of logging out?********
//how to make it so users do not show same side dialog when history is posted and they have dup names



//EXTRAS
//will add rolling dice function?
//make your browser flash or pop on notification?
//private messaging



//SAMS LINK THING
// if (text.substring(0, "http".length) === ' http'){
// 	text = "<a href=" + text + "</a>";
// }

// this will target the first letters of a link if they are "http" such as "http://www.google.com"
//does sam's suggestion work with how you are keeping the history? 
//what if somebody sends a message at the same time another user is connecting
//maybe convert history into a string by using .join('\n')



//fix the scroll so it goes to the top
//fix the array so that it will remove the name when a person leaves
//on client close send a coded message, when received gets the index of that person's name,
//and maybe their client computer id, and removes them from the two arrays
//make user list up to date
//remove user names from list when they leave
//make party members in white text
//send people names array every time sending a message
//in the client js just clear the div and repopulate the box on every message receive
//have to fix so the user cannot submit a blank name
//give the option to change their favorite color or their username
//on connection and on close make an update a list of the names in the usernames array
//how to add the list of usernames to the client side
//to remove names you have to create a log out button
//you can also set up a timer to log a person out by themselves. 
//on duplicate name, the user with the duplicated name on the first time, all their messages will
//appear on the right. because when the history is pushed out, the userName is still not changed. 


//what if you took the information, parsed it in the server, pushed it to the array, then stringify it back.
//on connection you could make the username anon until they enter one. 
//that wouldn't work because the array would be constantly changing. 
//or technically it would work if you just used indexOf and never needed to grab the last person

// how about we make another empty array and fill it with all the objects that come in from the users. 
//we can pass the objects in the array
// maybe loop through the userName values of the array to make sure the names are not duplicated
// maybe do the same thing for colors, and if they are then send another prompt to the user or kick them off. 

//what if you made your client array, and pushed objects in there, and the client indexes would equal their username
// it would have key value pairs that you would call. maybe?


// var WSS = require('ws').Server;
// var http = require('http');
// var server = new WSS ({url: http//jason.princesspeach.nyc:3000});



var WSS = require('ws').Server;
// var Autolinker = require( 'autolinker' );

var server = new WSS({port: 3000});

var clients = [];
var peopleNames = [];
var history = [];

server.on('connection', function(connect){
	
	clients.push(connect);
	console.log('Another Adventurer Has Joined Our Party' + clients.length);

	for (i=0; i<clients.length-1; i++){
		var last = clients[clients.length-1];
		clients[i].send(JSON.stringify('A New Adventurer Has Joined Our Quest'));
	}

	if (history.length >= 1){

		history.forEach(function(msg){
			connect.send(msg);
		})
	}

//removes the object of the clients computer when they close
	connect.on('close', function(){
		var cIndex = clients.indexOf(connect);
		clients.splice(cIndex,1);
		console.log(clients.length);

//if there was only one person, they will be removed but the server will still stay up
		if (clients.length === 0){
			return;

		} else {

		for (i=0; i<clients.length; i++){
			clients[i].send(JSON.stringify('A Comrade has fallen in Battle'));
			}
		}
	});

//trying to fix duplicate names.
//what happens when a person with that name leaves. how do you remove them from the array?
//you can stick in the client side ws.on('close' function(){ ws.send, send an object with the user name, 
//then it will be removed from the array})

	connect.on('message', function(x) {
		
        console.log("x = " + x);
        var keep = JSON.parse(x); 
		//adds a list of users on connection of a new user
		//it is not up to date, sticking it to messages will make it repeat. 
		if (peopleNames.length > 0) {
				for (i=0; i<clients.length; i++){
				clients[i].send(JSON.stringify(peopleNames));
			}
		}

        if (typeof keep === 'object') {
        	history.push(x);
        	var outgoing = JSON.stringify(keep);
            for (i = 0; i < clients.length; i++) {
                clients[i].send(outgoing);
            }
    
        } else if (typeof keep === 'string') {
        	console.log('this is a string, we are keeping it' + keep)
        	var leave = keep.split(' ');

        	if (peopleNames.length === 0){
        		peopleNames.push(keep);

        	//this is meant to remove the user's name from the peopleNames array when they close their browser
        	//it is not working, the client side seems to be closing before sending anything. 
        	} else if (leave[0] === 'aeiouabc'){
	        	var removeUser = peopleNames.indexOf(leave[1]);
	        	peopleNames.splice(removeUser, 1);
	        	console.log('We are removing the User who has left, their name is ' + leave[1]);
	        	if (peopleNames.length > 0) {
					for (i=0; i<clients.length; i++){
					clients[i].send(JSON.stringify(peopleNames));
					}
				}


	        //the below if/else checks to see if the name is already in the array, if so it will send a coded message
	        //and the user will be prompted to enter another name. 
        	} else if (peopleNames.indexOf(keep)> -1) {

                    	connect.send(JSON.stringify('TAKENabcd'));
                    	console.log('the keep and send should be working');

                    } else {
                        peopleNames.push(keep);
                    }
        }
    console.log(peopleNames + " Are in the Array of names");
	})
})

//the code below takes a message and sends it to all users except the user sending it
	// connect.on("message", function(msg) {

 //    var index = clients.indexOf(connect);

 //    for (var i = 0; i < clients.length; i++) {
 //      if (i !== index) {

 //        clients[i].send(msg);
 //      }
 //    }


//this code sends the sentence every three seconds
 	// setInterval(function(){
	// 	clients.forEach(function(x){
	// 	x.send('this is a national progam, the earth is going to explode');
	// });	
	// }, 3000)
