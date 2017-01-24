#!/usr/bin/env python
#-*- coding: utf-8 -*-

import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.MIMEBase import MIMEBase
from email import Encoders

msg = MIMEMultipart()
msg['From'] = 'makersextia@gmail.com'
msg['To'] = 'gpagis@extia.fr'
msg['Subject'] = 'Erreur dispobox' 

part = MIMEBase('application', "octet-stream")
part.set_payload(open("log_file.log", "rb").read())
Encoders.encode_base64(part)
part.add_header('Content-Disposition', 'attachment; filename="log_file.txt"')

msg.attach(part)
mailserver = smtplib.SMTP('smtp.gmail.com', 587)
mailserver.ehlo()
mailserver.starttls()
mailserver.ehlo()
mailserver.login('makersextia@gmail.com', 'makers2016')
mailserver.sendmail('makersextia@gmail.com', 'makersextia@gmail.com', msg.as_string())
mailserver.quit()
