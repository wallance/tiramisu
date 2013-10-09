/* ------------
   Console.js

   Requires globals.js

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
   ------------ */

function CLIconsole() {
    // Properties
    this.CurrentFont      = _DefaultFontFamily;
    this.CurrentFontSize  = _DefaultFontSize;
    this.CurrentXPosition = 0;
    this.CurrentYPosition = _DefaultFontSize;
    this.buffer = "";
    
    
    // Methods
    this.init = function() {
       this.clearScreen();
       this.resetXY();
    };

    this.clearScreen = function() {
       _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
    };

    this.resetXY = function() {
       this.CurrentXPosition = 0;
       this.CurrentYPosition = this.CurrentFontSize;
    };

    this.handleInput = function() {
    
       while (_KernelInputQueue.getSize() > 0)
       {
           // Get the next character from the kernel input queue.
           var chr = _KernelInputQueue.dequeue();
           
           // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
           if (chr === String.fromCharCode(13))  //     Enter key
           {
               // The enter key marks the end of a console command, so ...
               // ... tell the shell ...
               _OsShell.handleInput(this.buffer);
               // ... and reset our buffer.
               this.buffer = "";
           }
           // Backspace buffer by one character, when text has been entered
           else if ((chr === String.fromCharCode(8)) && (this.buffer.length > 0))
           {
           		console.log("Remove from char has been executed"); 
           		
           		this.removeLastCharacter();           		       		
           }
           // TODO: Write a case for Ctrl-C.
           else
           {
               // This is a "normal" character, so ...
               // ... draw it on the screen...
               this.putText(chr);
               // ... and add it to our buffer.
               this.buffer += chr;
           }
       }
    };

    this.putText = function(text) {
       // My first inclination here was to write two functions: putChar() and putString().
       // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
       // between the two.  So rather than be like PHP and write two (or more) functions that
       // do the same thing, thereby encouraging confusion and decreasing readability, I
       // decided to write one function and use the term "text" to connote string or char.
       if (text !== "")
       {
            // Draw the text at the current X and Y coordinates.
            _DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, text);
         	
            // Move the current X position.
            var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, text);
            this.CurrentXPosition = this.CurrentXPosition + offset;
       }
    };

    this.advanceLine = function() {
       this.CurrentXPosition = 0;
       this.CurrentYPosition += _DefaultFontSize + _FontHeightMargin;
       
       // Scroll the canvas in the Y position exceeds the canvas height
       if (this.CurrentYPosition >= _Canvas.height)
       {
       		this.scrollCanvasUp();
       };  
    };
    
    // Moves the canvas contents upward.
    this.scrollCanvasUp = function()
    {
    	// Determine how many lines to adjust the console text.
		var scrollOffset = _DefaultFontSize + _FontHeightMargin;
		
		// Now, adjust the Y position appropriately.
		this.CurrentYPosition = this.CurrentYPosition - scrollOffset;
		
		// Shift the image of the canvas upward.
		var canvasImageToBeShifted = _DrawingContext.getImageData(0, scrollOffset, _Canvas.width, _Canvas.height - scrollOffset);
		
		// Redraw the old canvas image in it's new position by placing
		//  it at the top of the canvas.
		_DrawingContext.putImageData(canvasImageToBeShifted, 0, 0);
		
		// Now, clear the area where the old data used to be.
		_DrawingContext.clearRect(0, _Canvas.height - scrollOffset, _Canvas.width, scrollOffset);
    };
    
    // Removes the last character from both the console and the buffer
    this.removeLastCharacter = function()
    {
    	// It would be a good idea to just measure the last character and erase it.
    	// However, it is easier to delete the entire line and redraw it, less the last
    	// character.
    	var oldBuffer = this.buffer;
    	
		// Remove the last character
		var newBuffer = oldBuffer.substring(0, oldBuffer.length - 1);
		
		// Save the new buffer
		this.buffer = newBuffer;
		
		// Let's determine where we should start when redrawing and
		// where we should stop when removing the text.  Remember, the OS Shell
		// prompt string is a variable.
		var beginXOffset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, _OsShell.promptStr);
	
		// Determine the size of the text in the old buffer contents
		var oldBufferTextSize = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, oldBuffer);
		
		// Delete all the text on the canvas
		var offsetY = this.CurrentYPosition - this.CurrentFontSize;
		_DrawingContext.clearRect(beginXOffset, offsetY, oldBufferTextSize, (this.CurrentFontSize + _FontHeightMargin));
		
		// Redraw the new buffer contents on the canvas
		// Note, we don't want to overwrite the prompt character, so we need to offset it
		_DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, beginXOffset, this.CurrentYPosition, newBuffer);
		
		// Now that the character is removed, set we need to update the
		// appropriate positions.  Make sure we don't forget about the OS Shell prompt!
		var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, newBuffer);
		this.CurrentXPosition = beginXOffset + offset;
    };
};
