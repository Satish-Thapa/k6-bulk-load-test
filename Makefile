PROMETHEUS_URL = http://localhost:9090/api/v1/write

USERNAME = 
PASSWORD = 

bulk-test:
	@echo "Running k6 Bulk Testpaper Test..."
	K6_PROMETHEUS_RW_SERVER_URL=$(PROMETHEUS_URL) k6 run -o experimental-prometheus-rw --env USERNAME=$(USERNAME) --env PASSWORD=$(PASSWORD) TESTPAPER/bulk-test-script.js
