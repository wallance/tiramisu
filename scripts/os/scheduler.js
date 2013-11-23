/*
 * Scheduler
 * 
 * Defines the Round Robin algorithm for scheduling how processes execute.
 */

function Scheduler()
{
    this.algorithms = {'rr': 'Round Robin', 'fcfs' : 'First Come, First-Served', 'priority' : 'Priority'};
    
    this.init();
};

Scheduler.prototype.init = function()
{
    _RoundRobinCycleCount = 1;
};

Scheduler.prototype.schedule = function()
{
    // Retrieve the Process Control Block (PCB).
    var currentProcess = _PCBFactory.getProcess(_CurrentExecutingProcess);
    
    // Executes when there are multiple processes AND the RR cycle count has
    // been reached.
    if ( (_RoundRobinCycleCount > _RoundRobinQuantum) &&
         (_ReadyQueue.getNext() !== null) &&
         (_ReadyQueue.getNext() > -1) )
    {
        // Switch when the process has been executed the same number of times
        // as the quantum.
        this.switchContext();
    }
};

Scheduler.prototype.switchContext = function()
{
    krnTrace("Switching contexts...");
    
    // Switch to kernel mode, from user mode
    this.setMode(0);
    
    var currentPCB = _PCBFactory.getProcess(_CurrentExecutingProcess);
    
    if (currentPCB.getState() !== "Terminated")
    {
        krnTrace("Saving registers for process " + currentPCB.getProcessID() + ".");
        
        currentPCB.setState("Ready");
        currentPCB.setProgramCounter(_CPU.PC);
        currentPCB.setAccumulator(_CPU.Acc);
        currentPCB.setRegisterX(_CPU.Xreg);
        currentPCB.setRegisterY(_CPU.Yreg);
        currentPCB.setFlagZ(_CPU.Zflag);
        
        krnTrace("Enqueing process " + currentPCB.getProcessID() + " to ready queue.");
        
        _ReadyQueue.enqueue(_CurrentExecutingProcess);
    }
    
    // Switch processes.
    _CurrentExecutingProcess = _ReadyQueue.dequeue();
    
    krnTrace("Switched process " + currentPCB.getProcessID() + " with " + _CurrentExecutingProcess + ".");
    
    var switchedPCB = _PCBFactory.getProcess(_CurrentExecutingProcess);
    
    // Each time we switch processes, we must load the base and limit registers.
    _MemoryManager.systemMemory.setBaseRegister(switchedPCB.getBaseAddress());
    _MemoryManager.systemMemory.setLimitRegister(switchedPCB.getLimitAddress());
    
    krnTrace("Loading CPU registers for process " + switchedPCB.getProcessID() + ".");
    
    // Load the CPU with the value of the process' registers.
    _CPU.setCPUProperties( switchedPCB.getProgramCounter(),
                           switchedPCB.getAccumulator(),
                           switchedPCB.getRegisterX(),
                           switchedPCB.getRegisterY(),
                           switchedPCB.getFlagZ() );
    
    // Switch back to user mode, from kernel mode.
    this.setMode(1);
    
    // After context switching, reset the RR cycle count for the next process.
    _RoundRobinCycleCount = 1;
};

Scheduler.prototype.setMode = function(mode)
{
    _Mode = mode;
};

Scheduler.prototype.getAlgorithm = function(algorithm)
{
    if (typeof this.algorithms[algorithm] !== 'undefined')
    {
        return this.algorithms[algorithm];
    } else {
        return null;
    }
};