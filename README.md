# Projeto Módulo de Gestão de Requisições

Módulo de gestão de requisições internas de recursos como viaturas, espaços, equipamentos, entre outros.

## Tecnologias
* **Base de Dados:** MySQL 8.0.46
* **Backend:** Laravel 11 / PHP 8.3
* **Ambiente:** Docker e Docker Compose

## Iniciar o Projeto

### 1. Necessário:
**Docker** e o **Git**

### 2. Clonar o repositório:
```bash
git clone https://github.com/DiogoBacalhau/ProjetoRequisicoes
cd ProjetoRequisicoes
```

### 3. Variáveis de ambiente
```bash
cp backend/.env.example backend/.env
```

### 4. Iniciar os containers
```bash
sudo docker compose up -d --build
```

### 5. Executar as migrations e o seeder
```bash
sudo docker compose exec backend-app php artisan migrate:fresh --seed
```

### 6. Gerar a chave da aplicação
```bash
sudo docker compose exec backend-app php artisan key:generate
```

### 7. Abrir a aplicação
```bash
http://localhost:4200
```
