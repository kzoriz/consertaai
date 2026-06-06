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
admin.site.register(PerimetroGPS)
admin.site.register(VerificacaoGPS)