/* 
 * Memory Manager
 * 
 * The manager is responsible for communicating between the system's physical
 * memory and the operating system.
 */

function MemoryManager() {
    this.systemMemory = null;
    
    // Contains information about the blocks of memory
    // This information should be contained within the MMU (Memory Management
    // Unit), not the PCB.
    this.memoryBlocks = null;
    
    this.init();
};

MemoryManager.prototype.init = function() {
    
    if (this.systemMemory === null)
    {
        this.systemMemory = new MemoryHardware(SYSTEM_MEMORY_SIZE);        
    }
    
    // Dynamically create the memory block array
    this.memoryBlocks = new Array(SYSTEM_MEMORY_BLOCK_COUNT);
    for (var i=0; i < this.memoryBlocks.length; i++)
    {
        // Example for base addresses...
        // 0 * 256 = 0
        // 1 * 256 = 256
        // 2 * 256 = 512
        var nextBaseAddress = (i * SYSTEM_MEMORY_BLOCK_SIZE);
        
        this.memoryBlocks[i] = { 
                                    baseAddress  : nextBaseAddress,
                                    limitAddress : ( (nextBaseAddress * 2) - 1 ),
                                    available    : true
                                };
    }
    
};

MemoryManager.prototype.getNextAvailableBlock = function() {
    
    for (var i=0; i < this.memoryBlocks.length; i++)
    {
        if (this.memoryBlocks[i]['available'] === true)
        {
            return i;
        }
    }
    // TODO: In project 4, swapping will need to be implemented, so this may
    // need to be modified.
    // No blocks are available, return the first block, which has an index of 0???
    return 0;
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
        data = this.parseToHex(data);
    
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