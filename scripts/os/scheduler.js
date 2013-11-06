/*
 * Scheduler
 * 
 * Defines the Round Robin algorithm for scheduling how processes execute.
 */

function Scheduler()
{    
    this.init();
};

Scheduler.prototype.init = function()
{
    _RoundRobinCycleCount = 1;
};

Scheduler.prototype.schedule = function()
{
    // Schedule the next process in the ready queue by removing it.
    _CurrentExecutingProcess = _ReadyQueue.dequeue();
    
    // Retrieve the Process Control Block (PCB).
    var currentProcess = _PCBFactory.getProcess(_CurrentExecutingProcess);
    
    if ( (_RoundRobinCycleCount > _RoundRobinQuantum) && (_ReadyQueue.getNext()) )
    {
        // Switch when the process has been executed the same number of times
        // as the quantum.
        this.switchContext();
    }
    else if (currentProcess.getState() === "Terminated")
    {
        this.switchContext();
    }
};

Scheduler.prototype.switchContext = function()
{
   
};

Scheduler.prototype.setMode = function(mode)
{
    _Mode = mode;
};