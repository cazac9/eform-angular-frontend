#!/bin/bash

################## START OF CONFIG PARAMETERS ##################
declare -A conf_parameters=(
["SWIFT_FOLDER_PREFIX"]='""'
["DOMAIN_NAME"]='"microting.com"'
["MYSQL_PASSWORD"]='"your_password"'
["SWIFT_USER_NAME"]='"CloudCustomer"'
["SWIFT_TENANT_NAME"]='"admin"'
["SWIFT_PASSWORD"]='"your_password"'
["OS_USERNAME"]='"CloudCustomer"'
["OS_TENANT_NAME"]='"admin"'
["OS_PASSWORD"]='"your_password"'
["OS_AUTH_URL"]='"http://172.16.4.4:5000/v2.0/"'
["MAX_NUMBER_OF_BACKUPS"]=288
["SHOULD_RESTORE_DATABASE"]=true
["SHOULD_SETUP_DB_BACKUP"]=true
["SHOULD_INSTALL_POSTFIX"]=true
["IS_PRODUCTION"]=true
["RELAY_HOST"]='"172.16.0.66"'
["CURRENTUSER"]='"ubuntu"'
["DOTNET_SKIP_FIRST_TIME_EXPERIENCE"]=true
)
# WRITE CONFIG FILE
mkdir -p /var/www/microting
for conf_param in "${!conf_parameters[@]}"; do echo "export $conf_param=${conf_parameters["$conf_param"]}" >> /var/www/microting/openstack.conf; done
##################  END OF CONFIG PARAMETERS  ##################

# LOAD CONFIG
source /var/www/microting/openstack.conf

echo "################## BASIC SETUP ##################"

apt update

export DEBIAN_FRONTEND=noninteractive
export EC2_INSTANCE_ID=`curl --insecure http://169.254.169.254/openstack/2012-08-10/meta_data.json | cut -d '"' -f 4`
echo $EC2_INSTANCE_ID
export INSTANCE_HOSTNAME=`hostname`
if [ $SHOULD_INSTALL_POSTFIX = true ]
    then
    debconf-set-selections <<< "postfix postfix/mailname string $INSTANCE_HOSTNAME.$DOMAIN_NAME"
    debconf-set-selections <<< "postfix postfix/main_mailer_type string 'Internet Site'"
    apt-get install -y postfix
    sed -i "s/smtpd_use_tls=yes/smtpd_use_tls=no/g" /etc/postfix/main.cf
    sed -i "s/relayhost =/relayhost = $RELAY_HOST/g" /etc/postfix/main.cf
    sed -i "s/.$DOMAIN_NAME/$INSTANCE_HOSTNAME.$DOMAIN_NAME/g" /etc/postfix/main.cf
    sed -i "s/openstacklocal/$DOMAIN_NAME/g" /etc/postfix/main.cf
    echo "message_size_limit = 0" >> /etc/postfix/main.cf
    service postfix restart
fi
#sed -i -r 's/RREPLACE_M_CLOUD_DATA/#RREPLACE_M_CLOUD_DATA/' /opt/monit/conf/monitrc


export INSTANCE_IP=`ip address show eth0 | grep "inet " | cut -d " " -f6 | cut -d "/" -f1`
echo $INSTANCE_IP
echo $INSTANCE_HOSTNAME
echo "$INSTANCE_IP $INSTANCE_HOSTNAME" >> /etc/hosts
#sed -i "s/SERVER_NAME_REPLACE_ME/$INSTANCE_IP/g" /opt/nginx/conf/nginx.conf # > /opt/nginx/conf/nginx.conf

apt-get -y install software-properties-common
apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8
add-apt-repository 'deb [arch=amd64,arm64,ppc64el] http://mirror.one.com/mariadb/repo/10.3/ubuntu bionic main'

apt update

debconf-set-selections <<< "mariadb-server-10.3 mysql-server/root_password password "$MYSQL_PASSWORD
debconf-set-selections <<< "mariadb-server-10.3 mysql-server/root_password_again password "$MYSQL_PASSWORD

apt-get -y install mariadb-server nginx curl python-pip python-swiftclient

mysql -uroot --password=$MYSQL_PASSWORD <<MYSQL_SCRIPT
CREATE USER '$INSTANCE_HOSTNAME'@'localhost' IDENTIFIED BY '$MYSQL_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO '$INSTANCE_HOSTNAME'@'localhost';
MYSQL_SCRIPT

curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
apt install -y nodejs

wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg
mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/
wget -q https://packages.microsoft.com/config/ubuntu/18.04/prod.list
mv prod.list /etc/apt/sources.list.d/microsoft-prod.list
chown root:root /etc/apt/trusted.gpg.d/microsoft.asc.gpg
chown root:root /etc/apt/sources.list.d/microsoft-prod.list

apt install -y apt-transport-https &&\
apt update &&\
apt install -y dotnet-runtime-2.2 dotnet-sdk-2.2

chown -R ubuntu:ubuntu /var/www

cd /var/www/microting

echo "################## START CLONING ##################"
whoami
su ubuntu -c \
"git clone https://github.com/microting/eform-angular-frontend.git -b master"
echo "################## END CLONING ##################"

cd eform-angular-frontend/eform-client
npm i -g @angular/cli
su ubuntu -c \
"npm i && npm run build"

cd ../eFormAPI/eFormAPI.Web/
echo "################## START GITVERSION ##################"
export GITVERSION=`git describe --abbrev=0 --tags | cut -d "v" -f 2`
echo $GITVERSION
echo "################## END GITVERSION ##################"
su ubuntu -c \
"dotnet publish -o out /p:Version=$GITVERSION --runtime linux-x64"

cat > /etc/systemd/system/eform.service << EndOfUnitFile
[Unit]
Description=eForm application
[Service]
WorkingDirectory=/var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out
ExecStart=/usr/bin/dotnet /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/eFormAPI.Web.dll
Restart=always
RestartSec=10
SyslogIdentifier=dotnet-eform
User=ubuntu
Environment=ASPNETCORE_ENVIRONMENT=Production
[Install]
WantedBy=multi-user.target
EndOfUnitFile

cat > /etc/nginx/sites-available/default << EndOfConfig
server {
    server_name _;
    listen 80;
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host \$host;
        proxy_cache_bypass \$http_upgrad;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
    }
}
EndOfConfig

ln -s /var/www/microting/eform-angular-frontend/eform-client/dist /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/wwwroot

chown -R ubuntu:ubuntu /var/www

if [ $SHOULD_SETUP_DB_BACKUP = true ]
    then
    echo '############# SETTING UP HOURLY BACKUP #############'
    echo '#!/bin/bash' >> /root/backup-mysql-hourly.sh
		# echo 'export OS_USERNAME=SWIFT_USER_NAME' >> /root/backup-mysql-hourly.sh
    # sed -i "s/SWIFT_USER_NAME/$SW# IFT_USER_NAME/g" /root/backup-mysql-hourly.sh
# 		echo 'export OS_TENANT_NAME=SWIFT_TENANT_NAME' >> /root/backup-mysql-hourly.sh
#     sed -i "s/SWIFT_TENANT_NAME/$SWIFT_TENANT_NAME/g" /root/backup-mysql-hourly.sh
# 		echo 'export OS_PASSWORD=SWIFT_PASSWORD' >> /root/backup-mysql-hourly.sh
#     sed -i "s/SWIFT_PASSWORD/$SWIFT_PASSWORD/g" /root/backup-mysql-hourly.sh
# 		echo 'export OS_AUTH_URL=http://172.16.4.4:5000/v2.0/' >> /root/backup-mysql-hourly.sh
		echo "source /var/www/microting/openstack.conf" >> /root/backup-mysql-hourly.sh
		echo 'export OS_NO_CACHE=1' >> /root/backup-mysql-hourly.sh
    echo 'export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin' >> /root/backup-mysql-hourly.sh
    echo 'HOST=localhost' >> /root/backup-mysql-hourly.sh
    echo 'USER=root' >> /root/backup-mysql-hourly.sh
    echo 'PASS=MYSQL_PASSWORD' >> /root/backup-mysql-hourly.sh
    sed -i "s/MYSQL_PASSWORD/$MYSQL_PASSWORD/g" /root/backup-mysql-hourly.sh
		
    echo '' >> /root/backup-mysql-hourly.sh
    echo 'FILENAME=`date "+backup-%Y-%m-%d-%H-%M.sql"`' >> /root/backup-mysql-hourly.sh
    echo '' >> /root/backup-mysql-hourly.sh
    echo '/usr/bin/mysqldump --host=$HOST --user=$USER --password=$PASS SWIFT_FOLDER_PREFIXSDK | gzip > $FILENAME.gz' >> /root/backup-mysql-hourly.sh
    echo 'swift upload SWIFT_FOLDER_PREFIXSDK $FILENAME.gz' >> /root/backup-mysql-hourly.sh
    echo 'rm $FILENAME.gz' >> /root/backup-mysql-hourly.sh

    echo '/usr/bin/mysqldump --host=$HOST --user=$USER --password=$PASS SWIFT_FOLDER_PREFIXAngular | gzip > $FILENAME.gz' >> /root/backup-mysql-hourly.sh
    echo 'swift upload SWIFT_FOLDER_PREFIXAngular $FILENAME.gz' >> /root/backup-mysql-hourly.sh
    echo 'rm $FILENAME.gz' >> /root/backup-mysql-hourly.sh

		echo "cd /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/" >> /root/backup-mysql-hourly.sh
		echo "swift upload SWIFT_FOLDER_PREFIXConnection connection.json" >> /root/backup-mysql-hourly.sh
		
    sed -i "s/SWIFT_FOLDER_PREFIX/$SWIFT_FOLDER_PREFIX/g" /root/backup-mysql-hourly.sh
    echo '############# DONE SETTING UP HOURLY BACKUP #############'
		chmod +x /root/backup-mysql-hourly.sh
		

fi

if [ $SHOULD_RESTORE_DATABASE = true ]
	then
	cd 
	# export OS_USERNAME=$SWIFT_USER_NAME
	# export OS_TENANT_NAME=$SWIFT_TENANT_NAME
	# export OS_PASSWORD=$SWIFT_PASSWORD
	# export OS_AUTH_URL=http://172.16.4.4:5000/v2.0/
	export OS_NO_CACHE=1
	export DATABASE_NAME=$SWIFT_FOLDER_PREFIX
	export DATABASE_NAME+=SDK

	export LAST_BACKUP=`swift list $DATABASE_NAME | tail -1`
	swift download $DATABASE_NAME $LAST_BACKUP
	gunzip $LAST_BACKUP
	export LAST_BACKUP=`expr substr $LAST_BACKUP 1 27`
	echo "Creating DB"
	`time mysql -u $INSTANCE_HOSTNAME --password=$MYSQL_PASSWORD -e "create database $DATABASE_NAME"`
	echo "Restoring db from backup"
	`time mysql -u $INSTANCE_HOSTNAME --password=$MYSQL_PASSWORD $DATABASE_NAME < $LAST_BACKUP`
	echo "Restore complete"
	rm $LAST_BACKUP

	echo "Checking backup status"
	export NUM_BACKUPS=`swift list $DATABASE_NAME | wc -l`
	echo "Current number of backups : $NUM_BACKUPS max is $MAX_NUMBER_OF_BACKUPS"
	while (( $NUM_BACKUPS > $MAX_NUMBER_OF_BACKUPS ))
	do
		CURRENT_BACKUP_TO_DELETE=`swift list $DATABASE_NAME | head -1`
		echo "SHOULD DELETE $CURRENT_BACKUP_TO_DELETE."
		swift delete $SWIFT_FOLDER_PREFIX $CURRENT_BACKUP_TO_DELETE
		NUM_BACKUPS=`swift list $DATABASE_NAME | wc -l`
		echo "New number of backups : $NUM_BACKUPS max is $MAX_NUMBER_OF_BACKUPS"
	done
	echo "Done checking and cleaning backups"
	
	export DATABASE_NAME=$SWIFT_FOLDER_PREFIX
	export DATABASE_NAME+=Angular

	export LAST_BACKUP=`swift list $DATABASE_NAME | tail -1`
	swift download $DATABASE_NAME $LAST_BACKUP
	gunzip $LAST_BACKUP
	export LAST_BACKUP=`expr substr $LAST_BACKUP 1 27`
	echo "Creating DB"
	`time mysql -u $INSTANCE_HOSTNAME --password=$MYSQL_PASSWORD -e "create database $DATABASE_NAME"`
	echo "Restoring db from backup"
	`time mysql -u $INSTANCE_HOSTNAME --password=$MYSQL_PASSWORD $DATABASE_NAME < $LAST_BACKUP`
	echo "Restore complete"

	echo "Checking backup status"
	export NUM_BACKUPS=`swift list $DATABASE_NAME | wc -l`
	echo "Current number of backups : $NUM_BACKUPS max is $MAX_NUMBER_OF_BACKUPS"
	while (( $NUM_BACKUPS > $MAX_NUMBER_OF_BACKUPS ))
	do
		CURRENT_BACKUP_TO_DELETE=`swift list $DATABASE_NAME | head -1`
		echo "SHOULD DELETE $CURRENT_BACKUP_TO_DELETE."
		swift delete $SWIFT_FOLDER_PREFIX $CURRENT_BACKUP_TO_DELETE
		NUM_BACKUPS=`swift list $DATABASE_NAME | wc -l`
		echo "New number of backups : $NUM_BACKUPS max is $MAX_NUMBER_OF_BACKUPS"
	done
	export CONNECTIONSTRINGJSON=$SWIFT_FOLDER_PREFIX
	export CONNECTIONSTRINGJSON+=Connection
  swift download $CONNECTIONSTRINGJSON connection.json
	mv connection.json /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/
	chown ubuntu:ubuntu /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/connection.json
	echo "Done checking and cleaning backups"
fi

systemctl daemon-reload
systemctl enable eform.service
systemctl start eform.service
nginx -s reload