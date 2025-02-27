init:
	docker compose -f ./infra/docker-compose.yml build
	docker-compose -f ./infra/docker-compose.yml run --rm app npm install --frozen-lockfile