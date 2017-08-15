for n in $(seq 1 3)
do
	sudo service postgresql start
	sleep 1
	nohup nodemon app.js
	sleep 5
#	curl -s GET http://localhost:3001/api/warmup-countries > out.txt
#	sleep 0.2
        curl -s GET http://localhost:3001/api/warmup-countries > out.txt
	sleep 0.2
	curl -s GET http://localhost:3001/api/countries/closest/87.12-66.5111 > out.txt
	sleep 1
	pkill node
	sleep 0.2
	sudo service postgresql stop
	sleep 0.2
	sudo echo 3 > /proc/sys/vm/drop_caches
	sleep 0.2
done

