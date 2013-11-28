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
    
    this.MAX_TSB_KEY = null;
    
    this.hardDisk = sessionStorage;
};

DeviceDriverFileSystem.prototype.driverEntry = function()
{   
    var key = this.TRACK_COUNT.toString() + this.SECTOR_COUNT.toString() + this.BLOCKS_PER_SECTOR.toString();
    
    this.MAX_TSB_KEY = parseInt(key);
    
    this.format();
    
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
};

DeviceDriverFileSystem.prototype.format = function()
{
    this.hardDisk.clear();
    
    for (var i=0; i <= this.MAX_TSB_KEY; i++)
    {
        var tsbKey = this.convertToTSBKey(i);
        
        var dataValue = this.blockAsString(0, -1, -1, -1, '');
        
        this.hardDisk.setItem(tsbKey, dataValue);
    }
    
    // Set up the MBR block.
    this.writeDataToTSB(0, 0, 0, "MBR");
    
};

// The padding functionality is taken from:
// http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
DeviceDriverFileSystem.prototype.convertToTSBKey = function(i) {
    var padKey = function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    };
    return padKey(i, 3);
};

DeviceDriverFileSystem.prototype.blockAsString = function(isBlockOccupied, track, sector, block, data)
{
    var actualData = this.dataWithPadding(data);
    var blockDataAsArray = [isBlockOccupied, track, sector, block, actualData];
    return JSON.stringify(blockDataAsArray);
}

DeviceDriverFileSystem.prototype.readTSB = function(track, sector, block)
{
    return this.hardDisk.getItem(this.convertToTSBKey(track, sector, block));
};

DeviceDriverFileSystem.prototype.writeDataToTSB = function(track, sector, block, data)
{
    var blockAsString = this.blockAsString(1, -1, -1, -1, this.dataWithPadding(data));
    this.hardDisk.setItem(this.convertToTSBKey(track, sector, block), blockAsString);
};

DeviceDriverFileSystem.prototype.deleteObjectAtPath = function()
{
    
};

DeviceDriverFileSystem.prototype.createNewFile = function()
{
    
};

DeviceDriverFileSystem.prototype.dataWithPadding = function(actualData)
{
    for (var i=actualData.length; i < 60; i++)
    {
        actualData = actualData + '-';
    }
    
    return actualData;
};