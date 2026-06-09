from django.core.management.base import BaseCommand
from core.models import Sala, Equipamento


class Command(BaseCommand):
    help = "Cadastra/atualiza salas do Complexo e cria equipamentos padrão"

    def handle(self, *args, **options):
        salas = [
            {"codigo": "01", "x": 25, "y": 66, "w": 6.5, "h": 6},
            {"codigo": "02", "x": 31.5, "y": 66, "w": 6.5, "h": 6},
            {"codigo": "03", "x": 25, "y": 59, "w": 6.5, "h": 6},
            {"codigo": "04", "x": 31.5, "y": 59, "w": 6.5, "h": 6},
            {"codigo": "05", "x": 25, "y": 52, "w": 6.5, "h": 6},
            {"codigo": "06", "x": 31.5, "y": 52, "w": 6.5, "h": 6},
            {"codigo": "07", "x": 25, "y": 45, "w": 6.5, "h": 6},
            {"codigo": "08", "x": 31.5, "y": 45, "w": 6.5, "h": 6},
            {"codigo": "09", "x": 25, "y": 38, "w": 6.5, "h": 6},
            {"codigo": "10", "x": 31.5, "y": 38, "w": 6.5, "h": 6},
            {"codigo": "11", "x": 25, "y": 31, "w": 6.5, "h": 6},
            {"codigo": "12", "x": 31.5, "y": 31, "w": 6.5, "h": 6},
            {"codigo": "13", "x": 47, "y": 7, "w": 22, "h": 13},
            {"codigo": "14", "x": 47, "y": 21, "w": 22, "h": 8},
            {"codigo": "15", "x": 47, "y": 30, "w": 22, "h": 10},
            {"codigo": "16", "x": 75, "y": 34, "w": 14, "h": 12},
            {"codigo": "17", "x": 75, "y": 47, "w": 14, "h": 10},
            {"codigo": "18", "x": 75, "y": 58, "w": 14, "h": 10},
            {"codigo": "CAMARIM", "x": 25, "y": 77, "w": 26, "h": 10},
            {"codigo": "PALCO", "x": 52, "y": 77, "w": 14, "h": 10},
        ]

        criadas = 0
        atualizadas = 0
        equipamentos_criados = 0
        equipamentos_atualizados = 0

        contador_lamp = 1
        contador_ar = 1

        for item in salas:
            codigo_sala = item["codigo"]

            defaults = {
                "predio": "COMPLEXO",
                "andar": "Térreo",
                "bloco": "Complexo",
                "descricao": f"Sala {codigo_sala} - Complexo",
                "planta_x": item["x"],
                "planta_y": item["y"],
                "planta_largura": item["w"],
                "planta_altura": item["h"],
            }

            sala, created = Sala.objects.update_or_create(
                codigo_sala=codigo_sala,
                defaults=defaults,
            )

            if created:
                criadas += 1
                self.stdout.write(self.style.SUCCESS(f"Sala criada: {sala.codigo_sala}"))
            else:
                atualizadas += 1
                self.stdout.write(self.style.WARNING(f"Sala atualizada: {sala.codigo_sala}"))

            equipamentos_padrao = [
                {
                    "patrimonio": f"LAMP-{contador_lamp:03d}",
                    "tipo": "LUMINARIA",
                    "posicao_x": 35,
                    "posicao_y": 45,
                },
                {
                    "patrimonio": f"LAMP-{contador_lamp + 1:03d}",
                    "tipo": "LUMINARIA",
                    "posicao_x": 65,
                    "posicao_y": 45,
                },
                {
                    "patrimonio": f"AR-{contador_ar:03d}",
                    "tipo": "AR_CONDICIONADO",
                    "posicao_x": 50,
                    "posicao_y": 18,
                },
            ]

            contador_lamp += 2
            contador_ar += 1

            for equipamento_data in equipamentos_padrao:
                equipamento, equipamento_created = Equipamento.objects.update_or_create(
                    patrimonio=equipamento_data["patrimonio"],
                    defaults={
                        "sala": sala,
                        "tipo": equipamento_data["tipo"],
                        "status_atual": "OPERANDO",
                        "posicao_x": equipamento_data["posicao_x"],
                        "posicao_y": equipamento_data["posicao_y"],
                    },
                )

                if equipamento_created:
                    equipamentos_criados += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"  Equipamento criado: {equipamento.patrimonio}"
                        )
                    )
                else:
                    equipamentos_atualizados += 1
                    self.stdout.write(
                        self.style.WARNING(
                            f"  Equipamento atualizado: {equipamento.patrimonio}"
                        )
                    )

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("Processo finalizado."))
        self.stdout.write(f"Salas criadas: {criadas}")
        self.stdout.write(f"Salas atualizadas: {atualizadas}")
        self.stdout.write(f"Equipamentos criados: {equipamentos_criados}")
        self.stdout.write(f"Equipamentos atualizados: {equipamentos_atualizados}")