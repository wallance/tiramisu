/* ------------
   Kernel.js
   
   Requires globals.js
   
   Routines for the Operating System, NOT the host.
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */


//
// OS Startup and Shutdown Routines   
//
function krnBootstrap()      // Page 8.
{
   hostLog("bootstrap", "host");  // Use hostLog because we ALWAYS want this, even if _Trace is off.

   // Initialize our global queues.
   _KernelInterruptQueue = new Queue();  // A (currently) non-priority queue for interrupt requests (IRQs).
   _KernelBuffers = new Array();         // Buffers... for the kernel.
   _KernelInputQueue = new Queue();      // Where device input lands before being processed out somewhere.
   _Console = new CLIconsole();          // The command line interface / console I/O device.

   // Initialize the CLIconsole.
   _Console.init();

   // Initialize standard input and output to the _Console.
   _StdIn  = _Console;
   _StdOut = _Console;

   // Load the Keyboard Device Driver
   krnTrace("Loading the keyboard device driver.");
   krnKeyboardDriver = new DeviceDriverKeyboard();     // Construct it.  TODO: Should that have a _global-style name?
   krnKeyboardDriver.driverEntry();                    // Call the driverEntry() initialization routine.
   krnTrace(krnKeyboardDriver.status);
   
   // Initalize memory and the PCB Factory
   _MemoryManager = new MemoryManager();
   _PCBFactory = new ProcessControlBlockFactory();
   
   _ReadyQueue = new Queue();

   // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
   krnTrace("Enabling the interrupts.");
   krnEnableInterrupts();

   // Launch the shell.
   krnTrace("Creating and Launching the shell.");
   _OsShell = new Shell();
   _OsShell.init();
   
   _TaskBar.setStatus("Running");

   // Finally, initiate testing.
   if (_GLaDOS) {
      _GLaDOS.afterStartup();
   }
}

function krnShutdown()
{
    krnTrace("begin shutdown OS");
    // TODO: Check for running processes.  Alert if there are some, alert and stop.  Else...    
    // ... Disable the Interrupts.
    krnTrace("Disabling the interrupts.");
    krnDisableInterrupts();
    // 
    // Unload the Device Drivers?
    // More?
    //
    _TaskBar.stopClock();
    document.getElementById("player").pause();
    krnTrace("end shutdown OS");
}


function krnOnCPUClockPulse() 
{
    /* This gets called from the host hardware sim every time there is a hardware clock pulse.
       This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
       This, on the other hand, is the clock pulse from the hardware (or host) that tells the kernel 
       that it has to look for interrupts and process them if it finds any.                           */

    // Check for an interrupt, are any. Page 560
    if (_KernelInterruptQueue.getSize() > 0)    
    {
        // Process the first interrupt on the interrupt queue.
        // TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
        var interrupt = _KernelInterruptQueue.dequeue();
        krnInterruptHandler(interrupt.irq, interrupt.params);
    }
    else if (_CPU.isExecuting) // If there are no interrupts then run one CPU cycle if there is anything being processed.
    {
        // Execute a single cycle
        _CPU.cycle();
        
        // Refresh the CPU display and process monitor
        UIUpdateManager.updateCPUMonitor();
        UIUpdateManager.updateProcessMonitor(_CurrentExecutingProcess);
        
        // Only update memory when CPU is executing?
        //UIUpdateManager.updateMemoryMonitorAtAddress();
    }    
    else                       // If there are no interrupts and there is nothing being executed then just be idle.
    {
       krnTrace("Idle");
    }
    
}


// 
// Interrupt Handling
// 
function krnEnableInterrupts()
{
    // Keyboard
    hostEnableKeyboardInterrupt();
    // Put more here.
}

function krnDisableInterrupts()
{
    // Keyboard
    hostDisableKeyboardInterrupt();
    // Put more here.
}

function krnInterruptHandler(irq, params)    // This is the Interrupt Handler Routine.  Pages 8 and 560.
{
    // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on.  Page 766.
    krnTrace("Handling IRQ~" + irq);

    // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
    // TODO: Consider using an Interrupt Vector in the future.
    // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.  
    //       Maybe the hardware simulation will grow to support/require that in the future.
    switch (irq)
    {
        case TIMER_IRQ: 
            krnTimerISR();                   // Kernel built-in routine for timers (not the clock).
            break;
        case KEYBOARD_IRQ: 
            krnKeyboardDriver.isr(params);   // Kernel mode device driver
            _StdIn.handleInput();
            break;
        default: 
            krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
    }
}

function krnTimerISR()  // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver).
{
    // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
}   



//
// System Calls... that generate software interrupts via tha Application Programming Interface library routines.
//
// Some ideas:
// - ReadConsole
// - WriteConsole
// - CreateProcess
// - ExitProcess
// - WaitForProcessToExit
// - CreateFile
// - OpenFile
// - ReadFile
// - WriteFile
// - CloseFile


//
// OS Utility Routines
//
function krnTrace(msg)
{
   // Check globals to see if trace is set ON.  If so, then (maybe) log the message. 
   if (_Trace)
   {
      if (msg === "Idle")
      {
         // We can't log every idle clock pulse because it would lag the browser very quickly.
         if (_OSclock % 10 == 0)  // Check the CPU_CLOCK_INTERVAL in globals.js for an 
         {                        // idea of the tick rate and adjust this line accordingly.
            hostLog(msg, "OS");
         }         
      }
      else
      {
       hostLog(msg, "OS");
      }
   }
}
   
function krnTrapError(msg)
{
    hostLog("OS ERROR - TRAP: " + msg);
    _DrawingContext.fillStyle = '#000000';
    _DrawingContext.fillRect(0, 0, _Canvas.width, _Canvas.height);
    _DrawingContext.fillStyle = '#008000';
    _DrawingContext.font = "13px 'Source Code Pro'";
    _DrawingContext.textBaseline = 'top';
    krnShutdown();
    var maxPos = _Canvas.width - 10;
    var message = "System Failure";
    for (var i=10; i <= _Canvas.height; i = i + 17)
    {
    	
    	_DrawingContext.fillText("System FailureSystem FailureSystem FailureSystem FailureSystem Failure", 10, i);
    }
    clearInterval(_hardwareClockID);
    //document.getElementById("player").pause();
    hostBtnHaltOS_click(false);
    
}

/*
 * Loads source code into memory.
 * 
 * Note: Code must be validated before calling this method.
 */
function krnLoadProgram(sourceCode) {    
    
    var pcb = _PCBFactory.createProcess();
    
    UIUpdateManager.updateProcessMonitor(pcb.getProcessID());
    
    krnTrace("Loading user program into memory.");
    
    if (pcb === null) { return null; }
    
    _MemoryManager.systemMemory.setBaseRegister(pcb.getBaseAddress());
    _MemoryManager.systemMemory.setLimitRegister(pcb.getLimitAddress());
    
    sourceCode = sourceCode.replace(/\s+/g, "");
    
    // Split the code into an array of opcodes, every two characters
    // A great use of regex from: http://stackoverflow.com/questions/6259515/javascript-elegant-way-to-split-string-into-segments-n-characters-long
    var splicedCode = sourceCode.match(/.{1,2}/g);
    
    // Loads code into memory
    for (var address=0; address < splicedCode.length; address++) {
        _MemoryManager.writeDataAtLogicalAddress(address, splicedCode[address], pcb.getProcessID());
    }
    
    return pcb.getProcessID();
}

/*
 * Executes the specified process ID.
 */
function krnExecuteProcess(pid) {
    
    // Obtain process info
    var pcb = _PCBFactory.getProcess(pid);
    
    // PCB will be null if it does not exist
    if (pcb !== null) {
        
        krnTrace("Executing process with a PID of " + pid + '.');        
        
        // Set the context of what process is executing.
        _CurrentExecutingProcess = pcb.getProcessID();
        
        // Starts executing on the next clock pulse.
        _CPU.isExecuting = true;
        
    } else {
        _StdIn.putText('Process with an ID ' + pid + 'does not exist.');
        return;
    }
}