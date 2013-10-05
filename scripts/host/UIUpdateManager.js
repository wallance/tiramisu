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
  this._generateRows();  
};

UIUpdateManager._generateRows = function() {
    
    var tableBody = $('<tbody>');
    
    //var tableRow = null;
    
    for (var i = 0; i < SYSTEM_MEMORY_SIZE; i = i + 8) {
        var tableRow = $('<tr>');
        $('<th>').html( '0x' + baseTenToEight(i)).appendTo(tableRow);
        for (var j = 0; j < 8; j++) {
            $('<td>').html('00').appendTo(tableRow);
        }
        $(tableRow).appendTo(tableBody);
    }
    $(tableBody).appendTo($('#memory-monitor table'));
    //$().html(this._generateRows());
    
};

function baseTenToEight(baseTen) {
    return baseTen.toString(16).toUpperCase();
};