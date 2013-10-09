/*
 * Simulates the machine's memory module. The OS's memory manager is responsible
 * for handling it.
 */

function MemoryHardware() {
    this.memory = new Array();
    for (var address=0; address < SYSTEM_MEMORY_SIZE; address++)
        {
            this.memory[address] = "00";
        }
}

MemoryHardware.prototype.read = function(address)
{
    return this.memory[address];
};

MemoryHardware.prototype.write = function(address, data)
{
    this.memory[address] = data;
    
};