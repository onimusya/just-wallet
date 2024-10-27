import { 
  mnemonicToId, 
  validatePrincipal, 
  encrypt, 
  decrypt, 
  fromHexString, 
  bip39 } from "./utils.js";

var identities = {};  

const processId = (id, type) => {
  var p = id.getPrincipal().toString();
  console.log(`[identity][processId] p:`, p);
  
  identities[p] = id;
  return {
    principal : p,
    type : type
  }
}
  
const isLoaded = (p) => {
  return (identities.hasOwnProperty(p));
};

const JustIdentity = {
  getIdentity: (principal) => {
    if (!identities.hasOwnProperty(principal)) return false;
    return identities[principal];
  },

  setup: (type, optdata) => {

    return new Promise(async (resolve, reject) => {
      var id;

      switch (type) {

        case "private":
          localStorage.setItem('_m', optdata.mnemonic);
          id = mnemonicToId(optdata.mnemonic);

          console.log(`[identity][private] id:`, id);

          encrypt(optdata.mnemonic, id.getPrincipal().toString(), optdata.password).then(_em => {
            var ems = localStorage.getItem('_em');
            if (!ems) {
              ems = {};
              ems[id.getPrincipal().toString()] = _em;
            } else {
              ems = JSON.parse(ems);
              ems[id.getPrincipal().toString()] = _em;
            }
            localStorage.setItem('_em', JSON.stringify(ems));
            return resolve(processId(id, type));        
          });
          return;

        default:
          break;
      }
    });
  },

  load : (_id) => {
    return new Promise(async (resolve, reject) => {
      var id;
      switch (_id.type) {
        case "private":
          if (!isLoaded(_id.principal)) { 
            var t = localStorage.getItem('_m');
            if (!t){
              return reject("No seed");
            } else {
              var mnemonic = t;
              id = mnemonicToId(mnemonic);
              return resolve(processId(id, _id.type));
            }
          } else {
            return resolve({
              principal : _id.principal,
              type : _id.type
            });
          }
        
        default:
          break;

      }

      return reject();

    });
  },

  unlock: (_id, optdata) => {
    return new Promise(async (resolve, reject) => {
      JustIdentity.load(_id).then(resolve).catch(async (e) => {
        var id;
        switch(_id.type) {
          case "private":
            var t = localStorage.getItem('_em');
            if (!t) return reject("No encrypted seed to decrypt");
            var ems = JSON.parse(t);
            var em;

            if (ems.hasOwnProperty(_id.principal) === false) return reject("No encrypted seed to decrypt");           
            em = ems[_id.principal];
            
            decrypt(em, _id.principal, optdata.password).then(mnemonic => {
              localStorage.setItem('_m', mnemonic);
              id = mnemonicToId(mnemonic);
              return resolve(processId(id, _id.type));
            }).catch(reject);
            return;

          default:
            break;
        };

      });
    });
  },

  lock: (_id) => {
    return new Promise(async (resolve, reject) => { 
      switch (_id.type) {
        case "private":
          localStorage.removeItem("_m");
          break;

        default: 
          break;
      }

      delete identities[_id.principal];
      return resolve(true);

    });
  },

  clear : (_id) => { 
    return new Promise(async (resolve, reject) => { 
      switch (_id.type) {
        case "private":
          localStorage.removeItem("_m");
          localStorage.removeItem("_em");
          break;

        default:
          break;

      }

      delete identities[_id.principal];
      return resolve(true);

    });
  },
  validatePrincipal : validatePrincipal,
  validateMnemonic : bip39.validateMnemonic,
  generateMnemonic : bip39.generateMnemonic,
  validatePassword : (p) => {
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
    return re.test(p);
  }    
}

export {JustIdentity};
window.JustIdentity = JustIdentity;
