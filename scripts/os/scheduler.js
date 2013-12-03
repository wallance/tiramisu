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

/**
 * Initalizes the scheduler.
 */
Scheduler.prototype.init = function()
{
    _RoundRobinCycleCount = 1;
};

/**
 * The main routine that makes a scheduling decision.
 */
Scheduler.prototype.schedule = function()
{    
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

/**
 * When necessary, the scheduler will switch executing processes.  If the process
 * is not loaded in memory, prcoess swapping will be handled.
 */
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
    var previousProcessId = _CurrentExecutingProcess;
    
    _CurrentExecutingProcess = _ReadyQueue.dequeue();
    
    krnTrace("Switched process " + currentPCB.getProcessID() + " with " + _CurrentExecutingProcess + ".");
    
    var switchedPCB = _PCBFactory.getProcess(_CurrentExecutingProcess);
    
    //console.log("Just Switched PCB " + switchedPCB.getProcessID() + " details... " + "Memory block: " + switchedPCB.getMemoryBlock() +".");
    
    // If there is no assigned memory block, that means the process is located
    // on disk and needs to be swapped in.
    if (switchedPCB.getMemoryBlock() === -1)
    {
        // Sometimes there may be room in physical memory to load the process
        // which means this will not execute.
        if ( (_MemoryManager.getNextAvailableBlock() === null) && (_ReadyQueue.getSize() !== 0) )
        {
            krnTrace("Swapping process" + previousProcessId + " out from physical memory to the disk.");
            // If there is no room in physical memory, then we need
            // to swap a process out of physical memory and onto disk,
            // before loading in the one that we want.
            _MemoryManager.swapProcessOut(previousProcessId);
        }
        
        krnTrace("Swapping process" + _CurrentExecutingProcess + " in from from disk to physical memory.");
        
        // Read process from disk (virtual memory) and move it into physical memory.
        _MemoryManager.swapProcessIn(_CurrentExecutingProcess);
    }
    
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

/**
 * Sets the mode.  Use 1 for user mode and 2 for kernel mode.
 * @param {type} mode The mode to set.
 */
Scheduler.prototype.setMode = function(mode)
{
    _Mode = mode;
};

/**
 * Retrieves the name of the algorithm via the specified ID.
 * @param {type} algorithm The algorithm ID.
 */
Scheduler.prototype.getAlgorithm = function(algorithm)
{
    if (typeof this.algorithms[algorithm] !== 'undefined')
    {
        return this.algorithms[algorithm];
    } else {
        return null;
    }
};