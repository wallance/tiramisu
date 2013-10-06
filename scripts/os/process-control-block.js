/* 
 * The Process Control Block (PCB) contains all the information of a process.
 * 
 */

function ProcessControlBlock(pid, baseAddress, limitAddress, memoryBlock) {
    
    this.pid            = pid;
    this.state          = "NEW";
    this.pc             = 0;
    this.baseAddress    = baseAddress;
    this.limitAddress   = limitAddress;
    this.memoryBlock     = memoryBlock;
    
    this.accumulator    = 0;
    this.registerX      = 0;
    this.registerY      = 0;
    this.flagZ          = 0;
}

ProcessControlBlock.prototype.getProcessID = function() {
    return this.pid;
};

ProcessControlBlock.prototype.getBaseAddress = function() {
    return this.baseAddress;
};

ProcessControlBlock.prototype.getLimitAddress = function() {
    return this.limitAddress;
};

ProcessControlBlock.prototype.getAccumulator = function() {
    return this.accumulator;
};

ProcessControlBlock.prototype.getRegisterX = function() {
    return this.registerX;
};

ProcessControlBlock.prototype.getRegisterY = function() {
    return this.registerY;
};

ProcessControlBlock.prototype.getFlagZ = function() {
    return this.flagZ;
};

ProcessControlBlock.prototype.setAccumulator = function(acc) {
    this.accumulator = acc;
};

ProcessControlBlock.prototype.setRegisterX = function(x) {
    this.registerX = x;
};

ProcessControlBlock.prototype.setRegisterY = function(y) {
    this.registerY = y;
};

ProcessControlBlock.prototype.setFlagZ = function(z) {
    this.flagZ = z;
};