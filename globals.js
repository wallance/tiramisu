/* ------------  
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS
//
var APP_NAME = "Tiramisu";  // 'cause I was at a loss for a better name.
var APP_VERSION = "0.04";   // What did you expect?

var CPU_CLOCK_INTERVAL = 100;   // This is in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                    // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;  

// System Memory (size is in bytes)
// The size of a block to execute user programs
var SYSTEM_MEMORY_BLOCK_SIZE = 256;
// The number of blocks to use for user programs
var SYSTEM_MEMORY_BLOCK_COUNT = 3;
// Total size of the memory
var SYSTEM_MEMORY_SIZE = SYSTEM_MEMORY_BLOCK_SIZE * SYSTEM_MEMORY_BLOCK_COUNT;

// Scheduling
var ROUND_ROBIN_DEFAULT_QUANTUM = 6;

//
// Global Variables
//
var _CPU = null;

var _OSclock = 0;       // Page 23.

var _Mode = 1;   // 0 = Kernel Mode, 1 = User Mode.  See page 21.

var _MemoryManager = null;

// Processes
var _PCBFactory = null;
var _CurrentExecutingProcess = null;

// CPU Scheduler
var _CPUScheduler = null;
var _RoundRobinCycleCount = null;
var _RoundRobinQuantum = 6;
var _SchedulingAlgorithm = 'Round Robin';

var _Canvas = null;               // Initialized in hostInit().
var _DrawingContext = null;       // Initialized in hostInit().
var _DefaultFontFamily = "Helvetica";  // Ignored, I think. This was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;        // Additional space added to font size when advancing a line.

// Default the OS trace to be on.
var _Trace = true;

// OS queues
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;
var _ReadyQueue = null;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console = null;
var _OsShell = null;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var krnKeyboardDriver = null;
var krnFileSystemDriver = null;

var _TaskBar = null;

// For testing...
var _GLaDOS = null;
