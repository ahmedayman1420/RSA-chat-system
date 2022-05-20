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

(async function () {
  // p = 233n;
  // q = 233n;
  // e = 9n;
  // console.log(GCD(e, (p - 1n) * (q - 1n)));
  // for (var i = 0; i <= 100; i++) {
  // var { p, q, e } = await generateKey(0, 128);
  // p = BigInt(p);
  // q = BigInt(q);
  // e = BigInt(e);
  // var flag = true;
  // let message = "a";
  // let cmessage = "a";
  // cText = await encryptMessage(message, p * q, e);
  // plaintext = await decryptMessage(cText, p, q, e);
  // console.log("p: " + p);
  // console.log("q: " + q);
  // console.log("e: " + e);
  // console.log("cText: ", cText);
  // console.log("=============================================");
  // console.log(GCD(e, (q - 1n) * (p - 1n)));
  // console.log((q - 1n) * (p - 1n) > e);
  // console.log("Message: ", cmessage);
  // console.log("=============================================");
  // console.log("Plaintext: ", plaintext);
  // console.log("=============================================");
  // console.log(cmessage == plaintext);
  // if (cmessage != plaintext) {
  //   console.log("p: " + p);
  //   console.log("q: " + q);
  //   console.log("e: " + e);
  //   flag = false;
  // }
  // console.log("=============================================");
  // }
})();

// //////////////////////////////////////////////////////////////////////////////////////////// //
// ====== --- ====== > ============================================= < ====== --- ====== //
// ====== --- ====== > Test With Array of objects < ====== --- ====== //
// ====== --- ====== > ============================================= < ====== --- ====== //
// //////////////////////////////////////////////////////////////////////////////////////////// //
