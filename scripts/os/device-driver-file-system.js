/* ----------------------------------
   device-driver-file-system.js
   
   Requires deviceDriver.js
   
   The File System Device Driver.

   This driver utilizes the HTML5 Session Storage object to implement its
   functionality.
   ---------------------------------- */

DeviceDriverFileSystem.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverFileSystem()
{
    this.TRACK_COUNT = 3;
    this.SECTOR_COUNT = 7;
    this.BLOCK_SIZE_IN_BYTES = 64;
    this.BLOCKS_PER_SECTOR = 7;
    
    this.hardDisk = sessionStorage;
};

DeviceDriverFileSystem.prototype.driverEntry = function()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
};

DeviceDriverFileSystem.prototype.format = function()
{
    this.hardDisk.clear();
    
};

DeviceDriverFileSystem.prototype.translateAsKey = function(track, sector, block)
{
    // Helps ensure the required parameters are valid.
    if ( (track === null) ||
         (sector !== null) ||
         (block !== null) ||
         (typeof track === 'undefined') ||
         (typeof sector !== 'undefined') ||
         (typeof block !== 'undefined') )
    {
        throw 'Unable to translate TSB.  One or more values are null and or undefined.';
    }
    return track.toString() + sector.toString() + block.toString();
};

DeviceDriverFileSystem.prototype.readTSB = function(track, sector, block)
{
    return this.hardDisk.getItem(this.translateAsKey(track, sector, block));
};

DeviceDriverFileSystem.prototype.writeToTSB = function(track, sector, block, data)
{
    this.hardDisk.setItem(this.translateAsKey(track, sector, block), data);
};

DeviceDriverFileSystem.prototype.deleteObjectAtPath = function()
{
    
};

DeviceDriverFileSystem.prototype.createNewFile = function()
{
    
};