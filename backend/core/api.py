from typing import List, Optional

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from ninja import NinjaAPI, Schema
from ninja.security import HttpBearer

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    Sala,
    Equipamento,
    Chamado,
    HistoricoManutencao,
    PerimetroGPS,
    VerificacaoGPS,
)


api = NinjaAPI(title="Conserta Aí API")


# =========================
# AUTENTICAÇÃO JWT
# =========================

class JWTAuth(HttpBearer):
    def authenticate(self, request, token):
        try:
            jwt_auth = JWTAuthentication()
            validated_token = jwt_auth.get_validated_token(token)
            user = jwt_auth.get_user(validated_token)
            return user
        except Exception:
            return None


jwt_auth = JWTAuth()


# =========================
# SCHEMAS
# =========================

class CadastroSchema(Schema):
    username: str
    email: str
    password: str
    first_name: str = ""


class LoginSchema(Schema):
    username: str
    password: str


class TokenSchema(Schema):
    access: str
    refresh: str
    username: str
    user_id: int


class UsuarioSchema(Schema):
    id: int
    username: str
    email: str
    first_name: str


class SalaSchema(Schema):
    id: int
    codigo_sala: str
    bloco: str
    andar: str
    descricao: Optional[str] = None


class SalaCreateSchema(Schema):
    codigo_sala: str
    bloco: str
    andar: str
    descricao: Optional[str] = None


class EquipamentoSchema(Schema):
    id: int
    sala_id: int
    patrimonio: str
    tipo: str
    status_atual: str


class EquipamentoCreateSchema(Schema):
    sala_id: int
    patrimonio: str
    tipo: str
    status_atual: str = "OPERANDO"


class EquipamentoStatusSchema(Schema):
    status_atual: str


class ChamadoSchema(Schema):
    id: int
    usuario_id: int
    equipamento_id: int
    descricao_problema: str
    status_chamado: str


class ChamadoCreateSchema(Schema):
    equipamento_id: int
    descricao_problema: str


class HistoricoSchema(Schema):
    id: int
    chamado_id: int
    acao_realizada: str
    tecnico_responsavel: Optional[str] = None
    observacoes: Optional[str] = None


class HistoricoCreateSchema(Schema):
    chamado_id: int
    acao_realizada: str
    tecnico_responsavel: Optional[str] = None
    observacoes: Optional[str] = None


class PerimetroGPSSchema(Schema):
    id: int
    nome: str
    descricao: Optional[str] = None
    coordenadas: list
    ativo: bool


class PerimetroGPSCreateSchema(Schema):
    nome: str
    descricao: Optional[str] = None
    coordenadas: list
    ativo: bool = True


class VerificacaoGPSSchema(Schema):
    id: int
    usuario_id: int
    perimetro_id: int
    latitude: float
    longitude: float
    dentro_perimetro: bool


class VerificacaoGPSCreateSchema(Schema):
    perimetro_id: int
    latitude: float
    longitude: float
    dentro_perimetro: bool


# =========================
# LOGIN / CADASTRO
# =========================

@api.post("/auth/cadastro", response={201: TokenSchema, 400: dict})
def cadastrar_usuario(request, payload: CadastroSchema):
    if User.objects.filter(username=payload.username).exists():
        return 400, {"erro": "Nome de usuário já existe."}

    if User.objects.filter(email=payload.email).exists():
        return 400, {"erro": "E-mail já cadastrado."}

    user = User.objects.create_user(
        username=payload.username,
        email=payload.email,
        password=payload.password,
        first_name=payload.first_name,
    )

    refresh = RefreshToken.for_user(user)

    return 201, {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "username": user.username,
        "user_id": user.id,
    }


@api.post("/auth/login", response={200: TokenSchema, 401: dict})
def login_usuario(request, payload: LoginSchema):
    user = authenticate(
        username=payload.username,
        password=payload.password,
    )

    if user is None:
        return 401, {"erro": "Usuário ou senha inválidos."}

    refresh = RefreshToken.for_user(user)

    return 200, {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "username": user.username,
        "user_id": user.id,
    }


@api.get("/auth/me", response=UsuarioSchema, auth=jwt_auth)
def meu_perfil(request):
    return request.auth


# =========================
# SALAS
# =========================

@api.get("/salas", response=List[SalaSchema])
def listar_salas(request):
    return Sala.objects.all()


@api.post("/salas", response=SalaSchema, auth=jwt_auth)
def criar_sala(request, payload: SalaCreateSchema):
    return Sala.objects.create(**payload.dict())


@api.get("/salas/{sala_id}", response=SalaSchema)
def obter_sala(request, sala_id: int):
    return get_object_or_404(Sala, id=sala_id)


@api.get("/salas/{sala_id}/equipamentos", response=List[EquipamentoSchema])
def equipamentos_da_sala(request, sala_id: int):
    sala = get_object_or_404(Sala, id=sala_id)
    return sala.equipamentos.all()


# =========================
# EQUIPAMENTOS
# =========================

@api.get("/equipamentos", response=List[EquipamentoSchema])
def listar_equipamentos(request):
    return Equipamento.objects.all()


@api.post("/equipamentos", response=EquipamentoSchema, auth=jwt_auth)
def criar_equipamento(request, payload: EquipamentoCreateSchema):
    return Equipamento.objects.create(**payload.dict())


@api.get("/equipamentos/{equipamento_id}", response=EquipamentoSchema)
def obter_equipamento(request, equipamento_id: int):
    return get_object_or_404(Equipamento, id=equipamento_id)


@api.put(
    "/equipamentos/{equipamento_id}/status",
    response=EquipamentoSchema,
    auth=jwt_auth,
)
def atualizar_status_equipamento(
    request,
    equipamento_id: int,
    payload: EquipamentoStatusSchema,
):
    equipamento = get_object_or_404(Equipamento, id=equipamento_id)
    equipamento.status_atual = payload.status_atual
    equipamento.save()
    return equipamento


# =========================
# CHAMADOS
# =========================

@api.get("/chamados", response=List[ChamadoSchema], auth=jwt_auth)
def listar_chamados(request):
    return Chamado.objects.all()


@api.post("/chamados", response=ChamadoSchema, auth=jwt_auth)
def criar_chamado(request, payload: ChamadoCreateSchema):
    chamado = Chamado.objects.create(
        usuario=request.auth,
        equipamento_id=payload.equipamento_id,
        descricao_problema=payload.descricao_problema,
    )

    chamado.equipamento.status_atual = "DEFEITO"
    chamado.equipamento.save()

    return chamado


@api.get("/chamados/{chamado_id}", response=ChamadoSchema, auth=jwt_auth)
def obter_chamado(request, chamado_id: int):
    return get_object_or_404(Chamado, id=chamado_id)


@api.get(
    "/chamados/{chamado_id}/historico",
    response=List[HistoricoSchema],
    auth=jwt_auth,
)
def historico_do_chamado(request, chamado_id: int):
    chamado = get_object_or_404(Chamado, id=chamado_id)
    return chamado.historicos.all()


# =========================
# HISTÓRICO DE MANUTENÇÃO
# =========================

@api.post("/historicos", response=HistoricoSchema, auth=jwt_auth)
def criar_historico(request, payload: HistoricoCreateSchema):
    return HistoricoManutencao.objects.create(**payload.dict())


# =========================
# GPS
# =========================

@api.get("/perimetros", response=List[PerimetroGPSSchema])
def listar_perimetros(request):
    return PerimetroGPS.objects.filter(ativo=True)


@api.post("/perimetros", response=PerimetroGPSSchema, auth=jwt_auth)
def criar_perimetro(request, payload: PerimetroGPSCreateSchema):
    return PerimetroGPS.objects.create(**payload.dict())


@api.post("/verificar-gps", response=VerificacaoGPSSchema, auth=jwt_auth)
def registrar_verificacao_gps(request, payload: VerificacaoGPSCreateSchema):
    return VerificacaoGPS.objects.create(
        usuario=request.auth,
        perimetro_id=payload.perimetro_id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        dentro_perimetro=payload.dentro_perimetro,
    )