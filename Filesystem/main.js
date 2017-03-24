function handleKeydown(event) {
	console.log('[TestApp] handleKeydown : ' + event.keyCode);

	switch(event.keyCode) {
		case 10009:
			console.log('[TestApp] return');
			tizen.application.getCurrentApplication().exit();
			
		break;
		default:

			break;
	}
}

var result = '';
var text = '';
var documentsObj = '';
var sampleDirObj = '';
var sampleFileObj = '';


function test0() {
	tizen.filesystem.resolve(
		'documents',
		function(obj) {
			documentsObj = obj;
			
			text = 'tizen.filesystem.resolve documents Success : ' + JSON.stringify(documentsObj);
			log(text);
		},
		function(error) {
			log(JSON.stringify(error));
		},
		'rw'
	);
}

function test1() {
	if(documentsObj) {
		var newDir = documentsObj.createDirectory('sampleDir');

		text = 'Directory is created in : ' + newDir.fullPath;
		log(text);
	}
}

function test2() {
	tizen.filesystem.resolve(
		'documents/sampleDir',
		function(obj) {
			sampleDirObj = obj;
			
			text = 'tizen.filesystem.resolve documents/SampleDir Success : ' + JSON.stringify(sampleDirObj);
			log(text);
		},
		function(error) {
			log(JSON.stringify(error));
		},
		'rw'
	);	
}

function test3() {
	if(sampleDirObj) {
		var newDir = sampleDirObj.createFile('sampleFile.txt');
			
		text = 'File is created in : ' + newDir.fullPath;
		log(text);
	}
}

function test4() {
	if(sampleDirObj) { 
		sampleFileObj = sampleDirObj.resolve('sampleFile.txt');
		
		text = 'tizen.filesystem.resolve documents/sampleDir/sampleFile.txt Success : ' + JSON.stringify(sampleFileObj);;
		log(text);
	}
}

function test5() {
	if(sampleFileObj) { 
		sampleFileObj.openStream(
			'a',
			function(fileStream) {
				fileStream.write('This is just sample test.');
				
				text = 'openStream write Success : This is just sample test.';
				log(text);
				
				fileStream.close();
			},
			function(error) {
				text = 'openStream Error : ' + JSON.stringify(error);
				log(text);
			}
		);
	}
}

function test6() {
	var contents;

	if(sampleFileObj) { 
		sampleFileObj.openStream(
			'r',
			function(fileStream) {
				fileStream.position = 0;
				contents = fileStream.read(fileStream.bytesAvailable);
									
				text = 'openStream read Success : ' + contents;
				log(text);

				fileStream.close();
			},
			function(error) {
				text = 'openStream Error : ' + JSON.stringify(error);
				log(text);
			}
		);
	}
}

function test7() {
	if(sampleDirObj) {
		sampleDirObj.deleteFile(
			sampleDirObj.fullPath + '/sampleFile.txt',
			function() {
				text = 'deleteFile Success';
				log(text);
			},
			function(error) {
				text = 'deleteFile Error : ' + JSON.stringify(error);
				log(text);
			}
		);
	}
}

function test8() {
	if(documentsObj) {
		documentsObj.deleteDirectory(
			documentsObj.fullPath + '/sampleDir',
			false,
			function() {
				text = 'deleteDirectory Success';
				log(text);
			},
			function(error) {
				text = 'deleteDirectory Error : ' + JSON.stringify(error);
				log(text);
			}
		);
	}
}

function test9() {
	if(documentsObj) {
		documentsObj.listFiles(
			function(files) {
				text = 'listFiles Success : ' + JSON.stringify(files);
				log(text);
			},
			function(error) {
				text = 'listFiles Error : ' + JSON.stringify(error);
				log(text);
			}
		);
	}
}

function main() {
	console.log('[TestApp] onload');
}

function log(string) {
	result = result + '<br>' + string;
	document.getElementById('result').innerHTML = result;
}

function logClear() {
	result = '';
	document.getElementById('result').innerHTML = '';
}
