/*
 * Is responsible for updating the User Interface (UI), when requested to do so.
 */

function UIUpdateManager() {}

UIUpdateManager.update = function () {
    
};

/*
 * Updates the CPU monitor's values.
 */
UIUpdateManager.updateCPUMonitor = function () {
    $('#program-counter .status').html(this.baseTenToBaseSixteen(_CPU.PC));
    $('#accumulator .status').html(_CPU.Acc);
    $('#x-register .status').html(_CPU.Xreg);
    $('#y-register .status').html(_CPU.Yreg);
    $('#z-flag .status').html(_CPU.Zflag);
};

/*
 * Reads memory and updates the memory display at the specified base 10 address.
 */
UIUpdateManager.updateMemoryMonitorAtAddress = function(address) {
    
    // This is how we identify the individual memory address in the memory monitor.
    var addressCellId = 'mem-address-' + this.baseTenToBaseSixteen(address);
    
    // Display the new data
    $(addressCellId).html(_MemoryManager.readDataAtAddress(address));
    
};
/*
 * Reads memory and updates the entire memory display.  Useful for initial
 */
/*UIUpdateManager.updateMemoryMonitor = function() {
    
};*/

/*
 * Initalizes the memory display for the globally specified system memory size.
 */
UIUpdateManager.initMemoryMonitor = function () {
    // Holds all the row elements
    var tableBody = $('<tbody>');
    
    // Each row has eight "blocks"
    for (var address = 0; address < SYSTEM_MEMORY_SIZE; address = address + 8) {
        
        // 1 row of 8 blocks
        var tableRow = $('<tr>');
        
        // The starting address label
        $('<th>').html( '0x' + this.baseTenToBaseSixteen(address)).appendTo(tableRow);
        
        // Create all 8 blocks
        for (var j = 0; j < 8; j++) {
            $('<td id="mem-address-' + this.baseTenToBaseSixteen(address + j ) + '">').html('00').appendTo(tableRow);
        }
        $(tableRow).appendTo(tableBody);
    }
    $(tableBody).appendTo($('#memory-monitor table'));
};

UIUpdateManager.baseTenToBaseSixteen = function(baseTen) {
    return baseTen.toString(16).toUpperCase();
};