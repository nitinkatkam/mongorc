EDITOR='vi';

function whoami() {
				print(tojson(db.runCommand({connectionStatus: 1})))
} //should we also have a showPrivileges: true ?

whoAmI = whoami;

//Enable pretty print by default
DBQuery.prototype._prettyShell = true;

