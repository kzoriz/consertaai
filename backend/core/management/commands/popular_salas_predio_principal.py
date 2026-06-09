from django.core.management.base import BaseCommand

from core.models import Sala, Equipamento


class Command(BaseCommand):
    help = "Cadastra/atualiza salas do Prédio Principal e cria equipamentos padrão"

    def handle(self, *args, **options):
        salas = [
            # Piso 1
            {"codigo": "19", "andar": "Piso 1"},
            {"codigo": "20", "andar": "Piso 1"},
            {"codigo": "21", "andar": "Piso 1"},
            {"codigo": "22", "andar": "Piso 1"},
            {"codigo": "23", "andar": "Piso 1"},
            {"codigo": "24", "andar": "Piso 1"},
            {"codigo": "25", "andar": "Piso 1"},
            {"codigo": "26", "andar": "Piso 1"},
            {"codigo": "27", "andar": "Piso 1"},
            {"codigo": "28", "andar": "Piso 1"},
            {"codigo": "29", "andar": "Piso 1"},

            # Piso 2
            {"codigo": "30", "andar": "Piso 2"},
            {"codigo": "31", "andar": "Piso 2"},
            {"codigo": "32", "andar": "Piso 2"},
            {"codigo": "33", "andar": "Piso 2"},
            {"codigo": "34", "andar": "Piso 2"},
            {"codigo": "35", "andar": "Piso 2"},
            {"codigo": "36", "andar": "Piso 2"},
            {"codigo": "37", "andar": "Piso 2"},
            {"codigo": "38", "andar": "Piso 2"},
            {"codigo": "39", "andar": "Piso 2"},
            {"codigo": "40", "andar": "Piso 2"},
        ]

        luminarias_posicoes = [
            {"x": 20, "y": 25},
            {"x": 50, "y": 25},
            {"x": 80, "y": 25},
            {"x": 20, "y": 70},
            {"x": 50, "y": 70},
            {"x": 80, "y": 70},
        ]

        ar_condicionados_posicoes = [
            {"x": 25, "y": 8},
            {"x": 75, "y": 8},
        ]

        salas_criadas = 0
        salas_atualizadas = 0
        equipamentos_criados = 0
        equipamentos_atualizados = 0

        contador_luminaria = 121
        contador_ar_condicionado = 41

        for item in salas:
            codigo_sala = item["codigo"]

            sala, sala_criada = Sala.objects.update_or_create(
                codigo_sala=codigo_sala,
                defaults={
                    "predio": "PREDIO_PRINCIPAL",
                    "andar": item["andar"],
                    "bloco": "Prédio Principal",
                    "descricao": f"Sala {codigo_sala} - Prédio Principal",
                    "planta_x": 0,
                    "planta_y": 0,
                    "planta_largura": 0,
                    "planta_altura": 0,
                },
            )

            if sala_criada:
                salas_criadas += 1
                self.stdout.write(
                    self.style.SUCCESS(f"Sala criada: {sala.codigo_sala}")
                )
            else:
                salas_atualizadas += 1
                self.stdout.write(
                    self.style.WARNING(f"Sala atualizada: {sala.codigo_sala}")
                )

            equipamentos_padrao = []

            for posicao in luminarias_posicoes:
                equipamentos_padrao.append(
                    {
                        "patrimonio": f"LAMP-{contador_luminaria:03d}",
                        "tipo": "LUMINARIA",
                        "posicao_x": posicao["x"],
                        "posicao_y": posicao["y"],
                    }
                )
                contador_luminaria += 1

            for posicao in ar_condicionados_posicoes:
                equipamentos_padrao.append(
                    {
                        "patrimonio": f"AR-{contador_ar_condicionado:03d}",
                        "tipo": "AR_CONDICIONADO",
                        "posicao_x": posicao["x"],
                        "posicao_y": posicao["y"],
                    }
                )
                contador_ar_condicionado += 1

            for equipamento_data in equipamentos_padrao:
                equipamento, equipamento_criado = Equipamento.objects.update_or_create(
                    patrimonio=equipamento_data["patrimonio"],
                    defaults={
                        "sala": sala,
                        "tipo": equipamento_data["tipo"],
                        "status_atual": "OPERANDO",
                        "posicao_x": equipamento_data["posicao_x"],
                        "posicao_y": equipamento_data["posicao_y"],
                    },
                )

                if equipamento_criado:
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
        self.stdout.write(f"Salas criadas: {salas_criadas}")
        self.stdout.write(f"Salas atualizadas: {salas_atualizadas}")
        self.stdout.write(f"Equipamentos criados: {equipamentos_criados}")
        self.stdout.write(f"Equipamentos atualizados: {equipamentos_atualizados}")