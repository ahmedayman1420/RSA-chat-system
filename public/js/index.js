const testMode = document.getElementById("testmode");
const primeP = document.getElementById("primeP");
const primeQ = document.getElementById("primeQ");
const publicE = document.getElementById("publicE");
const testInputs = document.getElementById("test-inputs");
let flag = true;

testMode.addEventListener("click", async () => {
  if (flag) {
    testMode.style.cssText = "background-color: #d0991a;";
    testInputs.style.cssText = "display: block";

    flag = !flag;
  } else {
    testMode.style.cssText = "background-color: #075E54;";
    testInputs.style.cssText = "display: none";

    flag = !flag;
  }
});
