"pytest.py" goes in /usr/lib/cgi-bin/

The other files go in /var/www/html/

Install steps:

1. Install apache2 first, after the installation you should be able to see the default page with 'localhost' in your browser.

sudo apt-get install apache2

2. Enable mods in apache2 for cgi (the codes below showed two ways to do it)

sudo a2enmod cgid
cd /etc/apache2/mods-enabled
sudo ln -s /etc/apache2/mods-available/cgi.load

3. Modify the config file: /etc/apache2/conf-enabled/serve-cgi-bin.conf to enable python code.

<Directory "usr/lib/cgi-bin">
             ... ...

             AddHandler cgi-script .py          # add this line (there is a blank between cgi-script and .py)
</Directory>

4. Notice that the default directory for cgi script is /usr/lib/cgi-bin/, so we will create a test file under this directory.

sudo nano /usr/lib/cgi-bin/pytest.py

#!/usr/bin/python

import cgi
import cgitb
cgitb.enable()
#whatever else you want after

5. Make the python file executable

sudo chmod +x /usr/lib/cgi-bin/pytest.py

6. Restart the apache2 service

sudo service apache2 restart

7. Direct ajax scripts in html/js/etc to "/cgi-bin/name.filetype", in this case pytest.py
