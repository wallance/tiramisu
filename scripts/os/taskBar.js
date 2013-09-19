/* ------------
   Console.js

   Requires globals.js

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
   ------------ */

function TaskBar() {
	// A type error occurs when using 'this' in methods executed by setInterval();
	// It would be fine if the function didn't reference other "class" functions.
	// http://stackoverflow.com/questions/18263585/call-javascript-object-method-with-setinterval
	var self = this;
    // Properties
    this.interval = null;
    
    // Methods
    this.init = function()
    {
    	this.registerUpdateClockHandler();
    };
    
    this.stopClock = function() {
    	window.clearInterval(this.interval);
    };
    
    this.registerUpdateClockHandler = function() {
    	this.interval = setInterval(this.updateCurrentTime, 1000);
    };
    this.setStatus = function(status)
    {
       $('#status').html(status);
    };
    
    this.getStatus = function()
    {
       return $('#status').html();
    };
    
    this.updateCurrentTime = function()
    {
    	var now = new Date();
    	$('#clock').html(self.getCurrentTime(now));
    	$('#date').html(self.getCurrentDate(now));
    };
    
    this.getCurrentTime = function(date) {
    	var hours = date.getHours();
    	var mins = date.getMinutes();
    	var seconds = date.getSeconds();
    	if (mins < 10) {
    		mins = '0' + mins;
    	}
    	if (hours < 10)
    	{
    		hours = '0' + hours;
    	} 
    	if (seconds < 10)
    	{
    		seconds = '0' + seconds;
    	}
    	var formattedTime = hours + ":" + mins + ":" + seconds;
    	return formattedTime;
    };
    
    this.getCurrentDate = function(date) {
    	var months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
        
		//var formattedDate = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
		var formattedDate = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    	return formattedDate;
    };
}
