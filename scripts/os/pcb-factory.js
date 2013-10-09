/* 
 * Process Control Block (PCB) Factory
 * 
 * Responsible for creating and maintaining user processes.
 */

function ProcessControlBlockFactory() {
    this.processes = null;
    this.lastProcessID = 0; // Keeps track of the last PID used
    
    this.init();
}

/**
 * Initalizes the factory prototype.
 */
ProcessControlBlockFactory.prototype.init = function() {
    if ((this.processes === null)) {
        this.processes = new Array();
        this.systemMemory = new MemoryHardware(SYSTEM_MEMORY_SIZE);
        
    }
};

/**
 * Determines where the next base address should be and returns it.
 */
ProcessControlBlockFactory.prototype.getNextBaseAddress = function() {
     if(this.processes.length <= SYSTEM_MEMORY_BLOCK_SIZE) {
        return SYSTEM_MEMORY_BLOCK_SIZE * this.processes.length;
    } else {
        alert("ERROR base address!");
    }
};

/**
 * Determines where the next limit address should be and returns it.
 */
ProcessControlBlockFactory.prototype.getNextLimitAddress = function() {
    if(this.processes.length <= SYSTEM_MEMORY_BLOCK_SIZE) {
        // Subtract 1 because we started at 0.
        return this.getNextBaseAddress() + SYSTEM_MEMORY_BLOCK_SIZE - 1;
    } else {
        alert("ERROR limit address!");
    }
};

/*
 * Only to be used when the PCB is instantiated, and only to be
 * called once per process!
 */
ProcessControlBlockFactory.prototype.obtainNewProcessID = function() { 
    return this.lastProcessID++;
};

ProcessControlBlockFactory.prototype.createProcess = function() {
    
    if (this.processes.length <= SYSTEM_MEMORY_BLOCK_COUNT) {
        
        var baseAddress = this.getNextBaseAddress();
        var limitAddress = this.getNextLimitAddress();
        var memoryBlock = this.processes.length + 1;
        
        var pcb = new ProcessControlBlock(this.obtainNewProcessID(), baseAddress, limitAddress, memoryBlock);
        
        this.processes[pcb.getProcessID()] = pcb;
        
        return this.processes[pcb.getProcessID()];
    
    } else {
        alert("too many processes");
    }
};

ProcessControlBlockFactory.prototype.getProcess = function(pid) {
    // Make sure the process exists.
    if ( (typeof this.processes[pid] !== 'undefined') || (this.processes[pid] !== null) )
    {
        return this.processes[pid];
    }
    else
    {
        return null;
    }
};