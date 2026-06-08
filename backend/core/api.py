from typing import List, Optional

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from ninja import NinjaAPI, Schema
from ninja.security import HttpBearer

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from math import radians, sin, cos, sqrt, atan2
from .models import (
    Sala,
    Equipamento,
    Chamado,
    HistoricoManutencao,
    PerimetroGPS,
    VerificacaoGPS,
)


api = NinjaAPI(title="Conserta Aí API")

def calcular_distancia_metros(lat1, lon1, lat2, lon2):
    raio_terra = 6371000

    lat1_rad = radians(lat1)
    lon1_rad = radians(lon1)
    lat2_rad = radians(lat2)
    lon2_rad = radians(lon2)

    delta_lat = lat2_rad - lat1_rad
    delta_lon = lon2_rad - lon1_rad

    a = (
        sin(delta_lat / 2) ** 2
        + cos(lat1_rad) * cos(lat2_rad) * sin(delta_lon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return raio_terra * c


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

def usuario_eh_tecnico(user):
    return user.is_staff or user.groups.filter(name="Tecnico").exists()
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
    is_staff: bool
    is_tecnico: bool


class SalaSchema(Schema):
    id: int
    predio: str
    codigo_sala: str
    bloco: str
    andar: str
    descricao: Optional[str] = None


class SalaCreateSchema(Schema):
    predio: str = "PREDIO_PRINCIPAL"
    codigo_sala: str
    bloco: str
    andar: str
    descricao: Optional[str] = None

class SalaResumoSchema(Schema):
    id: int
    predio: str
    codigo_sala: str
    bloco: str
    andar: str
    descricao: Optional[str] = None


class EquipamentoSchema(Schema):
    id: int
    sala_id: int
    sala: SalaResumoSchema
    patrimonio: str
    tipo: str
    status_atual: str
    posicao_x: float
    posicao_y: float


class EquipamentoCreateSchema(Schema):
    sala_id: int
    patrimonio: str
    tipo: str
    status_atual: str = "OPERANDO"
    posicao_x: float = 50
    posicao_y: float = 50


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
    latitude_centro: float
    longitude_centro: float
    raio_metros: float
    ativo: bool


class PerimetroGPSCreateSchema(Schema):
    nome: str
    descricao: Optional[str] = None
    latitude_centro: float
    longitude_centro: float
    raio_metros: float = 50
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


class VerificacaoGPSResponseSchema(Schema):
    id: int
    usuario_id: int
    perimetro_id: int
    latitude: float
    longitude: float
    dentro_perimetro: bool
    distancia_metros: float
    raio_metros: float


class ChamadoStatusUpdateSchema(Schema):
    status_chamado: str


class HistoricoChamadoCreateSchema(Schema):
    acao_realizada: str
    tecnico_responsavel: Optional[str] = None
    observacoes: Optional[str] = None


class AtualizarChamadoTecnicoSchema(Schema):
    status_chamado: str
    acao_realizada: str
    observacoes: Optional[str] = None





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
    user = request.auth

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "is_staff": user.is_staff,
        "is_tecnico": usuario_eh_tecnico(user),
    }


# =========================
# SALAS
# =========================

@api.get("/salas", response=List[SalaSchema])
def listar_salas(request):
    return Sala.objects.all()


@api.post("/salas", response=SalaSchema, auth=jwt_auth)
def criar_sala(request, payload: SalaCreateSchema):
    return Sala.objects.create(**payload.dict())

@api.get("/salas/predios", response=List[str])
def listar_predios(request):
    return list(
        Sala.objects.values_list("predio", flat=True)
        .distinct()
        .order_by("predio")
    )


@api.get("/salas/andares", response=List[str])
def listar_andares(request, predio: str):
    return list(
        Sala.objects.filter(predio=predio)
        .values_list("andar", flat=True)
        .distinct()
        .order_by("andar")
    )


@api.get("/salas/blocos", response=List[str])
def listar_blocos(request, predio: str, andar: str):
    return list(
        Sala.objects.filter(predio=predio, andar=andar)
        .values_list("bloco", flat=True)
        .distinct()
        .order_by("bloco")
    )


@api.get("/salas/por-local", response=List[SalaSchema])
def listar_salas_por_local(request, predio: str, andar: str, bloco: str):
    return Sala.objects.filter(
        predio=predio,
        andar=andar,
        bloco=bloco,
    ).order_by("codigo_sala")

@api.get("/salas/{sala_id}", response=SalaSchema)
def obter_sala(request, sala_id: int):
    return get_object_or_404(Sala, id=sala_id)


@api.get("/salas/{sala_id}/equipamentos", response=List[EquipamentoSchema])
def equipamentos_da_sala(request, sala_id: int):
    sala = get_object_or_404(Sala, id=sala_id)
    return sala.equipamentos.select_related("sala").all()


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
    return get_object_or_404(
        Equipamento.objects.select_related("sala"),
        id=equipamento_id
    )


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


@api.post(
    "/verificar-gps",
    response=VerificacaoGPSResponseSchema,
    auth=jwt_auth
)
def registrar_verificacao_gps(
    request,
    payload: VerificacaoGPSCreateSchema
):
    perimetro = get_object_or_404(
        PerimetroGPS,
        id=payload.perimetro_id,
        ativo=True
    )

    distancia = calcular_distancia_metros(
        payload.latitude,
        payload.longitude,
        perimetro.latitude_centro,
        perimetro.longitude_centro,
    )

    dentro = distancia <= perimetro.raio_metros

    verificacao = VerificacaoGPS.objects.create(
        usuario=request.auth,
        perimetro=perimetro,
        latitude=payload.latitude,
        longitude=payload.longitude,
        dentro_perimetro=dentro,
    )

    verificacao.distancia_metros = round(distancia, 2)
    verificacao.raio_metros = perimetro.raio_metros

    return verificacao

@api.get("/meus-chamados", response=List[ChamadoSchema], auth=jwt_auth)
def meus_chamados(request):
    return Chamado.objects.filter(usuario=request.auth).order_by("-data_hora_abertura")


@api.put(
    "/chamados/{chamado_id}/status",
    response={200: ChamadoSchema, 400: dict, 403: dict},
    auth=jwt_auth,
)
def atualizar_status_chamado(
    request,
    chamado_id: int,
    payload: ChamadoStatusUpdateSchema,
):
    chamado = get_object_or_404(Chamado, id=chamado_id)
    if not usuario_eh_tecnico(request.auth):
        return 403, {"erro": "Apenas técnicos podem alterar o status do chamado."}
    status_validos = [
        "ABERTO",
        "EM_ANDAMENTO",
        "CONCLUIDO",
        "CANCELADO",
    ]

    if payload.status_chamado not in status_validos:
        return 400, {"erro": "Status inválido."}

    chamado.status_chamado = payload.status_chamado

    if payload.status_chamado == "CONCLUIDO":
        from django.utils import timezone
        chamado.data_hora_fechamento = timezone.now()
        chamado.equipamento.status_atual = "OPERANDO"
        chamado.equipamento.save()

    elif payload.status_chamado == "EM_ANDAMENTO":
        chamado.equipamento.status_atual = "MANUTENCAO"
        chamado.equipamento.save()

    elif payload.status_chamado == "ABERTO":
        chamado.equipamento.status_atual = "DEFEITO"
        chamado.equipamento.save()

    chamado.save()

    HistoricoManutencao.objects.create(
        chamado=chamado,
        acao_realizada=f"Status alterado para {payload.status_chamado}",
        tecnico_responsavel=request.auth.get_full_name() or request.auth.username,
    )

    return 200, chamado


@api.post(
    "/chamados/{chamado_id}/historico",
    response={201: HistoricoSchema, 403: dict},
    auth=jwt_auth,
)
def adicionar_historico_chamado(
    request,
    chamado_id: int,
    payload: HistoricoChamadoCreateSchema,
):
    chamado = get_object_or_404(Chamado, id=chamado_id)
    if not usuario_eh_tecnico(request.auth):
        return 403, {"erro": "Apenas técnicos podem adicionar histórico."}
    historico = HistoricoManutencao.objects.create(
        chamado=chamado,
        acao_realizada=payload.acao_realizada,
        tecnico_responsavel=payload.tecnico_responsavel
        or request.auth.get_full_name()
        or request.auth.username,
        observacoes=payload.observacoes,
    )

    return historico

@api.get(
    "/tecnico/chamados",
    response={200: List[ChamadoSchema], 403: dict},
    auth=jwt_auth,
)
def listar_chamados_tecnico(request):
    if not usuario_eh_tecnico(request.auth):
        return 403, {"erro": "Apenas técnicos podem acessar todos os chamados."}

    return 200, Chamado.objects.all().order_by("-data_hora_abertura")

@api.post(
    "/chamados/{chamado_id}/atualizar-tecnico",
    response={200: ChamadoSchema, 400: dict, 403: dict},
    auth=jwt_auth,
)
def atualizar_chamado_tecnico(request, chamado_id: int, payload: AtualizarChamadoTecnicoSchema):
    chamado = get_object_or_404(Chamado, id=chamado_id)

    if not usuario_eh_tecnico(request.auth):
        return 403, {"erro": "Apenas técnicos podem atualizar chamados."}

    status_validos = [
        "ABERTO",
        "EM_ANDAMENTO",
        "CONCLUIDO",
        "CANCELADO",
    ]

    if payload.status_chamado not in status_validos:
        return 400, {"erro": "Status inválido."}

    if not payload.acao_realizada.strip():
        return 400, {"erro": "Informe a ação realizada."}

    chamado.status_chamado = payload.status_chamado

    if payload.status_chamado == "CONCLUIDO":
        from django.utils import timezone
        chamado.data_hora_fechamento = timezone.now()
        chamado.equipamento.status_atual = "OPERANDO"
        chamado.equipamento.save()

    elif payload.status_chamado == "EM_ANDAMENTO":
        chamado.equipamento.status_atual = "MANUTENCAO"
        chamado.equipamento.save()

    elif payload.status_chamado == "ABERTO":
        chamado.equipamento.status_atual = "DEFEITO"
        chamado.equipamento.save()

    elif payload.status_chamado == "CANCELADO":
        chamado.equipamento.status_atual = "OPERANDO"
        chamado.equipamento.save()

    chamado.save()

    HistoricoManutencao.objects.create(
        chamado=chamado,
        acao_realizada=payload.acao_realizada,
        tecnico_responsavel=request.auth.get_full_name() or request.auth.username,
        observacoes=payload.observacoes,
    )

    return 200, chamado

@api.get(
    "/equipamentos/{equipamento_id}/chamados",
    response=List[ChamadoSchema],
    auth=jwt_auth,
)
def chamados_do_equipamento(request, equipamento_id: int):
    equipamento = get_object_or_404(Equipamento, id=equipamento_id)

    return equipamento.chamados.all().order_by("-data_hora_abertura")