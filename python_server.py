#!/usr/bin/env python
# coding: utf-8

import logger, logging, errno
import threading, socket, sys, time, mysql.connector
from mysql.connector import errorcode as errorDB
from multiprocessing import Process, Queue
import multiprocessing

HOST = '190.23.0.10'
PORT = 50000

# Configuration de la base de données MySQL
dbConfig = {'user' : 'root',
            'password' : 'polinno',
            'host' : 'localhost',
            'database' : 'dispobox'}

# Etat actuel des box (utilité à démontrer)
current_state = {'00' : '-1',
        '41' : '-1',
        '42' : '-1',
        '43' : '-1'}


"""
    A chaque nouvelle conexxion, cette fonction est appelée par un nouveau process.
    Tant que la connexion est en place, la fonction reçoit les données du client, puis met à jour 
    l'état des box grâce à create_new_state, puis les stock dans la queue.
"""
def active_connexion(myConnexion, myAdress, q):
    LOG.info("Client connecté, adresse IP %s, port %s" % (myAdress[0], myAdress[1]))
    connected = True
    while connected:
        try:
            msgClient = myConnexion.recv(1024)
        except Exception as e:
            LOG.error("Exception renvoyée lors de la reception des données : "+str(e))
        if msgClient:
            LOG.info("Message Recu : "+ msgClient)
            new_state = create_new_state(msgClient)
            q.put(new_state)
            LOG.debug("Nouvel état dans la queue : box "+ new_state[0]+ " état "+new_state[1])
        else:
            #Si la connexion s'est arretée, on détruit le process en cours
            connected = False
        #except:
        #    raise
        #    LOG.error("CRASH DANS LE PROCESS :"+ multiprocessing.current_process())
        #    connected = False
        #    pass
        time.sleep(1)
    LOG.info("Connexion perdue avec %s" %(myAdress[0]))


"""
    Cette fonction est appelée par chaque process de connexion dès qu'un message est reçu. 
    Pour chaque message, elle sépare le numero du box et son état et renvoie le couple [nom, état]
"""
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


"""
    Boucle attendant une nouvelle connexion et créant un nouveau process lançant la fonction active_connexion
    dès qu'un nouveau matériel se connecte au réseau TCP.
    Cette boucle s'arrète dès que le thread principal active l'event "stop_event"
"""
def wait_connexion(stop_event, sock, state_q):
    while not stop_event.is_set():
        LOG.info("Attente d'une nouvelle connexion")
        sock.listen(5)
        try:
            connexion, adresse = sock.accept() # Attend la prochaine connexion
            p = Process(target = active_connexion, args=(connexion, adresse, state_q,))
            p.start()
        except Exception as e:
            if e.errno != 22: #22 est l'exception renvoyée lorsque la connexion est coupée par l'utilisateur
                LOG.error("Exception renvoyée lors de la reception des données : "+str(e))
            break           
    LOG.debug("Fin du thread pour la connexion")
    #On ferme les process
    p.terminate()


"""
    Boucle qui tourne en permanence dans un thread distinct. 
    Dès qu'un nouvel element est ajouté à la queue, le récupère et met à jour l'état des box
    dans le dictionnaire et dans la base de données SQL.
    Un event permet de terminer ce thread lorsqu'on arrête le programme.
"""
def MAJ_current_state(sql_connexion, stop_event, q, cursor):
    while not stop_event.is_set():
        new_state = q.get()
        current_state[new_state[0]] = new_state[1]
        try:
            cursor.execute("UPDATE current_state SET state = "+ new_state[1] +" WHERE name ="+ new_state[0])
        except mysql.connector.Error as err:
            LOG.error("Erreur lors de la MAJ de la BDD : ",str(err))
        sql_connexion.commit()
        time.sleep(0.5)
    LOG.debug("Sortie du thread de MAJ de la queue")






LOG=logger.create_logger()
LOG.info("##################################################")
LOG.info("#######         Lancement du serveur        ######") 
LOG.info("##################################################")


# Connexion au serveur MySQL
try:
    sql_con = mysql.connector.connect(**dbConfig)
    cursor = sql_con.cursor()
except mysql.connector.Error as err :
    if err.errno == errorDB.ER_ACCESS_DENIED_ERROR:
        LOG.error("L'utilisateur ou le mot de passe mysql n'est pas le bon.")
    elif err.errno == errorDB.ER_BAD_DB_ERROR:
        LOG.error("La base de données demandée n'existe pas sur ce serveur")
    else:
        LOG.error(str(err))
sql_con.commit()


# Creation du socket
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    sock.bind((HOST,PORT))
except socket.error, msg:
    LOG.error("La liaison du socket a échoué : "+ msg)
    sys.exit()
    

# Creation de la queue
state_q = Queue()


LOG.info("Serveur prêt")
print "Appuyez sur n'importe quelle touche pour arreter le programme"
current_state["00"] = 1
cursor.execute("UPDATE current_state SET state = 1 WHERE name = 00")
sql_con.commit()
stop_event = threading.Event()
connex_thread = threading.Thread(target = wait_connexion, args=(stop_event, sock, state_q, ))
connex_thread.daemon = True
connex_thread.start()
maj_state_thread = threading.Thread(target = MAJ_current_state, args=(sql_con, stop_event, state_q, cursor, ))
maj_state_thread.daemon = True
maj_state_thread.start()

# Fin du programme lorsqu'on tape une touche dans le terminal.
keyPressed = raw_input()
LOG.info("Fin du programme demandée par l'utilisateur")
print("#######           EXITING PROGRAM           ######")
print("##################################################")


#cursor.execute("UPDATE current_state SET state = -1 WHERE name = 0")
cursor.execute("UPDATE current_state SET state = -1")
sql_con.commit()
stop_event.set()
sock.shutdown(2)
sock.close()
LOG.info("Socket closed")
sql_con.close()
LOG.info("Connexion sql closed")
sys.exit()
