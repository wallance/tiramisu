/* 
 * Process Control Block (PCB) Factory
 * 
 * Responsible for creating and maintaining user processes.
 */
function ProcessControlBlockFactory()
{
    this.lastProcessID = 0; // Keeps track of the last PID used
    
    this.residentProcesses = null;
    
    this.init();
}

/**
 * Initalizes the factory prototype.
 */
ProcessControlBlockFactory.prototype.init = function()
{
    if ((this.residentProcesses === null)) {
        this.residentProcesses = new Array();
    }
};

/**
 * Determines where the next base address should be and returns it.
 */
ProcessControlBlockFactory.prototype.getNextBaseAddress = function()
{
     if(this.residentProcesses.length <= SYSTEM_MEMORY_BLOCK_SIZE) {
        return SYSTEM_MEMORY_BLOCK_SIZE * this.residentProcesses.length;
    } else {
        krnTrapError('The next base address exceeds the avaialble physical memory.');
    }
};

/**
 * Determines where the next limit address should be and returns it.
 */
ProcessControlBlockFactory.prototype.getNextLimitAddress = function()
{
    if(this.residentProcesses.length <= SYSTEM_MEMORY_BLOCK_SIZE) {
        // Subtract 1 because we started at 0.
        return this.getNextBaseAddress() + SYSTEM_MEMORY_BLOCK_SIZE - 1;
    } else {
        krnTrapError('The next limit address exceeds the available physical memory.');
    }
};

/*
 * Only to be used when the PCB is instantiated, and only to be
 * called once per process!
 */
ProcessControlBlockFactory.prototype.obtainNewProcessID = function()
{ 
    return this.lastProcessID++;
};

ProcessControlBlockFactory.prototype.createProcess = function()
{
        // Where should the new PCB be placed in memory.
        var nextAvailableMemoryBlock = _MemoryManager.getNextAvailableBlock();
        
        if (nextAvailableMemoryBlock === null)
        {
            _StdIn.putText("Memory contains three processes. Kill at least one first.");
            return null;
        }
        
        _StdIn.putText("Loading the program into memory...");
        _StdIn.advanceLine();
        
        // Determine details about the new PCB.
        var baseAddress = nextAvailableMemoryBlock['baseAddress'];
        var limitAddress = nextAvailableMemoryBlock['limitAddress'];
        var memoryBlockId = nextAvailableMemoryBlock['blockId'];
        
        var pcb = new ProcessControlBlock(this.obtainNewProcessID(), baseAddress, limitAddress, memoryBlockId);
        
        _MemoryManager.setBlockAvailability(memoryBlockId, false);
        
        // Add the new PCB to the list of processes.
        this.residentProcesses[pcb.getProcessID()] = pcb;
        
        return this.residentProcesses[pcb.getProcessID()];
};

ProcessControlBlockFactory.prototype.getProcess = function(pid)
{
    // Make sure the process exists.
    if ( (typeof this.residentProcesses[pid] !== 'undefined') || (this.residentProcesses[pid] !== null) )
    {
        return this.residentProcesses[pid];
    }
    else
    {
        return null;
    }
};

ProcessControlBlockFactory.prototype.getProcesses = function()
{
    return this.residentProcesses;
};