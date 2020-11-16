from rest_framework.serializers import ModelSerializer

from lab.models import *


class ExeStageSerializer(ModelSerializer):
    class Meta:
        model = ExeStage
        fields = '__all__'


class ExeExperimentsSerializer(ModelSerializer):
    class Meta:
        model = ExeExperiment
        fields = '__all__'


class ExeParagraphSerializer(ModelSerializer):
    class Meta:
        model = ExeParagraph
        fields = '__all__'


class ExeSubStageSerializer(ModelSerializer):
    class Meta:
        model = ExeSubStage
        fields = '__all__'


class SamplesSerializer(ModelSerializer):
    class Meta:
        model = Samples
        fields = '__all__'


class ExeEquipmentSerializer(ModelSerializer):
    class Meta:
        model = ExeEquipment
        fields = '__all__'


class ExeDishesSerializer(ModelSerializer):
    class Meta:
        model = ExeDishes
        fields = '__all__'


class ExeReagentsSerializer(ModelSerializer):
    class Meta:
        model = ExeReagents
        fields = '__all__'


class ExeProtectiveEquipmentSerializer(ModelSerializer):
    class Meta:
        model = ExeProtectiveEquipment
        fields = '__all__'


class ExeDocSerializer(ModelSerializer):
    class Meta:
        model = ExeDoc
        fields = '__all__'


class ExeParametersSerializer(ModelSerializer):
    class Meta:
        model = ExeParameter
        fields = '__all__'


class ExeCalcParametersSerializer(ModelSerializer):
    class Meta:
        model = ExeCalcParameter
        fields = '__all__'


class ExeCriterionsSerializer(ModelSerializer):
    class Meta:
        model = ExeCriterion
        fields = '__all__'


class ExeReplaySerializer(ModelSerializer):
    class Meta:
        model = ExeReplay
        fields = '__all__'