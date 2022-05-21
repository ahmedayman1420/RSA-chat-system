from lib2to3.pytree import convert
import math
import unittest as ut
from sympy import randprime
from timeit import default_timer as timer
import matplotlib.pyplot as plt

def ConvertToInt(message):
    res = 0
    for i in range(len(message)):
        res = res * 256 + ord(message[i])
    return res

def ConvertToStr(n):
    res = ""
    while n > 0:
        res += chr(n % 256)
        n //= 256
    return res[::-1]

def GCD(a, b):
    if a < b:
        a, b = b, a
    if b == 0:
        return a
    return GCD(b, a % b)

def ExtendedEuclid(a, b):
    if b == 0:
        return (1, 0)
    (x, y) = ExtendedEuclid(b, a % b)
    k = a // b
    return (y, x - k * y)

def InvertModulo(a, n):
    (b, x) = ExtendedEuclid(a, n)
    if b < 0:
        b = (b + n) % n # we don’t want −ve integers
    return b

def PowMod(a, n, mod):
    if n == 0:
        return 1
    elif n == 1:
        return a % mod
    else:
        b = PowMod(a, n // 2, mod)
        b = b * b % mod
    if n % 2 == 0:
        return b
    else:
        return b * a % mod

def merge(message):
    merged_number = ''
    for num in message:
        merged_number += str(num)
    return int(merged_number)

def split(message):
    splited_array = []
    while message:
        splited_number = message % 10000
        splited_array.insert(0, splited_number)
        message //= 10000
    return splited_array

def Encrypt(m, n, e):
    m = ConvertToInt(m)
    c =PowMod(m, e, n)
    c = ConvertToStr(c)
    return c

def Decrypt(c, p, q, e):
    c = ConvertToInt(c)
    n = p * q
    pi_n = (p - 1) * (q - 1)
    d = InvertModulo(e, pi_n)
    m = PowMod(c, d, n)
    m = ConvertToStr(m)
    return m

def TestEncryptionTime():
    numBits = []
    ellapsedTime = []
    for i in range(9, 128):
        numBits.append(i)
        p = randprime(256, math.pow(2, i))
        q = randprime(256, math.pow(2, i))
        n = p * q
        e = randprime(0, n)
        beforeTime = timer()
        Encrypt("o", n, e)
        afterTime = timer()
        ellapsedTime.append(afterTime - beforeTime)
    return numBits, ellapsedTime

def DecryptionAttack(cipherText, privateKey, n):
    cipherText = ConvertToInt(cipherText)
    plainText = PowMod(cipherText, privateKey, n)
    plainText = ConvertToStr(plainText)
    return plainText

def TestAttackTime():
    numBits = []
    ellapsedTime = []
    for i in range(9, 15):
        numBits.append(i)
        p = randprime(30, math.pow(2, i))
        q = randprime(30, math.pow(2, i))
        n = p * q
        e = randprime(0, n)
        cText = Encrypt("o", n, e)
        beforeTime = timer()
        for j in range(0, int(math.pow(2, 2 * i))):
            pText = DecryptionAttack(cText, j, n)
            if pText == 'o':
                print("done")
                break
        afterTime = timer()
        ellapsedTime.append(afterTime - beforeTime)
    return numBits, ellapsedTime

            

def main():
    ### the encryption testing part
    # numBits, ellapsedTime = TestEncryptionTime()
    # plt.plot(numBits, ellapsedTime, 'b')
    # plt.xlabel('Number of Bits')
    # plt.ylabel('Ellapsed Time')
    # plt.title('Encryption time vs number of bits')
    # plt.show()

    ### the attack testing part
    numBits, ellapsedTime = TestAttackTime()
    plt.plot(numBits, ellapsedTime, 'b')
    plt.xlabel('Number of Bits')
    plt.ylabel('Ellapsed Time')
    plt.title('RSA Attack')
    plt.show()


# class testing(ut.TestCase):

#     def test_merge_function(self):
#         arr = [34, 2, 11]
#         self.assertEqual(merge(arr), 34211)

#     def test_main_function(self):
#         self.assertEqual(main("NO WAY TODAY"), "NO WAY TODAY")
#     def test_convert_func(self):
#         self.assertEqual(ConvertToInt('p'), 112)

if __name__ == "__main__":
    main()