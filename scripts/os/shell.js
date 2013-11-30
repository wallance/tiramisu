/* ------------
   Shell.js
   
   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

function Shell() {
    // Properties
    this.promptStr   = ">";
    this.commandList = [];
    this.curses      = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    this.apologies   = "[sorry]";
    this.commandHistory = [];
    this.commandHistoryPosition = -1;
    // Methods
    this.init					  = shellInit;
    this.putPrompt				  = shellPutPrompt;
    this.handleInput			  = shellHandleInput;
    this.execute				  = shellExecute;
    this.getCommandHistoryAtIndex = commandHistoryAtIndex;    
    this.displayCommandHistory	  = displayCommandHistory;
}

function shellInit() {
    var sc = null;
    //
    // Load the command list.

    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version data.";
    sc.function = shellVer;
    this.commandList[this.commandList.length] = sc;
    
    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- This is the help command. Seek help.";
    sc.function = shellHelp;
    this.commandList[this.commandList.length] = sc;
    
    // shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down the virtual OS but leaves the underlying hardware simulation running.";
    sc.function = shellShutdown;
    this.commandList[this.commandList.length] = sc;

    // cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen and resets the cursor position.";
    sc.function = shellCls;
    this.commandList[this.commandList.length] = sc;

    // man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the MANual page for <topic>.";
    sc.function = shellMan;
    this.commandList[this.commandList.length] = sc;
    
    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Turns the OS trace on or off.";
    sc.function = shellTrace;
    this.commandList[this.commandList.length] = sc;

    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation on <string>.";
    sc.function = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Sets the prompt.";
    sc.function = shellPrompt;
    this.commandList[this.commandList.length] = sc;
    
    // status <string>
    sc = new ShellCommand();
    sc.command = "status";
    sc.description = "<string> - Outputs user specified status to the task bar.";
    sc.function = shellStatus;
    this.commandList[this.commandList.length] = sc;
    
    // date
    sc = new ShellCommand();
    sc.command = "date";
    sc.description = "- displays the current date and time.";
    sc.function = shellDate;
    this.commandList[this.commandList.length] = sc;
    
    // whereami
    sc = new ShellCommand();
    sc.command = "whereami";
    sc.description = "- displays your current location.";
    sc.function = shellWhereAmI;
    this.commandList[this.commandList.length] = sc;
    
    // music
    sc = new ShellCommand();
    sc.command = "music";
    sc.description = "<play | pause> - Plays or Stops \"Levels\" by Avicii.";
    sc.function = shellMusic;
    this.commandList[this.commandList.length] = sc;
    
    // bsod
    sc = new ShellCommand();
    sc.command = "bsod";
    sc.description = "Intentionally displays the BSOD screen.";
    sc.function = shellBsod;
    this.commandList[this.commandList.length] = sc;
    
    // load
    sc = new ShellCommand();
    sc.command = "load";
    sc.description = "Loads the user program from input.";
    sc.function = shellLoadProgram;
    this.commandList[this.commandList.length] = sc;
    
    // run
    sc = new ShellCommand();
    sc.command = "run";
    sc.description = "<pid> runs a program in memory by the process ID.";
    sc.function = shellRunProgram;
    this.commandList[this.commandList.length] = sc;
    
    // runall
    sc = new ShellCommand();
    sc.command = "runall";
    sc.description = "Executes all loaded programs at once.";
    sc.function = shellRunAll;
    this.commandList[this.commandList.length] = sc;
    
    // quantum
    sc = new ShellCommand();
    sc.command = "quantum";
    sc.description = "<int> sets the Round Robin quantum, in clock ticks.";
    sc.function = shellQuantum;
    this.commandList[this.commandList.length] = sc;
    
    // kill
    sc = new ShellCommand();
    sc.command = "kill";
    sc.description = "<pid> terminates the specified process.";
    sc.function = shellKill;
    this.commandList[this.commandList.length] = sc;
    
    // top
    sc = new ShellCommand();
    sc.command = "top";
    sc.description = "Shows currently running processes.";
    sc.function = shellTop;
    this.commandList[this.commandList.length] = sc;
    
    // File System Commands
    // 
    // create
    sc = new ShellCommand();
    sc.command = "create";
    sc.description = "<filename> Creates a new file with the given filename.";
    sc.function = shellCreateFile;
    this.commandList[this.commandList.length] = sc;
    
    // read
    sc = new ShellCommand();
    sc.command = "read";
    sc.description = "<filename> Reads the contents of the specified filename.";
    sc.function = shellReadFile;
    this.commandList[this.commandList.length] = sc;
    
    // write
    sc = new ShellCommand();
    sc.command = "write";
    sc.description = "<filename> \"<data>\" Writes the data inside the quotes to the filename .";
    sc.function = shellWriteFile;
    this.commandList[this.commandList.length] = sc;
    
    // delete
    sc = new ShellCommand();
    sc.command = "delete";
    sc.description = "<filename> Deletes the specified file.";
    sc.function = shellDeleteFile;
    this.commandList[this.commandList.length] = sc;
    
    // format
    sc = new ShellCommand();
    sc.command = "format";
    sc.description = "Formats the hard drive.";
    sc.function = shellFormat;
    this.commandList[this.commandList.length] = sc;
    
    // ls
    sc = new ShellCommand();
    sc.command = "ls";
    sc.description = "Lists all the files on the hard drive.";
    sc.function = shellListFiles;
    this.commandList[this.commandList.length] = sc;
    
    // setschedule
    sc = new ShellCommand();
    sc.command = "setschedule";
    sc.description = "<rr|fcfs|priority> Sets the CPU algorithm.";
    sc.function = shellSetSchedule;
    this.commandList[this.commandList.length] = sc;
    
    // getschedule
    sc = new ShellCommand();
    sc.command = "getschedule";
    sc.description = "Retrieves the current CPU scheduling algorithm.";
    sc.function = shellGetSchedule;
    this.commandList[this.commandList.length] = sc;
    
    //
    // Display the initial prompt.
    this.putPrompt();
}

function shellPutPrompt()
{
    _StdIn.putText(this.promptStr);
}

function shellHandleInput(buffer)
{
	this.commandHistory[this.commandHistory.length] = buffer;
    krnTrace("Shell Command~" + buffer);
    // 
    // Parse the input...
    //
    var userCommand = new UserCommand();
    userCommand = shellParseInput(buffer);
    // ... and assign the command and args to local variables.
    var cmd = userCommand.command;
    var args = userCommand.args;
    //
    // Determine the command and execute it.
    //
    // JavaScript may not support associative arrays in all browsers so we have to
    // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
    var index = 0;
    var found = false;
    while (!found && index < this.commandList.length)
    {
        if (this.commandList[index].command === cmd)
        {
            found = true;
            var fn = this.commandList[index].function;
        }
        else
        {
            ++index;
        }
    }
    if (found)
    {
        this.execute(fn, args);
    }
    else
    {
        // It's not found, so check for curses and apologies before declaring the command invalid.
        if (this.curses.indexOf("[" + rot13(cmd) + "]") >= 0)      // Check for curses.
        {
            this.execute(shellCurse);
        }
        else if (this.apologies.indexOf("[" + cmd + "]") >= 0)      // Check for apologies.
        {
            this.execute(shellApology);
        }
        else    // It's just a bad command.
        {
            this.execute(shellInvalidCommand);
        }
    }
}

function shellParseInput(buffer)
{
    var retVal = new UserCommand();

    // 1. Remove leading and trailing spaces.
    buffer = trim(buffer);

    // 2. Lower-case it.
    buffer = buffer.toLowerCase();

    // 3. Separate on spaces so we can determine the command and command-line args, if any.
    var tempList = buffer.split(" ");

    // 4. Take the first (zeroth) element and use that as the command.
    var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
    // 4.1 Remove any left-over spaces.
    cmd = trim(cmd);
    // 4.2 Record it in the return value.
    retVal.command = cmd;

    // 5. Now create the args array from what's left.
    for (var i in tempList)
    {
        var arg = trim(tempList[i]);
        if (arg !== "")
        {
            retVal.args[retVal.args.length] = tempList[i];
        }
    }
    return retVal;
}

function shellExecute(fn, args)
{
	// Reset the command history position counter
	this.commandHistoryPosition = -1;
	
    // We just got a command, so advance the line...
    _StdIn.advanceLine();
    // ... call the command function passing in the args...
    fn(args);
    // Check to see if we need to advance the line again
    if (_StdIn.CurrentXPosition > 0)
    {
        _StdIn.advanceLine();
    }
    // ... and finally write the prompt again.
    this.putPrompt();
}


//
// The rest of these functions ARE NOT part of the Shell "class" (prototype, more accurately), 
// as they are not denoted in the constructor.  The idea is that you cannot execute them from
// elsewhere as shell.xxx .  In a better world, and a more perfect JavaScript, we'd be
// able to make then private.  (Actually, we can. have a look at Crockford's stuff and Resig's JavaScript Ninja cook.)
//

//
// An "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function ShellCommand()     
{
    // Properties
    this.command = "";
    this.description = "";
    this.function = "";
}

//
// Another "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function UserCommand()
{
    // Properties
    this.command = "";
    this.args = [];
}


//
// Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
//
function shellInvalidCommand()
{
    _StdIn.putText("Invalid Command. ");
    if (_SarcasticMode)
    {
        _StdIn.putText("Duh. Go back to your Speak & Spell.");
    }
    else
    {
        _StdIn.putText("Type 'help' for, well... help.");
    }
}

function shellCurse()
{
    _StdIn.putText("Oh, so that's how it's going to be, eh? Fine.");
    _StdIn.advanceLine();
    _StdIn.putText("Bitch.");
    _SarcasticMode = true;
}

function shellApology()
{
   if (_SarcasticMode) {
      _StdIn.putText("Okay. I forgive you. This time.");
      _SarcasticMode = false;
   } else {
      _StdIn.putText("For what?");
   }
}

function shellVer(args)
{
    _StdIn.putText(APP_NAME + " version " + APP_VERSION);    
}

function shellHelp(args)
{
    _StdIn.putText("Commands:");
    for (var i in _OsShell.commandList)
    {
        _StdIn.advanceLine();
        _StdIn.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
    }    
}

function shellShutdown(args)
{
     _StdIn.putText("Shutting down...");
     // Call Kernel shutdown routine.
    krnShutdown();   
    // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
}

function shellCls(args)
{
    _StdIn.clearScreen();
    _StdIn.resetXY();
}

function shellMan(args)
{
    if (args.length > 0)
    {
        var topic = args[0];
        switch (topic)
        {
            case "help": 
                _StdIn.putText("Help displays a list of (hopefully) valid commands.");
                break;
            default:
                _StdIn.putText("No manual entry for " + args[0] + ".");
        }        
    }
    else
    {
        _StdIn.putText("Usage: man <topic>  Please supply a topic.");
    }
}

function shellTrace(args)
{
    if (args.length > 0)
    {
        var setting = args[0];
        switch (setting)
        {
            case "on": 
                if (_Trace && _SarcasticMode)
                {
                    _StdIn.putText("Trace is already on, dumbass.");
                }
                else
                {
                    _Trace = true;
                    _StdIn.putText("Trace ON");
                }
                
                break;
            case "off": 
                _Trace = false;
                _StdIn.putText("Trace OFF");                
                break;                
            default:
                _StdIn.putText("Invalid arguement.  Usage: trace <on | off>.");
        }        
    }
    else
    {
        _StdIn.putText("Usage: trace <on | off>");
    }
}

function shellRot13(args)
{
    if (args.length > 0)
    {
        _StdIn.putText(args[0] + " = '" + rot13(args[0]) +"'");     // Requires Utils.js for rot13() function.
    }
    else
    {
        _StdIn.putText("Usage: rot13 <string>  Please supply a string.");
    }
}

function shellPrompt(args)
{
    if (args.length > 0)
    {
        _OsShell.promptStr = args[0];
    }
    else
    {
        _StdIn.putText("Usage: prompt <string>  Please supply a string.");
    }
}

function shellStatus(args)
{
	if (args.length > 0)
	{
		_TaskBar.setStatus(args[0]);
	}
	else
	{
		_StdIn.putText("Usage: status <string>  Please supply a string.");
	}
}

function shellDate(args)
{    
	var now = new Date();
	var date = _TaskBar.getCurrentDate(now);
	var time = _TaskBar.getCurrentTime(now);
	_StdIn.putText("The current time is " + date + " " + time + ".");
}

function shellWhereAmI(args)
{
	_StdIn.putText("You're laying on a sunny beach in Hawai'i.");
}

function shellBsod()
{
	// Forces the display of the BSOD screen.
	krnTrapError("Kernel error invoked intentionally.");
	_TaskBar.setStatus("Unexpected Error");
}

function shellMusic(args)
{
	var player = document.getElementById("player");
	player.volume = 0.5;
	if (args[0] === "play")
	{
		// play() is a built-in method of the HTML5 audio player
		player.play();
		_StdIn.putText("Playing \"Levels\" by Avicii. Use \"pause\" to pause music.");
	}
	else if (args[0] === "pause")
	{
		// pause() is a built-in method of the HTML5 audio player
		player.pause();
		_StdIn.putText("Stopping music.");
	}
	else 
	{
		_StdIn.putText("Usage: <play | pause> - Plays or Stops \"Levels\" by Avicii.");
	}
}

function shellLoadProgram(args)
{
	var userProgram = document.getElementById("taProgramInput").value;
	
	// No program entered into the input
	if (userProgram.length === 0)
	{
		_StdIn.putText("Error: no program was entered.");
		return;
	};
	
	var matches = userProgram.match(/[^0-9A-F\s]+/i);
	
	// Check if there is at least one error
	if (matches !== null)
	{
		_StdIn.putText("There was an error in the program input.");
                return;
	};
        
        var processId = krnLoadProgram(userProgram);
        
        if (processId !== null)
        {
            _StdIn.putText('Loaded program and assigned a process ID of ' + processId + '.');
        }
}

function shellRunProgram(args)
{
    if (args[0])
    {
        var pid = parseInt(args[0]);
        
        var pcb = _PCBFactory.getProcess(pid);
        
        if (pcb !== null)
        {
            // Add process PCB to ready queue.
            _ReadyQueue.enqueue(pid);
            pcb.setState("Ready");
            
            _ReadyQueue.dequeue();
            
            _CurrentExecutingProcess = pid;
            _CPU.isExecuting = true;
            
            // Be usre to remove the PCB from the resident process list
            //_PCBFactory.residentProcesses[pcb.getProcessID()] = null;
            
            //krnExecuteProcess(pcb.getProcessID());            
        }
        else
        {
            _StdIn.putText("An invalid PID was supplied.");
        }
    }
    else
    {
        _StdIn.putText("Usage: <pid> please specify processor ID.");
    }
}

/**
 * The shell method for executing all loaded programs.
 * @returns {undefined}
 */
function shellRunAll()
{
    var processes = _PCBFactory.getProcesses();
    
    if (processes.length > 0)
    {
        for (var i=0; i < processes.length; i++)
        {
            // This check is a quick fix to not execute terminated processes.
            // TODO: Redesign PCB Factory to eliminate this check.  Remove
            // PCBs from resident list, upon termination.
            if (processes[i].getState() !== "Terminated")
            {
                var pid = processes[i].getProcessID();

                krnTrace("Executing processes: " + pid + ".");

                _ReadyQueue.enqueue(pid);
                processes[i].setState("Ready");
                //processes[i] = null;

                // Update the ready queue display.
                UIUpdateManager.updateProcessMonitor(pid);
            }
        }
        
        // Schedule the next process in the ready queue by removing it.
        _CurrentExecutingProcess = _ReadyQueue.dequeue();
        
        _MemoryManager.systemMemory.setBaseRegister(processes[0].getBaseAddress());
        _MemoryManager.systemMemory.setLimitRegister(processes[0].getLimitAddress());
        
        _CPU.isExecuting = true;
    }
    else
    {
        _StdIn.putText("There are no processes to run.  Please load at least one process.");
    }
    
    
    
}

/**
 * The shell method that allows users to set the quantum for Round
 * Robin scheduling.
 * @returns {undefined}
 */
function shellQuantum(args)
{
    if (typeof args[0] === 'number')
    {
        _RoundRobinQuantum = args[0];
    }
    else
    {
        StdIn.putText("Usage: <int> please specify the quantum as an integer.");
    }
}

/**
 * The shell method that allows a user to kill the process with the specified
 * PID.
 * @param {type} args Command line arguments
 * @returns {undefined}
 */
function shellKill(args)
{
    if (args.length > 0)
    {
        // Get the process ID.
        var pid = parseInt(args[0], 10);
        
        var pcb = _PCBFactory.getProcess(pid);
        pcb.setState("Terminated");
        
        // Where is this memory block located?
        var memoryBlock = pcb.getMemoryBlock();
        
        // Makes the block available for use.
        _MemoryManager.clearMemoryBlock(memoryBlock);
        
        _StdIn.putText("Terminated process " + pid + ".");
    }
    else
    {
        _StdIn.putText("Usage: <pid> please specify processor ID.");
    }
}

/**
 * The shell method that lists the active processes and their PIDs.
 * @returns {undefined}
 */
function shellTop()
{
    var processes = _PCBFactory.getProcesses();
    for (var i=0; i < processes.length; i++) {
        _Console.advanceLine();
        var processInfo = "Process #" + i + " with PID of: " + processes[i].getProcessID() + ".";
        _StdIn.putText(processInfo);
    }
}

function commandHistoryAtIndex(index)
{
	console.log(index);
	return this.commandHistory[index];
}

function displayCommandHistory(keyCode)
{
	// No command history
	if (this.commandHistory.length <= 0) { return; };
	
	// Check if position has been reset
	if (this.commandHistoryPosition === -1) { this.commandHistoryPosition = this.commandHistory.length; };
	
	var shouldDisplay = false;
	
	// When the up arrow key is pressed
	if (keyCode === 38)
	{
		if ((this.commandHistoryPosition > 0) && (this.commandHistoryPosition <= this.commandHistory.length))
		{
			this.commandHistoryPosition = this.commandHistoryPosition - 1;
			shouldDisplay = true;
		}
		else if (this.commandHistoryPosition === 0)
		{	
			// Reached the first index (the oldest command), just display it
			shouldDisplay = true;
		}
		
	}
	// When the down arrow key is pressed
	else if (keyCode === 40)
	{
		var maxArrayIndex = this.commandHistory.length - 1;
		if ( (this.commandHistoryPosition >= 0) && (this.commandHistoryPosition < maxArrayIndex) )
		{
			this.commandHistoryPosition = this.commandHistoryPosition + 1;
			shouldDisplay = true;
		}
		else if ((this.commandHistoryPosition === maxArrayIndex) || (this.commandHistoryPosition >= this.commandHistory.length) )
		{
			// Reached the last index (the newest command), just display it
			shouldDisplay = true;
		}
	}
	
	if (shouldDisplay)
	{
		// add the last entered command into the buffer and display it on screen
		var lastCommand = _OsShell.getCommandHistoryAtIndex(this.commandHistoryPosition);
		if (_Console.buffer !== '') {
			var length = _Console.buffer.length;
			for (var i=0; i < length; i++) {
				_Console.removeLastCharacter();
			};
			_Console.buffer = '';
		};
		_Console.buffer = lastCommand;
		_Console.putText(lastCommand);
	}
}

function  shellCreateFile(args)
{
    var fileName = args[0];
    
    if (!fileName) { _StdIn.putText("A filename was not specified.") };
    
    var wasSuccessful = krnFileSystemDriver.createNewFile(fileName);
    
    if (wasSuccessful === true)
    {
        _StdIn.putText("Successfully created the file " + fileName + ".");
    }
    else
    {
        krnTrace("Failed to create file. See display for details.");
        _StdIn.putText(wasSuccessful);
    }
};

function shellReadFile(args)
{
    var fileName = args[0];
    
    if (!fileName)
    {
        _StdIn.putText("A filename was not specified.");
        return;
    };
    
    var fileData = krnFileSystemDriver.readFileData(fileName);
    
    if (fileData !== null)
    {
        // Display the contents of the file to user.
        _StdIn.putText(fileData);
    }
    else
    {
        krnTrace("Failed to read file. See display for details.");
        _StdIn.putText("Failed to read the data from the specified filename");
    }
};

function shellWriteFile(args)
{
    var fileName = args[0];
    var data = args[1];
    
    if (!data) { _StdIn.putText("No data was specified to be written."); return; };
    
    // TODO: Fix the command line argument parsing functionality.
    // If spaces are used in the quotes, any spaces will cause the string
    // to be split into multiple and separate arguments.
    data = data.replace(new RegExp("(^\")|(\"$)", "g"), "");
    
    if (!fileName)
    {
        _StdIn.putText("A filename was not specified.");
        return;
    };
    
    var wasSuccessful = krnFileSystemDriver.writeDataToFile(fileName, data);
    
    if (wasSuccessful === true)
    {
        _StdIn.putText("Successfully wrote the data to the file " + fileName + ".");
    }
    else
    {
        krnTrace("Failed to create file. See display for details.");
        _StdIn.putText(wasSuccessful);
    }
}

function shellDeleteFile(args)
{
    var fileName = args[0];
    
    if (!fileName)
    {
        _StdIn.putText("A filename was not specified.");
        return;
    };
    
    var wasSuccessful = krnFileSystemDriver.readFileData(fileName);
    
    if (wasSuccessful !== null)
    {
        // Display the contents of the file to user.
        _StdIn.putText(wasSuccessful);
    }
    else
    {
        krnTrace("Failed to read file. See display for details.");
        // Failed.  wasSuccessful contains an error message.
        _StdIn.putText(wasSuccessful);
    }
}

function shellFormat()
{
    if (krnFileSystemDriver !== null)
    {
        if (krnFileSystemDriver.format())
        {
            _StdIn.putText("Successfully formatted the hard disk.");
        }
        else
        {
            _StdIn.putText("Failed to format the hard disk.");
        }
    }
    else
    {
        _StdIn.putText("Failed to format the hard disk. The FS driver has not been initialized.");
    }
}

function shellListFiles()
{
    var files = krnFileSystemDriver.listAllFiles();
    
    if (files.length === 0)
    {
        _StdOut.putText("No files have been created yet.");
    }
    else
    {
        // Loop through list of files and display them in the console.
        for (var file in files)
        {
            _StdIn.putText(files[file]);
            _StdIn.advanceLine();
        }
    }
}

function shellSetSchedule(args)
{
    if (args.length > 0)
    {
        if (_CPUScheduler.getAlgorithm(args[0]) !== null)
        {
            _SchedulingAlgorithm = args[0];
        }
        else
        {
            _StdIn.putText("Invalid scheduling algorithm.");
            return;
        }
    }
    else
    {
        _StdIn.putText("Usage: <rr | fcfs | priority> Choose an algorithm.");
    }
}

function shellGetSchedule()
{
    _StdIn.putText("The current CPU Scheudling algorithm is " + _CPUScheduler.getAlgorithm(_SchedulingAlgorithm) + ".");
}