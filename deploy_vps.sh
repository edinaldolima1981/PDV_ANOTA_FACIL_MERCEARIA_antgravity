#!/bin/bash
set -e

# ==========================================
# CONFIGURAÇÕES DO PROJETO - ALTERE AQUI
# ==========================================
IP_DA_VPS="82.25.75.245"
DOMINIO="pdvanotafacil.com.br"
DIRETORIO_SITE="/var/www/pdv"
REPO_URL="https://github.com/edinaldolima1981/PDV_ANOTA_FACIL_MERCEARIA_antgravity.git"

echo "--- Iniciando Implantação do PDV via Docker ---"

# 0. Verificar se é root
if [ "$EUID" -ne 0 ]; then 
  echo "Erro: Por favor, execute como root (use: sudo bash deploy_vps.sh)"
  exit 1
fi

# 1. Atualizar sistema
echo "-> Atualizando pacotes básicos..."
apt update -qq
apt install -y curl git apt-transport-https ca-certificates software-properties-common

# 2. Instalar Docker se não existir
echo "-> Verificando instalação do Docker..."
if ! command -v docker &> /dev/null; then
    echo "-> Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker >/dev/null 2>&1
    systemctl start docker >/dev/null 2>&1
fi

# 3. Liberar Porta 80 (Remoção agressiva de conflitos)
echo "-> Liberando a porta 80 (removendo Apache/Nginx se existirem)..."
# Tenta parar e remover pacotes que costumam travar a porta 80
apt remove -y apache2 apache2-utils nginx nginx-common >/dev/null 2>&1 || true
apt autoremove -y >/dev/null 2>&1 || true

# Mata qualquer processo que ainda esteja usando a porta 80
if command -v fuser &> /dev/null; then
    fuser -k 80/tcp >/dev/null 2>&1 || true
else
    apt install -y psmisc >/dev/null 2>&1
    fuser -k 80/tcp >/dev/null 2>&1 || true
fi

# Garante que serviços comuns estejam parados
systemctl stop nginx >/dev/null 2>&1 || true
systemctl stop apache2 >/dev/null 2>&1 || true

# 4. Preparar diretório do site
echo "-> Preparando diretório $DIRETORIO_SITE..."
mkdir -p "$DIRETORIO_SITE"
cd "$DIRETORIO_SITE"

# 5. Clonar ou atualizar código do GitHub
if [ -d ".git" ]; then
    echo "-> Repositório já existe. Atualizando código (git pull)..."
    git checkout main
    git pull origin main
else
    echo "-> Clonando repositório pela primeira vez..."
    git clone "$REPO_URL" .
fi

# 5. Parar containers antigos e rodar os novos
echo "-> Subindo a aplicação com Docker Compose..."
# Remove versão antiga se existir
docker compose down || true
# Constrói a nova imagem e sobe o container em background (na porta 80)
docker compose up -d --build

echo "==========================================="
echo "--- Implantação com Docker concluída com sucesso! ---"
echo "Acesse seu PDV pelo IP atual: http://$IP_DA_VPS"
echo "Ou pelo domínio (se já propagado): http://$DOMINIO"
echo "==========================================="
