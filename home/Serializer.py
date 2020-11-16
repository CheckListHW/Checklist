from rest_framework.serializers import ModelSerializer

from home.models import *


class ExperimentSerializer(ModelSerializer):
    class Meta:
        model = Experiment
        fields = '__all__'


class StageSerializer(ModelSerializer):
    class Meta:
        model = Stage
        fields = '__all__'


class EquipmentsSerializer(ModelSerializer):
    class Meta:
        model = Equipment
        fields = '__all__'


class DishesSerializer(ModelSerializer):
    class Meta:
        model = Dishes
        fields = '__all__'


class ReagentsSerializer(ModelSerializer):
    class Meta:
        model = Reagents
        fields = '__all__'


class DocsSerializer(ModelSerializer):
    class Meta:
        model = Doc
        fields = '__all__'


class ProtectiveEquipmentSerializer(ModelSerializer):
    class Meta:
        model = ProtectiveEquipment
        fields = '__all__'


class SubStageSerializer(ModelSerializer):
    class Meta:
        model = SubStage
        fields = '__all__'


class ParagraphsSerializer(ModelSerializer):
    class Meta:
        model = Paragraph
        fields = '__all__'


class ParametersSerializer(ModelSerializer):
    class Meta:
        model = Parameter
        fields = '__all__'


class CalcParametersSerializer(ModelSerializer):
    class Meta:
        model = CalcParameter
        fields = '__all__'


class CriterionsSerializer(ModelSerializer):
    class Meta:
        model = Criterion
        fields = '__all__'


class ReplaySerializer(ModelSerializer):
    class Meta:
        model = Replay
        fields = '__all__'