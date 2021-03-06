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

/**
 * Initalizes the Memory Manager's class members.
 * @returns {undefined}
 */
MemoryManager.prototype.init = function() {
    
    if (this.systemMemory === null)
    {
        this.systemMemory = new MemoryHardware(SYSTEM_MEMORY_SIZE);        
    }
    
    this.memoryBlocks = new Array(SYSTEM_MEMORY_BLOCK_COUNT);
    
    // Dynamically create the memory block array that holds basic 
    // information about the blocks.  This is necessary to know
    // when a block of memory is available for loading programs.
    for (var i=0; i < this.memoryBlocks.length; i++)
    {
        // Example for base addresses...
        // 0 * 256 = 0
        // 1 * 256 = 256
        // 2 * 256 = 512
        var nextBaseAddress = (i * SYSTEM_MEMORY_BLOCK_SIZE);
        
        this.memoryBlocks[i] = { 
                                    blockId      : i,
                                    baseAddress  : nextBaseAddress,
                                    limitAddress : ( (nextBaseAddress + SYSTEM_MEMORY_BLOCK_SIZE) - 1 ),
                                    available    : true
                                };
    }
    
};

/**
 * Determines which memory block is available for use.
 * 
 * @returns {Array}  Information about the next available block.
 */
MemoryManager.prototype.getNextAvailableBlock = function()
{    
    for (var i=0; i < this.memoryBlocks.length; i++)
    {
        if (this.memoryBlocks[i]['available'] === true)
        {
            return this.memoryBlocks[i];
        }
    }
    // TODO: In project 4, swapping will need to be implemented, so this may
    // need to be modified.
    // No blocks are available, so don't return a block.
    return null;
};

MemoryManager.prototype.validateAddress = function(address, isLogicalAddress)
{
    var isValid = false;
    
    if (isLogicalAddress)
    {
        address = this.translateAddress(address, _CurrentExecutingProcess);
    }
    
    var baseRegisterValue = this.systemMemory.getBaseRegister();
    var limitRegisterValue = this.systemMemory.getLimitRegister();
    
    var addressAsDecimal = parseInt(address, 10);
    
    if ( (addressAsDecimal >= baseRegisterValue) && (addressAsDecimal <= limitRegisterValue) )
    //if ( (addressAsDecimal >= 180) && (addressAsDecimal <= limitRegisterValue) )
    {
        isValid = true;
    }
    
    return isValid;
}

MemoryManager.prototype.setBlockAvailability = function(blockId, isAvailable)
{
    this.memoryBlocks[blockId]['available'] = isAvailable;
};

MemoryManager.prototype.clearMemoryBlock = function (blockId)
{
    if (this.memoryBlocks[blockId]['available'] === false)
    {        
        // Mark block as available
        this.memoryBlocks[blockId]['available'] = true;
        
        // Re-init the whole block with 00
        var baseAddress = this.memoryBlocks[blockId]['baseAddress'];
        var limitAddress = this.memoryBlocks[blockId]['limitAddress'];
        for (var i=baseAddress; i <= limitAddress; i++)
        {
            this.systemMemory.write(i, "00");
            UIUpdateManager.updateMemoryMonitorAtAddress(i, _MemoryManager.readDataAtPhysicalAddress(i));
        }
    }
    else {
        // TODO: Don't do this here
        krnTrace('Failed to clear memory block!');
    }
};

MemoryManager.prototype.readDataAtPhysicalAddress = function(physicalAddress) {
    return this.systemMemory.read(physicalAddress);
};

MemoryManager.prototype.writeDataAtPhysicalAddress = function(physicalAddress, data) {
    return this.systemMemory.write(physicalAddress, data);
};

MemoryManager.prototype.readDataAtLogicalAddress = function(logicalAddress, pid) {
    var physicalAddress = this.translateAddress(logicalAddress, pid);
    //this.validateAddress(physicalAddress);
    return this.readDataAtPhysicalAddress(physicalAddress);
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
    
    this.writeDataAtPhysicalAddress(physicalAddress, data);
    
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

MemoryManager.prototype.parseToHex = function(data) {
    
    var hex = parseInt(data, 16).toString(16).toUpperCase();
    
    if (hex.length === 1) { hex = '0' + hex; };
    return hex;
};

/**
 * Loads the specified process from the hard drive to a slot in physical memory.
 * @param {type} processId The process that needs to be brought into physical memory.
 */
MemoryManager.prototype.swapProcessIn = function(processId)
{
    krnTrace("Swapping process " + processId + " from the hard drive to physical memory.");   
    var pcb = _PCBFactory.getProcess(processId);
    
    var fileName = _PCBFactory.generateProcessFileName(pcb.getProcessID());
    
    // Read the stored program code.
    var dataFromDisk = krnFileSystemDriver.readFileData(fileName);
    
    pcb.setState("Ready");
    
    krnLoadProgram(dataFromDisk, pcb.getProcessID());
    
    // Delete the file from virtual memory (the file system)
    krnFileSystemDriver.deleteFile(fileName);
};

/**
 * Writes the specified process from physical memory to the hard drive.
 * @param {type} pid The process that needs to be written to disk.
 */
MemoryManager.prototype.swapProcessOut = function(pid)
{
    krnTrace("Swapping process " + pid + " from the physical memory to the hard drive.");
    
    var pcb = _PCBFactory.getProcess(pid);
    
    var fileName = _PCBFactory.generateProcessFileName(pcb.getProcessID());
    
    var processData = this.readProcessData(pcb.getProcessID());
    //console.log("------Data length: " +processData.length);
    
    //console.log("From Memory: " + processData);
    
    // Create the swap file for this process.
    krnFileSystemDriver.createNewFile(fileName);
    
    // Write the contents of the process to disk.
    krnFileSystemDriver.writeDataToFile(fileName, processData);
    
    
    // Make the memory block available for use.
    _MemoryManager.clearMemoryBlock(pcb.getMemoryBlock());
    
    pcb.setBaseAddress(-1);
    pcb.setLimitAddress(-1);
    pcb.setMemoryBlock(-1);
    pcb.setState('On Disk');    
};

MemoryManager.prototype.readProcessData = function(pid)
{
    var pcb = _PCBFactory.getProcess(pid);
    
    var memoryBlock = pcb.getMemoryBlock();
    
    var baseAddress = this.memoryBlocks[memoryBlock]['baseAddress'];
    var limitAddress = this.memoryBlocks[memoryBlock]['limitAddress'];
    
    var data = null;
    
    if ( (baseAddress === null) || (limitAddress === null))
    {
       throw new Error ("Error reading process dasta");
    }
    
    var data = "";
    
    for (var logicalAddress=0; logicalAddress < SYSTEM_MEMORY_BLOCK_SIZE; logicalAddress++)
    {
        data += this.readDataAtLogicalAddress(logicalAddress, pcb.getProcessID());
    }
    
    return data;
};