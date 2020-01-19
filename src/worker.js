const workerImportObject = {
  env: {
    memoryBase: 0,
    tableBase: 0,
    memory: new WebAssembly.Memory({initial: 256}),
    table: new WebAssembly.Table({initial: 0, element: 'anyfunc'}),
    tempRet0: null,
    setTempRet0: function(input){
      console.log(`Input from setTempRet0: ${input}`);
      this.tempRet0 = input;
      console.log(this.tempRet0);
      return this.tempRet0;
    },
    getTempRet0: function(){
      return this.tempRet0;
    },
    CallJS: function(value){
      console.log(`Number received from C++ in Web Worker: ${value}`);
    },
  },
};

//create Promise to handle Worker calls while module is i
// let wasmResolve;
// let wasmPrepared = new Promise((resolve) => {
//   wasmResolve = resolve;
// });
let wasmInstance;

self.addEventListener('message', (message) => {
  console.log(`Got message in worker.js: `, message.data);

  if (message.data.purpose === "INSTANTIATE"){
    WebAssembly.instantiateStreaming(fetch(message.data.modulePath), workerImportObject).then(instantiatedModule => {
      console.log(`instance:\n\n`, instantiatedModule.instance);
      console.log(`Exports:\n\n`, instantiatedModule.instance.exports);
      wasmInstance = instantiatedModule.instance;
    });
  } else if (message.data.purpose === "SAVAGE_MATH"){
    let num = message.data.workerNum;
    let response = {
      "purpose": "CALL_JAVASCRIPT",
      "workerResult" : wasmInstance.exports._Z6Savagei(num)
    };
    self.postMessage(response);
  }
}, false);