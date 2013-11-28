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
    this.RESERVED_BYTE_COUNT = 4;
    
    this.MAX_TSB_KEY = null;
    this.MAX_DATA_SIZE_IN_BYTES = this.BLOCK_SIZE_IN_BYTES - this.RESERVED_BYTE_COUNT;
    
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

/**
 * Clears the hard drive and formats it.
 */
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

/**
 * Converts an integer to a TSB key, as a pre-padded string.
 * @param {int} i The non-padded TSB key as an integer
 * @returns {string} The padded key.
 */
DeviceDriverFileSystem.prototype.convertToTSBKey = function(i) {
    // The padding functionality is taken from:
    // http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
    var padKey = function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    };
    return padKey(i, 3);
};

/**
 * Converts a full block of data into a JSON encoded string.
 * @param {type} isBlockOccupied Sets the byte that determines if the block is occupied with valid data.
 * @param {type} track The track.
 * @param {type} sector The sector.
 * @param {type} block The block.
 * @param {type} data The data stored in the block
 * @returns {@exp;JSON@call;stringify} A JSON encoded string
 */
DeviceDriverFileSystem.prototype.blockAsString = function(isBlockOccupied, track, sector, block, data)
{
    var actualData = this.dataWithPadding(data);
    var blockDataAsArray = [isBlockOccupied, track, sector, block, actualData];
    return JSON.stringify(blockDataAsArray);
};

DeviceDriverFileSystem.prototype.readTSB = function(track, sector, block)
{
    return this.hardDisk.getItem(this.convertToTSBKey(track, sector, block));
};

/**
 * 
 * @param {int} track The track number
 * @param {int} sector The sector number
 * @param {int} block The block number
 * @param {type} data The data to write to the TSB.
 * @returns {undefined}
 */
DeviceDriverFileSystem.prototype.writeDataToTSB = function(track, sector, block, data)
{
    if (data.length > this.MAX_DATA_SIZE_IN_BYTES)
    {
        throw 'Error writing data to the TSB.  Attempted to write data that exceeds the block size.';
    }
    
    var blockAsString = this.blockAsString(1, -1, -1, -1, this.dataWithPadding(data));
    this.hardDisk.setItem(this.convertToTSBKey(track, sector, block), blockAsString);
};


DeviceDriverFileSystem.prototype.deleteFile = function()
{
    
};


DeviceDriverFileSystem.prototype.createNewFile = function(track, sector, block, fileName, data)
{
    
};

/**
 * Fills the empty space of the block with hyphens.
 * @param {type} actualData The data to pad.
 * @returns {String} The padded block of data.
 */
DeviceDriverFileSystem.prototype.dataWithPadding = function(actualData)
{
    for (var i=actualData.length; i < this.MAX_DATA_SIZE_IN_BYTES; i++)
    {
        actualData = actualData + '-';
    }
    
    return actualData;
};