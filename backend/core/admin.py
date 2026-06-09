from django.contrib import admin
from .models import (
    Sala,
    Equipamento,
    Chamado,
    HistoricoManutencao,
    PerimetroGPS,
    VerificacaoGPS,
)

admin.site.register(HistoricoManutencao)
admin.site.register(VerificacaoGPS)

@admin.register(PerimetroGPS)
class PerimetroGPSAdmin(admin.ModelAdmin):
    list_display = (
        "nome",
        "latitude_centro",
        "longitude_centro",
        "raio_metros",
        "ativo",
    )
    list_filter = ("ativo",)
    search_fields = ("nome",)

@admin.register(Equipamento)
class EquipamentoAdmin(admin.ModelAdmin):
    list_display = (
        "patrimonio",
        "tipo",
        "sala",
        "status_atual",
        "posicao_x",
        "posicao_y",
    )
    list_filter = ("tipo", "status_atual", "sala")
    search_fields = ("patrimonio",)

@admin.register(Sala)
class SalaAdmin(admin.ModelAdmin):
    list_display = (
        "codigo_sala",
        "predio",
        "andar",
        "bloco",
        "planta_x",
        "planta_y",
        "planta_largura",
        "planta_altura",
    )
    list_filter = ("predio", "andar", "bloco")
    search_fields = ("codigo_sala", "descricao", "bloco")

@admin.register(Chamado)
class ChamadoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "usuario",
        "equipamento",
        "status_chamado",
        "prioridade",
        "data_hora_abertura",
    )
    list_filter = (
        "status_chamado",
        "prioridade",
        "data_hora_abertura",
    )
    search_fields = (
        "descricao_problema",
        "equipamento__patrimonio",
        "usuario__username",
    )