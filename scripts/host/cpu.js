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
		'A9' : Cpu.prototype.loadAccumulatorWithConstant,
                'AD' : Cpu.prototype.loadAccumulatorFromMemory,
                '8D' : Cpu.prototype.storeAccumulatorInMemory,
                '6D' : Cpu.prototype.addWithCarry,
                'A2' : Cpu.prototype.loadRegisterXWithConstant,
                'AE' : Cpu.prototype.loadRegisterXFromMemory,
                'A0' : Cpu.prototype.loadRegisterYWithConstant,
                'AC' : Cpu.prototype.loadRegosterYFromMemory,
                'EA' : Cpu.prototype.noOperation,
                '00' : Cpu.prototype.breakCall,
                'EC' : Cpu.prototype.compareByteInMemoryWithRegisterX,
                'D0' : Cpu.prototype.branchXBytesIfZFlagIsZero,
                'EE' : Cpu.prototype.incrementValueOfAByte,
                'FF' : Cpu.prototype.systemCall
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
    

/***************************
 *
 * OPERATION CODE METHODS
 * 
 ***************************/


Cpu.prototype.loadAccumulatorWithConstant = function () {
    
};
Cpu.prototype.loadAccumulatorFromMemory = function () {
};
Cpu.prototype.storeAccumulatorInMemory = function () {
    
};


Cpu.prototype.addWithCarry = function () {
    
};
Cpu.prototype.loadRegisterXWithConstant = function () {
    
};
Cpu.prototype.loadRegisterXFromMemory = function () {
    
};
Cpu.prototype.loadRegisterYWithConstant = function () {
    
};
Cpu.prototype.loadRegosterYFromMemory = function () {
    
};
Cpu.prototype.noOperation = function () {
    
};
Cpu.prototype.breakCall = function () {
    
};
Cpu.prototype.compareByteInMemoryWithRegisterX = function () {
    
};
Cpu.prototype.branchXBytesIfZFlagIsZero = function () {
    
};
Cpu.prototype.incrementValueOfAByte = function () {
    
};
Cpu.prototype.systemCall = function () {
    
};

Cpu.prototype.setCPUProperties = function(programCounter, accumulator, xReg, yReg, zFlag) {
        this.PC     = programCounter;
        this.Acc    = accumulator;
        this.Xreg   = xReg;
        this.Yreg   = yReg;
        this.Zflag  = zFlag;
};
    
// Called when isExecuting is true
Cpu.prototype.cycle = function() {
    krnTrace("CPU cycle");
    // TODO: Accumulate CPU usage and profiling statistics here.
    // Do the real work here. Be sure to set this.isExecuting appropriately.


    // Refresh the CPU display
    UIUpdateManager.updateCPUMonitor();
};