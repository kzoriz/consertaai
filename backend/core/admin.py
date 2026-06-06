from django.contrib import admin
from .models import (
    Sala,
    Equipamento,
    Chamado,
    HistoricoManutencao,
    PerimetroGPS,
    VerificacaoGPS,
)


admin.site.register(Sala)
admin.site.register(Equipamento)
admin.site.register(Chamado)
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