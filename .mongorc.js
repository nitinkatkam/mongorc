//Editor for variable values
EDITOR='vi';

//Display the logged-in user
function whoami() {
	print(tojson(db.runCommand({connectionStatus: 1})))
} //should we also have a showPrivileges: true ?
whoAmI = whoami; //alias


//Enable pretty print by default
DBQuery.prototype._prettyShell = true;


//This is updated every 10 seconds (Is it related to the 10-sec noop?)
//DB.prototype.serverTime = function() {
//	print(new Date(db.old_serverStatus().operationTime.getTime()*1000))
//}


//function to reformat labels (remove quotes, display with color)
function colorIt(objInput) {
  chrEsc = String.fromCharCode(27)
  greenText = chrEsc + "[32m"
  resetText = chrEsc + "[0m"
	print(
		tojson(objInput)
		.replace(
			/\t"(.*?)" :/g, 
			"\t"+greenText+"$1:"+resetText
		)
	)
}


//Use color

DB.prototype.old_stats = DB.prototype.stats
DB.prototype.stats = function() { colorIt(db.old_stats()) }

DB.prototype.old_isMaster = DB.prototype.isMaster
DB.prototype.isMaster = function() { colorIt(db.old_isMaster()) }

DBCollection.prototype.old_stats = DBCollection.prototype.stats
DBCollection.prototype.stats = function() { colorIt(this.old_stats()) }

DB.prototype.old_serverStatus = DB.prototype.serverStatus
DB.prototype.serverStatus = function() { colorIt(this.old_serverStatus()) }

DB.prototype.old_version = DB.prototype.version
DB.prototype.version = function() { print("Nitin"); print(String.fromCharCode(27)+"[32m"+db.old_serverBuildInfo().version+String.fromCharCode(27)+"[0m") }
db.version = function() { print(String.fromCharCode(27)+"[32m"+db.old_serverBuildInfo().version+String.fromCharCode(27)+"[0m") }

DB.prototype.old_serverBuildInfo = DB.prototype.serverBuildInfo
DB.prototype.serverBuildInfo = function() { colorIt(this.old_serverBuildInfo()) }
db.serverBuildInfo = function() { colorIt(this.old_serverBuildInfo()) }

DB.prototype.old_printReplicationInfo = DB.prototype.printReplicationInfo
DB.prototype.printReplicationInfo = function() {
    var result = this.getReplicationInfo();
    if (result.errmsg) {
        var isMaster = this.old_isMaster();
        if (isMaster.arbiterOnly) {
            print("cannot provide replication status from an arbiter.");
            return;
        } else if (!isMaster.ismaster) {
            print("this is a slave, printing slave replication info.");
            this.printSlaveReplicationInfo();
            return;
        }
        print(tojson(result));
        return;
    }
    print("configured oplog size:   " + result.logSizeMB + "MB");
    print("log length start to end: " + result.timeDiff + "secs (" + result.timeDiffHours + "hrs)");
    print("oplog first event time:  " + result.tFirst);
    print("oplog last event time:   " + result.tLast);
    print("now:                     " + result.now);
}

