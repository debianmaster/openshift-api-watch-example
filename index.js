const OpenShiftClient = require('./lib/index.js')
const Api = require('kubernetes-client');

const JSONStream = require('json-stream');

const jsonStreamDC = new JSONStream();
const jsonStreamROUTE = new JSONStream();
const jsonStreamSVC = new JSONStream();
const jsonStreamUSERS = new JSONStream();
const jsonStreamNAMESPACES = new JSONStream();

const io = require('socket.io')(8081);

const oapi = new OpenShiftClient.OApi(OpenShiftClient.config.fromKubeconfig());
const api =  new Api.Core(Api.config.fromKubeconfig());

const asserts={
  dc: ["welcome","time","ks","mysql","myapp","blue","bluegreen","green","scm-web-hooks"], 
  svc: ["welcome","time","ks","mysql","myapp","blue","bluegreen","green","scm-web-hooks"],
  route: ["welcome","time","ks","dbtest","myapp","bluegreen","scm-web-hooks"],
  ns: ["mycliproject","myjbossapp","consoleproject","binarydeploy","bluegreen","scm-web-hooks"]
}

var scores=[];
var nsVsusers=[];

function addScore(key,val,type){
	if(key!=undefined){
		for(k in scores){
			if(scores[k].name==key && asserts[type].indexOf(val)!=-1){
				scores[k].score+=1;
				io.emit('message',scores);
		    }
	    }
	}
}
//Deployment Configs
const streamDC = oapi.deploymentconfigs.get({ qs: { watch: true } });
streamDC.pipe(jsonStreamDC);
jsonStreamDC.on('data', object => {
  if(object.type=='ADDED'){
    console.log("DC",object.object.metadata.name)
    addScore(nsVsusers[object.object.metadata.namespace],dc);
    console.log(scores);
    
  }
});


//Services
const streamSVC = api.services.get({ qs: { watch: true } });
streamSVC.pipe(jsonStreamSVC);
jsonStreamSVC.on('data', object => {
  if(object.type=='ADDED'){	
    console.log("SVC",object.object.metadata.name);
    addScore(nsVsusers[object.object.metadata.namespace]);
    console.log(scores);
  }
});

//Namespaces
const streamNS = api.ns.get({ qs: { watch: true } });
streamNS.pipe(jsonStreamNAMESPACES);
jsonStreamNAMESPACES.on('data', object => {
  if(object.type=='ADDED'){	
  	if(undefined==object.object.metadata.name) return;
  	nsVsusers[object.object.metadata.name]=object.object.metadata.annotations['openshift.io/requester'];
    console.log(nsVsusers);
    addScore(nsVsusers[object.object.metadata.name]);
  }
});

//Route
const streamROUTE = oapi.routes.get({ qs: { watch: true } });
streamROUTE.pipe(jsonStreamROUTE);
jsonStreamROUTE.on('data', object => {
  if(object.type=='ADDED'){	
    console.log("ROUTE",object.object.spec.host);
    addScore(nsVsusers[object.object.metadata.namespace]);
  }
});

//Users
const streamUSERS = oapi.users.get({ qs: { watch: true } });
streamUSERS.pipe(jsonStreamUSERS);
jsonStreamUSERS.on('data', object => {
  if(object.type=='ADDED'){	
    console.log("User",object.object.metadata.name);
    scores.push({name:object.object.metadata.name,score:0,trend:'neu'});
    addScore(object.object.metadata.name); 
  }
});

io.on('connection', function(soc){
    io.emit('message',scores);
});
