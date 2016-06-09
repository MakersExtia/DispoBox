#!/usr/bin/env python
# coding: utf-8

#--------------ENVOI LA DISPO DU BOX 1----------------#
#-----------Le message est sous la forme--------------#
#- XX;Y;HH;MM;JJ;MM;AA
# XX : numero de box, Y : disponibilité, HH: heure, MM: minute, etc.

import socket, sys
import RPi.GPIO as GPIO
import time
from datetime import datetime

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

IR1_pin = 17
IR2_pin = 18
LEDpin = 27

HOST = '192.168.150.3'
HOST = 'localhost'
PORT = 50000

box1 = [0,0,0,0,0,0,0,0,0,0]
box2 = [0,0,0,0,0,0,0,0,0,0]

#-------------------------GPIO-------------------------#
GPIO.setup(IR1_pin,GPIO.IN)
GPIO.setup(IR2_pin,GPIO.IN)
GPIO.setup(LEDpin,GPIO.OUT)

LastState_1 = False
LastState_2 = False

#------------------------Socket------------------------#
# Création du socke
mySocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Envoi d'une requête de connexion au serveur :
try:
    mySocket.connect((HOST, PORT))
except socket.error:
    print "La connexion a échoué."
    sys.exit()
print "Connexion établie avec le serveur."

#---------------Dialogue avec le serveur---------------#
msgClient = "rien pour l'instant"

while 1:
    i = 0
    print "Verification"
    while i<10:
        box1[i] = GPIO.input(IR1_pin)
        box2[i] = GPIO.input(IR2_pin)
        i = i+1
	time.sleep(0.1)
    thetime = str(datetime.now().hour)+";"+str(datetime.now().minute)+";"+str(datetime.now().day)+";"+str(datetime.now().month)+";"+str(datetime.now().year)+";\n"   
    BOX = "01"
    if (1 in box1):
        msgClient = BOX+";"+"1;"+thetime
	GPIO.output(LEDpin,1)
    else:
        msgClient = BOX+";"+"0;"+thetime
	GPIO.output(LEDpin,0)
    mySocket.send(msgClient)
    BOX = "02"
    if (1 in box2):
        msgClient = BOX+";"+"1;"+thetime
    else:
        msgClient = BOX+";"+"0;"+thetime
    
    mySocket.send(msgClient)
    print str(GPIO.input(IR1_pin))+"     "+str(GPIO.input(IR2_pin))
    time.sleep(5)

# 4) Fermeture de la connexion :
print "Connexion interrompue."
mySocket.close()
