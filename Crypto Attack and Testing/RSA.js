// //////////////////////////////////////////////////////////////////////////////////////////// //
// ====== --- ====== > ============================================= < ====== --- ====== //
// ====== --- ====== > Sub-Functions < ====== --- ====== //
// ====== --- ====== > ============================================= < ====== --- ====== //
// //////////////////////////////////////////////////////////////////////////////////////////// //

function ConvertToInt(message_str) {
  res = 0n;
  for (var i = 0; i < message_str.length; i++)
    res = res * 256n + BigInt(message_str.charCodeAt(i));
  return res;
}

function reverseString(str) {
  var splitString = str.split("");
  var reverseArray = splitString.reverse();
  var joinArray = reverseArray.join("");
  return joinArray;
}

function ConvertToStr(n) {
  var res = "";
  while (n > 0) {
    res += String.fromCharCode(Number(n % 256n));
    n = n / 256n;
  }
  return reverseString(res);
}

function GCD(a, b) {
  if (b == 0) return a;
  return GCD(b, a % b);
}

function ExtendedEuclid(a, b) {
  let obj = { x: 1n, y: 0n };
  if (b == 0) return obj;
  obj = ExtendedEuclid(b, a % b);
  let k = a / b;
  let x_temp = obj.x;
  obj.x = obj.y;
  obj.y = x_temp - k * obj.y;
  return obj;
}

function power(a, n, mod) {
  if (n == 0) return 1n % mod;
  else if (n == 1) return a % mod;
  else {
    b = power(a, n / 2n, mod);
    b = (b * b) % mod;
    if (n % 2n == 0) return b;
    else return (b * a) % mod;
  }
}

function InvertedModulo(a, n) {
  var obj = { x: 0n, y: 0n };
  obj = ExtendedEuclid(a, n);
  if (obj.x < 0) obj.x = (obj.x + n) % n;

  return obj.x;
}

function getMaxLength(mes, n) {
  let mesLen = 1n;
  for (var i = 0; i < mes.length; i++) {
    mesLen *= 256n;
    if (!(mesLen < n)) {
      return i;
    }
  }
  return i;
}

// //////////////////////////////////////////////////////////////////////////////////////////// //
// ====== --- ====== > ============================================= < ====== --- ====== //
// ====== --- ====== > Encryption & Decryption Functions < ====== --- ====== //
// ====== --- ====== > ============================================= < ====== --- ====== //
// //////////////////////////////////////////////////////////////////////////////////////////// //

function Encrypt(m, n, e) {
  mes = ConvertToInt(m);
  let c = power(mes, e, n);
  return ConvertToStr(c);
}

function Decrypt(c, p, q, e) {
  c = ConvertToInt(c);
  d = InvertedModulo(e, (p - 1n) * (q - 1n));

  message = power(c, d, p * q);
  m = ConvertToStr(message);
  return m;
}

function splitMessage(mes, n) {
  let maxLen = getMaxLength(mes, n);
  let mesArr = [];
  for (var i = 0; i < Math.ceil(mes.length / maxLen); i++) {
    mesArr.push(mes.substr(i * maxLen, maxLen));
  }

  return mesArr;
}

function encryptMessage(mes, n, e) {
  mesArr = splitMessage(mes, n);
  encArr = [];
  for (var i = 0; i < mesArr.length; i++) {
    encArr.push(Encrypt(mesArr[i], n, e));
  }

  return encArr.join("//==//");
}

function decryptMessage(ctext, p, q, e) {
  ctext = ctext.split("//==//");
  plaintext = [];

  for (var i = 0; i < ctext.length; i++) {
    plaintext.push(Decrypt(ctext[i], p, q, e));
  }
  return plaintext.join("");
}

// //////////////////////////////////////////////////////////////////////////////////////////// //
// ====== --- ====== > ============================================= < ====== --- ====== //
// ====== --- ====== > Generate Key Functions < ====== --- ====== //
// ====== --- ====== > ============================================= < ====== --- ====== //
// //////////////////////////////////////////////////////////////////////////////////////////// //

function randomNumber(min, max) {
  let dif = max - min;
  let rndm = Math.random();
  rndm = Math.floor(rndm * dif);
  rndm = rndm + min;

  return rndm;
}

function isPrime(num) {
  let isPrm = true;
  if (num == 0 || num == 1) isPrm = false;

  for (var i = 2n; i <= Math.sqrt(Number(num)); i++) {
    if (num % i == 0) {
      isPrm = false;
      break;
    }
  }
  return isPrm;
}

function generateKey(min, size) {
  let p, q, e;

  ispm = false;
  while (!ispm) {
    p = randomNumber(Math.pow(2, size / 2), Math.pow(2, size));
    p = BigInt(p);
    ispm = isPrime(p);
    // console.log(p);
    // console.log(ispm);
  }

  ispm = false;
  while (!ispm) {
    q = randomNumber(Math.pow(2, size / 2), Math.pow(2, size));
    q = BigInt(q);
    ispm = isPrime(q);
    if (ispm && p == q) ispm = false;
    // console.log(q);
    // console.log(ispm);
  }

  ispm = false;
  while (!ispm) {
    e = randomNumber(Math.pow(2, size / 4), Math.pow(2, size / 2));
    e = BigInt(e);
    if ((p - 1n) * (q - 1n) > e && GCD(e, (p - 1n) * (q - 1n)) == 1n)
      ispm = true;
    // console.log(e);
    // console.log(ispm);
  }

  return {
    p,
    q,
    e,
  };
}

// //////////////////////////////////////////////////////////////////////////////////////////// //
// ====== --- ====== > ============================================= < ====== --- ====== //
// ====== --- ====== > Testing Functions < ====== --- ====== //
// ====== --- ====== > ============================================= < ====== --- ====== //
// //////////////////////////////////////////////////////////////////////////////////////////// //

// (async function () {
//   // p = 233n;
//   // q = 233n;
//   // e = 9n;
//   // console.log(GCD(e, (p - 1n) * (q - 1n)));

//   // for (var i = 0; i <= 100; i++) {

//   var date1 = new Date().getTime();
//   var { p, q, e } = await generateKey(0, 64);
//   p = BigInt(p);
//   q = BigInt(q);
//   e = BigInt(e);
//   var flag = true;

//   let message = "attack";
//   let cmessage = "attack";

//   var date2 = new Date().getTime();
//   cText = await encryptMessage(message, p * q, e);
//   var date3 = new Date().getTime();

//   plaintext = await decryptMessage(cText, p, q, e);
//   var date4 = new Date().getTime();

//   console.log("p: " + p);
//   console.log("q: " + q);
//   console.log("e: " + e);
//   console.log("cText: ", cText);
//   console.log("=============================================");
//   console.log(GCD(e, (q - 1n) * (p - 1n)));
//   console.log((q - 1n) * (p - 1n) > e);
//   console.log("Message: ", cmessage);
//   console.log("=============================================");
//   console.log("Plaintext: ", plaintext);
//   console.log("=============================================");

//   console.log(cmessage == plaintext);
//   if (cmessage != plaintext) {
//     console.log("p: " + p);
//     console.log("q: " + q);
//     console.log("e: " + e);
//     flag = false;
//   }

//   console.log("=============================================");

//   console.log("Key Generation Time", date2 - date1);
//   console.log("Encryption Time", date3 - date2);
//   console.log("Decryption Time", date4 - date3);
//   // }
// })();

// //////////////////////////////////////////////////////////////////////////////////////////// //
// ====== --- ====== > ============================================= < ====== --- ====== //
// ====== --- ====== > RSA Attacks < ====== --- ====== //
// ====== --- ====== > ============================================= < ====== --- ====== //
// //////////////////////////////////////////////////////////////////////////////////////////// //

async function TestEncryptionTime() {
  var numBits = [];
  var ellapsedTime = [];

  for (var i = 8; i <= 128; i = i * 2) {
    numBits.push(i);

    t1 = performance.now();
    var { p, q, e } = await generateKey(0, i);
    p = BigInt(p);
    q = BigInt(q);
    e = BigInt(e);
    n = p * q;

    let message = "attack";
    let cmessage = "attack";

    t2 = performance.now();
    cText = await encryptMessage(message, n, e);
    t3 = performance.now();
    plaintext = await decryptMessage(cText, p, q, e);
    t4 = performance.now();

    ellapsedTime.push({
      numBits: i,
      "Key Generation Time": t2 - t1,
      "Encryption Time": t3 - t2,
      "Decryption Time": t4 - t3,
    });
    console.log(plaintext == cmessage);
    console.log({
      numBits: i,
      "Key Generation Time": t2 - t1,
      "Encryption Time": t3 - t2,
      "Decryption Time": t4 - t3,
    });
  }
  return ellapsedTime;
}

// (async function () {
//   encryptionTest = await TestEncryptionTime();
//   console.log(encryptionTest);
// })();

// RSA attack using chosen cipher text attack

function decryptMessageCCA(ctext, p, q, e) {
  ctext = ctext.split("//==//");
  plaintext = [];

  for (var i = 0; i < ctext.length; i++) {
    plaintext.push(Decrypt(ctext[i], p, q, e));
  }
  return plaintext.join("//==//");
}

function ChosenCipherTextAttack(){
  let p = 1000000007n;
  let q = 1000000009n;
  let n = p * q;
  let e = 23917n;
  // Encrypt the message
  // generate random number from 0 to n / 2 to be multiplied by cipher text and not exceed the n
  let rndNumber = BigInt(randomNumber(0, 10));
  let pText = "the way in which something especially an organization or equipment is organized planned or arranged.";
  let cText = encryptMessage(pText, n, e);
  let splittedEncryptedMessage = cText.split('//==//');
  
  for(let i = 0; i < splittedEncryptedMessage.length; i++){
    let messageToInt = ConvertToInt(splittedEncryptedMessage[i]);
    splittedEncryptedMessage[i] = ConvertToStr(messageToInt * (rndNumber ** e));
  }

  // Message Decryption
  let decryptedMessage = decryptMessageCCA(splittedEncryptedMessage.join('//==//'), p, q, e);
  console.log('Decrypted Message: ' + decryptedMessage + '\n');
  let splittedDecryptedMessage = decryptedMessage.split('//==//');
  for(let i = 0; i < splittedDecryptedMessage.length; i++){
    let messageToInt = ConvertToInt(splittedDecryptedMessage[i]);
    splittedDecryptedMessage[i] = ConvertToStr(messageToInt / rndNumber);
  }
  console.log('Attacked Message: ' + splittedDecryptedMessage.join('') + '\n');
}


function DecryptionAttack(cipherText, privateKey, n){
  cipherText = ConvertToInt(cipherText);
  plainText = power(cipherText, privateKey, n);
  plainText = ConvertToStr(plainText);
  return plainText;
}

function TestAttackTime(){
  const date = new Date();
  let numBits = [];
  let ellapsedTime = [];
  for(let i = 8; i < 17; i += 2 * i){
    numBits.push(2 * i);
    let {p, q, e} = generateKey(0, i);
    let n = p * q;
    let phi_n = (p - 1n) * (q - 1n);
    let cText = Encrypt('o', n, e);
    let beforeTime = date.getTime();
    for(let j = 0n; j < phi_n; j++){
      let pText = DecryptionAttack(cText, j, n);
      if(pText == 'o'){
        console.log('Done');
        break;
      }
    }
    let afterTime = date.getTime();
    ellapsedTime.push((afterTime - beforeTime) / 2);
  }
  return {numBits, ellapsedTime};
}

var {numBits, ellapsedTime} = TestAttackTime();
console.log(ellapsedTime);

