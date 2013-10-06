/* ----------------------------------
   DeviceDriverKeyboard.js
   
   Requires deviceDriver.js
   
   The Kernel Keyboard Device Driver.
   ---------------------------------- */

DeviceDriverKeyboard.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverKeyboard()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnKbdDriverEntry;
    this.isr = krnKbdDispatchKeyPress;
    // "Constructor" code.
}

// Returns the associate character for the specified keyCode
// If the character was shifted by the user, then provide "true"
function mapKeyCodeToCharacter(keyCode, wasShifted)
{	
	var nonshiftedCharacters = {
	'48':'0',
        '49':'1',
        '50':'2',
        '51':'3',
        '52':'4',
        '53':'5',
        '54':'6',
        '55':'7',
        '56':'8',
        '57':'9',
        
        '186':';',
        '187':'=',
        '188':',',
        '189':'-',
        '190':'.',
        '191':'/',
        '192':'`',
        '219':'[',
        '220':'\\',
        '221':']',
        '222':'\''
	};	
	var shiftedCharacters = {
	'48':')',
        '49':'!',
        '50':'@',
        '51':'#',
        '52':'$',
        '53':'%',
        '54':'^',
        '55':'&',
        '56':'*',
        '57':'(',
        
        '186':':',
        '187':'+',
        '188':'<',
        '189':'_',
        '190':'>',
        '191':'?',
        '192':'~',
        '219':'{',
        '220':'|',
        '221':'}',
        '222':'"'
	};
	
	var mappedCharacter = nonshiftedCharacters[keyCode];
	if (wasShifted) { mappedCharacter = shiftedCharacters[keyCode]; };
	
	return mappedCharacter;
}

function krnKbdDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
}

function krnKbdDispatchKeyPress(params)
{
    // Parse the params.    TODO: Check that they are valid and osTrapError if not.
    var keyCode = params[0];
    var isShifted = params[1];
    
    if (typeof keyCode === 'undefined' || keyCode === null)
    {
    	krnTrapError("The keyboard driver received an invalid keycode!");
    	return;
    }
    
    if (typeof isShifted === 'undefined' || isShifted === null)
    {
    	krnTrapError("The keyboard driver received an invalid shift boolean value!");
    	return;
    }
    
    krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
    var chr = "";
    // Check to see if we even want to deal with the key that was pressed.
    if ( ((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
         ((keyCode >= 97) && (keyCode <= 123)) )   // a..z
    {
        // Determine the character we want to display.  
        // Assume it's lowercase...
        chr = String.fromCharCode(keyCode + 32);
        // ... then check the shift key and re-adjust if necessary.
        if (isShifted)
        {
            chr = String.fromCharCode(keyCode);
        }
        // TODO: Check for caps-lock and handle as shifted if so.
        _KernelInputQueue.enqueue(chr);        
    }    
    else if (
               (keyCode === 8)         ||   // backspace
               (keyCode === 32)         ||   // space
               (keyCode === 13) )            // enter
    {
    	console.log("Key code has been pressed: " + keyCode);
        chr = String.fromCharCode(keyCode);
        _KernelInputQueue.enqueue(chr); 
    }
    // Case: Numerical keys, punctuation chars and when they are shifted
    else if ( ((keyCode >= 48) && (keyCode <= 57))		||
    		  ((keyCode >= 186) && (keyCode <= 192))	||
    		  ((keyCode >= 219) && (keyCode <= 222)) )
    {
    	console.log("Key code has been pressed: " + keyCode);
    	chr = mapKeyCodeToCharacter(keyCode, isShifted);
    	_KernelInputQueue.enqueue(chr); 
    }
    else if ((keyCode === 38) || (keyCode === 40)) {
    	// Further back in history (Up key)
    	_OsShell.displayCommandHistory(keyCode);
    }
}
