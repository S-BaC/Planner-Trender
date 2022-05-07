
/* 
    > Initially written as a miniproject. (2022 May 7)
    > Hope to extend and build a Todoist-style app.
    > Apart from global variables, the program is organized into three classes:
        -   Calendar for everything directly related to DOM calendar.
        -   DateSetter for setting current date.
        -   EventPanel for working with events.   
*/

/*Setting Global Variables*/
let currentDate, chosenYear, chosenMonth, chosenDay;    //Date to use.
let dayObjArr; //Array of objects representing each day.

class Calendar{

    constructor (chosenMonth, chosenYear){
        let daysInTheMonth = new Date(chosenYear, chosenMonth, 0).getDate();
        let monthStartingWith = new Date(chosenYear,chosenMonth, 1).getDay();
        this.tempSelectedDay;   //To set the 'daySelected' style on and off.
        dayObjArr = [];
        for(let i = 1; i<=daysInTheMonth; i++){
            dayObjArr.push(this.buildDayObj(i));    //Building the array.
        }
        this.buildCalendar(daysInTheMonth,monthStartingWith);   //Drawing the calendar on the DOM.
    }
    buildDayObj(day){
        return {day: day, dayEvent: [], eveningEvent: []};
    }
    buildCalendar (totalDays, startingDay){
        const calendarTableC = document.getElementsByClassName('calendarTableC')[0];
        calendarTableC.innerHTML = '';
    
        //SettingDays (Sun - Sat)
        this.setCalendarDays(calendarTableC);
    
        //Calendar starts on Sun, if startingDay is something else, empty divs are added.
        let currentDay = 0; 
        while(currentDay !== startingDay){
            calendarTableC.innerHTML += "<div class='emptyC'></div>";
            currentDay++;
        }
    
        //Adding incremented days as div.
        let dayCount = 1;
        while(dayCount <= totalDays){
            calendarTableC.innerHTML += "<div class='calendarDaysC'>" + dayCount + "</div>";
            dayCount++;
        }

        //Adding a button to change month
        this.setMonthYear(calendarTableC);  

        const calendarDaysArr = document.getElementsByClassName('calendarDaysC');

        //The current day is chosen by default.
        const thisDay = calendarDaysArr[chosenDay-1];
        this.tempSelectedDay = thisDay;
        this.choseDay(thisDay);

        //Event Listener for click events on the days.
        this.listenCalendarDays(calendarDaysArr);
    }

    listenCalendarDays(nodeList){
        const arr = Array.from(nodeList);
       arr.forEach(day=>
        day.addEventListener('mouseup',e=>
            this.choseDay(e.target)));
    }
    choseDay(day){
        //To remove the 'currentDay' from being selected.
        document.getElementsByClassName('calendarDaysC')[chosenDay-1].classList.remove('daySelected');
        this.tempSelectedDay.classList.remove('daySelected');
        day.classList.add('daySelected');
        this.tempSelectedDay = day;
    
        currentDate = new Date(chosenYear, chosenMonth, day.textContent);
        DateSetter.setDMY(currentDate);

        new EventPanel();
        EventPanel.renderEventList(chosenDay);       
    }
    setCalendarDays(calendar){
        let daysArr = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        daysArr.forEach(day => {
            calendar.innerHTML += "<div class='daysC'>" + day + "</div>";
        });
    }
    setMonthYear(calendar){
        calendar.innerHTML += "<div id='setMonth' class='flex'><p> Set Date </p></div>";
        document.getElementById('setMonth').addEventListener('mouseup',e=>DateSetter.chooseMonth());
    }
}

class EventPanel{
    
    constructor(){
        document.getElementById('headC').innerHTML = currentDate.toDateString();
        this.listen();
    }
    //Event listener for 'submit' event on the event-adding form.
    listen(){
        const eventForm = document.getElementsByClassName('eventFormC')[0];
        eventForm.addEventListener('submit', e=>{
        e.preventDefault();
        const title = document.getElementById('titleEC').value; //Name of the added event.
        const des = document.getElementById('desEC').value; //Description.
        const time = document.getElementById('dayEventC').checked? 'dayEvent' : 'eveningEvent'; //Type - either day or evening.
        eventForm.reset();
        this.addEvent(title,des,time);
        })
    }
    // Adding the event to the relevant day in 'dayObjArr' and rendering changes.
    addEvent(event,des,time){
        if(time === 'dayEvent'){
            dayObjArr[chosenDay].dayEvent[0] = event;
            dayObjArr[chosenDay].dayEvent[1] = des;
        }
        else{
            dayObjArr[chosenDay].eveningEvent[0] = event;
            dayObjArr[chosenDay].eveningEvent[1] = des;
        }
        EventPanel.renderEventList(chosenDay);
    }
    //Shows events relating to the day.
    static renderEventList(dayIndex){
        const eventList = document.getElementById('eventsC');
        eventList.innerHTML = '';
        
        const eventArr = [  dayObjArr[dayIndex].dayEvent[0],dayObjArr[dayIndex].dayEvent[1],
                            dayObjArr[dayIndex].eveningEvent[0],dayObjArr[dayIndex].eveningEvent[1]];
        
        let data = 0; //If no event is logged, it won't render.
        for(let e in eventArr){
            if(eventArr[e] === undefined){
                eventArr[e] = '';
            }else{
                data++;
            }
        }
        console.log(eventArr);
    
        if(data>0){
        eventList.innerHTML = 
            `<p class='eventTitleC'> <em>day:</em> </p> <p><b>${eventArr[0]}</b></p>
            <p class='eventDesC'>${eventArr[1]}</p>
            
            <p class='eventTitleC'> <em>evening:</em> </p> <p> <b>${eventArr[2]}</b></p>
            <p class='eventDesC'>${eventArr[3]}</p>`
        }
    }
}

class DateSetter {

    static chooseMonth(){
        const scr = document.getElementById('monthChoosingScr');
        scr.style.display = 'flex';
        const form = document.getElementById('monthChoosingForm');
        form.addEventListener('submit', e=>{
            e.preventDefault();
            currentDate = date.valueAsDate;
            this.setDMY(currentDate);
            new Calendar(chosenMonth,chosenYear);
            DateSetter.turnOffScr(scr);
        })
    }
    static setDMY(currentDate){
        chosenMonth = currentDate.getMonth();
        chosenYear = currentDate.getFullYear();
        chosenDay = currentDate.getDate();
    }
    static turnOffScr(scr){
        scr.style.display = 'none';
    }
}

/*PROGRAM INITIALIZATION*/
currentDate = new Date();
DateSetter.setDMY(currentDate);
new Calendar(chosenMonth,chosenYear);
