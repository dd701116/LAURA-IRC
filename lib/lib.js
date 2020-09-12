function debug(status){

    let date = new Date();
    let clock = "[ "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+" ]";
    $("#status_bar").val("["+clock+"]> "+status+"\n" + $("#status_bar").val());
}
function clock(){
    let date = new Date();
    let date_str = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    let clock = "[ "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+" ]";

    $("#date").text(clock);
}

function isFunction(variableToCheck){
    //If our variable is an instance of "Function"
    if (variableToCheck instanceof Function) {
        return true;
    }
    return false;
}


function say(message){
    return message;
}

function time(){
    let date = new Date();
    return "It is "+date.getHours()+"hour(s) "+date.getMinutes()+"minnute(s) and "+date.getSeconds()+"second(s)";
}

function day(){
    let day = ["Sunday", "Monday", "Tuesday","Wednesday","Thursday", "Friday", "Saturday"];    
    let date = new Date();
    return "Today is "+day[date.getDay()];
}

function hello(who){
    
    if(who==="" || who==="bot" || who==="PocEric" || who==null){
        return "Hey, hello you !";
    }
    return "My name is PocEric !";
}
