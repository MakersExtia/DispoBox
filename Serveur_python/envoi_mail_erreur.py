#!/usr/bin/env python
#-*- coding: utf-8 -*-

import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText

msg = MIMEMultipart()
msg['From'] = 'makersextia@gmail.com'
msg['To'] = 'gpagis@extia.fr'
msg['Subject'] = 'Erreur dispobox' 
message = 'Il y a eu une erreur sur le dispobox !'
msg.attach(MIMEText(message))
mailserver = smtplib.SMTP('smtp.gmail.com', 587)
mailserver.ehlo()
mailserver.starttls()
mailserver.ehlo()
mailserver.login('makersextia@gmail.com', 'makers2016')
mailserver.sendmail('makersextia@gmail.com', 'makersextia@gmail.com', msg.as_string())
mailserver.quit()
