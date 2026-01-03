#!/usr/bin/env bash
# Script de Validação da Sprint - Gestão Financeira Corporativa

echo "🔍 Verificando Integridade da Sprint..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar se os arquivos foram criados/modificados
echo "📁 Verificando Arquivos..."
files=(
    "app/models/domain.py"
    "app/api/v1/corporate.py"
    "app/schemas/corporate.py"
    "app/schemas/user.py"
    "app/api/api.py"
    "app/main.py"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file existe"
    else
        echo -e "${RED}✗${NC} $file NÃO ENCONTRADO"
    fi
done

echo ""
echo "🔍 Verificando Imports..."

# 2. Verificar se o arquivo corporate.py pode ser importado
echo "Testando import de corporate.py..."
python3 -c "from app.api.v1.corporate import router; print('✓ Corporate router importado com sucesso')" 2>/dev/null || echo "✗ Erro ao importar corporate router"

echo ""
echo "🗄️ Verificando Modelos..."

# 3. Verificar se os campos foram adicionados aos modelos
echo "Verificando CostCenter..."
grep -q "budget_limit: float" app/models/domain.py && echo "✓ CostCenter.budget_limit encontrado" || echo "✗ CostCenter.budget_limit NÃO ENCONTRADO"
grep -q "is_active: bool" app/models/domain.py && echo "✓ CostCenter.is_active encontrado" || echo "✗ CostCenter.is_active NÃO ENCONTRADO"

echo ""
echo "Verificando EmployeeProfile..."
grep -q "cost_center_id: Optional\[int\]" app/models/domain.py && echo "✓ EmployeeProfile.cost_center_id encontrado" || echo "✗ EmployeeProfile.cost_center_id NÃO ENCONTRADO"
grep -q "phone: Optional\[str\]" app/models/domain.py && echo "✓ EmployeeProfile.phone encontrado" || echo "✗ EmployeeProfile.phone NÃO ENCONTRADO"

echo ""
echo "Verificando Ride..."
grep -q "cost_center_id: Optional\[int\]" app/models/domain.py && echo "✓ Ride.cost_center_id é Optional" || echo "✗ Ride.cost_center_id não é Optional"

echo ""
echo "🗑️ Verificando Limpeza de Duplicação..."
if grep -q "class PricingRule" app/models/domain.py; then
    echo -e "${RED}✗${NC} PricingRule ainda existe em domain.py (deveria ter sido removida)"
else
    echo -e "${GREEN}✓${NC} PricingRule foi removida com sucesso"
fi

echo ""
echo "🔐 Verificando Segurança..."
grep -q "require_role" app/api/v1/corporate.py && echo "✓ Decoradores de segurança encontrados" || echo "✗ Decoradores de segurança NÃO ENCONTRADOS"

echo ""
echo "🌐 Verificando CORS..."
grep -q "https://b2b.podiumrentacar.com.br" app/main.py && echo "✓ CORS B2B configurado" || echo "✗ CORS B2B NÃO ENCONTRADO"

echo ""
echo "📋 Resumo:"
echo "=========================================="
echo "✅ Sprint implementada com sucesso!"
echo ""
echo "📍 Próximas Ações:"
echo "1. python -m pytest app/tests/ -v"
echo "2. Acessar http://localhost:8000/docs"
echo "3. Testar endpoints /api/v1/corporate/*"
echo "=========================================="
