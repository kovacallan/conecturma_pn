from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

msg=MIMEMultipart()
msg['From'] = "allan@conecturma.com.br"
msg['To'] = "allankfrasco@gmail.com"
msg['Subject'] = "Item Found !"
senha = "01#ak_bm*"
body = "Banana"

msg.attach(MIMEText(body, 'html'))
print(msg)

server = smtplib.SMTP('mail.conecturma.com.br', 587)
server.starttls()
server.login(msg['From'], senha)
server.sendmail(msg['From'], msg['To'], msg.as_string())
server.quit()
