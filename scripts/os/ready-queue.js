/* ------------
   ReadyQueue.js
   
   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the Javascript Array documentation at http://www.w3schools.com/jsref/jsref_obj_array.asp .
   Look at the push and shift methods, as they are the least obvious here.

   This version of the JS queue is uses exclusively for the Ready Queue for OS
   scheduling. It allows us to easily update the UI when necessary.
   
   ------------ */
   
function ReadyQueue()
{
    // Properties
    this.q = new Array();

    // Methods
    this.getSize = function() {
        return this.q.length;    
    };

    this.isEmpty = function(){
        return (this.q.length === 0);    
    };

    this.enqueue = function(pid) {
        this.q.push(pid);
        // Update the web UI.
        UIUpdateManager.updateReadyQueue(pid);
    };
    
    this.dequeue = function() {
        var retVal = null;
        
        if (this.q.length > 0)
        {
            retVal = this.q.shift();
            // Update the web UI.
            UIUpdateManager.dequeueItemFromReadyQueueMonitor();
        }
        return retVal;        
    };
    
    this.toString = function() {
        var retVal = "";
        for (var i in this.q)
        {
            retVal += "[" + this.q[i] + "] ";
        }
        return retVal;
    };
    
    this.getNext = function() {
        if (this.getSize() > 0)
        {
            // We don't want to remove it, only return the item
            return this.q[0];
        }
        else
        {
            return null;
        }
    };
}
