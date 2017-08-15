for n in $(seq 1 5)
do
	sudo service mongod start
	sleep 1
	nohup nodemon app.js
	sleep 4
	curl -X GET http://localhost:8080/api/warmup-rivers
	sleep 0.2
	curl -X GET http://localhost:8080/api/warmup-countries
	sleep 0.5
	curl -s GET http://localhost:8080/api/quickIntersect/rivers/Dnieper
	sleep 1
	pkill node
	sleep 0.1
	sudo service mongod stop
	sleep 1
	#sudo echo 3 > /proc/sys/vm/drop_caches
	sudo sync && sudo echo 3 | sudo tee /proc/sys/vm/drop_caches
	sleep 0.1
done

