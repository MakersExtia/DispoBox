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

current_state = {'00' : '-1',
        '01' : '-1',
        '41' : '-1',
        '42' : '-1',
        '43' : '-1',
        '44' : '-1',
        '45' : '-1',
        '46' : '-1',
        '47' : '-1'}

def active_connexion(myConnexion, myAdress, q, numero):
    print "Client connecté, adresse IP %s, port %s" % (myAdress[0], myAdress[1])
    myConnexion.send("Salut à toi "+ myAdress[0] +", et bienvenu dans mon réseau !")
    connected = True
    while connected:
        try:
            msgClient, nameClient = myConnexion.recvfrom(1024)
            if msgClient:
                print "Message Recu : ", msgClient, "de la part de ", nameClient
                new_state = create_new_state(msgClient)
                q.put(new_state)
                print new_state
            else:
                #Si la connexion s'est arretée, on détruit le process en cours
                connected = False
        except:
            print "dans l'exception"
            connected = False
            pass
        time.sleep(1)
    print "Connexion perdue avec %s" %(myAdress[0])


def create_new_state(msgClient):
    msg1 = True
    box_nb = ''
    box_state = ''
    for c in msgClient:
        if c == ';':
            msg1 = False
        else:
            if msg1:
                box_nb = box_nb + c
            else:
                box_state = box_state + c
    return [box_nb, box_state]


def wait_connexion(stop_event, sock, state_q):
    num =1
    while not stop_event.is_set():
        print "Attente d'une nouvelle connexion"
        sock.listen(5)
        try:
            connexion, adresse = sock.accept() # Attend la prochaine connexion
            p = Process(target = active_connexion, args=(connexion, adresse, state_q, num,))
            p.start()
            print p
        except:
            print "erreur pendant l'attente d'une nouvelle connexion" 
            break
        num = num + 1
    print "fin du thread pour la connexion"
    #On ferme les process
    p.terminate()


def MAJ_current_state(stop_event, q, sqlC):
    while not stop_event.is_set():
        new_state = q.get()
        current_state[new_state[0]] = new_state[1]
        print current_state
        time.sleep(0.5)
    print "Sortie du thread de MAJ de la queue"



print "/////////////////////////////////////////////"
print "/// S T A R T I N G   T C P   S E R V E R ///"
print "/////////////////////////////////////////////"

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
stop_event = threading.Event()
connex_thread = threading.Thread(target = wait_connexion, args=(stop_event, sock, state_q, ))
connex_thread.daemon = True
connex_thread.start()
maj_state_thread = threading.Thread(target = MAJ_current_state, args=(stop_event, state_q, sql_con, ))
maj_state_thread.daemon = True
maj_state_thread.start()

keyPressed = raw_input()
print "///////  E X I T I N G  ////////"
stop_event.set()
sock.shutdown(2)
sock.close()
print ".Socket closed"
sql_con.close()
print ".Connexion sql closed"
sys.exit()
