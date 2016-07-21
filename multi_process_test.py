#!/usr/bin/env python
# coding: utf-8

import threading, socket, sys, time, mysql.connector
from mysql.connector import errorcode as errorDB
from multiprocessing import Process, Queue

HOST = '190.23.0.10'
PORT = 50000

dbConfig = {'user' : 'root',
            'password' : 'polinno',
            'host' : 'localhost',
            'database' : 'dispobox'}

#Utiliser pour arreter le programme lorsqu'on appuie sur echap
keyPressed = ''

def active_con(myConnexion, myAdress, q, numero):
    print "Client connecté, adresse IP %s, port %s" % (myAdress[0], myAdress[1])
    myConnexion.send("Salut à toi "+ myAdress[0] +", et bienvenu dans mon réseau !")
    connected = True
    while connected:
        try:
            msgClient, nameClient = myConnexion.recvfrom(1024)
            if msgClient:
                print "Message Recu : ", msgClient, "de la part de ", nameClient
            else:
                #Si la connexion s'est arretée, on détruit le process en cours
                connected = False
        except:
            print "dans l'exception"
            connected = False
            pass
        time.sleep(1)
    print "Connexion perdue avec %s" %(myAdress[0])


def wait_connexion(sock):
    num =1
    while True:
        print "Attente d'une nouvelle connexion"
        sock.listen(5)
        try:
            connexion, adresse = sock.accept() # Attend la prochaine connexion
            p = Process(target = active_con, args=(connexion, adresse, state_q, num,))
            p.start()
            print p
        except:
            print "error dans le accept" 
            break
        num = num + 1
    print "fin du thread pour la connexion"






# Connexion au serveur MySQL
try:
    sql_con = mysql.connector.connect(**dbConfig)
    cursor = sql_con.cursor()
except mysql.connector.Error as err :
    if err.errno == errorDB.ER_ACCESS_DENIED_ERROR:
        print "L'utilisateur ou le mot de passe mysql n'est pas le bon."
    elif err.errno == errorDB.ER_BAD_DB_ERROR:
        print "La base de données demandée n'existe pas sur ce serveur"
    else:
        print err

cursor.execute("""
CREATE TABLE IF NOT EXISTS current_state (
    id int(5) NOT NULL AUTO_INCREMENT,
    name varchar(50) DEFAULT NULL,
    state int(5) DEFAULT "-1",
    PRIMARY KEY(id)
);
""")

# Creation du socket
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    sock.bind((HOST,PORT))
except socket.error, msg:
    print "La liaison du socket a échoué : ", msg
    sys.exit()
    
# Creation de la queue
state_q = Queue()

print "Serveur prêt"
num = 1
compteur = 1
connex_thread = threading.Thread(target = wait_connexion, args=(sock, ))
connex_thread.daemon = True
connex_thread.start()

keyPressed = raw_input()
print "----------------------------- \n -- Key pressed ! -- \n ////  EXITING ////"
sock.shutdown(2)
sock.close()
print "socket closed"
sql_con.close()
print "connexion sql closed"
