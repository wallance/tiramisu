/* ------------  
   CPU.js

   Requires global.js.
   
   Routines for the host CPU simulation, NOT for the OS itself.  
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.

   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

function Cpu() {
    this.PC    = 0;     // Program Counter
    this.Acc   = 0;     // Accumulator
    this.Xreg  = 0;     // X register
    this.Yreg  = 0;     // Y register
    this.Zflag = 0;     // Z-ero flag (Think of it as "isZero".)
    this.isExecuting = false;
    
    // Based on the instruction set of the 6502 microprocessor.
    // See: http://www.labouseur.com/courses/os/instructionset.pdf
    this.OPERATION_CODES = {
        // After a few hours of figuring out why calling these methods
        // were losing the 'this' scope, do not use the method itself as the value
        // i.e: Cpu.prototype.loadAccumulatorFromMemory.  Instead, enclose just
        // the method name in quotes, to store it as a string. To call the method,
        // use: this[<variable-containing-method-name>], where
        // <variable-containing-method-name> is the name of the method as returned
        // by this array.
        'A9' : 'loadAccumulatorWithConstant',
        'AD' : 'loadAccumulatorFromMemory',
        '8D' : 'storeAccumulatorInMemory',
        '6D' : 'addWithCarry',
        'A2' : 'loadRegisterXWithConstant',
        'AE' : 'loadRegisterXFromMemory',
        'A0' : 'loadRegisterYWithConstant',
        'AC' : 'loadRegisterYFromMemory',
        'EA' : 'noOperation',
        '00' : 'breakCall',
        'EC' : 'compareByteInMemoryWithRegisterX',
        'D0' : 'branchXBytesIfZFlagIsZero',
        'EE' : 'incrementValueOfAByte',
        'FF' : 'systemCall'
    };
    
    this.init();    
};

Cpu.prototype.init = function() {
    this.PC    = 0;
    this.Acc   = 0;
    this.Xreg  = 0;
    this.Yreg  = 0;
    this.Zflag = 0;      
    this.isExecuting = false;
};

/*
 * Increments the PC by 1 each time method is called.
 * Used when moving to the next instruction and moving to the next byte of
 * memory.
 */
Cpu.prototype.incrementProgramCounter = function () {
    this.PC++; // incremented on separate line for breakpoint/debugging purposes.
    return this.PC;
};

/*
 * Returns the current value of the PC.
 */
Cpu.prototype.getProgramCounterValue = function () {
    return this.PC;  
};

/**
 * Executes the next instruction, as specified by the program counter.
 */
Cpu.prototype.executeNextInstruction = function () {
    
    // Determine next instruction
    var nextInstruction = this.fetchNextInstructionFromMemory();
    
    console.log("Process ID: " + _CurrentExecutingProcess + " is executing instruction: " + nextInstruction);
    
    // Determine corresponding method
    var instructionMethod = this.OPERATION_CODES[nextInstruction];
    
    // Execute it, if it was a valid opcode
    if ( (instructionMethod !== null) && (typeof instructionMethod !== 'undefined') ) {
        
        // This is how we must call the method name, while keeping the same
        // context.  If we do not use the "this" keyword, any
        // call in the format of: this.<method-or-property> will loose its scope.
        // For details, see the comment above the OPERATION_CODES array.
        // See: http://stackoverflow.com/questions/7652672/call-function-from-string-inside-object
        this[instructionMethod]();
    } else {
        // Terminate the current process.
        this.killCurrentExecutingProcess("Unsupported Instruction", "An invalid opcode was encountered.");
    }
};

Cpu.prototype.fetchNextByteFromMemory = function() {
    // Increment PC because we are done reading the byte.  When the current
    // executing instruction is finished, we need to make sure the program
    // counter is pointing to the next instruction and not an operand.
    // Some op codes have 1 byte operands, others have 2 bytes.  It is up to
    // the individual op code methods to call this twice, if it does require
    // a two byte operand.
    var nextLogicalAddress = this.incrementProgramCounter();
    
    // What data is stored at the next logical address?
    var nextByte = _MemoryManager.readDataAtLogicalAddress(nextLogicalAddress, _CurrentExecutingProcess);
    
    return nextByte;
};

Cpu.prototype.fetchNextInstructionFromMemory = function() {
    // The program counter (PC) contains the next logical address
    // of the next instruction.
    var pc = _CPU.getProgramCounterValue();
    
    var nextInstruction = _MemoryManager.readDataAtLogicalAddress(pc, _CurrentExecutingProcess);
    
    var physicalAddress = _MemoryManager.translateAddress(pc, _CurrentExecutingProcess);
    
    physicalAddress = UIUpdateManager.baseTenToBaseSixteen(physicalAddress, false);
    
    // Added this because it is useful to know which address is currently executing.
    // Using JS breakpoints in Chrome is another way to step through and understand which
    // instruction is executing next.
    $('#mem-address-' + physicalAddress).css("font-weight","Bold");
    
    return nextInstruction;
};

/***************************
 *
 * OPERATION CODE METHODS
 * 
 ***************************/

/**
 * Op Code: A9
 * 
 * Loads the accumulator with the constant, as specified by the operand.
 */
Cpu.prototype.loadAccumulatorWithConstant = function () {
    
    // Obtain the constant from memory
    var constantFromMemory = this.fetchNextByteFromMemory();
    
    // The second parameter (known as the radix) specifies the base of what
    // the first parameter is supposed to be recognized as.
    // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
    this.Acc = parseInt(constantFromMemory, 16);
    
    // We are done executing this op code
    this.incrementProgramCounter();
};

/**
 * Op Code: AD
 * 
 * Loads the accumulator with the value specified at the address of the two byte
 * operand.
 */
Cpu.prototype.loadAccumulatorFromMemory = function () {
    
    // For this instruction, the address that points to the location in memory
    // that contains this data is split across two bytes
    var firstAddressFragment = this.fetchNextByteFromMemory();
    var secondAddressFragment = this.fetchNextByteFromMemory();
    
    // Format the bytes as a logical address
    var logicalAddress = (parseInt(secondAddressFragment, 16) + parseInt(firstAddressFragment, 16)); //.toString(16);
    
    if (_MemoryManager.validateAddress(logicalAddress, true) === false)
    {
        this.memoryOutOfBoundsAccessHandler();
    }
    
    // Read the data at the determined logical address.
    this.Acc = _MemoryManager.readDataAtLogicalAddress(logicalAddress, _CurrentExecutingProcess);
    
    // We are done executing this op code
    this.incrementProgramCounter();
};
/**
 * Op Code: 8D
 * 
 * 
 */
Cpu.prototype.storeAccumulatorInMemory = function () {
    
    // For this instruction, the address that points to the location in memory
    // that contains this data is split across two bytes
    var firstAddressFragment = this.fetchNextByteFromMemory();
    var secondAddressFragment = this.fetchNextByteFromMemory();
    
    var logicalAddress = (parseInt(secondAddressFragment, 16) + parseInt(firstAddressFragment, 16));
    
    if (_MemoryManager.validateAddress(logicalAddress, true) === false)
    {
        this.memoryOutOfBoundsAccessHandler();
    }
    
    _MemoryManager.writeDataAtLogicalAddress(logicalAddress, this.Acc, _CurrentExecutingProcess);
    
    // We are done executing this op code
    this.incrementProgramCounter();
};

/**
 * Op Code: 6D
 * 
 * Adds the value located at the address specified by the two byte operand, and
 * stores it in the accumulator.
 */
Cpu.prototype.addWithCarry = function () {
    // For this instruction, the address that points to the location in memory
    // that contains this data is split across two bytes
    var firstAddressFragment = this.fetchNextByteFromMemory();
    var secondAddressFragment = this.fetchNextByteFromMemory();
    
    // Format the bytes as a logical address
    var logicalAddress = (parseInt(secondAddressFragment, 16) + parseInt(firstAddressFragment, 16));
    
    if (_MemoryManager.validateAddress(logicalAddress, true) === false)
    {
        this.memoryOutOfBoundsAccessHandler();
    }
    
    // Read the data at the determined logical address.
    var additive = _MemoryManager.readDataAtLogicalAddress(logicalAddress, _CurrentExecutingProcess);
    
    this.Acc = (parseInt(this.Acc, 16) + parseInt(additive, 16));
    
    // We are done executing this op code
    this.incrementProgramCounter();
};

/**
 * Op Code: A2
 * 
 * Loads a constant, as specified by the one byte operand, into the Y register.
 */
Cpu.prototype.loadRegisterXWithConstant = function () {
    // Obtain the constant from memory (as specified by the operand in memory)
    var constantFromMemory = this.fetchNextByteFromMemory();
    
    this.Xreg = parseInt(constantFromMemory, 16);
    
    // We are done executing this op code
    this.incrementProgramCounter();
};

/**
 * Op Code: AE
  * Loads the contents of memory, as specified by the two byte operand,
 * into the X register.
 */
Cpu.prototype.loadRegisterXFromMemory = function () {
    
    // For this instruction, the address that points to the location in memory
    // that contains this data is split across two bytes
    var firstAddressFragment = this.fetchNextByteFromMemory();
    var secondAddressFragment = this.fetchNextByteFromMemory();
    
    // Format the bytes as a logical address
    var logicalAddress = (parseInt(secondAddressFragment, 16) + parseInt(firstAddressFragment, 16));
    
    if (_MemoryManager.validateAddress(logicalAddress, true) === false)
    {
        this.memoryOutOfBoundsAccessHandler();
    }
    
    // Read the data at the determined logical address.
    this.Xreg = _MemoryManager.readDataAtLogicalAddress(logicalAddress, _CurrentExecutingProcess);
    
    // We are done executing this op code
    this.incrementProgramCounter();
};

/**
 * Op Code: A0
 * 
 * Loads a constant, as specified by the one byte operand, into the Y register.
 */
Cpu.prototype.loadRegisterYWithConstant = function () {
    
    // Obtain the constant from memory (as specified by the operand in memory)
    var constantFromMemory = this.fetchNextByteFromMemory();
    
    this.Yreg = parseInt(constantFromMemory, 16);
    
    // We are done executing this op code
    this.incrementProgramCounter();
};

/**
 * Op Code: AC
 * 
 * Loads the contents of memory, as specified by the two byte operand,
 * into the Y register.
 */
Cpu.prototype.loadRegisterYFromMemory = function () {
    // For this instruction, the address that points to the location in memory
    // that contains this data is split across two bytes
    var firstAddressFragment = this.fetchNextByteFromMemory();
    var secondAddressFragment = this.fetchNextByteFromMemory();
    
    // Format the bytes as a logical address
    var logicalAddress = (parseInt(secondAddressFragment, 16) + parseInt(firstAddressFragment, 16));
    
    if (_MemoryManager.validateAddress(logicalAddress, true) === false)
    {
        this.memoryOutOfBoundsAccessHandler();
    }
    
    // Read the data at the determined logical address.
    this.Yreg = _MemoryManager.readDataAtLogicalAddress(logicalAddress, _CurrentExecutingProcess);
    
    // We are done executing this op code
    this.incrementProgramCounter();
};

/**
 * Op Code: EA
 * 
 * This operation has no effect on the program.  Moves onto
 * the next instruction. 
 */
Cpu.prototype.noOperation = function () {
    // We are done executing this op code
    this.incrementProgramCounter();
};

/**
 * Op Code: 00
 * 
 * Causes the execution of the current running program to finish.
 */
Cpu.prototype.breakCall = function () {
    
    var pcb = _PCBFactory.getProcess(_CurrentExecutingProcess);
    
    // Update the appropriate values of the current PCB
    pcb.setAccumulator(_CPU.Acc);
    pcb.setProgramCounter(_CPU.PC);
    pcb.setRegisterX(_CPU.Xreg);
    pcb.setRegisterY(_CPU.Yreg);
    pcb.setFlagZ(_CPU.Zflag);
    pcb.setState("Terminated");
    
    UIUpdateManager.updateProcessMonitor(_CurrentExecutingProcess);
    
     // We are done executing the program, so put the prompt back.
    _StdIn.advanceLine();
    _OsShell.putPrompt();
    
    if (_ReadyQueue.getNext())
    {
        _CPUScheduler.switchContext();
    }
    else
    {
        // Program requested to stop execution
        _CPU.isExecuting = false;
        _CurrentExecutingProcess = null;
        
        // Reset the CPU registers.
        _CPU.setCPUProperties(0, 0, 0, 0, 0);
        
    }
    // Make the memory block available again.
    _MemoryManager.clearMemoryBlock(pcb.getMemoryBlock());
};

/**
 * Op Code: EC
 * 
 * Determines the value of the memory contents at the address
 * specified by the two byte operand.  Then, compares the value
 * with the contents of the X register.  Sets the Z flag to 1 if
 * they are equal.
 */
Cpu.prototype.compareByteInMemoryWithRegisterX = function () {
    // For this instruction, the address that points to the location in memory
    // that contains this data is split across two bytes
    var firstAddressFragment = this.fetchNextByteFromMemory();
    var secondAddressFragment = this.fetchNextByteFromMemory();
    
    // Format the bytes as a logical address
    var logicalAddress = (parseInt(secondAddressFragment, 16) + parseInt(firstAddressFragment, 16));
    
    if (_MemoryManager.validateAddress(logicalAddress, true) === false)
    {
        this.memoryOutOfBoundsAccessHandler();
    }
    
    // Read the data at the determined logical address.
    var memoryContents = _MemoryManager.readDataAtLogicalAddress(logicalAddress, _CurrentExecutingProcess);
    
    memoryContents = parseInt(memoryContents, 16);
    
    // Compare memory contents with the contents of register X
    if (memoryContents === this.Xreg) {
        this.Zflag = 1;
    } else {
        this.Zflag = 0;
    }
    
    // We are done executing this op code
    this.incrementProgramCounter();
};

/**
 * Op Code: D0
 * 
 * Branches to an address if the Z Flag is zero.  The address is determined
 * by the specified operand.
 */
Cpu.prototype.branchXBytesIfZFlagIsZero = function () {
    
    if (this.Zflag === 0) {
        
        var branchToAddress = this.fetchNextByteFromMemory();
        
        branchToAddress = parseInt(branchToAddress, 16);
        
        this.PC = this.PC + branchToAddress;
        
        var pcb = _PCBFactory.getProcess(_CurrentExecutingProcess);
        
        // Ensure branching out of current process does not occur
        if(_MemoryManager.translateAddress(this.PC, pcb.getProcessID()) > pcb.getLimitAddress())
        {
            this.PC = this.PC - SYSTEM_MEMORY_BLOCK_SIZE;
        }
        
        this.incrementProgramCounter();
    } else {
        // We are done executing this op code, skip next byte (operand)
        // by incrementing the PC twice.
        for (var i=0; i < 2; i++) { this.incrementProgramCounter(); };
    }
};

/**
 * Op Code: EE
 * 
 * Determines the memory address to increment based on the next two bytes.
 * Then, the value at the address is incremented by 1 and it is saved back
 * to the same (specified) memory address.
 */
Cpu.prototype.incrementValueOfAByte = function () {
    // For this instruction, the address that points to the location in memory
    // that contains this data is split across two bytes
    var firstAddressFragment = this.fetchNextByteFromMemory();
    var secondAddressFragment = this.fetchNextByteFromMemory();
    
    // Format the bytes as a logical address
    var logicalAddress = (parseInt(secondAddressFragment, 16) + parseInt(firstAddressFragment, 16));
    
    if (_MemoryManager.validateAddress(logicalAddress, true) === false)
    {
        this.memoryOutOfBoundsAccessHandler();
    }
    
    // Convert to decimal
    var memoryContentsAsBaseTen = parseInt(_MemoryManager.readDataAtLogicalAddress(logicalAddress, _CurrentExecutingProcess), 16);
    
    memoryContentsAsBaseTen++;
    
    var memoryContentsAsBaseSixteen = memoryContentsAsBaseTen.toString(16).toUpperCase();
    
    if (memoryContentsAsBaseSixteen.length === 1) {
        memoryContentsAsBaseSixteen = "0" + memoryContentsAsBaseSixteen;
    }
    
    // Write it back to memory
    _MemoryManager.writeDataAtLogicalAddress(logicalAddress, memoryContentsAsBaseSixteen, _CurrentExecutingProcess);
    
    // We are done executing this op code
    this.incrementProgramCounter();
};

// Op Code: FF
Cpu.prototype.systemCall = function () {
    
    if (this.Xreg === 1) {
        
        var valueOfRegisterX = parseInt(this.Yreg).toString();
        
        _StdIn.putText(valueOfRegisterX);        
        
    } else if (this.Xreg === 2) {
        
        // This is how we know when we reached the end of the system call.
        var terminationIndicator = "00";
        
        // For readability and simplicity, get the contents of register Y
        // This serves as the logical address.
        var logicalAddressForRegY = _CPU.Yreg;
        
        var currentByte = _MemoryManager.readDataAtLogicalAddress(logicalAddressForRegY, _CurrentExecutingProcess);
        
        var textOutput = "";
        
        while (currentByte !== terminationIndicator) {
            var keyCode = parseInt(currentByte, 16);
            
            // Add the character to the string
            textOutput = textOutput + String.fromCharCode(keyCode);
            
            // Move to the next logical address
            logicalAddressForRegY++;
            
            // Read the data from memory.
            currentByte = _MemoryManager.readDataAtLogicalAddress(logicalAddressForRegY, _CurrentExecutingProcess);
        }
        // Output the entire string
        _StdIn.putText(textOutput);
    }    
    _StdIn.advanceLine();
    _OsShell.putPrompt();
    // We are done executing this op code
    this.incrementProgramCounter();
};

Cpu.prototype.killCurrentExecutingProcess = function(errorType, message)
{
    if (typeof _CurrentExecutingProcess === 'number')
    {
        var args = new Array();
        args[0] = _CurrentExecutingProcess;
        
        // Kill the current executing process
        shellKill( args );
        throw new Error(message);
    } else
    {
        // This should never happen, as long as the _CurrentExecutingProcess is
        // set properly.
        krnTrapError("Failed to kill the current executing process after an error occured: " + errorType + ".");
    }
};

Cpu.prototype.memoryOutOfBoundsAccessHandler = function()
{
    this.killCurrentExecutingProcess("Memory Out of Bounds", "Process attempted to access memory outside its base and limit addresses.");
};

Cpu.prototype.setCPUProperties = function(programCounter, accumulator, xReg, yReg, zFlag)
{
        this.PC     = programCounter;
        this.Acc    = accumulator;
        this.Xreg   = xReg;
        this.Yreg   = yReg;
        this.Zflag  = zFlag;
};
    
// Called when isExecuting is true
Cpu.prototype.cycle = function()
{
    krnTrace("CPU cycle");
    
    _CPUScheduler.schedule();
    
    // Begin the execution
    this.executeNextInstruction();
    
    // Increment cycle count for Round Robin Scheduling
    _RoundRobinCycleCount++;
    
};