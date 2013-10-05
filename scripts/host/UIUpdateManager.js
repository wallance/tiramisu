/*
 * Is responsible for updating the User Interface (UI), when requested to do so.
 */

function UIUpdateManager() {}

UIUpdateManager.update = function () {
    
};

UIUpdateManager.updateCPUMonitor = function () {
    $('#program-counter .status').html(_CPU.PC);
    $('#accumulator .status').html(_CPU.Acc);
    $('#x-register .status').html(_CPU.Xreg);
    $('#y-register .status').html(_CPU.Yreg);
    $('#z-flag .status').html(_CPU.Zflag);
};

UIUpdateManager.initMemoryMonitor = function () {
    // Holds all the row elements
    var tableBody = $('<tbody>');
    
    // Each row has eight "blocks"
    for (var address = 0; address < SYSTEM_MEMORY_SIZE; address = address + 8) {
        
        // 1 row of 8 blocks
        var tableRow = $('<tr>');
        
        // The starting address label
        $('<th>').html( '0x' + this.baseTenToEight(address)).appendTo(tableRow);
        
        // Create all 8 blocks
        for (var j = 0; j < 8; j++) {
            $('<td>').html('00').appendTo(tableRow);
        }
        $(tableRow).appendTo(tableBody);
    }
    $(tableBody).appendTo($('#memory-monitor table'));
};

UIUpdateManager.baseTenToEight = function(baseTen) {
    return baseTen.toString(16).toUpperCase();
};