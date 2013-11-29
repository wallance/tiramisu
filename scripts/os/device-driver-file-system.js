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
    this.BLOCK_COUNT = 7;
    this.RESERVED_BYTE_COUNT = 4;
    this.MAX_TSB_KEY = null;
    this.MAX_DATA_SIZE_IN_BYTES = this.BLOCK_SIZE_IN_BYTES - this.RESERVED_BYTE_COUNT;
    this.MBR_TSB_KEY = this.convertToTSBKey(0);
    
    // Master File Table (MFT) constants
    this.MFT_START_TSB_KEY = this.convertToTSBKey(1);
    this.MFT_END_TSB_KEY = this.convertToTSBKey(77);
    
    this.hardDisk = sessionStorage;
};

/**
 * The driver initialization method. This should be called before any other
 * method is called.
 */
DeviceDriverFileSystem.prototype.driverEntry = function()
{   
    var key = this.TRACK_COUNT.toString() + this.SECTOR_COUNT.toString() + this.BLOCK_COUNT.toString();
    
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
    
    for (var track=0; track <= this.TRACK_COUNT; track++)
    {
        for (var sector=0; sector <= this.SECTOR_COUNT; sector++)
        {
            for (var block=0; block <= this.BLOCK_COUNT; block++)
            {
                var tsbKey = track.toString() + sector.toString() + block.toString();

                var dataValue = this.blockAsString(0, -1, -1, -1, '');

                this.hardDisk.setItem(tsbKey, dataValue);
            }
        }
    }
    
    // Set up the MBR block.
    // TODO: use MBR constant
    this.writeDataToTSB("000", false, null, "MBR");
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

/**
 * 
 * @param {type} track The track.
 * @param {type} sector The sector.
 * @param {type} block The block.
 * @returns {string} The data contained in that block
 */
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
DeviceDriverFileSystem.prototype.writeDataToTSB = function(tsbKey, isOccupied, tsbLink, data)
{
    if (data.length > this.MAX_DATA_SIZE_IN_BYTES)
    {
        throw 'Error writing data to the TSB.  Attempted to write data that exceeds the block size.';
    }
    
    if (tsbLink === null) {  };
    
    var occupiedByte = 0;
    
    if (isOccupied)
    {
        occupiedByte = 1;
    };
    
    var blockAsString = this.blockAsString(occupiedByte, -1, -1, -1, this.dataWithPadding(data));
    this.hardDisk.setItem(tsbKey, blockAsString);
};


DeviceDriverFileSystem.prototype.writeDataToFile = function(fileName, data)
{
    
};

/**
 * Deletes the specified file.
 * @param {type} fileName The file to delete.
 * @returns {Boolean} Whether or not the process was successful or not.
 */
DeviceDriverFileSystem.prototype.deleteFile = function(fileName)
{
    var wasSuccessful = false;
    
    return wasSuccessful;
};

/**
 * Creates a new file.
 * @param {type} fileName The name of the file to create.
 * @returns {Boolean} Whether or not the process was successful or not.
 */
DeviceDriverFileSystem.prototype.createNewFile = function(fileName)
{
    var result = false;
    
    var nextOpenMFTBlock = this.obtainNextOpenMFTBlock();
    var nextOpenBlockTSBKey = this.obtainNextOpenBlock();
    
    if (fileName.length > this.MAX_DATA_SIZE_IN_BYTES)
    {
        result = "The specified filename is too long. Max length is " + this.MAX_DATA_SIZE_IN_BYTES + " characters.";
    }
    else if(!nextOpenBlockTSBKey)
    {
        result = "Failed to create new file. The disk is full.";
    }
    else if (!nextOpenMFTBlock)
    {
        result = "Can't create new file because the maximum number of files has been reached."
    }
    
    this.writeDataToTSB(nextOpenBlockTSBKey, "");
    
    return result;
};

/**
 * Determines the next open block in the file data section of the disk.
 * @returns {String} Returns the TSB Key or null if there is none.
 */
DeviceDriverFileSystem.prototype.obtainNextOpenFileDataBlock = function ()
{
    return this.obtainNextOpenBlockWithinBounds(100, 377);
};

/**
 * Determines the next open block in the Master File Table (MFT).
 * @returns {String} Returns the TSB Key or null if there is none.
 */
DeviceDriverFileSystem.prototype.obtainNextOpenMFTBlock = function ()
{
    return this.obtainNextOpenBlockWithinBounds(1, 77);
}

DeviceDriverFileSystem.prototype.obtainNextOpenBlockWithinBounds = function (baseTSB, limitTSB)
{
    var nextOpenBlock = null;
    
    for (var i=baseTSB; i <= limitTSB; i++)
    {
        var tsbKey = this.convertToTSBKey(i);
        var tsbValue = this.readTSB(tsbKey);
        var tsbValueAsArray = JSON.parse(tsbValue);
        
        if (parseInt(tsbValueAsArray[0]) === 1)
        {
            // Found the next open block!
            nextOpenBlock = tsbKey;
        }
    }
    // No open block found!
    return nextOpenBlock;
}

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