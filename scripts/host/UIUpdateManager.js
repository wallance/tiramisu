/*
 * Is responsible for updating the User Interface (UI), when requested to do so.
 */

function UIUpdateManager() {}

/*
 * Updates the CPU monitor's values.
 */
UIUpdateManager.updateCPUMonitor = function () {
    
    // This value should be displayed as base 16
    $('#program-counter .status').html(this.baseTenToBaseSixteen(_CPU.PC, true));
    
    // These values should be displayed as a decimal.
    // They should already be stored as a decimal.
    $('#accumulator .status').html(this.baseTenToBaseSixteen(_CPU.Acc, true));
    $('#x-register .status').html(this.baseTenToBaseSixteen(_CPU.Xreg, true));
    $('#y-register .status').html(this.baseTenToBaseSixteen(_CPU.Yreg, true));
    $('#z-flag .status').html(this.baseTenToBaseSixteen(_CPU.Zflag, true));
};

/*
 * Reads memory and updates the memory display at the specified base 10 address.
 */
UIUpdateManager.updateMemoryMonitorAtAddress = function(physicalAddress, data) {
    
    // This is how we identify the individual memory address in the memory monitor.
    var addressCellId = 'mem-address-' + this.baseTenToBaseSixteen(physicalAddress, false);
    
    // Display the new data using the HTML ID.
    $('#' + addressCellId).html(data);
    
};

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
        $('<th>').html( '0x' + this.baseTenToBaseSixteen(address, false)).appendTo(tableRow);
        
        // Create all 8 blocks
        for (var j = 0; j < 8; j++) {
            $('<td id="mem-address-' + this.baseTenToBaseSixteen( (address + j), false) + '">').html('00').appendTo(tableRow);
        }
        $(tableRow).appendTo(tableBody);
    }
    $(tableBody).appendTo($('#memory-monitor table'));
};

/*
 * Updates a single process of the process monitor.  A new row will be created
 * if one does not already exist.
 */
UIUpdateManager.updateProcessMonitor = function (pid) {
    
    var currentPcb = _PCBFactory.getProcess(pid);
    
    // Build the ID tag for use in the HTML attribute. Prepend # for jQuery
    // selection.
    var processIDTag = '#process-' + currentPcb.getProcessID();
    
    // Element with process ID already exists, update it.
    if ( $(processIDTag).length ) {
        $(processIDTag + ' .pm-pid').html( currentPcb.getProcessID() );
        $(processIDTag + ' .pm-state').html( currentPcb.getState() );
        $(processIDTag + ' .pm-pc').html( this.baseTenToBaseSixteen(currentPcb.getProgramCounter(), true) );
        $(processIDTag + ' .pm-acc').html( this.baseTenToBaseSixteen(currentPcb.getAccumulator(), true) );
        $(processIDTag + ' .pm-x-reg').html( this.baseTenToBaseSixteen(currentPcb.getRegisterX(), true) );
        $(processIDTag + ' .pm-y-reg').html( this.baseTenToBaseSixteen(currentPcb.getRegisterY(), true) );
        $(processIDTag + ' .pm-z-flag').html( this.baseTenToBaseSixteen(currentPcb.getFlagZ(), true) );
        $(processIDTag + ' .pm-base-address').html( this.baseTenToBaseSixteen(currentPcb.getBaseAddress(), true) );
        $(processIDTag + ' .pm-limit-address').html( this.baseTenToBaseSixteen(currentPcb.getLimitAddress(), true) );
    }
    // Element without the process ID exists, we need to create it.
    else {
        var row = this.creareNewProcessRow(currentPcb, processIDTag);
        
        //Add it to the display
        row.appendTo( $('#process-monitor table tbody') );
    }
};


/*
 * Creates a new row for a Process Control Block (PCB).
 */
UIUpdateManager.creareNewProcessRow = function (pcb, htmlID) {    
    
    // Create new table row element, using the html ID.  Don't forget to
    // remove the first character, which is the # character.
    var processRow = $('<tr>').attr('id', htmlID.substring(1));
    
    $('<td>').addClass('pm-pid').html( pcb.getProcessID() ).appendTo(processRow);
    $('<td>').addClass('pm-state').html( pcb.getState() ).appendTo(processRow);
    $('<td>').addClass('pm-pc').html( this.baseTenToBaseSixteen(pcb.getProgramCounter(), true) ).appendTo(processRow);
    
    $('<td>').addClass('pm-acc').html( this.baseTenToBaseSixteen(pcb.getAccumulator(), true) ).appendTo(processRow);
    $('<td>').addClass('pm-x-reg').html( this.baseTenToBaseSixteen(pcb.getRegisterX(), true) ).appendTo(processRow);
    $('<td>').addClass('pm-y-reg').html( this.baseTenToBaseSixteen(pcb.getRegisterX(), true) ).appendTo(processRow);
    
    $('<td>').addClass('pm-z-flag').html( this.baseTenToBaseSixteen(pcb.getFlagZ(), true) ).appendTo(processRow);
    $('<td>').addClass('pm-base-address').html( this.baseTenToBaseSixteen(pcb.getBaseAddress(), true) ).appendTo(processRow);
    $('<td>').addClass('pm-limit-address').html( this.baseTenToBaseSixteen(pcb.getLimitAddress(), true) ).appendTo(processRow);
    
    return processRow;
};

UIUpdateManager.baseTenToBaseSixteen = function(baseTen, shouldPrependNotation) {
    var baseSixteen = baseTen.toString(16).toUpperCase();
    if (baseSixteen.length === 1) { baseSixteen = '0' + baseSixteen; };
    
    // For display purposes, we may want to prepend: 0x.
    if (shouldPrependNotation) { baseSixteen = '0x' + baseSixteen; };
    return baseSixteen;
};