from django.db import models
from django.contrib.auth.models import User


class Sala(models.Model):
    PREDIO_CHOICES = [
        ("PREDIO_PRINCIPAL", "Prédio Principal"),
        ("COMPLEXO", "Complexo"),
    ]
    predio = models.CharField(
        max_length=50,
        choices=PREDIO_CHOICES,
        default="PREDIO_PRINCIPAL",
    )
    codigo_sala = models.CharField(max_length=50, unique=True)
    bloco = models.CharField(
        max_length=100,
        help_text="Ex: Bloco A, Informática, Auditório, Projeto Educa"
    )
    andar = models.CharField(
        max_length=50,
        help_text="Ex: Térreo, 1º Andar, 2º Andar, 3º Andar"
    )
    planta_x = models.FloatField(default=0)
    planta_y = models.FloatField(default=0)
    planta_largura = models.FloatField(default=12)
    planta_altura = models.FloatField(default=8)
    descricao = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.codigo_sala} - {self.get_predio_display()}"


class Equipamento(models.Model):
    TIPO_CHOICES = [
        ("LUMINARIA", "Luminária"),
        ("AR_CONDICIONADO", "Ar-condicionado"),
    ]

    STATUS_CHOICES = [
        ("OPERANDO", "Operando"),
        ("DEFEITO", "Defeito"),
        ("MANUTENCAO", "Manutenção"),
    ]

    sala = models.ForeignKey(Sala, on_delete=models.CASCADE, related_name="equipamentos")
    patrimonio = models.CharField(max_length=100, unique=True)
    tipo = models.CharField(max_length=30, choices=TIPO_CHOICES)
    status_atual = models.CharField(max_length=30, choices=STATUS_CHOICES, default="OPERANDO")
    posicao_x = models.FloatField(default=50)
    posicao_y = models.FloatField(default=50)
    data_cadastro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo} - {self.patrimonio}"


class Chamado(models.Model):
    STATUS_CHOICES = [
        ("ABERTO", "Aberto"),
        ("EM_ANDAMENTO", "Em andamento"),
        ("CONCLUIDO", "Concluído"),
        ("CANCELADO", "Cancelado"),
    ]
    PRIORIDADE_CHOICES = [
        ("BAIXA", "Baixa"),
        ("MEDIA", "Média"),
        ("ALTA", "Alta"),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chamados")
    equipamento = models.ForeignKey(Equipamento, on_delete=models.CASCADE, related_name="chamados")
    descricao_problema = models.TextField()
    prioridade = models.CharField(
        max_length=20,
        choices=PRIORIDADE_CHOICES,
        default="MEDIA",
    )
    status_chamado = models.CharField(max_length=30, choices=STATUS_CHOICES, default="ABERTO")
    data_hora_abertura = models.DateTimeField(auto_now_add=True)
    data_hora_fechamento = models.DateTimeField(blank=True, null=True)
    observacoes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Chamado #{self.id} - {self.equipamento}"


class HistoricoManutencao(models.Model):
    chamado = models.ForeignKey(Chamado, on_delete=models.CASCADE, related_name="historicos")
    data_hora = models.DateTimeField(auto_now_add=True)
    acao_realizada = models.TextField()
    tecnico_responsavel = models.CharField(max_length=150, blank=True, null=True)
    observacoes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Histórico do chamado #{self.chamado.id}"


class PerimetroGPS(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True, null=True)

    latitude_centro = models.FloatField()
    longitude_centro = models.FloatField()
    raio_metros = models.FloatField(default=50)

    ativo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nome} - {self.raio_metros}m"


class VerificacaoGPS(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="verificacoes_gps")
    perimetro = models.ForeignKey(PerimetroGPS, on_delete=models.CASCADE, related_name="verificacoes")
    latitude = models.FloatField()
    longitude = models.FloatField()
    dentro_perimetro = models.BooleanField(default=False)
    data_hora = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.username} - {'Dentro' if self.dentro_perimetro else 'Fora'}"