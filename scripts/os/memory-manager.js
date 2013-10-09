/* 
 * Memory Manager
 * 
 * The manager is responsible for communicating between the system's memory
 * and the operating system.
 */

function MemoryManager() {
    this.systemMemory = null;
    this.memorySpecs = null;
    this.processesInBlocks = [];
    this.relocationRegister = 0;
    
    this.init();
};

MemoryManager.prototype.init = function() {
    if ( (this.systemMemory === null) && (this.memorySpecs === null) ) {
        
        this.systemMemory = new MemoryHardware(SYSTEM_MEMORY_SIZE);
        
        //this.memorySpecs
        
    }
};

MemoryManager.prototype.readDataAtPhysicalAddress = function(physicalAddress) {
    return this.systemMemory.read(physicalAddress);
};

MemoryManager.prototype.readDataAtLogicalAddress = function(logicalAddress, pid) {
    var physicalAddress = this.translateAddress(logicalAddress, pid);
    
    return this.systemMemory.read(physicalAddress);
};

MemoryManager.prototype.readDataAtNextLogicalAddress = function(logicalAddress, pid) {
    return this.readDataAtLogicalAddress(logicalAddress, pid);
};

MemoryManager.prototype.writeDataAtLogicalAddress = function(logicalAddress, data, pid) {
    
    if (typeof logicalAddress === 'string') {
        logicalAddress = parseInt(logicalAddress, 16);
    };
    
    //if (typeof data === 'string') {
        data = this.parseToHex(data);
    //  };    
    
    //var pid = this.processesInBlocks
    
    var physicalAddress = this.translateAddress(logicalAddress, pid);
    
    // Save it to the hardware memory
    this.systemMemory.write(physicalAddress, data);
    
    UIUpdateManager.updateMemoryMonitorAtAddress(physicalAddress, _MemoryManager.readDataAtPhysicalAddress(physicalAddress));
};

/*
 * Translates a logical address to a physical address, and returns it.
 */
MemoryManager.prototype.translateAddress = function(logicalAddress, pid) {
    
    var pcb = _PCBFactory.getProcess(pid);
    
    var translatedAddress = parseInt(pcb.getBaseAddress(), 10) + parseInt(logicalAddress, 10);
    return translatedAddress;
};

MemoryManager.prototype.getBlockInProcess = function(addressAsBaseEight) {
    return;
};

MemoryManager.prototype.parseToHex = function(data) {
    
    var hex = parseInt(data, 16).toString(16).toUpperCase();
    
    if (hex.length === 1) { hex = '0' + hex; };
    return hex;
};