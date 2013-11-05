/*
 * Simulates the machine's memory module. The OS's memory manager is responsible
 * for handling it.
 */

function MemoryHardware() {
    this.memory = new Array();
    
    this.baseAddressRegister = null;
    
    this.limitAddressRegister = null;
    
    // Initalize memory as empty
    for (var address=0; address < SYSTEM_MEMORY_SIZE; address++)
    {
        this.memory[address] = "00";
    }
}

MemoryHardware.prototype.setBaseRegister = function(address)
{
    this.baseAddressRegister = address;
};

MemoryHardware.prototype.setLimitRegister = function(address)
{
    this.limitAddressRegister = address;
};

MemoryHardware.prototype.getBaseRegister = function()
{
    return this.baseAddressRegister;
};

MemoryHardware.prototype.getLimitRegister = function()
{
    return this.limitAddressRegister;
};

MemoryHardware.prototype.read = function(address)
{
    return this.memory[address];
};

MemoryHardware.prototype.write = function(address, data)
{
    this.memory[address] = data;
    
};