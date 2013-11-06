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